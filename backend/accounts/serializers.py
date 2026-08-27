from django.contrib.auth.models import User
from rest_framework import serializers


# =========================================================
# REGISTER SERIALIZER
# =========================================================

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = User

        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "password",
        ]

    def create(self, validated_data):

        return User.objects.create_user(
            username=validated_data["username"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
            password=validated_data["password"],
        )


# =========================================================
# PROFILE SERIALIZER
# =========================================================

class ProfileSerializer(serializers.ModelSerializer):

    name = serializers.SerializerMethodField()

    class Meta:
        model = User

        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "name",
        ]

        read_only_fields = [
            "id",
            "username",
            "name",
        ]

    def get_name(self, obj):

        return (
            f"{obj.first_name} "
            f"{obj.last_name}"
        ).strip()


# =========================================================
# USER SERIALIZER
# Used by Admin User Management
# =========================================================

class UserSerializer(serializers.ModelSerializer):

    name = serializers.SerializerMethodField()

    class Meta:
        model = User

        fields = [
            "id",
            "name",
            "first_name",
            "last_name",
            "username",
            "email",
            "date_joined",
            "is_active",
            "is_staff",
            "is_superuser",
        ]

        read_only_fields = [
            "id",
            "date_joined",
            "is_superuser",
        ]

    def get_name(self, obj):

        return (
            f"{obj.first_name} "
            f"{obj.last_name}"
        ).strip()