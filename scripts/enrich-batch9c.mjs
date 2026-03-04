/**
 * Batch 9c : enrichir les molécules identifiables existantes dans la base
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const updates = [
  { name: 'Atropine', therapeutic: 'Anticholinergique (antagoniste muscarinique non sélectif M1-M5), utilisé cliniquement : mydriase ophtalmologique, traitement bradycardie, antidote organophosphorés, prémédication anesthésique. ATTENTION : toxique à fortes doses. Présent dans belladone (Atropa belladonna), datura, jusquiame.' },
  { name: 'Anisole', therapeutic: 'Antimicrobien léger, insectifuge, précurseur de synthèse pharmaceutique. Odeur anisée. Présent dans anis vert, fenouil, basilic.' },
  { name: 'Allyl caproate', therapeutic: 'Aromatisant alimentaire (GRAS FDA), antimicrobien léger. Odeur fruitée (ananas). Présent dans certains fruits tropicaux.' },
  { name: 'Ambergris', therapeutic: 'Fixateur olfactif naturel de haute valeur, propriétés anti-inflammatoires (ambrein), aphrodisiaque traditionnel, antispasmodique. Sécrété par le cachalot (Physeter macrocephalus). Réglementé CITES.' },
  { name: 'Ambre Gris Naturel', therapeutic: 'Fixateur olfactif naturel de haute valeur, propriétés anti-inflammatoires (ambrein), aphrodisiaque traditionnel, antispasmodique. Sécrété par le cachalot (Physeter macrocephalus). Réglementé CITES.' },
  { name: 'Benzyl salicylate', therapeutic: 'Anti-UV (absorption UV-B), antiseptique léger, antifongique. Utilisé en parfumerie comme fixateur et en cosmétique comme filtre solaire. Allergène potentiel (liste IFRA).' },
  { name: 'Amyl salicylate', therapeutic: 'Anti-UV (absorption UV-B), antiseptique léger, antifongique. Odeur florale (orchidée). Utilisé en parfumerie et cosmétique.' },
  { name: 'Amyris oil', therapeutic: 'Antimicrobien (CMI 2-8 μg/mL), antifongique, anti-inflammatoire, insectifuge. Riche en sesquiterpènes (valénol, eudesmol). Présent dans Amyris balsamifera (bois de rose des Antilles).' },
  { name: 'Baume de Tolú', therapeutic: 'Expectorant, antiseptique des voies respiratoires, cicatrisant, antifongique. Riche en acide benzoïque, acide cinnamique, benzyl benzoate. Extrait de Myroxylon balsamum var. balsamum.' },
  { name: 'Baume du Pérou', therapeutic: 'Antiseptique, cicatrisant (traitement plaies, ulcères), antiparasitaire (gale, pédiculose), antifongique, expectorant. Riche en benzyl benzoate, benzyl cinnamate. Extrait de Myroxylon balsamum var. pereirae. Allergène fréquent.' },
  { name: 'Benjoin du Siam', therapeutic: 'Antiseptique des voies respiratoires, expectorant, cicatrisant, anti-inflammatoire. Riche en acide benzoïque, vanilline, benzyl benzoate. Extrait de Styrax tonkinensis.' },
  { name: 'Benzoin Siam', therapeutic: 'Antiseptique des voies respiratoires, expectorant, cicatrisant, anti-inflammatoire. Riche en acide benzoïque, vanilline, benzyl benzoate. Extrait de Styrax tonkinensis.' },
  { name: 'Beta-cedrene', therapeutic: 'Anti-inflammatoire (inhibition COX-2), antimicrobien, insectifuge, sédatif léger. Présent dans cèdre de l\'Atlas (Cedrus atlantica), cèdre de Virginie (Juniperus virginiana).' },
  { name: 'Baobab', therapeutic: 'Antioxydant exceptionnel (teneur en vitamine C 6× supérieure à l\'orange), anti-inflammatoire, prébiotique (fibres solubles), hépatoprotecteur. Extrait de Adansonia digitata (pulpe de fruit).' },
  { name: 'Bergamote', therapeutic: 'Anxiolytique (aromathérapie, modulation GABA-A), antimicrobien (CMI 0.5-2 mg/mL), antifongique, anti-inflammatoire, antidépresseur léger, photoprotecteur (bergaptène). Huile essentielle de Citrus bergamia.' },
  { name: 'Basilic sacré', therapeutic: 'Adaptogène (réduction cortisol), antimicrobien (CMI 0.5-2 mg/mL), anti-inflammatoire (inhibition COX-2), antidiabétique (réduction glycémie), anxiolytique, immunomodulateur. Ocimum tenuiflorum (Tulsi), plante sacrée ayurvédique.' },
  { name: 'Anis vert', therapeutic: 'Antispasmodique (relaxation muscles lisses intestinaux), carminatif (réduction flatulences), expectorant, antimicrobien, galactogogue (stimulation lactation). Huile essentielle de Pimpinella anisum. Riche en trans-anéthol (80-90%).' },
  { name: 'Angelica root oil', therapeutic: 'Carminatif, antispasmodique, diurétique, expectorant, antimicrobien, anxiolytique. Riche en phtalides, monoterpènes, coumarines. Huile essentielle d\'Angelica archangelica. Photosensibilisant (furanocoumarines).' },
  { name: 'Ambrettone', therapeutic: 'Musc macrocyclique de synthèse. Propriétés fixatrices en parfumerie. Biodégradable. Utilisé comme alternative aux muscs nitrés (interdits IFRA).' },
  { name: '2-Methylquinoline', therapeutic: 'Antimicrobien, antifongique, précurseur de synthèse de médicaments antipaludéens (quinoline). Présent dans goudron de houille, certaines plantes.' },
  { name: 'Ayahuasca', therapeutic: 'Préparation psychoactive traditionnelle (Amazonie) : Banisteriopsis caapi + Psychotria viridis. Contient DMT + inhibiteurs MAO (harmala alcaloïdes). Recherches cliniques sur dépression résistante, PTSD, addictions. Usage rituel chamanique.' },
  { name: 'Banisteriopsis caapi', therapeutic: 'Inhibiteur MAO (harmine, harmaline, tétrahydroharmine), antidépresseur, anxiolytique, antiparasitaire (Leishmania). Composant de l\'ayahuasca. Recherches sur dépression résistante et maladie de Parkinson.' },
  { name: 'Birch tar rectified', therapeutic: 'Antiseptique cutané (traitement psoriasis, eczéma, dermatites), antimicrobien, antifongique, antiparasitaire (gale). Riche en phénols (guaiacol, créosol, phénol). Extrait de Betula pendula par distillation sèche.' },
  { name: 'Black Spruce', therapeutic: 'Stimulant cortisurrénalien (adaptogène), antimicrobien, expectorant, anti-inflammatoire. Riche en bornyl acétate (30-40%), camphène, limonène. Huile essentielle de Picea mariana.' },
  { name: 'Ambrox Super', therapeutic: 'Musc ambrané de synthèse (analogue de l\'ambroxan). Fixateur olfactif, propriétés sensorielles (activation récepteur olfactif OR51E2 associé aux effets aphrodisiaques). Biodégradable.' },
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
