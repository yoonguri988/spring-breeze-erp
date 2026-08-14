// reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from './auth/authReducer';
import companyReducer from './com/companyReducer';
import deptReducer from './dept/deptReducer';
import deptTransferReducer from './dept/deptTransferReducer';
import apiUtilReducer from './api/apiUtilReducer';
import resourceReducer from './res/resourceReducer';
import resvReducer from './resv/resvReducer';
import adminResvReducer from './resv/adminResvReducer';
import projReducer from './proj/projReducer';
import projMemReducer from './proj/projMemReducer';
import taskReducer from './task/taskReducer';
import noticeReducer from'./notice/noticeReducer';

const rootReducer = combineReducers({
  auth: authReducer,   // state.auth
  company: companyReducer,   // state.company
  dept: deptReducer,   // state.dept
  deptTransfer: deptTransferReducer,   // state.deptTransfer
  apiUtil: apiUtilReducer,   // state.apiUtil
  res: resourceReducer,   // state.res
  resv: resvReducer,   // state.resv
  adminResv: adminResvReducer,   // state.adminResv
  proj: projReducer, // state.proj
  projMem: projMemReducer, // state.projMem
  task: taskReducer, // state.task
  notice: noticeReducer, // state.notice
});

export default rootReducer;
