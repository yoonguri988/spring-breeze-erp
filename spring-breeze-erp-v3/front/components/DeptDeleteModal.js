// components/DeptDeleteModal.js
import React from "react";
import { Modal, Button } from "antd";
import {
  StopOutlined,
  TeamOutlined,
  ApartmentOutlined,
  DeleteOutlined,
  ArrowRightOutlined,
  WarningFilled,
} from "@ant-design/icons";

export default function DeptDeleteModal({
  target,
  open,
  loading,
  onClose,
  onConfirm,
}) {
  if (!target) return null;
  const { deptName, deptCode, empCount = 0, childCount = 0 } = target;
  const hasChild = childCount > 0;

  let mode = "delete"; // delete | transfer | blocked
  if (hasChild) mode = "blocked";
  else if (empCount > 0) mode = "transfer";

  const HEADER = {
    blocked: {
      color: "var(--sb-red)",
      icon: <StopOutlined />,
      text: "삭제할 수 없습니다",
    },
    transfer: {
      color: "var(--sb-amber)",
      icon: <TeamOutlined />,
      text: "사원 이관이 필요합니다",
    },
    delete: {
      color: "var(--sb-red)",
      icon: <WarningFilled />,
      text: "부서 삭제",
    },
  }[mode];

  const ICON_BOX = {
    blocked: {
      bg: "var(--sb-red-soft)",
      color: "var(--sb-red)",
      icon: <StopOutlined />,
    },
    transfer: {
      bg: "var(--sb-amber-soft)",
      color: "var(--sb-amber)",
      icon: <TeamOutlined />,
    },
    delete: {
      bg: "var(--sb-red-soft)",
      color: "var(--sb-red)",
      icon: <ApartmentOutlined />,
    },
  }[mode];

  return (
    <Modal
      title={
        <span
          style={{
            color: HEADER.color,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {HEADER.icon} {HEADER.text}
        </span>
      }
      open={open}
      onCancel={onClose}
      width={380}
      footer={
        mode === "blocked" ? (
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
              icon={
                mode === "transfer" ? (
                  <ArrowRightOutlined />
                ) : (
                  <DeleteOutlined />
                )
              }
              style={
                mode === "transfer"
                  ? {
                      background: "var(--sb-amber)",
                      borderColor: "var(--sb-amber)",
                    }
                  : {
                      background: "var(--sb-red)",
                      borderColor: "var(--sb-red)",
                    }
              }
              onClick={onConfirm}
            >
              {mode === "transfer" ? "이관 진행" : "삭제 확인"}
            </Button>,
          ]
        )
      }
    >
      <div
        className="del-modal-icon"
        style={{ background: ICON_BOX.bg, color: ICON_BOX.color }}
      >
        {ICON_BOX.icon}
      </div>
      <div className="del-dept-name">
        {deptName}{" "}
        {deptCode && <span className="dept-code-chip ms-1">{deptCode}</span>}
      </div>

      {mode === "blocked" && (
        <>
          <div className="del-warning">
            이 부서에는 하위 부서가 <b>{childCount}</b>개 존재합니다.
            <br />
            하위 부서를 먼저 삭제하거나 다른 부서로 이동한 뒤 다시 시도해주세요.
          </div>
          <div className="del-warn-box">
            <WarningFilled />
            <span>
              하위 부서가 있는 동안에는 삭제(해체)를 진행할 수 없습니다.
            </span>
          </div>
        </>
      )}

      {mode === "transfer" && (
        <>
          <div className="del-warning">
            삭제를 진행하면 부서 상태가 <b>이관 대기(PENDING_DELETE)</b>로
            변경되고,
            <br />
            바로 사원 이관 화면으로 이동합니다.
          </div>
          <div className="del-warn-box">
            <TeamOutlined />
            <span>
              소속 사원 <b>{empCount}</b>명을 다른 부서로 이관해야 최종 삭제가
              완료됩니다.
            </span>
          </div>
        </>
      )}

      {mode === "delete" && (
        <div className="del-warning">
          삭제 시 연결된 데이터에 영향을 줄 수 있습니다.
          <br />이 작업은 되돌릴 수 없습니다.
        </div>
      )}
    </Modal>
  );
}
