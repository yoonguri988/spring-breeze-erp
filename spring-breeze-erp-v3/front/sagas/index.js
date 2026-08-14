// sagas/index.js
import { all, fork } from "redux-saga/effects";

import authSaga from "./auth/authSaga";
import companySaga from "./com/companySaga";
import deptSaga from "./dept/deptSaga";
import deptTransferSaga from "./dept/deptTransferSaga";
import apiUtilSaga from "./api/apiUtilSaga";
import resourceSaga from "./res/resourceSaga";
import resvSaga from './resv/resvSaga';
import adminResvSaga from './resv/adminResvSaga';
import projSaga from './proj/projSaga';
import projMemSaga from'./proj/projMemSaga';
import taskSaga from './task/taskSaga';
import noticeSaga from './notice/noticeSaga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(companySaga),
    fork(deptSaga),
    fork(deptTransferSaga),
    fork(apiUtilSaga),
    fork(resourceSaga),
    fork(resvSaga),
    fork(adminResvSaga),
    fork(projSaga),
    fork(projMemSaga),
    fork(taskSaga),
    fork(noticeSaga),
  ]);
}
