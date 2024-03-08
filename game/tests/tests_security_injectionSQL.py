from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

class UserRegistrationTest(TestCase):
    # Teste la sécurité contre les injections SQL lors de l'inscription
    def test_sql_injection_attempt_on_registration(self):
        malicious_input = "'; DROP TABLE users; --"
        response = self.client.post(reverse('register'), {
            'username': malicious_input,
            'email': 'test@example.com',
            'password1': 'testpassword123',
            'password2': 'testpassword123',
        })
        self.assertNotIn("users", User.objects.all())
        self.assertEqual(response.status_code, 200)
