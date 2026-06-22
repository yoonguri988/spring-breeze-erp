<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>   
<%@taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@include file="/layout/header.jsp"%>

<div class="sb-content">
	<div class="sb-page-head">
		<div class="sb-page-head__txt">
			<div class="sb-breadcrumb">
				<a href="#">전자 결재</a>
				<i class="bi bi-chevron-right"></i>
				<span>양식 관리</span>
			</div>
			<h1>결재 양식 관리</h1>
			<p>시스템 내 결재 양식을 조회하고 관리</p>
		</div>
		<div class="sb-page-head__actions">
			<button type="button" class="btn btn-sb"
					onclick="location.href='${pageContext.request.contextPath}/appr/write_form'">
					<i class="bi bi-plus-lg"></i> 양식 등록
			</button>
		</div>
	</div>
	<!-- 검색 / 필터 툴바 (실제 GET 검색 폼) -->
	<div class="sb-card mb-4">
		<div class="sb-card__body">
			<form method="GET" action="${pageContext.request.contextPath}/appr/list"
			      id="searchForm">
				<div class="row g-3">	
					<!--  검색 조건1 : 양식코드 또는 제목 -->		
					<div class="col-md-4">
						<label for="keyword" class="sb-form-label">키워드 검색</label>
						<div class="sb-search">
							<i class="bi bi-search"></i>
							<input type="text" id="keyword" name="keyword"
								   placeholder="양식 코드 또는 제목" value="${param.keyword}">
						</div>
					</div>
					<!--  검색 조건2 : 회사명 또는 사업자 번호 검색 -->		
					<div class="col-md-4 position-relative">
						<label for="comName" class="sb-form-label">회사</label>
						<div class="sb-search">
							<i class="bi bi-building"></i>
							<input type="text" id="comName" name="comName" value="${param.comName}"
								   placeholder="회사명" autocomplete="off" />
							<input type="hidden" id="comId" name="comId" value="${param.comId}"/>
						</div>
						<div class="ac-list" id="acList"></div>
					</div>
					
					<div class="col-md-4">
						<label for="forStatus" class="sb-form-label">활성화 여부</label>
						<select class="form-select" id="forStatus" name="forStatus">
							<option value="" ${empty param.forStatus ? 'selected' : '' }>전체</option>
							<option value="true" ${param.forStatus eq 'true' ? 'selected' : '' }>활성화</option>
							<option value="false" ${param.forStatus eq 'false' ? 'selected' : '' }>비활성화</option>
						</select>
					</div>
					
 					<div class="d-flex justify-content-end gap-2 mt-3">
	                    <button type="submit" class="btn btn-sb-soft btn-sm">
							<i class="bi bi-search"></i> 검색
						</button>
						<c:if test="${not empty param.keyword}">
				            <a class="btn btn-ghost btn-sm" href="${pageContext.request.contextPath}/appr/list">초기화</a>
				        </c:if>
	                </div>
				</div>
			</form>
		</div>
	</div>
	
	<div class="sb-card">
		<div class="sb-card_body sb-card__body--flush">
			<div class="table-responsive">
				<table class="sb-table">
					<thead>
						<tr>
							<th class="num">번호</th>
							<th>양식 코드</th>
							<th>양식 제목</th>
							<th>회사</th>
							<th>사용 여부</th>
							<th>생성일</th>
							<th>수정일</th>
						</tr>
					</thead>
					<tbody id="formTbody">
						<c:choose>
							<c:when test="${empty list}">
								<tr>
									<td colspan="7">
										<div class="sb-empty">
											<i class="bi bi-inbox text-faint"></i>
											<p>겸색 결과가 없습니다.</p>
										</div>
									</td>
								</tr>
							</c:when>
							<c:otherwise>
								<c:forEach var="item" items="${list}" varStatus="status">
									<tr>
										<td class="num text-faint">${status.count}</td>
										<td>
											<a href="${pageContext.request.contextPath}/appr/update_form?forId=${item.forId}"
											   class="sb-table__name">
											   ${item.forCode}
											</a>
										</td>
										<td>${item.forTitle}</td>
										<td class="text-soft">${item.comName }</td>
										<td>
											<span class="sb-badge ${item.forStatus ? 'sb-badge--green' : 'sb-badge--gray'}">
												<span class="pip"></span> ${item.forStatus ? '활성화' : '비활성화'}
											</span>
										</td>
										<td class="text-faint tnum">${item.forCreated}</td>
										<td class="text-faint tnum">${item.forUpdated}</td>
									</tr>
								</c:forEach>
							</c:otherwise>
						</c:choose>
					</tbody>
				</table>
			</div>
		</div>
	</div>
	
	<div class="d-flex justify-content-center mt-4">
        <ul class="pagination" id="pagingUl">
            <c:if test="${paging.start > 1}">
                <li class="page-item">
                    <a class="page-link" href="${pageContext.request.contextPath}/searchForms?keyword=${keyword}&company=${comId}&forStatus=${forStatus}&page=${paging.start - 1}">이전</a>
                </li>
            </c:if>
            <c:forEach var="i" begin="${paging.start}" end="${paging.end}">
                <li class="page-item ${paging.current == i ? 'active' : ''}">
                    <a class="page-link" href="${pageContext.request.contextPath}/searchForms?keyword=${keyword}&company=${comId}&forStatus=${forStatus}&page=${i}">${i}</a>
                </li>
            </c:forEach>
            <c:if test="${paging.end < paging.pagetotal}">
                <li class="page-item">
                    <a class="page-link" href="${pageContext.request.contextPath}/searchForms?keyword=${keyword}&company=${comId}&forStatus=${forStatus}&page=${paging.end + 1}">다음</a>
                </li>
            </c:if>
        </ul>
    </div>
    
</div>

<script>
(function () {
    "use strict";
	const CTX = "${pageContext.request.contextPath}";
	/* ===================== 회사 이름 실시간 자동완성 ===================== */
    const kwInput = document.getElementById("comName");
    const comId = document.getElementById("comId");
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
                comId.value = item.comId;
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
})();
	///////////////////// 회사 이름이랑 일치하는거 출력 /////////////////////
	
	/* 이부분 2차때 다시 설계해서 사용해...볼수있게	
	/////////////////////// 검색해서 나온 데이터 전송 ///////////////////////
	
	function searchForm(page = 1){
		let comId = document.getElementById("comId").value.trim();
		let forStatus = document.getElementById("forStatus").value;
		let keyword = document.getElementById("keyword").value;
		
		let url = "${pageContext.request.contextPath}/searchForms"
				+ "?keyword=" + encodeURIComponent(keyword)
				+ "&company=" + comId
				+ "&forStatus=" + forStatus
				+ "&page=" + page;
		
		fetch(url)
		.then(response => response.json())
		.then(data => {
			console.log(data);
			console.log(data.paging);
			updateTable(data.list);
			updatePaging(data.paging);
		})
	}
	
	/////////////////////// 검색해서 나온 데이터 전송 ///////////////////////
	
	
	/////////////////////// 검색해서 나온 결과 출력 ///////////////////////
	
	function updateTable(data){
		// 출력할 공간
		let tbody = document.getElementById("formTbody");
		
		tbody.innerHTML = "";
		
		if(data.length === 0){ // 없을때 출력할것
			tbody.innerHTML = "<tr><td colspan='8' class='text-center'>검색 결과가 없습니다.</td></tr>"
			return;
		}
		
		data.forEach((item, index) => {
			let tr = document.createElement("tr"); // tr태그 생성
			
			let isActive = (item.forStatus === true);
			
			// 코드 더러워서 위에서 벳지 처리
			let badgeClass = isActive ? 'bg-success' : 'bg-secondary';
			let badgeText = isActive ? '활성화' : '비활성화'

			tr.innerHTML = `
			<td>\${index + 1}</td>
			<td><a href="${pageContext.request.contextPath}/appr/update_form?forId=\${item.forId}">
			\${item.forCode}</a></td>
			<td>\${item.forTitle}</td>
			<td>\${item.comName}</td>
			<td><span class="badge \${badgeClass}">\${badgeText}</span></td>
			<td>\${item.forCreated}</td>
			<td>\${item.forUpdated}</td>
			`;
			
			tbody.appendChild(tr); // 위 데이터 다 넣어서 보내기
		});
	}
	
	/////////////////////// 검색해서 나온 결과 출력 ///////////////////////
	
	/////////////////////////   페이징 기능    /////////////////////////
	
	function updatePaging(paging){
		
	}

    /////////////////////////   페이징 기능    /////////////////////////
    */
    function checkForm(){
    	var keyword = documet.getElementById("keyword");
    	var comName = documet.getElementById("comName");
    	if(keyword.value.trim() == "" && comName.value.trim() == ""){
    		alert("검색 조건 하나이상은 포함해야한다.");
    	}	
    }
</script>
<%@include file="/layout/footer.jsp"%>
