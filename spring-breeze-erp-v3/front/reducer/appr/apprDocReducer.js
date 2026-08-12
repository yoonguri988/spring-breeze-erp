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
        fetchWriterInfoRequest: (state) => {},
        fetchWriterInfoRequest: (state) => {},
        fetchWriterInfoRequest: (state) => {},

        // 문서 작성 ( 문서 + 결재선 동시등록 )
        writeDocRequest: (state) => {},
        writeDocRequest: (state) => {},
        writeDocRequest: (state) => {},
    }
});