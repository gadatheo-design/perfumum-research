import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL, sql } from "drizzle-orm";
import { molecules, plantMolecules, plants, synergies } from "../../drizzle/schema";

export const dataQualityRouter = router({
  getMetrics: publicProcedure.query(async () => {
    const { getDb } = await import("../db");
    const dbInstance = await getDb();
    if (!dbInstance) return null;
    const { sql } = await import("drizzle-orm");

    const [molRes] = await dbInstance.execute(sql`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN cas_number IS NOT NULL AND cas_number != '' THEN 1 ELSE 0 END) as with_cas,
        SUM(CASE WHEN smiles IS NOT NULL AND smiles != '' THEN 1 ELSE 0 END) as with_smiles,
        SUM(CASE WHEN chemical_class IS NOT NULL AND chemical_class != '' THEN 1 ELSE 0 END) as with_class,
        SUM(CASE WHEN validation_status = 'valide' THEN 1 ELSE 0 END) as validated,
        SUM(CASE WHEN validation_status = 'en_revision' THEN 1 ELSE 0 END) as in_review,
        SUM(CASE WHEN validation_status = 'brouillon' THEN 1 ELSE 0 END) as draft,
        SUM(CASE WHEN pubchem_cid IS NOT NULL THEN 1 ELSE 0 END) as with_pubchem,
        COUNT(DISTINCT family) as distinct_families
      FROM molecules
    `) as unknown as [Record<string,unknown>[], unknown];

    const [tabRes] = await dbInstance.execute(sql`
      SELECT COUNT(*) as total,
        SUM(CASE WHEN ttl.tabac_id IS NOT NULL THEN 1 ELSE 0 END) as with_terroir
      FROM tabacs t
      LEFT JOIN tabac_terroir_links ttl ON ttl.tabac_id = t.id
    `) as unknown as [Record<string,unknown>[], unknown];

    const [cigRes] = await dbInstance.execute(sql`
      SELECT COUNT(*) as total,
        SUM(CASE WHEN terpene_profile IS NOT NULL AND terpene_profile != '' THEN 1 ELSE 0 END) as with_terpene
      FROM cigarillo_recipes
    `) as unknown as [Record<string,unknown>[], unknown];

    const [accordRes] = await dbInstance.execute(sql`
      SELECT COUNT(*) as total,
        SUM(CASE WHEN description IS NOT NULL AND description != '' THEN 1 ELSE 0 END) as with_desc
      FROM accords
    `) as unknown as [Record<string,unknown>[], unknown];

    const [plantRes] = await dbInstance.execute(sql`
      SELECT COUNT(*) as total,
        SUM(CASE WHEN latin_name IS NOT NULL AND latin_name != '' THEN 1 ELSE 0 END) as with_latin,
        SUM(CASE WHEN family IS NOT NULL AND family != '' THEN 1 ELSE 0 END) as with_family,
        SUM(CASE WHEN validation_status = 'valide' THEN 1 ELSE 0 END) as validated
      FROM plants
    `) as unknown as [Record<string,unknown>[], unknown];

    const [synRes] = await dbInstance.execute(sql`
      SELECT COUNT(*) as total FROM molecule_synergies
    `) as unknown as [Record<string,unknown>[], unknown];

    const [pmRes] = await dbInstance.execute(sql`
      SELECT COUNT(*) as total,
        COUNT(DISTINCT plant_id) as plants_with_molecules
      FROM plant_molecules
    `) as unknown as [Record<string,unknown>[], unknown];

    const [recipeRes] = await dbInstance.execute(sql`
      SELECT COUNT(*) as total FROM recipes
    `) as unknown as [Record<string,unknown>[], unknown];

    return {
      molecules: molRes[0],
      tabacs: tabRes[0],
      cigarillos: cigRes[0],
      accords: accordRes[0],
      plants: plantRes[0],
      synergies: synRes[0],
      plantMolecules: pmRes[0],
      recipes: recipeRes[0],
      generatedAt: new Date().toISOString(),
    };
  }),
})

