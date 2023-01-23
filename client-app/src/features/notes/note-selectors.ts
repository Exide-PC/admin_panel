import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const getSlice = (state: RootState) => state.note;

export const getNotes = createSelector(
    [getSlice],
    slice => slice.notes
)

export const getApprovedPassword = createSelector(
    [getSlice],
    slice => slice.approvedPassword
)