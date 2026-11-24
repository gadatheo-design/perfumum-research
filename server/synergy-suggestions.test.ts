import { describe, expect, it } from "vitest";
import {
  MAX_COMPARED,
  computeSynergySuggestions,
  hasInformedRadarProfile,
  type RadarMolecule,
} from "./db/synergySuggestions";

/** Générateur pseudo-aléatoire déterministe : les tests ne dépendent pas du hasard. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function molecule(id: number, values: [number, number, number, number, number, number]): RadarMolecule {
  const [radarIntensity, radarFreshness, radarWarmth, radarSweetness, radarSpiciness, radarEarthiness] = values;
  return {
    id,
    name: `Molécule synthétique ${id}`,
    radarIntensity,
    radarFreshness,
    radarWarmth,
    radarSweetness,
    radarSpiciness,
    radarEarthiness,
  };
}

const DEFAULT: [number, number, number, number, number, number] = [50, 50, 50, 50, 50, 50];

function syntheticMolecules(total: number, withDefaultProfile: number, seed = 42): RadarMolecule[] {
  const random = mulberry32(seed);
  const value = () => Math.round(random() * 100);
  const all: RadarMolecule[] = [];
  for (let id = 1; id <= total; id++) {
    const informed = id > withDefaultProfile;
    all.push(molecule(id, informed ? [value(), value(), value(), value(), value(), value()] : DEFAULT));
  }
  // Mélange déterministe : les profils par défaut ne sont pas regroupés.
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

/** Référence naïve, pour vérifier que le tas rend bien les meilleures paires. */
function naive(molecules: RadarMolecule[], minSimilarity: number, limit: number) {
  const informed = molecules.filter(hasInformedRadarProfile).sort((a, b) => a.id - b.id);
  const max = Math.sqrt(6 * 100 * 100);
  const keys = ["radarIntensity", "radarFreshness", "radarWarmth", "radarSweetness", "radarSpiciness", "radarEarthiness"] as const;
  const pairs: { a: number; b: number; distance: number }[] = [];
  for (let i = 0; i < informed.length; i++) {
    for (let j = i + 1; j < informed.length; j++) {
      const distance = Math.sqrt(keys.reduce((sum, k) => sum + ((informed[i][k] as number) - (informed[j][k] as number)) ** 2, 0));
      if (100 * (1 - distance / max) >= minSimilarity) pairs.push({ a: informed[i].id, b: informed[j].id, distance });
    }
  }
  return pairs.sort((x, y) => x.distance - y.distance || x.a - y.a || x.b - y.b).slice(0, limit);
}

describe("profil radar par défaut", () => {
  it("50 sur les six axes vaut « non renseigné »", () => {
    expect(hasInformedRadarProfile(molecule(1, DEFAULT))).toBe(false);
    expect(hasInformedRadarProfile(molecule(2, [50, 50, 50, 50, 50, 51]))).toBe(true);
    expect(hasInformedRadarProfile(molecule(3, [0, 0, 0, 0, 0, 0]))).toBe(true);
    expect(hasInformedRadarProfile({ ...molecule(4, [10, 20, 30, 40, 60, 70]), radarWarmth: null })).toBe(false);
  });

  it("n'entre jamais dans une suggestion, même à côté d'un profil très proche", () => {
    const result = computeSynergySuggestions(
      [molecule(1, DEFAULT), molecule(2, DEFAULT), molecule(3, [50, 50, 50, 50, 50, 51]), molecule(4, [50, 50, 50, 50, 50, 52])],
      { minSimilarity: 0, limit: 50 }
    );
    expect(result.moleculesWithProfile).toBe(2);
    expect(result.suggestions).toHaveLength(1);
    expect([result.suggestions[0].molecule1Id, result.suggestions[0].molecule2Id]).toEqual([3, 4]);
  });
});

describe("sans profil renseigné", () => {
  it("renvoie une liste vide et un message, pas une erreur", () => {
    const allDefault = Array.from({ length: 500 }, (_, i) => molecule(i + 1, DEFAULT));
    const result = computeSynergySuggestions(allDefault);
    expect(result.suggestions).toEqual([]);
    expect(result.message).toMatch(/Aucune molécule n'a de profil radar renseigné/);
    expect(result.moleculesWithProfile).toBe(0);
  });

  it("explique aussi le cas d'une liste vide ou d'une seule molécule renseignée", () => {
    expect(computeSynergySuggestions([]).message).toMatch(/Aucune molécule/);
    const one = computeSynergySuggestions([molecule(1, [10, 20, 30, 40, 60, 70]), molecule(2, DEFAULT)]);
    expect(one.suggestions).toEqual([]);
    expect(one.message).toMatch(/Une seule molécule/);
  });

  it("signale un seuil trop élevé", () => {
    const result = computeSynergySuggestions(
      [molecule(1, [0, 0, 0, 0, 0, 0]), molecule(2, [100, 100, 100, 100, 100, 100])],
      { minSimilarity: 90 }
    );
    expect(result.suggestions).toEqual([]);
    expect(result.message).toMatch(/seuil/);
  });
});

describe("résultat", () => {
  it("rend les mêmes paires qu'un calcul naïf, dans le même ordre", () => {
    const molecules = syntheticMolecules(400, 150, 7);
    for (const [minSimilarity, limit] of [[70, 10], [50, 30], [90, 50], [0, 5]] as const) {
      const expected = naive(molecules, minSimilarity, limit);
      const got = computeSynergySuggestions(molecules, { minSimilarity, limit }).suggestions;
      expect(got.map(s => [s.molecule1Id, s.molecule2Id])).toEqual(expected.map(p => [p.a, p.b]));
      for (const s of got) expect(s.similarity).toBeGreaterThanOrEqual(minSimilarity - 0.05);
    }
  });

  it("garde la forme attendue par la page", () => {
    const [s] = computeSynergySuggestions(
      [molecule(1, [80, 20, 60, 40, 10, 30]), molecule(2, [82, 25, 61, 40, 12, 33])],
      { minSimilarity: 50 }
    ).suggestions;
    expect(s).toMatchObject({
      molecule1Id: 1,
      molecule2Id: 2,
      radarProfile1: { intensity: 80, freshness: 20, warmth: 60, sweetness: 40, spiciness: 10, earthiness: 30 },
      explanation: "Profils similaires sur Intensité, Fraîcheur, Chaleur, Douceur, Épices, Terreux",
    });
    expect(s.similarity).toBeGreaterThan(95);
    expect(s.distance).toBeCloseTo(6.6, 1);
  });

  it("plafonne le nombre de suggestions à 50", () => {
    const result = computeSynergySuggestions(syntheticMolecules(300, 0), { minSimilarity: 0, limit: 5000 });
    expect(result.suggestions).toHaveLength(50);
  });
});

describe("charge : 8 000 molécules synthétiques", () => {
  function measure<T>(run: () => T) {
    const gc = (globalThis as { gc?: () => void }).gc;
    gc?.();
    const before = process.memoryUsage();
    const start = performance.now();
    const result = run();
    const elapsedMs = performance.now() - start;
    const after = process.memoryUsage();
    return {
      result,
      elapsedMs,
      heapMb: (after.heapUsed - before.heapUsed) / 1e6,
      rssMb: (after.rss - before.rss) / 1e6,
    };
  }

  it("7 700 au profil par défaut : moins de 5 s et moins de 300 Mo en plus", () => {
    const molecules = syntheticMolecules(8000, 7700);
    const { result, elapsedMs, heapMb, rssMb } = measure(() =>
      computeSynergySuggestions(molecules, { minSimilarity: 50, limit: 30 })
    );
    expect(result.moleculesWithProfile).toBe(300);
    expect(result.moleculesCompared).toBe(300);
    expect(result.suggestions).toHaveLength(30);
    expect(elapsedMs).toBeLessThan(5000);
    expect(heapMb).toBeLessThan(300);
    expect(rssMb).toBeLessThan(300);
  });

  it("pire cas — 8 000 profils tous renseignés et seuil à 0 : plafonné, toujours borné", () => {
    const molecules = syntheticMolecules(8000, 0);
    const { result, elapsedMs, heapMb, rssMb } = measure(() =>
      computeSynergySuggestions(molecules, { minSimilarity: 0, limit: 50 })
    );
    expect(result.moleculesWithProfile).toBe(8000);
    expect(result.moleculesCompared).toBe(MAX_COMPARED);
    expect(result.suggestions).toHaveLength(50);
    expect(result.message).toMatch(/Calcul limité aux 2000 premières molécules sur 8000/);
    expect(elapsedMs).toBeLessThan(5000);
    expect(heapMb).toBeLessThan(300);
    expect(rssMb).toBeLessThan(300);
  });
});
