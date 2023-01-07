import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { getNzxtConfigId } from "../app/app-selectors";

const getSlice = (state: RootState) => state.nzxt;

export const getNzxtConfigs = createSelector(
    [getSlice],
    configs => configs.configs
)

export const getCurrentNzxtConfig = createSelector(
    [getNzxtConfigs, getNzxtConfigId],
    (configs, configId) => configs.find(c => c.id === configId)
)

export const getIsNzxtConfigsLoaded = createSelector(
    [getNzxtConfigs],
    configs => !!configs.length
)

export const getNzxtStatus = createSelector(
    [getSlice],
    slice => slice.status
)

export const getIsNzxtStatusLoaded = createSelector(
    [getNzxtStatus],
    status => status.cpu_temperature !== -1
)