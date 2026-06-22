<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>   
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@include file="/layout/header.jsp"%>

<script>
window.addEventListener("load", function() {
    let result = '${result}'; // EL 데이터 읽기
    console.log(result);
    
    if (result.trim().length != 0) { 
        alert(result); 
    }
});
</script>

<div class="container my-5">
    <h3>공지 글 상세보기</h3>
    
    <div class="my-3">
        <label for="btitle" class="form-label">제목</label>
        <input type="text" class="form-control" value="${notice.btitle}" id="btitle" name="btitle" readonly />
    </div>
    
    <div class="my-3">
        <label for="bcontent" class="form-label">내용</label>
        <textarea class="form-control" id="bcontent" name="bcontent" rows="8" readonly>${notice.bcontent}</textarea>
    </div>
    
    <c:if test="${not empty notice.bfile}">
        <div class="my-3">
            <img src="${pageContext.request.contextPath}/upload/${notice.bfile}" alt="${notice.btitle}" 
                	class="img-fluid w-50" />
        </div>
    </c:if>
    
    <div class="my-3 text-end"> 
        <a href="${pageContext.request.contextPath}/notice/edit.do?bno=${notice.bno}" 
        		class="btn btn-outline-primary" title="글수정">수정</a>
        <a href="${pageContext.request.contextPath}/notice/delete.do?bno=${notice.bno}" 
        		class="btn btn-outline-danger" title="글삭제" onclick="return confirm('정말 삭제하시겠습니까?');">삭제</a>
        <a href="${pageContext.request.contextPath}/notice/list.do" class="btn btn-primary" title="목록보러가기">목록</a>
    </div>
</div>

<%@include file="/layout/footer.jsp"%>