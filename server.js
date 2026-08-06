import 'dotenv/config';
import http from 'node:http';
import { parse } from 'node:url';
import healthHandler from './api/health.js';
import studentsHandler from './api/students.js';
import classesHandler from './api/classes.js';
import attendanceHandler from './api/attendance.js';
import paymentsHandler from './api/payments.js';
import teachersHandler from './api/teachers.js';

const port = Number(process.env.PORT || 3001);

const routeHandlers = {
    '/api/health': healthHandler,
    '/api/students': studentsHandler,
    '/api/classes': classesHandler,
    '/api/attendance': attendanceHandler,
    '/api/payments': paymentsHandler,
    '/api/teachers': teachersHandler,
    '/api/users': await import('./api/users.js').then((mod) => mod.default)
};

const sendJson = (res, statusCode, data) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end(JSON.stringify(data));
};

const createResponse = (res) => ({
    status(code) {
        res.statusCode = code;
        return this;
    },
    json(payload) {
        sendJson(res, res.statusCode || 200, payload);
    }
});

const readBody = (req) =>
    new Promise((resolve, reject) => {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            if (!body) {
                resolve(null);
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });

        req.on('error', reject);
    });

const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.end();
        return;
    }

    const { pathname } = parse(req.url || '', true);
    const handler = pathname ? routeHandlers[pathname] : null;

    if (!handler) {
        sendJson(res, 404, { message: 'Not found' });
        return;
    }

    try {
        req.body = req.method === 'GET' || req.method === 'HEAD' ? null : await readBody(req);
        const response = createResponse(res);
        await handler(req, response);
    } catch (error) {
        sendJson(res, 500, { message: error.message });
    }
});

server.listen(port, () => {
    console.log(`Academy API running on http://localhost:${port}`);
});
