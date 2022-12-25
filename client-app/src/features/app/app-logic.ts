import { AppThunk } from "../../app/store";
import { fetchApp, fetchPatchSettings } from "./app-api";
import { AppSettings, AppStateEnum, receiveAppState, receiveSettings } from "./app-slice";

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
    patchSettings: (settings: Partial<AppSettings>): AppThunk<Promise<void>> => async (dispatch, getState) => {
        const newSettings = await fetchPatchSettings(settings);
        dispatch(receiveSettings(newSettings));
    }
}