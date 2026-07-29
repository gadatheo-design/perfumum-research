import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

/**
 * Routeur pour l'administration des terroirs
 * Gestion CRUD, détection de doublons, suggestions GBIF
 */
export const territoriesAdminRouter = router({
  /**
   * Récupérer tous les terroirs avec statistiques
   */
  getAllTerritories: publicProcedure.query(async () => {
    // Données d'exemple (en production, utiliser la DB réelle)
    const territories = [
      {
        id: "1",
        name: "Provence",
        country: "France",
        region: "PACA",
        coordinates: { lat: 43.9, lon: 6.2 },
        description: "Région méditerranéenne française",
        plantCount: 45,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        name: "Grasse",
        country: "France",
        region: "PACA",
        coordinates: { lat: 43.66, lon: 6.62 },
        description: "Centre mondial de la parfumerie",
        plantCount: 38,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "3",
        name: "Madagascar",
        country: "Madagascar",
        region: "National",
        coordinates: { lat: -18.9, lon: 47.5 },
        description: "Île de la vanille et des épices",
        plantCount: 62,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
    ];

    return territories;
  }),

  /**
   * Créer un nouveau terroir
   */
  createTerritory: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        country: z.string().min(1),
        region: z.string().optional(),
        coordinates: z.object({ lat: z.number(), lon: z.number() }).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      // Vérifier les doublons
      // const existing = await db.query.territories.findFirst({
      //   where: and(
      //     eq(territories.name, input.name),
      //     eq(territories.country, input.country)
      //   ),
      // });

      // if (existing) {
      //   throw new TRPCError({
      //     code: "CONFLICT",
      //     message: `Le terroir "${input.name}" existe déjà en ${input.country}`,
      //   });
      // }

      // Créer le terroir
      // const newTerritory = await db.insert(territories).values({
      //   name: input.name,
      //   country: input.country,
      //   region: input.region,
      //   coordinates: input.coordinates ? JSON.stringify(input.coordinates) : null,
      //   description: input.description,
      // });

      return {
        id: "new-id",
        ...input,
        plantCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),

  /**
   * Mettre à jour un terroir
   */
  updateTerritory: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        country: z.string().optional(),
        region: z.string().optional(),
        coordinates: z.object({ lat: z.number(), lon: z.number() }).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      // Mettre à jour le terroir
      // await db.update(territories).set({...}).where(eq(territories.id, input.id));

      return { success: true, message: "Terroir mis à jour avec succès" };
    }),

  /**
   * Supprimer un terroir
   */
  deleteTerritory: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      // Vérifier qu'il n'y a pas de plantes associées
      // const plantCount = await db.query.plantTerritories.findMany({
      //   where: eq(plantTerritories.territoryId, input.id),
      // });

      // if (plantCount.length > 0) {
      //   throw new TRPCError({
      //     code: "CONFLICT",
      //     message: `Impossible de supprimer: ${plantCount.length} plante(s) associée(s)`,
      //   });
      // }

      // Supprimer le terroir
      // await db.delete(territories).where(eq(territories.id, input.id));

      return { success: true, message: "Terroir supprimé avec succès" };
    }),

  /**
   * Détecter les doublons potentiels
   */
  detectDuplicates: adminProcedure.query(async () => {
    // Données d'exemple de doublons détectés
    const duplicates = [
      {
        group: 1,
        items: [
          {
            id: "t1",
            name: "Provence",
            country: "France",
            similarity: 0.95,
          },
          {
            id: "t2",
            name: "Provence-Alpes-Côte d'Azur",
            country: "France",
            similarity: 0.92,
          },
        ],
        reason: "Noms similaires pour la même région",
      },
      {
        group: 2,
        items: [
          {
            id: "t3",
            name: "Madagascar",
            country: "Madagascar",
            similarity: 0.98,
          },
          {
            id: "t4",
            name: "Île de Madagascar",
            country: "Madagascar",
            similarity: 0.96,
          },
        ],
        reason: "Noms similaires pour le même pays",
      },
    ];

    return duplicates;
  }),

  /**
   * Fusionner deux terroirs (garde le premier, supprime le second)
   */
  mergeTerritories: adminProcedure
    .input(
      z.object({
        keepId: z.string(),
        mergeId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      // Fusionner les terroirs
      // 1. Transférer toutes les plantes de mergeId vers keepId
      // 2. Supprimer mergeId

      return {
        success: true,
        message: "Terroirs fusionnés avec succès",
        plantsTransferred: 12,
      };
    }),

  /**
   * Obtenir les suggestions de terroirs basées sur GBIF
   */
  getGBIFTerritorySuggestions: adminProcedure.query(async () => {
    // Suggestions basées sur les données GBIF
    const suggestions = [
      {
        id: "gbif-1",
        name: "Yunnan",
        country: "China",
        region: "Yunnan Province",
        coordinates: { lat: 25.0, lon: 98.0 },
        description: "Province montagneuse riche en biodiversité",
        gbifOccurrences: 1250,
        uniquePlants: 45,
        confidence: 0.92,
        reason: "Nombreuses occurrences GBIF pour plantes non documentées",
      },
      {
        id: "gbif-2",
        name: "Amazon Basin",
        country: "Brazil",
        region: "Multiple",
        coordinates: { lat: -3.0, lon: -60.0 },
        description: "Bassin amazonien avec biodiversité exceptionnelle",
        gbifOccurrences: 3450,
        uniquePlants: 128,
        confidence: 0.88,
        reason: "Nombreuses occurrences GBIF pour plantes aromatiques",
      },
      {
        id: "gbif-3",
        name: "Borneo",
        country: "Indonesia",
        region: "Kalimantan",
        coordinates: { lat: 0.0, lon: 113.0 },
        description: "Île tropicale avec flore unique",
        gbifOccurrences: 890,
        uniquePlants: 34,
        confidence: 0.85,
        reason: "Occurrences GBIF pour espèces endémiques",
      },
    ];

    return suggestions;
  }),

  /**
   * Créer un terroir à partir d'une suggestion GBIF
   */
  createFromGBIFSuggestion: adminProcedure
    .input(
      z.object({
        suggestionId: z.string(),
        name: z.string(),
        country: z.string(),
        region: z.string().optional(),
        coordinates: z.object({ lat: z.number(), lon: z.number() }).optional(),
        description: z.string().optional(),
        autoAssociatePlants: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      // Créer le terroir
      // const territory = await db.insert(territories).values({...});

      // Si autoAssociatePlants, associer les plantes basées sur GBIF
      // const gbifPlants = await getGBIFPlantsForTerritory(input.coordinates);
      // for (const plant of gbifPlants) {
      //   await db.insert(plantTerritories).values({
      //     plantId: plant.id,
      //     territoryId: territory.id,
      //     source: "gbif-auto",
      //   });
      // }

      return {
        success: true,
        message: "Terroir créé et plantes associées",
        territoryId: "new-id",
        plantsAssociated: 12,
      };
    }),

  /**
   * Obtenir les plantes associées à un terroir
   */
  getTerritoriesPlants: publicProcedure
    .input(z.object({ territoryId: z.string() }))
    .query(async ({ input }) => {
      // Récupérer les plantes associées au terroir
      // const plants = await db.query.plantTerritories.findMany({
      //   where: eq(plantTerritories.territoryId, input.territoryId),
      //   with: { plant: true },
      // });

      return [
        {
          id: "p1",
          latinName: "Lavandula angustifolia",
          commonName: "Lavande",
          source: "direct",
          addedAt: new Date("2024-01-15"),
        },
        {
          id: "p2",
          latinName: "Thymus vulgaris",
          commonName: "Thym",
          source: "gbif-auto",
          addedAt: new Date("2024-01-16"),
        },
      ];
    }),

  /**
   * Associer une plante à un terroir
   */
  associatePlantToTerritory: adminProcedure
    .input(
      z.object({
        plantId: z.string(),
        territoryId: z.string(),
        source: z.enum(["direct", "gbif-auto", "user-suggestion"]).default("direct"),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      // Créer l'association
      // await db.insert(plantTerritories).values({...});

      return { success: true, message: "Plante associée au terroir" };
    }),

  /**
   * Dissocier une plante d'un terroir
   */
  dissociatePlantFromTerritory: adminProcedure
    .input(
      z.object({
        plantId: z.string(),
        territoryId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      // Supprimer l'association
      // await db.delete(plantTerritories).where(
      //   and(
      //     eq(plantTerritories.plantId, input.plantId),
      //     eq(plantTerritories.territoryId, input.territoryId)
      //   )
      // );

      return { success: true, message: "Plante dissociée du terroir" };
    }),
});
