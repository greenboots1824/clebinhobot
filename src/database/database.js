import Database, { SqliteError } from "better-sqlite3";

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mkdir } from 'node:fs/promises';

import { startDatabase } from './setupDatabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The database path
const dbPath = path.join(__dirname, "..", "db", "database.db");
const db = new Database(dbPath);

export function insertDatabaseInfo(msg, user) {
  try {
    db.prepare(`
      INSERT OR IGNORE
      INTO phrases (phrase, user)
      VALUES (?, ?)
    `).run(msg, user);

    console.log(`[+] (insertDatabaseInfo) "${msg}" de ${user} enviado para o banco de dados`);

    return true;
  } catch (error) {
      console.error(`[!] Error: ${error}`);
      return null;
  }
}

export function consultDatabaseConfig(guildID) {
  try {
    const response = db.prepare(`
      SELECT * FROM guild_config
      WHERE guild_id = ?
    `).get(guildID);

    if (response) {
      return response;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function editDatabaseConfig(guildId, prefix, automsg) {
  try {
    // Update the database
    db.prepare(`
      INSERT INTO guild_config (guild_id, prefix, automsg)
      VALUES (?, ?, ?)
      ON CONFLICT(guild_id) DO UPDATE SET
        prefix = excluded.prefix,
        automsg = excluded.automsg
    `).run(guildId, prefix, automsg);
  } catch (error) {
    console.error(error);
    return null;
  }
}

// I'm working on it...
// export async function deleteDatabaseInfo(id) {}

export function randomDatabase() {
  try {
    const result = db.prepare(`
      SELECT * FROM phrases
      ORDER BY RANDOM()
      LIMIT 1
    `).get();

    console.log(`[+] (random) Frase "${result.phrase}" foi escolhida!`);
    
    return result.phrase;
  } catch (error) {
      console.error(error);
      return null;
  }
}

export function searchDatabaseRandomRegex(pattern) {
  try {
    const searchRandom = db.prepare(`
      SELECT * FROM phrases
      WHERE phrase LIKE ?
      ORDER BY RANDOM()
      LIMIT 1
    `).get(`%${pattern}%`);

    if (searchRandom == undefined) {
      return randomDatabase();
    }

    console.log(`[+] (randomRegex) Foi escolhida a mensagem "${searchRandom.phrase}"!`);

    return searchRandom.phrase;
  } catch (error) {
    if (error instanceof SqliteError) {
      console.error(error);
      return null;
    }
  }
}
