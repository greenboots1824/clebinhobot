import {
	insertDatabase,
	randomDatabase,
	searchDatabaseRandomRegex
} from "./database.js";

import { arrayRandomReturn } from "./register.js";

export async function algorithmBot(userContent, client, message) {
	const randomRNG = Math.floor(Math.random() * 10) + 1;
	const arrayPhrase = userContent.trim().split(/\s+/);
	const arrayRandom = arrayPhrase[Math.floor(Math.random() * arrayPhrase.length)];

	if (randomRNG < 2) {
		const randomNumber = Math.floor(Math.random() * 2) + 1;
		const authorMessage = message.author.username;

		// 1 -- Random word
		// 2 -- Random phrase

		if (arrayRandom === `<@${client.user.id}>` || userContent === `<@${client.user.id}>`) return;

		if (randomNumber === 1) {
			await insertDatabase(arrayRandom, authorMessage); // Random word
		} else if (randomNumber === 2 && arrayPhrase.length < 50) {
			await insertDatabase(userContent, authorMessage); // Random phrase
		}
	} else {
		// Depois fazer opção pra ele juntar palavras aleatórias e fazer uma frase... (cancelado)
		const randomSpeak = Math.floor(Math.random() * 2) + 1;

		if (randomSpeak === 1) {
			const phraseToSpeak = await searchDatabaseRandomRegex(arrayRandom);
			if (phraseToSpeak) await message.reply(phraseToSpeak);

			return;
		} else {
			const phraseToSpeakRandomly	= await randomDatabase();
			if (phraseToSpeakRandomly) await message.reply(phraseToSpeakRandomly);

			return;
		}
	}
}
