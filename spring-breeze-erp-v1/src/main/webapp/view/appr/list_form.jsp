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
	
	<div class="sb-card mb-4">
		<div class="sb-card__body">
			<form action="${pageContext.request.contextPath}/searchForms" method="post">
				<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
				
				<div class="row g-3">			
					<div class="col-md-4">
						<label for="keyword" class="sb-form-label">키워드 검색</label>
						<div class="sb-search">
							<i class="bi bi-search"></i>
							<input type="text" id="keyword" name="keyword"
								   placeholder="양식 코드 또는 제목" value="${keyword}">
						</div>
					</div>
					
					<div class="col-md-4 position-relative">
						<label for="companySearch" class="sb-form-label">회사</label>
						<div class="sb-search">
							<i class="bi bi-building"></i>
							<input type="text" id="companySearch"
								   placeholder="회사명" autocomplete="off" />
						</div>
						<input type="hidden" id="comId" name="comId" value="${comId}">
						<div id="companyDropdown" class="dropdown-menu w-100 shadow-sm"
							 style="display: none; max-height: 200px; overflow-y: auto;"></div>
					</div>
					
					<div class="col-md-4">
						<label for="forStatus" class="sb-form-label">활성화 여부</label>
						<select class="form-select" id="forStatus" name="forStatus">
							<option value="" ${empty forStatus ? 'selected' : '' }>전체</option>
							<option value="true" ${forStatus eq 'true' ? 'selected' : '' }>활성화</option>
							<option value="false" ${forStatus eq 'false' ? 'selected' : '' }>비활성화</option>
						</select>
					</div>
					
 					<div class="d-flex justify-content-end gap-2 mt-3">
	                    <button type="submit" class="btn btn-sb-soft">검색</button>
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
	///////////////////// 회사 이름이랑 일치하는거 출력 /////////////////////
	window.addEventListener("load", function(){
		
		let companySearch = document.getElementById("companySearch");
		let comId = document.getElementById("comId");
		let companyDropdown = document.getElementById("companyDropdown");
		
		// 입력 할때마다 실행
		companySearch.addEventListener("keyup", function(e){
			let value = e.target.value.trim();
			
			if(value !== "") {
				// 데이터를 /searchCompany 경로에 company라는 이름으로 보냄
				fetch("${pageContext.request.contextPath}/searchCompany?company=" + encodeURIComponent(value))
				.then(response => response.json())
				.then(data => {
					console.log(data);
					companyDropdown.innerHTML = ""; // 기존 목록 비우기
					
					if(data && data.length > 0){
						companyDropdown.style.display = "block";
						
						data.forEach(item => {
							let btn = document.createElement("button");
							btn.type = "button";
							btn.className = "dropdown-item";
							btn.textContent = item.companyName; // 보여줄 회사이름
							
							// 검색해서 나온 회사 이름 클릭
							btn.addEventListener("click", function(){
								companySearch.value = item.companyName; // 회사이름 넣기
								comId.value = item.comId; // insert구문 실행위해 com_id 값 넣기
								companyDropdown.style.display = "none"; // 드롭다운 닫기
							});
							companyDropdown.appendChild(btn);
						});
					}
					else{ // 검색결과 없을때
						companyDropdown.innerHTML = "<span class='dropdown-item text-muted disabled'>검색 결과가 없습니다.</span>";
						companyDropdown.style.display = "block";
					}
				})
				.catch(error => {
					console.error("회사 검색 오류:",error);
					companyDropdown.style.display = "none";
				});
			}
			else{ // 입력란 비어있을때 처리
				comId.value = "";
				companyDropdown.innerHTML = "";
				companyDropdown.style.display = "none";
				
			}
		});
		// 입력창 외부공간 클릭시 정리
		document.addEventListener("click", function(e){
			if(e.target !== companySearch && e.target !== companyDropdown){
				companyDropdown.style.display = "none";
			}
		});
	});
	
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
    
</script>
<%@include file="/layout/footer.jsp"%>
