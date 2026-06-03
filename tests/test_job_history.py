import json
import os
import tempfile
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

os.environ.pop("API_SHARED_KEY", None)

from role_sieve.job_queue import enqueue_export_job, list_jobs
from web.app import app


class TestJobHistory(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_list_jobs_reads_status_files(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            job_id = "abc123"
            path = os.path.join(tmp, f"{job_id}.json")
            with open(path, "w", encoding="utf-8") as f:
                json.dump(
                    {
                        "job_id": job_id,
                        "kind": "auto",
                        "status": "succeeded",
                        "created_at": 1000.0,
                        "finished_at": 1001.0,
                        "run_meta": {
                            "queryLabel": "Python Developer",
                            "region": "Москва",
                        },
                        "summary": {
                            "processed": 10,
                            "errors": 0,
                            "top_skills": [{"name": "Python", "count": 5}],
                        },
                    },
                    f,
                )
            with patch("role_sieve.job_queue.JOBS_DIR", tmp):
                rows = list_jobs(limit=10, kinds=["auto"])
            self.assertEqual(len(rows), 1)
            self.assertEqual(rows[0]["job_id"], job_id)
            self.assertEqual(rows[0]["query_label"], "Python Developer")
            self.assertEqual(rows[0]["top_skill"], "Python")

    def test_jobs_list_endpoint(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            job_id = "def456"
            path = os.path.join(tmp, f"{job_id}.json")
            with open(path, "w", encoding="utf-8") as f:
                json.dump(
                    {
                        "job_id": job_id,
                        "kind": "auto",
                        "status": "succeeded",
                        "created_at": 2000.0,
                        "run_meta": {"queryLabel": "QA"},
                        "summary": {"processed": 1, "errors": 0, "top_skills": []},
                    },
                    f,
                )
            with patch("role_sieve.job_queue.JOBS_DIR", tmp):
                resp = self.client.get("/api/v1/jobs?limit=5")
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertEqual(data["count"], 1)
            self.assertEqual(data["jobs"][0]["job_id"], job_id)

    def test_enqueue_stores_run_meta(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            with patch("role_sieve.job_queue.JOBS_DIR", tmp):
                with patch("role_sieve.job_queue._run_export_job"):
                    job_id = enqueue_export_job(
                        "auto",
                        {
                            "queries": ["Go developer"],
                            "pages": 1,
                            "per_page": 10,
                            "client_meta": {
                                "queryLabel": "Go developer",
                                "region": "СПб",
                                "experience": "3–6",
                                "period": "30 дней",
                            },
                        },
                    )
                rows = list_jobs(kinds=["auto"])
            self.assertEqual(rows[0]["job_id"], job_id)
            self.assertEqual(rows[0]["query_label"], "Go developer")


if __name__ == "__main__":
    unittest.main()
