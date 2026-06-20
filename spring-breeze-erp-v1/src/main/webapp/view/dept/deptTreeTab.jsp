<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions"%>
<div class="sb-card">

    <!-- 검색 툴바 -->
    <div class="sb-toolbar">

        <c:if test="${not empty companies}">
            <!-- 회사 필터 (단독 페이지에서만 노출) -->
            <div class="sb-field">
                <select id="filterCom" style="min-width:200px" onchange="sbDeptComChange(this.value)">
                    <option value="">회사 선택 (필수)</option>
                    <c:forEach var="c" items="${companies}">
                        <option value="${c.comId}" ${c.comId == com.comId ? 'selected' : ''}>${com.comName}</option>
                    </c:forEach>
                </select>
            </div>
        </c:if>

        <!-- 검색 -->
        <div class="ac-wrap" style="max-width:320px; flex:1 1 auto">
            <div class="sb-field sb-field--search" style="width:100%">
                <i class="bi bi-search"></i>
                <input type="text" id="deptSearch" placeholder="부서명 또는 코드 검색" autocomplete="off" style="width:100%" />
            </div>
            <div class="ac-list" id="acList"></div>
        </div>

        <!-- depth 필터 -->
        <!-- <div class="sb-field">
            <select id="filterDepth">
                <option value="">전체 계층</option>
                <option value="0">본부 (depth 0)</option>
                <option value="1">팀 (depth 1)</option>
                <option value="2">셀 (depth 2)</option>
            </select>
        </div> -->

        <div class="grow"></div>

        <span class="text-faint" id="deptCount" style="font-size:12.5px"></span>

        <%-- 부서 등록 — comId + returnUrl 전달 --%>
        <c:url var="addRootUrl" value="/dept/add">
            <c:param name="comId" value="${com.comId}"/>
            <c:if test="${not empty returnUrl}">
                <c:param name="returnUrl" value="${returnUrl}"/>
            </c:if>
        </c:url>
        <a href="${addRootUrl}" class="btn btn-sb btn-sm"><i class="bi bi-plus-lg"></i> 부서 등록</a>
    </div>

    <!-- 테이블 -->
    <div class="sb-card__body--flush">

        <c:if test="${empty com.comId}">
            <div class="sb-empty" id="noComPrompt">
                <i class="bi bi-building"></i>
                <p>조회할 회사를 선택하세요.</p>
                <p style="font-size:12.5px;margin-top:4px">회사명은 필수 검색 조건입니다.</p>
            </div>
        </c:if>

        <table class="sb-table" id="deptTable" style="${empty com.comId ? 'display:none' : ''}">
            <thead>
                <tr>
                    <th style="width:60px">NO</th>
                    <th style="min-width:200px">부서명</th>
                    <th style="width:80px">코드</th>
                    <!-- <th style="width:70px; text-align:center">depth</th> -->
                    <th style="width:130px">상위부서</th>
                    <th style="width:110px">부서장</th>
                    <th class="num" style="width:72px">인원</th>
                    <th style="width:80px; text-align:center">관리</th>
                </tr>
            </thead>
            <tbody id="deptRows">
                <c:forEach var="dept" items="${items}" varStatus="i">
                    <c:set var="lv" value="${dept.depth}"/>
                    <c:set var="lvClass" value="${lv == 0 ? 'dept-row-lv1' : lv == 1 ? 'dept-row-lv2' : lv == 2 ? 'dept-row-lv3' : 'dept-row-lv4'}"/>
                    <tr class="${lvClass}"
                        data-id="${dept.deptId}"
                        data-parentid="${dept.parentId}"
                        data-name="${dept.deptName}"
                        data-code="${dept.deptCode}"
                        data-depth="${dept.depth}"
                        data-empcount="${dept.empCount}">
                        <td class="sb-hr-cell tnum">${i.index+1}</td>
                        <td class="dept-name-col">
                            <div class="dept-cell-name">
                                <c:choose>
                                    <c:when test="${lv == 0}">
                                        <i class="bi bi-building-fill dept-depth-icon" style="color:var(--sb-accent)"></i>
                                    </c:when>
                                    <c:when test="${lv >= 1}">
                                        <i class="bi bi-chevron-right dept-depth-icon"></i>
                                    </c:when>
                                    <c:otherwise>
                                        <i class="bi bi-diagram-3 dept-depth-icon"></i>
                                    </c:otherwise>
                                </c:choose>
                                <div>
                                    <span class="dept-name-text">${dept.deptName}</span>
                                    <c:choose>
                                        <c:when test="${dept.parentId != 0}">
                                            <span class="text-faint ms-1" style="font-size:11.5px">↳ ${dept.parentName}</span>
                                        </c:when>
                                        <c:otherwise>
                                            <span class="sb-badge sb-badge--blue ms-1" style="font-size:10.5px;padding:1px 7px">최상위</span>
                                        </c:otherwise>
                                    </c:choose>
                                </div>
                            </div>
                        </td>
                        <td><span class="dept-code-chip">${dept.deptCode}</span></td>
                        <%-- <td style="text-align:center">
                            <span class="depth-pill depth-pill--${dept.depth > 2 ? 2 : dept.depth}">${dept.depth}</span>
                        </td> --%>
                        <td class="text-faint" style="font-size:13px">
                            <c:choose>
                                <c:when test="${dept.parentId != 0}">${dept.parentName}</c:when>
                                <c:otherwise><span class="text-faint">—</span></c:otherwise>
                            </c:choose>
                        </td>
                        <td style="font-size:13px">
                            <c:choose>
                                <c:when test="${not empty dept.leaderName}">${dept.leaderName}</c:when>
                                <c:otherwise><span class="text-faint">—</span></c:otherwise>
                            </c:choose>
                        </td>
                        <td class="num tnum">${dept.empCount}명</td>
                        <td>
                            <div class="d-flex justify-content-end gap-1">
                                <c:url var="editUrl" value="/dept/edit">
                                    <c:param name="deptId" value="${dept.deptId}"/>
                                    <c:param name="comId" value="${com.comId}"/>
                                    <c:if test="${not empty returnUrl}">
                                        <c:param name="returnUrl" value="${returnUrl}"/>
                                    </c:if>
                                </c:url>
                                <a class="sb-iconbtn"
                            	   href="${pageContext.request.contextPath}/dept/detail?deptId=${dept.deptId}"
                            	   title="상세보기">
                            		<i class="bi bi-book"></i>
                            	</a>
                                <a href="${editUrl}" class="sb-iconbtn" style="width:28px;height:28px;font-size:13px" title="수정">
                                    <i class="bi bi-pencil"></i>
                                </a>
                                <button type="button" class="sb-iconbtn dept-del"
                                        data-id="${dept.deptId}"
                                        data-name="${fn:replace(dept.deptName, '\"', '&quot;')}"
                                        style="width:28px;height:28px;font-size:13px;color:var(--sb-red)"
                                        title="삭제">
                                    <i class="bi bi-trash3"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>

        <div class="sb-empty" id="deptEmpty" style="display:none">
            <i class="bi bi-diagram-3"></i>
            <p>일치하는 부서가 없습니다.</p>
        </div>
    </div>

    <!-- 하단 정보 -->
    <c:if test="${not empty com.comId}">
        <div class="px-3 py-2 d-flex align-items-center gap-2"
             style="border-top:1px solid var(--sb-border); font-size:12px; color:var(--sb-ink-faint)">
            <i class="bi bi-info-circle"></i>
            <span>총 <b id="deptTotal">${items.size()}</b>개 부서 · <code style="font-size:11px">parent_id</code> 기준 트리 구조로 표시됩니다.</span>
        </div>
    </c:if>
</div>

<%-- ══════════════════════════════════════════════
     삭제용 숨김 폼 (POST + CSRF 토큰)
     ON DELETE CASCADE → 하위 부서도 함께 삭제됨
══════════════════════════════════════════════ --%>
<form id="deleteForm" method="post"
      action="${pageContext.request.contextPath}/dept/delete">
    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
    <input type="hidden" name="deptId" id="deleteDeptId">
    <input type="hidden" name="comId"  value="${com.comId}">
    <c:if test="${not empty returnUrl}">
        <input type="hidden" name="returnUrl" value="${returnUrl}">
    </c:if>
</form>

<!-- 삭제 확인 모달 (dept.css의 .del-modal-icon / .del-dept-name / .del-warning / .del-warn-box 사용) -->
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
                <div class="del-dept-name" id="deptDelName"></div>
                <div class="del-warning">
                    삭제 시 연결된 데이터에 영향을 줄 수 있습니다.<br>
                    이 작업은 되돌릴 수 없습니다.
                </div>
                <div class="del-warn-box" id="deptDelChildWarn" style="display:none">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <span>하위 부서가 있는 경우, <b>ON DELETE CASCADE</b> 설정에 따라 함께 삭제됩니다.</span>
                </div>
                <div class="del-warn-box" id="deptDelEmpWarn" style="display:none">
                    <i class="bi bi-people-fill"></i>
                    <span>소속 사원이 <b id="deptDelEmpCount">0</b>명 있습니다. 다른 부서로 이동 후 삭제해주세요.</span>
                </div>
            </div>
            <div class="modal-footer" style="border-top:none">
                <button class="btn btn-ghost" data-bs-dismiss="modal">취소</button>
                <button class="btn btn-sb" id="deptDelYes"
                        style="background:var(--sb-red);border-color:var(--sb-red)">
                    <i class="bi bi-trash3"></i> 삭제 확인
                </button>
            </div>
        </div>
    </div>
</div>

<script>
(function () {
  "use strict";

  /* ── 회사 변경 시 페이지 새로고침(서버 재조회) ── */
  window.sbDeptComChange = function (comId) {
    var url = new URL(window.location.href);
    if (comId) { url.searchParams.set("comId", comId); }
    else { url.searchParams.delete("comId"); }
    window.location.href = url.toString();
  };

  /* ── 클라이언트 필터(검색 + depth) : 이미 렌더된 행을 보여줬다 숨겼다 함 ── */
  var rows = Array.prototype.slice.call(document.querySelectorAll("#deptRows tr"));

  function applyFilter() {
    var q     = (document.getElementById("deptSearch") || {}).value || "";
    var depth = (document.getElementById("filterDepth") || {}).value || "";
    q = q.trim().toLowerCase();

    var visible = 0;
    rows.forEach(function (tr) {
      var name = (tr.dataset.name || "").toLowerCase();
      var code = (tr.dataset.code || "").toLowerCase();
      var d    = tr.dataset.depth;
      var hitQ     = !q || name.indexOf(q) > -1 || code.indexOf(q) > -1;
      var hitDepth = !depth || d === depth;
      var show = hitQ && hitDepth;
      tr.style.display = show ? "" : "none";
      if (show) visible++;
    });

    var countEl = document.getElementById("deptCount");
    if (countEl) countEl.textContent = visible + "건";
    var emptyEl = document.getElementById("deptEmpty");
    var tableEl = document.getElementById("deptTable");
    if (emptyEl && tableEl) {
      emptyEl.style.display = visible ? "none" : "";
      tableEl.style.display = visible ? "" : "none";
    }
  }

  /* ── 자동완성 ── */
  var acIndex = -1;
  function renderAc() {
    var input = document.getElementById("deptSearch");
    var ac     = document.getElementById("acList");
    if (!input || !ac) return;
    var q = input.value.trim().toLowerCase();
    if (!q) { ac.classList.remove("show"); return; }

    var matches = rows.filter(function (tr) {
      var name = (tr.dataset.name || "").toLowerCase();
      var code = (tr.dataset.code || "").toLowerCase();
      return name.indexOf(q) > -1 || code.indexOf(q) > -1;
    }).slice(0, 6);

    acIndex = -1;
    if (!matches.length) {
      ac.innerHTML = '<div class="ac-empty">\'' + input.value + '\'와(과) 일치하는 부서가 없습니다.</div>';
      ac.classList.add("show");
      return;
    }
    ac.innerHTML = matches.map(function (tr) {
      var name = tr.dataset.name, code = tr.dataset.code;
      var idx = name.toLowerCase().indexOf(q);
      var hl = name;
      if (idx >= 0) {
        hl = name.slice(0, idx) + "<b>" + name.slice(idx, idx + q.length) + "</b>" + name.slice(idx + q.length);
      }
      return '<div class="ac-item" data-name="' + name + '">' +
        '<i class="bi bi-diagram-3 text-faint"></i>' +
        '<span>' + hl + '</span>' +
        '<span class="ac-item__meta">' + code + '</span></div>';
    }).join("");
    ac.classList.add("show");
    ac.querySelectorAll(".ac-item").forEach(function (it) {
      it.addEventListener("click", function () {
        input.value = it.dataset.name;
        ac.classList.remove("show");
        applyFilter();
      });
    });
  }

  var searchInput = document.getElementById("deptSearch");
  if (searchInput) {
    searchInput.addEventListener("input", function () { renderAc(); applyFilter(); });
    searchInput.addEventListener("keydown", function (e) {
      var items = Array.prototype.slice.call(document.querySelectorAll("#acList .ac-item"));
      if (!items.length) return;
      if (e.key === "ArrowDown")       { e.preventDefault(); acIndex = Math.min(acIndex + 1, items.length - 1); }
      else if (e.key === "ArrowUp")    { e.preventDefault(); acIndex = Math.max(acIndex - 1, 0); }
      else if (e.key === "Enter" && acIndex >= 0) { e.preventDefault(); items[acIndex].click(); return; }
      else return;
      items.forEach(function (it, i) { it.classList.toggle("active", i === acIndex); });
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".ac-wrap")) {
        var ac = document.getElementById("acList");
        if (ac) ac.classList.remove("show");
      }
    });
  }
  var depthSel = document.getElementById("filterDepth");
  if (depthSel) depthSel.addEventListener("change", applyFilter);

  applyFilter();

  /* ── 삭제 모달 오픈 : list.html의 delDept(id) 패턴과 동일하게
       이벤트 위임으로 .dept-del 버튼에 바인딩, data-* 속성에서 정보 읽음 ── */
  function openDelModal(tr) {
    var deptId   = tr.dataset.id;
    var deptName = tr.dataset.name;
    var empCount = +tr.dataset.empcount || 0;
    /* 하위부서 존재 여부 — 새 DB 컬럼 없이, 이미 화면에 있는 전체 행의 parentId만 스캔 */
    var hasChild = rows.some(function (other) { return other.dataset.parentid === deptId; });

    document.getElementById("deptDelName").textContent = deptName;
    document.getElementById("deptDelChildWarn").style.display = hasChild ? "" : "none";
    document.getElementById("deptDelEmpWarn").style.display   = empCount > 0 ? "" : "none";
    document.getElementById("deptDelEmpCount").textContent    = empCount;

    var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("deptDelModal"));
    document.getElementById("deptDelYes").onclick = function () {
      document.getElementById("deleteDeptId").value = deptId;
      document.getElementById("deleteForm").submit();
    };
    modal.show();
  }

  rows.forEach(function (tr) {
    var btn = tr.querySelector(".dept-del");
    if (btn) btn.addEventListener("click", function () { openDelModal(tr); });
  });
})();
</script>