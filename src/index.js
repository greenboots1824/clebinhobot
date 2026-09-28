import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";

import {
	randomDatabase,
	insertDatabase,
	searchDatabaseRandomRegex
} from "./api/database.js";

import { apiExists } from "./api/checkApi.js";

import { arrayRandomReturn } from "./api/register.js";

import { algorithmBot } from "./api/algorithm.js";

const prefix = "&";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

client.once("clientReady", async (client) => {
	await console.log(`Online como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
	if (message.author.bot) return;
	const userContent = message.content;

	if (message.mentions.has(client.user)) {
		const phraseToSpeak = await randomDatabase();

		await message.reply(phraseToSpeak); 
		return;
	}

	if (userContent.toLowerCase() === 'bom dia, clebinho') {
		await console.log(`[+] Comando "${userContent}" recebido por ${message.author.username}`);
		await message.reply(`Bom dia, ${message.author.username}! :D`);
		return;
	} else if (userContent === `${prefix}meme`) {
		await console.log(`[+] Comando "${userContent}" recebido por ${message.author.username}`);
		//await message.reply("Zezé di Camargo é bom demaiziiii");
		await message.reply({
			files: [
				"https://storage.soundinstants.com/toma-milk-shake-de-morango.mp3"
			]
		})
		return;
	} else if (userContent === `${prefix}random`) {
		await console.log(`[+] Comando "${userContent}" recebido por ${message.author.username}`);
		const num = Math.random();

		await console.log(`[+] Comando "${userContent}" recebido por ${message.author.username}`);
		await message.reply(`Número: ${num}`);
		return;
	} else if (userContent.startsWith(`${prefix}echo`)) {
		await console.log(`[+] Comando "${userContent}" recebido por ${message.author.username}`);
		const text = userContent.slice(5).trim();

		await message.reply(`${text}`);
		return;
	} else if (userContent.startsWith(`${prefix}dicio`)) {
		await console.log(`[+] Comando "${userContent}" recebido por ${message.author.username}`);
		const word = userContent.slice(6).trim();

		if (!word) {
			await message.reply("Por favor, digite uma palavra para pesquisar!");
			return;
		}

		const url = `https://s.dicio.com.br/${word}.jpg`;

		const startRequest = Date.now();
		const response = await apiExists(url);
		const responseTime = Date.now() - startRequest;

		if (response) {
			await message.reply({
				content: `Palavra "${word}" encontrada!\nTempo levado: ${responseTime}ms\nSignificado abaixo:`,
				files: [
					`${url}`
				]
			});
		} else { 
			await message.reply(`Palavra "${word}" não foi encontrada.`);
		}
		return;
	} else if (userContent.startsWith(`${prefix}luck`)) {
		await console.log(`[+] Comando "${userContent}" recebido por ${message.author.username}`);
		const phrase = await randomDatabase();

		if (!phrase) {
			await message.reply("Não há mensagens!");
		} else {
			await message.reply(`Mensagem:\n> ${phrase}`)
		}
	} else if (userContent.startsWith(`${prefix}learn`)) {
		await console.log(`[+] Comando "${userContent}" recebido por ${message.author.username}`);
		const msgToLearn = userContent.slice(6).trim();

		await insertDatabase(msgToLearn, message.author.username);

		await message.reply(`Mensagem "${msgToLearn}" aprendida!`);
		return;
	} else if (userContent.startsWith(`${prefix}automsg`)) {
		await console.log(`[+] Comando "${userContent}" recebido por ${message.author.username}`);
		const automsgUser = userContent.slice(8).trim();
		
		if (automsgUser.toLowerCase() === 'on') {
			await message.reply("Mensagens automáticas ligadas!");
		} else if (automsgUser.toLowerCase() === 'off') {
			await message.reply("Mensagens automáticas desligadas!");
		} else {
			if (!automsgUser) {
				await message.reply("Defina uma configuração! On/off");
				return;
			}

			await message.reply(`"${automsgUser}" não é uma configuração válida`)
		}
		return;
	} else {
		algorithmBot(userContent, client, message);
	}
});

client.login(process.env.DISCORD_TOKEN);
