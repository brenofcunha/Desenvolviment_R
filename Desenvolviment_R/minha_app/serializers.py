from rest_framework import serializers

from .models import Meta, Registro


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
