import _fetch from "../../_fetch";
import { NzxtConfig } from "./nzxt-slice";

export async function fetchNzxtConfigs(): Promise<NzxtConfig[]> {
    return await _fetch<NzxtConfig[]>(`api/nzxt`, 'GET');
}

export async function fetchUpdateNzxtConfig(config: NzxtConfig): Promise<void> {
    await _fetch(`api/nzxt`, 'PUT', config);
}