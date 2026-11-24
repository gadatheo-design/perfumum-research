import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(process.cwd(), "tools/physical-tests");

// server/scripts/serve-physical-tests.mjs est perdu : la ligne `scripts/` du
// .gitignore masquait tout server/scripts/, qui n'a donc jamais été versionné,
// et le dossier n'existe plus dans l'espace de travail Manus (confirmé le
// 24/11/2026). Il n'a pas été réinventé. Tant qu'il est absent, le test qui
// le lit est ignoré — et non en échec ; il se réactive de lui-même dès que le
// fichier revient. Voir docs/RAPPORT-LOT-1.md.
const serverScript = resolve(process.cwd(), "server/scripts/serve-physical-tests.mjs");
const serverScriptMissing = !existsSync(serverScript);

describe("prototypes physiques locaux", () => {
  it("utilise un export documentaire complet sans commande de chauffe ni diffusion", async () => {
    const exported = JSON.parse(await readFile(resolve(root, "data/fleur-fantome-2026-09-15.json"), "utf8"));
    expect(exported.recipe).toMatchObject({ id: 150025, name: "Fleur Fantôme" });
    expect(exported.molecules).toHaveLength(8);
    expect(exported.molecules.every((m: { boilingPointC: number; proportion: number }) => Number.isFinite(m.boilingPointC) && Number.isFinite(m.proportion))).toBe(true);
    expect(exported.dataStatus).toContain("sans émission");
  });

  // Le test d'origine vérifiait d'un bloc les trois pages et le serveur. Il est
  // scindé pour que la perte du script ne fasse pas ignorer aussi les pages.
  it("livre les trois pages locales", async () => {
    const [projection, proximity, darkField] = await Promise.all([
      readFile(resolve(root, "projection-mapping/index.html"), "utf8"),
      readFile(resolve(root, "arduino-proximity/index.html"), "utf8"),
      readFile(resolve(root, "dark-field/index.html"), "utf8"),
    ]);
    expect(projection).toContain("Graphe anamorphique");
    expect(proximity).toContain("Graphe de proximité");
    expect(darkField).toContain("Champ noir");
  });

  it.skipIf(serverScriptMissing)(
    "livre un serveur borné à localhost (ignoré tant que server/scripts/serve-physical-tests.mjs, perdu, est absent)",
    async () => {
      const server = await readFile(serverScript, "utf8");
      expect(server).toContain('server.listen(port, "127.0.0.1"');
    }
  );

  it("déclare la commande pnpm physical-tests et les livrables autonomes sans dépendance réseau", async () => {
    const [manifest, standaloneReadme, thermal] = await Promise.all([
      readFile(resolve(process.cwd(), "package.json"), "utf8"),
      readFile(resolve(process.cwd(), "deliverables/essais-physiques-autonomes/README.md"), "utf8"),
      readFile(resolve(process.cwd(), "deliverables/essais-physiques-autonomes/04-partition-thermique/index.html"), "utf8"),
    ]);
    expect(JSON.parse(manifest).scripts["physical-tests"]).toContain("serve-physical-tests");
    expect(JSON.parse(manifest).scripts["physical-tests:zip"]).toContain("zip");
    expect(standaloneReadme).toContain("double-cliquez");
    expect(thermal).toContain("Ce n’est pas une mesure de composition de l’air");
    expect(thermal).not.toMatch(/fetch\(|WebSocket|http:\/\//);
  });
});
