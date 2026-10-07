import { getSession } from './auth.js';

export const requireAdministrator = (req, res) => {
    let session;
    try {
        session = getSession(req);
    } catch {
        res.status(503).json({ message: 'Authentication is not configured on the server.' });
        return false;
    }

    if (!session) {
        res.status(401).json({ message: 'Sign in is required to access this resource.' });
        return false;
    }
    if (session.role !== 'Administrator') {
        res.status(403).json({ message: 'This resource is only available to administrators.' });
        return false;
    }
    return true;
};
