import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db/core";

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
      const db = await getDb();
      let where = '1=1';
      const params: unknown[] = [];
      if (input.status !== 'all') {
        where += ' AND status = ?';
        params.push(input.status);
      }
      if (input.axis) {
        where += ' AND narrative_axis = ?';
        params.push(input.axis);
      }
      const [rows] = await db.execute(
        `SELECT s.*, 
          (SELECT COUNT(*) FROM story_elements se WHERE se.storyline_id = s.id) as element_count
         FROM storylines s WHERE ${where} ORDER BY s.status DESC, s.created_at DESC
         LIMIT ${input.limit} OFFSET ${input.offset}`,
        params
      );
      const [total] = await db.execute(
        `SELECT COUNT(*) as n FROM storylines WHERE ${where}`,
        params
      );
      return { storylines: rows as any[], total: (total as any[])[0].n };
    }),

  // Récupérer un fil narratif par slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [rows] = await db.execute(
        'SELECT * FROM storylines WHERE slug = ?',
        [input.slug]
      );
      const storyline = (rows as any[])[0];
      if (!storyline) return null;
      // Récupérer les éléments avec leurs entités
      const [elements] = await db.execute(
        `SELECT se.*,
          CASE se.entity_type
            WHEN 'plant' THEN (SELECT name FROM plants WHERE id = se.entity_id)
            WHEN 'molecule' THEN (SELECT name FROM molecules WHERE id = se.entity_id)
            WHEN 'recipe' THEN (SELECT name FROM recipes WHERE id = se.entity_id)
            WHEN 'reference' THEN (SELECT title FROM bibliography_entries WHERE id = se.entity_id)
            ELSE NULL
          END as entity_name,
          CASE se.entity_type
            WHEN 'plant' THEN (SELECT latin_name FROM plants WHERE id = se.entity_id)
            ELSE NULL
          END as entity_latin_name
         FROM story_elements se WHERE se.storyline_id = ?
         ORDER BY se.sequence_order ASC, se.id ASC`,
        [storyline.id]
      );
      return { ...storyline, elements: elements as any[] };
    }),

  // Récupérer les fils narratifs liés à une plante
  getByPlant: publicProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [rows] = await db.execute(
        `SELECT s.*, se.role_in_story, se.narrative_note
         FROM storylines s
         JOIN story_elements se ON se.storyline_id = s.id
         WHERE se.entity_type = 'plant' AND se.entity_id = ?
         AND s.status = 'active'
         ORDER BY s.created_at DESC`,
        [input.plantId]
      );
      return rows as any[];
    }),

  // Récupérer les fils narratifs liés à une molécule
  getByMolecule: publicProcedure
    .input(z.object({ moleculeId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [rows] = await db.execute(
        `SELECT s.*, se.role_in_story, se.narrative_note
         FROM storylines s
         JOIN story_elements se ON se.storyline_id = s.id
         WHERE se.entity_type = 'molecule' AND se.entity_id = ?
         AND s.status = 'active'
         ORDER BY s.created_at DESC`,
        [input.moleculeId]
      );
      return rows as any[];
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
      const db = await getDb();
      const now = Date.now();
      const [result] = await db.execute(
        `INSERT INTO storylines (title, slug, subtitle, description, narrative_axis, period_label, period_start_year, period_end_year, geographic_scope, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [input.title, input.slug, input.subtitle || null, input.description || null,
         input.narrative_axis, input.period_label || null, input.period_start_year || null,
         input.period_end_year || null, input.geographic_scope || null, input.status, now, now]
      );
      return { id: (result as any).insertId };
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
      const db = await getDb();
      const { id, ...fields } = input;
      const sets = Object.entries(fields)
        .filter(([, v]) => v !== undefined)
        .map(([k]) => `${k} = ?`).join(', ');
      const vals = Object.entries(fields)
        .filter(([, v]) => v !== undefined)
        .map(([, v]) => v);
      if (!sets) return { success: false };
      await db.execute(
        `UPDATE storylines SET ${sets}, updated_at = ? WHERE id = ?`,
        [...vals, Date.now(), id]
      );
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
      const db = await getDb();
      const [result] = await db.execute(
        `INSERT INTO story_elements (storyline_id, entity_type, entity_id, role_in_story, narrative_note, sequence_order, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [input.storyline_id, input.entity_type, input.entity_id,
         input.role_in_story, input.narrative_note || null, input.sequence_order, Date.now()]
      );
      return { id: (result as any).insertId };
    }),

  // Supprimer un élément d'un fil narratif (protégé)
  removeElement: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.execute('DELETE FROM story_elements WHERE id = ?', [input.id]);
      return { success: true };
    }),

  // Supprimer un fil narratif (protégé)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.execute('DELETE FROM storylines WHERE id = ?', [input.id]);
      return { success: true };
    }),

  // Stats globales
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    const [total] = await db.execute('SELECT COUNT(*) as n FROM storylines');
    const [active] = await db.execute("SELECT COUNT(*) as n FROM storylines WHERE status = 'active'");
    const [elements] = await db.execute('SELECT COUNT(*) as n FROM story_elements');
    const [byAxis] = await db.execute(
      `SELECT narrative_axis, COUNT(*) as count FROM storylines GROUP BY narrative_axis ORDER BY count DESC`
    );
    return {
      total: (total as any[])[0].n,
      active: (active as any[])[0].n,
      elements: (elements as any[])[0].n,
      byAxis: byAxis as any[],
    };
  }),
});
