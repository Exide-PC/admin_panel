import _fetch from "../../_fetch";

export async function fetchUpdateNzxtColor(color: string): Promise<void> {
    return await _fetch<void>(`api/nzxt-color`, 'POST', { color });
}