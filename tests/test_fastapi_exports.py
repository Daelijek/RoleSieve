import base64
import json
import os
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient


# Чтобы тесты не зависели от окружения пользователя:
os.environ.pop("API_SHARED_KEY", None)

from role_sieve.client import VacancyRef
from web.app import app


def _decode_summary_from_header(value: str) -> dict:
    # Заголовок в бэке отправляется base64url без padding '='
    pad = "=" * ((4 - (len(value) % 4)) % 4)
    raw = base64.urlsafe_b64decode((value + pad).encode("ascii")).decode("utf-8")
    return json.loads(raw)


class TestFastApiExports(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    @patch("web.app.export_refs_to_xlsx_bytes")
    def test_manual_success_has_contract_headers(self, mock_export: unittest.mock.MagicMock) -> None:
        mock_export.return_value = (
            b"dummy-xlsx-bytes",
            1,
            [],
            {"requested": 1},
        )

        resp = self.client.post(
            "/api/v1/export/manual",
            json={
                "vacancy_ids_or_urls": ["131474430"],
                "kw_top_n": 30,
                "kw_max_ngram": 3,
                "sleep_s": 0.0,
                "token": None,
            },
        )

        self.assertEqual(resp.status_code, 200)
        self.assertIn("X-Request-Id", resp.headers)
        self.assertIn("X-Export-Summary", resp.headers)
        # X-Export-Warnings не ожидаем, т.к. ошибок нет
        self.assertNotIn("X-Export-Warnings", resp.headers)

        summary = _decode_summary_from_header(resp.headers["X-Export-Summary"])
        self.assertIn("dedup", summary)
        self.assertEqual(summary["dedup"]["unique_count"], 1)

    def test_manual_invalid_lines_returns_422_with_request_id(self) -> None:
        resp = self.client.post(
            "/api/v1/export/manual",
            json={
                "vacancy_ids_or_urls": ["bad-value"],
                "kw_top_n": 30,
                "kw_max_ngram": 3,
                "sleep_s": 0.0,
                "token": None,
            },
        )

        self.assertEqual(resp.status_code, 422)
        self.assertIn("X-Request-Id", resp.headers)
        payload = resp.json()
        self.assertIn("detail", payload)
        self.assertEqual(payload["detail"]["error"], "invalid_vacancy_ref")

    @patch("web.app.export_refs_to_xlsx_bytes")
    @patch("web.app.collect_refs_auto")
    def test_auto_success_has_warnings_and_summary(
        self,
        mock_collect: unittest.mock.MagicMock,
        mock_export: unittest.mock.MagicMock,
    ) -> None:
        mock_collect.return_value = ([VacancyRef(vacancy_id="1")], 1)
        mock_export.return_value = (
            b"dummy-xlsx-bytes",
            1,
            ["1: some error"],
            {"requested": 1},
        )

        resp = self.client.post(
            "/api/v1/export/auto",
            json={
                "queries": ["frontend developer"],
                "pages": 1,
                "per_page": 1,
                "kw_top_n": 30,
                "kw_max_ngram": 3,
                "sleep_s": 0.0,
                "search_sleep_s": 0.0,
                "token": None,
            },
        )

        self.assertEqual(resp.status_code, 200)
        self.assertIn("X-Request-Id", resp.headers)
        self.assertEqual(resp.headers.get("X-Export-Warnings"), "1")
        self.assertIn("X-Export-Summary", resp.headers)

        summary = _decode_summary_from_header(resp.headers["X-Export-Summary"])
        self.assertIn("dedup", summary)
        self.assertEqual(summary["dedup"]["unique_count"], 1)
        self.assertEqual(summary["dedup"]["duplicates_removed"], 0)

    @patch("web.app.enqueue_export_job")
    def test_export_auto_async_payload_includes_search_filters(
        self, mock_enqueue: unittest.mock.MagicMock,
    ) -> None:
        mock_enqueue.return_value = "deadbeef"

        resp = self.client.post(
            "/api/v1/export/auto/async",
            json={
                "queries": ["python"],
                "pages": 1,
                "per_page": 10,
                "kw_top_n": 30,
                "kw_max_ngram": 3,
                "sleep_s": 0.0,
                "search_sleep_s": 0.0,
                "token": None,
                "employer_id": "42",
                "area": "1",
                "experience": "between1And3",
                "period": 7,
            },
        )

        self.assertEqual(resp.status_code, 200)
        mock_enqueue.assert_called_once()
        args, _kwargs = mock_enqueue.call_args
        self.assertEqual(args[0], "auto")
        payload = args[1]
        self.assertEqual(payload["employer_id"], "42")
        self.assertEqual(payload["area"], "1")
        self.assertEqual(payload["experience"], "between1And3")
        self.assertEqual(payload["period"], 7)
        self.assertEqual(payload["queries"], ["python"])


if __name__ == "__main__":
    unittest.main()

