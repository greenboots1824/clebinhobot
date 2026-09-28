import Database, { SqliteError } from "better-sqlite3";
const db = new Database("database.db");

export async function startDatabase() {
	await db.exec(`
		CREATE TABLE IF NOT EXISTS phrases (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			phrase TEXT NOT NULL UNIQUE,
			user TEXT NOT NULL
		)
	`);
}

export async function randomDatabase() {
	while (true) {
		try {
			const result = await db.prepare(`
				SELECT * FROM phrases
				ORDER BY RANDOM()
				LIMIT 1
			`).get();

			if (!result) return false;

			await console.log(`[+] Frase "${result.phrase}" foi escolhida!`);
			
			return result.phrase;
		} catch (error) {
			if (error instanceof SqliteError) {
				startDatabase();
				return false;
			} else {
				return error;
			}
		}
	}
}

export async function searchDatabaseRandomRegex(pattern) {
	while (true) {
		try {
			const searchRandom = await db.prepare(`
				SELECT * FROM phrases
				WHERE phrase LIKE ?
				ORDER BY RANDOM()
				LIMIT 1
			`).get(`%${pattern}%`);

			if (!searchRandom) return;

			await console.log(`[+] (randomRegex) Foi escolhida a mensagem "${searchRandom.phrase}"!`);

			return searchRandom.phrase;
		} catch (error) {
			if (error instanceof SqliteError) {
				startDatabase();
				return false;
			} else {
				return error;
			}
		}
	}
}

export async function insertDatabase(msg, user) {
	while (true) {
		try {
			const checkExistence = db.prepare(`
				SELECT 1 FROM phrases
				WHERE phrase = ?
				LIMIT 1
			`).get(msg);

			if (checkExistence) {
				console.log(`[!] "${msg}" já existe no banco de dados`);
				return;
			} else {
				await db.prepare(`
					INSERT INTO phrases (phrase, user)
					VALUES (?, ?)
				`).run(msg, user);

				await console.log(`[+] "${msg}" foi acrescentada no banco de dados por ${user}`);
			}

			return true;
		} catch (error) {
			if (error instanceof SqliteError) {
				await startDatabase();
				continue;
			} else {
				return error;
			}
		}
	}
}
