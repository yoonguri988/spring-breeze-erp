// reducers/__tests__/permReducer.test.js
import permReducer, {
    resetPermState,
    listPermRequest, listPermSuccess, listPermFailure,
    detailPermRequest, detailPermSuccess, detailPermFailure,
    createPermRequest, createPermSuccess, createPermFailure,
    updatePermRequest, updatePermSuccess, updatePermFailure,
    deletePermRequest, deletePermSuccess, deletePermFailure,
} from '../perm/permReducer';

describe('perm reducer', () => {
    const initialState = {
        permList: [],
        currentPerm: null,
        loading: false,
        error: null,
        success: false,
    };

    // --- 권한 조회 ---
    it('listPermRequest & listPermSuccess', () => {
        let state = permReducer(initialState, listPermRequest());
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();

        const permList = [
            { permId: 1, permCode: 'ROLE_MEMBER' },
            { permId: 2, permCode: 'ROLE_ADMIN' },
        ];
        state = permReducer(state, listPermSuccess(permList));
        expect(state.loading).toBe(false);
        expect(state.permList).toEqual(permList);
        expect(state.permList).toHaveLength(2);
        
    });

    // --- 상세 조회 ---
    it('detailPermSuccess', () => {
        const perm = { permId: 3, permName: 'root', permCode: 'ROLE_ROOT' };
        const state = permReducer(initialState, detailPermSuccess(perm));
        expect(state.loading).toBe(false);
        expect(state.currentPerm).toEqual(perm);
    });

    // --- 등록 ---
    it('createPermSuccess', () => {
        const state = permReducer(initialState, createPermSuccess());
        expect(state.loading).toBe(false);
        expect(state.success).toBe(true);
    });

    // --- 수정 ---
    it('updatePermSuccess', () => {
        const updated = { permId: 1, permCode: 'New_Perm' };
        const state = permReducer(initialState, updatePermSuccess(updated));
        expect(state.currentPerm).toEqual(updated);
        expect(state.success).toBe(true);
    });

    // --- 삭제 ---
    it('deletePermSuccess', () => {
        const prev = {
            ...initialState,
            permList: [
            { permId: 1, permCode: 'ROLE_MEMBER' },
            { permId: 2, permCode: 'ROLE_ADMIN' },
            ],
        };

        const state = permReducer(prev, deletePermSuccess(1));
        expect(state.permList).toHaveLength(1);
        expect(state.permList[0].permId).toBe(2);
        expect(state.success).toBe(true);

    });

    // --- 상태 초기화 ---
    it('resetPermState', () => {
        const prev = { ...initialState, loading: true, error: 'err', success: true};
        const state = permReducer(prev, resetPermState());
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.success).toBe(false);
    });

});

// npm test permReducer