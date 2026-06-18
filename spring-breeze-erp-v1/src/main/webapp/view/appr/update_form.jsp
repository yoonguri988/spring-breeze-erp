<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>   
<%@taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Form</title>
    <!-- Latest compiled and minified CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Latest compiled JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <link href="./css/board.css" rel="stylesheet">
</head>
<body>

	<div class="container my-5 card">
	<h3>결재 양식 수정</h3>
		<form action="${pageContext.request.contextPath}/appr/update_form" method="post" onsubmit="return checkForm()">
		<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
		<input type="hidden" name="forId" value="${dto.forId}">
		
			<div class="my-3">
				<label for="forCode" class="form-label">양식 코드</label>
				<input type="text" class="form-control" id="forCode" name="forCode" value="${dto.forCode}"/>
			</div>
			
			<div class="my-3">
				<label for="forTitle" class="form-label">양식 제목</label>
				<input type="text" class="form-control" id="forTitle" name="forTitle" value="${dto.forTitle}"/>
			</div>
			
			<div class="my-3 position-relative">	
				<label for="companySearch" class="form-label">회사</label>
				<input type="text" class="form-control" id="companySearch"
					   placeholder="회사이름 입력" autocomplete="off" value="${dto.comName}"/>
				
				<input type="hidden" id="comId" name="comId" value="${dto.comId}" />	
				
				<div id="companyDropdown" class="dropdown-menu w-100"
					 style="display: none; max-height: 200px; overflow-y: auto;"></div>
			</div>
			
			<div class="d-flex flex-column gap-2">
				<label class="fw-bold small text-secondary">사용 여부 *</label>
				
				<div class="form-check form-switch d-flex align-items-center gap-2 ps-0">
					<input class="form-check-input ms-0" type="checkbox"
						   id="forStatus" name="forStatus" value="true"
						   style="width: 40px; height: 20px; cursor: pointer;"
						   ${dto.forStatus ? 'checked' : '' }>
					<input type="hidden" name="_forStatus" value="on"/>
					<label class="form-check-label" for="forStatus" style="cursor: pointer;">사용</label>
				</div>
			</div>

			<div class="my-3 card p-3">
				<h3>기본 정보</h3>
				<dl class="row">
					<dt class="col-sm-4">양식 ID</dt>
					<dd class="col-sm-8 text-end">${dto.forId}</dd>
					<dt class="col-sm-4">생성일</dt>
					<dd class="col-sm-8 text-end">${dto.forCreated}</dd>
					<dt class="col-sm-4">수정일</dt>
					<dd class="col-sm-8 text-end">${dto.forUpdated}</dd>
					<dt class="col-sm-4">사용여부</dt>
					<dd class="col-sm-8 text-end ">
						<c:choose>
							<c:when test="${dto.forStatus == false}">
								<span class="badge bg-secondary">비활성화</span>
							</c:when>
						
							<c:when test="${dto.forStatus == true}">
								<span class="badge bg-success">활성화</span>
							</c:when>
						</c:choose>
					</dd>
				</dl>
			</div>
			
			<div class="my-3">	
				<label for="forContent" class="form-label">양식 </label>
				<textarea class="form-control" id="forContent" name="forContent" >${dto.forContent}</textarea>	
			</div>
			
			<div class="text-end">
				<button type="button" class="btn btn-outline-primary"
				onclick="location.href='${pageContext.request.contextPath}/appr/list_form'">목록으로</button>
				<button type="button" class="btn btn-outline-danger"
			 	onclick="deleteForm('${dto.forId}')">삭제</button>
				<button type="submit" class="btn btn-primary" >수정하기</button>
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
				
				///////////////////// 양식 삭제 재확인 /////////////////////
				
				function deleteForm(forId){
					if(confirm("양식을 삭제하시겠습니까?")){
						location.href = "${pageContext.request.contextPath}/appr/delete?forId" + forId;						
					}
					else{
						console.log("취소 확인");
					}
				}
				
				///////////////////// 양식 삭제 재확인 /////////////////////
			</script>
			
		</form>
	</div>
</body>
</html>