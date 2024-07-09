from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import MinLengthValidator, MinValueValidator, MaxValueValidator

# UserManager uses BaseUserManager to help create a user
class UserManager(BaseUserManager):

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        # create and save a user with the given email and password.
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        # create a regular user (not staff or superuser)
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        # create a superuser
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

# model for a user uses the UserManager model
class User(AbstractUser):
    email = models.EmailField('Email', unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = UserManager()


# these classes will be used in ForeignKey relationships to make adding options in the
# django admin window possible
class PizzaSize(models.Model):
    pizza_size = models.CharField(max_length=50)

    def __str__(self):
        return self.pizza_size

class CrustType(models.Model):
    crust_type = models.CharField(max_length=50)

    def __str__(self):
        return self.crust_type

class PizzaSauce(models.Model):
    sauce = models.CharField(max_length=50)

    def __str__(self):
        return self.sauce

class PizzaCheese(models.Model):
    cheese = models.CharField(max_length=50)

    def __str__(self):
        return self.cheese

class PizzaToppings(models.Model):
    toppings = models.CharField(max_length=100)

    def __str__(self):
        return self.toppings

# model for building a pizza that uses the above classes
class Pizza(models.Model):
    name = models.CharField(max_length=50)
    size = models.ForeignKey(PizzaSize, on_delete=models.CASCADE)
    crust = models.ForeignKey(CrustType, on_delete=models.CASCADE)
    sauce = models.ForeignKey(PizzaSauce, on_delete=models.CASCADE)
    cheese = models.ForeignKey(PizzaCheese, on_delete=models.CASCADE)
    toppings = models.ManyToManyField(PizzaToppings)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1) # links a pizza to a user

# model that defines an order and its attributes
class Order(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=250)
    card_number = models.BigIntegerField(validators=[MinValueValidator(1000000000000000), MaxValueValidator(9999999999999999)])
    expire_month = models.PositiveIntegerField(validators=[MaxValueValidator(12)])
    expire_year = models.PositiveIntegerField(validators=[MinValueValidator(2024)])
    ccv = models.PositiveIntegerField(validators=[MaxValueValidator(999)])
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1) # links a user to an order
    pizza = models.ForeignKey(Pizza, on_delete=models.CASCADE) #links a pizza to an order
    order_date = models.DateTimeField(auto_now_add=True)
    eta = models.DateTimeField()
