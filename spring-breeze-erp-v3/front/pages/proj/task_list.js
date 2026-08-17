// pages/proj/task_list.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import {
  Card,
  Table,
  Segmented,
  Button,
  Pagination,
  Empty,
  Space,
  Tag,
} from "antd";

import {
  FilePdfOutlined,
  UnorderedListOutlined,
  LockOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";

import { fetchMyTasksRequest } from "../../reducers/task/taskReducer";

const STATUS_OPTIONS = [
  { label: "전체", value: "" },
  { label: "TODO", value: "TODO" },
  { label: "DOING", value: "DOING" },
  { label: "DONE", value: "DONE" },
];

const STATUS_TAG_COLOR = {
  TODO: "default",
  DOING: "processing",
  DONE: "success",
};

export default function TaskListPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    myTasks = [],
    myTasksPaging,
    myTasksTotalCnt = 0,
    loading,
    error,
  } = useSelector((state) => state.task);

  const [taskStatus, setTaskStatus] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const status = Array.isArray(router.query.taskStatus)
      ? router.query.taskStatus[0]
      : router.query.taskStatus || "";

    const pstartno = Number(router.query.pstartno) || 1;
    const onepagelist = Number(router.query.onepagelist) || 10;

    setTaskStatus(status);

    dispatch(
      fetchMyTasksRequest({
        taskStatus: status,
        pstartno,
        onepagelist,
      })
    );
  }, [router.isReady, router.query, dispatch]);

  const updateQuery = (next) => {
    router.push({
      pathname: "/proj/task_list",
      query: {
        ...router.query,
        ...next,
      },
    });
  };

  const handleStatusChange = (value) => {
    setTaskStatus(value);

    updateQuery({
      taskStatus: value,
      pstartno: 1,
    });
  };

  const handlePageChange = (page) => {
    updateQuery({
      pstartno: page,
    });
  };

  const handlePageSizeChange = (current, size) => {
    updateQuery({
      pstartno: 1,
      onepagelist: size,
    });
  };

  const handleWeeklyReport = async () => {
    if (reportLoading) return;

    try {
      setReportLoading(true);

      const checkResponse = await fetch("/report/my-weekly-report/check");
      const canCreate = await checkResponse.json();

      if (!canCreate) {
        alert("이번 주 완료된 태스크가 없어 보고서를 생성할 수 없습니다.");
        return;
      }

      const response = await fetch("/report/my-weekly-report");

      if (!response.ok) {
        throw new Error("보고서 생성 실패");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "MyWeeklyReport.pdf";
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      alert("보고서 생성 중 오류가 발생했습니다.");
    } finally {
      setReportLoading(false);
    }
  };

  const columns = [
    {
      title: "프로젝트명",
      dataIndex: "proName",
      key: "proName",
      render: (name) => name || "-",
    },

    {
      title: "태스크명",
      dataIndex: "taskName",
      key: "taskName",
      render: (name, record) => (
        <Link
          href={{
            pathname: "/proj/task_detail",
            query: {
              task_id: record.taskId,
            },
          }}
        >
          <span
            className="sb-table__name"
            style={{ cursor: "pointer" }}
          >
            {name}
          </span>
        </Link>
      ),
    },

    {
      title: "설명",
      dataIndex: "taskDesc",
      key: "taskDesc",
      ellipsis: true,
      render: (desc) => (
        <span className="sb-table__muted">
          {desc || "-"}
        </span>
      ),
    },

    {
      title: "상태",
      dataIndex: "taskStatus",
      key: "taskStatus",
      width: 100,
      align: "center",
      render: (status) => (
        <Tag color={STATUS_TAG_COLOR[status] || "default"}>
          {status || "-"}
        </Tag>
      ),
    },

    {
      title: "비고",
      key: "remark",
      width: 110,
      align: "center",
      render: (_, record) => {
        const isWaiting =
          record.parentTaskId != null &&
          record.parentTaskStatus !== "DONE";

        const isDelayed =
          record.delayed &&
          (record.parentTaskId == null ||
            record.parentTaskStatus === "DONE");

        if (isWaiting) {
          return (
            <Tag icon={<LockOutlined />}>
              대기중
            </Tag>
          );
        }

        if (isDelayed) {
          return (
            <Tag
              icon={<WarningOutlined />}
              color="error"
            >
              지연
            </Tag>
          );
        }

        return "-";
      },
    },

    {
      title: "기간",
      key: "period",
      width: 220,
      render: (_, record) => (
        <span className="sb-hr-cell tnum">
          {record.taskStartDate
            ? dayjs(record.taskStartDate).format("YYYY-MM-DD")
            : "-"}
          {" ~ "}
          {record.taskEndDate
            ? dayjs(record.taskEndDate).format("YYYY-MM-DD")
            : "-"}
        </span>
      ),
    },

    {
      title: "등록일",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (value) =>
        value
          ? dayjs(value).format("YYYY-MM-DD")
          : "-",
    },
  ];

  const totalCnt =
  myTasksTotalCnt ||
  myTasksPaging?.listtotal ||
  myTasks.length;

  const currentPage =
    Number(myTasksPaging?.current) ||
    Number(router.query.pstartno) ||
    1;

  const pageSize =
    Number(router.query.onepagelist) || 10;

  return (
    <main className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            홈 <i className="bi bi-chevron-right"></i> 업무{" "}
            <i className="bi bi-chevron-right"></i> 내 태스크
          </div>

          <h1>내 태스크 목록</h1>

          <p>
            내가 참여 중인 프로젝트의 태스크 현황을 조회합니다.
          </p>
        </div>
      </div>

      <div className="sb-card mb-3">
        <div
          className="sb-toolbar"
          style={{
            flexDirection: "column",
            alignItems: "stretch",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <strong style={{ fontSize: 14 }}>
              태스크 목록
            </strong>

            <span className="sb-badge sb-badge--gray ms-2">
              {totalCnt}건
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Segmented
              value={taskStatus}
              onChange={handleStatusChange}
              options={STATUS_OPTIONS}
            />

            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {reportLoading && (
                <span>
                  <span className="spinner-border spinner-border-sm text-primary me-1"></span>
                  생성 중...
                </span>
              )}

              <Button
                type="primary"
                size="small"
                icon={<FilePdfOutlined />}
                loading={reportLoading}
                onClick={handleWeeklyReport}
              >
                내 주간보고서
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              color: "#ff4d4f",
              padding: "12px 16px",
            }}
          >
            {error}
          </div>
        )}

        <div className="sb-card__body--flush">
          <Table
            rowKey="taskId"
            columns={columns}
            dataSource={myTasks}
            loading={loading}
            pagination={false}
            locale={{
              emptyText: (
                <Empty
                  image={
                    <UnorderedListOutlined
                      style={{ fontSize: 32 }}
                    />
                  }
                  description="조회된 태스크가 없습니다."
                />
              ),
            }}
          />
        </div>

        {totalCnt > 0 && (
          <div
            className="d-flex justify-content-center py-3"
            style={{
              borderTop: "1px solid var(--sb-border)",
            }}
          >
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalCnt}
              showSizeChanger
              pageSizeOptions={[
                "10",
                "20",
                "30",
                "50",
              ]}
              onChange={handlePageChange}
              onShowSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>
    </main>
  );
}