<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>자원 등록</title>
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
        <h4 class="fw-bold mb-0">자원 등록</h4>
        <p class="text-muted mb-0" style="font-size:13px;">새로운 자원 정보를 입력해주세요.</p>
    </div>

    <div class="page-card">
        <!-- Controller의 @RequestMapping(value="/resv/insert", method=POST) 와 정확히 일치 -->
        <form action="${pageContext.request.contextPath}/resv/insert" method="post">
		 <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
		
            <!-- 자원코드 -->
            <div class="mb-3">
                <label for="resCode" class="form-label fw-bold">
                    자원코드 <span class="text-danger">*</span>
                </label>
                <input type="text" name="resCode" id="resCode"
                       class="form-control" placeholder="예: RM004" required>
            </div>

            <!-- 자원명 -->
            <div class="mb-3">
                <label for="resName" class="form-label fw-bold">
                    자원명 <span class="text-danger">*</span>
                </label>
                <input type="text" name="resName" id="resName"
                       class="form-control" placeholder="예: 신규 회의실" required>
            </div>

            <!-- 자원타입 -->
            <div class="mb-3">
                <label for="resType" class="form-label fw-bold">
                    자원타입 <span class="text-danger">*</span>
                </label>
                <select name="resType" id="resType" class="form-select" required>
                  
                    <option value="ROOM">회의실 (ROOM)</option>
                </select>
            </div>

            <!-- 수량 -->
            <div class="mb-3">
                <label for="quantity" class="form-label fw-bold">
                    수량 <span class="text-danger">*</span>
                </label>
                <input type="number" name="quantity" id="quantity"
                       class="form-control" placeholder="0" min="0" value="1" required>
            </div>

            <!-- 비고 -->
            <div class="mb-4">
                <label for="remark" class="form-label fw-bold">비고</label>
                <input type="text" name="remark" id="remark"
                       class="form-control" placeholder="비고를 입력하세요 (선택)">
            </div>

            <!-- 버튼 -->
            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary flex-fill">
                    <i class="bi bi-check-lg"></i> 등록
                </button>
                <a href="${pageContext.request.contextPath}/resv/list" class="btn btn-secondary">
                    취소
                </a>
            </div>

        </form>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
