import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const getSlice = (state: RootState) => state.nzxt;

export const getNzxtConfig = createSelector(
    [getSlice],
    slice => slice.config
)