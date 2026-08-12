// reducers/empReducer.js
import { createSlice } from "@reduxjs/toolkit";

//초기화 상태(공용)
const initialState={
    //사원 목록
    empList: [],

    //상세
    currentEmp: null,

    //공통
    loading: false,
    error: null,
    success: false,
};

//2. 상태 변화
const empReducer=createSlice({
    name: "emp",
    initialState,
    reducers: {

        // --- 상태 초기화 ---
        resetEmpState : (state)=>{
            state.loading = false;
            state.success = false;
            state.error   = null;
        },
        
        // --- 사원 목록 조회 ---
        empListRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        empListSuccess: (state, action)=>{
            state.loading = false;
            state.empList = action.payload;
        },
        empListFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
    }
});

//3. action
export const {
    resetEmpState,
    empListRequest, empListSuccess, empListFailure,
} = empReducer.actions;

//4. export
export default empReducer.reducer;