// pages/pos/list.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Card, Table, Button, Tag, Modal, Form, Input, InputNumber, message, } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, } from "@ant-design/icons";

import {
  listPosRequest, createPosRequest, updatePosRequest,
  deletePosRequest, checkCodeRequest, clearCodeCheck,
  resetPosState,
} from "../../reducers/pos/posReducer";

export default function PosListPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // Redux state
  const { posList, codeCheck, loading, success, error } = useSelector(
    (state) => state.pos
  );

  // 모달 상태: null=닫힘, "add"=등록, {posId,...}=수정 대상
  const [formTarget, setFormTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  // 삭제 모달
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ─── 페이지 진입 시 목록 조회 ───
  useEffect(() => {
    dispatch(listPosRequest());
    
    return () => {
      dispatch(resetPosState());
      dispatch(clearCodeCheck());
    };
  }, [dispatch]);

  // ─── 등록/수정/삭제 결과 처리 ───
  useEffect(() => {
    if (!(saving || deleting) || loading) return;

    if (success) {
      if (saving) {
        message.success(
          formTarget === "add" ? "직급이 등록되었습니다." : "직급이 수정되었습니다."
        );
        closeFormModal();
        dispatch(listPosRequest()); // 목록 새로고침
      }
      if (deleting) {
        message.success("직급이 삭제되었습니다.");
        setDeleteTarget(null);
        setDeleting(false);
      }
      dispatch(resetPosState());
    } else if (error) {
      message.error(error);
      setSaving(false);
      setDeleting(false);
      dispatch(resetPosState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error]);

  // ─── 등록/수정 모달 ───
  const openAddModal = () => {
    setFormTarget("add");
    dispatch(clearCodeCheck());
    form.resetFields();
  };

  const openEditModal = (record) => {
    setFormTarget(record);
    dispatch(clearCodeCheck());
    form.setFieldsValue({
      posCode: record.posCode,
      posName: record.posName,
      posOrder: record.posOrder,
    });
  };

  const closeFormModal = () => {
    setFormTarget(null);
    setSaving(false);
    dispatch(clearCodeCheck());
    form.resetFields();
  };

  const isEditMode = formTarget !== null && formTarget !== "add";
  const formTitle = isEditMode ? "직급 수정" : "직급 등록";

  // 코드 중복검사 (blur 시)
  const handleCodeBlur = (e) => {
    const value = e.target.value.trim();
    if (!value) return;

    // 수정 모드에서 원래 코드와 같으면 검사 스킵
    if (isEditMode && value === formTarget.posCode) {
      dispatch(clearCodeCheck());
      return;
    }

    dispatch(
      checkCodeRequest({
        posCode: value,
        ...(isEditMode ? { excludePosId: formTarget.posId } : {}),
      })
    );
  };

  // 중복검사 결과에 따른 도움말
  const codeHelp =
    codeCheck === true
      ? { validateStatus: "error", help: "이미 사용 중인 코드입니다." }
      : codeCheck === false
        ? { validateStatus: "success", help: "사용 가능한 코드입니다." }
        : {};

  // 폼 제출
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 중복 코드 차단
      if (codeCheck === true) {
        message.warning("중복된 직급 코드입니다. 다른 코드를 입력하세요.");
        return;
      }

      setSaving(true);
      if (isEditMode) {
        dispatch(updatePosRequest({ posId: formTarget.posId, ...values }));
      } else {
        dispatch(createPosRequest(values));
      }
    } catch (e) {
      // Form 자체 검증 실패
    }
  };

  // ─── 삭제 ───
  const confirmDelete = () => {
    setDeleting(true);
    dispatch(deletePosRequest(deleteTarget.posId));
  };

  // ─── 테이블 컬럼 ───
  const columns = [
    {
      title: "순서",
      dataIndex: "posOrder",
      key: "posOrder",
      width: 80,
      align: "center",
    },
    {
      title: "코드",
      dataIndex: "posCode",
      key: "posCode",
      width: 180,
      render: (code) => <Tag>{code}</Tag>,
    },
    {
      title: "직급명",
      dataIndex: "posName",
      key: "posName",
      render: (name) => <span style={{ fontWeight: 600 }}>{name}</span>,
    },
    {
      title: "관리",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
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
            조직 관리 &gt; 직급 관리 &gt; 목록
          </div>
          <h1>직급 관리</h1>
          <p>
            회사별 직급을 등록·수정·삭제합니다. 직급은 사원 등록·수정 시 선택
            항목으로 사용됩니다.
          </p>
        </div>
        <div className="sb-page-head__actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            직급 등록
          </Button>
        </div>
      </div>

      {/* 목록 카드 */}
      <Card>
        <Table
          rowKey="posId"
          columns={columns}
          dataSource={posList}
          loading={loading && !saving && !deleting}
          pagination={false}
          locale={{ emptyText: "등록된 직급이 없습니다." }}
        />
      </Card>

      {/* 안내 문구 */}
      <div style={{ marginTop: 12, color: "#999", fontSize: 13 }}>
        ℹ 직급 삭제는 해당 직급을 사용 중인 사원이 없을 때만 가능합니다. 먼저
        사원의 직급을 다른 직급으로 변경한 후 삭제하세요.
      </div>

      {/* ── 등록/수정 모달 ── */}
      <Modal
        title={formTitle}
        open={formTarget !== null}
        onCancel={closeFormModal}
        onOk={handleSubmit}
        okText={isEditMode ? "수정" : "등록"}
        okButtonProps={{ loading: saving, disabled: codeCheck === true }}
        cancelText="취소"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="posCode"
            label="직급 코드"
            rules={[{ required: true, message: "직급 코드를 입력하세요." }]}
            extra="회사 내에서 중복되지 않는 짧은 식별 코드입니다."
            {...codeHelp}
          >
            <Input
              placeholder="예: MGR"
              maxLength={20}
              onBlur={handleCodeBlur}
            />
          </Form.Item>

          <Form.Item
            name="posName"
            label="직급명"
            rules={[{ required: true, message: "직급명을 입력하세요." }]}
          >
            <Input placeholder="예: 부장" maxLength={50} />
          </Form.Item>

          <Form.Item
            name="posOrder"
            label="순서"
            rules={[{ required: true, message: "순서를 입력하세요." }]}
            extra="직급 목록에서 표시 순서(오름차순)."
          >
            <InputNumber
              placeholder="숫자가 작을수록 상위"
              min={1}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── 삭제 확인 모달 ── */}
      <Modal
        title="직급 삭제"
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={confirmDelete}
        okText="삭제"
        okButtonProps={{ danger: true, loading: deleting }}
        cancelText="취소"
        destroyOnClose
      >
        <p>
          정말로 <b>{deleteTarget?.posName}</b> 직급을 삭제하시겠습니까?
        </p>
        <p style={{ color: "#999", fontSize: 13 }}>
          이 직급을 사용 중인 사원이 있으면 삭제할 수 없습니다.
        </p>
      </Modal>
    </div>
  );
}
