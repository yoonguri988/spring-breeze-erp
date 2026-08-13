// reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from './auth/authReducer';

const rootReducer = combineReducers({
  auth: authReducer,   // state.auth
});

export default rootReducer;
