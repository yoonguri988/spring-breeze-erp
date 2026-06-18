<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<%@include file="/layout/header.jsp"%>    
   
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

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
          <button class="cat-chip active" data-cat="all"><i class="bi bi-grid"></i> 전체</button>
          		<button class="cat-chip" data-cat="인사">
          <span class="sb-dot" style="background:var(--sb-accent)"></span> 인사</button>
          		<button class="cat-chip" data-cat="보안">
          <span class="sb-dot" style="background:var(--sb-red)"></span> 보안</button>
          		<button class="cat-chip" data-cat="IT">
          <span class="sb-dot" style="background:var(--sb-violet)"></span> IT</button>
          		<button class="cat-chip" data-cat="복지">
          <span class="sb-dot" style="background:var(--sb-green)"></span> 복지</button>
          		<button class="cat-chip" data-cat="일반">
          <span class="sb-dot" style="background:#9aa3b1"></span> 일반</button>
        </div>

        <div class="sb-card">
          <div class="sb-toolbar">
            <strong style="font-size:14px">공지 목록</strong>
            <span class="sb-badge sb-badge--gray" id="ntcCount">${notices.size()}건</span>
            <div class="grow"></div>
            <div class="sb-field sb-field--search">
              <i class="bi bi-search"></i>
              <input type="text" id="ntcSearch" placeholder="제목 검색">
            </div>
            <div class="sb-field">
              <select id="ntcSort">
                <option value="new">최신순</option>
                <option value="views">조회순</option>
              </select>
            </div>
          </div>
          
          <div id="ntcList">
            <c-rt:if test="${empty notices}">
              <div class="sb-empty" id="ntcEmpty"><i class="bi bi-megaphone"></i><p>공지사항이 없습니다.</p></div>
            </c-rt:if>
            
            <c:forEach var="n" items="${notices}">
              <div class="ntc-row" data-id="${n.bno}" data-cat="${n._cat}" data-title="${n.btitle}" 
              					   data-views="${n.bhit}" onclick="viewNotice(${n.bno})">
                <c:choose>
                  <c:when test="${n._pinned == 1}">
                    <i class="bi bi-pin-angle-fill ntc-pin"></i>
                  </c:when>
                  <c:otherwise>
                    <i class="bi bi-pin-angle" style="color:var(--sb-ink-faint);font-size:14px;opacity:.4"></i>
                  </c:otherwise>
                </c:choose>
                
                <span class="sb-badge sb-badge--${n._cat_color}">${n._cat}</span>
                
                <div style="flex:1;min-width:0">
                  <div style="font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                    <c:if test="${n._pinned == 1}"><span class="sb-badge sb-badge--amber me-1" 
                    		style="padding:1px 6px">중요</span></c:if>
                    <c:out value="${n.btitle}"/>
                  </div>
                  <div class="text-faint" style="font-size:12px;margin-top:2px">
                    ${n._author} · <fmt:formatDate value="${n.created_at}" pattern="yyyy-MM-DD"/>
                  </div>
                </div>
                <div class="text-faint d-none d-md-flex align-items-center gap-1" style="font-size:12.5px">
                  <i class="bi bi-eye"></i> <fmt:formatNumber value="${n.bhit}" type="number"/>
                </div>
                <i class="bi bi-chevron-right text-faint"></i>
              </div>
            </c:forEach>
          </div>
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
          <div id="mdContent" style="font-size:14px;line-height:1.8;color:var(--sb-ink); min-height:150px; 
                white-space:pre-wrap;">
            </div>
          <div class="sb-divider"></div>
          <div id="mdFileArea" class="d-flex align-items-center gap-3 text-faint" style="font-size:13px">
            <span><i class="bi bi-paperclip"></i> 첨부파일</span>
            <a id="mdFileLink" href="#" download class="d-inline-flex align-items-center gap-1" 
                 style="background:#fafbfc;border:1px solid var(--sb-border);border-radius:7px;padding:4px 10px; 
                  color:inherit;">
              <i class="bi bi-file-earmark-pdf" style="color:var(--sb-red)"></i> <span id="mdFileName"></span>
            </a>
          </div>
        </div>
        <div class="modal-footer">
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
        <form id="noticeRegForm" action="${pageContext.request.contextPath}/notice/register" method="POST" 
              enctype="multipart/form-data">
          <div class="modal-header">
            <h5 class="modal-title">공지 작성</h5>
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
                <textarea class="form-control" name="bcontent" rows="5" id="nnBody" 
                      placeholder="공지 내용을 입력하세요." required></textarea>
              </div>
              <div class="col-12">
                <label class="sb-form-label">파일 첨부</label>
                <input type="file" class="form-control" name="uploadFile" id="nnFile">
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
            <button type="submit" class="btn btn-sb"><i class="bi bi-megaphone"></i> 게시</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    const contextPath = "${pageContext.request.contextPath}";
    let detailModal, formModal;

    document.addEventListener("DOMContentLoaded", function () {
      detailModal = new bootstrap.Modal(document.getElementById('noticeDetailModal'));
      formModal = new bootstrap.Modal(document.getElementById('noticeFormModal'));

      // 프론트엔드 카테고리 필터링/정렬/검색 로직 구현 (기존 퍼블리셔 제공 스크립트 기반)
      const catChips = document.getElementById("catChips");
      const searchInput = document.getElementById("ntcSearch");
      const sortSelect = document.getElementById("ntcSort");
      const rows = Array.from(document.querySelectorAll(".ntc-row"));

      function filterAndSort() {
        const activeCat = catChips.querySelector(".cat-chip.active").dataset.cat;
        const keyword = searchInput.value.trim().toLowerCase();
        const sortBy = sortSelect.value;

        let visibleCount = 0;

        rows.forEach(row => {
          const catMatch = (activeCat === 'all' || row.dataset.cat === activeCat);
          const titleMatch = row.dataset.title.toLowerCase().includes(keyword);

          if (catMatch && titleMatch) {
            row.style.display = "flex";
            visibleCount++;
          } else {
            row.style.display = "none";
          }
        });

        document.getElementById("ntcCount").textContent = visibleCount + "건";
        // 간이 정렬 처리 (정렬 조건 변경 시 DOM 재배치)
        const container = document.getElementById("ntcList");
        rows.sort((a, b) => {
          if(sortBy === 'views') {
            return parseInt(b.dataset.views) - parseInt(a.dataset.views);
          } else {
            return parseInt(b.dataset.id) - parseInt(a.dataset.id); // bno 역순(최신순)
          }
        }).forEach(row => container.appendChild(row));
      }

      catChips.addEventListener("click", (e) => {
        const b = e.target.closest(".cat-chip"); if (!b) return;
        catChips.querySelectorAll(".cat-chip").forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        filterAndSort();
      });

      searchInput.addEventListener("input", filterAndSort);
      sortSelect.addEventListener("change", filterAndSort);
    });

    // 상세 보기 비동기 처리 호출 함수
    function viewNotice(bno) {
      fetch(contextPath + "/notice/detail?bno=" + bno)
        .then(res => res.json())
        .then(data => {
          document.getElementById("mdTitle").textContent = data.btitle;
          document.getElementById("mdContent").textContent = data.bcontent;
          document.getElementById("mdAuthor").textContent = data._author || "경영지원본부";
          document.getElementById("mdDate").textContent = data.created_at.substring(0,10);
          document.getElementById("mdHit").textContent = data.bhit;
          
          // 카테고리 뱃지 세팅
          const badge = document.getElementById("mdCatBadge");
          badge.className = "sb-badge sb-badge--" + (data._cat_color || 'gray');
          badge.textContent = data._cat || '일반';

          // 파일 링크 처리
          const fileArea = document.getElementById("mdFileArea");
          if(data.bfile) {
            fileArea.style.display = "flex";
            document.getElementById("mdFileName").textContent = data.bfile.substring(data.bfile.lastIndexOf("_") + 1);
            document.getElementById("mdFileLink").href = contextPath + "/upload/" + data.bfile;
          } else {
            fileArea.style.display = "none";
          }

          detailModal.show();
          
          // 부모 화면의 조회수 갱신을 위한 캐시 처리 (필요시 새로고침)
          const targetRow = document.querySelector(`.ntc-row[data-id="${bno}"]`);
          if(targetRow) targetRow.dataset.views = parseInt(targetRow.dataset.views) + 1;
        });
    }

    function openNewModal() {
      formModal.show();
    }
  </script>

<%@include file="/layout/footer.jsp"%>