from django.core.management.base import BaseCommand
from django.db import connection

DDL = [
    """
    CREATE TABLE IF NOT EXISTS COMPANY (
        COM_ID INTEGER PRIMARY KEY,
        COM_NAME TEXT NOT NULL
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS DEPARTMENT (
        DEPT_ID INTEGER PRIMARY KEY,
        DEPT_NAME TEXT NOT NULL
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS EMPLOYEE (
        EMP_ID INTEGER PRIMARY KEY,
        EMP_NAME TEXT NOT NULL,
        EMP_STATUS TEXT,
        DEPT_ID INTEGER REFERENCES DEPARTMENT(DEPT_ID)
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS APPR_DOC (
        DOC_ID INTEGER PRIMARY KEY,
        FOR_ID INTEGER,
        FOR_VERSION INTEGER,
        EMP_ID INTEGER REFERENCES EMPLOYEE(EMP_ID),
        COM_ID INTEGER REFERENCES COMPANY(COM_ID),
        DOC_TITLE TEXT NOT NULL,
        DOC_STATUS TEXT NOT NULL,
        IS_IMPORTANT INTEGER DEFAULT 0,
        DOC_REVISION INTEGER DEFAULT 0,
        CREATED_AT TIMESTAMP NOT NULL,
        UPDATED_AT TIMESTAMP NOT NULL
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS APPR_LINE (
        LIN_ID INTEGER PRIMARY KEY,
        DOC_ID INTEGER REFERENCES APPR_DOC(DOC_ID),
        EMP_ID INTEGER REFERENCES EMPLOYEE(EMP_ID),
        LIN_ORDER INTEGER NOT NULL,
        LIN_STATUS TEXT NOT NULL,
        LIN_APPROVED TIMESTAMP
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS APPR_LOG (
        LOG_ID INTEGER PRIMARY KEY,
        DOC_ID INTEGER REFERENCES APPR_DOC(DOC_ID),
        ORI_EMP_ID INTEGER REFERENCES EMPLOYEE(EMP_ID),
        ACT_EMP_ID INTEGER REFERENCES EMPLOYEE(EMP_ID),
        PER_EMP_ID INTEGER REFERENCES EMPLOYEE(EMP_ID),
        CREATED_AT TIMESTAMP NOT NULL
    )
    """,   
]

class Command(BaseCommand):
    help = "로컬 SQLite 개발 DB에 결재 도메인 테이블을 만든다 (운영 Oracle에는 사용하지 않음)"
    
    def handle(self, *arg, **options):
        with connection.cursor() as cursor:
            for stmt in DDL:
                cursor.execute(stmt)
        self.stdout.write(self.style.SUCCESS("개발용 스키마 생성 완료."))