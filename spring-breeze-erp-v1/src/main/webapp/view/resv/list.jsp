<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>자원 목록</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <style>
        body { background:#F4F6FB; font-family:'Segoe UI','Noto Sans KR',sans-serif; }
        .page-card { background:#fff; border:1px solid #E2E8F0; border-radius:10px; padding:20px; }
        .res-table th { background:#EEF2FF; color:#3B5BDB; font-weight:700; }
        .badge-room { background:#F3F0FF; color:#6741D9; border:1px solid #D0BFFF; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:700; }
        .badge-equip { background:#E7F5FF; color:#1971C2; border:1px solid #BAE0FF; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:700; }
        .qty-badge { background:#EEF2FF; color:#3B5BDB; border-radius:12px; padding:1px 10px; font-size:13px; font-weight:700; }
    </style>
</head>
<body class="p-4">
<div class="container">

    <!-- 페이지 제목 -->
    <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
            <h4 class="fw-bold mb-0">자원 목록</h4>
            <p class="text-muted mb-0" style="font-size:13px;">등록된 자원을 조회하고 관리할 수 있습니다.</p>
        </div>
        <a href="${pageContext.request.contextPath}/resv/insert" class="btn btn-primary">
            <i class="bi bi-plus-lg"></i> 자원 등록
        </a>
    </div>

    <div class="page-card">

        <!-- 검색 폼 -->
        <form action="${pageContext.request.contextPath}/resv/list" method="get" class="row g-2 mb-3">
            <div class="col-auto">
                <input type="text" name="keyword" value="${keyword}" class="form-control" placeholder="자원명, 자원코드로 검색">
            </div>
            <div class="col-auto">
                <select name="resType" class="form-select">
                    <option value="" ${empty resType ? 'selected' : ''}>전체 타입</option>
                    <option value="EQUIPMENT" ${resType == 'EQUIPMENT' ? 'selected' : ''}>장비</option>
                    <option value="ROOM" ${resType == 'ROOM' ? 'selected' : ''}>회의실</option>
                </select>
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-primary"><i class="bi bi-search"></i> 검색</button>
            </div>
        </form>

        <!-- 자원 목록 테이블 -->
        <table class="table table-bordered text-center res-table">
            <thead>
                <tr>
                    <th>자원ID</th>
                    <th>자원코드</th>
                    <th>자원명</th>
                    <th>타입</th>
                    <th>수량</th>
                    <th>비고</th>
                    <th>관리</th>
                </tr>
            </thead>
            <tbody>
                <c:choose>
                    <c:when test="${empty resourceList}">
                        <tr>
                            <td colspan="7" class="text-muted py-4">등록된 자원이 없습니다.</td>
                        </tr>
                    </c:when>
                    <c:otherwise>
                        <c:forEach var="r" items="${resourceList}">
                            <tr>
                                <td>${r.resId}</td>
                                <td>${r.resCode}</td>
                                <td>${r.resName}</td>
                                <td>
                                    <c:choose>
                                        <c:when test="${r.resType == 'ROOM'}">
                                            <span class="badge-room">회의실</span>
                                        </c:when>
                                       
                                    </c:choose>
                                </td>
                                <td><span class="qty-badge">${r.quantity}</span></td>
                                <td>${r.remark}</td>
                                <td>
                                  <!-- 사용자 시점의 페이지 화면  -->
                                  <a href="${pageContext.request.contextPath}/resv/detail?id=${r.resId}"
                                       class="btn btn-sm btn-outline-secondary">상세</a>
                				
                				
                				  <!-- 관리자  시점의 페이지 화면-->
                                  <sec:authorize access="hasRole('ROLE_ADMIN')">
                                    <a href="${pageContext.request.contextPath}/resv/update?id=${r.resId}"
                                       class="btn btn-sm btn-outline-primary">수정</a>
                                    <a href="${pageContext.request.contextPath}/delete?id=${r.resId}"
                                       class="btn btn-sm btn-outline-danger"
                                       onclick="return confirm('삭제하시겠습니까?');">삭제</a>
                                   </sec:authorize>
                                   
                                </td>
                                
                                
                            </tr>
                        </c:forEach>
                    </c:otherwise>
                </c:choose>
            </tbody>
        </table>

        <!-- 페이징 -->
        <nav>
            <ul class="pagination justify-content-center mt-3">
                <c:forEach var="i" begin="${paging.start}" end="${paging.end}">
                    <li class="page-item ${i == paging.current ? 'active' : ''}">
                        <a class="page-link"
                           href="${pageContext.request.contextPath}/resv/list?page=${i}&keyword=${keyword}&resType=${resType}">${i}</a>
                    </li>
                </c:forEach>
            </ul>
        </nav>

    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>