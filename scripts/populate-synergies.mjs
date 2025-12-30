import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Matrice de synergies entre les 7 terpènes
// Score: 0-30=rouge (incompatible), 31-70=jaune (neutre), 71-100=vert (excellente synergie)
const synergies = [
  // Myrcène (1) - Relaxant, terreux, musqué
  { t1: 1, t2: 2, score: 75, notes: "Myrcène + Limonène : Synergie relaxante et énergisante, équilibre terre-agrume" },
  { t1: 1, t2: 3, score: 80, notes: "Myrcène + α-Pinène : Excellente synergie forêt-mousse, profondeur terreuse" },
  { t1: 1, t2: 4, score: 70, notes: "Myrcène + β-Pinène : Bonne synergie herbacée, notes vertes et terreuses" },
  { t1: 1, t2: 5, score: 85, notes: "Myrcène + β-Caryophyllène : Synergie exceptionnelle, profondeur épicée-terreuse" },
  { t1: 1, t2: 6, score: 65, notes: "Myrcène + Linalool : Synergie relaxante florale-terreuse, légèrement contradictoire" },
  { t1: 1, t2: 7, score: 90, notes: "Myrcène + Humulène : Synergie parfaite boisée-terreuse, profondeur maximale" },
  
  // Limonène (2) - Frais, agrume, énergisant
  { t1: 2, t2: 3, score: 80, notes: "Limonène + α-Pinène : Excellente synergie fraîcheur agrume-pin, vivifiante" },
  { t1: 2, t2: 4, score: 75, notes: "Limonène + β-Pinène : Bonne synergie fraîche, notes vertes et citronnées" },
  { t1: 2, t2: 5, score: 45, notes: "Limonène + β-Caryophyllène : Synergie neutre, contraste frais-épicé" },
  { t1: 2, t2: 6, score: 85, notes: "Limonène + Linalool : Excellente synergie florale-agrume, fraîcheur sucrée" },
  { t1: 2, t2: 7, score: 40, notes: "Limonène + Humulène : Synergie faible, contraste frais-terreux trop marqué" },
  
  // α-Pinène (3) - Frais, résineux, forestier
  { t1: 3, t2: 4, score: 90, notes: "α-Pinène + β-Pinène : Synergie parfaite pinènes, forêt de conifères authentique" },
  { t1: 3, t2: 5, score: 70, notes: "α-Pinène + β-Caryophyllène : Bonne synergie boisée-épicée, profondeur forestière" },
  { t1: 3, t2: 6, score: 60, notes: "α-Pinène + Linalool : Synergie modérée, contraste résineux-floral" },
  { t1: 3, t2: 7, score: 75, notes: "α-Pinène + Humulène : Bonne synergie boisée, notes forestières profondes" },
  
  // β-Pinène (4) - Frais, herbacé, vert
  { t1: 4, t2: 5, score: 65, notes: "β-Pinène + β-Caryophyllène : Synergie modérée, herbacé-épicé" },
  { t1: 4, t2: 6, score: 70, notes: "β-Pinène + Linalool : Bonne synergie fraîche-florale, notes vertes douces" },
  { t1: 4, t2: 7, score: 70, notes: "β-Pinène + Humulène : Bonne synergie herbacée-boisée, profondeur verte" },
  
  // β-Caryophyllène (5) - Épicé, piquant, boisé
  { t1: 5, t2: 6, score: 35, notes: "β-Caryophyllène + Linalool : Synergie faible, contraste épicé-floral trop fort" },
  { t1: 5, t2: 7, score: 95, notes: "β-Caryophyllène + Humulène : Synergie exceptionnelle épicée-boisée, profondeur maximale" },
  
  // Linalool (6) - Doux, floral, calmant
  { t1: 6, t2: 7, score: 50, notes: "Linalool + Humulène : Synergie neutre, contraste floral-terreux modéré" }
];

console.log('🔗 Peuplement de la matrice de synergies terpéniques...\n');

for (const syn of synergies) {
  const [result] = await connection.execute(
    `INSERT INTO terpene_synergies (terpene1_id, terpene2_id, compatibility_score, synergy_notes)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE 
       compatibility_score = VALUES(compatibility_score),
       synergy_notes = VALUES(synergy_notes)`,
    [syn.t1, syn.t2, syn.score, syn.notes]
  );
  
  const color = syn.score >= 71 ? '🟢' : syn.score >= 31 ? '🟡' : '🔴';
  console.log(`${color} Terpène ${syn.t1} + Terpène ${syn.t2} : Score ${syn.score}/100`);
}

console.log(`\n✨ ${synergies.length} synergies créées avec succès!`);
console.log(`   🟢 Excellente synergie (71-100): ${synergies.filter(s => s.score >= 71).length}`);
console.log(`   🟡 Synergie neutre (31-70): ${synergies.filter(s => s.score >= 31 && s.score < 71).length}`);
console.log(`   🔴 Synergie faible (0-30): ${synergies.filter(s => s.score < 31).length}`);

await connection.end();
