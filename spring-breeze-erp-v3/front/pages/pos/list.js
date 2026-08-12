// pages/pos/list.js
import React, { useState, useEffect } from "react"; // 이벤트 변경 감지, 변수 변경
import { useSelector, useDispatch } from "react-redux"; // 전역상태, 스토어 알림
import { useRouter } from "next/router"; // 경로 변경
import { Spin } from "antd";

import { posListRequest } from "../../reducer/pos/posReducer";

export default function PosList(){

    const dispatch = useDispatch();
    const router = useRouter();
    
    //목록 정보 가져오기
    const { posList, loading, success, error } = useSelector((state)=> state.pos);

    useEffect(()=>{
        dispatch(posListRequest());
    }, [dispatch]);

    ////////////////////////////////////////////
    return (
        <>
            <h2>직급 목록</h2>

            {/* th:if="${loading}" 과 같은 역할 */}
            {loading && <Spin description="Loading">직급 목록 불러오는 중</Spin>}

            {/* th:if="${error}" */}
            {error && <p style={{color: 'red'}}>{error}</p>}

            {/* th:each="pos : ${posList}" */}
            {posList.map((pos)=>(
                <p key={pos.posId}>{pos.posName}</p>
            ))}

            <p>화면 확인용</p>
        </>
    );

}