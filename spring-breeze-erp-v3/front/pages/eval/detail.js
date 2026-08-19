// pages/eval/detail.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, Descriptions, Tag, Button } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";

import { detailEvalRequest, clearEvalDetail, } from "../../reducers/eval/evalReducer";

const STATUS_TAG = {
  DRAFT: { color: "default", label: "임시저장" },
  SUBMITTED: { color: "green", label: "제출완료" },
};
const SCORE_LABELS = {
  scorePerformance: "업무 성과",
  scoreExpertise: "전문성",
  scoreTeamwork: "팀워크",
  scoreAttitude: "근무 태도",
  scoreGrowth: "성장 잠재력",
};

export default function EvalDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { evalId } = router.query;

  const { currentEval, loading } = useSelector((state) => state.eval);

  useEffect(() => {
    if (!evalId) return;
    dispatch(detailEvalRequest(Number(evalId)));

    return () => { dispatch(clearEvalDetail()); }
  }, [dispatch, evalId]);

  const e = currentEval;
  const st = STATUS_TAG[e?.evalStatus] || { color: "default", label: e?.evalStatus };

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
          <div className="sb-breadcrumb">인사평가 &gt; 평가 상세</div>
          <h1>평가 상세</h1>
          {e && <p>대상: {e.targetEmpName}</p>}
        </div>
        <div
          className="sb-page-head__actions"
          style={{ display: "flex", gap: 8 }}
        >
          <Link
            href={{
              pathname: "/eval/dashboard",
              query: { periodId: e?.periodId },
            }}
          >
            <Button icon={<ArrowLeftOutlined />}>목록으로</Button>
          </Link>
          {e?.evalStatus === "DRAFT" && (
            <Link
              href={{
                pathname: "/eval/write",
                query: { evalId: e.evalId, periodId: e.periodId },
              }}
            >
              <Button type="primary" icon={<EditOutlined />}>
                수정
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Card loading={loading && !e}>
        {e && (
          <>
            <Descriptions
              bordered
              column={{ xs: 1, sm: 2 }}
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="평가 대상">
                {e.targetEmpName} ({e.targetDeptName} · {e.targetPosName})
              </Descriptions.Item>
              <Descriptions.Item label="상태">
                <Tag color={st.color}>{st.label}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="평가 유형">
                {e.evalType}
              </Descriptions.Item>
              <Descriptions.Item label="가중 점수">
                {e.weightedScore?.toFixed(2) || "—"}
              </Descriptions.Item>
            </Descriptions>

            {/* 점수 항목 */}
            <Card type="inner" title="점수" style={{ marginBottom: 16 }}>
              <Descriptions column={{ xs: 1, sm: 2, lg: 3 }}>
                {Object.entries(SCORE_LABELS).map(([key, label]) => (
                  <Descriptions.Item key={key} label={label}>
                    <span style={{ fontSize: 18, fontWeight: 600 }}>
                      {e[key] ?? "—"}
                    </span>
                    <span style={{ color: "#999" }}> / 5</span>
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </Card>

            {/* 코멘트 */}
            <Card type="inner" title="코멘트">
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: "#999", fontSize: 12, marginBottom: 4 }}>
                  강점
                </div>
                <div style={{ whiteSpace: "pre-line" }}>
                  {e.strengthComment || "—"}
                </div>
              </div>
              <div>
                <div style={{ color: "#999", fontSize: 12, marginBottom: 4 }}>
                  개선점
                </div>
                <div style={{ whiteSpace: "pre-line" }}>
                  {e.improvementComment || "—"}
                </div>
              </div>
            </Card>
          </>
        )}
      </Card>
    </div>
  );
}
