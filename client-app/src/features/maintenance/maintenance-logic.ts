import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AppThunk } from "../../app/store";
import { fetchExecuteMaintenanceCommand, fetchJournals, fetchMaintenanceCommands } from "./maintenance-api";
import { getIsJournalsLoaded, getJournals } from "./maintenance-selectors";
import { receiveJournals, receiveMaintenanceCommands } from "./maintenance-slice";

export const maintenanceActions = {
    loadMaintenanceCommands: (): AppThunk => async (dispatch, getState) => {
        const commands = await fetchMaintenanceCommands()
        dispatch(receiveMaintenanceCommands(commands));
    },
    executeMaintenanceCommand: (commandId: string): AppThunk<Promise<void>> => async (dispatch, getState) => {
        await fetchExecuteMaintenanceCommand(commandId);
    },
    loadJournals: (): AppThunk => async (dispatch, getState) => {
        const journals = await fetchJournals()
        dispatch(receiveJournals(journals));
    },
}

export const useJournals = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(maintenanceActions.loadJournals());
    }, [dispatch]);

    const status = useAppSelector(getJournals);
    const isLoaded = useAppSelector(getIsJournalsLoaded);

    return [
        status,
        isLoaded,
    ] as const;
}