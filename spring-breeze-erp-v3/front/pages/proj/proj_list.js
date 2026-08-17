// pages/proj/proj_list.js

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import {
  Card,
  Table,
  Input,
  DatePicker,
  Segmented,
  Button,
  Pagination,
  Empty,
  Space,
  Tag,
} from "antd";

import {
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";

import { fetchProjRequest } from "../../reducers/proj/projReducer";

const { RangePicker } = DatePicker;

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

export default function ProjListPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    projects = [],
    projectsPaging,
    loading,
    error,
  } = useSelector((state) => state.proj);

  const [keyword, setKeyword] = useState("");
  const [proStatus, setProStatus] = useState("");
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;

    const keyword = Array.isArray(router.query.keyword)
      ? router.query.keyword[0]
      : router.query.keyword || "";

    const proStatus = Array.isArray(router.query.proStatus)
      ? router.query.proStatus[0]
      : router.query.proStatus || "";

    const startDate = Array.isArray(router.query.startDate)
      ? router.query.startDate[0]
      : router.query.startDate || "";

    const endDate = Array.isArray(router.query.endDate)
      ? router.query.endDate[0]
      : router.query.endDate || "";

    const pstartno = Number(router.query.pstartno) || 1;
    const onepagelist = Number(router.query.onepagelist) || 10;

    setKeyword(keyword);
    setProStatus(proStatus);

    if (startDate && endDate) {
      setDateRange([
        dayjs(startDate),
        dayjs(endDate),
      ]);
    } else {
      setDateRange(null);
    }

    dispatch(
      fetchProjRequest({
        keyword,
        proStatus,
        startDate,
        endDate,
        pstartno,
        onepagelist,
      })
    );
  }, [router.isReady, router.query, dispatch]);

  const updateQuery = (next) => {
    router.push({
      pathname: "/proj/proj_list",
      query: {
        ...router.query,
        ...next,
      },
    });
  };

  const handleSearch = (value) => {
    setKeyword(value);

    updateQuery({
      keyword: value,
      pstartno: 1,
    });
  };

  const handleStatusChange = (value) => {
    setProStatus(value);

    updateQuery({
      proStatus: value,
      pstartno: 1,
    });
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);

    if (!dates || dates.length !== 2) {
      updateQuery({
        startDate: "",
        endDate: "",
        pstartno: 1,
      });
      return;
    }

    updateQuery({
      startDate: dates[0].format("YYYY-MM-DD"),
      endDate: dates[1].format("YYYY-MM-DD"),
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

  const columns = [
    {
      title: "프로젝트명",
      dataIndex: "proName",
      key: "proName",
      render: (name, record) => (
        <Link
          href={{
            pathname: "/proj/proj_detail",
            query: {
              proId: record.proId,
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
      dataIndex: "proDesc",
      key: "proDesc",
      ellipsis: true,
      render: (desc) => (
        <span className="sb-table__muted">
          {desc || "-"}
        </span>
      ),
    },

    {
      title: "생성자",
      dataIndex: "empName",
      key: "empName",
      width: 100,
      align: "center",
      render: (name) => name || "-",
    },

    {
      title: "참여인원",
      key: "memberCnt",
      width: 110,
      align: "center",
      render: (_, record) => (
        <Link
          href={{
            pathname: "/proj/proj_member",
            query: {
              proId: record.proId,
            },
          }}
        >
          <Button
            type="text"
            size="small"
            icon={<TeamOutlined />}
          >
            {record.memberCnt ?? 0}명
          </Button>
        </Link>
      ),
    },

    {
      title: "상태",
      dataIndex: "proStatus",
      key: "proStatus",
      width: 100,
      align: "center",
      render: (status) => (
        <Tag
          color={
            STATUS_TAG_COLOR[status] || "default"
          }
        >
          {status || "-"}
        </Tag>
      ),
    },

    {
      title: "기간",
      key: "period",
      width: 220,
      render: (_, record) => (
        <span className="sb-hr-cell tnum">
          {record.startDate
            ? dayjs(record.startDate).format("YYYY-MM-DD")
            : "-"}
          {" ~ "}
          {record.endDate
            ? dayjs(record.endDate).format("YYYY-MM-DD")
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
    projectsPaging?.listtotal ?? 0;

  const currentPage =
    Number(projectsPaging?.current) ||
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
            <i className="bi bi-chevron-right"></i> 프로젝트
          </div>

          <h1>프로젝트 목록</h1>

          <p>
            전체 프로젝트 현황을 조회하고 관리합니다.
          </p>
        </div>

        <div className="sb-page-head__actions my-3">
          <Link href="/proj/proj_create">
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
            >
              프로젝트 생성
            </Button>
          </Link>
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
              프로젝트 목록
            </strong>

            <span className="sb-badge sb-badge--gray ms-2">
              {totalCnt}건
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Input.Search
              style={{ width: 280 }}
              value={keyword}
              onChange={(e) =>
                setKeyword(e.target.value)
              }
              onSearch={handleSearch}
              placeholder="프로젝트명 검색"
              allowClear
              enterButton={<SearchOutlined />}
            />

            <Segmented
              value={proStatus}
              onChange={handleStatusChange}
              options={STATUS_OPTIONS}
            />

            <RangePicker
              value={dateRange}
              onChange={handleDateChange}
              format="YYYY-MM-DD"
            />

            <Button
              icon={<SearchOutlined />}
              onClick={() =>
                handleSearch(keyword)
              }
            >
              조회
            </Button>
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
            rowKey="proId"
            columns={columns}
            dataSource={projects}
            loading={loading}
            pagination={false}
            locale={{
              emptyText: (
                <Empty
                  image={
                    <FolderOpenOutlined
                      style={{ fontSize: 32 }}
                    />
                  }
                  description="조회된 프로젝트가 없습니다."
                />
              ),
            }}
          />
        </div>

        {totalCnt > 0 && (
          <div
            className="d-flex justify-content-center py-3"
            style={{
              borderTop:
                "1px solid var(--sb-border)",
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