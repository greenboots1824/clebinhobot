import Database, { SqliteError } from "better-sqlite3";
const db = new Database("database.db");

export async function startDatabase() {
	await db.exec(`
		CREATE TABLE IF NOT EXISTS phrases (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			phrase TEXT NOT NULL UNIQUE CHECK (TRIM(phrase) <> ''),
			user TEXT NOT NULL
		)
	`);
}

export async function insertDatabase(msg, user) {
	try {
		await db.prepare(`
			INSERT OR IGNORE INTO phrases (phrase, user)
			VALUES (?, ?)
		`).run(msg, user);

		await console.log(`[+] (insertDatabase) "${msg}" de ${user} enviado para o banco de dados`);

		return true;
	} catch (error) {
		if (error instanceof SqliteError) {
			await console.error(`[!] Error: ${error.name}`);
			await startDatabase();
			
			return;
		} else {
			return error;
		}
	}
}

export async function randomDatabase() {
	try {
		const result = await db.prepare(`
			SELECT * FROM phrases
			ORDER BY RANDOM()
			LIMIT 1
		`).get();

		await console.log(`[+] (random) Frase "${result.phrase}" foi escolhida!`);
		
		return result.phrase;
	} catch (error) {
		if (error instanceof SqliteError) {
			await console.error(error);
			await startDatabase();

			return null;
		} else {
			await console.error(error);
			return null;
		}
	}
}

export async function searchDatabaseRandomRegex(pattern) {
	try {
		const searchRandom = await db.prepare(`
			SELECT * FROM phrases
			WHERE phrase LIKE ?
			ORDER BY RANDOM()
			LIMIT 1
		`).get(`%${pattern}%`);

		if (searchRandom === undefined) {
			return randomDatabase();
		}

		await console.log(`[+] (randomRegex) Foi escolhida a mensagem "${searchRandom.phrase}"!`);

		return searchRandom.phrase;
	} catch (error) {
		if (error instanceof SqliteError) {
			await console.error(error);
			await startDatabase();

			return null;
		} else {
			await console.error(error);
			return null;
		}
	}
}
