import { describe, expect, it } from "vitest";
// @ts-expect-error — script .mjs sans déclarations de types
import { migrate, parseArgs, rewriteMediaUrls } from "../deploy/migrate-media-urls.mjs";
import { FILES_ROUTE_PREFIX, normalizeKey } from "./storage";

const BASE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663081881090/H2pjHHJbH276XmnbNcJhCp";

describe("rewriteMediaUrls", () => {
  it("garde le chemin sans le domaine ni ses deux premiers dossiers", () => {
    const { text, replacements } = rewriteMediaUrls(`${BASE}/variety-images/rose-1776066825627.jpg`);
    expect(text).toBe("/files/variety-images/rose-1776066825627.jpg");
    expect(replacements).toEqual([
      {
        url: `${BASE}/variety-images/rose-1776066825627.jpg`,
        key: "variety-images/rose-1776066825627.jpg",
        replacement: "/files/variety-images/rose-1776066825627.jpg",
      },
    ]);
  });

  it("produit exactement ce qu'attend la route /files du stockage local", () => {
    // server/_core/filesRoute.ts : /files/<clé>, clé décodée puis normalisée,
    // résolue sous STORAGE_LOCAL_DIR.
    const { text, replacements } = rewriteMediaUrls(`${BASE}/dossier/sous%20dossier/image.png`);
    expect(text.startsWith(`${FILES_ROUTE_PREFIX}/`)).toBe(true);
    const fromRoute = decodeURIComponent(text.slice(FILES_ROUTE_PREFIX.length + 1));
    expect(normalizeKey(fromRoute)).toBe("dossier/sous dossier/image.png");
    expect(replacements[0].key).toBe("dossier/sous%20dossier/image.png");
  });

  it("réécrit plusieurs adresses dans un texte, du HTML ou du JSON", () => {
    const html = `<img src="${BASE}/a/1.png"> puis (${BASE}/b/2.jpg) et http://d2xsxph8kpxj0f.cloudfront.net/x/y/c/3.webp`;
    expect(rewriteMediaUrls(html).text).toBe('<img src="/files/a/1.png"> puis (/files/b/2.jpg) et /files/c/3.webp');
    const json = JSON.stringify({ images: [`${BASE}/a/1.png`, `${BASE}/b/2.jpg`], note: "x" });
    expect(JSON.parse(rewriteMediaUrls(json).text)).toEqual({ images: ["/files/a/1.png", "/files/b/2.jpg"], note: "x" });
  });

  it("laisse tout le reste intact", () => {
    for (const untouched of [
      "https://upload.wikimedia.org/wikipedia/commons/a/b/rose.jpg",
      "/files/variety-images/rose.jpg",
      "https://d2xsxph8kpxj0f.cloudfront.net/un-seul-dossier/rose.jpg",
      "https://d2xsxph8kpxj0f.cloudfront.net.exemple.invalid/a/b/rose.jpg",
      "",
    ]) {
      const { text, replacements } = rewriteMediaUrls(untouched);
      expect(text).toBe(untouched);
      expect(replacements).toEqual([]);
    }
    expect(rewriteMediaUrls(null).text).toBeNull();
  });

  it("est sans effet la seconde fois", () => {
    const once = rewriteMediaUrls(`${BASE}/a/1.png et ${BASE}/b/2.png`).text;
    expect(rewriteMediaUrls(once).text).toBe(once);
  });

  it("traite un domaine supplémentaire sur demande", () => {
    const hosts = ["d2xsxph8kpxj0f.cloudfront.net", "autre.exemple.invalid"];
    expect(rewriteMediaUrls("https://autre.exemple.invalid/p/q/k/f.png", hosts).text).toBe("/files/k/f.png");
    expect(rewriteMediaUrls("https://autre.exemple.invalid/p/q/k/f.png").text).toContain("autre.exemple.invalid");
  });
});

describe("parseArgs", () => {
  it("n'écrit pas par défaut", () => {
    expect(parseArgs([]).apply).toBe(false);
    expect(parseArgs(["--liste"]).apply).toBe(false);
    expect(parseArgs(["--appliquer"]).apply).toBe(true);
  });

  it("signale les options inconnues plutôt que de les ignorer", () => {
    expect(parseArgs(["--apply"]).unknown).toEqual(["--apply"]);
    expect(parseArgs(["--apply"]).apply).toBe(false);
  });
});

describe("migrate", () => {
  /** Fausse connexion : deux colonnes concernées, dont une table sans clé primaire. */
  function fakeConnection() {
    const calls: { sql: string; params: unknown[] }[] = [];
    const tables: Record<string, Record<string, unknown>[]> = {
      variety_images: [
        { id: 1, file_url: `${BASE}/variety-images/a.jpg` },
        { id: 2, file_url: `${BASE}/variety-images/b.jpg` },
      ],
      notes: [{ body: `Voir ${BASE}/docs/c.pdf` }],
    };
    const connection = {
      calls,
      async query(sql: string, params: unknown[] = []) {
        calls.push({ sql, params });
        if (sql.includes("information_schema.COLUMNS")) {
          return [[
            { tableName: "notes", columnName: "body", dataType: "text" },
            { tableName: "variety_images", columnName: "file_url", dataType: "varchar" },
          ]];
        }
        if (sql.includes("KEY_COLUMN_USAGE")) return [[{ tableName: "variety_images", columnName: "id" }]];
        if (sql.startsWith("SELECT")) {
          const table = /FROM `(\w+)`/.exec(sql)![1];
          const column = table === "notes" ? "body" : "file_url";
          return [tables[table].map(row => ({ ...row, __value: row[column] }))];
        }
        return [{ affectedRows: 1 }];
      },
      beginTransaction: async () => void calls.push({ sql: "BEGIN", params: [] }),
      commit: async () => void calls.push({ sql: "COMMIT", params: [] }),
      rollback: async () => void calls.push({ sql: "ROLLBACK", params: [] }),
    };
    return connection;
  }

  it("par défaut, compte et n'écrit rien", async () => {
    const connection = fakeConnection();
    const report = await migrate(connection);
    expect(report.map((e: any) => [e.tableName, e.columnName, e.rows])).toEqual([
      ["notes", "body", 1],
      ["variety_images", "file_url", 2],
    ]);
    const writes = connection.calls.filter(c => /^(UPDATE|INSERT|DELETE|BEGIN|COMMIT|ALTER|DROP)/i.test(c.sql));
    expect(writes).toEqual([]);
  });

  it("avec apply, met à jour chaque ligne dans une transaction par table", async () => {
    const connection = fakeConnection();
    await migrate(connection, { apply: true });
    const updates = connection.calls.filter(c => c.sql.startsWith("UPDATE"));
    expect(updates.map(u => u.params)).toEqual([
      ["Voir /files/docs/c.pdf", `Voir ${BASE}/docs/c.pdf`],
      ["/files/variety-images/a.jpg", 1],
      ["/files/variety-images/b.jpg", 2],
    ]);
    expect(updates[0].sql).toContain("WHERE BINARY `body` = ?");
    expect(updates[1].sql).toContain("WHERE `id` = ?");
    expect(connection.calls.filter(c => c.sql === "BEGIN")).toHaveLength(2);
    expect(connection.calls.filter(c => c.sql === "COMMIT")).toHaveLength(2);
  });
});
