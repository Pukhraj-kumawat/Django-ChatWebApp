# Generated by Django 5.0.4 on 2024-05-11 06:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0005_grandparent_child_parent'),
    ]

    operations = [
        migrations.AlterField(
            model_name='child',
            name='father',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chat.parent'),
        ),
    ]
