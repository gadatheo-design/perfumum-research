import { getDb } from './server/db.ts';

const plantData = [
  { name: 'Menthe Poivrée', family: 'Lamiaceae', category: 'Herb', origin: 'Europe' },
  { name: 'Lavande', family: 'Lamiaceae', category: 'Herb', origin: 'Mediterranean' },
  { name: 'Thym', family: 'Lamiaceae', category: 'Herb', origin: 'Mediterranean' },
  { name: 'Rose', family: 'Rosaceae', category: 'Flower', origin: 'Asia' },
  { name: 'Jasmin', family: 'Oleaceae', category: 'Flower', origin: 'Asia' },
  { name: 'Tabac', family: 'Solanaceae', category: 'Leaf', origin: 'Americas' },
  { name: 'Cannabis', family: 'Cannabaceae', category: 'Leaf', origin: 'Central Asia' },
  { name: 'Vanille', family: 'Orchidaceae', category: 'Fruit', origin: 'Madagascar' },
  { name: 'Poivre', family: 'Piperaceae', category: 'Fruit', origin: 'India' },
  { name: 'Cannelle', family: 'Lauraceae', category: 'Bark', origin: 'Sri Lanka' },
  { name: 'Coriandre', family: 'Apiaceae', category: 'Seed', origin: 'Mediterranean' },
  { name: 'Anis', family: 'Apiaceae', category: 'Seed', origin: 'Mediterranean' },
  { name: 'Gingembre', family: 'Zingiberaceae', category: 'Root', origin: 'Asia' },
  { name: 'Curcuma', family: 'Zingiberaceae', category: 'Root', origin: 'Asia' },
  { name: 'Sauge', family: 'Lamiaceae', category: 'Herb', origin: 'Mediterranean' },
  { name: 'Camomille', family: 'Asteraceae', category: 'Flower', origin: 'Europe' },
  { name: 'Cèdre', family: 'Pinaceae', category: 'Wood', origin: 'Mediterranean' },
  { name: 'Santal', family: 'Santalaceae', category: 'Wood', origin: 'India' },
  { name: 'Vétiver', family: 'Poaceae', category: 'Root', origin: 'India' },
  { name: 'Patchouli', family: 'Lamiaceae', category: 'Leaf', origin: 'Indonesia' },
];

async function seed() {
  const db = await getDb();
  if (!db) {
    console.error('Database connection failed');
    process.exit(1);
  }

  console.log('Seeding plants table...');
  for (const plant of plantData) {
    try {
      await db.execute(
        `INSERT INTO plants (name, family, category, origin) VALUES (?, ?, ?, ?)`,
        [plant.name, plant.family, plant.category, plant.origin]
      );
      console.log(`✓ Added ${plant.name}`);
    } catch (error) {
      console.error(`✗ Failed to add ${plant.name}:`, error);
    }
  }
  console.log('Seeding complete!');
}

seed().catch(console.error);
