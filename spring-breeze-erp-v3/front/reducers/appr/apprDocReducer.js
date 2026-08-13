import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    // 문서 작성 파트
    writableForms: [], // 활성화된 양식 목록
    writableFormsLoading: false,
    writableFormsError: null,

    writerInfo: null, // 작성자 인적사항
    writerInfoLoading: false,
    writerInfoError: null,

    writeSubmitting: false, // 문서+결재선 등록 진행중
    writeError: null,
    writeSuccess: false,

    // 문서 목록 조회 파트
    hisDocs: [],    // 결재 했던 문서
    todoDocs: [],   // 결재 해야할 문서
    docCnts: {},    // 대시보드 통계용
    myTodoCnt: 0,
    paging: null,
    activeTab: "history",
    listLoading: false,
    listError: null,

    // 문서 상세 조회 파트
    detailDoc: null,    // 문서 본문
    detailLines: [],    // 결재선 목록
    canProcess: false,  // 현재 사용자가 결재 처리 가능한지
    detailLoading: false,
    detailError: null,

    // 결재 승/반 처리 파트
    processSubmitting: false,
    processError: null,
    processSuccess: false,

    // 결재선 지정 파트
    apprLines: [], // 기안자 상사 목록 
    apprLinesLoading: false,
    deptTree: [], // 부서 체인 + 부서별 지정 가능 인원수
    deptTreeLoading: false,
    deptEmps: [], // 특정 부서 소속 사원 목록
    deptEmpsLoading: false,

}

const apprDocReducer = createSlice({
    name: "apprDoc",
    initialState,
    reducers: {
        // 작성 가능한 양식 목록 조회
        fetchWritableFormsRequest: (state) => {
            state.writableFormsLoading = true;
            state.writableFormsError = null;
        },
        fetchWritableFormsSuccess: (state, action) => {
            state.writableFormsLoading = false;
            state.writableForms = action.payload;
        },
        fetchWritableFormsFailure: (state, action) => {
            state.writableFormsLoading = false;
            state.writableFormsError = action.payload;
        },

        // 작성자 인적사항 조회
        fetchWriterInfoRequest: (state) => {
            state.writerInfoLoading = true;
            state.writerInfoError = null;
        },
        fetchWriterInfoSuccess: (state, action) => {
            state.writerInfoLoading = false;
            state.writerInfo = action.payload;
        },
        fetchWriterInfoFailure: (state, action) => {
            state.writerInfoLoading = false;
            state.writerInfoError = action.payload;
        },

        // 문서 작성 ( 문서 + 결재선 동시등록 )
        writeDocRequest: (state) => {
            state.writeSubmitting = true;
            state.writeError = null;
            state.writeSuccess = false;
        },
        writeDocSuccess: (state) => {
            state.writeSubmitting = false;
            state.writeSuccess = true;
        },
        writeDocFailure: (state,action) => {
            state.writeSubmitting = false;
            state.writeError = action.payload;
        },

        // 문서 작성 관련 처리 후 초기화
        resetWriteState: (state) => {
            state.writeSubmitting = false;
            state.writeError = null;
            state.writeSuccess = false;
        },

        // 문서 목록 조회
        fetchDocListRequest: (state,action) => {
            state.listLoading = true;
            state.listError = null;
            state.activeTab = action.payload?.tab || "history";
        },
        fetchDocListSuccess: (state,action) => {
            state.listLoading = false;
            state.hisDocs = action.payload.hisDocs;
            state.todoDocs = action.payload.todoDocs;
            state.docCnts = action.payload.docCnts;
            state.myTodoCnt = action.payload.myTodoCnt
            state.paging = action.payload.paging;
            state.activeTab = action.payload.activeTab;
        },
        fetchDocListFailure: (state,action) => {
            state.listLoading = false;
            state.listError = action.payload;
        },

        // 문서 상세 조회
        fetchDocDetailRequest: (state) => {
            state.detailLoading = true;
        },
        fetchDocDetailSuccess: (state, action) => {
            state.detailLoading = false;
            state.detailDoc = action.payload.doc;
            state.detailLines = action.payload.lines;
            state.canProcess = action.payload.canProcess;
        },
        fetchDocDetailFailure: (state, action) => {
            state.detailLoading = false;
            state.detailError = action.payload;
        },

        // 결재 승인 처리
        approveDocRequest: (state) => {
            state.processSubmitting = true;
            state.processError = null;
            state.processSuccess = false;
        },
        approveDocSuccess: (state) => {
            state.processSubmitting = false;
            state.processSuccess = true;
        },
        approveDocFailure: (state, action) => {
            state.processSubmitting = false;
            state.processError = action.payload;
        },

        // 결재 반려 처리
        rejectDocRequest: (state) => {
            state.processSubmitting = true;
            state.processError = null;
            state.processSuccess = false;
        },
        rejectDocSuccess: (state) => {
            state.processSubmitting = false;
            state.processSuccess = true;
        },
        rejectDocFailure: (state, action) => {
            state.processSubmitting = false;
            state.processError = action.payload;
        },

        // 결재 승/반 처리후 초기화
        resetProcessState: (state) => {
            state.processSubmitting = false;
            state.processError = null;
            state.processSuccess = false;
        },

        // 기안자 상사 목록 조회
        fetchApprLinesRequest: (state) => {
            state.apprLinesLoading = true;
        },
        fetchApprLinesSuccess: (state, action) => {
            state.apprLinesLoading = false;
            state.apprLines = action.payload;
        },
        fetchApprLinesFailure: (state) => {
            state.apprLinesLoading = false;
        },

        // 부서 체인 + 지정 가능 인원수 조회
        fetchDeptTreeRequest: (state) => {
            state.deptTreeLoading = true;
        },
        fetchDeptTreeSuccess: (state, action) => {
            state.deptTreeLoading = false;
            state.deptTree = action.payload;
        },
        fetchDeptTreeFailure: (state) => {
            state.deptTreeLoading = false;
        },

        // 특정 부서 소속 사원 목록 조회
        fetchDeptEmpsRequest: (state) => {
            state.deptEmpsLoading = true;
        },
        fetchDeptEmpsSuccess: (state, action) => {
            state.deptEmpsLoading = false;
            state.deptEmps = action.payload;
        },
        fetchDeptEmpsFailure: (state) => {
            state.deptEmpsLoading = false;
        },
    }
});

export const {
    fetchWritableFormsRequest, fetchWritableFormsSuccess, fetchWritableFormsFailure,
    fetchWriterInfoRequest, fetchWriterInfoSuccess, fetchWriterInfoFailure,
    writeDocRequest, writeDocSuccess, writeDocFailure,
    fetchDocListRequest, fetchDocListSuccess, fetchDocListFailure,
    fetchDocDetailRequest, fetchDocDetailSuccess, fetchDocDetailFailure,
    approveDocRequest, approveDocSuccess, approveDocFailure,
    rejectDocRequest, rejectDocSuccess, rejectDocFailure,
    fetchApprLinesRequest, fetchApprLinesSuccess, fetchApprLinesFailure,
    fetchDeptTreeRequest, fetchDeptTreeSuccess, fetchDeptTreeFailure,
    fetchDeptEmpsRequest, fetchDeptEmpsSuccess, fetchDeptEmpsFailure,
    resetProcessState, resetWriteState,

} = apprDocReducer.actions;

export default apprDocReducer.reducer;