// sagas/eval/evalReportSaga.js
import { all, call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { 
    resetReportState,
    listReportRequest, listReportSuccess, listReportFailure,
    detailReportRequest, detailReportSuccess, detailReportFailure,
    myReportRequest, myReportSuccess, myReportFailure,
    generateReportRequest, generateReportSuccess, generateReportFailure,
    regenerateReportRequest, regenerateReportSuccess, regenerateReportFailure,
} from '../../reducers/eval/evalReportReducer';

const REPORT_API_BASE = '/api/eval-report';

//////////////////////////////////////////////////////////////////////////////
// listEval  - GET /api/eval-report 리포트 목록 조회 ---
//////////////////////////////////////////////////////////////////////////////

export const listReportApi = ()=> axios.get(REPORT_API_BASE);

export function* listReport(){
    try{
        const result = yield call(listReportApi);
        yield put(listReportSuccess(result.data));
    }catch(err){
        yield put(listReportFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
// detailReport  - GET /api/eval-report/{reportId} 리포트 상세 조회 ---
//////////////////////////////////////////////////////////////////////////////

export const detailReportApi = (reportId)=> axios.get(`${REPORT_API_BASE}/${reportId}`);

export function* detailReport(action){
    try{
        const result = yield call(detailReportApi, action.payload);
        yield put(detailReportSuccess(result.data));
    }catch(err){
        yield put(detailReportFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
// myReport  - GET /api/eval-report/my 내 리포트 조회 ---
//////////////////////////////////////////////////////////////////////////////

export const myReportApi = ()=> axios.get(`${REPORT_API_BASE}/my`);

export function* myReport(){
    try{
        const result = yield call(myReportApi);
        yield put(myReportSuccess(result.data));
    }catch(err){
        yield put(myReportFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
// generateReport  - POST /api/eval-report/generate 리포트 전체 생성/재생성 ---
//////////////////////////////////////////////////////////////////////////////

export const generateReportApi = (data)=> axios.post(`${REPORT_API_BASE}/generate`, data);

export function* generateReport(action){
    try{
        const result = yield call(generateReportApi, action.payload);
        yield put(generateReportSuccess(result.data));
    }catch(err){
        yield put(generateReportFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
// regenerateReport  - POST /api/eval-report/regenerate 리포트 개별 재생성 ---
//////////////////////////////////////////////////////////////////////////////

export const regenerateReportApi = (data)=> axios.post(`${REPORT_API_BASE}/regenerate`, data);

export function* regenerateReport(action){
    try{
        const result = yield call(regenerateReportApi, action.payload);
        yield put(regenerateReportSuccess(result.data));
    }catch(err){
        yield put(regenerateReportFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function* watchlistReport(){ yield takeLatest( listReportRequest.type, listReport ); }
function* watchDetailReport(){ yield takeLatest( detailReportRequest.type, detailReport ); }
function* watchMyReport(){ yield takeLatest( myReportRequest.type, myReport ); }
function* watchGenerateReport(){ yield takeLatest( generateReportRequest.type, generateReport ); }
function* watchRegenerateReport(){ yield takeLatest( regenerateReportRequest.type, regenerateReport ); }

export default function* evalReportSaga(){
    yield all([
        call(watchlistReport),
        call(watchDetailReport),
        call(watchMyReport),
        call(watchGenerateReport),
        call(watchRegenerateReport),
    ]);
}