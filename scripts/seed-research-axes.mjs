/**
 * Script pour pré-remplir les axes de recherche par défaut
 * Usage: node scripts/seed-research-axes.mjs
 */

import mysql from 'mysql2/promise';

const defaultAxes = [
  {
    axisCode: 'AX1',
    name: 'Chimie olfactive',
    subtitle: 'Analyse moléculaire et synthèse',
    description: 'Étude des molécules odorantes, de leur structure chimique et de leurs propriétés olfactives. Inclut la synthèse de nouvelles molécules et l\'analyse des compositions naturelles.',
    objectives: 'Comprendre les relations structure-odeur, identifier de nouvelles molécules, développer des méthodes d\'analyse avancées.',
    methodology: 'GC-MS, spectroscopie, synthèse organique, modélisation moléculaire.',
    category: 'fondamental',
    status: 'en_cours',
    priority: 'haute',
    progressPercent: 30,
    color: '#3b82f6', // blue
    icon: 'beaker',
  },
  {
    axisCode: 'AX2',
    name: 'Ethnobotanique',
    subtitle: 'Savoirs traditionnels et usages culturels',
    description: 'Documentation des savoirs traditionnels liés aux plantes aromatiques et aux pratiques olfactives dans différentes cultures.',
    objectives: 'Préserver les savoirs ancestraux, documenter les usages traditionnels, établir des liens entre cultures et parfums.',
    methodology: 'Enquêtes de terrain, entretiens, analyse documentaire, collaboration avec les communautés locales.',
    category: 'ethnographique',
    status: 'en_cours',
    priority: 'haute',
    progressPercent: 25,
    color: '#10b981', // green
    icon: 'map',
  },
  {
    axisCode: 'AX3',
    name: 'Histoire de la parfumerie',
    subtitle: 'Évolution des pratiques et des techniques',
    description: 'Recherche historique sur l\'évolution de la parfumerie, des techniques d\'extraction et des usages des parfums à travers les époques.',
    objectives: 'Retracer l\'histoire des parfums, comprendre l\'évolution des techniques, identifier les influences culturelles.',
    methodology: 'Recherche archivistique, analyse de textes anciens, reconstitution de formules historiques.',
    category: 'historique',
    status: 'en_cours',
    priority: 'moyenne',
    progressPercent: 20,
    color: '#f59e0b', // amber
    icon: 'history',
  },
  {
    axisCode: 'AX4',
    name: 'Extraction et transformation',
    subtitle: 'Techniques et innovations',
    description: 'Développement et optimisation des méthodes d\'extraction des matières premières aromatiques, incluant les techniques traditionnelles et innovantes.',
    objectives: 'Améliorer les rendements, développer des méthodes durables, préserver la qualité olfactive.',
    methodology: 'Hydrodistillation, extraction CO2 supercritique, enfleurage, extraction par solvant.',
    category: 'technique',
    status: 'en_cours',
    priority: 'haute',
    progressPercent: 35,
    color: '#8b5cf6', // violet
    icon: 'wrench',
  },
  {
    axisCode: 'AX5',
    name: 'Formulation créative',
    subtitle: 'Art de la composition',
    description: 'Recherche sur les principes de composition olfactive, les accords, les synergies et l\'art de créer des parfums.',
    objectives: 'Développer de nouvelles approches créatives, comprendre les synergies moléculaires, créer des compositions innovantes.',
    methodology: 'Expérimentation olfactive, analyse sensorielle, études de perception.',
    category: 'applique',
    status: 'en_cours',
    priority: 'haute',
    progressPercent: 40,
    color: '#ec4899', // pink
    icon: 'lightbulb',
  },
  {
    axisCode: 'AX6',
    name: 'Neurologie olfactive',
    subtitle: 'Perception et cognition',
    description: 'Étude des mécanismes neurologiques de la perception olfactive, de la mémoire olfactive et des émotions liées aux odeurs.',
    objectives: 'Comprendre les mécanismes de perception, étudier la mémoire olfactive, explorer les liens odeur-émotion.',
    methodology: 'Études comportementales, imagerie cérébrale, psychophysique.',
    category: 'fondamental',
    status: 'planifie',
    priority: 'moyenne',
    progressPercent: 10,
    color: '#06b6d4', // cyan
    icon: 'brain',
  },
  {
    axisCode: 'AX7',
    name: 'Durabilité et éthique',
    subtitle: 'Approvisionnement responsable',
    description: 'Recherche sur les pratiques durables dans la parfumerie, la conservation des espèces, et l\'éthique de l\'approvisionnement.',
    objectives: 'Développer des alternatives durables, protéger les espèces menacées, promouvoir le commerce équitable.',
    methodology: 'Analyse de cycle de vie, études d\'impact, partenariats avec producteurs.',
    category: 'applique',
    status: 'en_cours',
    priority: 'haute',
    progressPercent: 15,
    color: '#22c55e', // green-500
    icon: 'leaf',
  },
  {
    axisCode: 'AX8',
    name: 'Tabac et Cannabis',
    subtitle: 'Recherche spécialisée',
    description: 'Étude approfondie des profils aromatiques du tabac et du cannabis, de leurs terpènes et de leurs applications en parfumerie.',
    objectives: 'Documenter les profils terpéniques, explorer les synergies, développer des applications innovantes.',
    methodology: 'Analyse GC-MS, études sensorielles, formulation expérimentale.',
    category: 'experimental',
    status: 'en_cours',
    priority: 'moyenne',
    progressPercent: 45,
    color: '#84cc16', // lime
    icon: 'cannabis',
  },
  {
    axisCode: 'AX9',
    name: 'Terroirs et origines',
    subtitle: 'Géographie olfactive',
    description: 'Recherche sur l\'influence du terroir sur les profils aromatiques des plantes, cartographie des origines et des qualités.',
    objectives: 'Cartographier les terroirs olfactifs, comprendre l\'influence du climat et du sol, valoriser les origines.',
    methodology: 'Analyse comparative, études de terrain, collaboration avec producteurs.',
    category: 'applique',
    status: 'en_cours',
    priority: 'moyenne',
    progressPercent: 20,
    color: '#d97706', // amber-600
    icon: 'globe',
  },
  {
    axisCode: 'AX10',
    name: 'Méthodologie de recherche',
    subtitle: 'Outils et protocoles',
    description: 'Développement de méthodologies et protocoles de recherche spécifiques à l\'étude olfactive.',
    objectives: 'Standardiser les méthodes, développer de nouveaux outils, améliorer la reproductibilité.',
    methodology: 'Développement de protocoles, validation, documentation.',
    category: 'technique',
    status: 'en_cours',
    priority: 'moyenne',
    progressPercent: 50,
    color: '#64748b', // slate
    icon: 'clipboard',
  },
];

async function seedResearchAxes() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('🌱 Seeding research axes...');
  
  let created = 0;
  let skipped = 0;
  
  for (const axis of defaultAxes) {
    try {
      // Check if axis already exists
      const [existing] = await connection.execute(
        'SELECT id FROM research_axes WHERE axis_code = ?',
        [axis.axisCode]
      );
      
      if (existing.length > 0) {
        console.log(`  ⏭️  ${axis.axisCode} already exists, skipping`);
        skipped++;
        continue;
      }
      
      // Insert new axis
      await connection.execute(
        `INSERT INTO research_axes (
          axis_code, name, subtitle, description, objectives, methodology,
          category, status, priority, progress_percent, color, icon,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          axis.axisCode,
          axis.name,
          axis.subtitle,
          axis.description,
          axis.objectives,
          axis.methodology,
          axis.category,
          axis.status,
          axis.priority,
          axis.progressPercent,
          axis.color,
          axis.icon,
        ]
      );
      
      console.log(`  ✅ Created ${axis.axisCode}: ${axis.name}`);
      created++;
    } catch (error) {
      console.error(`  ❌ Error creating ${axis.axisCode}:`, error.message);
    }
  }
  
  await connection.end();
  
  console.log(`\n📊 Summary: ${created} created, ${skipped} skipped`);
}

seedResearchAxes().catch(console.error);
