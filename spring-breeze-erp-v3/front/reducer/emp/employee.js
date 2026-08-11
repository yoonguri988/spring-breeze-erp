// reducers/empReducer.js
import { createSlice } from "@reduxjs/toolkit";

//1. 초기화 상태(공용)
const initialState={
    employees: [],
    currentEmployee: null,
    loading: false,
    error: null,
    success: false,
};

//2. 상태 변화
const employeeReducer=createSlice({
    name: "emp",
    initialState,
    reducers: {

        // --- 상태 초기화 ---
        resetEmpState : (state)=>{
            state.loading = false;
            state.error   = null;
            state.success = false;
        },
        
        // --- 게시글 전체 목록 조회 ---
        fetchPostsRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        fetchPostsSuccess: (state, action)=>{
            state.loading = false;
            state.posts = action.payload;
        },
        fetchPostsFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
    }
});

//3. action
export const {
    resetEmpState,
} = empReducer.actions;

//4. export
export default empReducer.reducer;