<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="../inc/header.jsp"%>
<div class="container card my-5">
    <h3 class="card-header">company form</h3>
    <div class="mb-3">
    	<a class="btn btn-info" href="${pageContext.request.contextPath}/dept/add.do?companyId=${companyId}">부서 등록</a>
    </div>
    <div class="mb-3">
        <ul class="list-unstyled p-3">
            <c:forEach var="dept" items="${items}">
                <%-- depth=0 루트만 여기서 출력 --%>
                <c:set var="dept" value="${dept}" scope="request"/>
                <jsp:include page="deptItem.jsp"/>
            </c:forEach>
        </ul>
    </div>
</div>
<script>
document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(btn => {
        const target = document.querySelector(btn.dataset.bsTarget);

        if (target) {
            // 자기 자신의 target 이벤트만 감지하도록 정확히 매칭
            target.addEventListener('show.bs.collapse', (e) => {
                if (e.target.id === target.id) {  // 이벤트 발생 대상이 정확히 내 target일 때만
                    btn.textContent = '▲';
                }
            });
            target.addEventListener('hide.bs.collapse', (e) => {
                if (e.target.id === target.id) {
                    btn.textContent = '▼';
                }
            });
        }
    });
</script>
<%@include file="../inc/footer.jsp"%>