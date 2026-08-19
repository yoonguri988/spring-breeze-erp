// components/ConfirmDeleteModal.js

import { Modal } from "antd";

export default function ProjDeleteModal({
  itemName,
  open,
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <Modal
      title="정말 삭제하시겠습니까?"
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="삭제"
      cancelText="취소"
      okButtonProps={{ danger: true, loading }}
    >
      <p style={{ textAlign: "center" }}>
        {itemName}을(를) 삭제하면 관련 데이터가
        <br />
        모두 삭제되며, 복구할 수 없습니다.
        <br />
        계속 진행하시겠습니까?
      </p>
    </Modal>
  );
}