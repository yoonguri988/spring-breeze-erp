<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>   
<%@include file="../inc/header.jsp"%>
<script>
window.addEventListener("load", function () {
    let msg = "${msg}";
    if (msg !== "") alert(msg);
});
</script>
<div class="container my-5">
<!-- 페이지 헤더 -->
	<div class="d-flex align-items-center justify-content-between mb-3">
		<h4 class="mb-0 fw-semibold">회사 목록</h4>
		<a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/com/add.do">
			회사 등록
		</a>
	</div>
	<!-- 검색 카드 박스 -->
    <div class="card mb-3 shadow-sm">
        <div class="card-body py-3">
            <form method="GET"
                  action="${pageContext.request.contextPath}/com/list.do"
                  id="searchForm">
                <div class="d-flex gap-2 align-items-center">
                    <%-- 검색창 --%>
                    <div class="input-group flex-grow-1">
                        <span class="input-group-text bg-white border-end-0">
                            <i class="bi bi-search text-secondary"></i>
                        </span>
                        <input type="text"
                               class="form-control border-start-0 ps-0"
                               id="keyword"
                               name="keyword"
                               value="${param.keyword}"
                               placeholder="회사명 또는 사업자번호로 검색"
                               autocomplete="off">
                        <button type="submit" class="btn btn-primary px-4">검색</button>
                        <c:if test="${not empty param.keyword}">
                            <a class="btn btn-outline-secondary"
                               href="${pageContext.request.contextPath}/com/list.do">
                                초기화
                            </a>
                        </c:if>
                    </div>
                    <%-- 페이지당 건수 선택 --%>
                    <select class="form-select w-auto flex-shrink-0"
                            id="onepagelist"
                            name="onepagelist"
                            onchange="this.form.page.value='1'; this.form.submit();">
                        <option value="10"  ${paging.onepagelist == 10  || empty paging.onepagelist ? 'selected' : ''}>10개씩 보기</option>
                        <option value="30"  ${paging.onepagelist == 30  ? 'selected' : ''}>30개씩 보기</option>
                        <option value="50"  ${paging.onepagelist == 50  ? 'selected' : ''}>50개씩 보기</option>
                    </select>
                </div>
                <input type="hidden" name="page" value="1" id="pageHidden">
            </form>

            <%-- ── 실시간 자동완성 드롭다운 ── --%>
            <div id="suggestBox" class="position-relative" style="display:none;">
                <ul id="suggestList"
                    class="list-group shadow-sm position-absolute w-100"
                    style="z-index:1000; top:4px; border-radius:6px; overflow:hidden;">
                </ul>
            </div>
        </div>
    </div>
	<!-- 검색 결과 안내 -->
    <c:if test="${not empty param.keyword}">
        <p class="text-muted small mb-2">
            <strong>"${param.keyword}"</strong> 검색 결과
            <span class="badge bg-secondary ms-1">${paging.listtotal}건</span>
        </p>
    </c:if>
    <!-- 테이블 -->
	<div class="card shadow-sm">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th class="text-center" style="width:60px;">번호</th>
                        <th>회사명</th>
                        <th class="text-center" style="width:140px;">사업자번호</th>
                        <th class="text-center" style="width:130px;">전화번호</th>
                        <th class="text-center" style="width:250px;">관리</th>
                    </tr>
                </thead>
                <tbody>
                <c:choose>
                    <c:when test="${empty items}">
                        <tr>
                            <td colspan="6" class="text-center py-5 text-muted">
                                <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                                등록된 회사가 없습니다.
                            </td>
                        </tr>
                    </c:when>
                    <c:otherwise>
                        <c:forEach var="com" items="${items}" varStatus="status">
                        <tr>
                            <%-- 페이지 역순 번호 --%>
                            <td class="text-center text-muted small">
                            	${paging.listtotal - paging.pstartno - status.index}
                            </td>
                            <td>
                                <span class="fw-medium">${com.comName}</span>
                            </td>
                            <td class="text-center text-muted small">${com.bizNo}</td>
                            <td class="text-center text-muted small">${com.comTel}</td>
                            <td class="text-center">
                                <%-- 수정 --%>
                                <a class="btn btn-outline-primary btn-sm"
                                   href="${pageContext.request.contextPath}/com/edit.do?comId=${com.comId}"
                                   title="수정">
                                   수정
                                </a>
                                <%-- 조직도 보기 --%>
                                <a class="btn btn-outline-secondary btn-sm"
                                   href="${pageContext.request.contextPath}/dept/list.do?comId=${com.comId}"
                                   title="조직도 보기">
                                   조직도
                                </a>
                                <a class="btn btn-outline-danger btn-sm"
                                   href="${pageContext.request.contextPath}/com/delete.do?comId=${com.comId}&page=${currentPage}&keyword=${param.keyword}"
                                   onclick="return confirm('해당 회사를 삭제하시겠습니까?')"
                                   title="삭제">
                                   삭제
                                </a>
                            </td>
                        </tr>
                        </c:forEach>
                    </c:otherwise>
                </c:choose>
                </tbody>
            </table>
        </div>
    </div>
	<c:if test="${paging.listtotal > 1}">
    <nav class="mt-3" aria-label="페이지 이동">
        <ul class="pagination justify-content-center mb-0">
            <%-- 이전 --%>
            <li class="page-item <c:if test="${!(paging.start > 1)}">disabled</c:if>">
                <a class="page-link"
                   href="?keyword=${param.keyword}&onepagelist=${paging.onepagelist}&pstartno=${paging.start - 1}"
                   aria-label="이전" >이전</a>
            </li>

            <c:forEach begin="${paging.start}" end="${paging.end}" var="p">
                <li class="page-item ${p == paging.current ? 'active' : ''}">
                    <a class="page-link"
                       href="?keyword=${param.keyword}&onepagelist=${paging.onepagelist}&pstartno=${p}">${p}</a>
                </li>
            </c:forEach>

            <%-- 다음 --%>
            <li class="page-item <c:if test="${!(paging.end < paging.pagetotal)}">disabled</c:if>">
                <a class="page-link"
                   href="?keyword=${param.keyword}&onepagelist=${paging.onepagelist}&pstartno=${paging.end + 1}"
                   aria-label="다음">다음</a>
            </li>
        </ul>
    </nav>
    </c:if>    
</div>
<script>
(function () {
    const input      = document.getElementById("keyword");
    const suggestBox = document.getElementById("suggestBox");
    const suggestList= document.getElementById("suggestList");
    const CTX        = "${pageContext.request.contextPath}";

    let debounceTimer = null;
    let currentFocus  = -1;   // 키보드 탐색용

    /* ── 입력 이벤트 ── */
    input.addEventListener("input", function () {
        const kw = this.value.trim();
        clearTimeout(debounceTimer);

        if (kw.length < 1) {
            hideSuggest();
            return;
        }

        debounceTimer = setTimeout(() => fetchSuggest(kw), 220);
    });

    function setActive(items) {
        items.forEach((el, i) => {
            el.classList.toggle("active", i === currentFocus);
        });
    }

    /* ── 외부 클릭 시 닫기 ── */
    document.addEventListener("click", function (e) {
        if (!input.contains(e.target) && !suggestList.contains(e.target)) {
            hideSuggest();
        }
    });

    /* ── AJAX 호출 ── */
    function fetchSuggest(kw) {
        fetch(CTX + "/com/suggest.do?keyword=" + encodeURIComponent(kw))
            .then(res => {
                if (!res.ok) throw new Error("network error");
                return res.json();
            })
            .then(data => renderSuggest(data, kw))
            .catch(() => hideSuggest());
    }

    /* ── 렌더링 ── */
    function renderSuggest(data, kw) {
        suggestList.innerHTML = "";
        currentFocus = -1;

        if (!data || data.length === 0) {
            hideSuggest();
            return;
        }

        data.forEach(function (item) {
            const li = document.createElement("li");
            li.className = "list-group-item list-group-item-action suggest-item d-flex justify-content-between align-items-center py-2";
            li.style.cursor = "pointer";

            // 매칭 글자 하이라이트
            const highlighted = highlight(item.comName, kw);

            li.innerHTML =
                '<span><i class="bi bi-building text-primary me-2 small"></i>'
                + highlighted + '</span>'
                + '<span class="text-muted small">' + (item.bizNo || "") + '</span>';

            li.addEventListener("mousedown", function (e) {
                e.preventDefault(); // blur 방지
                input.value = item.comName;
                hideSuggest();
                // 폼 제출 (검색 실행)
                document.getElementById("searchForm").submit();
            });

            suggestList.appendChild(li);
        });

        suggestBox.style.display = "block";
    }

    function highlight(text, kw) {
        if (!kw) return text;
        const escaped = kw.replace(/[.*+?^$\x7B\x7D()|[\]\\]/g, "\\$&");
        return text.replace(
            new RegExp("(" + escaped + ")", "gi"),
            '<mark class="p-0 bg-warning bg-opacity-50">$1</mark>'
        );
    }

    function hideSuggest() {
        suggestBox.style.display = "none";
        suggestList.innerHTML    = "";
        currentFocus             = -1;
    }
})();
</script>
<%@include file="../inc/footer.jsp"%>
