import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('=== NORMALISATION DES FAMILLES CHIMIQUES ===\n');
  
  // Mapping des doublons/variantes → forme canonique
  const familyNormalization = [
    // Acides phénoliques
    ['acide_phenolique', 'acide phénolique'],
    ['Acide phénolique', 'acide phénolique'],
    ['acide phenolique', 'acide phénolique'],
    // Alcaloïdes
    ['Alcaloïde', 'alcaloïde'],
    ['alcaloide', 'alcaloïde'],
    ['Alcaloïde indolique', 'alcaloïde indolique'],
    ['alcaloide indolique', 'alcaloïde indolique'],
    ['alcaloide xanthique', 'alcaloïde xanthique'],
    ['alcaloide heterocyclique', 'alcaloïde hétérocyclique'],
    ['alcaloide isoquinolinique', 'alcaloïde isoquinolinique'],
    ['alcaloide pyrrolizidinique', 'alcaloïde pyrrolizidinique'],
    ['alcaloide quinolizidinique', 'alcaloïde quinolizidinique'],
    ['alcaloide tropanique', 'alcaloïde tropanique'],
    ['Alcaloïde purique / Méthylxanthine', 'alcaloïde purique'],
    ['Alcaloïde quinoléique', 'alcaloïde quinoléique'],
    // Coumarines
    ['Coumarine', 'coumarine'],
    ['Coumarine / Furocoumarine', 'coumarine'],
    ['furanocoumarine', 'furocoumarine'],
    // Diterpènes
    ['Diterpène', 'diterpène'],
    ['diterpene', 'diterpène'],
    ['Diterpène phénolique', 'diterpène phénolique'],
    ['diterpene acide', 'diterpène acide'],
    ['Diterpène acyclique', 'diterpène acyclique'],
    ['Diterpène / Ginkgolide', 'diterpène'],
    ['Diterpène / Taxane', 'diterpène'],
    // Flavonoïdes
    ['flavonoide', 'flavonoïde'],
    ['Flavonoïde / Flavonol', 'flavonoïde'],
    ['Flavonoïde / Flavone', 'flavonoïde'],
    // Monoterpènes
    ['alcool monoterpenique', 'alcool monoterpénique'],
    ['cetone monoterpenique', 'cétone monoterpénique'],
    ['Cétone monoterpénique', 'cétone monoterpénique'],
    ['aldehyde monoterpenique', 'aldéhyde monoterpénique'],
    ['oxyde monoterpenique', 'oxyde monoterpénique'],
    ['ester monoterpenique', 'ester monoterpénique'],
    // Sesquiterpènes
    ['Sesquiterpènes', 'sesquiterpène'],
    ['sesquiterpene', 'sesquiterpène'],
    ['sesquiterpene lactone', 'sesquiterpène lactone'],
    ['sesquiterpene alcool', 'sesquiterpène alcool'],
    ['Sesquiterpènes aromatiques', 'sesquiterpène aromatique'],
    ['Sesquiterpénols', 'sesquiterpénol'],
    ['oxyde sesquiterpenique', 'oxyde sesquiterpénique'],
    // Triterpènes
    ['Triterpènes', 'triterpène'],
    ['triterpene', 'triterpène'],
    ['Triterpène pentacyclique', 'triterpène pentacyclique'],
    ['saponine triterpénique', 'saponine'],
    // Aldéhydes
    ['aldehyde aromatique', 'aldéhyde aromatique'],
    ['Aldéhydes aromatiques', 'aldéhyde aromatique'],
    ['Aldéhydes aliphatiques', 'aldéhyde aliphatique'],
    // Phénols
    ['Phénols', 'phénol'],
    ['Phénols fumés', 'phénol fumé'],
    // Norisoprénoïdes
    ['norisoprenoid', 'norisoprénoïde'],
    ['Norisoprénoïdes', 'norisoprénoïde'],
    // Stilbènes
    ['Stilbénoïde', 'stilbène'],
    ['stilbene', 'stilbène'],
    // Phytostérols
    ['Phytostérol', 'phytostérol'],
    ['sterol', 'stérol'],
    // Organosulfures
    ['organosulfure', 'composé organosulfuré'],
    // Alcools aromatiques
    ['alcool aromatique', 'alcool aromatique'],
    // Éther
    ['ether aromatique', 'éther aromatique'],
    // Mélanges/extraits → nettoyage des tags parasites
    ['[MÉLANGE] ', 'mélange'],
    ['[EXTRAIT RÉSINE] Pistacia lentiscus', 'résine végétale'],
    ['[EXTRAIT PLANTE] Fleur / Tubéreuse', 'extrait floral'],
    ['[EXTRAIT PLANTE] Bois / Cèdre', 'extrait boisé'],
    ['[EXTRAIT PLANTE] Agrume / Bergamote', 'extrait agrume'],
    ['[EXTRAIT PLANTE] Fleur / Jasmin', 'extrait floral'],
    ['[EXTRAIT PLANTE] Racine / Cyperus', 'extrait racinaire'],
    ['[EXTRAIT PLANTE] Résine / Encens', 'résine végétale'],
    ['[EXTRAIT PLANTE] Bois / Santal', 'extrait boisé'],
    ['[EXTRAIT PLANTE] Fleur / Oranger', 'extrait floral'],
    ['[VARIÉTÉ] Cannabis / Tangerine Dream', 'terpène cannabis'],
    ['Extrait végétal', 'extrait végétal'],
    ['Extrait de lichen', 'extrait de lichen'],
    ['Distillat végétal', 'distillat végétal'],
    ['Concrète marine', 'concrète marine'],
    ['Sécrétion animale', 'sécrétion animale'],
    ['Champignon parasitaire', 'champignon'],
    ['Résine végétale', 'résine végétale'],
    ['Silicate d\'aluminium', 'minéral'],
    ['Phytocannabinoïde', 'cannabinoïde'],
    ['terpene', 'terpène'],
    ['Acides gras', 'acide gras'],
    ['amine biogene', 'amine biogène'],
    ['acide amine', 'acide aminé'],
    ['hormone vegetale', 'hormone végétale'],
    ['phenylpropanoide', 'phénylpropanoïde'],
  ];
  
  let totalUpdated = 0;
  for (const [from, to] of familyNormalization) {
    const [result] = await conn.query(
      'UPDATE molecules SET chemicalFamily = ? WHERE chemicalFamily = ?',
      [to, from]
    );
    if (result.affectedRows > 0) {
      console.log(`  ✓ "${from}" → "${to}" (${result.affectedRows} molécules)`);
      totalUpdated += result.affectedRows;
    }
  }
  console.log(`\nTotal normalisé : ${totalUpdated} molécules\n`);
  
  // Vérification post-normalisation
  const [remaining] = await conn.query('SELECT chemicalFamily, COUNT(*) as n FROM molecules WHERE chemicalFamily IS NOT NULL GROUP BY chemicalFamily ORDER BY n DESC LIMIT 20');
  console.log('Top 20 familles après normalisation :');
  remaining.forEach(r => console.log(`  ${r.chemicalFamily}: ${r.n}`));
  
  console.log('\n=== SEEDING FOURNISSEURS PARFUM/BOTANIQUE ===\n');
  
  const suppliers = [
    // === GRANDES MAISONS DE PARFUMERIE ===
    {
      supplierId: 'PARF-001',
      name: 'Givaudan',
      legalName: 'Givaudan SA',
      supplierType: 'other',
      country: 'Suisse',
      website: 'https://www.givaudan.com',
      specialties: JSON.stringify(['matières premières synthétiques', 'molécules de synthèse', 'captives parfumerie', 'ingrédients naturels']),
      mainProducts: JSON.stringify(['Ambroxan', 'Iso E Super', 'Hedione', 'Rose Oxide', 'captives exclusives']),
      certifications: JSON.stringify(['ISO 9001', 'ISO 14001', 'IFRA compliance', 'REACH']),
      qualityRating: 'excellent',
      reliabilityRating: 'excellent',
      priceRating: 'premium',
      minimumOrder: '1 kg',
      leadTime: '2-4 semaines',
      notes: 'Leader mondial des arômes et parfums. Fournisseur de référence pour les captives et molécules de synthèse avancées.',
      status: 'active',
    },
    {
      supplierId: 'PARF-002',
      name: 'Firmenich',
      legalName: 'Firmenich International SA',
      supplierType: 'other',
      country: 'Suisse',
      website: 'https://www.firmenich.com',
      specialties: JSON.stringify(['ingrédients parfumerie', 'arômes alimentaires', 'biotechnologie', 'naturels certifiés']),
      mainProducts: JSON.stringify(['Dynascone', 'Habanolide', 'Helvetolide', 'Rose Absolute', 'Jasmine Absolute']),
      certifications: JSON.stringify(['ISO 9001', 'IFRA', 'COSMOS', 'Ecocert']),
      qualityRating: 'excellent',
      reliabilityRating: 'excellent',
      priceRating: 'premium',
      minimumOrder: '500 g',
      leadTime: '2-6 semaines',
      notes: 'Deuxième acteur mondial. Pionnier en biotechnologie pour la production de molécules naturelles identiques.',
      status: 'active',
    },
    {
      supplierId: 'PARF-003',
      name: 'Robertet',
      legalName: 'Robertet SA',
      supplierType: 'producer',
      country: 'France',
      website: 'https://www.robertet.com',
      specialties: JSON.stringify(['absolues naturelles', 'huiles essentielles', 'extraits botaniques', 'matières premières naturelles']),
      mainProducts: JSON.stringify(['Rose de Grasse absolute', 'Jasmin de Grasse absolute', 'Iris Pallida', 'Lavande', 'Ylang-Ylang']),
      certifications: JSON.stringify(['ISO 9001', 'COSMOS Organic', 'Ecocert', 'IFRA']),
      qualityRating: 'excellent',
      reliabilityRating: 'excellent',
      priceRating: 'premium',
      minimumOrder: '100 g',
      leadTime: '3-6 semaines',
      notes: 'Spécialiste historique des matières premières naturelles de Grasse. Référence pour les absolues et huiles essentielles de qualité parfumerie.',
      status: 'active',
    },
    {
      supplierId: 'PARF-004',
      name: 'Symrise',
      legalName: 'Symrise AG',
      supplierType: 'other',
      country: 'Allemagne',
      website: 'https://www.symrise.com',
      specialties: JSON.stringify(['arômes', 'parfumerie fine', 'cosmétique', 'ingrédients actifs']),
      mainProducts: JSON.stringify(['Javanol', 'Georgywood', 'Ambrette Seed', 'Cashmeran', 'Norlimbanol']),
      certifications: JSON.stringify(['ISO 9001', 'ISO 14001', 'IFRA', 'RSPO']),
      qualityRating: 'excellent',
      reliabilityRating: 'excellent',
      priceRating: 'competitive',
      minimumOrder: '1 kg',
      leadTime: '2-4 semaines',
      notes: 'Quatrième acteur mondial. Forte expertise en santalols de synthèse et muscs macrocycliques.',
      status: 'active',
    },
    {
      supplierId: 'PARF-005',
      name: 'IFF (International Flavors & Fragrances)',
      legalName: 'International Flavors & Fragrances Inc.',
      supplierType: 'other',
      country: 'USA',
      website: 'https://www.iff.com',
      specialties: JSON.stringify(['parfumerie fine', 'arômes', 'ingrédients actifs', 'biotechnologie']),
      mainProducts: JSON.stringify(['Galaxolide', 'Tonalide', 'Clearwood', 'Amber Xtreme', 'Orris Concrete']),
      certifications: JSON.stringify(['ISO 9001', 'IFRA', 'REACH', 'Halal']),
      qualityRating: 'excellent',
      reliabilityRating: 'good',
      priceRating: 'competitive',
      minimumOrder: '1 kg',
      leadTime: '3-5 semaines',
      notes: 'Acteur majeur post-fusion avec DuPont N&B. Large catalogue de muscs synthétiques et molécules de synthèse.',
      status: 'active',
    },
    // === FOURNISSEURS NATURELS SPÉCIALISÉS ===
    {
      supplierId: 'PARF-006',
      name: 'Biolandes',
      legalName: 'Biolandes SAS',
      supplierType: 'distiller',
      country: 'France',
      website: 'https://www.biolandes.com',
      specialties: JSON.stringify(['huiles essentielles bio', 'absolues', 'résinoïdes', 'produits des Landes']),
      mainProducts: JSON.stringify(['Armoise', 'Genévrier', 'Pin des Landes', 'Lavandin', 'Cèdre Atlas']),
      certifications: JSON.stringify(['AB Agriculture Biologique', 'Ecocert', 'COSMOS Organic']),
      qualityRating: 'excellent',
      reliabilityRating: 'good',
      priceRating: 'competitive',
      minimumOrder: '100 g',
      leadTime: '1-3 semaines',
      notes: 'Spécialiste des huiles essentielles bio françaises. Distillation directe de plantes cultivées dans les Landes.',
      status: 'active',
    },
    {
      supplierId: 'PARF-007',
      name: 'Enfleurage',
      legalName: 'Enfleurage New York LLC',
      supplierType: 'trader',
      country: 'USA',
      website: 'https://www.enfleurage.com',
      specialties: JSON.stringify(['huiles essentielles rares', 'absolues', 'hydrolats', 'matières premières naturelles']),
      mainProducts: JSON.stringify(['Oud Agarwood', 'Ambre gris', 'Castoreum', 'Civet', 'Musc de Tonkin']),
      certifications: JSON.stringify(['CITES compliance', 'IFRA']),
      qualityRating: 'excellent',
      reliabilityRating: 'good',
      priceRating: 'premium',
      minimumOrder: '1 g',
      leadTime: '1-2 semaines',
      notes: 'Spécialiste des matières premières rares et animalières. Référence pour l\'oud et les matières CITES.',
      status: 'active',
    },
    {
      supplierId: 'PARF-008',
      name: 'Charabot',
      legalName: 'Charabot SA',
      supplierType: 'distiller',
      country: 'France',
      website: 'https://www.charabot.com',
      specialties: JSON.stringify(['huiles essentielles Grasse', 'absolues florales', 'concrètes', 'extraits CO2']),
      mainProducts: JSON.stringify(['Rose Centifolia', 'Jasmin Sambac', 'Tubéreuse', 'Violette', 'Narcisse']),
      certifications: JSON.stringify(['ISO 9001', 'COSMOS', 'Ecocert']),
      qualityRating: 'excellent',
      reliabilityRating: 'excellent',
      priceRating: 'premium',
      minimumOrder: '10 g',
      leadTime: '2-4 semaines',
      notes: 'Maison historique de Grasse fondée en 1799. Référence absolue pour les fleurs de Grasse et les absolues de qualité supérieure.',
      status: 'active',
    },
    {
      supplierId: 'PARF-009',
      name: 'Pranarom',
      legalName: 'Pranarom International SA',
      supplierType: 'laboratory',
      country: 'Belgique',
      website: 'https://www.pranarom.com',
      specialties: JSON.stringify(['huiles essentielles chémotypées', 'aromathérapie', 'contrôle qualité HECT']),
      mainProducts: JSON.stringify(['Lavande vraie HECT', 'Tea Tree', 'Ravintsara', 'Eucalyptus', 'Menthe poivrée']),
      certifications: JSON.stringify(['ISO 9001', 'COSMOS', 'Ecocert', 'HECT certification']),
      qualityRating: 'excellent',
      reliabilityRating: 'excellent',
      priceRating: 'competitive',
      minimumOrder: '50 mL',
      leadTime: '1-2 semaines',
      notes: 'Référence en huiles essentielles chémotypées (HECT). Chaque lot analysé par GC/MS avec certificat d\'analyse.',
      status: 'active',
    },
    // === FOURNISSEURS BOTANIQUES ===
    {
      supplierId: 'BOTA-001',
      name: 'Herbes & Traditions',
      legalName: 'Herbes & Traditions SARL',
      supplierType: 'trader',
      country: 'France',
      website: 'https://www.herbes-et-traditions.com',
      specialties: JSON.stringify(['plantes médicinales séchées', 'épices', 'résines', 'matières premières botaniques']),
      mainProducts: JSON.stringify(['Oliban (Encens)', 'Myrrhe', 'Benjoin', 'Opoponax', 'Labdanum']),
      certifications: JSON.stringify(['AB Agriculture Biologique', 'Ecocert']),
      qualityRating: 'good',
      reliabilityRating: 'good',
      priceRating: 'competitive',
      minimumOrder: '100 g',
      leadTime: '3-7 jours',
      notes: 'Fournisseur de résines et plantes séchées pour la parfumerie artisanale. Bon rapport qualité/prix.',
      status: 'active',
    },
    {
      supplierId: 'BOTA-002',
      name: 'Aura Cacia',
      legalName: 'Frontier Co-op',
      supplierType: 'cooperative',
      country: 'USA',
      website: 'https://www.auracacia.com',
      specialties: JSON.stringify(['huiles essentielles bio', 'huiles végétales', 'matières premières aromathérapie']),
      mainProducts: JSON.stringify(['Patchouli', 'Ylang-Ylang', 'Vétiver', 'Santal', 'Bergamote bio']),
      certifications: JSON.stringify(['USDA Organic', 'Non-GMO', 'Fair Trade']),
      qualityRating: 'good',
      reliabilityRating: 'excellent',
      priceRating: 'competitive',
      minimumOrder: '30 mL',
      leadTime: '1-2 semaines',
      notes: 'Coopérative américaine spécialisée en huiles essentielles bio. Forte traçabilité et engagement éthique.',
      status: 'active',
    },
    {
      supplierId: 'BOTA-003',
      name: 'Tisserand Institute',
      legalName: 'Tisserand Aromatherapy Ltd',
      supplierType: 'laboratory',
      country: 'Royaume-Uni',
      website: 'https://www.tisserandinstitute.org',
      specialties: JSON.stringify(['huiles essentielles certifiées', 'recherche aromathérapie', 'formation']),
      mainProducts: JSON.stringify(['Rose Otto', 'Neroli', 'Jasmine Absolute', 'Frankincense', 'Sandalwood']),
      certifications: JSON.stringify(['ISO 9001', 'COSMOS', 'Soil Association Organic']),
      qualityRating: 'excellent',
      reliabilityRating: 'good',
      priceRating: 'premium',
      minimumOrder: '5 mL',
      leadTime: '1-3 semaines',
      notes: 'Référence académique en aromathérapie. Fondé par Robert Tisserand, auteur de "Essential Oil Safety".',
      status: 'active',
    },
    {
      supplierId: 'BOTA-004',
      name: 'Laboratoire Monique Rémy',
      legalName: 'LMR Naturals by IFF',
      supplierType: 'producer',
      country: 'France',
      website: 'https://www.lmrnaturals.com',
      specialties: JSON.stringify(['absolues de qualité parfumerie', 'extraits floraux', 'matières premières naturelles premium']),
      mainProducts: JSON.stringify(['Jasmin Absolu', 'Rose Absolu', 'Iris Beurre', 'Orris Root', 'Mimosa Absolu']),
      certifications: JSON.stringify(['ISO 9001', 'IFRA', 'Ecocert']),
      qualityRating: 'excellent',
      reliabilityRating: 'excellent',
      priceRating: 'premium',
      minimumOrder: '10 g',
      leadTime: '2-4 semaines',
      notes: 'Division naturels d\'IFF. Spécialiste des absolues et extraits floraux de haute qualité pour la parfumerie de luxe.',
      status: 'active',
    },
    {
      supplierId: 'BOTA-005',
      name: 'Natures Garden',
      legalName: 'Natures Garden Inc.',
      supplierType: 'trader',
      country: 'USA',
      website: 'https://www.naturesgarden.net',
      specialties: JSON.stringify(['huiles de fragrance', 'huiles essentielles', 'cires', 'matières premières cosmétiques']),
      mainProducts: JSON.stringify(['Fragrance Oils', 'Carrier Oils', 'Waxes', 'Colorants', 'Cosmetic Bases']),
      certifications: JSON.stringify(['IFRA compliance', 'REACH']),
      qualityRating: 'good',
      reliabilityRating: 'good',
      priceRating: 'budget',
      minimumOrder: '30 mL',
      leadTime: '3-7 jours',
      notes: 'Fournisseur américain polyvalent pour la parfumerie artisanale et la cosmétique DIY. Bon rapport qualité/prix pour les petites quantités.',
      status: 'active',
    },
    {
      supplierId: 'BOTA-006',
      name: 'Sozio',
      legalName: 'Sozio SAS',
      supplierType: 'other',
      country: 'France',
      website: 'https://www.sozio.com',
      specialties: JSON.stringify(['composés aromatiques', 'bases parfumées', 'ingrédients parfumerie', 'muscs']),
      mainProducts: JSON.stringify(['Muscs macrocycliques', 'Ambres synthétiques', 'Boisés', 'Floraux synthétiques']),
      certifications: JSON.stringify(['ISO 9001', 'IFRA', 'REACH']),
      qualityRating: 'good',
      reliabilityRating: 'good',
      priceRating: 'competitive',
      minimumOrder: '500 g',
      leadTime: '2-3 semaines',
      notes: 'Fabricant français de composés aromatiques. Spécialiste des bases parfumées et ingrédients pour la parfumerie industrielle.',
      status: 'active',
    },
  ];
  
  let inserted = 0;
  let skipped = 0;
  
  for (const supplier of suppliers) {
    const [existing] = await conn.query('SELECT id FROM extended_suppliers WHERE supplier_id = ?', [supplier.supplierId]);
    if (existing.length > 0) {
      console.log(`  ⏭ Déjà présent : ${supplier.name}`);
      skipped++;
      continue;
    }
    
    await conn.query(
      `INSERT INTO extended_suppliers 
       (supplier_id, name, legal_name, supplier_type, country, website, specialties, main_products, certifications, quality_rating, reliability_rating, price_rating, minimum_order, lead_time, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        supplier.supplierId,
        supplier.name,
        supplier.legalName || null,
        supplier.supplierType,
        supplier.country,
        supplier.website || null,
        supplier.specialties,
        supplier.mainProducts,
        supplier.certifications,
        supplier.qualityRating,
        supplier.reliabilityRating,
        supplier.priceRating,
        supplier.minimumOrder || null,
        supplier.leadTime || null,
        supplier.notes || null,
        supplier.status,
      ]
    );
    console.log(`  ✓ Inséré : ${supplier.name} (${supplier.supplierId})`);
    inserted++;
  }
  
  console.log(`\nRésultat : ${inserted} fournisseurs insérés, ${skipped} déjà présents`);
  
  // Vérification finale
  const [[{total}]] = await conn.query('SELECT COUNT(*) as total FROM extended_suppliers');
  const [cats] = await conn.query('SELECT LEFT(supplier_id, 4) as cat, COUNT(*) as n FROM extended_suppliers GROUP BY cat ORDER BY cat');
  console.log(`\nTotal fournisseurs : ${total}`);
  console.log('Par catégorie :');
  cats.forEach(c => console.log(`  ${c.cat}: ${c.n}`));
  
  await conn.end();
}

main().catch(console.error);
