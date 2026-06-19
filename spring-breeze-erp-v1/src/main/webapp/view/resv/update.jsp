<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>자원 수정</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <style>
        body { background:#F4F6FB; font-family:'Segoe UI','Noto Sans KR',sans-serif; }
        .page-card { background:#fff; border:1px solid #E2E8F0; border-radius:10px; padding:24px; max-width:600px; margin:0 auto; }
    </style>
</head>
<body class="p-4">
<div class="container">

    <div class="mb-3">
        <h4 class="fw-bold mb-0">자원 수정</h4>
        <p class="text-muted mb-0" style="font-size:13px;">자원 정보를 수정해주세요.</p>
    </div>

    <div class="page-card">
        <!-- Controller의 @RequestMapping(value="/resv/update", method=POST) 와 정확히 일치 -->
        <form action="${pageContext.request.contextPath}/resv/update" method="post">

            <!-- CSRF 토큰 (Spring Security 필수!) -->
            <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>

            <!-- 자원ID (수정 불가, 숨김으로 전달) -->
            <input type="hidden" name="resId" value="${resource.resId}"/>

            <div class="mb-3">
                <label class="form-label fw-bold">자원ID</label>
                <input type="text" class="form-control" value="${resource.resId}" readonly>
            </div>

            <!-- 자원코드 -->
            <div class="mb-3">
                <label for="resCode" class="form-label fw-bold">
                    자원코드 <span class="text-danger">*</span>
                </label>
                <input type="text" name="resCode" id="resCode"
                       class="form-control" value="${resource.resCode}" required>
            </div>

            <!-- 자원명 -->
            <div class="mb-3">
                <label for="resName" class="form-label fw-bold">
                    자원명 <span class="text-danger">*</span>
                </label>
                <input type="text" name="resName" id="resName"
                       class="form-control" value="${resource.resName}" required>
            </div>

            <!-- 자원타입 -->
            <div class="mb-3">
                <label for="resType" class="form-label fw-bold">
                    자원타입 <span class="text-danger">*</span>
                </label>
                <select name="resType" id="resType" class="form-select" required>
                   
                    <option value="ROOM" ${resource.resType == 'ROOM' ? 'selected' : ''}>
                        회의실 (ROOM)
                    </option>
                </select>
            </div>

            <!-- 수량 -->
            <div class="mb-3">
                <label for="quantity" class="form-label fw-bold">
                    수량 <span class="text-danger">*</span>
                </label>
                <input type="number" name="quantity" id="quantity"
                       class="form-control" value="${resource.quantity}" min="0" required>
            </div>

            <!-- 비고 -->
            <div class="mb-4">
                <label for="remark" class="form-label fw-bold">비고</label>
                <input type="text" name="remark" id="remark"
                       class="form-control" value="${resource.remark}" placeholder="비고 (선택)">
            </div>

            <!-- 버튼 -->
            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary flex-fill">
                    <i class="bi bi-check-lg"></i> 수정 완료
                </button>
                <a href="${pageContext.request.contextPath}/resv/detail?id=${resource.resId}"
                   class="btn btn-secondary">
                    취소
                </a>
            </div>

        </form>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
