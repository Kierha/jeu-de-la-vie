from django.test import TestCase
from django.utils import timezone
from django.contrib.auth.models import User
import time

class UserCreationPerformanceTest(TestCase):
    # Teste la performance de la création d'un utilisateur : 100 utilisateurs 
    def test_bulk_user_creation_performance(self):
        start_time = time.time()
        number_of_users_to_create = 100  

        for i in range(number_of_users_to_create):
            User.objects.create_user(f'user{i}', f'user{i}@example.com', 'password')

        end_time = time.time()
        duration = end_time - start_time

        self.assertEqual(User.objects.count(), number_of_users_to_create)
        self.assertLess(duration, 60, "La création des utilisateurs a pris trop de temps.")
