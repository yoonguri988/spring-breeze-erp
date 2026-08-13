// sagas/index.js
import { all, fork } from "redux-saga/effects";

import authSaga from "./auth/authSaga";
import companySaga from "./com/companySaga";
import deptSaga from "./dept/deptSaga";
import deptTransferSaga from "./dept/deptTransferSaga";

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(companySaga),
    fork(deptSaga),
    fork(deptTransferSaga),
  ]);
}
