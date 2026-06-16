<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="../inc/header.jsp"%>
<div class="container my-5" style="max-width:700px;">

    <%-- 페이지 헤더 --%>
    <div class="d-flex align-items-center gap-2 mb-4">
        <a href="${pageContext.request.contextPath}/com/list.do"
           class="btn btn-sm btn-outline-secondary">
            <i class="bi bi-arrow-left fs-5"></i>
        </a>
        <h5 class="mb-0 fw-semibold">회사 등록</h5>
    </div>

    <div class="card shadow-sm">
        <div class="card-body p-4">
            <form method="post"
                  action="${pageContext.request.contextPath}/com/add.do"
                  enctype="multipart/form-data"
                  onsubmit="return validateForm()">
                <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>

                <%-- ────────────────────────────────────────
                     섹션 1. 업종 분류
                ──────────────────────────────────────── --%>
                <h6 class="fw-semibold text-secondary mb-3 border-bottom pb-2">
                    <i class="bi bi-tag me-1"></i>
                    업종 분류
                </h6>

                <div class="row g-3 mb-3">
                    <%-- 업종 그룹 (industGrpCode) --%>
                    <div class="col-md-6">
                        <label for="industGrpCode" class="form-label fw-medium">
                            업종 그룹 <span class="text-danger">*</span>
                        </label>
                        <select class="form-select" id="industGrpCode" name="industGrpCode"
                                onchange="syncIndustName()" required>
                            <option value="">-- 업종 그룹 선택 --</option>
                            <option value="IT"      ${com.industGrpCode == 'IT'      ? 'selected' : ''}>IT · 플랫폼</option>
                            <option value="ECOM"    ${com.industGrpCode == 'ECOM'    ? 'selected' : ''}>이커머스</option>
                            <option value="O2O"     ${com.industGrpCode == 'O2O'     ? 'selected' : ''}>O2O · 배달</option>
                            <option value="FIN"     ${com.industGrpCode == 'FIN'     ? 'selected' : ''}>금융 · 카드</option>
                            <option value="TELCO"   ${com.industGrpCode == 'TELCO'   ? 'selected' : ''}>통신</option>
                            <option value="GAME"    ${com.industGrpCode == 'GAME'    ? 'selected' : ''}>게임</option>
                            <option value="IT_SI"   ${com.industGrpCode == 'IT_SI'   ? 'selected' : ''}>IT · SI / 솔루션</option>
                            <option value="MANU"    ${com.industGrpCode == 'MANU'    ? 'selected' : ''}>반도체 · 전자</option>
                            <option value="DIST"    ${com.industGrpCode == 'DIST'    ? 'selected' : ''}>물류 · 유통</option>
                            <option value="MEDIA"   ${com.industGrpCode == 'MEDIA'   ? 'selected' : ''}>미디어 · 콘텐츠</option>
                            <option value="BIO"     ${com.industGrpCode == 'BIO'     ? 'selected' : ''}>바이오 · 헬스케어</option>
                            <option value="CONST"   ${com.industGrpCode == 'CONST'   ? 'selected' : ''}>건설 · 부동산</option>
                            <option value="ENERGY"  ${com.industGrpCode == 'ENERGY'  ? 'selected' : ''}>에너지</option>
                            <option value="EDU"     ${com.industGrpCode == 'EDU'     ? 'selected' : ''}>교육 · HR</option>
                            <option value="AUTO"    ${com.industGrpCode == 'AUTO'    ? 'selected' : ''}>자동차</option>
                        </select>
                        <div class="invalid-feedback">업종 그룹을 선택하세요.</div>
                    </div>

                    <%-- 세부 업종 코드 (industCode) --%>
                    <div class="col-md-6">
                        <label for="industCode" class="form-label fw-medium">
                            세부 업종 <span class="text-danger">*</span>
                        </label>
                        <select class="form-select" id="industCode" name="industCode"
                                onchange="syncIndustName()" required>
                            <option value="">-- 업종 그룹을 먼저 선택하세요 --</option>
                        </select>
                        <div class="invalid-feedback">세부 업종을 선택하세요.</div>
                    </div>

                    <%-- 업종명 (industName) — 자동 채워짐, hidden 전송 --%>
                    <input type="hidden" id="industName" name="industName" value="${com.industName}"/>
                </div>

                <%-- ────────────────────────────────────────
                     섹션 2. 기본 정보
                ──────────────────────────────────────── --%>
                <h6 class="fw-semibold text-secondary mb-3 border-bottom pb-2 mt-4">
                    <i class="bi bi-building me-1"></i>
                    기본 정보
                </h6>

                <div class="row g-3 mb-3">
                    <%-- 회사명 --%>
                    <div class="col-md-8">
                        <label for="comName" class="form-label fw-medium">
                            회사명 <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" id="comName" name="comName"
                               placeholder="회사명을 입력하세요" value="${com.comName}">
                        <div class="invalid-feedback">회사명은 필수입니다.</div>
                    </div>

                    <%-- 대표자 --%>
                    <div class="col-md-4">
                        <label for="comCeo" class="form-label fw-medium">대표자</label>
                        <input type="text" class="form-control" id="comCeo" name="comCeo"
                               placeholder="대표자명" value="${com.comCeo}">
                    </div>

                    <%-- 사업자번호 --%>
                    <div class="col-md-6">
                        <label for="bizNo" class="form-label fw-medium">
                            사업자번호 <span class="text-danger">*</span>
                        </label>
                        <div class="input-group has-validation">
                            <input type="text" class="form-control" id="bizNo" name="bizNo"
                                   placeholder="000-00-00000"
                                   onblur="checkBizNo()"
                                   value="${com.bizNo}">
                            <span class="input-group-text" id="bizNoSpinner" style="display:none;">
                                <span class="spinner-border spinner-border-sm text-secondary"></span>
                            </span>
                            <div class="invalid-feedback">사업자번호 형식이 올바르지 않습니다. (예: 123-45-67890)</div>
                            <div class="valid-feedback">사용 가능한 사업자번호입니다.</div>
                        </div>
                        <div class="form-text text-muted">형식: 123-45-67890</div>
                    </div>

                    <%-- 전화번호 --%>
                    <div class="col-md-6">
                        <label for="comTel" class="form-label fw-medium">전화번호</label>
                        <input type="tel" class="form-control" id="comTel" name="comTel"
                               placeholder="02-0000-0000" value="${com.comTel}">
                    </div>
                </div>

                <%-- ────────────────────────────────────────
                     섹션 3. 로고 업로드
                ──────────────────────────────────────── --%>
                <h6 class="fw-semibold text-secondary mb-3 border-bottom pb-2 mt-4">
                    <i class="bi bi-image me-1"></i>
                    회사 로고
                </h6>

                <div class="mb-4">
                    <div class="d-flex align-items-start gap-3 flex-wrap">
                        <%-- 미리보기 --%>
                        <div id="logoPreviewWrap"
                             class="border rounded d-flex align-items-center justify-content-center bg-light flex-shrink-0"
                             style="width:80px;height:80px;overflow:hidden;">
                            <c:choose>
                                <c:when test="${not empty com.comLogo}">
                                    <img id="logoPreview" src="${com.comLogo}" alt="로고 미리보기"
                                         style="max-width:100%;max-height:100%;object-fit:contain;">
                                </c:when>
                                <c:otherwise>
                                    <i id="logoPlaceholder" class="bi bi-building text-secondary" style="font-size:2rem;"></i>
                                </c:otherwise>
                            </c:choose>
                        </div>
                        <%-- 업로드 버튼 영역 --%>
                        <div class="flex-grow-1">
                            <input type="file" class="form-control" id="comLogo" name="comLogo"
                                   accept="image/png, image/jpeg, image/svg+xml, image/webp"
                                   onchange="previewLogo(this)">
                            <div class="form-text text-muted mt-1">
                                PNG · JPG · SVG · WEBP, 최대 2MB. 미입력 시 기본 이미지 사용.
                            </div>
                        </div>
                    </div>
                </div>

                <%-- ────────────────────────────────────────
                     버튼
                ──────────────────────────────────────── --%>
                <div class="d-flex gap-2 justify-content-end mt-2">
                    <button type="reset" class="btn btn-outline-secondary"
                            onclick="resetLogoPreview()">초기화</button>
                    <a href="${pageContext.request.contextPath}/com/list.do"
                       class="btn btn-outline-dark">목록</a>
                    <button type="submit" class="btn btn-primary">등록</button>
                </div>

            </form>
        </div>
    </div>
</div>

<script>
/* ══════════════════════════════════════════════════
   업종 그룹 → 세부 업종 연동 맵
══════════════════════════════════════════════════ */
const INDUST_MAP = {
    IT:     [['IT001','IT·플랫폼'], ['IT002','IT·서비스']],
    ECOM:   [['ECOM001','이커머스'], ['ECOM002','이커머스·대형']],
    O2O:    [['O2O001','O2O·배달'], ['O2O002','O2O·여행'], ['O2O003','O2O·홈리빙']],
    FIN:    [['FIN001','금융·카드'], ['FIN002','금융·IT']],
    TELCO:  [['TELCO001','통신'], ['TELCO002','통신·인터넷']],
    GAME:   [['GAME001','게임'], ['GAME002','게임·모바일']],
    IT_SI:  [['SI001','IT·SI'], ['SI002','IT·솔루션']],
    MANU:   [['ELEC001','반도체·전자'], ['ELEC002','디스플레이']],
    DIST:   [['DIST001','물류'], ['DIST002','유통']],
    MEDIA:  [['MEDIA001','미디어·콘텐츠'], ['MEDIA002','엔터테인먼트']],
    BIO:    [['BIO001','바이오'], ['BIO002','제약']],
    CONST:  [['CONST001','건설'], ['CONST002','건설·개발']],
    ENERGY: [['ENRG001','에너지·정유'], ['ENRG002','에너지·전력']],
    EDU:    [['EDU001','교육'], ['EDU002','교육·HR']],
    AUTO:   [['AUTO001','자동차']]
};

/* 초기 렌더링 — 수정 폼 진입 시 기존 값 복원 */
(function init() {
    const grpSel  = document.getElementById('industGrpCode');
    const codeSel = document.getElementById('industCode');
    const savedGrp  = '${com.industGrpCode}';
    const savedCode = '${com.industCode}';
    if (savedGrp) {
        grpSel.value = savedGrp;
        buildIndustCode(savedGrp, savedCode);
    }
})();

function buildIndustCode(grp, selectCode) {
    const codeSel = document.getElementById('industCode');
    codeSel.innerHTML = '<option value="">-- 세부 업종 선택 --</option>';
    (INDUST_MAP[grp] || []).forEach(([code, name]) => {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = name;
        if (code === selectCode) opt.selected = true;
        codeSel.appendChild(opt);
    });
}

function syncIndustName() {
    const grp     = document.getElementById('industGrpCode').value;
    const codeSel = document.getElementById('industCode');

    /* 그룹 변경 시 세부 업종 목록 재구성 */
    if (grp !== codeSel.dataset.lastGrp) {
        codeSel.dataset.lastGrp = grp;
        buildIndustCode(grp, '');
    }

    /* 선택된 세부 업종 이름을 hidden 필드에 저장 */
    const selectedOpt = codeSel.options[codeSel.selectedIndex];
    document.getElementById('industName').value =
        selectedOpt && selectedOpt.value ? selectedOpt.textContent : '';
}

/* ══════════════════════════════════════════════════
   로고 미리보기 / 초기화
══════════════════════════════════════════════════ */
function previewLogo(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        alert('파일 크기는 2MB 이하여야 합니다.');
        input.value = '';
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const wrap = document.getElementById('logoPreviewWrap');
        wrap.innerHTML =
            '<img id="logoPreview" src="' + e.target.result + '" alt="로고 미리보기"' +
            ' style="max-width:100%;max-height:100%;object-fit:contain;">';
    };
    reader.readAsDataURL(file);
}

function resetLogoPreview() {
    const wrap = document.getElementById('logoPreviewWrap');
    wrap.innerHTML = '<i class="bi bi-building text-secondary" style="font-size:2rem;"></i>';
}

/* ══════════════════════════════════════════════════
   폼 제출 유효성 검사
══════════════════════════════════════════════════ */
function validateForm() {
    let valid = true;

    // 업종 그룹
    const grpSel = document.getElementById('industGrpCode');
    if (!grpSel.value) {
        setInvalid(grpSel, '업종 그룹을 선택하세요.');
        valid = false;
    } else {
        setValid(grpSel);
    }

    // 세부 업종
    const codeSel = document.getElementById('industCode');
    if (!codeSel.value) {
        setInvalid(codeSel, '세부 업종을 선택하세요.');
        valid = false;
    } else {
        setValid(codeSel);
    }

    // 회사명
    const comNameInput = document.getElementById('comName');
    if (!comNameInput.value.trim()) {
        setInvalid(comNameInput, '회사명은 필수입니다.');
        valid = false;
    } else {
        setValid(comNameInput);
    }

    // 사업자번호 형식 + 중복 판정
    const bizNoInput   = document.getElementById('bizNo');
    const bizNoPattern = /^\d{3}-\d{2}-\d{5}$/;
    if (!bizNoPattern.test(bizNoInput.value.trim())) {
        setInvalid(bizNoInput, '사업자번호 형식이 올바르지 않습니다. (예: 123-45-67890)');
        valid = false;
    } else if (bizNoInput.classList.contains('is-invalid')) {
        valid = false; // blur 시 이미 중복 판정
    }

    return valid;
}

/* ══════════════════════════════════════════════════
   사업자번호 중복 체크 (onblur)
══════════════════════════════════════════════════ */
function checkBizNo() {
    const bizNoInput   = document.getElementById('bizNo');
    const spinner      = document.getElementById('bizNoSpinner');
    const bizNo        = bizNoInput.value.trim();
    const bizNoPattern = /^\d{3}-\d{2}-\d{5}$/;

    if (!bizNoPattern.test(bizNo)) {
        setInvalid(bizNoInput, '사업자번호 형식이 올바르지 않습니다. (예: 123-45-67890)');
        return;
    }

    spinner.style.display = '';
    bizNoInput.classList.remove('is-valid', 'is-invalid');

    fetch('${pageContext.request.contextPath}/com/checkBizNo.do?bizNo=' + encodeURIComponent(bizNo))
        .then(res => res.json())
        .then(data => {
            spinner.style.display = 'none';
            if (data[0] != null) {
                setInvalid(bizNoInput, '이미 사용 중인 사업자번호입니다.');
            } else {
                setValid(bizNoInput);
            }
        })
        .catch(() => {
            spinner.style.display = 'none';
            console.error('중복 체크 중 오류가 발생했습니다.');
        });
}

/* ══════════════════════════════════════════════════
   공통 헬퍼
══════════════════════════════════════════════════ */
function setInvalid(input, message) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    const fb = input.parentElement.querySelector('.invalid-feedback')
             || input.nextElementSibling;
    if (fb && fb.classList.contains('invalid-feedback')) fb.textContent = message;
}

function setValid(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
}
</script>

<%@include file="../inc/footer.jsp"%>
