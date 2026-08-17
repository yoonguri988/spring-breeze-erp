// pages/emp/edit.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
} from "antd";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import {
  detailEmpRequest,
  updateEmpRequest,
  checkEmailRequest,
  checkMobileRequest,
  checkEmpNoRequest,
  resetEmpState,
} from "../../reducers/emp/empReducer";
import { listPosRequest } from "../../reducers/pos/posReducer";

const STATUS_OPTIONS = [
  { value: "재직", label: "재직" },
  { value: "휴직", label: "휴직" },
  { value: "퇴직", label: "퇴직" },
];

export default function EmpEditPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { empId } = router.query;
  const [form] = Form.useForm();

  const { currentEmp, checkResult, loading, success, error } = useSelector(
    (state) => state.emp
  );
  const { posList } = useSelector((state) => state.pos);

  // 데이터 로드
  useEffect(() => {
    if (!empId) return;
    dispatch(detailEmpRequest(Number(empId)));
    dispatch(listPosRequest());
  }, [dispatch, empId]);

  // 폼에 기존 값 세팅
  useEffect(() => {
    if (!currentEmp) return;
    form.setFieldsValue({
      empNo: currentEmp.empNo,
      empName: currentEmp.empName,
      empEmail: currentEmp.empEmail,
      empMobile: currentEmp.empMobile,
      posId: currentEmp.posId,
      empStatus: currentEmp.empStatus,
      hireDate: currentEmp.hireDate ? dayjs(currentEmp.hireDate) : null,
    });
  }, [currentEmp, form]);

  // 수정 결과
  useEffect(() => {
    if (success) {
      message.success("사원 정보가 수정되었습니다.");
      dispatch(resetEmpState());
      router.push({ pathname: "/emp/detail", query: { empId } });
    } else if (error) {
      message.error(error);
      dispatch(resetEmpState());
    }
  }, [success, error, dispatch, router, empId]);

  // 중복검사 (원본 값과 같으면 스킵)
  const handleBlur = (field, value, original, requestAction) => {
    if (!value || value === original) return;
    dispatch(requestAction(value));
  };

  const checkHelp = (field) => {
    const val = checkResult[field];
    if (val === true) return { validateStatus: "success", help: "사용 가능합니다." };
    if (val === false) return { validateStatus: "error", help: "이미 사용 중입니다." };
    return {};
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (
        checkResult.email === false ||
        checkResult.mobile === false ||
        checkResult.empNo === false
      ) {
        message.warning("중복된 항목이 있습니다.");
        return;
      }
      dispatch(
        updateEmpRequest({
          empId: Number(empId),
          ...values,
          hireDate: values.hireDate?.format("YYYY-MM-DD"),
        })
      );
    } catch (e) {}
  };

  //////
  return (
    <div className="sb-page">
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
            조직 관리 &gt; 사원관리 &gt; 정보 수정
          </div>
          <h1>사원 정보 수정</h1>
          <p>기존 사원의 정보를 수정합니다.</p>
        </div>
        <div className="sb-page-head__actions">
          <Link href={{ pathname: "/emp/detail", query: { empId } }}>
            <Button icon={<ArrowLeftOutlined />}>상세로</Button>
          </Link>
        </div>
      </div>

      <Card title="사원 정보" loading={loading && !currentEmp}>
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 640 }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="empNo"
            label="사번"
            rules={[{ required: true }]}
            {...checkHelp("empNo")}
          >
            <Input
              onBlur={(e) =>
                handleBlur(
                  "empNo",
                  e.target.value.trim(),
                  currentEmp?.empNo,
                  checkEmpNoRequest
                )
              }
            />
          </Form.Item>

          <Form.Item
            name="empName"
            label="이름"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="empEmail"
            label="이메일"
            rules={[{ required: true }, { type: "email" }]}
            {...checkHelp("email")}
          >
            <Input
              onBlur={(e) =>
                handleBlur(
                  "email",
                  e.target.value.trim(),
                  currentEmp?.empEmail,
                  checkEmailRequest
                )
              }
            />
          </Form.Item>

          <Form.Item
            name="empMobile"
            label="연락처"
            rules={[{ required: true }]}
            {...checkHelp("mobile")}
          >
            <Input
              onBlur={(e) =>
                handleBlur(
                  "mobile",
                  e.target.value.trim(),
                  currentEmp?.empMobile,
                  checkMobileRequest
                )
              }
            />
          </Form.Item>

          <Form.Item
            name="posId"
            label="직급"
            rules={[{ required: true }]}
          >
            <Select
              options={posList.map((p) => ({
                value: p.posId,
                label: p.posName,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="empStatus"
            label="재직상태"
            rules={[{ required: true }]}
          >
            <Select options={STATUS_OPTIONS} />
          </Form.Item>

          <Form.Item
            name="hireDate"
            label="입사일"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Link href={{ pathname: "/emp/detail", query: { empId } }}>
              <Button>취소</Button>
            </Link>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
              loading={loading}
            >
              수정
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
