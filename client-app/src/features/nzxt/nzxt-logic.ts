import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AppThunk } from "../../app/store";
import { appActions } from "../app/app-logic";
import { receiveSettingsPart } from "../app/app-slice";
import { fetchCreateNzxtConfig, fetchDeleteNzxtConfig, fetchNzxtConfigs, fetchNzxtStatus, fetchUpdateNzxtConfig } from "./nzxt-api";
import { getIsNzxtConfigsLoaded, getCurrentNzxtConfig, getNzxtConfigs, getNzxtStatus, getIsNzxtStatusLoaded } from "./nzxt-selectors";
import { NzxtConfig, receiveNzxtConfig, receiveNzxtConfigs, receiveNzxtStatus, removeNzxtConfig } from "./nzxt-slice";

export const nzxtActions = {
    loadNzxtConfig: (): AppThunk => async (dispatch, getState) => {
        const configs = await fetchNzxtConfigs();
        dispatch(receiveNzxtConfigs(configs));
    },
    createNzxtConfig: (config: NzxtConfig): AppThunk<Promise<void>> => async (dispatch, getState) => {
        await fetchCreateNzxtConfig(config);
        dispatch(receiveNzxtConfig(config));
        dispatch(receiveSettingsPart({ nzxt_config_id: config.id }));
    },
    updateNzxtConfig: (config: NzxtConfig): AppThunk<Promise<void>> => async (dispatch, getState) => {
        await fetchUpdateNzxtConfig(config);
        dispatch(receiveNzxtConfig(config));
        dispatch(receiveSettingsPart({ nzxt_config_id: config.id }));
    },
    deleteNzxtConfig: (config: NzxtConfig): AppThunk<Promise<void>> => async (dispatch, getState) => {
        await fetchDeleteNzxtConfig(config.id);
        await dispatch(appActions.initApp());
        dispatch(removeNzxtConfig(config.id));
    },
    loadNzxtStatus: (): AppThunk => async (dispatch, getState) => {
        const status = await fetchNzxtStatus();
        dispatch(receiveNzxtStatus(status));
    },
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

export const useNzxtStatus = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(nzxtActions.loadNzxtStatus());
    }, [dispatch]);

    const status = useAppSelector(getNzxtStatus);
    const isLoaded = useAppSelector(getIsNzxtStatusLoaded);

    return [
        status,
        isLoaded,
    ] as const;
}