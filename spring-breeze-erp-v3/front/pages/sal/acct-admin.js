// pages/sal/acct/admin.js
// 직원 급여 수령 계좌 조회/수정 (ROLE_ADMIN) - GET/PUT /api/salacct/{empId}
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Descriptions,
  Button,
  Modal,
  Form,
  Input,
  message,
  Empty,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";

import {
  fetchAcctByEmpIdRequest,
  updateAcctByAdminRequest,
  resetSalAcctState,
  clearAdminAcct,
} from "../../reducers/sal/salAcctReducer";
import EmployeePicker from "../../components/sal/EmployeePicker";

export default function SalAcctAdminPage() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const {
    adminAcct,
    adminAcctLoading,
    adminAcctError,
    loading,
    success,
    error,
  } = useSelector((state) => state.salAcct);

  const [empId, setEmpId] = useState(undefined);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => () => dispatch(clearAdminAcct()), [dispatch]);

  useEffect(() => {
    if (!empId) return;
    dispatch(fetchAcctByEmpIdRequest(empId));
  }, [empId, dispatch]);

  useEffect(() => {
    if (!saving || loading) return;
    if (success) {
      message.success("계좌 정보가 수정되었습니다.");
      setEditing(false);
      setSaving(false);
      dispatch(resetSalAcctState());
      dispatch(fetchAcctByEmpIdRequest(empId));
    } else if (error) {
      message.error(error);
      setSaving(false);
      dispatch(resetSalAcctState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error]);

  const openEdit = () => {
    setEditing(true);
    form.setFieldsValue({
      bankName: adminAcct?.bankName,
      acctNo: adminAcct?.acctNo,
      hldrName: adminAcct?.hldrName,
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      dispatch(updateAcctByAdminRequest({ empId, ...values }));
    } catch (e) {
      // 폼 검증 실패
    }
  };

  return (
    <div className="sb-page">
      <div className="sb-page-head" style={{ marginBottom: 16 }}>
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">급여관리 &gt; 수령계좌 조회</div>
          <h1>직원 급여 수령 계좌 조회/수정</h1>
          <p>
            사원을 검색하면 등록된 급여 수령 계좌 정보를 조회하고 수정할 수
            있습니다.
          </p>
        </div>
      </div>

      <Card>
        <div style={{ marginBottom: 20, maxWidth: 360 }}>
          <EmployeePicker
            value={empId}
            onChange={setEmpId}
            placeholder="사원 이름으로 검색"
          />
        </div>

        {!empId && <Empty description="조회할 사원을 선택해 주세요." />}

        {empId && adminAcctLoading && <p>조회 중...</p>}

        {empId && !adminAcctLoading && adminAcctError && (
          <Empty description="등록된 급여 수령 계좌가 없습니다." />
        )}

        {empId && !adminAcctLoading && adminAcct && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 12,
              }}
            >
              <Button icon={<EditOutlined />} onClick={openEdit}>
                수정
              </Button>
            </div>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="사원">
                {adminAcct.empName}
              </Descriptions.Item>
              <Descriptions.Item label="은행">
                {adminAcct.bankName}
              </Descriptions.Item>
              <Descriptions.Item label="계좌번호">
                {adminAcct.acctNo}
              </Descriptions.Item>
              <Descriptions.Item label="예금주">
                {adminAcct.hldrName}
              </Descriptions.Item>
              <Descriptions.Item label="등록일시">
                {adminAcct.createdAt
                  ? moment(adminAcct.createdAt).format("YYYY-MM-DD HH:mm")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="최종수정일시">
                {adminAcct.updatedAt
                  ? moment(adminAcct.updatedAt).format("YYYY-MM-DD HH:mm")
                  : "-"}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Card>

      <Modal
        title="급여 수령 계좌 수정"
        open={editing}
        onCancel={() => setEditing(false)}
        onOk={handleSubmit}
        okText="수정"
        okButtonProps={{ loading: saving }}
        cancelText="취소"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="bankName"
            label="은행명"
            rules={[{ required: true, message: "은행명을 입력해 주세요." }]}
          >
            <Input maxLength={30} />
          </Form.Item>
          <Form.Item
            name="acctNo"
            label="계좌번호"
            rules={[{ required: true, message: "계좌번호를 입력해 주세요." }]}
          >
            <Input maxLength={30} />
          </Form.Item>
          <Form.Item
            name="hldrName"
            label="예금주명"
            rules={[{ required: true, message: "예금주명을 입력해 주세요." }]}
          >
            <Input maxLength={30} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
