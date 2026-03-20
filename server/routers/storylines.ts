import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Helper : récupère la connexion DB ou lance une erreur tRPC
async function requireDb() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Base de données non disponible' });
  return db;
}

export const storylinesRouter = router({
  // Lister tous les fils narratifs
  list: publicProcedure
    .input(z.object({
      status: z.enum(['draft', 'active', 'archived', 'all']).default('all'),
      axis: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const statusFilter = input.status !== 'all'
        ? sql`AND status = ${input.status}`
        : sql``;
      const axisFilter = input.axis
        ? sql`AND narrative_axis = ${input.axis}`
        : sql``;
      const [rows] = await db.execute(sql`
        SELECT s.*,
          (SELECT COUNT(*) FROM story_elements se WHERE se.storyline_id = s.id) as element_count
        FROM storylines s
        WHERE 1=1 ${statusFilter} ${axisFilter}
        ORDER BY s.status DESC, s.created_at DESC
        LIMIT ${input.limit} OFFSET ${input.offset}
      `) as unknown as [any[]];
      const [totalRow] = await db.execute(sql`
        SELECT COUNT(*) as n FROM storylines WHERE 1=1 ${statusFilter} ${axisFilter}
      `);
      return {
        storylines: rows as unknown[],
        total: (totalRow as unknown as Record<string, unknown>)?.n ?? 0,
      };
    }),

  // Récupérer un fil narratif par slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const [rows] = await db.execute(sql`
        SELECT * FROM storylines WHERE slug = ${input.slug}
      `) as unknown as [any[]];
      const storyline = (rows as unknown[])[0] as Record<string, unknown> | undefined;
      if (!storyline) return null;
      const [elements] = await db.execute(sql`
        SELECT se.*,
          CASE se.entity_type
            WHEN 'plant' THEN (SELECT name FROM plants WHERE id = se.entity_id)
            WHEN 'molecule' THEN (SELECT name FROM molecules WHERE id = se.entity_id)
            WHEN 'recipe' THEN (SELECT name FROM recettes WHERE id = se.entity_id)
            WHEN 'reference' THEN (SELECT title FROM bibliography_entries WHERE id = se.entity_id)
            ELSE NULL
          END as entity_name,
          CASE se.entity_type
            WHEN 'plant' THEN (SELECT latin_name FROM plants WHERE id = se.entity_id)
            ELSE NULL
          END as entity_latin_name
        FROM story_elements se WHERE se.storyline_id = ${storyline.id}
        ORDER BY se.sequence_order ASC, se.id ASC
      `) as unknown as [any[]];
      return { ...storyline, elements: elements as unknown[] };
    }),

  // Récupérer les fils narratifs liés à une plante
  getByPlant: publicProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const [rows] = await db.execute(sql`
        SELECT s.*, se.role_in_story, se.narrative_note
        FROM storylines s
        JOIN story_elements se ON se.storyline_id = s.id
        WHERE se.entity_type = 'plant' AND se.entity_id = ${input.plantId}
        AND s.status = 'active'
        ORDER BY s.created_at DESC
      `) as unknown as [any[]];
      return rows as unknown[];
    }),

  // Récupérer les fils narratifs liés à une molécule
  getByMolecule: publicProcedure
    .input(z.object({ moleculeId: z.number() }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const [rows] = await db.execute(sql`
        SELECT s.*, se.role_in_story, se.narrative_note
        FROM storylines s
        JOIN story_elements se ON se.storyline_id = s.id
        WHERE se.entity_type = 'molecule' AND se.entity_id = ${input.moleculeId}
        AND s.status = 'active'
        ORDER BY s.created_at DESC
      `) as unknown as [any[]];
      return rows as unknown[];
    }),

  // Créer un fil narratif (protégé)
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(3).max(255),
      slug: z.string().min(3).max(255).regex(/^[a-z0-9-]+$/),
      subtitle: z.string().optional(),
      description: z.string().optional(),
      narrative_axis: z.string().default('autre'),
      period_label: z.string().optional(),
      period_start_year: z.number().optional(),
      period_end_year: z.number().optional(),
      geographic_scope: z.string().optional(),
      status: z.enum(['draft', 'active', 'archived']).default('draft'),
    }))
    .mutation(async ({ input }) => {
      const db = await requireDb();
      const now = Date.now();
      const [result] = await db.execute(sql`
        INSERT INTO storylines (title, slug, subtitle, description, narrative_axis, period_label, period_start_year, period_end_year, geographic_scope, status, created_at, updated_at)
        VALUES (${input.title}, ${input.slug}, ${input.subtitle ?? null}, ${input.description ?? null},
                ${input.narrative_axis}, ${input.period_label ?? null}, ${input.period_start_year ?? null},
                ${input.period_end_year ?? null}, ${input.geographic_scope ?? null}, ${input.status}, ${now}, ${now})
      `) as unknown as [any[]];
      return { id: (result as unknown as { insertId: number }).insertId };
    }),

  // Mettre à jour un fil narratif (protégé)
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(3).max(255).optional(),
      subtitle: z.string().optional(),
      description: z.string().optional(),
      narrative_axis: z.string().optional(),
      period_label: z.string().optional(),
      period_start_year: z.number().optional(),
      period_end_year: z.number().optional(),
      geographic_scope: z.string().optional(),
      status: z.enum(['draft', 'active', 'archived']).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await requireDb();
      const { id, ...fields } = input;
      const defined = Object.entries(fields).filter(([, v]) => v !== undefined);
      if (!defined.length) return { success: false };
      // Construire la requête UPDATE dynamiquement
      const setClauses = defined.map(([k, v]) => sql`${sql.raw(k)} = ${v}`);
      // Drizzle ne supporte pas join sur sql fragments directement, on utilise sql.raw pour les SET
      const setStr = defined.map(([k]) => `${k} = ?`).join(', ');
      const vals = defined.map(([, v]) => v);
      // Drizzle sql.raw ne supporte qu'un argument — construire la requête complète avec les valeurs
      const allVals = [...vals, Date.now(), id];
      const placeholders = allVals.map(() => '').join(''); // unused, just for clarity
      await db.execute(sql.raw(
        `UPDATE storylines SET ${setStr}, updated_at = ${Date.now()} WHERE id = ${id}`
      ));
      return { success: true };
    }),

  // Ajouter un élément à un fil narratif (protégé)
  addElement: protectedProcedure
    .input(z.object({
      storyline_id: z.number(),
      entity_type: z.enum(['plant', 'molecule', 'recipe', 'raw_material', 'terroir', 'reference', 'experience']),
      entity_id: z.number(),
      role_in_story: z.enum(['protagonist', 'context', 'transformation', 'symbol', 'source', 'destination', 'contrast']).default('context'),
      narrative_note: z.string().optional(),
      sequence_order: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = await requireDb();
      const [result] = await db.execute(sql`
        INSERT INTO story_elements (storyline_id, entity_type, entity_id, role_in_story, narrative_note, sequence_order, created_at)
        VALUES (${input.storyline_id}, ${input.entity_type}, ${input.entity_id},
                ${input.role_in_story}, ${input.narrative_note ?? null}, ${input.sequence_order}, ${Date.now()})
      `) as unknown as [any[]];
      return { id: (result as unknown as { insertId: number }).insertId };
    }),

  // Supprimer un élément d'un fil narratif (protégé)
  removeElement: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await requireDb();
      await db.execute(sql`DELETE FROM story_elements WHERE id = ${input.id}`);
      return { success: true };
    }),

  // Supprimer un fil narratif (protégé)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await requireDb();
      await db.execute(sql`DELETE FROM storylines WHERE id = ${input.id}`);
      return { success: true };
    }),

  // ── Intégration Europeana ──────────────────────────────────────────────────

  // Rechercher des images Europeana pour un élément narratif
  searchEuropeanaForElement: publicProcedure
    .input(z.object({
      elementId: z.number(),
      query: z.string().optional(), // override du terme de recherche
      limit: z.number().min(1).max(20).default(6),
    }))
    .query(async ({ input }) => {
      const db = await requireDb();
      // Récupérer l'élément et son entité associée
      const [rows] = await db.execute(sql`
        SELECT se.*,
          CASE se.entity_type
            WHEN 'plant' THEN (SELECT CONCAT(COALESCE(p.latin_name, p.name), '|', COALESCE(p.wikidata_qid, '')) FROM plants p WHERE p.id = se.entity_id)
            WHEN 'molecule' THEN (SELECT CONCAT(m.name, '|', COALESCE(m.wikidata_qid, '')) FROM molecules m WHERE m.id = se.entity_id)
            WHEN 'recipe' THEN (SELECT CONCAT(r.name, '|') FROM recettes r WHERE r.id = se.entity_id)
            ELSE NULL
          END as entity_info
        FROM story_elements se WHERE se.id = ${input.elementId}
      `) as unknown as [any[]];
      const element = (rows as any[])[0];
      if (!element) return { items: [], total: 0, query: '', apiAvailable: false };

      const apiKey = process.env.EUROPEANA_API_KEY;
      if (!apiKey) {
        return { items: [], total: 0, query: '', apiAvailable: false, error: 'EUROPEANA_API_KEY non configurée' };
      }

      // Construire le terme de recherche
      let searchQuery = input.query || '';
      if (!searchQuery && element.entity_info) {
        const [entityName] = element.entity_info.split('|');
        searchQuery = entityName || element.skos_concept || '';
      }
      if (!searchQuery) return { items: [], total: 0, query: '', apiAvailable: true };

      try {
        const url = new URL('https://api.europeana.eu/record/v2/search.json');
        url.searchParams.set('wskey', apiKey);
        url.searchParams.set('query', searchQuery);
        url.searchParams.set('qf', 'TYPE:IMAGE');
        url.searchParams.set('qf', 'REUSABILITY:open');
        url.searchParams.set('rows', String(input.limit));
        url.searchParams.set('profile', 'rich');
        url.searchParams.set('fl', 'id,title,edmPreview,dataProvider,year,country,rights');

        const resp = await fetch(url.toString(), {
          headers: { 'User-Agent': 'PERFUMUM-Research/1.0', Accept: 'application/json' },
          signal: AbortSignal.timeout(10000),
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json() as any;
        const items = (data.items || []).map((item: any) => ({
          id: item.id,
          title: Array.isArray(item.title) ? item.title[0] : item.title,
          thumbnailUrl: Array.isArray(item.edmPreview) ? item.edmPreview[0] : item.edmPreview,
          dataProvider: Array.isArray(item.dataProvider) ? item.dataProvider[0] : item.dataProvider,
          year: Array.isArray(item.year) ? item.year[0] : item.year,
          country: Array.isArray(item.country) ? item.country[0] : item.country,
          europeanaUrl: `https://www.europeana.eu/item${item.id}`,
        }));
        return { items, total: data.totalResults || 0, query: searchQuery, apiAvailable: true };
      } catch (e) {
        return { items: [], total: 0, query: searchQuery, apiAvailable: true, error: String(e) };
      }
    }),

  // Sauvegarder l'image Europeana sélectionnée pour un élément narratif
  saveElementImage: protectedProcedure
    .input(z.object({
      elementId: z.number(),
      imageUrl: z.string().url(),
      europeanaId: z.string().optional(),
      imageCaption: z.string().optional(),
      imageSource: z.string().default('europeana'),
    }))
    .mutation(async ({ input }) => {
      const db = await requireDb();
      await db.execute(sql`
        UPDATE story_elements
        SET image_url = ${input.imageUrl},
            europeana_id = ${input.europeanaId ?? null},
            image_caption = ${input.imageCaption ?? null},
            image_source = ${input.imageSource}
        WHERE id = ${input.elementId}
      `);
      return { success: true };
    }),

  // Récupérer tous les éléments avec images pour un storyline
  getElementsWithImages: publicProcedure
    .input(z.object({ storylineSlug: z.string() }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const [rows] = await db.execute(sql`
        SELECT se.id, se.image_url, se.europeana_id, se.image_caption, se.image_source,
          se.entity_type, se.entity_id, se.narrative_axis, se.odeuropa_level,
          CASE se.entity_type
            WHEN 'plant' THEN (SELECT name FROM plants WHERE id = se.entity_id)
            WHEN 'molecule' THEN (SELECT name FROM molecules WHERE id = se.entity_id)
            WHEN 'recipe' THEN (SELECT name FROM recettes WHERE id = se.entity_id)
            ELSE NULL
          END as entity_name
        FROM story_elements se
        JOIN storylines s ON s.id = se.storyline_id
        WHERE s.slug = ${input.storylineSlug}
          AND se.image_url IS NOT NULL
        ORDER BY se.sequence_order ASC
      `) as unknown as [any[]];
      return rows as unknown[];
    }),

  // Mettre à jour les coordonnées GPS d'un storyline (protegé)
  updateCoordinates: protectedProcedure
    .input(z.object({
      id: z.number(),
      lat: z.number().min(-90).max(90).nullable(),
      lng: z.number().min(-180).max(180).nullable(),
    }))
    .mutation(async ({ input }) => {
      const db = await requireDb();
      await db.execute(sql`
        UPDATE storylines
        SET lat = ${input.lat},
            lng = ${input.lng},
            updated_at = ${Date.now()}
        WHERE id = ${input.id}
      `);
      return { success: true, id: input.id, lat: input.lat, lng: input.lng };
    }),

  // Stats globales
  getStats: publicProcedure.query(async () => {
    const db = await requireDb();
    const [total] = await db.execute(sql`SELECT COUNT(*) as n FROM storylines`);
    const [active] = await db.execute(sql`SELECT COUNT(*) as n FROM storylines WHERE status = 'active'`);
    const [elements] = await db.execute(sql`SELECT COUNT(*) as n FROM story_elements`);
    const [byAxis] = await db.execute(sql`
      SELECT narrative_axis, COUNT(*) as count FROM storylines GROUP BY narrative_axis ORDER BY count DESC
    `) as unknown as [any[]];
    return {
      total: (total as unknown as Record<string, unknown>)?.n ?? 0,
      active: (active as unknown as Record<string, unknown>)?.n ?? 0,
      elements: (elements as unknown as Record<string, unknown>)?.n ?? 0,
      byAxis: byAxis as unknown as Array<{ narrative_axis: string; count: number }>,
    };
  }),
});
