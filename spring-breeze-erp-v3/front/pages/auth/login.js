// pages/auth/login.js
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Alert, Typography } from "antd";
import { MailOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import AuthLayout from "../../components/AuthLayout";
import { loginRequest } from "../../reducers/auth/authReducer";

const { Title, Paragraph } = Typography;

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [form] = Form.useForm();

  const { loading, error, accessToken } = useSelector((state) => state.auth);

  const onFinish = (values) => {
    dispatch(loginRequest(values)); // { empEmail, empPass }
  };

  useEffect(() => {
    if (accessToken) {
      router.replace("/");
    }
  }, [accessToken, router]);

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

        <Form form={form} layout="vertical" requiredMark={false} onFinish={onFinish}>
          <Form.Item
            label="이메일 주소"
            name="empEmail"
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
            name="empPass"
            rules={[{ required: true, message: "비밀번호를 입력하세요." }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="비밀번호 입력"
              autoComplete="current-password"
            />
          </Form.Item>

          {error && (
            <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />
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