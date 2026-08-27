// sagas/dashboard/adminDashboardSaga.js

import { all, call, put, takeLatest } from "redux-saga/effects";
import api from "../../api/axios";

import {
  adminDashboardRequest, adminDashboardSuccess, adminDashboardFailure,
} from "../../reducers/dashboard/adminDashboardReducer";

const API_BASE = "/api/admin/dashboard";

///////////////////////////////////////////////////////////
// 관리자용 대시보드 GET /api/admin/dashboard/summary
///////////////////////////////////////////////////////////

export const adminDashboardSummaryApi = () =>
  api.get(`${API_BASE}/summary`);

export function* fetchAdminDashboardSummary() {
  try {
    const result = yield call(adminDashboardSummaryApi);
    yield put(adminDashboardSuccess(result.data));
  } catch (err) {
    yield put(
      adminDashboardFailure(err.response?.data?.message || err.message)
    );
  }
}

////////////////////////////////////////////////////////////////////

function* watchAdminDashboard(){ yield takeLatest(adminDashboardRequest.type, fetchAdminDashboardSummary) }

export default function* adminDashboardSaga(){
	yield all([
	  call(watchAdminDashboard),
	]);
}