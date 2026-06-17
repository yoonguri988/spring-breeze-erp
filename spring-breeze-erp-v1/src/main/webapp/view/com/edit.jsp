<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@include file="../inc/header.jsp"%>

<div class="container my-5" style="max-width:700px;">

    <%-- 페이지 헤더 --%>
    <div class="d-flex align-items-center gap-2 mb-4">
        <a href="${pageContext.request.contextPath}/com/list"
           class="btn btn-sm btn-outline-secondary">
            <i class="bi bi-arrow-left fs-5"></i>
        </a>
        <h5 class="mb-0 fw-semibold">회사 정보 수정</h5>
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
                  action="${pageContext.request.contextPath}/com/edit"
                  enctype="multipart/form-data"
                  id="editForm"
                  onsubmit="return validateForm()">
                <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>

                <%-- PK: com_id (수정 대상 식별) --%>
                <input type="hidden" name="comId" value="${com.comId}"/>

                <h6 class="fw-semibold text-secondary mb-3 border-bottom pb-2">
                    <i class="bi bi-tag me-1"></i>업종 분류
                </h6>

                <div class="row g-3 mb-3">

                    <%-- UI 전용: 업종 대분류 (DB 컬럼 없음, name 없음) --%>
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
                        <div class="form-text text-muted">대분류를 선택하면 세부 업종이 표시됩니다.</div>
                    </div>

                    <%-- DB 저장: indust_code (NOT NULL) --%>
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

                    <%-- com_name VARCHAR(100) NOT NULL --%>
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

                    <%-- com_ceo VARCHAR(100) NOT NULL --%>
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

                    <%-- biz_no VARCHAR(45) UNIQUE — 수정 불가(readonly), hidden으로 값 전송 --%>
                    <div class="col-md-6">
                        <label for="bizNo" class="form-label fw-medium">사업자번호</label>
                        <input type="text" class="form-control bg-light" id="bizNo"
                               value="${com.bizNo}" readonly>
                        <input type="hidden" name="bizNo" value="${com.bizNo}"/>
                        <div class="form-text text-muted">
                            <i class="bi bi-lock-fill me-1"></i>사업자번호는 수정할 수 없습니다.
                        </div>
                    </div>

                    <%-- com_tel VARCHAR(100) NULL --%>
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

                        <%-- 현재 로고 미리보기 --%>
                        <div id="logoPreviewWrap"
                             class="border rounded d-flex align-items-center justify-content-center bg-light flex-shrink-0"
                             style="width:80px;height:80px;overflow:hidden;">
                            <c:choose>
                                <c:when test="${not empty com.comLogo}">
                                    <img id="logoPreview" src="${com.comLogo}" alt="현재 로고"
                                         style="max-width:100%;max-height:100%;object-fit:contain;">
                                </c:when>
                                <c:otherwise>
                                    <i class="bi bi-building text-secondary" style="font-size:2rem;"></i>
                                </c:otherwise>
                            </c:choose>
                        </div>

                        <%-- 새 로고 업로드 (com_logo, VARCHAR 500) --%>
                        <div class="flex-grow-1">
                            <input type="file" class="form-control" id="comLogo" name="comLogo"
                                   accept="image/png, image/jpeg, image/svg+xml, image/webp"
                                   onchange="previewLogo(this)">
                            <div class="form-text text-muted mt-1">
                                PNG · JPG · SVG · WEBP, 최대 2MB.<br>
                                파일을 선택하지 않으면 기존 로고가 유지됩니다.
                            </div>
                        </div>
                    </div>
                </div>

                <div class="d-flex gap-2 justify-content-end mt-2">
                    <button type="button" class="btn btn-outline-secondary"
                            onclick="resetForm()">초기화</button>
                    <a href="${pageContext.request.contextPath}/com/list"
                       class="btn btn-outline-dark">목록</a>
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-floppy me-1"></i>저장
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

(function init() {
    const savedCode = '${com.industCode}';
    const savedName = '${com.industName}';

    if (!savedCode) return;

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
    buildIndustCode(document.getElementById('industGrp').value, '');
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
    const sel = codeSel.options[codeSel.selectedIndex];
    document.getElementById('industName').value =
        (sel && sel.value) ? sel.textContent : '';
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
            '<img src="' + e.target.result + '" alt="새 로고 미리보기"' +
            ' style="max-width:100%;max-height:100%;object-fit:contain;">';
    };
    reader.readAsDataURL(file);
}

function resetForm() {
    // 업종: DB에 저장된 값으로 복원
    const savedCode = '${com.industCode}';
    const savedName = '${com.industName}';
    const grpSel    = document.getElementById('industGrp');

    grpSel.value = '';
    document.getElementById('industCode').innerHTML =
        '<option value="">-- 대분류를 먼저 선택하세요 --</option>';
    document.getElementById('industName').value = '';

    if (savedCode) {
        for (const [grp, items] of Object.entries(INDUST_MAP)) {
            if (items.some(([code]) => code === savedCode)) {
                grpSel.value = grp;
                buildIndustCode(grp, savedCode);
                break;
            }
        }
        document.getElementById('industName').value = savedName;
    }

    // 텍스트 필드 복원
    document.getElementById('comName').value = '${com.comName}';
    document.getElementById('comCeo').value  = '${com.comCeo}';
    document.getElementById('comTel').value  = '${com.comTel}';

    // 로고 미리보기 원복
    const wrap = document.getElementById('logoPreviewWrap');
    const existingLogo = '${com.comLogo}';
    wrap.innerHTML = existingLogo
        ? '<img src="' + existingLogo + '" alt="현재 로고"' +
          ' style="max-width:100%;max-height:100%;object-fit:contain;">'
        : '<i class="bi bi-building text-secondary" style="font-size:2rem;"></i>';

    // 파일 input 초기화
    document.getElementById('comLogo').value = '';

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

    // 대표자 (com_ceo)
    const comCeoEl = document.getElementById('comCeo');
    if (!comCeoEl.value.trim()) {
        setInvalid(comCeoEl, '대표자명은 필수입니다.');
        valid = false;
    } else {
        setValid(comCeoEl);
    }

    return valid;
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

<%@include file="../inc/footer.jsp"%>
