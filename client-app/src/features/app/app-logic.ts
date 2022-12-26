import { AppThunk } from "../../app/store";
import { fetchApp } from "./app-api";
import { AppStateEnum, receiveAppState, receiveSettings } from "./app-slice";

export const appActions = {
    initApp: (token?: string): AppThunk => async (dispatch, getState) => {
        if (token) {
            localStorage.setItem('token', token);
        }

        try {
            const app = await fetchApp();
            dispatch(receiveSettings(app));
            dispatch(receiveAppState(AppStateEnum.Initialized));
        }
        catch (e: any) {
            if (e.message.toLowerCase().includes('token')) {
                dispatch(receiveAppState(AppStateEnum.Unathorized));
            }
            else if (e.message === 'Failed to fetch') {
                dispatch(receiveAppState(AppStateEnum.ServerDown));
            }
            else {
                throw e;
            }
        }
    },
}