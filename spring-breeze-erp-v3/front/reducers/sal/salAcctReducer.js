// reducers/sal/salAcctReducer.js
// 급여 수령 계좌(SalAcct) 관리 - /api/salacct
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 본인 계좌
  myAcct: null,
  myAcctLoading: false,
  myAcctError: null, // 404(미등록)면 "미등록" 안내로 사용

  // 관리자 - 특정 직원 계좌 조회
  adminAcct: null,
  adminAcctLoading: false,
  adminAcctError: null,

  // 공통(등록/수정 처리)
  loading: false,
  error: null,
  success: false,
};

const salAcctReducer = createSlice({
  name: "salAcct",
  initialState,
  reducers: {
    // --- 상태 초기화 ---
    resetSalAcctState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    clearAdminAcct: (state) => {
      state.adminAcct = null;
      state.adminAcctError = null;
    },

    // --- 본인 계좌 조회 ---
    fetchMyAcctRequest: (state) => {
      state.myAcctLoading = true;
      state.myAcctError = null;
    },
    fetchMyAcctSuccess: (state, action) => {
      state.myAcctLoading = false;
      state.myAcct = action.payload;
    },
    fetchMyAcctFailure: (state, action) => {
      state.myAcctLoading = false;
      state.myAcct = null;
      state.myAcctError = action.payload;
    },

    // --- 본인 계좌 등록 ---
    registerMyAcctRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    registerMyAcctSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.myAcct = action.payload;
    },
    registerMyAcctFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- 본인 계좌 수정 ---
    updateMyAcctRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    updateMyAcctSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.myAcct = action.payload;
    },
    updateMyAcctFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- 관리자 - 특정 직원 계좌 조회 ---
    fetchAcctByEmpIdRequest: (state) => {
      state.adminAcctLoading = true;
      state.adminAcctError = null;
      state.adminAcct = null;
    },
    fetchAcctByEmpIdSuccess: (state, action) => {
      state.adminAcctLoading = false;
      state.adminAcct = action.payload;
    },
    fetchAcctByEmpIdFailure: (state, action) => {
      state.adminAcctLoading = false;
      state.adminAcctError = action.payload;
    },

    // --- 관리자 - 특정 직원 계좌 수정 ---
    updateAcctByAdminRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    updateAcctByAdminSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.adminAcct = action.payload;
    },
    updateAcctByAdminFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  resetSalAcctState,
  clearAdminAcct,
  fetchMyAcctRequest,
  fetchMyAcctSuccess,
  fetchMyAcctFailure,
  registerMyAcctRequest,
  registerMyAcctSuccess,
  registerMyAcctFailure,
  updateMyAcctRequest,
  updateMyAcctSuccess,
  updateMyAcctFailure,
  fetchAcctByEmpIdRequest,
  fetchAcctByEmpIdSuccess,
  fetchAcctByEmpIdFailure,
  updateAcctByAdminRequest,
  updateAcctByAdminSuccess,
  updateAcctByAdminFailure,
} = salAcctReducer.actions;

export default salAcctReducer.reducer;
