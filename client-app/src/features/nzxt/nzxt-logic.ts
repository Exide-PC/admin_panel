import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AppThunk } from "../../app/store";
import { fetchNzxtConfigs, fetchUpdateNzxtConfig } from "./nzxt-api";
import { getIsNzxtConfigsLoaded, getCurrentNzxtConfig, getNzxtConfigs } from "./nzxt-selectors";
import { NzxtConfig, receiveNzxtConfig, receiveNzxtConfigs } from "./nzxt-slice";

export const nzxtActions = {
    loadNzxtConfig: (): AppThunk => async (dispatch, getState) => {
        const configs = await fetchNzxtConfigs();
        dispatch(receiveNzxtConfigs(configs));
    },
    updateNzxtConfig: (config: NzxtConfig, saveToDb: boolean): AppThunk<Promise<void>> => async (dispatch, getState) => {
        await fetchUpdateNzxtConfig(config, saveToDb);
        dispatch(receiveNzxtConfig(config));
    }
}

export const useNzxtConfig = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(nzxtActions.loadNzxtConfig());
    }, [dispatch]);

    const currentConfig = useAppSelector(getCurrentNzxtConfig);
    const configs = useAppSelector(getNzxtConfigs);
    const isLoaded = useAppSelector(getIsNzxtConfigsLoaded);

    return [
        currentConfig,
        configs,
        isLoaded,
    ] as const;
}