// @ts-nocheck
/**
 * GBIF (Global Biodiversity Information Facility) Router
 * 
 * Enrichit les plantes PERFUMUM sans crédits IA via :
 * - GBIF Species API : taxonomie, synonymes, UICN
 * - GBIF Occurrence API : distribution GPS, altitude
 * - Open-Meteo Climate API : température, précipitations, zone Köppen
 * - CITES Species+ API : annexe CITES (nécessite un token gratuit)
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { plants } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";

// ─── Helpers GBIF ────────────────────────────────────────────────────────────

async function fetchJSON(url: string, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    headers: { "Accept": "application/json", "User-Agent": "PERFUMUM-Research/1.0", ...headers },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText} — ${url}`);
  return res.json();
}

async function gbifMatchSpecies(latinName: string) {
  const data = await fetchJSON(
    `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(latinName)}&rank=SPECIES&strict=false`
  );
  if (!data.usageKey) return null;
  return data;
}

async function gbifGetSynonyms(usageKey: number): Promise<string[]> {
  try {
    const data = await fetchJSON(`https://api.gbif.org/v1/species/${usageKey}/synonyms?limit=15`);
    return (data.results || []).map((s: any) => s.scientificName).filter(Boolean).slice(0, 10);
  } catch { return []; }
}

async function gbifGetIUCN(usageKey: number): Promise<string | null> {
  try {
    const data = await fetchJSON(`https://api.gbif.org/v1/species/${usageKey}/iucnRedListCategory`);
    return data.category || null;
  } catch { return null; }
}

async function gbifGetDistribution(usageKey: number) {
  try {
    const data = await fetchJSON(
      `https://api.gbif.org/v1/occurrence/search?taxonKey=${usageKey}&hasCoordinate=true&limit=300`
    );
    const results = data.results || [];
    if (results.length === 0) return null;

    const lats = results.map((r: any) => r.decimalLatitude).filter((v: any) => v != null);
    const lons = results.map((r: any) => r.decimalLongitude).filter((v: any) => v != null);
    const elevs = results.map((r: any) => r.elevation).filter((v: any) => v != null && v > -500 && v < 9000);

    return {
      latitudeMin: lats.length ? Math.min(...lats) : null,
      latitudeMax: lats.length ? Math.max(...lats) : null,
      altitudeMin: elevs.length ? Math.min(...elevs) : null,
      altitudeMax: elevs.length ? Math.max(...elevs) : null,
      medianLat: lats.length ? lats.reduce((a: number, b: number) => a + b, 0) / lats.length : null,
      medianLon: lons.length ? lons.reduce((a: number, b: number) => a + b, 0) / lons.length : null,
      occurrenceCount: results.length,
    };
  } catch { return null; }
}

// ─── Open-Meteo ───────────────────────────────────────────────────────────────

async function openMeteoClimate(lat: number, lon: number) {
  try {
    const url = `https://climate-api.open-meteo.com/v1/climate?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&start_date=1991-01-01&end_date=2020-12-31&models=EC_Earth3P_HR&daily=temperature_2m_max,temperature_2m_min,precipitation_sum`;
    const data = await fetchJSON(url);
    const daily = data.daily;
    if (!daily) return null;

    const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
    const sum = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) : null;

    const tempMax = (daily.temperature_2m_max || []).filter((v: any) => v != null);
    const tempMin = (daily.temperature_2m_min || []).filter((v: any) => v != null);
    const precip = (daily.precipitation_sum || []).filter((v: any) => v != null);

    const avgTempMax = avg(tempMax);
    const avgTempMin = avg(tempMin);
    const totalPrecip = sum(precip);
    const annualPrecip = totalPrecip != null && precip.length > 0
      ? totalPrecip / (precip.length / 365)
      : null;

    return {
      temperatureMin: avgTempMin != null ? Math.round(avgTempMin) : null,
      temperatureMax: avgTempMax != null ? Math.round(avgTempMax) : null,
      precipitationMin: annualPrecip != null ? Math.round(annualPrecip * 0.75) : null,
      precipitationMax: annualPrecip != null ? Math.round(annualPrecip * 1.25) : null,
    };
  } catch { return null; }
}

function inferKoppen(tMin: number | null, tMax: number | null, pMin: number | null): { code: string; description: string } | null {
  if (tMin == null || tMax == null || pMin == null) return null;
  const avgT = (tMin + tMax) / 2;
  const annualP = pMin / 0.75; // Reconstituer la précipitation annuelle moyenne

  if (avgT > 18 && annualP > 1500) return { code: "Af", description: "Tropical humide" };
  if (avgT > 18 && annualP > 750) return { code: "Am", description: "Tropical de mousson" };
  if (avgT > 18) return { code: "Aw", description: "Tropical savane" };
  if (avgT > 0 && annualP < 300) return { code: "BWk", description: "Aride froid" };
  if (avgT > 18 && annualP < 300) return { code: "BWh", description: "Aride chaud" };
  if (avgT > 0 && annualP < 500) return { code: "BSk", description: "Semi-aride froid" };
  if (avgT > 10 && tMin > -3 && annualP < 700) return { code: "Csa", description: "Méditerranéen" };
  if (avgT > 10 && tMin > -3) return { code: "Cfb", description: "Océanique tempéré" };
  if (avgT > 0 && annualP > 500) return { code: "Dfb", description: "Continental humide" };
  if (avgT > 0) return { code: "Dfc", description: "Continental subarctique" };
  return { code: "ET", description: "Toundra" };
}

// ─── CITES ────────────────────────────────────────────────────────────────────

async function citesLookup(latinName: string, token: string): Promise<string | null> {
  try {
    const url = `https://api.speciesplus.net/api/v1/taxon_concepts?name=${encodeURIComponent(latinName)}&per_page=1`;
    const data = await fetchJSON(url, { "X-Authentication-Token": token });
    const concept = data.taxon_concepts?.[0];
    if (!concept) return "NONE";
    const listing = concept.cites_listings?.[0];
    return listing?.appendix || "NONE";
  } catch { return null; }
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const gbifRouter = router({

  /**
   * Statistiques de couverture GBIF pour le dashboard
   */
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("DB non disponible");

    const [[total], [withGbif], [withFamily], [withConservation], [withClimate], [withCites]] = await Promise.all([
      db.select({ count: sql<number>`COUNT(*)` }).from(plants),
      db.select({ count: sql<number>`COUNT(*)` }).from(plants).where(sql`${plants.gbifId} IS NOT NULL`),
      db.select({ count: sql<number>`COUNT(*)` }).from(plants).where(sql`${plants.family} IS NOT NULL AND ${plants.family} != ''`),
      db.select({ count: sql<number>`COUNT(*)` }).from(plants).where(sql`${plants.conservationStatus} IS NOT NULL`),
      db.select({ count: sql<number>`COUNT(*)` }).from(plants).where(sql`${plants.temperatureMin} IS NOT NULL`),
      db.select({ count: sql<number>`COUNT(*)` }).from(plants).where(sql`${plants.citesAppendix} IS NOT NULL AND ${plants.citesAppendix} != 'UNKNOWN'`),
    ]);

    return {
      total: Number(total.count),
      withGbif: Number(withGbif.count),
      withFamily: Number(withFamily.count),
      withConservation: Number(withConservation.count),
      withClimate: Number(withClimate.count),
      withCites: Number(withCites.count),
    };
  }),

  /**
   * Liste des plantes à enrichir (sans données GBIF)
   */
  getPlantsToEnrich: publicProcedure
    .input(z.object({
      limit: z.number().default(9999), // 9999 = toutes les plantes
      onlyMissing: z.boolean().default(false), // false = afficher toutes par défaut
      includeClimate: z.boolean().default(false), // true = inclure les plantes sans données climat
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB non disponible");

      let whereCondition;
      if (input.onlyMissing && input.includeClimate) {
        // Cibler les plantes sans données GBIF OU sans données climat
        whereCondition = sql`${plants.latinName} IS NOT NULL AND ${plants.latinName} != '' AND (${plants.gbifId} IS NULL OR ${plants.family} IS NULL OR ${plants.conservationStatus} IS NULL OR ${plants.koppenZone} IS NULL OR ${plants.temperatureMin} IS NULL)`;
      } else if (input.onlyMissing) {
        // Uniquement les plantes sans données GBIF taxonomiques
        whereCondition = sql`${plants.latinName} IS NOT NULL AND ${plants.latinName} != '' AND (${plants.gbifId} IS NULL OR ${plants.family} IS NULL OR ${plants.conservationStatus} IS NULL)`;
      } else {
        whereCondition = sql`${plants.latinName} IS NOT NULL AND ${plants.latinName} != ''`;
      }

      const query = db.select({
        id: plants.id,
        name: plants.name,
        latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
        gbifId: plants.gbifId,
        family: plants.family,
        conservationStatus: plants.conservationStatus,
      }).from(plants).where(whereCondition).orderBy(plants.name).limit(input.limit);

      return query;
    }),

  /**
   * Enrichir une seule plante via GBIF + Open-Meteo + CITES
   */
  enrichPlant: publicProcedure
    .input(z.object({
      plantId: z.number(),
      includeClimate: z.boolean().default(true),
      citesToken: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB non disponible");

      const [plant] = await db.select().from(plants).where(eq(plants.id, input.plantId)).limit(1);
      if (!plant?.latinName) return { success: false, message: "Plante non trouvée ou sans nom latin" };

      const updateData: Record<string, any> = {};
      const steps: string[] = [];

      // 1. GBIF Species Match
      const match = await gbifMatchSpecies(plant.latinName ?? "");
      if (!match) return { success: false, message: `"${plant.latinName ?? ""}" non trouvée dans GBIF` };

      updateData.gbifId = String(match.usageKey);
      if (match.family) updateData.family = match.family;
      if (match.order) updateData.order = match.order;
      steps.push(`GBIF: key=${match.usageKey}, famille=${match.family || "?"}`);

      // 2. Synonymes
      const synonyms = await gbifGetSynonyms(match.usageKey);
      if (synonyms.length) {
        updateData.synonyms = synonyms;
        steps.push(`${synonyms.length} synonymes`);
      }

      // 3. UICN
      const iucn = await gbifGetIUCN(match.usageKey);
      const validIUCN = ["EX","EW","CR","EN","VU","NT","LC","DD"];
      if (iucn && validIUCN.includes(iucn)) {
        updateData.conservationStatus = iucn;
        steps.push(`UICN: ${iucn}`);
      }

      // 4. Distribution géographique
      const dist = await gbifGetDistribution(match.usageKey);
      if (dist) {
        if (dist.latitudeMin != null) updateData.latitudeMin = String(dist.latitudeMin.toFixed(6));
        if (dist.latitudeMax != null) updateData.latitudeMax = String(dist.latitudeMax.toFixed(6));
        if (dist.altitudeMin != null) updateData.altitudeMin = dist.altitudeMin;
        if (dist.altitudeMax != null) updateData.altitudeMax = dist.altitudeMax;
        steps.push(`Distribution: ${dist.occurrenceCount} occ., lat [${dist.latitudeMin?.toFixed(1)}, ${dist.latitudeMax?.toFixed(1)}]`);

        // 5. Climat via Open-Meteo
        if (input.includeClimate && dist.medianLat != null && dist.medianLon != null) {
          const climate = await openMeteoClimate(dist.medianLat, dist.medianLon);
          if (climate) {
            if (climate.temperatureMin != null) updateData.temperatureMin = climate.temperatureMin;
            if (climate.temperatureMax != null) updateData.temperatureMax = climate.temperatureMax;
            if (climate.precipitationMin != null) updateData.precipitationMin = climate.precipitationMin;
            if (climate.precipitationMax != null) updateData.precipitationMax = climate.precipitationMax;
            const koppen = inferKoppen(climate.temperatureMin, climate.temperatureMax, climate.precipitationMin);
            if (koppen) {
              updateData.koppenZone = koppen.code;
              updateData.koppenDescription = koppen.description;
            }
            steps.push(`Climat: T[${climate.temperatureMin}°, ${climate.temperatureMax}°], Köppen: ${koppen?.code || "?"}`);
          }
        }
      }

      // 6. CITES (si token fourni)
      if (input.citesToken) {
        const cites = await citesLookup(plant.latinName, input.citesToken);
        if (cites && ["I","II","III","NONE"].includes(cites)) {
          updateData.citesAppendix = cites;
          steps.push(`CITES: Annexe ${cites}`);
        }
      }

      // Sauvegarder en DB
      if (Object.keys(updateData).length > 0) {
        await db.update(plants).set(updateData).where(eq(plants.id, input.plantId));
      }

      return {
        success: true,
        message: `${plant.name} enrichie avec succès`,
        steps,
        fieldsUpdated: Object.keys(updateData).length,
      };
    }),
});
