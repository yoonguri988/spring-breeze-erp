// components/RejectResvModal.js
import React, { useEffect, useState } from "react";
import { Modal, Button, Input } from "antd";
import {
  CloseCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

export default function RejectResvModal({
  target,
  open,
  loading,
  onClose,
  onConfirm,
}) {
  const [rejectReason, setRejectReason] = useState("");
  const [showErr, setShowErr] = useState(false);

  useEffect(() => {
    if (open) {
      setRejectReason("");
      setShowErr(false);
    }
  }, [open, target]);

  if (!target) return null;

  const handleChange = (e) => {
    setRejectReason(e.target.value);
    if (e.target.value.trim()) setShowErr(false);
  };

  const handleConfirm = () => {
    if (!rejectReason.trim()) {
      setShowErr(true);
      return;
    }
    onConfirm(rejectReason.trim());
  };

  return (
    <Modal
      title={
        <span
          style={{
            color: "var(--sb-red)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <CloseCircleFilled /> 예약 반려
        </span>
      }
      open={open}
      onCancel={onClose}
      width={420}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>
          닫기
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger
          loading={loading}
          onClick={handleConfirm}
        >
          <CloseCircleFilled /> 반려 처리
        </Button>,
      ]}
    >
      {target.resName && (
        <div className="mb-2" style={{ fontSize: 13 }}>
          대상 자원: <b>{target.resName}</b>
        </div>
      )}
      <label className="sb-form-label">반려 사유</label>
      <Input.TextArea
        rows={3}
        value={rejectReason}
        onChange={handleChange}
        status={showErr ? "error" : undefined}
      />
      {showErr && (
        <span className="sb-field-msg text-danger" style={{ display: "flex" }}>
          <ExclamationCircleOutlined /> 반려 사유를 입력하세요.
        </span>
      )}
    </Modal>
  );
}
