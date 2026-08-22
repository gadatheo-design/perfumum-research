/**
 * Lot 1 — Garde-fou de non-régression.
 *
 * Empêche qu'une future mutation tRPC soit (re)déclarée en `publicProcedure`
 * sans justification écrite explicite. Toute mutation publique légitime doit
 * porter un commentaire `// public-write: justifié ...` sur la ligne
 * précédant sa déclaration — sinon ce test échoue.
 *
 * Voir PERFUMUM-AUDIT-INDEPENDANT.md §G (quick win) et §D (registre des
 * risques, 134 mutations publiques confirmées, désormais reclassées).
 */
import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

const routersDir = path.resolve(import.meta.dirname, "routers");
const files = fs
  .readdirSync(routersDir)
  .filter(f => f.endsWith(".ts") && !f.endsWith(".test.ts"));

function findUnjustifiedPublicMutations(file: string, content: string) {
  const re = /(\w+)(\s*:\s*)(publicProcedure)([\s\S]*?)\.(mutation|query)\s*\(/g;
  const offenders: string[] = [];
  let m: RegExpExecArray | null;

  while ((m = re.exec(content)) !== null) {
    if (m[5] !== "mutation") continue;
    const key = m[1];
    const upTo = content.slice(0, m.index);
    const line = upTo.split("\n").length;
    const precedingContext = content.slice(Math.max(0, m.index - 400), m.index);
    if (!precedingContext.includes("public-write: justifié")) {
      offenders.push(`${file}:${line} (${key})`);
    }
  }

  return offenders;
}

describe("Lot 1 — mutations publiques justifiées", () => {
  it("ne contient aucune mutation publicProcedure sans commentaire de justification", () => {
    const offenders: string[] = [];

    for (const file of files) {
      const content = fs.readFileSync(path.join(routersDir, file), "utf8");
      offenders.push(...findUnjustifiedPublicMutations(file, content));
    }

    expect(offenders).toEqual([]);
  });
});
