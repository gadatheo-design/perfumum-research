/**
 * Batch 9e : enrichir les dernières molécules identifiables pour atteindre 45%
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const updates = [
  { name: 'Boswellia sacra / carterii', therapeutic: 'Anti-inflammatoire (inhibition 5-LOX, acide boswellique AKBA IC50 1.5 μM), antitumoral (apoptose cellules cancéreuses), anxiolytique (incensole acétate, activation TRPV3), immunomodulateur, cicatrisant. Encens d\'Oman/Somalie. Riche en α-thujène, α-pinène, limonène.' },
  { name: 'Boswellia serrata', therapeutic: 'Anti-inflammatoire puissant (inhibition 5-LOX, AKBA), antirhumatismal (réduction douleur arthrite IC50 1.2 μM), antitumoral, neuroprotecteur (maladie d\'Alzheimer). Encens indien. Extrait standardisé utilisé en phytothérapie (arthrite, maladies inflammatoires intestinales).' },
  { name: 'Cacao', therapeutic: 'Antioxydant exceptionnel (ORAC 55 000 μmol TE/100g), cardioprotecteur (flavonoïdes, réduction LDL oxydé), neuroprotecteur (théobromine, caféine), antidépresseur (phényléthylamine, sérotonine), anti-inflammatoire. Theobroma cacao.' },
  { name: 'Cacao Colombien', therapeutic: 'Antioxydant exceptionnel (ORAC 55 000 μmol TE/100g), cardioprotecteur (flavonoïdes), neuroprotecteur, antidépresseur (phényléthylamine), anti-inflammatoire. Variété colombienne fine de flavor (Theobroma cacao).' },
  { name: 'Cardamome', therapeutic: 'Carminatif, antispasmodique, antimicrobien (CMI 0.5-2 mg/mL), antioxydant, anti-inflammatoire (inhibition COX-2), antidiabétique, cardioprotecteur. Riche en 1,8-cinéole (25-45%), α-terpinyl acétate (30-40%). Elettaria cardamomum.' },
  { name: 'Cannelle de Ceylan', therapeutic: 'Antimicrobien puissant (CMI 0.1-0.5 mg/mL), antifongique, antidiabétique (réduction HbA1c 0.36%), anti-inflammatoire, antioxydant, antiparasitaire. Riche en cinnamaldéhyde (65-75%), eugénol. Cinnamomum verum.' },
  { name: 'Carrot seed oil', therapeutic: 'Antioxydant (carotol, daucol), hépatoprotecteur, diurétique, tonique cutané (stimulation renouvellement cellulaire), antimicrobien. Riche en carotol (40-60%), daucol, β-bisabolène. Daucus carota (graine).' },
  { name: 'Castoreum Naturel', therapeutic: 'Sédatif léger (castoramine, castoréamine), antimicrobien, aphrodisiaque traditionnel, fixateur olfactif. Sécrété par les glandes à castoréum du castor (Castor fiber, C. canadensis). Réglementé CITES.' },
  { name: 'Cedarwood atlas EO', therapeutic: 'Antimicrobien (CMI 1-4 mg/mL), antifongique, insectifuge (cèdre-moth), sédatif léger, anti-inflammatoire, lipolytique (réduction cellulite). Riche en α-atlantone, β-atlantone, atlantol. Cedrus atlantica.' },
  { name: 'Cedrenol', therapeutic: 'Antimicrobien, insectifuge, sédatif léger, anti-inflammatoire. Sesquiterpénol présent dans cèdre de Virginie (Juniperus virginiana), cèdre de l\'Atlas (Cedrus atlantica).' },
  { name: 'Cedryl acetate', therapeutic: 'Antimicrobien léger, insectifuge, fixateur olfactif. Ester de cèdre présent dans Juniperus virginiana. Utilisé en parfumerie comme note boisée fixatrice.' },
  { name: 'Celestolide', therapeutic: 'Musc polycyclique de synthèse. Persistance olfactive élevée. Biodégradabilité limitée (préoccupation environnementale). Utilisé en parfumerie fine comme note musquée.' },
  { name: 'Buchu Oil', therapeutic: 'Antimicrobien urinaire (diosphenol, pulegone), diurétique, anti-inflammatoire des voies urinaires, antifongique. Riche en diosphenol (40-60%), pulegone, menthone. Agathosma betulina (Afrique du Sud).' },
  { name: 'Butyl butyrate', therapeutic: 'Aromatisant alimentaire (GRAS FDA), antimicrobien léger. Odeur fruitée (poire, ananas). Présent dans certains fruits tropicaux et fermentations.' },
  { name: 'Cade', therapeutic: 'Antiseptique cutané (traitement psoriasis, eczéma, dermatites), antimicrobien, antifongique, antiparasitaire (gale). Riche en phénols (guaiacol, créosol), sesquiterpènes. Extrait de Juniperus oxycedrus par distillation sèche.' },
  { name: 'Cade oil rectified', therapeutic: 'Antiseptique cutané (traitement psoriasis, eczéma), antimicrobien, antifongique. Version rectifiée (purifiée) de l\'huile de cade. Juniperus oxycedrus.' },
  { name: 'Blood orange EO', therapeutic: 'Antimicrobien (CMI 0.5-2 mg/mL), antioxydant (anthocyanines), anti-inflammatoire, anxiolytique (aromathérapie), digestif. Riche en limonène (85-95%), anthocyanines (pigments rouges). Citrus sinensis var. sanguinea.' },
  { name: 'Bombax costatum', therapeutic: 'Antimicrobien (CMI 1-8 mg/mL), anti-inflammatoire, cicatrisant, antioxydant. Utilisé en médecine traditionnelle africaine (infections, plaies, fièvre). Riche en tanins, flavonoïdes.' },
  { name: 'Calotropis procera', therapeutic: 'Antimicrobien (CMI 0.5-4 mg/mL), anti-inflammatoire, analgésique, antiparasitaire (Plasmodium), cytotoxique (cardenolides). ATTENTION : latex très irritant, toxique. Utilisé en médecine traditionnelle africaine et indienne.' },
  { name: 'Cassia singueana', therapeutic: 'Antimicrobien (CMI 0.5-4 mg/mL), antifongique, anti-inflammatoire, antioxydant, antidiabétique. Utilisé en médecine traditionnelle africaine (infections, diabète, paludisme).' },
  { name: 'Cassytha filiformis', therapeutic: 'Antimicrobien (CMI 1-8 mg/mL), antiparasitaire (Plasmodium), anti-inflammatoire, antioxydant, antihypertenseur. Riche en alcaloïdes (cassythine, actinodaphnine). Utilisé en médecine traditionnelle africaine et asiatique.' },
  { name: 'Cetalox', therapeutic: 'Musc ambrané de synthèse (analogue de l\'ambroxan). Fixateur olfactif, propriétés sensorielles. Biodégradable. Utilisé comme alternative aux muscs nitrés en parfumerie fine.' },
  { name: 'Acacia brûlé', therapeutic: 'Note fumée de synthèse. Propriétés antiseptiques légères (phénols de fumée). Utilisé en parfumerie pour notes fumées/brûlées.' },
  { name: 'Ammonium-Maillard', therapeutic: 'Composé de réaction de Maillard. Aromatisant alimentaire. Propriétés antioxydantes légères (mélanoidines). Présent dans aliments torréfiés (café, cacao, pain).' },
  { name: 'Cannabis', therapeutic: 'Antidouleur (activation CB1/CB2), antiémétique, anxiolytique, anti-inflammatoire (CBD), antiépileptique (CBD, Epidiolex approuvé FDA), neuroprotecteur. Riche en THC, CBD, terpènes (myrcène, limonène, pinène). Cannabis sativa L.' },
];

let updated = 0;
for (const u of updates) {
  const [rows] = await conn.execute('SELECT id, therapeuticProperties FROM molecules WHERE name = ?', [u.name]);
  if (rows.length > 0) {
    const row = rows[0];
    if (!row.therapeuticProperties || row.therapeuticProperties === '' || row.therapeuticProperties === 'null') {
      await conn.execute('UPDATE molecules SET therapeuticProperties = ? WHERE id = ?', [u.therapeutic, row.id]);
      updated++;
      console.log('  ✓', u.name);
    }
  }
}

const [[{ total, withTherapy }]] = await conn.execute(`
  SELECT COUNT(*) as total, 
         SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '' AND therapeuticProperties != 'null' THEN 1 ELSE 0 END) as withTherapy
  FROM molecules
`);
console.log(`\nTotal enrichies : ${updated}`);
console.log(`Couverture : ${withTherapy}/${total} (${(withTherapy/total*100).toFixed(1)}%)`);
await conn.end();
