<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<%@include file="/layout/header.jsp"%>
		<h4>프로젝트 멤버</h4>
		<div class="my-4" style="display:grid; grid-template-columns:150px 1fr auto; gap:10px; margin-bottom:15px;">
		 <label for="emp_id" class="form-label">멤버추가</label>
		 <input type="text" id="emp_id" name="emp_id" class="form-control" placeholder="사원 번호 검색"/>
		 <button type="button" id="searchBtn" class="btn btn-primary">조회</button>
		</div>
		<div class="my-4" style="display:grid; grid-template-columns:150px 1fr; gap:10px; margin-bottom:15px;">
		<label class="form-label">프로젝트 멤버</label>
		<div class="mb-4">
   		 <table class="table table-bordered">
        <thead>
            <tr>
                <th>선택</th>
                <th>사번</th>
                <th>이름</th>
                <th>부서</th>
            </tr>
        </thead>
        <tbody id="empList">
            <!-- 임시 데이터 -->
            <tr><td>
 			<input type="checkbox" class="member-check" data-id="1010" data-name="최다영">
                </td>
                <td>1010</td>
                <td>최다영</td>
                <td>개발팀</td>
            </tr>
            <tr> <td>
             <input type="checkbox" class="member-check" data-id="1011" data-name="최아영">
                </td>
                <td>1011</td>
                <td>최아영</td>
                <td>개발팀</td>
            </tr>
        </tbody>
    </table>
</div>
		<div id="selectedMembers">
			<!-- ajax 결과 출력 -->
		</div>
		</div>
		</form>
<%@include file="/layout/footer.jsp"%>