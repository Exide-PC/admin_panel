import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MaintenanceCommand {
    name: string;
    group: string;
}

export interface MaintenanceState {
    commands: MaintenanceCommand[];
}

const initialState: MaintenanceState = {
    commands: [],
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        receiveMaintenanceCommands: (state, action: PayloadAction<MaintenanceCommand[]>) => {
            state.commands = action.payload;
        },
    },
});

export default appSlice.reducer;
export const { receiveMaintenanceCommands } = appSlice.actions;