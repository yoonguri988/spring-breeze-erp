// reducers/evalReducer.js
import { createSlice } from "@reduxjs/toolkit";

//초기화 상태(공용)
const initialState={
    //평가 목록
    evalList: [],

    //평가 상세
    currentEval: null,

    //공통
    loading: false,
    error: null,
    success: false,
};

//2. 상태 변화
const evalReducer=createSlice({
    name: "eval",
    initialState,
    reducers: {

        // --- 상태 초기화 ---
        resetEvalState : (state)=>{
            state.loading = false;
            state.success = false;
            state.error   = null;
        },
        
        // --- 평가 목록 조회 ---
        listEvalRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        listEvalSuccess: (state, action)=>{
            state.loading = false;
            state.evalList = action.payload;
        },
        listEvalFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 평가 상세 조회 ---
        detailEvalRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        detailEvalSuccess: (state, action)=>{
            state.loading = false;
            state.currentEval = action.payload;
        },
        detailEvalFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 평가 임시저장 ---
        draftEvalRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        draftEvalSuccess: (state, action)=>{
            state.loading = false;
            state.currentEval = action.payload;
        },
        draftEvalFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 평가 제출 ---
        submitEvalRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
       submitEvalSuccess: (state, action)=>{
            state.loading = false;
            state.currentEval = action.payload;
            state.success = true;
        },
        submitEvalFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
    }
});

//3. action
export const {
    resetEvalState,
    listEvalRequest, listEvalSuccess, listEvalFailure,
    detailEvalRequest, detailEvalSuccess, detailEvalFailure,
    draftEvalRequest, draftEvalSuccess, draftEvalFailure,
    submitEvalRequest, submitEvalSuccess, submitEvalFailure,
} = evalReducer.actions;

//4. export
export default evalReducer.reducer;