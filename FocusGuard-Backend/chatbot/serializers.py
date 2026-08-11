from rest_framework import serializers
from .models import ChatMessage


class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(
        max_length=1000,
        trim_whitespace=True,
    )


class ChatResponseSerializer(serializers.Serializer):
    response = serializers.CharField()


class ChatMessageSerializer(serializers.ModelSerializer):
    text = serializers.CharField(source="content")

    class Meta:
        model = ChatMessage
        fields = ["id", "sender", "text", "selected_date", "created_at"]
