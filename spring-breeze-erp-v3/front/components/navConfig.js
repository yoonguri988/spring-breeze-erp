import {
  AppstoreOutlined,
  ApartmentOutlined,
  BankOutlined,
  TagOutlined,
  SwapOutlined,
  HistoryOutlined,
  TeamOutlined,
  SolutionOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  StarOutlined,
  FileTextOutlined,
  ControlOutlined,
  FormOutlined,
  ProjectOutlined,
  CheckSquareOutlined,
  SoundOutlined,
  DatabaseOutlined,
  ScheduleOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";

// require: null(전체 로그인 사용자) | 'admin' | 'root'
export const NAV_SECTIONS = [
  {
    key: "root",
    title: null,
    items: [
      {
        key: "dashboard",
        label: "대시보드",
        icon: AppstoreOutlined,
        href: "/",
        require: null,
      },
    ],
  },
  {
    key: "org",
    title: "조직 관리",
    items: [
      {
        key: "comlist",
        label: "회사 • 부서 관리",
        icon: ApartmentOutlined,
        href: "/com/list",
        require: "root",
      },
      {
        key: "commypage",
        label: "내 회사 정보",
        icon: BankOutlined,
        href: "/com/my",
        require: null,
      },
      {
        key: "deptlist",
        label: "회사 내 부서 조회",
        icon: ApartmentOutlined,
        href: "/dept/list",
        require: null,
      },
      {
        key: "deptmy",
        label: "내 부서 정보",
        icon: TagOutlined,
        href: "/dept/detail",
        require: null,
      },
      {
        key: "deptpending",
        label: "부서 이관 대상 관리",
        icon: SwapOutlined,
        href: "/dept/transfer/pending",
        require: "admin",
      },
      {
        key: "depttranslog",
        label: "부서 이력 관리",
        icon: HistoryOutlined,
        href: "/dept/transfer/log",
        require: "admin",
      },
    ],
  },
  {
    key: "hr",
    title: "인사 관리",
    items: [
      {
        key: "employees",
        label: "사원 정보",
        icon: TeamOutlined,
        href: "/emp/list",
        require: null,
      },
      {
        key: "position",
        label: "직급 관리",
        icon: SolutionOutlined,
        href: "/pos/list",
        require: "admin",
      },
      {
        key: "permissions",
        label: "권한 관리",
        icon: SafetyCertificateOutlined,
        href: "/perm/list",
        require: "admin",
      },
      {
        key: "evalperiodlist",
        label: "인사 평가",
        icon: CalendarOutlined,
        href: "/eval/period/list",
        require: "admin",
      },
      {
        key: "evallist",
        label: "평가 작성",
        icon: StarOutlined,
        href: "/eval/list",
        require: "admin",
      },
      {
        key: "evalreport",
        label: "내 평가 리포트",
        icon: FileTextOutlined,
        href: "/eval/report/my",
        require: null,
      },
    ],
  },
  {
    key: "work",
    title: "업무 관리",
    items: [
      {
        key: "apprlistform",
        label: "결재 양식 관리",
        icon: ControlOutlined,
        href: "/appr/list_form",
        require: "root",
      },
      {
        key: "apprlistdoc",
        label: "전자결재 기안",
        icon: FormOutlined,
        href: "/appr/list_doc",
        require: null,
      },
      {
        key: "projects",
        label: "프로젝트 및 태스크",
        icon: ProjectOutlined,
        href: "/proj/proj_list",
        require: null,
      },
      {
        key: "tasks",
        label: "내 태스크",
        icon: CheckSquareOutlined,
        href: "/proj/task_list",
        require: null,
      },
      {
        key: "notices",
        label: "공지 관리",
        icon: SoundOutlined,
        href: "/notice/list",
        require: null,
      },
    ],
  },
  {
    key: "asset",
    title: "자산 관리",
    items: [
      {
        key: "reslist",
        label: "자원 관리",
        icon: DatabaseOutlined,
        href: "/res/list?keyword=&resType=&resStatus=AVAILABLE",
        require: null,
      },
      {
        key: "resvmy",
        label: "내 자원 요청 관리",
        icon: ScheduleOutlined,
        href: "/resv/my",
        require: null,
      },
      {
        key: "adminresvlist",
        label: "자원 예약 요청 관리",
        icon: FileDoneOutlined,
        href: "/admin/resv/list?status=WAI",
        require: "admin",
      },
    ],
  },
];

// require 값에 따라 노출 가능 여부 판단 (isRoot / isAdmin 대체)
export const isItemVisible = (item, { isRoot, isAdmin }) => {
  if (item.require === "root") return isRoot;
  if (item.require === "admin") return isAdmin || isRoot;
  return true;
};
