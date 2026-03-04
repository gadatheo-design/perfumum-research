/**
 * PARSING DES RECETTES TEXTUELLES — PERFUMUM
 * 
 * Objectif : Convertir le champ `ingredients` (texte libre) en liaisons formelles
 * dans la table recette_molecules, en cherchant les molécules correspondantes.
 * 
 * Stratégie :
 * 1. Récupérer toutes les recettes avec texte ingrédients mais sans liaisons formelles
 * 2. Parser le texte (séparateurs : virgule, point-virgule, retour à la ligne)
 * 3. Pour chaque ingrédient, chercher la molécule correspondante par nom (fuzzy match)
 * 4. Créer les liaisons avec proportion estimée (100% / nb_ingredients)
 * 5. Signaler les ingrédients non trouvés pour traitement manuel
 */

const mysql = require('mysql2/promise');

(async () => {
  const db = await mysql.createConnection(process.env.DATABASE_URL);
  const log = (s) => console.log(s);
  let linked = 0;
  let notFound = [];
  let recettesProcessed = 0;

  log('🍶 PARSING DES RECETTES TEXTUELLES — PERFUMUM');
  log('='.repeat(60));

  // Récupérer les recettes avec texte ingrédients mais sans liaisons
  const [recettes] = await db.query(`
    SELECT r.id, r.name, r.category, r.ingredients
    FROM recettes r
    LEFT JOIN recette_molecules rm ON r.id = rm.recette_id
    WHERE rm.recette_id IS NULL
      AND r.ingredients IS NOT NULL
      AND r.ingredients != ''
    ORDER BY r.id
  `);

  log(`\n${recettes.length} recettes avec texte ingrédients à parser\n`);

  // Charger tous les noms de molécules en mémoire pour le matching
  const [allMolecules] = await db.query(`SELECT id, name FROM molecules ORDER BY LENGTH(name) DESC`);
  
  // Créer un index de recherche normalisé
  const molIndex = allMolecules.map(m => ({
    id: m.id,
    name: m.name,
    normalized: m.name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // enlever accents
      .replace(/[^a-z0-9\s\-]/g, '') // garder lettres, chiffres, tirets
      .trim()
  }));

  // Fonction de matching : chercher une molécule par nom
  function findMolecule(ingredientText) {
    const normalized = ingredientText.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s\-]/g, '')
      .trim();
    
    if (!normalized || normalized.length < 3) return null;

    // 1. Correspondance exacte
    let match = molIndex.find(m => m.normalized === normalized);
    if (match) return { mol: match, confidence: 'exact' };

    // 2. Correspondance partielle (le nom de la molécule est contenu dans l'ingrédient)
    match = molIndex.find(m => m.normalized.length > 4 && normalized.includes(m.normalized));
    if (match) return { mol: match, confidence: 'partial' };

    // 3. Correspondance inverse (l'ingrédient est contenu dans le nom de la molécule)
    match = molIndex.find(m => m.normalized.length > 4 && m.normalized.includes(normalized));
    if (match) return { mol: match, confidence: 'partial' };

    // 4. Correspondance par mots-clés (premier mot significatif)
    const words = normalized.split(/\s+/).filter(w => w.length > 3);
    for (const word of words) {
      match = molIndex.find(m => m.normalized.startsWith(word) || m.normalized.includes(' ' + word));
      if (match) return { mol: match, confidence: 'keyword' };
    }

    return null;
  }

  // Traiter chaque recette
  for (const recette of recettes) {
    log(`\n📋 Recette ID:${recette.id} — "${recette.name}" (${recette.category})`);
    log(`   Texte : "${recette.ingredients.substring(0, 100)}"`);

    // Parser le texte en liste d'ingrédients
    const rawIngredients = recette.ingredients
      .split(/[,;\n\r]+/)
      .map(s => s.trim())
      .filter(s => s.length > 2);

    if (rawIngredients.length === 0) {
      log(`   ⚠️  Aucun ingrédient parsé`);
      continue;
    }

    const proportion = parseFloat((100 / rawIngredients.length).toFixed(1));
    const linkedMols = [];
    const unlinkedIngr = [];

    for (const ingr of rawIngredients) {
      const result = findMolecule(ingr);
      if (result) {
        linkedMols.push({ ingr, mol: result.mol, confidence: result.confidence, proportion });
      } else {
        unlinkedIngr.push(ingr);
      }
    }

    // Afficher les résultats
    linkedMols.forEach(l => log(`   ✅ "${l.ingr}" → "${l.mol.name}" (${l.confidence}) @ ${l.proportion}%`));
    unlinkedIngr.forEach(u => log(`   ❌ "${u}" → non trouvé`));

    // Insérer les liaisons trouvées
    if (linkedMols.length > 0) {
      for (const l of linkedMols) {
        try {
          await db.query(`
            INSERT INTO recette_molecules (recette_id, molecule_id, proportion, role)
            VALUES (?, ?, ?, 'ingredient')
          `, [recette.id, l.mol.id, l.proportion]);
          linked++;
        } catch (e) {
          log(`   ⚠️  Erreur insertion "${l.mol.name}" : ${e.message}`);
        }
      }
      recettesProcessed++;
    }

    // Enregistrer les non-trouvés
    unlinkedIngr.forEach(u => notFound.push({ recette: recette.name, ingredient: u }));
  }

  // ─────────────────────────────────────────────────────────────
  // RÉSUMÉ
  // ─────────────────────────────────────────────────────────────
  log('\n' + '='.repeat(60));
  log('📊 RÉSUMÉ DU PARSING');
  log(`  Recettes traitées : ${recettesProcessed}`);
  log(`  Liaisons créées : ${linked}`);
  log(`  Ingrédients non trouvés : ${notFound.length}`);

  if (notFound.length > 0) {
    log('\n📋 INGRÉDIENTS NON TROUVÉS (à créer manuellement) :');
    const grouped = {};
    notFound.forEach(n => {
      if (!grouped[n.ingredient]) grouped[n.ingredient] = [];
      grouped[n.ingredient].push(n.recette);
    });
    Object.entries(grouped).sort((a,b) => b[1].length - a[1].length).forEach(([ingr, recettes]) => {
      log(`  "${ingr}" — dans : ${recettes.slice(0,3).join(', ')}${recettes.length > 3 ? '...' : ''}`);
    });
  }

  // Vérification finale
  const [newCount] = await db.query(`SELECT COUNT(DISTINCT recette_id) as n FROM recette_molecules`);
  const [total] = await db.query(`SELECT COUNT(*) as n FROM recettes`);
  log(`\n  Recettes avec ingrédients liés : ${newCount[0].n}/${total[0].n} (${Math.round(newCount[0].n/total[0].n*100)}%)`);

  await db.end();
  log('\n✅ Parsing terminé');
})().catch(e => { console.error('ERREUR:', e.message); process.exit(1); });
