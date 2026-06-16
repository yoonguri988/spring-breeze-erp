<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<li class="dept-item" style="padding-left:${dept.depth * 24}px;">
    <div class="dept-row d-flex align-items-center gap-1 py-1">
        <%-- 펼침/접힘 토글 버튼 --%>
        <c:choose>
            <c:when test="${not empty dept.children}">
                <button class="btn btn-sm btn-light border toggle-btn p-0"
                        style="width:22px; height:22px; line-height:1; font-size:11px;"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#children-${dept.deptId}"
                        aria-expanded="true">
                    <i class="bi bi-dash"></i>
                </button>
            </c:when>
            <c:otherwise>
                <span style="display:inline-block; width:22px;"></span>
            </c:otherwise>
        </c:choose>
        <%-- depth 표시 --%>
        <c:if test="${dept.depth > 0}">
            <span class="text-muted" style="font-size:13px;">└</span>
        </c:if>
        <%-- 부서 아이콘 + 이름 --%>
        <c:choose>
            <c:when test="${dept.depth == 0}">
                <i class="bi bi-building text-primary" style="font-size:14px;"></i>
            </c:when>
            <c:when test="${dept.depth == 1}">
                <i class="bi bi-grid text-secondary" style="font-size:13px;"></i>
            </c:when>
            <c:otherwise>
                <i class="bi bi-people text-muted" style="font-size:13px;"></i>
            </c:otherwise>
        </c:choose>

        <span class="dept-nm fw-medium" style="font-size:14px;">${dept.deptName}</span>

        <c:if test="${not empty dept.deptCode}">
            <span class="badge bg-light text-muted border" style="font-size:10px; font-weight:400;">${dept.deptCode}</span>
        </c:if>
        <%-- 액션 버튼 --%>
        <div class="ms-auto d-flex gap-1">
            <a class="btn btn-outline-primary btn-sm py-0 px-2"
               style="font-size:12px;"
               href="${pageContext.request.contextPath}/dept/add.do?comId=${dept.comId}&parentId=${dept.deptId}"
               title="하위 부서 추가">
                <i class="bi bi-plus"></i>
            </a>
            <a class="btn btn-outline-secondary btn-sm py-0 px-2"
               style="font-size:12px;"
               href="${pageContext.request.contextPath}/dept/edit.do?deptId=${dept.deptId}"
               title="수정">
                <i class="bi bi-pencil"></i>
            </a>
            <a class="btn btn-outline-danger btn-sm py-0 px-2"
               style="font-size:12px;"
               href="${pageContext.request.contextPath}/dept/delete.do?deptId=${dept.deptId}"
               title="삭제"
               onclick="return confirm('${dept.deptName} 부서를 삭제하시겠습니까?')">
                <i class="bi bi-trash"></i>
            </a>
        </div>
    </div>
</li>
<%-- 하위 부서 재귀 출력 --%>
<c:if test="${not empty dept.children}">
    <div class="collapse show" id="children-${dept.deptId}">
        <ul class="list-unstyled mb-0">
            <c:forEach var="child" items="${dept.children}">
                <c:set var="dept" value="${child}" scope="request"/>
                <jsp:include page="deptItem.jsp"/>
            </c:forEach>
        </ul>
    </div>
</c:if>
