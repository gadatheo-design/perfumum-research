import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const genomicLinksRouter = router({
  // Molecule links
  moleculeLinks: router({
    list: publicProcedure.query(async () => {
      return db.getAllGenomicMoleculeLinks();
    }),
    getForMolecule: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getGenomicLinksForMolecule(input);
      }),
    getByAxis: publicProcedure
      .input(z.enum(['G1', 'G2', 'G3']))
      .query(async ({ input }) => {
        return db.getGenomicMoleculeLinksByAxis(input);
      }),
    getForReference: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getGenomicMoleculeLinksForReference(input);
      }),
    create: protectedProcedure
      .input(z.object({
        referenceId: z.number(),
        moleculeId: z.number(),
        genomicAxis: z.enum(['G1', 'G2', 'G3']),
        linkType: z.enum(['biosynthesis', 'characterization', 'quantification', 'pathway', 'gene_association', 'regulation', 'evolution', 'application', 'other']).optional(),
        relevanceScore: z.number().min(0).max(100).optional(),
        confidence: z.enum(['high', 'medium', 'low']).optional(),
        geneNames: z.array(z.string()).optional(),
        pathwayName: z.string().optional(),
        enzymeNames: z.array(z.string()).optional(),
        notes: z.string().optional(),
        excerpt: z.string().optional(),
        pageNumbers: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createGenomicMoleculeLink({
          ...input,
          createdBy: ctx.user?.id,
        });
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteGenomicMoleculeLink(input);
      }),
  }),
  // Plant links
  plantLinks: router({
    list: publicProcedure.query(async () => {
      return db.getAllGenomicPlantLinks();
    }),
    getForPlant: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getGenomicLinksForPlant(input);
      }),
    getByAxis: publicProcedure
      .input(z.enum(['G1', 'G2', 'G3']))
      .query(async ({ input }) => {
        return db.getGenomicPlantLinksByAxis(input);
      }),
    getForReference: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getGenomicPlantLinksForReference(input);
      }),
    create: protectedProcedure
      .input(z.object({
        referenceId: z.number(),
        plantId: z.number(),
        genomicAxis: z.enum(['G1', 'G2', 'G3']),
        linkType: z.enum(['genome_sequencing', 'transcriptomics', 'metabolomics', 'phylogenetics', 'breeding', 'gene_editing', 'marker_development', 'comparative', 'other']).optional(),
        relevanceScore: z.number().min(0).max(100).optional(),
        confidence: z.enum(['high', 'medium', 'low']).optional(),
        genomeVersion: z.string().optional(),
        assemblyAccession: z.string().optional(),
        sequencingMethod: z.string().optional(),
        notes: z.string().optional(),
        excerpt: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createGenomicPlantLink({
          ...input,
          createdBy: ctx.user?.id,
        });
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteGenomicPlantLink(input);
      }),
  }),
  // Stats
  getStats: publicProcedure.query(async () => {
    return db.getGenomicLinksStats();
  }),
  // Bulk create molecule links
  bulkCreateMoleculeLinks: protectedProcedure
    .input(z.object({
      links: z.array(z.object({
        referenceId: z.number(),
        moleculeId: z.number(),
        genomicAxis: z.enum(['G1', 'G2', 'G3']),
        linkType: z.string().optional(),
        relevanceScore: z.number().min(0).max(100).optional(),
        confidence: z.enum(['high', 'medium', 'low']).optional(),
        notes: z.string().optional(),
      })),
    }))
    .mutation(async ({ input, ctx }) => {
      return db.bulkCreateGenomicMoleculeLinks(input.links, ctx.user?.id);
    }),
  // Bulk create plant links
  bulkCreatePlantLinks: protectedProcedure
    .input(z.object({
      links: z.array(z.object({
        referenceId: z.number(),
        plantId: z.number(),
        genomicAxis: z.enum(['G1', 'G2', 'G3']),
        linkType: z.string().optional(),
        relevanceScore: z.number().min(0).max(100).optional(),
        confidence: z.enum(['high', 'medium', 'low']).optional(),
        notes: z.string().optional(),
      })),
    }))
    .mutation(async ({ input, ctx }) => {
      return db.bulkCreateGenomicPlantLinks(input.links, ctx.user?.id);
    }),
})

