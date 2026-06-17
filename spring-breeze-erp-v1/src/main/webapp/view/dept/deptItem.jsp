<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%--
  재귀 포함 파일: deptItem.jsp
  request scope 변수 'dept' 를 읽어 한 행을 렌더링하고,
  dept.children 이 있으면 자기 자신을 재귀 include.

  사용하는 DB 컬럼:
    dept_id, com_id, parent_id, dept_name, dept_code,
    depth, sort_order, emp_id, created_at, updated_at
--%>
<li class="dept-item" style="padding-left:${dept.depth * 24}px;">
    <div class="dept-row d-flex align-items-center gap-1 py-1">

        <%-- 펼침/접힘 토글 (자식이 있을 때만) --%>
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

        <%-- depth 별 들여쓰기 기호 --%>
        <c:if test="${dept.depth > 0}">
            <span class="text-muted" style="font-size:13px;">└</span>
        </c:if>

        <%-- depth 별 아이콘 (depth 컬럼 활용) --%>
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

        <%-- dept_name --%>
        <span class="dept-nm fw-medium" style="font-size:14px;">${dept.deptName}</span>

        <%-- dept_code badge --%>
        <c:if test="${not empty dept.deptCode}">
            <span class="badge bg-light text-muted border"
                  style="font-size:10px; font-weight:400;">${dept.deptCode}</span>
        </c:if>

        <%-- emp_id → 담당자명 (empName 은 JOIN 결과) --%>
        <%-- <c:if test="${not empty dept.empName}">
            <span class="text-muted" style="font-size:11px;">
                <i class="bi bi-person-fill me-1"></i>${dept.empName}
            </span>
        </c:if> --%>

        <%-- 액션 버튼 --%>
        <div class="ms-auto d-flex gap-1">
            <%-- 하위 부서 추가 — comId, parentId(=현재 dept_id) 전달 --%>
            <a class="btn btn-outline-primary btn-sm py-0 px-2"
               style="font-size:12px;"
               href="${pageContext.request.contextPath}/dept/add?comId=${dept.comId}&parentId=${dept.deptId}"
               title="하위 부서 추가">
                <i class="bi bi-plus"></i>
            </a>
            <%-- 수정 --%>
            <a class="btn btn-outline-secondary btn-sm py-0 px-2"
               style="font-size:12px;"
               href="${pageContext.request.contextPath}/dept/edit?deptId=${dept.deptId}"
               title="수정">
                <i class="bi bi-pencil"></i>
            </a>
            <%-- 삭제 — GET href 는 CSRF 취약, POST form 방식으로 처리
                 list.jsp 에 선언된 #deleteForm 을 공유 --%>
            <button type="button"
                    class="btn btn-outline-danger btn-sm py-0 px-2"
                    style="font-size:12px;"
                    title="삭제"
                    onclick="confirmDelete(${dept.deptId}, '${dept.deptName}')">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    </div>
</li>

<%-- 하위 부서 재귀 출력 (dept.children → DB의 parent_id 관계) --%>
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
