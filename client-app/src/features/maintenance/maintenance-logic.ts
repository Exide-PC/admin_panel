import { AppThunk } from "../../app/store";
import { fetchExecuteMaintenanceCommand, fetchMaintenanceCommands } from "./maintenance-api";
import { receiveMaintenanceCommands } from "./maintenance-slice";

export const maintenanceActions = {
    loadMaintenanceCommands: (): AppThunk => async (dispatch, getState) => {
        const commands = await fetchMaintenanceCommands()
        dispatch(receiveMaintenanceCommands(commands));
    },
    executeMaintenanceCommand: (commandId: string): AppThunk<Promise<void>> => async (dispatch, getState) => {
        await fetchExecuteMaintenanceCommand(commandId);
    },
}