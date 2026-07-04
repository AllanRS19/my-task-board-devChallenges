// This is the fetch wrapper for the API calls to the server
const API_BASE_URL = '/api/v1';

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

async function fetcher<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
        throw new ApiError(res.status, json.message ?? 'Something went wrong');
    }

    return json.data as T;
}

export const api = {
    get: <T>(path: string) => fetcher<T>(path),
    post: <T>(path: string, body?: unknown) =>
        fetcher<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
    patch: <T>(path: string, body?: unknown) =>
        fetcher<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(path: string) => fetcher<T>(path, { method: 'DELETE' })
}