/**
 * Script de recatégorisation des 219 entrées "autre" dans raw_materials
 * Logique basée sur les patterns de noms identifiés
 * Usage: node scripts/recategorize-autres.mjs
 */
import mysql from 'mysql2/promise';

const RULES = [
  // ── Molécules isolées (composés chimiques purs) ──────────────────────────
  {
    pattern: /aldéhyde|aldehyde|damascone|ionone|lactone|acetate|linalool|ocimene|myrtenol|neryl|pinocarveol|pinocarvone|spathulenol|selinene|sclerene|cedarol|vetivone|viridiflorol|eudesmol|italidione|isocericenine|asarone|betulinine|beta-glucane|glucoerucine|glucoraphanine|glycyrrhizine|kaempferol|luteolin|quercetin|rosmarinic|scopoletin|umbelliferone|theobromine|thca|δ9-thc|tétraméthylpyrazine|methyl ethylpyrazine|e-2-dodecenal|paradisone|perillaldehyde|ozonal|jasmonal|georgywood|clearwood|ambrox|sandalore|sclerene|selinene|aristolen|hydroxyproline|glycine pyrolysée|lignine pyrolysée|crésol|guaiacol|phénol|sulfur|oxydes de fer|silicate aldehyde|aldéhydes c|terpenes|traces terpéniques|β-guaïène|γ-curcumène|γ-decalactone|δ-decalactone|c18 lactone|damianine|damiana|turnera diffusa|olibanol|ammonium-maillard|glucoraphanine/i,
    category: 'molecule_isolee',
    reason: 'Composé chimique isolé ou molécule pure'
  },
  // ── Accords composites (mélanges créatifs) ──────────────────────────────
  {
    pattern: /accord|bone-smoke|dust-burn|kaolin|clay smoke|sandstone|marrow|silicate note|calcaire olfactif|complexes terre|cuivre olfactif|fer olfactif|fer chaud|fer volatil|ozone|ozonal|ozone clair|ozone minéral|schiste olfactif|poussière blanche|bois sec|bois tendre|bois de brousse|acacia brûlé|charcoal africain|fumée douce|fumée légère|cuir fumé|foin chaud|feuille verte|herbes sèches|citron sec|citrus sec|cèdre beige|cèdre clair|black emerald|yuzu \(|créosote|bitume|crème de citronnelle|karité clair|karité fumé|karité vert|terre claire|terre ferrique|terre noire|mitti attar|petrichor/i,
    category: 'accord_olfactif',
    reason: 'Accord composite ou mélange créatif'
  },
  // ── Matières animales ────────────────────────────────────────────────────
  {
    pattern: /ambergris|ambre gris|hyraceum|musk deer|musc naturel|moschus/i,
    category: 'matiere_animale',
    reason: 'Matière première d\'origine animale'
  },
  // ── Résines et gommes ────────────────────────────────────────────────────
  {
    pattern: /oliban brûlé|olibanum|frankincense|copal|myrrh oil|palo santo|spikenard|benzoin|guaiac|gaïac|gaiac|mitti attar|costus root|santal — santalum|bois de santal rouge|bois de rose|bois de rose — aniba|comino.*menacé|oud.*accord/i,
    category: 'resinoid',
    reason: 'Résine, gomme ou extrait résinoïde'
  },
  // ── Huiles essentielles spéciales ────────────────────────────────────────
  {
    pattern: /hinoki oil|haitian vetiver|artisan peppermint|ponderosa pine|rocky mountain juniper|western red cedar|wild juniper|makrut lime|miyazaki citrus|lippia origanoides|calycolpus|maritima|steiractinia/i,
    category: 'huile_essentielle',
    reason: 'Huile essentielle spéciale ou de niche'
  },
  // ── Absolues patrimoniales ───────────────────────────────────────────────
  {
    pattern: /jasmin de grasse.*patrimoniale|rose de kazanlık|orris.*florentina|musk mallow.*patrimoniale|frangipani|plumeria light|oud tea|agarwood.*oud.*aquilaria|omani black frankincense/i,
    category: 'absolue',
    reason: 'Absolue ou extrait patrimonial'
  },
  // ── Extraits CO2 / supercritiques ────────────────────────────────────────
  {
    pattern: /ambrette seed|ambrette — abelmoschus|neem|damiana$|turnera diffusa$/i,
    category: 'co2_extract',
    reason: 'Extrait CO2 ou macérat'
  },
  // ── Infusions / macérations ──────────────────────────────────────────────
  {
    pattern: /cacao|café geisha|huitlacoche|lulo|uchuva|guanábana|fleur de café|coca décocaïnisée|mezcal|yagé|vetiver assam|vetiver fumé|piper aduncum|tagetes lucida|tangerine dream|nogal colombien|cedro rosado|cardamome \(/i,
    category: 'infusion',
    reason: 'Infusion, macération ou extrait végétal spécial'
  },
];

// Catégories valides dans le schéma
const VALID_CATEGORIES = [
  'huile_essentielle', 'absolue', 'concrete', 'resinoid', 'teinture',
  'co2_extract', 'hydrolat', 'beurre', 'cire', 'oleoresine',
  'infusion', 'maceration', 'distillat', 'accord_olfactif',
  'molecule_isolee', 'matiere_animale', 'autre'
];

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Récupérer toutes les entrées "autre"
  const [rows] = await conn.execute(
    "SELECT id, name, latin_name, olfactive_profile FROM raw_materials WHERE category = 'autre' ORDER BY name"
  );
  
  console.log(`\n📊 ${rows.length} entrées "autre" à analyser\n`);
  
  const updates = [];
  const unmatched = [];
  
  for (const row of rows) {
    let matched = false;
    for (const rule of RULES) {
      if (rule.pattern.test(row.name) || (row.latin_name && rule.pattern.test(row.latin_name))) {
        updates.push({ id: row.id, name: row.name, category: rule.category, reason: rule.reason });
        matched = true;
        break;
      }
    }
    if (!matched) unmatched.push(row);
  }
  
  console.log(`✅ ${updates.length} entrées recatégorisées automatiquement`);
  console.log(`❓ ${unmatched.length} entrées non matchées (restent "autre")\n`);
  
  // Résumé par catégorie
  const byCat = {};
  for (const u of updates) {
    byCat[u.category] = (byCat[u.category] || 0) + 1;
  }
  console.log('📈 Distribution:');
  for (const [cat, cnt] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${cat}: ${cnt}`);
  }
  
  if (unmatched.length > 0) {
    console.log('\n❓ Non matchées:');
    for (const u of unmatched) console.log(`   - ${u.name}`);
  }
  
  // Appliquer les mises à jour
  console.log('\n🔄 Application des mises à jour...');
  let updated = 0;
  for (const u of updates) {
    await conn.execute(
      "UPDATE raw_materials SET category = ? WHERE id = ?",
      [u.category, u.id]
    );
    updated++;
  }
  
  console.log(`\n✅ ${updated} entrées mises à jour avec succès !`);
  
  // Vérification finale
  const [finalCounts] = await conn.execute(
    "SELECT category, COUNT(*) as count FROM raw_materials GROUP BY category ORDER BY count DESC"
  );
  console.log('\n📊 Distribution finale:');
  for (const row of finalCounts) {
    console.log(`   ${row.category}: ${row.count}`);
  }
  
  await conn.end();
}

main().catch(console.error);
