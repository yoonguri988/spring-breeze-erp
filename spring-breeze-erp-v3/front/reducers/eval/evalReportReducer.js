// reducers/evalReportReducer.js
import { createSlice } from "@reduxjs/toolkit";

//초기화 상태(공용)
const initialState={
    //리포트 목록
    reportList: [],

    //리포트 상세
    currentReport: null,

    //공통
    loading: false,
    error: null,
    success: false,
};

//2. 상태 변화
const evalReportReducer=createSlice({
    name: "report",
    initialState,
    reducers: {

        // --- 상태 초기화 ---
        resetReportState : (state)=>{
            state.loading = false;
            state.success = false;
            state.error   = null;
        },
        
        // --- 리포트 목록 조회 ---
        listReportRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        listReportSuccess: (state, action)=>{
            state.loading = false;
            state.reportList = action.payload;
        },
        listReportFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 리포트 상세 조회 ---
        detailReportRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        detailReportSuccess: (state, action)=>{
            state.loading = false;
            state.currentReport = action.payload;
        },
        detailReportFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 내 리포트 조회 ---
        myReportRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        myReportSuccess: (state, action)=>{
            state.loading = false;
            state.currentReport = action.payload;
        },
        myReportFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 리포트 전체 생성/재생성 ---
        generateReportRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        generateReportSuccess: (state, action)=>{
            state.loading = false;
            state.reportList = action.payload;
        },
        generateReportFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 리포트 개별 재생성 ---
        regenerateReportRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        regenerateReportSuccess: (state, action)=>{
            state.loading = false;
            state.currentReport = action.payload;
        },
        regenerateReportFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
    }
});

//3. action
export const {
    resetReportState,
    listReportRequest, listReportSuccess, listReportFailure,
    detailReportRequest, detailReportSuccess, detailReportFailure,
    myReportRequest, myReportSuccess, myReportFailure,
    generateReportRequest, generateReportSuccess, generateReportFailure,
    regenerateReportRequest, regenerateReportSuccess, regenerateReportFailure,
} = evalReportReducer.actions;

//4. export
export default evalReportReducer.reducer;