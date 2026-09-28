export function arrayRandomReturn(userContent) {
	const arrayPhrase = userContent.trim().split(/\s+/);
	const arrayRandom = arrayPhrase[Math.floor(Math.random() * arrayPhrase.length)];

	return arrayRandom;
}
