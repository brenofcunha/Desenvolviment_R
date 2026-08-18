from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Meta, Registro


class MetasEndpointsTests(APITestCase):
	def test_post_metas_cria_meta(self):
		payload = {
			'titulo': 'Aprender Django REST',
			'descricao': 'Criar API com endpoints de metas',
		}

		response = self.client.post('/metas/', payload, format='json')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(Meta.objects.count(), 1)
		self.assertEqual(Meta.objects.first().titulo, payload['titulo'])

	def test_get_metas_lista_metas(self):
		Meta.objects.create(titulo='Meta 1', descricao='Descricao 1')
		Meta.objects.create(titulo='Meta 2', descricao='Descricao 2')

		response = self.client.get('/metas/')

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('results', response.data)
		self.assertEqual(len(response.data['results']), 2)

	def test_get_metas_id_retorna_uma_meta(self):
		meta = Meta.objects.create(titulo='Meta detalhada', descricao='Descricao')

		response = self.client.get(f'/metas/{meta.id}/')

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['id'], meta.id)
		self.assertEqual(response.data['titulo'], meta.titulo)

	def test_post_metas_id_registros_adiciona_registro_texto_e_imagem(self):
		meta = Meta.objects.create(titulo='Meta com registro')
		imagem = SimpleUploadedFile(
			name='trajetoria.gif',
			content=(
				b'GIF87a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff!'
				b'\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02'
				b'D\x01\x00;'
			),
			content_type='image/gif',
		)

		response = self.client.post(
			f'/metas/{meta.id}/registros/',
			{'texto': 'Primeiro registro', 'imagem': imagem},
			format='multipart',
		)

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(Registro.objects.count(), 1)
		registro = Registro.objects.first()
		self.assertEqual(registro.meta_id, meta.id)
		self.assertEqual(registro.texto, 'Primeiro registro')
		self.assertTrue(bool(registro.imagem))

	def test_get_metas_id_registros_lista_trajetoria(self):
		meta = Meta.objects.create(titulo='Meta com trajetoria')
		Registro.objects.create(meta=meta, texto='Inicio')
		Registro.objects.create(meta=meta, texto='Meio')

		response = self.client.get(f'/metas/{meta.id}/registros/')

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('results', response.data)
		self.assertEqual(len(response.data['results']), 2)
