import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NzxtConfig {
    id: string;
    color_args: string;
    night_hours_start: number;
    night_hours_end: number;
}

export interface AppState {
    configs: NzxtConfig[];
}

const initialState: AppState = {
    configs: [],
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        receiveNzxtConfigs: (state, action: PayloadAction<NzxtConfig[]>) => {
            state.configs = action.payload;
        },
        receiveNzxtConfig: (state, action: PayloadAction<NzxtConfig>) => {
            const index = state.configs.findIndex(c => c.id === action.payload.id);

            if (index === -1) {
                state.configs.push(action.payload);
            }
            else {
                state.configs = state.configs.map((c, i) => i === index ? action.payload : c);
            }
        },
    },
});

export default appSlice.reducer;
export const { receiveNzxtConfigs, receiveNzxtConfig } = appSlice.actions;