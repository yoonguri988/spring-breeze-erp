<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>   
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@include file="/layout/header.jsp"%>

<main class="sb-content">
  <div class="sb-page-head">
    <div class="sb-page-head__txt">
      <div class="sb-breadcrumb"><a href="index.html">홈</a>
       <i class="bi bi-chevron-right"></i> 업무 <i class="bi bi-chevron-right"></i> 공지 관리</div>
      <h1>공지 관리</h1>
      <p>전사 공지사항을 게시하고 카테고리별로 관리합니다.</p>
    </div>
    <div class="sb-page-head__actions">
      <button class="btn btn-sb btn-sm" id="ntcNew" onclick="openNewModal()">
      <i class="bi bi-megaphone"></i> 공지 작성</button>
    </div>
  </div>

  <div class="d-flex gap-2 flex-wrap mb-3" id="catChips">
    <button class="cat-chip ${empty pi.category || pi.category eq 'all' ? 'active' : ''}" data-cat="all">
        <i class="bi bi-grid"></i> 전체</button>
    <button class="cat-chip ${pi.category eq '인사' ? 'active' : ''}" data-cat="인사">
        <span class="sb-dot" style="background:var(--sb-accent)"></span> 인사</button>
    <button class="cat-chip ${pi.category eq '보안' ? 'active' : ''}" data-cat="보안">
        <span class="sb-dot" style="background:var(--sb-red)"></span> 보안</button>
    <button class="cat-chip ${pi.category eq 'IT' ? 'active' : ''}" data-cat="IT">
        <span class="sb-dot" style="background:var(--sb-violet)"></span> IT</button>
    <button class="cat-chip ${pi.category eq '복지' ? 'active' : ''}" data-cat="복지">
        <span class="sb-dot" style="background:var(--sb-green)"></span> 복지</button>
    <button class="cat-chip ${pi.category eq '일반' ? 'active' : ''}" data-cat="일반">
        <span class="sb-dot" style="background:#9aa3b1"></span> 일반</button>
  </div>

  <!-- 목록 카드 -->
  <div class="sb-card">
    <!-- 검색 / 필터 툴바 (실제 GET 검색 폼) -->
      <strong style="font-size:14px">공지 목록</strong>
      <span class="sb-badge sb-badge--gray" id="ntcCount">${notices.size()}건</span>
      <!-- 구분선 -->
      <div class="grow"></div>
      
      <form action="${pageContext.request.contextPath}/notice/list" method="GET"
            id="searchForm" class="sb-toolbar">
	      <div class="sb-field sb-field--search">
	        <i class="bi bi-search"></i>
	        <input type="text" id="keyword" name="keyword" placeholder="제목 검색" value="${param.keyword}">
	      </div>
	      <div class="sb-field">
	        <select id="sortBy" name="sortBy" >
	          <option value="new" ${param.sortBy eq 'new' ? 'selected' : ''}>최신순</option>
	          <option value="views" ${param.sortBy eq 'views' ? 'selected' : ''}>조회순</option>
	        </select>
	      </div>
      </form>
    </div>
<div id="ntcList">
  <c:if test="${empty notices}">
    <div class="sb-empty" id="ntcEmpty">
      <i class="bi bi-megaphone"></i><p>공지사항이 없습니다.</p>
    </div>
  </c:if>
  
  <c:forEach var="n" items="${notices}">
    <div class="ntc-row d-flex align-items-center  my-3 py-3"
         style="border-bottom:1px solid #eee"
         data-id="${n.bno}" data-title="${n.btitle}" data-views="${n.bhit}"
         onclick="viewNotice(${n.bno})">
      
      <%-- <i class="bi bi-pin-angle" style="color:var(--sb-ink-faint);font-size:14px;opacity:.4;margin-right:6px"></i>
      <span class="sb-badge sb-badge--blue me-2">${n.category}</span>
       --%>
      <div class="flex-grow-1 d-flex flex-column" style="min-width:0">
        <div style="font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
           <a href="${pageContext.request.contextPath}/notice/detail?bno=${n.bno}" 
             class="text-decoration-none text-dark">
            <c:out value="${n.btitle}"/>
          </a>
        </div>
        <div class="text-faint" style="font-size:12px;margin-top:2px">
          사원번호 ${n.empId} · ${n.createdAt}
        </div>
      </div>
      
      <div class="text-faint d-flex align-items-center gap-1" style="font-size:12.5px;margin-left:8px">
        <i class="bi bi-eye"></i> <fmt:formatNumber value="${n.bhit}" type="number"/>
      </div>
      
      <i class="bi bi-chevron-right text-faint ms-2"></i> 
    </div>
  </c:forEach>
</div>

    <div class="d-flex justify-content-center mt-4 mb-2">
      <nav aria-label="Page navigation">
            	<ul class="pagination  justify-content-center"> 
            	<!-- 이전 -->
            	<c:if test="${paging.start > paging.bottomlist}">
            		<li  class="page-item">
            			<a href="?pstartno=${paging.start-1}"  class="page-link">이전</a>
            		</li>
            	</c:if>
            	
            	<!-- 1,2,3,4,5,6,7,8,,10 -->
            	<c:forEach  var="i"  begin="${paging.start}"  end="${paging.end}">
            		<li   class="page-item   <c:if test="${i==paging.current}">  active </c:if> ">
            			<a href="?pstartno=${i}"  class="page-link">${i}</a>
            		</li>
            	</c:forEach>
            	
            	<!-- 다음 -  다음글이 있다면  -  하단의전체 >  end  -->
            	<c:if test="${paging.pagetotal > paging.end}">
            		<li  class="page-item">
            			<a href="?pstartno=${paging.end+1}"  class="page-link">다음</a>
            		</li>
            	</c:if> 
            	</ul>
      </nav>
    </div>
</main>

<div class="modal fade" id="noticeDetailModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="mdTitle"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
          <span id="mdCatBadge"></span>
          <span id="mdPinnedBadge"></span>
          <span class="text-faint ms-auto" style="font-size:12.5px">
            <i class="bi bi-person"></i> <span id="mdAuthor"></span> · 
            <i class="bi bi-calendar3"></i> <span id="mdDate"></span> · 
            <i class="bi bi-eye"></i> <span id="mdHit"></span>
          </span>
        </div>
        <div id="mdContent" style="font-size:14px; line-height:1.8; color:var(--sb-ink); min-height:150px; 
        		white-space:pre-wrap;"></div>
        <div class="sb-divider"></div>
        <div id="mdFileArea" class="d-flex align-items-center gap-3 text-faint" style="font-size:13px">
          <span><i class="bi bi-paperclip"></i> 첨부파일</span>
          <a id="mdFileLink" href="#" class="d-inline-flex align-items-center gap-1" 
             style="background: #fafbfc; border: 1px solid var(--sb-border); border-radius: 7px; padding: 4px 10px; 
             		color:inherit;">
            <i class="bi bi-file-earmark-pdf" style="color:var(--sb-red)"></i> <span id="mdFileName"></span>
          </a>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-danger me-auto" id="btnDelete"><i class="bi bi-trash"></i> 삭제</button>
        <button class="btn btn-ghost" data-bs-dismiss="modal">닫기</button>
        <button class="btn btn-ghost" id="btnEdit"><i class="bi bi-pencil"></i> 편집</button>
        <button class="btn btn-sb" data-bs-dismiss="modal"><i class="bi bi-check2"></i> 확인</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="noticeFormModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <form id="noticeRegForm" action="${pageContext.request.contextPath}/notice/insert" method="POST" enctype="multipart/form-data">
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
        <input type="hidden" name="bno" id="nnBno" value="0">
        
        <div class="modal-header">
          <h5 class="modal-title" id="formModalTitle">공지 작성</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="sb-form-label">카테고리</label>
              <select class="form-select" name="category" id="nnCat">
                <option value="인사">인사</option>
                <option value="보안">보안</option>
                <option value="IT">IT</option>
                <option value="복지">복지</option>
                <option value="일반">일반</option>
              </select>
            </div>
            <div class="col-md-8">
              <label class="sb-form-label">제목</label>
              <input class="form-control" name="btitle" id="nnTitle" placeholder="공지 제목" required>
            </div>
            <div class="col-12">
              <label class="sb-form-label">내용</label>
              <textarea class="form-control" name="bcontent" rows="5" id="nnBody" placeholder="공지 내용을 입력하세요." 
              			required></textarea>
            </div>
            <div class="col-12">
              <label class="sb-form-label">파일 첨부</label>
              <input type="file" class="form-control" name="bFile" id="nnFile">
            </div>
            <div class="col-12 d-flex align-items-center gap-2">
              <input type="checkbox" id="nnPin" name="isPinned" value="1" style="width:16px; height:16px; 
              			accent-color:var(--sb-accent);">
              <span style="font-size:13.5px">상단 고정 (중요 공지)</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost" data-bs-dismiss="modal">취소</button>
          <button type="submit" class="btn btn-sb" id="btnSubmit"><i class="bi bi-megaphone"></i> 게시</button>
        </div>
      </form>
    </div>
  </div>
</div>

<form id="deleteForm" action="${pageContext.request.contextPath}/notice/delete" method="POST" style="display:none;">
  <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
  <input type="hidden" name="bno" id="delBno">
</form>

<script>
  const contextPath = "${pageContext.request.contextPath}";
  let detailModal, formModal;
  let currentDetailData = null; 

  document.addEventListener("DOMContentLoaded", function () {
    detailModal = new bootstrap.Modal(document.getElementById('noticeDetailModal'));
    formModal = new bootstrap.Modal(document.getElementById('noticeFormModal'));

    const catChips = document.getElementById("catChips");

    catChips.addEventListener("click", (e) => {
      const b = e.target.closest(".cat-chip"); if (!b) return;
      catChips.querySelectorAll(".cat-chip").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      submitSearchData();
    });

    searchInput.addEventListener("keypress", function(e) {
      if(e.key === 'Enter') submitSearchData();
    });
    sortSelect.addEventListener("change", submitSearchData);

    document.getElementById("btnEdit").addEventListener("click", function() {
      if(currentDetailData) {
        detailModal.hide(); 
        openEditModal(currentDetailData); 
      }
    });

    document.getElementById("btnDelete").addEventListener("click", function() {
      if(currentDetailData && confirm("정말 이 공지사항을 삭제하시겠습니까?")) {
        document.getElementById("delBno").value = currentDetailData.bno;
        document.getElementById("deleteForm").submit(); 
      }
    });
  });

  function changePage(targetPage) {
    const activeCat = document.querySelector("#catChips .cat-chip.active").dataset.cat || 'all';
    const keyword = document.getElementById("ntcSearch").value.trim();
    const sortBy = document.getElementById("ntcSort").value || 'new';

    location.href = contextPath + "/notice/list?page=" + targetPage 
                  + "&category=" + activeCat 
                  + "&searchKeyword=" + encodeURIComponent(keyword) 
                  + "&sort=" + sortBy;
  }

  function viewNotice(bno) {
     const csrfToken = document.querySelector("meta[name='_csrf']").getAttribute("content");
     const csrfHeader = document.querySelector("meta[name='_csrf_header']").getAttribute("content");

    fetch(contextPath + "/notice/detail?bno=" + bno, {
         method: "GET",
         headers: { [csrfHeader]: csrfToken } 
    })
      .then(res => res.json())
      .then(data => {
        currentDetailData = data; 

        document.getElementById("mdTitle").textContent = data.btitle;
        document.getElementById("mdContent").textContent = data.bcontent;
        document.getElementById("mdAuthor").textContent = data._author || "경영지원본부";
        
        // 날짜 데이터가 어떤 형식으로 넘어와도 깨지지 않게 보장합니다.
        if (data.created_at) {
            document.getElementById("mdDate").textContent = String(data.created_at).substring(0,10);
        }
        document.getElementById("mdHit").textContent = data.bhit;
        
        const badge = document.getElementById("mdCatBadge");
        badge.className = "sb-badge sb-badge--" + (data._cat_color || 'gray');
        badge.textContent = data._cat || '일반';

        const fileArea = document.getElementById("mdFileArea");
        if(data.bfile) {
          fileArea.style.display = "flex";
          document.getElementById("mdFileName").textContent = data.bfile.substring(data.bfile.lastIndexOf("_") + 1);
          document.getElementById("mdFileLink").href = contextPath + "/upload/" + data.bfile;
        } else {
          fileArea.style.display = "none";
        }

        detailModal.show();
        
        const targetRow = document.querySelector(`.ntc-row[data-id="${bno}"]`);
        if(targetRow) targetRow.dataset.views = parseInt(targetRow.dataset.views) + 1;
      });
  }

  function openNewModal() {
    const form = document.getElementById("noticeRegForm");
    form.reset(); 
    
    /* const csrfParam = "${_csrf.parameterName}";  
    const csrfToken = "${_csrf.token}"; */
    form.action = contextPath + "/notice/insert"; //+ csrfParam + "=" + csrfToken
    
    document.getElementById("nnBno").value = "0";
    document.getElementById("formModalTitle").textContent = "공지 작성";
    document.getElementById("btnSubmit").innerHTML = '<i class="bi bi-megaphone"></i> 게시';
    formModal.show();
  }

  function openEditModal(data) {
    const form = document.getElementById("noticeRegForm");
    form.reset();
    
  /*   const csrfParam = "${_csrf.parameterName}";
    const csrfToken = "${_csrf.token}"; */
    
    // 따옴표 구조 오타를 완벽히 해결하여 스크립트가 뻗는 문제를 정상화했습니다.
    form.action = contextPath + "/notice/update?" + csrfParam + "=" + csrfToken; 
    
    document.getElementById("nnBno").value = data.bno; 
    document.getElementById("formModalTitle").textContent = "공지 수정";
    document.getElementById("btnSubmit").innerHTML = '<i class="bi bi-pencil-square"></i> 수정완료';

    document.getElementById("nnCat").value = data._cat || "일반";
    document.getElementById("nnTitle").value = data.btitle;
    document.getElementById("nnBody").value = data.bcontent;
    
    if(data._pinned === 1) {
      document.getElementById("nnPin").checked = true;
    } else {
      document.getElementById("nnPin").checked = false;
    }
    formModal.show();
  }
</script>
<%@include file="/layout/footer.jsp"%>