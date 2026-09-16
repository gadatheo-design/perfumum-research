import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(process.cwd(), "tools/physical-tests");

describe("prototypes physiques locaux", () => {
  it("utilise un export documentaire complet sans commande de chauffe ni diffusion", async () => {
    const exported = JSON.parse(await readFile(resolve(root, "data/fleur-fantome-2026-09-15.json"), "utf8"));
    expect(exported.recipe).toMatchObject({ id: 150025, name: "Fleur Fantôme" });
    expect(exported.molecules).toHaveLength(8);
    expect(exported.molecules.every((m: { boilingPointC: number; proportion: number }) => Number.isFinite(m.boilingPointC) && Number.isFinite(m.proportion))).toBe(true);
    expect(exported.dataStatus).toContain("sans émission");
  });

  it("livre les trois pages locales et un serveur borné à localhost", async () => {
    const [projection, proximity, darkField, server] = await Promise.all([
      readFile(resolve(root, "projection-mapping/index.html"), "utf8"),
      readFile(resolve(root, "arduino-proximity/index.html"), "utf8"),
      readFile(resolve(root, "dark-field/index.html"), "utf8"),
      readFile(resolve(process.cwd(), "server/scripts/serve-physical-tests.mjs"), "utf8"),
    ]);
    expect(projection).toContain("Graphe anamorphique");
    expect(proximity).toContain("Graphe de proximité");
    expect(darkField).toContain("Champ noir");
    expect(server).toContain('server.listen(port, "127.0.0.1"');
  });
});
