from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny

from .models import Meta, Registro
from .serializers import MetaSerializer, RegistroSerializer


class MetaListCreateView(generics.ListCreateAPIView):
	queryset = Meta.objects.all()
	serializer_class = MetaSerializer
	permission_classes = [AllowAny]


class MetaDetailView(generics.RetrieveAPIView):
	queryset = Meta.objects.all()
	serializer_class = MetaSerializer
	permission_classes = [AllowAny]
	lookup_field = 'id'


class RegistroListCreateView(generics.ListCreateAPIView):
	serializer_class = RegistroSerializer
	permission_classes = [AllowAny]
	parser_classes = [MultiPartParser, FormParser]

	def get_queryset(self):
		meta = get_object_or_404(Meta, id=self.kwargs['id'])
		return meta.registros.all()

	def perform_create(self, serializer):
		meta = get_object_or_404(Meta, id=self.kwargs['id'])
		serializer.save(meta=meta)
