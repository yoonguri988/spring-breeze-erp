import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    summary: null,
    summaryLoading: false,
    summaryError: null,
};

const userDashboardReducer = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        fetchSummaryRequest: (state) => {
            state.summaryLoading = true;
            state.summaryError = null;
        },
        fetchSummarySuccess: (state, action) => {
            state.summaryLoading = false;
            state.summary = action.payload;
        },
        fetchSummaryFailure: (state, action) => {
            state.summaryLoading = false;
            state.summaryError = action.payload;
        },
    },
});

export const {
    fetchSummaryRequest, fetchSummarySuccess, fetchSummaryFailure,
} = userDashboardReducer.actions;

export default userDashboardReducer.reducer;