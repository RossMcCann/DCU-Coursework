from django.urls import path
from . import views
from .forms import *

urlpatterns = [
    path('', views.home, name="index"),
    path('signup/', views.UserSignupView.as_view(), name="signup"),
    path('login/', views.UserLoginView.as_view(), name="login"),
    path('logout/', views.UserLoginView.user_logout, name="logout"),
    path('create/', views.CreatePizzaView.as_view(), name="order"),
    path('account/', views.ShowAccount.as_view(), name="account"),
    path('order/', views.CreateOrder.as_view(), name="order"),
    path('confirmation/<int:pk>/', views.OrderConfirmation.as_view(), name="order_confirmation"),
]