<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@include file="/layout/header.jsp"%>

<main class="sb-content">
<!-- 페이지 헤더 -->
<div class="sb-page-head">
    <div class="sb-page-head__txt">
        <div class="sb-breadcrumb">
            <a href="${pageContext.request.contextPath}/">홈</a>
            <i class="bi bi-chevron-right"></i>
            <a href="${pageContext.request.contextPath}/com/list">회사 관리</a>
            <i class="bi bi-chevron-right"></i>
            등록
        </div>
        <h1>회사 등록</h1>
        <p>새로운 회사를 시스템에 등록합니다.</p>
    </div>
    <div class="sb-page-head__actions">
        <a href="${pageContext.request.contextPath}/com/list" class="btn btn-ghost btn-sm">
            <i class="bi bi-arrow-left"></i> 목록으로
        </a>
    </div>
</div>

<%-- 서버 측 오류 메시지 출력 --%>
<c:if test="${not empty errorMsg}">
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-1"></i>
        ${errorMsg}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
</c:if>

<form method="post"
      action="${pageContext.request.contextPath}/com/add"
      enctype="multipart/form-data"
      id="companyForm"
      onsubmit="return validateForm()">
    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>

    <!-- ① 업종 분류 -->
    <div class="sb-card mb-3">
        <div class="sb-card__head">
            <h2><i class="bi bi-tag me-2 text-soft"></i>업종 분류</h2>
<!--             <div class="right"> -->
<!--                 <span class="sql-chip"><i class="bi bi-database"></i>indust_code · indust_name</span> -->
<!--             </div> -->
        </div>
        <div class="sb-card__body">
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="sb-form-label">
                        업종 대분류 <span style="color:var(--sb-red)">*</span>
                    </label>
                    <select class="form-select" id="industGrp" onchange="onGrpChange()">
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
                    <div class="text-faint mt-1" style="font-size:12px">
                        먼저 대분류를 선택하면 세부 업종이 표시됩니다.
                    </div>
                </div>
                <div class="col-md-6">
                    <label class="sb-form-label">
                        세부 업종 <span style="color:var(--sb-red)">*</span>
                    </label>
                    <div class="d-flex align-items-center gap-2" style="flex-wrap:wrap">
                        <select class="form-select" id="industCode" name="industCode"
                                onchange="syncIndustName()" required style="max-width:320px">
                            <option value="">-- 대분류를 먼저 선택하세요 --</option>
                        </select>
                        <span id="industCodeChip" class="indust-code-chip" style="display:none"></span>
                    </div>
                    <div class="invalid-feedback">세부 업종을 선택하세요.</div>
                </div>

                <%-- DB 저장: indust_name (NOT NULL) — JS로 자동 채움 --%>
                 <input type="hidden" id="industName" name="industName" value="${com.industName}"/>
            </div>
        </div>
    </div>

    <!-- ② 기본 정보 -->
    <div class="sb-card mb-3">
        <div class="sb-card__head">
            <h2><i class="bi bi-building me-2 text-soft"></i>기본 정보</h2>
            <div class="right">
                <span class="sql-chip"><i class="bi bi-database"></i>company</span>
            </div>
        </div>
        <div class="sb-card__body">
            <div class="row g-3">
                <!-- com_name -->
                <div class="col-md-8">
                    <label class="sb-form-label">
                        회사명 <span style="color:var(--sb-red)">*</span>
                        <code class="field-hint">com_name VARCHAR(100)</code>
                    </label>
                    <input type="text" class="form-control" id="comName" name="comName"
                           placeholder="예: (주)선빈테크놀로지" maxlength="100"
                           value="${com.comName}" required>
                    <div class="invalid-feedback">회사명은 필수입니다. (최대 100자)</div>
                </div>
                <!-- com_ceo -->
                <div class="col-md-4">
                    <label class="sb-form-label">
                        대표자 <span style="color:var(--sb-red)">*</span>
                        <code class="field-hint">com_ceo VARCHAR(100)</code>
                    </label>
                    <input type="text" class="form-control" id="comCeo" name="comCeo"
                           placeholder="대표자명" maxlength="100"
                           value="${com.comCeo}" required>
                    <div class="invalid-feedback">대표자명은 필수입니다.</div>
                </div>
                <!-- biz_no -->
                <div class="col-md-6">
                    <label class="sb-form-label">
                        사업자등록번호 <span style="color:var(--sb-red)">*</span>
                        <code class="field-hint">biz_no VARCHAR(45)</code>
                    </label>
                    <div class="input-group has-validation">
                        <input type="text" class="form-control" id="bizNo" name="bizNo"
                               placeholder="000-00-00000" maxlength="45"
                               onblur="checkBizNo()"
                               value="${com.bizNo}" required>
                        <span class="input-group-text" id="bizNoSpinner" style="display:none;">
                            <span class="spinner-border spinner-border-sm text-secondary"></span>
                        </span>
                        <div class="invalid-feedback">사업자번호 형식이 올바르지 않거나 이미 사용 중입니다. (예: 123-45-67890)</div>
                        <div class="valid-feedback">사용 가능한 사업자번호입니다.</div>
                    </div>
                    <div class="text-faint mt-1" style="font-size:12px">형식: 123-45-67890</div>
                </div>
                <!-- com_tel -->
                <div class="col-md-6">
                    <label class="sb-form-label"> 대표 전화 </label>
                    <input type="tel" class="form-control" id="comTel" name="comTel"
                           placeholder="02-0000-0000" maxlength="100"
                           value="${com.comTel}">
                    <div class="text-faint mt-1" style="font-size:12px">선택 입력</div>
                </div>
            </div>
        </div>
    </div>

    <!-- ③ 회사 로고 -->
    <div class="sb-card mb-3">
        <div class="sb-card__head">
            <h2><i class="bi bi-image me-2 text-soft"></i>회사 로고</h2>
            <span class="sub">PNG · JPG · SVG · WEBP, 최대 2MB</span>
        </div>
        <div class="sb-card__body">
            <div class="logo-zone">
                <div class="logo-preview" id="logoPreviewWrap">
                    <c:choose>
                        <c:when test="${not empty com.comLogo}">
                            <img id="logoPreview" src="${pageContext.request.contextPath}${com.comLogo}" alt="로고 미리보기"
                                 style="width:100%;height:100%;object-fit:cover">
                        </c:when>
                        <c:otherwise>
                            <i id="logoPlaceholder" class="bi bi-building"></i>
                        </c:otherwise>
                    </c:choose>
                </div>
                <div class="flex-grow-1">
                    <input type="file" class="form-control" id="comLogo" name="logoFile"
                           accept="image/png, image/jpeg, image/svg+xml, image/webp"
                           onchange="previewLogo(this)">
                    <div class="text-faint mt-1" style="font-size:12px">
                        정사각형 이미지 권장 · 업로드된 파일 경로를 VARCHAR(500)으로 저장 · 미입력 시 기본 이미지 사용
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 폼 버튼 -->
    <div class="d-flex gap-2 justify-content-end mt-2">
        <button type="reset" class="btn btn-ghost" onclick="resetForm()">초기화</button>
        <a href="${pageContext.request.contextPath}/com/list" class="btn btn-ghost">목록</a>
        <button type="submit" class="btn btn-sb">
            <i class="bi bi-check-lg"></i> 등록하기
        </button>
    </div>
</form>

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
   페이지 진입 시 초기화 (검증 실패 후 재진입 시 기존 값 복원)
────────────────────────────────────────────────── */
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

    const chip = document.getElementById('industCodeChip');
    chip.textContent = savedCode;
    chip.style.display = '';
})();

/* 대분류 변경 시 세부 업종 목록 재구성 */
function onGrpChange() {
    const grp = document.getElementById('industGrp').value;
    buildIndustCode(grp, '');
    document.getElementById('industName').value = '';
    document.getElementById('industCodeChip').style.display = 'none';
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

/* 세부 업종 선택 시 industName hidden 필드 + 코드 칩 자동 갱신 */
function syncIndustName() {
    const codeSel = document.getElementById('industCode');
    const selectedOpt = codeSel.options[codeSel.selectedIndex];
    const chip = document.getElementById('industCodeChip');

    if (selectedOpt && selectedOpt.value) {
        document.getElementById('industName').value = selectedOpt.textContent;
        chip.textContent = selectedOpt.value;
        chip.style.display = '';
    } else {
        document.getElementById('industName').value = '';
        chip.style.display = 'none';
    }
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
    reader.onload = function (e) {
        document.getElementById('logoPreviewWrap').innerHTML =
            '<img id="logoPreview" src="' + e.target.result + '" alt="로고 미리보기"' +
            ' style="width:100%;height:100%;object-fit:cover">';
    };
    reader.readAsDataURL(file);
}

/* 초기화 버튼 — 폼 reset 후 미리보기·업종 칩도 원복 */
function resetForm() {
    document.getElementById('logoPreviewWrap').innerHTML =
        '<i id="logoPlaceholder" class="bi bi-building"></i>';
    document.getElementById('industCode').innerHTML =
        '<option value="">-- 대분류를 먼저 선택하세요 --</option>';
    document.getElementById('industName').value = '';
    document.getElementById('industCodeChip').style.display = 'none';
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
        	console.log(data)
        	
            spinner.style.display = 'none';
            if (data.duplicate) {
                setInvalid(bizNoEl, '이미 사용 중인 사업자번호입니다.');
            } else {
                setValid(bizNoEl);
            }
        })
        .catch(() => {
            spinner.style.display = 'none';
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
</main>
<%@include file="/layout/footer.jsp"%>