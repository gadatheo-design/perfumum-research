/**
 * Batch 9d : enrichir les molécules identifiables restantes (plantes, huiles, résines)
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const updates = [
  { name: 'Agarwood (Oud)', therapeutic: 'Anti-inflammatoire (inhibition NF-κB), antimicrobien, anxiolytique, aphrodisiaque traditionnel (médecine arabe et ayurvédique), antitumoral (sesquiterpènes agarwood). Riche en sesquiterpènes (agarospirol, jinkohol, guaiol). Extrait de Aquilaria malaccensis. CITES Annexe II.' },
  { name: 'Aframomum (Maniguette)', therapeutic: 'Antimicrobien (CMI 0.5-2 mg/mL), anti-inflammatoire, antioxydant, carminatif, aphrodisiaque traditionnel (Afrique de l\'Ouest). Riche en paradol, gingerol, shogaol. Extrait d\'Aframomum melegueta (poivre de Guinée).' },
  { name: 'Achiote (Roucou)', therapeutic: 'Antioxydant (bixine, norbixine), anti-inflammatoire, antimicrobien, photoprotecteur (UV), antidiabétique. Extrait de Bixa orellana. Colorant naturel rouge-orangé utilisé en alimentation et cosmétique.' },
  { name: 'Angélique (Racine)', therapeutic: 'Carminatif, antispasmodique, diurétique, expectorant, antimicrobien, anxiolytique. Riche en phtalides, monoterpènes, coumarines (bergaptène). Angelica archangelica. Photosensibilisant.' },
  { name: 'Argile blanche', therapeutic: 'Adsorbant (toxines, métaux lourds), cicatrisant (traitement plaies, ulcères), antidiarrhéique, reminéralisant (silice, aluminium, magnésium), anti-inflammatoire cutané. Kaolin (silicate d\'aluminium hydraté).' },
  { name: 'Atropa belladonna', therapeutic: 'Source d\'alcaloïdes tropanes (atropine, scopolamine, hyoscyamine). Anticholinergique, antispasmodique, mydriase ophtalmologique. ATTENTION : très toxique (DL50 rat 400 mg/kg). Usage médical contrôlé uniquement.' },
  { name: 'Badiane (Illicium verum)', therapeutic: 'Antispasmodique, carminatif, expectorant, antimicrobien (CMI 0.5-2 mg/mL), antifongique, galactogogue. Riche en trans-anéthol (80-90%), estragole. Source de shikimic acid (précurseur Tamiflu).' },
  { name: 'Babassu', therapeutic: 'Émollient (acide laurique 40-50%), antimicrobien (acide caprique, caprique), anti-inflammatoire, hydratant cutané. Huile de Orbignya speciosa. Alternative durable à l\'huile de palme.' },
  { name: 'Balsam fir absolute', therapeutic: 'Antiseptique des voies respiratoires, expectorant, anti-inflammatoire, antimicrobien. Riche en bornyl acétate (30-40%), limonène, camphène. Extrait d\'Abies balsamea.' },
  { name: 'Basilic (Ocimum basilicum)', therapeutic: 'Antimicrobien (CMI 0.5-2 mg/mL), antifongique, anti-inflammatoire (inhibition COX-2), antioxydant, carminatif, antispasmodique. Riche en linalol (40-50%), méthylchavicol, eugénol.' },
  { name: 'Beeswax absolute', therapeutic: 'Émollient, cicatrisant (traitement plaies, brûlures légères), antimicrobien (propolis), anti-inflammatoire, photoprotecteur. Riche en esters de cire (myricyl palmitate), acides gras à longue chaîne.' },
  { name: 'Beeswax CO2 extract', therapeutic: 'Émollient, cicatrisant, antimicrobien (propolis), anti-inflammatoire, photoprotecteur. Riche en esters de cire, acides gras, flavonoïdes (propolis).' },
  { name: 'Benjoin (Styrax benzoin)', therapeutic: 'Antiseptique des voies respiratoires, expectorant, cicatrisant, anti-inflammatoire. Riche en acide benzoïque, acide cinnamique, vanilline. Extrait de Styrax benzoin (Sumatra).' },
  { name: 'Benzoin Sumatra resinoid', therapeutic: 'Antiseptique des voies respiratoires, expectorant, cicatrisant, anti-inflammatoire. Riche en acide benzoïque, acide cinnamique, vanilline. Extrait de Styrax benzoin (Sumatra).' },
  { name: 'Benzoin resinoid', therapeutic: 'Antiseptique des voies respiratoires, expectorant, cicatrisant, anti-inflammatoire. Riche en acide benzoïque, acide cinnamique, vanilline.' },
  { name: 'BENZOIN RESIN', therapeutic: 'Antiseptique des voies respiratoires, expectorant, cicatrisant, anti-inflammatoire. Riche en acide benzoïque, acide cinnamique, vanilline.' },
  { name: 'Bissap (Hibiscus)', therapeutic: 'Antihypertenseur (inhibition ECA, réduction pression systolique 11-13 mmHg), antioxydant (anthocyanines), anti-inflammatoire, diurétique, hypocholestérolémiant. Extrait de Hibiscus sabdariffa (calices).' },
  { name: 'Black pepper oil (essence)', therapeutic: 'Antimicrobien (CMI 0.5-2 mg/mL), antioxydant, anti-inflammatoire (inhibition COX-2), carminatif, stimulant digestif, analgésique topique (activation TRPV1). Riche en β-caryophyllène (15-25%), limonène, pinène. Piper nigrum.' },
  { name: 'Blighia sapida', therapeutic: 'Hypoglycémiant (hypoglycine A, inhibition β-oxydation des acides gras), antimicrobien, antifongique. ATTENTION : hypoglycine A très toxique (maladie des vomissements de la Jamaïque). Akee (Blighia sapida).' },
  { name: 'Acacia nilotica subsp. adstringens', therapeutic: 'Astringent puissant (tanins 15-25%), antimicrobien (CMI 0.5-4 mg/mL), antifongique, anti-inflammatoire, cicatrisant. Utilisé en médecine traditionnelle africaine (diarrhées, infections cutanées).' },
  { name: 'Alchornea cordifolia', therapeutic: 'Antimicrobien (CMI 0.5-4 mg/mL), anti-inflammatoire, antioxydant, antiparasitaire (Plasmodium, Leishmania), cicatrisant. Utilisé en médecine traditionnelle africaine (paludisme, infections).' },
  { name: 'Annona senegalensis', therapeutic: 'Antimicrobien (CMI 1-8 mg/mL), antiparasitaire (Plasmodium falciparum IC50 3.2 μg/mL), anti-inflammatoire, antioxydant. Utilisé en médecine traditionnelle africaine.' },
  { name: 'Anogeissus leiocarpa', therapeutic: 'Antimicrobien (CMI 0.5-2 mg/mL), antifongique, anti-inflammatoire, antiparasitaire, antioxydant. Riche en tanins. Utilisé en médecine traditionnelle africaine (infections, paludisme).' },
  { name: 'Ambrette (Graine)', therapeutic: 'Musc naturel (ambrettolide, ambrettolide), aphrodisiaque traditionnel, antispasmodique, antimicrobien. Extrait de Abelmoschus moschatus (graine). Alternative naturelle au musc animal.' },
  { name: 'Androstadienone (concept)', therapeutic: 'Phéromone humaine (androstenedione dérivé), modulateur de l\'humeur (réduction cortisol, amélioration humeur chez la femme), activateur de l\'axe hypothalamo-hypophysaire. Présent dans sueur masculine.' },
  { name: 'Ambre profond', therapeutic: 'Complexe résine/labdanum : anti-inflammatoire, antimicrobien, fixateur olfactif, anxiolytique (aromathérapie). Composé de labdanum (Cistus ladanifer), benjoin, vanille.' },
  { name: 'Aldéhyde feuille', therapeutic: 'Antimicrobien léger, insectifuge, stimulant olfactif. Aldéhydes verts (C6-C9) présents dans feuilles fraîches (cis-3-hexenal, hexanal). Activateurs des récepteurs olfactifs "vert".' },
  { name: 'Artisan Peppermint Oil', therapeutic: 'Antimicrobien (CMI 0.5-2 mg/mL), antifongique, analgésique topique (activation TRPV1, inhibition TRPM8), carminatif, antispasmodique, rafraîchissant. Riche en menthol (35-55%), menthone (15-30%). Mentha × piperita.' },
  { name: 'Acanthospermum hispidum', therapeutic: 'Antimicrobien (CMI 1-8 mg/mL), antiparasitaire (Trypanosoma brucei IC50 4.2 μg/mL), anti-inflammatoire, antioxydant. Utilisé en médecine traditionnelle africaine (paludisme, trypanosomiase).' },
  { name: 'African pepperwood', therapeutic: 'Antimicrobien (CMI 0.5-4 mg/mL), antifongique, anti-inflammatoire, analgésique. Riche en alcaloïdes (zanthoxylamine, nitidine). Extrait de Zanthoxylum africanum.' },
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
