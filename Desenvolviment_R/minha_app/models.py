from django.db import models

class Meta(models.Model):
	titulo = models.CharField(max_length=120)
	descricao = models.TextField(blank=True)
	criado_em = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-criado_em']

	def __str__(self):
		return self.titulo


class Registro(models.Model):
	meta = models.ForeignKey(
		Meta,
		on_delete=models.CASCADE,
		related_name='registros',
	)
	texto = models.TextField()
	imagem = models.ImageField(upload_to='registros/', blank=True, null=True)
	criado_em = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['criado_em']

	def __str__(self):
		return f'Registro #{self.id} - {self.meta.titulo}'
