import _fetch from "../../_fetch";
import { MaintenanceCommand } from "./maintenance-slice";

export async function fetchMaintenanceCommands(): Promise<MaintenanceCommand[]> {
    return await _fetch<MaintenanceCommand[]>(`api/maintenance`, 'GET');
}

export async function fetchExecuteMaintenanceCommand(commandIndex: number): Promise<void> {
    await _fetch(`api/maintenance`, 'POST', { command_index: commandIndex });
}