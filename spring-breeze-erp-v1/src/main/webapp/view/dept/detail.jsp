<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp" %>
<main class="sb-content">
    <!-- 페이지 헤더 -->
    <div class="sb-page-head">
        <div class="sb-page-head__txt">
            <div class="sb-breadcrumb">
                <a href="${pageContext.request.contextPath}/">홈</a>
                <i class="bi bi-chevron-right"></i>
                <a href="${pageContext.request.contextPath}/dept/detail?deptId=${dept.deptId}">부서 상세 현황</a>
                <i class="bi bi-chevron-right"></i>
                ${dept.deptName}
            </div>
            <h1>${dept.deptName}</h1>
            <p>${dept.deptCode}</p>
        </div>
        <div class="sb-page-head__actions">
            <a href="${pageContext.request.contextPath}/dept/list?comId=${dept.comId}" class="btn btn-ghost btn-sm">
                <i class="bi bi-arrow-left"></i> 목록으로
            </a>
        </div>
    </div>

    <!-- 내 소속 부서 안내 배너 (dept.css .my-dept-banner 재사용) -->
    <c:if test="${isMyDept}">
        <div class="my-dept-banner">
            <i class="bi bi-person-check-fill"></i>
            현재 내가 소속된 부서입니다.
        </div>
    </c:if>

    <!-- 부서 기본 정보 -->
    <div class="sb-card mb-3">
        <div class="sb-card__head">
            <h2><i class="bi bi-diagram-3 me-2 text-soft"></i>부서 기본 정보</h2>
            <div class="right">
                <span class="sb-badge sb-badge--gray">DEPT-<fmt:formatNumber value="${dept.deptId}" minIntegerDigits="3" groupingUsed="false"/></span>
                <span class="sql-chip ms-2"><i class="bi bi-database"></i>department</span>
            </div>
        </div>
        <div class="sb-card__body">
            <div class="row g-3">

                <!-- dept_id -->
                <div class="col-md-6">
                    <label class="dd-label">dept_id <code class="field-hint">INT PK</code></label>
                    <div class="view-val">${dept.deptId}</div>
                </div>

                <!-- dept_name -->
                <div class="col-md-6">
                    <label class="dd-label">dept_name <code class="field-hint">VARCHAR(100)</code></label>
                    <div class="view-val view-val--accent" style="font-weight:700">${dept.deptName}</div>
                </div>

                <!-- dept_code -->
                <div class="col-md-6">
                    <label class="dd-label">dept_code <code class="field-hint">VARCHAR(20)</code></label>
                    <div class="view-val"><span class="dept-code-chip">${dept.deptCode}</span></div>
                </div>

                <!-- depth -->
                <div class="col-md-6">
                    <label class="dd-label">depth <code class="field-hint">INT</code></label>
                    <div class="view-val">
                        <span class="depth-pill depth-pill--${dept.depth > 3 ? 3 : dept.depth}">${dept.depth}</span>
                        <span class="ms-1">${dept.depth}&#183;${dept.depth}</span>
                    </div>
                </div>

                <!-- sort_order -->
                <div class="col-md-6">
                    <label class="dd-label">sort_order <code class="field-hint">INT</code></label>
                    <div class="view-val">${dept.sortOrder}</div>
                </div>

                <!-- parent_id -->
                <div class="col-md-6">
                    <label class="dd-label">parent_id <code class="field-hint">INT FK &rarr; department (nullable)</code></label>
                    <div class="view-val">
                        <c:choose>
                            <c:when test="${not empty dept.parentId}">
                                <span class="dept-code-chip" style="background:var(--sb-accent-soft);color:var(--sb-accent)">${dept.parentName}</span>
                            </c:when>
                            <c:otherwise>
                                <span class="dept-code-chip">최상위 부서</span>
                                <span class="view-val-empty ms-1">NULL</span>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>

                <!-- emp_id (부서장) -->
                <div class="col-md-6">
                    <label class="dd-label">emp_id <code class="field-hint">INT FK &rarr; employee (nullable)</code> &middot; 부서장</label>
                    <div class="view-val">
                        <c:choose>
                            <c:when test="${not empty dept.leaderId}">
                                <span class="sb-avatar" style="width:22px;height:22px;font-size:11px">${fn:substring(dept.leaderName, 0, 1)}</span>
                                <span class="ms-1">${dept.leaderName} ${dept.leaderPosName}</span>
                                <span class="text-faint ms-1" style="font-size:11.5px">#${dept.leaderEmpNo}</span>
                            </c:when>
                            <c:otherwise><span class="view-val-empty">지정된 부서장 없음</span></c:otherwise>
                        </c:choose>
                    </div>
                </div>

                <!-- 계층 경로 -->
                <div class="col-12">
                    <label class="dd-label">계층 경로</label>
                    <div class="hier-preview">
                        <c:forEach var="node" items="${ancestorChain}" varStatus="vs">
                            <span class="hier-node ${vs.last ? 'hier-node--new' : ''}">${node}</span>
                            <c:if test="${not vs.last}"><i class="bi bi-chevron-right hier-sep"></i></c:if>
                        </c:forEach>
                    </div>
                </div>

            </div>
        </div>

        <div class="px-3 py-2 d-flex align-items-center gap-2"
             style="border-top:1px solid var(--sb-border); font-size:12px; color:var(--sb-ink-faint)">
            <i class="bi bi-info-circle"></i>
            <span class="sql-chip"><i class="bi bi-database"></i>SELECT * FROM department WHERE dept_id = :dept_id</span>
        </div>
    </div>

    <!-- 소속 사원 -->
    <div class="sb-card">
        <div class="sb-card__head">
            <h2><i class="bi bi-people me-2 text-soft"></i>소속 사원</h2>
            <div class="right">
                <span class="sb-badge sb-badge--gray">${deptEmpList.size()}명</span>
                <span class="sql-chip ms-2"><i class="bi bi-database"></i>SELECT * FROM employee WHERE dept_id = :dept_id</span>
            </div>
        </div>
        <div class="sb-card__body--flush">
            <table class="sb-table" id="empTable" style="${empty deptEmpList ? 'display:none' : ''}">
                <thead>
                    <tr>
                        <th style="width:70px">EMP_ID</th>
                        <th>이름 (EMP_NAME)</th>
                        <th style="width:110px">직급 (POS_ID)</th>
                        <th style="width:180px">이메일 (EMP_EMAIL)</th>
                        <th style="width:130px">연락처 (EMP_MOBILE)</th>
                        <th style="width:100px">상태 (EMP_STATUS)</th>
                        <th style="width:110px">입사일 (HIRE_DATE)</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach var="e" items="${deptEmpList}">
                        <%-- <tr class="${e.isMe ? 'dd-row-me' : ''}"> --%>
                        <tr>
                            <td class="sb-hr-cell tnum">${e.empId}</td>
                            <td>
                                <div class="sb-rowuser">
                                    <span class="sb-avatar" style="width:26px;height:26px;font-size:11.5px">
                                        ${fn:substring(e.empName, 0, 1)}
                                    </span>
                                    <span class="sb-table__name">${e.empName}</span>
                                    <%-- <c:if test="${e.isMe}"><span class="sb-badge sb-badge--blue" style="font-size:10.5px">나</span></c:if> --%>
                                </div>
                            </td>
                            <td>
                                ${e.posName}
                                <span class="text-faint" style="font-size:11px">#${e.posId}</span>
                            </td>
                            <td class="sb-hr-cell" style="font-size:12.5px">${e.empEmail}</td>
                            <td class="sb-hr-cell tnum" style="font-size:12.5px">${e.empMobile}</td>
                            <td>
                                <c:choose>
                                    <c:when test="${e.empStatus == '재직'}"><span class="sb-badge sb-badge--green">재직</span></c:when>
                                    <c:when test="${e.empStatus == '휴직'}"><span class="sb-badge sb-badge--amber">휴직</span></c:when>
                                    <c:when test="${e.empStatus == '원격'}"><span class="sb-badge sb-badge--cyan">원격</span></c:when>
                                    <c:otherwise><span class="sb-badge sb-badge--gray">${e.empStatus}</span></c:otherwise>
                                </c:choose>
                            </td>
                            <td class="sb-hr-cell" style="font-size:12.5px">${e.hireDate}</td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>
            <div class="sb-empty" id="empEmpty" style="${empty deptEmpList ? '' : 'display:none'}">
                <i class="bi bi-people"></i>
                <p>소속 사원이 없습니다.</p>
            </div>
        </div>
    </div>

</main>
<%@include file="/layout/footer.jsp" %>