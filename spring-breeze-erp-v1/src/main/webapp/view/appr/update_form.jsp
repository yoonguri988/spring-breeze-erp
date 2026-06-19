<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>   
<%@taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@include file="/layout/header.jsp"%>

<div class="sb-content">
	<div class="sb-page-head">
		<div class="sb-page-head__txt">
			<div class="sb-breadcrumb">
				<a href="${pageContext.request.contextPath}/appr/list_form">전자결재</a>
				<i class="bi bi-chevron-right"></i>
				<span>양식 관리</span>
			</div>
			<h1>결재 양식 수정</h1>
			<p>결재 양식 정보를 수정하고 저장합니다.</p>
		</div>
		<div>
			<button type="button" class="btn btn-ghost"
					onclick="location.href='${pageContext.request.contextPath}/appr/list_form'">
					목록으로
			</button>
		</div>
	</div>
	
	<form action="${pageContext.request.contextPath}/appr/update_form" method="post" onsubmit="return checkForm()">
		<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
		<input type="hidden" name="forId" value="${dto.forId}">
	
		<div class="row g-8">
            <div class="col-lg-9">
                <div class="sb-card">
                    <div class="sb-card__head">
                    	<h2>기본 정보</h2>
                    </div>
                    
                    <div class="sb-card__body">
                        <div class="row g-4 mb-4">
                        	<div class="col-md-6">
	                            <label for="forCode" class="sb-form-label">양식 코드</label>
	                            <input type="text" class="form-control"
									   id="forCode" name="forCode" value="${dto.forCode}"/>
	                            <div class="form-text text-faint mt-1">ex) TEST-01</div>
                        	</div>
	                        <div class="col-md-6 position-relative">
	                            <label for="companySearch"
	                            	   class="sb-form-label">회사</label>
	                            <div class="sb-search" style="max-width: 100%;">
	                            	<i class="bi bi-building"></i>
		                            <input type="text" id="companySearch"
		                            	   value="${dto.comName}" autocomplete="off"/>
                           	    </div>
	                            <input type="hidden" id="comId" name="comId" value="${dto.comId}" />	
	                            <div id="companyDropdown"
	                            	 class="dropdown-menu w-100 shadow-sm"
	                            	 style="display: none; max-height: 200px; overflow-y: auto; z-index: 1050;"></div>
	                        </div>
                        </div>
                    

                    <div class="row g-4 mb-4">
                        <div class="col-md-6">
                            <label for="forTitle"
                            	   class="sb-form-label">양식 제목</label>
                            <input type="text" class="form-control"
                            	   id="forTitle" name="forTitle" value="${dto.forTitle}"/>
                        </div>
                        <div class="col-md-6">
                            <label class="sb-form-label">사용 여부</label>
                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input sb-checkbox"
                                	   type="checkbox" id="forStatus" name="forStatus"
                                	   style="width: 40px; height: 20px;" ${dto.forStatus ? 'checked' : ''}>
                                <input type="hidden" name="_forStatus" value="on"/>
                                <label class="form-check-label text-dark fw-semibold ms-2"
                                	   for="forStatus" style="cursor: pointer; user-select: none;">사용</label>
                            </div>
                        </div>
                    </div>

                    <div class="mb-4">
                    	<label for="forContent" class="sb-form-label">양식 내용</label>
                        <textarea class="form-control" id="forContent" name="forContent" rows="14" 
                                  style="font-family: 'Courier New', Courier, monospace; background-color: #fafafa; resize: vertical;">${dto.forContent}</textarea>
                    </div>
                    
                    <div class="sb-divider"></div>
                    
                    <div class="d-flex justify-content-between align-items-center">
						<button type="button" class="btn btn-ghost text-danger" 
						        onclick="deleteForm('${dto.forId}')">
						     	<i class="bi bi-trash3"></i>삭제
						</button>
						<div class="d-flex gap-2">
							<button type="button"
									class="btn btn-ghost" 
							        onclick="location.href='${pageContext.request.contextPath}/appr/list_form'">
							    	취소
							</button>
							<button type="submit" class="btn btn-sb">변경사항 저장</button>
						</div>
                    </div>
                </div>
            </div>
		</div>

        <div class="col-lg-3">
            <div class="sb-card mb-4">
            	<div class="sb-card__head">
            		<h2>양식 상세 정보</h2>
                </div>
                
                <div class="sb-card__body">
                    <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <span class="text-soft font-size-13">양식 ID</span>
                        <span class="fw-750 tnum">${dto.forId}</span>
                    </div>
                    <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <span class="text-soft font-size-13">생성일</span>
                        <span class="fw-600 tnum text-dark">${dto.forCreated}</span>
                    </div>
                    <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <span class="text-soft font-size-13">수정일</span>
                        <span class="fw-600 tnum text-dark">${dto.forUpdated}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-soft font-size-13">사용 여부</span>
                        <c:choose>
                            <c:when test="${dto.forStatus == false}">
                                <span class="sb-badge sb-badge--gray">
								<span class="pip"></span>비활성화</span>
                            </c:when>
                            <c:when test="${dto.forStatus == true}">
                                <span class="sb-badge sb-badge--green">
								<span class="pip"></span>활성화</span>
                            </c:when>
                        </c:choose>
                    </div>
                </div>

                <div class="sb-card__body bg-light border-top">
                	<div class="d-flex gap-2 align-items-start">
                    	<i class="bi bi-info-circle-fill text-primary mt-1"></i>
                    	<p class="m-0 text-soft" style="font-size: 12px;">
                        	생성일과 수정일은 시스템에서 자동으로 관리됩니다.
                    	</p>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>	
</form>
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
			location.href = "${pageContext.request.contextPath}/appr/delete?forId=" + forId;						
		}
		else{
			console.log("취소 확인");
		}
	}
	
	///////////////////// 양식 삭제 재확인 /////////////////////
</script>

<%@include file="/layout/footer.jsp"%>