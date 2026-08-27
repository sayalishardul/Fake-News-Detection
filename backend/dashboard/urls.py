from django.urls import path

from . import views


urlpatterns = [

    path(
        "dashboard/",
        views.dashboard
    ),

    path(
        "users/",
        views.admin_users
    ),

    path(
        "users/<int:user_id>/delete/",
        views.delete_user
    ),

    path(
        "predictions/",
        views.admin_predictions
    ),

    path(
        "predictions/<int:prediction_id>/delete/",
        views.delete_prediction
    ),

    path(
        "change-password/",
        views.change_password
    ),
]