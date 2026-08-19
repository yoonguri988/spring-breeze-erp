// pages/eval/report/detail.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, Descriptions, Tag, Button, Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { detailReportRequest, clearReportDetail, } from "../../../reducers/eval/evalReportReducer";

const GRADE_COLOR = { S: "#eb2f96", A: "#52c41a", B: "#1890ff", C: "#fa8c16", D: "#ff4d4f" };
const SENTIMENT = {
  POSITIVE: { color: "green", label: "긍정적" },
  NEUTRAL: { color: "default", label: "중립적" },
  NEGATIVE: { color: "red", label: "부정적" },
};

export default function EvalReportDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { reportId } = router.query;

  const { currentReport, loading } = useSelector((state) => state.report);

  useEffect(() => {
    if (!reportId) return;
    dispatch(detailReportRequest(Number(reportId)));
    
    return () => { dispatch(clearReportDetail()); };
  }, [dispatch, reportId]);

  const r = currentReport;
  const sent = SENTIMENT[r?.sentimentLabel];

  //////
  return (
    <div className="sb-page">
      <div className="sb-page-head" style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">인사평가 &gt; AI 리포트 &gt; 상세</div>
          <h1>AI 리포트 상세</h1>
          {r && <p>{r.empName} — {r.periodTitle}</p>}
        </div>
        <div className="sb-page-head__actions">
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
            돌아가기
          </Button>
        </div>
      </div>

      <Card loading={loading && !r}>
        {r && (
          <>
            <Row gutter={24} style={{ marginBottom: 24 }}>
              <Col span={6} style={{ textAlign: "center" }}>
                <div style={{ color: "#999", marginBottom: 8 }}>종합 등급</div>
                <div style={{ fontSize: 48, fontWeight: 700, color: GRADE_COLOR[r.grade] }}>
                  {r.grade}
                </div>
              </Col>
              <Col span={6} style={{ textAlign: "center" }}>
                <div style={{ color: "#999", marginBottom: 8 }}>종합 점수</div>
                <div style={{ fontSize: 28, fontWeight: 600 }}>
                  {r.overallScore?.toFixed(2)}
                </div>
              </Col>
              <Col span={6} style={{ textAlign: "center" }}>
                <div style={{ color: "#999", marginBottom: 8 }}>감성 라벨</div>
                {sent ? (
                  <Tag color={sent.color} style={{ fontSize: 14, padding: "4px 12px" }}>
                    {sent.label}
                  </Tag>
                ) : (
                  <span style={{ color: "#999" }}>—</span>
                )}
              </Col>
              <Col span={6} style={{ textAlign: "center" }}>
                <div style={{ color: "#999", marginBottom: 8 }}>모델</div>
                <Tag>{r.modelName || "—"}</Tag>
              </Col>
            </Row>

            <Descriptions bordered column={{ xs: 1, sm: 2 }} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="사원">{r.empName}</Descriptions.Item>
              <Descriptions.Item label="부서 · 직급">{r.deptName} · {r.posName}</Descriptions.Item>
              <Descriptions.Item label="평가 회차">{r.periodTitle}</Descriptions.Item>
              <Descriptions.Item label="생성일">{r.generatedAt}</Descriptions.Item>
            </Descriptions>

            <Card type="inner" title="AI 요약" style={{ marginBottom: 16 }}>
              <div style={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
                {r.aiSummary || "요약문이 아직 생성되지 않았습니다."}
              </div>
            </Card>

            {r.aiStrength && (
              <Card type="inner" title="강점 분석" style={{ marginBottom: 16 }}>
                <div style={{ whiteSpace: "pre-line" }}>{r.aiStrength}</div>
              </Card>
            )}

            {r.aiImprovement && (
              <Card type="inner" title="개선 제언">
                <div style={{ whiteSpace: "pre-line" }}>{r.aiImprovement}</div>
              </Card>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
