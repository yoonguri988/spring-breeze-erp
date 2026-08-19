// components/Sidebar.js
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const NAV = [
  {
    sectionKey: null,
    items: [
      {
        page: "dashboard",
        href: "/",
        icon: "bi-grid-1x2-fill",
      },
    ],
  },
  {
    sectionKey: "org",
    items: [
      {
        page: "comlist",
        href: "/com/list",
        icon: "bi-building-fill-gear",
        role: "ROOT",
      },
      {
        page: "commypage",
        href: "/com/my",
        icon: "bi-building",
      },
      {
        page: "deptlist",
        href: "/dept/list",
        icon: "bi-diagram-3",
      },
      {
        page: "deptmy",
        href: "/dept/my",
        icon: "bi-tag",
      },
      {
        page: "deptpending",
        href: "/dept/transfer/pending",
        icon: "bi-signpost-split",
        role: "ROLE_ADMIN",
      },
      {
        page: "depttranslog",
        href: "/dept/transfer/log",
        icon: "bi-clock-history",
        role: "ROLE_ADMIN",
      },
    ],
  },
  {
    sectionKey: "hr",
    items: [
      {
        page: "employees",
        href: "/emp/list",
        icon: "bi-people",
      },
      {
        page: "position",
        href: "/pos/list",
        icon: "bi-briefcase",
        role: "ROLE_ADMIN",
      },
      {
        page: "permissions",
        href: "/perm/list",
        icon: "bi-shield-lock",
        role: "ROLE_ADMIN",
      },
      {
        page: "evalperiodlist",
        href: "/eval/period/list",
        icon: "bi-calendar-event",
        role: "ROLE_ADMIN",
      },
      {
        page: "evaldashboard",
        href: "/eval/dashboard",
        icon: "bi-star",
        role: "ROLE_ADMIN",
      },
      {
        page: "evalreport",
        href: "/eval/report/my",
        icon: "bi-file-earmark-bar-graph",
      },
    ],
  },
  {
    sectionKey: "work",
    items: [
      {
        page: "apprlistform",
        href: "/appr/list_form",
        icon: "bi-sliders",
        role: "ROOT",
      },
      {
        page: "apprlistdoc",
        href: "/appr/list_doc",
        icon: "bi-pencil-square",
      },
      {
        page: "projects",
        href: "/proj/proj_list",
        icon: "bi-kanban",
      },
      {
        page: "tasks",
        href: "/proj/task_list",
        icon: "bi-clipboard-check",
      },
      {
        page: "notices",
        href: "/notice/list",
        icon: "bi-megaphone",
      },
    ],
  },
  {
    sectionKey: "asset",
    items: [
      {
        page: "reslist",
        href: "/res/list?keyword=&resType=&resStatus=AVAILABLE",
        icon: "bi-collection",
      },
      {
        page: "resvmy",
        href: "/resv/my",
        icon: "bi-calendar2-check",
      },
      {
        page: "adminresvlist",
        href: "/admin/resv/list?status=WAI",
        icon: "bi-calendar2-event",
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
  const { t } = useTranslation("sidebar");
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
            {group.sectionKey && (
              <div className="sb-nav__section">
                {t(`sections.${group.sectionKey}`)}
              </div>
            )}
            {group.items
              .filter((it) => canShow(it.role, user))
              .map((it) => {
                const tip = t(`items.${it.page}.tip`);
                const label = t(`items.${it.page}.label`, { defaultValue: tip });
                
                return (
                <Link key={it.page} href={it.href} passHref>
                  <a
                    className={
                      "sb-nav__item" + (isActive(it.href) ? " active" : "")
                    }
                    data-page={it.page}
                    data-tip={tip}
                  >
                    <i className={"bi " + it.icon} />
                    <span className="sb-nav__label">{label}</span>
                  </a>
                </Link>
                );
              })}
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
