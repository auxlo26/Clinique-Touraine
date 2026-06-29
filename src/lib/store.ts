import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readStore<T>(file: string): Promise<T[]> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, file);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export async function appendStore<T>(file: string, entry: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, file);
  const current = await readStore<T>(file);
  current.push(entry);
  await fs.writeFile(filePath, JSON.stringify(current, null, 2), "utf-8");
  return entry;
}

export function generateReference(prefix: string): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${stamp}-${rand}`;
}
