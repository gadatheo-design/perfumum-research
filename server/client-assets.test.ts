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
