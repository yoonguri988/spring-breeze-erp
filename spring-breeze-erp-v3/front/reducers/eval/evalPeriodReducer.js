// reducers/evalPeriodReducer.js
import { createSlice } from "@reduxjs/toolkit";

//초기화 상태(공용)
const initialState={
    //평가 회차 목록
    periodList: [],

    //회차 상세
    currentPeriod: null,

    //공통
    loading: false,
    error: null,
    success: false,
};

//2. 상태 변화
const evalPeriodReducer=createSlice({
    name: "period",
    initialState,
    reducers: {

        // --- 상태 초기화 ---
        resetPeriodState : (state)=>{
            state.loading = false;
            state.success = false;
            state.error   = null;
        },
        
        // --- 회차 목록 조회 ---
        listPeriodRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        listPeriodSuccess: (state, action)=>{
            state.loading = false;
            state.periodList = action.payload;
        },
        listPeriodFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 회차 상세 조회 ---
        detailPeriodRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        detailPeriodSuccess: (state, action)=>{
            state.loading = false;
            state.currentPeriod = action.payload;
        },
        detailPeriodFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 회차 등록 ---
        createPeriodRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        createPeriodSuccess: (state, action)=>{
            state.loading = false;
            state.success = true;
        },
        createPeriodFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 회차 수정 ---
        updatePeriodRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        updatePeriodSuccess: (state, action)=>{
            state.loading = false;
            state.currentPeriod = action.payload;
            state.success = true;
        },
        updatePeriodFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 회차 오픈 ---
        openPeriodRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        openPeriodSuccess: (state, action)=>{
            state.loading = false;
            state.currentPeriod = action.payload;
            state.success = true;
        },
        openPeriodFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 회차 마감 ---
        closePeriodRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        closePeriodSuccess: (state, action)=>{
            state.loading = false;
            state.currentPeriod = action.payload;
            state.success = true;
        },
        closePeriodFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
    }
});

//3. action
export const {
    resetPeriodState,
    listPeriodRequest, listPeriodSuccess, listPeriodFailure,
    detailPeriodRequest, detailPeriodSuccess, detailPeriodFailure,
    createPeriodRequest, createPeriodSuccess, createPeriodFailure,
    updatePeriodRequest, updatePeriodSuccess, updatePeriodFailure,
    openPeriodRequest, openPeriodSuccess, openPeriodFailure,
    closePeriodRequest, closePeriodSuccess, closePeriodFailure,    
} = evalPeriodReducer.actions;

//4. export
export default evalPeriodReducer.reducer;