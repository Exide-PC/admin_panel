import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const getSlice = (state: RootState) => state.maintenance;

export const getMaintenanceCommands = createSelector(
    [getSlice],
    slice => slice.commands
)