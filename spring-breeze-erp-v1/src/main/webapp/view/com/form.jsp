<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@include file="/layout/header.jsp"%>
<div class="container my-5" style="max-width:700px;">

    <%-- 페이지 헤더 --%>
    <div class="d-flex align-items-center gap-2 mb-4">
        <a href="${pageContext.request.contextPath}/com/list"
           class="btn btn-sm btn-outline-secondary">
            <i class="bi bi-arrow-left fs-5"></i>
        </a>
        <h5 class="mb-0 fw-semibold">회사 등록</h5>
    </div>

    <%-- 서버 측 오류 메시지 출력 --%>
    <c:if test="${not empty errorMsg}">
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-1"></i>
            ${errorMsg}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    </c:if>

    <div class="card shadow-sm">
        <div class="card-body p-4">
            <form method="post"
                  action="${pageContext.request.contextPath}/com/add"
                  enctype="multipart/form-data"
                  id="companyForm"
                  onsubmit="return validateForm()">
                <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
                <h6 class="fw-semibold text-secondary mb-3 border-bottom pb-2">
                    <i class="bi bi-tag me-1"></i>업종 분류
                </h6>
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label for="industGrp" class="form-label fw-medium">
                            업종 대분류 <span class="text-danger">*</span>
                        </label>
                        <select class="form-select" id="industGrp"
                                onchange="onGrpChange()">
                            <option value="">-- 대분류 선택 --</option>
                            <option value="IT">IT · 플랫폼</option>
                            <option value="ECOM">이커머스</option>
                            <option value="O2O">O2O · 배달</option>
                            <option value="FIN">금융 · 카드</option>
                            <option value="TELCO">통신</option>
                            <option value="GAME">게임</option>
                            <option value="IT_SI">IT · SI / 솔루션</option>
                            <option value="MANU">반도체 · 전자</option>
                            <option value="DIST">물류 · 유통</option>
                            <option value="MEDIA">미디어 · 콘텐츠</option>
                            <option value="BIO">바이오 · 헬스케어</option>
                            <option value="CONST">건설 · 부동산</option>
                            <option value="ENERGY">에너지</option>
                            <option value="EDU">교육 · HR</option>
                            <option value="AUTO">자동차</option>
                        </select>
                        <div class="form-text text-muted">먼저 대분류를 선택하면 세부 업종이 표시됩니다.</div>
                    </div>
                    <div class="col-md-6">
                        <label for="industCode" class="form-label fw-medium">
                            세부 업종 <span class="text-danger">*</span>
                        </label>
                        <select class="form-select" id="industCode" name="industCode"
                                onchange="syncIndustName()" required>
                            <option value="">-- 대분류를 먼저 선택하세요 --</option>
                        </select>
                        <div class="invalid-feedback">세부 업종을 선택하세요.</div>
                    </div>

                    <%-- DB 저장: indust_name (NOT NULL) — JS로 자동 채움 --%>
                    <input type="hidden" id="industName" name="industName" value="${com.industName}"/>
                </div>
                <h6 class="fw-semibold text-secondary mb-3 border-bottom pb-2 mt-4">
                    <i class="bi bi-building me-1"></i>기본 정보
                </h6>
                <div class="row g-3 mb-3">
                    <div class="col-md-8">
                        <label for="comName" class="form-label fw-medium">
                            회사명 <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" id="comName" name="comName"
                               placeholder="회사명을 입력하세요"
                               maxlength="100"
                               value="${com.comName}" required>
                        <div class="invalid-feedback">회사명은 필수입니다. (최대 100자)</div>
                    </div>
                    <div class="col-md-4">
                        <label for="comCeo" class="form-label fw-medium">
                            대표자 <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" id="comCeo" name="comCeo"
                               placeholder="대표자명"
                               maxlength="100"
                               value="${com.comCeo}" required>
                        <div class="invalid-feedback">대표자명은 필수입니다.</div>
                    </div>
                    <div class="col-md-6">
                        <label for="bizNo" class="form-label fw-medium">
                            사업자번호 <span class="text-danger">*</span>
                        </label>
                        <div class="input-group has-validation">
                            <input type="text" class="form-control" id="bizNo" name="bizNo"
                                   placeholder="000-00-00000"
                                   maxlength="45"
                                   onblur="checkBizNo()"
                                   value="${com.bizNo}" required>
                            <span class="input-group-text" id="bizNoSpinner" style="display:none;">
                                <span class="spinner-border spinner-border-sm text-secondary"></span>
                            </span>
                            <div class="invalid-feedback">사업자번호 형식이 올바르지 않거나 이미 사용 중입니다. (예: 123-45-67890)</div>
                            <div class="valid-feedback">사용 가능한 사업자번호입니다.</div>
                        </div>
                        <div class="form-text text-muted">형식: 123-45-67890</div>
                    </div>
                    <div class="col-md-6">
                        <label for="comTel" class="form-label fw-medium">전화번호</label>
                        <input type="tel" class="form-control" id="comTel" name="comTel"
                               placeholder="02-0000-0000"
                               maxlength="100"
                               value="${com.comTel}">
                        <div class="form-text text-muted">선택 입력</div>
                    </div>
                </div>
                <h6 class="fw-semibold text-secondary mb-3 border-bottom pb-2 mt-4">
                    <i class="bi bi-image me-1"></i>회사 로고
                </h6>
                <div class="mb-4">
                    <div class="d-flex align-items-start gap-3 flex-wrap">
                        <%-- 미리보기 영역 --%>
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
                        <%-- 파일 업로드 --%>
                        <div class="flex-grow-1">
                            <input type="file" class="form-control" id="comLogo" name="comLogo"
                                   accept="image/png, image/jpeg, image/svg+xml, image/webp"
                                   onchange="previewLogo(this)">
                            <div class="form-text text-muted mt-1">
                                나중에 기능 추가 - PNG · JPG · SVG · WEBP, 최대 2MB. 미입력 시 기본 이미지 사용.
                            </div>
                        </div>
                    </div>
                </div>

                <div class="d-flex gap-2 justify-content-end mt-2">
                    <button type="reset" class="btn btn-outline-secondary"
                            onclick="resetForm()">초기화</button>
                    <a href="${pageContext.request.contextPath}/com/list"
                       class="btn btn-outline-dark">목록</a>
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-floppy me-1"></i>등록
                    </button>
                </div>

            </form>
        </div>
    </div>
</div>

<script>
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

/* ──────────────────────────────────────────────────
   페이지 진입 시 초기화 (수정 폼 진입 시 기존 값 복원)
────────────────────────────────────────────────── */
(function init() {
    const savedCode = '${com.industCode}';
    const savedName = '${com.industName}';

    if (!savedCode) return;

    // 코드로 대분류 역추적
    const grpSel = document.getElementById('industGrp');
    for (const [grp, items] of Object.entries(INDUST_MAP)) {
        if (items.some(([code]) => code === savedCode)) {
            grpSel.value = grp;
            buildIndustCode(grp, savedCode);
            break;
        }
    }
    document.getElementById('industName').value = savedName;
})();

/* 대분류 변경 시 세부 업종 목록 재구성 */
function onGrpChange() {
    const grp = document.getElementById('industGrp').value;
    buildIndustCode(grp, '');
    document.getElementById('industName').value = '';
}

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

/* 세부 업종 선택 시 industName hidden 필드 자동 채움 */
function syncIndustName() {
    const codeSel = document.getElementById('industCode');
    const selectedOpt = codeSel.options[codeSel.selectedIndex];
    document.getElementById('industName').value =
        (selectedOpt && selectedOpt.value) ? selectedOpt.textContent : '';
}

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
        document.getElementById('logoPreviewWrap').innerHTML =
            '<img id="logoPreview" src="' + e.target.result + '" alt="로고 미리보기"' +
            ' style="max-width:100%;max-height:100%;object-fit:contain;">';
    };
    reader.readAsDataURL(file);
}

/* 초기화 버튼 — 폼 reset 후 미리보기도 원복 */
function resetForm() {
    document.getElementById('logoPreviewWrap').innerHTML =
        '<i class="bi bi-building text-secondary" style="font-size:2rem;"></i>';
    document.getElementById('industCode').innerHTML =
        '<option value="">-- 대분류를 먼저 선택하세요 --</option>';
    document.getElementById('industName').value = '';
    // Bootstrap 검증 클래스 제거
    document.querySelectorAll('.is-valid, .is-invalid')
            .forEach(el => el.classList.remove('is-valid', 'is-invalid'));
}
function validateForm() {
    let valid = true;

    // 세부 업종 (indust_code)
    const codeSel = document.getElementById('industCode');
    if (!codeSel.value) {
        setInvalid(codeSel, '세부 업종을 선택하세요.');
        valid = false;
    } else {
        setValid(codeSel);
    }

    // 회사명 (com_name)
    const comNameEl = document.getElementById('comName');
    if (!comNameEl.value.trim()) {
        setInvalid(comNameEl, '회사명은 필수입니다. (최대 100자)');
        valid = false;
    } else {
        setValid(comNameEl);
    }

    // 대표자 (com_ceo) — NOT NULL
    const comCeoEl = document.getElementById('comCeo');
    if (!comCeoEl.value.trim()) {
        setInvalid(comCeoEl, '대표자명은 필수입니다.');
        valid = false;
    } else {
        setValid(comCeoEl);
    }

    // 사업자번호 (biz_no) — 형식 검사 + 중복 blur 판정
    const bizNoEl      = document.getElementById('bizNo');
    const bizNoPattern = /^\d{3}-\d{2}-\d{5}$/;
    if (!bizNoPattern.test(bizNoEl.value.trim())) {
        setInvalid(bizNoEl, '사업자번호 형식이 올바르지 않습니다. (예: 123-45-67890)');
        valid = false;
    } else if (bizNoEl.classList.contains('is-invalid')) {
        // checkBizNo() 에서 이미 중복 판정됨
        valid = false;
    }

    return valid;
}

function checkBizNo() {
    const bizNoEl      = document.getElementById('bizNo');
    const spinner      = document.getElementById('bizNoSpinner');
    const bizNo        = bizNoEl.value.trim();
    const bizNoPattern = /^\d{3}-\d{2}-\d{5}$/;

    if (!bizNoPattern.test(bizNo)) {
        setInvalid(bizNoEl, '사업자번호 형식이 올바르지 않습니다. (예: 123-45-67890)');
        return;
    }

    spinner.style.display = '';
    bizNoEl.classList.remove('is-valid', 'is-invalid');

    fetch('${pageContext.request.contextPath}/com/checkBizNo?bizNo=' + encodeURIComponent(bizNo))
        .then(res => res.json())
        .then(data => {
            spinner.style.display = 'none';
            if (data.duplicate) {
                setInvalid(bizNoEl, '이미 사용 중인 사업자번호입니다.');
            } else {
                setValid(bizNoEl);
            }
        })
        .catch(() => {
            spinner.style.display = 'none';
            // 네트워크 오류 시 서버 측 UNIQUE 제약으로 최종 방어
            console.error('사업자번호 중복 체크 중 오류가 발생했습니다.');
        });
}

function setInvalid(el, message) {
    el.classList.remove('is-valid');
    el.classList.add('is-invalid');
    const fb = el.parentElement.querySelector('.invalid-feedback')
             || el.nextElementSibling;
    if (fb && fb.classList.contains('invalid-feedback')) fb.textContent = message;
}

function setValid(el) {
    el.classList.remove('is-invalid');
    el.classList.add('is-valid');
}
</script>

<%@include file="/layout/footer.jsp"%>
