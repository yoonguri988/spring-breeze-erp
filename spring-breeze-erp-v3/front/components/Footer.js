// components/Footer.js
import React from "react";
import { Layout } from "antd";

const { Footer: AntFooter } = Layout;

export default function Footer() {
  return (
    <AntFooter className="sb-footer" id="sbFooter">
      <span>© 2026 SBerp 통합 ERP 시스템</span>
      <span className="d-none d-md-inline">v3.0.0</span>
      <a href="#" className="d-none d-md-inline">
        이용약관
      </a>
      <a href="#" className="d-none d-md-inline">
        개인정보처리방침
      </a>
      <span className="ms-auto d-inline-flex align-items-center gap-2">
        <span className="sb-dot" style={{ background: "var(--sb-green)" }} />
        모든 시스템 정상
      </span>
    </AntFooter>
  );
}
