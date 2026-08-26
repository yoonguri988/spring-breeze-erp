// pages/rec/list.js
// 채용공고 관리 (ROLE_ADMIN) - GET/POST/PUT/DELETE /api/admin/recruit
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { Table, Button, Tag, Modal, Form, Input, InputNumber, Select, DatePicker, Pagination, Empty, message, } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  FileSearchOutlined,
  EyeOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import moment from "moment";

import {
  fetchRecruitAdminListRequest,
  createRecruitRequest,
  updateRecruitRequest,
  deleteRecruitRequest,
  resetRecruitState,
} from "../../reducers/rec/recruitReducer";

const STATUS_LABEL = {
  OPEN: { text: "모집중", color: "green" },
  CLOSED: { text: "마감", color: "default" },
  CANCELLED: { text: "취소됨", color: "red" },
};

const STATUS_TAG_COLOR = {
  OPEN: "success",
  CLOSED: "default",
  CANCELLED: "error",
};

export default function RecruitListPage() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { list, paging, listLoading, loading, success, error } = useSelector(
    (state) => state.recruit,
  );

  const [recStatus, setRecStatus] = useState(undefined);
  const [recTitle, setRecTitle] = useState("");
  const [page, setPage] = useState(1);

  const [formTarget, setFormTarget] = useState(null); // null | "add" | record
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  

  const runSearch = (nextPage = 1) => {
    setPage(nextPage);
    dispatch(
      fetchRecruitAdminListRequest({ recStatus, recTitle: recTitle.trim(), pstartno: nextPage, onepagelist: 10 }),
    );
  };

  useEffect(() => {
    runSearch(1);
    return () => dispatch(resetRecruitState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!(saving || deleting) || loading) return;
    if (success) {
      if (saving) {
        message.success(
          formTarget === "add" ? "채용공고가 등록되었습니다." : "채용공고가 수정되었습니다.",
        );
        closeFormModal();
      }
      if (deleting) {
        message.success("채용공고가 삭제되었습니다.");
        setDeleteTarget(null);
        setDeleting(false);
      }
      dispatch(resetRecruitState());
      runSearch(page);
    } else if (error) {
      message.error(error);
      setSaving(false);
      setDeleting(false);
      dispatch(resetRecruitState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, dispatch]);

  const openAddModal = () => {
    setFormTarget("add");
    form.resetFields();
    form.setFieldsValue({ recStatus: "OPEN" });
  };
  const openEditModal = (record) => {
    setFormTarget(record);
    form.setFieldsValue({
      recTitle: record.recTitle,
      recDepartment: record.recDepartment,
      recPosition: record.recPosition,
      recHeadcount: record.recHeadcount,
      recEmploymentType: record.recEmploymentType,
      recDescription: record.recDescription,
      recDateRange: [
        record.recStartDate ? moment(record.recStartDate) : null,
        record.recEndDate ? moment(record.recEndDate) : null,
      ],
      recStatus: record.recStatus,
    });
  };
  const closeFormModal = () => {
    setFormTarget(null);
    setSaving(false);
    form.resetFields();
  };
  const isEditMode = formTarget !== null && formTarget !== "add";

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const [start, end] = values.recDateRange || [];
      const payload = {
        recTitle: values.recTitle,
        recDepartment: values.recDepartment,
        recPosition: values.recPosition,
        recHeadcount: values.recHeadcount,
        recEmploymentType: values.recEmploymentType,
        recDescription: values.recDescription,
        recStartDate: start ? start.format("YYYY-MM-DDTHH:mm:ss") : null,
        recEndDate: end ? end.format("YYYY-MM-DDTHH:mm:ss") : null,
        recStatus: values.recStatus,
      };
      setSaving(true);
      if (isEditMode) {
        dispatch(updateRecruitRequest({ recId: formTarget.recId, ...payload }));
      } else {
        dispatch(createRecruitRequest(payload));
      }
    } catch (e) {
      // 폼 자체 검증 실패
    }
  };

  const confirmDelete = () => {
    setDeleting(true);
    dispatch(deleteRecruitRequest(deleteTarget.recId));
  };

  const columns = [
    {
      title: "공고명",
      dataIndex: "recTitle",
      key: "recTitle",
      render: (v, record) => (
        <Link href={`/rec/detail?recId=${record.recId}`}>
          <span className="sb-table__name" style={{ cursor: "pointer" }}>
            {v}
          </span>
        </Link>
      ),
    },
    { title: "부서", dataIndex: "recDepartment", key: "recDepartment", width: 130 },
    { title: "직무", dataIndex: "recPosition", key: "recPosition", width: 130 },
    {
      title: "인원",
      dataIndex: "recHeadcount",
      key: "recHeadcount",
      width: 70,
      align: "center",
    },
    {
      title: "고용형태",
      dataIndex: "recEmploymentType",
      key: "recEmploymentType",
      width: 100,
    },
    {
      title: "담당자",
      dataIndex: "empName",
      key: "empName",
      width: 100,
      render: (v) => v || "-",
    },
    {
      title: "지원자",
      key: "applicantCnt",
      width: 110,
      align: "center",
      render: (_, record) => (
        <Link href={`/apct/list?recId=${record.recId}`}>
          <Button type="text" size="small" icon={<TeamOutlined />}>
            {record.applicantCnt ?? 0}명
          </Button>
        </Link>
      ),
    },
    {
      title: "상태",
      dataIndex: "recStatus",
      key: "recStatus",
      width: 90,
      align: "center",
      render: (v) => <Tag color={STATUS_TAG_COLOR[v] || "default"}>{STATUS_LABEL[v]?.text || v}</Tag>,
    },
    {
      title: "관리",
      key: "actions",
      width: 170,
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Link href={`/apct/resume-search?recId=${record.recId}`}>
            <Button type="text" size="small" icon={<FileSearchOutlined />} title="이력서 검색" />
          </Link>
          <Link href={`/rec/detail?recId=${record.recId}`}>
            <Button type="text" size="small" icon={<EyeOutlined />} title="상세" />
          </Link>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            title="수정"
            onClick={() => openEditModal(record)}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            title="삭제"
            onClick={() => setDeleteTarget(record)}
          />
        </div>
      ),
    },
  ];

  const totalCnt = paging?.listtotal ?? 0;
  const currentPage = Number(paging?.current) || page;
  const pageSize = Number(paging?.onepagelist) || 10;

  return (
    <main className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            홈 <i className="bi bi-chevron-right"></i> 채용관리{" "}
            <i className="bi bi-chevron-right"></i> 채용공고
          </div>
          <h1>채용공고 관리</h1>
          <p>채용공고를 등록하고 지원자 현황과 이력서를 연결해 관리합니다.</p>
        </div>

        <div className="sb-page-head__actions my-3">
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            채용공고 등록
          </Button>
        </div>
      </div>

      <div className="sb-card mb-3">
        <div
          className="sb-toolbar"
          style={{ flexDirection: "column", alignItems: "stretch", gap: 10 }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <strong style={{ fontSize: 14 }}>채용공고 목록</strong>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Input
              style={{ width: 240 }}
              placeholder="채용공고명 검색"
              prefix={<SearchOutlined />}
              value={recTitle}
              onChange={(e) => setRecTitle(e.target.value)}
              onPressEnter={() => runSearch(1)}
              allowClear
            />

            <Select
              style={{ width: 160 }}
              placeholder="공고 상태"
              allowClear
              value={recStatus}
              onChange={(v) => setRecStatus(v)}
              options={[
                { value: "OPEN", label: "모집중" },
                { value: "CLOSED", label: "마감" },
                { value: "CANCELLED", label: "취소됨" },
              ]}
            />

            <Button icon={<SearchOutlined />} onClick={() => runSearch(1)}>
              검색
            </Button>
          </div>
        </div>

        {error && (
          <div style={{ color: "#ff4d4f", padding: "12px 16px" }}>{error}</div>
        )}

        <div className="sb-card__body--flush">
          <Table
            rowKey="recId"
            columns={columns}
            dataSource={list}
            loading={listLoading}
            pagination={false}
            locale={{
              emptyText: (
                <Empty
                  image={<FolderOpenOutlined style={{ fontSize: 32 }} />}
                  description="등록된 채용공고가 없습니다."
                />
              ),
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderTop: "1px solid var(--sb-border)",
          }}
        >
          <span style={{ color: "#999", fontSize: 12.5 }}>
            총 <b>{totalCnt}</b>건
          </span>
          {totalCnt > pageSize && (
            <Pagination
              size="small"
              current={currentPage}
              total={totalCnt}
              pageSize={pageSize}
              showSizeChanger={false}
              onChange={runSearch}
            />
          )}
        </div>
      </div>

      {/* 등록/수정 모달 */}
      <Modal
        title={isEditMode ? "채용공고 수정" : "채용공고 등록"}
        open={formTarget !== null}
        onCancel={closeFormModal}
        onOk={handleSubmit}
        okText={isEditMode ? "수정" : "등록"}
        okButtonProps={{ loading: saving }}
        cancelText="취소"
        destroyOnClose
        width={640}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="recTitle"
            label="공고 제목"
            rules={[{ required: true, message: "공고 제목을 입력해 주세요." }]}
          >
            <Input placeholder="예: 2026 상반기 백엔드 개발자 채용" />
          </Form.Item>
          <div style={{ display: "flex", gap: 12 }}>
            <Form.Item
              name="recDepartment"
              label="모집 부서"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "모집 부서를 입력해 주세요." }]}
            >
              <Input placeholder="예: 개발팀" />
            </Form.Item>
            <Form.Item
              name="recPosition"
              label="모집 직무"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "모집 직무를 입력해 주세요." }]}
            >
              <Input placeholder="예: 백엔드 개발자" />
            </Form.Item>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Form.Item
              name="recHeadcount"
              label="모집 인원"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "모집 인원을 입력해 주세요." }]}
            >
              <InputNumber style={{ width: "100%" }} min={1} placeholder="예: 2" />
            </Form.Item>
            <Form.Item
              name="recEmploymentType"
              label="고용 형태"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "고용 형태를 입력해 주세요." }]}
            >
              <Select
                placeholder="선택"
                options={[
                  { value: "정규직", label: "정규직" },
                  { value: "계약직", label: "계약직" },
                  { value: "인턴", label: "인턴" },
                  { value: "파견직", label: "파견직" },
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item
            name="recDateRange"
            label="접수 기간 (종료일 미지정 시 상시채용)"
            rules={[{ required: true, message: "접수 시작일은 필수입니다." }]}
          >
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              allowEmpty={[false, true]}
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>
          <Form.Item
            name="recStatus"
            label="공고 상태"
            rules={[{ required: true, message: "공고 상태를 선택해 주세요." }]}
          >
            <Select
              options={[
                { value: "OPEN", label: "모집중" },
                { value: "CLOSED", label: "마감" },
                { value: "CANCELLED", label: "취소됨" },
              ]}
            />
          </Form.Item>
          <Form.Item name="recDescription" label="상세 내용">
            <Input.TextArea rows={5} placeholder="담당 업무, 자격요건, 우대사항 등" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 삭제 확인 모달 */}
      <Modal
        title="채용공고 삭제"
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={confirmDelete}
        okText="삭제"
        okButtonProps={{ danger: true, loading: deleting }}
        cancelText="취소"
        destroyOnClose
      >
        <p>
          <b>{deleteTarget?.recTitle}</b> 공고를 삭제하시겠습니까?
        </p>
        <p style={{ color: "#999", fontSize: 13 }}>
          지원자가 이미 있는 공고는 백엔드 정책에 따라 삭제가 제한될 수 있습니다.
        </p>
      </Modal>
    </main>
  );
}