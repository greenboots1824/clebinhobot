import Database, { SqliteError } from "better-sqlite3";

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mkdir } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The database path
const dbPath = path.join(__dirname, "..", "database", "database.db");

const db = new Database(dbPath);

export function startDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS phrases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phrase TEXT NOT NULL UNIQUE CHECK (TRIM(phrase) <> ''),
      user TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS guild_config (
      guild_id TEXT PRIMARY KEY,
      prefix TEXT DEFAULT '&',
      automsg INTEGER DEFAULT 0
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS algorithm_config (
      guild_id TEXT PRIMARY KEY,
      prefix TEXT DEFAULT '&',
      automsg INTEGER DEFAULT 0
    )
  `);
}

export async function startDatabaseGuild() {}

/*
export async function startDatabaseAlgorithm() {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS guild_config (
      guild_id TEXT PRIMARY KEY,
      prefix TEXT DEFAULT '&',
      
    )
  `);
}

export async function startDatabaseLogging() {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS guild_config (
      phrase TEXT NOT NULL UNIQUE CHECK (TRIM(phrase) <> ''),
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phrase TEXT NOT NULL UNIQUE CHECK (TRIM(phrase) <> ''),
      user TEXT NOT NULL
    )
  `);
}
*/

// I'm working on it...
// export async function updateDatabaseInfo(id, data) {}
// export async function deleteDatabaseInfo(id) {}
