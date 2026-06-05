<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>     
<%@include file="../inc/header.jsp"  %>

   <div class="container my-5">
      <h3>글 수정</h3>
      <form action="${pageContext.request.contextPath}/board/edit.do?bno=${dto.bno}" 
      method="post" onsubmit="return checkForm()">
      	
      	<input type="hidden" name="bno" value="${dto.bno}" />
      	
      	<div class="my-3">
      		<label for="bname" class="form-label">이름</label>
      		<input type="text" class="form-control" id="bname" name="bname" value="${dto.bname}" />
      	</div> 
      	<div class="my-3">
      		<label for="bpass" class="form-label">비밀번호</label>
      		<input type="password" class="form-control" id="bpass" name="bpass" />
      	</div>
      	<div class="my-3">
      		<label for="btitle" class="form-label">제목</label>
      		<input type="text" class="form-control" id="btitle" name="btitle" value="${dto.btitle}" />
      	</div>
      	<div class="my-3">
      		<label for="bcontent" class="form-label">내용</label>
      		<textarea class="form-control" id="bcontent" name="bcontent" rows="5">${dto.bcontent}</textarea>
      	</div>
      	<div class="my-3 text-end"> 
      		<button type="reset" class="btn btn-outline-primary" title="글수정취소">취소</button>
      		<a href="${pageContext.request.contextPath}/board/list.do" class="btn btn-outline-success" title="목록보러가기">목록</a>
      		<button type="submit" class="btn btn-primary" title="글수정">글수정</button>
      	</div>
      </form> 
      
		<script>
		function checkForm(){
			let bname = document.getElementById("bname");
			let bpass = document.getElementById("bpass");
			let btitle = document.getElementById("btitle");
			let bcontent = document.getElementById("bcontent");
			
			if(bname.value.trim() ==""){ alert("이름은 빈칸일 수 없습니다.");  bname.focus();  return false; }
			if(bpass.value.trim() ==""){ alert("비밀번호를 입력해주세요.");  bpass.focus();  return false; }
			if(btitle.value.trim() ==""){ alert("제목을 입력해주세요."); btitle.focus();  return false; }
			if(bcontent.value.trim() ==""){ alert("내용을 입력해주세요.");bcontent.focus();  return false;}
			return true;
		}
		</script>
   </div>

<%@include file="../inc/footer.jsp"  %>