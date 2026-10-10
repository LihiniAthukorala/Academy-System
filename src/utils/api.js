const defaultBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

const buildUrl = (path) => {
    if (!defaultBaseUrl) return path;

    const normalizedBase = defaultBaseUrl.endsWith('/') ? defaultBaseUrl.slice(0, -1) : defaultBaseUrl;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
};

const requestJson = async (path, options = {}) => {
    const response = await fetch(buildUrl(path), {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

export const apiHealth = () => requestJson('/api/health');

export const fetchCollection = (collectionName) => requestJson(`/api/${collectionName}`);

export const replaceCollection = (collectionName, items) =>
    requestJson(`/api/${collectionName}`, {
        method: 'PUT',
        body: { items }
    });
