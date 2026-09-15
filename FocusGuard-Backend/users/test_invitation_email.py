import uuid
from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User, Organization, Invitation
from users.email_service import BrevoAPIError

class InvitationEmailTests(APITestCase):
    def setUp(self):
        self.organization = Organization.objects.create(name="Test Org")
        self.super_admin = User.objects.create_user(
            username="superadmin",
            password="password123",
            email="superadmin@example.com",
            role="SUPER_ADMIN"
        )
        self.client.force_authenticate(user=self.super_admin)
        self.url = "/api/invitation/create/" # Based on common DRF setup

    @patch('users.views.send_brevo_email')
    def test_successful_brevo_response_commits_invitation(self, mock_send_email):
        # Successful email doesn't raise exception
        mock_send_email.return_value = None

        data = {
            "email": "orgadmin@example.com",
            "role": "SUB_ADMIN",
            "organization": self.organization.id
        }

        response = self.client.post(self.url, data, format='json')

        # Verify 201 response and invitation exists in DB
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Invitation.objects.filter(email="orgadmin@example.com").exists())
        mock_send_email.assert_called_once()

    @patch('users.views.send_brevo_email')
    def test_brevo_failure_rolls_back_invitation_and_returns_503(self, mock_send_email):
        # Simulate API/Network failure
        mock_send_email.side_effect = BrevoAPIError("API Key invalid or Network timeout")

        data = {
            "email": "fail@example.com",
            "role": "SUB_ADMIN",
            "organization": self.organization.id
        }

        response = self.client.post(self.url, data, format='json')

        # Verify 503 response and invitation is rolled back
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertEqual(response.data["error"], "Unable to send the invitation email right now. Please try again later.")
        self.assertFalse(Invitation.objects.filter(email="fail@example.com").exists())
        mock_send_email.assert_called_once()
