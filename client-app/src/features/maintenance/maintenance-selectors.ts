import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const getSlice = (state: RootState) => state.maintenance;

export const getMaintenanceCommands = createSelector(
    [getSlice],
    slice => slice.commands
)

export const getJournals = createSelector(
    [getSlice],
    slice => slice.journals
)

export const getIsJournalsLoaded = createSelector(
    [getJournals],
    journals => !!journals.length
)