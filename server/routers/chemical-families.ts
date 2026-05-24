// @ts-nocheck
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const chemicalFamiliesRouter = router({
  // Liste toutes les familles chimiques de la table dédiée
  listAll: publicProcedure.query(async () => {
    return await db.getAllChemicalFamilies();
  }),
  // Liste avec comptage des molécules liées
  listWithCount: publicProcedure.query(async () => {
    return await db.getChemicalFamiliesWithMoleculeCount();
  }),
  // Récupérer une famille par ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.getChemicalFamilyById(input.id);
    }),
  // Récupérer une famille par type
  getByType: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(async ({ input }) => {
      return await db.getChemicalFamilyByType(input.type);
    }),
  // Récupérer les molécules d'une famille (via table de liaison)
  getMoleculesById: publicProcedure
    .input(z.object({ familyId: z.number() }))
    .query(async ({ input }) => {
      return await db.getMoleculesByChemicalFamilyId(input.familyId);
    }),
  // Récupérer les familles chimiques d'une molécule
  getForMolecule: publicProcedure
    .input(z.object({ moleculeId: z.number() }))
    .query(async ({ input }) => {
      return await db.getChemicalFamiliesForMolecule(input.moleculeId);
    }),
  // Lier une molécule à une famille
  linkMolecule: protectedProcedure
    .input(z.object({ moleculeId: z.number(), chemicalFamilyId: z.number() }))
    .mutation(async ({ input }) => {
      return await db.linkMoleculeToChemicalFamily(input.moleculeId, input.chemicalFamilyId);
    }),
  // Supprimer la liaison molécule-famille
  unlinkMolecule: protectedProcedure
    .input(z.object({ moleculeId: z.number(), chemicalFamilyId: z.number() }))
    .mutation(async ({ input }) => {
      return await db.unlinkMoleculeFromChemicalFamily(input.moleculeId, input.chemicalFamilyId);
    }),
  // Créer une nouvelle famille chimique
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      type: z.string(),
      subcategory: z.string().optional(),
      description: z.string().optional(),
      olfactiveRole: z.string().optional(),
      volatility: z.string().optional(),
      polarity: z.string().optional(),
      molecularWeightRange: z.string().optional(),
      typicalNotes: z.string().optional(),
      exampleMolecules: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.createChemicalFamily(input);
    }),
  // Mettre à jour une famille chimique
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      type: z.string().optional(),
      subcategory: z.string().optional(),
      description: z.string().optional(),
      olfactiveRole: z.string().optional(),
      volatility: z.string().optional(),
      polarity: z.string().optional(),
      molecularWeightRange: z.string().optional(),
      typicalNotes: z.string().optional(),
      exampleMolecules: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateChemicalFamily(id, data);
    }),
  // Supprimer une famille chimique
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.deleteChemicalFamily(input.id);
    }),
  // Anciennes fonctions pour compatibilité
  list: publicProcedure.query(async () => {
    return await db.getChemicalFamilies();
  }),
  getMolecules: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "string") throw new Error("Expected string");
      return val;
    })
    .query(async ({ input }) => {
      return await db.getMoleculesByFamily(input);
    }),
  // Récupérer toutes les liaisons molécule-famille chimique (pour graphe)
  getAllLinks: publicProcedure.query(async () => {
    return await db.getAllMoleculeChemicalFamilyLinks();
  }),
  // Export CSV des liaisons
  exportCSV: publicProcedure.query(async () => {
    return await db.exportMoleculeChemicalFamilyLinksCSV();
  }),
  // Export JSON des liaisons
  exportJSON: publicProcedure.query(async () => {
    return await db.exportMoleculeChemicalFamilyLinksJSON();
  }),
})

