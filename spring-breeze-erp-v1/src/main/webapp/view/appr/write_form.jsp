<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>   
<%@include file="/layout/header.jsp"%>
    
<div class="sb-content">
	 <div class="sb-page-head">
	 	<div class="sb-page-head__txt">
	 		<div class="sb-breadcrumb">
		 		<a href="${pageContext.request.contextPath}/appr/list_form">전자결재</a>
		 		<i class="bi bi-chevron-right"></i>
		 		<span>양식관리</span>
	 		</div>
	 		<h1>결재 양식 작성</h1>
	 		<p>새로운 결재 양식을 등록합니다.</p>
	 	</div>
	 	<div class="sb-page-head__actions">
		 	<button type="button" class="btn btn-ghost"
		 			onclick="location.href='${pageContext.request.contextPath}/appr/list_form'">
		 			목록으로
		 	</button>
	 	</div>
	 </div>

	<form action="${pageContext.request.contextPath}/appr/write_form" method="post" onsubmit="return checkForm()">
		<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
	
		<div class="sb-card">
			<div class="sb-card__head">
				<h2>기본 정보</h2>
			</div>
			
			<div class="sb-card__body">	
				<div class="row g-4 mb-4">
					<div class="col-md-6">
						<label for="forCode"
							   class="sb-form-label">양식 코드</label>
						<input type="text"
							   class="form-control"
							   id="forCode" name="forCode" placeholder="ex) TEST-01"/>
					</div>

					<div class="col-md-6 position-relative">	
						<label for="companySearch"
							   class="sb-form-label">양식 추가할 회사</label>
						<div class="sb-search" style="max-width: 100%;">
							<i class="bi bi-building"></i>
							<input type="text" id="companySearch"
								   placeholder="회사이름 입력" autocomplete="off"/>
						</div>	
							<input type="hidden" id="comId" name="comId" />
						<div id="companyDropdown"
							 class="dropdown-menu w-100 shadow-sm"
							 style="display: none; max-height: 200px; overflow-y: auto; z-index: 1050;"></div>
					</div>
				</div>
					
				<div class="row g-4 mb-4">
					<div class="col-md-6">
						<label for="forTitle" class="sb-form-label">양식 제목</label>
						<input type="text" class="form-control"
							   id="forTitle" name="forTitle" placeholder="ex) 병가신청서"/>
						<div class="form-text text-faint mt-1">결재 양식의 제목을 입력하세요.</div>
					</div>
					<div class="col-md-6">
						<label class="sb-form-label">활성화 여부</label>
						<div class="form-check form-switch mt-2">
							<input class="form-check-input sb-checkbox"
								   type="checkbox" id="forStatus" name="forStatus"
								   style="width: 40px; height: 20px;">
							<label class="form-check-label text-dark fw-semibold ms-2"
								   for="forStatus"
								   style="cursor: pointer; user-select: none;">활성화</label>
						</div>
					</div>
				</div>
				
				<div class="mt-4">
					<label for="forContent" class="sb-form-label">양식 내용</label>
					<textarea class="form-control"
							  id="forContent" name="forContent" rows="12"
							  placeholder="소속 : * 직급 : * 성명 : ---"
							  style="font-family: 'Courier New', Courier, monospace;
							  		 background-color: #fafafa; resize: vertical;"></textarea>
					<div class="form-text text-faint mt-2">결재 양식의 내용을 작성하세요.</div>
				</div>
				
				<div class="sb-divider"></div>
				
				<div class="d-flex justify-content-end gap-2">
					<button type="button" class="btn btn-ghost"
							onclick="location.href='${pageContext.request.contextPath}/appr/list_form'">
							취소
					</button>
					<button type="submit" class="btn btn-sb">
							작성
					</button>
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