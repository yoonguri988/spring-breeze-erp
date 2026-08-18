// pages/emp/list.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Tag,
  Avatar,
  Pagination,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";

import { listEmpRequest } from "../../reducers/emp/empReducer";
import { listPosRequest } from "../../reducers/pos/posReducer";

// 재직 상태 옵션
const STATUS_OPTIONS = [
  { value: "", label: "전체 상태" },
  { value: "재직", label: "재직" },
  { value: "휴직", label: "휴직" },
  { value: "퇴직", label: "퇴직" },
];
const STATUS_TAG = {
  재직: "green",
  휴직: "orange",
  퇴직: "red",
};

export default function EmpListPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { empList, paging, loading } = useSelector((state) => state.emp);
  const { posList } = useSelector((state) => state.pos);

  // 로그인 사용자 정보 (관리자 여부, 본인 ID)
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  const [filters, setFilters] = useState({
    deptId: "",
    posId: "",
    empStatus: "",
    keyword: "",
    page: 1,
  });

  // 직급 목록 로드 (필터 select용)
  useEffect(() => {
    dispatch(listPosRequest());
  }, [dispatch]);

  // URL 쿼리 → 필터 동기화 → 목록 조회
  useEffect(() => {
    if (!router.isReady) return;
    const {
      deptId = "",
      posId = "",
      empStatus = "",
      keyword = "",
      page = "1",
    } = router.query;
    const next = {
      deptId,
      posId,
      empStatus,
      keyword,
      page: Number(page),
    };
    setFilters(next);
    dispatch(listEmpRequest(next));
  }, [router.isReady, router.query, dispatch]);

  const pushQuery = (next) => {
    router.push({
      pathname: "/emp/list",
      query: { ...router.query, ...next },
    });
  };

  const handleSearch = () => {
    pushQuery({ ...filters, page: 1 });
  };

  const handleReset = () => {
    router.push({ pathname: "/emp/list" });
  };

  const columns = [
    {
      title: "사번",
      dataIndex: "empNo",
      key: "empNo",
      width: 110,
    },
    {
      title: "이름",
      key: "empName",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar size="small">
            {record.empName ? record.empName.charAt(0) : "?"}
          </Avatar>
          <span style={{ fontWeight: 600 }}>{record.empName}</span>
        </div>
      ),
    },
    { title: "부서", dataIndex: "deptName", key: "deptName", width: 120 },
    { title: "직급", dataIndex: "posName", key: "posName", width: 100 },
    {
      title: "이메일",
      dataIndex: "empEmail",
      key: "empEmail",
      ellipsis: true,
    },
    { title: "연락처", dataIndex: "empMobile", key: "empMobile", width: 140 },
    {
      title: "재직상태",
      dataIndex: "empStatus",
      key: "empStatus",
      width: 90,
      render: (status) => (
        <Tag color={STATUS_TAG[status] || "default"}>{status}</Tag>
      ),
    },
    { title: "입사일", dataIndex: "hireDate", key: "hireDate", width: 110 },
    {
      title: "",
      key: "actions",
      width: 80,
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
          {(isAdmin || user?.empId === record.empId) && (
            <Link
              href={{
                pathname: "/emp/detail",
                query: { empId: record.empId },
              }}
            >
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                title="상세보기"
              />
            </Link>
          )}
          {isAdmin && (
            <Link
              href={{
                pathname: "/emp/edit",
                query: { empId: record.empId },
              }}
            >
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                title="수정"
              />
            </Link>
          )}
        </div>
      ),
    },
  ];

  //////
  return (
    <div className="sb-page">
      {/* 페이지 헤더 */}
      <div
        className="sb-page-head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            조직 관리 &gt; 사원관리
          </div>
          <h1>사원관리</h1>
          <p>전체 임직원 정보를 조회하고 관리합니다.</p>
        </div>
        {isAdmin && (
          <div className="sb-page-head__actions">
            <Link href="/emp/add">
              <Button type="primary" icon={<PlusOutlined />}>
                사원 등록
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* 목록 카드 */}
      <Card>
        {/* 검색 툴바 */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <Select
            style={{ width: 160 }}
            value={filters.posId || ""}
            onChange={(v) => setFilters((f) => ({ ...f, posId: v }))}
            options={[
              { value: "", label: "전체 직급" },
              ...posList.map((p) => ({ value: String(p.posId), label: p.posName })),
            ]}
          />
          <Select
            style={{ width: 130 }}
            value={filters.empStatus || ""}
            onChange={(v) => setFilters((f) => ({ ...f, empStatus: v }))}
            options={STATUS_OPTIONS}
          />
          <Input
            style={{ width: 200 }}
            placeholder="이름 또는 사번"
            value={filters.keyword}
            onChange={(e) =>
              setFilters((f) => ({ ...f, keyword: e.target.value }))
            }
            onPressEnter={handleSearch}
          />
          <Button icon={<SearchOutlined />} onClick={handleSearch}>
            검색
          </Button>
          {(filters.keyword || filters.posId || filters.empStatus) && (
            <Button onClick={handleReset}>초기화</Button>
          )}
        </div>

        {/* 테이블 */}
        <Table
          rowKey="empId"
          columns={columns}
          dataSource={empList}
          loading={loading}
          pagination={false}
          locale={{ emptyText: "검색 결과가 없습니다." }}
        />

        {/* 페이지네이션 */}
        {paging && paging.listtotal > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 12,
            }}
          >
            <span style={{ color: "#999", fontSize: 12.5 }}>
              총 <b>{paging.listtotal}</b>명
            </span>
            <Pagination
              size="small"
              current={filters.page}
              total={paging.listtotal}
              pageSize={paging.onepagelist || 10}
              showSizeChanger={false}
              onChange={(p) => pushQuery({ page: p })}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
