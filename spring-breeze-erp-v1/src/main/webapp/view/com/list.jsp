<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
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
            회사 관리
            <i class="bi bi-chevron-right"></i>
            목록
        </div>
        <h1>회사 관리</h1>
        <p>등록된 회사를 조회하고 관리합니다.</p>
    </div>
    <div class="sb-page-head__actions">
        <a href="${pageContext.request.contextPath}/com/add" class="btn btn-sb btn-sm">
            <i class="bi bi-plus-lg"></i> 회사 등록
        </a>
    </div>
</div>

<!-- 통계 타일 (집계 데이터 연동 전까지 "-" 표시) -->
<div class="row g-3 mb-4">
    <div class="col-sm-6 col-lg-3">
        <div class="sb-stat">
            <div class="sb-stat__top">
                <div class="sb-stat__ico tone-blue"><i class="bi bi-building"></i></div>
                <div class="sb-stat__label">전체 회사</div>
            </div>
            <div class="sb-stat__val">-</div>
        </div>
    </div>
    <div class="col-sm-6 col-lg-3">
        <div class="sb-stat">
            <div class="sb-stat__top">
                <div class="sb-stat__ico tone-green"><i class="bi bi-people"></i></div>
                <div class="sb-stat__label">전체 임직원</div>
            </div>
            <div class="sb-stat__val">-</div>
        </div>
    </div>
    <div class="col-sm-6 col-lg-3">
        <div class="sb-stat">
            <div class="sb-stat__top">
                <div class="sb-stat__ico tone-violet"><i class="bi bi-grid-3x3-gap"></i></div>
                <div class="sb-stat__label">업종 수</div>
            </div>
            <div class="sb-stat__val">-</div>
        </div>
    </div>
    <div class="col-sm-6 col-lg-3">
        <div class="sb-stat">
            <div class="sb-stat__top">
                <div class="sb-stat__ico tone-amber"><i class="bi bi-calendar-plus"></i></div>
                <div class="sb-stat__label">최근 등록 회사</div>
            </div>
            <div class="sb-stat__val" style="font-size:15px;line-height:1.3">-</div>
        </div>
    </div>
</div>

<!-- 목록 카드 -->
<div class="sb-card">

    <!-- 검색 / 필터 툴바 (실제 GET 검색 폼) -->
    <form method="GET" action="${pageContext.request.contextPath}/com/list"
          id="searchForm" class="sb-toolbar">

        <div class="ac-wrap grow" style="max-width:460px">
            <div class="sb-field sb-field--search" style="width:100%">
                <i class="bi bi-search"></i>
                <input type="text" id="keyword" name="keyword"
                       value="${param.keyword}"
                       placeholder="회사명 또는 사업자번호로 검색"
                       autocomplete="off" style="width:100%">
            </div>
            <div class="ac-list" id="acList"></div>
        </div>

		<%-- 오른쪽 정렬용 스페이서: 이 아래 항목들을 우측으로 밀어줌 --%>
		<div class="grow"></div>
		
		<div class="sb-field">
		    <select id="comIndustry" name="industCode"
                    onchange="document.getElementById('pageHidden').value='1'; this.form.submit();">
                <option value="">전체 업종</option>
                <optgroup label="IT · 플랫폼">
                    <option value="IT001" ${param.industCode == 'IT001' ? 'selected' : ''}>IT·플랫폼</option>
                    <option value="IT002" ${param.industCode == 'IT002' ? 'selected' : ''}>IT·서비스</option>
                </optgroup>
                <optgroup label="이커머스">
                    <option value="ECOM001" ${param.industCode == 'ECOM001' ? 'selected' : ''}>이커머스</option>
                    <option value="ECOM002" ${param.industCode == 'ECOM002' ? 'selected' : ''}>이커머스·대형</option>
                </optgroup>
                <optgroup label="O2O · 배달">
                    <option value="O2O001" ${param.industCode == 'O2O001' ? 'selected' : ''}>O2O·배달</option>
                    <option value="O2O002" ${param.industCode == 'O2O002' ? 'selected' : ''}>O2O·여행</option>
                    <option value="O2O003" ${param.industCode == 'O2O003' ? 'selected' : ''}>O2O·홈리빙</option>
                </optgroup>
                <optgroup label="금융 · 카드">
                    <option value="FIN001" ${param.industCode == 'FIN001' ? 'selected' : ''}>금융·카드</option>
                    <option value="FIN002" ${param.industCode == 'FIN002' ? 'selected' : ''}>금융·IT</option>
                </optgroup>
                <optgroup label="통신">
                    <option value="TELCO001" ${param.industCode == 'TELCO001' ? 'selected' : ''}>통신</option>
                    <option value="TELCO002" ${param.industCode == 'TELCO002' ? 'selected' : ''}>통신·인터넷</option>
                </optgroup>
                <optgroup label="게임">
                    <option value="GAME001" ${param.industCode == 'GAME001' ? 'selected' : ''}>게임</option>
                    <option value="GAME002" ${param.industCode == 'GAME002' ? 'selected' : ''}>게임·모바일</option>
                </optgroup>
                <optgroup label="IT · SI / 솔루션">
                    <option value="SI001" ${param.industCode == 'SI001' ? 'selected' : ''}>IT·SI</option>
                    <option value="SI002" ${param.industCode == 'SI002' ? 'selected' : ''}>IT·솔루션</option>
                </optgroup>
                <optgroup label="반도체 · 전자">
                    <option value="ELEC001" ${param.industCode == 'ELEC001' ? 'selected' : ''}>반도체·전자</option>
                    <option value="ELEC002" ${param.industCode == 'ELEC002' ? 'selected' : ''}>디스플레이</option>
                </optgroup>
                <optgroup label="물류 · 유통">
                    <option value="DIST001" ${param.industCode == 'DIST001' ? 'selected' : ''}>물류</option>
                    <option value="DIST002" ${param.industCode == 'DIST002' ? 'selected' : ''}>유통</option>
                </optgroup>
                <optgroup label="미디어 · 콘텐츠">
                    <option value="MEDIA001" ${param.industCode == 'MEDIA001' ? 'selected' : ''}>미디어·콘텐츠</option>
                    <option value="MEDIA002" ${param.industCode == 'MEDIA002' ? 'selected' : ''}>엔터테인먼트</option>
                </optgroup>
                <optgroup label="바이오 · 헬스케어">
                    <option value="BIO001" ${param.industCode == 'BIO001' ? 'selected' : ''}>바이오</option>
                    <option value="BIO002" ${param.industCode == 'BIO002' ? 'selected' : ''}>제약</option>
                </optgroup>
                <optgroup label="건설 · 부동산">
                    <option value="CONST001" ${param.industCode == 'CONST001' ? 'selected' : ''}>건설</option>
                    <option value="CONST002" ${param.industCode == 'CONST002' ? 'selected' : ''}>건설·개발</option>
                </optgroup>
                <optgroup label="에너지">
                    <option value="ENRG001" ${param.industCode == 'ENRG001' ? 'selected' : ''}>에너지·정유</option>
                    <option value="ENRG002" ${param.industCode == 'ENRG002' ? 'selected' : ''}>에너지·전력</option>
                </optgroup>
                <optgroup label="교육 · HR">
                    <option value="EDU001" ${param.industCode == 'EDU001' ? 'selected' : ''}>교육</option>
                    <option value="EDU002" ${param.industCode == 'EDU002' ? 'selected' : ''}>교육·HR</option>
                </optgroup>
                <optgroup label="자동차">
                    <option value="AUTO001" ${param.industCode == 'AUTO001' ? 'selected' : ''}>자동차</option>
                </optgroup>
            </select>
		</div>
		
		<div class="sb-field">
		    <select class="form-select form-select-sm" style="width:auto"
		            id="onepagelist" name="onepagelist"
		            onchange="document.getElementById('pageHidden').value='1'; this.form.submit();">
		        <option value="10" ${paging.onepagelist == 10 || empty paging.onepagelist ? 'selected' : ''}>10개씩 보기</option>
		        <option value="30" ${paging.onepagelist == 30 ? 'selected' : ''}>30개씩 보기</option>
		        <option value="50" ${paging.onepagelist == 50 ? 'selected' : ''}>50개씩 보기</option>
		    </select>
		</div>

        <button type="submit" class="btn btn-sb btn-sm">
            <i class="bi bi-search"></i> 검색
        </button>
        <c:if test="${not empty param.keyword}">
            <a class="btn btn-ghost btn-sm" href="${pageContext.request.contextPath}/com/list">초기화</a>
        </c:if>
        <input type="hidden" name="page" id="pageHidden" value="1">
    </form>

    <!-- 테이블 -->
    <div class="sb-card__body--flush">
        <table class="sb-table">
            <thead>
                <tr>
                    <th style="width:60px">번호</th>
                    <th>회사명</th>
                    <th style="width:90px">대표자</th>
                    <th style="width:140px">사업자번호</th>
                    <th>업종</th>
                    <th class="num" style="width:110px">
                        임직원 수
                    </th>
                    <th style="width:170px"></th>
                </tr>
            </thead>
            <tbody>
            <c:choose>
                <c:when test="${empty items}">
                    <tr>
                        <td colspan="7">
                            <div class="sb-empty">
                                <i class="bi bi-inbox"></i>
                                <p>등록된 회사가 없습니다.</p>
                            </div>
                        </td>
                    </tr>
                </c:when>
                <c:otherwise>
                    <c:forEach var="com" items="${items}" varStatus="status">
                    <tr>
                        <%-- 페이지 역순 번호 --%>
                        <td class="sb-hr-cell tnum">
                            ${paging.listtotal - paging.pstartno - status.index}
                        </td>
                        <td>
                            <div class="sb-rowuser">
                                <span class="sb-avatar" style="border-radius:9px">
                                    <c:choose>
                                        <c:when test="${not empty com.comLogo}">
                                            <img src="${com.comLogo}" alt=""
                                                 style="width:100%;height:100%;object-fit:cover">
                                        </c:when>
                                        <c:otherwise><i class="bi bi-building"></i></c:otherwise>
                                    </c:choose>
                                </span>
                                <div>
                                    <div class="sb-table__name">${com.comName}</div>
                                </div>
                            </div>
                        </td>
                        <td>${com.comCeo}</td>
                        <td class="sb-hr-cell tnum">${com.bizNo}</td>
                        <td>
                            <c:choose>
                                <c:when test="${not empty com.industName}">
                                    <span class="sb-badge sb-badge--gray" style="font-size:11.5px">
                                        ${com.industName}
                                    </span>
                                </c:when>
                                <c:otherwise><span class="text-faint">-</span></c:otherwise>
                            </c:choose>
                        </td>
                        <td class="num tnum">
                            <%-- TODO: empCountMap 연동 시 ${empCountMap[com.comId]} 로 교체 --%>
                            <span class="text-faint">-</span>
                        </td>
                        <td>
                            <div class="d-flex justify-content-end gap-1">
                                <a class="sb-iconbtn"
                                   href="${pageContext.request.contextPath}/com/edit?comId=${com.comId}"
                                   title="수정">
                                    <i class="bi bi-pencil"></i>
                                </a>
                                <a class="sb-iconbtn"
                                   href="${pageContext.request.contextPath}/dept/list?comId=${com.comId}"
                                   title="조직도 보기">
                                    <i class="bi bi-diagram-3"></i>
                                </a>
                                <button type="button" class="sb-iconbtn com-del"
                                        style="color:var(--sb-red)"
                                        data-id="${com.comId}"
                                        data-name="${com.comName}"
                                        title="삭제">
                                    <i class="bi bi-trash3"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    </c:forEach>
                </c:otherwise>
            </c:choose>
            </tbody>
        </table>
    </div>

    <!-- 페이지네이션 -->
    <div class="d-flex align-items-center justify-content-between px-3 py-2"
         style="border-top:1px solid var(--sb-border)">
        <span class="text-faint" style="font-size:12.5px">
            총 <b>${paging.listtotal}</b>개 회사
        </span>
        <c:if test="${paging.pagetotal > 1}">
        <nav aria-label="페이지 이동">
            <ul class="pagination pagination-sm mb-0">
                <li class="page-item ${!(paging.start > 1) ? 'disabled' : ''}">
                    <a class="page-link"
                       href="?keyword=${param.keyword}&onepagelist=${paging.onepagelist}&pstartno=${paging.start - 1}"
                       aria-label="이전"><i class="bi bi-chevron-left"></i></a>
                </li>
                <c:forEach begin="${paging.start}" end="${paging.end}" var="p">
                    <li class="page-item ${p == paging.current ? 'active' : ''}">
                        <a class="page-link"
                           href="?keyword=${param.keyword}&onepagelist=${paging.onepagelist}&pstartno=${p}">${p}</a>
                    </li>
                </c:forEach>
                <li class="page-item ${!(paging.end < paging.pagetotal) ? 'disabled' : ''}">
                    <a class="page-link"
                       href="?keyword=${param.keyword}&onepagelist=${paging.onepagelist}&pstartno=${paging.end + 1}"
                       aria-label="다음"><i class="bi bi-chevron-right"></i></a>
                </li>
            </ul>
        </nav>
        </c:if>
    </div>
</div>
</main>
<script>
(function () {
    "use strict";
    const CTX = "${pageContext.request.contextPath}";

    /* ===================== 실시간 자동완성 ===================== */
    const kwInput = document.getElementById("keyword");
    const acList  = document.getElementById("acList");
    let debounceTimer = null;
    let acIndex = -1;

    kwInput.addEventListener("input", function () {
        const kw = this.value.trim();
        clearTimeout(debounceTimer);
        if (!kw) { hideAc(); return; }
        debounceTimer = setTimeout(() => fetchSuggest(kw), 220);
    });

    kwInput.addEventListener("keydown", function (e) {
        const items = [...acList.querySelectorAll(".ac-item")];
        if (!items.length) return;
        if (e.key === "ArrowDown") { e.preventDefault(); acIndex = Math.min(acIndex + 1, items.length - 1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); acIndex = Math.max(acIndex - 1, 0); }
        else if (e.key === "Enter" && acIndex >= 0) { e.preventDefault(); items[acIndex].dispatchEvent(new Event("mousedown")); return; }
        else return;
        items.forEach((it, i) => it.classList.toggle("active", i === acIndex));
    });

    document.addEventListener("click", function (e) {
        if (!kwInput.contains(e.target) && !acList.contains(e.target)) hideAc();
    });

    function fetchSuggest(kw) {
        fetch(CTX + "/com/suggest?keyword=" + encodeURIComponent(kw))
            .then(function (res) {
                if (!res.ok) throw new Error("network error");
                return res.json();
            })
            .then(function (data) { renderAc(data, kw); })
            .catch(hideAc);
    }

    function renderAc(data, kw) {
        acList.innerHTML = "";
        acIndex = -1;

        if (!data || data.length === 0) {
            acList.innerHTML = '<div class="ac-empty">일치하는 회사가 없습니다.</div>';
            acList.classList.add("show");
            return;
        }

        data.forEach(function (item) {
            const div = document.createElement("div");
            div.className = "ac-item";
            div.innerHTML =
                '<i class="bi bi-building text-faint"></i>'
                + '<span>' + highlight(item.comName, kw) + '</span>'
                + '<span class="ac-item__meta">' + (item.bizNo || "") + '</span>';

            div.addEventListener("mousedown", function (e) {
                e.preventDefault(); // blur 방지
                kwInput.value = item.comName;
                hideAc();
                document.getElementById("searchForm").submit();
            });

            acList.appendChild(div);
        });

        acList.classList.add("show");
    }

    function highlight(text, kw) {
        if (!kw) return text;
        const escaped = kw.replace(/[.*+?^$\x7B\x7D()|[\]\\]/g, "\\$&");
        return text.replace(new RegExp("(" + escaped + ")", "gi"), "<b>$1</b>");
    }

    function hideAc() {
        acList.classList.remove("show");
        acList.innerHTML = "";
        acIndex = -1;
    }

    /* ===================== 삭제 (관리자 비밀번호 확인 모달) =====================
       ⚠ TODO: 현재 비밀번호 검증은 클라이언트 측 임시 로직(1234)입니다.
                실제 운영 전 서버 인증 API 연동으로 반드시 교체하세요.
    ================================================================== */
    document.querySelectorAll(".com-del").forEach(function (btn) {
        btn.addEventListener("click", function () {
            openDeleteModal(btn.dataset.id, btn.dataset.name);
        });
    });

    function openDeleteModal(comId, comName) {
        const m = SB.modal({
            title: '<span style="color:var(--sb-red)"><i class="bi bi-shield-exclamation me-1"></i>회사 삭제</span>',
            body:
                '<div class="del-modal-icon"><i class="bi bi-building-x"></i></div>'
                + '<div class="del-company-name">' + comName + '</div>'
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
            if (pwInput.value !== "1234") {
                pwErr.style.display = "";
                pwInput.classList.add("is-invalid");
                pwInput.focus();
                return;
            }
            const params = new URLSearchParams({
                comId: comId,
                page: "${currentPage}",
                keyword: "${param.keyword}"
            });
            location.href = CTX + "/com/delete?" + params.toString();
        });
    }
})();
</script>

<%@include file="/layout/footer.jsp"%>
