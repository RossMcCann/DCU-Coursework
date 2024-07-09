from django import forms
from . import models
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.forms import ModelForm, ModelChoiceField, ModelMultipleChoiceField
from django.db import transaction

# form used to support users signing up to my site (uses django builtin framework)
class UserSignupForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = models.User

    @transaction.atomic
    def save(self, commit=True):
        user = super().save(commit=False)
        user.is_admin = False
        user.email = self.cleaned_data['username']
        
        if commit:
            user.save()
        
        return user

# form used to accomodate login/logout of existing users (uses builtin django framework)
class UserLoginForm(AuthenticationForm):

    def __init__(self, *args, **kwargs):
        super(UserLoginForm, self).__init__(*args, **kwargs)

# form used in 'create_pizza.html' uses pizza model. specifies toppings as a MultipleChoiceField
class PizzaCreation(forms.ModelForm):
    class Meta:
        model = models.Pizza
        fields = ['name', 'size', 'crust', 'sauce', 'cheese', 'toppings']

    toppings = ModelMultipleChoiceField(
        queryset=models.PizzaToppings.objects.all(),
        required=False,
        widget=forms.CheckboxSelectMultiple
        )

# form used in 'order.html' uses order model
class OrderPizza(forms.ModelForm):
    class Meta:
        model = models.Order
        fields = ['name', 'address', 'card_number', 'expire_month', 'expire_year', 'ccv']
