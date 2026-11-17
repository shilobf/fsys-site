// Production entry point: runs the NestJS API (internal port) and the Angular SSR server
// (public PORT, proxies /api to the API) as one service. If either exits, both stop so the
// host restarts the service.
import { spawn } from 'node:child_process';

const apiPort = process.env.API_PORT || '3001';
const webPort = process.env.PORT || '4000';

const children = [
  run('api', 'api', 'dist/main.js', { PORT: apiPort, API_HOST: '127.0.0.1' }),
  run('web', 'web', 'dist/web/server/server.mjs', { PORT: webPort, API_URL: `http://127.0.0.1:${apiPort}` }),
];

function run(name, cwd, entry, env) {
  const child = spawn(process.execPath, [entry], { cwd, env: { ...process.env, ...env }, stdio: 'inherit' });
  child.on('exit', (code, signal) => {
    console.error(`[start] ${name} exited (${signal ?? code}); stopping`);
    shutdown(code || 1);
  });
  return child;
}

let stopping = false;
function shutdown(code) {
  if (stopping) return;
  stopping = true;
  for (const c of children) if (c.exitCode === null) c.kill('SIGTERM');
  setTimeout(() => process.exit(code), 3000).unref();
}

for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => shutdown(0));
