/**
 * Import AS-03 — Protocoles de Combustion Tabac & Cannabis
 * Sources: Profils Aromatiques Combustion/Pyrolyse Tabac, Veille Cannabis Combustion, Mélilot vs Réglisse
 */
const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('Connecté à la base de données');

  // ============================================================
  // 1. MOLÉCULES DE COMBUSTION MANQUANTES
  // ============================================================
  const molecules = [
    {
      name: 'Vanilline',
      cas: '121-33-5',
      formula: 'C8H8O3',
      mw: 152.15,
      chemicalFamily: 'Aldéhyde aromatique',
      olfactiveProfile: 'Vanille, doux, crémeux, boisé. Seuil olfactif: 0.02 ppm',
      therapeuticProperties: 'Antioxydant, anti-inflammatoire, neuroprotecteur',
      notes: 'Produit de pyrolyse de la lignine (300-650°C). Topping tabac classique (500-1000 ppm). Précurseur: coniféryle aldéhyde. Synergies: éthyl vanilline, coumarine, héliotropine.',
      volatility: 3,
      boilingPoint: 285,
      validationStatus: 'valide'
    },
    {
      name: 'Eugénol',
      cas: '97-53-0',
      formula: 'C10H12O2',
      mw: 164.20,
      chemicalFamily: 'Phénylpropanoïde',
      olfactiveProfile: 'Clou de girofle, épicé, chaud, boisé. Seuil olfactif: 0.006 ppm',
      therapeuticProperties: 'Analgésique, antiseptique, antifongique',
      notes: 'Produit de pyrolyse de la lignine (400-700°C). Présent dans tabacs orientaux (50-100 ppm). Synergies: isoeugenol, méthyl eugenol, caryophyllène.',
      volatility: 3,
      boilingPoint: 254,
      validationStatus: 'valide'
    },
    {
      name: 'Coumarine',
      cas: '91-64-5',
      formula: 'C9H6O2',
      mw: 146.14,
      chemicalFamily: 'Lactone benzénique',
      olfactiveProfile: 'Foin coupé, vanille, amande, doux. Seuil olfactif: 0.003 ppm',
      therapeuticProperties: 'Anticoagulant (usage médical contrôlé), anti-inflammatoire',
      notes: 'Présent dans mélilot (Melilotus officinalis) à haute concentration. Synergies de combustion: interaction avec tonka, lavande, réglisse. Réglementée IFRA.',
      volatility: 3,
      boilingPoint: 301,
      validationStatus: 'valide'
    },
    {
      name: 'Acide Cinnamique',
      cas: '140-10-3',
      formula: 'C9H8O2',
      mw: 148.16,
      chemicalFamily: 'Acide phénylpropanoïque',
      olfactiveProfile: 'Cannelle, miel, floral, baumé. Seuil olfactif: 0.04 ppm',
      therapeuticProperties: 'Antimicrobien, antifongique, antioxydant',
      notes: 'Précurseur de nombreux arômes de combustion. Transformé en styrène et benzaldéhyde à haute température. Présent dans cannelle, baume du Pérou, storax.',
      volatility: 2,
      boilingPoint: 300,
      validationStatus: 'valide'
    },
    {
      name: 'Furfural',
      cas: '98-01-1',
      formula: 'C5H4O2',
      mw: 96.08,
      chemicalFamily: 'Aldéhyde furanique',
      olfactiveProfile: 'Amande, caramel, pain, céréale. Seuil olfactif: 0.003 ppm',
      therapeuticProperties: 'Précurseur industriel, légèrement toxique à haute concentration',
      notes: 'Produit de pyrolyse des sucres (200-400°C). Marqueur de la réaction de Maillard dans le tabac. Présent dans Virginia, Oriental. Synergies: 5-méthylfurfural, furfuryl alcool.',
      volatility: 4,
      boilingPoint: 162,
      validationStatus: 'valide'
    },
    {
      name: 'Pyridine',
      cas: '110-86-1',
      formula: 'C5H5N',
      mw: 79.10,
      chemicalFamily: 'Hétérocycle azoté',
      olfactiveProfile: 'Âcre, médicinal, poisson, fumé. Seuil olfactif: 0.03 ppm',
      therapeuticProperties: 'Précurseur de vitamines B, solvant industriel',
      notes: 'Produit de pyrolyse de la nicotine (>400°C). Marqueur de combustion élevée. Présent dans fumée de cigarette. Synergies: picolines, lutidines.',
      volatility: 5,
      boilingPoint: 115,
      validationStatus: 'valide'
    },
    {
      name: 'Acétaldéhyde',
      cas: '75-07-0',
      formula: 'C2H4O',
      mw: 44.05,
      chemicalFamily: 'Aldéhyde aliphatique',
      olfactiveProfile: 'Fruité, éthéré, pomme verte, piquant. Seuil olfactif: 0.015 ppm',
      therapeuticProperties: 'Précurseur métabolique, irritant respiratoire',
      notes: 'Produit de combustion primaire des sucres. Très volatile. Contribue aux notes de tête dans la fumée. Précurseur de nombreux arômes fruités.',
      volatility: 5,
      boilingPoint: 20,
      validationStatus: 'valide'
    }
  ];

  let molCreated = 0, molUpdated = 0;
  const molIds = {};
  for (const mol of molecules) {
    const [existing] = await conn.execute('SELECT id FROM molecules WHERE name = ?', [mol.name]);
    if (existing.length > 0) {
      await conn.execute(
        `UPDATE molecules SET olfactiveProfile=?, therapeuticProperties=?, notes=?, chemicalFamily=?, cas_number=?, chemicalFormula=?, molecularWeight=?, boilingPoint=?
         WHERE id=?`,
        [mol.olfactiveProfile, mol.therapeuticProperties, mol.notes, mol.chemicalFamily, mol.cas, mol.formula, mol.mw, mol.boilingPoint, existing[0].id]
      );
      molIds[mol.name] = existing[0].id;
      molUpdated++;
    } else {
      const [result] = await conn.execute(
        `INSERT INTO molecules (name, cas_number, chemicalFormula, molecularWeight, chemicalFamily, olfactiveProfile, therapeuticProperties, notes, volatility, boilingPoint, validation_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [mol.name, mol.cas, mol.formula, mol.mw, mol.chemicalFamily, mol.olfactiveProfile, mol.therapeuticProperties, mol.notes, mol.volatility, mol.boilingPoint, mol.validationStatus]
      );
      molIds[mol.name] = result.insertId;
      molCreated++;
    }
  }
  console.log(`Molécules : ${molCreated} créées, ${molUpdated} mises à jour`);

  // ============================================================
  // 2. RESEARCH ENTRIES AS-03
  // ============================================================
  const entries = [
    {
      entry_code: 'AS-03-COMBUSTION-TABAC',
      slug: 'as03-combustion-tabac',
      title: 'AS-03 — Profils Aromatiques à la Combustion et Pyrolyse du Tabac',
      content: `Analyse complète des transformations aromatiques du tabac selon les paramètres de combustion.

ZONES DE COMBUSTION :
- Zone pyrolyse (200-400°C) : Maillard → caramel, pain, noisette. Sucres → furfural, acétaldéhyde, acétol.
- Zone combustion douce (400-600°C) : Caroténoïdes → β-damascénone, solanone, ionone. Lignine → vanilline, eugénol, gaïacol.
- Zone combustion élevée (600-900°C) : Nicotine → pyridine, picolines. Cellulose → CO, CO2, HAP.

PARAMÈTRES CRITIQUES :
- Humidité optimale 12-14% → T° 550-650°C → profil équilibré
- Humidité faible (<10%) → T° 650-800°C → fumé-terreux amplifié
- Humidité élevée (16-18%) → T° 500-600°C → floral-fruité amplifié

COUPES ET COMBUSTION :
- Ribbon-cut (fine) : combustion rapide et chaude → pyrolyse intense → fumé-épicé
- Flake (pressé) : combustion lente et fraîche → volatilisation dominante → doux, terpènes préservés
- Plug (très pressé) : volatilisation maximale → ultra-doux, concentration maximale

CORRESPONDANCES FAMILLE AROMATIQUE → PARAMÈTRES :
- Caramel/pain grillé : sucres élevés, 200-400°C, Virginia, combustion douce, humidité 14-16%
- Fumé-vanillé/boisé : lignine/cellulose, 300-650°C, Latakia, topping vanilline
- Terreux/cacao/grillé : protéines élevées, 200-400°C, Burley, topping pyrazines
- Floral-fruité/rose-pomme : caroténoïdes élevés, 150-350°C, Virginia, β-damascénone, aging long
- Animalique-cuir : nicotine/tryptophane, 400-700°C, tabacs sauvages, topping skatole

Sources : Leffingwell (2005), Pankow (2021), Meehan-Atrash (2019).`,
      status: 'completed',
      primary_axis_id: 9
    },
    {
      entry_code: 'AS-03-CANNABIS-COMBUSTION',
      slug: 'as03-cannabis-combustion',
      title: 'AS-03 — Veille Scientifique : Transformations Aromatiques du Cannabis à la Combustion',
      content: `Analyse des transformations chimiques des terpènes du cannabis à la combustion.

DÉCOUVERTES CLÉS (Meehan-Atrash 2017-2021) :
- Myrcène → isoprène + méthacroléine (irritants) à >400°C
- Limonène → p-cymène + isoprène à >300°C
- Linalool → β-ocimène + 1,3-butadiène à >350°C
- Caryophyllène → naphthalène + styrène à >500°C

PROFIL PAR LANDRACE À LA COMBUSTION :
- Afghan Kush (myrcène dominant) : terreux-épicé-fumé → transformation en isoprène intense
- Durban Poison (terpinolène dominant) : fruité-pin-citrus → transformation en p-cymène
- Thai Stick (limonène dominant) : citrus-floral → transformation en p-cymène + isoprène
- Malawi Gold (myrcène+limonène) : tropical-terreux → profil mixte

VAPORISATION VS COMBUSTION :
- Vaporisation (150-230°C) : terpènes natifs préservés, pas de pyrolyse
- Combustion (600-900°C) : transformation majeure, profil aromatique différent
- Zone optimale PERFUMUM : 300-500°C (combustion douce, préservation partielle)

Sources : Meehan-Atrash et al. (2017, 2019, 2021), Munger et al. (2022).`,
      status: 'completed',
      primary_axis_id: 9
    },
    {
      entry_code: 'AS-03-MELILOT-REGLISSE',
      slug: 'as03-melilot-reglisse',
      title: 'AS-03 — Comparaison Mélilot vs Réglisse : Synergies de Combustion',
      content: `Étude comparative des synergies de combustion entre mélilot (Melilotus officinalis) et réglisse (Glycyrrhiza glabra).

MÉLILOT (Melilotus officinalis) :
- Molécule clé : Coumarine (3-10% matière sèche)
- Profil combustion : Foin coupé → Vanille-amande → Tonka
- Zone pyrolyse (200-400°C) : coumarine → o-coumarique acid → benzaldéhyde
- Zone combustion (400-600°C) : dégradation → phénol + styrène
- Synergie avec tabac : amplifie notes douces-vanillées, masque amertume

RÉGLISSE (Glycyrrhiza glabra) :
- Molécule clé : Glycyrrhizine (2-14% racine) + Anethole
- Profil combustion : Réglisse-anisé → Doux-baumé → Herbacé
- Zone pyrolyse : glycyrrhizine → glycyrrhétine + acide glucuronique
- Synergie avec tabac : adoucit, ajoute note anisée, réduit âcreté

SYNERGIE DE COMBUSTION MÉLILOT + RÉGLISSE :
- Ratio optimal : Mélilot 60% + Réglisse 40%
- Profil résultant : Foin-vanille-anisé-doux (PERFUMUM : accord "Prairie Dorée")
- Application : casings tabac, encens, cônes aromatiques

Sources : Clarke (1998), Leffingwell (2013), Merzouki & Molero Mesa (2002).`,
      status: 'completed',
      primary_axis_id: 9
    }
  ];

  let entryInserted = 0;
  const entryIds = {};
  for (const entry of entries) {
    const [existing] = await conn.execute('SELECT id FROM research_entries WHERE entry_code = ?', [entry.entry_code]);
    if (existing.length === 0) {
      const [result] = await conn.execute(
        `INSERT INTO research_entries (entry_code, slug, title, content, status, primary_axis_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [entry.entry_code, entry.slug, entry.title, entry.content, entry.status, entry.primary_axis_id]
      );
      entryIds[entry.entry_code] = result.insertId;
      entryInserted++;
    } else {
      entryIds[entry.entry_code] = existing[0].id;
    }
  }
  console.log(`Research entries : ${entryInserted} créées`);

  // ============================================================
  // 3. BIBLIOGRAPHIES AS-03
  // ============================================================
  const refs = [
    {
      entry_key: 'leffingwell-2013-tobacco-flavor',
      entry_type: 'article',
      title: 'Tobacco Flavor Chemistry: Casings, Toppings and Combustion Products',
      author: 'Leffingwell, J.C.',
      year: 2013,
      journal: 'Leffingwell Reports',
      notes: 'Référence fondamentale sur la chimie des arômes du tabac, casings et combustion. Source AS-03.'
    },
    {
      entry_key: 'pankow-2021-tobacco-combustion',
      entry_type: 'article',
      title: 'Formation of Volatile Organic Compounds in Tobacco Combustion',
      author: 'Pankow, J.F. et al.',
      year: 2021,
      journal: 'Chemical Research in Toxicology',
      notes: 'Analyse GC-MS des produits de combustion du tabac. Source AS-03.'
    },
    {
      entry_key: 'meehan-atrash-2021-cannabis-combustion',
      entry_type: 'article',
      title: 'Aerosol Gas-Phase Components from Cannabis E-Cigarettes and Dabbing: Mechanistic Insight and Quantitative Risk Analysis',
      author: 'Meehan-Atrash, J. et al.',
      year: 2021,
      journal: 'ACS Omega',
      notes: 'Analyse des transformations terpéniques du cannabis à la combustion. Source AS-03.'
    },
    {
      entry_key: 'munger-2022-cannabis-terpene-pyrolysis',
      entry_type: 'article',
      title: 'Terpene Pyrolysis Products in Cannabis Smoke',
      author: 'Munger, K.L. et al.',
      year: 2022,
      journal: 'Journal of Analytical and Applied Pyrolysis',
      notes: 'Profils de pyrolyse des terpènes cannabis par landrace. Source AS-03.'
    }
  ];

  let refInserted = 0;
  const refIds = {};
  for (const ref of refs) {
    const [existing] = await conn.execute('SELECT id FROM v3_references WHERE entry_key = ?', [ref.entry_key]);
    if (existing.length === 0) {
      const [result] = await conn.execute(
        `INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [ref.entry_key, ref.entry_type, ref.title, ref.author, ref.year, ref.journal, ref.notes]
      );
      refIds[ref.entry_key] = result.insertId;
      refInserted++;
    } else {
      refIds[ref.entry_key] = existing[0].id;
    }
  }
  console.log(`Bibliographies : ${refInserted} créées`);

  // ============================================================
  // 4. LIAISONS PLANT_MOLECULES (molécules combustion → plantes)
  // ============================================================
  const plantMolLinks = [
    // Vanilline → Latakia (tabac fumé), Virginia, Oriental
    { plantName: 'Latakia', molName: 'Vanilline', role: 'secondaire', percentage: 0.05, certainty: 'confirmed' },
    { plantName: 'Virginia', molName: 'Vanilline', role: 'trace', percentage: 0.01, certainty: 'confirmed' },
    // Eugénol → tabacs orientaux
    { plantName: 'Xanthi', molName: 'Eugénol', role: 'secondaire', percentage: 0.008, certainty: 'confirmed' },
    { plantName: 'Samsun', molName: 'Eugénol', role: 'trace', percentage: 0.005, certainty: 'confirmed' },
    // Coumarine → Mélilot
    { plantName: 'Melilotus officinalis', molName: 'Coumarine', role: 'majeur', percentage: 5.0, certainty: 'confirmed' },
    // Furfural → Virginia (sucres élevés)
    { plantName: 'Virginia', molName: 'Furfural', role: 'secondaire', percentage: 0.1, certainty: 'confirmed' },
    { plantName: 'Burley', molName: 'Furfural', role: 'trace', percentage: 0.05, certainty: 'confirmed' },
    // Pyridine → tabacs à combustion élevée
    { plantName: 'Latakia', molName: 'Pyridine', role: 'trace', percentage: 0.02, certainty: 'confirmed' },
    // Acide cinnamique → Cannelle, Baume du Pérou
    { plantName: 'Cinnamomum verum', molName: 'Acide Cinnamique', role: 'majeur', percentage: 2.0, certainty: 'confirmed' },
    { plantName: 'Myroxylon balsamum', molName: 'Acide Cinnamique', role: 'secondaire', percentage: 0.5, certainty: 'confirmed' }
  ];

  let linkInserted = 0;
  for (const link of plantMolLinks) {
    const [plant] = await conn.execute('SELECT id FROM plants WHERE name LIKE ? LIMIT 1', [`%${link.plantName}%`]);
    const [mol] = await conn.execute('SELECT id FROM molecules WHERE name LIKE ? LIMIT 1', [`%${link.molName}%`]);
    if (plant.length > 0 && mol.length > 0) {
      const [existing] = await conn.execute(
        'SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?',
        [plant[0].id, mol[0].id]
      );
      if (existing.length === 0) {
        await conn.execute(
          `INSERT INTO plant_molecules (plant_id, molecule_id, role, percentage, source)
           VALUES (?, ?, ?, ?, ?)`,
          [plant[0].id, mol[0].id, link.role, link.percentage, link.certainty]
        );
        linkInserted++;
      }
    }
  }
  console.log(`Liaisons plant_molecules : ${linkInserted} créées`);

  // ============================================================
  // 5. MISE À JOUR TEMPÉRATURES DE COMBUSTION SUR LES RECETTES TABAC
  // ============================================================
  const combustionUpdates = [
    // Virginia pure → combustion douce
    { namePattern: 'Virginia', temp: 575 },
    // Oriental/Balkan → combustion moyenne-élevée
    { namePattern: 'Oriental', temp: 675 },
    { namePattern: 'Balkan', temp: 700 },
    // Latakia → combustion élevée
    { namePattern: 'Latakia', temp: 750 },
    // Burley → combustion moyenne
    { namePattern: 'Burley', temp: 625 },
    // Kif/Cannabis → combustion douce PERFUMUM
    { namePattern: 'Kif', temp: 450 },
    { namePattern: 'CBD', temp: 420 },
    // Mélilot → combustion douce
    { namePattern: 'Mélilot', temp: 500 },
    { namePattern: 'Prairie', temp: 480 }
  ];

  let recUpdated = 0;
  for (const upd of combustionUpdates) {
    const [result] = await conn.execute(
      `UPDATE recettes SET combustionTemperature = ? WHERE name LIKE ? AND combustionTemperature IS NULL`,
      [upd.temp, `%${upd.namePattern}%`]
    );
    recUpdated += result.affectedRows;
  }
  console.log(`Recettes mises à jour (combustionTemperature) : ${recUpdated}`);

  // ============================================================
  // 6. STATS FINALES
  // ============================================================
  const [[{ plants }]] = await conn.execute('SELECT COUNT(*) as plants FROM plants');
  const [[{ mols }]] = await conn.execute('SELECT COUNT(*) as mols FROM molecules');
  const [[{ recs }]] = await conn.execute('SELECT COUNT(*) as recs FROM recettes');
  const [[{ entries_count }]] = await conn.execute('SELECT COUNT(*) as entries_count FROM research_entries');
  const [[{ refs_count }]] = await conn.execute('SELECT COUNT(*) as refs_count FROM v3_references');
  const [[{ pm }]] = await conn.execute('SELECT COUNT(*) as pm FROM plant_molecules');

  console.log(`\n=== STATS FINALES ===`);
  console.log(`Plantes: ${plants} | Molécules: ${mols} | Recettes: ${recs}`);
  console.log(`Research entries: ${entries_count} | Bibliographies: ${refs_count}`);
  console.log(`Plant-molecules: ${pm}`);

  await conn.end();
}

main().catch(console.error);
