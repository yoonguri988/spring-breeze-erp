// sagas/eval/evalPeriodSaga.js
import { all, call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { 
    resetPeriodState,
    listPeriodRequest, listPeriodSuccess, listPeriodFailure,
    detailPeriodRequest, detailPeriodSuccess, detailPeriodFailure,
    createPeriodRequest, createPeriodSuccess, createPeriodFailure,
    updatePeriodRequest, updatePeriodSuccess, updatePeriodFailure,
    openPeriodRequest, openPeriodSuccess, openPeriodFailure,
    closePeriodRequest, closePeriodSuccess, closePeriodFailure,
} from '../../reducers/eval/evalPeriodReducer';

const PERIOD_API_BASE = '/api/eval-period';

//////////////////////////////////////////////////////////////////////////////
// listPeriod  - GET /api/eval-period 회차 목록 조회 ---
//////////////////////////////////////////////////////////////////////////////

export const listPeriodApi = ()=> axios.get(PERIOD_API_BASE);

export function* listPeriod(){
    try{
        const result = yield call(listPeriodApi);
        yield put(listPeriodSuccess(result.data));
    }catch(err){
        yield put(listPeriodFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
// detailPeriod  - GET /api/eval-period/{periodId} 회차 상세 조회 ---
//////////////////////////////////////////////////////////////////////////////

export const detailPeriodApi = (periodId)=> axios.get(`${PERIOD_API_BASE}/${periodId}`);

export function* detailPeriod(action){
    try{
        const result = yield call(detailPeriodApi, action.payload);
        yield put(detailPeriodSuccess(result.data));
    }catch(err){
        yield put(detailPeriodFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
// createPeriod  - POST /api/eval-period 회차 등록 ---
//////////////////////////////////////////////////////////////////////////////

export const createPeriodApi = (data)=> axios.post(PERIOD_API_BASE, data);

export function* createPeriod(action){
    try{
        const result = yield call(createPeriodApi, action.payload);
        yield put(createPeriodSuccess(result.data));
    }catch(err){
        yield put(createPeriodFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
// updatePeriod  - PUT /api/eval-period/{periodId} 회차 수정 ---
//////////////////////////////////////////////////////////////////////////////

export const updatePeriodApi = ({periodId, ...data})=> axios.put(`${PERIOD_API_BASE}/${periodId}`, data);

export function* updatePeriod(action){
    try{
        const result = yield call(updatePeriodApi, action.payload);
        yield put(updatePeriodSuccess(result.data));
    }catch(err){
        yield put(updatePeriodFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
// openPeriod  - PUT /api/eval-period/{periodId}/open 회차 오픈 ---
//////////////////////////////////////////////////////////////////////////////

export const openPeriodApi = (periodId)=> axios.put(`${PERIOD_API_BASE}/${periodId}/open`);

export function* openPeriod(action){
    try{
        const result = yield call(openPeriodApi, action.payload);
        yield put(openPeriodSuccess(action.payload));
    }catch(err){
        yield put(openPeriodFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
// closePeriod  - PUT /api/eval-period/{periodId}/close 회차 마감 ---
//////////////////////////////////////////////////////////////////////////////

export const closePeriodApi = (periodId)=> axios.put(`${PERIOD_API_BASE}/${periodId}/close`);

export function* closePeriod(action){
    try{
        const result = yield call(closePeriodApi, action.payload);
        yield put(closePeriodSuccess(action.payload));
    }catch(err){
        yield put(closePeriodFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function* watchlistPeriod(){ yield takeLatest( listPeriodRequest.type, listPeriod ); }
function* watchDetailPeriod(){ yield takeLatest( detailPeriodRequest.type, detailPeriod ); }
function* watchCreatePeriod(){ yield takeLatest( createPeriodRequest.type, createPeriod ); }
function* watchUpdatePeriod(){ yield takeLatest( updatePeriodRequest.type, updatePeriod ); }
function* watchOepnPeriod(){ yield takeLatest( openPeriodRequest.type, openPeriod ); }
function* watchClosePeriod(){ yield takeLatest( closePeriodRequest.type, closePeriod ); }

export default function* evalPeriodSaga(){
    yield all([
        call(watchlistPeriod),
        call(watchDetailPeriod),
        call(watchCreatePeriod),
        call(watchUpdatePeriod),
        call(watchOepnPeriod),
        call(watchClosePeriod),
    ]);
}