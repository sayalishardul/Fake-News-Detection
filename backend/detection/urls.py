from django.urls import path
from . import views

urlpatterns = [

    path("predict/", views.predict_news_api),

    path("history/", views.prediction_history),

    path("clear-history/", views.clear_history),

    path("history/<int:pk>/", views.delete_history),

]