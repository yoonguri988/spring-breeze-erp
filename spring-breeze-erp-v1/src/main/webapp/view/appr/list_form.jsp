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
	<button type="submit" class="btn btn-primary">양식 등록</button>
	<div class="container my-5 card">
	<h3>결재 양식 목록</h3>
		<form action="${pageContext.request.contextPath}/appr/write_form" method="post" onsubmit="return checkForm()">
		<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
		
			<div class="my-3">
				<label for="keyword" class="form-label">키워드 검색</label>
				<input type="text" class="form-control" id="keyword" name="keyword" />
			</div>
			
			<div class="my-3 position-relative">	
				<label for="companySearch" class="form-label">회사</label>
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
			
			<div class="my-3">	
				<label for="forStatus" class="form-label fw-bold small text-secondary">활성화 여부</label>
				
				<select class="form-select" id="forStatus" name="forStatus">
					<option value="" selected>전체</option>
					<option value="1">활성화</option>
					<option value="0">비활성화</option>
				</select>
			</div>
			
			<div class="text-end">
				<button type="reset" class="btn btn-outline-primary">초기화</button>
				<button type="button" class="btn btn-primary" onclick="searchForm()">검색</button>
			</div>
			
			<script>
				function searchForm(){
					let comId = document.getElementById("comId").value.trim();
					let forStatus = document.getElementById("forStatus").value;
					let keyword = document.getElementById("keyword").value;
					
					let url = "${pageContext.request.contextPath}/searchForms"
							+ "?keyword=" + encodeURIComponent(keyword)
							+ "&company=" + comId
							+ "&forStatus=" + forStatus;
					
					fetch(url)
					.then(response => response.json())
					.then(data => {
						updateTable(data);
					})
				}
				
				function updateTalbe(data){
					let tbody = document.getElementById("tbody id명 지정하면 여기에 넣어야함");
					
					tbody.innerHTML = "";
					
					if(data.length === 0){
						tbody.innerHTML = "<tr><td colspan='8' class='text-center'>검색 결과가 없습니다.</td></tr>"
						return;
					}
					
					data.forEach((item, index) => {
						let tr = document.createElement("tr");
						
						tr.innerHTML = `
						<td>${index + 1}</td>
						<td><a href="">${item.forCode}</a></td>
						<td>${item.forTitle}</td>
						<td>${item.forContent || ''}</td>
						<td>${item.comName}</td>
						<td><span class="badge ${item.forStatus === 'Y' ? bg-success : bg-secondary}">
						${item.forStatus === 'Y' ? '활성화' : '비활성화'}
						</span></td>
						<td>${item.forCreated || ''}</td>
						<td>${item.forUpdated || ''}</td>
						`
						
					})
				}
			</script>
			
		</form>
	</div>
	
	<div>
		<thead></thead>
		<tbody></tbody>
	</div>
	
</body>
</html>