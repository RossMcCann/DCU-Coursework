from django.contrib import admin
from . import models

admin.site.register(models.User)

# models for creating a pizza
admin.site.register(models.PizzaSize)
admin.site.register(models.CrustType)
admin.site.register(models.PizzaSauce)
admin.site.register(models.PizzaCheese)
admin.site.register(models.PizzaToppings)
admin.site.register(models.Pizza)

admin.site.register(models.Order)
