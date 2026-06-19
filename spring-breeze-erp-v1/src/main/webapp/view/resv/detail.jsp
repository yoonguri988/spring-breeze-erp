<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>자원 상세</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <style>
        body { background:#F4F6FB; font-family:'Segoe UI','Noto Sans KR',sans-serif; }
        .page-card { background:#fff; border:1px solid #E2E8F0; border-radius:10px; padding:24px; max-width:600px; margin:0 auto; }
        .detail-grid { display:grid; grid-template-columns:120px 1fr; row-gap:14px; font-size:14px; }
        .detail-grid .lbl { color:#6B7A99; font-weight:700; }
        .badge-room { background:#F3F0FF; color:#6741D9; border:1px solid #D0BFFF; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; }
        .badge-equip { background:#E7F5FF; color:#1971C2; border:1px solid #BAE0FF; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; }
    </style>
</head>
<body class="p-4">
<div class="container">

    <div class="mb-3">
        <h4 class="fw-bold mb-0">자원 상세</h4>
        <p class="text-muted mb-0" style="font-size:13px;">
            <a href="${pageContext.request.contextPath}/resv/list" class="text-decoration-none">자원 목록</a>
            &nbsp;&rsaquo;&nbsp; 자원 상세
        </p>
    </div>

    <div class="page-card">

        <div class="detail-grid mb-4">
            <span class="lbl">자원ID</span>
            <span>${resource.resId}</span>

            <span class="lbl">자원코드</span>
            <span>${resource.resCode}</span>

            <span class="lbl">자원명</span>
            <span class="fw-bold">${resource.resName}</span>

            <span class="lbl">자원타입</span>
            <span>
                <c:choose>
                    <c:when test="${resource.resType == 'ROOM'}">
                        <span class="badge-room">회의실</span>
                    </c:when>

                </c:choose>
            </span>

            <span class="lbl">보유 수량</span>
            <span>${resource.quantity}</span>

            <span class="lbl">비고</span>
            <span class="text-muted">${empty resource.remark ? '-' : resource.remark}</span>

            <span class="lbl">등록일</span>
            <span class="text-muted">${resource.createdAt}</span>

            <span class="lbl">수정일</span>
            <span class="text-muted">${resource.updatedAt}</span>
        </div>

        <div class="d-flex gap-2">
            <a href="${pageContext.request.contextPath}/resv/update?id=${resource.resId}"
               class="btn btn-primary">
                <i class="bi bi-pencil"></i> 수정
            </a>
            <a href="${pageContext.request.contextPath}/delete?id=${resource.resId}"
               class="btn btn-danger"
               onclick="return confirm('삭제하시겠습니까?');">
                <i class="bi bi-trash"></i> 삭제
            </a>
            <a href="${pageContext.request.contextPath}/resv/list" class="btn btn-secondary ms-auto">
                목록으로
            </a>
        </div>

    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
