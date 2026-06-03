"""Load repo-root `.env` into os.environ (local dev convenience)."""

from __future__ import annotations

import os
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parent.parent
_LOADED = False


def load_dotenv() -> None:
    global _LOADED
    if _LOADED:
        return
    _LOADED = True

    env_path = _REPO_ROOT / ".env"
    if not env_path.is_file():
        return

    try:
        from dotenv import load_dotenv as _load
    except ImportError:
        return

    _load(env_path, override=False)
