import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NzxtConfig {
    color: string;
    night_hours_start: number;
    night_hours_end: number;
}

export interface AppState {
    config: NzxtConfig;
}

const initialState: AppState = {
    config: {
        color: '',
        night_hours_start: 0,
        night_hours_end: 0,
    }
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        receiveNzxtConfig: (state, action: PayloadAction<NzxtConfig>) => {
            state.config = action.payload;
        },
    },
});

export default appSlice.reducer;
export const { receiveNzxtConfig } = appSlice.actions;