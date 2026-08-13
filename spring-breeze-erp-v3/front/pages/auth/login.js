// pages/auth/login.js
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Alert, Typography } from "antd";
import { MailOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import AuthLayout from "../../components/AuthLayout";
import api from "../../api/axios";

const { Title, Paragraph } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [alertMsg, setAlertMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setAlertMsg("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", values);
      if (typeof window !== "undefined" && data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      router.replace("/");
    } catch (err) {
      setAlertMsg(
        err.response?.status === 401
          ? "이메일 또는 비밀번호가 올바르지 않습니다."
          : "서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="asec on">
        <Title level={2} className="a-h">
          안녕하세요 👋
        </Title>
        <Paragraph className="a-sub">
          이메일과 비밀번호를 입력하여
          <br />
          SBerp에 로그인하세요.
        </Paragraph>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
        >
          <Form.Item
            label="이메일 주소"
            name="username"
            rules={[{ required: true, message: "이메일을 입력하세요." }]}
          >
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="name@smartbuilder.com"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            label="비밀번호"
            name="password"
            rules={[{ required: true, message: "비밀번호를 입력하세요." }]}
          >
            {/* antd Input.Password가 표시/숨기기 눈 아이콘을 자체 제공합니다.
                (별도 showPw state / bi-eye 아이콘 로직 불필요) */}
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="비밀번호 입력"
              autoComplete="current-password"
            />
          </Form.Item>

          {alertMsg && (
            <Alert
              type="error"
              showIcon
              message={alertMsg}
              style={{ marginBottom: 16 }}
            />
          )}

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            icon={!loading && <LoginOutlined />}
          >
            로그인
          </Button>
        </Form>
      </div>
    </AuthLayout>
  );
}
