import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const getSlice = (state: RootState) => state.app;

export const getAppSettings = createSelector(
    [getSlice],
    slice => slice.settings
)

export const getNzxtConfigId = createSelector(
    [getAppSettings],
    settings => settings.nzxt_config_id
)

export const getAppState = createSelector(
    [getSlice],
    slice => slice.state
)