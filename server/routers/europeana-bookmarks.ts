import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { europeanaBookmarks } from "../../drizzle/schema";
import { eq, desc, and, isNull, isNotNull, like, or, sql } from "drizzle-orm";

// ─── Schémas de validation ────────────────────────────────────────────────────

const bookmarkInputSchema = z.object({
  europeanaId: z.string().min(1),
  theme: z.string().optional(),
  title: z.string().min(1),
  creator: z.string().optional(),
  date: z.string().optional(),
  institution: z.string().optional(),
  country: z.string().optional(),
  europeanaUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  thumbnailUrlLarge: z.string().optional(),
  iiifManifestUrl: z.string().optional(),
  rights: z.string().optional(),
  rightsLabel: z.string().optional(),
  mediaType: z.string().optional(),
  linkedPlantId: z.number().int().positive().optional(),
  linkedMoleculeId: z.number().int().positive().optional(),
  researchNotes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// ─── Routeur ─────────────────────────────────────────────────────────────────

export const europeanaBookmarksRouter = router({
  /**
   * Vérifier si un item Europeana est déjà sauvegardé
   */
  isBookmarked: publicProcedure
    .input(z.object({ europeanaId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { bookmarked: false, bookmark: null };
      const [existing] = await db
        .select()
        .from(europeanaBookmarks)
        .where(eq(europeanaBookmarks.europeanaId, input.europeanaId))
        .limit(1);
      return {
        bookmarked: !!existing,
        bookmark: existing || null,
      };
    }),

  /**
   * Sauvegarder un item Europeana
   */
  save: protectedProcedure
    .input(bookmarkInputSchema)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Base de données non disponible");

      // Vérifier si déjà sauvegardé
      const [existing] = await db
        .select({ id: europeanaBookmarks.id })
        .from(europeanaBookmarks)
        .where(eq(europeanaBookmarks.europeanaId, input.europeanaId))
        .limit(1);

      if (existing) {
        // Mettre à jour les notes/tags si déjà présent
        await db
          .update(europeanaBookmarks)
          .set({
            researchNotes: input.researchNotes || null,
            tags: input.tags ? JSON.stringify(input.tags) : null,
            linkedPlantId: input.linkedPlantId || null,
            linkedMoleculeId: input.linkedMoleculeId || null,
          })
          .where(eq(europeanaBookmarks.id, existing.id));
        return { action: "updated", id: existing.id };
      }

      const [result] = await db.insert(europeanaBookmarks).values({
        europeanaId: input.europeanaId,
        theme: input.theme || null,
        title: input.title,
        creator: input.creator || null,
        date: input.date || null,
        institution: input.institution || null,
        country: input.country || null,
        europeanaUrl: input.europeanaUrl || null,
        thumbnailUrl: input.thumbnailUrl || null,
        thumbnailUrlLarge: input.thumbnailUrlLarge || null,
        iiifManifestUrl: input.iiifManifestUrl || null,
        rights: input.rights || null,
        rightsLabel: input.rightsLabel || null,
        mediaType: input.mediaType || null,
        linkedPlantId: input.linkedPlantId || null,
        linkedMoleculeId: input.linkedMoleculeId || null,
        researchNotes: input.researchNotes || null,
        tags: input.tags ? JSON.stringify(input.tags) : null,
      });

      return { action: "created", id: (result as any).insertId };
    }),

  /**
   * Supprimer un bookmark
   */
  remove: protectedProcedure
    .input(z.object({ europeanaId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Base de données non disponible");
      await db
        .delete(europeanaBookmarks)
        .where(eq(europeanaBookmarks.europeanaId, input.europeanaId));
      return { success: true };
    }),

  /**
   * Lister les bookmarks avec pagination et filtres
   */
  list: publicProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(10).max(100).default(24),
        theme: z.string().optional(),
        search: z.string().optional(),
        linkedPlantId: z.number().int().positive().optional(),
        linkedMoleculeId: z.number().int().positive().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { items: [], total: 0, page: 1, pageSize: 24 };

      const { page, pageSize, theme, search, linkedPlantId, linkedMoleculeId } = input;
      const offset = (page - 1) * pageSize;

      const conditions = [];
      if (theme) conditions.push(eq(europeanaBookmarks.theme, theme));
      if (search) {
        conditions.push(
          or(
            like(europeanaBookmarks.title, `%${search}%`),
            like(europeanaBookmarks.institution, `%${search}%`),
            like(europeanaBookmarks.creator, `%${search}%`),
            like(europeanaBookmarks.researchNotes, `%${search}%`)
          )
        );
      }
      if (linkedPlantId) conditions.push(eq(europeanaBookmarks.linkedPlantId, linkedPlantId));
      if (linkedMoleculeId) conditions.push(eq(europeanaBookmarks.linkedMoleculeId, linkedMoleculeId));

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const conn = await import("mysql2/promise").then((m) =>
        m.createConnection(process.env.DATABASE_URL!)
      );

      try {
        const items = await db
          .select()
          .from(europeanaBookmarks)
          .where(whereClause)
          .orderBy(desc(europeanaBookmarks.createdAt))
          .limit(pageSize)
          .offset(offset);

        const countWhere = buildWhereCondition(input);
        const [[countRow]] = await conn.query(
          `SELECT COUNT(*) as total FROM europeana_bookmarks${countWhere.clause}`,
          countWhere.params
        ) as any;

        await conn.end();

        const parsedItems = items.map((item: any) => ({
          ...item,
          tags: item.tags ? (() => { try { return JSON.parse(item.tags); } catch { return []; } })() : [],
        }));

        return {
          items: parsedItems,
          total: Number(countRow?.total || 0),
          page,
          pageSize,
        };
      } catch {
        await conn.end();
        return { items: [], total: 0, page, pageSize };
      }
    }),

  /**
   * Statistiques des bookmarks
   */
  stats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, byTheme: [], withPlant: 0, withMolecule: 0 };

    const conn = await import("mysql2/promise").then((m) =>
      m.createConnection(process.env.DATABASE_URL!)
    );

    try {
      const [[totalRow]] = await conn.query(
        "SELECT COUNT(*) as total FROM europeana_bookmarks"
      ) as any;

      const [byTheme] = await conn.query(
        "SELECT theme, COUNT(*) as count FROM europeana_bookmarks GROUP BY theme ORDER BY count DESC"
      ) as any;

      const [[withPlantRow]] = await conn.query(
        "SELECT COUNT(*) as total FROM europeana_bookmarks WHERE linked_plant_id IS NOT NULL"
      ) as any;

      const [[withMoleculeRow]] = await conn.query(
        "SELECT COUNT(*) as total FROM europeana_bookmarks WHERE linked_molecule_id IS NOT NULL"
      ) as any;

      await conn.end();

      return {
        total: Number(totalRow?.total || 0),
        byTheme: (byTheme as any[]).map((r: any) => ({
          theme: r.theme || "Non classé",
          count: Number(r.count),
        })),
        withPlant: Number(withPlantRow?.total || 0),
        withMolecule: Number(withMoleculeRow?.total || 0),
      };
    } catch {
      await conn.end();
      return { total: 0, byTheme: [], withPlant: 0, withMolecule: 0 };
    }
  }),

  /**
   * Mettre à jour les notes et liens d'un bookmark
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        researchNotes: z.string().optional(),
        tags: z.array(z.string()).optional(),
        linkedPlantId: z.number().int().positive().nullable().optional(),
        linkedMoleculeId: z.number().int().positive().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Base de données non disponible");

      await db
        .update(europeanaBookmarks)
        .set({
          researchNotes: input.researchNotes !== undefined ? input.researchNotes : undefined,
          tags: input.tags !== undefined ? JSON.stringify(input.tags) : undefined,
          linkedPlantId: input.linkedPlantId,
          linkedMoleculeId: input.linkedMoleculeId,
        })
        .where(eq(europeanaBookmarks.id, input.id));

      return { success: true };
    }),
});

// ─── Helpers internes ─────────────────────────────────────────────────────────

/**
 * Construit la clause WHERE du COUNT sous forme paramétrée : le texte SQL ne
 * contient que des placeholders `?`, les valeurs partent séparément. Remplace
 * une version qui interpolait `theme` et `search` avec un simple doublage de
 * quotes, contournable en MySQL (le backslash y est un caractère
 * d'échappement).
 */
function buildWhereCondition(input: {
  theme?: string;
  search?: string;
  linkedPlantId?: number;
  linkedMoleculeId?: number;
}): { clause: string; params: (string | number)[] } {
  const parts: string[] = [];
  const params: (string | number)[] = [];

  if (input.theme) {
    parts.push("theme = ?");
    params.push(input.theme);
  }
  if (input.search) {
    parts.push("(title LIKE ? OR institution LIKE ? OR creator LIKE ?)");
    const pattern = `%${input.search}%`;
    params.push(pattern, pattern, pattern);
  }
  if (input.linkedPlantId) {
    parts.push("linked_plant_id = ?");
    params.push(input.linkedPlantId);
  }
  if (input.linkedMoleculeId) {
    parts.push("linked_molecule_id = ?");
    params.push(input.linkedMoleculeId);
  }

  return {
    clause: parts.length > 0 ? ` WHERE ${parts.join(" AND ")}` : "",
    params,
  };
}
