/**
 * Plafond décroissant de `@ts-nocheck`.
 *
 * Le dépôt comptait 253 fichiers marqués `// @ts-nocheck`, ET excluait
 * l'intégralité de `client/src/pages` et des composants du périmètre de
 * vérification : `pnpm check` passait au vert sans contrôler une seule page.
 *
 * L'exclusion a été levée. Il reste des fichiers suppressés un par un, ce qui
 * est visible et mesurable — contrairement à une exclusion globale. Ce test
 * empêche le compte de remonter : on peut en retirer, jamais en ajouter.
 *
 * Pour abaisser le plafond après avoir corrigé des fichiers, il suffit de
 * mettre MAX_NOCHECK_FILES à la nouvelle valeur.
 */
import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

/** Ne doit JAMAIS être augmenté. */
const MAX_NOCHECK_FILES = 55;

function collect(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      collect(full, out);
    } else if (/\.tsx?$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

describe("dette TypeScript", () => {
  const root = path.resolve(import.meta.dirname, "..");

  const withNoCheck = [
    ...collect(path.join(root, "client", "src")),
    ...collect(path.join(root, "server")),
    ...collect(path.join(root, "shared")),
  ]
    // On cherche la DIRECTIVE en début de ligne, pas la simple présence de la
    // chaîne : sinon ce fichier-ci, qui la mentionne dans ses commentaires,
    // se compterait lui-même.
    .filter(f => !f.endsWith("ts-nocheck-budget.test.ts"))
    .filter(f => /^\s*\/\/\s*@ts-nocheck/m.test(fs.readFileSync(f, "utf8")));

  it(`ne dépasse pas ${MAX_NOCHECK_FILES} fichiers en @ts-nocheck`, () => {
    const relatives = withNoCheck.map(f => path.relative(root, f)).sort();

    // En cas de dépassement, le message liste les fichiers pour situer
    // immédiatement lesquels ont été ajoutés.
    expect(
      relatives.length,
      `Fichiers en @ts-nocheck (${relatives.length}) :\n${relatives.join("\n")}`
    ).toBeLessThanOrEqual(MAX_NOCHECK_FILES);
  });

  it("n'en compte aucun côté serveur ni partagé", () => {
    const backend = withNoCheck
      .map(f => path.relative(root, f))
      .filter(f => f.startsWith("server/") || f.startsWith("shared/"));

    // Le backend est intégralement vérifié : c'est l'acquis à préserver.
    expect(backend).toEqual([]);
  });
});
