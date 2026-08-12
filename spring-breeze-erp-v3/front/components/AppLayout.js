// components/AppLayout.js
import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const { Sider, Content } = Layout;
const LS_LAYOUT_KEY = "sberp.layout"; // "standard" | "rail"

export default function AppLayout({ children }) {
  const [layoutMode, setLayoutMode] = useState("standard");

  useEffect(() => {
    const saved = localStorage.getItem(LS_LAYOUT_KEY);
    if (saved === "rail" || saved === "standard") setLayoutMode(saved);
  }, []);

  const toggleLayout = () => {
    setLayoutMode((cur) => {
      const next = cur === "rail" ? "standard" : "rail";
      localStorage.setItem(LS_LAYOUT_KEY, next);
      return next;
    });
  };

  const isRail = layoutMode === "rail";

  return (
    <Layout className="sb-app" data-layout={layoutMode}>
      <Sider
        className="sb-sidebar"
        id="sbSidebar"
        width={248}
        collapsedWidth={72}
        collapsed={isRail}
        trigger={null} // Header의 자체 토글 버튼을 쓰므로 antd 기본 트리거 숨김
      >
        <Sidebar />
      </Sider>
      <Layout className="sb-main">
        <Header onToggleSidebar={toggleLayout} />
        <Content className="sb-content">{children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
