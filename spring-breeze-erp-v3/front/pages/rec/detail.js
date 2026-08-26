// pages/rec/detail.js
// 채용공고 상세 (ROLE_ADMIN) - GET /api/admin/recruit/{recId}
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { Descriptions, Tag, Button, Skeleton, Empty, Space } from "antd";
import {
  ArrowLeftOutlined,
  TeamOutlined,
  FileSearchOutlined,
  TrophyOutlined,
  AppstoreOutlined,
  EditOutlined,
} from "@ant-design/icons";
import moment from "moment";

import { fetchRecruitDetailRequest } from "../../reducers/rec/recruitReducer";

const STATUS_LABEL = {
  OPEN: { text: "모집중", color: "green" },
  CLOSED: { text: "마감", color: "default" },
  CANCELLED: { text: "취소됨", color: "red" },
};

export default function RecruitDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { recId } = router.query;

  const { detail, detailLoading, detailError } = useSelector(
    (state) => state.recruit,
  );

  useEffect(() => {
    if (!router.isReady || !recId) return;
    dispatch(fetchRecruitDetailRequest(Number(recId)));
  }, [router.isReady, recId, dispatch]);

  const statusMeta = detail
    ? STATUS_LABEL[detail.recStatus] || { text: detail.recStatus, color: "default" }
    : null;

  return (
    <main className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/">홈</Link> <i className="bi bi-chevron-right"></i> 채용관리{" "}
            <i className="bi bi-chevron-right"></i>{" "}
            <Link href="/rec/list">채용공고</Link>{" "}
            <i className="bi bi-chevron-right"></i> 상세
          </div>
          <h1>채용공고 상세</h1>
          <p>등록된 채용공고 정보와 지원자 현황을 확인합니다.</p>
        </div>
        <div className="sb-page-head__actions">
          <Link href="/rec/list">
            <Button size="small" icon={<ArrowLeftOutlined />}>목록으로</Button>
          </Link>
          <Link href="/rec/list">
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
                {detail.recTitle}{" "}
                {statusMeta && <Tag color={statusMeta.color}>{statusMeta.text}</Tag>}
              </h2>
            </div>
            <div className="sb-card__body">
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="모집 부서">{detail.recDepartment}</Descriptions.Item>
                <Descriptions.Item label="모집 직무">{detail.recPosition}</Descriptions.Item>
                <Descriptions.Item label="모집 인원">{detail.recHeadcount}명</Descriptions.Item>
                <Descriptions.Item label="고용 형태">{detail.recEmploymentType}</Descriptions.Item>
                <Descriptions.Item label="담당자">{detail.empName || "-"}</Descriptions.Item>
                <Descriptions.Item label="지원자 수">{detail.applicantCnt ?? 0}명</Descriptions.Item>
                <Descriptions.Item label="접수 시작일">
                  {detail.recStartDate ? moment(detail.recStartDate).format("YYYY-MM-DD HH:mm") : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="접수 종료일">
                  {detail.recEndDate ? moment(detail.recEndDate).format("YYYY-MM-DD HH:mm") : "상시채용"}
                </Descriptions.Item>
                <Descriptions.Item label="등록일시">
                  {detail.createdAt ? moment(detail.createdAt).format("YYYY-MM-DD HH:mm") : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="최종 수정일시">
                  {detail.updatedAt ? moment(detail.updatedAt).format("YYYY-MM-DD HH:mm") : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="상세 내용" span={2}>
                  <div style={{ whiteSpace: "pre-wrap" }}>{detail.recDescription || "-"}</div>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>

          <div className="sb-card">
            <div className="sb-card__head">
              <h2>바로가기</h2>
            </div>
            <div className="sb-card__body">
              <Space wrap size={12}>
                <Link href={`/apct/list?recId=${detail.recId}`}>
                  <Button icon={<TeamOutlined />}>지원자 목록</Button>
                </Link>
                <Link href={`/apct/kanban?recId=${detail.recId}`}>
                  <Button icon={<AppstoreOutlined />}>칸반보드</Button>
                </Link>
                <Link href={`/apct/rank?recId=${detail.recId}`}>
                  <Button icon={<TrophyOutlined />}>적합도(fit_score) 순위</Button>
                </Link>
                <Link href={`/apct/resume-search?recId=${detail.recId}`}>
                  <Button icon={<FileSearchOutlined />}>이력서 AI 검색</Button>
                </Link>
              </Space>
            </div>
          </div>
        </>
      )}
    </main>
  );
}