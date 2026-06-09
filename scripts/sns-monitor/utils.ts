import * as fs from 'fs';
import * as path from 'path';

export const INTEL_DIR = path.resolve(process.cwd(), 'intel');

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export function saveRaw(channel: string, data: unknown): string {
  const date = new Date().toISOString().split('T')[0];
  const dir = path.join(INTEL_DIR, 'raw', channel);
  ensureDir(dir);
  const file = path.join(dir, `${date}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`[${channel}] 저장: ${file}`);
  return file;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function today(): string {
  return new Date().toISOString().split('T')[0];
}
