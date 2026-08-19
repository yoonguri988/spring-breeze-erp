// pages/eval/period/detail.js
import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, Descriptions, Tag, Button, Progress, Space, Modal, message, } from "antd";
import { ArrowLeftOutlined, EditOutlined, PlayCircleOutlined, StopOutlined, RobotOutlined, } from "@ant-design/icons";

import {
  detailPeriodRequest, openPeriodRequest, closePeriodRequest,
  reportPeriodRequest, reportStatusRequest, resetPeriodState,
  clearPeriodDetail,
} from "../../../reducers/eval/evalPeriodReducer";

const STATUS_CONFIG = {
  READY: { color: "orange", label: "준비" },
  OPEN: { color: "green", label: "진행 중" },
  CLOSED: { color: "blue", label: "마감" },
  REPORTING: { color: "purple", label: "분석 중" },
  REPORTED: { color: "cyan", label: "완료" },
  REPORTING_FAILED: { color: "red", label: "분석 실패" },
};

export default function EvalPeriodDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { periodId } = router.query;
  const pollingRef = useRef(null);

  const {
    currentPeriod, evalCount, reportCount,
    reportProgress, loading, success, error,
  } = useSelector((state) => state.period);

  // 데이터 로드
  useEffect(() => {
    if (!periodId) return;
    dispatch(detailPeriodRequest(Number(periodId)));
    
    return () => {
      dispatch(clearPeriodDetail());
      dispatch(resetPeriodState());
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    
  }, [dispatch, periodId]);

  // REPORTING 상태이면 폴링 시작
  useEffect(() => {
    if (currentPeriod?.periodStatus === "REPORTING") {
      pollingRef.current = setInterval(() => {
        dispatch(reportStatusRequest(Number(periodId)));
      }, 3000);
    } else {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [currentPeriod?.periodStatus, dispatch, periodId]);

  // 상태 전환 결과
  useEffect(() => {
    if (success) {
      message.success("상태가 변경되었습니다.");
      dispatch(resetPeriodState());
      dispatch(detailPeriodRequest(Number(periodId)));
    }
    if (error) {
      message.error(error);
      dispatch(resetPeriodState());
    }
  }, [success, error, dispatch, periodId]);

  const handleOpen = () => {
    Modal.confirm({
      title: "회차를 열겠습니까?",
      content: "열면 사원들이 평가를 시작할 수 있습니다.",
      onOk: () => { dispatch(openPeriodRequest(Number(periodId))); },
    });
  };
  const handleClose = () => {
    Modal.confirm({
      title: "회차를 마감하겠습니까?",
      content: "마감 후에는 평가를 수정할 수 없습니다.",
      onOk: () => { dispatch(closePeriodRequest(Number(periodId))); },
    });
  };
  const handleReport = () => {
    Modal.confirm({
      title: "AI 분석을 시작하겠습니까?",
      content: "모든 제출된 평가를 기반으로 AI가 리포트를 생성합니다.",
      onOk: () => { dispatch(reportPeriodRequest(Number(periodId))); },
    });
  };

  const p = currentPeriod;
  const sc = STATUS_CONFIG[p?.periodStatus] || {};

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
          <div className="sb-breadcrumb">
            인사평가 &gt; 회차 관리 &gt; 상세
          </div>
          <h1>{p?.title || "..."}</h1>
          {p && (
            <p>
              {p.evalYear}년 {p.evalTerm}
            </p>
          )}
        </div>
        <div className="sb-page-head__actions">
          <Link href="/eval/period/list">
            <Button icon={<ArrowLeftOutlined />}>목록으로</Button>
          </Link>
        </div>
      </div>

      <Card loading={loading && !p} style={{ marginBottom: 16 }}>
        {p && (
          <Descriptions bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="상태">
              <Tag color={sc.color}>{sc.label}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="기간">
              {p.startDate} ~ {p.endDate}
            </Descriptions.Item>
            <Descriptions.Item label="평가 건수">
              {evalCount}건
            </Descriptions.Item>
            <Descriptions.Item label="리포트 건수">
              {reportCount}건
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      {/* REPORTING 진행률 */}
      {p?.periodStatus === "REPORTING" && reportProgress && (
        <Card title="AI 분석 진행률" style={{ marginBottom: 16 }}>
          <Progress
            percent={
              reportProgress.total > 0
                ? Math.round(
                    (reportProgress.completed / reportProgress.total) * 100
                  )
                : 0
            }
            format={() =>
              `${reportProgress.completed} / ${reportProgress.total}`
            }
          />
        </Card>
      )}

      {/* 상태 전환 버튼 */}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {p?.periodStatus === "READY" && (
          <>
            <Link
              href={{
                pathname: "/eval/period/form",
                query: { periodId },
              }}
            >
              <Button icon={<EditOutlined />}>수정</Button>
            </Link>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleOpen}
            >
              회차 열기
            </Button>
          </>
        )}
        {p?.periodStatus === "OPEN" && (
          <Button icon={<StopOutlined />} danger onClick={handleClose}>
            회차 마감
          </Button>
        )}
        {(p?.periodStatus === "CLOSED" ||
          p?.periodStatus === "REPORTING_FAILED") && (
          <Button
            type="primary"
            icon={<RobotOutlined />}
            onClick={handleReport}
          >
            AI 분석 시작
          </Button>
        )}
        {p?.periodStatus === "REPORTED" && (
          <Link
            href={{
              pathname: "/eval/report/list",
              query: { periodId },
            }}
          >
            <Button type="primary">리포트 보기</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
