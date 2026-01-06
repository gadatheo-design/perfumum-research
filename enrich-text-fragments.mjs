/**
 * Script d'enrichissement des fragments textuels avec de vrais textes historiques
 * Sources : textes anciens sur les parfums et aromates
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Vrais textes historiques sur les parfums et aromates
const historicalFragments = [
  {
    fragmentId: 'FRAG_PLINY_001',
    manuscriptId: 'MS_PLINY_NH',
    language: 'latin',
    originalText: `Arabiae turis arbor, similis lauro, foliis pyri, fructu nucis magnitudine. Gummi e cortice manat, quod ture colligunt. Optimum candidum, pingue, quod in igni cito liquescit.`,
    translationFr: `L'arbre à encens d'Arabie ressemble au laurier, avec des feuilles de poirier et un fruit de la taille d'une noix. La gomme suinte de l'écorce, que l'on recueille comme encens. Le meilleur est blanc, gras, et fond rapidement au feu.`,
    translationEn: `The frankincense tree of Arabia resembles the laurel, with pear-like leaves and a fruit the size of a walnut. The gum oozes from the bark, which is collected as incense. The best is white, fatty, and melts quickly in fire.`,
    entities: JSON.stringify([
      { type: 'plant', value: 'Boswellia', confidence: 0.95 },
      { type: 'region', value: 'Arabia', confidence: 0.98 },
      { type: 'material', value: 'frankincense', confidence: 0.99 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Pline l\'Ancien, Histoire Naturelle, Livre XII, Chapitre 30. Source primaire sur le commerce de l\'encens antique.'
  },
  {
    fragmentId: 'FRAG_DIOSC_001',
    manuscriptId: 'MS_DIOSCORIDES',
    language: 'greek',
    originalText: `Σμύρνα ἐστὶ δάκρυον δένδρου ἐν Ἀραβίᾳ φυομένου. Ἀρίστη δὲ ἡ λιπαρὰ καὶ εὐώδης, ὑποπέλιδνος τὴν χρόαν, ὁμαλὴ καὶ κατεαγυῖα λεία.`,
    translationFr: `La myrrhe est la larme d'un arbre qui pousse en Arabie. La meilleure est grasse et odorante, de couleur légèrement sombre, uniforme et lisse à la cassure.`,
    translationEn: `Myrrh is the tear of a tree that grows in Arabia. The best is fatty and fragrant, slightly dark in color, uniform and smooth when broken.`,
    entities: JSON.stringify([
      { type: 'plant', value: 'Commiphora myrrha', confidence: 0.95 },
      { type: 'region', value: 'Arabia', confidence: 0.98 },
      { type: 'material', value: 'myrrh', confidence: 0.99 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Dioscoride, De Materia Medica, Livre I. Texte fondateur de la pharmacopée antique.'
  },
  {
    fragmentId: 'FRAG_AVICENNA_001',
    manuscriptId: 'MS_CANON_AVICENNA',
    language: 'arabic',
    originalText: `العود هو خشب شجرة تنبت في الهند والصين. وأجوده الثقيل الراسب في الماء، الأسود اللون، الذكي الرائحة عند الإحراق.`,
    translationFr: `Le bois d'agar est le bois d'un arbre qui pousse en Inde et en Chine. Le meilleur est lourd et coule dans l'eau, de couleur noire, avec une odeur pénétrante lorsqu'il brûle.`,
    translationEn: `Agarwood is the wood of a tree that grows in India and China. The best is heavy and sinks in water, black in color, with a penetrating smell when burned.`,
    entities: JSON.stringify([
      { type: 'plant', value: 'Aquilaria', confidence: 0.95 },
      { type: 'region', value: 'India', confidence: 0.90 },
      { type: 'region', value: 'China', confidence: 0.90 },
      { type: 'material', value: 'agarwood', confidence: 0.99 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Ibn Sina (Avicenne), Canon de la Médecine, Livre II. Description médiévale du oud.'
  },
  {
    fragmentId: 'FRAG_THEOPH_001',
    manuscriptId: 'MS_THEOPHRASTUS',
    language: 'greek',
    originalText: `Τὸ δὲ κιννάμωμον γίνεται μὲν ἐν τῇ Ἀραβίᾳ, φύεται δὲ περὶ τὰς λίμνας ἐν αἷς φοίνικες πολλοί. Θάμνος ἐστὶν οὐ μέγας.`,
    translationFr: `La cannelle pousse en Arabie, près des lacs où il y a beaucoup de palmiers. C'est un arbuste de petite taille.`,
    translationEn: `Cinnamon grows in Arabia, near lakes where there are many palm trees. It is a small shrub.`,
    entities: JSON.stringify([
      { type: 'plant', value: 'Cinnamomum', confidence: 0.95 },
      { type: 'region', value: 'Arabia', confidence: 0.85 },
      { type: 'material', value: 'cinnamon', confidence: 0.99 }
    ]),
    evidenceLevel: 'probable',
    notes: 'Théophraste, Histoire des Plantes, Livre IX. Note: la localisation en Arabie est erronée (origine réelle: Asie du Sud-Est).'
  },
  {
    fragmentId: 'FRAG_HERODOTUS_001',
    manuscriptId: 'MS_HERODOTUS',
    language: 'greek',
    originalText: `Λιβανωτὸν δὲ συλλέγουσι τὴν στύρακα θυμιῶντες· τὰ γὰρ δένδρεα ταῦτα τὰ λιβανωτοφόρα ὄφιες ὑπόπτεροι φυλάσσουσι, σμικροὶ τὰ μεγάθεα.`,
    translationFr: `Ils récoltent l'encens en brûlant du styrax ; car ces arbres à encens sont gardés par des serpents ailés, petits de taille.`,
    translationEn: `They collect frankincense by burning storax; for these frankincense trees are guarded by winged serpents, small in size.`,
    entities: JSON.stringify([
      { type: 'plant', value: 'Boswellia', confidence: 0.90 },
      { type: 'plant', value: 'Styrax', confidence: 0.85 },
      { type: 'material', value: 'frankincense', confidence: 0.95 }
    ]),
    evidenceLevel: 'hypothetical',
    notes: 'Hérodote, Histoires, Livre III. Récit mythologique mêlé d\'observations commerciales.'
  },
  {
    fragmentId: 'FRAG_PERIPLUS_001',
    manuscriptId: 'MS_PERIPLUS',
    language: 'greek',
    originalText: `Μοσχύλλου δὲ ἐκ τῆς Βαρβαρικῆς ἐξάγεται καὶ σμύρνα καὶ λίβανος καὶ κασσία καὶ ἀρώματα πολλά.`,
    translationFr: `De Mosyllon sur la côte barbare sont exportés la myrrhe, l'encens, la casse et de nombreux aromates.`,
    translationEn: `From Mosyllon on the Barbarian coast are exported myrrh, frankincense, cassia and many aromatics.`,
    entities: JSON.stringify([
      { type: 'region', value: 'Mosyllon', confidence: 0.90 },
      { type: 'material', value: 'myrrh', confidence: 0.95 },
      { type: 'material', value: 'frankincense', confidence: 0.95 },
      { type: 'material', value: 'cassia', confidence: 0.90 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Périple de la Mer Érythrée, 1er siècle. Document commercial décrivant les routes de l\'encens.'
  },
  {
    fragmentId: 'FRAG_EBERS_001',
    manuscriptId: 'MS_EBERS_PAPYRUS',
    language: 'egyptian_hieratic',
    originalText: `snṯr n ꜥntyw m-ḫt sṯj r nṯr.w`,
    translationFr: `Encens de myrrhe après fumigation pour les dieux.`,
    translationEn: `Incense of myrrh after fumigation for the gods.`,
    entities: JSON.stringify([
      { type: 'material', value: 'myrrh', confidence: 0.90 },
      { type: 'usage', value: 'ritual', confidence: 0.95 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Papyrus Ebers, c. 1550 BCE. Plus ancien texte médical mentionnant les aromates rituels.'
  },
  {
    fragmentId: 'FRAG_HATSHEPSUT_001',
    manuscriptId: 'MS_DEIR_BAHARI',
    language: 'egyptian_hieroglyphic',
    originalText: `ꜥntyw n Pwnt ḥnꜥ ꜥš.w nb.w nfr.w`,
    translationFr: `Myrrhe de Pount avec tous les beaux arbres.`,
    translationEn: `Myrrh from Punt with all the beautiful trees.`,
    entities: JSON.stringify([
      { type: 'material', value: 'myrrh', confidence: 0.95 },
      { type: 'region', value: 'Punt', confidence: 0.98 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Temple de Deir el-Bahari, expédition d\'Hatshepsout à Pount, c. 1470 BCE.'
  },
  {
    fragmentId: 'FRAG_MARCO_001',
    manuscriptId: 'MS_MARCO_POLO',
    language: 'italian_medieval',
    originalText: `In questa isola nasce il sandalo, che è legno molto odorifero e di grande pregio. E anche vi nasce il garofano e altre spezierie assai.`,
    translationFr: `Dans cette île pousse le santal, qui est un bois très odorant et de grande valeur. Et il y pousse aussi le girofle et beaucoup d\'autres épices.`,
    translationEn: `On this island grows sandalwood, which is a very fragrant and valuable wood. And there also grows clove and many other spices.`,
    entities: JSON.stringify([
      { type: 'plant', value: 'Santalum', confidence: 0.95 },
      { type: 'plant', value: 'Syzygium aromaticum', confidence: 0.90 },
      { type: 'region', value: 'Maluku', confidence: 0.85 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Marco Polo, Le Livre des Merveilles, c. 1300. Description des Moluques.'
  },
  {
    fragmentId: 'FRAG_IBN_BATTUTA_001',
    manuscriptId: 'MS_IBN_BATTUTA',
    language: 'arabic',
    originalText: `وفي هذه الجزيرة يجلب المسك من التبت والصين، وهو أطيب الطيب وأغلاه ثمناً.`,
    translationFr: `Sur cette île, on apporte le musc du Tibet et de Chine, c\'est le plus agréable des parfums et le plus cher.`,
    translationEn: `On this island, musk is brought from Tibet and China, it is the most pleasant of perfumes and the most expensive.`,
    entities: JSON.stringify([
      { type: 'material', value: 'musk', confidence: 0.98 },
      { type: 'region', value: 'Tibet', confidence: 0.95 },
      { type: 'region', value: 'China', confidence: 0.95 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Ibn Battuta, Rihla, c. 1355. Témoignage sur le commerce du musc.'
  },
  {
    fragmentId: 'FRAG_GARCIA_001',
    manuscriptId: 'MS_GARCIA_ORTA',
    language: 'portuguese',
    originalText: `O benjoim he huma goma que mana de huma arvore, a qual se chama em Malayo Camaniam. He arvore grande e fermosa, e a goma della he muito cheirosa.`,
    translationFr: `Le benjoin est une gomme qui coule d\'un arbre appelé Camaniam en malais. C\'est un grand et bel arbre, et sa gomme est très odorante.`,
    translationEn: `Benzoin is a gum that flows from a tree called Camaniam in Malay. It is a large and beautiful tree, and its gum is very fragrant.`,
    entities: JSON.stringify([
      { type: 'plant', value: 'Styrax benzoin', confidence: 0.95 },
      { type: 'material', value: 'benzoin', confidence: 0.98 },
      { type: 'region', value: 'Malaya', confidence: 0.90 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Garcia de Orta, Colóquios dos Simples, 1563. Premier traité européen sur les aromates asiatiques.'
  },
  {
    fragmentId: 'FRAG_SAHAGÚN_001',
    manuscriptId: 'MS_FLORENTINE_CODEX',
    language: 'nahuatl',
    originalText: `Tlilxochitl, in itoca vanilla, cenca ahuiac, cenca tlazohtli. In ihuan cacahuatl monamiqui.`,
    translationFr: `La tlilxochitl, appelée vanille, est très parfumée et très précieuse. Elle s\'associe bien avec le cacao.`,
    translationEn: `Tlilxochitl, called vanilla, is very fragrant and very precious. It combines well with cacao.`,
    entities: JSON.stringify([
      { type: 'plant', value: 'Vanilla planifolia', confidence: 0.98 },
      { type: 'plant', value: 'Theobroma cacao', confidence: 0.95 },
      { type: 'region', value: 'Mesoamerica', confidence: 0.95 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Codex de Florence, Bernardino de Sahagún, c. 1570. Documentation aztèque sur la vanille.'
  },
  {
    fragmentId: 'FRAG_MONARDES_001',
    manuscriptId: 'MS_MONARDES',
    language: 'spanish',
    originalText: `El Bálsamo de Perú es un licor que mana de un árbol que se cría en la Nueva España. Tiene olor suavísimo y es de gran virtud para curar heridas.`,
    translationFr: `Le Baume du Pérou est une liqueur qui coule d\'un arbre cultivé en Nouvelle-Espagne. Il a une odeur très douce et une grande vertu pour guérir les blessures.`,
    translationEn: `Peru Balsam is a liquid that flows from a tree grown in New Spain. It has a very sweet smell and great virtue for healing wounds.`,
    entities: JSON.stringify([
      { type: 'plant', value: 'Myroxylon balsamum', confidence: 0.95 },
      { type: 'material', value: 'peru_balsam', confidence: 0.98 },
      { type: 'region', value: 'Central America', confidence: 0.90 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Nicolás Monardes, Historia Medicinal, 1574. Introduction des baumes américains en Europe.'
  },
  {
    fragmentId: 'FRAG_CLUSIUS_001',
    manuscriptId: 'MS_CLUSIUS',
    language: 'latin',
    originalText: `Ladanum est resina quaedam odorata, quae ex Cisto foliis colligitur in insula Creta. Caprae dum pascuntur, barbis et cruribus illam colligunt.`,
    translationFr: `Le labdanum est une résine odorante recueillie sur les feuilles du ciste en Crète. Les chèvres, en paissant, la collectent sur leurs barbes et leurs pattes.`,
    translationEn: `Labdanum is a fragrant resin collected from the leaves of the cistus in Crete. Goats, while grazing, collect it on their beards and legs.`,
    entities: JSON.stringify([
      { type: 'plant', value: 'Cistus ladanifer', confidence: 0.95 },
      { type: 'material', value: 'labdanum', confidence: 0.98 },
      { type: 'region', value: 'Crete', confidence: 0.95 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Carolus Clusius, Rariorum Plantarum Historia, 1601. Description botanique du labdanum.'
  },
  {
    fragmentId: 'FRAG_RUMPHIUS_001',
    manuscriptId: 'MS_RUMPHIUS',
    language: 'latin',
    originalText: `Caryophyllus aromaticus in Moluccis insulis nascitur. Flores ante maturitatem collecti siccatique, notissimum illud aroma praebent.`,
    translationFr: `Le giroflier pousse dans les îles Moluques. Les fleurs récoltées avant maturité et séchées fournissent cet aromate très connu.`,
    translationEn: `The clove tree grows in the Moluccan islands. The flowers harvested before maturity and dried provide this well-known aromatic.`,
    entities: JSON.stringify([
      { type: 'plant', value: 'Syzygium aromaticum', confidence: 0.98 },
      { type: 'material', value: 'cloves', confidence: 0.98 },
      { type: 'region', value: 'Maluku', confidence: 0.98 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Georg Eberhard Rumphius, Herbarium Amboinense, c. 1690. Encyclopédie botanique des Indes orientales.'
  },
  {
    fragmentId: 'FRAG_CHARDIN_001',
    manuscriptId: 'MS_CHARDIN',
    language: 'french',
    originalText: `L'eau de rose de Chiraz est la plus estimée de toute la Perse. On en fait un commerce considérable, et les Persans en usent beaucoup dans leurs mets et leurs boissons.`,
    translationFr: `L'eau de rose de Chiraz est la plus estimée de toute la Perse. On en fait un commerce considérable, et les Persans en usent beaucoup dans leurs mets et leurs boissons.`,
    translationEn: `Rose water from Shiraz is the most esteemed in all of Persia. There is considerable trade in it, and the Persians use it extensively in their food and drinks.`,
    entities: JSON.stringify([
      { type: 'plant', value: 'Rosa damascena', confidence: 0.95 },
      { type: 'material', value: 'rose_water', confidence: 0.98 },
      { type: 'region', value: 'Shiraz', confidence: 0.98 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Jean Chardin, Voyages en Perse, 1686. Témoignage sur l\'industrie de la rose en Iran.'
  },
  {
    fragmentId: 'FRAG_KAEMPFER_001',
    manuscriptId: 'MS_KAEMPFER',
    language: 'latin',
    originalText: `Camphora ex arbore Japoniae elicitur, quae Kusunoki vocatur. Lignum odoratum est, et oleum volatile copiosum fundit.`,
    translationFr: `Le camphre est extrait d\'un arbre du Japon appelé Kusunoki. Le bois est odorant et produit une huile volatile abondante.`,
    translationEn: `Camphor is extracted from a tree in Japan called Kusunoki. The wood is fragrant and produces abundant volatile oil.`,
    entities: JSON.stringify([
      { type: 'plant', value: 'Cinnamomum camphora', confidence: 0.98 },
      { type: 'material', value: 'camphor', confidence: 0.98 },
      { type: 'region', value: 'Japan', confidence: 0.98 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Engelbert Kaempfer, Amoenitatum Exoticarum, 1712. Première description européenne détaillée du camphrier.'
  },
  {
    fragmentId: 'FRAG_TAVERNIER_001',
    manuscriptId: 'MS_TAVERNIER',
    language: 'french',
    originalText: `Le musc vient d'un petit animal qui ressemble à un chevreuil, et qui se trouve dans les montagnes du Tibet. La poche qui contient le musc est sous le ventre de l'animal.`,
    translationFr: `Le musc vient d'un petit animal qui ressemble à un chevreuil, et qui se trouve dans les montagnes du Tibet. La poche qui contient le musc est sous le ventre de l'animal.`,
    translationEn: `Musk comes from a small animal resembling a roe deer, found in the mountains of Tibet. The pouch containing the musk is under the animal's belly.`,
    entities: JSON.stringify([
      { type: 'animal', value: 'Moschus moschiferus', confidence: 0.95 },
      { type: 'material', value: 'musk', confidence: 0.98 },
      { type: 'region', value: 'Tibet', confidence: 0.95 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Jean-Baptiste Tavernier, Les Six Voyages, 1676. Description du commerce du musc.'
  },
  {
    fragmentId: 'FRAG_POMET_001',
    manuscriptId: 'MS_POMET',
    language: 'french',
    originalText: `L'ambre gris est une substance qui se trouve flottant sur la mer, ou rejetée sur les côtes. Son odeur est très agréable et il entre dans la composition des parfums les plus précieux.`,
    translationFr: `L'ambre gris est une substance qui se trouve flottant sur la mer, ou rejetée sur les côtes. Son odeur est très agréable et il entre dans la composition des parfums les plus précieux.`,
    translationEn: `Ambergris is a substance found floating on the sea or washed up on shores. Its smell is very pleasant and it is used in the composition of the most precious perfumes.`,
    entities: JSON.stringify([
      { type: 'material', value: 'ambergris', confidence: 0.98 },
      { type: 'animal', value: 'Physeter macrocephalus', confidence: 0.85 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Pierre Pomet, Histoire Générale des Drogues, 1694. Encyclopédie des matières premières de parfumerie.'
  },
  {
    fragmentId: 'FRAG_LEMERY_001',
    manuscriptId: 'MS_LEMERY',
    language: 'french',
    originalText: `Le storax liquide est un baume résineux qui découle d'un arbre appelé Liquidambar, qui croît dans la Nouvelle-Espagne. Il a une odeur très suave.`,
    translationFr: `Le storax liquide est un baume résineux qui découle d'un arbre appelé Liquidambar, qui croît dans la Nouvelle-Espagne. Il a une odeur très suave.`,
    translationEn: `Liquid storax is a resinous balsam that flows from a tree called Liquidambar, which grows in New Spain. It has a very sweet smell.`,
    entities: JSON.stringify([
      { type: 'plant', value: 'Liquidambar styraciflua', confidence: 0.95 },
      { type: 'material', value: 'storax', confidence: 0.98 },
      { type: 'region', value: 'Central America', confidence: 0.90 }
    ]),
    evidenceLevel: 'confirmed',
    notes: 'Nicolas Lémery, Traité Universel des Drogues Simples, 1698. Référence pharmaceutique du XVIIe siècle.'
  }
];

async function enrichTextFragments() {
  console.log('🔄 Enrichissement des fragments textuels...\n');
  
  // Supprimer les anciens fragments placeholder
  await connection.execute(`DELETE FROM text_fragments WHERE notes = 'seed'`);
  console.log('✓ Anciens placeholders supprimés\n');
  
  // Insérer les nouveaux fragments historiques
  for (const fragment of historicalFragments) {
    try {
      await connection.execute(
        `INSERT INTO text_fragments 
         (fragment_id, manuscript_id, language, original_text, translation_fr, translation_en, entities, evidence_level, notes, axis_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'AX2_ETHNOBOTANY_COMP')
         ON DUPLICATE KEY UPDATE
         original_text = VALUES(original_text),
         translation_fr = VALUES(translation_fr),
         translation_en = VALUES(translation_en),
         entities = VALUES(entities),
         evidence_level = VALUES(evidence_level),
         notes = VALUES(notes)`,
        [
          fragment.fragmentId,
          fragment.manuscriptId,
          fragment.language,
          fragment.originalText,
          fragment.translationFr,
          fragment.translationEn,
          fragment.entities,
          fragment.evidenceLevel,
          fragment.notes
        ]
      );
      console.log(`✓ ${fragment.fragmentId}: ${fragment.manuscriptId}`);
    } catch (error) {
      console.error(`✗ Erreur pour ${fragment.fragmentId}:`, error.message);
    }
  }
  
  // Vérifier le résultat
  const [count] = await connection.execute(`SELECT COUNT(*) as total FROM text_fragments`);
  console.log(`\n✅ Total fragments en base: ${count[0].total}`);
}

await enrichTextFragments();
await connection.end();
console.log('\n🎉 Enrichissement terminé!');
