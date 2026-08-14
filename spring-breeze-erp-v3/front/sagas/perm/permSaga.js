// sagas/perm/permSaga.js
import { all, call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { 
    resetPermState,
    listPermRequest, listPermSuccess, listPermFailure,
    detailPermRequest, detailPermSuccess, detailPermFailure,
    createPermRequest, createPermSuccess, createPermFailure,
    updatePermRequest, updatePermSuccess, updatePermFailure,
    deletePermRequest, deletePermSuccess, deletePermFailure,
} from '../../reducers/perm/permReducer';

const PERM_API_BASE = '/api/perm';

//////////////////////////////////////////////////////////////////////////////
// listPerm  - GET /api/perm 권한 목록 조회 ---
//////////////////////////////////////////////////////////////////////////////

export const listPermApi = ()=> axios.get(PERM_API_BASE);

export function* listPerm(){
    try{
        const result = yield call(listPermApi);
        yield put(listPermSuccess(result.data));
    }catch(err){
        yield put(listPermFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
// detailPerm  - GET /api/Perm//{permId} 권한 상세 조회 ---
//////////////////////////////////////////////////////////////////////////////
export const detailPermApi = (permId)=> axios.get(`${PERM_API_BASE}/${permId}`);

export function* detailPerm(action){
    try{
        const result = yield call(detailPermApi, action.payload);
        yield put(detailPermSuccess(result.data));
    }catch(err){
        yield put(detailPermFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
// createPerm  - POST /api/Perm 권한 등록 ---
//////////////////////////////////////////////////////////////////////////////
export const createPermApi = (data)=> axios.post(PERM_API_BASE, data);

export function* createPerm(action){
    try{
        const result = yield call(createPermApi, action.payload);
        yield put(createPermSuccess(result.data));
    }catch(err){
        yield put(createPermFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
// updatePerm  - put /api/Perm 권한 수정 ---
//////////////////////////////////////////////////////////////////////////////
export const updatePermApi = ({permId, ...data}) => axios.put(`${PERM_API_BASE}/${permId}`, data);

export function* updatePerm(action){
    try{
        const result = yield call(updatePermApi, action.payload);
        yield put(updatePermSuccess(result.data));
    }catch(err){
        yield put(updatePermFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
// deletePerm  - delete /api/Perm 권한 삭제 ---
//////////////////////////////////////////////////////////////////////////////
export const deletePermApi = (permId) => axios.delete(`${PERM_API_BASE}/${permId}`);

export function* deletePerm(action){
    try{
        yield call(deletePermApi, action.payload);
        yield put(deletePermSuccess(action.payload));
    }catch(err){
        yield put(deletePermFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function* watchListPerm(){ yield takeLatest( listPermRequest.type, listPerm ); }
function* watchDetailPerm(){ yield takeLatest( detailPermRequest.type, detailPerm ); }
function* watchCreatePerm(){ yield takeLatest( createPermRequest.type, createPerm ); }
function* watchUpdatePerm(){ yield takeLatest( updatePermRequest.type, updatePerm ); }
function* watchDeletePerm(){ yield takeLatest( deletePermRequest.type, deletePerm ); }

export default function* permSaga(){
    yield all([
        call(watchListPerm),
        call(watchDetailPerm),
        call(watchCreatePerm),
        call(watchUpdatePerm),
        call(watchDeletePerm),
    ]);
}