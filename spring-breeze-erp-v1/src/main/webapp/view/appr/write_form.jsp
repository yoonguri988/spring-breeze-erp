<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>   
<%@include file="/layout/header.jsp"%>
    
<div class="sb-content">
	 <div class="sb-page-head">
	 	<div class="sb-page-head__txt">
	 		<div class="sb-breadcrumb">
		 		<a href="${pageContext.request.contextPath}/appr/list">전자결재</a>
		 		<i class="bi bi-chevron-right"></i>
		 		<span>양식관리</span>
	 		</div>
	 		<h1>결재 양식 작성</h1>
	 		<p>새로운 결재 양식을 등록합니다.</p>
	 	</div>
	 	<div class="sb-page-head__actions">
		 	<button type="button" class="btn btn-ghost"
		 			onclick="location.href='${pageContext.request.contextPath}/appr/list'">
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
						<label for="comName"
							   class="sb-form-label">양식 추가할 회사</label>
							<div class="sb-search">
							<i class="bi bi-building"></i>
							<input type="text" id="comName" name="comName" value="${param.comName}"
								   placeholder="회사명" autocomplete="off" />
							<input type="hidden" id="comId" name="comId" value="${param.comId}"/>
						</div>
						<div class="ac-list" id="acList"></div>
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

	(function () {
	    "use strict";
		const CTX = "${pageContext.request.contextPath}";
		/* ===================== 회사 이름 실시간 자동완성 ===================== */
	    const kwInput = document.getElementById("comName");
	    const comId = document.getElementById("comId");
	    const acList  = document.getElementById("acList");
	    let debounceTimer = null;
	    let acIndex = -1;

	    kwInput.addEventListener("input", function () {
	        const kw = this.value.trim();
	        clearTimeout(debounceTimer);
	        if (!kw) { hideAc(); return; }
	        debounceTimer = setTimeout(() => fetchSuggest(kw), 220);
	    });

	    kwInput.addEventListener("keydown", function (e) {
	        const items = [...acList.querySelectorAll(".ac-item")];
	        if (!items.length) return;
	        if (e.key === "ArrowDown") { e.preventDefault(); acIndex = Math.min(acIndex + 1, items.length - 1); }
	        else if (e.key === "ArrowUp") { e.preventDefault(); acIndex = Math.max(acIndex - 1, 0); }
	        else if (e.key === "Enter" && acIndex >= 0) { e.preventDefault(); items[acIndex].dispatchEvent(new Event("mousedown")); return; }
	        else return;
	        items.forEach((it, i) => it.classList.toggle("active", i === acIndex));
	    });

	    document.addEventListener("click", function (e) {
	        if (!kwInput.contains(e.target) && !acList.contains(e.target)) hideAc();
	    });

	    function fetchSuggest(kw) {
	        fetch(CTX + "/com/suggest?keyword=" + encodeURIComponent(kw))
	            .then(function (res) {
	                if (!res.ok) throw new Error("network error");
	                return res.json();
	            })
	            .then(function (data) { renderAc(data, kw); })
	            .catch(hideAc);
	    }

	    function renderAc(data, kw) {
	        acList.innerHTML = "";
	        acIndex = -1;

	        if (!data || data.length === 0) {
	            acList.innerHTML = '<div class="ac-empty">일치하는 회사가 없습니다.</div>';
	            acList.classList.add("show");
	            return;
	        }

	        data.forEach(function (item) {
	            const div = document.createElement("div");
	            div.className = "ac-item";
	            div.innerHTML =
	                '<i class="bi bi-building text-faint"></i>'
	                + '<span>' + highlight(item.comName, kw) + '</span>'
	                + '<span class="ac-item__meta">' + (item.bizNo || "") + '</span>';

	            div.addEventListener("mousedown", function (e) {
	                e.preventDefault(); // blur 방지
	                kwInput.value = item.comName;
	                comId.value = item.comId;
	                hideAc();
	                document.getElementById("searchForm").submit();
	            });

	            acList.appendChild(div);
	        });

	        acList.classList.add("show");
	    }

	    function highlight(text, kw) {
	        if (!kw) return text;
	        const escaped = kw.replace(/[.*+?^$\x7B\x7D()|[\]\\]/g, "\\$&");
	        return text.replace(new RegExp("(" + escaped + ")", "gi"), "<b>$1</b>");
	    }

	    function hideAc() {
	        acList.classList.remove("show");
	        acList.innerHTML = "";
	        acIndex = -1;
	    }
	})();
</script>
<%@include file="/layout/footer.jsp"%>