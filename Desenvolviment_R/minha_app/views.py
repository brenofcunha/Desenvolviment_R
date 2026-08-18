from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Meta, Registro
from .serializers import CadastroSerializer, MetaSerializer, RegistroSerializer


class CadastroView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		serializer = CadastroSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		usuario = serializer.save()
		return Response(
			{
				'id': usuario.id,
				'username': usuario.username,
				'email': usuario.email,
			},
			status=status.HTTP_201_CREATED,
		)


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


class LoginView(TokenObtainPairView):
	permission_classes = [AllowAny]
