<%@taglib  prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<li style="padding-left: ${dept.depth * 20}px" class="my-1">
    <c:choose>
        <c:when test="${not empty dept.children}">
            <button class="btn btn-sm btn-secondary me-1"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#children-${dept.deptId}"
                    aria-expanded="true">▼</button>
        </c:when>
        <c:otherwise>
            <span style="display:inline-block; width:30px;"></span>
        </c:otherwise>
    </c:choose>

    <c:if test="${dept.depth > 0}">
        <span class="text-muted me-1">└</span>
    </c:if>

    <span>${dept.deptNm}</span>

    <a class="btn btn-sm btn-outline-primary ms-1"
       href="${pageContext.request.contextPath}/dept/edit.do?deptId=${dept.deptId}">수정</a>
    <button class="btn btn-sm btn-outline-danger"
            data-dept-id="${dept.deptId}"
            data-bs-toggle="modal"
            data-bs-target="#deleteModal">삭제</button>
</li>

<%-- 하위 부서 재귀 출력 --%>
<c:if test="${not empty dept.children}">
    <div class="collapse show" id="children-${dept.deptId}">
        <ul class="list-unstyled">
            <c:forEach var="child" items="${dept.children}">
                <c:set var="dept" value="${child}" scope="request"/>
                <jsp:include page="deptItem.jsp"/>  <%-- 재귀 --%>
            </c:forEach>
        </ul>
    </div>
</c:if>