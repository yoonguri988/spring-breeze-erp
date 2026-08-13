// sagas/index.js
import { all, fork } from 'redux-saga/effects';
import authSaga from "./auth/authSaga";

// -------------- jsj --------------
import empSaga from './emp/empSaga';
import posSaga from './pos/posSaga';
import evalSaga from './eval/evalSaga';
import evalPeriodSaga from './eval/evalPeriodSaga';
import evalReportSaga from './eval/evalReportSaga';
import permSaga from './perm/permSaga';
// -------------- jsj --------------


export default function *rootSaga(){
  yield all([
    fork(authSaga),

    // -------------- jsj --------------
    fork(empSaga),
    fork(posSaga),
    fork(permSaga),
    fork(evalSaga),
    fork(evalPeriodSaga),
    fork(evalReportSaga),
    // -------------- jsj --------------

  ]);
}

// fork : 기다리지 않음 (다른일할수 있게 양보)   - 동시에 실행
// call : 기다림 (어떠한일이 끝날때까지 기다리기) - 결과물 필수적