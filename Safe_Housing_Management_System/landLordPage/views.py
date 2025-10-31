from django.contrib.auth.decorators import login_required
from django.shortcuts import render

@login_required
def landLordPage(request):
    user = request.user  # This is your CustomUser, auto-populated
    context = {
        'username': user.username,
        'role': user.user_role,
        # add other user fields you want to show, e.g. 'phone': user.user_phone
        # plus any landlord-specific objects you query from the DB
    }
    return render(request, 'landlordPage.html', context)
