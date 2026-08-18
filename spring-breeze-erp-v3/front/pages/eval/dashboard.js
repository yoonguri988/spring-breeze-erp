// pages/eval/dashboard.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, Row, Col, Table, Tag, Button, Progress } from "antd";
import { CalendarOutlined, EditOutlined } from "@ant-design/icons";

import { dashboardEvalRequest, clearEvalDetail, } from "../../reducers/eval/evalReducer";

const STATUS_TAG = {
  DRAFT: { color: "default", label: "임시저장" },
  SUBMITTED: { color: "green", label: "제출완료" },
};

export default function EvalDashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { periodId } = router.query;

  const {
    openPeriods, currentPeriod, targets,
    submittedCount, totalCount, loading,
  } = useSelector((state) => state.eval);

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  useEffect(() => {
    dispatch(dashboardEvalRequest(periodId ? Number(periodId) : null));
    return () => dispatch(clearEvalDetail());
  }, [dispatch, periodId]);

  // 평가 대상 테이블 컬럼
  const columns = [
    {
      title: "사원",
      key: "emp",
      render: (_, r) => (
        <span style={{ fontWeight: 600 }}>{r.targetEmpName}</span>
      ),
    },
    { title: "부서", dataIndex: "targetDeptName", key: "dept" },
    { title: "직급", dataIndex: "targetPosName", key: "pos" },
    {
      title: "상태",
      dataIndex: "evalStatus",
      key: "status",
      width: 100,
      render: (s) => {
        const t = STATUS_TAG[s] || { color: "default", label: s || "미작성" };
        return <Tag color={t.color}>{t.label}</Tag>;
      },
    },
    {
      title: "",
      key: "action",
      width: 80,
      render: (_, r) => (
        <Link
          href={{
            pathname: r.evalId ? "/eval/detail" : "/eval/write",
            query: r.evalId
              ? { evalId: r.evalId }
              : { periodId, targetEmpId: r.targetEmpId },
          }}
        >
          <Button type="link" size="small" icon={<EditOutlined />}>
            {r.evalId ? "보기" : "작성"}
          </Button>
        </Link>
      ),
    },
  ];

  //////
  return (
    <div className="sb-page">
      {/* 페이지 헤더 */}
      <div
        className="sb-page-head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">인사평가 &gt; 평가 작성</div>
          <h1>평가 작성</h1>
          <p>내가 평가해야 할 부서원 목록을 확인하고 평가를 작성합니다.</p>
        </div>
        <div
          className="sb-page-head__actions"
          style={{ display: "flex", gap: 8 }}
        >
          {currentPeriod && (
            <Button onClick={() => {
              dispatch(clearEvalDetail());
              router.push("/eval/dashboard");
            }}>
              회차 변경
            </Button>
          )}
          {isAdmin && (
            <Link href="/eval/period/list">
              <Button icon={<CalendarOutlined />}>회차 관리</Button>
            </Link>
          )}
        </div>
      </div>

      {/* ── 회차 미선택: OPEN 회차 카드 ── */}
      {!currentPeriod && (
        <>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24, color: "#1890ff" }}>ℹ️</span>
              <div>
                <div style={{ fontWeight: 650 }}>평가할 회차를 선택하세요</div>
                <div style={{ color: "#999", fontSize: 13 }}>
                  진행 중(OPEN)인 회차만 표시됩니다.
                </div>
              </div>
            </div>
          </Card>

          {openPeriods.length === 0 ? (
            <Card>
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "#999",
                }}
              >
                <CalendarOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                <p>진행 중인 회차가 없습니다.</p>
              </div>
            </Card>
          ) : (
            <Row gutter={16}>
              {openPeriods.map((p) => (
                <Col xs={24} sm={12} lg={8} key={p.periodId}>
                  <Card
                    hoverable
                    onClick={() =>
                      router.push({
                        pathname: "/eval/dashboard",
                        query: { periodId: p.periodId },
                      })
                    }
                    style={{ marginBottom: 16 }}
                  >
                    <Tag color="green" style={{ marginBottom: 8 }}>
                      OPEN
                    </Tag>
                    <h3 style={{ margin: "4px 0" }}>{p.title}</h3>
                    <div style={{ color: "#999", fontSize: 13 }}>
                      {p.evalYear}년 {p.evalTerm} · {p.startDate} ~ {p.endDate}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      {/* ── 회차 선택됨: 평가 대상 목록 ── */}
      {currentPeriod && (
        <>
          {/* 회차 정보 + 진행률 */}
          <Card style={{ marginBottom: 16 }}>
            <Row align="middle" gutter={24}>
              <Col flex="auto">
                <Tag color="green">OPEN</Tag>
                <span
                  style={{ fontSize: 16, fontWeight: 650, marginLeft: 8 }}
                >
                  {currentPeriod.title}
                </span>
                <div style={{ color: "#999", fontSize: 13, marginTop: 4 }}>
                  {currentPeriod.evalYear}년 {currentPeriod.evalTerm} ·{" "}
                  {currentPeriod.startDate} ~ {currentPeriod.endDate}
                </div>
              </Col>
              <Col>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#999", fontSize: 12 }}>제출 진행률</div>
                  <Progress
                    type="circle"
                    size={64}
                    percent={
                      totalCount > 0
                        ? Math.round((submittedCount / totalCount) * 100)
                        : 0
                    }
                    format={() => `${submittedCount}/${totalCount}`}
                  />
                </div>
              </Col>
            </Row>
          </Card>

          {/* 대상 테이블 */}
          <Card>
            <Table
              rowKey="targetEmpId"
              columns={columns}
              dataSource={targets}
              loading={loading}
              pagination={false}
              locale={{ emptyText: "평가 대상이 없습니다." }}
            />
          </Card>
        </>
      )}
    </div>
  );
}
