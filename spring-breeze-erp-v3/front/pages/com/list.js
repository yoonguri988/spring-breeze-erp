// pages/com/list.js
import React, { useEffect, useMemo, useState } from "react"; // 이벤트변경감지 , useState (변수변경)
import { useSelector, useDispatch } from "react-redux"; // 전역상태, 스토어알림
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Row,
  Col,
  Card,
  Table,
  AutoComplete,
  Select,
  Button,
  Pagination,
  Modal,
  Form,
  Input,
  Tag,
  Avatar,
  message,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  ApartmentOutlined,
  DeleteOutlined,
  BankOutlined,
  TeamOutlined,
  AppstoreOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import {
  fetchCompanyListRequest,
  fetchCompanyStatsRequest,
  suggestCompanyRequest,
  clearSuggestList,
  deleteCompanyRequest,
  resetCompanyState,
} from "../../reducers/com/companyReducer";

import StatTile from "../../components/StatTile";
// 업종 대분류 코드 <-> 라벨 (com-list 화면 전용, 원본 list.html 기준)
const INDUSTRY_GRP_OPTIONS = [
  { value: "", label: "전체 업종" },
  { value: "C", label: "제조업" },
  { value: "F", label: "건설업" },
  { value: "G", label: "도매 및 소매업" },
  { value: "H", label: "운수 및 창고업" },
  { value: "I", label: "숙박 및 음식점업" },
  { value: "J", label: "정보통신업" },
  { value: "K", label: "금융 및 보험업" },
  { value: "M", label: "전문, 과학 및 기술 서비스업" },
];
const INDUSTRY_GRP_MAP = INDUSTRY_GRP_OPTIONS.reduce((acc, cur) => {
  if (cur.value) acc[cur.value] = cur.label;
  return acc;
}, {});

export default function ComListPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const {
    list,
    listTotal,
    stats,
    suggestList,
    paging,
    loading,
    error,
    success,
    message: companyMessage,
  } = useSelector((state) => state.company);

  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState({
    keyword: "",
    industryGrpCode: "",
    pstartno: 1,
    onepagelist: 10,
  });

  // 삭제 모달 (companyReducer 에는 모달 상태가 없으므로 페이지 로컬 상태로 관리)
  const [deleteTarget, setDeleteTarget] = useState(null); // { comId, comName }
  const [deleting, setDeleting] = useState(false); // 삭제 요청 진행중 플래그
  const [deleteError, setDeleteError] = useState("");

  // 통계는 최초 1회만 조회
  useEffect(() => {
    dispatch(fetchCompanyStatsRequest());
  }, [dispatch]);

  // URL 쿼리 -> 목록 조회 (검색조건이 바뀔 때마다 재조회)
  useEffect(() => {
    if (!router.isReady) return;
    const {
      keyword: kw = "",
      industryGrpCode = "",
      pstartno = "1",
      onepagelist = "10",
    } = router.query;
    const next = {
      keyword: kw,
      industryGrpCode,
      pstartno: Number(pstartno),
      onepagelist: Number(onepagelist),
    };
    setKeyword(kw);
    setFilters(next);
    dispatch(fetchCompanyListRequest(next));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query]);

  // 삭제 요청 결과 처리 (deleting 플래그로 "지금 삭제 액션에 대한 loading/success/error인지" 구분)
  useEffect(() => {
    if (!deleting || loading) return;

    if (success) {
      antdMessage.success(companyMessage || "회사가 삭제되었습니다.");
      setDeleteTarget(null);
      setDeleting(false);
      setDeleteError("");
      dispatch(resetCompanyState());
      // 통계 숫자(전체 회사/임직원 수)도 갱신
      dispatch(fetchCompanyStatsRequest());
    } else if (error) {
      setDeleteError(error);
      setDeleting(false);
      dispatch(resetCompanyState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, deleting]);

  const pushQuery = (next) => {
    router.push({ pathname: "/com/list", query: { ...router.query, ...next } });
  };

  const handleSearch = (value) => {
    dispatch(clearSuggestList());
    pushQuery({ keyword: value ?? keyword, pstartno: 1 });
  };

  const handleKeywordChange = (value) => {
    setKeyword(value);
    if (value && value.trim()) {
      dispatch(suggestCompanyRequest(value.trim()));
    } else {
      dispatch(clearSuggestList());
    }
  };

  const handleIndustryChange = (value) =>
    pushQuery({ industryGrpCode: value, pstartno: 1 });
  const handlePageSizeChange = (value) =>
    pushQuery({ onepagelist: value, pstartno: 1 });
  const handlePageChange = (page) => pushQuery({ pstartno: page });

  const suggestOptions = useMemo(
    () =>
      (suggestList || []).map((it) => ({
        key: it.comId,
        value: it.comName,
        label: (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              <BankOutlined style={{ marginRight: 6, opacity: 0.5 }} />
              {it.comName}
            </span>
            <span style={{ color: "#999" }}>{it.bizNo}</span>
          </div>
        ),
      })),
    [suggestList],
  );

  const openDelete = (record) => {
    setDeleteTarget({ comId: record.comId, comName: record.comName });
    setDeleteError("");
    form.resetFields();
  };

  const closeDelete = () => {
    setDeleteTarget(null);
    setDeleteError("");
  };

  const submitDelete = async () => {
    try {
      const { password } = await form.validateFields();
      setDeleting(true);
      setDeleteError("");
      dispatch(deleteCompanyRequest({ comId: deleteTarget.comId, password }));
    } catch (e) {
      // antd Form 자체 검증 실패 — 별도 처리 불필요
    }
  };

  const columns = [
    {
      title: "번호",
      key: "no",
      width: 60,
      render: (_, __, idx) =>
        listTotal - (filters.pstartno - 1) * filters.onepagelist - idx,
    },
    {
      title: "회사명",
      dataIndex: "comName",
      key: "comName",
      render: (name, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            shape="square"
            src={record.comLogo || undefined}
            icon={!record.comLogo && <BankOutlined />}
          />
          <span style={{ fontWeight: 600 }}>{name}</span>
        </div>
      ),
    },
    { title: "대표자", dataIndex: "comCeo", key: "comCeo", width: 90 },
    { title: "사업자번호", dataIndex: "bizNo", key: "bizNo", width: 140 },
    {
      title: "업종",
      dataIndex: "industryGrpCode",
      key: "industryGrpCode",
      render: (code) =>
        code ? (
          <Tag>{INDUSTRY_GRP_MAP[code] || "기타"}</Tag>
        ) : (
          <span style={{ color: "#bbb" }}>-</span>
        ),
    },
    {
      title: "임직원 수",
      dataIndex: "empCount",
      key: "empCount",
      width: 110,
      align: "right",
    },
    {
      title: "관리",
      key: "actions",
      width: 170,
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
          <Link
            href={{ pathname: "/com/detail", query: { comId: record.comId } }}
          >
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              title="상세보기"
            />
          </Link>
          <Link
            href={{ pathname: "/com/edit", query: { comId: record.comId } }}
          >
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              title="수정"
            />
          </Link>
          <Link
            href={{ pathname: "/dept/list", query: { comId: record.comId } }}
          >
            <Button
              type="text"
              size="small"
              icon={<ApartmentOutlined />}
              title="조직도 보기"
            />
          </Link>
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            title="삭제"
            onClick={() => openDelete(record)}
          />
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
            조직 관리 &gt; 회사 관리 &gt; 목록
          </div>
          <h1>회사 관리</h1>
          <p>등록된 회사를 조회하고 관리합니다.</p>
        </div>
        <div className="sb-page-head__actions">
          <Link href="/com/add">
            <Button type="primary" icon={<PlusOutlined />}>
              회사 등록
            </Button>
          </Link>
        </div>
      </div>

      {/* 통계 타일 — GET /api/com/stats */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={12} lg={6}>
          <StatTile
            icon={<BankOutlined />}
            tone="blue"
            label="전체 회사"
            value={stats?.comTotal}
          />
        </Col>
        <Col xs={12} lg={6}>
          <StatTile
            icon={<TeamOutlined />}
            tone="green"
            label="전체 임직원"
            value={stats?.empTotal}
          />
        </Col>
        <Col xs={12} lg={6}>
          <StatTile
            icon={<AppstoreOutlined />}
            tone="violet"
            label="업종 수"
            value={stats?.industTotal}
          />
        </Col>
        <Col xs={12} lg={6}>
          <StatTile
            icon={<CalendarOutlined />}
            tone="amber"
            label="최근 등록 회사"
            value={stats?.comLatest}
          />
        </Col>
      </Row>

      {/* 목록 카드 */}
      <Card>
        {/* 검색 / 필터 툴바 */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <AutoComplete
            style={{ minWidth: 320, flex: 1 }}
            value={keyword}
            options={suggestOptions}
            onChange={handleKeywordChange}
            onSelect={(value) => handleSearch(value)}
            placeholder="회사명 또는 사업자번호로 검색"
          >
            <Input.Search
              allowClear
              onSearch={(value) => handleSearch(value)}
              placeholder="회사명 또는 사업자번호로 검색"
            />
          </AutoComplete>

          <Select
            style={{ width: 200 }}
            value={filters.industryGrpCode || ""}
            onChange={handleIndustryChange}
            options={INDUSTRY_GRP_OPTIONS}
          />

          <Select
            style={{ width: 130 }}
            value={filters.onepagelist || 10}
            onChange={handlePageSizeChange}
            options={[
              { value: 10, label: "10개씩 보기" },
              { value: 30, label: "30개씩 보기" },
              { value: 50, label: "50개씩 보기" },
            ]}
          />

          <Button
            icon={<SearchOutlined />}
            onClick={() => handleSearch(keyword)}
          >
            검색
          </Button>
          {filters.keyword ? (
            <Button onClick={() => pushQuery({ keyword: "", pstartno: 1 })}>
              초기화
            </Button>
          ) : null}
        </div>

        {/* 테이블 */}
        <Table
          rowKey="comId"
          columns={columns}
          dataSource={list}
          loading={loading && !deleting}
          pagination={false}
          locale={{ emptyText: "등록된 회사가 없습니다." }}
        />

        {/* 페이지네이션 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 12,
          }}
        >
          <span style={{ color: "#999", fontSize: 12.5 }}>
            총 <b>{listTotal || 0}</b>개 회사
          </span>
          {listTotal > filters.onepagelist && (
            <Pagination
              size="small"
              current={filters.pstartno}
              total={listTotal}
              pageSize={filters.onepagelist}
              showSizeChanger={false}
              onChange={handlePageChange}
            />
          )}
        </div>
      </Card>

      {/* 삭제 확인 모달 — DELETE /api/com/{comId}, payload: { comId, password } */}
      <Modal
        title={`회사 삭제${deleteTarget?.comName ? " — " + deleteTarget.comName : ""}`}
        open={!!deleteTarget}
        onCancel={closeDelete}
        onOk={submitDelete}
        okText="삭제"
        okButtonProps={{ danger: true, loading: deleting }}
        cancelText="취소"
        destroyOnClose
      >
        <p>
          정말로 <b>{deleteTarget?.comName}</b> 회사를 삭제하시겠습니까? 본인
          확인을 위해 비밀번호를 입력해주세요.
        </p>
        <Form form={form} layout="vertical" onFinish={submitDelete}>
          <Form.Item
            name="password"
            label="비밀번호"
            validateStatus={deleteError ? "error" : ""}
            help={deleteError || undefined}
            rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
          >
            <Input.Password autoFocus onPressEnter={submitDelete} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
