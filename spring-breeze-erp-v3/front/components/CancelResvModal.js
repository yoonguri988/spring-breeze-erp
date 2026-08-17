// components/CancelResvModal.js
import React from "react";
import { Modal, Button } from "antd";
import { ExclamationCircleFilled, WarningFilled } from "@ant-design/icons";

export default function CancelResvModal({
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
            color: "var(--sb-red)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <ExclamationCircleFilled /> 예약 취소
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
          danger
          loading={loading}
          onClick={onConfirm}
        >
          예약 취소
        </Button>,
      ]}
    >
      <div className="sb-confirm-box" style={{ margin: 0 }}>
        <div className="sb-confirm-box__icon">
          <WarningFilled />
        </div>
        <div className="sb-confirm-box__text">
          <p className="sb-confirm-box__title">이 예약을 취소하시겠습니까?</p>
          <p className="sb-confirm-box__desc">
            취소 후에는 되돌릴 수 없으며, 다시 이용하려면 새로 예약을 신청해야
            합니다.
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
