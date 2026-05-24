import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        updateSavedJobs: (state, action) => {
            if (!state.user) return;
            state.user.savedJobs = action.payload; // update saved jobs array
        }
    }
});

export const { setLoading, setUser, updateSavedJobs } = authSlice.actions;
export default authSlice.reducer;
