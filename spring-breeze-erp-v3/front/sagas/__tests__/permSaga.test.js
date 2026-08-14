// sagas/__tests__/permSaga.test.js
import { call, put } from 'redux-saga/effects';
import axios from 'axios';

import {
    resetPermState,
    listPermRequest, listPermSuccess, listPermFailure,
    detailPermRequest, detailPermSuccess, detailPermFailure,
    createPermRequest, createPermSuccess, createPermFailure,
    updatePermRequest, updatePermSuccess, updatePermFailure,
    deletePermRequest, deletePermSuccess, deletePermFailure,
} from '../../reducers/perm/permReducer';

import { listPerm, detailPerm, createPerm, updatePerm, deletePerm } from '../perm/permSaga';

jest.mock('axios'); // api 호출 없음!! 가짜로 처리

describe('perm saga', ()=>{
    afterEach(()=>{ jest.clearAllMocks() });

    // --- 목록 조회 ---
        it('listperm success', () => {
            const generator = listPerm(listPermRequest());
    
            // 1. 첫 번째 yield → call
            expect(generator.next().value.type).toBe('CALL');
    
            // 2. API 결과 put(listPermSuccess(data))
            const mockData = [
                { permId: 1, permCode: 'ROLE_MEMBER' },
                { permId: 2, permCode: 'ROLE_ADMIN' },
            ];
            const putStep = generator.next({ data: mockData }).value;
            expect(putStep).toEqual(put(listPermSuccess(mockData)));
        });

});

// npm test permSaga