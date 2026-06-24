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
						<div id="err_forCode" class="text-danger fw-semibold mt-1"
							 style="display: none; font-size: 14px;">
							 양식 코드를 입력해주세요
						</div>
						<div class="text-secondary fw-semibold mt-1 tforCode"
							 style="font-size: 14px;">
						</div>
					</div>

					<div class="col-md-6 position-relative">	
						<label for="comName"
							   class="sb-form-label">양식 추가할 회사</label>
							<div class="sb-search">
							<i class="bi bi-building"></i>
							<input type="text" id="companySearch"
								   placeholder="회사이름 입력" autocomplete="off"/>
						</div>	
							<input type="hidden" id="comId" name="comId" />
						<div id="err_comId" class="text-danger fw-semibold mt-1"
							 style="display: none; font-size: 14px;">
							 추가할 회사를 선택해주세요
						</div>
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
						<div id="err_forTitle" class="text-danger fw-semibold mt-1"
							 style="display: none; font-size: 14px;">
							 양식 제목을 입력해주세요
						</div>
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
							  placeholder="소속 : 생산1팀 &#10; 직급 : 사원 &#10; 성명 : 홍길동 &#10;"
							  style="font-family: 'Courier New', Courier, monospace;
							  		 background-color: #fafafa; resize: vertical;">소속 : &#10;직급 : &#10;성명 : </textarea>
					<div class="form-text text-faint mt-2">결재 양식의 내용을 작성하세요.</div>
					<div id="err_forContent" class="text-danger fw-semibold mt-1"
							 style="display: none; font-size: 14px;">
							 양식 내용을 입력해주세요
					</div>
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

let valid = false; // 강제 입력시 막아줄 전역 변수

	/////////////////////////////// 빈칸 처리 ///////////////////////////////
	
	function checkForm(){
		// 빈칸 체크할 요소들 매핑 {key : value}
		// 아래처럼 매핑 안하면 일일이 하나씩 getElementById 를써서 비교하고 변경해야함
		const fields = [
			{ id: "forCode", errId: "err_forCode"},
			{ id: "forTitle", errId: "err_forTitle"},
			{ id: "comId", errId: "err_comId", focusId: "companySearch"},
			{ id: "forContent", errId: "err_forContent"}
		];
		
		let result = true;
		let focusElement = null;
		
		// 에러 초기화
		fields.forEach(field => {
			let id = document.getElementById(field.id);
			let errId = document.getElementById(field.errId);
			
			// 테두리 제거
			id.classList.remove("is-invalid");
			if(field.focusId){
				document.getElementById(field.focusId).classList.remove("is-invalid");
			}
			
			// 에러 구문 제거
			if(errId){
				errId.style.display = "none";
			}
			
			// 비어있는 값 체크
			if(id.value.trim() == ""){
				if(field.focusId){
					document.getElementById(field.focusId).classList.add("is-invalid");
				}
				else{
					id.classList.add("is-invalid");
				}
				
				if(errId) {
					errId.style.display = "block";
				}
				if(!focusElement){
					focusElement = field.focusId ? document.getElementById(field.focusId) : id;
				}
				
				result = false;
			}
			
		});
		// 양식 중복 인데 강제로 작성 눌렀을시 제어
		if(!valid){
			alert("중복된 양식코드는 사용할수 없습니다.");
			document.getElementById("forCode").focus();
			return false;
		}
		
		if(!result){
			if(focusElement){
				focusElement.focus();
			}
				return false;
		}

		return true;

	}
	
	/////////////////////////////// 빈칸 처리 ///////////////////////////////
	
	
	/////////////////////////////// 양식 중복 처리 ///////////////////////////////
	
	window.addEventListener("load", function(){
		let forCode = document.getElementById("forCode"); // forCode 가져오기
		let tforCode = document.querySelector(".tforCode"); // 입력 결과 출력할 부분 가져오기
		
		// 입력할때마다 호출 
		forCode.addEventListener("keyup", function(e){
			let value = e.target.value.trim(); // 빈칸제외 forCode의 입력값 가져오기
			
			// 양식 중복 검색할 회사 값 가져오기
			let comIdElement = document.getElementById("comId");
			let comIdVal = comIdElement ? comIdElement.value.trim() : "" ;
			
			valid = false; // 초기화
			
			// 양식 검사에 회사의 id값이 필요해 먼저 하도록 유도
			if(comIdVal === ""){
				tforCode.textContent = "양식을 추가할 회사를 먼저 검색하여 선택해주세요.";
				tforCode.className = "text-danger fw-semibold mt-1 tforCode";
				forCode.classList.remove("is-valid");
				forCode.classList.add("is-invalid");
				return;
			}
			
			if(value !== ""){
				fetch("${pageContext.request.contextPath}/checkCode?code="
						+ encodeURIComponent(value)
						+ "&comId="
						+ encodeURIComponent(comIdVal))
				.then( response => response.json() )
				.then( data => {
					
					// 초기화
					tforCode.className = "fw-semibold mt-1 tforCode";
	                forCode.classList.remove("is-valid", "is-invalid");
	                
					if(data.checkCode){
						tforCode.textContent = "사용 가능한 양식코드 입니다" ;
						tforCode.classList.add("valid-feedback");
						forCode.classList.add("is-valid");
						valid = true;
					}
					else{
						tforCode.textContent = "중복된 양식코드 입니다" ;
						tforCode.classList.add("invalid-feedback");
						forCode.classList.add("is-invalid");
						valid = false;
					}
				}).catch( err => {
					tforCode.textContent = "서버 오류" ;
					tforCode.classList.add("invalid-feedback");
					forCode.classList.add("is-invalid");
					valid = false;
				})
			}
			else{
				tforCode.textContent = "";
				tforCode.className = "tforCode";
				forCode.classList.remove("is-valid", "is-invalid");
				valid = false;
			}
		})
	})
	
	/////////////////////////////// 양식 중복 처리 ///////////////////////////////
	
	
	/////////////////////////////// 회사 이름 검색 ///////////////////////////////
	
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
							btn.textContent = item.comName; // 보여줄 회사이름
							
							// 검색해서 나온 회사 이름 클릭
							btn.addEventListener("click", function(){
								companySearch.value = item.comName; // 회사이름 넣기
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
	
	/////////////////////////////// 회사 이름 검색 ///////////////////////////////
</script>
<%@include file="/layout/footer.jsp"%>