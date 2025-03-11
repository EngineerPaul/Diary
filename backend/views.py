from rest_framework.generics import (
    CreateAPIView
)
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response

from .serializers import NoteCreaterSerializer

class NoteCreaterAPI(CreateAPIView):
    serializer_class = NoteCreaterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        print(request)
        # return
        return super().post(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        return Response(
            # obj,
            # status=status.HTTP_201_CREATED,
            # headers=headers
        )

