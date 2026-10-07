const configuredBaseUrl = import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL || '';
const defaultBaseUrl =
    import.meta.env.PROD && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/i.test(configuredBaseUrl)
        ? ''
        : configuredBaseUrl;
const collectionWriteQueues = new Map();

const buildUrl = (path) => {
    if (!defaultBaseUrl) return path;

    const normalizedBase = defaultBaseUrl.endsWith('/') ? defaultBaseUrl.slice(0, -1) : defaultBaseUrl;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
};

const requestJson = async (path, options = {}) => {
    const token = localStorage.getItem('academy_token');
    if (token && token.length > 8_000) {
        localStorage.removeItem('academy_token');
        localStorage.removeItem('academy_user');
        window.location.assign('/login');
        throw new Error('Your saved session is too large and has been cleared. Sign in again to continue.');
    }

    let response;
    try {
        response = await fetch(buildUrl(path), {
            ...options,
            headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            body: options.body !== undefined ? JSON.stringify(options.body) : undefined
        });
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('The Academy API could not be reached. Make sure the API server is running, then try again.');
        }
        throw error;
    }

    if (!response.ok) {
        const responseBody = await response.text();
        let message = responseBody;
        try {
            const parsedBody = JSON.parse(responseBody);
            message = parsedBody.message || responseBody;
        } catch {
            // Keep the original response text when the server did not return JSON.
        }
        const error = new Error(message || `Request failed with status ${response.status}`);
        error.statusCode = response.status;
        throw error;
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

export const apiHealth = () => requestJson('/api/health');

export const fetchCollection = (collectionName) => requestJson(`/api/${collectionName}`);
export const fetchPublicArticles = () => requestJson('/api/articles');
export const createArticle = (article) => requestJson('/api/articles', { method: 'POST', body: article });
export const updateArticle = (article) => requestJson('/api/articles', { method: 'PUT', body: article });
export const deleteArticle = (id) => requestJson('/api/articles', { method: 'DELETE', body: { id } });

export const loginRequest = (username, password, role) =>
    requestJson('/api/auth', {
        method: 'POST',
        body: { action: 'login', username, password, role }
    });

export const fetchStudentAccountStatus = (studentId) =>
    requestJson('/api/auth', {
        method: 'POST',
        body: { action: 'studentAccountStatus', studentId }
    });

export const configureStudentAccount = (studentId, username, password) =>
    requestJson('/api/auth', {
        method: 'POST',
        body: { action: 'configureStudentAccount', studentId, username, password }
    });

export const fetchPublicCoaches = () =>
    requestJson('/api/auth', {
        method: 'POST',
        body: { action: 'publicCoaches' }
    });

export const inviteTeacherRequest = (teacher) =>
    requestJson('/api/auth', {
        method: 'POST',
        body: { action: 'inviteTeacher', teacher }
    });

export const requestTeacherOtp = (email) =>
    requestJson('/api/auth', {
        method: 'POST',
        body: { action: 'requestTeacherOtp', email }
    });

export const verifyTeacherOtp = (email, otp) =>
    requestJson('/api/auth', {
        method: 'POST',
        body: { action: 'verifyTeacherOtp', email, otp }
    });

export const completeTeacherActivation = (email, activationToken, username, password) =>
    requestJson('/api/auth', {
        method: 'POST',
        body: { action: 'completeTeacherActivation', email, activationToken, username, password }
    });

export const fetchTeacherWorkspace = () =>
    requestJson('/api/auth', {
        method: 'POST',
        body: { action: 'teacherWorkspace' }
    });

export const fetchStudentWorkspace = () =>
    requestJson('/api/auth', {
        method: 'POST',
        body: { action: 'studentWorkspace' }
    });

export const replaceCollection = (collectionName, items) => {
    const previousWrite = collectionWriteQueues.get(collectionName) || Promise.resolve();
    const write = previousWrite
        .catch(() => {})
        .then(() =>
            requestJson(`/api/${collectionName}`, {
                method: 'PUT',
                body: { items }
            })
        );

    collectionWriteQueues.set(collectionName, write);
    return write.finally(() => {
        if (collectionWriteQueues.get(collectionName) === write) {
            collectionWriteQueues.delete(collectionName);
        }
    });
};
