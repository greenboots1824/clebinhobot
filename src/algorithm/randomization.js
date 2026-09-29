export function algorithmRNG(max) {
  return Math.floor(Math.random() * max) + 1;
}

export function arrayRandomReturn(userContent) {
  const arrayPhrase = userContent.trim().split(/\s+/);
  const arrayRandom = arrayPhrase[Math.floor(Math.random() * arrayPhrase.length)];

  return arrayRandom;
}
