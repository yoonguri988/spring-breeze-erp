// pages/dept/my.js
import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RightOutlined } from "@ant-design/icons";

import { fetchMyDeptRequest, fetchDeptEmpListRequest } from "../../reducers/dept/deptReducer";
import DeptDetailView from "../../components/DeptDetailView";

export default function DeptMyPage() {
  const dispatch = useDispatch();

  const { myDept, deptEmpList } = useSelector((state) => state.dept);

  useEffect(() => {
    dispatch(fetchMyDeptRequest());
  }, [dispatch]);

  const dept = myDept?.dept;
  const ancestorChain = myDept?.ancestorChain || [];

  // dept 가 확정된 이후에만 소속 사원 목록을 조회한다.
  // (GET /api/dept/{deptId}/emp - 하위 부서 포함, 페이징 없이 전체 반환)
  useEffect(() => {
    if (dept?.deptId) {
      dispatch(fetchDeptEmpListRequest(dept.deptId));
    }
  }, [dispatch, dept?.deptId]);

  if (!dept) return null;

  return (
    <div className="sb-content">
      {/* 페이지 헤더 */}
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/">홈</Link> <RightOutlined /> 내 부서
          </div>
          <h1>{dept.deptName}</h1>
          <p>내가 소속된 부서 정보입니다.</p>
        </div>
      </div>

      <DeptDetailView
        dept={dept}
        ancestorChain={ancestorChain}
        deptEmpList={deptEmpList}
      />
    </div>
  );
}