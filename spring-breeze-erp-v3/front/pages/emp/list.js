// pages/emp/list.js
import React, { useState, useEffect } from "react"; // 이벤트 변경 감지, 변수 변경
import { useSelector, useDispatch } from "react-redux"; // 전역상태, 스토어 알림
import { useRouter } from "next/router"; // 경로 변경
import { Spin } from "antd";

import { empListRequest } from "../../reducer/emp/empReducer";

export default function EmpList(){

    const dispatch = useDispatch();
    const router = useRouter();

    //목록 정보 가져오기
    const { empList, loading, success, error } = useSelector((state)=> state.emp);

    useEffect(()=>{
        dispatch(empListRequest());
    }, [dispatch]);
    
    ////////////////////////////////////////////
    return (
        <>
            <h2>사원 목록</h2>

            {/* th:if="${loading}" 과 같은 역할 */}
            {loading && <Spin description="Loading">사원 목록 불러오는 중</Spin>}

            {/* th:if="${error}" */}
            {error && <p style={{color: 'red'}}>{error}</p>}

            {/* th:each="emp : ${empList}" */}
            {empList.map((emp)=>(
                <p key={emp.empId}>{emp.empName}</p>
            ))}

            <p>화면 확인용</p>
        </>
    );
}