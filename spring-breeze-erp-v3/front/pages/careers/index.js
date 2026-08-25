// pages/careers/index.js
// 채용 공개 사이트 - 공고 목록 (GET /api/public/recruit, 로그인 필요)
// 회사 구분 없이 전체 공고를 노출한다 (잡코리아 방식) — comId 파라미터 없음
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Empty, Pagination, Spin, Alert, Tag } from "antd";
import { EnvironmentOutlined, TeamOutlined, ClockCircleOutlined, BankOutlined } from "@ant-design/icons";
import Link from "next/link";
import moment from "moment";

import ApplicantLayout from "../../components/ApplicantLayout";
import { fetchPublicRecruitListRequest } from "../../reducers/rec/recruitPublicReducer";

export default function CareersListPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { apctAccessToken } = useSelector((state) => state.apctAuth);
  const { list, paging, listLoading, listError } = useSelector(
    (state) => state.recruitPublic,
  );

  const page = Number(router.query.pstartno) || 1;

  useEffect(() => {
    if (!router.isReady || !apctAccessToken) return;

    dispatch(
      fetchPublicRecruitListRequest({
        pstartno: page,
      })
    );
  }, [router.isReady, apctAccessToken, page, dispatch]);

  const handlePageChange = (nextPage) => {
    router.push({
      pathname: "/careers",
      query: { pstartno: nextPage },
    });
  };

  return (
    <ApplicantLayout>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#14251f", marginBottom: 6 }}>
          채용공고
        </h1>
        <p style={{ color: "#778", fontSize: 14 }}>
          현재 모집 중인 포지션을 확인하고 지원해 보세요.
        </p>
      </div>

      {listLoading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
        </div>
      )}

      {!listLoading && listError && (
        <Alert type="error" showIcon message="공고를 불러오지 못했습니다" description={listError} />
      )}

      {!listLoading && !listError && list.length === 0 && (
        <Empty description="현재 진행 중인 채용공고가 없습니다." style={{ padding: "60px 0" }} />
      )}

      { !listLoading &&
        list.map((rec) => (
          <Link key={rec.recId} href={`/careers/${rec.recId}`} passHref>
            <a className="crc-card">
              <div className="crc-title">{rec.recTitle}</div>
              {/* ★ 추가 - 회사명이 없으면 잡코리아식 통합 목록에서 어느 회사 공고인지 알 수 없음 */}
              <div className="crc-company">
                <BankOutlined /> {rec.comName}
              </div>
              <div className="crc-meta">
                <span>
                  <EnvironmentOutlined /> {rec.recDepartment}
                </span>
                <span>{rec.recPosition}</span>
                <span>
                  <TeamOutlined /> {rec.recHeadcount}명
                </span>
                <Tag color="blue">{rec.recEmploymentType}</Tag>
                <span>
                  <ClockCircleOutlined />{" "}
                  {rec.recEndDate
                    ? `~ ${moment(rec.recEndDate).format("YYYY-MM-DD")} 마감`
                    : "상시채용"}
                </span>
              </div>
            </a>
          </Link>
        ))}

      {paging && paging.listtotal > 0 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <Pagination
            current={paging.current || page}
            total={paging.listtotal}
            pageSize={paging.onepagelist || 10}
            showSizeChanger={false}
            onChange={handlePageChange}
          />
        </div>
      )}
    </ApplicantLayout>
  );
}