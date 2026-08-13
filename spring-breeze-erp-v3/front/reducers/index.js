// reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from './auth/authReducer';

// -------------- jsj --------------
import empReducer from './emp/empReducer';
import posReducer from './pos/posReducer';
import permReducer from './perm/permReducer';
import evalReducer from './eval/evalReducer';
import evalPeriodReducer from './eval/evalPeriodReducer';
import evalReportReducer from './eval/evalReportReducer';
// -------------- jsj --------------

const rootReducer = combineReducers({
  _placeholder: (state = {}, action) => state,
  
  auth: authReducer,   // state.auth
  // -------------- jsj --------------
  emp: empReducer,  // state.emp
  pos: posReducer,  // state.pos
  perm: permReducer,  // state.perm
  eval: evalReducer,  // state.eval
  period: evalPeriodReducer, // state.period
  report: evalReportReducer, // state.report
  // -------------- jsj --------------

});

export default rootReducer;
