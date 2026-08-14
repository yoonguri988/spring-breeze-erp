// reducers/posReducer.js
import { createSlice } from "@reduxjs/toolkit";

//초기화 상태
const initialState={
    //직급 목록
    posList: [],

    //상세
    currentPos: null,

    //공통
    loading: false,
    error: null,
    success: false,
};

//상태 변화
const posReducer=createSlice({
    name: "pos",
    initialState,
    reducers: {

        // --- 상태 초기화 ---
        resetPosState : (state)=>{
            state.loading = false;
            state.success = false;
            state.error = null;
        },

        // --- 직급 목록 조회 ---
        listPosRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        listPosSuccess: (state, action)=>{
            state.loading = false;
            state.posList = action.payload;
        },
        listPosFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 직급 상세 조회 ---
        detailPosRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        detailPosSuccess: (state, action)=>{
            state.loading = false;
            state.currentPos = action.payload;
        },
        detailPosFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 직급 등록 ---
        createPosRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        createPosSuccess: (state, action)=>{
            state.loading = false;
            state.success = true;
        },
        createPosFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 직급 수정 ---
        updatePosRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        updatePosSuccess: (state, action)=>{
            state.loading = false;
            state.currentPos = action.payload;
            state.success = true;
        },
        updatePosFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 직급 삭제 ---
        deletePosRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        deletePosSuccess: (state, action)=>{
            state.loading = false;
            state.success = true;
            // 삭제한 직급 목록에서 제거
            state.posList  = state.posList.filter(pos => pos.posId !== action.payload)
        },
        deletePosFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
    }
});

// action
export const {
    resetPosState,
    listPosRequest, listPosSuccess, listPosFailure,
    detailPosRequest, detailPosSuccess, detailPosFailure,
    createPosRequest, createPosSuccess, createPosFailure,
    updatePosRequest, updatePosSuccess, updatePosFailure,
    deletePosRequest, deletePosSuccess, deletePosFailure,
} = posReducer.actions;

// export
export default posReducer.reducer;