// pages/dept/my.js
import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RightOutlined } from "@ant-design/icons";

import { fetchMyDeptRequest } from "../../reducers/dept/deptReducer";
import { listEmpRequest } from "../../reducers/emp/empReducer";
import DeptDetailView from "../../components/DeptDetailView";

export default function DeptMyPage() {
  const dispatch = useDispatch();

  const { myDept } = useSelector((state) => state.dept);
  const { empList } = useSelector((state) => state.emp);

  useEffect(() => {
    dispatch(fetchMyDeptRequest());
    dispatch(listEmpRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const dept = myDept?.dept;
  const ancestorChain = myDept?.ancestorChain || [];

  const deptEmpList = useMemo(
    () =>
      (empList?.list || []).filter(
        (e) => dept && String(e.deptId) === String(dept.deptId),
      ),
    [empList, dept],
  );

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
