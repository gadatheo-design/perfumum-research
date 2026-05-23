/**
 * Pyrfume Integration Router
 * 
 * Intégration avec la base de données Pyrfume (pyrfume.org)
 * Source: https://github.com/pyrfume/pyrfume-data (MIT License)
 * 
 * Fonctionnalités:
 * - Matching CID PubChem entre molécules PERFUMUM et Pyrfume
 * - Import de descripteurs olfactifs (Dravnieks, Leffingwell, Good Scents, Keller)
 * - Consultation des données Pyrfume enrichies
 * - Statistiques de couverture
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  pyrfumeMoleculeMapping,
  pyrfumeOlfactoryDescriptors,
  pyrfumeDatasets,
  pyrfumeIfraRestrictions,
  pyrfumeEmbeddings,
  molecules,
} from "../../drizzle/schema";
import { eq, sql, desc, and, inArray, like, count } from "drizzle-orm";

// GitHub raw URL base for Pyrfume data
const PYRFUME_RAW_BASE = "https://raw.githubusercontent.com/pyrfume/pyrfume-data/main";

// Known Pyrfume datasets with metadata
const PYRFUME_KNOWN_DATASETS = [
  {
    name: "leffingwell",
    displayName: "Leffingwell & Associates",
    author: "Leffingwell, J.C.",
    year: 2001,
    description: "Base de données commerciale de descripteurs olfactifs pour ~3500 molécules aromatiques. Inclut des descripteurs primaires et secondaires.",
    sourceUrl: `${PYRFUME_RAW_BASE}/leffingwell`,
    citation: "Leffingwell, J.C. (2001). Olfaction - Update No. 5. Leffingwell Reports.",
  },
  {
    name: "dravnieks_1985",
    displayName: "Dravnieks Atlas (1985)",
    author: "Dravnieks, A.",
    year: 1985,
    description: "Atlas de 146 descripteurs olfactifs évalués par un panel de 507 sujets sur 144 molécules. Référence historique en psychophysique olfactive.",
    sourceUrl: `${PYRFUME_RAW_BASE}/dravnieks_1985`,
    citation: "Dravnieks, A. (1985). Atlas of Odor Character Profiles. ASTM Data Series DS 61.",
  },
  {
    name: "goodscents",
    displayName: "The Good Scents Company",
    author: "The Good Scents Company",
    year: 2021,
    description: "Base de données industrielle avec descripteurs olfactifs, seuils de perception et applications pour ~5000 molécules.",
    sourceUrl: `${PYRFUME_RAW_BASE}/goodscents`,
    citation: "The Good Scents Company Information System. www.thegoodscentscompany.com",
  },
  {
    name: "keller_2016",
    displayName: "Keller & Vosshall DREAM Challenge (2016)",
    author: "Keller, A. & Vosshall, L.B.",
    year: 2016,
    description: "Données du DREAM Olfaction Prediction Challenge: 476 molécules évaluées par 49 sujets sur 21 descripteurs perceptuels.",
    sourceUrl: `${PYRFUME_RAW_BASE}/keller_2016`,
    citation: "Keller, A. et al. (2017). Predicting human olfactory perception from chemical features of odor molecules. Science, 355(6327), 820-826.",
  },
  {
    name: "ifra_2019",
    displayName: "IFRA Standards (49th Amendment)",
    author: "International Fragrance Association",
    year: 2019,
    description: "Standards réglementaires IFRA: restrictions, interdictions et spécifications pour les ingrédients de parfumerie.",
    sourceUrl: `${PYRFUME_RAW_BASE}/ifra_2019`,
    citation: "IFRA (2019). IFRA Standards - 49th Amendment. International Fragrance Association.",
  },
  {
    name: "arctander_1969",
    displayName: "Arctander (1969)",
    author: "Arctander, S.",
    year: 1969,
    description: "Descriptions olfactives détaillées de Steffen Arctander pour les matières premières de parfumerie. Référence classique.",
    sourceUrl: `${PYRFUME_RAW_BASE}/arctander_1969`,
    citation: "Arctander, S. (1969). Perfume and Flavor Chemicals (Aroma Chemicals). Montclair, NJ.",
  },
  {
    name: "sigma_2014",
    displayName: "Sigma Aldrich Flavors & Fragrances",
    author: "Sigma-Aldrich",
    year: 2014,
    description: "Catalogue Sigma-Aldrich avec descripteurs olfactifs et propriétés physico-chimiques pour les molécules aromatiques.",
    sourceUrl: `${PYRFUME_RAW_BASE}/sigma_2014`,
    citation: "Sigma-Aldrich (2014). Flavors & Fragrances Catalog.",
  },
];

export const pyrfumeRouter = router({
  // ========================================================================
  // STATISTIQUES & COUVERTURE
  // ========================================================================

  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalMapped: 0, totalDescriptors: 0, datasets: [], coverage: 0 };

    const [mappingCount] = await db.select({ count: count() }).from(pyrfumeMoleculeMapping);
    const [descriptorCount] = await db.select({ count: count() }).from(pyrfumeOlfactoryDescriptors);
    const [moleculeCount] = await db.select({ count: count() }).from(molecules);
    const datasets = await db.select().from(pyrfumeDatasets).orderBy(desc(pyrfumeDatasets.matchedCount));

    return {
      totalMapped: Number(mappingCount.count),
      totalDescriptors: Number(descriptorCount.count),
      totalMolecules: Number(moleculeCount.count),
      coverage: moleculeCount.count > 0 
        ? Math.round((Number(mappingCount.count) / Number(moleculeCount.count)) * 100) 
        : 0,
      datasets,
    };
  }),

  // Obtenir les datasets disponibles
  getDatasets: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(pyrfumeDatasets).orderBy(pyrfumeDatasets.name);
  }),

  // Obtenir les datasets connus (métadonnées statiques)
  getKnownDatasets: publicProcedure.query(() => {
    return PYRFUME_KNOWN_DATASETS;
  }),

  // ========================================================================
  // MATCHING CID (Phase 1 du rapport)
  // ========================================================================

  // Lancer le matching CID entre molécules PERFUMUM et Pyrfume
  runCidMatching: protectedProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database non disponible");

    // Récupérer toutes les molécules PERFUMUM avec un pubchem_cid
    const perfumumMolecules = await db
      .select({
        id: molecules.id,
        name: molecules.name,
        pubchemCid: molecules.pubchemCid,
        casNumber: molecules.casNumber,
        smiles: molecules.smiles,
      })
      .from(molecules);

    const moleculesWithCid = perfumumMolecules.filter(m => m.pubchemCid);
    
    // Récupérer les mappings existants pour éviter les doublons
    const existingMappings = await db.select({ moleculeId: pyrfumeMoleculeMapping.moleculeId }).from(pyrfumeMoleculeMapping);
    const alreadyMapped = new Set(existingMappings.map(m => m.moleculeId));

    // Filtrer les molécules non encore mappées
    const toMap = moleculesWithCid.filter(m => !alreadyMapped.has(m.id));

    let mapped = 0;
    const batchSize = 50;

    for (let i = 0; i < toMap.length; i += batchSize) {
      const batch = toMap.slice(i, i + batchSize);
      const values = batch.map(m => ({
        moleculeId: m.id,
        pyrfumeCid: m.pubchemCid!,
        matchMethod: "cid" as const,
        confidence: 1.0,
        pyrfumeName: m.name,
      }));

      if (values.length > 0) {
        await db.insert(pyrfumeMoleculeMapping).values(values);
        mapped += values.length;
      }
    }

    return {
      totalMolecules: perfumumMolecules.length,
      moleculesWithCid: moleculesWithCid.length,
      alreadyMapped: alreadyMapped.size,
      newlyMapped: mapped,
      unmappable: perfumumMolecules.length - moleculesWithCid.length - alreadyMapped.size,
    };
  }),

  // Matching par CAS number (fallback)
  runCasMatching: protectedProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database non disponible");

    // Molécules avec CAS mais sans mapping Pyrfume
    const existingMappings = await db.select({ moleculeId: pyrfumeMoleculeMapping.moleculeId }).from(pyrfumeMoleculeMapping);
    const alreadyMapped = new Set(existingMappings.map(m => m.moleculeId));

    const unmapped = await db
      .select({ id: molecules.id, name: molecules.name, casNumber: molecules.casNumber })
      .from(molecules);

    const toMap = unmapped.filter(m => m.casNumber && !alreadyMapped.has(m.id));

    let mapped = 0;
    for (const mol of toMap) {
      // Pour le matching CAS, on crée un mapping avec confidence 0.9
      // (le CAS est fiable mais pas aussi direct que le CID)
      await db.insert(pyrfumeMoleculeMapping).values({
        moleculeId: mol.id,
        pyrfumeCid: 0, // Placeholder — sera enrichi lors de l'import Pyrfume
        matchMethod: "cas" as const,
        confidence: 0.9,
        pyrfumeName: mol.name,
      });
      mapped++;
    }

    return { newlyMapped: mapped, totalUnmapped: unmapped.filter(m => !m.casNumber && !alreadyMapped.has(m.id)).length };
  }),

  // ========================================================================
  // IMPORT DE DESCRIPTEURS OLFACTIFS
  // ========================================================================

  // Importer les descripteurs d'un dataset Pyrfume
  importDataset: protectedProcedure
    .input(z.object({
      datasetName: z.string(),
      descriptors: z.array(z.object({
        moleculeId: z.number(),
        descriptor: z.string(),
        value: z.number().optional(),
        rawValue: z.string().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database non disponible");

      const { datasetName, descriptors } = input;

      // Vérifier/créer le dataset
      const [existing] = await db
        .select()
        .from(pyrfumeDatasets)
        .where(eq(pyrfumeDatasets.name, datasetName));

      if (!existing) {
        const known = PYRFUME_KNOWN_DATASETS.find(d => d.name === datasetName);
        await db.insert(pyrfumeDatasets).values({
          name: datasetName,
          displayName: known?.displayName || datasetName,
          author: known?.author,
          year: known?.year,
          description: known?.description,
          sourceUrl: known?.sourceUrl,
          citation: known?.citation,
          importStatus: "importing",
        });
      } else {
        await db.update(pyrfumeDatasets)
          .set({ importStatus: "importing" })
          .where(eq(pyrfumeDatasets.id, existing.id));
      }

      // Insérer les descripteurs par batch
      let imported = 0;
      const batchSize = 100;

      for (let i = 0; i < descriptors.length; i += batchSize) {
        const batch = descriptors.slice(i, i + batchSize);
        const values = batch.map(d => ({
          moleculeId: d.moleculeId,
          dataset: datasetName,
          descriptor: d.descriptor,
          value: d.value ?? null,
          rawValue: d.rawValue ?? null,
          sourceUrl: PYRFUME_KNOWN_DATASETS.find(ds => ds.name === datasetName)?.sourceUrl,
        }));

        await db.insert(pyrfumeOlfactoryDescriptors).values(values);
        imported += values.length;
      }

      // Mettre à jour le statut du dataset
      const [moleculeCountResult] = await db
        .select({ count: sql<number>`COUNT(DISTINCT molecule_id)` })
        .from(pyrfumeOlfactoryDescriptors)
        .where(eq(pyrfumeOlfactoryDescriptors.dataset, datasetName));

      await db.update(pyrfumeDatasets)
        .set({
          importStatus: "completed",
          moleculeCount: Number(moleculeCountResult.count),
          lastImportedAt: new Date(),
        })
        .where(eq(pyrfumeDatasets.name, datasetName));

      return { imported, datasetName };
    }),

  // Seed les métadonnées des datasets connus
  seedDatasets: protectedProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database non disponible");

    let seeded = 0;
    for (const dataset of PYRFUME_KNOWN_DATASETS) {
      const [existing] = await db
        .select()
        .from(pyrfumeDatasets)
        .where(eq(pyrfumeDatasets.name, dataset.name));

      if (!existing) {
        await db.insert(pyrfumeDatasets).values({
          name: dataset.name,
          displayName: dataset.displayName,
          author: dataset.author,
          year: dataset.year,
          description: dataset.description,
          sourceUrl: dataset.sourceUrl,
          citation: dataset.citation,
          license: "MIT",
          importStatus: "pending",
        });
        seeded++;
      }
    }

    return { seeded, total: PYRFUME_KNOWN_DATASETS.length };
  }),

  // ========================================================================
  // CONSULTATION DES DONNÉES
  // ========================================================================

  // Obtenir les descripteurs Pyrfume pour une molécule
  getDescriptorsForMolecule: publicProcedure
    .input(z.object({ moleculeId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return await db
        .select()
        .from(pyrfumeOlfactoryDescriptors)
        .where(eq(pyrfumeOlfactoryDescriptors.moleculeId, input.moleculeId))
        .orderBy(pyrfumeOlfactoryDescriptors.dataset, pyrfumeOlfactoryDescriptors.descriptor);
    }),

  // Obtenir le mapping Pyrfume pour une molécule
  getMappingForMolecule: publicProcedure
    .input(z.object({ moleculeId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [mapping] = await db
        .select()
        .from(pyrfumeMoleculeMapping)
        .where(eq(pyrfumeMoleculeMapping.moleculeId, input.moleculeId));

      return mapping || null;
    }),

  // Obtenir les restrictions IFRA pour une molécule
  getIfraForMolecule: publicProcedure
    .input(z.object({ moleculeId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return await db
        .select()
        .from(pyrfumeIfraRestrictions)
        .where(eq(pyrfumeIfraRestrictions.moleculeId, input.moleculeId));
    }),

  // Rechercher des molécules par descripteur olfactif
  searchByDescriptor: publicProcedure
    .input(z.object({
      descriptor: z.string(),
      dataset: z.string().optional(),
      minValue: z.number().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [like(pyrfumeOlfactoryDescriptors.descriptor, `%${input.descriptor}%`)];
      if (input.dataset) {
        conditions.push(eq(pyrfumeOlfactoryDescriptors.dataset, input.dataset));
      }

      const results = await db
        .select({
          moleculeId: pyrfumeOlfactoryDescriptors.moleculeId,
          descriptor: pyrfumeOlfactoryDescriptors.descriptor,
          value: pyrfumeOlfactoryDescriptors.value,
          dataset: pyrfumeOlfactoryDescriptors.dataset,
        })
        .from(pyrfumeOlfactoryDescriptors)
        .where(and(...conditions))
        .orderBy(desc(pyrfumeOlfactoryDescriptors.value))
        .limit(100);

      // Enrichir avec les noms de molécules
      if (results.length === 0) return [];

      const moleculeIds = [...new Set(results.map(r => r.moleculeId))];
      const moleculeNames = await db
        .select({ id: molecules.id, name: molecules.name })
        .from(molecules)
        .where(inArray(molecules.id, moleculeIds));

      const nameMap = new Map(moleculeNames.map(m => [m.id, m.name]));

      return results.map(r => ({
        ...r,
        moleculeName: nameMap.get(r.moleculeId) || "Inconnue",
      }));
    }),

  // Obtenir les top descripteurs pour un dataset
  getTopDescriptors: publicProcedure
    .input(z.object({ dataset: z.string(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return await db
        .select({
          descriptor: pyrfumeOlfactoryDescriptors.descriptor,
          count: sql<number>`COUNT(*)`,
          avgValue: sql<number>`AVG(value)`,
        })
        .from(pyrfumeOlfactoryDescriptors)
        .where(eq(pyrfumeOlfactoryDescriptors.dataset, input.dataset))
        .groupBy(pyrfumeOlfactoryDescriptors.descriptor)
        .orderBy(desc(sql`COUNT(*)`))
        .limit(input.limit);
    }),

  // Obtenir les molécules non encore mappées
  getUnmappedMolecules: publicProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const mapped = await db.select({ moleculeId: pyrfumeMoleculeMapping.moleculeId }).from(pyrfumeMoleculeMapping);
      const mappedIds = mapped.map(m => m.moleculeId);

      const allMolecules = await db
        .select({ id: molecules.id, name: molecules.name, pubchemCid: molecules.pubchemCid, casNumber: molecules.casNumber })
        .from(molecules)
        .limit(input.limit + mappedIds.length);

      return allMolecules
        .filter(m => !mappedIds.includes(m.id))
        .slice(0, input.limit);
    }),
});
