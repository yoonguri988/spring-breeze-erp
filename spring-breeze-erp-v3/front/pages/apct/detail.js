// pages/apct/detail.js
// 지원자 상세 (ROLE_ADMIN) - GET /api/admin/applicant/{apctId} + 이력서 GET /api/resume/applicants/{apctId}?recId=
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import {
  Button,
  Descriptions,
  Tag,
  Select,
  Skeleton,
  Empty,
  message,
} from "antd";
import { ArrowLeftOutlined, FilePdfOutlined,EditOutlined, } from "@ant-design/icons";
import moment from "moment";

import {
  fetchApplicantDetailRequest,
  updateApplicantStatusRequest,
  resetApplicantState,
} from "../../reducers/apct/applicantReducer";
import { fetchAdminResumeRequest } from "../../reducers/rsm/resumeReducer";

// apct/dashboard.js 차트 색상과 맞춰 SCREENING(파랑)·INTERVIEW(주황) 조합을 사용한다 —
// 원래 INTERVIEW를 보라로 뒀더니 색각이상 시뮬레이션에서 파랑과 잘 구분되지 않아 교체함.
const STATUS_LABEL = {
  RECEIVED: { text: "접수", color: "default" },
  SCREENING: { text: "서류심사", color: "blue" },
  INTERVIEW: { text: "면접", color: "orange" },
  HIRED: { text: "합격", color: "green" },
  REJECTED: { text: "불합격", color: "red" },
};
const STATUS_OPTIONS = Object.entries(STATUS_LABEL).map(([value, { text }]) => ({
  value,
  label: text,
}));
const API_ORIGIN = "http://localhost:8080";
export default function ApplicantDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { apctId } = router.query;

  const { detail, detailLoading, detailError, statusLoading, statusSuccess, statusError } =
    useSelector((state) => state.applicant);
  const { adminResume, adminResumeLoading } = useSelector((state) => state.resume);

  useEffect(() => {
    if (!router.isReady || !apctId) return;
    dispatch(fetchApplicantDetailRequest(Number(apctId)));
  }, [router.isReady, apctId, dispatch]);

  useEffect(() => {
    if (!detail?.recId || !apctId) return;
    dispatch(fetchAdminResumeRequest({ apctId: Number(apctId), recId: detail.recId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail?.recId, apctId]);

  useEffect(() => {
    if (statusLoading) return;
    if (statusSuccess) {
      message.success("지원자 상태가 변경되었습니다.");
      dispatch(resetApplicantState());
    } else if (statusError) {
      message.error(statusError);
      dispatch(resetApplicantState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusLoading, statusSuccess, statusError]);

  const handleStatusChange = (newStatus) => {
    dispatch(updateApplicantStatusRequest({ apctId: Number(apctId), newStatus }));
  };

  return (
      <main className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/">홈</Link> <i className="bi bi-chevron-right"></i> 지원자 관리{" "}
            <i className="bi bi-chevron-right"></i>{" "}
            <Link href="/apct/list">지원자</Link>{" "}
            <i className="bi bi-chevron-right"></i> 상세
          </div>
          <h1>지원자 상세</h1>
          <p>지원자 정보를 확인합니다.</p>
        </div>
        <div className="sb-page-head__actions">
          <Link href="/apct/list">
            <Button size="small" icon={<ArrowLeftOutlined />}>목록으로</Button>
          </Link>
          <Link href="/apct/list">
            <Button size="small" className="btn-sb" icon={<EditOutlined />}>목록에서 수정</Button>
          </Link>
        </div>
      </div>
      {detailLoading && (
        <div className="sb-card">
          <div className="sb-card__body">
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        </div>
      )}

      {!detailLoading && detailError && (
        <div className="sb-card">
          <div className="sb-card__body">
            <Empty description={detailError} />
          </div>
        </div>
      )}

      {!detailLoading && detail && (
        <>
          <div className="sb-card mb-3">
            <div className="sb-card__head">
              <h2>
                {detail.apctName}{" "}
                <Tag color={(STATUS_LABEL[detail.apctStatus] || {}).color}>
                  {(STATUS_LABEL[detail.apctStatus] || {}).text || detail.apctStatus}
                </Tag>
              </h2>
              <div className="right">
                <Select
                  style={{ width: 140 }}
                  value={detail.apctStatus}
                  options={STATUS_OPTIONS}
                  loading={statusLoading}
                  onChange={handleStatusChange}
                />
              </div>
            </div>
            <div className="sb-card__body">
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="지원 공고">{detail.recTitle || "-"}</Descriptions.Item>
                <Descriptions.Item label="이메일">{detail.apctEmail}</Descriptions.Item>
                <Descriptions.Item label="연락처">{detail.apctPhone}</Descriptions.Item>
                <Descriptions.Item label="지원일시">
                  {detail.apctDate ? moment(detail.apctDate).format("YYYY-MM-DD HH:mm") : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="등록일시">
                  {detail.createdAt ? moment(detail.createdAt).format("YYYY-MM-DD HH:mm") : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="최종 수정일시">
                  {detail.updatedAt ? moment(detail.updatedAt).format("YYYY-MM-DD HH:mm") : "-"}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>

          <div className="sb-card">
            <div className="sb-card__head">
              <h2>이력서 정보</h2>
            </div>
            <div className="sb-card__body">
              {adminResumeLoading && <Skeleton active paragraph={{ rows: 3 }} />}
              {!adminResumeLoading && !adminResume && (
                <Empty description="제출된 이력서가 없습니다." />
              )}
              {!adminResumeLoading && adminResume && (
                <Descriptions bordered column={2} size="middle">
                  <Descriptions.Item label="파일명" span={2}>
                    {adminResume.rsmFileUrl ? (
                      <a href={`${API_ORIGIN}${adminResume.rsmFileUrl}`} target="_blank" rel="noreferrer">
                        <FilePdfOutlined /> {adminResume.rsmFileName}
                      </a>
                    ) : (
                      adminResume.rsmFileName || "-"
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="분석 상태">
                    <Tag
                      color={
                        adminResume.rsmStatus === "COMPLETED"
                          ? "green"
                          : adminResume.rsmStatus === "FAILED"
                          ? "red"
                          : "orange"
                      }
                    >
                      {adminResume.rsmStatus}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="AI 적합도 점수">
                    {adminResume.rsmFitScore ?? "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="업로드 일시">
                    {adminResume.rsmUploadedAt
                      ? moment(adminResume.rsmUploadedAt).format("YYYY-MM-DD HH:mm")
                      : "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="분석 완료 일시">
                    {adminResume.rsmAnalyzedAt
                      ? moment(adminResume.rsmAnalyzedAt).format("YYYY-MM-DD HH:mm")
                      : "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="AI 요약" span={2}>
                    <div style={{ whiteSpace: "pre-wrap" }}>
                      {adminResume.rsmAiSummary || "-"}
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}