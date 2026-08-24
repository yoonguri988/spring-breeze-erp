// reducers/att/attReducer.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // ── 목록  ──
    attList: [],

    // 페이징 정보
    paging: null,

    // ── 개인 기록 ──
    myAttList: [],

    // ── 출퇴근 대시보드 ──
    todayAtt: null,

    // ── 공통 상태 플래그 ──
    loading: false,
    error: null,
    success: false,
};

// ============================================================
//  2. createSlice — action + reducer
// ============================================================
const attSlice = createSlice({
    name: "att",
    initialState,
    reducers: {

        // ── 상태 초기화 ──
        resetAttState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },

        // ── 관리자 근태 목록 조회 ──
        listAttRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        listAttSuccess: (state, action) => {
            state.loading = false;
            state.attList = action.payload.list;
            state.paging = action.payload.paging;
        },
        listAttFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // ── 내 근태 이력 조회 ──
        myAttRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        myAttSuccess: (state, action) => {
            state.loading = false;
            state.myAttList = action.payload;
        },
        myAttFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // ── 출근 여부 ──
        checkInRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        checkInSuccess: (state, action) => {
            state.loading = false;
            state.todayAtt = action.payload;
            state.success = true;
        },
        checkInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // ── 퇴근 여부 ──
        checkOutRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        checkOutSuccess: (state, action) => {
            state.loading = false;
            // action.payload = 퇴근 시간이 기록된 AttendanceResponse
            state.todayAtt = action.payload;
            state.success = true;
        },
        checkOutFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // ── 근태 수정 (관리자) ──
        editAttRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        editAttSuccess: (state, action) => {
            state.loading = false;
            state.success = true;
        },
        editAttFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

// ============================================================
//  3. action creator export
// ============================================================
export const {
    resetAttState,
    listAttRequest, listAttSuccess, listAttFailure,
    myAttRequest, myAttSuccess, myAttFailure,
    checkInRequest, checkInSuccess, checkInFailure,
    checkOutRequest, checkOutSuccess, checkOutFailure,
    editAttRequest, editAttSuccess, editAttFailure,
} = attSlice.actions;

// ============================================================
//  4. reducer export
// ============================================================
export default attSlice.reducer;