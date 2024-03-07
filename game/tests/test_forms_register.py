from django.test import TestCase
from game.forms import RegisterForm

class RegisterFormTest(TestCase):
    def test_form_is_valid(self):
        form_data = {'username': 'testuser', 'password1': 'testpassword123', 'password2': 'testpassword123'}
        form = RegisterForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_form_is_invalid_if_passwords_dont_match(self):
        form_data = {'username': 'testuser', 'password1': 'testpassword123', 'password2': 'wrongpassword'}
        form = RegisterForm(data=form_data)
        self.assertFalse(form.is_valid())

    def test_form_is_invalid_without_username(self):
        form_data = {'username': '', 'password1': 'testpassword123', 'password2': 'testpassword123'}
        form = RegisterForm(data=form_data)
        self.assertFalse(form.is_valid())
