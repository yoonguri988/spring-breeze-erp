// pages/dept/detail.js
import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons";

import { fetchDeptDetailRequest } from "../../reducers/dept/deptReducer";
import { listEmpRequest } from "../../reducers/emp/empReducer";
import DeptDetailView from "../../components/DeptDetailView";

export default function DeptDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { detail } = useSelector((state) => state.dept);
  const { empList } = useSelector((state) => state.emp);
  const { user } = useSelector((state) => state.auth);

  const deptId = router.query.deptId ? String(router.query.deptId) : "";

  useEffect(() => {
    if (!router.isReady || !deptId) return;
    dispatch(fetchDeptDetailRequest(deptId));
    dispatch(listEmpRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.isReady, deptId]);

  const dept = detail?.dept;
  const ancestorChain = detail?.ancestorChain || [];
  const isMyDept = !!(
    dept &&
    user?.deptId &&
    String(user.deptId) === String(dept.deptId)
  );

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
            <Link href="/">홈</Link> <RightOutlined />{" "}
            <Link
              href={{
                pathname: "/dept/detail",
                query: { deptId: dept.deptId },
              }}
            >
              부서 상세 현황
            </Link>{" "}
            <RightOutlined /> {dept.deptName}
          </div>
          <h1>{dept.deptName}</h1>
          <p>{dept.deptCode}</p>
        </div>
        <div className="sb-page-head__actions">
          <Link
            href={{
              pathname: "/dept/list",
              query: dept.comId ? { comId: dept.comId } : {},
            }}
          >
            <Button icon={<ArrowLeftOutlined />} size="small">
              목록으로
            </Button>
          </Link>
        </div>
      </div>

      <DeptDetailView
        dept={dept}
        ancestorChain={ancestorChain}
        deptEmpList={deptEmpList}
        isMyDept={isMyDept}
      />
    </div>
  );
}
