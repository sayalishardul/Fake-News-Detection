from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    UserSerializer,
)

from django.shortcuts import get_object_or_404

from .permissions import IsAdminUserRole

# ==========================================
# Register
# ==========================================

@api_view(["POST"])
def register(request):

    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():

        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Registration Successful",

                "access": str(
                    refresh.access_token
                ),

                "refresh": str(refresh),

                "username": user.username,

                "name": (
                    f"{user.first_name} "
                    f"{user.last_name}"
                ).strip(),

                "email": user.email,

                "is_staff": user.is_staff,

                "is_superuser": user.is_superuser,
            },

            status=status.HTTP_201_CREATED,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


# ==========================================
# Login
# ==========================================

@api_view(["POST"])
def login(request):

    print("\n" + "=" * 60)
    print("LOGIN API CALLED")
    print("=" * 60)

    print("Request Data :", request.data)

    username = request.data.get("username")
    password = request.data.get("password")

    print("Username :", username)

    # Do NOT print the password in production
    print(
        "Password Provided :",
        bool(password)
    )

    try:

        db_user = User.objects.get(
            username=username
        )

        print(
            "User Exists      : YES"
        )

        print(
            "User ID          :",
            db_user.id
        )

        print(
            "User Active      :",
            db_user.is_active
        )

        print(
            "Is Staff         :",
            db_user.is_staff
        )

        print(
            "Is Superuser     :",
            db_user.is_superuser
        )

        print(
            "Password Correct :",
            db_user.check_password(password)
        )

    except User.DoesNotExist:

        print(
            "User Exists : NO"
        )

        return Response(
            {
                "message":
                "Invalid username or password"
            },

            status=status.HTTP_401_UNAUTHORIZED,
        )

    user = authenticate(
        request,
        username=username,
        password=password,
    )

    print(
        "Authenticate() Returned :",
        user
    )

    if user is None:

        return Response(
            {
                "message":
                "Authentication Failed"
            },

            status=status.HTTP_401_UNAUTHORIZED,
        )

    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "message":
            "Login Successful",

            "access":
            str(refresh.access_token),

            "refresh":
            str(refresh),

            "username":
            user.username,

            "name":
            (
                f"{user.first_name} "
                f"{user.last_name}"
            ).strip(),

            "email":
            user.email,

            # =================================
            # ROLE INFORMATION
            # =================================

            "is_staff":
            user.is_staff,

            "is_superuser":
            user.is_superuser,
        },

        status=status.HTTP_200_OK,
    )


# ==========================================
# Profile
# ==========================================

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def profile(request):

    if request.method == "GET":

        serializer = ProfileSerializer(
            request.user
        )

        return Response(
            serializer.data
        )

    serializer = ProfileSerializer(
        request.user,
        data=request.data,
        partial=True,
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            {
                "message":
                "Profile Updated Successfully",

                "user":
                serializer.data,
            }
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


# ==========================================
# Users
# ==========================================

@api_view(["GET"])
@permission_classes([IsAdminUserRole])
def users(request):

    users = User.objects.all().order_by(
        "-date_joined"
    )

    serializer = UserSerializer(
        users,
        many=True
    )

    return Response(
        serializer.data
    )

# ==========================================
# User Detail
# ==========================================

@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAdminUserRole])
def user_detail(request, pk):

    user = get_object_or_404(
        User,
        pk=pk,
    )

    # ==========================================
    # GET USER
    # ==========================================

    if request.method == "GET":

        serializer = UserSerializer(
            user
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    # ==========================================
    # UPDATE USER
    # ==========================================

    if request.method == "PUT":

        # Do not allow admin to change
        # another user's superuser status
        data = request.data.copy()

        data.pop(
            "is_superuser",
            None,
        )

        serializer = UserSerializer(
            user,
            data=data,
            partial=True,
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    # ==========================================
    # DELETE USER
    # ==========================================

    # Prevent admin from deleting themselves
    if user.id == request.user.id:

        return Response(
            {
                "message":
                    "You cannot delete your own account."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Prevent deletion of superuser
    if user.is_superuser:

        return Response(
            {
                "message":
                    "Superuser accounts cannot be deleted."
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    user.delete()

    return Response(
        {
            "message":
                "User deleted successfully."
        },
        status=status.HTTP_200_OK,
    )

# ==========================================
# Change Password
# ==========================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):

    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")

    # ------------------------------------------
    # Required fields
    # ------------------------------------------

    if not current_password or not new_password:
        return Response(
            {
                "message": "Current password and new password are required."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = request.user

    # ------------------------------------------
    # Verify current password
    # ------------------------------------------

    if not user.check_password(current_password):
        return Response(
            {
                "message": "Current password is incorrect."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # ------------------------------------------
    # Prevent same password
    # ------------------------------------------

    if current_password == new_password:
        return Response(
            {
                "message": "New password must be different from the current password."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # ------------------------------------------
    # Validate new password
    # ------------------------------------------

    try:
        validate_password(
            new_password,
            user=user,
        )

    except ValidationError as error:

        return Response(
            {
                "message": "Password validation failed.",
                "errors": error.messages,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # ------------------------------------------
    # Save password securely
    # ------------------------------------------

    user.set_password(new_password)
    user.save()

    # ------------------------------------------
    # Return response
    # ------------------------------------------

    return Response(
        {
            "message": "Password changed successfully. Please log in again."
        },
        status=status.HTTP_200_OK,
    )