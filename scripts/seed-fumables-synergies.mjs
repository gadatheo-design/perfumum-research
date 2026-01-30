/**
 * PERFUMUM - Script de seed pour plantes fumables et synergies tabac-cannabis-parfum
 * Date: 04 janvier 2026
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  if (!DATABASE_URL) {
    console.error('DATABASE_URL non définie');
    process.exit(1);
  }

  const connection = await mysql.createConnection(DATABASE_URL);
  console.log('Connexion à la base de données établie');

  try {
    // ========================================================================
    // SECTION 1: NOUVELLES PLANTES FUMABLES ET AROMATIQUES
    // ========================================================================
    
    console.log('\n📌 Insertion des nouvelles plantes...');
    
    const newPlants = [
      // Variétés de Tabac de Niche
      {
        name: 'Perique',
        latin_name: 'Nicotiana tabacum var. Perique',
        family: 'Solanaceae',
        category: 'tabac',
        origin: 'Louisiane, USA (St. James Parish)',
        habitat: 'Marécages du delta du Mississippi',
        olfactive_signature: 'Épicé intense, figues fermentées, pruneaux, notes de vin',
        dominant_molecules: JSON.stringify(['acide acétique', 'damascones', 'composés fermentés', 'nicotine']),
        climatic_axis: 'bois',
        traditional_use: 'Condiment pour mélanges de pipe (1-5%), fermentation sous pression unique',
        notes: 'Tabac le plus rare au monde. Fermentation anaérobie pendant 12 mois sous pression.'
      },
      {
        name: 'Latakia',
        latin_name: 'Nicotiana tabacum var. Latakia',
        family: 'Solanaceae',
        category: 'tabac',
        origin: 'Syrie (Lattaquié) / Chypre',
        habitat: 'Côtes méditerranéennes orientales',
        olfactive_signature: 'Fumé intense, cuir, bois brûlé, encens, notes camphrées',
        dominant_molecules: JSON.stringify(['phénols', 'guaiacol', 'créosol', '4-méthylguaiacol', 'syringol']),
        climatic_axis: 'bois_disparition',
        traditional_use: 'Mélanges anglais pour pipe (20-50%), fumage au bois aromatique',
        notes: 'Fumé sur feux de bois aromatiques. Production syrienne quasi-éteinte.'
      },
      {
        name: 'Mapacho',
        latin_name: 'Nicotiana rustica',
        family: 'Solanaceae',
        category: 'tabac',
        origin: 'Amazonie (Pérou, Brésil, Équateur)',
        habitat: 'Forêt amazonienne, zones tropicales humides',
        olfactive_signature: 'Très fort, terreux profond, piquant, notes de terre mouillée',
        dominant_molecules: JSON.stringify(['nicotine (9x)', 'nornicotine', 'anabasine', 'myosmine']),
        climatic_axis: 'disparition',
        traditional_use: 'Rituels chamaniques (Ayahuasca), purification, médecine traditionnelle',
        notes: 'Tabac sacré des peuples amazoniens. Contient 9% de nicotine vs 1-3% pour N. tabacum.'
      },
      {
        name: 'Oriental Katerini',
        latin_name: 'Nicotiana tabacum var. Katerini',
        family: 'Solanaceae',
        category: 'tabac',
        origin: 'Grèce (Macédoine, Piérie)',
        habitat: 'Collines méditerranéennes, sols pauvres',
        olfactive_signature: 'Doux, herbacé, légèrement sucré, notes de foin et miel',
        dominant_molecules: JSON.stringify(['terpénoïdes', 'esters aromatiques', 'damascones', 'ionones']),
        climatic_axis: 'vent',
        traditional_use: 'Mélanges orientaux premium, cigarettes haut de gamme',
        notes: 'Petites feuilles riches en huiles aromatiques. Séchage au soleil traditionnel.'
      },
      {
        name: 'Yenidje',
        latin_name: 'Nicotiana tabacum var. Yenidje',
        family: 'Solanaceae',
        category: 'tabac',
        origin: 'Grèce (Thrace, ancienne Yenidje)',
        habitat: 'Plaines de Thrace, climat continental',
        olfactive_signature: 'Floral, épicé doux, notes de rose et de miel',
        dominant_molecules: JSON.stringify(['damascenone', 'géraniol', 'linalol', 'β-ionone']),
        climatic_axis: 'vent_bois',
        traditional_use: 'Mélanges orientaux de luxe, parfumerie du tabac',
        notes: 'Considéré comme le plus aromatique des tabacs orientaux.'
      },
      // Variétés Cannabis Landrace
      {
        name: 'Durban Poison',
        latin_name: 'Cannabis sativa var. Durban',
        family: 'Cannabaceae',
        category: 'cannabis',
        origin: 'Afrique du Sud (Durban, KwaZulu-Natal)',
        habitat: 'Côte est sud-africaine, climat subtropical',
        olfactive_signature: 'Énergisant, doux, anis, réglisse, notes de pin',
        dominant_molecules: JSON.stringify(['terpinolène', 'myrcène', 'ocimène', 'β-caryophyllène', 'THCV']),
        climatic_axis: 'vent',
        traditional_use: 'Variété sativa pure, usage traditionnel zoulou',
        notes: 'Une des rares sativas pures encore cultivées. Haute teneur en THCV.'
      },
      {
        name: 'Hindu Kush',
        latin_name: 'Cannabis indica var. Hindu Kush',
        family: 'Cannabaceae',
        category: 'cannabis',
        origin: 'Afghanistan / Pakistan (chaîne Hindu Kush)',
        habitat: 'Montagnes arides, haute altitude (2000-3000m)',
        olfactive_signature: 'Terreux profond, boisé, encens, notes de santal et hash',
        dominant_molecules: JSON.stringify(['myrcène', 'β-caryophyllène', 'limonène', 'α-pinène', 'linalol']),
        climatic_axis: 'bois',
        traditional_use: 'Production de charas (hash frotté à la main)',
        notes: 'Indica pure ancestrale. Base génétique de nombreux hybrides modernes.'
      },
      {
        name: 'Acapulco Gold',
        latin_name: 'Cannabis sativa var. Acapulco',
        family: 'Cannabaceae',
        category: 'cannabis',
        origin: 'Mexique (Guerrero, région Acapulco)',
        habitat: 'Sierra Madre del Sur, climat tropical de montagne',
        olfactive_signature: 'Sucré, épicé, agrumes, notes de caramel brûlé',
        dominant_molecules: JSON.stringify(['limonène', 'myrcène', 'α-pinène', 'β-caryophyllène', 'humulène']),
        climatic_axis: 'vent_bois',
        traditional_use: 'Variété mexicaine légendaire des années 60-70',
        notes: 'Couleur dorée caractéristique. Quasi-éteinte à état sauvage.'
      },
      {
        name: 'Ketama',
        latin_name: 'Cannabis sativa var. Ketama',
        family: 'Cannabaceae',
        category: 'cannabis',
        origin: 'Maroc (Rif, région de Ketama)',
        habitat: 'Montagnes du Rif, climat méditerranéen montagnard',
        olfactive_signature: 'Terreux, floral doux, notes de hashishene, miel',
        dominant_molecules: JSON.stringify(['hashishene', 'myrcène', 'β-caryophyllène', 'limonène', 'α-pinène']),
        climatic_axis: 'bois_disparition',
        traditional_use: 'Hash marocain traditionnel (dry sift)',
        notes: 'Seule variété produisant naturellement du hashishene après transformation.'
      },
      {
        name: 'Thai Stick',
        latin_name: 'Cannabis sativa var. Thai',
        family: 'Cannabaceae',
        category: 'cannabis',
        origin: 'Thaïlande (Nord-Est, Isan)',
        habitat: 'Plaines tropicales, mousson',
        olfactive_signature: 'Fruité tropical, chocolat, notes de café et bois exotique',
        dominant_molecules: JSON.stringify(['terpinolène', 'myrcène', 'caryophyllène', 'humulène', 'ocimène']),
        climatic_axis: 'vent',
        traditional_use: 'Bâtonnets de bambou enroulés de fleurs',
        notes: 'Floraison très longue (14-20 semaines). Profil psychédélique unique.'
      },
      // Résines Aromatiques
      {
        name: 'Oliban (Encens)',
        latin_name: 'Boswellia sacra',
        family: 'Burseraceae',
        category: 'resine',
        origin: 'Oman, Yémen, Somalie',
        habitat: 'Zones arides, falaises calcaires',
        olfactive_signature: 'Boisé, citronné, balsamique, notes encens sacré',
        dominant_molecules: JSON.stringify(['α-pinène', 'limonène', 'incensole', 'acétate incensyle', 'α-thujène']),
        climatic_axis: 'vent_bois',
        traditional_use: 'Méditation, purification, rituels religieux',
        notes: 'Résine sacrée depuis Antiquité. Incensole a propriétés anxiolytiques prouvées.'
      },
      {
        name: 'Copal',
        latin_name: 'Bursera spp.',
        family: 'Burseraceae',
        category: 'resine',
        origin: 'Mexique, Amérique centrale',
        habitat: 'Forêts tropicales sèches, zones semi-arides',
        olfactive_signature: 'Citronné vif, pin, frais, notes de résine fraîche',
        dominant_molecules: JSON.stringify(['α-pinène', 'limonène', 'sabinène', 'β-phellandrène', 'α-terpinéol']),
        climatic_axis: 'vent',
        traditional_use: 'Rituels mésoaméricains (Mayas, Aztèques), purification',
        notes: 'Résine sacrée précolombienne. Plusieurs espèces (B. bipinnata, B. copallifera).'
      },
      {
        name: 'Labdanum',
        latin_name: 'Cistus ladanifer',
        family: 'Cistaceae',
        category: 'resine',
        origin: 'Méditerranée (Espagne, Portugal, Grèce)',
        habitat: 'Maquis méditerranéen, sols pauvres',
        olfactive_signature: 'Ambré profond, musqué, cuir, notes animales',
        dominant_molecules: JSON.stringify(['labdanolide', 'sclareol', 'ambrox', 'acide labdanolique']),
        climatic_axis: 'bois',
        traditional_use: 'Parfumerie (substitut ambre gris), médecine traditionnelle',
        notes: 'Récolte traditionnelle par brossage des chèvres. Base accords ambrés.'
      },
      {
        name: 'Myrrhe',
        latin_name: 'Commiphora myrrha',
        family: 'Burseraceae',
        category: 'resine',
        origin: 'Somalie, Éthiopie, Yémen',
        habitat: 'Zones arides, déserts rocheux',
        olfactive_signature: 'Balsamique, amer, médicinal, notes de réglisse',
        dominant_molecules: JSON.stringify(['furanosesquiterpènes', 'curzerène', 'lindestrène', 'germacrone']),
        climatic_axis: 'bois_disparition',
        traditional_use: 'Embaumement (Égypte), médecine, rituels religieux',
        notes: 'Une des résines les plus anciennes utilisées. Propriétés antiseptiques.'
      },
      // Herbes Fumables
      {
        name: 'Damiana',
        latin_name: 'Turnera diffusa',
        family: 'Passifloraceae',
        category: 'aromatique',
        origin: 'Mexique, Amérique centrale, Texas',
        habitat: 'Zones semi-arides, broussailles',
        olfactive_signature: 'Sucré, épicé, légèrement amer, notes de figue',
        dominant_molecules: JSON.stringify(['damianine', 'arbutine', 'thymol', '1,8-cinéole', 'β-sitostérol']),
        climatic_axis: 'vent_bois',
        traditional_use: 'Aphrodisiaque traditionnel maya, relaxant',
        notes: 'Utilisée depuis les Mayas comme aphrodisiaque. Base liqueur mexicaine.'
      },
      {
        name: 'Lotus Bleu',
        latin_name: 'Nymphaea caerulea',
        family: 'Nymphaeaceae',
        category: 'fleur',
        origin: 'Égypte, Afrique de Est',
        habitat: 'Lacs, rivières calmes, zones humides',
        olfactive_signature: 'Floral doux, aquatique, légèrement narcotique',
        dominant_molecules: JSON.stringify(['aporphine', 'nuciférine', 'nupharidine', 'coclaurine']),
        climatic_axis: 'disparition',
        traditional_use: 'Égypte ancienne (rituels, vin de lotus), relaxant onirique',
        notes: 'Fleur sacrée égyptienne. Effets oniriques légers.'
      },
      {
        name: 'Wild Dagga',
        latin_name: 'Leonotis leonurus',
        family: 'Lamiaceae',
        category: 'aromatique',
        origin: 'Afrique du Sud',
        habitat: 'Savanes, zones perturbées',
        olfactive_signature: 'Herbacé, légèrement sucré, notes de menthe',
        dominant_molecules: JSON.stringify(['leonurine', 'marrubine', 'premarrubine', 'diterpènes']),
        climatic_axis: 'vent',
        traditional_use: 'Euphorisant léger traditionnel khoisan, substitut cannabis',
        notes: 'Appelée cannabis sauvage en Afrique du Sud. Effets légers, légale.'
      },
      {
        name: 'Armoise',
        latin_name: 'Artemisia vulgaris',
        family: 'Asteraceae',
        category: 'aromatique',
        origin: 'Hémisphère Nord (Europe, Asie, Amérique)',
        habitat: 'Terrains vagues, bords de chemins',
        olfactive_signature: 'Herbacé intense, amer, aromatique, notes de sauge',
        dominant_molecules: JSON.stringify(['thuyone', '1,8-cinéole', 'camphre', 'bornéol', 'artemisinine']),
        climatic_axis: 'vent_disparition',
        traditional_use: 'Rêves lucides, moxibustion, purification',
        notes: 'Herbe des rêves. Précaution: thuyone neurotoxique à haute dose.'
      },
      {
        name: 'Kanna',
        latin_name: 'Sceletium tortuosum',
        family: 'Aizoaceae',
        category: 'aromatique',
        origin: 'Afrique du Sud (Cap)',
        habitat: 'Zones semi-arides, karoo',
        olfactive_signature: 'Herbacé, légèrement sucré, notes terreuses',
        dominant_molecules: JSON.stringify(['mésembrine', 'mésembrénone', 'tortuosamine']),
        climatic_axis: 'disparition',
        traditional_use: 'Anxiolytique traditionnel khoisan, mâché ou fumé',
        notes: 'ISRS naturel. Usage traditionnel depuis 300+ ans. Fermentation nécessaire.'
      },
      {
        name: 'Passiflore',
        latin_name: 'Passiflora incarnata',
        family: 'Passifloraceae',
        category: 'aromatique',
        origin: 'Sud-Est des États-Unis, Amérique centrale',
        habitat: 'Lisières de forêts, zones perturbées',
        olfactive_signature: 'Floral doux, herbacé, notes de foin',
        dominant_molecules: JSON.stringify(['chrysine', 'apigénine', 'harmane', 'harmine', 'flavonoïdes']),
        climatic_axis: 'vent',
        traditional_use: 'Sédatif traditionnel amérindien, anxiolytique',
        notes: 'Contient des IMAO légers (harmane). Synergie potentielle avec autres plantes.'
      },
      {
        name: 'Klip Dagga',
        latin_name: 'Leonotis nepetifolia',
        family: 'Lamiaceae',
        category: 'aromatique',
        origin: 'Afrique tropicale',
        habitat: 'Zones perturbées, bords de routes tropicaux',
        olfactive_signature: 'Herbacé, mentholé léger, notes de résine',
        dominant_molecules: JSON.stringify(['leonurine', 'népétifoline', 'diterpènes labdanes']),
        climatic_axis: 'vent',
        traditional_use: 'Euphorisant léger, médecine traditionnelle africaine',
        notes: 'Cousine de Wild Dagga, effets similaires mais plus doux.'
      },
      {
        name: 'Calamus (Acore)',
        latin_name: 'Acorus calamus',
        family: 'Acoraceae',
        category: 'racine',
        origin: 'Asie, Europe, Amérique du Nord',
        habitat: 'Zones humides, marécages',
        olfactive_signature: 'Épicé, boisé, notes de cannelle et gingembre',
        dominant_molecules: JSON.stringify(['β-asarone', 'α-asarone', 'acorone', 'calamenol']),
        climatic_axis: 'bois',
        traditional_use: 'Médecine ayurvédique (vacha), stimulant cognitif',
        notes: 'Attention: β-asarone potentiellement cancérigène. Variétés américaines plus sûres.'
      }
    ];

    for (const plant of newPlants) {
      try {
        const [existing] = await connection.execute(
          'SELECT id FROM plants WHERE name = ? OR latin_name = ?',
          [plant.name, plant.latin_name]
        );
        
        if (existing.length === 0) {
          await connection.execute(
            `INSERT INTO plants (name, latin_name, family, category, origin, habitat, 
              olfactive_signature, dominant_molecules, climatic_axis, traditional_use, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              plant.name,
              plant.latin_name,
              plant.family,
              plant.category,
              plant.origin,
              plant.habitat,
              plant.olfactive_signature,
              plant.dominant_molecules,
              plant.climatic_axis,
              plant.traditional_use,
              plant.notes
            ]
          );
          console.log(`  ✓ Plante ajoutée: ${plant.name}`);
        } else {
          console.log(`  ⏭ Plante existante: ${plant.name}`);
        }
      } catch (err) {
        console.error(`  ✗ Erreur pour ${plant.name}:`, err.message);
      }
    }

    // ========================================================================
    // SECTION 2: NOUVELLES MOLÉCULES CLÉS
    // ========================================================================
    
    console.log('\n📌 Insertion des nouvelles molécules...');
    
    const newMolecules = [
      {
        name: 'Hashishene',
        iupac_name: '5,5-dimethyl-1-vinylbicyclo[2.1.1]hexane',
        cas_number: null,
        chemical_formula: 'C10H16',
        molecular_weight: 136.23,
        chemical_class: 'monoterpene',
        odor_description: 'Terreux, floral doux, signature unique du hash marocain',
        source_origin: 'Photo-oxydation du β-myrcène dans le hashish marocain',
        notes: 'Découvert en 2014 par Marchini et al. Jusqu à 14.9% des terpènes du hash marocain.'
      },
      {
        name: 'Damascenone',
        iupac_name: '(E)-1-(2,6,6-trimethylcyclohexa-1,3-dien-1-yl)but-2-en-1-one',
        cas_number: '23696-85-7',
        chemical_formula: 'C13H18O',
        molecular_weight: 190.28,
        chemical_class: 'norisoprenoid',
        odor_description: 'Rose intense, miel, tabac, fruité complexe',
        source_origin: 'Rose, tabac, thé, vin',
        notes: 'Pont olfactif majeur entre tabac et parfumerie. Seuil de détection très bas.'
      },
      {
        name: 'Incensole',
        iupac_name: '(1R,3S,6R,7R,11S)-3-hydroxy-6,10,10-trimethyl-11-(3-methylbut-3-enyl)bicyclo[8.1.0]undec-4-ene',
        cas_number: '22427-39-0',
        chemical_formula: 'C20H34O',
        molecular_weight: 306.48,
        chemical_class: 'diterpene',
        odor_description: 'Balsamique, encens, boisé sacré',
        source_origin: 'Boswellia sacra (oliban/encens)',
        notes: 'Propriétés anxiolytiques prouvées (activation TRPV3). Effets psychoactifs légers.'
      },
      {
        name: 'Leonurine',
        iupac_name: '4-guanidino-n-butyl-syringate',
        cas_number: '24697-74-3',
        chemical_formula: 'C14H21N3O5',
        molecular_weight: 311.33,
        chemical_class: 'alkaloid',
        odor_description: 'Herbacé léger',
        source_origin: 'Leonotis leonurus (Wild Dagga), Leonurus cardiaca',
        notes: 'Alcaloïde responsable des effets euphorisants légers du Wild Dagga.'
      },
      {
        name: 'Mésembrine',
        iupac_name: '(3aS,7aS)-3a-(3,4-dimethoxyphenyl)-1-methyl-2,3,4,5,7,7a-hexahydroindol-6-one',
        cas_number: '468-56-4',
        chemical_formula: 'C17H23NO3',
        molecular_weight: 289.37,
        chemical_class: 'alkaloid',
        odor_description: 'Inodore',
        source_origin: 'Sceletium tortuosum (Kanna)',
        notes: 'ISRS naturel. Responsable des effets anxiolytiques du Kanna.'
      },
      {
        name: 'Nuciférine',
        iupac_name: '1,2-dimethoxyaporphine',
        cas_number: '475-83-2',
        chemical_formula: 'C19H21NO2',
        molecular_weight: 295.38,
        chemical_class: 'aporphine alkaloid',
        odor_description: 'Inodore',
        source_origin: 'Nymphaea caerulea (Lotus Bleu), Nelumbo nucifera',
        notes: 'Alcaloïde principal du lotus bleu. Effets oniriques et relaxants.'
      },
      {
        name: 'Guaiacol',
        iupac_name: '2-methoxyphenol',
        cas_number: '90-05-1',
        chemical_formula: 'C7H8O2',
        molecular_weight: 124.14,
        chemical_class: 'phenol',
        odor_description: 'Fumé, médicinal, bacon, bois brûlé',
        source_origin: 'Fumée de bois, tabac Latakia, créosote',
        notes: 'Responsable de odeur fumée caractéristique du Latakia.'
      },
      {
        name: 'β-Asarone',
        iupac_name: '(Z)-1,2,4-trimethoxy-5-prop-1-enylbenzene',
        cas_number: '5273-86-9',
        chemical_formula: 'C12H16O3',
        molecular_weight: 208.25,
        chemical_class: 'phenylpropanoid',
        odor_description: 'Épicé, boisé, notes de cannelle',
        source_origin: 'Acorus calamus (Calamus/Acore)',
        notes: 'Composant principal du calamus asiatique. Potentiellement cancérigène.'
      }
    ];

    for (const mol of newMolecules) {
      try {
        const [existing] = await connection.execute(
          'SELECT id FROM molecules WHERE name = ?',
          [mol.name]
        );
        
        if (existing.length === 0) {
          await connection.execute(
            `INSERT INTO molecules (name, iupacName, casNumber, chemicalFormula, 
              molecularWeight, chemicalClass, odorDescription, sourceOrigin, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              mol.name,
              mol.iupac_name,
              mol.cas_number,
              mol.chemical_formula,
              mol.molecular_weight,
              mol.chemical_class,
              mol.odor_description,
              mol.source_origin,
              mol.notes
            ]
          );
          console.log(`  ✓ Molécule ajoutée: ${mol.name}`);
        } else {
          console.log(`  ⏭ Molécule existante: ${mol.name}`);
        }
      } catch (err) {
        console.error(`  ✗ Erreur pour ${mol.name}:`, err.message);
      }
    }

    // ========================================================================
    // SECTION 3: TERMES DE GLOSSAIRE
    // ========================================================================
    
    console.log('\n📌 Insertion des termes de glossaire...');
    
    const glossaryTerms = [
      {
        term: 'Effet Entourage',
        definition: 'Synergie entre les phytocannabinoïdes (THC, CBD) et les terpénoïdes du cannabis, où les composés agissent ensemble pour moduler et potentialiser les effets.',
        category: 'interaction'
      },
      {
        term: 'Hashishene',
        definition: 'Monoterpène (C10H16) unique au hashish marocain, formé par photo-oxydation du β-myrcène lors du séchage traditionnel au soleil.',
        category: 'molecule'
      },
      {
        term: 'Photo-oxydation',
        definition: 'Réaction chimique où une molécule est oxydée sous effet de la lumière (UV). Transforme le myrcène en hashishene.',
        category: 'reaction'
      },
      {
        term: 'Casing',
        definition: 'Technique aromatisation du tabac où une sauce de base (sucres, miel, réglisse) est appliquée avant le séchage final.',
        category: 'technique'
      },
      {
        term: 'Top Dressing',
        definition: 'Aromatisation finale du tabac avec des huiles essentielles et molécules synthétiques après le casing.',
        category: 'technique'
      },
      {
        term: 'Agoniste CB2',
        definition: 'Molécule qui active les récepteurs cannabinoïdes de type 2. Le β-caryophyllène est un agoniste CB2 naturel non-psychoactif.',
        category: 'interaction'
      },
      {
        term: 'Damascones',
        definition: 'Famille de norisoprénoïdes (C13) présents dans la rose et le tabac, caractérisés par des notes rose-fruité-tabac.',
        category: 'molecule'
      },
      {
        term: 'Charas',
        definition: 'Hashish traditionnel indien/népalais produit par frottement des fleurs fraîches de cannabis entre les mains.',
        category: 'technique'
      }
    ];
    
    for (const term of glossaryTerms) {
      try {
        const [existing] = await connection.execute(
          'SELECT id FROM glossary WHERE term = ?',
          [term.term]
        );
        
        if (existing.length === 0) {
          await connection.execute(
            'INSERT INTO glossary (term, definition, category) VALUES (?, ?, ?)',
            [term.term, term.definition, term.category]
          );
          console.log(`  ✓ Terme ajouté: ${term.term}`);
        } else {
          console.log(`  ⏭ Terme existant: ${term.term}`);
        }
      } catch (err) {
        console.error(`  ✗ Erreur pour ${term.term}:`, err.message);
      }
    }

    console.log('\n✅ Seed terminé avec succès!');
    
  } catch (error) {
    console.error('Erreur lors du seed:', error);
  } finally {
    await connection.end();
  }
}

main();
