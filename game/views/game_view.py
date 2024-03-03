from django.shortcuts import render
from django.http import JsonResponse
from game.models import Rule

def game_screen(request):
    rules = Rule.objects.all()
    # Ajoute 'username' au contexte si l'utilisateur est authentifié
    context = {
        'rules': rules,
        'username': request.user.username if request.user.is_authenticated else None
    }
    return render(request, 'game/gameScreen.html', context)

def get_rule_details(request, rule_id):
    try:
        rule = Rule.objects.get(id=rule_id)
        rule_details = {
            'name': rule.name,
            'survival_rules': rule.survival_rules,
            'birth_rules': rule.birth_rules
        }
        return JsonResponse(rule_details)
    except Rule.DoesNotExist:
        return JsonResponse({'error': 'Règle non trouvée'}, status=404)
