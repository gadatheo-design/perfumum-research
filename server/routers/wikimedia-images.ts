/**
 * Router tRPC pour l'enrichissement d'images de plantes via Wikimedia Commons
 * Feature 4.7 — Images botaniques automatiques (v2 — batchs 1000)
 */
import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { sql, eq } from "drizzle-orm";
import { plants } from "../../drizzle/schema";

// Délai entre requêtes Wikimedia (ms) — respecte les rate-limits
const INTER_REQUEST_DELAY = 250;

async function fetchWikimediaImage(latinName: string): Promise<string | null> {
  const searchQuery = encodeURIComponent(latinName);

  // Essai 1: Wikipedia pageimages (le plus fiable pour les plantes)
  try {
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${searchQuery}&prop=pageimages&pithumbsize=500&format=json&origin=*`;
    const wikiResp = await fetch(wikiUrl, {
      headers: { "User-Agent": "PERFUMUM-Research/2.0 (research project)" },
      signal: AbortSignal.timeout(8000),
    });
    if (wikiResp.ok) {
      const wikiData = await wikiResp.json() as Record<string, unknown>;
      const query = wikiData?.query as Record<string, unknown> | undefined;
      const wikiPages = query?.pages as Record<string, unknown> | undefined;
      if (wikiPages) {
        const firstPage = Object.values(wikiPages)[0] as Record<string, unknown>;
        const thumbnail = firstPage?.thumbnail as Record<string, unknown> | undefined;
        const src = thumbnail?.source as string | undefined;
        if (src) return src;
      }
    }
  } catch (_) { /* continue to fallback */ }

  // Essai 2: Wikimedia Commons search
  try {
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${searchQuery}&gsrlimit=3&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json&origin=*`;
    const commonsResp = await fetch(commonsUrl, {
      headers: { "User-Agent": "PERFUMUM-Research/2.0 (research project)" },
      signal: AbortSignal.timeout(8000),
    });
    if (commonsResp.ok) {
      const commonsData = await commonsResp.json() as Record<string, unknown>;
      const cQuery = commonsData?.query as Record<string, unknown> | undefined;
      const pages = cQuery?.pages as Record<string, unknown> | undefined;
      if (pages) {
        const firstPage = Object.values(pages)[0] as Record<string, unknown>;
        const imageinfo = firstPage?.imageinfo as Array<Record<string, unknown>> | undefined;
        const url = (imageinfo?.[0]?.thumburl || imageinfo?.[0]?.url) as string | undefined;
        if (url) return url;
      }
    }
  } catch (_) { /* no image found */ }

  return null;
}

export const wikimediaImagesRouter = router({
  // Statistiques plantes avec/sans image
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, withImage: 0, withoutImage: 0, withLatinName: 0 };
    const [result] = await db.execute(sql`
      SELECT COUNT(*) as total,
        SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) as with_image,
        SUM(CASE WHEN (image_url IS NULL OR image_url = '') THEN 1 ELSE 0 END) as without_image,
        SUM(CASE WHEN latin_name IS NOT NULL AND latin_name != '' AND (image_url IS NULL OR image_url = '') THEN 1 ELSE 0 END) as latin_no_image
      FROM plants
    `) as unknown as [any[]];
    const row = (result as unknown[])[0] as Record<string, unknown>;
    return {
      total: Number(row?.total || 0),
      withImage: Number(row?.with_image || 0),
      withoutImage: Number(row?.without_image || 0),
      withLatinName: Number(row?.latin_no_image || 0),
    };
  }),

  // Liste des plantes sans image (pour preview)
  getPlantsWithoutImage: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { plants: [], total: 0 };
      const rows = await db
        .select({ id: plants.id, name: plants.name, latinName: sql<string>`COALESCE(${plants.latinName}, '')`, category: plants.category })
        .from(plants)
        .where(sql`(image_url IS NULL OR image_url = '') AND latin_name IS NOT NULL AND latin_name != ''`)
        .limit(input.limit)
        .offset(input.offset);
      const [countResult] = await db.execute(sql`
        SELECT COUNT(*) as cnt FROM plants
        WHERE (image_url IS NULL OR image_url = '') AND latin_name IS NOT NULL AND latin_name != ''
      `) as unknown as [any[]];
      const countRow = (countResult as unknown[])[0] as Record<string, unknown>;
      return { plants: rows, total: Number(countRow?.cnt || 0) };
    }),

  /**
   * Enrichir un micro-batch de plantes (max 50 par appel).
   * Le frontend appelle cette mutation en boucle pour traiter jusqu'à 1000 plantes.
   * Chaque appel retourne les résultats + nextStartIndex pour la pagination.
   */
  enrichImagesBatch: publicProcedure
    .input(z.object({
      batchSize: z.number().min(1).max(50).default(20),
      startIndex: z.number().min(0).default(0),
      dryRun: z.boolean().default(true),
      totalTarget: z.number().min(1).max(1000).default(100),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Récupérer les plantes à enrichir pour ce micro-batch
      const toEnrich = await db
        .select({ id: plants.id, name: plants.name, latinName: sql<string>`COALESCE(${plants.latinName}, '')` })
        .from(plants)
        .where(sql`(image_url IS NULL OR image_url = '') AND latin_name IS NOT NULL AND latin_name != ''`)
        .limit(input.batchSize)
        .offset(input.startIndex);

      // Compter le total disponible
      const [totalResult] = await db.execute(sql`
        SELECT COUNT(*) as cnt FROM plants
        WHERE (image_url IS NULL OR image_url = '') AND latin_name IS NOT NULL AND latin_name != ''
      `) as unknown as [any[]];
      const totalRow = (totalResult as unknown[])[0] as Record<string, unknown>;
      const totalAvailable = Number(totalRow?.cnt || 0);

      const results: Array<{
        plantId: number;
        plantName: string;
        latinName: string | null;
        status: "success" | "not_found" | "error" | "skipped";
        message: string;
        imageUrl?: string;
      }> = [];

      let successCount = 0, notFoundCount = 0, errorCount = 0;

      for (const plant of toEnrich) {
        if (!plant.latinName) {
          results.push({ plantId: plant.id, plantName: plant.name, latinName: "", status: "skipped", message: "Pas de nom latin" });
          continue;
        }
        try {
          const imageUrl = await fetchWikimediaImage(plant.latinName);

          if (imageUrl) {
            if (!input.dryRun) {
              await db.update(plants).set({ imageUrl }).where(eq(plants.id, plant.id));
            }
            results.push({ plantId: plant.id, plantName: plant.name, latinName: plant.latinName, status: "success", message: "Image trouvée", imageUrl });
            successCount++;
          } else {
            results.push({ plantId: plant.id, plantName: plant.name, latinName: plant.latinName, status: "not_found", message: "Aucune image trouvée" });
            notFoundCount++;
          }
          await new Promise(resolve => setTimeout(resolve, INTER_REQUEST_DELAY));
        } catch (err) {
          results.push({
            plantId: plant.id, plantName: plant.name, latinName: plant.latinName || "",
            status: "error", message: err instanceof Error ? err.message : String(err)
          });
          errorCount++;
        }
      }

      const nextStartIndex = input.startIndex + toEnrich.length;
      const processedSoFar = nextStartIndex; // cumul depuis le début de la session
      const hasMore = toEnrich.length > 0 && nextStartIndex < Math.min(totalAvailable, input.totalTarget);

      return {
        processed: toEnrich.length,
        success: successCount,
        notFound: notFoundCount,
        errors: errorCount,
        nextStartIndex,
        hasMore,
        totalAvailable,
        totalTarget: input.totalTarget,
        dryRun: input.dryRun,
        results,
      };
    }),

  // Mise à jour manuelle de l'image d'une plante
  updatePlantImage: publicProcedure
    .input(z.object({ plantId: z.number(), imageUrl: z.string().url() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      await db.update(plants).set({ imageUrl: input.imageUrl }).where(eq(plants.id, input.plantId));
      return { success: true };
    }),
});
