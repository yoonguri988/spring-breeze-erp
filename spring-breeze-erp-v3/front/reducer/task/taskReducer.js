import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks:[],
    currentTask:null,
    createContext:{ memberList:[], taskList:[] },   // 등록 폼 참고 데이터
    editContext:{ task:null, memberList:[], taskList:[] }, // 수정 폼 참고 데이터
    myTasks:[],
    myTasksPaging:null,
    myTasksTotalCnt:0,
    ganttTasks:[],
    loading:false,
    error:null,
    success:false
}
const taskReducer = createSlice({
    name:"task",
    initialState,
    reducers:{
        // 전체 목록
        fetchTaskRequest:(state)=>{
            state.loading=true;
            state.error=null;
        },
        fetchTaskSuccess:(state,action)=>{
            state.loading=false;
            state.tasks=action.payload;
        },
        fetchTaskFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
    
        // 상세 조회
        fetchTaskDetailRequest:(state)=>{
            state.loading=true;
            state.error=null;
            state.success=false;
        },
        fetchTaskDetailSuccess:(state,action)=>{
            state.loading=false;
            state.currentTask=action.payload;
            state.success=true;
        },
        fetchTaskDetailFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            state.success=false;
        },

        // 태스크 등록
        createTaskReqeust:(state)=>{
            state.loading=true;
            state.error=null;
            state.success=false;
        },
        createTaskSuccess:(state,action)=>{
            state.loading=false;
            state.tasks.unshift(action.payload.task);
            state.success=true;
        },
        createTaskFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            state.success=false;
        },

        // 태스크 등록 참고 데이터 (memberList, taskList)
        fetchCreateContextRequest:(state)=>{
            state.loading=true;
            state.error=null;
        },
        fetchCreateContextSuccess:(state,action)=>{
            state.loading=false;
            state.createContext=action.payload;
        },
        fetchCreateContextFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },

        // 태스크 수정
        updateTaskReqeust:(state)=>{
            state.loading=true;
            state.error=null;
            state.success=false;
        },
        updateTaskSuccess:(state,action)=>{
            state.loading=false;
            const updatedTask = action.payload.task;   // 응답: {success, message, task}

            state.tasks = state.tasks.map(task =>
                task.taskId === updatedTask.taskId ? updatedTask : task   // 필드명 taskId 확인 필요
            );
            state.currentTask = updatedTask;
            state.success = true;
        },
        updateTaskFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            state.success=false;
        },

        // 태스크 수정 참고 데이터 (task, memberList, taskList)
        fetchEditContextRequest:(state)=>{
            state.loading=true;
            state.error=null;
        },
        fetchEditContextSuccess:(state,action)=>{
            state.loading=false;
            state.editContext=action.payload;
        },
        fetchEditContextFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },

        // 태스크 삭제
        deleteTaskReqeust:(state)=>{
            state.loading=true;
            state.error=null;
            state.success=false;
        },
        deleteTaskSuccess:(state,action)=>{
            state.loading=false;
            state.tasks=state.tasks.filter(task=>task.taskId!==action.payload);
            state.success=true;
        },
        deleteTaskFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            state.success=false;
        },

        // 내 태스크 목록 (페이징)
        fetchMyTasksRequest:(state)=>{
            state.loading=true;
            state.error=null;
        },
        fetchMyTasksSuccess:(state,action)=>{
            state.loading=false;
            state.myTasks=action.payload.tasks;
            state.myTasksPaging=action.payload.paging;
            state.myTasksTotalCnt=action.payload.totalCnt;
        },
        fetchMyTasksFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },

        // 간트차트
        fetchGanttRequest:(state)=>{
            state.loading=true;
            state.error=null;
        },
        fetchGanttSuccess:(state,action)=>{
            state.loading=false;
            state.ganttTasks=action.payload;
        },
        fetchGanttFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },

        // 초기화
        resetTaskState:(state)=>{
            state.loading=false;
            state.error=null;
            state.success=false;
        },
    }
});
export const {
    fetchTaskRequest,fetchTaskSuccess,fetchTaskFailure,
    fetchTaskDetailRequest,fetchTaskDetailSuccess,fetchTaskDetailFailure,
    createTaskRequest,createTaskSuccess,createTaskFailure,
    fetchCreateContextRequest,fetchCreateContextSuccess,fetchCreateContextFailure,
    updateTaskRequest,updateTaskSuccess,updateTaskFailure,
    fetchEditContextRequest,fetchEditContextSuccess,fetchEditContextFailure,
    deleteTaskRequest,deleteTaskSuccess,deleteTaskFailure,
    fetchMyTasksRequest,fetchMyTasksSuccess,fetchMyTasksFailure,
    fetchGanttRequest,fetchGanttSuccess,fetchGanttFailure,
    resetTaskState
} = taskReducer.actions;

export default taskReducer.reducer;