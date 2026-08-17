// pages/proj/task_list.js

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { Table, Segmented, Input, Button, Pagination, Empty } from "antd";
import dayjs from "dayjs";

// SSR 연동
import { END } from "redux-saga";
import { fetchMyTasksRequest } from "../../reducers/task/taskReducer";
import { wrapper } from "../../store/configureStore";

export default function taskList(){
  const dispatch = useDispatch();
  const router = useRouter();
  const { myTasks , myTasksPaging , myTasksTotalCnt, loading } = useSelector((state)=>state.task);

  const { pstartno = 1, taskStatus="" } = router.query;
}

const updateQuery = (patch)=>{
  router.push({
    pathname: router.pathname,
    query:{...router.query, ...patch}
  });
};

const onSearch = (e) =>{
  e.preventDefault();
  updateQuery({pstartno:1})
}

const columns = [
  {
    title:"프로젝트명",
    dataIndex:"proName",
    render: (text, row) => <Link href={`/proj/detail/${row.proId}`}>{text}</Link>,
  },
    {
    title:"태스크명",
    dataIndex:"taskName",
    render: (text, row) => <Link href={`/task/detail/${row.taskId}`}>{text}</Link>,
  },
    {
    title:"설명",
    dataIndex:"taskDesc"
  },
    {
    title:"상태",
    dataIndex:"taskStatus"
  },
    {
    title:"비고",
    
  },
    {
    title:"기간",
     render: (_, row) =>
      `${dayjs(row.taskStartDate).format("YYYY-MM-DD")} ~ ${dayjs(row.taskEndDate).format("YYYY-MM-DD")}`,
  },
    {
    title:"등록일",
    dataIndex:"createdAt",
    render: (v) => dayjs(v).format("YYYY-MM-DD")
  },
];

return (
  <main className="sb-content">
    <div className="sb-page-haed">
      <div className="sb-page-head__txt">
        <h1>내 태스크 목록</h1>
        <p>내가 참여 중인 프로젝트의 태스크 현황을 조회합니다.</p>
      </div>
      <div className="sb-page-head__actions my-3">
      </div>
    </div>
    <div className="sb-card-mb-3">
      <form onSubmit={onSearch} className="sb-search-form">
          <Segmented
            value={taskStatus}
            onChange={(v) => updateQuery({ taskStatus: v, pstartno: 1 })}
            options={[
              { label: "전체", value: "" },
              { label: "TODO", value: "TODO" },
              { label: "DOING", value: "DOING" },
              { label: "DONE", value: "DONE" },
            ]}
          />
      </form>
      <Table 
      rowKey="proId"
                loading={loading}
                columns={columns}
                dataSource={tasks}
                pagination={false}
                locale={{ emptyText: <Empty description="조회된 태스크 없습니다." /> }}
      />
    </div>
  </main>
);
