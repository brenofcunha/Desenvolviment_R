# Generated manually for initial Meta/Registro schema.
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Meta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=120)),
                ('descricao', models.TextField(blank=True)),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['-criado_em'],
            },
        ),
        migrations.CreateModel(
            name='Registro',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('texto', models.TextField()),
                ('imagem', models.ImageField(blank=True, null=True, upload_to='registros/')),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
                ('meta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='registros', to='minha_app.meta')),
            ],
            options={
                'ordering': ['criado_em'],
            },
        ),
    ]
