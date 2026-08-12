// components/Sidebar.js
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// TODO: reducer/saga 연동 전까지 임시 목데이터. 완성되면 useSelector로 교체.
const mockAuth = {
  isAuthenticated: true,
  isRoot: false,
  isAdmin: true,
  empName: "홍길동",
  posName: "팀장",
};

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
        role: "root",
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
        href: "/dept/detail",
        icon: "bi-tag",
      },
      {
        page: "deptpending",
        tip: "부서 이관 대상 관리",
        href: "/dept/transfer/pending",
        icon: "bi-signpost-split",
        role: "admin",
      },
      {
        page: "depttranslog",
        tip: "부서 이력 관리",
        href: "/dept/transfer/log",
        icon: "bi-clock-history",
        role: "admin",
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
        role: "admin",
      },
      {
        page: "permissions",
        tip: "권한 관리",
        href: "/perm/list",
        icon: "bi-shield-lock",
        role: "admin",
      },
      {
        page: "evalperiodlist",
        tip: "인사 평가",
        href: "/eval/period/list",
        icon: "bi-calendar-event",
        role: "admin",
      },
      {
        page: "evallist",
        tip: "평가 작성",
        href: "/eval/list",
        icon: "bi-star",
        role: "admin",
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
        role: "root",
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
        role: "admin",
      },
    ],
  },
];

function canShow(role) {
  if (!role) return true;
  if (role === "root") return mockAuth.isRoot;
  if (role === "admin") return mockAuth.isAdmin || mockAuth.isRoot;
  return true;
}

export default function Sidebar() {
  const router = useRouter();
  const currentPath = router.pathname;

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
              .filter((it) => canShow(it.role))
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

      {mockAuth.isAuthenticated && (
        <div className="sb-sidebar__foot">
          <div className="sb-userchip">
            <div className="sb-avatar">{mockAuth.empName?.[0]}</div>
            <div className="sb-userchip__meta">
              <b>{mockAuth.empName}</b>
              <span>{mockAuth.posName}</span>
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
