<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>   
<%@include file="/layout/header.jsp"%>

<script>
window.addEventListener("load", function() {
    let result = '${result}'; // EL 데이터 읽기
    console.log(result);
    
    if (result === "공지글 삭제 실패") {  
        alert(result); 
        history.go(-1); // 알림창 띄운 후 이전 상세 화면으로 복귀
    } else if (result.trim().length != 0) { 
        alert(result); 
    }
});
</script>

<div class="container my-5">
    <h3>공지글 삭제 확인</h3>
    <p class="text-muted">게시글을 삭제하시려면 본인의 사원번호를 입력해주세요.</p>
    
    <form action="${pageContext.request.contextPath}/notice/delete" 
          method="post" 
          onsubmit="return checkForm()"> 
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />         
        <input type="hidden" name="bno" value="${param.bno}" />
              
        <div class="my-3">
            <label for="emp_no" class="form-label">사원번호 확인</label>
            <input type="text" class="form-control" id="emp_no" name="emp_no" placeholder="사원번호를 입력하세요." />
        </div> 
        
        <div class="my-3 text-end"> 
            <button type="reset" class="btn btn-outline-primary" title="글취소">취소</button>
            <a href="${pageContext.request.contextPath}/notice/list" class="btn btn-outline-success" 
            		title="목록보러가기">목록</a>
            <button type="submit" class="btn btn-danger" title="글삭제">글삭제</button>
        </div>
    </form> 

    <script>
    function checkForm() { 
        // 변수명을 역할에 맞게 bpass에서 empId로 변경하여 직관성을 높였습니다
        let empId = document.getElementById("emp_no"); 
        if (empId.value.trim() === "") { 
            alert("사원번호가 빈칸입니다. \n확인 후 입력해주세요."); 
            empId.focus();  
            return false; 
        } 
        return true;
    }
    </script>
</div>
   
<%@include file="/layout/footer.jsp"%>