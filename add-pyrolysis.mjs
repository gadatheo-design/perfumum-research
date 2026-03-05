/**
 * add-pyrolysis.mjs
 * Ajoute les transformations moléculaires spécifiques à :
 * - Latakia (tabac fumé au bois de chêne et laurier)
 * - Perique (tabac fermenté sous pression anaérobie)
 * - Cannabis séché/cured (fermentation enzymatique)
 * Sources : Leffingwell & Associates, Journal of Agricultural and Food Chemistry,
 *           Tobacco Science, Cannabis and Cannabinoid Research
 */

import mysql from 'mysql2/promise';

const transformations = [
  // ═══════════════════════════════════════════════════════════
  // LATAKIA — Tabac fumé au bois de chêne et laurier (Syrie/Chypre)
  // Processus : fumage à froid (40-60°C) puis à chaud (80-100°C)
  // ═══════════════════════════════════════════════════════════
  {
    source_molecule: 'Nicotine',
    product_molecule: 'Cotinine',
    temperature_range: '40-100°C',
    mechanism: 'Oxydation enzymatique + fumage',
    toxicity_level: 'moderate',
    notes: 'Latakia : oxydation partielle de la nicotine lors du fumage prolongé. La cotinine est le principal métabolite de la nicotine, avec une odeur moins âcre.'
  },
  {
    source_molecule: 'Solanone',
    product_molecule: 'Dihydrosolanone',
    temperature_range: '60-100°C',
    mechanism: 'Réduction par fumage',
    toxicity_level: 'low',
    notes: 'Latakia : la solanone (cétone tabacique caractéristique) est partiellement réduite en dihydrosolanone lors du fumage, contribuant aux notes fumées-douces.'
  },
  {
    source_molecule: 'Phénols du bois (gaïacol)',
    product_molecule: 'Créosol',
    temperature_range: '80-150°C',
    mechanism: 'Pyrolyse partielle du bois de chêne',
    toxicity_level: 'low',
    notes: 'Latakia : la combustion incomplète du bois de chêne produit du gaïacol et du créosol, responsables des notes fumées-boisées caractéristiques du Latakia.'
  },
  {
    source_molecule: 'Lignine (bois de laurier)',
    product_molecule: 'Syringaldéhyde',
    temperature_range: '100-200°C',
    mechanism: 'Dépolymérisation de la lignine',
    toxicity_level: 'low',
    notes: 'Latakia : la lignine du bois de laurier se dépolymérise en syringaldéhyde et vanilline lors du fumage, apportant les notes épicées-boisées typiques.'
  },
  {
    source_molecule: 'Lignine (bois de laurier)',
    product_molecule: 'Vanilline',
    temperature_range: '100-200°C',
    mechanism: 'Dépolymérisation de la lignine',
    toxicity_level: 'low',
    notes: 'Latakia : production de vanilline par dépolymérisation de la lignine du bois de laurier. Contribue aux notes douces-vanillées du Latakia de Chypre.'
  },
  {
    source_molecule: 'Cellulose (feuilles de tabac)',
    product_molecule: 'Furfural',
    temperature_range: '150-200°C',
    mechanism: 'Déhydratation thermique des sucres',
    toxicity_level: 'moderate',
    notes: 'Latakia : la cellulose des feuilles se dégrade en furfural lors du fumage à haute température. Notes caramelisées-grillées caractéristiques.'
  },
  {
    source_molecule: 'β-Damascenone (précurseur)',
    product_molecule: 'β-Damascenone',
    temperature_range: '40-80°C',
    mechanism: 'Libération par hydrolyse enzymatique',
    toxicity_level: 'low',
    notes: 'Latakia : la β-damascénone est libérée des glycosides lors du fumage doux, contribuant aux notes fruitées-roses très caractéristiques du Latakia.'
  },

  // ═══════════════════════════════════════════════════════════
  // PERIQUE — Tabac fermenté sous pression anaérobie (Louisiane)
  // Processus : fermentation en fûts de chêne sous pression, 6-12 mois
  // ═══════════════════════════════════════════════════════════
  {
    source_molecule: 'Sucrose',
    product_molecule: 'Acide lactique',
    temperature_range: '20-30°C',
    mechanism: 'Fermentation lactique anaérobie',
    toxicity_level: 'low',
    notes: 'Perique : fermentation lactique des sucres du tabac par bactéries anaérobies sous pression. L\'acide lactique contribue aux notes aigres-fruitées caractéristiques.'
  },
  {
    source_molecule: 'Sucrose',
    product_molecule: 'Acide acétique',
    temperature_range: '20-30°C',
    mechanism: 'Fermentation acétique anaérobie',
    toxicity_level: 'low',
    notes: 'Perique : production d\'acide acétique lors de la fermentation anaérobie prolongée. Contribue aux notes vineuses-acides du Perique.'
  },
  {
    source_molecule: 'Protéines (acides aminés)',
    product_molecule: 'Acides aminés libres',
    temperature_range: '20-30°C',
    mechanism: 'Protéolyse enzymatique',
    toxicity_level: 'low',
    notes: 'Perique : les protéines des feuilles sont hydrolysées en acides aminés libres par les enzymes bactériennes, enrichissant le profil aromatique.'
  },
  {
    source_molecule: 'Acides aminés libres',
    product_molecule: 'Aldéhydes de Strecker',
    temperature_range: '20-30°C',
    mechanism: 'Dégradation de Strecker',
    toxicity_level: 'low',
    notes: 'Perique : les acides aminés libres subissent la dégradation de Strecker, produisant des aldéhydes caractéristiques (méthional, phénylacétaldéhyde) aux notes fruitées-sulfurées.'
  },
  {
    source_molecule: 'Nicotine',
    product_molecule: 'Nornicotine',
    temperature_range: '20-30°C',
    mechanism: 'Déméthylation microbienne',
    toxicity_level: 'moderate',
    notes: 'Perique : la nicotine est partiellement déméthylée en nornicotine par les micro-organismes lors de la fermentation prolongée. La nornicotine a une saveur plus douce.'
  },
  {
    source_molecule: 'Chlorophylle',
    product_molecule: 'Phytol',
    temperature_range: '20-30°C',
    mechanism: 'Hydrolyse enzymatique de la chlorophylle',
    toxicity_level: 'low',
    notes: 'Perique : la chlorophylle est hydrolysée en phytol et porphyrines lors de la fermentation. Le phytol contribue aux notes herbacées-grasses du Perique.'
  },
  {
    source_molecule: 'Phytol',
    product_molecule: 'Phytol oxydé (cétones diterpéniques)',
    temperature_range: '20-30°C',
    mechanism: 'Oxydation microbienne',
    toxicity_level: 'low',
    notes: 'Perique : le phytol est oxydé en cétones diterpéniques par les micro-organismes, contribuant aux notes terreuses-boisées caractéristiques du Perique.'
  },

  // ═══════════════════════════════════════════════════════════
  // CANNABIS SÉCHÉ/CURED — Fermentation enzymatique contrôlée
  // Processus : séchage lent (60-90 jours) en conditions contrôlées
  // ═══════════════════════════════════════════════════════════
  {
    source_molecule: 'THCA (acide tétrahydrocannabinolique)',
    product_molecule: 'THC (tétrahydrocannabinol)',
    temperature_range: '20-30°C',
    mechanism: 'Décarboxylation enzymatique lente',
    toxicity_level: 'moderate',
    notes: 'Cannabis cured : décarboxylation lente du THCA en THC lors du séchage contrôlé. Processus enzymatique à température ambiante, distinct de la décarboxylation thermique rapide.'
  },
  {
    source_molecule: 'CBDA (acide cannabidiolique)',
    product_molecule: 'CBD (cannabidiol)',
    temperature_range: '20-30°C',
    mechanism: 'Décarboxylation enzymatique lente',
    toxicity_level: 'low',
    notes: 'Cannabis cured : décarboxylation lente du CBDA en CBD lors du séchage. Le CBD est libéré progressivement, contribuant aux effets thérapeutiques du cannabis séché.'
  },
  {
    source_molecule: 'Myrcène',
    product_molecule: 'Myrcène oxydé (myroxyde)',
    temperature_range: '20-30°C',
    mechanism: 'Oxydation enzymatique',
    toxicity_level: 'low',
    notes: 'Cannabis cured : le myrcène (terpène dominant) s\'oxyde partiellement lors du séchage, formant des oxydes terpéniques. Modification des notes herbacées vers des notes plus douces.'
  },
  {
    source_molecule: 'Limonène',
    product_molecule: 'Carvone',
    temperature_range: '20-30°C',
    mechanism: 'Oxydation enzymatique',
    toxicity_level: 'low',
    notes: 'Cannabis cured : le limonène s\'oxyde en carvone lors du séchage prolongé. La carvone apporte des notes mentholées-épicées distinctes des notes citronnées du limonène frais.'
  },
  {
    source_molecule: 'Linalol',
    product_molecule: 'Linalol oxyde',
    temperature_range: '20-30°C',
    mechanism: 'Oxydation enzymatique',
    toxicity_level: 'low',
    notes: 'Cannabis cured : le linalol (notes florales-lavande) s\'oxyde en linalol oxyde lors du séchage. L\'oxyde a des notes plus terreuses-boisées, modifiant le profil floral du cannabis frais.'
  },
  {
    source_molecule: 'β-Caryophyllène',
    product_molecule: 'Oxyde de caryophyllène',
    temperature_range: '20-30°C',
    mechanism: 'Oxydation enzymatique',
    toxicity_level: 'low',
    notes: 'Cannabis cured : le β-caryophyllène s\'oxyde en oxyde de caryophyllène lors du séchage. L\'oxyde est détecté par les chiens renifleurs et a des propriétés anti-inflammatoires distinctes.'
  },
  {
    source_molecule: 'Terpinolène',
    product_molecule: 'α-Terpinéol',
    temperature_range: '20-30°C',
    mechanism: 'Hydratation enzymatique',
    toxicity_level: 'low',
    notes: 'Cannabis cured : le terpinolène (notes florales-herbacées) est converti en α-terpinéol lors du séchage. L\'α-terpinéol a des notes de lilas-pin plus persistantes.'
  },
  {
    source_molecule: 'Chlorophylle a',
    product_molecule: 'Phéophytine a',
    temperature_range: '20-30°C',
    mechanism: 'Déchlorophyllation enzymatique',
    toxicity_level: 'low',
    notes: 'Cannabis cured : la chlorophylle est dégradée en phéophytine lors du séchage, provoquant le changement de couleur vert → brun. Réduit les notes herbacées-végétales du cannabis frais.'
  },
  {
    source_molecule: 'Phéophytine a',
    product_molecule: 'Phéophorbide a',
    temperature_range: '20-30°C',
    mechanism: 'Hydrolyse enzymatique',
    toxicity_level: 'low',
    notes: 'Cannabis cured : la phéophytine est hydrolysée en phéophorbide lors du séchage prolongé. Étape finale de la dégradation de la chlorophylle, contribuant aux notes terreuses du cannabis cured.'
  },
];

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('✅ Connexion DB établie');
  console.log(`📦 ${transformations.length} transformations à ajouter`);

  let inserted = 0;
  let skipped = 0;

  for (const t of transformations) {
    try {
      const [result] = await conn.execute(
        `INSERT IGNORE INTO pyrolysis_transformations 
         (source_molecule, product_molecule, temperature_range, mechanism, toxicity_level, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [t.source_molecule, t.product_molecule, t.temperature_range, t.mechanism, t.toxicity_level, t.notes]
      );
      if (result.affectedRows > 0) {
        console.log(`  ✅ ${t.source_molecule} → ${t.product_molecule} (${t.mechanism})`);
        inserted++;
      } else {
        console.log(`  ○  ${t.source_molecule} → ${t.product_molecule} (déjà présent)`);
        skipped++;
      }
    } catch (err) {
      console.log(`  ❌ Erreur: ${err.message.substring(0, 80)}`);
    }
  }

  const [count] = await conn.execute('SELECT COUNT(*) as n FROM pyrolysis_transformations');
  console.log('\n═══════════════════════════════════════');
  console.log('📊 RÉSULTATS');
  console.log('═══════════════════════════════════════');
  console.log(`Nouvelles transformations : ${inserted}`);
  console.log(`Déjà présentes            : ${skipped}`);
  console.log(`Total en base             : ${count[0].n}`);

  await conn.end();
}

main().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
