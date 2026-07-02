<%@page import="java.time.LocalDate"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="/layout/header.jsp" %>
<script>
window.addEventListener("load",function(){
	let result = '${result}';
	console.log(result);

	if(result=="프로젝트 멤버 추가 실패"||result=="프로젝트 멤버 삭제 실패"){alert(result); history.go(-1);}
	else if (result.length!=0){alert(result);}
});
</script>
<main class="sb-content">
<div class="sb-page-head">
  <div class="sb-page-head__txt">
    <div class="sb-breadcrumb"><a href="${pageContext.request.contextPath}/index.jsp">홈</a> <i class="bi bi-chevron-right"></i> 업무 <i class="bi bi-chevron-right"></i> 프로젝트 <i class="bi bi-chevron-right"></i> 멤버관리</div>
    <h1>프로젝트 멤버관리</h1>
    <p>프로젝트에 참여하는 사원을 추가하거나 제외합니다.</p>
  </div>
  <div class="sb-page-head__actions">
    <a href="${pageContext.request.contextPath}/proj/proj_list" class="btn btn-ghost btn-sm"><i class="bi bi-list"></i> 목록</a>
    <button type="button" class="btn btn-sb btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="bi bi-person-plus"></i> 멤버 추가</button>
  </div>
</div>

<form id="memberCreateForm" action="${pageContext.request.contextPath}/proj/proj_member_create" method="post" onsubmit="return check()">
<input type="hidden" name="projectProId" value="${pro_id}">
<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />

<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title fs-5" id="exampleModalLabel">멤버추가</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body text-start">
        <div class="mb-3 position-relative">
          <label for="empName" class="sb-form-label">사원이름</label>
          <input class="form-control" name="empName" id="empName" value="${dto.empName}" autocomplete="off" />
          <ul id="empSearchResult" class="list-group position-absolute"
              style="z-index:1050; width:100%; display:none; max-height:200px; overflow-y:auto;"></ul>
        </div>
        <div class="mb-3">
          <label for="empId" class="sb-form-label">사원번호</label>
          <input type="text" class="form-control" id="empId" name="empId" value="${dto.empId}" readonly />
        </div>
        <div class="mb-3">
          <label for="role" class="sb-form-label">역할</label>
          <textarea class="form-control" name="role" id="role">${dto.role}</textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" data-bs-dismiss="modal">취소</button>
        <button type="submit" class="btn btn-sb">추가</button>
      </div>
    </div>
  </div>
</div>
</form>

<script>
window.addEventListener("load", function(){
    let empName = document.getElementById("empName");
    let empId = document.getElementById("empId");
    let resultList = document.getElementById("empSearchResult");

    empName.addEventListener("keyup", function(e){
        let value = e.target.value.trim();

        if(value !== ""){
            fetch("${pageContext.request.contextPath}/proj/empSearch?keyword="+encodeURIComponent(value))
            .then(response => response.json())
            .then(data => {
                resultList.innerHTML = "";
                if(data.length === 0){
                    resultList.innerHTML = "<li class='list-group-item text-muted'>검색결과 없음</li>";
                    resultList.style.display = "block";
                    return;
                }
                for(let i=0; i<data.length; i++){
                    let emp = data[i];
                    let li = document.createElement("li");
                    li.className = "list-group-item list-group-item-action";
                    li.style.cursor = "pointer";
                    li.textContent = emp.empName + " (" + emp.empNo + ")";

                    li.addEventListener("click", function(){
                        empName.value = emp.empName;
                        empId.value = emp.empId;
                        resultList.style.display = "none";
                        resultList.innerHTML = "";
                    });
                    resultList.appendChild(li);
                }
                resultList.style.display = "block";
            })
            .catch(err => {
                console.log("검색 오류:", err);
            });
        }
        else{
            resultList.style.display = "none";
            resultList.innerHTML = "";
            empId.value = "";
        }
    });

    document.addEventListener("click", function(e){
        if(e.target !== empName){
            resultList.style.display = "none";
        }
    });
});

function check(){
	 let empId = document.getElementById("empId");
	 let empName = document.getElementById("empName");
	 let role = document.getElementById("role");

	 if(empId.value.trim()==""){alert("사원을 검색해서 선택해주세요."); empName.focus(); return false;}
	 if(empName.value.trim()==""){empName.focus(); return false;}
	 if(role.value.trim()==""){role.focus(); return false;}
	 return true;
}
</script>

<div class="sb-card">
  <div class="sb-card__body--flush">
    <table class="sb-table">
      <thead>
        <tr>
          <th>프로젝트명</th>
          <th>부서</th>
          <th>사원</th>
          <th>역할</th>
          <th>등록일</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <c:forEach items="${list}" var="dto" varStatus="status">
          <tr>
            <td class="sb-table__name">${dto.proName}</td>
          	<td class="sb-table_dept">${dto.deptName}</td>
            <td>${dto.empName}</td>
            <td class="sb-table__muted">${dto.role}</td>
            <td class="sb-hr-cell tnum"><fmt:formatDate value="${dto.joinedAt}" pattern="yyyy-MM-dd"/></td>
            <td class="num"><a href="${pageContext.request.contextPath}/proj/proj_member_delete?pm_id=${dto.pmId}&pro_id=${pro_id}" class="btn btn-ghost btn-sm" style="color:var(--sb-red)"><i class="bi bi-trash3"></i> 삭제</a></td>
          </tr>
        </c:forEach>
      </tbody>
    </table>
    <c:if test="${empty list}">
      <div class="sb-empty"><i class="bi bi-people"></i><p>등록된 멤버가 없습니다.</p></div>
    </c:if>
  </div>
</div>
</main>
<%@include file="/layout/footer.jsp" %>
