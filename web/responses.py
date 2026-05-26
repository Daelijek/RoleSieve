import base64
import json
from datetime import datetime
from io import BytesIO
from typing import Any, List

from fastapi.responses import StreamingResponse


def attachment_filename(prefix: str) -> str:
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{prefix}_{ts}.xlsx"


def xlsx_streaming_response(
    data: bytes,
    *,
    filename_prefix: str,
    request_id: str,
    summary: dict[str, Any],
    errors: List[str],
) -> StreamingResponse:
    bio = BytesIO(data)
    bio.seek(0)
    out_headers: dict[str, str] = {"X-Request-Id": request_id}
    if errors:
        out_headers["X-Export-Warnings"] = str(len(errors))
    summary_bytes = json.dumps(summary, ensure_ascii=False).encode("utf-8")
    out_headers["X-Export-Summary"] = base64.urlsafe_b64encode(summary_bytes).decode("ascii").rstrip("=")
    name = attachment_filename(filename_prefix)
    return StreamingResponse(
        bio,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f'attachment; filename="{name}"',
            **out_headers,
        },
    )
