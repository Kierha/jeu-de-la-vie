from django.shortcuts import render

def game_screen(request):
    return render(request, 'game/gameScreen.html')
