#!/usr/bin/env node
/**
 * Génère l'empreinte à placer dans ADMIN_PASSWORD_HASH.
 *
 *   node deploy/hash-password.mjs
 *
 * Le mot de passe est demandé de façon interactive et n'est pas affiché.
 * Il n'est volontairement PAS accepté en argument : un mot de passe passé sur
 * la ligne de commande se retrouverait dans l'historique du shell et resterait
 * visible dans la liste des processus le temps de l'exécution.
 *
 * Ce script n'importe rien du projet : il reproduit le format de
 * server/_core/localAuth.ts (scrypt, aucune dépendance externe) pour rester
 * utilisable sans installation préalable.
 */
import crypto from "node:crypto";
import readline from "node:readline";

const SCRYPT_N = 65536;
const SCRYPT_r = 8;
const SCRYPT_p = 1;
const KEY_LEN = 64;
const SALT_LEN = 16;

function askHidden(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const onData = char => {
      if (["\n", "\r", ""].includes(char.toString())) {
        process.stdin.removeListener("data", onData);
      } else {
        // Réécrit la ligne sans révéler la saisie.
        process.stdout.write(`\x1b[2K\r${question}`);
      }
    };
    process.stdin.on("data", onData);
    rl.question(question, answer => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const password = await askHidden("Mot de passe administrateur : ");
const confirm = await askHidden("Confirmer                   : ");

if (!password) {
  console.error("\n❌ Mot de passe vide.");
  process.exit(1);
}
if (password !== confirm) {
  console.error("\n❌ Les deux saisies diffèrent.");
  process.exit(1);
}
if (password.length < 12) {
  console.error(
    `\n❌ Trop court (${password.length} caractères). Minimum 12 ; une phrase de passe est préférable.`
  );
  process.exit(1);
}

const salt = crypto.randomBytes(SALT_LEN);
const derived = crypto.scryptSync(password.normalize("NFKC"), salt, KEY_LEN, {
  N: SCRYPT_N,
  r: SCRYPT_r,
  p: SCRYPT_p,
  maxmem: 256 * SCRYPT_N * SCRYPT_r,
});

const hash = [
  "scrypt",
  SCRYPT_N,
  SCRYPT_r,
  SCRYPT_p,
  salt.toString("base64"),
  derived.toString("base64"),
].join("$");

console.log("\nÀ copier dans le fichier .env :\n");
console.log(`ADMIN_PASSWORD_HASH='${hash}'`);
console.log(
  "\n(les apostrophes sont nécessaires : l'empreinte contient des caractères $)"
);
