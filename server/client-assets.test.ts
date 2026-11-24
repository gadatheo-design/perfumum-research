import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

/**
 * Les 19 images de l'interface qui venaient du stockage Manus (CloudFront)
 * ont été retirées, pas recopiées (décision du 24/11/2026). Ce test empêche
 * qu'une adresse CloudFront ou un chemin /media/ réapparaisse dans le client.
 */

const root = path.resolve(process.cwd(), "client");

function listFiles(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, out);
    else if (/\.(tsx?|jsx?|mjs|html|json|css|svg)$/.test(entry.name)) out.push(full);
  }
  return out;
}

describe("images de l'interface retirées", () => {
  const files = listFiles(root);

  it("le client ne contient aucune adresse CloudFront", () => {
    expect(files.length).toBeGreaterThan(100);
    const offenders = files.filter(file => /cloudfront\.net/i.test(fs.readFileSync(file, "utf8")));
    expect(offenders.map(f => path.relative(process.cwd(), f))).toEqual([]);
  });

  it("le client ne cite aucun chemin /media/", () => {
    const offenders = files.filter(file => /["'`(]\/media\//.test(fs.readFileSync(file, "utf8")));
    expect(offenders.map(f => path.relative(process.cwd(), f))).toEqual([]);
  });

  it("le dossier client/public/media n'existe plus", () => {
    expect(fs.existsSync(path.join(root, "public", "media"))).toBe(false);
  });
});

describe("images locales des pages touchées par la sortie de Manus", () => {
  // Projets : quatre photos de terrain restaurées depuis l'historique Git.
  // GalerieBotaniques, GammesPetrichor, GammesMossi : non branchées, leurs
  // références à des images absentes ont été retirées (sort décidé au lot 2).
  const pages = ["Projets", "GalerieBotaniques", "GammesPetrichor", "GammesMossi"];

  it("chaque image locale citée existe dans client/public", () => {
    const missing: string[] = [];
    for (const page of pages) {
      const source = fs.readFileSync(path.join(root, "src", "pages", `${page}.tsx`), "utf8");
      for (const match of source.matchAll(/["'(](\/[A-Za-z0-9/_.-]+\.(?:webp|png|jpe?g|svg|gif))/g)) {
        if (!fs.existsSync(path.join(root, "public", match[1]))) missing.push(`${page} : ${match[1]}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("les quatre photos de terrain de Projets sont bien des images WebP", () => {
    for (const name of ["terrain-foret-alpine-1", "terrain-foret-alpine-2", "terrain-friche-1", "terrain-friche-2"]) {
      const head = fs.readFileSync(path.join(root, "public", `${name}.webp`)).subarray(0, 12);
      expect(head.subarray(0, 4).toString("latin1"), name).toBe("RIFF");
      expect(head.subarray(8, 12).toString("latin1"), name).toBe("WEBP");
    }
  });
});
