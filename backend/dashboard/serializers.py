from django.contrib.auth.models import User
from rest_framework import serializers


class AdminUserSerializer(serializers.ModelSerializer):

    name = serializers.SerializerMethodField()

    joined = serializers.DateTimeField(
        source="date_joined",
        format="%d %b %Y"
    )

    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "username",
            "email",
            "joined",
        ]

    def get_name(self, obj):
        full_name = f"{obj.first_name} {obj.last_name}".strip()

        return full_name if full_name else "N/A"