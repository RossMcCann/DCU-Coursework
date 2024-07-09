from django.shortcuts import render, redirect
from django.views.generic import CreateView
from django.contrib.auth import login, logout
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.utils import timezone
from .forms import *
from . import models 

# simple view to load site home page
def home(request):
    return render(request, 'index.html')

# view used for user sign-up
class UserSignupView(CreateView):
    model = models.User
    form_class = UserSignupForm
    template_name = 'signup.html'

    def get_context_data(self, **kwargs):
        return super().get_context_data(**kwargs)

    # succesful login results in redirection to your account page
    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('/account')

# view used to log users in & out
class UserLoginView(LoginView):
    template_name='login.html'
    authentication_form=UserLoginForm

    # succesful logout results in redirection to homepage
    def user_logout(request):
        logout(request)
        return redirect("/")

# view used to show details of a users account (previous orders)
class ShowAccount(LoginRequiredMixin, CreateView):
    model = models.Order
    template_name = 'account.html'
    fields = ['name', 'address', 'pizza']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user_orders = models.Order.objects.filter(user=self.request.user)
        context['user_orders'] = user_orders
        return context

# view using the PizzaCreation form for a user to order a pizza
class CreatePizzaView(LoginRequiredMixin, CreateView):
    model = models.Pizza
    form_class = PizzaCreation
    template_name = 'create_pizza.html'
    success_url = '/order/'

    # Sets the user field of the pizza to the logged-in user
    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)

# view using the OrderPizza form to create an order
class CreateOrder(LoginRequiredMixin, CreateView):
    model = models.Order
    template_name = 'order.html'
    form_class = OrderPizza

    # uses order id to build success url
    def get_success_url(self):
        return reverse_lazy('order_confirmation', kwargs={'pk': self.object.pk})

    def form_valid(self, form):
        user_pizza = models.Pizza.objects.filter(user=self.request.user).order_by('-id').first()
        form.instance.user = self.request.user
        form.instance.pizza = user_pizza
        form.instance.order_date = timezone.now()
        form.instance.eta = timezone.now() + timezone.timedelta(minutes=30)
        return super().form_valid(form)

# view to display confirmation of an order
class OrderConfirmation(LoginRequiredMixin, CreateView):
    model = models.Order
    template_name = 'confirmation.html'
    fields = ['name', 'address', 'pizza']

    # displays the order
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        order = self.get_object()
        context['order'] = order
        return context
