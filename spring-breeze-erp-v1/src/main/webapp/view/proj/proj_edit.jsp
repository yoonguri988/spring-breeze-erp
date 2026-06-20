<%@page import="java.time.LocalDate"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp" %>

<div class="sb-page-head">
  <div class="sb-page-head__txt">
    <div class="sb-breadcrumb"><a href="${pageContext.request.contextPath}/index.jsp">홈</a> <i class="bi bi-chevron-right"></i> 업무 <i class="bi bi-chevron-right"></i> 프로젝트 <i class="bi bi-chevron-right"></i> 수정</div>
    <h1>프로젝트 수정</h1>
    <p>프로젝트 정보를 수정합니다.</p>
  </div>
</div>

<div class="sb-card">
  <div class="sb-card__body">
    <form action="${pageContext.request.contextPath}/proj/proj_edit" method="post" onsubmit="return check()">
      <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
      <input type="hidden" name="proId" value="${dto.proId}">

      <div class="mb-3">
        <label for="pro_name" class="sb-form-label">프로젝트명</label>
        <input type="text" id="pro_name" name="proName" class="form-control" value="${dto.proName}"/>
      </div>

      <div class="mb-3">
        <label for="pro_desc" class="sb-form-label">프로젝트 설명</label>
        <textarea id="pro_desc" name="proDesc" class="form-control" rows="4">${dto.proDesc}</textarea>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-md-4">
          <label for="pro_status" class="sb-form-label">상태</label>
          <select id="pro_status" name="proStatus" class="form-select">
            <option value="" disabled>상태를 선택하세요</option>
            <option value="TODO" ${dto.proStatus=='TODO' ? 'selected' : ''}>TODO</option>
            <option value="DOING" ${dto.proStatus=='DOING' ? 'selected' : ''}>DOING</option>
            <option value="DONE" ${dto.proStatus=='DONE' ? 'selected' : ''}>DONE</option>
          </select>
        </div>
        <div class="col-md-4">
          <label for="start_date" class="sb-form-label">시작일</label>
          <input type="date" id="start_date" name="startDate" class="form-control"
                 value="<fmt:formatDate value="${dto.startDate}" pattern="yyyy-MM-dd"/>"/>
        </div>
        <div class="col-md-4">
          <label for="end_date" class="sb-form-label">종료일</label>
          <input type="date" id="end_date" name="endDate" class="form-control"
                 value="<fmt:formatDate value="${dto.endDate}" pattern="yyyy-MM-dd"/>"/>
        </div>
      </div>

      <div class="mb-4">
        <label for="updated_at" class="sb-form-label">수정일</label>
        <input type="text" id="updated_at" class="form-control" value="${dto.updatedAt}" readonly style="max-width:200px;background:#fafbfc;"/>
      </div>

      <div class="sb-divider"></div>

      <div class="d-flex justify-content-end gap-2">
        <button type="reset" class="btn btn-ghost" title="글수정취소">취소</button>
        <a href="${pageContext.request.contextPath}/proj/proj_list" class="btn btn-ghost" title="목록보러가기">목록</a>
        <button type="submit" class="btn btn-sb" title="글수정">수정</button>
      </div>
    </form>
  </div>
</div>

<script>
function check(){
	 let proName = document.getElementById("pro_name");
	 let proDesc = document.getElementById("pro_desc");
	 let proStatus = document.getElementById("pro_status");
	 let startDate = document.getElementById("start_date");
	 let endDate = document.getElementById("end_date");

	 if(proName.value.trim()==""){proName.focus(); return false;}
	 if(proDesc.value.trim()==""){proDesc.focus(); return false;}
	 if(proStatus.value.trim()==""){proStatus.focus(); return false;}
	 if(startDate.value.trim()==""){startDate.focus(); return false;}
	 if(endDate.value.trim()==""){endDate.focus(); return false;}
	 return true;
}
</script>
<%@include file="/layout/footer.jsp" %>
