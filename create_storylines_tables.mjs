import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

try {
  await conn.execute(`CREATE TABLE IF NOT EXISTS storylines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    subtitle VARCHAR(500),
    description TEXT,
    narrative_axis VARCHAR(50) DEFAULT 'autre',
    period_label VARCHAR(100),
    period_start_year INT,
    period_end_year INT,
    geographic_scope VARCHAR(255),
    status VARCHAR(20) DEFAULT 'draft',
    cover_image_url VARCHAR(500),
    wikidata_id VARCHAR(50),
    created_at BIGINT NOT NULL DEFAULT 0,
    updated_at BIGINT NOT NULL DEFAULT 0
  )`);
  console.log('✓ Table storylines créée');

  await conn.execute(`CREATE TABLE IF NOT EXISTS story_elements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    storyline_id INT NOT NULL,
    entity_type VARCHAR(30) NOT NULL,
    entity_id INT NOT NULL,
    role_in_story VARCHAR(30) DEFAULT 'context',
    narrative_note TEXT,
    sequence_order INT DEFAULT 0,
    created_at BIGINT NOT NULL DEFAULT 0,
    FOREIGN KEY (storyline_id) REFERENCES storylines(id) ON DELETE CASCADE
  )`);
  console.log('✓ Table story_elements créée');

  // Insérer quelques fils narratifs de départ
  const now = Date.now();
  const seedStorylines = [
    {
      title: 'La Route de l\'Encens',
      slug: 'route-encens',
      subtitle: 'Du Yémen à Rome — 3000 ans de commerce olfactif',
      description: 'L\'encens de Boswellia sacra et la myrrhe de Commiphora myrrha ont structuré les routes commerciales de l\'Antiquité, reliant l\'Arabie du Sud à la Méditerranée. Ce fil narratif retrace les plantes, molécules et usages rituels de cette route fondatrice.',
      narrative_axis: 'route_encens',
      period_label: '-3000 à +400 ap. J.-C.',
      period_start_year: -3000,
      period_end_year: 400,
      geographic_scope: 'Yémen, Oman, Égypte, Rome, Grèce',
      status: 'active',
    },
    {
      title: 'Tabac et Rituel Amérindien',
      slug: 'tabac-rituel-amerindien',
      subtitle: 'Nicotiana rustica et les cérémonies des Premières Nations',
      description: 'Avant la colonisation, le tabac était une plante sacrée utilisée dans les rituels de communication avec les esprits. Ce fil retrace l\'usage de Nicotiana rustica (tabac sacré), ses molécules actives (nicotine, harmane, norharman) et les transformations induites par la combustion.',
      narrative_axis: 'tabac_rituel',
      period_label: '-2000 à 1600',
      period_start_year: -2000,
      period_end_year: 1600,
      geographic_scope: 'Amazonie, Mésoamérique, Amérique du Nord',
      status: 'active',
    },
    {
      title: 'Nardostachys — Le Nard Perdu',
      slug: 'nardostachys-nard-perdu',
      subtitle: 'De l\'onguent de Marie à la disparition programmée',
      description: 'Le nard (Nardostachys jatamansi) est mentionné dans l\'Évangile de Jean comme l\'onguent précieux versé sur les pieds du Christ. Aujourd\'hui classé CR (Critique) par l\'UICN, cette plante himalayenne est au bord de l\'extinction. Ce fil retrace son histoire olfactive et sa menace actuelle.',
      narrative_axis: 'plantes_menacees',
      period_label: '-500 à aujourd\'hui',
      period_start_year: -500,
      period_end_year: 2026,
      geographic_scope: 'Himalaya, Inde, Népal, Tibet',
      status: 'active',
    },
    {
      title: 'Burkina Faso — Combustion Lente',
      slug: 'burkina-faso-combustion-lente',
      subtitle: 'Encens sahéliens et résines de la savane soudanienne',
      description: 'Dans la savane soudanienne, les résines de Daniellia oliveri, Boswellia dalzielii et Vitex doniana sont brûlées lentement pour purifier les espaces rituels. Ce corpus de 112 plantes documentées révèle une tradition olfactive sahélienne distincte du corpus méditerranéen.',
      narrative_axis: 'corpus_regional',
      period_label: 'XIIe siècle à aujourd\'hui',
      period_start_year: 1200,
      period_end_year: 2026,
      geographic_scope: 'Burkina Faso, Mali, Niger, Sénégal',
      status: 'active',
    },
    {
      title: 'Atlas Mnémosyne — Mémoire Olfactive',
      slug: 'atlas-mnemosyne',
      subtitle: 'Cartographie des odeurs perdues et retrouvées',
      description: 'Inspiré du projet Mnemosyne d\'Aby Warburg, cet atlas cartographie les odeurs qui ont marqué l\'histoire humaine — des résines funéraires égyptiennes aux parfums de la Belle Époque. Chaque fil narratif est un panneau de cet atlas en construction permanente.',
      narrative_axis: 'atlas_mnemosyne',
      period_label: '-3000 à 2026',
      period_start_year: -3000,
      period_end_year: 2026,
      geographic_scope: 'Monde',
      status: 'draft',
    }
  ];

  for (const s of seedStorylines) {
    await conn.execute(
      `INSERT IGNORE INTO storylines (title, slug, subtitle, description, narrative_axis, period_label, period_start_year, period_end_year, geographic_scope, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.title, s.slug, s.subtitle, s.description, s.narrative_axis, s.period_label, s.period_start_year, s.period_end_year, s.geographic_scope, s.status, now, now]
    );
  }
  console.log(`✓ ${seedStorylines.length} fils narratifs de départ insérés`);

  const [count] = await conn.execute('SELECT COUNT(*) as n FROM storylines');
  console.log('Total storylines:', count[0].n);

} finally {
  await conn.end();
}
