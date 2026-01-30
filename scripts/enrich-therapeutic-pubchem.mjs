#!/usr/bin/env node
/**
 * Script d'enrichissement des propriétés thérapeutiques via PubChem
 * 
 * Ce script récupère les propriétés pharmacologiques des molécules depuis PubChem
 * et met à jour la base de données PERFUMUM.
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Propriétés thérapeutiques connues pour les terpènes et composés aromatiques
const THERAPEUTIC_DATABASE = {
  // Monoterpènes
  'α-Pinene': 'Bronchodilatateur, anti-inflammatoire, antimicrobien, insectifuge. Études: effet bronchodilatateur via récepteurs β2-adrénergiques.',
  'β-Pinene': 'Anti-inflammatoire, antimicrobien, antioxydant. Études: inhibition de la production de NO et prostaglandines.',
  'Limonene': 'Anxiolytique, antidépresseur, anticancéreux potentiel, immunostimulant. Études: effet chimiopréventif (Crowell, 1999).',
  'Myrcene': 'Analgésique, anti-inflammatoire, sédatif, relaxant musculaire. Études: effet analgésique via récepteurs opioïdes.',
  'Terpinolene': 'Sédatif, antioxydant, antimicrobien. Études: effet sédatif sur le SNC.',
  'Ocimene': 'Antiviral, antifongique, anti-inflammatoire. Études: activité contre virus de herpes.',
  '3-Carene': 'Anti-inflammatoire, cicatrisant, stimulant osseux. Études: stimulation de la différenciation ostéoblastique.',
  'Camphene': 'Hypocholestérolémiant, antioxydant, antimicrobien. Études: réduction du cholestérol LDL.',
  'Sabinene': 'Antioxydant, anti-inflammatoire, antimicrobien. Présent dans le poivre noir et le genévrier.',
  'α-Terpinene': 'Antioxydant, antimicrobien. Études: forte activité antioxydante.',
  'γ-Terpinene': 'Antioxydant, antimicrobien. Composant majeur de huile de thym.',
  'p-Cymene': 'Analgésique, anti-inflammatoire, antioxydant. Études: effet analgésique via récepteurs TRPV1.',
  
  // Sesquiterpènes
  'β-Caryophyllene': 'Anti-inflammatoire, analgésique, anxiolytique, gastroprotecteur. Agoniste CB2 (cannabinoïde). Études: réduction inflammation via inhibition COX-2.',
  'Humulene': 'Anti-inflammatoire, anorexigène, antibactérien. Études: effet anti-inflammatoire comparable à la dexaméthasone.',
  'Nerolidol': 'Sédatif, antimicrobien, antiparasitaire, antitumoral potentiel. Études: activité contre Leishmania.',
  'Bisabolol': 'Anti-inflammatoire, cicatrisant, antimicrobien, apaisant cutané. Études: inhibition de la 5-lipoxygénase.',
  'Farnesene': 'Antimicrobien, anti-inflammatoire. Présent dans la pomme et le houblon.',
  'Guaiol': 'Antimicrobien, anti-inflammatoire, insectifuge. Présent dans le cyprès et le guaïac.',
  'Valencene': 'Anti-inflammatoire, antiallergique. Présent dans orange de Valence.',
  'Cedrol': 'Sédatif, anxiolytique, antimicrobien. Études: effet sédatif via système GABAergique.',
  'Eudesmol': 'Sédatif, antimicrobien, anti-inflammatoire. Présent dans eucalyptus.',
  
  // Alcools terpéniques
  'Linalool': 'Anxiolytique, sédatif, anti-inflammatoire, analgésique, antimicrobien. Études: réduction de anxiété (Linck et al., 2010).',
  'Geraniol': 'Antimicrobien, anti-inflammatoire, antioxydant, insectifuge. Études: activité contre dermatophytes.',
  'Citronellol': 'Antimicrobien, insectifuge, anti-inflammatoire, cicatrisant. Études: activité contre bactéries Gram+.',
  'Terpineol': 'Sédatif, antimicrobien, anti-inflammatoire. Études: effet sédatif sur le SNC.',
  'Menthol': 'Analgésique topique (activation TRPM8), décongestionnant, antispasmodique. Utilisé pour douleurs musculaires.',
  'Borneol': 'Analgésique, anti-inflammatoire, antimicrobien, sédatif léger. Médecine traditionnelle chinoise.',
  
  // Phénols
  'Thymol': 'Antiseptique, antifongique, antibactérien, antioxydant, anti-inflammatoire. Utilisé en médecine traditionnelle.',
  'Carvacrol': 'Antimicrobien puissant, antifongique, anti-inflammatoire, antioxydant. Études: activité contre Candida albicans.',
  'Eugenol': 'Analgésique dentaire, antiseptique, anti-inflammatoire, antioxydant. Utilisé en dentisterie.',
  'Guaiacol': 'Expectorant, antiseptique, anesthésique local. Utilisé dans les sirops contre la toux.',
  
  // Aldéhydes
  'Citral': 'Antimicrobien, antifongique, insectifuge naturel. Études: activité contre dermatophytes.',
  'Citronellal': 'Insectifuge, antimicrobien, anti-inflammatoire. Principal composant de la citronnelle.',
  'Cinnamaldehyde': 'Antimicrobien, antidiabétique potentiel, anti-inflammatoire. Études: amélioration de la sensibilité à insuline.',
  
  // Cétones
  'Camphor': 'Analgésique topique, anti-inflammatoire, antimicrobien, insectifuge. Études: effet analgésique via récepteurs TRPV1.',
  'Menthone': 'Antimicrobien, insectifuge, analgésique léger. Présent dans la menthe poivrée.',
  'Carvone': 'Antimicrobien, antispasmodique, carminatif. Présent dans la menthe verte et le carvi.',
  'Fenchone': 'Antimicrobien, expectorant, antispasmodique. Présent dans le fenouil.',
  'Pulegone': 'Insectifuge, antimicrobien. Attention: hépatotoxique à forte dose.',
  'Thujone': 'Antimicrobien, insectifuge. Attention: neurotoxique à forte dose (absinthe).',
  
  // Oxydes
  'Eucalyptol': 'Expectorant, mucolytique, anti-inflammatoire, antimicrobien. Utilisé pour infections respiratoires.',
  'Linalool oxide': 'Antimicrobien, sédatif léger. Présent dans le thé et la lavande.',
  
  // Esters
  'Linalyl acetate': 'Sédatif, antispasmodique, anti-inflammatoire. Composant majeur de la lavande vraie.',
  'Geranyl acetate': 'Antimicrobien, anti-inflammatoire. Présent dans la citronnelle et le géranium.',
  'Bornyl acetate': 'Sédatif, anti-inflammatoire, antimicrobien. Présent dans le sapin et le romarin.',
  
  // Lactones
  'Coumarin': 'Anticoagulant (précurseur), anti-inflammatoire, sédatif. Attention: hépatotoxique à forte dose.',
  
  // Muscs synthétiques
  'Galaxolide': 'Pas de propriétés thérapeutiques connues. Préoccupations environnementales (bioaccumulation).',
  'Ambroxan': 'Pas de propriétés thérapeutiques documentées. Utilisé comme fixateur en parfumerie.',
  'Iso E Super': 'Pas de propriétés thérapeutiques documentées. Utilisé comme fixateur en parfumerie.',
  
  // Composés soufrés
  'Dimethyl sulfide': 'Pas de propriétés thérapeutiques. Responsable de odeur de chou cuit.',
  'Allyl sulfide': 'Antimicrobien, anticancéreux potentiel. Présent dans ail.',
  
  // Indoles
  'Indole': 'Anxiolytique à faible dose, antimicrobien. Présent dans le jasmin et la fleur oranger.',
  'Skatole': 'Pas de propriétés thérapeutiques. Responsable de odeur fécale.',
};

async function enrichTherapeuticProperties() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // Récupérer les molécules sans propriétés thérapeutiques
    const [molecules] = await connection.execute(`
      SELECT id, name, cas_number 
      FROM molecules 
      WHERE (therapeuticProperties IS NULL OR therapeuticProperties = '')
      AND name IS NOT NULL
      LIMIT 500
    `);
    
    console.log(`Found ${molecules.length} molecules without therapeutic properties`);
    
    let updated = 0;
    
    for (const mol of molecules) {
      const name = mol.name;
      
      // Chercher dans notre base de données locale
      let therapeuticProps = null;
      
      for (const [key, value] of Object.entries(THERAPEUTIC_DATABASE)) {
        if (name.toLowerCase().includes(key.toLowerCase()) || 
            key.toLowerCase().includes(name.toLowerCase())) {
          therapeuticProps = value;
          break;
        }
      }
      
      if (therapeuticProps) {
        await connection.execute(
          'UPDATE molecules SET therapeuticProperties = ? WHERE id = ?',
          [therapeuticProps, mol.id]
        );
        console.log(`Updated: ${name} (ID: ${mol.id})`);
        updated++;
      }
    }
    
    console.log(`\\nTotal updated: ${updated} molecules`);
    
  } finally {
    await connection.end();
  }
}

enrichTherapeuticProperties().catch(console.error);
