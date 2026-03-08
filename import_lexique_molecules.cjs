// Import Lexique Olfactif Multilingue AX-05 + Molécules manquantes mésoaméricaines
const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const url = new URL(process.env.DATABASE_URL);
  const conn = await mysql.createConnection({
    host: url.hostname, port: parseInt(url.port) || 3306,
    user: url.username, password: url.password,
    database: url.pathname.slice(1), ssl: { rejectUnauthorized: false }
  });

  console.log('=== Import Lexique Multilingue + Molécules Mésoaméricaines ===');

  // Récupérer l'axe AX5
  const [axes] = await conn.execute("SELECT id, code FROM research_axes ORDER BY code");
  const axisMap = {};
  axes.forEach(a => { axisMap[a.code] = a.id; });

  async function insertEntry(code, slug, title, summary, content, type, axisCode, tags) {
    const [ex] = await conn.execute("SELECT id FROM research_entries WHERE entry_code=?", [code]);
    const axisId = axisMap[axisCode] || axisMap['AX5'] || 1;
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

  async function insertGlossary(term, definition, category) {
    const [ex] = await conn.execute("SELECT id FROM glossary_terms WHERE term=? LIMIT 1", [term]);
    if (ex.length) { console.log('    Glossaire déjà:', term); return; }
    const [cols] = await conn.execute("SHOW COLUMNS FROM glossary_terms");
    const colNames = cols.map(c => c.Field);
    const fields = ['term', 'definition', 'created_at'];
    const vals = [term, definition, new Date()];
    if (colNames.includes('category')) { fields.push('category'); vals.push(category); }
    if (colNames.includes('updated_at')) { fields.push('updated_at'); vals.push(new Date()); }
    await conn.execute(`INSERT INTO glossary_terms (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`, vals);
    console.log('    + Glossaire:', term);
  }

  // ============================================================
  // LEXIQUE OLFACTIF MULTILINGUE AX-05
  // ============================================================
  console.log('\n--- Lexique Olfactif Multilingue ---');
  await insertEntry(
    'AX-05-LX01', 'ax-05-lx01-lexique-olfactif-multilingue',
    'AX-05 — Lexique Olfactif Multilingue : Farsi, Mandarin, Espagnol',
    "Lexique trilingue des termes olfactifs en farsi (persan), mandarin (chinois) et espagnol. Termes généraux, notes olfactives, matières premières traditionnelles et concepts philosophiques. Outil de référence pour la formulation interculturelle PERFUMUM.",
    `## Introduction

Ce lexique trilingue rassemble les termes olfactifs fondamentaux en **farsi (persan)**, **mandarin (chinois)** et **espagnol**, avec leurs translittérations et contextes culturels. Outil de référence pour la formulation interculturelle PERFUMUM.

---

## 1. Farsi (Persan) — فارسی

### Termes généraux

| Farsi | Translittération | Français | Contexte |
|---|---|---|---|
| عطر | etr | Parfum | Terme général |
| بوی خوش | bu-ye khosh | Bonne odeur | Expression courante |
| عطرسازی | etrsazi | Parfumerie (métier) | Fabrication |
| گلاب | golab | Eau de rose | Produit traditionnel |
| عنبر | anbar | Ambre | Matière précieuse |
| مشک | moshk | Musc | Note animale |
| تقطیر | taghtir | Distillation | Technique |

### Notes olfactives

| Farsi | Translittération | Français |
|---|---|---|
| گلی | goli | Floral |
| چوبی | chubi | Boisé |
| رزینی | rezini | Résineux |
| شیرین | shirin | Sucré, doux |
| تلخ | talkh | Amer |
| تند | tond | Piquant, fort |
| سبک | sabok | Léger |
| سنگین | sangin | Lourd |

### Matières premières traditionnelles

| Farsi | Translittération | Français | Nom scientifique |
|---|---|---|---|
| گل سرخ | gol-e sorkh | Rose | *Rosa damascena* |
| یاس | yas | Jasmin | *Jasminum* |
| زعفران | za'faran | Safran | *Crocus sativus* |
| باریجه | barije | Galbanum | *Ferula gummosa* |
| عود | ud | Oud, bois d'agar | *Aquilaria* |
| سندل | sandal | Santal | *Santalum* |

---

## 2. Mandarin (Chinois) — 中文

### Termes généraux

| Chinois simplifié | Pinyin | Français | Contexte |
|---|---|---|---|
| 香水 | xiāngshuǐ | Parfum | Moderne, occidental |
| 香气 | xiāngqì | Arôme, senteur | Général |
| 香料 | xiāngliào | Matière aromatique | Épices, aromates |
| 香 | xiāng | Encens, parfumé | Traditionnel |
| 调香师 | tiáoxiāngshī | Parfumeur (nez) | Métier |
| 蒸馏 | zhēngliú | Distillation | Technique |
| 精油 | jīngyóu | Huile essentielle | Produit |

### Notes olfactives

| Chinois | Pinyin | Français |
|---|---|---|
| 花香 | huāxiāng | Floral |
| 木香 | mùxiāng | Boisé |
| 果香 | guǒxiāng | Fruité |
| 柑橘 | gānjú | Citrus, agrume |
| 清新 | qīngxīn | Frais |
| 浓郁 | nóngyù | Intense, riche |
| 淡雅 | dànyǎ | Léger, élégant |
| 温暖 | wēnnuǎn | Chaud |

### Matières premières traditionnelles

| Chinois | Pinyin | Français | Nom scientifique |
|---|---|---|---|
| 沉香 | chénxiāng | Bois d'agar, oud | *Aquilaria* |
| 桂花 | guìhuā | Osmanthus | *Osmanthus fragrans* |
| 茉莉 | mòlì | Jasmin | *Jasminum sambac* |
| 檀香 | tánxiāng | Santal | *Santalum* |
| 龙涎香 | lóngxiánxiāng | Ambre gris | Cétacé |
| 麝香 | shèxiāng | Musc | Animal/synthétique |
| 乌龙茶 | wūlóngchá | Thé oolong | *Camellia sinensis* |

### Concepts philosophiques

| Chinois | Pinyin | Français | Signification |
|---|---|---|---|
| 香道 | xiāng dào | La voie de l'encens | Art cérémoniel de l'encens |
| 闻香 | wénxiāng | Sentir, apprécier l'arôme | Acte conscient, méditatif |

---

## 3. Espagnol — Español

### Termes généraux

| Espagnol | Français | Contexte |
|---|---|---|
| Perfume | Parfum | Général |
| Fragancia | Fragrance | Industrie |
| Aroma | Arôme | Naturel |
| Esencia | Essence | Concentré |
| Perfumista | Parfumeur | Métier |
| Olfato | Odorat | Sens |
| Destilación | Distillation | Technique |
| Absoluto | Absolu | Extraction |

### Notes olfactives

| Espagnol | Français |
|---|---|
| Floral | Floral |
| Amaderado | Boisé |
| Cítrico | Citrus |
| Especiado | Épicé |
| Terroso | Terreux |
| Ahumado | Fumé |
| Dulce | Sucré |
| Fresco | Frais |
| Balsámico | Balsamique |
| Animalico | Animal |

### Matières premières traditionnelles

| Espagnol | Français | Nom scientifique | Région |
|---|---|---|---|
| Copal | Copal | *Bursera* spp. | Mésoamérique |
| Palo santo | Bois saint | *Bursera graveolens* | Amérique du Sud |
| Vainilla | Vanille | *Vanilla planifolia* | Mexique |
| Tabaco | Tabac | *Nicotiana tabacum* | Amériques |
| Canela | Cannelle | *Cinnamomum verum* | Asie/Caraïbes |
| Cedro | Cèdre | *Cedrus* spp. | Méditerranée |
| Ylang ylang | Ylang-ylang | *Cananga odorata* | Asie tropicale |

### Concepts culturels

| Espagnol | Français | Contexte |
|---|---|---|
| Sahumerio | Fumigation rituelle | Mésoamérique, Andes |
| Curanderismo | Guérison chamanique | Amérique Latine |
| Flor de muerto | Fleur des morts | Cempasúchil, Jour des Morts |

---

## Implications PERFUMUM

- **Formulation interculturelle** : adapter les descripteurs olfactifs selon le marché cible (Iran, Chine, LATAM)
- **Narrative** : utiliser les termes locaux dans les fiches produits pour créer une résonance culturelle
- **Connexion AX-05** : base pour les stratégies de formulation par région (tableaux d'acceptation des synthétiques)
- **Connexion AX-07** : sahumerio, copal, tabac → vocabulaire mésoaméricain intégré`,
    'review', 'AX5',
    ['lexique', 'multilingue', 'farsi', 'mandarin', 'espagnol', 'interculturel', 'AX-05', 'descripteurs olfactifs']
  );

  // Termes glossaire multilingues
  await insertGlossary('Xiāng Dào (香道)', "Terme mandarin signifiant 'La Voie de l'Encens'. Art cérémoniel chinois de l'encens, équivalent olfactif du Chado (cérémonie du thé). Pratique méditative où l'appréciation consciente des arômes d'encens est une discipline spirituelle. Concept fondateur de la culture olfactive chinoise traditionnelle.", 'concept_perfumum');
  await insertGlossary('Etr (عطر)', "Terme farsi (persan) désignant le parfum. Racine sémitique 'itr, commune à l'arabe عطر (itr) et à l'hébreu. Désigne à la fois le parfum comme produit et l'acte de parfumer. Lié à la tradition de la parfumerie persane (Ispahan, Shiraz) et à la Rose de Damas (golab).", 'concept_perfumum');
  await insertGlossary('Sahumerio', "Terme espagnol désignant la fumigation rituelle aromatique, pratiquée en Mésoamérique (copal) et dans les Andes (palo santo, herbes aromatiques). Équivalent du sahumerio aztèque, du smudging amérindien et de l'encensement catholique. Pratique de purification et de communication avec le divin par la fumée parfumée.", 'concept_perfumum');

  // ============================================================
  // MOLÉCULES MANQUANTES MÉSOAMÉRICAINES
  // ============================================================
  console.log('\n--- Molécules manquantes mésoaméricaines ---');

  const newMolecules = [
    {
      name: 'α-Pinène', cas: '80-56-8', formula: 'C10H16', mw: 136.23,
      smiles: 'CC1=CCC2CC1C2(C)C',
      iupac: '(1S,5S)-2,6,6-trimethylbicyclo[3.1.1]hept-2-ene',
      chemical_class: 'monoterpene',
      olfactive_family: 'boisé',
      odor_description: 'Pin, résineux, frais, boisé, térébenthiné',
      notes: 'Monoterpène bicyclique le plus abondant dans la nature. Principal composant de l\'essence de térébenthine, des résines de conifères et du copal. Présent dans plus de 400 plantes aromatiques.',
      source: 'Conifères, copal (Bursera spp.), genévrier, romarin, sauge'
    },
    {
      name: 'p-Cymène', cas: '99-87-6', formula: 'C10H14', mw: 134.22,
      smiles: 'Cc1ccc(C(C)C)cc1',
      iupac: '1-methyl-4-propan-2-ylbenzene',
      chemical_class: 'monoterpene',
      olfactive_family: 'épicé',
      odor_description: 'Épicé, boisé, citronné, légèrement médicamenteux',
      notes: 'Monoterpène aromatique (benzène substitué). Précurseur du thymol et du carvacrol. Présent dans le thym, la sarriette, le cumin et de nombreuses résines.',
      source: 'Thym, sarriette, cumin, copal, ajowan'
    },
    {
      name: 'Cinnamaldéhyde', cas: '104-55-2', formula: 'C9H8O', mw: 132.16,
      smiles: 'O=C/C=C/c1ccccc1',
      iupac: '(E)-3-phenylprop-2-enal',
      chemical_class: 'aldehyde',
      olfactive_family: 'épicé',
      odor_description: 'Cannelle, épicé, chaud, doux, légèrement boisé',
      notes: 'Aldéhyde phénylpropanoïde responsable de l\'odeur caractéristique de la cannelle. Principal composant de l\'écorce de Cinnamomum verum (65-90%). Présent aussi dans le liquidambar et le styrax.',
      source: 'Cannelle (Cinnamomum verum), liquidambar, styrax, cassia'
    },
    {
      name: 'Nornicotine', cas: '494-97-3', formula: 'C9H12N2', mw: 148.20,
      smiles: 'C1CCN(C1)c1cccnc1',
      iupac: '3-(pyrrolidin-2-yl)pyridine',
      chemical_class: 'alkaloid',
      olfactive_family: 'tabac',
      odor_description: 'Tabac, légèrement amer, terreux, fumé',
      notes: 'Alcaloïde principal de Nicotiana rustica (40-60% des alcaloïdes totaux, vs 5% dans N. tabacum). Précurseur de la N-nitrosonornicotine (NNN). Activité nicotinique plus faible que la nicotine mais durée d\'action plus longue.',
      source: 'Nicotiana rustica (Mapacho, Piciete), tabacs ancestraux amérindiens'
    },
    {
      name: 'Anabasine', cas: '494-52-0', formula: 'C10H14N2', mw: 162.23,
      smiles: 'C1CCN(CC1)c1cccnc1',
      iupac: '3-(piperidin-2-yl)pyridine',
      chemical_class: 'alkaloid',
      olfactive_family: 'tabac',
      odor_description: 'Tabac, légèrement piquant, terreux',
      notes: 'Alcaloïde secondaire de Nicotiana rustica (10-20% des alcaloïdes). Présent aussi dans Anabasis aphylla (plante de la steppe asiatique). Utilisé comme insecticide naturel. Isomère structural de la nicotine.',
      source: 'Nicotiana rustica, Anabasis aphylla, tabacs ancestraux'
    },
  ];

  let molCreated = 0;
  for (const mol of newMolecules) {
    const [ex] = await conn.execute("SELECT id FROM molecules WHERE name=? OR cas_number=? LIMIT 1", [mol.name, mol.cas]);
    if (ex.length) { console.log('  Molécule déjà:', mol.name); continue; }

    const [cols] = await conn.execute("SHOW COLUMNS FROM molecules");
    const colNames = cols.map(c => c.Field);

    const fields = ['name', 'cas_number', 'molecular_formula', 'molecular_weight', 'smiles', 'iupac_name', 'chemical_class', 'odor_description', 'created_at', 'updated_at'];
    const vals = [mol.name, mol.cas, mol.formula, mol.mw, mol.smiles, mol.iupac, mol.chemical_class, mol.odor_description, new Date(), new Date()];

    if (colNames.includes('olfactive_family')) { fields.push('olfactive_family'); vals.push(mol.olfactive_family); }
    if (colNames.includes('notes')) { fields.push('notes'); vals.push(mol.notes); }
    if (colNames.includes('source')) { fields.push('source'); vals.push(mol.source); }

    await conn.execute(`INSERT INTO molecules (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`, vals);
    console.log('  + Molécule:', mol.name);
    molCreated++;
  }

  // Liaisons plante-molécule avec les nouvelles molécules
  console.log('\n--- Liaisons avec nouvelles molécules ---');
  const newLinks = [
    // Copal Negro → α-Pinène
    { plantId: 480006, molName: 'α-Pinène', pct: 32.0, notes: 'Composant principal copal negro (25-40%)' },
    // Copal Negro → p-Cymène
    { plantId: 480006, molName: 'p-Cymène', pct: 7.5, notes: 'Composant tertiaire (5-10%)' },
    // Copal Blanco → α-Pinène
    { plantId: 480005, molName: 'α-Pinène', pct: 28.0, notes: 'Composant principal copal blanco (20-35%)' },
    // Liquidambar → Cinnamaldéhyde
    { plantId: 540022, molName: 'Cinnamaldéhyde', pct: 15.0, notes: 'Note épicée, cannelle (10-20%)' },
    // Liquidambar orientalis → Cinnamaldéhyde
    { plantId: null, molName: 'Cinnamaldéhyde', pct: 12.0, notes: 'Composant résine liquidambar oriental', latinName: 'Liquidambar orientalis' },
    // Mapacho → Nornicotine
    { plantId: 150003, molName: 'Nornicotine', pct: 50.0, notes: 'Alcaloïde principal N. rustica (40-60%)' },
    // Mapacho → Anabasine
    { plantId: 150003, molName: 'Anabasine', pct: 15.0, notes: 'Alcaloïde secondaire (10-20%)' },
    // Tabac rustique → Nornicotine
    { plantId: 690090, molName: 'Nornicotine', pct: 50.0, notes: 'Alcaloïde principal N. rustica (40-60%)' },
    // Tabac rustique → Anabasine
    { plantId: 690090, molName: 'Anabasine', pct: 15.0, notes: 'Alcaloïde secondaire (10-20%)' },
  ];

  let linksCreated = 0;
  for (const link of newLinks) {
    let plantId = link.plantId;
    if (!plantId && link.latinName) {
      const [p] = await conn.execute("SELECT id FROM plants WHERE latin_name LIKE ? LIMIT 1", [`%${link.latinName}%`]);
      if (!p.length) { console.log('  Plante non trouvée:', link.latinName); continue; }
      plantId = p[0].id;
    }

    const [mols] = await conn.execute("SELECT id FROM molecules WHERE name=? LIMIT 1", [link.molName]);
    if (!mols.length) { console.log('  Molécule non trouvée:', link.molName); continue; }
    const molId = mols[0].id;

    const [ex] = await conn.execute("SELECT plant_id FROM plant_molecules WHERE plant_id=? AND molecule_id=? LIMIT 1", [plantId, molId]);
    if (ex.length) { console.log('  Lien déjà:', plantId, '->', link.molName); continue; }

    await conn.execute("INSERT INTO plant_molecules (plant_id, molecule_id, percentage, notes, created_at) VALUES (?,?,?,?,NOW())", [plantId, molId, link.pct, link.notes]);
    console.log('  + Lien:', plantId, '->', link.molName, `(${link.pct}%)`);
    linksCreated++;
  }

  // Résumé final
  const [totalRE] = await conn.execute("SELECT COUNT(*) as c FROM research_entries");
  const [totalMol] = await conn.execute("SELECT COUNT(*) as c FROM molecules");
  const [totalG] = await conn.execute("SELECT COUNT(*) as c FROM glossary_terms");
  const [totalPM] = await conn.execute("SELECT COUNT(*) as c FROM plant_molecules");

  console.log('\n=== Résumé Final ===');
  console.log('research_entries:', totalRE[0].c);
  console.log('molecules:', totalMol[0].c);
  console.log('glossary_terms:', totalG[0].c);
  console.log('liaisons plante-molécule:', totalPM[0].c);
  console.log('nouvelles molécules:', molCreated);
  console.log('nouveaux liens:', linksCreated);

  await conn.end();
}

main().catch(console.error);
