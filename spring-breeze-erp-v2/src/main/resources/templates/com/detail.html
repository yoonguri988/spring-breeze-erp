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
                <a href="${pageContext.request.contextPath}/com/my">회사 정보</a>
                <i class="bi bi-chevron-right"></i>
                ${com.comName}
            </div>
            <h1>${com.comName} 회사 정보</h1>
            <p>${com.comName} 회사의 기본 정보와 조직도를 확인합니다.</p>
        </div>
        <div class="sb-page-head__actions">
        <a href="${pageContext.request.contextPath}/com/list" class="btn btn-ghost btn-sm">
            <i class="bi bi-arrow-left"></i> 목록으로
        </a>
    </div>
    </div>

    <!-- 회사 요약 카드 -->
    <div class="sb-card mc-summary mb-3">
        <div class="mc-logo">
            <c:choose>
                <c:when test="${not empty com.comLogo}">
                    <img src="${pageContext.request.contextPath}${com.comLogo}" alt="${com.comName}">
                </c:when>
                <c:otherwise>${fn:substring(com.comName, 0, 1)}</c:otherwise>
            </c:choose>
        </div>
        <div class="mc-summary__main">
            <div class="mc-summary__name">${com.comName}</div>
            <div class="mc-summary__sub">대표 ${com.comCeo}</div>
        </div>
        <div class="mc-stat-divider"></div>
        <div class="mc-stat-col">
            <div class="mc-stat-col__label">총 임직원</div>
            <div class="mc-stat-col__val">${stats.empTotal}명</div>
        </div>
        <div class="mc-stat-col">
            <div class="mc-stat-col__label">본부</div>
            <div class="mc-stat-col__val">${stats.dept0Total}</div>
        </div>
        <div class="mc-stat-col">
            <div class="mc-stat-col__label">부서/팀</div>
            <div class="mc-stat-col__val">${stats.dept1Total}</div>
        </div>
    </div>

    <!-- 본문 2단 구성 -->
    <div class="row g-3">

        <!-- 좌측 : 회사 기본 정보 -->
        <div class="col-lg-5">
            <div class="sb-card h-100">
                <div class="sb-card__head">
                    <h2>회사 기본 정보</h2>
                </div>
                <div class="sb-card__body">

                    <div class="mc-info-row">
                        <div class="mc-info-icon"><i class="bi bi-building"></i></div>
                        <div>
                            <div class="mc-info-label">회사명</div>
                            <div class="mc-info-val">${com.comName}</div>
                        </div>
                    </div>

                    <div class="mc-info-row">
                        <div class="mc-info-icon"><i class="bi bi-person-badge"></i></div>
                        <div>
                            <div class="mc-info-label">대표자</div>
                            <div class="mc-info-val">${com.comCeo}</div>
                        </div>
                    </div>

                    <div class="mc-info-row">
                        <div class="mc-info-icon"><i class="bi bi-card-text"></i></div>
                        <div>
                            <div class="mc-info-label">사업자등록번호</div>
                            <div class="mc-info-val">${com.bizNo}</div>
                        </div>
                    </div>

                    <div class="mc-info-row">
                        <div class="mc-info-icon"><i class="bi bi-telephone"></i></div>
                        <div>
                            <div class="mc-info-label">대표 전화</div>
                            <div class="mc-info-val">${com.comTel}</div>
                        </div>
                    </div>

                    <div class="mc-info-row">
                        <div class="mc-info-icon"><i class="bi bi-tag"></i></div>
                        <div>
                            <div class="mc-info-label">업종</div>
                            <div class="mc-info-val">
                                ${com.industName}
                                <span class="text-faint" style="font-weight:500">(${com.industCode})</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 우측 : 조직도 (읽기전용) -->
        <div class="col-lg-7">
            <div class="sb-card h-100">
                <div class="sb-card__head">
                    <h2>조직도</h2>
                </div>
				<div class="sb-card__body--flush">
				    <div class="mc-org">
				        <c:forEach var="dept" items="${deptList}">
				            <c:choose>
				                <c:when test="${dept.depth == 0}"><c:set var="curTone" value="blue"/></c:when>
				                <c:when test="${dept.depth == 1}"><c:set var="curTone" value="green"/></c:when>
				                <c:when test="${dept.depth == 2}"><c:set var="curTone" value="amber"/></c:when>
				                <c:otherwise><c:set var="curTone" value="cyan"/></c:otherwise>
				            </c:choose>
				            <div class="mc-org-row depth-${dept.depth} tone-${curTone}">
				                <div class="mc-org-icon">
				                    <i class="bi ${dept.depth == 1 ? 'bi-diagram-3-fill' : 'bi-people-fill'}"></i>
				                </div>
				                <div class="mc-org-name">
				                    ${dept.deptName}
				                    <c:if test="${not empty dept.leaderName}">
				                        <span class="mc-org-lead">${dept.leaderName} 부서장</span>
				                    </c:if>
				                </div>
				                <span class="sb-badge sb-badge--gray mc-org-count">${dept.empCount}명</span>
				            </div>
				        </c:forEach>
				    </div>
				</div>
            </div>
        </div>

    </div>

</main>
<%@include file="/layout/footer.jsp" %>