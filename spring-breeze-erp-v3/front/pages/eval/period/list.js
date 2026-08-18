// pages/eval/period/list.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, Row, Col, Table, Tag, Button, Statistic, message } from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";

import {
  listPeriodRequest,
  resetPeriodState,
} from "../../../reducers/eval/evalPeriodReducer";

const STATUS_CONFIG = {
  READY: { color: "orange", label: "준비" },
  OPEN: { color: "green", label: "진행 중" },
  CLOSED: { color: "blue", label: "마감" },
  REPORTING: { color: "purple", label: "분석 중" },
  REPORTED: { color: "cyan", label: "완료" },
  REPORTING_FAILED: { color: "red", label: "분석 실패" },
};

export default function EvalPeriodListPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { periodList, stats, loading, success, error } = useSelector(
    (state) => state.period
  );

  useEffect(() => {
    dispatch(listPeriodRequest());

    return () => { dispatch(resetPeriodState()); };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(resetPeriodState());
      dispatch(listPeriodRequest());
    }
    if (error) {
      message.error(error);
      dispatch(resetPeriodState());
    }
  }, [success, error, dispatch]);

  const columns = [
    {
      title: "상태",
      dataIndex: "periodStatus",
      key: "status",
      width: 100,
      render: (s) => {
        const c = STATUS_CONFIG[s] || { color: "default", label: s };
        return <Tag color={c.color}>{c.label}</Tag>;
      },
    },
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      render: (t, r) => (
        <Link
          href={{
            pathname: "/eval/period/detail",
            query: { periodId: r.periodId },
          }}
        >
          <a style={{ fontWeight: 600 }}>{t}</a>
        </Link>
      ),
    },
    {
      title: "연도",
      dataIndex: "evalYear",
      key: "year",
      width: 80,
      align: "center",
    },
    { title: "구분", dataIndex: "evalTerm", key: "term", width: 100 },
    {
      title: "기간",
      key: "range",
      width: 200,
      render: (_, r) => `${r.startDate} ~ ${r.endDate}`,
    },
    {
      title: "",
      key: "action",
      width: 60,
      render: (_, r) => (
        <Link
          href={{
            pathname: "/eval/period/detail",
            query: { periodId: r.periodId },
          }}
        >
          <Button type="text" size="small" icon={<EyeOutlined />} />
        </Link>
      ),
    },
  ];

  //////
  return (
    <div className="sb-page">
      <div
        className="sb-page-head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">인사평가 &gt; 회차 관리</div>
          <h1>인사평가 회차 관리</h1>
          <p>정기 인사평가 회차를 등록·수정하고, 상태를 관리합니다.</p>
        </div>
        <div className="sb-page-head__actions">
          <Link href="/eval/period/form">
            <Button type="primary" icon={<PlusOutlined />}>
              회차 등록
            </Button>
          </Link>
        </div>
      </div>

      {/* 상태별 통계 */}
      {stats && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <Col xs={12} lg={4} key={key}>
              <Card size="small">
                <Statistic
                  title={cfg.label}
                  value={stats[key] || 0}
                  valueStyle={{ color: undefined }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* 목록 */}
      <Card>
        <Table
          rowKey="periodId"
          columns={columns}
          dataSource={periodList}
          loading={loading}
          pagination={false}
          locale={{ emptyText: "등록된 회차가 없습니다." }}
        />
      </Card>
    </div>
  );
}
