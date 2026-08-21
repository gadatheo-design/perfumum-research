/**
 * Stockage de fichiers — normalisation des clés et fournisseur local.
 *
 * L'enjeu principal est la traversée de répertoire : les clés sont
 * construites à partir d'entrées utilisateur (nom de fichier, extension) et,
 * en stockage local, une clé mal filtrée écrirait hors du dossier prévu.
 */
import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { localPathFor, normalizeKey, storageGet, storagePut } from "./storage";

describe("normalisation des clés", () => {
  it("supprime les slashes de tête et les segments vides", () => {
    expect(normalizeKey("/a/b/c.jpg")).toBe("a/b/c.jpg");
    expect(normalizeKey("///a//b///c.jpg")).toBe("a/b/c.jpg");
    expect(normalizeKey("a/./b/c.jpg")).toBe("a/b/c.jpg");
  });

  it("refuse toute remontée de répertoire", () => {
    for (const bad of [
      "../secret",
      "a/../../etc/passwd",
      "..",
      "a/..",
      "/../etc/shadow",
      "a/b/../../../x",
    ]) {
      expect(() => normalizeKey(bad)).toThrow(/remontée|invalide/i);
    }
  });

  it("refuse les séparateurs Windows utilisés pour remonter", () => {
    expect(() => normalizeKey("..\\..\\windows\\system32")).toThrow();
    // Un antislash légitime est ramené à un séparateur normal.
    expect(normalizeKey("a\\b.jpg")).toBe("a/b.jpg");
  });

  it("refuse un caractère nul (troncature de chemin)", () => {
    expect(() => normalizeKey("image.jpg\0.php")).toThrow(/nul/i);
  });

  it("refuse une clé vide", () => {
    for (const bad of ["", "/", "///", "."]) {
      expect(() => normalizeKey(bad)).toThrow(/vide|invalide/i);
    }
  });
});

describe("fournisseur local", () => {
  let tmp: string;
  const saved = { ...process.env };

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "perfumum-storage-"));
    process.env.STORAGE_PROVIDER = "local";
    process.env.STORAGE_LOCAL_DIR = tmp;
  });

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
    process.env = { ...saved };
  });

  it("écrit le fichier et renvoie une URL stable et relative", async () => {
    const result = await storagePut("plantes/12/photo.jpg", Buffer.from("données"), "image/jpeg");

    expect(result.key).toBe("plantes/12/photo.jpg");
    // Relative : l'URL enregistrée en base survit à un changement de domaine.
    expect(result.url).toBe("/files/plantes/12/photo.jpg");
    expect(result.url.startsWith("http")).toBe(false);

    const written = fs.readFileSync(path.join(tmp, "plantes/12/photo.jpg"), "utf8");
    expect(written).toBe("données");
  });

  it("crée les dossiers intermédiaires", async () => {
    await storagePut("a/b/c/d/e.txt", "contenu");
    expect(fs.existsSync(path.join(tmp, "a/b/c/d/e.txt"))).toBe(true);
  });

  it("n'écrit jamais hors du dossier racine", async () => {
    const outside = path.join(os.tmpdir(), "perfumum-evasion-temoin.txt");
    fs.rmSync(outside, { force: true });

    await expect(
      storagePut("../perfumum-evasion-temoin.txt", "charge")
    ).rejects.toThrow();

    expect(fs.existsSync(outside)).toBe(false);
  });

  it("localPathFor refuse un chemin résolu hors racine", () => {
    expect(() => localPathFor("../evasion")).toThrow(/hors du dossier|invalide/i);
  });

  it("storageGet renvoie la même URL stable sans toucher au disque", async () => {
    const got = await storageGet("/plantes/12/photo.jpg");
    expect(got.url).toBe("/files/plantes/12/photo.jpg");
    expect(got.key).toBe("plantes/12/photo.jpg");
  });

  it("encode les caractères spéciaux dans l'URL mais pas dans la clé", async () => {
    const result = await storagePut("dossier/mon fichier é.jpg", "x");
    expect(result.key).toBe("dossier/mon fichier é.jpg");
    expect(result.url).toBe("/files/dossier/mon%20fichier%20%C3%A9.jpg");
    // Les slashes de structure ne sont pas encodés.
    expect(result.url.split("/").length).toBe(4);
  });
});

describe("fournisseur disabled", () => {
  const saved = { ...process.env };
  afterEach(() => {
    process.env = { ...saved };
  });

  it("lève une erreur explicite plutôt que d'échouer silencieusement", async () => {
    process.env.STORAGE_PROVIDER = "disabled";
    await expect(storagePut("a.txt", "x")).rejects.toThrow(/désactivé/i);
    await expect(storageGet("a.txt")).rejects.toThrow(/désactivé/i);
  });
});
