from unittest.mock import patch
from django.db import DatabaseError
from django.test import SimpleTestCase, override_settings


@override_settings(
    ALLOWED_HOSTS=["testserver", "127.0.0.1", "localhost"],
    CLOUDFLARE_DB_HEALTH_SECRET="test-secret-12345",
)
class HealthEndpointTests(SimpleTestCase):
    def test_health_endpoint_returns_ok(self):
        response = self.client.get("/health/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_health_db_without_secret_returns_403(self):
        response = self.client.get("/health/db/")

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json(), {"detail": "Forbidden"})

    def test_health_db_with_wrong_secret_returns_403(self):
        response = self.client.get(
            "/health/db/",
            headers={"x-health-secret": "wrong-secret"},
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json(), {"detail": "Forbidden"})

    @override_settings(CLOUDFLARE_DB_HEALTH_SECRET="")
    def test_health_db_when_secret_unset_returns_403(self):
        response = self.client.get(
            "/health/db/",
            headers={"x-health-secret": "test-secret-12345"},
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json(), {"detail": "Forbidden"})

    @patch("config.health.check_db_connection")
    def test_health_db_with_valid_secret_returns_ok(self, mock_check):
        response = self.client.get(
            "/health/db/",
            headers={"x-health-secret": "test-secret-12345"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})
        mock_check.assert_called_once()

    @patch("config.health.check_db_connection")
    def test_health_db_database_failure_returns_503(self, mock_check):
        mock_check.side_effect = DatabaseError("Connection failed")

        response = self.client.get(
            "/health/db/",
            headers={"x-health-secret": "test-secret-12345"},
        )

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json(), {"status": "error"})
