import _fetch from "../../_fetch";
import { NzxtConfig } from "./nzxt-slice";

export async function fetchNzxtConfig(): Promise<NzxtConfig> {
    return await _fetch<NzxtConfig>(`api/nzxt`, 'GET');
}

export async function fetchUpdateNzxtConfig(settings: Partial<NzxtConfig>): Promise<void> {
    await _fetch(`api/nzxt`, 'PUT', settings);
}