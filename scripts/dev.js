import { spawn } from 'node:child_process';

const children = [
    spawn(process.execPath, ['server.js'], { stdio: 'inherit' }),
    spawn(process.execPath, ['node_modules/vite/bin/vite.js'], { stdio: 'inherit' })
];

let shuttingDown = false;

const shutdown = (exitCode = 0) => {
    if (shuttingDown) return;
    shuttingDown = true;
    for (const child of children) {
        if (!child.killed) child.kill();
    }
    process.exit(exitCode);
};

for (const child of children) {
    child.on('error', (error) => {
        console.error('Development server failed to start:', error.message);
        shutdown(1);
    });
    child.on('exit', (code, signal) => {
        if (!shuttingDown && (code !== 0 || signal)) {
            shutdown(code || 1);
        }
    });
}

process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
