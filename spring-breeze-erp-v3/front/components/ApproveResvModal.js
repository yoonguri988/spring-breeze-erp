// components/ApproveResvModal.js
import React from "react";
import { Modal, Button } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";

export default function ApproveResvModal({
  target,
  open,
  loading,
  onClose,
  onConfirm,
}) {
  if (!target) return null;

  return (
    <Modal
      title={
        <span
          style={{
            color: "var(--sb-accent)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <CheckCircleFilled /> 예약 승인
        </span>
      }
      open={open}
      onCancel={onClose}
      width={380}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>
          닫기
        </Button>,
        <Button
          key="confirm"
          type="primary"
          loading={loading}
          onClick={onConfirm}
        >
          <CheckCircleFilled /> 승인 처리
        </Button>,
      ]}
    >
      <div
        className="sb-confirm-box sb-confirm-box--accent"
        style={{ margin: 0 }}
      >
        <div className="sb-confirm-box__icon">
          <CheckCircleFilled />
        </div>
        <div className="sb-confirm-box__text">
          <p className="sb-confirm-box__title">
            이 예약 요청을 승인하시겠습니까?
          </p>
          <p className="sb-confirm-box__desc">
            승인 후에는 신청자에게 자원 사용이 확정되며, 상태를 다시 대기로
            되돌릴 수 없습니다.
          </p>
          {target.resName && (
            <p className="sb-confirm-box__desc" style={{ marginTop: 4 }}>
              대상 자원: <b>{target.resName}</b>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
