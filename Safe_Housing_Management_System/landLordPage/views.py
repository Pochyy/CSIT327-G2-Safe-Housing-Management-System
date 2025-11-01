from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.shortcuts import render, redirect
from .forms import PropertyForm

@login_required
def landLordPage(request):
    user = request.user  # This is your CustomUser, auto-populated
    context = {
        'username': user.username,
        'role': user.user_role,
        # add other user fields you want to show, e.g. 'phone': user.user_phone
        # plus any landlord-specific objects you query from the DB
    }
    return render(request, 'landLordPage.html', context)

@login_required
def add_property(request):
    if request.method == 'POST':                #check if submitted
        form = PropertyForm(request.POST)      #creates a form with data from user input
        if form.is_valid():                     #validates the form, checks if all fields are filles and correct
            property = form.save(commit=False)  
            property.landlord =request.user     #current user is assigned as landlord for new property listing
            property.save()                     #saves the new property to the database
            return redirect('landlord')    #redirects back to landlord page after successful submission
    else:
        form = PropertyForm()                  #if not a POST request, create an empty form
    
    return render(request, 'add_property.html', {'form': form})     #renders the form template with the form instance

#return render is wrong need to change for tomorrow or unya 