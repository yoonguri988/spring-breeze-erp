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
  ]);
}
