<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions"%>
<%@include file="/layout/header.jsp"%>

<%--
  ══════════════════════════════════════════════════════════════════
  부서 수정 : dept/editForm.jsp
  (웹퍼블리셔 제공 edit.html / dept.css 디자인 반영)

  필요한 모델 변수 (Controller → Model):
    dept        - DeptDto (deptId, comId, deptName, deptCode, parentId, depth,
                  sortOrder, empId, createdAt, updatedAt)
    comName     - 소속 회사명 (읽기전용 표시용)
    deptList    - List<DeptDto> 해당 회사의 전체 부서. 컨트롤러에서 자기 자신과
                  자기 자손(순환참조 방지)은 미리 제외해서 넘겨주는 것을 권장.
                  각 항목: deptId, deptName, deptCode, depth, parentId
    empList     - List<EmpDto> 해당 회사의 전체 사원 (부서장 선택용)
                  각 항목: empId, empName, empNo, posName
    deptEmpList - List<EmpDto> 이 부서(dept_id)에 소속된 사원 목록 (읽기전용 표시)
                  각 항목: empNo, empName, posName, empEmail, empStatus

  returnUrl (선택, 쿼리 파라미터) : 수정/삭제 완료 후 돌아갈 경로.
  ══════════════════════════════════════════════════════════════════
--%>

<c:set var="backUrl">${pageContext.request.contextPath}/com/edit?comId=${com.comId}</c:set>

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

    <%-- 부서가 존재하지 않는 경우 --%>
    <c:if test="${empty dept}">
        <div class="sb-page-head">
            <div class="sb-page-head__txt">
                <div class="sb-breadcrumb">
                    <a href="${pageContext.request.contextPath}/index">홈</a>
                    <i class="bi bi-chevron-right"></i>
                    <a href="${pageContext.request.contextPath}/dept/list">부서 관리</a>
                    <i class="bi bi-chevron-right"></i>
                    수정
                </div>
                <h1>부서 수정</h1>
            </div>
        </div>
        <div class="sb-card">
            <div class="sb-empty">
                <i class="bi bi-exclamation-circle"></i>
                <p>해당 부서를 찾을 수 없습니다.</p>
                <a href="${pageContext.request.contextPath}/dept/list" class="btn btn-sb-soft btn-sm mt-2">목록으로 돌아가기</a>
            </div>
        </div>
    </c:if>

    <c:if test="${not empty dept}">

    <!-- 페이지 헤더 -->
    <div class="sb-page-head">
        <div class="sb-page-head__txt">
            <div class="sb-breadcrumb">
                <a href="${pageContext.request.contextPath}/index">홈</a>
                <i class="bi bi-chevron-right"></i>
                <a href="${backUrl}">부서 관리</a>
                <i class="bi bi-chevron-right"></i>
                수정
                <span class="admin-tag ms-2">관리자</span>
            </div>
            <h1>${dept.deptName} · 수정</h1>
            <p>DEPT-<fmt:formatNumber value="${dept.deptId}" minIntegerDigits="3" groupingUsed="false"/> · 부서 정보를 수정합니다.</p>
        </div>
        <div class="sb-page-head__actions">
            <button type="button" class="btn btn-ghost btn-sm" id="delBtn"
                    style="color:var(--sb-red);border-color:#f3c9c9" data-bs-toggle="modal" data-bs-target="#deptDelModal">
                <i class="bi bi-trash3"></i> 삭제
            </button>
            <a href="${backUrl}" class="btn btn-ghost btn-sm">
                <i class="bi bi-arrow-left"></i> 목록으로
            </a>
        </div>
    </div>

    <form id="deptForm" class="form-narrow" novalidate method="post"
          action="${pageContext.request.contextPath}/dept/edit">
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
        <input type="hidden" name="deptId" value="${dept.deptId}"/>
        <input type="hidden" name="comId"  value="${com.comId}"/>
        <c:if test="${not empty param.returnUrl}">
            <input type="hidden" name="returnUrl" value="${param.returnUrl}"/>
        </c:if>

        <!-- ① 기본 정보 -->
        <div class="sb-card mb-3">
            <div class="sb-card__head">
                <h2><i class="bi bi-diagram-3 me-2 text-soft"></i>기본 정보</h2>
                <div class="right">
                    <span class="sb-badge sb-badge--gray">DEPT-<fmt:formatNumber value="${dept.deptId}" minIntegerDigits="3" groupingUsed="false"/></span>
                </div>
            </div>
            <div class="sb-card__body">
                <div class="row g-3">
                    <!-- dept_name -->
                    <div class="col-md-8">
                        <label class="sb-form-label">
                            부서명 <span style="color:var(--sb-red)">*</span>
                        </label>
                        <input type="text" class="form-control" id="fName" name="deptName" maxlength="100"
                               value="${dept.deptName}" oninput="sbUpdatePreview()" required>
                        <div class="invalid-feedback" id="eName">부서명을 입력하세요.</div>
                    </div>
                    <!-- dept_code -->
                    <div class="col-md-4">
                        <label class="sb-form-label">
                            부서코드 <span style="color:var(--sb-red)">*</span>
                            <code class="field-hint">dept_code VARCHAR(45)</code>
                        </label>
                        <input type="text" class="form-control" id="fCode" name="deptCode" maxlength="45"
                               value="${dept.deptCode}" style="text-transform:uppercase"
                               oninput="this.value=this.value.toUpperCase()" onblur="sbCheckDeptCode()" required>
                        <div class="invalid-feedback" id="eCode">부서코드를 입력하세요.</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ② 소속 및 계층 -->
        <div class="sb-card mb-3">
            <div class="sb-card__head">
                <h2><i class="bi bi-sitemap me-2 text-soft"></i>소속 및 계층</h2>
            </div>
            <div class="sb-card__body">
                <div class="row g-3">

                    <!-- com_id (읽기전용) -->
                    <div class="col-md-6">
                        <label class="sb-form-label">
                            소속 회사
                        </label>
                        <input class="form-control" readonly value="${com.comName}"
                               style="background:#fafbfc;color:var(--sb-ink-soft)">
                        <div class="text-faint mt-1" style="font-size:12px">소속 회사는 변경할 수 없습니다.</div>
                    </div>

                    <!-- parent_id -->
                    <div class="col-md-6">
                        <label class="sb-form-label">
                            상위 부서
                        </label>
                        <select class="form-select" id="fParent" name="parentId" onchange="sbRefreshDepth()">
                            <option value="0" ${empty dept.parentId || dept.parentId == 0 ? 'selected' : ''}>
                                없음 (최상위 본부)
                            </option>
                            <c:forEach var="d" items="${deptList}">
                                <c:if test="${d.deptId != dept.deptId}">
                                    <option value="${d.deptId}" data-depth="${d.depth}" data-parentid="${d.parentId}"
                                        ${d.deptId == dept.parentId ? 'selected' : ''}>
                                        <c:forEach begin="1" end="${d.depth}" var="i">&#160;&#160;&#160;</c:forEach>
                                        <c:if test="${d.depth > 0}">└&#160;</c:if>
                                        ${d.deptName} (${d.deptCode})
                                    </option>
                                </c:if>
                            </c:forEach>
                        </select>
                        <div class="text-faint mt-1" style="font-size:12px">
                            <i class="bi bi-info-circle me-1"></i>
                            자기 자신/하위 부서는 선택할 수 없습니다. 변경 시 하위 부서의 depth가 함께 갱신됩니다.
                        </div>
                    </div>

                    <!-- depth (자동계산) -->
                    <div class="col-md-4">
                        <label class="sb-form-label">
                            계층 깊이
                        </label>
                        <div class="depth-info-box">
                            <i class="bi bi-layers text-faint"></i>
                            <span>depth</span>
                            <span class="depth-val" id="fDepthVal">${dept.depth}</span>
                            <span class="text-faint" id="fDepthLabel"></span>
                        </div>
                        <input type="hidden" name="depth" id="fDepth" value="${dept.depth}">
                    </div>

                    <!-- sort_order -->
                    <div class="col-md-4">
                        <label class="sb-form-label">
                            정렬 순서
                        </label>
                        <input type="number" class="form-control" id="fSort" name="sortOrder"
                               value="${dept.sortOrder != null ? dept.sortOrder : 1}" min="1" max="999">
                    </div>

                    <!-- 계층 미리보기 -->
                    <div class="col-12">
                        <label class="sb-form-label">계층 미리보기</label>
                        <div class="hier-preview" id="hierPreview"></div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ③ 부서장 -->
        <div class="sb-card mb-3">
            <div class="sb-card__head">
                <h2><i class="bi bi-person-badge me-2 text-soft"></i>부서장</h2>
                <span class="sub">선택 사항</span>
            </div>
            <div class="sb-card__body">
                <div class="row g-3 align-items-center">
                    <div class="col-md-6">
                        <label class="sb-form-label">부서장 사원 선택</label>
                        <select class="form-select" id="fEmp" name="empId" onchange="sbRefreshLeadChip()">
                            <option value="">지정 안 함</option>
                            <c:forEach var="emp" items="${empList}">
                                <option value="${emp.empId}" data-name="${emp.empName}" data-pos="${emp.posName}"
                                    ${emp.empId == dept.empId ? 'selected' : ''}>
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

        <!-- 소속 사원 현황 (읽기전용) -->
        <div class="sb-card mb-3">
            <div class="sb-card__head">
                <h2><i class="bi bi-people me-2 text-soft"></i>소속 사원 현황</h2>
                <span class="sub">총 ${deptEmpList.size()}명</span>
            </div>
            <div class="sb-card__body--flush">
                <table class="sb-table" id="empTable" style="${empty deptEmpList ? 'display:none' : ''}">
                    <thead>
                        <tr>
                            <th style="width:80px">사번</th>
                            <th>이름</th>
                            <th style="width:100px">직급</th>
                            <th style="width:160px">이메일</th>
                            <th style="width:90px">상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="e" items="${deptEmpList}">
                            <tr>
                                <td class="sb-hr-cell tnum">${e.empNo}</td>
                                <td>
                                    <div class="sb-rowuser">
                                        <span class="sb-avatar" style="width:28px;height:28px;font-size:12px">
                                            ${fn:substring(e.empName, 0, 1)}
                                        </span>
                                        <span class="sb-table__name">${e.empName}</span>
                                    </div>
                                </td>
                                <td><span class="sb-badge sb-badge--gray" style="font-size:11.5px">${e.posName}</span></td>
                                <td class="sb-hr-cell" style="font-size:12.5px">${e.empEmail}</td>
                                <td>
                                    <c:choose>
                                        <c:when test="${e.empStatus == '재직'}"><span class="sb-badge sb-badge--green">재직</span></c:when>
                                        <c:when test="${e.empStatus == '휴직'}"><span class="sb-badge sb-badge--amber">휴직</span></c:when>
                                        <c:when test="${e.empStatus == '원격'}"><span class="sb-badge sb-badge--cyan">원격</span></c:when>
                                        <c:otherwise><span class="sb-badge sb-badge--gray">${e.empStatus}</span></c:otherwise>
                                    </c:choose>
                                </td>
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

        <!-- 저장 버튼 -->
        <div class="d-flex gap-2 justify-content-end">
            <a href="${backUrl}" class="btn btn-ghost">취소</a>
            <button type="submit" class="btn btn-sb">
                <i class="bi bi-check-lg"></i> 변경사항 저장
            </button>
        </div>

    </form>

    <%-- 삭제용 숨김 폼 + 확인 모달 (dept.css .del-modal-icon 등 재사용) --%>
    <form id="deleteForm" method="post" action="${pageContext.request.contextPath}/dept/delete">
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
        <input type="hidden" name="deptId" value="${dept.deptId}">
        <input type="hidden" name="comId"  value="${com.comId}">
        <c:if test="${not empty param.returnUrl}">
            <input type="hidden" name="returnUrl" value="${param.returnUrl}">
        </c:if>
    </form>

    <div class="modal fade" id="deptDelModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" style="max-width:380px">
            <div class="modal-content">
                <div class="modal-header" style="border-bottom:none">
                    <span class="fw-semibold" style="color:var(--sb-red)">
                        <i class="bi bi-shield-exclamation me-1"></i>부서 삭제
                    </span>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body pt-0">
                    <div class="del-modal-icon"><i class="bi bi-diagram-3-fill"></i></div>
                    <div class="del-dept-name">
                        ${dept.deptName}
                        <span class="dept-code-chip ms-1">${dept.deptCode}</span>
                    </div>
                    <div class="del-warning">
                        삭제 시 연결된 데이터에 영향을 줄 수 있습니다.<br>
                        이 작업은 되돌릴 수 없습니다.
                    </div>
                    <div class="del-warn-box">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                        <span>하위 부서가 있는 경우, <b>ON DELETE CASCADE</b> 설정에 따라 함께 삭제됩니다.</span>
                    </div>
                    <c:if test="${not empty deptEmpList}">
                        <div class="del-warn-box">
                            <i class="bi bi-people-fill"></i>
                            <span>소속 사원이 <b>${deptEmpList.size()}명</b> 있습니다. 다른 부서로 이동 후 삭제해주세요.</span>
                        </div>
                    </c:if>
                </div>
                <div class="modal-footer" style="border-top:none">
                    <button class="btn btn-ghost" data-bs-dismiss="modal">취소</button>
                    <button type="button" class="btn btn-sb" id="delYes"
                            style="background:var(--sb-red);border-color:var(--sb-red)"
                            onclick="document.getElementById('deleteForm').submit()">
                        <i class="bi bi-trash3"></i> 삭제 확인
                    </button>
                </div>
            </div>
        </div>
    </div>

    </c:if>

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
    var depth = (!sel.value || sel.value === "0") ? 1 : parentDepth + 1;
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
    if (!box) return;

    var chain = [];
    var curId = sel.value;
    var guard = 0;
    while (curId !== "" && curId !== "0" && guard < 20) {
      var opt = sel.querySelector('option[value="' + curId + '"]');
      if (!opt) break;
      chain.unshift(opt.textContent.replace(/^[\s└]+/, "").trim());
      curId = opt.dataset.parentid;
      guard++;
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
    if (!sel) return;
    var opt = sel.options[sel.selectedIndex];
    if (!sel.value || !opt.dataset.name) { wrap.style.display = "none"; return; }
    document.getElementById("leadAvatar").textContent = opt.dataset.name.charAt(0);
    document.getElementById("leadName").textContent   = opt.dataset.name + " · " + opt.dataset.pos;
    wrap.style.display = "";
  };

  /* ── 부서코드 중복 체크 (자기 자신 제외) ── */
  window.sbCheckDeptCode = function () {
    var codeEl   = document.getElementById("fCode");
    var origCode = "${dept.deptCode}";
    var comId    = "${com.comId}";
    var deptId   = "${dept.deptId}";
    var code     = codeEl.value.trim();

    if (code === origCode) { codeEl.classList.remove("is-invalid"); return; }
    if (!code) return;

    fetch("${pageContext.request.contextPath}/dept/checkCode"
          + "?comId=" + encodeURIComponent(comId)
          + "&deptCode=" + encodeURIComponent(code)
          + "&deptId=" + encodeURIComponent(deptId))
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

  if (document.getElementById("fParent")) {
    sbRefreshDepth();
    sbRefreshLeadChip();
  }

  var form = document.getElementById("deptForm");
  if (form) {
    form.addEventListener("submit", function (e) {
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
  }
})();
</script>
<%@include file="/layout/footer.jsp"%>