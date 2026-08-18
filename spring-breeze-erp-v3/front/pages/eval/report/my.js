// pages/eval/report/my.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { Card, Table, Tag, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";

import { myReportRequest } from "../../../reducers/eval/evalReportReducer";

const GRADE_COLOR = { S: "#eb2f96", A: "#52c41a", B: "#1890ff", C: "#fa8c16", D: "#ff4d4f" };
const SENTIMENT = {
  POSITIVE: { color: "green", label: "긍정적" },
  NEUTRAL: { color: "default", label: "중립적" },
  NEGATIVE: { color: "red", label: "부정적" },
};

export default function MyReportPage() {
  const dispatch = useDispatch();
  const { myReports, loading } = useSelector((state) => state.report);

  useEffect(() => {
    dispatch(myReportRequest());
  }, [dispatch]);

  const columns = [
    {
      title: "평가 회차",
      dataIndex: "periodTitle",
      key: "period",
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
      key: "action",
      width: 60,
      render: (_, r) => (
        <Link href={{ pathname: "/eval/report/detail", query: { reportId: r.reportId } }}>
          <Button type="text" size="small" icon={<EyeOutlined />} />
        </Link>
      ),
    },
  ];

  //////
  return (
    <div className="sb-page">
      <div className="sb-page-head" style={{ marginBottom: 16 }}>
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">인사평가 &gt; 내 리포트</div>
          <h1>내 AI 리포트</h1>
          <p>회차별 내 성과 분석 리포트를 확인합니다.</p>
        </div>
      </div>

      <Card>
        <Table
          rowKey="reportId"
          columns={columns}
          dataSource={myReports}
          loading={loading}
          pagination={false}
          locale={{ emptyText: "생성된 리포트가 없습니다." }}
        />
      </Card>
    </div>
  );
}
