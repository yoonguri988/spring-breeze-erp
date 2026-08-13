import { all, call, put, takeLatest } from "redux-saga/effects";
import api from "../../api/axios";
import {
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
} from "../../reducers/appr/apprDocReducer";

const APPR_API_BASE = "/appr";

// 작성 가능한 양식 목록
// GET /appr/getFormList?comId=
export const fetchWritableFormsApi = (comId) =>
    api.get(`${APPR_API_BASE}/getFormList`, {params: {comId}});

export function* fetchWritableForms(action) {
    // payload -> comId
    try {
        const result = yield call(fetchWritableFormsApi, action.payload);
        yield put(fetchWritableFormsSuccess(result.data));
    } catch (err) {
        yield put(fetchWritableFormsFailure(err.response?.data?.error || err.message));
    }
}

function* watchFetchWritableForms() {
    yield takeLatest(fetchWritableFormsRequest.type, fetchWritableForms);
}

// 작성자 인적사항 조회
// GET /appr/write_doc?empId=
export const fetchWriterInfoApi = (empId) => 
    api.get(`${APPR_API_BASE}/write_doc`,{params: {empId}});

export function* fetchWriterInfo(action) {
    // payload -> empId
    try {
        const result = yield call(fetchWriterInfoApi, action.payload);
        yield put(fetchWriterInfoSuccess(result.data));
    } catch (err) {
        yield put(fetchWriterInfoFailure(err.response?.data?.error || err.message));
    }
}

function* watchFetchWriterInfo() {
    yield takeLatest(fetchWriterInfoRequest.type, fetchWriterInfo);
}

// 문서 작성
// POST /appr/write_doc?empId= &comId=
export const writeDocApi = ({empId, comId, data}) =>
    api.post(`${APPR_API_BASE}/write_doc`, data, {params:{empId, comId}});

export function* writeDoc(action) {
    // payload -> {empId, comId, data}
    try {
        yield call(writeDocApi, action.payload);
        yield put(writeDocSuccess());
    } catch (err) {
        yield put(writeDocFailure(err.response?.data?.error || err.message));
    }
}

function* watchWriteDoc() {
    yield takeLatest(writeDocRequest.type, writeDoc);
}

// 문서 목록 조회
// GET /appr/list_doc?tab= &keyword= &status= &page= &empId=
export const fetchDocListApi = (params) =>
    api.get(`${APPR_API_BASE}/list_doc`, {params});

export function* fetchDocList(action) {
    // payload ->{tab, keyword, status, page, empId}
    try {
        const result = yield call(fetchDocListApi, action.payload);
        yield put(fetchDocListSuccess(result.data));
    } catch (err) {
        yield put(fetchDocListFailure(err.response?.data?.error || err.message));
    }
}

function* watchFetchDocList() {
    yield takeLatest(fetchDocListRequest.type, fetchDocList);
}

// 문서 상세 조회
// GET /appr/detail_doc/{docId}?empId=
export const fetchDocDetailApi = ({docId, empId}) =>
    api.get(`${APPR_API_BASE}/detail_doc/${docId}`, {params: {empId}});

export function* fetchDocDetail(action) {
    // payload -> {docId, empId}
    try {
        const result = yield call(fetchDocDetailApi, action.payload);
        yield put(fetchDocDetailSuccess(result.data));
    } catch (err) {
        yield put(fetchDocDetailFailure(err.response?.data?.error || err.message));
    }
}

function* watchFetchDocDetail() {
    yield takeLatest(fetchDocDetailRequest.type, fetchDocDetail);
}

// 결재 승인
// POST /appr/detail_doc/{docId}/app?empId=
export const approveDocApi = ({docId, empId}) => 
    api.post(`${APPR_API_BASE}/detail_doc/${docId}/app`,null, {params: {empId}});

export function* approveDoc(action) {
    // payload -> {docId, empId}
    try {
        yield call(approveDocApi, action.payload);
        yield put(approveDocSuccess());
    } catch (err) {
        yield put(approveDocFailure(err.response?.data?.error || err.message));
    }
}

function* watchApproveDoc() {
    yield takeLatest(approveDocRequest.type, approveDoc);
}

// 결재 반려
// POST /appr/detail_doc/{docId}/rej?empid=
export const rejectDocApi = ({docId, empId}) =>
    api.post(`${APPR_API_BASE}/detail_doc/${docId}/rej`, null, {params: {empId}});

export function* rejectDoc(action) {
    // payload -> {docId, empId}
    try {
        yield call(rejectDocApi, action.payload);
        yield put(rejectDocSuccess());
    } catch (err) {
        yield put(rejectDocFailure(err.response?.data?.error || err.message));
    }
}

function* watchRejectDoc() {
    yield takeLatest(rejectDocRequest.type, rejectDoc);
}

// 기안자 상사 목록 조회
// GET /appr/getApprLines?empId=
export const fetchApprLinesApi = (empId) =>
    api.get(`${APPR_API_BASE}/getApprLines`, {params: {empId}});

export function* fetchApprLines(action) {
    // payload -> empId
    try {
        const result = yield call(fetchApprLinesApi, action.payload);
        yield put(fetchApprLinesSuccess(result.data));
    } catch (err) {
        yield put(fetchApprLinesFailure(err.response?.data?.error || err.message));
    }
}

function* watchFetchApprLines() {
    yield takeLatest(fetchApprLinesRequest.type, fetchApprLines);
}

// 부서 체인 + 지정 가능 인원수 조회
// GET /appr/getDeptTree?deptId= &empId=
export const fetchDeptTreeApi = ({deptId, empId}) =>
    api.get(`${APPR_API_BASE}/getDeptTree`, {params: {deptId, empId}});

export function* fetchDeptTree(action) {
    // payload -> {deptId, empId}
    try {
        const result = yield call(fetchDeptTreeApi, action.payload);
        yield put(fetchDeptTreeSuccess(result.data));
    } catch (err) {
        yield put(fetchDeptTreeFailure(err.response?.data?.error || err.message));
    }
}

function* watchFetchDeptTree() {
    yield takeLatest(fetchDeptTreeRequest.type, fetchDeptTree);
}

// 특정 부서 소속 사원 목록 조회
// GET /appr/getDeptEmps?deptId=
export const fetchDeptEmpsApi = (deptId) =>
    api.get(`${APPR_API_BASE}/getDeptEmps`,{params:{deptId}});

export function* fetchDeptEmps(action) {
    // payload -> deptId
    try {  
        const result = yield call(fetchDeptEmpsApi, action.payload);
        yield put(fetchDeptEmpsSuccess(result.data))
    } catch (err) {
        yield put(fetchDeptEmpsFailure(err.response?.data?.error || err.message));
    }
}

function* watchFetchDeptEmps() {
    yield takeLatest(fetchDeptEmpsRequest.type, fetchDeptEmps);
}

export default function* apprDocSaga() {
    yield all([
        call(watchFetchWritableForms),
        call(watchFetchWriterInfo),
        call(watchWriteDoc),
        call(watchFetchDocList),
        call(watchFetchDocDetail),
        call(watchApproveDoc),
        call(watchRejectDoc),
        call(watchFetchApprLines),
        call(watchFetchDeptTree),
        call(watchFetchDeptEmps),
    ]);
}