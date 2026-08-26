// pages/apct/rank.js
// 공고별 fit_score(AI 적합도) 순위 (ROLE_ADMIN) - GET /api/admin/applicant/rank?recId&page&size
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { Card, Table, Select, Button, Tag, Pagination, Empty } from "antd";
import { ArrowLeftOutlined, TrophyFilled } from "@ant-design/icons";

import { fetchApplicantRankRequest } from "../../reducers/apct/applicantReducer";
import { fetchRecruitAdminListRequest } from "../../reducers/rec/recruitReducer";

const MEDAL_COLOR = ["#d4af37", "#a8a8a8", "#b46a35"];

export default function ApplicantRankPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { rankList, rankPaging, rankLoading } = useSelector((state) => state.applicant);
  const { list: recruitOptions } = useSelector((state) => state.recruit);

  const [recId, setRecId] = useState(undefined);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchRecruitAdminListRequest({ onepagelist: 100, pstartno: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.recId) setRecId(Number(router.query.recId));
  }, [router.isReady, router.query.recId]);

  const runSearch = (nextPage = 1) => {
    if (!recId) return;
    setPage(nextPage);
    dispatch(fetchApplicantRankRequest({ recId, page: nextPage - 1, size: 10 }));
  };

  useEffect(() => {
    if (!recId) return;
    runSearch(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recId]);

  const columns = [
    {
      title: "순위",
      key: "rank",
      width: 70,
      align: "center",
      render: (_, __, idx) => {
        const rankNo = (rankPaging?.number || 0) * (rankPaging?.size || 10) + idx + 1;
        return rankNo <= 3 ? (
          <TrophyFilled style={{ color: MEDAL_COLOR[rankNo - 1], fontSize: 18 }} />
        ) : (
          rankNo
        );
      },
    },
    {
      title: "지원자명",
      dataIndex: "apctName",
      key: "apctName",
      render: (v, record) => (
        <Link href={`/apct/detail?apctId=${record.apctId}`}>
          <b style={{ cursor: "pointer" }}>{v}</b>
        </Link>
      ),
    },
    { title: "이메일", dataIndex: "apctEmail", key: "apctEmail", width: 200 },
    {
      title: "AI 적합도 점수",
      dataIndex: "rsmFitScore",
      key: "rsmFitScore",
      width: 140,
      align: "center",
      render: (v) =>
        v != null ? (
          <Tag color={v >= 80 ? "green" : v >= 50 ? "orange" : "default"}>{v}점</Tag>
        ) : (
          <Tag>미분석</Tag>
        ),
    },
    {
      title: "전형 상태",
      dataIndex: "apctStatus",
      key: "apctStatus",
      width: 110,
      align: "center",
    },
  ];

  return (
    <div className="sb-page">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <Link href="/apct/list">
            <Button type="text" className="sb-page-back" icon={<ArrowLeftOutlined />}>
              지원자 목록으로
            </Button>
          </Link>
          <div className="sb-breadcrumb">채용관리 &gt; 지원자 &gt; 적합도 순위</div>
          <h1>AI 적합도(fit_score) 순위</h1>
          <p>이력서 AI 분석 결과를 기준으로 공고별 지원자 순위를 확인합니다.</p>
        </div>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Select
            style={{ width: 300 }}
            placeholder="채용공고 선택"
            showSearch
            optionFilterProp="label"
            value={recId}
            onChange={(v) => setRecId(v)}
            options={(recruitOptions || []).map((r) => ({
              value: r.recId,
              label: r.recTitle,
            }))}
          />
        </div>

        {!recId && <Empty description="순위를 확인할 채용공고를 선택해 주세요." />}

        {recId && (
          <>
            <Table
              rowKey="apctId"
              columns={columns}
              dataSource={rankList}
              loading={rankLoading}
              pagination={false}
              locale={{ emptyText: "분석된 지원자가 없습니다." }}
            />
            {rankPaging && rankPaging.totalElements > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 12,
                }}
              >
                <span style={{ color: "#999", fontSize: 12.5 }}>
                  총 <b>{rankPaging.totalElements}</b>명
                </span>
                <Pagination
                  size="small"
                  current={page}
                  total={rankPaging.totalElements}
                  pageSize={rankPaging.size || 10}
                  showSizeChanger={false}
                  onChange={runSearch}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
