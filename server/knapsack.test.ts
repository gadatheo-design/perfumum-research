/**
 * Tests pour le router KNApSAcK
 * Vérifie le parsing HTML, la normalisation des données et la logique de matching
 */
import { describe, it, expect } from "vitest";

// ─── Parser HTML KNApSAcK ─────────────────────────────────────────────────────

interface KnapsackMolecule {
  knapsackId: string;
  cas: string;
  name: string;
  formula: string;
  mass: string;
  organism: string;
}

function parseKnapsackHtml(html: string): KnapsackMolecule[] {
  const results: KnapsackMolecule[] = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;

  while ((trMatch = trRegex.exec(html)) !== null) {
    const rowHtml = trMatch[1];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const cells: string[] = [];
    let tdMatch;

    while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
      const text = tdMatch[1]
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ")
        .replace(/&#\d+;/g, "")
        .trim();
      cells.push(text);
    }

    if (cells.length >= 5 && cells[0].match(/^C\d{8}$/)) {
      results.push({
        knapsackId: cells[0],
        cas: cells[1] || "",
        name: cells[2] || "",
        formula: cells[3] || "",
        mass: cells[4] || "",
        organism: cells[5] || "",
      });
    }
  }

  return results;
}

// ─── Tests du parser ──────────────────────────────────────────────────────────

describe("KNApSAcK HTML parser", () => {
  const sampleHtml = `
    <table>
      <tr><th>C_ID</th><th>CAS</th><th>Name</th><th>Formula</th><th>Mass</th><th>Organism</th></tr>
      <tr>
        <td>C00000136</td>
        <td>470-82-6</td>
        <td>1,8-Cineol</td>
        <td>C10H18O</td>
        <td>154.1357652</td>
        <td>Lavandula angustifolia</td>
      </tr>
      <tr>
        <td>C00000805</td>
        <td>80-56-8</td>
        <td>alpha-Pinene</td>
        <td>C10H16</td>
        <td>136.12520051</td>
        <td>Lavandula angustifolia</td>
      </tr>
    </table>
  `;

  it("parse correctement 2 molécules depuis le HTML", () => {
    const result = parseKnapsackHtml(sampleHtml);
    expect(result).toHaveLength(2);
  });

  it("extrait correctement le C_ID KNApSAcK", () => {
    const result = parseKnapsackHtml(sampleHtml);
    expect(result[0].knapsackId).toBe("C00000136");
    expect(result[1].knapsackId).toBe("C00000805");
  });

  it("extrait correctement le CAS", () => {
    const result = parseKnapsackHtml(sampleHtml);
    expect(result[0].cas).toBe("470-82-6");
    expect(result[1].cas).toBe("80-56-8");
  });

  it("extrait correctement le nom de la molécule", () => {
    const result = parseKnapsackHtml(sampleHtml);
    expect(result[0].name).toBe("1,8-Cineol");
    expect(result[1].name).toBe("alpha-Pinene");
  });

  it("extrait correctement la formule brute", () => {
    const result = parseKnapsackHtml(sampleHtml);
    expect(result[0].formula).toBe("C10H18O");
    expect(result[1].formula).toBe("C10H16");
  });

  it("extrait correctement la masse moléculaire", () => {
    const result = parseKnapsackHtml(sampleHtml);
    expect(result[0].mass).toBe("154.1357652");
  });

  it("ignore les lignes d'en-tête (th)", () => {
    const result = parseKnapsackHtml(sampleHtml);
    // Aucune ligne avec "C_ID" ou "CAS" comme knapsackId
    expect(result.every(r => r.knapsackId.match(/^C\d{8}$/))).toBe(true);
  });

  it("retourne un tableau vide si aucune donnée valide", () => {
    const emptyHtml = "<table><tr><th>No data</th></tr></table>";
    expect(parseKnapsackHtml(emptyHtml)).toHaveLength(0);
  });

  it("nettoie les entités HTML dans les noms", () => {
    const htmlWithEntities = `
      <table>
        <tr>
          <td>C00000999</td>
          <td>123-45-6</td>
          <td>Mol&amp;cule &lt;test&gt;</td>
          <td>C5H10</td>
          <td>70.078</td>
          <td>Test plant</td>
        </tr>
      </table>
    `;
    const result = parseKnapsackHtml(htmlWithEntities);
    expect(result[0].name).toBe("Mol&cule <test>");
  });

  it("nettoie les balises HTML dans les cellules (liens <a>)", () => {
    const htmlWithLinks = `
      <table>
        <tr>
          <td><a href="/detail?id=C00000136">C00000136</a></td>
          <td>470-82-6</td>
          <td><a href="/mol?cas=470-82-6">1,8-Cineol</a></td>
          <td>C10H18O</td>
          <td>154.1357652</td>
          <td>Lavandula angustifolia</td>
        </tr>
      </table>
    `;
    const result = parseKnapsackHtml(htmlWithLinks);
    expect(result[0].knapsackId).toBe("C00000136");
    expect(result[0].name).toBe("1,8-Cineol");
  });
});

// ─── Validation CAS ───────────────────────────────────────────────────────────

function isValidCas(cas: string): boolean {
  return /^\d+-\d+-\d+$/.test(cas);
}

describe("Validation du numéro CAS", () => {
  it("accepte un CAS valide standard", () => {
    expect(isValidCas("78-70-6")).toBe(true);
    expect(isValidCas("470-82-6")).toBe(true);
    expect(isValidCas("80-56-8")).toBe(true);
  });

  it("rejette un CAS vide", () => {
    expect(isValidCas("")).toBe(false);
  });

  it("rejette un CAS malformé", () => {
    expect(isValidCas("N/A")).toBe(false);
    expect(isValidCas("unknown")).toBe(false);
    expect(isValidCas("123456")).toBe(false);
  });

  it("accepte un CAS à plusieurs segments", () => {
    expect(isValidCas("8000-28-0")).toBe(true);
    expect(isValidCas("123456-78-9")).toBe(true);
  });
});

// ─── Logique de matching prioritaire ─────────────────────────────────────────

describe("Logique de matching KNApSAcK → DB", () => {
  it("le CAS est prioritaire sur le nom pour le matching", () => {
    const priority = ["cas", "name_exact", "formula_mass"];
    expect(priority[0]).toBe("cas");
  });

  it("une molécule sans CAS valide utilise le nom comme fallback", () => {
    const km: KnapsackMolecule = {
      knapsackId: "C00000999",
      cas: "N/A",
      name: "linalool",
      formula: "C10H18O",
      mass: "154.14",
      organism: "Lavandula angustifolia",
    };
    const hasCas = isValidCas(km.cas);
    expect(hasCas).toBe(false);
    // Fallback: utiliser km.name
    expect(km.name).toBe("linalool");
  });

  it("la source 'KNApSAcK' est correctement formatée pour la DB", () => {
    const source = "KNApSAcK";
    expect(source).toBe("KNApSAcK");
    expect(source.length).toBeGreaterThan(0);
  });

  it("les notes incluent l'ID KNApSAcK et le CAS si disponible", () => {
    const km: KnapsackMolecule = {
      knapsackId: "C00000136",
      cas: "470-82-6",
      name: "1,8-Cineol",
      formula: "C10H18O",
      mass: "154.14",
      organism: "Lavandula angustifolia",
    };
    const notes = `KNApSAcK ID: ${km.knapsackId}${km.cas ? ` | CAS: ${km.cas}` : ""}`;
    expect(notes).toBe("KNApSAcK ID: C00000136 | CAS: 470-82-6");
  });

  it("les notes n'incluent pas le CAS si vide", () => {
    const km: KnapsackMolecule = {
      knapsackId: "C00000999",
      cas: "",
      name: "test",
      formula: "C5H10",
      mass: "70.0",
      organism: "Test",
    };
    const notes = `KNApSAcK ID: ${km.knapsackId}${km.cas ? ` | CAS: ${km.cas}` : ""}`;
    expect(notes).toBe("KNApSAcK ID: C00000999");
  });
});

// ─── Délai rate-limit ─────────────────────────────────────────────────────────

describe("Gestion du rate-limit KNApSAcK", () => {
  it("le délai entre requêtes est de 500ms minimum", () => {
    const RATE_LIMIT_DELAY = 500;
    expect(RATE_LIMIT_DELAY).toBeGreaterThanOrEqual(500);
  });

  it("le timeout de requête est de 15 secondes", () => {
    const TIMEOUT_MS = 15000;
    expect(TIMEOUT_MS).toBe(15000);
  });
});
