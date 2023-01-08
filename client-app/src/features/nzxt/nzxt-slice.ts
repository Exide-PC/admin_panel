import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NzxtConfig {
    id: string;
    name: string;
    color_args: string;
    night_hours_start: number;
    night_hours_end: number;
    fan_speed: number;
}

export interface NzxtStatus {
    cpu_temperature: number;
}

export interface AppState {
    configs: NzxtConfig[];
    status: NzxtStatus;
}

const initialState: AppState = {
    configs: [],
    status: {
        cpu_temperature: -1,
    }
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
        removeNzxtConfig: (state, action: PayloadAction<NzxtConfig['id']>) => {
            state.configs = state.configs.filter(c => c.id !== action.payload);
        },
        receiveNzxtStatus: (state, action: PayloadAction<NzxtStatus>) => {
            state.status = action.payload;
        },
    },
});

export default appSlice.reducer;
export const { receiveNzxtConfigs, receiveNzxtConfig, removeNzxtConfig, receiveNzxtStatus } = appSlice.actions;