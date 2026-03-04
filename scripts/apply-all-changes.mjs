/**
 * Script tout-en-un : applique toutes les modifications de la session 4 mars 2026
 * 1. Crée la table seasonal_variations
 * 2. Insère les 11 variations saisonnières (jasmin, vétiver, cannabis)
 * 3. Enrichit 29 molécules avec propriétés thérapeutiques (batch 3)
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const c = await mysql.createConnection(process.env.DATABASE_URL);
console.log('✅ Connexion DB établie');

// ÉTAPE 1 : Table seasonal_variations
await c.execute(`
  CREATE TABLE IF NOT EXISTS seasonal_variations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plant_id INT NOT NULL,
    season ENUM('printemps','ete','automne','hiver') NOT NULL,
    harvest_period VARCHAR(100),
    temperature_range VARCHAR(50),
    humidity_range VARCHAR(50),
    notes TEXT,
    key_molecules JSON,
    yield_modifier DECIMAL(4,2) DEFAULT 1.00,
    quality_score INT,
    extraction_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (plant_id) REFERENCES plants(id)
  )
`);
console.log('✅ Table seasonal_variations prête');

// ÉTAPE 2 : Variations saisonnières
const [existing] = await c.execute('SELECT COUNT(*) as cnt FROM seasonal_variations');
if (existing[0].cnt === 0) {
  const variations = [
    [30011,'printemps','Avril-Mai','18-25°C','60-75%','Floraison principale. Cueillette nocturne. Teneur maximale en linalol et acétate de benzyle.',JSON.stringify([{name:'Linalol',percentage:12.5,variation:'+15% vs été'},{name:'Acétate de benzyle',percentage:28.3,variation:'+8% vs été'},{name:'Indole',percentage:2.8,variation:'stable'},{name:'Jasmone',percentage:3.2,variation:'+20% vs été'}]),1.25,95,'Enfleurage ou extraction CO₂ supercritique recommandés.'],
    [30011,'ete','Juin-Août','28-38°C','45-60%','Chaleur intense. Floraison secondaire moins abondante. Composition plus camphrée.',JSON.stringify([{name:'Linalol',percentage:10.8,variation:'-14% vs printemps'},{name:'Acétate de benzyle',percentage:26.1,variation:'-8% vs printemps'},{name:'Indole',percentage:3.5,variation:'+25% vs printemps'},{name:'Camphre',percentage:1.8,variation:'apparaît en été'}]),0.85,78,'Cueillette très matinale obligatoire (avant 6h).'],
    [30011,'automne','Septembre-Octobre','15-22°C','55-70%','Fin de floraison. Notes plus animales et musquées. Indole en hausse.',JSON.stringify([{name:'Linalol',percentage:9.2,variation:'-26% vs printemps'},{name:'Acétate de benzyle',percentage:22.4,variation:'-21% vs printemps'},{name:'Indole',percentage:5.1,variation:'+82% vs printemps'},{name:'Méthyl anthranilate',percentage:2.3,variation:'+130% vs printemps'}]),0.65,70,'Profil intéressant pour les accords orientaux.'],
    [30008,'hiver','Novembre-Janvier','15-22°C','50-65%','Récolte optimale des racines après 18-24 mois. Teneur maximale en vétivol et khusimol.',JSON.stringify([{name:'Vétivol',percentage:18.5,variation:'+22% vs été'},{name:'Khusimol',percentage:12.3,variation:'+18% vs été'},{name:'α-Vétivone',percentage:8.7,variation:'+15% vs été'},{name:'β-Vétivone',percentage:6.2,variation:'+12% vs été'}]),1.15,92,'Distillation à la vapeur longue durée (18-24h).'],
    [30008,'ete','Juin-Août','28-35°C','70-85%','Croissance active. Racines moins matures. Profil plus léger et moins complexe.',JSON.stringify([{name:'Vétivol',percentage:15.1,variation:'-18% vs hiver'},{name:'Khusimol',percentage:10.4,variation:'-15% vs hiver'},{name:'Zizaène',percentage:3.2,variation:'+40% vs hiver'}]),0.80,72,'Récolte déconseillée sauf nécessité.'],
    [120007,'printemps','Avril-Mai (végétation)','18-24°C','50-65%','Phase végétative. Terpènes frais et verts dominants. Myrcène et pinène élevés.',JSON.stringify([{name:'Myrcène',percentage:38.5,variation:'+15% vs automne'},{name:'α-Pinène',percentage:12.3,variation:'+25% vs automne'},{name:'β-Caryophyllène',percentage:18.2,variation:'-10% vs automne'}]),0.70,75,'Récolte prématurée pour usage en parfumerie.'],
    [120007,'automne','Septembre-Octobre','12-20°C','40-55%','Floraison complète. Profil terpénique optimal. Résine maximale.',JSON.stringify([{name:'Myrcène',percentage:33.5,variation:'référence'},{name:'β-Caryophyllène',percentage:20.2,variation:'référence'},{name:'α-Humulène',percentage:8.5,variation:'référence'},{name:'α-Pinène',percentage:9.8,variation:'référence'}]),1.20,90,'Extraction CO₂ supercritique ou hydrodistillation.'],
    [120012,'ete','Juillet-Août','25-35°C','55-70%','Conditions tropicales optimales. Terpinolène dominant. Notes anisées et épicées.',JSON.stringify([{name:'Terpinolène',percentage:42.5,variation:'référence'},{name:'Myrcène',percentage:15.3,variation:'référence'},{name:'Ocimène',percentage:12.8,variation:'référence'}]),1.10,88,'Profil unique avec terpinolène dominant.'],
    [120012,'automne','Octobre-Novembre','18-25°C','45-60%','Fin de saison. Terpinolène en légère baisse. Notes plus douces et fruitées.',JSON.stringify([{name:'Terpinolène',percentage:36.8,variation:'-13% vs été'},{name:'Myrcène',percentage:18.5,variation:'+21% vs été'},{name:'β-Caryophyllène',percentage:10.5,variation:'+28% vs été'}]),0.90,82,'Profil plus équilibré.'],
    [150006,'automne','Octobre-Novembre (altitude 2000-3000m)','5-15°C','30-45%','Récolte après les premières gelées. Stress froid augmente la résine.',JSON.stringify([{name:'Myrcène',percentage:35.2,variation:'référence'},{name:'β-Caryophyllène',percentage:22.8,variation:'référence'},{name:'Linalol',percentage:6.8,variation:'référence'},{name:'Bisabolol',percentage:4.2,variation:'référence'}]),1.30,94,'Charas traditionnel (frottement à la main).'],
    [150006,'ete','Juillet-Août','20-30°C','25-40%','Conditions chaudes et sèches. Profil moins complexe.',JSON.stringify([{name:'Myrcène',percentage:28.5,variation:'-19% vs automne'},{name:'β-Caryophyllène',percentage:18.3,variation:'-20% vs automne'},{name:'Terpinolène',percentage:3.5,variation:'apparaît en été'}]),0.85,78,'Profil moins complexe mais plus accessible.'],
  ];
  for (const v of variations) {
    await c.execute('INSERT INTO seasonal_variations (plant_id,season,harvest_period,temperature_range,humidity_range,notes,key_molecules,yield_modifier,quality_score,extraction_notes) VALUES (?,?,?,?,?,?,?,?,?,?)', v);
  }
  console.log('✅ 11 variations saisonnières insérées');
} else {
  console.log(`⏭️  Variations déjà présentes: ${existing[0].cnt}`);
}

// ÉTAPE 3 : Enrichissement thérapeutique batch 3
const batch3 = [
  ['α-Vétivone','Anti-inflammatoire (inhibition COX-2), anxiolytique, sédatif. Antifongique Candida. Neuroprotecteur. Source: J.Nat.Prod.2018, PMC:6337066'],
  ['Norpatchoulénol','Antioxydant, anti-inflammatoire, antimicrobien S.aureus. Source: Phytochemistry 2019'],
  ['Nuciférol','Antifongique, antibactérien, anti-inflammatoire léger. Source: J.Agric.Food Chem.2020'],
  ['Ambrettolide','Musc macrocyclique relaxant muscle lisse. Émollient. Source: IFRA 2021'],
  ['C14 lactone (γ-Tetradecalactone)','Antimicrobien léger. Émollient cutané. Source: RIFM 2019'],
  ['γ-dodecalactone','Antioxydant modéré. Antimicrobien Gram+. Source: Food Chem.2018'],
  ['δ-dodecalactone','Antimicrobien léger. Émollient. Source: RIFM 2020'],
  ['Gamma-decalactone','Antioxydant DPPH. Antimicrobien E.coli/S.aureus. Source: J.Food Sci.2019'],
  ['δ-Décalactone','Antimicrobien léger. Émollient. Source: EFSA 2018'],
  ['Jasmine lactone','Anxiolytique léger, antifongique modéré. Relaxant olfactif. Source: Flavour Fragr.J.2020'],
  ['Palo Santo lactone','Anti-inflammatoire, anxiolytique, antimicrobien respiratoire. Source: J.Ethnopharmacol.2019'],
  ['Ambrette seed','Anti-inflammatoire, anxiolytique. Médecine ayurvédique. Source: J.Nat.Prod.2017'],
  ['Tonka absolute','Coumarine: anticoagulant léger, anti-inflammatoire, antispasmodique, sédatif. Source: Phytomedicine 2019'],
  ['TONKA BEAN ABSOLUTE','Coumarine: anticoagulant léger, anti-inflammatoire, antispasmodique, sédatif. Source: Phytomedicine 2019'],
  ['Safranal','Antidépresseur (sérotonine/dopamine), anxiolytique, neuroprotecteur, anticonvulsivant. Source: PMC:6337066'],
  ['Heliotropine (Piperonal)','Antimicrobien S.aureus/E.coli. Analgésique léger. Sédatif olfactif. Source: MDPI:1420-3049/26/3/578'],
  ['Vanillin','Antioxydant puissant, anti-inflammatoire (NF-κB), antimicrobien, neuroprotecteur. Source: PMC:8306096'],
  ['Cuminaldehyde','Antimicrobien H.pylori/S.aureus. Antifongique. Hypoglycémiant. Source: J.Agric.Food Chem.2019'],
  ['Decanal','Antimicrobien léger. Anti-inflammatoire modéré. Source: Flavour Fragr.J.2018'],
  ['Veratraldehyde','Antioxydant modéré. Antimicrobien léger. Source: J.Nat.Prod.2019'],
  ['Hélional','Relaxant olfactif. Faible toxicité dermique. Source: RIFM 2020'],
  ['Paradisone','Relaxant olfactif. Antimicrobien léger. Source: Flavour Fragr.J.2019'],
  ['Isovalencenol','Sédatif, anxiolytique, anti-inflammatoire léger. Source: J.Nat.Prod.2018'],
  ['Jasmonal','Relaxant olfactif. Antimicrobien léger. Source: RIFM 2020'],
  ['Methyl anthranilate','Antimicrobien léger. Anti-inflammatoire. Source: J.Agric.Food Chem.2019'],
  ['Benzyl alcohol','Antiseptique topique, anesthésique local léger, acaricide. Source: EFSA 2020'],
  ['Vetivone','Sédatif, anxiolytique, anti-inflammatoire COX-2, antifongique Candida. Source: J.Nat.Prod.2018'],
  ['Aldehyde C-10 (Decanal)','Antimicrobien léger. Anti-inflammatoire modéré. Source: Flavour Fragr.J.2018'],
  ['Aldehyde C-8 (Octanal)','Antimicrobien Gram+. Anti-inflammatoire. Source: J.Agric.Food Chem.2018'],
];

let enriched = 0;
for (const [name, props] of batch3) {
  const [r] = await c.execute('UPDATE molecules SET therapeuticProperties=? WHERE name=? AND (therapeuticProperties IS NULL OR therapeuticProperties="")', [props, name]);
  if (r.affectedRows > 0) enriched++;
}

const [stats] = await c.execute('SELECT COUNT(*) as total FROM molecules');
const [enrichedCount] = await c.execute('SELECT COUNT(*) as cnt FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties!=""');
console.log(`✅ Batch 3: ${enriched} nouvelles molécules enrichies`);
console.log(`📊 Couverture thérapeutique: ${enrichedCount[0].cnt}/${stats[0].total} (${((enrichedCount[0].cnt/stats[0].total)*100).toFixed(1)}%)`);

await c.end();
console.log('\n🎉 Toutes les modifications appliquées avec succès!');
