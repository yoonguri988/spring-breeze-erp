// components/AuthLayout.js
import React from "react";
import {
  CheckSquareFilled,
  TeamOutlined,
  ProjectOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

export default function AuthLayout({ children }) {
  return (
    <div className="aw" style={{ background: "#fff" }}>
      <aside className="ab">
        <div className="ab-logo">
          <div className="ab-mark">S</div>
          <span className="ab-name">SBerp</span>
        </div>
        <div className="ab-mid">
          <div className="ab-tagline">
            전사 통합 ERP,
            <br />
            하나의 플랫폼으로
          </div>
          <div className="ab-tagline-sub">
            인사·조직 관리부터 전자문서 결재,
            <br />
            프로젝트·자원예약까지 모두 한 곳에서
          </div>
          <div className="ab-feats">
            <div className="ab-feat">
              <CheckSquareFilled />
              <span>전자문서 · 결재 관리</span>
            </div>
            <div className="ab-feat">
              <TeamOutlined />
              <span>인사 · 조직 · 권한 관리</span>
            </div>
            <div className="ab-feat">
              <ProjectOutlined />
              <span>프로젝트 · 태스크 관리</span>
            </div>
            <div className="ab-feat">
              <CalendarOutlined />
              <span>자원 · 공간 예약관리</span>
            </div>
          </div>
        </div>
        <div className="ab-foot">© 2026 SBerp · All rights reserved.</div>
      </aside>
      <main className="ap">
        <div className="ap-wrap">{children}</div>
      </main>
    </div>
  );
}
