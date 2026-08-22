import { z } from "zod";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "../db";
import { sql } from "drizzle-orm";
import { withCache, CACHE_KEYS, CACHE_TTL } from "../cache";
import { molecules, plants } from "../../drizzle/schema";

export const plantsRouter = router({
    list: publicProcedure.query(async () => {
      return await withCache(
        CACHE_KEYS.PLANTS_LIST,
        () => db.getAllPlants(),
        CACHE_TTL.MEDIUM
      );
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await withCache(
          CACHE_KEYS.PLANT_DETAIL(input),
          () => db.getPlantById(input),
          CACHE_TTL.MEDIUM
        );
      }),
    getByCategory: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getPlantsByCategory(input);
      }),

    // Plantes menacées (CR, EN, VU, NT, EX) pour la page Patrimoine Menacé
    getEndangered: publicProcedure
      .input(z.object({
        status: z.array(z.enum(['EX', 'CR', 'EN', 'VU', 'NT'])).optional(),
      }).optional())
      .query(async ({ input }) => {
        const dbConn = await db.getDb();
        if (!dbConn) return [];
        const { sql } = await import('drizzle-orm');
        const statuses = input?.status || ['EX', 'CR', 'EN', 'VU', 'NT'];
        const statusList = statuses.map(s => `'${s}'`).join(', ');
        const result = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
          `SELECT p.id, p.name, p.latin_name, p.family, p.category, p.origin,
                  p.conservation_status, p.iucn_id, p.gbif_id, p.gbif_occurrence_count,
                  p.olfactive_signature,
                  COUNT(DISTINCT pm.molecule_id) as molecule_count,
                  GROUP_CONCAT(DISTINCT m.name ORDER BY pm.percentage DESC SEPARATOR ', ') as top_molecules
           FROM plants p
           LEFT JOIN plant_molecules pm ON pm.plant_id = p.id
           LEFT JOIN molecules m ON m.id = pm.molecule_id
           WHERE p.conservation_status IN (${statusList})
           GROUP BY p.id, p.name, p.latin_name, p.family, p.category, p.origin,
                    p.conservation_status, p.iucn_id, p.gbif_id, p.gbif_occurrence_count,
                    p.olfactive_signature
           ORDER BY FIELD(p.conservation_status, 'EX', 'CR', 'EN', 'VU', 'NT'), p.name`
        ));
        return Array.isArray(result) ? result[0] as Record<string, unknown>[] : [];
      }),

    getCertificationStats: publicProcedure.query(async () => {
      const dbConn = await db.getDb();
      if (!dbConn) return { totalPlants: 0, totalCertified: 0, totalCertifications: 0, byType: {}, byIucn: {} };
      const { sql } = await import('drizzle-orm');

      // Statistiques globales
      const [globalStats] = await (dbConn as unknown as { execute: (q: unknown) => Promise<[Record<string, unknown>[], unknown]> }).execute(sql.raw(
        `SELECT
           COUNT(*) as total_plants,
           SUM(CASE WHEN certifications IS NOT NULL AND JSON_LENGTH(certifications) > 0 THEN 1 ELSE 0 END) as total_certified
         FROM plants`
      ));
      const global = (globalStats as Record<string, unknown>[])[0];

      // Plantes certifiées avec leurs certifications
      const [certRows] = await (dbConn as unknown as { execute: (q: unknown) => Promise<[Record<string, unknown>[], unknown]> }).execute(sql.raw(
        `SELECT certifications, conservation_status FROM plants
         WHERE certifications IS NOT NULL AND JSON_LENGTH(certifications) > 0`
      ));

      // Agréger par type et par statut IUCN
      const byType: Record<string, number> = {};
      const byIucn: Record<string, number> = {};
      let totalCertifications = 0;

      for (const row of (certRows as Record<string, unknown>[])) {
        const certs = typeof row.certifications === 'string'
          ? JSON.parse(row.certifications)
          : row.certifications;
        if (Array.isArray(certs)) {
          totalCertifications += certs.length;
          for (const cert of certs) {
            if (cert.type) byType[cert.type] = (byType[cert.type] || 0) + 1;
          }
        }
        if (row.conservation_status && row.conservation_status !== 'NE' && row.conservation_status !== 'DD') {
          const iucnKey = row.conservation_status as string;
          byIucn[iucnKey] = (byIucn[iucnKey] || 0) + 1;
        }
      }

      return {
        totalPlants: Number(global.total_plants),
        totalCertified: Number(global.total_certified),
        totalCertifications,
        byType,
        byIucn,
      };
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        latinName: z.string().optional(),
        family: z.string().optional(),
        category: z.enum(["aromatique", "tabac", "cannabis", "resine", "bois", "fleur", "racine", "autre"]),
        origin: z.string().optional(),
        habitat: z.string().optional(),
        olfactiveSignature: z.string().optional(),
        dominantMolecules: z.string().optional(),
        chemotypes: z.string().optional(),
        climaticAxis: z.enum(["vent", "bois", "disparition", "vent_bois", "bois_disparition", "vent_disparition"]).optional(),
        traditionalUse: z.string().optional(),
        absorbeUse: z.string().optional(),
        botanicalStates: z.array(z.object({
          state: z.string(),
          name: z.string(),
          odor: z.string(),
          molecules: z.array(z.string()),
          usage: z.string(),
        })).optional(),
        notes: z.string().optional(),
        imageUrl: z.string().optional(),
        plantPart: z.enum(['fleur','feuille','fruit','zeste','graine','arille','ecorce','bois','racine','rhizome','bulbe','resine','feuille_tige','plante_entiere','thalle','champignon','autre']).optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createPlant(input);
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          latinName: z.string().optional(),
          family: z.string().optional(),
          category: z.enum(["aromatique", "tabac", "cannabis", "resine", "bois", "fleur", "racine", "autre"]).optional(),
          origin: z.string().optional(),
          habitat: z.string().optional(),
          olfactiveSignature: z.string().optional(),
          dominantMolecules: z.string().optional(),
          chemotypes: z.string().optional(),
          climaticAxis: z.enum(["vent", "bois", "disparition", "vent_bois", "bois_disparition", "vent_disparition"]).optional(),
          traditionalUse: z.string().optional(),
          absorbeUse: z.string().optional(),
          botanicalStates: z.array(z.object({
            state: z.string(),
            name: z.string(),
            odor: z.string(),
            molecules: z.array(z.string()),
            usage: z.string(),
          })).optional(),
          notes: z.string().optional(),
          imageUrl: z.string().optional(),
          // Nomenclature étendue
          synonyms: z.array(z.string()).optional(),
          authorCitation: z.string().optional(),
          gbifId: z.string().optional(),
          itisId: z.string().optional(),
          powId: z.string().optional(),
          genus: z.string().optional(),
          species: z.string().optional(),
          kingdom: z.string().optional(),
          division: z.string().optional(),
          class: z.string().optional(),
          orderName: z.string().optional(),
          plantPart: z.enum(['fleur','feuille','fruit','zeste','graine','arille','ecorce','bois','racine','rhizome','bulbe','resine','feuille_tige','plante_entiere','thalle','champignon','autre']).optional().nullable(),
        }),
      }))
      .mutation(async ({ input }) => {
        return await db.updatePlant(input.id, input.data);
      }),
    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deletePlant(input);
        return { success: true };
      }),
    getMolecules: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getPlantMolecules(input);
      }),
    // Gestion des images botaniques
    uploadImage: protectedProcedure
      .input(z.object({
        plantId: z.number(),
        imageData: z.string(), // Base64 encoded image data
        fileName: z.string(),
        contentType: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Extraire les données base64 (enlever le préfixe data:...)
        const base64Data = input.imageData.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const extension = input.fileName.split('.').pop() || 'jpg';
        const fileKey = `plants/${input.plantId}/botanical-${timestamp}-${randomSuffix}.${extension}`;
        
        // Upload vers S3
        const { storagePut } = await import('../storage');
        const { url } = await storagePut(fileKey, buffer, input.contentType);
        
        // Mettre à jour l'URL dans la base de données
        await db.updatePlantImage(input.plantId, url);
        
        return { url, key: fileKey };
      }),
    updateImage: protectedProcedure
      .input(z.object({
        plantId: z.number(),
        imageUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await db.updatePlantImage(input.plantId, input.imageUrl);
      }),
    deleteImage: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deletePlantImage(input);
      }),
    getWithImages: publicProcedure.query(async () => {
      return await db.getPlantsWithImages();
    }),
    getWithoutImages: publicProcedure.query(async () => {
      return await db.getPlantsWithoutImages();
    }),
    // Plantes avec coordonnées GPS pour la carte
    getWithGPS: publicProcedure.query(async () => {
      return await db.getPlantsWithGPS();
    }),
    getWithGPSByCategory: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getPlantsWithGPSByCategory(input);
      }),
    listFamilies: publicProcedure.query(async () => {
      const fwc = await db.getPlantFamiliesWithCategories();
      return fwc.map(f => ({ name: f.family, count: f.count }));
    }),
    getByFamily: publicProcedure.input(z.string()).query(async ({ input }) => {
      const allPlants = await db.getAllPlants(); return allPlants.filter((p) => p.family === input);
    }),
    getByOrigin: publicProcedure
      .input(z.object({ origin: z.string() }))
      .query(async ({ input }) => {
        const allPlants = await db.getAllPlants();
        const originLower = input.origin.toLowerCase();
        return allPlants.filter((p) =>
          (p.origin && p.origin.toLowerCase().includes(originLower)) ||
          (p.notes && p.notes.toLowerCase().includes(originLower))
        );
      }),
    getFamilyStats: publicProcedure.query(async () => {
      const fwc = await db.getPlantFamiliesWithCategories();
      return fwc.map(f => ({ family: f.family, count: f.count }));
    }),
    getFamiliesWithCategories: publicProcedure.query(async () => await db.getPlantFamiliesWithCategories()),
    getSeasonalVariations: publicProcedure
      .input(z.number())
      .query(async ({ input: plantId }) => {
        const { getDb } = await import('../db');
        const { sql } = await import('drizzle-orm');
        const dbConn = await getDb();
        if (!dbConn) return [];
        const result = await dbConn.execute(sql`
          SELECT id, plant_id, season, harvest_period, temperature_range,
                 humidity_range, notes, key_molecules, yield_modifier,
                 quality_score, extraction_notes, created_at
          FROM seasonal_variations
          WHERE plant_id = ${plantId}
          ORDER BY FIELD(season, 'printemps', 'ete', 'automne', 'hiver')
        `);
        const rawResult = result as unknown as Record<string, unknown>[] | { rows: Record<string, unknown>[] };
        const rows = (Array.isArray(rawResult) ? rawResult[0] : (rawResult as { rows: Record<string, unknown>[] }).rows ?? rawResult) as Record<string, unknown>[];
        return rows.map((r: Record<string, unknown>) => ({
          id: r.id as number,
          plantId: r.plant_id as number,
          season: r.season as 'printemps' | 'ete' | 'automne' | 'hiver',
          harvestPeriod: r.harvest_period as string | null,
          temperatureRange: r.temperature_range as string | null,
          humidityRange: r.humidity_range as string | null,
          notes: r.notes as string | null,
          keyMolecules: typeof r.key_molecules === 'string' ? JSON.parse(r.key_molecules) : (r.key_molecules ?? []),
          yieldModifier: r.yield_modifier ? parseFloat(String(r.yield_modifier)) : null,
          qualityScore: r.quality_score as number | null,
          extractionNotes: r.extraction_notes as string | null,
          createdAt: r.created_at as Date | null,
        }));
      }),
    // Parfums emblématiques d'une plante
    getPerfumes: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getPlantPerfumes(input);
      }),
    // Plantes contenant une molécule dominante spécifique (pour les badges)
    getByDominantMolecule: publicProcedure
      .input(z.object({
        moleculeName: z.string().min(1),
        excludePlantId: z.number().optional(),
        limit: z.number().min(1).max(100).default(50),
      }))
      .query(async ({ input }) => {
        const { getDb } = await import('../db');
        const { sql } = await import('drizzle-orm');
        const dbConn = await getDb();
        if (!dbConn) return [];
        const searchTerm = `%${input.moleculeName}%`;
        const result = await dbConn.execute(
          input.excludePlantId
            ? sql`SELECT id, name, latin_name, category, image_url FROM plants WHERE dominant_molecules LIKE ${searchTerm} AND id != ${input.excludePlantId} ORDER BY name LIMIT ${input.limit}`
            : sql`SELECT id, name, latin_name, category, image_url FROM plants WHERE dominant_molecules LIKE ${searchTerm} ORDER BY name LIMIT ${input.limit}`
        );
        const rawResult = result as unknown as Record<string, unknown>[] | { rows: Record<string, unknown>[] };
        const rows = (Array.isArray(rawResult) ? rawResult[0] : (rawResult as { rows: Record<string, unknown>[] }).rows ?? rawResult) as Record<string, unknown>[];
        return rows.map((r: Record<string, unknown>) => ({
          id: r.id as number,
          name: r.name as string,
          latinName: r.latin_name as string | null,
          category: r.category as string,
          imageUrl: r.image_url as string | null,
        }));
      }),
    // ---- Enrichissement IA par lot ----
    getBatchEnrichStats: publicProcedure.query(async () => {
      const db2 = await db.getDb();
      const [rows] = await (db2 as unknown as { execute: (q: unknown) => Promise<[Record<string, unknown>[], unknown]> }).execute(
        `SELECT
          COUNT(*) as total,
          SUM(CASE WHEN (notes IS NULL OR notes = '') THEN 1 ELSE 0 END) as missingDescription,
          SUM(CASE WHEN (olfactive_signature IS NULL OR olfactive_signature = '') THEN 1 ELSE 0 END) as missingOlfactiveProfile,
          SUM(CASE WHEN (traditional_use IS NULL OR traditional_use = '') THEN 1 ELSE 0 END) as missingTherapeutic
        FROM plants`
      );
      const r = (rows as Record<string, unknown>[])[0];
      return {
        total: Number(r.total),
        missingDescription: Number(r.missingDescription),
        missingOlfactiveProfile: Number(r.missingOlfactiveProfile),
        missingTherapeutic: Number(r.missingTherapeutic),
      };
    }),

    getForBatchEnrich: publicProcedure
      .input(z.object({
        filter: z.enum(['all', 'missingDescription', 'missingOlfactiveProfile', 'missingTherapeutic']).default('missingDescription'),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        const db2 = await db.getDb();
        let where = '1=1';
        if (input.filter === 'missingDescription') where = "(notes IS NULL OR notes = '')";
        if (input.filter === 'missingOlfactiveProfile') where = "(olfactive_signature IS NULL OR olfactive_signature = '')";
        if (input.filter === 'missingTherapeutic') where = "(traditional_use IS NULL OR traditional_use = '')";
        const mysql2 = await import('mysql2/promise');
        const conn = await mysql2.createConnection(process.env.DATABASE_URL!);
        const limit = Number(input.limit);
        const offset = Number(input.offset);
        const [rows] = await conn.query(`SELECT id, name, latin_name, family FROM plants WHERE ${where} ORDER BY name LIMIT ${limit} OFFSET ${offset}`);
        const [countRows] = await conn.query(`SELECT COUNT(*) as total FROM plants WHERE ${where}`);
        await conn.end();
        return {
          plants: (rows as Record<string, unknown>[]),
          total: Number((countRows as Record<string, unknown>[])[0]?.total ?? 0),
        };
      }),

    /**
     * Rapport 9 — Arbre taxonomique visuel
     * Combine les données PERFUMUM (famille, genre, espèce) avec Wikidata (P171 parent taxon)
     * pour construire un arbre hiérarchique navigable depuis la fiche plante.
     */
    getTaxonomyTree: publicProcedure
      .input(z.object({
        plantId: z.number(),
        useWikidata: z.boolean().default(true),
      }))
      .query(async ({ input }) => {
        const mysql2 = await import('mysql2/promise');
        const conn = await mysql2.createConnection(process.env.DATABASE_URL!);

        try {
          // 1. Récupérer la plante cible avec ses métadonnées taxonomiques
          const [plantRows] = await conn.query(
            `SELECT id, name, latin_name, family, wikidata_qid, ncbi_tax_id, gbif_id, pow_id
             FROM plants WHERE id = ? LIMIT 1`,
            [input.plantId]
          );
          const plant = (plantRows as Record<string, unknown>[])[0];
          if (!plant) throw new TRPCError({ code: 'NOT_FOUND', message: 'Plante introuvable' });

          const latinName = (plant.latin_name as string) || '';
          // Extraire le genre depuis le nom latin (premier mot) — ex: "Rosa damascena" → "Rosa"
          // Ignorer si le premier mot n'est pas un genre valide (majuscule + lettres uniquement)
          const rawGenus = latinName.trim().split(/\s+/)[0] || '';
          const genus = /^[A-Z][a-z]+$/.test(rawGenus) ? rawGenus : '';
          const family = (plant.family as string) || '';

          // 2. Espèces sœurs (même genre)
          let siblingsRows: Record<string, unknown>[] = [];
          if (genus) {
            const [sib] = await conn.query(
              `SELECT id, name, latin_name, family, wikidata_qid
               FROM plants WHERE latin_name LIKE ? AND id != ? ORDER BY latin_name LIMIT 30`,
              [`${genus} %`, input.plantId]
            );
            siblingsRows = sib as Record<string, unknown>[];
          }

          // 3. Autres genres de la même famille
          let familyRows: Record<string, unknown>[] = [];
          if (family) {
            const [fam] = await conn.query(
              `SELECT id, name, latin_name, family, wikidata_qid
               FROM plants WHERE family = ? AND (latin_name IS NULL OR latin_name NOT LIKE ?)
               ORDER BY name LIMIT 20`,
              [family, `${genus} %`]
            );
            familyRows = fam as Record<string, unknown>[];
          }

          // 4. Ancêtres Wikidata via P171 (parent taxon)
          let wikidataAncestors: Array<{
            qid: string; label: string; rank: string; rankLabel: string; parentQid?: string;
          }> = [];

          if (input.useWikidata && plant.wikidata_qid) {
            try {
              const qid = plant.wikidata_qid as string;
              const sparqlQuery = `SELECT ?taxon ?taxonLabel ?rank ?rankLabel ?parent WHERE {
  VALUES ?startTaxon { wd:${qid} }
  ?startTaxon wdt:P171* ?taxon .
  ?taxon wdt:P105 ?rank .
  OPTIONAL { ?taxon wdt:P171 ?parent . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
ORDER BY ?rank
LIMIT 20`;
              const wikidataUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;
              const controller = new AbortController();
              const timeout = setTimeout(() => controller.abort(), 8000);
              const resp = await fetch(wikidataUrl, {
                headers: { 'Accept': 'application/sparql-results+json', 'User-Agent': 'PERFUMUM-Research/1.0' },
                signal: controller.signal,
              });
              clearTimeout(timeout);
              if (resp.ok) {
                const data = await resp.json() as { results?: { bindings?: Record<string, { value: string }>[] } };
                const bindings = data.results?.bindings || [];
                wikidataAncestors = bindings.map((b) => ({
                  qid: b.taxon?.value?.replace('http://www.wikidata.org/entity/', '') || '',
                  label: b.taxonLabel?.value || '',
                  rank: b.rank?.value?.replace('http://www.wikidata.org/entity/', '') || '',
                  rankLabel: b.rankLabel?.value || '',
                  parentQid: b.parent?.value?.replace('http://www.wikidata.org/entity/', '') || undefined,
                })).filter((a) => a.qid && a.label);
              }
            } catch {
              // Wikidata indisponible — on continue sans les ancêtres
            }
          }

          // 5. Construire l'arbre hiérarchique PERFUMUM
          const otherGenera: Record<string, Record<string, unknown>[]> = {};
          for (const fp of familyRows) {
            const fpGenus = ((fp.latin_name as string) || '').trim().split(/\s+/)[0] || (fp.name as string);
            if (!otherGenera[fpGenus]) otherGenera[fpGenus] = [];
            otherGenera[fpGenus].push(fp);
          }

          const tree = {
            id: `family-${family}`,
            name: family || 'Famille inconnue',
            type: 'family' as const,
            level: 0,
            perfumumId: null as number | null,
            wikidataQid: null as string | null,
            latinName: null as string | null,
            children: [
              {
                id: `genus-${genus}`,
                name: genus || 'Genre inconnu',
                type: 'genus' as const,
                level: 1,
                perfumumId: null as number | null,
                wikidataQid: null as string | null,
                latinName: null as string | null,
                children: [
                  {
                    id: `plant-${plant.id}`,
                    name: (plant.name as string) || '',
                    type: 'target' as const,
                    level: 2,
                    perfumumId: plant.id as number,
                    wikidataQid: (plant.wikidata_qid as string) || null,
                    latinName: latinName || null,
                    children: [],
                  },
                  ...siblingsRows.map((s) => ({
                    id: `plant-${s.id}`,
                    name: (s.name as string) || '',
                    type: 'sibling' as const,
                    level: 2,
                    perfumumId: s.id as number,
                    wikidataQid: (s.wikidata_qid as string) || null,
                    latinName: (s.latin_name as string) || null,
                    children: [],
                  })),
                ],
              },
              ...Object.entries(otherGenera).slice(0, 8).map(([g, plants_]) => ({
                id: `genus-other-${g}`,
                name: g,
                type: 'genus' as const,
                level: 1,
                perfumumId: null as number | null,
                wikidataQid: null as string | null,
                latinName: null as string | null,
                children: plants_.slice(0, 5).map((p_) => ({
                  id: `plant-${p_.id}`,
                  name: (p_.name as string) || '',
                  type: 'other' as const,
                  level: 2,
                  perfumumId: p_.id as number,
                  wikidataQid: (p_.wikidata_qid as string) || null,
                  latinName: (p_.latin_name as string) || null,
                  children: [],
                })),
              })),
            ],
          };

          return {
            tree,
            plant: {
              id: plant.id as number,
              name: plant.name as string,
              latinName,
              family,
              genus,
              wikidataQid: (plant.wikidata_qid as string) || null,
              gbifId: (plant.gbif_id as string) || null,
              ncbiTaxId: (plant.ncbi_tax_id as string) || null,
            },
            wikidataAncestors,
            stats: {
              siblingCount: siblingsRows.length,
              familyCount: familyRows.length,
              ancestorCount: wikidataAncestors.length,
            },
          };
        } finally {
          await conn.end();
        }
      }),
});
