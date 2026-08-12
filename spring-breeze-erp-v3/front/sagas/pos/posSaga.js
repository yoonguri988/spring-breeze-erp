// sagas/pos/posSaga.js
import { all, call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
    resetPosState,
    posListRequest, posListSuccess, posListFailure,
} from '../../reducer/pos/posReducer';

const POS_API_BASE = '/api/pos';

//////////////////////////////////////////////////////////////////////////////
// posList  - GET /api/pos 직급 목록 조회 ---
//////////////////////////////////////////////////////////////////////////////
export const posListApi = ()=> axios.get(POS_API_BASE);

export function* posList(){
    try{
        const result = yield call(posListApi);
        yield put(posListSuccess(result.data));
    }catch(err){
        yield put(posListFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function* watchPosList(){ yield takeLatest( posListRequest.type, posList ); }

export default function* posSaga(){
    yield all([
        call(watchPosList),
    ]);
}