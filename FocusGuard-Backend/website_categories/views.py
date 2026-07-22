from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import WebsiteCategorySerializer
from .services import categorize_website


class WebsiteCategoryAPIView(APIView):

    def post(self, request):

        domain = request.data.get("domain")

        if not domain:

            return Response(
                {
                    "error": "Domain is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        website, cached = categorize_website(domain)

        serializer = WebsiteCategorySerializer(website)

        return Response(
            {
                "cached": cached,
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )