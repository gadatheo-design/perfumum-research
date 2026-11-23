#!/usr/bin/env node
/**
 * Récupère les images de l'interface dans client/public/media/.
 *
 * Ces 19 fichiers étaient chargés depuis le stockage Manus. La liste et
 * l'adresse d'origine sont dans client/public/media/origines.json.
 *
 *   node deploy/fetch-media.mjs             télécharge les fichiers absents
 *   node deploy/fetch-media.mjs --verifier  liste seulement ce qui manque
 *
 * Les fichiers déjà présents ne sont jamais retéléchargés ni écrasés.
 * Après téléchargement : vérifier les images, puis les ajouter au dépôt
 * (git add client/public/media).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const mediaDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "client", "public", "media");
const checkOnly = process.argv.includes("--verifier");

const { origine, fichiers } = JSON.parse(fs.readFileSync(path.join(mediaDir, "origines.json"), "utf8"));
const missing = fichiers.filter(name => !fs.existsSync(path.join(mediaDir, name)));

console.log(`${fichiers.length - missing.length} fichier(s) présent(s) sur ${fichiers.length}.`);
if (missing.length === 0) process.exit(0);

if (checkOnly) {
  console.log("Absents :");
  for (const name of missing) console.log(`  ${name}`);
  process.exit(1);
}

let failures = 0;
for (const name of missing) {
  try {
    const response = await fetch(origine + name);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = Buffer.from(await response.arrayBuffer());
    if (data.length === 0) throw new Error("fichier vide");
    // Écriture exclusive : n'écrase jamais un fichier existant.
    fs.writeFileSync(path.join(mediaDir, name), data, { flag: "wx" });
    console.log(`  ✓ ${name} (${data.length} octets)`);
  } catch (error) {
    failures += 1;
    console.error(`  ✗ ${name} : ${error.message}`);
  }
}

if (failures > 0) {
  console.error(`${failures} fichier(s) non récupéré(s).`);
  process.exit(1);
}
console.log("Terminé. Vérifiez les images puis : git add client/public/media");
