import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MaintenanceCommand {
    id: string;
    name: string;
    group: string;
}

export interface Journal {
    id: string;
    unit: string;
    name: string;
}

export interface MaintenanceState {
    commands: MaintenanceCommand[];
    journals: Journal[];
}

const initialState: MaintenanceState = {
    commands: [],
    journals: [],
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        receiveMaintenanceCommands: (state, action: PayloadAction<MaintenanceCommand[]>) => {
            state.commands = action.payload;
        },
        receiveJournals: (state, action: PayloadAction<Journal[]>) => {
            state.journals = action.payload;
        },
    },
});

export default appSlice.reducer;
export const { receiveMaintenanceCommands, receiveJournals } = appSlice.actions;