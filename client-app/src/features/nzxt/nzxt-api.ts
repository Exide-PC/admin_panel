import _fetch from "../../_fetch";
import { NzxtConfig, NzxtStatus } from "./nzxt-slice";

export async function fetchNzxtConfigs(): Promise<NzxtConfig[]> {
    return await _fetch<NzxtConfig[]>(`api/nzxt/config`, 'GET');
}

export async function fetchUpdateNzxtConfig(config: NzxtConfig): Promise<void> {
    await _fetch(`api/nzxt/config`, 'PUT', config);
}

export async function fetchNzxtStatus(): Promise<NzxtStatus> {
    return await _fetch<NzxtStatus>(`api/nzxt/status`, 'GET');
}