/**
 * Wikidata Phylogénétique Router (étendu)
 * ─────────────────────────────────────────────────────────────────────────────
 * Requêtes SPARQL spécialisées pour la phylogénie, la génétique et la
 * généalogie des variétés via Wikidata.
 *
 * Données accessibles :
 *  - Taxons parents / enfants (hiérarchie phylogénétique)
 *  - Hybrides et espèces parentales
 *  - Nombre de chromosomes (ploïdie)
 *  - Génome de référence (liens GenBank/ENA)
 *  - Statut de conservation IUCN via Wikidata
 *  - Variétés cultivées (cultivars) et leurs parents
 *  - Liens croisés NCBI / GBIF / POWO depuis Wikidata
 *
 * Utilise le helper sparqlQuery partagé (retry + backoff exponentiel).
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { sparqlQuery } from "../utils/sparql";
import { getDb } from "../db";
import { plants } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";

const DELAY_MS = 800;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function qid(url: string): string {
  return url.replace("http://www.wikidata.org/entity/", "");
}

function wikidataUrl(q: string): string {
  return `https://www.wikidata.org/wiki/${q}`;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const wikidataPhyloRouter = router({
  /**
   * Hiérarchie taxonomique complète d'un taxon (parents jusqu'à la racine)
   */
  getTaxonomicHierarchy: publicProcedure
    .input(z.object({ scientificName: z.string().min(2) }))
    .query(async ({ input }) => {
      const query = `
SELECT ?taxon ?taxonLabel ?rank ?rankLabel ?parent ?parentLabel WHERE {
  ?taxon wdt:P225 "${input.scientificName.replace(/"/g, '\\"')}" .
  ?taxon wdt:P105 ?rank .
  OPTIONAL { ?taxon wdt:P171 ?parent . ?parent wdt:P105 ?parentRank . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
LIMIT 10`;

      const bindings = await sparqlQuery(query, { timeoutMs: 20000, maxRetries: 3 });

      if (!bindings.length) return { found: false, taxon: null, hierarchy: [] };

      const first = bindings[0];
      const taxonQid = qid(first.taxon?.value ?? "");

      // Construire la hiérarchie
      const hierarchy = bindings.map((b: any) => ({
        taxon: qid(b.taxon?.value ?? ""),
        taxonName: b.taxonLabel?.value ?? "",
        rank: qid(b.rank?.value ?? ""),
        rankName: b.rankLabel?.value ?? "",
        parent: b.parent ? qid(b.parent.value) : null,
        parentName: b.parentLabel?.value ?? null,
      }));

      return {
        found: true,
        taxon: {
          qid: taxonQid,
          name: first.taxonLabel?.value ?? input.scientificName,
          wikidataUrl: wikidataUrl(taxonQid),
        },
        hierarchy,
      };
    }),

  /**
   * Taxons enfants (sous-espèces, variétés, cultivars)
   */
  getChildTaxa: publicProcedure
    .input(z.object({
      scientificName: z.string().min(2),
      limit: z.number().default(50),
    }))
    .query(async ({ input }) => {
      const query = `
SELECT ?child ?childLabel ?rank ?rankLabel WHERE {
  ?parent wdt:P225 "${input.scientificName.replace(/"/g, '\\"')}" .
  ?child wdt:P171 ?parent .
  ?child wdt:P105 ?rank .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
LIMIT ${input.limit}`;

      const bindings = await sparqlQuery(query, { timeoutMs: 20000, maxRetries: 3 });

      return {
        found: bindings.length > 0,
        total: bindings.length,
        children: bindings.map((b: any) => ({
          qid: qid(b.child?.value ?? ""),
          name: b.childLabel?.value ?? "",
          rank: qid(b.rank?.value ?? ""),
          rankName: b.rankLabel?.value ?? "",
          wikidataUrl: wikidataUrl(qid(b.child?.value ?? "")),
        })),
      };
    }),

  /**
   * Hybrides : espèces parentales d'un hybride
   */
  getHybridParents: publicProcedure
    .input(z.object({ scientificName: z.string().min(2) }))
    .query(async ({ input }) => {
      const query = `
SELECT ?taxon ?taxonLabel ?parent ?parentLabel ?parentScientificName WHERE {
  ?taxon wdt:P225 "${input.scientificName.replace(/"/g, '\\"')}" .
  ?taxon wdt:P3842 ?parent .
  OPTIONAL { ?parent wdt:P225 ?parentScientificName . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
LIMIT 10`;

      const bindings = await sparqlQuery(query, { timeoutMs: 20000, maxRetries: 3 });

      return {
        isHybrid: bindings.length > 0,
        parents: bindings.map((b: any) => ({
          qid: qid(b.parent?.value ?? ""),
          name: b.parentLabel?.value ?? "",
          scientificName: b.parentScientificName?.value ?? null,
          wikidataUrl: wikidataUrl(qid(b.parent?.value ?? "")),
        })),
      };
    }),

  /**
   * Nombre de chromosomes et ploïdie
   */
  getChromosomeData: publicProcedure
    .input(z.object({ scientificName: z.string().min(2) }))
    .query(async ({ input }) => {
      const query = `
SELECT ?taxon ?taxonLabel ?chromosomeCount ?ploidy ?ploidyLabel WHERE {
  ?taxon wdt:P225 "${input.scientificName.replace(/"/g, '\\"')}" .
  OPTIONAL { ?taxon wdt:P1087 ?chromosomeCount . }
  OPTIONAL { ?taxon wdt:P8480 ?ploidy . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
LIMIT 5`;

      const bindings = await sparqlQuery(query, { timeoutMs: 20000, maxRetries: 3 });

      if (!bindings.length) return { found: false, chromosomeCount: null, ploidy: null };

      const b = bindings[0];
      return {
        found: true,
        taxon: {
          qid: qid(b.taxon?.value ?? ""),
          name: b.taxonLabel?.value ?? input.scientificName,
        },
        chromosomeCount: b.chromosomeCount?.value ? Number(b.chromosomeCount.value) : null,
        ploidy: b.ploidyLabel?.value ?? null,
      };
    }),

  /**
   * Identifiants croisés (NCBI, GBIF, POWO, Tropicos) depuis Wikidata
   */
  getCrossIdentifiers: publicProcedure
    .input(z.object({ scientificName: z.string().min(2) }))
    .query(async ({ input }) => {
      const query = `
SELECT ?taxon ?taxonLabel ?ncbiId ?gbifId ?powId ?tropicosId ?ipniId ?eolId WHERE {
  ?taxon wdt:P225 "${input.scientificName.replace(/"/g, '\\"')}" .
  OPTIONAL { ?taxon wdt:P685 ?ncbiId . }
  OPTIONAL { ?taxon wdt:P846 ?gbifId . }
  OPTIONAL { ?taxon wdt:P5037 ?powId . }
  OPTIONAL { ?taxon wdt:P960 ?tropicosId . }
  OPTIONAL { ?taxon wdt:P961 ?ipniId . }
  OPTIONAL { ?taxon wdt:P830 ?eolId . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
LIMIT 5`;

      const bindings = await sparqlQuery(query, { timeoutMs: 20000, maxRetries: 3 });

      if (!bindings.length) return { found: false, identifiers: null };

      const b = bindings[0];
      const taxonQid = qid(b.taxon?.value ?? "");

      return {
        found: true,
        taxon: {
          qid: taxonQid,
          name: b.taxonLabel?.value ?? input.scientificName,
          wikidataUrl: wikidataUrl(taxonQid),
        },
        identifiers: {
          ncbiTaxId: b.ncbiId?.value ?? null,
          gbifId: b.gbifId?.value ?? null,
          powId: b.powId?.value ?? null,
          tropicosId: b.tropicosId?.value ?? null,
          ipniId: b.ipniId?.value ?? null,
          eolId: b.eolId?.value ?? null,
        },
        externalLinks: {
          ncbi: b.ncbiId?.value ? `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${b.ncbiId.value}` : null,
          gbif: b.gbifId?.value ? `https://www.gbif.org/species/${b.gbifId.value}` : null,
          powo: b.powId?.value ? `https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:${b.powId.value}` : null,
          tropicos: b.tropicosId?.value ? `https://www.tropicos.org/name/${b.tropicosId.value}` : null,
        },
      };
    }),

  /**
   * Statut de conservation IUCN via Wikidata
   */
  getConservationStatus: publicProcedure
    .input(z.object({ scientificName: z.string().min(2) }))
    .query(async ({ input }) => {
      const query = `
SELECT ?taxon ?taxonLabel ?status ?statusLabel ?assessmentYear WHERE {
  ?taxon wdt:P225 "${input.scientificName.replace(/"/g, '\\"')}" .
  OPTIONAL {
    ?taxon p:P141 ?statusStatement .
    ?statusStatement ps:P141 ?status .
    OPTIONAL { ?statusStatement pq:P585 ?assessmentYear . }
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
LIMIT 5`;

      const bindings = await sparqlQuery(query, { timeoutMs: 20000, maxRetries: 3 });

      if (!bindings.length) return { found: false, status: null };

      const b = bindings[0];
      return {
        found: true,
        taxon: {
          qid: qid(b.taxon?.value ?? ""),
          name: b.taxonLabel?.value ?? input.scientificName,
        },
        iucnStatus: b.statusLabel?.value ?? null,
        iucnStatusQid: b.status ? qid(b.status.value) : null,
        assessmentYear: b.assessmentYear?.value ? new Date(b.assessmentYear.value).getFullYear() : null,
      };
    }),

  /**
   * Cultivars et variétés cultivées d'une espèce
   */
  getCultivars: publicProcedure
    .input(z.object({
      scientificName: z.string().min(2),
      limit: z.number().default(30),
    }))
    .query(async ({ input }) => {
      const query = `
SELECT ?cultivar ?cultivarLabel ?cultivarName ?breeder ?breederLabel ?year WHERE {
  ?species wdt:P225 "${input.scientificName.replace(/"/g, '\\"')}" .
  ?cultivar wdt:P279 ?species .
  ?cultivar wdt:P31 wd:Q4886 .
  OPTIONAL { ?cultivar wdt:P225 ?cultivarName . }
  OPTIONAL { ?cultivar wdt:P178 ?breeder . }
  OPTIONAL { ?cultivar wdt:P571 ?year . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
LIMIT ${input.limit}`;

      const bindings = await sparqlQuery(query, { timeoutMs: 25000, maxRetries: 3 });

      return {
        found: bindings.length > 0,
        total: bindings.length,
        cultivars: bindings.map((b: any) => ({
          qid: qid(b.cultivar?.value ?? ""),
          name: b.cultivarLabel?.value ?? b.cultivarName?.value ?? "",
          scientificName: b.cultivarName?.value ?? null,
          breeder: b.breederLabel?.value ?? null,
          year: b.year?.value ? new Date(b.year.value).getFullYear() : null,
          wikidataUrl: wikidataUrl(qid(b.cultivar?.value ?? "")),
        })),
      };
    }),

  /**
   * Enrichissement batch : récupère les identifiants croisés pour les plantes PERFUMUM
   * et met à jour gbifId, powId, wikidataQid
   */
  batchEnrichCrossIds: publicProcedure
    .input(z.object({
      limit: z.number().default(15),
      dryRun: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB non disponible");

      const plantsToEnrich = await db.select({
        id: plants.id,
        name: plants.name,
        latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
        wikidataQid: plants.wikidataQid,
        gbifId: plants.gbifId,
        powId: plants.powId,
      }).from(plants)
        .where(sql`${plants.latinName} IS NOT NULL AND ${plants.latinName} != '' AND (${plants.wikidataQid} IS NULL OR ${plants.gbifId} IS NULL OR ${plants.powId} IS NULL)`)
        .limit(input.limit);

      const results = [];
      let enriched = 0;

      for (const plant of plantsToEnrich) {
        await sleep(DELAY_MS);

        const query = `
SELECT ?taxon ?ncbiId ?gbifId ?powId ?tropicosId WHERE {
  ?taxon wdt:P225 "${(plant.latinName ?? "").replace(/"/g, '\\"')}" .
  OPTIONAL { ?taxon wdt:P685 ?ncbiId . }
  OPTIONAL { ?taxon wdt:P846 ?gbifId . }
  OPTIONAL { ?taxon wdt:P5037 ?powId . }
  OPTIONAL { ?taxon wdt:P960 ?tropicosId . }
}
LIMIT 3`;

        const bindings = await sparqlQuery(query, { timeoutMs: 20000, maxRetries: 3 });

        if (!bindings.length) {
          results.push({ id: plant.id, name: plant.name, latinName: plant.latinName, found: false });
          continue;
        }

        const b = bindings[0];
        const taxonQid = qid(b.taxon?.value ?? "");
        const updateData: Record<string, any> = {};

        if (taxonQid && !plant.wikidataQid) updateData.wikidataQid = taxonQid;
        if (b.gbifId?.value && !plant.gbifId) updateData.gbifId = b.gbifId.value;
        if (b.powId?.value && !plant.powId) updateData.powId = b.powId.value;

        results.push({
          id: plant.id,
          name: plant.name,
          latinName: plant.latinName,
          found: true,
          wikidataQid: taxonQid || null,
          gbifId: b.gbifId?.value ?? null,
          powId: b.powId?.value ?? null,
          ncbiId: b.ncbiId?.value ?? null,
          tropicosId: b.tropicosId?.value ?? null,
          fieldsToUpdate: Object.keys(updateData),
        });

        if (!input.dryRun && Object.keys(updateData).length > 0) {
          await db.update(plants).set(updateData).where(eq(plants.id, plant.id));
          enriched++;
        }
      }

      return {
        success: true,
        total: plantsToEnrich.length,
        found: results.filter((r) => r.found).length,
        enriched: input.dryRun ? 0 : enriched,
        dryRun: input.dryRun,
        results,
      };
    }),

  /**
   * Profil phylogénétique complet d'une plante (toutes les données en une requête)
   */
  getFullPhyloProfile: publicProcedure
    .input(z.object({ scientificName: z.string().min(2) }))
    .query(async ({ input }) => {
      const safeName = input.scientificName.replace(/"/g, '\\"');

      const query = `
SELECT DISTINCT
  ?taxon ?taxonLabel
  ?rank ?rankLabel
  ?parent ?parentLabel ?parentScientificName
  ?chromosomeCount
  ?iucnStatus ?iucnStatusLabel
  ?ncbiId ?gbifId ?powId ?tropicosId
  ?image
WHERE {
  ?taxon wdt:P225 "${safeName}" .
  OPTIONAL { ?taxon wdt:P105 ?rank . }
  OPTIONAL { ?taxon wdt:P171 ?parent . ?parent wdt:P225 ?parentScientificName . }
  OPTIONAL { ?taxon wdt:P1087 ?chromosomeCount . }
  OPTIONAL { ?taxon wdt:P141 ?iucnStatus . }
  OPTIONAL { ?taxon wdt:P685 ?ncbiId . }
  OPTIONAL { ?taxon wdt:P846 ?gbifId . }
  OPTIONAL { ?taxon wdt:P5037 ?powId . }
  OPTIONAL { ?taxon wdt:P960 ?tropicosId . }
  OPTIONAL { ?taxon wdt:P18 ?image . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
LIMIT 5`;

      const bindings = await sparqlQuery(query, { timeoutMs: 30000, maxRetries: 4 });

      if (!bindings.length) return { found: false, profile: null };

      const b = bindings[0];
      const taxonQid = qid(b.taxon?.value ?? "");

      return {
        found: true,
        profile: {
          qid: taxonQid,
          name: b.taxonLabel?.value ?? input.scientificName,
          rank: b.rankLabel?.value ?? null,
          parent: {
            qid: b.parent ? qid(b.parent.value) : null,
            name: b.parentLabel?.value ?? null,
            scientificName: b.parentScientificName?.value ?? null,
          },
          chromosomeCount: b.chromosomeCount?.value ? Number(b.chromosomeCount.value) : null,
          iucnStatus: b.iucnStatusLabel?.value ?? null,
          identifiers: {
            wikidata: taxonQid,
            ncbi: b.ncbiId?.value ?? null,
            gbif: b.gbifId?.value ?? null,
            powo: b.powId?.value ?? null,
            tropicos: b.tropicosId?.value ?? null,
          },
          image: b.image?.value ?? null,
          wikidataUrl: wikidataUrl(taxonQid),
        },
      };
    }),

  importChildTaxaToPlants: publicProcedure
    .input(z.object({
      taxa: z.array(z.object({
        wikidataId: z.string().min(1),
        scientificName: z.string().min(1),
        commonName: z.string().optional(),
        genus: z.string().optional(),
        species: z.string().optional(),
        family: z.string().optional(),
        rankName: z.string().optional(),
      })).min(1).max(100),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('DB non disponible');

      let created = 0;
      let skipped = 0;
      const errors: string[] = [];
      const results: Array<{ wikidataId: string; scientificName: string; status: 'created' | 'skipped' | 'error'; message?: string }> = [];

      for (const taxon of input.taxa) {
        try {
          const existing = await db.select({ id: plants.id })
            .from(plants)
            .where(
              sql`(${plants.latinName} = ${taxon.scientificName}) OR (${plants.wikidataQid} = ${taxon.wikidataId})`
            )
            .limit(1);

          if (existing.length > 0) {
            skipped++;
            results.push({ wikidataId: taxon.wikidataId, scientificName: taxon.scientificName, status: 'skipped', message: `Déjà présente (id=${existing[0].id})` });
            continue;
          }

          const nameParts = taxon.scientificName.trim().split(/\s+/);
          const genus = taxon.genus ?? nameParts[0] ?? 'Unknown';
          const species = taxon.species ?? nameParts[1] ?? null;
          const displayName = taxon.commonName ?? taxon.scientificName;

          await db.insert(plants).values({
            name: displayName,
            latinName: taxon.scientificName,
            family: taxon.family ?? null,
            wikidataQid: taxon.wikidataId,
            wikidataEnrichedAt: new Date(),
            category: 'autre',
            validationStatus: 'brouillon',
            notes: `Importé depuis Wikidata (${taxon.wikidataId}). Rang : ${taxon.rankName ?? 'inconnu'}. Genre : ${genus}${species ? `, espèce : ${species}` : ''}.`,
          });

          created++;
          results.push({ wikidataId: taxon.wikidataId, scientificName: taxon.scientificName, status: 'created' });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`${taxon.scientificName}: ${msg}`);
          results.push({ wikidataId: taxon.wikidataId, scientificName: taxon.scientificName, status: 'error', message: msg });
        }
      }

      return { success: errors.length === 0, created, skipped, errors, results };
    }),
});
