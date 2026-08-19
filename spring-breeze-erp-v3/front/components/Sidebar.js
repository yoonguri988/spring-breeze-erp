// components/Sidebar.js
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const NAV = [
  {
    section: null,
    items: [
      {
        page: "dashboard",
        tip: "대시보드",
        href: "/",
        icon: "bi-grid-1x2-fill",
      },
    ],
  },
  {
    section: "조직 관리",
    items: [
      {
        page: "comlist",
        tip: "회사 • 부서 관리",
        href: "/com/list",
        icon: "bi-building-fill-gear",
        role: "ROOT",
      },
      {
        page: "commypage",
        tip: "내 회사 정보",
        href: "/com/my",
        icon: "bi-building",
      },
      {
        page: "deptlist",
        tip: "회사 내 부서 조회",
        href: "/dept/list",
        icon: "bi-diagram-3",
      },
      {
        page: "deptmy",
        tip: "내 부서 정보",
        href: "/dept/my",
        icon: "bi-tag",
      },
      {
        page: "deptpending",
        tip: "부서 이관 대상 관리",
        href: "/dept/transfer/pending",
        icon: "bi-signpost-split",
        role: "ROLE_ADMIN",
      },
      {
        page: "depttranslog",
        tip: "부서 이력 관리",
        href: "/dept/transfer/log",
        icon: "bi-clock-history",
        role: "ROLE_ADMIN",
      },
    ],
  },
  {
    section: "인사 관리",
    items: [
      {
        page: "employees",
        tip: "사원 관리",
        label: "사원 정보",
        href: "/emp/list",
        icon: "bi-people",
      },
      {
        page: "position",
        tip: "직급 관리",
        href: "/pos/list",
        icon: "bi-briefcase",
        role: "ROLE_ADMIN",
      },
      {
        page: "permissions",
        tip: "권한 관리",
        href: "/perm/list",
        icon: "bi-shield-lock",
        role: "ROLE_ADMIN",
      },
      {
        page: "evalperiodlist",
        tip: "인사 평가",
        href: "/eval/period/list",
        icon: "bi-calendar-event",
        role: "ROLE_ADMIN",
      },
      {
        page: "evallist",
        tip: "평가 작성",
        href: "/eval/list",
        icon: "bi-star",
        role: "ROLE_ADMIN",
      },
      {
        page: "evalreport",
        tip: "내 평가 리포트",
        href: "/eval/report/my",
        icon: "bi-file-earmark-bar-graph",
      },
    ],
  },
  {
    section: "업무 관리",
    items: [
      {
        page: "apprlistform",
        tip: "전자결재",
        label: "결재 양식 관리",
        href: "/appr/list_form",
        icon: "bi-sliders",
        role: "ROOT",
      },
      {
        page: "apprlistdoc",
        tip: "전자결재",
        label: "전자결재 기안",
        href: "/appr/list_doc",
        icon: "bi-pencil-square",
      },
      {
        page: "projects",
        tip: "프로젝트",
        label: "프로젝트 및 태스크",
        href: "/proj/proj_list",
        icon: "bi-kanban",
      },
      {
        page: "tasks",
        tip: "태스크",
        label: "내 태스크",
        href: "/proj/task_list",
        icon: "bi-clipboard-check",
      },
      {
        page: "notices",
        tip: "공지 관리",
        href: "/notice/list",
        icon: "bi-megaphone",
      },
    ],
  },
  {
    section: "자산 관리",
    items: [
      {
        page: "reslist",
        tip: "자원 관리",
        href: "/res/list?keyword=&resType=&resStatus=AVAILABLE",
        icon: "bi-collection",
      },
      {
        page: "resvmy",
        tip: "내 자원 요청 관리",
        href: "/resv/my",
        icon: "bi-calendar2-check",
      },
      {
        page: "adminresvlist",
        tip: "전체 자원 요청 관리",
        label: "자원 예약 요청 관리",
        href: "/admin/resv/list?status=WAI",
        icon: "bi-calendar2-event",
        role: "ROLE_ADMIN",
      },
    ],
  },
  {
    section: "보안 관리",
    items: [
      {
        page: "adminloginhistory",
        tip: "로그인 이력 관리",
        label: "로그인 이력 관리",
        href: "/admin/security/loginHistory",
        icon: "bi-shield-lock",
        role: "ROLE_ADMIN",
      },
    ],
  },
];

// 백엔드 roles는 AuthResponse.autName 목록(예: "ROOT", "ROLE_ADMIN") 기준.
// 실제 사용 중인 role 문자열에 맞게 조정하세요.
function hasRole(user, role) {
  return Boolean(user?.roles?.includes(role));
}

function canShow(role, user) {
  if (!role) return true;
  if (role === "ROOT") return hasRole(user, "ROOT");
  if (role === "ROLE_ADMIN") return hasRole(user, "ROLE_ADMIN");
  return true;
}

export default function Sidebar() {
  const router = useRouter();
  const { user, accessToken } = useSelector((state) => state.auth);

  const currentPath = router.pathname;
  const isAuthenticated = Boolean(user);

  const isActive = (href) => {
    const path = href.split("?")[0];
    return path === "/" ? currentPath === "/" : currentPath.startsWith(path);
  };

  return (
    <>
      <div className="sb-brand">
        <div className="sb-brand__mark">S</div>
        <div className="sb-brand__name">
          SB<b>erp</b>
        </div>
      </div>

      <nav className="sb-nav" id="sbNav">
        {NAV.map((group, gi) => (
          <React.Fragment key={gi}>
            {group.section && (
              <div className="sb-nav__section">{group.section}</div>
            )}
            {group.items
              .filter((it) => canShow(it.role, user))
              .map((it) => (
                <Link key={it.page} href={it.href} passHref>
                  <a
                    className={
                      "sb-nav__item" + (isActive(it.href) ? " active" : "")
                    }
                    data-page={it.page}
                    data-tip={it.tip}
                  >
                    <i className={"bi " + it.icon} />
                    <span className="sb-nav__label">{it.label || it.tip}</span>
                  </a>
                </Link>
              ))}
          </React.Fragment>
        ))}
      </nav>

      {isAuthenticated && (
        <div className="sb-sidebar__foot">
          <div className="sb-userchip">
            <div className="sb-avatar">{user?.empName?.[0]}</div>
            <div className="sb-userchip__meta">
              <b>{user?.empName}</b>
              <span>{user?.posName}</span>
            </div>
            <i
              className="bi bi-chevron-expand ms-auto sb-nav__label"
              style={{ color: "var(--sb-ink-faint)", fontSize: 14 }}
            />
          </div>
        </div>
      )}
    </>
  );
}
