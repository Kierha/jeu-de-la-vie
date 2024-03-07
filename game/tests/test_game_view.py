from django.test import TestCase
from django.urls import reverse
from game.models import Rule
from django.contrib.auth.models import User

class GameViewTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Crée un utilisateur pour les tests d'authentification
        cls.user = User.objects.create_user(username='testuser', password='12345')
        # Crée une règle pour tester la récupération des détails
        cls.rule = Rule.objects.create(name="Test Rule", description="A test rule", survival_rules="2,3", birth_rules="3")

    def test_game_screen_view(self):
        self.client.login(username='testuser', password='12345')
        response = self.client.get(reverse('game_screen'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'game/gameScreen.html')
        self.assertTrue('username' in response.context)
        self.assertEqual(response.context['username'], 'testuser')

    def test_get_rule_details_view(self):
        response = self.client.get(reverse('get_rule_details', args=[self.rule.id]))
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            {"name": "Test Rule", "survival_rules": "2,3", "birth_rules": "3"}
        )

    def test_get_rule_details_view_not_found(self):
        response = self.client.get(reverse('get_rule_details', args=[999]))
        self.assertEqual(response.status_code, 404)
