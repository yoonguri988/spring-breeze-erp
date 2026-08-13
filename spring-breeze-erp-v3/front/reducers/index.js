// reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
import apprFormReducer from "./appr/apprFormReducer";
import apprDocReducer from "./appr/apprDocReducer";
// import authReducer from './authReducer';
// import postReducer from './postReducer';

const rootReducer = combineReducers({
  _placeholder: (state = {}, action) => state,
  apprForm: apprFormReducer,
  apprDoc: apprDocReducer,
  // auth: authReducer ,   // state.auth
  // post: postReducer ,   // state.post
});

export default rootReducer;
