// pages/auth/login.js
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Alert, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
  LoginOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import AuthLayout from "../../components/AuthLayout";
import {
  loginRequest,
  confirmRequest,
  resetUserState,
} from "../../reducers/auth/authReducer";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, success, accessToken } = useSelector(
    (state) => state.auth,
  );

  const [section, setSection] = useState("login"); // 'login' | 'forgot'
  const [forgotForm] = Form.useForm();

  const prevLoading = useRef(false);

  // accessToken, refreshToken 이 모두 만료된 상태에서 api 호출 시
  // api/axios.js 인터셉터가 "/auth/login?reason=session_expired" 로 강제 이동시킨 경우 안내
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.reason === "session_expired") {
      message.warning("로그인 정보가 없습니다. 다시 로그인해 주세요.");
      // 새로고침 시 메시지가 다시 뜨지 않도록 쿼리스트링 정리
      const { reason, ...rest } = router.query;
      router.replace({ pathname: "/auth/login", query: rest }, undefined, {
        shallow: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.reason]);

  // 로그인 성공(accessToken 발급) → 메인으로 이동
  // 본인 확인 성공(success) → 비밀번호 재설정 페이지로 이동
  useEffect(() => {
    if (prevLoading.current && !loading && !error) {
      if (section === "login" && accessToken) {
        router.replace("/");
      } else if (section === "forgot" && success) {
        const { empNo, empEmail } = forgotForm.getFieldsValue();
        router.push({
          pathname: "/auth/forgotResetPass",
          query: { empNo, empEmail },
        });
      }
    }
    prevLoading.current = loading;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const switchSection = (next) => {
    dispatch(resetUserState());
    setSection(next);
  };

  const onFinishLogin = (values) => {
    dispatch(
      loginRequest({
        empEmail: values.empEmail,
        empPass: values.empPass,
      }),
    );
  };

  const onFinishForgot = (values) => {
    dispatch(
      confirmRequest({
        empNo: values.empNo,
        empEmail: values.empEmail,
        empMobile: values.empMobile,
      }),
    );
  };

  const handleMobileInput = (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 7) v = `${v.slice(0, 3)}-${v.slice(3, 7)}-${v.slice(7)}`;
    else if (v.length > 3) v = `${v.slice(0, 3)}-${v.slice(3)}`;
    forgotForm.setFieldsValue({ empMobile: v });
  };

  return (
    <AuthLayout>
      {section === "login" && (
        <div className="asec on" id="secLogin">
          <h1 className="a-h">안녕하세요 👋</h1>
          <p className="a-sub">
            이메일과 비밀번호를 입력하여
            <br />
            SBerp에 로그인하세요.
          </p>

          <Form layout="vertical" onFinish={onFinishLogin} requiredMark={false}>
            <Form.Item
              label={<span className="fl">이메일 주소</span>}
              name="empEmail"
              rules={[
                { required: true, message: "이메일을 입력하세요." },
                {
                  pattern: /^[^\s@]+@[^\s@]+$/,
                  message: "올바른 이메일 형식이 아닙니다.",
                },
              ]}
            >
              <Input
                className="fi"
                size="large"
                placeholder="name@smartbuilder.com"
                prefix={
                  <MailOutlined style={{ color: "var(--sb-ink-faint)" }} />
                }
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              label={<span className="fl">비밀번호</span>}
              name="empPass"
              rules={[{ required: true, message: "비밀번호를 입력하세요." }]}
            >
              <Input.Password
                className="fi"
                size="large"
                placeholder="비밀번호 입력"
                prefix={
                  <LockOutlined style={{ color: "var(--sb-ink-faint)" }} />
                }
                autoComplete="current-password"
              />
            </Form.Item>

            {section === "login" && error && (
              <Alert
                className="a-alert on"
                type="error"
                showIcon
                message={
                  typeof error === "string"
                    ? error
                    : "이메일 또는 비밀번호가 올바르지 않습니다."
                }
              />
            )}

            <button
              type="button"
              className="a-link"
              style={{ display: "block", marginBottom: 14 }}
              onClick={() => switchSection("forgot")}
            >
              비밀번호를 잊으셨나요?
            </button>

            <Button
              className="a-btn"
              type="primary"
              htmlType="submit"
              loading={section === "login" && loading}
              icon={<LoginOutlined />}
              block
            >
              로그인
            </Button>
          </Form>

          <div className="a-demo">
            <p>
              <InfoCircleOutlined /> 데모 계정
              <br />
              시스템 관리자 이메일 <code>a@a</code> / 비밀번호 <code>1</code>
              <br />
              관리자 이메일 <code>b@b</code> / 비밀번호 <code>1</code>
              <br />
              사용자 이메일 <code>c@c</code> / 비밀번호 <code>1</code>
            </p>
          </div>
        </div>
      )}

      {section === "forgot" && (
        <div className="asec on" id="secForgot">
          <button
            type="button"
            className="a-back"
            onClick={() => switchSection("login")}
          >
            <ArrowLeftOutlined /> 로그인으로 돌아가기
          </button>
          <h1 className="a-h">비밀번호 찾기</h1>
          <p className="a-sub">
            사원번호 · 이메일 · 휴대폰 번호가
            <br />
            등록된 정보와 일치하면 재설정 페이지로 이동합니다.
          </p>

          <Form
            layout="vertical"
            form={forgotForm}
            onFinish={onFinishForgot}
            requiredMark={false}
          >
            <Form.Item
              label={<span className="fl">사원번호</span>}
              name="empNo"
              rules={[{ required: true, message: "사원번호를 입력하세요." }]}
            >
              <Input
                className="fi"
                size="large"
                placeholder="E1001"
                prefix={
                  <UserOutlined style={{ color: "var(--sb-ink-faint)" }} />
                }
                style={{ textTransform: "uppercase" }}
              />
            </Form.Item>

            <Form.Item
              label={<span className="fl">이메일 주소</span>}
              name="empEmail"
              rules={[
                { required: true, message: "이메일을 입력하세요." },
                {
                  pattern: /^[^\s@]+@[^\s@]+$/,
                  message: "올바른 이메일 형식이 아닙니다.",
                },
              ]}
            >
              <Input
                className="fi"
                size="large"
                placeholder="name@sberp.co.kr"
                prefix={
                  <MailOutlined style={{ color: "var(--sb-ink-faint)" }} />
                }
              />
            </Form.Item>

            <Form.Item
              label={<span className="fl">휴대폰 번호</span>}
              name="empMobile"
              rules={[{ required: true, message: "휴대폰 번호를 입력하세요." }]}
            >
              <Input
                className="fi"
                size="large"
                placeholder="010-0000-0000"
                prefix={
                  <PhoneOutlined style={{ color: "var(--sb-ink-faint)" }} />
                }
                onChange={handleMobileInput}
                maxLength={13}
              />
            </Form.Item>

            {section === "forgot" && error && (
              <Alert
                className="a-alert on"
                type="error"
                showIcon
                message={
                  typeof error === "string"
                    ? error
                    : "입력하신 정보와 일치하는 계정을 찾을 수 없습니다. 다시 확인해 주세요."
                }
              />
            )}

            <Button
              className="a-btn"
              type="primary"
              htmlType="submit"
              loading={section === "forgot" && loading}
              icon={<SafetyCertificateOutlined />}
              block
            >
              본인 확인
            </Button>
          </Form>
        </div>
      )}
    </AuthLayout>
  );
}
