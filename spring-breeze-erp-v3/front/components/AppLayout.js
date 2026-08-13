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
  const { user, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    const saved = localStorage.getItem(LS_LAYOUT_KEY);
    if (saved === "rail" || saved === "standard") setLayoutMode(saved);
  }, []);

  // AppLayout은 /auth/* 를 제외한 "로그인이 필요한" 페이지에만 씌워지므로
  // accessToken이 없으면 로그인 페이지로 돌려보낸다.
  useEffect(() => {
    if (!accessToken) {
      router.replace("/auth/login");
    }
  }, [accessToken, router]);

  const toggleLayout = () => {
    setLayoutMode((cur) => {
      const next = cur === "rail" ? "standard" : "rail";
      localStorage.setItem(LS_LAYOUT_KEY, next);
      return next;
    });
  };

  const isRail = layoutMode === "rail";

  // 리다이렉트되기 전까지 레이아웃이 잠깐 보이는 걸 막기 위한 가드
  if (!accessToken) {
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
        <Content className="sb-content">{children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default AppLayout;