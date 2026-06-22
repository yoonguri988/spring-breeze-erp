<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@include file="/layout/header.jsp"%>

<%--
  ══════════════════════════════════════════════════════════════════
  부서 등록 : dept/addForm.jsp
  (웹퍼블리셔 제공 add.html / dept.css 디자인 반영)

  필요한 모델 변수 (Controller → Model):
    comId      - 소속 회사 ID (request scope, 보통 쿼리 파라미터로 전달됨)
    comName    - 소속 회사명 (읽기전용 표시용)
    deptList   - List<DeptDto> 해당 회사의 전체 부서 (상위부서 선택 + depth/미리보기 계산용)
                 각 항목: deptId, deptName, deptCode, depth, parentId, sortOrder
    empList    - List<EmpDto> 해당 회사의 전체 사원 (부서장 선택용)
                 각 항목: empId, empName, empNo, posName

  returnUrl (선택, 쿼리 파라미터) : 등록 완료/취소 후 돌아갈 경로.
  com/edit.jsp 의 "부서관리" 탭에서 "부서 등록"으로 들어온 경우
  /com/edit?comId=... 가 들어오고, 그 외(단독 부서관리 메뉴)에서는
  비어있으므로 기본값(/dept/list?comId=...)으로 복귀한다.
  ══════════════════════════════════════════════════════════════════
--%>
<c:set var="backUrl">
    <c:choose>
        <c:when test="${not empty param.returnUrl}">${param.returnUrl}</c:when>
        <c:otherwise>${pageContext.request.contextPath}/dept/list?comId=${param.comId}</c:otherwise>
    </c:choose>
</c:set>

<%-- 서버 오류 메시지 --%>
<c:if test="${not empty errorMsg}">
<div class="position-fixed bottom-0 end-0 p-3" style="z-index:1100">
    <div class="toast align-items-center text-bg-danger border-0 show" role="alert">
        <div class="d-flex">
            <div class="toast-body"><i class="bi bi-exclamation-triangle-fill me-1"></i>${errorMsg}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    </div>
</div>
</c:if>

<main class="sb-content">

    <!-- 페이지 헤더 -->
    <div class="sb-page-head">
        <div class="sb-page-head__txt">
            <div class="sb-breadcrumb">
                <a href="${pageContext.request.contextPath}/index">홈</a>
                <i class="bi bi-chevron-right"></i>
                <a href="${backUrl}">부서 관리</a>
                <i class="bi bi-chevron-right"></i>
                등록
                <span class="admin-tag ms-2">관리자</span>
            </div>
            <h1>부서 등록</h1>
            <p>새로운 부서를 시스템에 등록합니다. — <code style="font-size:12px">department</code> 테이블</p>
        </div>
        <div class="sb-page-head__actions">
            <a href="${backUrl}" class="btn btn-ghost btn-sm"><i class="bi bi-arrow-left"></i> 목록으로</a>
        </div>
    </div>

    <form id="deptForm" novalidate method="post"
          action="${pageContext.request.contextPath}/dept/add?comId=${com.comId}">
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
        <c:if test="${not empty param.returnUrl}">
            <input type="hidden" name="returnUrl" value="${param.returnUrl}"/>
        </c:if>

        <!-- ① 기본 정보 -->
        <div class="sb-card mb-3">
            <div class="sb-card__head">
                <h2><i class="bi bi-diagram-3 me-2 text-soft"></i>기본 정보</h2>
                <div class="right">
                    <span class="sql-chip"><i class="bi bi-database"></i>department</span>
                </div>
            </div>
            <div class="sb-card__body">
                <div class="row g-3">
                    <!-- dept_name -->
                    <div class="col-md-8">
                        <label class="sb-form-label">
                            부서명 <span style="color:var(--sb-red)">*</span>
                            <code class="field-hint">dept_name VARCHAR(100)</code>
                        </label>
                        <input type="text" class="form-control" id="fName" name="deptName"
                               placeholder="예: 플랫폼개발팀" maxlength="100"
                               oninput="sbUpdatePreview()" required>
                        <div class="invalid-feedback" id="eName">부서명을 입력하세요.</div>
                    </div>
                    <!-- dept_code -->
                    <div class="col-md-4">
                        <label class="sb-form-label">
                            부서코드 <span style="color:var(--sb-red)">*</span>
                            <code class="field-hint">dept_code VARCHAR(45)</code>
                        </label>
                        <input type="text" class="form-control" id="fCode" name="deptCode"
                               placeholder="예: PLT" maxlength="45" style="text-transform:uppercase"
                               oninput="this.value=this.value.toUpperCase()"
                               onblur="sbCheckDeptCode()" required>
                        <div class="text-faint mt-1" style="font-size:12px">영문 대문자 · 숫자 권장</div>
                        <div class="invalid-feedback" id="eCode">부서코드를 입력하세요.</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ② 소속 및 계층 -->
        <div class="sb-card mb-3">
            <div class="sb-card__head">
                <h2><i class="bi bi-sitemap me-2 text-soft"></i>소속 및 계층</h2>
                <div class="right">
                    <span class="sql-chip"><i class="bi bi-database"></i>com_id · parent_id · depth · sort_order</span>
                </div>
            </div>
            <div class="sb-card__body">
                <div class="row g-3">

                    <!-- com_id (읽기전용, 목록에서 이미 선택된 회사) -->
                    <div class="col-md-6">
                        <label class="sb-form-label">
                            소속 회사
                            <code class="field-hint">com_id INT(11)</code>
                        </label>
                        <input type="text" class="form-control" readonly
                               value="${com.comName}" style="background:#fafbfc;color:var(--sb-ink-soft)">
                        <input type="hidden" name="comId" value="${com.comId}">
                    </div>

                    <!-- parent_id -->
                    <div class="col-md-6">
                        <label class="sb-form-label">
                            상위 부서
                            <code class="field-hint">parent_id INT(11) NULL</code>
                        </label>
                        <select class="form-select" id="fParent" name="parentId" onchange="sbRefreshDepth()">
                            <option value="0">없음 (최상위 본부)</option>
                            <c:forEach var="d" items="${deptList}">
                                <option value="${d.deptId}" data-depth="${d.depth}"
                                    ${d.deptId == param.parentId ? 'selected' : ''}>
                                    <c:forEach begin="1" end="${d.depth}" var="i">&#160;&#160;&#160;</c:forEach>
                                    <c:if test="${d.depth > 0}">└&#160;</c:if>
                                    ${d.deptName} (${d.deptCode})
                                </option>
                            </c:forEach>
                        </select>
                        <div class="text-faint mt-1" style="font-size:12px">
                            비워두면 최상위 본부(depth 1)로 등록됩니다.
                        </div>
                    </div>

                    <!-- depth (자동계산, hidden input 으로 함께 전송) -->
                    <div class="col-md-4">
                        <label class="sb-form-label">
                            계층 깊이
                            <code class="field-hint">depth INT(11) — 자동 계산</code>
                        </label>
                        <div class="depth-info-box">
                            <i class="bi bi-layers text-faint"></i>
                            <span>depth</span>
                            <span class="depth-val" id="fDepthVal">1</span>
                            <span class="text-faint" id="fDepthLabel">· 본부</span>
                        </div>
                        <input type="hidden" name="depth" id="fDepth" value="1">
                    </div>

                    <!-- sort_order -->
                    <div class="col-md-4">
                        <label class="sb-form-label">
                            정렬 순서
                            <code class="field-hint">sort_order INT(11)</code>
                        </label>
                        <input type="number" class="form-control" id="fSort" name="sortOrder"
                               value="${deptList.size() + 1}" min="1" max="999" placeholder="1">
                    </div>

                    <!-- 계층 미리보기 -->
                    <div class="col-12">
                        <label class="sb-form-label">계층 미리보기</label>
                        <div class="hier-preview" id="hierPreview">
                            <span class="hier-node">${com.comName}</span>
                            <i class="bi bi-chevron-right hier-sep"></i>
                            <span class="text-faint" style="font-size:12.5px">부서명 입력 중…</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ③ 부서장 -->
        <div class="sb-card mb-3">
            <div class="sb-card__head">
                <h2><i class="bi bi-person-badge me-2 text-soft"></i>부서장</h2>
                <span class="sub">선택 사항</span>
                <div class="right">
                    <span class="sql-chip"><i class="bi bi-database"></i>emp_id INT(11) NULL</span>
                </div>
            </div>
            <div class="sb-card__body">
                <div class="row g-3 align-items-center">
                    <div class="col-md-6">
                        <label class="sb-form-label">부서장 사원 선택</label>
                        <select class="form-select" id="fEmp" name="empId" onchange="sbRefreshLeadChip()">
                            <option value="">지정 안 함</option>
                            <c:forEach var="emp" items="${empList}">
                                <option value="${emp.empId}" data-name="${emp.empName}" data-pos="${emp.posName}">
                                    ${emp.empName} (${emp.posName})
                                </option>
                            </c:forEach>
                        </select>
                    </div>
                    <div class="col-md-6" id="leadChipWrap" style="display:none">
                        <label class="sb-form-label">&nbsp;</label>
                        <div>
                            <span class="lead-chip" id="leadChip">
                                <span class="sb-avatar" id="leadAvatar">?</span>
                                <span id="leadName">—</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 폼 버튼 -->
        <div class="d-flex gap-2 justify-content-end">
            <a href="${backUrl}" class="btn btn-ghost">취소</a>
            <button type="submit" class="btn btn-sb">
                <i class="bi bi-check-lg"></i> 등록하기
            </button>
        </div>

    </form>

</main>

<script>
(function () {
  "use strict";
  var DEPTH_LABELS = ["", "본부", "팀", "셀", "파트"];
  var COM_NAME = "${com.comName}";

  /* ── depth 자동계산 ── */
  window.sbRefreshDepth = function () {
    var sel = document.getElementById("fParent");
    var opt = sel.options[sel.selectedIndex];
    var parentDepth = +(opt && opt.dataset.depth) || 0;
    var depth = sel.value === "0" || !sel.value ? 1 : parentDepth + 1;
    document.getElementById("fDepthVal").textContent   = depth;
    document.getElementById("fDepthLabel").textContent = "· " + (DEPTH_LABELS[depth] || "하위");
    document.getElementById("fDepth").value = depth;
    sbUpdatePreview();
  };

  /* ── 계층 미리보기 ── */
  window.sbUpdatePreview = function () {
    var sel  = document.getElementById("fParent");
    var name = document.getElementById("fName").value.trim();
    var box  = document.getElementById("hierPreview");

    var chain = [];
    var opt = sel.options[sel.selectedIndex];
    if (opt && opt.value !== "0") {
      chain.push(opt.textContent.replace(/^[\s└]+/, "").trim());
    }

    var nodes = [COM_NAME].concat(chain);
    var html = nodes.map(function (n) { return '<span class="hier-node">' + n + '</span>'; })
      .join('<i class="bi bi-chevron-right hier-sep"></i>');

    html += '<i class="bi bi-chevron-right hier-sep"></i>';
    html += name
      ? '<span class="hier-node hier-node--new">' + name + '</span>'
      : '<span class="text-faint" style="font-size:12.5px">부서명 입력 중…</span>';

    box.innerHTML = html;
  };

  /* ── 부서장 칩 ── */
  window.sbRefreshLeadChip = function () {
    var sel  = document.getElementById("fEmp");
    var wrap = document.getElementById("leadChipWrap");
    var opt  = sel.options[sel.selectedIndex];
    if (!sel.value || !opt.dataset.name) { wrap.style.display = "none"; return; }
    document.getElementById("leadAvatar").textContent = opt.dataset.name.charAt(0);
    document.getElementById("leadName").textContent   = opt.dataset.name + " · " + opt.dataset.pos;
    wrap.style.display = "";
  };

  /* ── 부서코드 중복 체크 (onblur) ── */
  window.sbCheckDeptCode = function () {
    var codeEl = document.getElementById("fCode");
    var comId  = "${com.comId}";
    var code   = codeEl.value.trim();
    if (!code) return;

    fetch("${pageContext.request.contextPath}/dept/checkCode"
          + "?comId=" + encodeURIComponent(comId)
          + "&deptCode=" + encodeURIComponent(code))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.duplicate) {
          codeEl.classList.add("is-invalid");
          document.getElementById("eCode").textContent = "이미 사용 중인 부서코드입니다.";
        } else {
          codeEl.classList.remove("is-invalid");
        }
      })
      .catch(function () { console.error("부서코드 중복 체크 오류"); });
  };

  /* ── 초기화 ── */
  sbRefreshDepth();

  /* ── 제출 검증 ── */
  document.getElementById("deptForm").addEventListener("submit", function (e) {
    var valid = true;
    var nameEl = document.getElementById("fName");
    var codeEl = document.getElementById("fCode");
    nameEl.classList.remove("is-invalid");
    if (!nameEl.value.trim()) { nameEl.classList.add("is-invalid"); valid = false; }
    if (!codeEl.value.trim()) {
      codeEl.classList.add("is-invalid");
      document.getElementById("eCode").textContent = "부서코드를 입력하세요.";
      valid = false;
    }
    if (codeEl.classList.contains("is-invalid")) valid = false;
    if (!valid) e.preventDefault();
  });
})();
</script>

<%@include file="/layout/footer.jsp"%>
