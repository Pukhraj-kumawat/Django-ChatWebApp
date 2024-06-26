# Generated by Django 5.0.4 on 2024-05-10 11:27

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0003_alter_customuser_mobile_no'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='mobile_no',
            field=models.IntegerField(null=True, unique=True, validators=[django.core.validators.RegexValidator(message='Mobile number is invalid', regex='^(?!0)\\d{10}$')]),
        ),
    ]
