import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

/**
 * Routeur pour l'administration des terroirs
 * Gestion CRUD réelle en DB, détection de doublons, suggestions GBIF
 */
export const territoriesAdminRouter = router({
  /**
   * Récupérer tous les terroirs depuis la DB avec statistiques
   */
  getAllTerritories: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db.execute(sql`
      SELECT 
        t.id, t.terroir_id as terroirId, t.name, t.country, t.region,
        t.latitude, t.longitude, t.climate_type as climateType,
        t.notes, t.created_at as createdAt, t.updated_at as updatedAt,
        COUNT(pt.id) as plantCount
      FROM terroirs t
      LEFT JOIN plant_terroirs pt ON pt.terroir_id = t.id
      GROUP BY t.id
      ORDER BY t.name ASC
    `);
    const data = (rows as any)[0] as any[];
    return data.map((r: any) => ({
      id: String(r.id),
      terroirId: r.terroirId,
      name: r.name,
      country: r.country,
      region: r.region || "",
      coordinates: r.latitude && r.longitude
        ? { lat: parseFloat(r.latitude), lon: parseFloat(r.longitude) }
        : null,
      climateType: r.climateType || null,
      description: r.notes || "",
      plantCount: Number(r.plantCount),
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }),

  /**
   * Créer un nouveau terroir en DB
   */
  createTerritory: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      country: z.string().min(1),
      region: z.string().optional(),
      coordinates: z.object({ lat: z.number(), lon: z.number() }).optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      // Vérifier les doublons
      const existing = await db.execute(sql`
        SELECT id FROM terroirs WHERE name = ${input.name} AND country = ${input.country} LIMIT 1
      `);
      if (((existing as any)[0] as any[]).length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: `Le terroir "${input.name}" existe déjà en ${input.country}` });
      }

      // Générer un terroirId unique
      const countResult = await db.execute(sql`SELECT COUNT(*) as cnt FROM terroirs`);
      const cnt = Number(((countResult as any)[0] as any[])[0]?.cnt || 0);
      const terroirId = `TER-${String(cnt + 1).padStart(3, "0")}`;

      await db.execute(sql`
        INSERT INTO terroirs (terroir_id, name, country, region, latitude, longitude, notes)
        VALUES (${terroirId}, ${input.name}, ${input.country}, ${input.region || null},
          ${input.coordinates?.lat || null}, ${input.coordinates?.lon || null}, ${input.description || null})
      `);
      const newRow = await db.execute(sql`SELECT id FROM terroirs WHERE terroir_id = ${terroirId} LIMIT 1`);
      const newId = ((newRow as any)[0] as any[])[0]?.id;
      return { id: String(newId), terroirId, ...input, plantCount: 0, createdAt: new Date(), updatedAt: new Date() };
    }),

  /**
   * Mettre à jour un terroir
   */
  updateTerritory: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      country: z.string().optional(),
      region: z.string().optional(),
      coordinates: z.object({ lat: z.number(), lon: z.number() }).optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, coordinates, description, ...rest } = input;
      const updates: Record<string, any> = {};
      if (rest.name) updates.name = rest.name;
      if (rest.country) updates.country = rest.country;
      if (rest.region) updates.region = rest.region;
      if (coordinates) { updates.latitude = coordinates.lat; updates.longitude = coordinates.lon; }
      if (description !== undefined) updates.notes = description;
      if (Object.keys(updates).length > 0) {
        const setParts = Object.entries(updates).map(([k, v]) => `${k} = ${JSON.stringify(v)}`).join(", ");
        await db.execute(sql.raw(`UPDATE terroirs SET ${setParts} WHERE id = ${id}`));
      }
      return { success: true, message: "Terroir mis à jour avec succès" };
    }),

  /**
   * Supprimer un terroir (vérifie les associations)
   */
  deleteTerritory: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const plantCount = await db.execute(sql`SELECT COUNT(*) as cnt FROM plant_terroirs WHERE terroir_id = ${Number(input.id)}`);
      const cnt = Number(((plantCount as any)[0] as any[])[0]?.cnt || 0);
      if (cnt > 0) {
        throw new TRPCError({ code: "CONFLICT", message: `Impossible de supprimer : ${cnt} plante(s) associée(s). Dissociez-les d'abord.` });
      }
      await db.execute(sql`DELETE FROM terroirs WHERE id = ${Number(input.id)}`);
      return { success: true, message: "Terroir supprimé avec succès" };
    }),

  /**
   * Fusionner des terroirs doublons
   */
  mergeTerritories: adminProcedure
    .input(z.object({ keepId: z.string(), mergeId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.execute(sql`UPDATE plant_terroirs SET terroir_id = ${Number(input.keepId)} WHERE terroir_id = ${Number(input.mergeId)}`);
      await db.execute(sql`DELETE FROM terroirs WHERE id = ${Number(input.mergeId)}`);
      return { success: true, message: "Terroirs fusionnés avec succès", plantsTransferred: 0 };
    }),

  /**
   * Détecter les doublons potentiels (même pays + nom similaire)
   */
  detectDuplicates: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db.execute(sql`
      SELECT t1.id as id1, t1.name as name1, t1.country as country1,
             t2.id as id2, t2.name as name2, t2.country as country2
      FROM terroirs t1
      JOIN terroirs t2 ON t1.id < t2.id AND t1.country = t2.country
      WHERE LOWER(t1.name) LIKE CONCAT('%', LOWER(SUBSTRING(t2.name, 1, 5)), '%')
         OR LOWER(t2.name) LIKE CONCAT('%', LOWER(SUBSTRING(t1.name, 1, 5)), '%')
      LIMIT 50
    `);
    const data = (rows as any)[0] as any[];
    return data.map((r: any) => ({
      group: [
        { id: String(r.id1), name: r.name1, country: r.country1 },
        { id: String(r.id2), name: r.name2, country: r.country2 },
      ],
      similarity: 0.8,
      reason: `Noms similaires dans le même pays (${r.country1})`,
    }));
  }),

  /**
   * Suggestions de terroirs basées sur les données GBIF
   * Interroge la DB PERFUMUM pour identifier les lacunes géographiques
   */
  /**
   * Obtenir des suggestions de terroirs depuis l'API GBIF réelle
   * Requêtes dynamiques basées sur les familles botaniques aromatiques
   */
  getGBIFTerritorySuggestions: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    // Récupérer les pays déjà documentés dans PERFUMUM
    const existingRows = await db.execute(sql`SELECT DISTINCT country FROM terroirs`);
    const existingCountries = new Set(
      ((existingRows as any)[0] as any[]).map((r: any) => (r.country || "").toLowerCase())
    );

    // Familles botaniques aromatiques prioritaires
    const aromaticFamilies = [
      "Lamiaceae", "Apiaceae", "Rutaceae", "Myrtaceae", "Lauraceae", "Burseraceae", "Orchidaceae"
    ];
    const gbifSuggestions: any[] = [];

    // Requêtes GBIF réelles pour chaque famille
    for (const family of aromaticFamilies) {
      try {
        // Requête GBIF pour statistiques par pays
        const countriesUrl = `https://api.gbif.org/v1/occurrence/search?family=${encodeURIComponent(family)}&facet=countryCode&limit=0&facetMincount=50`;
        const countriesResp = await fetch(countriesUrl, { timeout: 8000 });
        if (!countriesResp.ok) continue;
        const countriesData = await countriesResp.json() as any;
        const facets = countriesData.facets?.[0]?.counts || [];

        // Traiter les top 3 pays par occurrences pour cette famille
        for (let i = 0; i < Math.min(3, facets.length); i++) {
          const facet = facets[i];
          const countryCode = facet.name;
          const occurrences = facet.count;

          // Mapper code ISO vers nom de pays
          const countryMap: Record<string, string> = {
            "CN": "China", "MX": "Mexico", "ZA": "South Africa", "YE": "Yemen",
            "IN": "India", "MA": "Morocco", "ID": "Indonesia", "BR": "Brazil",
            "TH": "Thailand", "VN": "Vietnam", "ET": "Ethiopia", "KE": "Kenya",
            "AU": "Australia", "ES": "Spain", "IT": "Italy", "FR": "France",
            "TR": "Turkey", "GR": "Greece", "PT": "Portugal", "JP": "Japan",
            "ZM": "Zambia", "NG": "Nigeria", "CD": "Democratic Republic of Congo"
          };
          const countryName = countryMap[countryCode] || countryCode;
          if (existingCountries.has(countryName.toLowerCase())) continue;

          gbifSuggestions.push({
            id: `gbif-${family}-${countryCode}`,
            name: `${family} — ${countryName}`,
            country: countryName,
            region: countryName,
            coordinates: { lat: 0, lon: 0 },
            description: `Hotspot GBIF pour ${family} — ${occurrences} occurrences documentées`,
            gbifOccurrences: occurrences,
            uniquePlants: Math.floor(occurrences / 50),
            confidence: Math.min(0.95, 0.7 + (occurrences / 100000)),
            reason: `Données GBIF réelles — ${family} en ${countryName}`,
            alreadyInDb: false,
            source: "gbif-api",
          });
        }
      } catch (err) {
        console.warn(`Erreur GBIF pour ${family}:`, err);
      }
    }

    // Retourner les suggestions (max 15) triées par occurrences décroissantes
    return gbifSuggestions
      .sort((a, b) => b.gbifOccurrences - a.gbifOccurrences)
      .slice(0, 15)
      .map((s, i) => ({ ...s, id: `gbif-suggestion-${i + 1}` }));
  }),
  /**
   * Créer un terroir à partir d'une suggestion GBIF (insertion réelle en DB)
   */
  createFromGBIFSuggestion: adminProcedure
    .input(z.object({
      suggestionId: z.string(),
      name: z.string(),
      country: z.string(),
      region: z.string().optional(),
      coordinates: z.object({ lat: z.number(), lon: z.number() }).optional(),
      description: z.string().optional(),
      autoAssociatePlants: z.boolean().default(false),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Vérifier les doublons
      const existing = await db.execute(sql`SELECT id FROM terroirs WHERE name = ${input.name} AND country = ${input.country} LIMIT 1`);
      if (((existing as any)[0] as any[]).length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: `Le terroir "${input.name}" (${input.country}) existe déjà en base.` });
      }

      const countResult = await db.execute(sql`SELECT COUNT(*) as cnt FROM terroirs`);
      const cnt = Number(((countResult as any)[0] as any[])[0]?.cnt || 0);
      const terroirId = `TER-${String(cnt + 1).padStart(3, "0")}`;

      await db.execute(sql`
        INSERT INTO terroirs (terroir_id, name, country, region, latitude, longitude, notes)
        VALUES (${terroirId}, ${input.name}, ${input.country}, ${input.region || null},
          ${input.coordinates?.lat || null}, ${input.coordinates?.lon || null},
          ${input.description ? `[GBIF] ${input.description}` : "[Importé depuis suggestion GBIF]"})
      `);
      const newRow = await db.execute(sql`SELECT id FROM terroirs WHERE terroir_id = ${terroirId} LIMIT 1`);
      const newId = ((newRow as any)[0] as any[])[0]?.id;

      let plantsAssociated = 0;
      if (input.autoAssociatePlants && input.country) {
        const matchingPlants = await db.execute(sql`
          SELECT id FROM plants WHERE origin_country LIKE ${`%${input.country}%`} LIMIT 20
        `);
        const plantRows = (matchingPlants as any)[0] as any[];
        for (const plant of plantRows) {
          await db.execute(sql`
            INSERT IGNORE INTO plant_terroirs (plant_id, terroir_id, source, notes)
            VALUES (${plant.id}, ${newId}, 'gbif-auto', 'Association automatique depuis suggestion GBIF')
          `);
          plantsAssociated++;
        }
      }

      return {
        success: true,
        message: `Terroir "${input.name}" créé${plantsAssociated > 0 ? ` et ${plantsAssociated} plante(s) associée(s)` : ""}`,
        territoryId: String(newId),
        terroirId,
        plantsAssociated,
      };
    }),

  /**
   * Récupérer les plantes associées à un terroir depuis la DB
   */
  getTerritoriesPlants: publicProcedure
    .input(z.object({ territoryId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.execute(sql`
        SELECT p.id, p.latin_name as latinName, p.common_name as commonName,
               pt.source, pt.created_at as addedAt
        FROM plant_terroirs pt
        JOIN plants p ON p.id = pt.plant_id
        WHERE pt.terroir_id = ${Number(input.territoryId)}
        ORDER BY p.latin_name ASC
      `);
      return (rows as any)[0] as any[];
    }),

  /**
   * Associer une plante à un terroir
   */
  associatePlantToTerritory: adminProcedure
    .input(z.object({
      plantId: z.string(),
      territoryId: z.string(),
      source: z.enum(["direct", "gbif-auto", "user-suggestion"]).default("direct"),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.execute(sql`
        INSERT IGNORE INTO plant_terroirs (plant_id, terroir_id, source, notes)
        VALUES (${Number(input.plantId)}, ${Number(input.territoryId)}, ${input.source}, ${input.notes || null})
      `);
      return { success: true, message: "Plante associée au terroir" };
    }),

  /**
   * Dissocier une plante d'un terroir
   */
  dissociatePlantFromTerritory: adminProcedure
    .input(z.object({ plantId: z.string(), territoryId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.execute(sql`
        DELETE FROM plant_terroirs WHERE plant_id = ${Number(input.plantId)} AND terroir_id = ${Number(input.territoryId)}
      `);
      return { success: true, message: "Plante dissociée du terroir" };
    }),
});
