from django.test import TestCase
from django.urls import reverse
from game.forms import RegisterForm

class RegisterViewTests(TestCase):
    def test_register_view_get(self):
        """
        Teste que la vue register renvoie le bon formulaire lors d'une requête GET.
        """
        response = self.client.get(reverse('register'))
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.context['form'], RegisterForm)
        self.assertTemplateUsed(response, 'registration/registerScreen.html')

    def test_register_view_post_success(self):
        """
        Teste la création d'un utilisateur avec des données valides via une requête POST.
        """
        form_data = {'username': 'testuser', 'password1': 'testpassword123', 'password2': 'testpassword123'}
        response = self.client.post(reverse('register'), form_data)
        self.assertEqual(response.status_code, 302)  # Redirection après succès

    def test_register_view_post_error(self):
        """
        Teste la soumission du formulaire avec des données invalides.
        """
        form_data = {'username': 'testuser', 'password1': 'testpassword123', 'password2': 'wrongconfirmation'}
        response = self.client.post(reverse('register'), form_data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue('form' in response.context)
        self.assertTrue(response.context['form'].errors)  