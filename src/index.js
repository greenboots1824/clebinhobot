import "dotenv/config";

import {
  Client,
  GatewayIntentBits
} from "discord.js";

import {
  randomDatabase,
  insertDatabaseInfo,
  searchDatabaseRandomRegex
} from "./api/database.js";

import {
  readFile,
  writeFile
} from "node:fs/promises";

import {
  algorithmRNG,
  arrayRandomReturn
} from "./algorithm/randomization.js";

import { apiExists } from "./api/checkApi.js";

const prefix = "&";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("clientReady", async (client) => {
  console.log(`[*] Online como ${client.user.tag}!`);
  console.log(`[*] Estou em ${client.guilds.cache.size} servidores!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const userContent = message.content;

  if (message.mentions.has(client.user)) {
    const phraseToSpeak = await randomDatabase();
    if (phraseToSpeak === null) return;

    await message.reply(phraseToSpeak); 
    return;
  }

  if (userContent.toLowerCase() === 'bom dia, clebinho') {
    console.log(`[+] Comando "${userContent}" recebido por ${message.author.username}`);
    await message.reply(`Bom dia, ${message.author.username}! :D`);
  } else if (userContent === `${prefix}help`) {
    console.log(`[+] Comando "${userContent}" recebido por ${message.author.username}`);
    const helpContent = await readFile('./help.txt','utf8');

    if (helpContent.trim() === '') return;

    await message.reply(helpContent);
  } else if (userContent === `${prefix}meme`) {
    await console.log(`[+] Comando "${userContent}" recebido por ${message.author.username}`);
    await message.reply({
      files: [
        "https://storage.soundinstants.com/toma-milk-shake-de-morango.mp3"
      ]
    });
    return;
  } else if (userContent.startsWith(`${prefix}random`)) {
    try {
      await console.log(`[+] Comando "${userContent}" recebido por ${message.author.username}`);
      const userMaxNum = parseInt(userContent.slice(7).trim());

      if (userMaxNum == null) return;

      const numCalc = Math.floor(Math.random() * 10) + 1;

      await message.reply(`Número: ${numCalc}`);
    } catch (error) {
      return;
    }
  } else if (userContent.startsWith(`${prefix}echo`)) {
    await console.log(`[+] Comando "${userContent}" recebido por ${message.author.username}`);
    const textContent = userContent.slice(5).trim();

    await message.reply(textContent);
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

    await insertDatabaseInfo(msgToLearn, message.author.username);

    await message.reply(`Mensagem "${msgToLearn}" aprendida!`);
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
    let registerRNG = algorithmRNG(20);
    let speakRNG = algorithmRNG(20);

    const arrayPhrase = userContent.trim().split(/\s+/);
    let arrayRandom = arrayPhrase[Math.floor(Math.random() * arrayPhrase.length)];

    const maxRolls = algorithmRNG(arrayPhrase.length);

    if (registerRNG < 16) {
      // Register the last phrase/word sended
      if (
        arrayRandom === `<@${client.user.id}>` ||
        userContent === `<@${client.user.id}>`
      ) return;

      registerRNG = algorithmRNG(3);
      const authorMessage = message.author.username;

      if (registerRNG === 1) {
        await insertDatabaseInfo(arrayRandom, authorMessage); // Random word
      } else if (registerRNG === 2) {
        await insertDatabaseInfo(userContent, authorMessage); // Random phrase
      } else if (registerRNG === 3) {
        const arrayWords = [];

        for (let i = 0; i < maxRolls; i++) {
          arrayRandom = arrayRandomReturn(userContent);

          if (!arrayWords.includes(arrayRandom)) {
            await insertDatabaseInfo(arrayRandom, authorMessage);
          }

          arrayWords.push(arrayRandom);
        }
      }
    }
    
    if (speakRNG < 14) {
      // Speak a random phrase/word
      let phraseToSpeak;

      do {
        speakRNG = algorithmRNG(3);

        if (speakRNG === 1) {
          phraseToSpeak = await searchDatabaseRandomRegex(arrayRandom);
        } else if (speakRNG === 2) {
          phraseToSpeak = await randomDatabase();
        } else {
          // Pick up a random word inside the database :D
          phraseToSpeak = arrayRandomReturn(await randomDatabase());
        }

        if (phraseToSpeak === null) return;
      } while (phraseToSpeak === userContent);

      await message.reply(phraseToSpeak);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
