// sagas/eval/evalSaga.js
import { all, call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { 
    resetEvalState,
    listEvalRequest, listEvalSuccess, listEvalFailure,
    detailEvalRequest, detailEvalSuccess, detailEvalFailure,
    draftEvalRequest, draftEvalSuccess, draftEvalFailure,
    submitEvalRequest, submitEvalSuccess, submitEvalFailure,
} from '../../reducers/eval/evalReducer';

const EVAL_API_BASE = '/api/eval';

//////////////////////////////////////////////////////////////////////////////
// listEval  - GET /api/eval 평가 목록 조회 ---
//////////////////////////////////////////////////////////////////////////////

export const listEvalApi = ()=> axios.get(EVAL_API_BASE);

export function* listEval(action){
    try{
        const result = yield call(listEvalApi);
        yield put(listEvalSuccess(result.data));
    }catch(err){
        yield put(listEvalFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
// detailEval  - GET /api/eval/{evalId} 평가 상세 조회 ---
//////////////////////////////////////////////////////////////////////////////
export const detailEvalApi = (evalId)=> axios.get(`${EVAL_API_BASE}/${evalId}`);

export function* detailEval(action){
    try{
        const result = yield call(detailEvalApi, action.payload);
        yield put(detailEvalSuccess(result.data));
    }catch(err){
        yield put(detailEvalFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
// draftEval  - POST /api/eval/draft 평가 임시저장 ---
//////////////////////////////////////////////////////////////////////////////
export const draftEvalApi = (data)=> axios.post(`${EVAL_API_BASE}/draft`, data);

export function* draftEval(action){
    try{
        const result = yield call(draftEvalApi, action.payload);
        yield put(draftEvalSuccess(result.data));
    }catch(err){
        yield put(draftEvalFailure(err.response?.data?.message || err.message));
    }
}


//////////////////////////////////////////////////////////////////////////////
// submitEval  - POST /api/eval/submit 평가 제출 ---
//////////////////////////////////////////////////////////////////////////////
export const submitEvalApi = (data)=> axios.post(`${EVAL_API_BASE}/submit`, data);

export function* submitEval(action){
    try{
        const result = yield call(submitEvalApi, action.payload);
        yield put(submitEvalSuccess(result.data));
    }catch(err){
        yield put(submitEvalFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function* watchlistEval(){ yield takeLatest( listEvalRequest.type, listEval ); }
function* watchdetailEval(){ yield takeLatest( detailEvalRequest.type, detailEval ); }
function* watchdraftEval(){ yield takeLatest( draftEvalRequest.type, draftEval ); }
function* watchsubmitEval(){ yield takeLatest( submitEvalRequest.type, submitEval ); }

export default function* evalSaga(){
    yield all([
        call(watchlistEval),
        call(watchdetailEval),
        call(watchdraftEval),
        call(watchsubmitEval),
    ]);
}