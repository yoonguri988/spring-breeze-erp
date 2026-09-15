from django.db import models

# Create your models here.
class Department(models.Model):
    dept_id = models.BigIntegerField(primary_key=True, db_column="DEPT_ID")
    dept_name = models.CharField(max_length=100, db_column="DEPT_NAME")
    
    class Meta:
        managed = False
        db_table = "DEPARTMENT"
        
    def __str__(self):
        return self.dept_name

class Employee(models.Model):
    emp_id = models.BigIntegerField(primary_key=True, db_column="EMP_ID")
    emp_name = models.CharField(max_length=50, db_column="EMP_NAME")
    emp_status = models.CharField(max_length=20, db_column="EMP_STATUS", null=True)
    dept = models.ForeignKey(
        Department, db_column="DEPT_ID", on_delete=models.DO_NOTHING, null=True
    )
    
    class Meta:
        managed = False
        db_table = "EMPLOYEE"
        
    def __str__(self):
        return self.emp_name

class Company(models.Model):
    com_id = models.BigIntegerField(primary_key=True, db_column="COM_ID")
    com_name = models.CharField(max_length=100, db_column="COM_NAME")
    
    class Meta:
        managed = False
        db_table = "COMPANY"
        
    def __str__(self):
        return self.com_name

class ApprDoc(models.Model):
    doc_id = models.BigIntegerField(primary_key=True, db_column="DOC_ID")
    for_id = models.BigIntegerField(db_column="FOR_ID", null=True)
    for_version = models.BigIntegerField(db_column="FOR_VERSION", null=True)
    emp = models.ForeignKey(Employee, db_column="EMP_ID", on_delete=models.DO_NOTHING)
    com = models.ForeignKey(Company, db_column="COM_ID", on_delete=models.DO_NOTHING)
    doc_title = models.CharField(max_length=100, db_column="DOC_TITLE")
    doc_status = models.CharField(max_length=20, db_column="DOC_STATUS")
    is_important = models.BooleanField(db_column="IS_IMPORTANT", default=False)
    doc_revision = models.BigIntegerField(db_column="DOC_REVISION", default=0)
    created_at = models.DateTimeField(db_column="CREATED_AT")
    updated_at = models.DateTimeField(db_column="UPDATED_AT")
    
    class Meta:
        managed = False
        db_table = "APPR_DOC"
    
    def __str__(self):
        return self.doc_title
    
class ApprLine(models.Model):
    lin_id = models.BigIntegerField(primary_key=True, db_column="LIN_ID")
    doc = models.ForeignKey(
        ApprDoc, db_column="DOC_ID", on_delete=models.DO_NOTHING, related_name="lines"
    )
    emp = models.ForeignKey(Employee, db_column="EMP_ID", on_delete=models.DO_NOTHING)
    lin_order = models.IntegerField(db_column="LIN_ORDER")
    lin_status = models.CharField(max_length=20, db_column="LIN_STATUS")
    lin_approved = models.DateTimeField(db_column="LIN_APPROVED", null=True)
    
    class Meta:
        managed = False
        db_table = "APPR_LINE"
        ordering = ["doc_id", "lin_order"]
    
    def __str__(self):
        return f"{self.doc_id}-{self.lin_order}"
    
class ApprLog(models.Model):
    log_id = models.BigIntegerField(primary_key=True, db_column="LOG_ID")
    doc = models.ForeignKey(ApprDoc, db_column="DOC_ID", on_delete=models.DO_NOTHING, related_name="logs")
    ori_emp = models.ForeignKey(Employee, db_column="ORI_EMP_ID", on_delete=models.DO_NOTHING, related_name="+")
    act_emp = models.ForeignKey(Employee, db_column="ACT_EMP_ID", on_delete=models.DO_NOTHING, related_name="+")
    per_emp = models.ForeignKey(Employee, db_column="PER_EMP_ID", on_delete=models.DO_NOTHING, related_name="+")
    created_at = models.DateTimeField(db_column="CREATED_AT")
    
    class Meta:
        managed = False
        db_table = "APPR_LOG"
        
    def __str__(self):
        return f"log#{self.log_id} doc#{self.doc_id}"