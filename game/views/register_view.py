from django.shortcuts import render, redirect
from django.contrib.auth import login
from game.forms.register_form import RegisterForm

def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('game_screen')
    else:
        form = RegisterForm()
    return render(request, 'registration/registerScreen.html', {'form': form})
