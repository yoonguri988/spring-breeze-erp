//reducers/index.js
import {combineReducers} from "@reduxjs/toolkit";
import empReducer from './emp/empReducer';
import posReducer from './pos/posReducer';

const rootReducer = combineReducers({
    emp: empReducer,  // state.emp
    pos: posReducer, // state.pos
});

export default rootReducer;