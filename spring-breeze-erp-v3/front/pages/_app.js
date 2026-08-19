// pages/_app.js
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { wrapper } from "../store/configureStore";
import AppLayout from "../components/AppLayout";
import { loadUserRequest } from "../reducers/auth/authReducer";

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
import "../styles/frappe-gantt.css";

const NO_LAYOUT_PREFIXES = ["/auth"];

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const isBareLayout = NO_LAYOUT_PREFIXES.some((p) =>
    router.pathname.startsWith(p),
  );

  useEffect(() => {
    if (isBareLayout) return;
    dispatch(loadUserRequest());
  }, [dispatch, isBareLayout]);

  if (isBareLayout) {
    // 로그인 / 비밀번호 재설정 등 → AppLayout(사이드바/헤더/푸터) 미적용
    return <Component {...pageProps} />;
  }

  return (
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  );
}

export default wrapper.withRedux(MyApp);
