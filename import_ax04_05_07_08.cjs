// Import AX-04, AX-05, AX-07, AX-08 depuis Notion
const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const url = new URL(process.env.DATABASE_URL);
  const conn = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: false }
  });

  console.log('=== Import AX-04, AX-05, AX-07, AX-08 ===');

  // Récupérer les IDs des axes
  const [axes] = await conn.execute("SELECT id, code FROM research_axes WHERE code IN ('AX1','AX2','AX3','AX4','AX5','AX6','AX7','AX8','AX9','AX10') ORDER BY code");
  const axisMap = {};
  axes.forEach(a => { axisMap[a.code] = a.id; });
  console.log('Axes disponibles:', Object.keys(axisMap).join(', '));

  // Fonction utilitaire pour insérer une research_entry
  async function insertEntry(entryCode, slug, title, summary, content, entryType, axisCode, tags, sourceUrl) {
    const [existing] = await conn.execute("SELECT id FROM research_entries WHERE entry_code = ?", [entryCode]);
    if (existing.length) {
      await conn.execute(
        "UPDATE research_entries SET title=?, summary=?, content=?, tags=?, updated_at=NOW() WHERE entry_code=?",
        [title, summary, content, JSON.stringify(tags), entryCode]
      );
      console.log('  Mis à jour:', entryCode);
      return existing[0].id;
    }
    const axisId = axisMap[axisCode] || axisMap['AX1'];
    const [result] = await conn.execute(
      "INSERT INTO research_entries (entry_code, slug, title, summary, content, entry_type, status, tags, axis_id, primary_axis_id, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,NOW(),NOW())",
      [entryCode, slug, title, summary, content, entryType, 'completed', JSON.stringify(tags), axisId, axisId]
    );
    console.log('  + Créé:', entryCode, '(id:', result.insertId + ')');
    return result.insertId;
  }

  // Fonction pour insérer une bibliographie
  async function insertBiblio(entryKey, title, url2, notes, domain, type2 = 'article') {
    const [existing] = await conn.execute("SELECT id FROM bibliography_entries WHERE entry_key = ? OR url = ? LIMIT 1", [entryKey, url2]);
    if (existing.length) { console.log('    Biblio déjà existante:', title.substring(0, 50)); return; }
    await conn.execute(
      "INSERT INTO bibliography_entries (entry_key, title, url, notes, entry_type, research_domain, read_status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,NOW(),NOW())",
      [entryKey, title, url2 || '', notes, type2, domain, 'unread']
    );
    console.log('    + Biblio:', title.substring(0, 60));
  }

  // Fonction pour insérer un terme glossaire
  async function insertGlossary(term, definition, category) {
    const [existing] = await conn.execute("SELECT id FROM glossary_terms WHERE term = ? LIMIT 1", [term]);
    if (existing.length) { console.log('    Glossaire déjà existant:', term); return; }
    const [gcols] = await conn.execute("SHOW COLUMNS FROM glossary_terms");
    const gColNames = gcols.map(c => c.Field);
    const fields = ['term', 'definition', 'created_at'];
    const vals = [term, definition, new Date()];
    if (gColNames.includes('category')) { fields.push('category'); vals.push(category); }
    if (gColNames.includes('updated_at')) { fields.push('updated_at'); vals.push(new Date()); }
    const ph = fields.map(() => '?').join(', ');
    await conn.execute(`INSERT INTO glossary_terms (${fields.join(', ')}) VALUES (${ph})`, vals);
    console.log('    + Glossaire:', term);
  }

  // ============================================================
  // AX-04 — ML Prédiction Olfactive
  // ============================================================
  console.log('\n--- AX-04 : ML Prédiction Olfactive ---');

  await insertEntry(
    'AX-04-ML01',
    'ax-04-ml01-machine-learning-prediction-olfactive',
    'AX-04 — Machine Learning pour la Prédiction Olfactive',
    "Feuille de route PERFUMUM pour l'intégration du machine learning dans la prédiction olfactive : Phase 1 Random Forest (6-12 mois), Phase 2 Graph Neural Networks (12-24 mois), Phase 3 Multitask + Blend Prediction (24+ mois). Comparaison de 5 approches (QSAR, RF, Deep FCNN, GNN, Multitask) selon complexité, précision, données minimales et interprétabilité.",
    `## Contexte

L'objectif est d'utiliser le machine learning pour prédire les propriétés olfactives des molécules et des accords à partir de leur structure chimique (SMILES, fingerprints moléculaires).

## Approches comparées

| Approche | Complexité | Précision | Données Min. | Interprétabilité | Temps Implémentation |
|---|---|---|---|---|---|
| QSAR Classique | Faible | Faible-Moyenne | 500+ | Très Élevée | 1-2 mois |
| Random Forest | Moyenne | Moyenne | 1 000+ | Élevée | 2-3 mois |
| Deep FCNN | Élevée | Élevée | 3 000+ | Faible | 4-6 mois |
| Graph Neural Networks | Élevée | Très Élevée | 5 000+ | Faible | 6-9 mois |
| Multitask + Blend | Très Élevée | Très Élevée | 5 000+ | Faible | 12+ mois |

## Feuille de Route PERFUMUM

### Phase 1 — Court Terme (6-12 mois)
**Modèle recommandé : Random Forest ou XGBoost**

Justification : complexité modérée, implémentation rapide, interprétabilité élevée, fonctionne avec 1 000+ molécules.

Actions immédiates :
1. Télécharger datasets Leffingwell + DREAM
2. Nettoyer et annoter 1 000+ molécules prioritaires
3. Entraîner baseline Random Forest
4. Valider sur molécules PERFUMUM existantes
5. Itérer sur features engineering

**Livrables** : Modèle RF opérationnel (Q3 2026), prédictions sur 80% molécules PERFUMUM, rapport précision/limites.

### Phase 2 — Moyen Terme (12-24 mois)
**Modèle cible : Graph Neural Networks (GNN)**

Justification : état de l'art actuel, précision maximale, capture relations structurelles complexes.

Prérequis : dataset 5 000+ molécules annotées, infrastructure GPU, expertise deep learning.

### Phase 3 — Long Terme (24+ mois)
**Modèle avancé : Multitask Learning + Blend Prediction**

Objectif : prédiction d'**accords** (pas seulement molécules isolées) — différenciateur majeur.

Impact : génération automatique formules TOP-XX, optimisation accords existants, découverte combinaisons inédites.

## Outils & Plateformes

- **osmo.ai** : modèles ML olfactifs (Noam Sobel / Google)
- **Scentalytics** : ML personnalisé + IA générative, prédiction caractéristiques
- **Fraunhofer IIS** : design matériaux sans tests labo
- **RDKit** : librairie cheminformatique open-source (fingerprints, SMILES)
- **PyRosetta** : modélisation protéines (récepteurs olfactifs)

## Datasets prioritaires

- **Leffingwell** : ~3 000 molécules annotées olfactivement
- **DREAM Olfaction Challenge** : dataset compétition ML olfactif
- **Goodscents** : base commerciale (accès payant)
- **PubChem** : 100M+ molécules (sans annotations olfactives)`,
    'methodology',
    'AX4',
    ['machine learning', 'prédiction olfactive', 'GNN', 'Random Forest', 'RDKit', 'PyRosetta', 'AX-04', 'feuille de route'],
    'https://www.notion.so/303dbb3d5e6c807ea90ec346a4f615ac'
  );

  await insertBiblio('ax04_osmo_ai', 'Osmo.ai — Machine Learning for Olfaction (Google/Sobel)', 'https://osmo.ai', 'Plateforme ML olfactif développée par Noam Sobel en collaboration avec Google. Prédiction propriétés olfactives à partir de structure moléculaire.', 'chimie_olfactive');
  await insertBiblio('ax04_leffingwell', 'Leffingwell & Associates — Olfactory Database', 'https://www.leffingwell.com', 'Base de données ~3 000 molécules avec annotations olfactives. Dataset prioritaire Phase 1 PERFUMUM.', 'chimie_olfactive');
  await insertBiblio('ax04_dream', 'DREAM Olfaction Prediction Challenge', 'https://www.synapse.org/#!Synapse:syn2811262', 'Compétition ML internationale pour la prédiction olfactive. Dataset benchmark de référence.', 'chimie_olfactive');

  await insertGlossary('QSAR', "Quantitative Structure-Activity Relationship. Méthode de modélisation qui prédit l'activité biologique ou les propriétés sensorielles d'une molécule à partir de sa structure chimique. Approche classique en cheminformatique, précède les méthodes deep learning.", 'technique');
  await insertGlossary('Graph Neural Network (GNN)', "Architecture de deep learning opérant sur des graphes moléculaires. Représente les molécules comme des graphes (atomes = nœuds, liaisons = arêtes) pour capturer les relations structurelles complexes. État de l'art pour la prédiction olfactive (Phase 2 PERFUMUM).", 'technique');
  await insertGlossary('Fingerprint moléculaire', "Représentation vectorielle binaire ou continue d'une molécule encodant la présence/absence de sous-structures chimiques. Utilisé comme features d'entrée pour les modèles ML (QSAR, Random Forest). Exemples : Morgan fingerprints (ECFP), MACCS keys.", 'technique');

  // ============================================================
  // AX-05 — Contextes Culturels Non-Occidentaux
  // ============================================================
  console.log('\n--- AX-05 : Contextes Culturels Non-Occidentaux ---');

  await insertEntry(
    'AX-05-CC01',
    'ax-05-cc01-contextes-culturels-iran-chine-latam',
    'AX-05 — Contextes Culturels Non-Occidentaux : Iran, Chine, Amérique Latine',
    "Analyse des marchés olfactifs non-occidentaux (Iran/Moyen-Orient, Chine, Amérique Latine) : préférences culturelles, acceptation des synthétiques, stratégies de formulation adaptées. Implications directes pour les accords PERFUMUM : orientaux, encens, notes vertes, citronnés.",
    `## Marchés analysés

### Iran / Moyen-Orient
- **Tradition** : naturels premium (rose, oud, ambre, musc)
- **Synthétiques** : fixateurs discrets acceptés (Iso E Super < 5%), amplificateurs (Hedione < 3%)
- **Rejet** : muscs galaxolide, calone, notes marines
- **Stratégie PERFUMUM** : renforcer signature naturelle sans dénaturer

### Chine
- **Tradition** : osmanthus, thé, litchi, encens
- **Synthétiques** : citrals, linalol, géraniol (familiers, "propres")
- **Rejet** : métaphores occidentales ("jade", "soie"), "orientaux" occidentalisés
- **Stratégie PERFUMUM** : construire vocabulaire olfactif chinois moderne

### Amérique Latine
- **Tradition** : fruits tropicaux, fleurs, épices locales
- **Synthétiques** : citrals, dihydromyrcenol, muscs légers (économiques, tenaces)
- **Rejet** : notes lourdes ambrées, complexité excessive
- **Stratégie PERFUMUM** : démocratiser via fraîcheur et performance

## Acceptation Synthétiques par Famille

| Famille Chimique | Iran | Chine | Amérique Latine |
|---|---|---|---|
| Muscs synthétiques | ❌ Rejet | ✅ Acceptation | ✅ Adoption |
| Aldéhydes | ⚠️ Sélectif | ✅ Acceptation | ⚠️ Moyen |
| Citrals/Linalol | ✅ Acceptation | ✅✅ Forte adoption | ✅✅ Très forte adoption |
| Iso E Super | ✅ Acceptation | ✅ Acceptation | ✅ Acceptation |
| Calone (marine) | ❌ Rejet | ✅ Intérêt | ✅ Adoption |

## Données à compléter

- Volumes production galbanum Iran (tonnes/an, prix/kg)
- Marques niche chinoises post-2020
- Réglementation parfums LATAM (restrictions molécules)
- Études consommateurs : préférences par génération
- Biotech parfumerie : acteurs, coût vs synthèse chimique`,
    'analysis',
    'AX5',
    ['Iran', 'Chine', 'Amérique Latine', 'contextes culturels', 'synthétiques', 'marchés', 'AX-05', 'formulation'],
    'https://www.notion.so/303dbb3d5e6c80728eb2e81ae7d97133'
  );

  await insertGlossary('Attar', "Parfum traditionnel à base d'huile (généralement santal) obtenu par distillation hydro-entraînée de fleurs fraîches. Technique ancestrale indienne (Kannauj). Exemples : attar rose, attar jasmin, attar kewra. Synonyme : ittar.", 'matiere_premiere');
  await insertGlossary('Dihydromyrcenol', "Terpène alcool synthétique (C10H20O) à odeur fraîche, citronnée, légèrement boisée. Très utilisé en parfumerie grand public (déodorants, lessives, eaux de toilette fraîches). Forte adoption en Amérique Latine pour sa fraîcheur et sa ténacité économique.", 'molecule');

  // ============================================================
  // AX-07 — Patrimoine Olfactif Mexicain
  // ============================================================
  console.log('\n--- AX-07 : Patrimoine Olfactif Mexicain ---');

  await insertEntry(
    'AX-07-MX01',
    'ax-07-mx01-patrimoine-olfactif-mexicain',
    'AX-07 — Patrimoine Olfactif Mexicain : Copal, Pericón, Tabac Aztèque',
    "Exploration du patrimoine olfactif mésoaméricain : copal (Bursera spp.), pericón (Tagetes lucida), tabac aztèque (Nicotiana rustica), Piciete. 6 plantes clés documentées avec profils GC-MS, 3 recettes prototypes (Copal Noir, Pericón Solaire, Tabac Aztèque). Sources : Codex Florentino (Sahagún), Dupey García, Ortiz de Montellano.",
    `## Plantes clés mésoaméricaines

### Copal (Bursera spp.)
- **Espèces** : B. copallifera, B. bipinnata, B. fagaroides
- **Molécules clés** : α-pinène (25-40%), limonène (15-20%), p-cymène (5-10%), terpinolène (3-8%)
- **Usage rituel** : offrandes aux dieux, purification, communication avec les ancêtres
- **Notes** : résineuse, boisée, légèrement citronnée, encens

### Pericón / Yauhtli (Tagetes lucida)
- **Famille** : Asteraceae
- **Molécules clés** : estragole (60-80%), anéthole (10-15%), méthyl-chavicol
- **Usage** : encens rituel aztèque, substitut de l'anis, plante médicinale
- **Notes** : anisée, herbacée, légèrement épicée

### Tabac aztèque — Piciete (Nicotiana rustica)
- **Teneur nicotine** : 9-14% (vs 2-3% pour N. tabacum)
- **Molécules clés** : nornicotine, anabasine, myosmine, β-nicotyrine
- **Usage** : mélange rituel (tabac + chaux + cendres), équivalent mésoaméricain du mambe
- **Notes** : terreux, fumé, très intense

### Ocotl (Pinus spp. mexicains)
- **Espèces** : P. montezumae, P. patula
- **Molécules clés** : α-pinène (40-60%), β-pinène (15-25%), limonène (5-10%)
- **Notes** : résineuse, fraîche, boisée

### Copal Blanco (Bursera fagaroides)
- **Molécules clés** : limonène (30-45%), α-terpinène (10-15%)
- **Notes** : citronnée, légère, propre

### Liquidambar (Liquidambar styraciflua)
- **Molécules clés** : styrène (15-25%), cinnamaldéhyde (10-20%), vanilline (5-10%)
- **Notes** : balsamique, vanillée, légèrement épicée

## Recettes prototypes

### Copal Noir PERFUMUM
- Copal negro (Bursera bipinnata) : 40%
- Résine liquidambar : 20%
- Tabac Nicotiana rustica : 15%
- Géosmine (synthétique) : 5%
- Vétiver : 20%

### Pericón Solaire
- Pericón (Tagetes lucida) HE : 35%
- Estragole isolat : 15%
- Copal blanco : 30%
- Citrus mexicain : 20%

### Tabac Aztèque (Piciete)
- Nicotiana rustica absolue : 30%
- Copal negro : 25%
- Chaux éteinte (note minérale) : 5%
- Encens oliban : 40%

## Sources primaires

- **Codex Florentino** (Sahagún, 1569) : 12 livres, encyclopédie mésoaméricaine
- **Dupey García, É.** : culture olfactive aztèque, pratiques rituelles
- **Ortiz de Montellano, B.** : médecine aztèque, ethnopharmacologie
- **CONABIO** : Comisión Nacional para el Conocimiento y Uso de la Biodiversidad

## Notes méthodologiques

Les recettes proposées sont des **réinterprétations créatives** inspirées de traditions, non des reconstitutions strictes. L'ajout d'isolats modernes (géosmine, indole) est une démarche de parfumerie contemporaine assumée.

**Limites documentaires** : nombreuses pratiques olfactives préhispaniques détruites ou syncrétisées avec le catholicisme. Sources primaires filtrées par le regard colonial espagnol.`,
    'synthesis',
    'AX7',
    ['Mexique', 'Mésoamérique', 'copal', 'pericón', 'tabac aztèque', 'Piciete', 'patrimoine', 'AX-07', 'ethnobotanique'],
    'https://www.notion.so/2fcdbb3d5e6c80198954f57fd3d57325'
  );

  // Plantes mésoaméricaines
  const plantsMex = [
    { name: 'Bursera copallifera', common: 'Copal negro', family: 'Burseraceae', origin: 'Mexique', notes: 'résineuse, boisée, encens' },
    { name: 'Tagetes lucida', common: 'Pericón / Yauhtli', family: 'Asteraceae', origin: 'Mexique', notes: 'anisée, herbacée, épicée' },
    { name: 'Nicotiana rustica', common: 'Tabac aztèque / Piciete', family: 'Solanaceae', origin: 'Amérique centrale', notes: 'terreux, fumé, très intense' },
    { name: 'Liquidambar styraciflua', common: 'Liquidambar', family: 'Altingiaceae', origin: 'Amérique centrale', notes: 'balsamique, vanillée, épicée' },
  ];

  for (const p of plantsMex) {
    const [existP] = await conn.execute("SELECT id FROM plants WHERE latin_name = ? OR name = ? LIMIT 1", [p.name, p.common]);
    if (existP.length) { console.log('  Plante déjà existante:', p.name); continue; }
    await conn.execute(
      "INSERT INTO plants (latin_name, name, family, origin, olfactive_signature, created_at, updated_at) VALUES (?,?,?,?,?,NOW(),NOW())",
      [p.name, p.common, p.family, p.origin, p.notes]
    );
    console.log('  + Plante créée:', p.name);
  }

  await insertBiblio('ax07_codex_florentino', 'Codex Florentino — Sahagún (1569)', 'https://www.loc.gov/item/2021667837/', 'Encyclopédie mésoaméricaine en 12 livres documentant la culture aztèque, incluant les pratiques olfactives rituelles (copal, tabac, fleurs). Source primaire fondamentale pour AX-07.', 'ethnobotanique', 'book');
  await insertBiblio('ax07_dupey_garcia', 'Dupey García — Culture olfactive aztèque', 'https://www.jstor.org/stable/43864201', 'Recherches sur les pratiques olfactives rituelles aztèques, usage du copal et des fleurs dans les cérémonies religieuses mésoaméricaines.', 'ethnobotanique');
  await insertBiblio('ax07_ortiz_montellano', 'Ortiz de Montellano — Aztec Medicine, Health, and Nutrition', 'https://www.rutgersuniversitypress.org', 'Ethnopharmacologie aztèque, médecine traditionnelle mésoaméricaine, usage des plantes aromatiques (tabac, copal, pericón) dans les pratiques médicinales.', 'ethnobotanique', 'book');

  await insertGlossary('Copal', "Résine aromatique extraite de diverses espèces de Bursera (Mexique) et Protium (Amazonie). Usage rituel mésoaméricain depuis 3 000 ans : offrandes, purification, communication avec les ancêtres. Molécules clés : α-pinène, limonène, terpinolène. Équivalent américain de l'encens oliban.", 'matiere_premiere');
  await insertGlossary('Piciete', "Mélange rituel mésoaméricain à base de Nicotiana rustica (tabac fort, 9-14% nicotine), chaux éteinte et cendres. Équivalent mésoaméricain du mambe andin. Usage chamanique, non fumé mais mâché ou appliqué sur les gencives. Teneur en alcaloïdes très supérieure au tabac commercial.", 'matiere_premiere');
  await insertGlossary('Deg-Bhapka', "Technique traditionnelle de distillation indienne (Kannauj) utilisant des alambics en cuivre (deg) et des récipients récepteurs (bhapka) immergés dans l'eau froide. Permet la distillation à basse température de fleurs délicates (rose, jasmin) dans une base de santal. Produit les attars traditionnels.", 'technique');

  // ============================================================
  // AX-08 — Industrie Parfum Kannauj
  // ============================================================
  console.log('\n--- AX-08 : Industrie Parfum Kannauj ---');

  await insertEntry(
    'AX-08-KN01',
    'ax-08-kn01-industrie-parfum-kannauj',
    'AX-08 — Industrie Parfum Kannauj (Inde) : Cluster Attar et Stratégie de Transformation',
    "Analyse économique du cluster attar de Kannauj (Uttar Pradesh, Inde) : 5 000+ distillateurs, technique Deg-Bhapka ancestrale, crise sandalwood, 4 contraintes structurelles (dualisme technologique, friction financière, déficit marketing, impact écologique). Stratégie de transformation vers luxury hub global. Source : Pal & Singh (2026), IJFMR.",
    `## Le Cluster Attar de Kannauj

Kannauj (Uttar Pradesh) est le centre mondial de la distillation d'attars traditionnels depuis l'ère moghole (XVIe siècle). La ville concentre 5 000+ distillateurs utilisant la technique ancestrale **Deg-Bhapka** (alambics en cuivre).

### Matières premières principales
- **Rose** (Rosa damascena) : récolte manuelle, saison courte (mars-avril)
- **Jasmin** (Jasminum sambac, J. grandiflorum)
- **Kewra** (Pandanus odoratissimus) : fleur de pandanus
- **Vétiver** (Vetiveria zizanioides) : racines
- **Base** : santal indien (Santalum album) — en crise

## Contraintes structurelles

### 1. Crise Sandalwood
L'attar traditionnel nécessite une base de santal → restrictions réglementaires + prix élevés → substitution paraffine/synthétique → dilution qualité + érosion confiance (*lemons market*).

### 2. Dualisme technologique

| Technologie | Avantages | Inconvénients |
|---|---|---|
| Deg-Bhapka (traditionnel) | Durable, qualité olfactive | Faible rendement |
| Distillation vapeur (moderne) | Efficace, productif | Altère qualité |
| **Technologie intermédiaire** | — | **Absente** |

### 3. Friction financière
Informalité élevée → exclusion bancaire → créanciers informels (taux élevés) → frein investissement capital.

### 4. Déficit marketing
Manque expertise branding luxe, psychologie consommateur digital → impossibilité pivot B2C.

## Stratégie de transformation

**Vision** : transition bulk commodity → luxury hub global

### Leviers
- **GI Tag enforcement** (Geographical Indication) : protection brand equity, lutte contrefaçons
- **R&D tech hybride** : gaz/solaire mimant courbe chauffe cuivre, réduction impact sans perte qualité
- **Contract farming** : 200-300 ha pilote, mitigation volatilité prix
- **Formation e-commerce D2C** : bypass intermédiaires, rétention surplus économique
- **Perfume tourism** : distillery tours, workshops, flux revenus parallèle

### Objectifs long terme
- Kannauj = destination parfumerie mondiale
- Capture 30-40% valeur retail (vs 10-15% actuel)
- Agroforesterie sandalwood (1 000+ ha)

## Implications pour PERFUMUM

- **Sourcing** : identifier fournisseurs Deg-Bhapka certifiés (RAR-344 Rose Kannauj, RAR-345 Jasmin Sambac)
- **Formulation** : attars hybrides (rose 20% + santal 10% + vétiver 5%) documentés dans la Matrice Activation Patrimoine
- **Éthique** : soutenir producteurs locaux vs intermédiaires (D2C, GI Tag)`,
    'analysis',
    'AX8',
    ['Kannauj', 'Inde', 'attar', 'Deg-Bhapka', 'santal', 'cluster', 'AX-08', 'économie', 'patrimoine'],
    'https://www.notion.so/2fddbb3d5e6c80328553c837df4fcee5'
  );

  await insertBiblio('ax08_pal_singh_2026', 'Pal & Singh (2026) — Analyse économique du cluster Attar de Kannauj, Uttar Pradesh', 'https://www.ijfmr.com', 'Analyse économique complète du cluster attar de Kannauj : emploi, flux financiers, contraintes structurelles, stratégies de transformation. International Journal of Multidisciplinary Research, 2026.', 'histoire_parfumerie');
  await insertBiblio('ax08_kannauj_gi', 'Geographical Indication Tag — Kannauj Attar', 'https://ipindia.gov.in', "Enregistrement GI Tag pour les attars de Kannauj. Protection de l'indication géographique pour les produits de parfumerie traditionnelle indienne.", 'reglementation');

  // Résumé final
  const [totalRE] = await conn.execute("SELECT COUNT(*) as c FROM research_entries");
  const [totalB] = await conn.execute("SELECT COUNT(*) as c FROM bibliography_entries");
  const [totalG] = await conn.execute("SELECT COUNT(*) as c FROM glossary_terms");
  const [totalP] = await conn.execute("SELECT COUNT(*) as c FROM plants");

  console.log('\n=== Résumé Final ===');
  console.log('research_entries:', totalRE[0].c);
  console.log('bibliography_entries:', totalB[0].c);
  console.log('glossary_terms:', totalG[0].c);
  console.log('plants:', totalP[0].c);

  await conn.end();
}

main().catch(console.error);
