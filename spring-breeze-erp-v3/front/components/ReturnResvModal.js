// components/ReturnResvModal.js
import React from "react";
import { Modal, Button } from "antd";
import { CheckCircleFilled, InfoCircleFilled } from "@ant-design/icons";

export default function ReturnResvModal({
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
            color: "var(--sb-green, #389e0d)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <CheckCircleFilled /> 자원 반납
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
          반납 처리
        </Button>,
      ]}
    >
      <div className="sb-confirm-box" style={{ margin: 0 }}>
        <div className="sb-confirm-box__icon">
          <InfoCircleFilled />
        </div>
        <div className="sb-confirm-box__text">
          <p className="sb-confirm-box__title">이 자원을 반납 처리하시겠습니까?</p>
          <p className="sb-confirm-box__desc">
            반납 처리 후에는 되돌릴 수 없으며, 처리된 시점의 일시가 반납일로
            기록됩니다.
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
