import { spawn } from 'node:child_process';
import path from 'node:path';

const port = process.env.PORT || '4173';
const viteBin = path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');

const child = spawn(
  process.execPath,
  [viteBin, 'preview', '--host', '0.0.0.0', '--port', String(port), '--strictPort'],
  { stdio: 'inherit', env: process.env }
);

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
