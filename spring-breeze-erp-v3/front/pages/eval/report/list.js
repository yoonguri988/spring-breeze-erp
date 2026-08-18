// pages/eval/report/list.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, Table, Tag, Button, Avatar, Input, message, } from "antd";
import { EyeOutlined, ReloadOutlined, CalendarOutlined, } from "@ant-design/icons";

import {
  listReportRequest, generateReportRequest, regenerateReportRequest,
  resetReportState,
} from "../../../reducers/eval/evalReportReducer";

const GRADE_COLOR = { S: "#eb2f96", A: "#52c41a", B: "#1890ff", C: "#fa8c16", D: "#ff4d4f" };
const SENTIMENT = {
  POSITIVE: { color: "green", label: "긍정적" },
  NEUTRAL: { color: "default", label: "중립적" },
  NEGATIVE: { color: "red", label: "부정적" },
};

export default function EvalReportListPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { periodId, keyword, page } = router.query;

  const { reportList, reportPeriod, reportCount, paging, loading, success, error } =
    useSelector((state) => state.report);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  useEffect(() => {
    if (!periodId) return;
    dispatch(listReportRequest({ periodId, keyword, page }));
    
    return () => { dispatch(resetReportState()); };
  }, [dispatch, periodId, keyword, page]);

  useEffect(() => {
    if (success) {
      message.success("처리되었습니다.");
      dispatch(resetReportState());
      dispatch(listReportRequest({ periodId }));
    }
    if (error) { message.error(error); dispatch(resetReportState()); }
  }, [success, error, dispatch, periodId]);

  const columns = [
    {
      title: "사원",
      key: "emp",
      render: (_, r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar size="small">{r.empName?.charAt(0)}</Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>{r.empName}</div>
            <div style={{ fontSize: 12, color: "#999" }}>{r.deptName} · {r.posName}</div>
          </div>
        </div>
      ),
    },
    {
      title: "등급",
      dataIndex: "grade",
      key: "grade",
      width: 70,
      align: "center",
      render: (g) => (
        <span style={{ fontWeight: 700, fontSize: 18, color: GRADE_COLOR[g] }}>{g}</span>
      ),
    },
    {
      title: "종합 점수",
      dataIndex: "overallScore",
      key: "score",
      width: 100,
      align: "center",
      render: (s) => s?.toFixed(2),
    },
    {
      title: "감성",
      dataIndex: "sentimentLabel",
      key: "sentiment",
      width: 80,
      render: (s) => {
        const t = SENTIMENT[s];
        return t ? <Tag color={t.color}>{t.label}</Tag> : "—";
      },
    },
    {
      title: "생성일",
      dataIndex: "generatedAt",
      key: "date",
      width: 160,
    },
    {
      title: "",
      key: "actions",
      width: 100,
      render: (_, r) => (
        <div style={{ display: "flex", gap: 4 }}>
          <Link href={{ pathname: "/eval/report/detail", query: { reportId: r.reportId } }}>
            <Button type="text" size="small" icon={<EyeOutlined />} />
          </Link>
          {isAdmin && (
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined />}
              title="재생성"
              onClick={() =>
                dispatch(regenerateReportRequest({ periodId: Number(periodId), empId: r.empId }))
              }
            />
          )}
        </div>
      ),
    },
  ];

  //////
  return (
    <div className="sb-page">
      <div className="sb-page-head" style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">인사평가 &gt; AI 리포트</div>
          <h1>AI 리포트</h1>
          <p>회차별 사원 성과 요약 리포트를 확인합니다.</p>
        </div>
        <div className="sb-page-head__actions" style={{ display: "flex", gap: 8 }}>
          {periodId && (
            <Link href="/eval/report/list"><Button>회차 변경</Button></Link>
          )}
          {isAdmin && (
            <Link href="/eval/period/list">
              <Button icon={<CalendarOutlined />}>회차 관리</Button>
            </Link>
          )}
        </div>
      </div>

      {/* 회차 미선택 */}
      {!periodId && (
        <Card>
          <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
            <p>리포트를 확인할 회차를 선택하세요.</p>
            <Link href="/eval/period/list">
              <Button type="primary">회차 목록 보기</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* 회차 선택됨 */}
      {periodId && (
        <>
          {reportPeriod && (
            <Card size="small" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <Tag color={reportPeriod.periodStatus === "REPORTED" ? "green" : "default"}>
                    {reportPeriod.periodStatus}
                  </Tag>
                  <span style={{ fontWeight: 650, marginLeft: 8 }}>{reportPeriod.title}</span>
                  <span style={{ color: "#999", marginLeft: 8 }}>{reportCount}건</span>
                </div>
                {isAdmin && (
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => dispatch(generateReportRequest(Number(periodId)))}
                    loading={loading}
                  >
                    전체 재생성
                  </Button>
                )}
              </div>
            </Card>
          )}

          <Card>
            <Table
              rowKey="reportId"
              columns={columns}
              dataSource={reportList}
              loading={loading}
              pagination={paging ? {
                current: paging.current,
                pageSize: paging.onepagelist,
                total: paging.listtotal,
                onChange: (p) => router.push({
                  pathname: "/eval/report/list",
                  query: { ...router.query, page: p },
                }),
              } : false}
              locale={{ emptyText: "리포트가 없습니다." }}
            />
          </Card>
        </>
      )}
    </div>
  );
}
