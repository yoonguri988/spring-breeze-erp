// pages/emp/add.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, Form, Input, Select, DatePicker, Button, message, } from "antd";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";

import {
  createEmpRequest, checkEmailRequest, checkMobileRequest,
  checkEmpNoRequest, resetEmpState,
} from "../../reducers/emp/empReducer";
import { listPosRequest } from "../../reducers/pos/posReducer";
import { fetchDeptFlatRequest } from "../../reducers/dept/deptReducer";

export default function EmpAddPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { checkResult, loading, success, error } = useSelector((state) => state.emp);
  const { user } = useSelector((state) => state.auth);
  const { posList } = useSelector((state) => state.pos);
  const { flatList } = useSelector((state) => state.dept);

  // 직급, 부서 목록 로드
  useEffect(() => {
    dispatch(listPosRequest());
    dispatch(fetchDeptFlatRequest(user?.comId));
  }, [dispatch]);

  // 등록 성공 시 목록으로 이동
  useEffect(() => {
    if (success) {
      message.success("사원이 등록되었습니다.");
      dispatch(resetEmpState());
      router.push("/emp/list");
    } else if (error) {
      message.error(error);
      dispatch(resetEmpState());
    }
  }, [success, error, dispatch, router]);

  // 중복검사 도움말 생성
  const checkHelp = (field) => {
    const val = checkResult[field];
    if (val === true) return { validateStatus: "success", help: "사용 가능합니다." };
    if (val === false) return { validateStatus: "error", help: "이미 사용 중입니다." };
    return {};
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // 중복 차단
      if (checkResult.email === false || checkResult.mobile === false || checkResult.empNo === false) {
        message.warning("중복된 항목이 있습니다. 확인 후 다시 시도하세요.");
        return;
      }
      // 날짜 변환
      const data = {
        ...values,
        hireDate: values.hireDate?.format("YYYY-MM-DD"),
      };
      dispatch(createEmpRequest(data));
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
            조직 관리 &gt; 사원관리 &gt; 사원 등록
          </div>
          <h1>사원 등록</h1>
          <p>새로운 사원을 등록합니다.</p>
        </div>
        <div className="sb-page-head__actions">
          <Link href="/emp/list">
            <Button icon={<ArrowLeftOutlined />}>목록으로</Button>
          </Link>
        </div>
      </div>

      <Card title="사원 정보">
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 640 }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="empNo"
            label="사번"
            rules={[{ required: true, message: "사번을 입력하세요." }]}
            {...checkHelp("empNo")}
          >
            <Input
              placeholder="예: EMP-001"
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v) dispatch(checkEmpNoRequest(v));
              }}
            />
          </Form.Item>

          <Form.Item
            name="empName"
            label="이름"
            rules={[{ required: true, message: "이름을 입력하세요." }]}
          >
            <Input placeholder="이름" />
          </Form.Item>

          <Form.Item
            name="empEmail"
            label="이메일"
            rules={[
              { required: true, message: "이메일을 입력하세요." },
              { type: "email", message: "올바른 이메일 형식이 아닙니다." },
            ]}
            {...checkHelp("email")}
          >
            <Input
              placeholder="email@sberp.com"
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v) dispatch(checkEmailRequest(v));
              }}
            />
          </Form.Item>

          <Form.Item
            name="empMobile"
            label="연락처"
            rules={[{ required: true, message: "연락처를 입력하세요." }]}
            {...checkHelp("mobile")}
          >
            <Input
              placeholder="010-0000-0000"
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v) dispatch(checkMobileRequest(v));
              }}
            />
          </Form.Item>

          <Form.Item
            name="deptId"
            label="부서"
            rules={[{ required: true, message: "부서를 선택하세요." }]}
          >
            <Select
                placeholder="부서 선택"
                options={flatList.map((d) => ({
                  value: d.deptId,
                  label: d.deptName,
                }))}
            />
          </Form.Item>

          <Form.Item
            name="posId"
            label="직급"
            rules={[{ required: true, message: "직급을 선택하세요." }]}
          >
            <Select
              placeholder="직급 선택"
              options={posList.map((p) => ({
                value: p.posId,
                label: p.posName,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="hireDate"
            label="입사일"
            rules={[{ required: true, message: "입사일을 선택하세요." }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Link href="/emp/list">
              <Button>취소</Button>
            </Link>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
              loading={loading}
            >
              등록
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
