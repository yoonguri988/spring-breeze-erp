// reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
// import authReducer from './authReducer';
// import postReducer from './postReducer';

const rootReducer = combineReducers({
  _placeholder: (state = {}, action) => state,
  // auth: authReducer ,   // state.auth
  // post: postReducer ,   // state.post
});

export default rootReducer;
