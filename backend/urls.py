from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (NoteCreaterAPI)


# router = DefaultRouter()
# router.register('api/create-note', NoteCreaterAPI,
#                 basename='create_note')
urlpatterns = [

    # API
    path('api/create-note', NoteCreaterAPI.as_view(), name='create_note_api'),
]

# urlpatterns += router.urls
