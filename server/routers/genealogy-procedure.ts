import { z } from "zod";
import { sql } from "drizzle-orm";
import { publicProcedure } from "../_core/trpc";
import { getDb } from "../db";

export const getVarietyGenealogy = publicProcedure
  .input(z.object({ varietyId: z.number() }))
  .query(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const varietyResult = await db.execute(sql`
      SELECT id, name, category FROM plants WHERE id = ${input.varietyId}
    `);
    const varietyRows = (varietyResult as any).rows ?? (Array.isArray(varietyResult) ? varietyResult : []);
    if ((varietyRows as any[]).length === 0) throw new Error(`Variété non trouvée : ${input.varietyId}`);
    const v = (varietyRows as any[])[0];

    const ancestorsResult = await db.execute(sql`
      WITH RECURSIVE ancestor_tree AS (
        SELECT vg.variety_id, vg.parent_variety_id, p1.name as variety_name, p2.name as parent_name,
               vg.relationship_type, vg.breeder, vg.notes, 1 as depth
        FROM variety_genealogy vg
        JOIN plants p1 ON vg.variety_id = p1.id
        JOIN plants p2 ON vg.parent_variety_id = p2.id
        WHERE p1.id = ${input.varietyId}
        UNION ALL
        SELECT vg.variety_id, vg.parent_variety_id, p1.name, p2.name,
               vg.relationship_type, vg.breeder, vg.notes, at.depth + 1
        FROM variety_genealogy vg
        JOIN ancestor_tree at ON vg.variety_id = at.parent_variety_id
        JOIN plants p1 ON vg.variety_id = p1.id
        JOIN plants p2 ON vg.parent_variety_id = p2.id
        WHERE at.depth < 5
      )
      SELECT variety_id, parent_variety_id, variety_name, parent_name, relationship_type, breeder, notes, depth
      FROM ancestor_tree ORDER BY depth, variety_name
    `);
    const ancestors = (ancestorsResult as any).rows ?? (Array.isArray(ancestorsResult) ? ancestorsResult : []);

    const descendantsResult = await db.execute(sql`
      WITH RECURSIVE descendant_tree AS (
        SELECT vg.variety_id, vg.parent_variety_id, p1.name as variety_name, p2.name as parent_name,
               vg.relationship_type, vg.breeder, vg.notes, 1 as depth
        FROM variety_genealogy vg
        JOIN plants p1 ON vg.variety_id = p1.id
        JOIN plants p2 ON vg.parent_variety_id = p2.id
        WHERE p2.id = ${input.varietyId}
        UNION ALL
        SELECT vg.variety_id, vg.parent_variety_id, p1.name, p2.name,
               vg.relationship_type, vg.breeder, vg.notes, dt.depth + 1
        FROM variety_genealogy vg
        JOIN descendant_tree dt ON vg.parent_variety_id = dt.variety_id
        JOIN plants p1 ON vg.variety_id = p1.id
        JOIN plants p2 ON vg.parent_variety_id = p2.id
        WHERE dt.depth < 5
      )
      SELECT variety_id, parent_variety_id, variety_name, parent_name, relationship_type, breeder, notes, depth
      FROM descendant_tree ORDER BY depth, variety_name
    `);
    const descendants = (descendantsResult as any).rows ?? (Array.isArray(descendantsResult) ? descendantsResult : []);

    const nodes: any[] = [{ id: String(input.varietyId), label: v.name, type: 'root', category: v.category }];
    const links: any[] = [];

    (ancestors as any[]).forEach(a => {
      if (!nodes.find(n => n.id === String(a.parent_variety_id))) {
        nodes.push({ id: String(a.parent_variety_id), label: a.parent_name, type: 'ancestor', depth: a.depth });
      }
      links.push({ source: String(a.parent_variety_id), target: String(a.variety_id), type: a.relationship_type, breeder: a.breeder, notes: a.notes });
    });

    (descendants as any[]).forEach(d => {
      if (!nodes.find(n => n.id === String(d.variety_id))) {
        nodes.push({ id: String(d.variety_id), label: d.variety_name, type: 'descendant', depth: d.depth });
      }
      links.push({ source: String(d.parent_variety_id), target: String(d.variety_id), type: d.relationship_type, breeder: d.breeder, notes: d.notes });
    });

    return {
      variety: { id: v.id, name: v.name, category: v.category },
      nodes,
      links,
      ancestorCount: (ancestors as any[]).length,
      descendantCount: (descendants as any[]).length,
    };
  });
