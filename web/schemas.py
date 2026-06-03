from typing import Optional

from pydantic import BaseModel, Field

from role_sieve.settings import max_export_vacancies

_MAX_V = max_export_vacancies()


class ManualExportBody(BaseModel):
    vacancy_ids_or_urls: list[str] = Field(..., min_length=1, max_length=_MAX_V)
    kw_top_n: int = Field(30, ge=1, le=200)
    kw_max_ngram: int = Field(3, ge=1, le=5)
    token: Optional[str] = None
    sleep_s: float = Field(0.2, ge=0, le=5)


class AutoSearchExportBody(BaseModel):
    """Search + keyword options for auto export and auto summary (sync and async)."""

    queries: list[str] = Field(..., min_length=1, max_length=50)
    pages: int = Field(2, ge=1, le=20)
    per_page: int = Field(100, ge=1, le=100)
    kw_top_n: int = Field(30, ge=1, le=200)
    kw_max_ngram: int = Field(3, ge=1, le=5)
    token: Optional[str] = None
    sleep_s: float = Field(0.2, ge=0, le=5)
    search_sleep_s: float = Field(0.2, ge=0, le=5)
    employer_id: Optional[str] = None
    area: Optional[str] = None
    experience: Optional[str] = None
    period: Optional[int] = Field(None, ge=1, le=30)


# Aliases for clearer route signatures / OpenAPI tags
AutoExportBody = AutoSearchExportBody
SummaryAutoBody = AutoSearchExportBody
