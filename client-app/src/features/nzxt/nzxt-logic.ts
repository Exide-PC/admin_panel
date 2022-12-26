import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AppThunk } from "../../app/store";
import { fetchNzxtConfig, fetchUpdateNzxtConfig } from "./nzxt-api";
import { getNzxtConfig } from "./nzxt-selectors";
import { NzxtConfig, receiveNzxtConfig } from "./nzxt-slice";

export const nzxtActions = {
    loadNzxtConfig: (): AppThunk => async (dispatch, getState) => {
        const config = await fetchNzxtConfig();
        dispatch(receiveNzxtConfig(config));
    },
    updateNzxtConfig: (config: NzxtConfig): AppThunk<Promise<void>> => async (dispatch, getState) => {
        await fetchUpdateNzxtConfig(config);
        dispatch(receiveNzxtConfig(config));
    }
}

export const useNzxtConfig = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(nzxtActions.loadNzxtConfig());
    }, [dispatch]);

    const config = useAppSelector(getNzxtConfig);

    return [
        config,
        !!config.color
    ] as const;
}