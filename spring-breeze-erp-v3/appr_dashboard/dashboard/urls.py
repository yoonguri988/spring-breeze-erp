from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("api/summary", views.api_summary, name="api_summary"),
    path("api/monthly-trend", views.api_monthly_trend, name="api_monthly_trend"),
    path("api/dept-stats", views.api_dept_stats, name="api_dept_stats"),
    path("api/turnaround", views.api_turnaround, name="api_turnaround"),
    path("api/delegation-trend", views.api_delegation_trend, name="api_delegation_trend"),
]
