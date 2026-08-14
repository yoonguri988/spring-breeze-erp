// sagas/index.js
import { all, fork } from 'redux-saga/effects';
import authSaga from "./auth/authSaga";
import companySaga from "./com/companySaga";
import deptSaga from "./dept/deptSaga";
import deptTransferSaga from "./dept/deptTransferSaga";
import apiUtilSaga from "./api/apiUtilSaga";
import resourceSaga from "./res/resourceSaga";
import resvSaga from './resv/resvSaga';
import adminResvSaga from './resv/adminResvSaga';
import apprFormSaga from './appr/apprFormSaga';
import apprDocSaga from './appr/apprDocSaga';
import empSaga from './emp/empSaga';
import posSaga from './pos/posSaga';
import evalSaga from './eval/evalSaga';
import evalPeriodSaga from './eval/evalPeriodSaga';
import evalReportSaga from './eval/evalReportSaga';
import permSaga from './perm/permSaga';


export default function *rootSaga(){
  yield all([
    fork(authSaga),
    fork(companySaga),
    fork(deptSaga),
    fork(deptTransferSaga),
    fork(apiUtilSaga),
    fork(resourceSaga),
    fork(resvSaga),
    fork(adminResvSaga),
    fork(apprFormSaga),
    fork(apprDocSaga),
    fork(empSaga),
    fork(posSaga),
    fork(permSaga),
    fork(evalSaga),
    fork(evalPeriodSaga),
    fork(evalReportSaga),
  ]);
}