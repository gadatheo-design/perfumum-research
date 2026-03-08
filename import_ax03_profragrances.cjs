// Import tech-note Pro-fragrances depuis AX-03-70 Raretés Aromatiques
const mysql = require('mysql2/promise');
require('dotenv').config();

const CONTENT = `## Définition opératoire

Une *pro-fragrance* est un **précurseur covalent** (souvent **moins volatil** et parfois **peu odorant**) qui **libère un odorant actif** par **clivage de liaison** sous des conditions compatibles avec l'usage (réactions "douces").

Objectif : **décaler** la libération vers une phase d'usage (rinçage, séchage, port sur textile/peau) et/ou **prolonger** la perception.

## 1) Déclencheurs ("triggers") utilisables en conditions domestiques

- **Hydrolyse** (souvent corrélée à un **changement de pH**) : esters, carbonates, acétals, etc.
- **Enzymes / micro-organismes** : estérases, lipases, glycosidases, etc.
- **Lumière** : photolyse ou photo-oxydation de groupes sensibles.
- **Oxydation (O₂ air)** : activation lente post-déposition.
- **Température** : accélère cinétique/équilibres ; utile surtout en combinaison.
- **Friction** : plutôt un déclencheur physique (abrasion, échauffement local) qu'un mécanisme chimique unique, à distinguer des microcapsules.

## 2) Repère historique (commercialisation)

Les pro-fragrances sont rapportées comme **commercialisées dès le milieu des années 1990**, avant l'adoption large des microcapsules dans les grandes marques.

Exemple cité : **digeranyl succinate** utilisé en **adoucissants**, libérant **géraniol** via des **lipases** (issues des détergents et encore présentes au rinçage).

## 3) Contraintes de design

- **Stabilité au stockage** vs **réactivité en usage** : clivage trop rapide = perte "avant usage" ; trop lent = pas d'effet.
- **Compatibilité matrice** : eau, surfactants, oxydants, enzymes, sels.
- **Sous-produits** : innocuité, odeur parasite, biodégradabilité.
- **Cinétique** : besoin d'un profil de libération mesurable (HS-GC, textiles panels, etc.).

## 4) Lien avec encapsulation

- **Pro-fragrance** : une molécule (ou mélange) qui libère une matière ciblée.
- **Microencapsulation** : contenant qui protège un parfum complet et le relargue (souvent par friction/rupture).
- En pratique : technologies **complémentaires**, sélection selon matrice, coûts, contraintes réglementaires.

## Molécule exemple

**Digeranyl succinate** → libère **géraniol** via lipases (estérases de détergents). Utilisé en adoucissants textiles.`;

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

  console.log('=== Import Tech-note Pro-fragrances (AX-03) ===');

  // 1. Trouver l'axe AX3
  const [axes] = await conn.execute("SELECT id FROM research_axes WHERE code IN ('AX-03','AX3') LIMIT 1");
  const axisId = axes.length ? axes[0].id : null;
  console.log('Axe id:', axisId);

  // 2. Créer ou mettre à jour la research_entry
  const entryCode = 'AX-03-TN01';
  const slug = 'ax-03-tn01-pro-fragrances-liberation-declenchee';
  const title = 'Tech-note — Pro-fragrances : libération déclenchée (1990s →)';
  const summary = "Une pro-fragrance est un précurseur covalent qui libère un odorant actif par clivage de liaison sous des conditions compatibles avec l'usage (hydrolyse, enzymes, lumière, oxydation, température, friction). Commercialisées dès le milieu des années 1990. Exemple : digeranyl succinate libère géraniol via lipases.";
  const tags = JSON.stringify(['pro-fragrance', 'libération contrôlée', 'précurseur', 'encapsulation', 'chimie', 'AX-03', 'technologie', 'digeranyl succinate', 'géraniol']);

  const [existing] = await conn.execute("SELECT id FROM research_entries WHERE entry_code = ?", [entryCode]);

  let entryId;
  if (existing.length) {
    entryId = existing[0].id;
    await conn.execute(
      "UPDATE research_entries SET title=?, summary=?, content=?, tags=?, updated_at=NOW() WHERE id=?",
      [title, summary, CONTENT, tags, entryId]
    );
    console.log('Mise à jour entry:', entryCode);
  } else {
    const [result] = await conn.execute(
      "INSERT INTO research_entries (entry_code, slug, title, summary, content, entry_type, status, tags, axis_id, primary_axis_id, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,NOW(),NOW())",
      [entryCode, slug, title, summary, CONTENT, 'note', 'completed', tags, axisId, axisId]
    );
    entryId = result.insertId;
    console.log('+ Créé research_entry:', entryCode, 'id:', entryId);
  }

  // 3. Bibliographies
  const biblio = [
    {
      title: 'Profragrance Chemistry as an Interdisciplinary Research',
      url: 'https://www.chimia.ch/chimia/article/download/2017_414/948/11603',
      notes: 'Cadrage "profragrance/properfume" et liste de triggers "mild" (hydrolyse, enzymes, lumière, oxydation, température). Chimia 2017.'
    },
    {
      title: 'Mechanically Interlocked Profragrances for the Controlled Release of Scents',
      url: 'https://pubs.acs.org/doi/10.1021/acs.joc.1c01725',
      notes: 'Revue sur pro-fragrances et libération contrôlée (défis stabilité/toxico/biodégradabilité). J. Org. Chem. 2021. DOI: 10.1021/acs.joc.1c01725'
    }
  ];

  // Vérifier les colonnes de bibliographies
  let biblioCreated = 0;
  for (const b of biblio) {
    const [existB] = await conn.execute("SELECT id FROM bibliography_entries WHERE url = ? LIMIT 1", [b.url]);
    if (existB.length) {
      console.log('  Biblio déjà existante:', b.title.substring(0, 50));
      continue;
    }
    const ekey = 'profragrance_' + Date.now() + '_' + Math.random().toString(36).slice(2,6);
    await conn.execute(
      "INSERT INTO bibliography_entries (entry_key, title, url, notes, entry_type, research_domain, read_status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,NOW(),NOW())",
      [ekey, b.title, b.url, b.notes, 'article', 'chimie_olfactive', 'unread']
    );
    biblioCreated++;
    console.log('  + Biblio créée:', b.title.substring(0, 60));
  }

  // 4. Terme glossaire Pro-fragrance
  const [gcols] = await conn.execute("SHOW COLUMNS FROM glossary_terms");
  const gColNames = gcols.map(c => c.Field);
  const [existGloss] = await conn.execute("SELECT id FROM glossary_terms WHERE term LIKE '%Pro-fragrance%' LIMIT 1");
  if (!existGloss.length) {
    const gFields = ['term', 'definition', 'created_at'];
    const gVals = [
      'Pro-fragrance',
      "Précurseur covalent (souvent moins volatil et parfois peu odorant) qui libère un odorant actif par clivage de liaison sous des conditions compatibles avec l'usage (hydrolyse, enzymes, lumière, oxydation, température, friction). Objectif : décaler et prolonger la libération olfactive vers une phase d'usage spécifique. Commercialisées dès le milieu des années 1990. Exemple : digeranyl succinate libère géraniol via lipases.",
      new Date()
    ];
    if (gColNames.includes('category')) { gFields.push('category'); gVals.push('technique'); }
    if (gColNames.includes('source')) { gFields.push('source'); gVals.push('AX-03-TN01'); }
    if (gColNames.includes('language')) { gFields.push('language'); gVals.push('fr'); }
    if (gColNames.includes('updated_at')) { gFields.push('updated_at'); gVals.push(new Date()); }
    const gPh = gFields.map(() => '?').join(', ');
    await conn.execute(`INSERT INTO glossary_terms (${gFields.join(', ')}) VALUES (${gPh})`, gVals);
    console.log('  + Terme glossaire créé: Pro-fragrance');
  }

  // Résumé
  const [totalRE] = await conn.execute("SELECT COUNT(*) as c FROM research_entries");
  const [totalB] = await conn.execute("SELECT COUNT(*) as c FROM bibliography_entries");
  const [totalG] = await conn.execute("SELECT COUNT(*) as c FROM glossary_terms");
  console.log('\n=== Résumé ===');
  console.log('research_entries total:', totalRE[0].c);
  console.log('bibliographies total:', totalB[0].c, '(+' + biblioCreated + ' nouvelles)');
  console.log('glossary_terms total:', totalG[0].c);

  await conn.end();
}

main().catch(console.error);
