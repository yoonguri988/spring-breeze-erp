// sagas/pos/posSaga.js
import { all, call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
    resetPosState,
    listPosRequest, listPosSuccess, listPosFailure,
    detailPosRequest, detailPosSuccess, detailPosFailure,
    createPosRequest, createPosSuccess, createPosFailure,
    updatePosRequest, updatePosSuccess, updatePosFailure,
    deletePosRequest, deletePosSuccess, deletePosFailure,
} from '../../reducer/pos/posReducer';

const POS_API_BASE = '/api/pos';

//////////////////////////////////////////////////////////////////////////////
// listPos  - GET /api/pos 직급 목록 조회 ---
//////////////////////////////////////////////////////////////////////////////
export const listPosApi = ()=> axios.get(POS_API_BASE);

export function* listPos(){
    try{
        const result = yield call(listPosApi);
        yield put(listPosSuccess(result.data));
    }catch(err){
        yield put(listPosFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
// detailPos  - GET /api/pos//{empId} 직급 상세 조회 ---
//////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////
// createPos  - POST /api/pos 직급 등록 ---
//////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////
// updatePos  - POST /api/pos 직급 수정 ---
//////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////
// deletePos  - GET /api/pos 직급 삭제 ---
//////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function* watchListPos(){ yield takeLatest( listPosRequest.type, listPos ); }
function* watchDetailPos(){ yield takeLatest( deletePosRequest.type, listPos ); }
function* watchCreatePos(){ yield takeLatest( createPosRequest.type, listPos ); }
function* watchUpdatePos(){ yield takeLatest( updatePosRequest.type, listPos ); }
function* watchDeletePos(){ yield takeLatest( deletePosRequest.type, listPos ); }

export default function* posSaga(){
    yield all([
        call(watchListPos),
        call(watchDetailPos),
        call(watchCreatePos),
        call(watchUpdatePos),
        call(watchDeletePos),
    ]);
}