/**
 * Batch 6c : créer les molécules importantes manquantes avec les bonnes colonnes
 * et enrichir les molécules existantes non trouvées par recherche partielle
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ============================================================
// ÉTAPE 1 : Créer les molécules importantes manquantes
// ============================================================
const toCreate = [
  { name: 'Carnosol', formula: 'C20H26O4', mw: '330.4', family: 'Diterpène phénolique', therapy: 'Antioxydant puissant (DPPH), anti-inflammatoire (inhibition COX-2, LOX), antitumoral (apoptose dans cancers du sein, prostate, côlon). Neuroprotecteur. Antimicrobien. Présent dans romarin, sauge.', odor: 'Légèrement herbacé, camphré', cas: '5957-80-2' },
  { name: 'Acide carnosolique', formula: 'C20H28O4', mw: '332.4', family: 'Diterpène phénolique', therapy: 'Antioxydant majeur du romarin (10× plus puissant que la vitamine E). Anti-inflammatoire, neuroprotecteur (modèles Alzheimer, Parkinson). Antitumoral. Antimicrobien contre MRSA. Conservateur alimentaire naturel.', odor: 'Herbacé, légèrement amer', cas: '3650-09-7' },
  { name: 'Rosmanol', formula: 'C20H26O5', mw: '346.4', family: 'Diterpène phénolique', therapy: 'Antioxydant, anti-inflammatoire, antimicrobien. Propriétés hépatoprotectrices. Présent dans le romarin et la sauge. Synergique avec le carnosol.', odor: 'Herbacé', cas: '76006-35-4' },
  { name: 'Xanthotoxine', formula: 'C12H8O4', mw: '216.2', family: 'Coumarine / Furocoumarine', therapy: 'Photosensibilisant médicinal (traitement psoriasis, vitiligo, mycosis fongoïde). Antifongique, antiparasitaire (Leishmania). Vasodilatateur coronarien. Phototoxique — usage médical supervisé uniquement.', odor: 'Légèrement aromatique', cas: '298-81-7' },
  { name: 'Psoralène', formula: 'C11H6O3', mw: '186.2', family: 'Coumarine / Furocoumarine', therapy: 'Photosensibilisant thérapeutique (PUVA). Antifungique, antiparasitaire. Immunomodulateur. Phototoxique et potentiellement mutagène sous UV. Usage médical strict.', odor: 'Légèrement aromatique', cas: '66-97-7' },
  { name: 'Herniarine', formula: 'C10H8O3', mw: '176.2', family: 'Coumarine', therapy: 'Antispasmodique, anti-inflammatoire, analgésique. Propriétés antibactériennes. Moins phototoxique que les autres furocoumarines. Présent dans la camomille romaine.', odor: 'Légèrement floral, foin', cas: '531-59-9' },
  { name: 'Ombelliférone', formula: 'C9H6O3', mw: '162.1', family: 'Coumarine', therapy: 'Antifongique, antibactérien, anti-inflammatoire. Photoprotecteur UV-A. Antitumoral in vitro. Présent dans de nombreuses Apiaceae (angélique, fenouil, carotte).', odor: 'Foin, légèrement vanillé', cas: '93-35-6' },
  { name: 'Scopolétine', formula: 'C10H8O4', mw: '192.2', family: 'Coumarine', therapy: 'Antispasmodique, sédatif léger, anti-inflammatoire. Neuroprotecteur (inhibition acétylcholinestérase). Antioxydant. Présent dans la belladone, la jusquiame, l\'hysope.', odor: 'Légèrement aromatique', cas: '92-61-5' },
  { name: 'Bergamottine', formula: 'C21H22O4', mw: '338.4', family: 'Coumarine / Furocoumarine', therapy: 'Inhibiteur du cytochrome P450 (interactions médicamenteuses). Antioxydant, anti-inflammatoire. Présent dans le jus de pamplemousse — responsable des interactions avec certains médicaments.', odor: 'Agrumé, légèrement floral', cas: '7380-40-7' },
  { name: 'Quercétine', formula: 'C15H10O7', mw: '302.2', family: 'Flavonoïde / Flavonol', therapy: 'Antioxydant majeur, anti-inflammatoire (inhibition histamine, COX-2), antiallergique, antiviral (influenza, rhinovirus). Cardioprotecteur, anticancéreux in vitro. Présent dans oignon, câpres, thé vert.', odor: 'Inodore', cas: '117-39-5' },
  { name: 'Kaempférol', formula: 'C15H10O6', mw: '286.2', family: 'Flavonoïde / Flavonol', therapy: 'Antioxydant, anti-inflammatoire, antitumoral (apoptose), cardioprotecteur. Neuroprotecteur. Présent dans le brocoli, le thé, les câpres, la lavande.', odor: 'Inodore', cas: '520-18-3' },
  { name: 'Apigénine', formula: 'C15H10O5', mw: '270.2', family: 'Flavonoïde / Flavone', therapy: 'Anxiolytique (modulation GABA-A), anti-inflammatoire, antitumoral (apoptose), antioxydant. Sédatif léger. Présent dans la camomille, le persil, le céleri.', odor: 'Inodore', cas: '520-36-5' },
  { name: 'Lutéoline', formula: 'C15H10O6', mw: '286.2', family: 'Flavonoïde / Flavone', therapy: 'Anti-inflammatoire puissant (inhibition TNF-α, IL-6), antioxydant, antitumoral, neuroprotecteur. Antiallergique. Présent dans le thym, la sauge, l\'artichaut.', odor: 'Inodore', cas: '491-70-3' },
  { name: 'Resvératrol', formula: 'C14H12O3', mw: '228.2', family: 'Stilbénoïde', therapy: 'Cardioprotecteur (activation sirtuines), antioxydant, anti-inflammatoire, antitumoral. Antifongique naturel (phytoalexine). Neuroprotecteur. Présent dans le raisin, les baies, les arachides.', odor: 'Inodore', cas: '501-36-0' },
  { name: 'Acide rosmarinique', formula: 'C18H16O8', mw: '360.3', family: 'Acide phénolique', therapy: 'Antioxydant puissant, anti-inflammatoire (inhibition COX, LOX), antiallergique, antiviral (HSV, VIH). Neuroprotecteur. Présent dans le romarin, la sauge, la mélisse, le basilic.', odor: 'Légèrement herbacé', cas: '20283-92-5' },
  { name: 'Acide chlorogénique', formula: 'C16H18O9', mw: '354.3', family: 'Acide phénolique', therapy: 'Antioxydant, hypoglycémiant (inhibition glucose-6-phosphatase), hypolipémiant, anti-inflammatoire. Neuroprotecteur. Présent dans le café, les pommes, les artichauts.', odor: 'Inodore', cas: '327-97-9' },
  { name: 'Taxol (Paclitaxel)', formula: 'C47H51NO14', mw: '853.9', family: 'Diterpène / Taxane', therapy: 'Anticancéreux majeur (inhibition de la dépolymérisation des microtubules). Approuvé FDA pour cancers du sein, ovaire, poumon. Extrait de l\'if (Taxus brevifolia). Révolution en oncologie.', odor: 'Inodore', cas: '33069-62-4' },
  { name: 'Quinine', formula: 'C20H24N2O2', mw: '324.4', family: 'Alcaloïde quinoléique', therapy: 'Antipaludéen historique (inhibition hème polymérase Plasmodium). Antipyrétique, analgésique, antispasmodique. Présent dans l\'écorce de quinquina (Cinchona spp.). Modèle pour la chloroquine.', odor: 'Amer, légèrement médicinal', cas: '130-95-0' },
  { name: 'Caféine', formula: 'C8H10N4O2', mw: '194.2', family: 'Alcaloïde purique / Méthylxanthine', therapy: 'Stimulant SNC (antagoniste adénosine), bronchodilatateur, diurétique léger. Améliore performances cognitives et physiques. Analgésique adjuvant. Présent dans café, thé, cacao, guarana.', odor: 'Légèrement amer', cas: '58-08-2' },
  { name: 'Théophylline', formula: 'C7H8N4O2', mw: '180.2', family: 'Alcaloïde purique / Méthylxanthine', therapy: 'Bronchodilatateur (traitement asthme, BPCO), stimulant respiratoire, diurétique. Médicament essentiel OMS. Présent dans le thé, le cacao. Marge thérapeutique étroite.', odor: 'Légèrement amer', cas: '58-55-9' },
  { name: 'Vincristine', formula: 'C46H56N4O10', mw: '824.9', family: 'Alcaloïde indolique', therapy: 'Anticancéreux majeur (inhibition polymérisation tubuline). Traitement leucémies, lymphomes. Extrait de Catharanthus roseus (pervenche de Madagascar). Médicament essentiel OMS.', odor: 'Inodore', cas: '57-22-7' },
  { name: 'Colchicine', formula: 'C22H25NO6', mw: '399.4', family: 'Alcaloïde', therapy: 'Antigoutteux (inhibition migration neutrophiles), anti-inflammatoire, antimitotique. Traitement de la fièvre méditerranéenne familiale. Présent dans le colchique d\'automne. Toxique à haute dose.', odor: 'Inodore', cas: '64-86-8' },
  { name: 'β-Sitostérol', formula: 'C29H50O', mw: '414.7', family: 'Phytostérol', therapy: 'Hypocholestérolémiant (compétition avec cholestérol alimentaire). Traitement de l\'hyperplasie bénigne de la prostate. Anti-inflammatoire, immunomodulateur. Présent dans huile d\'avocat, noix, graines.', odor: 'Inodore', cas: '83-46-5' },
  { name: 'Lupéol', formula: 'C30H50O', mw: '426.7', family: 'Triterpène pentacyclique', therapy: 'Anti-inflammatoire, antitumoral (mélanome, leucémie), antiparasitaire (Leishmania, Plasmodium). Hépatoprotecteur. Présent dans le bouleau, le pissenlit, la mangue.', odor: 'Inodore', cas: '545-47-1' },
  { name: 'Acide bétulinique', formula: 'C30H48O3', mw: '456.7', family: 'Triterpène pentacyclique', therapy: 'Anticancéreux sélectif (apoptose cellules mélanome sans toxicité systémique). Antiviral (VIH, HSV). Anti-inflammatoire, antiparasitaire. Présent dans le bouleau, le platane, la vigne.', odor: 'Inodore', cas: '472-15-1' },
  { name: 'Géranylgéraniol', formula: 'C20H34O', mw: '290.5', family: 'Diterpène acyclique', therapy: 'Anticancéreux (inhibition de la mévalonate kinase, apoptose). Antiparasitaire (Leishmania). Précurseur de nombreux diterpènes bioactifs. Présent dans l\'huile de palme, les conifères.', odor: 'Floral, légèrement boisé', cas: '699-14-9' },
  { name: 'Ginkgolide A', formula: 'C20H24O9', mw: '408.4', family: 'Diterpène / Ginkgolide', therapy: 'Antagoniste du PAF (facteur d\'activation plaquettaire). Neuroprotecteur, améliore la circulation cérébrale. Utilisé dans les troubles cognitifs et démences. Présent exclusivement dans Ginkgo biloba.', odor: 'Inodore', cas: '15291-75-5' },
  { name: 'Ginkgolide B', formula: 'C20H24O10', mw: '424.4', family: 'Diterpène / Ginkgolide', therapy: 'Antagoniste PAF le plus puissant des ginkgolides. Neuroprotecteur, anticoagulant, anti-inflammatoire. Utilisé en médecine pour les troubles vasculaires cérébraux. Ginkgo biloba exclusivement.', odor: 'Inodore', cas: '15291-77-7' },
  { name: 'Totarol', formula: 'C20H30O', mw: '286.5', family: 'Diterpène phénolique', therapy: 'Antimicrobien puissant contre MRSA et bactéries Gram+. Antioxydant, anti-inflammatoire. Présent dans Podocarpus totara (if de Nouvelle-Zélande). Utilisé en cosmétique comme conservateur naturel.', odor: 'Légèrement boisé', cas: '511-15-9' },
  { name: 'Abietol', formula: 'C20H32O', mw: '288.5', family: 'Diterpène', therapy: 'Antimicrobien, antifongique. Propriétés anti-inflammatoires. Présent dans les résines de conifères (pin, sapin). Utilisé en médecine traditionnelle pour les affections respiratoires.', odor: 'Boisé, résineux', cas: '511-14-8' },
];

let created = 0;
let updated = 0;
// Obtenir le max ID actuel
const [maxRow] = await conn.execute('SELECT MAX(id) as maxId FROM molecules');
let nextId = Math.max(Number(maxRow[0].maxId) + 1, 1300001);

for (const mol of toCreate) {
  // Vérifier si la molécule existe déjà
  const [existing] = await conn.execute(
    'SELECT id, therapeuticProperties FROM molecules WHERE name = ? LIMIT 1',
    [mol.name]
  );
  if (existing[0]) {
    if (!existing[0].therapeuticProperties || existing[0].therapeuticProperties.length < 20) {
      await conn.execute('UPDATE molecules SET therapeuticProperties = ? WHERE id = ?', [mol.therapy, existing[0].id]);
      console.log('✓ Enrichi:', mol.name);
      updated++;
    } else {
      console.log('Déjà enrichi:', mol.name);
    }
    continue;
  }
  
  // Créer la molécule
  await conn.execute(
    `INSERT INTO molecules (id, name, formula, molecularWeight, chemicalFamily, therapeuticProperties, olfactiveProfile, cas_number, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [nextId, mol.name, mol.formula, mol.mw, mol.family, mol.therapy, mol.odor, mol.cas || null]
  );
  console.log('✓ Créé:', mol.name, '(id:', nextId + ')');
  created++;
  nextId++;
}

// Résultat final
const [total] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
const [withTherapy] = await conn.execute('SELECT COUNT(*) as n FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != ""');
console.log('\n=== RÉSULTAT BATCH 6 COMPLET ===');
console.log('Créés :', created);
console.log('Enrichis :', updated);
console.log('Couverture :', withTherapy[0].n + '/' + total[0].n, '(' + (withTherapy[0].n/total[0].n*100).toFixed(1) + '%)');

await conn.end();
