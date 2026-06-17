<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>   
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Join</title>
    <!-- Latest compiled and minified CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Latest compiled JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <link href="./css/board.css" rel="stylesheet">
</head>
<body>
	
	<div class="container my-5 card">
	<h3>기본정보</h3>
		<form action="${pageContext.request.contextPath}/appr/write_form" method="post" onsubmit="return checkForm()">
		<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
		
			<div class="my-3">
				<label for="forCode" class="form-label">양식 코드</label>
				<input type="text" class="form-control" id="forCode" name="forCode" />
			</div>
			
			<div class="my-3">
				<label for="forTitle" class="form-label">양식 제목</label>
				<input type="text" class="form-control" id="forTitle" name="forTitle" />
			</div>
			
			<div class="my-3 position-relative">	
				<label for="companySearch" class="form-label">양식 추가할 회사</label>
				<input type="text" class="form-control" id="companySearch"
					   placeholder="회사이름 입력" autocomplete="off"/>
				
				<input type="hidden" id="comId" name="comId" />	
				
				<div id="companyDropdown" class="dropdown-menu w-100"
					 style="display: none; max-height: 200px; overflow-y: auto;"></div>
			</div>
			
			<script>
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
			
			<div class="d-flex flex-column gap-2">
				<label class="fw-bold small text-secondary">사용 여부 *</label>
				
				<div class="form-check form-switch d-flex align-items-center gap-2 ps-0">
					<input class="form-check-input ms-0" type="checkbox"
						   id="forStatus" name="forStatus"
						   style="width: 40px; height: 20px; cursor: pointer;">
					<label class="form-check-label" for="forStatus" style="cursor: pointer;">사용</label>
				</div>
			</div>
			
			<div class="my-3">	
				<label for="forContent" class="form-label">양식 </label>
				<textarea class="form-control" id="forContent" name="forContent" ></textarea>	
			</div>
			
			<div class="text-end">
				<button type="reset" class="btn btn-outline-primary">취소</button>
				<button type="submit" class="btn btn-primary">저장</button>
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
	</script>
</body>
</html>