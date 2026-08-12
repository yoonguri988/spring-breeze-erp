// components/Header.js
import React from "react";
import Link from "next/link";
import { Layout, Dropdown } from "antd"; // Menu import 제거
import api from "../api/axios";

const { Header: AntHeader } = Layout;

// TODO: reducer/saga 연동 전까지 임시 목데이터. 완성되면 useSelector로 교체.
const mockAuth = {
  isAuthenticated: true,
  isAdmin: true,
  empId: 1,
  empName: "홍길동",
  empEmail: "hong@sberp.com",
};

export default function Header({ onToggleSidebar }) {
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // 서버 로그아웃 실패해도 클라이언트 세션은 정리
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        window.location.href = "/auth/login";
      }
    }
  };

  // 1. Menu 컴포넌트 대신 items 객체 배열 정의
  const menuItems = [
    {
      key: "userinfo",
      disabled: true,
      label: (
        <div className="px-1 py-1">
          <b style={{ fontSize: 13.5 }}>{mockAuth.empName}</b>
          <br />
          <span className="text-faint" style={{ fontSize: 12 }}>
            {mockAuth.empEmail}
          </span>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "profile",
      label: (
        <Link href={`/emp/detail?empId=${mockAuth.empId}`} passHref>
          <a>
            <i className="bi bi-person me-2" />내 프로필
          </a>
        </Link>
      ),
    },
    mockAuth.isAdmin && {
      key: "perm",
      label: (
        <Link href="/perm/list" passHref>
          <a>
            <i className="bi bi-shield-lock me-2" />
            권한 설정
          </a>
        </Link>
      ),
    },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      label: "로그아웃",
      onClick: handleLogout,
    },
  ].filter(Boolean);

  return (
    <AntHeader className="sb-header" id="sbHeader">
      <button
        className="sb-iconbtn"
        id="sbToggleSidebar"
        title="사이드바 접기/펼치기"
        onClick={onToggleSidebar}
      >
        <i className="bi bi-list" />
      </button>

      <div className="sb-header__brand">
        <div
          className="sb-brand__mark"
          style={{ width: 26, height: 26, fontSize: 13 }}
        >
          S
        </div>
        <div className="sb-brand__name" style={{ fontSize: 16 }}>
          SB<b>erp</b>
        </div>
      </div>

      <div className="sb-header__spacer" />

      <div className="sb-header__right">
        {mockAuth.isAuthenticated && (
          /* 2. overlay={menu} 대신 menu={{ items: menuItems }} 로 수정 */
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button
              className="sb-iconbtn"
              style={{ width: "auto", padding: "0 4px" }}
            >
              <span className="sb-avatar" style={{ width: 32, height: 32 }}>
                {mockAuth.empName?.[0]}
              </span>
            </button>
          </Dropdown>
        )}
      </div>
    </AntHeader>
  );
}
