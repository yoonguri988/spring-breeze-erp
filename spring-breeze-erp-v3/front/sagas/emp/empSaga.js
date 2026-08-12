// sagas/emp/empSaga.js
import { all, call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { resetEmpState,
    empListRequest, empListSuccess, empListFailure,
} from '../../reducer/emp/empReducer';

const EMP_API_BASE = '/api/emp';

//////////////////////////////////////////////////////////////////////////////
// empList  - GET /api/emp 사원 목록 조회 ---
//////////////////////////////////////////////////////////////////////////////

export const empListApi = ()=> axios.get(EMP_API_BASE);

export function* empList(){
    try{
        const result = yield call(empListApi);
        yield put(empListSuccess(result.data));
    }catch(err){
        yield put(empListFailure(err.response?.data?.message || err.message));
    }
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function* watchEmpList(){ yield takeLatest( empListRequest.type, empList ); }

export default function* empSaga(){
    yield all([
        call(watchEmpList),
    ]);
}