// pages/apct/resume-search.js
// 이력서 AI(RAG) 검색 (ROLE_ADMIN, 공고 담당자) - GET /api/resume/search?recId&query&topK
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { Select, Input, Button, Empty, List, Tag, Progress, Skeleton } from "antd";
import { ArrowLeftOutlined, SearchOutlined, RobotOutlined, FolderOpenOutlined } from "@ant-design/icons";

import { searchResumeRequest, resetResumeSearch } from "../../reducers/rsm/resumeReducer";
import { fetchRecruitAdminListRequest } from "../../reducers/rec/recruitReducer";

export default function ResumeSearchPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { searchResults, searchLoading, searchError, searchDone } = useSelector(
    (state) => state.resume,
  );
  const { list: recruitOptions } = useSelector((state) => state.recruit);

  const [recId, setRecId] = useState(undefined);
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(5);

  useEffect(() => {
    dispatch(fetchRecruitAdminListRequest({ onepagelist: 100, pstartno: 1 }));
    return () => dispatch(resetResumeSearch());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.recId) setRecId(Number(router.query.recId));
  }, [router.isReady, router.query.recId]);

  const runSearch = () => {
    if (!recId || !query.trim()) return;
    dispatch(searchResumeRequest({ recId, query: query.trim(), topK }));
  };

  return (
    <main className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <Link href="/rec/list">
            <Button type="text" className="sb-page-back" icon={<ArrowLeftOutlined />}>
              채용공고 목록으로
            </Button>
          </Link>
          <div className="sb-breadcrumb">
            홈 <i className="bi bi-chevron-right"></i> 채용관리{" "}
            <i className="bi bi-chevron-right"></i> 이력서 AI 검색
          </div>
          <h1>
            <RobotOutlined /> 이력서 AI 검색
          </h1>
          <p>공고에 제출된 이력서를 의미 기반(RAG)으로 검색합니다. 예: &quot;Spring Batch 대용량 처리 경험&quot;</p>
        </div>
      </div>

      <div className="sb-card mb-3">
        <div className="sb-toolbar" style={{ flexWrap: "wrap" }}>
          <Select
            style={{ width: 260 }}
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
          <Input
            style={{ flex: 1, minWidth: 260 }}
            placeholder="찾고 싶은 역량/경험을 자연어로 입력하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onPressEnter={runSearch}
          />
          <Select
            style={{ width: 110 }}
            value={topK}
            onChange={(v) => setTopK(v)}
            options={[3, 5, 10, 20].map((n) => ({ value: n, label: `상위 ${n}건` }))}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={runSearch} loading={searchLoading}>
            검색
          </Button>
        </div>
      </div>

      <div className="sb-card">
        <div className="sb-card__body--flush" style={{ padding: recId ? 0 : "60px 0" }}>
          {!recId && (
            <Empty
              image={<FolderOpenOutlined style={{ fontSize: 32 }} />}
              description="검색할 채용공고를 먼저 선택해 주세요."
            />
          )}
          {recId && searchLoading && (
            <div style={{ padding: "20px 16px" }}>
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          )}
          {recId && !searchLoading && searchError && (
            <div style={{ padding: "60px 0" }}>
              <Empty description={searchError} />
            </div>
          )}
          {recId && !searchLoading && !searchError && searchDone && searchResults.length === 0 && (
            <div style={{ padding: "60px 0" }}>
              <Empty description="검색 결과가 없습니다. 다른 표현으로 다시 검색해 보세요." />
            </div>
          )}
          {recId && !searchLoading && searchResults.length > 0 && (
            <List
              itemLayout="vertical"
              dataSource={searchResults}
              style={{ padding: "8px 16px" }}
              renderItem={(item) => (
                <List.Item
                  key={`${item.apctId}-${item.rsmId}`}
                  actions={[
                    <Link key="detail" href={`/apct/detail?apctId=${item.apctId}`}>
                      지원자 상세 보기
                    </Link>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <span>
                        <span className="sb-table__name">{item.apctName}</span>{" "}
                        <Tag color="blue">유사도 {(item.similarity * 100).toFixed(1)}%</Tag>
                      </span>
                    }
                    description={
                      <Progress
                        percent={Math.round(item.similarity * 100)}
                        size="small"
                        showInfo={false}
                        strokeColor="#047857"
                      />
                    }
                  />
                  <div
                    style={{
                      background: "#f7f9f8",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: 13.5,
                      lineHeight: 1.7,
                      color: "#333",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {item.chunkText}
                  </div>
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
    </main>
  );
}