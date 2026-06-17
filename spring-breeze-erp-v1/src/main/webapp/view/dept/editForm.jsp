<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@include file="/layout/header.jsp"%>

<div class="container my-5" style="max-width:640px;">

    <%-- 페이지 헤더 --%>
    <div class="d-flex align-items-center gap-2 mb-4">
        <a href="${pageContext.request.contextPath}/dept/list?comId=${dept.comId}"
           class="btn btn-sm btn-outline-secondary">
            <i class="bi bi-chevron-left"></i>
        </a>
        <h5 class="mb-0 fw-semibold">
            <i class="bi bi-pencil-square me-1 text-primary"></i> 부서 수정
        </h5>
    </div>

    <%-- 서버 오류 메시지 --%>
    <c:if test="${not empty errorMsg}">
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-1"></i>${errorMsg}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    </c:if>

    <div class="card shadow-sm">
        <div class="card-body p-4">
            <form method="post"
                  action="${pageContext.request.contextPath}/dept/edit"
                  novalidate id="deptForm">
                <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>

                <%-- PK: dept_id --%>
                <input type="hidden" name="deptId" value="${dept.deptId}"/>
                <%-- FK: com_id (수정 불가, 소속 회사 고정) --%>
                <input type="hidden" name="comId"  value="${dept.comId}"/>

                <%-- ────────────────────────────────────────
                     섹션 1. 부서 기본 정보
                     DB 컬럼: dept_name(NULL), dept_code(NULL, UNIQUE per com_id)
                ──────────────────────────────────────── --%>
                <h6 class="fw-semibold text-secondary mb-3 border-bottom pb-2">
                    <i class="bi bi-card-text me-1"></i>기본 정보
                </h6>

                <div class="row g-3 mb-3">

                    <%-- dept_name VARCHAR(100) NULL --%>
                    <div class="col-md-7">
                        <label for="deptName" class="form-label fw-medium">
                            부서명 <span class="text-danger">*</span>
                        </label>
                        <input type="text" id="deptName" name="deptName"
                               class="form-control"
                               placeholder="예) 개발팀"
                               maxlength="100"
                               value="${dept.deptName}"
                               required>
                        <div class="invalid-feedback">부서명은 필수 입력 항목입니다.</div>
                    </div>

                    <%-- dept_code VARCHAR(100) NULL, UNIQUE(com_id, dept_code) --%>
                    <div class="col-md-5">
                        <label for="deptCode" class="form-label fw-medium">
                            부서코드 <span class="text-danger">*</span>
                        </label>
                        <input type="text" id="deptCode" name="deptCode"
                               class="form-control"
                               placeholder="예) DEV-001"
                               maxlength="100"
                               value="${dept.deptCode}"
                               onblur="checkDeptCode()"
                               required>
                        <div class="invalid-feedback">부서코드는 필수이며, 회사 내 중복 불가합니다.</div>
                        <div class="valid-feedback">사용 가능한 부서코드입니다.</div>
                        <div class="form-text text-muted">회사 내 고유한 코드를 입력하세요.</div>
                    </div>
                </div>

                <%-- ────────────────────────────────────────
                     섹션 2. 조직 구조
                     DB 컬럼: parent_id(NULL), depth(NULL), sort_order(NULL)
                ──────────────────────────────────────── --%>
                <h6 class="fw-semibold text-secondary mb-3 border-bottom pb-2 mt-4">
                    <i class="bi bi-diagram-3 me-1"></i>조직 구조
                </h6>

                <%-- parent_id INT NULL
                     자기 자신 및 하위 부서는 상위로 선택 불가 (순환 참조 방지) --%>
                <div class="mb-3">
                    <label for="parentId" class="form-label fw-medium">상위 부서</label>
                    <select id="parentId" name="parentId" class="form-select">
                        <option value="0" ${empty dept.parentId || dept.parentId == 0 ? 'selected' : ''}>
                            — 최상위 부서 (없음)
                        </option>
                        <c:forEach var="d" items="${deptList}">
                            <%-- 자기 자신은 선택 목록에서 제외 --%>
                            <c:if test="${d.deptId != dept.deptId}">
                                <option value="${d.deptId}"
                                    <c:if test="${d.deptId == dept.parentId}">selected</c:if>>
                                    <c:forEach begin="1" end="${d.depth}" var="i">&#160;&#160;&#160;</c:forEach>
                                    <c:if test="${d.depth > 0}">└&#160;</c:if>
                                    ${d.deptName}
                                    <c:if test="${not empty d.deptCode}"> (${d.deptCode})</c:if>
                                </option>
                            </c:if>
                        </c:forEach>
                    </select>
                    <div class="form-text text-muted">
                        <i class="bi bi-info-circle me-1"></i>
                        자기 자신은 선택할 수 없습니다. 변경 시 하위 부서의 depth가 함께 갱신됩니다.
                    </div>
                </div>

                <%-- sort_order INT NULL --%>
                <div class="mb-4">
                    <label for="sortOrder" class="form-label fw-medium">정렬 순서</label>
                    <input type="number" id="sortOrder" name="sortOrder"
                           class="form-control" style="max-width:160px;"
                           min="0"
                           value="${dept.sortOrder != null ? dept.sortOrder : 0}">
                    <div class="form-text text-muted">숫자가 작을수록 먼저 표시됩니다.</div>
                </div>

                <%-- ────────────────────────────────────────
                     섹션 3. 담당자
                     DB 컬럼: emp_id INT NULL (FK → employee)
                ──────────────────────────────────────── --%>
                <h6 class="fw-semibold text-secondary mb-3 border-bottom pb-2 mt-2">
                    <i class="bi bi-person me-1"></i>부서 담당자
                </h6>

                <%-- emp_id INT NULL --%>
               <%--  <div class="mb-4">
                    <label for="empId" class="form-label fw-medium">담당자</label>
                    <select id="empId" name="empId" class="form-select">
                        <option value="">— 미지정</option>
                        <c:forEach var="emp" items="${empList}">
                            <option value="${emp.empId}"
                                <c:if test="${emp.empId == dept.empId}">selected</c:if>>
                                ${emp.empName} (${emp.empNo})
                            </option>
                        </c:forEach>
                    </select>
                    <div class="form-text text-muted">선택 입력</div>
                </div> --%>

                <%-- 읽기 전용 메타 정보 --%>
                <div class="row g-2 mb-4 text-muted small">
                    <div class="col-md-6">
                        <i class="bi bi-calendar-plus me-1"></i>
                        등록일: ${dept.createdAt}
                    </div>
                    <div class="col-md-6">
                        <i class="bi bi-calendar-check me-1"></i>
                        수정일: ${dept.updatedAt}
                    </div>
                </div>

                <%-- 버튼 --%>
                <div class="d-flex gap-2 justify-content-end">
                    <button type="button" class="btn btn-outline-secondary"
                            onclick="resetForm()">
                        <i class="bi bi-arrow-counterclockwise me-1"></i>초기화
                    </button>
                    <a href="${pageContext.request.contextPath}/dept/list?comId=${dept.comId}"
                       class="btn btn-outline-dark">
                        <i class="bi bi-list me-1"></i>목록
                    </a>
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-floppy me-1"></i>저장
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
/* ══════════════════════════════════════════════════
   부서코드 중복 체크 (onblur)
   현재 부서 자신의 코드는 중복으로 처리하지 않도록
   deptId 를 함께 전송
══════════════════════════════════════════════════ */
function checkDeptCode() {
    const codeEl = document.getElementById('deptCode');
    const comId  = '${dept.comId}';
    const deptId = '${dept.deptId}';
    const code   = codeEl.value.trim();

    // 원래 코드와 동일하면 체크 불필요
    if (code === '${dept.deptCode}') {
        codeEl.classList.remove('is-invalid');
        codeEl.classList.add('is-valid');
        return;
    }
    if (!code) return;

    fetch('${pageContext.request.contextPath}/dept/checkCode'
          + '?comId='    + encodeURIComponent(comId)
          + '&deptCode=' + encodeURIComponent(code)
          + '&deptId='   + encodeURIComponent(deptId))
        .then(res => res.json())
        .then(data => {
            if (data.duplicate) {
                codeEl.classList.remove('is-valid');
                codeEl.classList.add('is-invalid');
                codeEl.parentElement.querySelector('.invalid-feedback').textContent
                    = '이미 사용 중인 부서코드입니다.';
            } else {
                codeEl.classList.remove('is-invalid');
                codeEl.classList.add('is-valid');
            }
        })
        .catch(() => console.error('부서코드 중복 체크 오류'));
}

/* 초기화 — DB 저장값으로 복원 */
function resetForm() {
    document.getElementById('deptName').value  = '${dept.deptName}';
    document.getElementById('deptCode').value  = '${dept.deptCode}';
    document.getElementById('sortOrder').value = '${dept.sortOrder != null ? dept.sortOrder : 0}';
    document.getElementById('parentId').value  = '${dept.parentId != null ? dept.parentId : 0}';
    document.getElementById('empId').value     = '${dept.empId != null ? dept.empId : ""}';
    document.querySelectorAll('.is-valid, .is-invalid')
            .forEach(el => el.classList.remove('is-valid', 'is-invalid'));
    document.getElementById('deptForm').classList.remove('was-validated');
}

/* Bootstrap 5 유효성 검사 */
document.getElementById('deptForm').addEventListener('submit', function (e) {
    const codeEl = document.getElementById('deptCode');
    if (!this.checkValidity() || codeEl.classList.contains('is-invalid')) {
        e.preventDefault();
        e.stopPropagation();
    }
    this.classList.add('was-validated');
});
</script>

<%@include file="/layout/footer.jsp"%>