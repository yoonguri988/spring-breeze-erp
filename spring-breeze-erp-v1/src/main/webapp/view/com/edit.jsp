<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
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
            수정
            <span class="admin-tag ms-2">관리자</span>
        </div>
        <h1>${com.comName} · 수정</h1>
        <p> 회사 정보를 수정합니다.  </p>
    </div>
    <div class="sb-page-head__actions">
        <button type="button" class="btn btn-ghost btn-sm" id="delBtn"
                style="color:var(--sb-red);border-color:#f3c9c9">
            <i class="bi bi-trash3"></i> 삭제
        </button>
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

<!-- 탭 헤더 -->
<div class="sb-tabs">
    <div class="sb-tab active" data-tab="info">
        <i class="bi bi-building"></i> 기본정보
    </div>
    <div class="sb-tab" data-tab="dept">
        <i class="bi bi-diagram-3"></i> 부서관리
    </div>
</div>

<!-- Tab 1: 기본정보-->
<div class="sb-tab-panel active" id="tab-info">
    <form method="post"
          action="${pageContext.request.contextPath}/com/edit"
          enctype="multipart/form-data"
          id="editForm"
          onsubmit="return validateForm()">
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>

        <%-- PK: com_id (수정 대상 식별) --%>
        <input type="hidden" name="comId" value="${com.comId}"/>

        <!-- ① 업종 분류 -->
        <div class="sb-card mb-3">
            <div class="sb-card__head">
                <h2><i class="bi bi-tag me-2 text-soft"></i>업종 분류</h2>
            </div>
            <div class="sb-card__body">
                <div class="row g-3">
                    <%-- UI 전용: 업종 대분류 (DB 컬럼 없음, name 없음) --%>
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
                            대분류를 선택하면 세부 업종이 표시됩니다.
                        </div>
                    </div>

                    <%-- DB 저장: indust_code (NOT NULL) --%>
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
                    <span class="sb-badge sb-badge--gray">COM-<fmt:formatNumber value="${com.comId}" pattern="000"/></span>
                </div>
            </div>
            <div class="sb-card__body">
                <div class="row g-3">
                    <%-- com_name VARCHAR(100) NOT NULL --%>
                    <div class="col-md-8">
                        <label class="sb-form-label">
                            회사명 <span style="color:var(--sb-red)">*</span>
                        </label>
                        <input type="text" class="form-control" id="comName" name="comName"
                               placeholder="회사명을 입력하세요" maxlength="100"
                               value="${com.comName}" required>
                        <div class="invalid-feedback">회사명은 필수입니다. (최대 100자)</div>
                    </div>

                    <%-- com_ceo VARCHAR(100) NOT NULL --%>
                    <div class="col-md-4">
                        <label class="sb-form-label">
                            대표자 <span style="color:var(--sb-red)">*</span>
                        </label>
                        <input type="text" class="form-control" id="comCeo" name="comCeo"
                               placeholder="대표자명" maxlength="100"
                               value="${com.comCeo}" required>
                        <div class="invalid-feedback">대표자명은 필수입니다.</div>
                    </div>

                    <%-- biz_no VARCHAR(45) UNIQUE — 수정 불가(readonly), hidden으로 값 전송 --%>
                    <div class="col-md-6">
                        <label class="sb-form-label">사업자번호</label>
                        <input type="text" class="form-control" id="bizNo"
                               value="${com.bizNo}" readonly
                               style="background:#fafbfc;color:var(--sb-ink-soft)">
                        <input type="hidden" name="bizNo" value="${com.bizNo}"/>
                        <div class="text-faint mt-1" style="font-size:12px">
                            <i class="bi bi-lock-fill me-1"></i>사업자번호는 수정할 수 없습니다.
                        </div>
                    </div>

                    <%-- com_tel VARCHAR(100) NULL --%>
                    <div class="col-md-6">
                        <label class="sb-form-label">대표 전화</label>
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
                                <img id="logoPreview" src="${pageContext.request.contextPath}${com.comLogo}" alt="현재 로고"
                                     style="width:100%;height:100%;object-fit:cover">
                            </c:when>
                            <c:otherwise>
                                <i class="bi bi-building"></i>
                            </c:otherwise>
                        </c:choose>
                    </div>
                    <div class="flex-grow-1">
                        <input type="file" class="form-control" id="logoFile" name="logoFile"
                               accept="image/png, image/jpeg, image/svg+xml, image/webp"
                               onchange="previewLogo(this)">
                        <div class="text-faint mt-1" style="font-size:12px">
                            PNG · JPG · SVG · WEBP, 최대 2MB.<br>
                            파일을 선택하지 않으면 기존 로고가 유지됩니다.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-flex gap-2 justify-content-end mt-2">
            <button type="button" class="btn btn-ghost" onclick="resetForm()">초기화</button>
            <a href="${pageContext.request.contextPath}/com/list" class="btn btn-ghost">목록</a>
            <button type="submit" class="btn btn-sb">
                <i class="bi bi-floppy me-1"></i>저장
            </button>
        </div>
    </form>
</div><!-- /tab-info -->

<!-- Tab 2: 부서관리  -->
<div class="sb-tab-panel" id="tab-dept">
    <c:set var="returnUrl" scope="request"
           value="${pageContext.request.contextPath}/com/edit?comId=${comId}"/>
    <jsp:include page="../dept/deptTreeTab.jsp"/>
</div><!-- /tab-dept -->

<script>
(function () {
    "use strict";
    const CTX = "${pageContext.request.contextPath}";

    /* ── 탭 전환 ── */
    document.querySelectorAll(".sb-tab").forEach(function (tab) {
        tab.addEventListener("click", function () {
            document.querySelectorAll(".sb-tab").forEach(function (t) { t.classList.remove("active"); });
            document.querySelectorAll(".sb-tab-panel").forEach(function (p) { p.classList.remove("active"); });
            tab.classList.add("active");
            document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
        });
    });

    /* ── 삭제 (관리자 비밀번호 확인 모달) ──
       ⚠ TODO: 임시 클라이언트 검증(admin123)입니다. 서버 인증 연동 전까지만 사용하세요.
    */
    document.getElementById("delBtn").addEventListener("click", function () {
        const m = SB.modal({
            title: '<span style="color:var(--sb-red)"><i class="bi bi-shield-exclamation me-1"></i>회사 삭제</span>',
            body:
                '<div class="del-modal-icon"><i class="bi bi-building-x"></i></div>'
                + '<div class="del-company-name">${com.comName}</div>'
                + '<div class="del-warning">'
                +   '삭제 시 연결된 부서·사원 데이터에 영향을 줄 수 있습니다.<br>'
                +   '계속하려면 <b>관리자 비밀번호</b>를 입력하세요.'
                + '</div>'
                + '<div class="mb-2">'
                +   '<label class="sb-form-label">관리자 비밀번호 <span style="color:var(--sb-red)">*</span></label>'
                +   '<input type="password" class="form-control" id="delPw" placeholder="비밀번호 입력" autocomplete="new-password">'
                +   '<div id="delPwErr" style="display:none;color:var(--sb-red);font-size:12.5px;margin-top:6px">'
                +     '<i class="bi bi-exclamation-circle-fill me-1"></i>비밀번호가 올바르지 않습니다.'
                +   '</div>'
                + '</div>',
            footer:
                '<button class="btn btn-ghost" data-bs-dismiss="modal">취소</button>'
                + '<button class="btn btn-sb" id="delYes" style="background:var(--sb-red);border-color:var(--sb-red)">'
                +   '<i class="bi bi-trash3"></i> 삭제 확인'
                + '</button>',
        });

        const pwInput = m.el.querySelector("#delPw");
        const pwErr   = m.el.querySelector("#delPwErr");
        setTimeout(function () { pwInput.focus(); }, 300);

        pwInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") { e.preventDefault(); m.el.querySelector("#delYes").click(); }
        });
        pwInput.addEventListener("input", function () {
            pwErr.style.display = "none";
            pwInput.classList.remove("is-invalid");
        });

        m.el.querySelector("#delYes").addEventListener("click", function () {
            if (pwInput.value !== "admin123") {
                pwErr.style.display = "";
                pwInput.classList.add("is-invalid");
                pwInput.focus();
                return;
            }
            location.href = CTX + "/com/delete?comId=${com.comId}";
        });
    });
})();

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

    const chip = document.getElementById('industCodeChip');
    chip.textContent = savedCode;
    chip.style.display = '';
})();

/* 대분류 변경 시 세부 업종 목록 재구성 */
function onGrpChange() {
    buildIndustCode(document.getElementById('industGrp').value, '');
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
    const sel = codeSel.options[codeSel.selectedIndex];
    const chip = document.getElementById('industCodeChip');

    if (sel && sel.value) {
        document.getElementById('industName').value = sel.textContent;
        chip.textContent = sel.value;
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
            '<img src="' + e.target.result + '" alt="새 로고 미리보기"' +
            ' style="width:100%;height:100%;object-fit:cover">';
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
    document.getElementById('industCodeChip').style.display = 'none';

    if (savedCode) {
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
    }

    // 텍스트 필드 복원
    document.getElementById('comName').value = '${com.comName}';
    document.getElementById('comCeo').value  = '${com.comCeo}';
    document.getElementById('comTel').value  = '${com.comTel}';

    // 로고 미리보기 원복
    const wrap = document.getElementById('logoPreviewWrap');
    const existingLogo = '${com.comLogo}';
    wrap.innerHTML = existingLogo
        ? '<img src="' + existingLogo + '" alt="현재 로고" style="width:100%;height:100%;object-fit:cover">'
        : '<i class="bi bi-building"></i>';

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
</main>
<%@include file="/layout/footer.jsp"%>