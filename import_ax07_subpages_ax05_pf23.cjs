// Import AX-07 sous-pages + AX-05 Annexe + PF-23 + Cigarettes Disparues
const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const url = new URL(process.env.DATABASE_URL);
  const conn = await mysql.createConnection({
    host: url.hostname, port: parseInt(url.port) || 3306,
    user: url.username, password: url.password,
    database: url.pathname.slice(1), ssl: { rejectUnauthorized: false }
  });

  console.log('=== Import AX-07 sous-pages + AX-05 Annexe + PF-23 + Cigarettes ===');

  const [axes] = await conn.execute("SELECT id, code FROM research_axes ORDER BY code");
  const axisMap = {};
  axes.forEach(a => { axisMap[a.code] = a.id; });

  async function insertEntry(code, slug, title, summary, content, type, axisCode, tags) {
    const [ex] = await conn.execute("SELECT id FROM research_entries WHERE entry_code=?", [code]);
    const axisId = axisMap[axisCode] || axisMap['AX1'];
    if (ex.length) {
      await conn.execute("UPDATE research_entries SET title=?,summary=?,content=?,tags=?,updated_at=NOW() WHERE entry_code=?",
        [title, summary, content, JSON.stringify(tags), code]);
      console.log('  Mis à jour:', code);
      return ex[0].id;
    }
    const [r] = await conn.execute(
      "INSERT INTO research_entries (entry_code,slug,title,summary,content,entry_type,status,tags,axis_id,primary_axis_id,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,NOW(),NOW())",
      [code, slug, title, summary, content, type, 'completed', JSON.stringify(tags), axisId, axisId]
    );
    console.log('  + Créé:', code);
    return r.insertId;
  }

  async function insertBiblio(key, title, url2, notes, domain, type2='article') {
    const [ex] = await conn.execute("SELECT id FROM bibliography_entries WHERE entry_key=? LIMIT 1", [key]);
    if (ex.length) { console.log('    Biblio déjà:', title.substring(0,50)); return; }
    await conn.execute(
      "INSERT INTO bibliography_entries (entry_key,title,url,notes,entry_type,research_domain,read_status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,NOW(),NOW())",
      [key, title, url2||'', notes, type2, domain, 'unread']
    );
    console.log('    + Biblio:', title.substring(0,60));
  }

  async function insertGlossary(term, definition, category) {
    const [ex] = await conn.execute("SELECT id FROM glossary_terms WHERE term=? LIMIT 1", [term]);
    if (ex.length) { console.log('    Glossaire déjà:', term); return; }
    const [cols] = await conn.execute("SHOW COLUMNS FROM glossary_terms");
    const colNames = cols.map(c => c.Field);
    const fields = ['term','definition','created_at'];
    const vals = [term, definition, new Date()];
    if (colNames.includes('category')) { fields.push('category'); vals.push(category); }
    if (colNames.includes('updated_at')) { fields.push('updated_at'); vals.push(new Date()); }
    await conn.execute(`INSERT INTO glossary_terms (${fields.join(',')}) VALUES (${fields.map(()=>'?').join(',')})`, vals);
    console.log('    + Glossaire:', term);
  }

  // ============================================================
  // AX-07 SOUS-PAGE 1 : Piciete — L'Équivalent Mésoaméricain du Mambe
  // ============================================================
  console.log('\n--- AX-07-SP1 : Piciete ---');
  await insertEntry(
    'AX-07-MX02', 'ax-07-mx02-piciete-mambe-mesoamericain',
    'AX-07 — Le Piciete : Équivalent Mésoaméricain du Mambe',
    "Étude comparative du Piciete (mélange rituel aztèque à base de Nicotiana rustica + chaux + cendres) et du Mambe andin (coca + cendres). Convergence ethnobotanique : alcaloïdes + base alcaline = libération amplifiée. Implications pour les formules tabac PERFUMUM.",
    `## Définition

Le **Piciete** (náhuatl : *picietl*) est un mélange rituel mésoaméricain composé de :
- **Nicotiana rustica** (tabac fort, 9-14% nicotine)
- **Chaux éteinte** (cal, CaO·H₂O) ou cendres alcalines
- Parfois : copal, résines aromatiques, champignons psychotropes

## Convergence avec le Mambe Andin

| Propriété | Piciete (Mexique) | Mambe (Amazonie) |
|---|---|---|
| Plante base | Nicotiana rustica | Erythroxylum coca |
| Alcaloïde | Nornicotine, anabasine | Cocaïne, ecgonine |
| Base alcaline | Chaux (CaO) | Cendres de Cecropia |
| Voie d'administration | Gencives, narines | Gencives |
| Fonction | Rituel, chamanique | Social, chamanique |
| pH | ~11-12 | ~10-11 |

**Mécanisme commun** : la base alcaline libère la forme libre (non-ionisée) de l'alcaloïde → absorption muqueuse buccale amplifiée.

## Profil Moléculaire Nicotiana rustica

- **Nornicotine** : 40-60% des alcaloïdes totaux (vs 5% dans N. tabacum)
- **Anabasine** : 10-20%
- **Myosmine** : 5-10%
- **β-Nicotyrine** : 3-8%
- **Nicotine** : 15-25% (vs 90%+ dans N. tabacum)

Teneur totale alcaloïdes : 9-14% (vs 2-3% pour N. tabacum commerciale)

## Molécules Aromatiques à la Combustion

À 200-400°C (zone de pyrolyse douce) :
- **Pyridine** : note piquante, tabac
- **Furfural** : note caramel, pain grillé
- **Acétaldéhyde** : note fraîche, piquante
- **Acide acétique** : note vinaigrée
- **Phénol** : note médicamenteuse, fumée

## Implications PERFUMUM

1. **Formule Tabac Aztèque** : Nicotiana rustica absolue + chaux (note minérale) + copal
2. **Profil de combustion unique** : nornicotine → pyridine + pyrroles (notes tabac complexes)
3. **Lien avec AS-03** : protocoles de combustion spécifiques à N. rustica (température plus élevée)
4. **Comparaison avec Latakia** : deux approches du tabac fumé/aromatisé — Orient vs Mésoamérique

## Sources

- Dupey García, É. — Pratiques olfactives aztèques
- Ortiz de Montellano, B. — Médecine aztèque
- Sahagún, B. de — Codex Florentino, Livre XI (plantes médicinales)`,
    'synthesis', 'AX7',
    ['Piciete', 'Nicotiana rustica', 'Mambe', 'tabac aztèque', 'alcaloïdes', 'chaux', 'rituel', 'AX-07']
  );

  // ============================================================
  // AX-07 SOUS-PAGE 2 : Culture Olfactive Mexicaine
  // ============================================================
  console.log('\n--- AX-07-SP2 : Culture Olfactive Mexicaine ---');
  await insertEntry(
    'AX-07-MX03', 'ax-07-mx03-culture-olfactive-mexicaine',
    'AX-07 — Culture Olfactive Mexicaine : Notes de Recherche',
    "Notes de recherche sur la culture olfactive mexicaine : sahumerios (fumigations de copal), offrandes aromatiques aux dieux, paysages olfactifs des fêtes religieuses, concept náhuatl ahuiaya (sentir bon = être heureux). Tableau des matières aromatiques rituelles (copal, hule, tabac, fleurs).",
    `## Concepts Clés

**Sahumerios** : fumigations rituelles de copal. Événements marquant le rythme de la vie religieuse nahua. L'"ofrenda de fuego" consistait à jeter du copal dans un encensoir rempli de braises, à l'approcher des images des dieux, puis à le diriger vers les quatre directions du monde.

### Fréquence rituelle
- Chaque foyer : avant l'aube, quotidiennement
- Temples : 4 fois le jour, 5 fois la nuit (pour le dieu solaire et le Seigneur de la Nuit)

### Paysages olfactifs des fêtes religieuses
- Sahumerios (fumigations de copal)
- Émanations des sacrifices humains (odeur de sang frais)
- Arômes de plantes et fleurs (variaient selon les saisons et les divinités)
- Offrandes alimentaires (le "vaho" - vapeur - était destiné aux dieux)

## Concept Linguistique Clé

En náhuatl, parenté entre **ahuiaya** ("oler bien", "exhalar fragancia") et **ahuia** ("alegrarse", "estar contento", "estar satisfecho").

**→ Sentir bon = être heureux. L'odorat comme vecteur de bien-être cosmique.**

## Matières Aromatiques Rituelles

| Matière | Usage | Notes |
|---|---|---|
| Copal | Sahumerios, offrandes | Résine principale, "sang des arbres" |
| Hule (caoutchouc) | Brûlé dans les encensoirs | Associé aux divinités |
| Tabac | Première offrande mythique | Importance rituelle majeure |
| Fleurs variées | Adornos, ofrendas | Variaient selon les saisons |
| Liquidambar | Résine balsamique | Substitut du copal dans certaines régions |

## Mythe Fondateur

Le mythe mixtèque raconte que l'arôme du tabac fut la **première offrande** que les dieux créateurs reçurent de leurs créatures, en remerciement pour la vie et comme demande pour continuer la création du monde.

**→ Le tabac comme premier langage entre humains et divinités.**

## Implications PERFUMUM

- **Narrative** : positionner les accords tabac/copal comme "langage cosmique"
- **Formulation** : copal + tabac + fleurs = accord mésoaméricain complet
- **Connexion AX-07-MX01** : base conceptuelle pour les 3 recettes prototypes`,
    'analysis', 'AX7',
    ['culture olfactive', 'Mexique', 'náhuatl', 'sahumerios', 'copal', 'tabac', 'rituel', 'AX-07']
  );

  // ============================================================
  // AX-07 SOUS-PAGE 3 : Monde par le Nez
  // ============================================================
  console.log('\n--- AX-07-SP3 : Monde par le Nez ---');
  await insertEntry(
    'AX-07-MX04', 'ax-07-mx04-monde-par-le-nez-mesoamerique',
    'AX-07 — Le Monde par le Nez : Fondements Historiques de la Sensibilité Olfactive en Mésoamérique',
    "Thèse centrale : en Mésoamérique, l'odorat était un sens majeur, canal de communication avec le divin. Les odeurs = forces actives qui nourrissent les dieux, définissent l'espace sacré, guident les âmes. Synesthésie olfactive : odeur = souffle = parole = âme. Dualité fleur/flatulence = vie/mort.",
    `## Thèse Centrale

En Mésoamérique, l'odorat était un sens majeur, canal de communication avec le divin. Les odeurs sont des **forces actives** qui nourrissent les dieux, définissent l'espace sacré, guident les âmes.

**Principes clés :**
- Les dieux se nourrissent d'odeurs (copal, vapeur, sang)
- Dualité fleur/flatulence = vie/mort
- Synesthésie : odeur = souffle = parole = âme
- L'odeur est projective, agit sur le monde

## 1. Les Dieux se Nourrissent d'Odeurs

### 1.1 Le Copal : Nourriture Divine Quotidienne
- **Fréquence** : 4 fois/jour + 5 fois/nuit (Sahagún, *Codex Florentino*)
- **Fonction** : Fumigation pour marquer le temps sacré et nourrir les idoles
- **Résine** : Copal = principale matière olfactive rituelle

### 1.2 La Vapeur des Aliments
Témoignage de Motolinía : la vapeur (*vaho*) montant des plats chauds = portion consommée par les dieux.
**→ L'odeur = substance même de la nourriture divine.**

### 1.3 Hiérarchie des Odeurs Rituelles

| Matière | Fréquence | Contexte | Fonction |
|---|---|---|---|
| Copal | Quotidienne (9×/jour) | Temple, maison | Nourriture divine, rythme sacré |
| Vapeur alimentaire | Chaque offrande | Autel domestique | Portion invisible des dieux |
| Sang | Cérémonies majeures | Temple | Offrande puissante |
| Fleurs | Fêtes saisonnières | Processions | Décoration, offrande |
| Tabac | Rituels chamaniques | Espaces sacrés | Communication divine |

## 2. Synesthésie Olfactive

En náhuatl, le concept d'odeur est intimement lié à :
- **Souffle** (ihiyotl) : force vitale, âme
- **Parole** : les incantations ont une dimension olfactive
- **Âme** : l'odeur du corps = signature de l'âme

**→ Sentir une personne = percevoir son âme.**

## 3. Dualité Fleur/Flatulence

Système binaire mésoaméricain :
- **Fleur** (xochitl) = vie, beauté, sacré, divin
- **Flatulence** = mort, profane, humain, mortel

Cette dualité structure l'espace olfactif rituel : les espaces sacrés doivent sentir la fleur et le copal, jamais les odeurs corporelles.

## Implications PERFUMUM

**Base conceptuelle** pour créer des expériences olfactives chargées de sens, inspirées d'une tradition qui valorise l'odorat comme vecteur cosmique.

- Chaque accord = offrande (intention narrative)
- Copal + fleur = espace sacré (formules rituelles)
- Tabac = langage entre mondes (accords tabac/résine)`,
    'synthesis', 'AX7',
    ['Mésoamérique', 'cosmovision', 'synesthésie olfactive', 'copal', 'dualité', 'âme', 'AX-07', 'philosophie']
  );

  await insertGlossary('Sahumerio', "Fumigation rituelle mésoaméricaine utilisant du copal brûlé dans un encensoir (sahumador). Pratique quotidienne dans les foyers et temples aztèques : 4 fois/jour + 5 fois/nuit dans les temples. Fonction : nourrir les dieux, purifier l'espace, marquer le temps sacré. Équivalent mésoaméricain de l'encensement catholique.", 'concept_perfumum');
  await insertGlossary('Ahuiaya', "Terme náhuatl signifiant 'sentir bon' (exhalar fragancia), étymologiquement lié à ahuia ('être heureux', 'être content'). Concept fondamental de la culture olfactive aztèque : l'odeur agréable est synonyme de bien-être cosmique. Implique que la parfumerie est une pratique de bonheur et de connexion divine.", 'concept_perfumum');

  // ============================================================
  // AX-05 ANNEXE : Molécules de Niche, Interdites ou Disparues
  // ============================================================
  console.log('\n--- AX-05 Annexe : Molécules Niche/Interdites/Disparues ---');
  await insertEntry(
    'AX-05-AN01', 'ax-05-an01-molecules-niche-interdites-disparues',
    'AX-05 — Annexe : Molécules de Niche, Interdites ou Disparues (1834-2026)',
    "Cartographie des molécules ayant marqué l'histoire de la parfumerie avant d'être interdites, restreintes ou abandonnées. 3 vagues d'interdiction majeures (IFRA 1973, 2009, 2019). Molécules clés : Nitromuscs (Musk Ambrette, Musk Tibetene), Oakmoss/Treemoss (IFRA 2009), Lyral, Lilial, Hydroxycitronellal. Opportunité biotechnologique : résurrection par fermentation.",
    `## Contexte

Cette annexe cartographie les molécules ayant marqué l'histoire de la parfumerie avant d'être interdites, restreintes ou abandonnées entre 1834 et 2026. Elle identifie les 3 vagues d'interdiction majeures et les opportunités de résurrection biotechnologique.

## 3 Vagues d'Interdiction IFRA

### Vague 1 — 1973-1990 : Nitromuscs
Les nitromuscs ont été les premiers muscs synthétiques (1888-1920s). Interdits pour neurotoxicité et persistance environnementale.

| Molécule | Année interdiction | Raison | Odeur |
|---|---|---|---|
| Musk Ambrette | 1981 | Phototoxicité, neurotoxicité | Musqué, floral, animal |
| Musk Tibetene | 1981 | Neurotoxicité | Musqué, boisé |
| Musk Moskene | 1981 | Neurotoxicité | Musqué, animal |
| Musk Ambrette | 1995 | Confirmation interdiction | — |

**Impact** : transition forcée vers muscs polycycliques (Galaxolide, Habanolide) puis macrocycliques (Exaltolide, Habanolide).

### Vague 2 — 2009-2015 : Allergènes Naturels
Interdiction/restriction des allergènes naturels majeurs suite aux études SCCS (Scientific Committee on Consumer Safety).

| Molécule | Restriction | Source | Odeur |
|---|---|---|---|
| Oakmoss (Evernia prunastri) | Restriction sévère | Mousse de chêne | Terreux, boisé, humide |
| Treemoss (Evernia furfuracea) | Restriction sévère | Mousse d'arbre | Terreux, boisé |
| Lyral (HICC) | Interdit 2019 | Synthétique | Floral, muguet |
| Hydroxycitronellal | Restriction | Synthétique | Floral, muguet, citronné |

**Impact** : reformulation de centaines de classiques (Chanel N°5, Dior Eau Sauvage, Guerlain Mitsouko).

### Vague 3 — 2019-2026 : Perturbateurs Endocriniens
Restrictions croissantes sur les molécules à activité hormonale.

| Molécule | Statut | Raison |
|---|---|---|
| Lilial (Butylphenyl methylpropional) | Interdit EU 2022 | Perturbateur endocrinien |
| Galaxolide | Restriction croissante | Persistance environnementale |
| Tonalide | Restriction croissante | Bioaccumulation |

## Molécules de Niche : Rares mais Non Interdites

| Molécule | Source | Statut | Odeur |
|---|---|---|---|
| Ambergris (Ambreine) | Cachalot | CITES, très rare | Marin, animal, doux |
| Civette | Civettictis civetta | Interdit (bien-être animal) | Animal, fécal, musqué |
| Castoreum | Castor fiber | Très rare, coûteux | Cuir, animal, fumé |
| Labdanum | Cistus ladanifer | Disponible, cher | Ambré, animal, boisé |
| Oud (Agarwood) | Aquilaria spp. | CITES Annexe II | Boisé, animal, fumé |

## Opportunité Biotechnologique

La biologie synthétique (fermentation en levure/bactérie) permet maintenant de ressusciter ces molécules :
- **Ambroxide** (analogue ambergris) : déjà produit par biotech
- **Muscs macrocycliques** : production fermentative en développement
- **Oakmoss reconstitué** : profil chimique partiellement reproduit

**Positionnement PERFUMUM** : niche "parfums perdus" via collaboration biotech — différenciateur majeur sur le marché premium.`,
    'analysis', 'AX5',
    ['molécules interdites', 'IFRA', 'nitromuscs', 'oakmoss', 'Lyral', 'Lilial', 'biotechnologie', 'AX-05', 'réglementation']
  );

  await insertBiblio('ax05_ifra_2023', 'IFRA Standards — 49th Amendment (2023)', 'https://ifrafragrance.org/standards', 'Standards IFRA 49e amendement : liste complète des restrictions et interdictions de molécules olfactives. Référence réglementaire principale pour la parfumerie mondiale.', 'reglementation');
  await insertBiblio('ax05_sccs_oakmoss', 'SCCS Opinion on Oakmoss and Treemoss (2012)', 'https://ec.europa.eu/health/scientific_committees/consumer_safety', "Opinion du Comité Scientifique sur la Sécurité des Consommateurs (SCCS) sur l'oakmoss et le treemoss. Base scientifique des restrictions IFRA 2009.", 'chimie_olfactive');
  await insertBiblio('ax05_lilial_ban', 'EU Regulation 2021/1902 — Lilial Ban', 'https://eur-lex.europa.eu', "Règlement européen interdisant le Lilial (Butylphenyl methylpropional) dans les produits cosmétiques à partir de mars 2022. Perturbateur endocrinien avéré.", 'reglementation');

  await insertGlossary('Nitromusc', "Famille de muscs synthétiques développés entre 1888 et 1920s (Musk Ambrette, Musk Tibetene, Musk Moskene). Interdits entre 1981 et 1995 pour neurotoxicité et phototoxicité. Premiers muscs synthétiques de l'histoire de la parfumerie, précurseurs des muscs polycycliques et macrocycliques modernes.", 'molecule');
  await insertGlossary('Oakmoss', "Extrait de mousse de chêne (Evernia prunastri) à odeur terrestre, boisée, humide. Ingrédient fondateur des fougères et chypres classiques (Chanel N°5, Guerlain Mitsouko). Sévèrement restreint par IFRA depuis 2009 pour allergénicité (atranol, chloroatranol). Reformulation de centaines de classiques.", 'matiere_premiere');
  await insertGlossary('Lyral (HICC)', "Hydroxyisohexyl 3-cyclohexene carboxaldehyde. Synthétique à odeur florale, muguet. Interdit par l'UE en 2019 pour allergénicité sévère. L'un des allergènes de contact les plus fréquents en parfumerie. Remplacé par Lilial (lui-même interdit en 2022).", 'molecule');

  // ============================================================
  // PF-23 : Base Sources Molécules Disparues
  // ============================================================
  console.log('\n--- PF-23 : Base Sources Molécules Disparues ---');
  await insertEntry(
    'PF-23-SR01', 'pf-23-sr01-base-sources-molecules-disparues',
    'PF-23 — Base Sources : Molécules Disparues et Résurrection Biotechnologique',
    "Base de sources pour la R&D PERFUMUM sur les molécules disparues : archéologie olfactive, plantes éteintes (Silphion/Cyrène), biologie synthétique (ADN ancien → séquençage gènes terpène synthases → expression levure). Projet ODEUROPA (UE). Cas d'école : Ferula drudeana comme candidat Silphion (Miski 2021).",
    `## Objectif

Base de sources pour la R&D PERFUMUM sur les molécules disparues, leur reconstitution et leur résurrection biotechnologique.

## Section I — Recherche Académique

### A. Archéologie Olfactive et Reconstitution

**Focus** : Méthodes de reconstitution de parfums anciens (Égypte, Mésopotamie, Grèce, Rome) à partir de textes, résidus archéologiques et analyses chimiques.

**Projet clé** : **ODEUROPA** (UE) — documentation IA des odeurs historiques européennes.
- Corpus : 500 000+ textes et images historiques
- IA : détection automatique des références olfactives
- Résultat : cartographie des odeurs européennes du XVIe au XXe siècle

### B. Plantes Éteintes et Chimie Perdue

**Enjeu** : Perte irréversible de profils chimiques uniques. Solutions : ADN ancien, biologie synthétique, reconstitution par analogie.

**Cas d'école : Silphion (Cyrène antique)**
- Plante contraceptive et culinaire disparue (~100 AD)
- Valeur : aussi précieuse que l'argent (Pline l'Ancien)
- Candidat identifié : *Ferula drudeana* (Miski 2021, Turquie)
- Profil chimique partiel reconstitué à partir de pièces de monnaie

**Autres plantes éteintes d'intérêt olfactif :**
- *Nardostachys jatamansi* (Nard de Spica) — quasi-éteint, CITES
- *Aquilaria malaccensis* — oud, CR sur liste rouge UICN
- Tabacs héritage américains pré-colonisation

### C. Biologie Synthétique et Résurrection Moléculaire

**Méthode** :
1. Extraction ADN ancien (ambre, spécimens herbier, résidus archéologiques)
2. Séquençage gènes terpène synthases
3. Expression en levure (*Saccharomyces cerevisiae*) ou bactérie (*E. coli*)
4. Production molécules odorantes à l'identique

**Applications actuelles :**
- **Ambroxide** : analogue ambergris produit par fermentation (Firmenich/DSM)
- **Patchoulol** : production fermentative (Givaudan)
- **Santalol** : biosynthèse (Evolva)
- **Muscs macrocycliques** : fermentation en développement

## Section II — Bases de Données & APIs

- **PubChem** : 100M+ molécules, données SMILES, propriétés physico-chimiques
- **ChEBI** : ontologie chimique, données biologiques
- **Leffingwell** : ~3 500 molécules annotées olfactivement
- **DREAM Olfaction** : dataset benchmark ML
- **Reaxys** : base de données réactions chimiques (accès payant)

## Cas d'Usage Prioritaires PERFUMUM

1. **Reconstitution profils historiques** : tabac, cannabis, résines
2. **Validation analytique** : GC-MS, terpènes
3. **Sourcing molécules rares** : Silphion analogue, muscs naturels
4. **Positionnement ultra-premium** : "parfums perdus" comme niche stratégique`,
    'methodology', 'AX5',
    ['molécules disparues', 'biologie synthétique', 'Silphion', 'ODEUROPA', 'archéologie olfactive', 'ADN ancien', 'PF-23', 'fermentation']
  );

  await insertBiblio('pf23_miski_2021', "Miski (2021) — Ferula drudeana : Candidat Silphion de Cyrène", 'https://doi.org/10.3390/plants10020315', "Identification de Ferula drudeana comme candidat botanique du Silphion antique de Cyrène. Analyse comparative morphologique et chimique. Plants, MDPI, 2021.", 'histoire_parfumerie');
  await insertBiblio('pf23_odeuropa', 'Projet ODEUROPA — Documentation IA des Odeurs Historiques Européennes', 'https://odeuropa.eu', "Projet européen (2020-2023) utilisant l'IA pour détecter et cartographier les références olfactives dans 500 000+ textes et images historiques européens (XVIe-XXe siècle).", 'histoire_parfumerie');
  await insertBiblio('pf23_ambroxide_firmenich', 'Firmenich/DSM — Production Biotechnologique Ambroxide', 'https://www.dsm-firmenich.com', "Production fermentative d'Ambroxide (analogue ambergris) par biologie synthétique. Exemple de résurrection moléculaire industrielle.", 'chimie_olfactive');

  await insertGlossary('Silphion', "Plante médicinale et culinaire de Cyrène antique (Libye actuelle), disparue vers 100 AD. Valeur équivalente à l'argent selon Pline l'Ancien. Usages : contraceptif, assaisonnement, parfum. Candidat botanique moderne : Ferula drudeana (Miski 2021). Symbole des arômes perdus irrémédiablement.", 'concept_perfumum');
  await insertGlossary('Biologie synthétique olfactive', "Application de la biologie synthétique à la production de molécules odorantes. Méthode : extraction ADN → séquençage gènes terpène synthases → expression en levure/bactérie → fermentation. Permet la résurrection de molécules disparues (Silphion), la production durable de molécules rares (Ambroxide, Patchoulol, Santalol) et l'alternative aux sources animales (Ambergris, Civette).", 'technique');
  await insertGlossary('ODEUROPA', "Projet de recherche européen (2020-2023) utilisant l'IA pour documenter les odeurs historiques européennes. Corpus : 500 000+ textes et images du XVIe au XXe siècle. Résultat : cartographie des odeurs européennes, identification des plantes et matières aromatiques historiques. Ressource fondamentale pour l'archéologie olfactive.", 'concept_perfumum');

  // ============================================================
  // CIGARETTES DISPARUES
  // ============================================================
  console.log('\n--- Cigarettes Disparues ---');
  await insertEntry(
    'TAB-CD01', 'tab-cd01-cigarettes-disparues-recherche',
    'Recherche sur les Cigarettes Disparues — Marques Iconiques Discontinuées',
    "Inventaire des marques de cigarettes discontinuées ou interdites : américaines (Old Gold/Latakia, Chesterfield, Alpine), françaises (Gitanes, Gauloises, Bastos), interdites en France (Vogue, Fine, Allure, Corset), soviétiques. Tendances : interdictions réglementaires, paquets neutres, consolidation industrielle. Potentiel PERFUMUM : profils olfactifs historiques à reconstituer.",
    `## Marques Iconiques Discontinuées

### Américaines
| Marque | Fabricant | Statut | Profil Olfactif |
|---|---|---|---|
| **Old Gold** | Lorillard | Discontinué ~1975 (pub) | American Blend + Latakia (unique) |
| **Chesterfield** | Liggett & Myers | Discontinué | American Blend classique |
| **Alpine** | Philip Morris USA | Discontinué 2016 | Menthol |
| **Bristol** | Philip Morris USA | Discontinué 2016 | American Blend |
| **Fact** | — | Disparu | — |
| **Lemmon Twist** | — | Disparu | Citronné |
| **Moore 120** | — | Disparu | — |

### Françaises
| Marque | Statut | Notes |
|---|---|---|
| **Gitanes** | Paquet neutre 2015 | Tabac brun français, notes terreuses |
| **Gauloises** | Paquet neutre 2015 | Tabac brun, notes fumées |
| **Bastos** | Disparu | Tabac brun, marché belge/français |

### Interdites en France (Noms Glamour)
| Marque | Raison |
|---|---|
| **Vogue** | Nom glamour interdit |
| **Fine** | Nom glamour interdit |
| **Allure** | Nom glamour interdit |
| **Corset** | Nom glamour interdit |

### Autres
- **Eve** : cigarettes pour femmes
- **Virginia Slims** : toujours produit mais moins visible
- **Kool non-filter** : version sans filtre disparue
- **L.A. Lights** (Djarum, Indonésie) : 1996

## Tendances Identifiées

1. **Interdictions réglementaires** : noms glamour interdits (Vogue, Allure)
2. **Paquets neutres** : fin des identités visuelles fortes (France 2015)
3. **Consolidation industrielle** : disparition de marques lors de fusions
4. **Changement de goûts** : déclin des cigarettes sans filtre
5. **Cigarettes menthol** : interdites dans plusieurs pays (EU 2020)

## Cas Détaillé : Old Gold (Lorillard)

**Histoire** : lancée en avril 1926 par Lorillard Co. Première cigarette enveloppée dans du cellophane. Première cigarette blendée avec du **Latakia aromatique** (tabac fumé au bois de chêne) — unique pour une cigarette américaine.

**Profil olfactif** : American Blend + Latakia → notes fumées, boisées, complexes, légèrement médicinales.

**Potentiel PERFUMUM : Très Élevé** — histoire unique, utilisation du Latakia dans un contexte américain, profil de combustion documentable.

## Implications PERFUMUM

- **Reconstitution** : profils olfactifs historiques (Old Gold/Latakia, Gitanes tabac brun)
- **Archive** : documentation des "cigarettes perdues" comme patrimoine olfactif industriel
- **Formulation** : accords tabac inspirés de ces profils (Latakia américain, tabac brun français)
- **Connexion AS-03** : protocoles de combustion spécifiques à ces blends`,
    'analysis', 'AX3',
    ['cigarettes disparues', 'Old Gold', 'Latakia', 'Gitanes', 'Gauloises', 'tabac', 'patrimoine', 'réglementation']
  );

  // ============================================================
  // Liaisons plante-molécule pour les 4 plantes mésoaméricaines
  // ============================================================
  console.log('\n--- Liaisons plante-molécule mésoaméricaines ---');

  const plantMolLinks = [
    // Bursera copallifera (Copal negro)
    { plantName: 'Copal negro', molecules: [
      { name: 'α-Pinène', pct: 32.0, notes: 'Molécule principale du copal negro (25-40%)' },
      { name: 'Limonène', pct: 17.5, notes: 'Composant secondaire (15-20%)' },
      { name: 'p-Cymène', pct: 7.5, notes: 'Composant tertiaire (5-10%)' },
    ]},
    // Tagetes lucida (Pericón)
    { plantName: 'Pericón / Yauhtli', molecules: [
      { name: 'Estragole', pct: 70.0, notes: 'Molécule dominante du pericón (60-80%)' },
      { name: 'Anéthole', pct: 12.5, notes: 'Composant secondaire (10-15%)' },
      { name: 'Méthyl-chavicol', pct: 5.0, notes: 'Isomère de l\'estragole' },
    ]},
    // Nicotiana rustica (Tabac aztèque)
    { plantName: 'Tabac aztèque / Piciete', molecules: [
      { name: 'Nornicotine', pct: 50.0, notes: 'Alcaloïde principal N. rustica (40-60% des alcaloïdes)' },
      { name: 'Anabasine', pct: 15.0, notes: 'Alcaloïde secondaire (10-20%)' },
      { name: 'Pyridine', pct: 3.0, notes: 'Produit de combustion, note tabac' },
      { name: 'Furfural', pct: 2.0, notes: 'Produit de pyrolyse, note caramel' },
    ]},
    // Liquidambar styraciflua
    { plantName: 'Liquidambar', molecules: [
      { name: 'Styrène', pct: 20.0, notes: 'Composant principal résine liquidambar (15-25%)' },
      { name: 'Cinnamaldéhyde', pct: 15.0, notes: 'Note épicée, cannelle (10-20%)' },
      { name: 'Vanilline', pct: 7.5, notes: 'Note vanillée, balsamique (5-10%)' },
    ]},
  ];

  let linksCreated = 0;
  for (const { plantName, molecules } of plantMolLinks) {
    const [plants] = await conn.execute("SELECT id FROM plants WHERE name=? LIMIT 1", [plantName]);
    if (!plants.length) { console.log('  Plante non trouvée:', plantName); continue; }
    const plantId = plants[0].id;

    for (const mol of molecules) {
      const [mols] = await conn.execute("SELECT id FROM molecules WHERE name LIKE ? LIMIT 1", [`%${mol.name}%`]);
      if (!mols.length) { console.log('  Molécule non trouvée:', mol.name); continue; }
      const molId = mols[0].id;

      const [ex] = await conn.execute("SELECT plant_id FROM plant_molecules WHERE plant_id=? AND molecule_id=? LIMIT 1", [plantId, molId]);
      if (ex.length) { console.log(`  Lien déjà existant: ${plantName} → ${mol.name}`); continue; }

      await conn.execute(
        "INSERT INTO plant_molecules (plant_id, molecule_id, percentage, notes, created_at) VALUES (?,?,?,?,NOW())",
        [plantId, molId, mol.pct, mol.notes]
      );
      console.log(`  + Lien: ${plantName} → ${mol.name} (${mol.pct}%)`);
      linksCreated++;
    }
  }

  // Résumé final
  const [totalRE] = await conn.execute("SELECT COUNT(*) as c FROM research_entries");
  const [totalB] = await conn.execute("SELECT COUNT(*) as c FROM bibliography_entries");
  const [totalG] = await conn.execute("SELECT COUNT(*) as c FROM glossary_terms");
  const [totalPM] = await conn.execute("SELECT COUNT(*) as c FROM plant_molecules");

  console.log('\n=== Résumé Final ===');
  console.log('research_entries:', totalRE[0].c);
  console.log('bibliography_entries:', totalB[0].c);
  console.log('glossary_terms:', totalG[0].c);
  console.log('liaisons plante-molécule:', totalPM[0].c);
  console.log('nouveaux liens créés:', linksCreated);

  await conn.end();
}

main().catch(console.error);
