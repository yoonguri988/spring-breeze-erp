<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>  
     
<%@include file="/layout/header.jsp"%>
<!-- 	header		 -->
<!-- 	header		 -->

<script>
window.addEventListener("load", function() {
	let result = '${result}'  // EL 데이터 읽기
	console.log(result);
	
	if( result == "글 수정 실패") {  alert(result); history.go(-1); } // 알림창, 뒤로 가기
	else if(result.length != 0 ) { alert(result); }
});

</script>

   <div class="container  my-5">
      <h3>공지 수정</h3>
      <form  action ="${pageContext.request.contextPath}/notice/edit?bno=${dto.bno}"  
             method = "post"   
            enctype ="multipart/form-data"
            onsubmit ="return checkForm()">
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />    
      	<div  class="my-3">
      		<label for="btitle"  class="form-label">제목</label>
      		<input type="text"   class="form-control"    id="btitle"  name="btitle" 
      		value = "${dto.btitle}" />
      	</div>
      	<div  class="my-3">
      		<label for="bcontent"  class="form-label">내용</label>
      		<textarea  class="form-control"    id="bcontent"  name="bcontent"  >${dto.bcontent}</textarea>
      	</div>
      	
      	<div class="my-3">
         <label for="bfile"   class="form-label">기존파일</label>
         <input type="text"  id="bfile"  name="bfile"   value = "${dto.bfile}" readonly  class="form-control"/>
        </div>  
        
            <c:if test="${not empty dto.bfile}">
        <div class="my-3">
            <img src="${pageContext.request.contextPath}/upload/${dto.bfile}" alt="${dto.btitle}" 
                	class="img-fluid w-25" />
        </div>
    		</c:if>

         <div class="my-3">
         <label for="file"   class="form-label">파일 첨부</label>
         <input type="file"  id="file"  name="file"       class="form-control"/>
        </div> 
      	<div  class="my-3  text-end"> 
      		<button type="reset"   class="btn btn-outline-primary"  title="글수정취소">취소</button>
      		<a href="${pageContext.request.contextPath}/notice/list"  
      		    class="btn btn-outline-success"  title="목록보러가기">목록</a>
      		<button type="submit"  class="btn btn-primary"  title="글수정">글수정</button>
      	</div>
      </form> 
		<script>
		function   checkForm(){
			let btitle = document.getElementById("btitle");
			let bcontent = document.getElementById("bcontent");

			if(btitle.value.trim() ==""){ alert("빈칸입니다. \n제목을 입력해주세요."); btitle.focus();  return false; }
			if(bcontent.value.trim() ==""){ alert("빈칸입니다. \n내용을 입력해주세요.");bcontent.focus();  return false;}
			return true;
		}
		</script>
   </div>
<!-- 	footer		 -->
<!-- 	footer		 -->
<%@include file="/layout/footer.jsp"%>