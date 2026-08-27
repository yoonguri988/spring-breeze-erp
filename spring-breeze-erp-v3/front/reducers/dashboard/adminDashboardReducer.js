// reducers/dashboard/adminDashboardReducer.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {

  // A 영역: 사원 프로필
  empName: "",
  deptName: "",
  posName: "",

  // A 영역: 오늘 내 근태
  todayAtt: null,
  leaveTotalDays: 0,
  leaveUsedDays: 0,
  leaveRemainingDays: 0,

  // B 영역: 전사 출퇴근 통계
  totalEmployees: 0,
  presentCount: 0,
  lateCount: 0,
  absentCount: 0,
  leaveCount: 0,

  // C 영역: 주간 근태 추이
  weeklyStats: [],

  // D 영역: 결재 대기 건수
  pendingApprovalCount: 0,

  // 공통
  loading: false,
  error: null,
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {

    resetAdminDashboard: () => initialState,

    adminDashboardRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    adminDashboardSuccess: (state, action) => {
      state.loading = false;
      const p = action.payload;

      state.empName            = p.empName || "";
      state.deptName           = p.deptName || "";
      state.posName            = p.posName || "";
      state.todayAtt           = p.todayAtt;
      state.leaveTotalDays     = p.leaveTotalDays;
      state.leaveUsedDays      = p.leaveUsedDays;
      state.leaveRemainingDays = p.leaveRemainingDays;

      state.totalEmployees = p.totalEmployees;
      state.presentCount   = p.presentCount;
      state.lateCount      = p.lateCount;
      state.absentCount    = p.absentCount;
      state.leaveCount     = p.leaveCount;

      state.weeklyStats = p.weeklyStats || [];

      state.pendingApprovalCount = p.pendingApprovalCount;
    },

    adminDashboardFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateAdminTodayAtt: (state, action) => {
      state.todayAtt = action.payload;
    },
  },
});

export const {
  resetAdminDashboard,
  adminDashboardRequest, adminDashboardSuccess, adminDashboardFailure,
  updateAdminTodayAtt,
} = adminDashboardSlice.actions;

export default adminDashboardSlice.reducer;