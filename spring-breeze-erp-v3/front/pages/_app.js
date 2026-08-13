// pages/_app.js
import React from "react";
import { useRouter } from "next/router";
import { wrapper } from "../store/configureStore";
import AppLayout from "../components/AppLayout";

// 스타일 (순서 중요: antd → bootstrap(CSS만, 유틸리티 클래스용) → 프로젝트 커스텀 CSS)
// 드롭다운/모달 등 JS로 동작하는 컴포넌트는 전부 antd를 쓰므로
// bootstrap.bundle.min.js(JS)는 로드하지 않습니다.
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";
import "../styles/css/auth.css";

const NO_LAYOUT_PREFIXES = ["/auth"];

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isBareLayout = NO_LAYOUT_PREFIXES.some((p) =>
    router.pathname.startsWith(p),
  );

  // if (isBareLayout) {
  //   // 로그인 / 비밀번호 재설정 등 → AppLayout(사이드바/헤더/푸터) 미적용
  //   return <Component {...pageProps} />;
  // }

  return (
    <AppLayout initialUser={pageProps.user}>
      <Component {...pageProps} />
    </AppLayout>
  );
}

export default wrapper.withRedux(MyApp);
