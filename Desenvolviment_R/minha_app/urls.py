from django.urls import path

from .views import MetaDetailView, MetaListCreateView, RegistroListCreateView

urlpatterns = [
    path('metas/', MetaListCreateView.as_view(), name='meta-list-create'),
    path('metas/<int:id>/', MetaDetailView.as_view(), name='meta-detail'),
    path(
        'metas/<int:id>/registros/',
        RegistroListCreateView.as_view(),
        name='registro-list-create',
    ),
]
