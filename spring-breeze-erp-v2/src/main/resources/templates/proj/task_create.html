<%@page import="java.time.LocalDate"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp" %>
<%String today = LocalDate.now().toString(); %>
<main class="sb-content">
<div class="sb-page-head">
  <div class="sb-page-head__txt">
    <div class="sb-breadcrumb"><a href="${pageContext.request.contextPath}/index.jsp">홈</a> <i class="bi bi-chevron-right"></i> 업무 <i class="bi bi-chevron-right"></i> 프로젝트 <i class="bi bi-chevron-right"></i> 태스크 생성</div>
    <h1>태스크 생성</h1>
    <p>프로젝트에 새 태스크를 추가합니다.</p>
  </div>
</div>

<div class="sb-card">
  <div class="sb-card__body">
    <form action="${pageContext.request.contextPath}/proj/task_create" method="post" onsubmit="return check()">
      <input type="hidden" name="proId" value="${pro_id}" />
      <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />

      <div class="mb-3">
        <label for="task_name" class="sb-form-label">태스크명</label>
        <input type="text" id="task_name" name="taskName" class="form-control" placeholder="태스크명을 입력하세요"/>
      </div>

      <div class="mb-3">
        <label for="task_desc" class="sb-form-label">태스크 설명</label>
        <textarea id="task_desc" name="taskDesc" class="form-control" rows="4" placeholder="태스크에 대한 설명을 입력하세요"></textarea>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-md-4">
          <label for="task_status" class="sb-form-label">상태</label>
          <select id="task_status" name="taskStatus" class="form-select">
            <option value="" disabled selected>상태를 선택하세요</option>
            <option value="TODO">TODO</option>
            <option value="DOING">DOING</option>
            <option value="DONE">DONE</option>
          </select>
        </div>
        <div class="col-md-4">
          <label for="pm_id_name" class="sb-form-label">담당자</label>
          <select id="pm_id_name" name="pmId" class="form-select">
            <option value="" disabled selected>담당자선택</option>
            <c:forEach items="${memberlist}" var="m">
              <option value="${m.pmId}">${m.empName}</option>
            </c:forEach>
          </select>
        </div>
        <div class="col-md-4">
          <label for="reg_date" class="sb-form-label">등록일</label>
          <input type="text" id="reg_date" class="form-control" value="<%= today %>" readonly style="background:#fafbfc;"/>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <label for="task_start_date" class="sb-form-label">시작일</label>
          <input type="date" id="task_start_date" name="taskStartDate" class="form-control" />
        </div>
        <div class="col-md-6">
          <label for="task_end_date" class="sb-form-label">종료일</label>
          <input type="date" id="task_end_date" name="taskEndDate" class="form-control" />
        </div>
      </div>

      <div class="sb-divider"></div>

      <div class="d-flex justify-content-end gap-2">
        <button type="reset" class="btn btn-ghost" title="글취소">취소</button>
        <a href="${pageContext.request.contextPath}/proj/proj_list" class="btn btn-ghost" title="목록보러가기">목록</a>
        <button type="submit" class="btn btn-sb" title="등록">등록</button>
      </div>
    </form>
  </div>
</div>
</main>
<script>
function check(){
	 let taskName = document.getElementById("task_name");
	 let taskDesc = document.getElementById("task_desc");
	 let taskStatus = document.getElementById("task_status");
	 let pmId = document.getElementById("pm_id_name");
	 let taskStartDate = document.getElementById("task_start_date");
	 let taskEndDate = document.getElementById("task_end_date");

	 if(taskName.value.trim()==""){taskName.focus(); return false;}
	 if(taskDesc.value.trim()==""){taskDesc.focus(); return false;}
	 if(taskStatus.value.trim()==""){taskStatus.focus(); return false;}
	 if(pmId.value.trim()==""){pmId.focus(); return false;}
	 if(taskStartDate.value.trim()==""){taskStartDate.focus(); return false;}
	 if(taskEndDate.value.trim()==""){taskEndDate.focus(); return false;}
	 return true;
}
</script>
<%@include file="/layout/footer.jsp" %>
