from django.http import JsonResponse
from django.db.models import Count, Q, Max
from django.db.models.functions import TruncMonth
from django.shortcuts import render

from .models import ApprDoc, ApprLog

def api_summary(request):
    total = ApprDoc.objects.count()
    approved = ApprDoc.objects.filter(doc_status="APP").count()
    rejected = ApprDoc.objects.filter(doc_status="REJ").count()
    in_progress = ApprDoc.objects.filter(doc_status="ING").count()
    
    return JsonResponse({
        "total": total,
        "approved": approved,
        "rejected": rejected,
        "inProgress": in_progress,
    })

def api_monthly_trend(request):
    rows = (
        ApprDoc.objects
        .annotate(month=TruncMonth("created_at"))
        .values("month")
        .annotate(cnt=Count("doc_id"))
        .order_by("month")
    )
    return JsonResponse({
        "labels" : [r["month"].strftime("%Y-%m") for r in rows],
        "values" : [r["cnt"] for r in rows],
    })
    
def api_dept_stats(request):
    rows = (
        ApprDoc.objects
        .values("emp__dept__dept_name")
        .annotate(
            total=Count("doc_id"),
            approved=Count("doc_id", filter=Q(doc_status="APP")),
            rejected=Count("doc_id", filter=Q(doc_status="REJ")),
        )
        .order_by("-total")
    )
    return JsonResponse({
        "labels": [r["emp__dept__dept_name"] for r in rows],
        "approved": [r["approved"] for r in rows],
        "rejected": [r["rejected"] for r in rows],
    })
    
def api_turnaround(request):
    docs = (
        ApprDoc.objects
        .filter(doc_status="APP")
        .annotate(final_approval=Max("lines__lin_approved"))
    )
    
    hours_list = []
    for doc in docs:
        if doc.final_approval:
            hours = (doc.final_approval - doc.created_at).total_seconds() / 3600
            hours_list.append(hours)
    avg_hours = round(sum(hours_list) / len(hours_list), 1) if hours_list else 0
    
    return JsonResponse({
        "avgHours": avg_hours,
        "sampleCount": len(hours_list)
    })
    
def api_delegation_trend(request):
    rows = (
        ApprLog.objects
        .annotate(month=TruncMonth("created_at"))
        .values("month")
        .annotate(cnt=Count("log_id"))
        .order_by("month")
    )
    return JsonResponse({
        "labels": [r["month"].strftime("%Y-%m") for r in rows],
        "values": [r["cnt"] for r in rows],
    })
    
def index(request):
    return render(request, "dashboard/index.html")