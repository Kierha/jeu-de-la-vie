from django.urls import path
from django.contrib.auth import views as auth_views
from game.views import register, game_screen, get_rule_details

urlpatterns = [
    path('', auth_views.LoginView.as_view(template_name='registration/loginScreen.html'), name='login'),
    path('login/', auth_views.LoginView.as_view(template_name='registration/loginScreen.html'), name='login'),
    path('register/', register, name='register'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/login/'), name='logout'),
    path('game/', game_screen, name='game_screen'),
    path('get-rule-details/<int:rule_id>/', get_rule_details, name='get_rule_details'),
]
