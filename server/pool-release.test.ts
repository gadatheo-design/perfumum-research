import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import ts from "typescript";

/**
 * Une connexion prise au pool et rendue par `conn.end()` sans `finally` n'est
 * jamais rendue si la requête échoue. Le pool compte 10 connexions : quelques
 * visites sur des procédures qui échouent suffisaient à le vider, et toutes
 * les requêtes suivantes attendaient alors sans fin.
 *
 * Règle vérifiée ici, sur l'arbre syntaxique de chaque fichier du serveur :
 * toute variable initialisée par `await f()` puis utilisée pour `.query(`/
 * `.execute(` et rendue par `.end()`/`.release()` doit être suivie, dans le
 * même bloc, d'un `try` dont le `finally` la rend — ou être déclarée dans un
 * `try` dont le `finally` la rend. Sinon : utiliser withMysqlConnection().
 */

function listSources(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listSources(full, out);
    else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) out.push(full);
  }
  return out;
}

function releases(node: ts.Node | undefined, name: string): boolean {
  if (!node) return false;
  const text = node.getText();
  return new RegExp(`\\b${name}\\s*(\\?\\.|\\.)\\s*(end|release)\\s*\\(`).test(text);
}

export function findUnguardedReleases(source: string, fileName = "x.ts"): string[] {
  const sf = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const problems: string[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name) || !decl.initializer || !ts.isAwaitExpression(decl.initializer)) continue;
        if (!ts.isCallExpression(decl.initializer.expression) || decl.initializer.expression.arguments.length > 0) continue;
        const name = decl.name.text;
        const block = node.parent;
        if (!ts.isBlock(block) && !ts.isSourceFile(block)) continue;
        const after = block.statements.slice(block.statements.indexOf(node) + 1);
        const scope = after.map(s => s.getText()).join("\n");
        const usesDb = new RegExp(`\\b${name}\\.(query|execute)\\s*[<(]`).test(scope);
        if (!usesDb || !releases({ getText: () => scope } as ts.Node, name)) continue;
        // 1. Un try suivant, dans le même bloc, dont le finally rend la connexion.
        const guardedAfter = after.some(s => ts.isTryStatement(s) && releases(s.finallyBlock, name));
        // 2. Ou la déclaration est dans un try dont le finally la rend.
        let guardedAround = false;
        for (let p: ts.Node | undefined = node.parent; p && !guardedAround; p = p.parent) {
          if (ts.isTryStatement(p) && p.tryBlock.pos <= node.pos && node.end <= p.tryBlock.end && releases(p.finallyBlock, name)) guardedAround = true;
          if (ts.isFunctionLike(p)) break;
        }
        if (!guardedAfter && !guardedAround) {
          problems.push(`${fileName}:${sf.getLineAndCharacterOfPosition(node.getStart()).line + 1} (${name})`);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return problems;
}

describe("connexions rendues au pool même en cas d'erreur", () => {
  it("le détecteur reconnaît les formes fautives et les formes sûres", () => {
    const bad = `async function f() { const conn = await getMysqlConnection(); const [r] = await conn.query("x"); await conn.end(); return r; }`;
    const goodAfter = `async function f() { const conn = await getMysqlConnection(); try { return await conn.query("x"); } finally { await conn.end(); } }`;
    const goodAround = `async function f() { let r; try { const conn = await getConn(); r = await conn.execute("x"); conn.release(); } finally { conn?.release(); } }`;
    const unrelated = `async function f() { const db = await getDb(); return db.select(); }`;
    expect(findUnguardedReleases(bad)).toHaveLength(1);
    expect(findUnguardedReleases(goodAfter)).toEqual([]);
    expect(findUnguardedReleases(goodAround)).toEqual([]);
    expect(findUnguardedReleases(unrelated)).toEqual([]);
  });

  it("aucun fichier du serveur ne rend une connexion hors d'un finally", () => {
    const files = listSources(path.resolve(process.cwd(), "server"));
    expect(files.length).toBeGreaterThan(100);
    const problems = files.flatMap(file =>
      findUnguardedReleases(fs.readFileSync(file, "utf8"), path.relative(process.cwd(), file))
    );
    expect(problems, "utiliser withMysqlConnection() ou try … finally").toEqual([]);
  });
});
