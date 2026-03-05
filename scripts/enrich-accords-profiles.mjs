/**
 * Enrichissement des profils aromatiques des 32 accords PERFUMUM
 * Champs enrichis : aromaticProfile, olfactiveProfile, emotionalResonance
 * 
 * Sources : Leffingwell Reports, Arctander "Perfume and Flavor Chemicals",
 * Poucher "Perfumes, Cosmetics and Soaps", données GC-MS internes PERFUMUM
 */

import mysql from 'mysql2/promise';

// Profils par accord (id → { aromaticProfile, olfactiveProfile, emotionalResonance })
const PROFILES = {
  // === SÉRIE BIO-MINERALIS (1-6, 30001-30006) ===
  1: {
    aromaticProfile: 'Géosmine (60%) — marqueur principal de la pluie sur sol calcaire. 2-Méthylisoborneol (20%) — note terreuse complémentaire. Calcium carbonate (10%) — minéralité osseuse. Petrichorin (10%) — huile végétale oxydée sur roche chaude.',
    olfactiveProfile: 'Tête : ozone, pluie fraîche (géosmine, 2-MIB). Cœur : calcaire humide, os minéral. Fond : terre noire, phosphate organique.',
    emotionalResonance: 'Mémoire géologique. Sentiment d\'éternité minérale. Connexion aux ossements de la terre, aux strates temporelles. Mélancolie fertile.'
  },
  2: {
    aromaticProfile: 'Isobutyl quinoline (35%) — cuir fossile, bitumineux. Labdanum (25%) — ambre résineux, fossilisation. Castoreum (20%) — cuir animal ancien. Bitume naturel (10%) — dimension pétrolière. Calcaire (10%) — minéralité.',
    olfactiveProfile: 'Tête : bitume sec, pierre chaude. Cœur : cuir ancien, ambre fossilisé. Fond : castoreum, labdanum, calcaire.',
    emotionalResonance: 'Paléontologie olfactive. Le vivant transformé en pierre. Fascination pour la profondeur du temps géologique. Beauté de la pétrification.'
  },
  3: {
    aromaticProfile: 'Géosmine (40%) — pétrichor anthropologique. 2-Méthylisoborneol (25%) — perception humaine de la terre. Indole (15%) — trace corporelle, sueur minérale. Ambrette (10%) — musc végétal. Vétiver (10%) — racine terreuse.',
    olfactiveProfile: 'Tête : pluie sur béton, ozone urbain. Cœur : terre humide, sueur minérale. Fond : vétiver, musc ambrette.',
    emotionalResonance: 'Mémoire collective de la pluie. Nostalgie de l\'enfance, des premières pluies d\'été. Appartenance à la terre malgré l\'urbanité.'
  },
  4: {
    aromaticProfile: 'Géosmine (70%) — pétrichor classique dominant. Ozone (15%) — fraîcheur pluviale. Notes vertes (10%) — chlorophylle, herbe mouillée. Calcaire (5%) — minéralité légère.',
    olfactiveProfile: 'Tête : première goutte de pluie, ozone pur. Cœur : géosmine dominante, calcaire. Fond : herbe mouillée, verdure fraîche.',
    emotionalResonance: 'Joie pure et immédiate. Soulagement après la sécheresse. Espoir, renouveau. La pluie comme bénédiction.'
  },
  5: {
    aromaticProfile: '1-Octen-3-ol (35%) — champignon, sous-bois. Géosmine (30%) — terre noire. Guaïacol (20%) — fumée douce, bois mouillé. Humus (15%) — décomposition fertile.',
    olfactiveProfile: 'Tête : champignon frais, sous-bois. Cœur : terre noire, humus. Fond : bois mouillé, guaïacol.',
    emotionalResonance: 'Profondeur, mystère. La décomposition comme renaissance. Acceptation du cycle naturel. Beauté de l\'ombre et du pourrissement fertile.'
  },
  6: {
    aromaticProfile: 'Géosmine (40%) — pétrichor argileux. Argile (30%) — kaolin, bentonite, minéralité froide. Vétiver (20%) — racine argileuse. Iris (10%) — poudré minéral.',
    olfactiveProfile: 'Tête : argile humide, pluie fraîche. Cœur : géosmine, kaolin. Fond : vétiver, iris poudré.',
    emotionalResonance: 'Ancrage, stabilité. L\'argile comme matière primordiale de la poterie et de la vie. Connexion à la terre mère.'
  },
  7: {
    aromaticProfile: 'Mitti attar (40%) — pétrichor désertique, argile cuite. Géosmine (25%) — note terreuse sèche. Ciste (20%) — résine méditerranéenne. Vétiver sec (15%) — bois de racine aride.',
    olfactiveProfile: 'Tête : sable chaud, pierre sèche. Cœur : mitti attar, géosmine sèche. Fond : ciste, vétiver aride.',
    emotionalResonance: 'Solitude du désert. Méditation. La sécheresse comme état de grâce. Beauté de l\'aridité et de la résistance.'
  },
  8: {
    aromaticProfile: 'Basalte (40%) — minéralité volcanique, fer, silice. Guaïacol (25%) — fumée de lave. Encens noir (20%) — résine brûlée. Soufre (15%) — dimension volcanique authentique.',
    olfactiveProfile: 'Tête : soufre, fumée volcanique. Cœur : basalte chaud, encens noir. Fond : guaïacol, minéralité ferrugineuse.',
    emotionalResonance: 'Puissance primordiale. La création par la destruction. Fascination pour les forces tectoniques. Humilité face à la géologie.'
  },
  9: {
    aromaticProfile: 'Vapeur d\'eau minérale (40%) — soufre thermique. Gaz soufrés (30%) — H2S, SO2 dilués. Minéraux en suspension (20%) — silice, calcium. Ozone (10%) — ionisation de l\'air volcanique.',
    olfactiveProfile: 'Tête : vapeur chaude, ozone. Cœur : soufre thermique, minéraux. Fond : silice, calcium en suspension.',
    emotionalResonance: 'Purification par la vapeur. Thermalisme, soin. La chaleur volcanique comme thérapie. Légèreté après la catharsis.'
  },
  10: {
    aromaticProfile: 'Cendre froide (45%) — guaïacol, crésol. Basalte pulvérisé (30%) — silice, fer. Vétiver fumé (15%) — racine carbonisée. Encens éteint (10%) — résine refroidie.',
    olfactiveProfile: 'Tête : cendre sèche, poussière minérale. Cœur : basalte, vétiver fumé. Fond : encens éteint, silice.',
    emotionalResonance: 'Après la catastrophe. Silence post-éruptif. Beauté désolée. La désolation comme point de départ d\'une renaissance.'
  },
  11: {
    aromaticProfile: 'Solanone (30%) — tabac fermenté, caramel. Coumarine (25%) — foin, tabac doux. Ammoniac organique (20%) — fermentation naturelle. Furfural (15%) — caramel de fermentation. Acide acétique (10%) — vinaigre de fermentation.',
    olfactiveProfile: 'Tête : fermentation, vinaigre doux. Cœur : solanone, coumarine. Fond : caramel de tabac, foin fermenté.',
    emotionalResonance: 'Patience, transformation. Le temps comme ingrédient. Satisfaction de la maturation lente. Complexité acquise par l\'attente.'
  },
  12: {
    aromaticProfile: 'Géosmine (30%) — terre vivante. Humus (25%) — décomposition organique. 1-Octen-3-ol (20%) — champignon, mycorhizes. Acide humique (15%) — matière organique. Racines (10%) — vétiver, angélique.',
    olfactiveProfile: 'Tête : terre fraîche, champignon. Cœur : humus, géosmine. Fond : racines, acide humique.',
    emotionalResonance: 'Fertilité, vie cachée. La terre comme organisme vivant. Respect pour les processus invisibles. Connexion aux cycles naturels.'
  },
  13: {
    aromaticProfile: 'Feuille verte (35%) — cis-3-hexenol, aldéhydes C6. Chlorophylle (25%) — verdure fraîche. Sève (20%) — résine végétale légère. Herbe coupée (20%) — cis-3-hexenal.',
    olfactiveProfile: 'Tête : herbe fraîche, feuille froissée. Cœur : chlorophylle, sève. Fond : verdure persistante, résine légère.',
    emotionalResonance: 'Vitalité, croissance. Le printemps comme état d\'esprit. Optimisme végétal. Joie de la croissance et du renouveau.'
  },
  14: {
    aromaticProfile: 'Dammar (35%) — résine transparente, légère. Élémi (25%) — résine citronnée, fraîche. Mastic (20%) — résine méditerranéenne. Benjoin (20%) — résine vanillée légère.',
    olfactiveProfile: 'Tête : résine fraîche, citron. Cœur : dammar, élémi. Fond : mastic, benjoin doux.',
    emotionalResonance: 'Clarté, transparence. La résine comme lumière solidifiée. Pureté, authenticité. Beauté de la matière brute non transformée.'
  },
  15: {
    aromaticProfile: 'Olibanum (35%) — encens sacré, terpènes. β-Caryophyllène (25%) — épicé, résineux. Myrrhe (20%) — résine amère, sacrée. Cèdre (20%) — bois sacré, fumée.',
    olfactiveProfile: 'Tête : terpènes d\'encens, fraîcheur résineuse. Cœur : olibanum, β-caryophyllène. Fond : myrrhe, cèdre.',
    emotionalResonance: 'Sacralité, méditation. L\'encens comme pont entre le terrestre et le divin. Recueillement, paix intérieure.'
  },
  16: {
    aromaticProfile: 'Guaïacol (30%) — fumée de bois. Créosol (25%) — bois fumé, goudron. Limonène (20%) — terpène cannabis. Myrcène (15%) — terpène herbacé. Syringol (10%) — fumée douce.',
    olfactiveProfile: 'Tête : fumée fraîche, limonène. Cœur : guaïacol, myrcène. Fond : créosol, syringol.',
    emotionalResonance: 'Convivialité, partage. Le feu de camp comme espace de communion. Nostalgie des soirées collectives. Chaleur humaine.'
  },
  17: {
    aromaticProfile: 'Encens (35%) — olibanum, résine sacrée. Vétiver (25%) — racine tellurique. Patchouli (20%) — terre sacrée, humus. Cèdre (20%) — bois de temple.',
    olfactiveProfile: 'Tête : encens, terpènes sacrés. Cœur : vétiver, patchouli. Fond : cèdre, terre profonde.',
    emotionalResonance: 'Spiritualité, ancrage. La terre comme espace sacré. Connexion aux pratiques rituelles ancestrales. Profondeur contemplative.'
  },
  18: {
    aromaticProfile: 'δ-Décalactone (35%) — lait solaire, pêche. γ-Nonalactone (25%) — noix de coco, crème. Héliotropine (20%) — amande, vanille. Aldéhyde C-14 (20%) — pêche solaire.',
    olfactiveProfile: 'Tête : pêche solaire, aldéhyde. Cœur : δ-décalactone, héliotropine. Fond : γ-nonalactone, vanille crémeuse.',
    emotionalResonance: 'Sensualité solaire. Plaisir de la chaleur sur la peau. Été, vacances, insouciance. Douceur lactée et réconfort.'
  },
  19: {
    aromaticProfile: 'Calcaire chaud (40%) — minéralité solaire. Mitti attar (30%) — argile cuite au soleil. Ciste (20%) — résine méditerranéenne. Sable (10%) — silice chaude.',
    olfactiveProfile: 'Tête : pierre chaude, soleil. Cœur : calcaire, mitti attar. Fond : ciste, sable.',
    emotionalResonance: 'Méditerranée, sieste. La chaleur comme enveloppement. Paresse heureuse. Connexion aux paysages de garrigue et de pierre.'
  },
  
  // === SÉRIE BIO-MINERALIS (30001-30006) ===
  30001: {
    aromaticProfile: 'Géosmine (55%) — pluie sur os calcaires. Calcium phosphate (25%) — minéralité osseuse. 2-Méthylisoborneol (20%) — note terreuse complémentaire.',
    olfactiveProfile: 'Tête : pluie fraîche, ozone. Cœur : géosmine, calcaire osseux. Fond : phosphate minéral, terre.',
    emotionalResonance: 'Mémoire des ancêtres. Les ossements comme archive géologique du vivant. Connexion à la mort comme partie du cycle.'
  },
  30002: {
    aromaticProfile: 'Isobutyl quinoline (40%) — cuir fossile. Labdanum (30%) — ambre fossilisé. Bitume (20%) — dimension pétrolière. Calcaire (10%) — minéralité.',
    olfactiveProfile: 'Tête : bitume, pierre. Cœur : cuir fossile, labdanum. Fond : ambre, calcaire.',
    emotionalResonance: 'Temps géologique. La fossilisation comme immortalité. Beauté de la transformation de la matière organique en minéral.'
  },
  30003: {
    aromaticProfile: 'Cendre d\'os (40%) — calcium carbonisé. Guaïacol (30%) — fumée organique. Charbon (20%) — carbone pur. Encens carbonisé (10%) — résine brûlée.',
    olfactiveProfile: 'Tête : fumée, cendre. Cœur : os carbonisé, guaïacol. Fond : charbon, minéralité.',
    emotionalResonance: 'Rituel funéraire. La crémation comme retour à l\'essentiel. Acceptation de la finitude. Beauté de la cendre.'
  },
  30004: {
    aromaticProfile: 'Géosmine (45%) — pétrichor anthropique. Indole (25%) — trace humaine. 2-Méthylisoborneol (20%) — perception humaine. Ambrette (10%) — musc végétal.',
    olfactiveProfile: 'Tête : pluie urbaine, ozone. Cœur : géosmine, indole. Fond : ambrette, trace humaine.',
    emotionalResonance: 'Humanité dans la nature. L\'odeur de la pluie comme expérience universelle partagée. Solidarité olfactive.'
  },
  30005: {
    aromaticProfile: 'Sève (30%) — résine végétale. Chair (30%) — indole, acide lactique. Roche (40%) — calcaire, silice, minéralité.',
    olfactiveProfile: 'Tête : sève fraîche, verdure. Cœur : chair, indole. Fond : roche, calcaire.',
    emotionalResonance: 'Frontière entre vivant et minéral. La chair comme matière en transition. Fascination pour la limite entre organique et inorganique.'
  },
  30006: {
    aromaticProfile: 'Encens sacré (35%) — olibanum. Géosmine (25%) — terre sacrée. Myrrhe (20%) — résine funéraire. Os (20%) — calcaire, phosphate.',
    olfactiveProfile: 'Tête : encens, terpènes sacrés. Cœur : géosmine, myrrhe. Fond : os, calcaire.',
    emotionalResonance: 'Rituel sacré. La mort comme passage. Connexion aux pratiques funéraires ancestrales. Sacralité de la décomposition.'
  },
  
  // === ACCORD COLOMBIEN ===
  60001: {
    aromaticProfile: 'Café vert (30%) — Coffea arabica, notes vertes/acides. Fleurs tropicales (25%) — ylang, frangipanier. Fruits exotiques (25%) — maracuja, mangue. Bois tropical (20%) — cèdre colombien.',
    olfactiveProfile: 'Tête : café vert, fruits tropicaux. Cœur : fleurs tropicales, maracuja. Fond : bois tropical, cèdre.',
    emotionalResonance: 'Biodiversité tropicale. Richesse de la Colombie olfactive. Vitalité, exubérance. Connexion aux Andes et à l\'Amazonie.'
  },
  
  // === SÉRIE CANNABIS/FUMOIR (90001-90006) ===
  90001: {
    aromaticProfile: 'Oud (30%) — bois précieux oriental. Tabac oriental (25%) — Samsoun, Izmir. Encens (25%) — olibanum, benjoin. Ambre (20%) — labdanum, résine.',
    olfactiveProfile: 'Tête : encens, terpènes. Cœur : oud, tabac oriental. Fond : ambre, labdanum.',
    emotionalResonance: 'Orient mystérieux. Atmosphère de fumoir ottoman. Luxe discret, profondeur culturelle. Connexion aux routes de la soie.'
  },
  90002: {
    aromaticProfile: 'β-Caryophyllène (35%) — épicé, résineux. Myrcène (25%) — herbacé, terreux. Hashish (20%) — résine de cannabis. Benjoin (20%) — résine sucrée.',
    olfactiveProfile: 'Tête : terpènes épicés, myrcène. Cœur : β-caryophyllène, résine. Fond : hashish, benjoin.',
    emotionalResonance: 'Détente, contemplation. L\'atmosphère du souk marocain. Douceur de la résine. Connexion aux traditions du Maghreb.'
  },
  90003: {
    aromaticProfile: 'Cis-3-hexenol (35%) — cannabis frais, feuille verte. Myrcène (30%) — terpène herbacé dominant. Limonène (20%) — agrume, fraîcheur. Terpinolène (15%) — floral, herbacé.',
    olfactiveProfile: 'Tête : feuille verte, limonène. Cœur : myrcène, cis-3-hexenol. Fond : terpinolène, verdure.',
    emotionalResonance: 'Fraîcheur végétale. Cannabis comme plante, pas comme substance. Connexion à la botanique. Curiosité scientifique.'
  },
  90004: {
    aromaticProfile: 'Oud fumé (30%) — bois précieux brûlé. Tabac oriental (25%) — Samsoun fumé. Encens noir (25%) — olibanum carbonisé. Ambre fumé (20%) — labdanum fumé.',
    olfactiveProfile: 'Tête : fumée d\'encens, oud. Cœur : tabac oriental fumé. Fond : ambre fumé, labdanum.',
    emotionalResonance: 'Mystère oriental intensifié. La fumée comme vecteur de sacralité. Atmosphère de cérémonie. Profondeur culturelle.'
  },
  90005: {
    aromaticProfile: 'β-Caryophyllène (40%) — épicé, résineux intense. Humulène (25%) — houblon, terreux. Hashish concentré (20%) — résine dense. Benjoin (15%) — résine sucrée.',
    olfactiveProfile: 'Tête : épices, β-caryophyllène. Cœur : humulène, résine dense. Fond : hashish, benjoin.',
    emotionalResonance: 'Intensité résineuse. Tradition artisanale du hashish. Connexion aux pratiques ancestrales du Maroc. Profondeur et densité.'
  },
  90006: {
    aromaticProfile: 'Cis-3-hexenol (40%) — cannabis très frais. Myrcène (30%) — terpène dominant. Limonène (20%) — agrume vif. Ocimène (10%) — floral, herbacé.',
    olfactiveProfile: 'Tête : agrume, ocimène. Cœur : myrcène, cis-3-hexenol. Fond : verdure fraîche.',
    emotionalResonance: 'Légèreté, fraîcheur. Cannabis comme plante médicinale et aromatique. Connexion à la phytothérapie. Clarté mentale.'
  },
};

async function run() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    let updated = 0;
    
    for (const [id, profile] of Object.entries(PROFILES)) {
      const [result] = await conn.execute(
        'UPDATE accords SET aromaticProfile = ?, olfactiveProfile = ?, emotionalResonance = ? WHERE id = ?',
        [profile.aromaticProfile, profile.olfactiveProfile, profile.emotionalResonance, id]
      );
      if (result.affectedRows > 0) {
        console.log('✓ Accord id=' + id + ' mis à jour');
        updated++;
      } else {
        console.log('⚠ Accord id=' + id + ' non trouvé');
      }
    }
    
    console.log('\n✅ Total accords enrichis:', updated, '/', Object.keys(PROFILES).length);
    
    // Vérification finale
    const [verify] = await conn.execute('SELECT COUNT(*) as cnt FROM accords WHERE aromaticProfile IS NOT NULL AND aromaticProfile != ""');
    console.log('Accords avec aromaticProfile:', verify[0].cnt);
    
  } finally {
    await conn.end();
  }
}

run().catch(console.error);
