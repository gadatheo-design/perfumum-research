import 'dotenv/config';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const anethole = {
  name: 'Anéthole',
  iupac_name: '1-méthoxy-4-(prop-1-én-1-yl)benzène',
  cas_number: '4180-23-8',
  chemicalFormula: 'C10H12O',
  family: 'Phénylpropanoïde',
  chemical_class: 'ether',
  molecularWeight: 148,
  boilingPoint: 234,
  olfactiveProfile: 'Doux, anisé, herbacé, chaud avec une note de réglisse. Odeur caractéristique de l anis étoilé, du fenouil et de l estragon.',
  emotionalResonance: 'Évoque la chaleur méditerranéenne, les marchés d épices, la convivialité des apéritifs anisés.',
  functionalEffect: 'Note de cœur à fond, très diffusif, effet réchauffant',
  sourceOrigin: 'Anis étoilé (Illicium verum), Fenouil (Foeniculum vulgare), Estragon (Artemisia dracunculus), Tagetes lucida (Yauhtli)',
  botanicalSources: 'Illicium verum (anis étoilé), Foeniculum vulgare (fenouil), Artemisia dracunculus (estragon), Tagetes lucida (Yauhtli mexicain)',
  extractionMethod: 'Hydrodistillation, extraction CO2 supercritique',
  therapeuticProperties: 'Carminatif, antispasmodique, expectorant',
  radar_intensity: 70,
  radar_freshness: 45,
  radar_warmth: 75,
  radar_sweetness: 80,
  radar_spiciness: 40,
  radar_earthiness: 25
};

const methyleugenol = {
  name: 'Méthyleugénol',
  iupac_name: '1,2-diméthoxy-4-(prop-2-én-1-yl)benzène',
  cas_number: '93-15-2',
  chemicalFormula: 'C11H14O2',
  family: 'Phénylpropanoïde',
  chemical_class: 'ether',
  molecularWeight: 178,
  boilingPoint: 248,
  olfactiveProfile: 'Doux, épicé, clou de girofle, œillet, cannelle. Note chaude et balsamique avec des facettes florales.',
  emotionalResonance: 'Évoque les épices orientales, les jardins de fleurs épicées, la chaleur des intérieurs parfumés.',
  functionalEffect: 'Note de cœur, fixateur naturel, effet réchauffant et enveloppant',
  sourceOrigin: 'Basilic (Ocimum basilicum), Laurier (Laurus nobilis), Tagetes lucida (Yauhtli), Piment de la Jamaïque',
  botanicalSources: 'Ocimum basilicum (basilic), Laurus nobilis (laurier), Tagetes lucida (Yauhtli mexicain), Pimenta dioica (piment de la Jamaïque)',
  extractionMethod: 'Hydrodistillation, extraction par solvant',
  therapeuticProperties: 'Antiseptique, analgésique local, sédatif léger',
  radar_intensity: 65,
  radar_freshness: 30,
  radar_warmth: 85,
  radar_sweetness: 70,
  radar_spiciness: 75,
  radar_earthiness: 40
};

const insertSQL = `
INSERT INTO molecules (
  name, iupac_name, cas_number, chemicalFormula, family, chemical_class,
  molecularWeight, boilingPoint, olfactiveProfile, emotionalResonance,
  functionalEffect, sourceOrigin, botanicalSources, extractionMethod,
  therapeuticProperties, radar_intensity, radar_freshness, radar_warmth,
  radar_sweetness, radar_spiciness, radar_earthiness
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

try {
  const [existingAnethole] = await connection.execute(
    "SELECT id FROM molecules WHERE name = 'Anéthole' OR cas_number = '4180-23-8'"
  );
  const [existingMethyleugenol] = await connection.execute(
    "SELECT id FROM molecules WHERE name = 'Méthyleugénol' OR cas_number = '93-15-2'"
  );

  if (existingAnethole.length === 0) {
    const values = [
      anethole.name, anethole.iupac_name, anethole.cas_number, anethole.chemicalFormula,
      anethole.family, anethole.chemical_class, anethole.molecularWeight, anethole.boilingPoint,
      anethole.olfactiveProfile, anethole.emotionalResonance, anethole.functionalEffect,
      anethole.sourceOrigin, anethole.botanicalSources, anethole.extractionMethod,
      anethole.therapeuticProperties, anethole.radar_intensity, anethole.radar_freshness,
      anethole.radar_warmth, anethole.radar_sweetness, anethole.radar_spiciness, anethole.radar_earthiness
    ];
    const [result1] = await connection.execute(insertSQL, values);
    console.log('Anethole ajoute avec succes, ID:', result1.insertId);
  } else {
    console.log('Anethole existe deja, ID:', existingAnethole[0].id);
  }

  if (existingMethyleugenol.length === 0) {
    const values = [
      methyleugenol.name, methyleugenol.iupac_name, methyleugenol.cas_number, methyleugenol.chemicalFormula,
      methyleugenol.family, methyleugenol.chemical_class, methyleugenol.molecularWeight, methyleugenol.boilingPoint,
      methyleugenol.olfactiveProfile, methyleugenol.emotionalResonance, methyleugenol.functionalEffect,
      methyleugenol.sourceOrigin, methyleugenol.botanicalSources, methyleugenol.extractionMethod,
      methyleugenol.therapeuticProperties, methyleugenol.radar_intensity, methyleugenol.radar_freshness,
      methyleugenol.radar_warmth, methyleugenol.radar_sweetness, methyleugenol.radar_spiciness, methyleugenol.radar_earthiness
    ];
    const [result2] = await connection.execute(insertSQL, values);
    console.log('Methyleugenol ajoute avec succes, ID:', result2.insertId);
  } else {
    console.log('Methyleugenol existe deja, ID:', existingMethyleugenol[0].id);
  }

  const [newMolecules] = await connection.execute(
    "SELECT id, name, cas_number, chemicalFormula, family FROM molecules WHERE name IN ('Anéthole', 'Méthyleugénol')"
  );
  console.log('Molecules ajoutees:', JSON.stringify(newMolecules, null, 2));

} catch (error) {
  console.error('Erreur:', error.message);
}

await connection.end();
