<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@taglib uri="http://www.springframework.org/security/tags" prefix="sec" %> 

<%@ include file="/layout/header.jsp" %>
<%-- ================= 접근 불가 ================= --%>
<%-- <c:if test="${sessionScope.role != 'ROOT' && sessionScope.role != 'ROLE_ADMIN'}"> --%>
<sec:authorize access="!hasAuthority('ROOT') and !hasRole('ROLE_ADMID')">
  <div id="accessDenied" style="display:block">
    <div class="denied-card">
      <div class="denied-ico"><i class="bi bi-shield-x"></i></div>
      <div class="denied-title">접근 권한이 없습니다</div>
      <div class="denied-body">
        역할 관리 페이지는 <strong>ROOT</strong> 및 <strong>ROLE_ADMIN</strong> 계정만 접근할 수 있습니다.<br>
        접근이 필요하면 시스템 관리자에게 문의하세요.
      </div>
      <a class="btn btn-ghost btn-sm" href="${pageContext.request.contextPath}/index">홈으로</a>
    </div>
  </div>
</sec:authorize>

<%-- ================= 메인 뷰 ================= --%>
<sec:authorize access="hasAuthority('ROOT') or hasRole('ROLE_ADMID')">
<main class="sb-content">
  <div class="sb-page-head">
    <div class="sb-page-head__txt">
      <div class="sb-breadcrumb">
        <a href="${pageContext.request.contextPath}/">홈</a>
        <i class="bi bi-chevron-right"></i>
        조직 관리
        <i class="bi bi-chevron-right"></i>
        <a href="${pageContext.request.contextPath}/auth/list">권한 관리</a>
        <i class="bi bi-chevron-right"></i>
        역할 관리
      </div>
      <h1>역할 관리</h1>
      <p>회사별 역할(authority)을 등록·수정·삭제합니다. 역할에 따른 접근 제어는 애플리케이션 서버에서 적용됩니다.</p>
    </div>
    <div class="sb-page-head__actions">

      <%-- ROOT : 회사 검색 --%>
      <sec:authorize access="hasAuthority('ROOT')">
        <div class="com-search-wrap" id="rootComWrap">
          <input type="text" class="form-control form-control-sm selected" id="rootComName"
                 value="${not empty com ? com.comName : ''}" placeholder="회사 선택" readonly />
          <button type="button" class="btn btn-ghost btn-sm" id="btnRootComSearch">
            <i class="bi bi-search"></i> 회사 검색
          </button>
        </div>
      </sec:authorize>

      <%-- ROLE_ADMIN : 고정 회사 표시 --%>
      <sec:authorize access="hasRole('ROLE_ADMID')">
        <div id="adminComWrap" style="display:flex;align-items:center;gap:8px">
          <div style="display:flex;align-items:center;gap:7px;padding:5px 12px;background:var(--sb-accent-soft);border:1px solid var(--sb-accent-soft-2);border-radius:8px;font-size:13px">
            <i class="bi bi-building" style="color:var(--sb-accent)"></i>
            <span style="font-weight:650;color:var(--sb-ink)">${sessionScope.comName}</span>
          </div>
        </div>
      </sec:authorize>

      <a class="btn btn-ghost btn-sm" href="#">
        <i class="bi bi-shield-lock"></i> 사원 권한 부여
      </a>
      <a class="btn btn-sb btn-sm" id="rmAdd"
         href="${pageContext.request.contextPath}/auth/add?comId=${sessionScope.comId}">
        <i class="bi bi-plus-lg"></i> 역할 등록
      </a>
    </div>
  </div>

  <div class="row g-3">

    <%-- ───────── 역할 목록 ───────── --%>
    <div class="col-12 col-lg-4">
      <div class="sb-card">
        <div class="sb-card__head">
          <h2>역할 목록</h2>
          <span class="sub">${fn:length(authList)}개 역할</span>
        </div>
        <div class="sb-card__body" style="display:flex;flex-direction:column;gap:4px" id="roleList">
          <c:if test="${empty authList}">
            <div class="sb-empty" style="padding:40px 20px"><i class="bi bi-shield-slash"></i><p>등록된 역할이 없습니다.</p></div>
          </c:if>
          <c:forEach var="item" items="${authList}">
            <a class="role-item ${item.autId == selectedRole.autId ? 'sel' : ''}"
               href="${pageContext.request.contextPath}/auth/list?autId=${item.autId}&comId=${item.comId}">
                <span class="rm-code">${item.autName}</span>
              	<span class="sb-badge sb-badge--gray">${item.autCount}명</span>
            </a>
          </c:forEach>
        </div>
      </div>
    </div>

    <%-- ───────── 역할 상세 ───────── --%>
    <div class="col-12 col-lg-8">
      <div class="sb-card" id="roleDetail">
        <c:if test="${empty selectedRole}">
          <div class="sb-empty" style="padding:60px 20px"><i class="bi bi-shield-slash"></i><p>등록된 역할이 없습니다.<br>'역할 등록'으로 새 역할을 만드세요.</p></div>
        </c:if>
        <c:if test="${not empty selectedRole}">
          <div class="sb-card__head">
            <div style="flex:1 1 auto">
              <span class="rm-code rm-code--lg">${selectedRole.autName}</span>
            </div>
            <div class="right" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <span class="sb-badge sb-badge--gray">${selectedRole.autCount}명 부여</span>
              <a class="btn btn-ghost btn-sm"
                 href="${pageContext.request.contextPath}/auth/edit?autId=${selectedRole.autId}&comId=${selectedRole.comId}&autName=${selectedRole.autName}&holders=${selectedRole.autCount}">
                <i class="bi bi-pencil"></i> 수정
              </a>
              <a class="btn btn-ghost btn-sm"
                 href="${pageContext.request.contextPath}/auth/delete?autId=${selectedRole.autId}&comId=${selectedRole.comId}&autName=${selectedRole.autName}&holders=${selectedRole.autCount}">
                <i class="bi bi-trash3"></i> 삭제
              </a>
            </div>
          </div>

          <div class="rm-note">
            <i class="bi bi-hdd-network"></i>
            <div>이 역할로 접근 가능한 기능·메뉴는 <b>애플리케이션 서버(Java)</b>에서 권한 검사로 처리됩니다.
              본 화면은 역할을 등록·관리하고, 해당 역할이 <b>누구에게 부여되었는지</b>를 확인하는 용도입니다.</div>
          </div>

          <div class="rm-sub"><h3>이 역할이 부여된 사원</h3><span class="sub">${fn:length(empList)}명</span></div>

          <div class="sb-card__body--flush">
            <table class="sb-table">
              <thead><tr><th>사원</th><th>부서</th><th>직급</th></tr></thead>
              <tbody>
                <c:if test="${empty empList}">
                  <tr><td colspan="3">
                    <div class="sb-empty" style="padding:30px 20px"><i class="bi bi-people"></i><p>이 역할이 부여된 사원이 없습니다.</p></div>
                  </td></tr>
                </c:if>
                <c:forEach var="h" items="${empList}">
                  <tr>
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <div class="sb-avatar"><c:out value="${fn:substring(h.empName,0,1)}" /></div>
                        <div>
                          <div class="sb-table__name">${h.empName}</div>
                          <div class="pm-empno">${h.empNo}</div>
                        </div>
                      </div>
                    </td>
                    <td>${h.deptName}</td>
                    <td>${h.posName}</td>
                  </tr>
                </c:forEach>
              </tbody>
            </table>
          </div>
        </c:if>
      </div>
    </div>
  </div>
</main>
</sec:authorize>

<%-- ================== ROOT 회사 검색 모달 ================== --%>
<sec:authorize access="hasAuthority('ROOT')">
<div class="modal fade" id="comSearchModal" tabindex="-1" aria-labelledby="comSearchModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" style="max-width:560px">
    <div class="modal-content">
      <div class="modal-header">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:34px;height:34px;border-radius:8px;background:var(--sb-accent-soft);color:var(--sb-accent);display:grid;place-items:center;font-size:17px;flex:0 0 auto">
            <i class="bi bi-building-check"></i>
          </div>
          <h5 class="modal-title" id="comSearchModalLabel">회사 검색</h5>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="닫기"></button>
      </div>
      <div style="padding:14px 18px;border-bottom:1px solid var(--sb-border)">
        <div class="sb-field sb-field--search" style="width:100%">
          <i class="bi bi-search"></i>
          <input type="text" class="form-control" id="comSearchInput" placeholder="회사명 또는 사업자번호를 입력하세요" style="width:100%" autocomplete="off" />
        </div>
      </div>

      <div class="com-modal-list" id="comModalList" style="height:340px;overflow-y:auto;position:relative">
        <div class="com-modal-empty" id="comModalGuide">
          <i class="bi bi-search"></i>
          회사명 또는 사업자번호를 입력하세요.
        </div>

        <div class="com-modal-empty" id="comModalNoResult" style="display:none">
          <i class="bi bi-building-slash"></i>
          검색 결과가 없습니다.
        </div>

        <c:forEach var="com" items="${companyList}">
          <div class="com-modal-row" style="display:none"
               data-search="${fn:toLowerCase(com.comName)} ${com.bizNo}">
            <div class="com-modal-logo">
              <c:choose>
                <c:when test="${not empty com.comLogo}">
                  <img src="${com.comLogo}" alt="${com.comName}" />
                </c:when>
                <c:otherwise>
                  ${fn:substring(com.comName,0,1)}
                </c:otherwise>
              </c:choose>
            </div>
            <div style="flex:1 1 auto;min-width:0">
              <div class="com-modal-name">${com.comName}</div>
              <div class="com-modal-meta">${com.industName} · 대표 ${com.comCeo}</div>
            </div>
            <a href="${pageContext.request.contextPath}/auth/list?comId=${com.comId}" style="position:absolute;inset:0"></a>
          </div>
        </c:forEach>

      </div>
    </div>
  </div>
</div>
</sec:authorize>

<script>
(function () {
	  "use strict";

	  var input     = document.getElementById("comSearchInput");
	  var guide     = document.getElementById("comModalGuide");
	  var noResult  = document.getElementById("comModalNoResult");

	  if (input) {
	    input.addEventListener("input", function () {
	      var q = input.value.trim().toLowerCase();
	      var rows = document.querySelectorAll("#comModalList .com-modal-row");

	      if (!q) {
	        // 입력값 없으면 전부 숨기고 안내문만 표시
	        rows.forEach(function (row) { row.style.display = "none"; });
	        guide.style.display = "block";
	        noResult.style.display = "none";
	        return;
	      }

	      guide.style.display = "none";

	      var matchCount = 0;
	      rows.forEach(function (row) {
	        var hit = (row.dataset.search || "").includes(q);
	        row.style.display = hit ? "" : "none";
	        if (hit) matchCount++;
	      });

	      noResult.style.display = matchCount === 0 ? "block" : "none";
	    });
	  }

	  var $btn = document.getElementById("btnRootComSearch");
	  if ($btn) {
	    $btn.addEventListener("click", function () {
	      var modal = new bootstrap.Modal(document.getElementById("comSearchModal"));
	      modal.show();
	      setTimeout(function () { input && input.focus(); }, 300);
	    });
	  }
	})();
</script>
<%@ include file="/layout/footer.jsp" %>
