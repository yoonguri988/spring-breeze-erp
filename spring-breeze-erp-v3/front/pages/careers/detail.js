// pages/careers/detail.js
// 채용 공개 사이트 - 공고 상세 (GET /api/public/recruit/{recId}, 로그인 필요)
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { Button, Tag, Skeleton, Alert, Space,Descriptions } from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import moment from "moment";

import ApplicantLayout from "../../components/ApplicantLayout";
import { fetchPublicRecruitDetailRequest } from "../../reducers/rec/recruitPublicReducer";

export default function CareersDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { recId } = router.query;
  const { apctAccessToken } = useSelector((state) => state.apctAuth);
  const { detail, detailLoading, detailError } = useSelector(
    (state) => state.recruitPublic,
  );

  useEffect(() => {
    if (!router.isReady || !recId || !apctAccessToken) return;
    dispatch(fetchPublicRecruitDetailRequest(Number(recId)));
  }, [router.isReady, recId, apctAccessToken, dispatch]);

  const isOpen = detail?.recStatus === "OPEN";

  return (
    <ApplicantLayout>
      <Link href="/careers">
        <Button type="text" icon={<ArrowLeftOutlined />} style={{ paddingLeft: 0, marginBottom: 12 }}>
          목록으로
        </Button>
      </Link>

      {detailLoading && <Skeleton active paragraph={{ rows: 8 }} />}

      {!detailLoading && detailError && (
        <Alert type="error" showIcon message="공고를 불러오지 못했습니다" description={detailError} />
      )}

      {!detailLoading && detail && (
        <div style={{ background: "#fff", border: "1px solid #e6ebe8", borderRadius: 12, padding: "28px 30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#14251f", margin: 0 }}>
              {detail.recTitle}
            </h1>
            <Tag color={isOpen ? "green" : "default"}>
              {isOpen ? "모집중" : detail.recStatus === "CLOSED" ? "마감" : "취소됨"}
            </Tag>
          </div>

          <Space size={16} wrap style={{ color: "#667", fontSize: 13.5, marginBottom: 20 }}>
            <span>
              <EnvironmentOutlined /> {detail.recDepartment} · {detail.recPosition}
            </span>
            <span>
              <TeamOutlined /> {detail.recHeadcount}명
            </span>
            <Tag color="blue">{detail.recEmploymentType}</Tag>
            <span>
              <ClockCircleOutlined />{" "}
              {detail.recEndDate
                ? `${moment(detail.recStartDate).format("YYYY-MM-DD")} ~ ${moment(
                    detail.recEndDate,
                  ).format("YYYY-MM-DD")}`
                : `${moment(detail.recStartDate).format("YYYY-MM-DD")} ~ 상시채용`}
            </span>
          </Space>

          <div
            style={{
              borderTop: "1px solid #eef2f0",
              paddingTop: 20,
              whiteSpace: "pre-wrap",
              lineHeight: 1.8,
              color: "#333",
              minHeight: 120,
            }}
          >
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

          <div style={{ marginTop: 28, textAlign: "right" }}>
            {isOpen ? (
              <Link href={`/careers/apply?recId=${detail.recId}`}>
                <Button type="primary" size="large" icon={<SendOutlined />}>
                  이 공고에 지원하기
                </Button>
              </Link>
            ) : (
              <Button size="large" disabled>
                현재 지원할 수 없는 공고입니다
              </Button>
            )}
          </div>
        </div>
      )}
    </ApplicantLayout>
  );
}
