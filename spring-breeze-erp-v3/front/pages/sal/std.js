// pages/sal/std/list.js
// 급여기준 관리 (ROLE_ADMIN) - GET/POST/PUT/DELETE /api/salstd
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Pagination,
  message,
  Descriptions,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";

import {
  listSalStdRequest,
  createSalStdRequest,
  updateSalStdRequest,
  deleteSalStdRequest,
  resetSalStdState,
} from "../../reducers/sal/salStdReducer";
import EmployeePicker from "../../components/sal/EmployeePicker";
import { formatWon, wonFormatter, wonParser } from "../../utils/currency";

export default function SalStdListPage() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { stdList, paging, loading, success, error } = useSelector(
    (state) => state.salStd,
  );

  const [filters, setFilters] = useState({
    empName: "",
    department: "",
    position: "",
  });
  const [page, setPage] = useState(1);

  const [formTarget, setFormTarget] = useState(null); // null | "add" | record
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const runSearch = (nextPage = 1) => {
    setPage(nextPage);
    dispatch(listSalStdRequest({ ...filters, page: nextPage - 1, size: 10 }));
  };

  useEffect(() => {
    runSearch(1);
    return () => dispatch(resetSalStdState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!(saving || deleting) || loading) return;
    if (success) {
      if (saving) {
        message.success(
          formTarget === "add"
            ? "급여기준이 등록되었습니다."
            : "급여기준이 수정되었습니다.",
        );
        closeFormModal();
      }
      if (deleting) {
        message.success("급여기준이 삭제되었습니다.");
        setDeleteTarget(null);
        setDeleting(false);
      }
      dispatch(resetSalStdState());
      runSearch(page);
    } else if (error) {
      message.error(error);
      setSaving(false);
      setDeleting(false);
      dispatch(resetSalStdState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, dispatch]);

  const openAddModal = () => {
    setFormTarget("add");
    form.resetFields();
  };
  const openEditModal = (record) => {
    setFormTarget(record);
    form.setFieldsValue({
      baseSal: record.baseSal,
      annuSal: record.annuSal,
      startDate: record.startDate ? moment(record.startDate) : null,
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
      const payload = {
        ...values,
        startDate: values.startDate
          ? values.startDate.format("YYYY-MM-DD")
          : null,
      };
      if (!isEditMode && !payload.empId) {
        message.warning("사원을 선택해 주세요.");
        return;
      }
      setSaving(true);
      if (isEditMode) {
        dispatch(updateSalStdRequest({ stdId: formTarget.stdId, ...payload }));
      } else {
        dispatch(createSalStdRequest(payload));
      }
    } catch (e) {
      // 폼 자체 검증 실패
    }
  };

  const confirmDelete = () => {
    setDeleting(true);
    dispatch(deleteSalStdRequest(deleteTarget.stdId));
  };

  const columns = [
    {
      title: "사원명",
      dataIndex: "empName",
      key: "empName",
      width: 140,
      render: (v) => <b>{v}</b>,
    },
    {
      title: "기본급",
      dataIndex: "baseSal",
      key: "baseSal",
      width: 140,
      align: "right",
      render: (v) => formatWon(v),
    },
    {
      title: "연봉",
      dataIndex: "annuSal",
      key: "annuSal",
      width: 140,
      align: "right",
      render: (v) => formatWon(v),
    },
    {
      title: "적용시작일",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
    },
    {
      title: "적용종료일",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
      render: (v) => v || "-",
    },
    {
      title: "상태",
      dataIndex: "actv",
      key: "actv",
      width: 90,
      align: "center",
      render: (v) => (v ? <Tag color="green">적용중</Tag> : <Tag>종료</Tag>),
    },
    {
      title: "관리",
      key: "actions",
      width: 110,
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
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

  return (
    <div className="sb-page">
      <div
        className="sb-page-head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">급여관리 &gt; 급여기준 &gt; 목록</div>
          <h1>급여기준 관리</h1>
          <p>직원별 기본급/연봉계약 및 적용기간을 등록·관리합니다.</p>
        </div>
        <div className="sb-page-head__actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            급여기준 등록
          </Button>
        </div>
      </div>

      <Card>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <Input
            style={{ width: 180 }}
            placeholder="사원 이름"
            value={filters.empName}
            onChange={(e) =>
              setFilters((f) => ({ ...f, empName: e.target.value }))
            }
            onPressEnter={() => runSearch(1)}
          />
          <Input
            style={{ width: 160 }}
            placeholder="부서명"
            value={filters.department}
            onChange={(e) =>
              setFilters((f) => ({ ...f, department: e.target.value }))
            }
            onPressEnter={() => runSearch(1)}
          />
          <Input
            style={{ width: 140 }}
            placeholder="직급명"
            value={filters.position}
            onChange={(e) =>
              setFilters((f) => ({ ...f, position: e.target.value }))
            }
            onPressEnter={() => runSearch(1)}
          />
          <Button icon={<SearchOutlined />} onClick={() => runSearch(1)}>
            검색
          </Button>
        </div>

        <Table
          rowKey="stdId"
          columns={columns}
          dataSource={stdList}
          loading={loading && !saving && !deleting}
          pagination={false}
          locale={{ emptyText: "등록된 급여기준이 없습니다." }}
        />

        {paging && paging.totalElements > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 12,
            }}
          >
            <span style={{ color: "#999", fontSize: 12.5 }}>
              총 <b>{paging.totalElements}</b>건
            </span>
            <Pagination
              size="small"
              current={page}
              total={paging.totalElements}
              pageSize={paging.size || 10}
              showSizeChanger={false}
              onChange={runSearch}
            />
          </div>
        )}
      </Card>

      {/* 등록/수정 모달 */}
      <Modal
        title={isEditMode ? "급여기준 수정" : "급여기준 등록"}
        open={formTarget !== null}
        onCancel={closeFormModal}
        onOk={handleSubmit}
        okText={isEditMode ? "수정" : "등록"}
        okButtonProps={{ loading: saving }}
        cancelText="취소"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {!isEditMode && (
            <Form.Item
              name="empId"
              label="사원"
              rules={[{ required: true, message: "사원을 선택해 주세요." }]}
            >
              <EmployeePicker />
            </Form.Item>
          )}
          {isEditMode && (
            <Descriptions
              size="small"
              column={1}
              bordered
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="사원">
                {formTarget.empName}
              </Descriptions.Item>
            </Descriptions>
          )}
          <Form.Item
            name="baseSal"
            label="기본급"
            rules={[{ required: true, message: "기본급을 입력해 주세요." }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              step={10000}
              formatter={wonFormatter}
              parser={wonParser}
              placeholder="예: 3000000"
              addonAfter="원"
            />
          </Form.Item>
          <Form.Item name="annuSal" label="연봉 (선택)">
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={100000}
              formatter={wonFormatter}
              parser={wonParser}
              placeholder="연봉계약이 있는 경우 입력"
              addonAfter="원"
            />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="적용시작일"
            rules={[{ required: true, message: "적용시작일을 선택해 주세요." }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 삭제 확인 모달 */}
      <Modal
        title="급여기준 삭제"
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={confirmDelete}
        okText="삭제"
        okButtonProps={{ danger: true, loading: deleting }}
        cancelText="취소"
        destroyOnClose
      >
        <p>
          <b>{deleteTarget?.empName}</b>님의 급여기준을 삭제하시겠습니까?
        </p>
        <p style={{ color: "#999", fontSize: 13 }}>
          삭제된 급여기준은 복구할 수 없습니다.
        </p>
      </Modal>
    </div>
  );
}
