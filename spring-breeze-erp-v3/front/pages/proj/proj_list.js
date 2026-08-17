// pages/proj/proj_list.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { Table, Segmented, Input, Button, Pagination, Empty } from "antd";
import dayjs from "dayjs";

// SSR 연동
import { END } from "redux-saga";
import { fetchProjRequest } from "../../reducers/proj/projReducer";
import { wrapper } from "../../store/configureStore";

export default function ProjectList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { projects, projectsPaging, loading } = useSelector((state) => state.proj);

  const {
    keyword = "",
    proStatus = "",
    startDate = "",
    endDate = "",
    pstartno = 1,
  } = router.query;

  const [keywordInput, setKeywordInput] = useState(keyword);
  const [dateRange, setDateRange] = useState({ startDate, endDate });

  const updateQuery = (patch) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, ...patch },
    });
  };

  const onSearch = (e) => {
    e.preventDefault();
    updateQuery({
      keyword: keywordInput,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      pstartno: 1,
    });
  };

  const columns = [
    {
      title: "프로젝트명",
      dataIndex: "proName",
      render: (text, row) => <Link href={`/proj/detail/${row.proId}`}>{text}</Link>,
    },
    { title: "설명", dataIndex: "proDesc" },
    { title: "생성자", dataIndex: "empName" },
    {
      title: "참여인원",
      render: (_, row) => (
        <Link href={`/proj/member/${row.proId}`}>{row.memberCnt}명</Link>
      ),
    },
    {
      title: "기간",
      render: (_, row) =>
        `${dayjs(row.startDate).format("YYYY-MM-DD")} ~ ${dayjs(row.endDate).format("YYYY-MM-DD")}`,
    },
    {
      title: "등록일",
      dataIndex: "createdAt",
      render: (v) => dayjs(v).format("YYYY-MM-DD"),
    },
  ];

  return (
    <main className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <h1>프로젝트 목록</h1>
          <p>전체 프로젝트 현황을 조회하고 관리합니다.</p>
        </div>
        <div className="sb-page-head__actions my-3">
          <Button type="primary" onClick={() => router.push("/proj/create")}>
            프로젝트 생성
          </Button>
        </div>
      </div>

      <div className="sb-card mb-3">
        <form onSubmit={onSearch} className="sb-search-form">
          <Input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="프로젝트명 검색"
          />

          <Segmented
            value={proStatus}
            onChange={(v) => updateQuery({ proStatus: v, pstartno: 1 })}
            options={[
              { label: "전체", value: "" },
              { label: "TODO", value: "TODO" },
              { label: "DOING", value: "DOING" },
              { label: "DONE", value: "DONE" },
            ]}
          />

          <Input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange((p) => ({ ...p, startDate: e.target.value }))}
          />
          <span className="text-faint">~</span>
          <Input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange((p) => ({ ...p, endDate: e.target.value }))}
          />

          <Button htmlType="submit">조회</Button>
        </form>

        <Table
          rowKey="proId"
          loading={loading}
          columns={columns}
          dataSource={projects}
          pagination={false}
          locale={{ emptyText: <Empty description="조회된 프로젝트가 없습니다." /> }}
        />

        {projectsPaging && (
          <div className="d-flex justify-content-center py-3">
            <Pagination
              current={projectsPaging.current}
              total={projectsPaging.pagetotal * 10}
              onChange={(page) => updateQuery({ pstartno: page })}
            />
          </div>
        )}
      </div>
    </main>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { keyword, proStatus, startDate, endDate, pstartno } = ctx.query;

    // 1. 쿠키를 담아 목록 조회 사가 액션 디스패치
    store.dispatch(
      fetchProjRequest({
        keyword,
        proStatus,
        startDate,
        endDate,
        pstartno,
        cookie: ctx.req.headers.cookie || "",
      })
    );

    // 2. 사가 작업이 끝날 때까지 서버에서 대기
    store.dispatch(END);
    await store.sagaTask.toPromise();

    return { props: {} };
  }
);