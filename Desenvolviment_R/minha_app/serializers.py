from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Meta, Registro

Usuario = get_user_model()


class MetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meta
        fields = ['id', 'titulo', 'descricao', 'criado_em']
        read_only_fields = ['id', 'criado_em']


class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registro
        fields = ['id', 'meta', 'texto', 'imagem', 'criado_em']
        read_only_fields = ['id', 'meta', 'criado_em']


class CadastroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'password']
        read_only_fields = ['id']

    def create(self, validated_data):
        return Usuario.objects.create_user(**validated_data)
