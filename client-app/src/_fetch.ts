import { _API_ } from "./consts";

const _fetch = async <T>(uri: string, method: RequestInit['method'], json?: any): Promise<T> => {

    const token = localStorage.getItem('token')

    const authHeaders = token && {
        'Authorization': `Basic ${token}`
    }

    const response = await fetch(`${_API_}/${uri}`, {
        method: method,
        body: json && JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
        }
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error)
    }

    if (response.status !== 204) {
        return await response.json();
    }

    return undefined as T;
}

export default _fetch;