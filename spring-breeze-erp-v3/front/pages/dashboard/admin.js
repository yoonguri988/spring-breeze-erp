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
  CheckCircleOutlined, ExclamationCircleOutlined, ProjectOutlined, RightOutlined,
} from "@ant-design/icons";
import moment from "moment";

import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

import {
  adminDashboardRequest, resetAdminDashboard, updateAdminTodayAtt, adminRecentNoticesRequest,
} from "../../reducers/dashboard/adminDashboardReducer";

import { checkInRequest, checkOutRequest, resetAttState, } from "../../reducers/att/attReducer";

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
  { key: "aichat", icon: <RobotOutlined />,        label: "규정관리",   path: "/emp/aidoc-admin" },
];

// ─────────────────────────────────────────────
//  프로젝트 리스트 서브 컴포넌트
//  회사/내 프로젝트 카드에서 공통으로 사용
//  각 row: 프로젝트명 + 상태 뱃지 + D-day
// ─────────────────────────────────────────────
const PROJECT_STATUS_TAG = {
  TODO:  { color: "default", label: "대기" },
  DOING: { color: "blue",    label: "진행" },
};

function ProjectList({ projects, onClickItem }) {
  if (!projects || projects.length === 0) {
    return (
      <div style={{ padding: "16px 0" }}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="진행 중인 프로젝트가 없습니다" />
      </div>
    );
  }

  return (
    <div className="adh-proj-list">
      {projects.map((p) => {
        // D-day 계산 (마감일 - 오늘)
        const end = moment(p.endDate);
        const today = moment().startOf("day");
        const dday = end.diff(today, "days");
        const ddayLabel = dday === 0 ? "D-Day" : dday > 0 ? `D-${dday}` : `D+${-dday}`;
        const ddayColor = dday <= 3 ? "var(--sb-red)" : dday <= 7 ? "var(--sb-amber)" : "var(--sb-ink-faint)";

        const statusInfo = PROJECT_STATUS_TAG[p.proStatus] || { color: "default", label: p.proStatus };

        return (
          <div
            key={p.proId}
            className="adh-proj-row"
            onClick={() => onClickItem(p.proId)}
          >
            <div className="adh-proj-main">
              <Tag color={statusInfo.color} style={{ marginRight: 4, fontSize: 10, padding: "0 4px", lineHeight: "16px" }}>
                {statusInfo.label}
              </Tag>
              <span className="adh-proj-name">{p.proName}</span>
            </div>
            <span className="adh-proj-dday" style={{ color: ddayColor }}>
              {ddayLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}

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
    dispatch(adminRecentNoticesRequest());
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

      {/* ═══ 인사말 (페이지 제목) ═══ */}
      <h1 className="adh-greeting">
        안녕하세요, {db.empName || user?.empName || "사용자"} {db.posName || user?.posName || ""}님.
      </h1>

      {/* ═══ Row 1: 출퇴근 + 잔여연차 + 퀵링크 (3분할) ═══ */}
      <div className="adh-top-band">

        {/* 출퇴근 */}
        <div className="adh-clock-card sb-card">
          <div className="adh-today-date">{now.format("YYYY.MM.DD (ddd)")}</div>
          <div className="adh-clock-time">{now.format("HH:mm:ss")}</div>
          <div className="adh-clock-btns">
            {!isCheckedIn ? (
              <Button type="primary" size="large" icon={<LoginOutlined />} onClick={handleCheckIn} loading={att.loading}>
                출근하기
              </Button>
            ) : !isCheckedOut ? (
              <>
                <Tag color={statusInfo.color} style={{ fontSize: 12, padding: "2px 8px" }}>
                  {statusInfo.label}
                </Tag>
                <Button size="small" icon={<LogoutOutlined />} onClick={handleCheckOut} loading={att.loading}>
                  퇴근하기
                </Button>
              </>
            ) : (
              <div className="adh-done-row">
                <Tag color="default" style={{ fontSize: 13, padding: "4px 10px" }}>
                  <CheckCircleOutlined /> {todayAtt.checkIn} ~ {todayAtt.checkOut}
                </Tag>
                <button className="adh-link-btn" onClick={() => router.push("/att/dashboard")}>
                  근태 현황 <RightOutlined style={{ fontSize: 10 }} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 잔여 연차 */}
        <div className="adh-leave-card sb-card">
          <div className="adh-leave-label">잔여 연차</div>
          <div className="adh-leave-nums">
            <span className="adh-leave-remaining">{leaveRemaining}</span>
            <span className="adh-leave-sep">/</span>
            <span className="adh-leave-total">{leaveTotal}</span>
          </div>
          <Progress percent={leavePercent} size="small" showInfo={false} strokeColor="var(--sb-accent)" />
          <button className="adh-link-btn" style={{ marginTop: 8 }} onClick={() => router.push("/appr/docs/write")}>
            휴가 신청 <RightOutlined style={{ fontSize: 10 }} />
          </button>
        </div>

        {/* 퀵 링크 (3×2) */}
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
            {db.recentNotices.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="공지사항이 없습니다" />
            ) : (
              db.recentNotices.map((n) => (
                <div
                  key={n.bno}
                  className="adh-notice-row"
                  onClick={() => router.push(`/notice/detail?bno=${n.bno}`)}
                >
                  {/* 긴급 뱃지: bcontent에 "긴급" 포함 시 */}
                  {n.bcontent && n.bcontent.includes("긴급") && (
                    <Tag color="red" style={{ marginRight: 0, fontSize: 10, padding: "0 4px", lineHeight: "16px" }}>긴급</Tag>
                  )}
                  <span className="adh-notice-title">{n.btitle}</span>
                  <span className="adh-notice-date">
                    {n.createdAt ? moment(n.createdAt).format("MM/DD") : ""}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ═══ Row 3: D + F(회사) + F(내) — 3분할 ═══ */}
      <div className="adh-work-band">

        {/* D: 처리 필요 (1칸) */}
        <div className="adh-pending-card sb-card db-card">
          <div className="sb-card__head">
            <h2><ExclamationCircleOutlined /> 처리 필요</h2>
            <button className="adh-link-btn" onClick={() => router.push("/appr/docs?tab=todo")}>결재함 <RightOutlined style={{ fontSize: 10 }} /></button>
          </div>
          <div className="sb-card__body--flush">
            <div
              className="adh-pending-row"
              style={{ cursor: "pointer" }}
              onClick={() => router.push("/appr/docs?tab=todo")}
            >
              <span className="adh-pending-label"><FileTextOutlined /> 결재 대기</span>
              <span className="adh-pending-count">{db.pendingApprovalCount}건</span>
            </div>
            <div
              className="adh-pending-row"
              style={{ cursor: "pointer" }}
              onClick={() => router.push("/appr/docs?tab=history&status=ING")}
            >
              <span className="adh-pending-label"><FileTextOutlined /> 내 기안 진행 중</span>
              <span className="adh-pending-count">{db.myDraftingCount}건</span>
            </div>
          </div>
        </div>

        {/* F-1: 회사 전체 프로젝트 (마감 임박순) */}
        <div className="adh-project-card sb-card db-card">
          <div className="sb-card__head">
            <h2><ProjectOutlined /> 회사 프로젝트</h2>
            <button className="adh-link-btn" onClick={() => router.push("/proj/proj_list")}>전체보기 <RightOutlined style={{ fontSize: 10 }} /></button>
          </div>
          <div className="sb-card__body--flush">
            <ProjectList projects={db.companyProjects} onClickItem={(id) => router.push(`/proj/proj_detail?proId=${id}`)} />
          </div>
        </div>

        {/* F-2: 내 프로젝트 (내가 리더이거나 멤버) */}
        <div className="adh-project-card sb-card db-card">
          <div className="sb-card__head">
            <h2><ProjectOutlined /> 내 프로젝트</h2>
            <button className="adh-link-btn" onClick={() => router.push("/proj/task_list")}>전체보기 <RightOutlined style={{ fontSize: 10 }} /></button>
          </div>
          <div className="sb-card__body--flush">
            <ProjectList projects={db.myProjects} onClickItem={(id) => router.push(`/proj/proj_detail?proId=${id}`)} />
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