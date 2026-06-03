#!/usr/bin/env python3
"""Exchange HH app client_id + client_secret for an application access_token."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from role_sieve.load_env import load_dotenv

load_dotenv()

TOKEN_URL = "https://hh.ru/oauth/token"


def main() -> int:
    client_id = os.environ.get("HH_CLIENT_ID", "").strip()
    client_secret = os.environ.get("HH_CLIENT_SECRET", "").strip()
    if not client_id or not client_secret:
        print(
            "Set HH_CLIENT_ID and HH_CLIENT_SECRET, then run again.\n"
            "Example (PowerShell):\n"
            '  $env:HH_CLIENT_ID="..."\n'
            '  $env:HH_CLIENT_SECRET="..."\n'
            "  python scripts/hh_app_token.py",
            file=sys.stderr,
        )
        return 1

    resp = requests.post(
        TOKEN_URL,
        data={
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=30,
    )
    try:
        resp.raise_for_status()
    except requests.HTTPError:
        print(resp.status_code, resp.text, file=sys.stderr)
        return 1

    data = resp.json()
    token = data.get("access_token")
    if not token:
        print(json.dumps(data, ensure_ascii=False, indent=2), file=sys.stderr)
        return 1

    expires = data.get("expires_in")
    print(token)
    if expires:
        print(f"# expires_in seconds: {expires}", file=sys.stderr)
    print(
        "# Set on the API server (do not commit):\n"
        f'# HH_TOKEN={token}\n'
        "# ROLESIEVE_HH_USER_AGENT=RoleSieve/1.0 (you@email.com)",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
