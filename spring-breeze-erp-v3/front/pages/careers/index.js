// pages/careers/index.js
// 채용 공개 사이트 - 공고 목록 (GET /api/public/recruit, 로그인 필요)
// 회사 구분 없이 전체 공고를 노출한다 (잡코리아 방식) — comId 파라미터 없음
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Empty, Pagination, Spin, Alert, Tag, Input } from "antd";
import { SearchOutlined, EnvironmentOutlined, TeamOutlined, ClockCircleOutlined, BankOutlined } from "@ant-design/icons";
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
  const recTitle = router.query.recTitle || "";

  // 검색창 입력값(엔터/버튼 클릭 전까지는 URL에 반영하지 않음)
  const [keywordInput, setKeywordInput] = useState(recTitle);

  useEffect(() => {
    setKeywordInput(recTitle);
  }, [recTitle]);

  useEffect(() => {
    if (!router.isReady || !apctAccessToken) return;

    dispatch(
      fetchPublicRecruitListRequest({
        pstartno: page,
        recTitle: recTitle || undefined,
      })
    );
  }, [router.isReady, apctAccessToken, page, recTitle, dispatch]);

  const handlePageChange = (nextPage) => {
    router.push({
      pathname: "/careers",
      query: { ...router.query, pstartno: nextPage },
    });
  };

  const handleSearch = (value) => {
    const trimmed = value.trim();
    router.push({
      pathname: "/careers",
      query: trimmed ? { recTitle: trimmed, pstartno: 1 } : { pstartno: 1 },
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

      <Input.Search
        placeholder="공고명을 검색해 보세요"
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        value={keywordInput}
        onChange={(e) => setKeywordInput(e.target.value)}
        onSearch={handleSearch}
        style={{ marginBottom: 20 }}
      />

      {listLoading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
        </div>
      )}

      {!listLoading && listError && (
        <Alert type="error" showIcon message="공고를 불러오지 못했습니다" description={listError} />
      )}

      {!listLoading && !listError && list.length === 0 && (
        <Empty
          description={
            recTitle
              ? `'${recTitle}'에 대한 검색 결과가 없습니다.`
              : "현재 진행 중인 채용공고가 없습니다."
          }
          style={{ padding: "60px 0" }}
        />
      )}

      { !listLoading &&
        list.map((rec) => (
          <Link key={rec.recId} href={{pathname: "/careers/detail", query: { recId: rec.recId },}} passHref>
            <a className="crc-card">
              <div className="crc-title">{rec.recTitle}</div>
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