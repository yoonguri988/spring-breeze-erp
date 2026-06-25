<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>   
    
<%@include file="/layout/header.jsp"%>
<!-- 	header		 -->
<!-- 	header		 -->

   <div class="container  my-5">
      <h3>공지 작성</h3>
      <!--  	1. 처리 : write_action.jsp  2. 데이터 주소표시창줄 노출 x  3. 보관용기이름 file이름   -->
      <form  action ="${pageContext.request.contextPath}/notice/write"  
             method = "post"   
           onsubmit ="return checkForm()"
            enctype ="multipart/form-data">
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
      	<div  class="my-3">
      		<label for="btitle"  class="form-label">제목</label>
      		<input type="text"   class="form-control"    id="btitle"  name="btitle"  />
      	</div>
      	<div  class="my-3">
      		<label for="bcontent"  class="form-label">내용</label>
      		<textarea  class="form-control"    id="bcontent"  name="bcontent"  ></textarea>
      	</div>
      	
      	<div class="my-3">
         <label for="bfile"   class="form-label">파일첨부</label>
         <input type="file"  id="bfile"  name="bfile"   class="form-control"/>
        </div>  
      	
      	<div  class="my-3  text-end"> 
      		<button type="reset"   class="btn btn-outline-primary"  title="글취소">취소</button>
      		<a href="${pageContext.request.contextPath}/notice/list"     class="btn btn-outline-success"  title="목록보러가기">목록</a>
      		<button type="submit"  class="btn btn-primary"  title="글등록">게시</button>
      	</div>
      </form> 
		<script>
		function   checkForm(){
			let btitle = document.getElementById("btitle");
			let bcontent = document.getElementById("bcontent");

			if(btitle.value.trim() ==""){ alert("빈칸입니다. \n제목을 입력해주세요."); btitle.focus();  return false; }
			if(bcontent.value.trim() ==""){ alert("빈칸입니다. \n내용을 입력해주세요");bcontent.focus();  return false;}
			return true;
		}
		</script>
   </div>
   
<!-- 	footer		 -->
<!-- 	footer		 -->
<%@include file="/layout/footer.jsp"%>
