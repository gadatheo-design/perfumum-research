import { afterEach, describe, expect, it } from "vitest";
import express from "express";
import fs from "fs";
import os from "os";
import path from "path";
import type { AddressInfo } from "net";
import { readMediaOrigins, registerMediaFallback } from "./_core/mediaFallback";

const root = process.cwd();
const realPublicDir = path.join(root, "client", "public");

function listFiles(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, out);
    else if (/\.(tsx?|jsx?|mjs|html|json|css)$/.test(entry.name)) out.push(full);
  }
  return out;
}

describe("adresses du stockage Manus dans le code", () => {
  const origins = readMediaOrigins(realPublicDir);
  // Seuls endroits où l'adresse a le droit d'apparaître.
  const allowed = new Set(
    ["client/public/media/origines.json", "server/media-files.test.ts", "server/migrate-media-urls.test.ts"].map(f =>
      path.join(root, f)
    )
  );
  const files = ["client", "server", "shared"]
    .flatMap(dir => listFiles(path.join(root, dir)))
    .filter(file => !allowed.has(file));

  it("aucune adresse CloudFront n'est plus écrite en dur", () => {
    const offenders = files.filter(file => /cloudfront\.net/i.test(fs.readFileSync(file, "utf8")));
    expect(offenders.map(f => path.relative(root, f))).toEqual([]);
  });

  it("chaque image /media citée par le client est déclarée dans origines.json ou présente", () => {
    expect(origins).not.toBeNull();
    const declared = new Set(origins!.fichiers);
    const cited = new Set<string>();
    for (const file of files.filter(f => f.startsWith(path.join(root, "client")))) {
      for (const match of fs.readFileSync(file, "utf8").matchAll(/["'`(]\/media\/([A-Za-z0-9._-]+)/g)) {
        cited.add(match[1]);
      }
    }
    expect(cited.size).toBe(19);
    const unknown = [...cited].filter(
      name => !declared.has(name) && !fs.existsSync(path.join(realPublicDir, "media", name))
    );
    expect(unknown).toEqual([]);
  });
});

describe("/media : filet de sécurité vers l'adresse d'origine", () => {
  const tmpDirs: string[] = [];
  afterEach(() => {
    for (const dir of tmpDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
  });

  async function withApp<T>(present: string[], run: (baseUrl: string) => Promise<T>): Promise<T> {
    const publicDir = fs.mkdtempSync(path.join(os.tmpdir(), "perfumum-media-"));
    tmpDirs.push(publicDir);
    fs.mkdirSync(path.join(publicDir, "media"));
    fs.writeFileSync(
      path.join(publicDir, "media", "origines.json"),
      JSON.stringify({ origine: "https://origine.invalid/a/b/", fichiers: ["present.png", "absent.png", "../evasion.png"] })
    );
    for (const name of present) fs.writeFileSync(path.join(publicDir, "media", name), "image");

    const app = express();
    registerMediaFallback(app, publicDir);
    app.use(express.static(publicDir));
    app.use((_req, res) => res.status(404).send("introuvable"));
    const server = app.listen(0);
    try {
      return await run(`http://127.0.0.1:${(server.address() as AddressInfo).port}`);
    } finally {
      await new Promise(resolve => server.close(resolve));
    }
  }

  it("sert le fichier local quand il existe", async () => {
    await withApp(["present.png"], async baseUrl => {
      const res = await fetch(`${baseUrl}/media/present.png`, { redirect: "manual" });
      expect(res.status).toBe(200);
      expect(await res.text()).toBe("image");
    });
  });

  it("redirige vers l'origine quand le fichier manque encore", async () => {
    await withApp(["present.png"], async baseUrl => {
      const res = await fetch(`${baseUrl}/media/absent.png`, { redirect: "manual" });
      expect(res.status).toBe(302);
      expect(res.headers.get("location")).toBe("https://origine.invalid/a/b/absent.png");
    });
  });

  it("ne redirige jamais un nom hors liste", async () => {
    await withApp([], async baseUrl => {
      for (const name of ["inconnu.png", "..%2Fevasion.png", "origines.json.bak"]) {
        const res = await fetch(`${baseUrl}/media/${name}`, { redirect: "manual" });
        expect(res.status, name).toBe(404);
      }
    });
  });
});
