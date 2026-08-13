// auth/authReducer.js
import { createSlice } from "@reduxjs/toolkit";

// 초기화
const initialState = {
    user:null, 
    accessToken:null, 
    loading:false,
    error: null,  
    success:false,
};

// 상태변화
const authReducer=createSlice({
    name:"auth",
    initialState,
    reducers:{

        // ---상태 초기화---
        resetUserState : (state)=>{
            state.loading=false;
            state.error=null;
            state.success=false;
        },

        // --- 로그인 ---
        loginRequest : (state)=>{
            state.loading=true;
            state.error=null;
        },
        loginSuccess : (state,action)=>{
            state.loading=false;
            state.user        = action.payload.user || null;
            state.accessToken = action.payload.accessToken || null;
        },
        loginFailure : (state,action)=>{
            state.loading=false;
            state.error = action.payload;
            state.user=null;
        },

        // ---토큰 재발급--- ResponseEntity<Map<String, Object>>
        refreshTokenRequest:(state)=>{
            state.loading=true;

        },
        refreshTokenSuccess:(state,action)=>{
            state.loading=false;
            state.accessToken= action.payload?.accessToken || null;
        },
        refreshTokenFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload.error;
            // refresh 실패 = 로그인 세션 종료로 보는 게 일반적
            state.user = null;
            state.accessToken = null;
        },

        // ---로그아웃---
        logoutRequest : (state)=>{
            state.loading=true;
        },
        logoutSuccess : (state)=>{
            state.loading=false;
            state.error=null;
            state.user=null;
            state.accessToken=null;
            state.success=false;
        },
        logoutFailure : (state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 사용자 정보 로드 ---
        loadUserRequest:(state)=>{
            state.loading = true;
        },
        loadUserSuccess:(state,action)=>{
            state.loading = false;
            state.user = action.payload.user || null;
            state.accessToken = action.payload.accessToken || null;
        },
        loadUserFailure:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.user = null;
            state.accessToken = null;
        },

        // --- 비밀번호 재설정 - 본인확인 (/auth/confirm)---
        confirmRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        confirmSuccess: (state, action) => {
            state.loading = false;
            // resetToken은 store에 안 두고 saga에서 sessionStorage 등으로 별도 관리 추천
            state.success = action.payload.state === "OK";
        },
        confirmFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

         // ---비밀번호 재설정 (비로그인, resetToken) (/auth/updatePass)---
        updatePassRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        updatePassSuccess: (state) => {
            state.loading = false;
            state.success = true;
        },
        updatePassFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // ---비밀번호 변경 (로그인 상태) (/auth/password)---
        changePasswordRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        changePasswordSuccess: (state) => {
            state.loading = false;
            state.success = true;
        },
        changePasswordFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

//3. action
export const {
    resetUserState,
    loginRequest, loginSuccess, loginFailure,
    refreshTokenRequest, refreshTokenSuccess, refreshTokenFailure,
    logoutRequest, logoutSuccess, logoutFailure,
    loadUserRequest, loadUserSuccess, loadUserFailure,
    confirmRequest, confirmSuccess, confirmFailure,
    updatePassRequest, updatePassSuccess, updatePassFailure,
    changePasswordRequest, changePasswordSuccess, changePasswordFailure,
} = authReducer.actions;

//4. export
export default authReducer.reducer;