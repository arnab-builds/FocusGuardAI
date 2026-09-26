import datetime
from django.test import SimpleTestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory

from .serializers import FocusGoalSerializer
from .views import FocusGoalView


class FocusGoalSerializerTests(SimpleTestCase):
    def test_serializer_converts_empty_string_deadline_to_none(self):
        data = {
            "goal_metric": "Deep Work Session",
            "target_value": 4.0,
            "priority": "High",
            "deadline": "",
            "notes": "Testing empty deadline",
        }
        serializer = FocusGoalSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertIsNone(serializer.validated_data.get("deadline"))

    def test_serializer_converts_whitespace_deadline_to_none(self):
        data = {
            "goal_metric": "Deep Work Session",
            "target_value": 4.0,
            "priority": "Medium",
            "deadline": "   ",
            "notes": "Testing whitespace deadline",
        }
        serializer = FocusGoalSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertIsNone(serializer.validated_data.get("deadline"))

    def test_serializer_preserves_valid_date(self):
        data = {
            "goal_metric": "Deep Work Session",
            "target_value": 4.0,
            "priority": "Low",
            "deadline": "2026-10-15",
            "notes": "Testing valid deadline",
        }
        serializer = FocusGoalSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(
            serializer.validated_data.get("deadline"),
            datetime.date(2026, 10, 15),
        )

    def test_serializer_handles_explicit_none_deadline(self):
        data = {
            "goal_metric": "Daily Focus Score Target",
            "target_value": 85.0,
            "priority": "High",
            "deadline": None,
            "notes": "Explicit null deadline",
        }
        serializer = FocusGoalSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertIsNone(serializer.validated_data.get("deadline"))

    def test_serializer_invalid_date_format_fails(self):
        data = {
            "goal_metric": "Deep Work Session",
            "target_value": 4.0,
            "priority": "High",
            "deadline": "invalid-date",
            "notes": "",
        }
        serializer = FocusGoalSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("deadline", serializer.errors)

    def test_serializer_invalid_metric_fails(self):
        data = {
            "goal_metric": "Invalid Metric",
            "target_value": 4.0,
            "priority": "High",
            "deadline": "",
        }
        serializer = FocusGoalSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("goal_metric", serializer.errors)

    def test_serializer_invalid_target_value_fails(self):
        data = {
            "goal_metric": "Deep Work Session",
            "target_value": "not-a-number",
            "priority": "High",
            "deadline": "",
        }
        serializer = FocusGoalSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("target_value", serializer.errors)


class FocusGoalSecurityTests(SimpleTestCase):
    def test_create_goal_unauthenticated_returns_401(self):
        factory = APIRequestFactory()
        request = factory.post(
            "/api/focus/goals/",
            {
                "goal_metric": "Deep Work Session",
                "target_value": 3.0,
                "priority": "High",
                "deadline": "",
            },
            format="json",
        )
        response = FocusGoalView.as_view()(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
