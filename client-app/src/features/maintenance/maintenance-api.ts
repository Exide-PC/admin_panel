import _fetch from "../../_fetch";
import { Journal, MaintenanceCommand } from "./maintenance-slice";

export async function fetchMaintenanceCommands(): Promise<MaintenanceCommand[]> {
    return await _fetch<MaintenanceCommand[]>(`api/maintenance`, 'GET');
}

export async function fetchExecuteMaintenanceCommand(commandId: string): Promise<void> {
    await _fetch(`api/maintenance`, 'POST', { command_id: commandId });
}

export async function fetchJournals(): Promise<Journal[]> {
    return await _fetch<Journal[]>(`api/maintenance/journal`, 'GET');
}

export type JournalOutput = 'short' | 'short-precise' | 'cat';

export async function fetchJournalLogs(id: string, count: number, output: JournalOutput): Promise<string[]> {
    return await _fetch<string[]>(`api/maintenance/journal/${id}?count=${count}&output=${output}`, 'GET');
}