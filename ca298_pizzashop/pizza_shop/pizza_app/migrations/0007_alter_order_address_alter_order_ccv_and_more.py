# Generated by Django 5.0.1 on 2024-02-21 16:56

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pizza_app', '0006_alter_order_address_alter_order_card_number_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='address',
            field=models.CharField(max_length=250),
        ),
        migrations.AlterField(
            model_name='order',
            name='ccv',
            field=models.PositiveIntegerField(validators=[django.core.validators.MaxValueValidator(999)]),
        ),
        migrations.AlterField(
            model_name='order',
            name='expire_month',
            field=models.PositiveIntegerField(validators=[django.core.validators.MaxValueValidator(12)]),
        ),
        migrations.AlterField(
            model_name='order',
            name='expire_year',
            field=models.PositiveIntegerField(validators=[django.core.validators.MinValueValidator(2024)]),
        ),
        migrations.AlterField(
            model_name='order',
            name='name',
            field=models.CharField(max_length=50),
        ),
    ]
