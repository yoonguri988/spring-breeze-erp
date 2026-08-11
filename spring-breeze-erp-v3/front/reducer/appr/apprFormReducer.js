import { createSlice } from "@reduxjs/toolkit";

// 초기화 상태
const initialState = {
    // 목록
    list: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
    loading: false,
    error: null,

    // 상세 ( 단건 조회 )
    detail: null,
    detailLoading: false,
    detailError: null,

    // 버전 이력
    versions: [],
    versionsLoading: false,
    
    // 등록/수정/삭제
    submitting: false,
    submitError: null,
    success: false,
}

const apprFormReducer = createSlice({
    name: "apprForm",
    initialState,
    reducers: {
        // 목록 조회
        fetchFormListRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchFormListSuccess: (state, action) => {
            // ApprFormListResponse -> {content, page, pageSize, totalCount, totalPages}
            state.loading = false;
            state.list = action.payload.content;
            state.page = action.payload.page;
            state.pageSize = action.payload.pageSize;
            state.totalCount = action.payload.totalCount;
            state.totalPages = action.payload.totalPages;
        },
        fetchFormListFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // 단건 조회
        fetchFormDetailRequest: (state) => {
            state.detailLoading = true;
            state.detailError = null;
        },
        fetchFormDetailSuccess: (state, action) => {
            state.detailLoading = false;
            state.detail = action.payload;
        },
        fetchFormDetailFailure: (state, action) => {
            state.detailLoading = false;
            state.detailError = action.payload;
        },

        // 버전 이력 조회
        fetchFormVersionsRequest: (state) => {
            state.versionsLoading = true;
        },
        fetchFormVersionsSuccess: (state, action) => {
            state.versionsLoading = false;
            state.versions = action.payload;
        },
        fetchFormVersionsFailure: (state) => {
            state.versionsLoading = false;
        },

        // 양식 등록
        insertFormRequest: (state) => {
            state.submitting = true;
            state.submitError = null;
            state.success = false;
        },
        insertFormSuccess: (state) => {
            state.submitting = false;
            state.success = true;
        },
        insertFormFailure: (state, action) => {
            state.submitting = false;
            state.submitError = action.payload;
        },

        // 양식 수정
        updateFormRequest: (state) => {
            state.submitting = true;
            state.submitError = null;
            state.success = false;
        },
        updateFormSuccess: (state) => {
            state.submitting = false;
            state.success = true;
        },
        updateFormFailure: (state, action) => {
            state.submitting = false;
            state.submitError = action.payload;
        },

        // 양식 삭제
        deleteFormRequest: (state) => {
            state.submitting = true;
            state.submitError = null;
        },
        deleteFormSuccess: (state, action) => {},
        deleteFormFailure: (state, action) => {},
        
        // 상태 초기화
        resetFormState: (state) => {

        }
    }
});

export const {
    fetchFormListRequest, fetchFormListSuccess, fetchFormListFailure,
    fetchFormDetailRequest, fetchFormDetailSuccess, fetchFormDetailFailure,
    fetchFormVersionsRequest, fetchFormVersionsSuccess, fetchFormVersionsFailure,
    insertFormRequest, insertFormSuccess, insertFormFailure,
    updateFormRequest, updateFormSuccess, updateFormFailure,
    deleteFormRequest, deleteFormSuccess, deleteFormFailure,
    resetFormState
} = apprFormReducer.actions;

export default apprFormReducer.reducers;