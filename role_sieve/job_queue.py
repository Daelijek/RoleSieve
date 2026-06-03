import json
import logging
import os
import threading
import time
from typing import Any, Callable, Dict, List, Optional, Tuple
from uuid import uuid4

import requests

from role_sieve.client import VacancyRef, dedupe_vacancy_refs_preserve_order
from role_sieve.pipeline import collect_refs_auto, compute_summary_for_refs, export_refs_to_xlsx_bytes
from role_sieve.settings import max_export_vacancies

logger = logging.getLogger(__name__)

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
JOBS_DIR = os.path.join(PROJECT_ROOT, "jobs")
os.makedirs(JOBS_DIR, exist_ok=True)


def _job_status_path(job_id: str) -> str:
    return os.path.join(JOBS_DIR, f"{job_id}.json")


def _job_result_path(job_id: str) -> str:
    return os.path.join(JOBS_DIR, f"{job_id}.xlsx")


def _atomic_write_json(path: str, data: dict) -> None:
    tmp_path = f"{path}.tmp.{uuid4().hex}"
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    os.replace(tmp_path, path)


def _extract_run_meta(payload: Dict[str, Any]) -> Dict[str, Any]:
    """UI labels + query text for run history (no secrets)."""
    raw = payload.get("client_meta")
    meta: Dict[str, Any] = dict(raw) if isinstance(raw, dict) else {}
    queries = payload.get("queries") or []
    if queries and not meta.get("queryLabel"):
        first = str(queries[0]).strip()
        if first:
            meta["queryLabel"] = first
    if queries:
        meta["queries"] = queries
    return meta


def _write_status(
    job_id: str,
    *,
    status: str,
    kind: str,
    created_at: float,
    updated_at: Optional[float] = None,
    finished_at: Optional[float] = None,
    progress_done: Optional[int] = None,
    progress_total: Optional[int] = None,
    processed: Optional[int] = None,
    warnings_count: Optional[int] = None,
    errors_sample: Optional[List[str]] = None,
    summary: Optional[Dict[str, Any]] = None,
    error: Optional[str] = None,
    run_meta: Optional[Dict[str, Any]] = None,
) -> None:
    now = time.time()
    existing = _load_status(job_id)
    preserved_meta = run_meta if run_meta is not None else (existing or {}).get("run_meta")
    payload: Dict[str, Any] = {
        "job_id": job_id,
        "kind": kind,
        "status": status,
        "created_at": created_at,
        "updated_at": updated_at if updated_at is not None else now,
    }
    if preserved_meta:
        payload["run_meta"] = preserved_meta
    if finished_at is not None:
        payload["finished_at"] = finished_at
    if progress_done is not None:
        payload["progress_done"] = progress_done
    if progress_total is not None:
        payload["progress_total"] = progress_total
    if processed is not None:
        payload["processed"] = processed
    if warnings_count is not None:
        payload["warnings_count"] = warnings_count
    if errors_sample is not None:
        payload["errors_sample"] = errors_sample
    if summary is not None:
        payload["summary"] = summary
    if error is not None:
        payload["error"] = error

    _atomic_write_json(_job_status_path(job_id), payload)


def _load_status(job_id: str) -> Optional[Dict[str, Any]]:
    path = _job_status_path(job_id)
    if not os.path.isfile(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _collect_refs_from_search_payload(
    session: requests.Session,
    token: Optional[str],
    payload: Dict[str, Any],
) -> Tuple[List[VacancyRef], int]:
    queries: List[str] = payload["queries"]
    return collect_refs_auto(
        session=session,
        token=token,
        queries=queries,
        pages=int(payload["pages"]),
        per_page=int(payload["per_page"]),
        dedupe_vacancies=True,
        search_sleep_s=float(payload["search_sleep_s"]),
        employer_id=payload.get("employer_id"),
        area=payload.get("area"),
        experience=payload.get("experience"),
        period=payload.get("period"),
    )


def _finalize_xlsx_job(
    job_id: str,
    job_kind: str,
    created_at: float,
    data: bytes,
    processed: int,
    errors: List[str],
    summary: Dict[str, Any],
) -> None:
    result_path = _job_result_path(job_id)
    with open(result_path, "wb") as f:
        f.write(data)
    _write_status(
        job_id,
        status="succeeded",
        kind=job_kind,
        created_at=created_at,
        finished_at=time.time(),
        processed=processed,
        warnings_count=len(errors),
        errors_sample=errors[:10],
        summary=summary,
    )


def _run_summary_auto_job(
    job_id: str,
    job_kind: str,
    payload: Dict[str, Any],
    created_at: float,
    on_progress: Callable[[int, int], None],
) -> None:
    token = payload.get("token")
    session = requests.Session()
    refs, raw_id_hits = _collect_refs_from_search_payload(session, token, payload)

    if len(refs) > max_export_vacancies():
        raise ValueError(
            f"summary_auto job: {len(refs)} vacancies exceed max {max_export_vacancies()} "
            f"(raw hits: {raw_id_hits})"
        )

    _write_status(
        job_id,
        status="running",
        kind=job_kind,
        created_at=created_at,
        progress_done=0,
        progress_total=len(refs),
    )

    errors, summary = compute_summary_for_refs(
        refs=refs,
        session=session,
        token=token,
        kw_top_n=int(payload["kw_top_n"]),
        kw_max_ngram=int(payload["kw_max_ngram"]),
        sleep_s=float(payload["sleep_s"]),
        on_progress=on_progress,
    )

    summary["dedup"] = {
        "input_count": raw_id_hits,
        "unique_count": len(refs),
        "duplicates_removed": max(0, raw_id_hits - len(refs)),
    }

    _write_status(
        job_id,
        status="succeeded",
        kind=job_kind,
        created_at=created_at,
        finished_at=time.time(),
        processed=summary.get("processed"),
        warnings_count=len(errors),
        errors_sample=errors[:10],
        summary=summary,
    )


def _run_manual_job(
    job_id: str,
    job_kind: str,
    payload: Dict[str, Any],
    created_at: float,
    on_progress: Callable[[int, int], None],
) -> None:
    token = payload.get("token")
    ref_ids: List[str] = payload["ref_ids"]
    refs = [VacancyRef(vacancy_id=str(v).strip()) for v in ref_ids if str(v).strip()]
    refs, _skipped = dedupe_vacancy_refs_preserve_order(refs)
    if len(refs) > max_export_vacancies():
        raise ValueError(f"manual job: {len(refs)} vacancies exceed max {max_export_vacancies()}")

    data, processed, errors, summary = export_refs_to_xlsx_bytes(
        refs=refs,
        token=token,
        kw_top_n=int(payload["kw_top_n"]),
        kw_max_ngram=int(payload["kw_max_ngram"]),
        sleep_s=float(payload["sleep_s"]),
        on_progress=on_progress,
    )

    summary["dedup"] = {
        "input_count": payload.get("input_count"),
        "unique_count": len(refs),
        "duplicates_removed": payload.get("duplicates_removed"),
    }
    _finalize_xlsx_job(job_id, job_kind, created_at, data, processed, errors, summary)


def _run_auto_job(
    job_id: str,
    job_kind: str,
    payload: Dict[str, Any],
    created_at: float,
    on_progress: Callable[[int, int], None],
) -> None:
    token = payload.get("token")
    session = requests.Session()
    refs, raw_id_hits = _collect_refs_from_search_payload(session, token, payload)

    if len(refs) > max_export_vacancies():
        raise ValueError(
            f"auto job: {len(refs)} vacancies exceed max {max_export_vacancies()} "
            f"(raw hits: {raw_id_hits})"
        )

    data, processed, errors, summary = export_refs_to_xlsx_bytes(
        refs=refs,
        token=token,
        kw_top_n=int(payload["kw_top_n"]),
        kw_max_ngram=int(payload["kw_max_ngram"]),
        sleep_s=float(payload["sleep_s"]),
        on_progress=on_progress,
    )

    summary["dedup"] = {
        "input_count": raw_id_hits,
        "unique_count": len(refs),
        "duplicates_removed": max(0, raw_id_hits - len(refs)),
    }
    _finalize_xlsx_job(job_id, job_kind, created_at, data, processed, errors, summary)


_JOB_HANDLERS: Dict[str, Any] = {
    "summary_auto": _run_summary_auto_job,
    "manual": _run_manual_job,
    "auto": _run_auto_job,
}


def _run_export_job(job_id: str, job_kind: str, payload: Dict[str, Any]) -> None:
    created_at = time.time()
    _write_status(job_id, status="running", kind=job_kind, created_at=created_at, updated_at=created_at)

    # Use a mutable cell so the closure can update the timestamp without nonlocal.
    _last_progress_write: List[float] = [0.0]

    def on_progress(done: int, total: int) -> None:
        now = time.time()
        # Always write on first (done==0) and last (done==total) tick;
        # otherwise throttle to at most one write every 2 seconds.
        if done not in (0, total) and now - _last_progress_write[0] < 2.0:
            return
        _last_progress_write[0] = now
        _write_status(
            job_id,
            status="running",
            kind=job_kind,
            created_at=created_at,
            progress_done=done,
            progress_total=total,
        )

    try:
        handler = _JOB_HANDLERS.get(job_kind)
        if handler is None:
            raise ValueError(f"Unknown job_kind: {job_kind}")
        handler(job_id, job_kind, payload, created_at, on_progress)
    except Exception as e:
        _write_status(
            job_id,
            status="failed",
            kind=job_kind,
            created_at=created_at,
            finished_at=time.time(),
            error=str(e),
        )


def enqueue_export_job(job_kind: str, payload: Dict[str, Any]) -> str:
    job_id = uuid4().hex
    created_at = time.time()
    run_meta = _extract_run_meta(payload)
    _write_status(
        job_id,
        status="queued",
        kind=job_kind,
        created_at=created_at,
        updated_at=created_at,
        run_meta=run_meta,
    )

    try:
        import rq  # type: ignore  # noqa: F401
        import redis  # type: ignore  # noqa: F401

        redis_url = (
            os.environ.get("REDIS_URL")
            or os.environ.get("ROLESIEVE_REDIS_URL")
        )
        if redis_url:
            from redis import Redis  # type: ignore
            from rq import Queue  # type: ignore

            queue = Queue("rolesieve", connection=Redis.from_url(redis_url))
            queue.enqueue(
                _run_export_job,
                job_id,
                job_kind,
                payload,
            )
            return job_id
    except Exception as e:
        logger.info(
            "RQ/Redis unavailable or misconfigured; running job in-process thread (job_id=%s, kind=%s): %s",
            job_id,
            job_kind,
            e,
            exc_info=logger.isEnabledFor(logging.DEBUG),
        )

    t = threading.Thread(target=_run_export_job, args=(job_id, job_kind, payload), daemon=True)
    t.start()
    return job_id


def get_job_status(job_id: str) -> Optional[Dict[str, Any]]:
    return _load_status(job_id)


def get_job_result_path(job_id: str) -> str:
    path = _job_result_path(job_id)
    if not os.path.isfile(path):
        raise FileNotFoundError(path)
    return path


def list_jobs(
    *,
    limit: int = 40,
    kinds: Optional[List[str]] = None,
) -> List[Dict[str, Any]]:
    """List recent jobs newest-first (from jobs/*.json)."""
    limit = max(1, min(int(limit), 200))
    kinds_set = set(kinds) if kinds else None
    items: List[Dict[str, Any]] = []

    try:
        names = os.listdir(JOBS_DIR)
    except OSError:
        return []

    for name in names:
        if not name.endswith(".json"):
            continue
        job_id = name[: -len(".json")]
        st = _load_status(job_id)
        if not st:
            continue
        kind = st.get("kind")
        if kinds_set is not None and kind not in kinds_set:
            continue

        summary = st.get("summary") if isinstance(st.get("summary"), dict) else {}
        run_meta = st.get("run_meta") if isinstance(st.get("run_meta"), dict) else {}
        queries = run_meta.get("queries") or []
        query_label = run_meta.get("queryLabel")
        if not query_label and queries:
            query_label = str(queries[0])
        top_skills = summary.get("top_skills") if isinstance(summary.get("top_skills"), list) else []
        top_skill = None
        if top_skills and isinstance(top_skills[0], dict):
            top_skill = top_skills[0].get("name")

        items.append(
            {
                "job_id": job_id,
                "status": st.get("status"),
                "kind": kind,
                "created_at": st.get("created_at"),
                "finished_at": st.get("finished_at"),
                "run_meta": run_meta,
                "query_label": query_label or "—",
                "processed": summary.get("processed", st.get("processed")),
                "errors": summary.get("errors"),
                "top_skill": top_skill,
            }
        )

    items.sort(key=lambda row: float(row.get("created_at") or 0), reverse=True)
    return items[:limit]
