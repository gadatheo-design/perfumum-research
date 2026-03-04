/**
 * Batch 7 new : 11 molécules absentes pour atteindre 35%
 * Ciblage : molécules importantes non encore dans la base
 */
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Molécules confirmées absentes de la base
const mols = [
  ['Thymoquinone', 'C10H12O2', 'quinone', ['antibacterien puissant', 'antifongique', 'anti-inflammatoire', 'anticancereux', 'antioxydant'], 'Epice, herbace, legerement amer', 'Nigella sativa (Cumin noir)'],
  ['Diosgenin', 'C27H42O3', 'saponine', ['anti-inflammatoire', 'oestrogénique', 'anticancereux etudes', 'hypocholesterolemiant'], 'Inodore', 'Dioscorea villosa, Trigonella foenum-graecum'],
  ['Gingerol', 'C17H26O4', 'phenol', ['anti-inflammatoire', 'antinauseeux', 'antibacterien', 'antioxydant', 'thermogenique'], 'Gingembre frais, epice, piquant', 'Zingiber officinale'],
  ['Shogaol', 'C17H24O3', 'phenol', ['anti-inflammatoire', 'anticancereux etudes', 'neuroprotecteur', 'antinauseeux'], 'Gingembre sec, epice, piquant', 'Zingiber officinale (gingembre seche)'],
  ['Paradol', 'C17H26O3', 'phenol', ['anti-inflammatoire', 'antibacterien', 'antioxydant', 'thermogenique'], 'Epice, piquant, poivron', 'Aframomum melegueta (Maniguette)'],
  ['Zingerone', 'C11H14O3', 'phenol', ['anti-inflammatoire', 'antibacterien', 'antioxydant', 'carminatif'], 'Gingembre cuit, doux, epice', 'Zingiber officinale (cuisson)'],
  ['Piperine', 'C17H19NO3', 'alcaloide', ['antibacterien', 'anti-inflammatoire', 'biodisponibilite (augmente absorption)', 'thermogenique'], 'Poivre, epice, piquant, chaud', 'Piper nigrum, Piper longum'],
  ['Solanine', 'C45H73NO15', 'alcaloide', ['toxique (haute dose)', 'antibacterien', 'antifongique'], 'Inodore', 'Solanum tuberosum, Solanum lycopersicum'],
  ['Tomatine', 'C50H83NO21', 'alcaloide', ['antibacterien', 'antifongique', 'anticancereux etudes'], 'Inodore', 'Solanum lycopersicum'],
  ['Allicin', 'C6H10OS2', 'organosulfure', ['antibacterien puissant', 'antifongique', 'antiviral', 'anticancereux etudes', 'cardioprotecteur'], 'Ail frais, soufre, piquant', 'Allium sativum'],
  ['Alliin', 'C6H11NO3S', 'organosulfure', ['antibacterien', 'antifongique', 'cardioprotecteur'], 'Ail, soufre', 'Allium sativum'],
];

let created = 0;
for (const [name, formula, fam, props, olf, src] of mols) {
  const [existing] = await conn.execute('SELECT id FROM molecules WHERE name = ? LIMIT 1', [name]);
  if (existing.length > 0) { continue; }
  await conn.execute(
    'INSERT INTO molecules (name, formula, chemicalFamily, therapeuticProperties, olfactiveProfile, botanicalSources, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [name, formula, fam, JSON.stringify(props), olf, src]
  );
  console.log('  + ' + name);
  created++;
}

const [[row]] = await conn.execute("SELECT COUNT(*) as total, SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '[]' AND therapeuticProperties != '' THEN 1 ELSE 0 END) as wt FROM molecules");
console.log('Batch 7 new: ' + created + ' creees');
console.log('Couverture: ' + row.wt + '/' + row.total + ' (' + (row.wt/row.total*100).toFixed(1) + '%)');
await conn.end();
