import _fetch from "../../_fetch";
import { AppSettings } from "./app-slice";

export async function fetchApp(): Promise<AppSettings> {
    return await _fetch<AppSettings>(`api/app`, 'GET');
}