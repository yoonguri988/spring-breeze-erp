// pages/_app.js
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { wrapper } from "../store/configureStore";
import AppLayout from "../components/AppLayout";
import { loadUserRequest } from "../reducers/auth/authReducer";

import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import { getStoredLanguage } from "../i18n/languageStorage";

// 스타일 (순서 중요: antd → bootstrap(CSS만, 유틸리티 클래스용) → 프로젝트 커스텀 CSS)
// 드롭다운/모달 등 JS로 동작하는 컴포넌트는 전부 antd를 쓰므로
// bootstrap.bundle.min.js(JS)는 로드하지 않습니다.
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";
import "../styles/css/auth.css";
import "../styles/css/company.css";
import "../styles/css/appr.css";
import "../styles/css/dashboard.css";
import "../styles/css/dashboard-admin.css";
import "../styles/css/dashboard-exec.css";
import "../styles/css/dashboard-sysadmin.css";
import "../styles/css/dept.css";
import "../styles/css/emp.css";
import "../styles/css/my.css";
import "../styles/css/notice.css";
import "../styles/css/perm.css";
import "../styles/css/project.css";
import "../styles/css/resv.css";
import "../styles/css/sal-ai-chat.css";
import "../styles/frappe-gantt.css";

const NO_LAYOUT_PREFIXES = ["/auth"];
// 404/500/_error는 로그인 여부와 무관하게 떠야 하므로 AppLayout(사이드바/헤더) 밖에서 렌더링합니다.
// (AppLayout은 accessToken이 없으면 /auth/login으로 리다이렉트하므로,
//  AppLayout 안에 두면 비로그인 사용자가 404를 볼 새도 없이 로그인 페이지로 튕겨 나갑니다.)
const NO_LAYOUT_EXACT = ["/404", "/500", "/_error"];

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const isBareLayout =
    NO_LAYOUT_PREFIXES.some((p) => router.pathname.startsWith(p)) ||
    NO_LAYOUT_EXACT.includes(router.pathname);

  useEffect(() => {
    if (isBareLayout) return;
    dispatch(loadUserRequest());
  }, [dispatch, isBareLayout]);

  // 최초 하이드레이션은 항상 기본 언어(ko)로 서버와 일치시킨 뒤,
  // 마운트 이후에 쿠키에 저장된 사용자의 언어 설정을 반영합니다.
  // (i18n/index.js 상단 설명 참고 — 하이드레이션 불일치 방지 목적)
  useEffect(() => {
    const stored = getStoredLanguage();
    if (stored !== i18n.language) {
      i18n.changeLanguage(stored);
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = stored;
    }
  }, []);

  if (isBareLayout) {
    // 로그인 / 비밀번호 재설정 등 → AppLayout(사이드바/헤더/푸터) 미적용
    return (
      <I18nextProvider i18n={i18n}>
        <Component {...pageProps} />
      </I18nextProvider>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </I18nextProvider>
  );
}

export default wrapper.withRedux(MyApp);
