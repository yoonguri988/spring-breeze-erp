// components/ResourceDeleteModal.js
import React, { useEffect, useState } from "react";
import { Modal, Button, Input } from "antd";
import {
  ExclamationCircleFilled,
  InboxOutlined,
  LockOutlined,
  StopOutlined,
} from "@ant-design/icons";

export default function ResourceDeleteModal({
  target,
  open,
  loading,
  errorMessage,
  onClose,
  onConfirm,
}) {
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (open) setPassword("");
  }, [open, target]);

  if (!target) return null;
  const { resName, resvCount = 0 } = target;
  const blocked = resvCount > 0;

  const handleConfirm = () => {
    if (blocked) return;
    onConfirm(password);
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
          {blocked ? <StopOutlined /> : <ExclamationCircleFilled />}
          {blocked ? "삭제할 수 없습니다" : "자원 삭제"}
        </span>
      }
      open={open}
      onCancel={onClose}
      width={380}
      footer={
        blocked ? (
          <Button onClick={onClose}>닫기</Button>
        ) : (
          [
            <Button key="cancel" onClick={onClose} disabled={loading}>
              취소
            </Button>,
            <Button
              key="confirm"
              type="primary"
              loading={loading}
              danger
              onClick={handleConfirm}
              disabled={!password}
            >
              삭제 확인
            </Button>,
          ]
        )
      }
    >
      <div
        className="del-modal-icon"
        style={
          blocked
            ? { background: "var(--sb-red-soft)", color: "var(--sb-red)" }
            : { color: "var(--sb-red)" }
        }
      >
        {blocked ? <StopOutlined /> : <InboxOutlined />}
      </div>
      <div className="del-dept-name">{resName}</div>

      {blocked ? (
        <>
          <div className="del-warning">
            이 자원에는 진행 중인 예약이 <b>{resvCount}</b>건 있습니다.
          </div>
          <div className="del-warn-box">
            <ExclamationCircleFilled />
            <span>예약이 있는 동안에는 삭제(해체)를 진행할 수 없습니다.</span>
          </div>
        </>
      ) : (
        <>
          <div className="del-warning">
            계속하려면 <b>비밀번호</b>를 입력하세요.
          </div>
          <div className="mb-2">
            <label className="sb-form-label">
              비밀번호 <span style={{ color: "var(--sb-red)" }}>*</span>
            </label>
            <Input.Password
              className="fi"
              prefix={<LockOutlined />}
              placeholder="비밀번호 입력"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onPressEnter={handleConfirm}
              status={errorMessage ? "error" : undefined}
            />
            {errorMessage && (
              <div
                style={{ color: "var(--sb-red)", fontSize: 12.5, marginTop: 6 }}
              >
                <ExclamationCircleFilled className="me-1" /> {errorMessage}
              </div>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
