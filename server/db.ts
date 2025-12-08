

// ============================================================================
// GET ALL MOLECULE-RECETTE RELATIONSHIPS FOR CORRELATION ANALYSIS
// ============================================================================

export async function getAllMoleculeRecetteRelationships() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const relationships = await db
    .select({
      moleculeId: moleculesRecettes.moleculeId,
      recetteId: moleculesRecettes.recetteId,
      proportion: moleculesRecettes.proportion,
    })
    .from(moleculesRecettes);
  
  return relationships;
}
