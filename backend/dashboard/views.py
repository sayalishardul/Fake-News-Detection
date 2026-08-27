from django.contrib.auth.models import User

from rest_framework.decorators import (
    api_view,
    permission_classes,
)

from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response

from detection.models import PredictionHistory

from accounts.serializers import UserSerializer
from accounts.permissions import IsAdminUserRole


# =========================================================
# ADMIN DASHBOARD
# =========================================================

@api_view(["GET"])
@permission_classes([IsAdminUserRole])
def dashboard(request):

    total_users = User.objects.count()

    total_predictions = (
        PredictionHistory.objects.count()
    )

    real_news = (
        PredictionHistory.objects
        .filter(prediction="Real")
        .count()
    )

    fake_news = (
        PredictionHistory.objects
        .filter(prediction="Fake")
        .count()
    )

    # -----------------------------------------------------
    # Recent Users
    # -----------------------------------------------------

    recent_users = (
        User.objects
        .order_by("-date_joined")[:5]
    )

    users = []

    for user in recent_users:

        users.append({
            "id": user.id,

            "name": (
                f"{user.first_name} "
                f"{user.last_name}"
            ).strip(),

            "username": user.username,

            "email": user.email,

            "joined": user.date_joined,
        })

    # -----------------------------------------------------
    # Recent Predictions
    # -----------------------------------------------------

    recent_predictions = (
        PredictionHistory.objects
        .order_by("-created_at")[:5]
    )

    predictions = []

    for item in recent_predictions:

        predictions.append({
            "id": item.id,

            "news": item.news[:120],

            "prediction": item.prediction,

            "score": item.score,

            "created_at": item.created_at,
        })

    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return Response({

        "total_users":
            total_users,

        "total_predictions":
            total_predictions,

        "real_news":
            real_news,

        "fake_news":
            fake_news,

        "recent_users":
            users,

        "recent_predictions":
            predictions,
    })


# =========================================================
# ADMIN USERS
# =========================================================

@api_view(["GET"])
@permission_classes([IsAdminUserRole])
def admin_users(request):

    users = (
        User.objects
        .all()
        .order_by("id")
    )

    serializer = UserSerializer(
    users,
    many=True
)

    return Response(
        serializer.data
    )


# =========================================================
# ADMIN PREDICTIONS
# =========================================================

@api_view(["GET"])
@permission_classes([IsAdminUserRole])
def admin_predictions(request):

    predictions = (
        PredictionHistory.objects
        .all()
        .order_by("id")
    )

    data = []

    for item in predictions:

        data.append({

            "id":
                item.id,

            "news":
                item.news,

            "prediction":
                item.prediction,

            "score":
                item.score,

            "created_at":
                item.created_at,
        })

    return Response(data)


# =========================================================
# DELETE USER
# =========================================================

@api_view(["DELETE"])
@permission_classes([IsAdminUserRole])
def delete_user(request, user_id):

    try:

        user = User.objects.get(
            id=user_id
        )

        # -------------------------------------------------
        # Prevent admin from deleting himself
        # -------------------------------------------------

        if user == request.user:

            return Response(
                {
                    "error":
                    "You cannot delete your own admin account."
                },
                status=400
            )

        user.delete()

        return Response(
            {
                "message":
                "User deleted successfully."
            },
            status=200
        )

    except User.DoesNotExist:

        return Response(
            {
                "error":
                "User not found."
            },
            status=404
        )


# =========================================================
# DELETE PREDICTION
# =========================================================

@api_view(["DELETE"])
@permission_classes([IsAdminUserRole])
def delete_prediction(
    request,
    prediction_id
):

    try:

        prediction = (
            PredictionHistory.objects.get(
                id=prediction_id
            )
        )

        prediction.delete()

        return Response(
            {
                "message":
                "Prediction deleted successfully."
            },
            status=200
        )

    except PredictionHistory.DoesNotExist:

        return Response(
            {
                "error":
                "Prediction not found."
            },
            status=404
        )


# =========================================================
# ADMIN CHANGE PASSWORD
# =========================================================

@api_view(["POST"])
@permission_classes([IsAdminUserRole])
def change_password(request):

    user = request.user

    current_password = (
        request.data.get(
            "current_password"
        )
    )

    new_password = (
        request.data.get(
            "new_password"
        )
    )

    # -----------------------------------------------------
    # Required fields
    # -----------------------------------------------------

    if not current_password or not new_password:

        return Response(
            {
                "error":
                "Current password and new password are required."
            },
            status=400
        )

    # -----------------------------------------------------
    # Verify current password
    # -----------------------------------------------------

    if not user.check_password(
        current_password
    ):

        return Response(
            {
                "error":
                "Current password is incorrect."
            },
            status=400
        )

    # -----------------------------------------------------
    # Minimum password length
    # -----------------------------------------------------

    if len(new_password) < 8:

        return Response(
            {
                "error":
                "New password must contain at least 8 characters."
            },
            status=400
        )

    # -----------------------------------------------------
    # Prevent same password
    # -----------------------------------------------------

    if current_password == new_password:

        return Response(
            {
                "error":
                "New password must be different from the current password."
            },
            status=400
        )

    # -----------------------------------------------------
    # Save new password
    # -----------------------------------------------------

    user.set_password(
        new_password
    )

    user.save()

    return Response(
        {
            "message":
            "Password changed successfully."
        },
        status=200
    )