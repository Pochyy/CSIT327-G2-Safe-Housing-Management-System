from django.shortcuts import render


def dashboard(request):
    username = request.session.get('username', 'User')
    user_role = request.session.get('user_role', 'Renter')
    return render(request, 'dashboard.html', {
        'username': username,
        'user_role': user_role
    })
