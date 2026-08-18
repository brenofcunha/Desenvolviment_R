from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import CadastroView, LoginView, MetaDetailView, MetaListCreateView, RegistroListCreateView

urlpatterns = [
    path('auth/cadastro/', CadastroView.as_view(), name='auth-cadastro'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='auth-refresh'),
    path('metas/', MetaListCreateView.as_view(), name='meta-list-create'),
    path('metas/<int:id>/', MetaDetailView.as_view(), name='meta-detail'),
    path(
        'metas/<int:id>/registros/',
        RegistroListCreateView.as_view(),
        name='registro-list-create',
    ),
]
