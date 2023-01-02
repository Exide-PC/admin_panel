import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppSettings {
    nzxt_config_id: string;
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
        nzxt_config_id: '',
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
        receiveSettingsPart: (state, action: PayloadAction<Partial<AppSettings>>) => {
            state.settings = {
                ...state.settings,
                ...action.payload
            };
        },
    },
});

export default appSlice.reducer;
export const { receiveSettings, receiveAppState, receiveSettingsPart } = appSlice.actions;