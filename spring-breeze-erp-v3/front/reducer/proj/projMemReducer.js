import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    projectMems:[],
    loading:false,
    error:null,
    success:false
}

const projMemReducer= createSlice({
    name:"project_member",
    initialState,
    reducers:{
        // 전체 목록
        fetchProjMemRequest:(state)=>{
            state.loading=true;
            state.error=null;
        },
        fetchProjMemSuccess:(state,action)=>{
            state.loading=false;
            state.projectMems=action.payload;
        },
        fetchProjMemFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },

        // 멤버 등록
        createProjMemRequest:(state)=>{
            state.loading=true;
            state.error=null;
            state.success=false;
        },
        createProjMemSuccess:(state,action)=>{
            state.loading=false;
            state.projectMems.unshift(action.payload);
            state.success=true;
        },
        createProjMemFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            state.success=false;
        },

        // 멤버 삭제
        deleteProjMemRequest:(state)=>{
            state.loading=true;
            state.error=null;
            state.success=false;
        },
        deleteProjMemSuccess:(state,action)=>{
            state.loading=false;
            state.projectMems=state.projectMems.filter(project_member=>project_member.id!==action.payload);
            state.success=true;
        },
        deleteProjMemFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            state.success=false;
        },

        // 초기화
        resetProjMemState:(state)=>{
            state.loading=false;
            state.error=null;
            state.success=false;
        },
    }
});

export const {fetchProjMemRequest,fetchProjMemSuccess,fetchProjMemFailure,
              createProjMemRequest,createProjMemSuccess,createProjMemFailure,
              deleteProjMemRequest,deleteProjMemSuccess,deleteProjMemFailure
} =projMemReducer.actions;

export default projMemReducer.reducer;