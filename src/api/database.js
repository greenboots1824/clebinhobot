import Database, { SqliteError } from "better-sqlite3";

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mkdir } from 'node:fs/promises';

import { startDatabase } from './setupDatabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The database path
const dbPath = path.join(__dirname, "..", "database", "database.db");

const db = new Database(dbPath);

export function insertDatabaseInfo(msg, user) {
  try {
    db.prepare(`
      INSERT OR IGNORE INTO phrases (phrase, user)
      VALUES (?, ?)
    `).run(msg, user);

    console.log(`[+] (insertDatabaseInfo) "${msg}" de ${user} enviado para o banco de dados`);

    return true;
  } catch (error) {
    if (error instanceof SqliteError) {
      console.error(`[!] Error: ${error}`);
      startDatabasePhrases();
      
      return;
    } else {
      console.error(`[!] Error: ${error}`);
      return null;
    }
  }
}

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
    if (error instanceof SqliteError) {
      console.error(error);
      startDatabasePhrases();

      return null;
    } else {
      console.error(error);
      return null;
    }
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
      startDatabasePhrases();

      return null;
    } else {
      console.error(error);
      return null;
    }
  }
}
