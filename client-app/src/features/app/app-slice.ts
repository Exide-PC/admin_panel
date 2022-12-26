import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppSettings {
}

export enum AppStateEnum {
    Initial = 0,
    ServerDown = 1,
    Unathorized = 2,
    Initialized = 3,
}

export interface AppState {
    state: AppStateEnum;
    settings: AppSettings;
}

const initialState: AppState = {
    state: AppStateEnum.Initial,
    settings: {
        nzxt_color: '',
        nzxt_night_hours_start: 0,
        nzxt_night_hours_end: 0,
    }
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        receiveAppState: (state, action: PayloadAction<AppStateEnum>) => {
            state.state = action.payload;
        },
        receiveSettings: (state, action: PayloadAction<AppSettings>) => {
            state.settings = action.payload;
        },
    },
});

export default appSlice.reducer;
export const { receiveSettings, receiveAppState } = appSlice.actions;