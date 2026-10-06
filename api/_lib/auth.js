import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const sessionLifetimeSeconds = 60 * 60 * 8;
const developmentAuthSecret = 'academy-local-development-auth-secret-change-before-production';

const getAuthSecret = () => {
    const secret = process.env.AUTH_SECRET || (process.env.NODE_ENV !== 'production' ? developmentAuthSecret : '');
    if (!secret || secret.length < 32 || secret.startsWith('replace-with-')) {
        const error = new Error('AUTH_SECRET must be configured with at least 32 characters.');
        error.statusCode = 503;
        throw error;
    }
    return secret;
};

const sign = (value) =>
    createHmac('sha256', getAuthSecret()).update(value).digest('base64url');

export const createSessionToken = (user) => {
    const issuedAt = Math.floor(Date.now() / 1000);
    const payload = Buffer.from(JSON.stringify({
        ...user,
        iat: issuedAt,
        exp: issuedAt + sessionLifetimeSeconds
    })).toString('base64url');
    const content = `academy.${payload}`;
    return `${content}.${sign(content)}`;
};

export const getSession = (req) => {
    const authorization = req.headers.authorization || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    const [issuer, payload, signature, extra] = token.split('.');

    if (!token || issuer !== 'academy' || !payload || !signature || extra) {
        return null;
    }

    try {
        const content = `${issuer}.${payload}`;
        const expectedSignature = Buffer.from(sign(content));
        const actualSignature = Buffer.from(signature);
        if (expectedSignature.length !== actualSignature.length || !timingSafeEqual(expectedSignature, actualSignature)) {
            return null;
        }

        const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        if (!session.exp || session.exp <= Math.floor(Date.now() / 1000)) {
            return null;
        }
        return session;
    } catch {
        return null;
    }
};

export const hashPassword = (password) => {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
};

export const verifyPassword = (password, passwordHash) => {
    if (typeof passwordHash !== 'string') return false;
    const [salt, expectedHex] = passwordHash.split(':');
    if (!salt || !/^[a-f0-9]{128}$/i.test(expectedHex || '')) return false;

    const actual = scryptSync(password, salt, 64);
    const expected = Buffer.from(expectedHex, 'hex');
    return timingSafeEqual(actual, expected);
};

export const getAdminCredentials = () => {
    const useDevelopmentCredentials = process.env.NODE_ENV !== 'production';
    const username = process.env.ADMIN_USERNAME || (useDevelopmentCredentials ? 'admin' : '');
    const password = process.env.ADMIN_PASSWORD || (useDevelopmentCredentials ? 'password123' : '');
    if (!username || !password || password.startsWith('replace-with-')) {
        const error = new Error('Configure ADMIN_USERNAME and ADMIN_PASSWORD in the server environment.');
        error.statusCode = 503;
        throw error;
    }
    return { username, password };
};
