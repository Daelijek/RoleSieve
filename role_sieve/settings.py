import os


def max_export_vacancies() -> int:
    """Max vacancies per HTTP request or async job (env HH_EXPORT_MAX_VACANCIES, default 100)."""
    return int(os.environ.get("HH_EXPORT_MAX_VACANCIES", "100"))
