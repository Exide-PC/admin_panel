import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AppThunk } from "../../app/store";
import { receiveSettingsPart } from "../app/app-slice";
import { fetchNzxtConfigs, fetchUpdateNzxtConfig } from "./nzxt-api";
import { getIsNzxtConfigsLoaded, getCurrentNzxtConfig, getNzxtConfigs } from "./nzxt-selectors";
import { NzxtConfig, receiveNzxtConfig, receiveNzxtConfigs } from "./nzxt-slice";

export const nzxtActions = {
    loadNzxtConfig: (): AppThunk => async (dispatch, getState) => {
        const configs = await fetchNzxtConfigs();
        dispatch(receiveNzxtConfigs(configs));
    },
    updateNzxtConfig: (config: NzxtConfig): AppThunk<Promise<void>> => async (dispatch, getState) => {
        await fetchUpdateNzxtConfig(config);
        dispatch(receiveNzxtConfig(config));
        dispatch(receiveSettingsPart({ nzxt_config_id: config.id }));
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