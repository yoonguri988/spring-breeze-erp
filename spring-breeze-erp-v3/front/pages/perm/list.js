// pages/perm/list.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Row, Col, Card, Table, Button, Modal, Form, Input, Badge, Avatar, message, } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SafetyCertificateOutlined, } from "@ant-design/icons";

import {
  listPermRequest, detailPermRequest, createPermRequest,
  updatePermRequest, deletePermRequest, clearPermDetail,
  resetPermState,
} from "../../reducers/perm/permReducer";

export default function PermListPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const {
    permList, currentPerm, permEmployees,
    loading, success, error,
  } = useSelector((state) => state.perm);

  // 선택된 권한 ID
  const [selectedId, setSelectedId] = useState(null);

  // 등록/수정 모달
  const [formTarget, setFormTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  // 삭제 모달
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ─── 페이지 진입 시 목록 조회 ───
  useEffect(() => {
    dispatch(listPermRequest());
    // URL에 autId가 있으면 자동 선택
    if (router.query.autId) {
      const id = Number(router.query.autId);
      setSelectedId(id);
      dispatch(detailPermRequest(id));
    }
    // 페이지 떠날 때 상태 초기화
    return () => {
      dispatch(clearPermDetail());
      dispatch(resetPermState());
    };
  }, [dispatch, router.query.autId]);

  // ─── 등록/수정/삭제 결과 처리 ───
  useEffect(() => {
    if (!(saving || deleting) || loading) return;

    if (success) {
      if (saving) {
        message.success(
          formTarget === "add" ? "권한이 등록되었습니다." : "권한이 수정되었습니다."
        );
        closeFormModal();
        dispatch(listPermRequest());
        // 수정한 권한이 선택 중이면 상세도 갱신
        if (formTarget !== "add" && selectedId) {
          dispatch(detailPermRequest(selectedId));
        }
      }
      if (deleting) {
        message.success("권한이 삭제되었습니다.");
        setDeleteTarget(null);
        setDeleting(false);
        setSelectedId(null);
        dispatch(clearPermDetail());
        dispatch(listPermRequest());
      }
      dispatch(resetPermState());
    } else if (error) {
      message.error(error);
      setSaving(false);
      setDeleting(false);
      dispatch(resetPermState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error]);

  // ─── 권한 선택 ───
  const handleSelectRole = (autId) => {
    setSelectedId(autId);
    dispatch(detailPermRequest(autId));
    router.push({ pathname: "/perm/list", query: { autId } }, undefined, {
      shallow: true,
    });
  };

  // ─── 등록/수정 모달 ───
  const openAddModal = () => {
    setFormTarget("add");
    form.resetFields();
  };

  const openEditModal = () => {
    if (!currentPerm) return;
    setFormTarget(currentPerm);
    form.setFieldsValue({ autName: currentPerm.autName });
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
      setSaving(true);
      if (isEditMode) {
        dispatch(updatePermRequest({ autId: formTarget.autId, ...values }));
      } else {
        dispatch(createPermRequest(values));
      }
    } catch (e) {}
  };

  // ─── 삭제 ───
  const confirmDelete = () => {
    setDeleting(true);
    dispatch(deletePermRequest(deleteTarget.autId));
  };

  // ─── 부여된 사원 테이블 컬럼 ───
  const empColumns = [
    {
      title: "사원",
      key: "emp",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar size="small">
            {record.empName ? record.empName.charAt(0) : "?"}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>{record.empName}</div>
            <div style={{ fontSize: 12, color: "#999" }}>{record.empNo}</div>
          </div>
        </div>
      ),
    },
    { title: "부서", dataIndex: "deptName", key: "deptName" },
    { title: "직급", dataIndex: "posName", key: "posName" },
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
            조직 관리 &gt; 권한 관리
          </div>
          <h1>권한 관리</h1>
          <p>
            회사별 권한(authority)을 등록·수정·삭제합니다. 권한에 따른 접근
            제어는 애플리케이션 서버에서 적용됩니다.
          </p>
        </div>
        <div className="sb-page-head__actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            권한 등록
          </Button>
        </div>
      </div>

      <Row gutter={16}>
        {/* ── 좌측: 권한 목록 ── */}
        <Col xs={24} lg={8}>
          <Card
            title="권한 목록"
            extra={<span style={{ color: "#999" }}>{permList.length}개 권한</span>}
          >
            {permList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
                <SafetyCertificateOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                <p>등록된 권한이 없습니다.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {permList.map((item) => (
                  <div
                    key={item.autId}
                    onClick={() => handleSelectRole(item.autId)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 12px",
                      borderRadius: 8,
                      cursor: "pointer",
                      background:
                        selectedId === item.autId ? "#e6f4ff" : "transparent",
                      border:
                        selectedId === item.autId
                          ? "1px solid #91caff"
                          : "1px solid transparent",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{item.autName}</span>
                    <Badge
                      count={`${item.autCount || 0}명`}
                      style={{ backgroundColor: "#f0f0f0", color: "#666" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>

        {/* ── 우측: 권한 상세 ── */}
        <Col xs={24} lg={16}>
          <Card>
            {!currentPerm ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
                <SafetyCertificateOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                <p>왼쪽에서 권한을 선택하세요.</p>
                <p>또는 '권한 등록'으로 새 권한을 만드세요.</p>
              </div>
            ) : (
              <>
                {/* 권한 헤더 */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontSize: 18, fontWeight: 700 }}>
                    {currentPerm.autName}
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={openEditModal}
                    >
                      수정
                    </Button>
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => setDeleteTarget(currentPerm)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>

                {/* 부여된 사원 목록 */}
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>이 권한이 부여된 사원</span>
                  <span style={{ color: "#999", marginLeft: 8 }}>
                    {permEmployees.length}명
                  </span>
                </div>
                <Table
                  rowKey="empId"
                  columns={empColumns}
                  dataSource={permEmployees}
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showTotal: (total) => `총 ${total}명`,
                    showSizeChanger: false,
                  }}
                  size="small"
                  locale={{ emptyText: "이 권한이 부여된 사원이 없습니다." }}
                />
              </>
            )}
          </Card>
        </Col>
      </Row>

      {/* ── 등록/수정 모달 ── */}
      <Modal
        title={isEditMode ? "권한 수정" : "권한 등록"}
        open={formTarget !== null}
        onCancel={closeFormModal}
        onOk={handleSubmit}
        okText={isEditMode ? "수정" : "등록"}
        okButtonProps={{ loading: saving }}
        cancelText="취소"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="autName"
            label="권한명"
            rules={[{ required: true, message: "권한명을 입력하세요." }]}
            extra="Spring Security 관례에 따라 ROLE_ 접두사로 시작하는 것을 권장합니다."
          >
            <Input placeholder="예: ROLE_MEMBER" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── 삭제 확인 모달 ── */}
      <Modal
        title="권한 삭제"
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={confirmDelete}
        okText="삭제"
        okButtonProps={{ danger: true, loading: deleting }}
        cancelText="취소"
        destroyOnClose
      >
        <p>
          정말로 <b>{deleteTarget?.autName}</b> 권한을 삭제하시겠습니까?
        </p>
        <p style={{ color: "#999", fontSize: 13 }}>
          이 권한이 부여된 사원이 있으면 삭제할 수 없습니다.
        </p>
      </Modal>
    </div>
  );
}