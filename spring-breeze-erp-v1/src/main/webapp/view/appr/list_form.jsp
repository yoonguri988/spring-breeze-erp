<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>   
<%@taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@include file="/layout/header.jsp"%>

<div class="container-fluid px-4 py-4" style="background-color: #f8f9fa; min-height: 100vh">

	<div class="d-flex justify-content-between align-items-center mb-3">
		<div>
			<nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
				<ol class="breadcrumb mb-1 small text-secondary">
					<li>메뉴 이름</li>
					<li>정해야함</li>
				</ol>
			</nav>
			<h3 class="fw-bold m-0" style="color: #1e293b;">얘도 정해야함</h3>
			<p class="text-muted small m-0 mt-1">결재 양식 조회,관리</p>
		</div>
		<button type="button" class="btn btn-primary fw-semibold px-3 py-2 d-flex align-items-center gap-1"
		 	onclick="location.href='${pageContext.request.contextPath}/appr/write_form'">
		 	<span class="fs-5 lh-1">+</span>양식 등록
		 </button>
	</div>
	
	<div class="card border-0 shadow-sm p-4 mb-4" style="border-radius: 12px;">
		<form action="${pageContext.request.contextPath}/searchForms" method="post">
			<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
			
			<div class="row g-3">
				<div class="col-md-4">
					<label for="keyword" class="form-label small fw-bold text-secondary">키워드 검색</label>
					<div class="input-group">
						<input type="text" class="form-control bg-light border-secondary-subtle"
							   id="keyword" name="keyword" placeholder="양식 코드 또는 제목"
							   style="font-size: 0.9rem; padding: 0.6rem 1rem;"
							   value="${keyword}"/>
					</div>
				</div>
				
				<div class="col-md-4 position-relative">	
					<label for="companySearch" class="form-label small fw-bold text-secondary">회사</label>
					<input type="text" class="form-control bg-light border-secondary-subtle" id="companySearch"
						   placeholder="회사이름 입력" autocomplete="off"
						   style="font-size: 0.9rem; padding: 0.6rem 1rem;"						   />
					<input type="hidden" id="comId" name="comId" value="${comId}"/>	
					<div id="companyDropdown" class="dropdown-menu w-100"
						 style="display: none; max-height: 200px; overflow-y: auto;"></div>
				</div>	
				
				<div class="col-md-4">	
					<label for="forStatus" class="form-label small fw-bold text-secondary">활성화 여부</label>
					<select class="form-select bg-light border-secondary-subtle"
							id="forStatus" name="forStatus"
							style="font-size: 0.9rem; padding: 0.6rem 1rem;">
						<option value=""
						${empty forStatus ? 'selected' : ''}>전체</option>
						<option value="true"
						${forStatus eq 'true' ? 'selected' : ''}>활성화</option>
						<option value="false"
						${forStatus eq 'false' ? 'selected' : ''}>비활성화</option>
					</select>
				</div>
			</div>
			
			<div class="d-flex justify-content-end gap-2 mt-4">
				<button type="reset" class="btn btn-light border fw-semibold text-secondary px-4 py-2"
						style="font-size: 0.9rem;">초기화</button>
				<button type="submit" class="btn btn-primary fw-semibold px-4 py-2"
						style="font-size: 0.9rem;">검색</button>
			</div>
			
		</form>
	</div>
	
	<div class="table-responsive">
		<table class="table  table-hover align-middle"
			   style="font-size: 0.9rem; min-width: 900px;">
			<caption>양식 목록</caption>
			<thead>
				<tr class="table-light text-secondary border-bottom-0"
					style="--bs-table-bg: #f8f9fa;">
					<th class="py-3 px-3 fw-semibold">번호</th>
					<th class="py-3 fw-semibold">양식 코드</th>
					<th class="py-3 fw-semibold">양식 제목</th>
					<th class="py-3 fw-semibold">회사</th>
					<th class="py-3 fw-semibold">사용 여부</th>
					<th class="py-3 fw-semibold">생성일</th>
					<th class="py-3 fw-semibold">수정일</th>
				</tr>
			</thead>
			<!-- 받아온 데이터 출력 파트 -->
			<!-- 안쪽에 주석 못달아서 여기에 적음
				 위에서 부터
				 초기화면 처리, 검색 결과 없을때 처리
				 Controller에서 list로 받아와 for문으로 처리 -->
			<tbody id="formTbody" class="border-top-0">
				<c:choose>
					<c:when test="${empty list}">
						<tr>
							<td colspan="8" class="text-center">검색 결과가 없습니다.</td>
						</tr>
					</c:when>
					<c:otherwise>
						<c:forEach var="item" items="${list}" varStatus="status">
							<tr>
								<td>${status.count}</td>
								<td>
									<a href="${pageContext.request.contextPath}/appr/update_form?forId=${item.forId}">
										${item.forCode}
									</a>
								</td>
								<td>${item.forTitle}</td>
								<td>${item.comName}</td>
								<td>
									<span class="badge ${item.forStatus ? 'bg-success' : 'bg-secondary'}">
										${item.forStatus ? '활성화' : '비활성화'}
									</span>
								</td> 
								<td>${item.forCreated}</td>
								<td>${item.forUpdated}</td>
							</tr>
						</c:forEach>
					</c:otherwise>
				</c:choose>
			</tbody>
		</table>
		<!-- 페이징 기능  위부터 순서대로 이전 / 1,2,3 같은 페이지 / 다음 -->
		<div class="d-flex justify-content-center mt-4">
			<ul class="pagination" id="pagingUl">
				<c:if test="${paging.start > 1}">
					<li class="page-item">
						<a class="page-link"
						   href="${pageContext.request.contextPath}/searchForms?keyword=${keyword}&company=${comId}&forStatus=${forStatus}&page=${paging.start - 1}">
						   이전</a>
					</li>
				</c:if>
				
				<c:forEach var="i" begin="${paging.start}" end="${paging.end}">
					<li class="page-item ${paging.current == i ? 'active' : ''}">
						<a class="page-link"
						   href="${pageContext.request.contextPath}/searchForms?keyword=${keyword}&company=${comId}&forStatus=${forStatus}&page=${i}">
						   ${i}</a>
					</li>
				</c:forEach>
				
				<c:if test="${paging.end < paging.pagetotal}">
					<li class="page-item">
						<a class="page-link"
						   href="${pageContext.request.contextPath}/searchForms?keyword=${keyword}&company=${comId}&forStatus=${forStatus}&page=${paging.end + 1}">
						   다음</a>
					</li>
				</c:if>
			</ul>
		</div>
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
