// pages/dashboard/admin.js
// ============================================================
//  SBerp 관리자 대시보드 — v2 compact layout
//
//  Row 1: A+H — 사용자 카드(좌) + 퀵 링크 카드(우)
//  Row 2: B+C+E — 통계(2×2) | 도넛 차트 | 공지(compact)
//  Row 3: D+F — 처리 필요 | 내 프로젝트
//  Row 4: 주간 근태 추이 bar chart
// ============================================================

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Tag, Button, Progress, Spin, Modal, message, Empty,
} from "antd";
import {
  LoginOutlined, LogoutOutlined, TeamOutlined, ClockCircleOutlined,
  FileTextOutlined, CalendarOutlined, BellOutlined, RobotOutlined,
  CheckCircleOutlined, ExclamationCircleOutlined, UserOutlined, ProjectOutlined,
  RightOutlined,
} from "@ant-design/icons";
import moment from "moment";

import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

import {
  adminDashboardRequest, resetAdminDashboard, updateAdminTodayAtt,
} from "../../reducers/dashboard/adminDashboardReducer";
import {
  checkInRequest, checkOutRequest, resetAttState,
} from "../../reducers/att/attReducer";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const STATUS_TAG = {
  NORMAL:      { color: "green",  label: "정상출근" },
  LATE:        { color: "orange", label: "지각" },
  EARLY_LEAVE: { color: "gold",   label: "조퇴" },
  ABSENT:      { color: "red",    label: "미출근" },
  ANNUAL:      { color: "purple", label: "연차" },
  AM_HALF:     { color: "cyan",   label: "오전반차" },
  PM_HALF:     { color: "blue",   label: "오후반차" },
};

const QUICK_LINKS = [
  { key: "emp",    icon: <TeamOutlined />,        label: "사원관리",  path: "/emp/list" },
  { key: "att",    icon: <ClockCircleOutlined />,  label: "근태관리",  path: "/att/admin" },
  { key: "appr",   icon: <FileTextOutlined />,     label: "전자결재",  path: "/appr/docs" },
  { key: "leave",  icon: <CalendarOutlined />,     label: "연차관리",  path: "/att/leave/admin" },
  { key: "notice", icon: <BellOutlined />,         label: "공지사항",  path: "/notice/list" },
  { key: "aichat", icon: <RobotOutlined />,        label: "AI 챗봇",   path: "/emp/aidoc-admin" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation(["common", "att"]);

  const { user } = useSelector((s) => s.auth);
  const db = useSelector((s) => s.adminDashboard);
  const att = useSelector((s) => s.att);

  const [now, setNow] = useState(moment());
  useEffect(() => {
    const timer = setInterval(() => setNow(moment()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(adminDashboardRequest());
    return () => { dispatch(resetAdminDashboard()); };
  }, [dispatch]);

  useEffect(() => {
    if (att.success && att.todayAtt) {
      const ta = att.todayAtt;
      dispatch(updateAdminTodayAtt({
        attId: ta.attId,
        checkIn: ta.checkIn ? moment(ta.checkIn).format("HH:mm") : null,
        checkOut: ta.checkOut ? moment(ta.checkOut).format("HH:mm") : null,
        attStatus: ta.attStatus,
      }));
      message.success(ta.checkOut ? "퇴근 처리되었습니다." : "출근 처리되었습니다.");
      dispatch(resetAttState());
      dispatch(adminDashboardRequest());
    }
  }, [att.success, att.todayAtt, dispatch]);

  const handleCheckIn = () => {
    Modal.confirm({
      title: "출근 확인",
      content: `${now.format("HH:mm")}에 출근 처리합니다.`,
      okText: "출근", cancelText: "취소",
      onOk: () => { dispatch(checkInRequest()); },
    });
  };

  const handleCheckOut = () => {
    Modal.confirm({
      title: "퇴근 확인",
      content: `${now.format("HH:mm")}에 퇴근 처리합니다.`,
      okText: "퇴근", cancelText: "취소",
      onOk: () => { dispatch(checkOutRequest()); },
    });
  };

  // Chart.js — 도넛
  const doughnutData = useMemo(() => ({
    labels: ["출근", "지각", "미출근", "휴가"],
    datasets: [{
      data: [db.presentCount, db.lateCount, db.absentCount, db.leaveCount],
      backgroundColor: ["#16a34a", "#d97706", "#dc2626", "#7c3aed"],
      borderWidth: 0,
    }],
  }), [db.presentCount, db.lateCount, db.absentCount, db.leaveCount]);

  const doughnutOptions = {
    responsive: true, maintainAspectRatio: false, cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}명` } },
    },
  };

  // Chart.js — 주간 bar
  const barData = useMemo(() => ({
    labels: (db.weeklyStats || []).map((d) => moment(d.date).format("MM/DD(ddd)")),
    datasets: [
      { label: "출근",   data: (db.weeklyStats || []).map((d) => d.present), backgroundColor: "#16a34a" },
      { label: "지각",   data: (db.weeklyStats || []).map((d) => d.late),    backgroundColor: "#d97706" },
      { label: "미출근", data: (db.weeklyStats || []).map((d) => d.absent),  backgroundColor: "#dc2626" },
      { label: "휴가",   data: (db.weeklyStats || []).map((d) => d.leave),   backgroundColor: "#7c3aed" },
    ],
  }), [db.weeklyStats]);

  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } } },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, beginAtZero: true, ticks: { stepSize: 5 } },
    },
  };

  const todayAtt = db.todayAtt;
  const isCheckedIn = !!todayAtt?.checkIn;
  const isCheckedOut = !!todayAtt?.checkOut;
  const statusInfo = STATUS_TAG[todayAtt?.attStatus] || STATUS_TAG.ABSENT;

  const leaveTotal = Number(db.leaveTotalDays) || 0;
  const leaveRemaining = Number(db.leaveRemainingDays) || 0;
  const leavePercent = leaveTotal > 0 ? Math.round((leaveRemaining / leaveTotal) * 100) : 0;

  // 최초 로딩 중 (데이터가 아직 한 번도 안 들어온 상태)
  const isInitialLoading = db.loading && !db.empName && !db.error;
  if (isInitialLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="adh-wrap">

      {/* ═══ Row 1: A+H — 사용자(좌) + 퀵 링크(우) ═══ */}
      <div className="adh-top-band">

        <div className="adh-user-bar sb-card">
          {/* 좌: 프로필 */}
          <div className="adh-section adh-user-profile">
            <div className="adh-user-avatar">
              <UserOutlined style={{ fontSize: 22, color: "var(--sb-accent)" }} />
            </div>
            <div className="adh-user-info">
              <div className="adh-user-name">
                {db.empName || user?.empName || "사용자"} <span className="adh-user-suffix">님</span>
              </div>
              <div className="adh-user-meta">{db.deptName || ""} · {db.posName || user?.posName || ""}</div>
            </div>
          </div>

          <div className="adh-divider" />

          {/* 중: 출퇴근 */}
          <div className="adh-section adh-clock-area">
            <div className="adh-today-date">{now.format("YYYY.MM.DD (ddd)")}</div>
            <div className="adh-clock-time">{now.format("HH:mm:ss")}</div>
            <div className="adh-clock-btns">
              {!isCheckedIn ? (
                <Button type="primary" icon={<LoginOutlined />} onClick={handleCheckIn} loading={att.loading} size="small">출근</Button>
              ) : !isCheckedOut ? (
                <>
                  <Tag color={statusInfo.color}>{statusInfo.label} {todayAtt.checkIn}</Tag>
                  <Button icon={<LogoutOutlined />} onClick={handleCheckOut} loading={att.loading} size="small">퇴근</Button>
                </>
              ) : (
                <div className="adh-done-row">
                  <Tag color="default"><CheckCircleOutlined /> {todayAtt.checkIn} ~ {todayAtt.checkOut}</Tag>
                  <button className="adh-link-btn" onClick={() => router.push("/att/dashboard")}>
                    근태 현황 <RightOutlined style={{ fontSize: 10 }} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="adh-divider" />

          {/* 우: 연차 */}
          <div className="adh-section adh-leave-area">
            <div className="adh-leave-label">잔여 연차</div>
            <div className="adh-leave-nums">
              <span className="adh-leave-remaining">{leaveRemaining}</span>
              <span className="adh-leave-sep">/</span>
              <span className="adh-leave-total">{leaveTotal}</span>
            </div>
            <Progress percent={leavePercent} size="small" showInfo={false} strokeColor="var(--sb-accent)" style={{ width: 100 }} />
            <br />
            <button className="adh-link-btn" style={{ marginTop: 4 }} onClick={() => router.push("/appr/docs/write")}>
              휴가 신청 <RightOutlined style={{ fontSize: 10 }} />
            </button>
          </div>
        </div>

        <div className="adh-quick-card sb-card">
          <div className="adh-quick-grid">
            {QUICK_LINKS.map((link) => (
              <button key={link.key} className="adh-quick-btn" onClick={() => router.push(link.path)} title={link.label}>
                <span className="adh-quick-icon">{link.icon}</span>
                <span className="adh-quick-label">{link.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ═══ Row 2: B+C+E ═══ */}
      <div className="adh-mid-band">
        <div className="adh-stat-grid">
          <div className="adh-stat-card adh-stat--present"><div className="adh-stat-label">출근</div><div className="adh-stat-value">{db.presentCount}</div></div>
          <div className="adh-stat-card adh-stat--late"><div className="adh-stat-label">지각</div><div className="adh-stat-value">{db.lateCount}</div></div>
          <div className="adh-stat-card adh-stat--absent"><div className="adh-stat-label">미출근</div><div className="adh-stat-value">{db.absentCount}</div></div>
          <div className="adh-stat-card adh-stat--leave"><div className="adh-stat-label">휴가</div><div className="adh-stat-value">{db.leaveCount}</div></div>
        </div>

        <div className="adh-chart-card sb-card">
          <div className="adh-chart-head">오늘 출결 현황</div>
          <div className="adh-chart-body">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="adh-chart-center">
              <div className="adh-chart-center-num">{db.totalEmployees}</div>
              <div className="adh-chart-center-label">전체</div>
            </div>
          </div>
        </div>

        <div className="adh-notice-card sb-card">
          <div className="adh-notice-head">
            <span><BellOutlined /> 공지사항</span>
            <button className="adh-link-btn" onClick={() => router.push("/notice/list")}>전체보기 <RightOutlined style={{ fontSize: 10 }} /></button>
          </div>
          <div className="adh-notice-list">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="공지 연동 예정" />
          </div>
        </div>
      </div>

      {/* ═══ Row 3: D+F ═══ */}
      <div className="adh-work-band">
        <div className="adh-pending-card sb-card db-card">
          <div className="sb-card__head">
            <h2><ExclamationCircleOutlined /> 처리 필요</h2>
            <button className="adh-link-btn" onClick={() => router.push("/appr/docs?tab=todo")}>결재함 <RightOutlined style={{ fontSize: 10 }} /></button>
          </div>
          <div className="sb-card__body--flush">
            <div className="adh-pending-row">
              <span className="adh-pending-label"><FileTextOutlined /> 결재 대기</span>
              <span className="adh-pending-count">{db.pendingApprovalCount}건</span>
            </div>
          </div>
        </div>

        <div className="adh-project-card sb-card db-card">
          <div className="sb-card__head">
            <h2><ProjectOutlined /> 내 프로젝트</h2>
            <button className="adh-link-btn" onClick={() => router.push("/proj/proj_list")}>전체보기 <RightOutlined style={{ fontSize: 10 }} /></button>
          </div>
          <div className="sb-card__body--flush">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="프로젝트 연동 예정" />
          </div>
        </div>
      </div>

      {/* ═══ Row 4: 주간 bar chart ═══ */}
      {db.weeklyStats?.length > 0 && (
        <div className="adh-weekly-card sb-card">
          <div className="sb-card__head"><h2>주간 근태 추이</h2></div>
          <div className="adh-weekly-body"><Bar data={barData} options={barOptions} /></div>
        </div>
      )}
    </div>
  );
}