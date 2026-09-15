import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction

from dashboard.models import ApprDoc, ApprLine, ApprLog, Company, Department, Employee

DEPTS = ["경영지원팀", "인사팀", "영업팀", "개발팀", "재무팀"]
CATEGORIES = ["연차 신청서", "지출 결의서", "출장 신청서", "품의서", "비품 구매 요청서"]


class Command(BaseCommand):
    help = "결재 분석 대시보드용 로컬 목데이터를 생성한다."

    def add_arguments(self, parser):
        parser.add_argument("--docs", type=int, default=300)
        parser.add_argument("--flush", action="store_true")

    @transaction.atomic
    def handle(self, *args, **options):
        if options["flush"]:
            ApprLog.objects.all().delete()
            ApprLine.objects.all().delete()
            ApprDoc.objects.all().delete()
            Employee.objects.all().delete()
            Department.objects.all().delete()
            Company.objects.all().delete()

        if Company.objects.exists():
            self.stdout.write(self.style.WARNING("이미 데이터가 있습니다. --flush 옵션으로 재실행하세요."))
            return

        company = Company.objects.create(com_id=1, com_name="에스비상사")

        departments = [
            Department.objects.create(dept_id=i + 1, dept_name=name)
            for i, name in enumerate(DEPTS)
        ]

        employees = []
        emp_id = 1
        for dept in departments:
            for _ in range(6):
                employees.append(
                    Employee.objects.create(
                        emp_id=emp_id, emp_name=f"{dept.dept_name[:2]}직원{emp_id}",
                        emp_status="재직", dept=dept,
                    )
                )
                emp_id += 1

        now = timezone.now()
        doc_id = line_id = log_id = 1
        n_docs = options["docs"]

        for _ in range(n_docs):
            drafter = random.choice(employees)

            same_dept = [e for e in employees if e.dept_id == drafter.dept_id and e.emp_id != drafter.emp_id]
            n_lines = random.randint(2, 3)
            approvers = random.sample(same_dept, min(n_lines, len(same_dept))) if same_dept else []

            created_at = now - timedelta(days=random.uniform(0, 365))
            category_idx = random.randrange(len(CATEGORIES))

            roll = random.random()
            status = "APP" if roll < 0.65 else ("ING" if roll < 0.85 else "REJ")

            doc = ApprDoc.objects.create(
                doc_id=doc_id, for_id=category_idx + 1, for_version=1,
                emp=drafter, com=company,
                doc_title=f"[{CATEGORIES[category_idx]}] {drafter.emp_name}",
                doc_status=status, is_important=random.random() < 0.1, doc_revision=0,
                created_at=created_at, updated_at=created_at,
            )
            doc_id += 1

            t = created_at
            if status == "APP":
                for order, approver in enumerate(approvers, start=1):
                    t += timedelta(hours=random.uniform(1, 30))
                    ApprLine.objects.create(lin_id=line_id, doc=doc, emp=approver, lin_order=order, lin_status="APP", lin_approved=t)
                    line_id += 1
            elif status == "REJ" and approvers:
                rej_at = random.randint(1, len(approvers))
                for order, approver in enumerate(approvers, start=1):
                    if order < rej_at:
                        t += timedelta(hours=random.uniform(1, 30))
                        ApprLine.objects.create(lin_id=line_id, doc=doc, emp=approver, lin_order=order, lin_status="APP", lin_approved=t)
                    elif order == rej_at:
                        t += timedelta(hours=random.uniform(1, 30))
                        ApprLine.objects.create(lin_id=line_id, doc=doc, emp=approver, lin_order=order, lin_status="REJ", lin_approved=t)
                    else:
                        ApprLine.objects.create(lin_id=line_id, doc=doc, emp=approver, lin_order=order, lin_status="WAI", lin_approved=None)
                    line_id += 1
            else:  # ING
                done_upto = random.randint(0, len(approvers) - 1) if approvers else 0
                for order, approver in enumerate(approvers, start=1):
                    if order <= done_upto:
                        t += timedelta(hours=random.uniform(1, 30))
                        ApprLine.objects.create(lin_id=line_id, doc=doc, emp=approver, lin_order=order, lin_status="APP", lin_approved=t)
                    else:
                        ApprLine.objects.create(lin_id=line_id, doc=doc, emp=approver, lin_order=order, lin_status="WAI", lin_approved=None)
                    line_id += 1

            if approvers and random.random() < 0.1:
                ori = random.choice(approvers)
                act = random.choice([e for e in employees if e.emp_id != ori.emp_id])
                per = random.choice(employees)
                ApprLog.objects.create(
                    log_id=log_id, doc=doc, ori_emp=ori, act_emp=act, per_emp=per,
                    created_at=created_at + timedelta(hours=random.uniform(0.5, 5)),
                )
                log_id += 1

        self.stdout.write(self.style.SUCCESS(f"목데이터 생성 완료 — 문서 {n_docs}건, 직원 {len(employees)}명"))