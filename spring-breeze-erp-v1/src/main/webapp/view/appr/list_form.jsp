<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>   
<%@taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
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
		<button type="button" class="btn btn-primary"
			 	onclick="location.href='${pageContext.request.contextPath}/appr/write_form'">양식 등록</button>
	<div class="container my-5 card">
	<h3>결재 양식 목록</h3>
		<form action="#" method="post" onsubmit="return checkForm()">
		<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
		
			<div class="my-3">
				<label for="keyword" class="form-label">양식이름, 양식코드</label>
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
				
				/////////////////////// 검색해서 나온 데이터 전송 ///////////////////////
				
				function searchForm(page = 1){
					let comId = document.getElementById("comId").value.trim();
					let forStatus = document.getElementById("forStatus").value;
					let keyword = document.getElementById("keyword").value;
					
					let url = "${pageContext.request.contextPath}/searchForms"
							+ "?keyword=" + encodeURIComponent(keyword)
							+ "&company=" + comId
							+ "&forStatus=" + forStatus
					
					fetch(url)
					.then(response => response.json())
					.then(data => {
						console.log(data);
						updateTable(data);
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
					const tfoot = document.getElementById("formTfoot");
					
					let html = `<tr><td colspan="5">`;
					html += `<ul class="pagination justify-content-center">`;
					
					if(paging.start > 1){
						html += `
						<li class="page-item">
							<a href="#" class="page-link"
							onclick="searchForm(${paging.start-1}); return false;">이전</a>
						</li>`;
					}
					
					for (let i = paging.start; i <= paging.end; i++){
						let activeClass = (i == paging.current) ? "active" : "";
						
						html +=`
							<li class="page-item ${activeClass}">
								<a href="#" class="page-link" 
								onclick="searchForm(${i}); return false;">${i}</a>
						</li>`;
					}
					
					if(paging.end < paging.pagetotal){
						html += `
						<li class="page-item">
							<a href="#" class="page-link"
							onclick="searchForm(${paging.end +1}); return false;">다음</a>
						</li>`;
					}
					
					html += `</ul></td></tr>`;
					
					tfoot.innerHTML = html;	
				}
				
				/////////////////////////   페이징 기능    /////////////////////////
			</script>
			
			<div class="my-3">	
				<label for="forStatus" class="form-label fw-bold small text-secondary">활성화 여부</label>
				
				<select class="form-select" id="forStatus" name="forStatus">
					<option value="" selected>전체</option>
					<option value="true">활성화</option>
					<option value="false">비활성화</option>
				</select>
			</div>
			
			<div class="text-end">
				<button type="reset" class="btn btn-outline-primary">초기화</button>
				<button type="button" class="btn btn-primary" onclick="searchForm()">검색</button>
			</div>
			
		</form>
	</div>
	
	<div>
		<table class="table  table-striped  table-bordered table-hover">
			<caption>양식 목록</caption>
			<thead>
				<tr>
					<th>번호</th>
					<th>양식 코드</th>
					<th>양식 제목</th>
					<th>회사</th>
					<th>사용 여부</th>
					<th>생성일</th>
					<th>수정일</th>
				</tr>
			</thead>
			<tbody id="formTbody">
			</tbody>
		</table>
	</div>
	
</body>
</html>