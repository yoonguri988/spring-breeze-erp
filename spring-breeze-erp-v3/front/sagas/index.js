// sagas/index.js
import { all, fork } from 'redux-saga/effects';
import empSaga from './emp/empSaga';
import posSaga from './pos/posSaga';


export default function *rootSaga(){
    yield all([
        fork(empSaga),
        fork(posSaga),
    ]);
}