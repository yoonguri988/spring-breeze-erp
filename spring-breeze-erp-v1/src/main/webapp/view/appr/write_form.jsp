<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>   
<%@include file="/layout/header.jsp"%>
    
<div class="container-fluid px-4 py-4"
	 style="background-color: #f8f9fa; min-height: 100vh;">
	 
	 <div class="d-flex justify-content-between align-items-center mb-4">
	 	<div>
	 		<nav style="--bs-breadcrumb-divider: '>';"
	 			 aria-label="breadcrumb">
	 			<ol class="breadcrumb mb-1 small text-secondary">
	 				<li class="breadcrumb-item">이름을</li>
	 				<li class="breadcrumb-item">정합</li>
	 				<li class="breadcrumb-item active text-primary fw-bold"
	 					aria-current="page">시다</li>
	 			</ol>
	 		</nav>
	 		<h3 class="fw-bold m-0" style="color: #1e293b;">결재 양식 작성</h3>
	 		<p class="text-muted small m-0 mt-1">결재 양식 등록</p>
	 	</div>
	 	<button type="button"
	 			class="btn btn-white border border-secondary-subtle fw-semibold px-3 py-2 text-secondary bg-white"
	 			onclick="location.href='${pageContext.request.contextPath}/appr/list_form'"
	 			style="border-radius: 6px; font-size: 0.9rem;">
	 			목록으로
	 	</button>
	 </div>

	<form action="${pageContext.request.contextPath}/appr/write_form" method="post" onsubmit="return checkForm()">
		<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
	
		<div class="row g-4">
			<div class="col-lg-12">
				<div class="card border-0 shadow-sm p-4 mb-4" style="border-radius: 12px; background-color: #ffffff;">
					<h5 class="fw-bold border-bottom pb-2 mb-4 text-dark">기본 정보</h5>
					
					<div class="row g-3 mb-4">
						<div class="col-md-6">
							<label for="forCode"
								   class="form-label small fw-bold text-secondary">양식 코드</label>
							<input type="text"
								   class="form-control bg-light border-secondary-subtle py-2.5"
								   id="forCode" name="forCode" placeholder="문서 코드"
								   style="font-size: 0.95rem;"/>
						</div>
						<div class="col-md-6 position-relative">	
							<label for="companySearch"
								   class="form-label small fw-bold text-secondary">양식 추가할 회사</label>
							<input type="text"
								   class="form-control bg-light border-secondary-subtle py-2.5"
								   id="companySearch"
								   placeholder="회사이름 입력" autocomplete="off"
								   style="font-size: 0.95rem;"/>
							<input type="hidden" id="comId" name="comId" />	
							<div id="companyDropdown"
								 class="dropdown-menu w-100 shadow-sm"
								 style="display: none; max-height: 200px; overflow-y: auto; z-index: 1050;"></div>
						</div>
					</div>
						
					<div class="row g-3 mb-4 align-items-start">
						<div class="col-md-6">
							<label for="forTitle"
								   class="form-label small fw-bold text-secondary">양식 제목</label>
							<input type="text"
								   class="form-control bg-light border-secondary-subtle py-2.5"
								   id="forTitle" name="forTitle" placeholder="~~신청서"
								   style="font-size: 0.95rem;"/>
							<div class="form-text text-muted"
								 style="font-size: 0.75rem;">결재 양식의 재목</div>
						</div>
						<div class="col-md-6">
							<label class="form-label small fw-bold text-secondary d-block mb-2">활성화 여부</label>
							<div class="form-check form-switch d-flex align-items-center gap-2 ps-0 mt-1">
								<input class="form-check-input ms-0 mt-0"
									   type="checkbox" id="forStatus" name="forStatus"
									   style="width: 45px; height: 22px; cursor: pointer;">
								<label class="form-check-label fw-semibold text-dark small"
									   for="forStatus"
									   style="cursor: pointer; user-select: none;">활성화</label>
							</div>
						</div>
					</div>
					
					<div class="mt-4">
						<div class="d-flex justify-content-between align-items-end mb-2">
							<div>
								<label for="forContent"
									   class="form-label small fw-bold text-secondary m-0">양식 내용</label>
								<div class="text-muted"
									 style="font-size: 0.75rem; margin-top: 2px">결재 양식의 내용을 입력</div>
							</div>
							<div class="btn-group btn-group-sm border-bottom-0" role="group">
								<button type="button" class="btn btn-outline-primary acitve fw-semibold btn-sm px-3"
										style="font-size: 0.8rem; border-radius: 4px 0 0 0;">HTML</button>
								<button type="button" class="btn btn-outline-secondary fw-semibold btn-sm px-3"
										style="font-size: 0.8rem; border-radius: 0 4px 0 0 ;" disabled>일단비활성화</button>
							</div>
						</div>
						<textarea class="form-control border-secondary-subtle p-3"
								  id="forContent" name="forContent" rows="12"
								  placeholder="구문 작성"
								  style="font-family: 'Courier New', Courier, monospace; font-size: 0.9rem;
								  		 background-color: #fafafa; color: #1e293b;
								  		 resize: vertical; line-height: 1.5">
						</textarea>
					</div>
					
					<div class="row mt-4">
						<div class="col-12 d-flex justify-content-end gap-2">
							<div class="d-flex justify-content-center gap-3">
								<button type="button" class="btn btn-light border fw-semibold px-5 py-2.5 text-secondary"
										onclick="location.href='${pageContext.request.contextPath}/appr/list_form'"
										style="font-size: 0.95rem; border-radius: 6px;">
										목록으로
								</button>
								<button type="submit" class="btn btn-primary fw-semibold px-5 py-2.5"
										style="font-size: 0.95rem; border-radius: 6px;">
										작성
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>	
	</form>
</div>
<!-- 빈칸시 alert 처리 -->
<script>
	function checkForm(){
		let forCode = document.getElementById("forCode");
		let forTitle = document.getElementById("forTitle");
		let comId = document.getElementById("comId");
		let forContent = document.getElementById("forContent");
		
		if(forCode.value.trim() == ""){
			alert("양식 코드 입력");
			forCode.focus();
			return false;
		}
		if(forTitle.value.trim() == ""){
			alert("양식 제목 입력");
			forTitle.focus();
			return false;
		}
		if(comId.value.trim() == ""){
			alert("회사 입력");
			comId.focus();
			return false;
		}
		if(forContent.value.trim() == ""){
			alert("양식 입력");
			forContent.focus();
			return false;
		}
		return true;
	}

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
</script>
<%@include file="/layout/footer.jsp"%>