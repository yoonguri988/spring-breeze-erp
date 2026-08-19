// pages/auth/forgotResetPass.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Alert } from "antd";
import {
  SafetyOutlined,
  CheckOutlined,
  CheckCircleFilled,
  LoginOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  updatePassRequest,
  resetUserState,
} from "../../reducers/auth/authReducer";

// 비밀번호 정책: 8자 이상 + 영문/숫자/특수문자 조합 모두 필수 (백엔드 PasswordPolicy와 동일 기준)
const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/;
const REQ_LIST = [
  { key: "len", label: "8자 이상", test: (pw) => pw.length >= 8 },
  { key: "alpha", label: "영문 포함", test: (pw) => /[a-zA-Z]/.test(pw) },
  { key: "num", label: "숫자 포함", test: (pw) => /[0-9]/.test(pw) },
  {
    key: "special",
    label: "특수문자 포함",
    test: (pw) => SPECIAL_CHAR_REGEX.test(pw),
  },
];

const LEVELS = [
  { percent: 0, color: "#e5e7eb", label: "" },
  { percent: 33, color: "var(--sb-red)", label: "약함" },
  { percent: 66, color: "var(--sb-amber)", label: "보통" },
  { percent: 100, color: "var(--sb-green)", label: "강함" },
];

export default function ForgotResetPassPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  // 이메일로 발송된 재설정 링크의 쿼리스트링(?token=...)에서 resetToken을 읽는다.
  const { token } = router.query;

  const { loading, error, success } = useSelector((state) => state.auth);

  const [form] = Form.useForm();
  const [pw, setPw] = useState("");
  const [done, setDone] = useState(false);
  const prevLoading = useRef(false);

  // confirm 단계에서 남은 success 플래그가 그대로 남아있으면 이 페이지 진입 즉시
  // "완료" 상태로 오인될 수 있으므로 진입 시 한 번 초기화합니다.
  useEffect(() => {
    dispatch(resetUserState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (prevLoading.current && !loading && !error && success) {
      setDone(true);
      setTimeout(() => router.replace("/auth/login"), 2500);
    }
    prevLoading.current = loading;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const level = useMemo(() => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[a-zA-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[!@#$%^&*_-]/.test(pw)) s++;
    return Math.min(s <= 1 ? 1 : s <= 2 ? 2 : 3, 3);
  }, [pw]);

  const [localError, setLocalError] = useState("");

  const onFinish = (values) => {
    setLocalError("");
    if (!token) {
      setLocalError(
        "유효하지 않은 접근입니다. 이메일로 받은 링크를 다시 확인해주세요.",
      );
      return;
    }
    if (
      values.newPass.length < 8 ||
      !/[a-zA-Z]/.test(values.newPass) ||
      !/[0-9]/.test(values.newPass) ||
      !SPECIAL_CHAR_REGEX.test(values.newPass)
    ) {
      setLocalError("8자 이상, 영문·숫자·특수문자를 모두 포함해야 합니다.");
      return;
    }
    if (values.newPass !== values.newPassConfirm) {
      setLocalError("비밀번호가 일치하지 않습니다.");
      return;
    }
    dispatch(
      updatePassRequest({
        resetToken: token,
        newPass: values.newPass,
        newPassConfirm: values.newPassConfirm,
      }),
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        boxSizing: "border-box",
        background:
          "linear-gradient(150deg, #eff4ff 0%, #f5f6f8 60%, #f0fdf4 100%)",
      }}
    >
      <div className="rp-wrap">
        <div className="rp-brand">
          <div className="rp-mark">S</div>
          <span className="rp-name">SBerp</span>
        </div>

        <div className="rp-card">
          {!done ? (
            <div id="stepForm">
              <div className="rp-icon-ring">
                <SafetyOutlined />
              </div>
              <h1 className="rp-h">비밀번호 변경</h1>
              <p className="rp-sub">보안을 위해 비밀번호를 변경해 주세요.</p>

              {token ? (
                <div className="rp-user">
                  <div className="rp-user-av">
                    <SafetyOutlined />
                  </div>
                  <div>
                    <div className="rp-user-name">
                      이메일 인증 링크로 접속됨
                    </div>
                    <div className="rp-user-sub">
                      새 비밀번호를 설정하면 바로 적용됩니다.
                    </div>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <span className="sb-badge sb-badge--blue">
                      본인확인 완료
                    </span>
                  </div>
                </div>
              ) : (
                router.isReady && (
                  <Alert
                    className="a-alert on"
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    message="유효하지 않은 접근입니다. 이메일로 받은 링크를 통해 다시 시도해주세요."
                    style={{ marginBottom: 16 }}
                  />
                )
              )}

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
              >
                <Form.Item
                  label={<span className="fl">새 비밀번호</span>}
                  name="newPass"
                  rules={[
                    { required: true, message: "새 비밀번호를 입력하세요." },
                  ]}
                >
                  <Input.Password
                    className="fi"
                    size="large"
                    placeholder="8자 이상, 영문 + 숫자 + 특수문자 포함"
                    autoComplete="new-password"
                    onChange={(e) => setPw(e.target.value)}
                  />
                </Form.Item>

                <div className="pw-bar-wrap">
                  <div
                    className="pw-bar"
                    style={{
                      width: `${LEVELS[level].percent}%`,
                      background: LEVELS[level].color,
                    }}
                  />
                </div>
                <div className="pw-lbl" style={{ color: LEVELS[level].color }}>
                  {LEVELS[level].label}
                </div>

                <div className="pw-reqs">
                  {REQ_LIST.map((r) => {
                    const ok = r.test(pw);
                    return (
                      <span key={r.key} className={`pw-req${ok ? " ok" : ""}`}>
                        {ok ? <CheckCircleFilled /> : null} {r.label}
                      </span>
                    );
                  })}
                </div>

                <Form.Item
                  label={<span className="fl">비밀번호 확인</span>}
                  name="newPassConfirm"
                  rules={[
                    {
                      required: true,
                      message: "비밀번호를 한 번 더 입력하세요.",
                    },
                  ]}
                >
                  <Input.Password
                    className="fi"
                    size="large"
                    placeholder="새 비밀번호를 한 번 더 입력"
                    autoComplete="new-password"
                  />
                </Form.Item>

                {(localError || error) && (
                  <Alert
                    className="a-alert on"
                    type="error"
                    showIcon
                    message={
                      localError ||
                      (typeof error === "string"
                        ? error
                        : "비밀번호 변경 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.")
                    }
                  />
                )}

                <Button
                  className="a-btn"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={router.isReady && !token}
                  icon={<CheckOutlined />}
                  block
                >
                  비밀번호 변경 완료
                </Button>
              </Form>
            </div>
          ) : (
            <div id="stepSuccess" style={{ textAlign: "center" }}>
              <div className="rp-check-ring">
                <CheckOutlined />
              </div>
              <div className="rp-success-h">비밀번호 변경 완료!</div>
              <div className="rp-success-sub">
                새 비밀번호가 설정되었습니다.
                <br />
                로그인 페이지에서 다시 로그인해 주세요.
              </div>
              <Button
                className="a-btn"
                type="primary"
                icon={<LoginOutlined />}
                block
                onClick={() => router.replace("/auth/login")}
              >
                로그인 페이지로 이동
              </Button>
              <div className="rp-countdown">
                잠시 후 로그인 페이지로 이동합니다…
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
