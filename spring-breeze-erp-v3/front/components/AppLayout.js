// components/AppLayout.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const { Sider, Content } = Layout;
const LS_LAYOUT_KEY = "sberp.layout"; // "standard" | "rail"

function AppLayout({ children }) {
  const router = useRouter();
  const [layoutMode, setLayoutMode] = useState("standard");

  // 실제 로그인 상태 (mock 제거)
  const { user, accessToken, initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    const saved = localStorage.getItem(LS_LAYOUT_KEY);
    if (saved === "rail" || saved === "standard") setLayoutMode(saved);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    if (!accessToken) {
      router.replace("/auth/login");
    }
  }, [initialized, accessToken, router]);

  const toggleLayout = () => {
    setLayoutMode((cur) => {
      const next = cur === "rail" ? "standard" : "rail";
      localStorage.setItem(LS_LAYOUT_KEY, next);
      return next;
    });
  };

  const isRail = layoutMode === "rail";

  // 아직 loadUser(쿠키 → accessToken 복원)가 끝나지 않았거나(initialized===false),
  // 끝났는데도 accessToken이 없는 경우(리다이렉트 대상) 모두 레이아웃을 그리지 않는다.
  if (!initialized || !accessToken) {
    return null;
  }

  return (
    <Layout className="sb-app" data-layout={layoutMode}>
      <Sider
        className="sb-sidebar"
        id="sbSidebar"
        theme="light"
        width={248}
        collapsedWidth={72}
        collapsed={isRail}
        trigger={null} // Header의 자체 토글 버튼을 쓰므로 antd 기본 트리거 숨김
      >
        <Sidebar user={user} />
      </Sider>
      <Layout className="sb-main">
        <Header onToggleSidebar={toggleLayout} />
        <Content
          className="sb-content"
          style={{ display: "flex", flexDirection: "column", flex: "1 0 auto" }}
        >
          {children}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default AppLayout;
