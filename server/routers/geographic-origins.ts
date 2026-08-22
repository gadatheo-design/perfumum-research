import { z } from "zod";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const geographicOriginsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllGeographicOrigins();
  }),
  listWithMoleculeCount: publicProcedure.query(async () => {
    return await db.getAllGeographicOriginsWithMoleculeCount();
  }),
  getMoleculesWithDetails: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getOriginMoleculesWithDetails(input);
    }),
  searchByMolecule: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.searchOriginsByMoleculeName(input);
    }),
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getGeographicOriginById(input);
    }),
  getByCountry: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.getGeographicOriginsByCountry(input);
    }),
  getMolecules: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getOriginMolecules(input);
    }),
  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      country: z.string().min(1),
      region: z.string().optional(),
      terroir: z.string().optional(),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      altitude: z.number().optional(),
      climate: z.string().optional(),
      soilType: z.string().optional(),
      harvestPeriod: z.string().optional(),
      productionMethod: z.string().optional(),
      qualityIndicators: z.string().optional(),
      historicalContext: z.string().optional(),
      economicImportance: z.string().optional(),
      sustainabilityNotes: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.createGeographicOrigin(input);
    }),
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        name: z.string().optional(),
        country: z.string().optional(),
        region: z.string().optional(),
        terroir: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        altitude: z.number().optional(),
        climate: z.string().optional(),
        soilType: z.string().optional(),
        harvestPeriod: z.string().optional(),
        productionMethod: z.string().optional(),
        qualityIndicators: z.string().optional(),
        historicalContext: z.string().optional(),
        economicImportance: z.string().optional(),
        sustainabilityNotes: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      return await db.updateGeographicOrigin(input.id, input.data);
    }),
  delete: adminProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.deleteGeographicOrigin(input);
      return { success: true };
    }),
  // Géocodage automatique d'un terroir
  geocode: adminProcedure
    .input(z.object({
      id: z.number(),
      address: z.string().optional(), // Si non fourni, utilise name + country + region
    }))
    .mutation(async ({ input }) => {
      const origin = await db.getGeographicOriginById(input.id);
      if (!origin) {
        throw new Error('Origine non trouvée');
      }
      
      // Construire l'adresse de recherche
      const searchAddress = input.address || 
        [origin.region, origin.country].filter(Boolean).join(', ') ||
        origin.name;
      
      // Appeler l'API Google Geocoding via le proxy Manus
      const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
      const FORGE_BASE_URL = process.env.BUILT_IN_FORGE_API_URL || 'https://forge.butterfly-effect.dev';
      
      const geocodeUrl = `${FORGE_BASE_URL}/v1/maps/proxy/maps/api/geocode/json?address=${encodeURIComponent(searchAddress)}&key=${FORGE_API_KEY}`;
      
      const response = await fetch(geocodeUrl);
      const data = (await response.json()) as { status?: string; results?: Array<{geometry: {location: {lat: number; lng: number}}; formatted_address?: string}>};
      
      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        throw new Error(`Géocodage échoué: ${data.status || 'Aucun résultat'}`);
      }
      
      const result = data.results[0];
      const { lat, lng } = result.geometry.location;
      
      // Mettre à jour les coordonnées dans la base de données
      await db.updateGeographicOrigin(input.id, {
        latitude: lat.toString(),
        longitude: lng.toString(),
      });
      
      return {
        success: true,
        latitude: lat,
        longitude: lng,
        formattedAddress: result.formatted_address || '',
      };
    }),
  // Géocodage en masse de tous les terroirs sans coordonnées
  geocodeBatch: protectedProcedure
    .mutation(async () => {
      const origins = await db.getAllGeographicOrigins();
      const originsWithoutCoords = origins.filter((o: Record<string, unknown>) => !o.latitude || !o.longitude);
      
      const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
      const FORGE_BASE_URL = process.env.BUILT_IN_FORGE_API_URL || 'https://forge.butterfly-effect.dev';
      
      const results: { id: number; name: string; success: boolean; error?: string; latitude?: number; longitude?: number }[] = [];
      
      for (const origin of originsWithoutCoords) {
        try {
          const searchAddress = [origin.region, origin.country].filter(Boolean).join(', ') || origin.name;
          const geocodeUrl = `${FORGE_BASE_URL}/v1/maps/proxy/maps/api/geocode/json?address=${encodeURIComponent(searchAddress)}&key=${FORGE_API_KEY}`;
          
          const response = await fetch(geocodeUrl);
          const data = (await response.json()) as { status?: string; results?: Array<{geometry: {location: {lat: number; lng: number}; formatted_address?: string}}> };
          
          if (data.status === 'OK' && data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            await db.updateGeographicOrigin(origin.id, {
              latitude: lat.toString(),
              longitude: lng.toString(),
            });
            results.push({ id: origin.id, name: origin.name, success: true, latitude: lat, longitude: lng });
          } else {
            results.push({ id: origin.id, name: origin.name, success: false, error: data.status || 'Aucun résultat' });
          }
          
          // Pause pour éviter le rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error: unknown) {
          results.push({ id: origin.id, name: origin.name, success: false, error: (error as Error).message });
        }
      }
      
      return {
        total: originsWithoutCoords.length,
        success: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results,
      };
    }),
});
