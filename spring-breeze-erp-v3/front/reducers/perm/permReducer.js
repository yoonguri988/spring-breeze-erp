// reducers/permReducer.js
import { createSlice } from "@reduxjs/toolkit";

//초기화 상태(공용)
const initialState={
    //권한 목록
    permList: [],

    //권한 상세
    currentPerm: null,

    //공통
    loading: false,
    error: null,
    success: false,
};

//2. 상태 변화
const permReducer=createSlice({
    name: "perm",
    initialState,
    reducers: {

        // --- 상태 초기화 ---
        resetPermState : (state)=>{
            state.loading = false;
            state.success = false;
            state.error   = null;
        },
        
        // --- 권한 목록 조회 ---
        listPermRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        listPermSuccess: (state, action)=>{
            state.loading = false;
            state.permList = action.payload;
        },
        listPermFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 권한 상세 조회 ---
        detailPermRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        detailPermSuccess: (state, action)=>{
            state.loading = false;
            state.currentPerm = action.payload;
        },
        detailPermFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 권한 등록 ---
        createPermRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        createPermSuccess: (state, action)=>{
            state.loading = false;
            state.success = true;
        },
        createPermFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 권한 수정 ---
        updatePermRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        updatePermSuccess: (state, action)=>{
            state.loading = false;
            state.currentPerm = action.payload;
            state.success = true;
        },
        updatePermFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        // --- 권한 삭제 ---
        deletePermRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        deletePermSuccess: (state, action)=>{
            state.loading = false;
            state.success = true;
            // 삭제한 권한 목록에서 제거
            state.permList = state.permList.filter(perm => perm.permId !== action.payload);
        },
        deletePermFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
    }
});

//3. action
export const {
    resetPermState,
    listPermRequest, listPermSuccess, listPermFailure,
    detailPermRequest, detailPermSuccess, detailPermFailure,
    createPermRequest, createPermSuccess, createPermFailure,
    updatePermRequest, updatePermSuccess, updatePermFailure,
    deletePermRequest, deletePermSuccess, deletePermFailure,
} = permReducer.actions;

//4. export
export default permReducer.reducer;