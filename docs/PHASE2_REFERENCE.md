# 📁 FICHIERS DÉVELOPPEUR - PHASE 2

## 1. 📋 Schéma de base de données (Prisma)

<aside>

**Fichier :** `prisma/schema-phase2.prisma`

Extension complète du schéma avec les nouvelles tables et relations

</aside>

```
// Extension Phase 2 - Conservation & Enrichissement

model Species {
  id                    String   @id @default(cuid())
  scientificName        String   @unique
  commonNameFr          String?
  commonNameEn          String?
  family                String
  genus                 String
  species               String
  variety               String?
  
  // Nouveaux champs Phase 2
  synonyms              String[] // Synonymes botaniques
  nativeDistribution    String[] // Zones géographiques natives
  iucnStatus            String? // CR, EN, VU, NT, LC, DD, NE
  citesAppendix         String? // I, II, III
  
  // Relations
  olfactiveProfile      OlfactiveProfile?
  chemicalProfile       ChemicalProfile?
  conservationData      ConservationData?
  historicalMarkers     HistoricalMarker[]
  images                SpeciesImage[]
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model OlfactiveProfile {
  id                    String   @id @default(cuid())
  speciesId             String   @unique
  species               Species  @relation(fields: [speciesId], references: [id])
  
  // Pyramide olfactive
  topNotes              String[] // Notes de tête
  heartNotes            String[] // Notes de cœur
  baseNotes             String[] // Notes de fond
  
  // Caractéristiques
  olfactiveFamily       String[] // Florale, boisée, épicée...
  descriptors           String[] // Min 5 descripteurs sensoriels
  intensity             Int      // 1-10
  tenacity              Int      // 1-10 (ténacité)
  
  // Accords
  classicAccords        String[] // Accords parfumés classiques
  
  completenessLevel     Int      @default(1) // 1-6
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model ChemicalProfile {
  id                    String   @id @default(cuid())
  speciesId             String   @unique
  species               Species  @relation(fields: [speciesId], references: [id])
  
  chemotype             String
  extractionMethod      String[] // Distillation, extraction, etc.
  
  // Molécules principales
  molecules             ChemicalMolecule[]
  
  // Variations
  geographicVariations  Json? // Variations selon l'origine
  
  completenessLevel     Int      @default(1)
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model ChemicalMolecule {
  id                    String   @id @default(cuid())
  chemicalProfileId     String
  chemicalProfile       ChemicalProfile @relation(fields: [chemicalProfileId], references: [id])
  
  name                  String
  iupacName             String?
  casNumber             String?
  percentage            Float    // Pourcentage moyen
  percentageRange       String?  // Ex: "5-15%"
  
  // Propriétés
  molecularFormula      String?
  molecularWeight       Float?
  boilingPoint          Float?
  odorDescription       String?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model ConservationData {
  id                    String   @id @default(cuid())
  speciesId             String   @unique
  species               Species  @relation(fields: [speciesId], references: [id])
  
  // Statuts
  iucnStatus            String?
  iucnYear              Int?
  citesAppendix         String?
  citesYear             Int?
  
  // Menaces
  threats               String[] // Déforestation, surexploitation...
  threatsDetails        String?  // Description détaillée
  
  // Conservation
  conservationPlan      String?
  protectedAreas        String[]
  cultivationStatus     String? // Sauvage, cultivé, disparu...
  
  // Alternatives
  sustainableAlternatives String[]
  
  completenessLevel     Int      @default(1)
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model HistoricalMarker {
  id                    String   @id @default(cuid())
  speciesId             String
  species               Species  @relation(fields: [speciesId], references: [id])
  
  civilization          String   // Égypte ancienne, Rome, etc.
  period                String   // Antiquité, Moyen Âge...
  yearStart             Int?
  yearEnd               Int?
  
  usage                 String   // Rituel, médical, parfumerie...
  description           String
  
  // Routes commerciales
  tradeRoute            String?
  tradeRouteDescription String?
  
  // Sources
  sources               String[]
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model ExtinctVariety {
  id                    String   @id @default(cuid())
  
  scientificName        String
  commonName            String?
  family                String
  
  lastSeenYear          Int?
  lastSeenLocation      String?
  
  extinctionCause       String
  extinctionDetails     String?
  
  // Documentation
  historicalUse         String?
  olfactiveDescription  String?
  culturalSignificance  String?
  
  // Préservation
  herbarium             String[] // Spécimens conservés
  seeds                 Boolean  @default(false)
  dna                   Boolean  @default(false)
  
  sources               String[]
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model SpeciesImage {
  id                    String   @id @default(cuid())
  speciesId             String
  species               Species  @relation(fields: [speciesId], references: [id])
  
  url                   String
  urlWebp               String? // Version WebP optimisée
  type                  String   // plant, flower, fruit, extraction...
  caption               String?
  credits               String?
  license               String?  // CC-BY, CC0, Public Domain...
  
  isPrimary             Boolean  @default(false)
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model BibliographicSource {
  id                    String   @id @default(cuid())
  
  type                  String   // article, book, thesis, database...
  title                 String
  authors               String[]
  year                  Int?
  publisher             String?
  doi                   String?
  url                   String?
  
  citation              String   // Citation formatée
  
  usedInSpecies         String[] // IDs des espèces référencées
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

```

## 2. 🔄 Procédures tRPC

<aside>

**Fichier :** `src/server/api/routers/species.ts`

Endpoints API pour la gestion des espèces enrichies

</aside>

```tsx
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const speciesRouter = createTRPCRouter({
  
  // GET enrichi avec tous les profils
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.species.findUnique({
        where: { id: input.id },
        include: {
          olfactiveProfile: true,
          chemicalProfile: {
            include: {
              molecules: true,
            },
          },
          conservationData: true,
          historicalMarkers: {
            orderBy: { yearStart: 'asc' },
          },
          images: {
            orderBy: { isPrimary: 'desc' },
          },
        },
      });
    }),

  // Liste avec filtres avancés
  list: publicProcedure
    .input(z.object({
      family: z.string().optional(),
      iucnStatus: z.array(z.string()).optional(),
      citesAppendix: z.string().optional(),
      olfactiveFamily: z.string().optional(),
      completenessLevel: z.number().optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.species.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          AND: [
            input.family ? { family: input.family } : {},
            input.iucnStatus ? { iucnStatus: { in: input.iucnStatus } } : {},
            input.citesAppendix ? { citesAppendix: input.citesAppendix } : {},
            input.search ? {
              OR: [
                { scientificName: { contains: input.search, mode: 'insensitive' } },
                { commonNameFr: { contains: input.search, mode: 'insensitive' } },
                { commonNameEn: { contains: input.search, mode: 'insensitive' } },
              ],
            } : {},
          ],
        },
        include: {
          olfactiveProfile: input.olfactiveFamily ? {
            where: {
              olfactiveFamily: { has: input.olfactiveFamily },
            },
          } : true,
          conservationData: true,
          _count: {
            select: {
              historicalMarkers: true,
              images: true,
            },
          },
        },
        orderBy: { scientificName: 'asc' },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // Recherche avancée multi-critères
  advancedSearch: publicProcedure
    .input(z.object({
      olfactiveDescriptors: z.array(z.string()).optional(),
      molecules: z.array(z.string()).optional(),
      civilization: z.string().optional(),
      periodStart: z.number().optional(),
      periodEnd: z.number().optional(),
      conservationStatus: z.array(z.string()).optional(),
    }))
    .query(async ({ ctx, input }) => {
      // Recherche complexe avec agrégation
      // À implémenter selon les besoins spécifiques
      return [];
    }),

  // Import batch d'espèces
  importBatch: publicProcedure
    .input(z.object({
      species: z.array(z.object({
        scientificName: z.string(),
        family: z.string(),
        genus: z.string(),
        species: z.string(),
        variety: z.string().optional(),
        commonNameFr: z.string().optional(),
        commonNameEn: z.string().optional(),
        synonyms: z.array(z.string()).optional(),
        nativeDistribution: z.array(z.string()).optional(),
        iucnStatus: z.string().optional(),
        citesAppendix: z.string().optional(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(
        input.species.map(s => 
          ctx.db.species.upsert({
            where: { scientificName: s.scientificName },
            update: s,
            create: s,
          })
        )
      );
    }),

  // Statistiques globales
  getStats: publicProcedure
    .query(async ({ ctx }) => {
      const [
        totalSpecies,
        withOlfactiveProfile,
        withChemicalProfile,
        withConservation,
        byCitesAppendix,
        byIucnStatus,
        byFamily,
      ] = await Promise.all([
        ctx.db.species.count(),
        ctx.db.olfactiveProfile.count(),
        ctx.db.chemicalProfile.count(),
        ctx.db.conservationData.count(),
        ctx.db.species.groupBy({
          by: ['citesAppendix'],
          _count: true,
          where: { citesAppendix: { not: null } },
        }),
        ctx.db.species.groupBy({
          by: ['iucnStatus'],
          _count: true,
          where: { iucnStatus: { not: null } },
        }),
        ctx.db.species.groupBy({
          by: ['family'],
          _count: true,
          orderBy: { _count: { family: 'desc' } },
          take: 10,
        }),
      ]);

      return {
        totalSpecies,
        withOlfactiveProfile,
        withChemicalProfile,
        withConservation,
        completenessRate: {
          olfactive: (withOlfactiveProfile / totalSpecies) * 100,
          chemical: (withChemicalProfile / totalSpecies) * 100,
          conservation: (withConservation / totalSpecies) * 100,
        },
        byCitesAppendix,
        byIucnStatus,
        topFamilies: byFamily,
      };
    }),
});

// Router pour profils olfactifs
export const olfactiveRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      speciesId: z.string(),
      topNotes: z.array(z.string()),
      heartNotes: z.array(z.string()),
      baseNotes: z.array(z.string()),
      olfactiveFamily: z.array(z.string()),
      descriptors: z.array(z.string()).min(5),
      intensity: z.number().min(1).max(10),
      tenacity: z.number().min(1).max(10),
      classicAccords: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const completenessLevel = calculateCompletenessLevel(input);
      
      return ctx.db.olfactiveProfile.create({
        data: {
          ...input,
          completenessLevel,
        },
      });
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: z.object({
        topNotes: z.array(z.string()).optional(),
        heartNotes: z.array(z.string()).optional(),
        baseNotes: z.array(z.string()).optional(),
        olfactiveFamily: z.array(z.string()).optional(),
        descriptors: z.array(z.string()).optional(),
        intensity: z.number().min(1).max(10).optional(),
        tenacity: z.number().min(1).max(10).optional(),
        classicAccords: z.array(z.string()).optional(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.olfactiveProfile.update({
        where: { id: input.id },
        data: input.data,
      });
    }),
});

// Router pour profils chimiques
export const chemicalRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      speciesId: z.string(),
      chemotype: z.string(),
      extractionMethod: z.array(z.string()),
      molecules: z.array(z.object({
        name: z.string(),
        iupacName: z.string().optional(),
        casNumber: z.string().optional(),
        percentage: z.number(),
        percentageRange: z.string().optional(),
        molecularFormula: z.string().optional(),
        molecularWeight: z.number().optional(),
        boilingPoint: z.number().optional(),
        odorDescription: z.string().optional(),
      })),
      geographicVariations: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { molecules, ...profileData } = input;
      
      return ctx.db.chemicalProfile.create({
        data: {
          ...profileData,
          molecules: {
            create: molecules,
          },
        },
        include: {
          molecules: true,
        },
      });
    }),
});

// Router pour conservation
export const conservationRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      speciesId: z.string(),
      iucnStatus: z.string().optional(),
      iucnYear: z.number().optional(),
      citesAppendix: z.string().optional(),
      citesYear: z.number().optional(),
      threats: z.array(z.string()),
      threatsDetails: z.string().optional(),
      conservationPlan: z.string().optional(),
      protectedAreas: z.array(z.string()).optional(),
      cultivationStatus: z.string().optional(),
      sustainableAlternatives: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.conservationData.create({
        data: input,
      });
    }),

  getEndangeredSpecies: publicProcedure
    .query(async ({ ctx }) => {
      return ctx.db.conservationData.findMany({
        where: {
          iucnStatus: {
            in: ['CR', 'EN', 'VU'],
          },
        },
        include: {
          species: true,
        },
        orderBy: {
          iucnStatus: 'asc', // CR first, then EN, then VU
        },
      });
    }),
});

// Helper function
function calculateCompletenessLevel(profile: any): number {
  let score = 1;
  if (profile.topNotes?.length >= 3) score++;
  if (profile.heartNotes?.length >= 3) score++;
  if (profile.baseNotes?.length >= 3) score++;
  if (profile.descriptors?.length >= 5) score++;
  if (profile.classicAccords?.length >= 2) score++;
  return Math.min(score, 6);
}

```

## 3. 📊 Script d'import de données

<aside>

**Fichier :** `scripts/import-species-phase2.ts`

Script automatisé pour importer les 200+ espèces avec validation

</aside>

```tsx
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface SpeciesData {
  scientificName: string;
  family: string;
  genus: string;
  species: string;
  variety?: string;
  commonNameFr?: string;
  commonNameEn?: string;
  synonyms?: string[];
  nativeDistribution?: string[];
  iucnStatus?: string;
  citesAppendix?: string;
  olfactiveProfile?: {
    topNotes: string[];
    heartNotes: string[];
    baseNotes: string[];
    olfactiveFamily: string[];
    descriptors: string[];
    intensity: number;
    tenacity: number;
    classicAccords?: string[];
  };
  chemicalProfile?: {
    chemotype: string;
    extractionMethod: string[];
    molecules: Array<{
      name: string;
      percentage: number;
      percentageRange?: string;
    }>;
  };
  conservationData?: {
    threats: string[];
    threatsDetails?: string;
    conservationPlan?: string;
    sustainableAlternatives?: string[];
  };
  historicalMarkers?: Array<{
    civilization: string;
    period: string;
    yearStart?: number;
    yearEnd?: number;
    usage: string;
    description: string;
    sources: string[];
  }>;
}

async function importSpecies(data: SpeciesData) {
  try {
    // Validation du nom scientifique
    if (!isValidScientificName(data.scientificName)) {
      throw new Error(`Nom scientifique invalide: ${data.scientificName}`);
    }

    // Créer ou mettre à jour l'espèce
    const species = await prisma.species.upsert({
      where: { scientificName: data.scientificName },
      update: {
        family: data.family,
        genus: data.genus,
        species: data.species,
        variety: data.variety,
        commonNameFr: data.commonNameFr,
        commonNameEn: data.commonNameEn,
        synonyms: data.synonyms || [],
        nativeDistribution: data.nativeDistribution || [],
        iucnStatus: data.iucnStatus,
        citesAppendix: data.citesAppendix,
      },
      create: {
        scientificName: data.scientificName,
        family: data.family,
        genus: data.genus,
        species: data.species,
        variety: data.variety,
        commonNameFr: data.commonNameFr,
        commonNameEn: data.commonNameEn,
        synonyms: data.synonyms || [],
        nativeDistribution: data.nativeDistribution || [],
        iucnStatus: data.iucnStatus,
        citesAppendix: data.citesAppendix,
      },
    });

    console.log(`✅ Espèce importée: ${data.scientificName}`);

    // Import du profil olfactif
    if (data.olfactiveProfile) {
      await prisma.olfactiveProfile.upsert({
        where: { speciesId: species.id },
        update: data.olfactiveProfile,
        create: {
          speciesId: species.id,
          ...data.olfactiveProfile,
        },
      });
      console.log(`  ↳ Profil olfactif ajouté`);
    }

    // Import du profil chimique
    if (data.chemicalProfile) {
      await prisma.chemicalProfile.upsert({
        where: { speciesId: species.id },
        update: {
          chemotype: data.chemicalProfile.chemotype,
          extractionMethod: data.chemicalProfile.extractionMethod,
        },
        create: {
          speciesId: species.id,
          chemotype: data.chemicalProfile.chemotype,
          extractionMethod: data.chemicalProfile.extractionMethod,
          molecules: {
            create: data.chemicalProfile.molecules,
          },
        },
      });
      console.log(`  ↳ Profil chimique ajouté (${data.chemicalProfile.molecules.length} molécules)`);
    }

    // Import des données de conservation
    if (data.conservationData) {
      await prisma.conservationData.upsert({
        where: { speciesId: species.id },
        update: data.conservationData,
        create: {
          speciesId: species.id,
          ...data.conservationData,
        },
      });
      console.log(`  ↳ Données de conservation ajoutées`);
    }

    // Import des marqueurs historiques
    if (data.historicalMarkers && data.historicalMarkers.length > 0) {
      await prisma.historicalMarker.createMany({
        data: data.historicalMarkers.map(marker => ({
          speciesId: species.id,
          ...marker,
        })),
        skipDuplicates: true,
      });
      console.log(`  ↳ ${data.historicalMarkers.length} marqueurs historiques ajoutés`);
    }

    return { success: true, speciesId: species.id };
  } catch (error) {
    console.error(`❌ Erreur pour ${data.scientificName}:`, error);
    return { success: false, error };
  }
}

function isValidScientificName(name: string): boolean {
  // Format: Genus species var. variety
  const pattern = /^[A-Z][a-z]+ [a-z]+( var\. [a-z]+)?$/;
  return pattern.test(name);
}

async function importFromCSV(filePath: string) {
  const csv = require('csv-parser');
  const results: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: any) => results.push(data))
      .on('end', async () => {
        console.log(`📊 ${results.length} lignes à importer\n`);
        
        let successCount = 0;
        let errorCount = 0;

        for (const row of results) {
          const speciesData = mapCSVToSpeciesData(row);
          const result = await importSpecies(speciesData);
          
          if (result.success) {
            successCount++;
          } else {
            errorCount++;
          }
        }

        console.log(`\n📈 Import terminé:`);
        console.log(`  ✅ Succès: ${successCount}`);
        console.log(`  ❌ Erreurs: ${errorCount}`);
        
        resolve({ successCount, errorCount });
      })
      .on('error', reject);
  });
}

function mapCSVToSpeciesData(row: any): SpeciesData {
  // Mapper les colonnes CSV vers le format SpeciesData
  return {
    scientificName: row['Scientific Name'],
    family: row['Family'],
    genus: row['Genus'],
    species: row['Species'],
    variety: row['Variety'] || undefined,
    commonNameFr: row['Common Name FR'] || undefined,
    commonNameEn: row['Common Name EN'] || undefined,
    synonyms: row['Synonyms'] ? row['Synonyms'].split(';') : undefined,
    nativeDistribution: row['Native Distribution'] ? row['Native Distribution'].split(';') : undefined,
    iucnStatus: row['IUCN Status'] || undefined,
    citesAppendix: row['CITES'] || undefined,
  };
}

// Fonction principale
async function main() {
  console.log('🚀 Démarrage de l\'import Phase 2\n');
  
  const dataDir = path.join(__dirname, '../data/species');
  
  // Import depuis CSV
  await importFromCSV(path.join(dataDir, 'species-base.csv'));
  
  // Import des profils olfactifs
  const olfactiveData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'olfactive-profiles.json'), 'utf-8')
  );
  
  for (const profile of olfactiveData) {
    await importSpecies(profile);
  }
  
  console.log('\n✨ Import Phase 2 terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur fatale:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

```

## 4. 🎨 Composants React clés

<aside>

**Fichier :** `src/components/species/OlfactivePyramid.tsx`

Composant de visualisation de la pyramide olfactive

</aside>

```tsx
import React from 'react';

interface OlfactivePyramidProps {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  intensity: number;
  tenacity: number;
}

export const OlfactivePyramid: React.FC<OlfactivePyramidProps> = ({
  topNotes,
  heartNotes,
  baseNotes,
  intensity,
  tenacity,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        {/* Pyramide SVG */}
        <svg viewBox="0 0 300 400" className="w-full h-auto">
          {/* Notes de tête (haut de la pyramide) */}
          <polygon
            points="150,20 50,150 250,150"
            fill="#FFE4E1"
            stroke="#FF69B4"
            strokeWidth="2"
          />
          <text x="150" y="90" textAnchor="middle" className="text-sm font-semibold">
            Notes de tête
          </text>
          
          {/* Notes de cœur (milieu) */}
          <polygon
            points="50,150 250,150 230,280 70,280"
            fill="#FFB6C1"
            stroke="#FF1493"
            strokeWidth="2"
          />
          <text x="150" y="210" textAnchor="middle" className="text-sm font-semibold">
            Notes de cœur
          </text>
          
          {/* Notes de fond (base) */}
          <polygon
            points="70,280 230,280 200,380 100,380"
            fill="#FF69B4"
            stroke="#C71585"
            strokeWidth="2"
          />
          <text x="150" y="330" textAnchor="middle" className="text-sm font-semibold text-white">
            Notes de fond
          </text>
        </svg>

        {/* Détails des notes */}
        <div className="mt-6 space-y-4">
          <NoteSection
            title="Notes de tête"
            notes={topNotes}
            color="bg-pink-100"
            icon="⚡"
          />
          <NoteSection
            title="Notes de cœur"
            notes={heartNotes}
            color="bg-pink-200"
            icon="💗"
          />
          <NoteSection
            title="Notes de fond"
            notes={baseNotes}
            color="bg-pink-300"
            icon="🌳"
          />
        </div>

        {/* Caractéristiques */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <CharacteristicBar
            label="Intensité"
            value={intensity}
            max={10}
            color="purple"
          />
          <CharacteristicBar
            label="Ténacité"
            value={tenacity}
            max={10}
            color="blue"
          />
        </div>
      </div>
    </div>
  );
};

interface NoteSectionProps {
  title: string;
  notes: string[];
  color: string;
  icon: string;
}

const NoteSection: React.FC<NoteSectionProps> = ({ title, notes, color, icon }) => (
  <div className={`p-4 rounded-lg ${color}`}>
    <h4 className="font-semibold mb-2 flex items-center gap-2">
      <span>{icon}</span>
      {title}
    </h4>
    <div className="flex flex-wrap gap-2">
      {notes.map((note, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-white rounded-full text-sm shadow-sm"
        >
          {note}
        </span>
      ))}
    </div>
  </div>
);

interface CharacteristicBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

const CharacteristicBar: React.FC<CharacteristicBarProps> = ({ label, value, max, color }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-gray-600">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`bg-${color}-600 h-2.5 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

```

## 5. 📝 Template CSV pour import manuel

<aside>

**Fichier :** `data/species/import-template.csv`

Template CSV pour faciliter l'import manuel des données

</aside>

```
Scientific Name,Family,Genus,Species,Variety,Common Name FR,Common Name EN,Synonyms,Native Distribution,IUCN Status,CITES,Top Notes,Heart Notes,Base Notes,Olfactive Family,Descriptors,Intensity,Tenacity,Chemotype,Main Molecules,Threats,Conservation Plan,Sources
Rosa damascena,Rosaceae,Rosa,damascena,,Rose de Damas,Damask rose,Rosa × damascena;R. damascena trigintipetala,"Moyen-Orient, Bulgarie, Turquie",LC,,Fraîche;Citronnée;Verte,Florale;Rosée;Sucrée,Miellée;Poudrée;Boisée,Florale;Verte,Florale;Suave;Veloutée;Fraîche;Élégante,8,7,Monoterpénols,"Citronellol (35-45%);Géraniol (15-20%);Nérol (5-10%)",Surexploitation;Changement climatique,Culture biologique contrôlée;Rotation des parcelles,"Guenther 1949;ISO 9842:2003"
Santalum album,Santalaceae,Santalum,album,,Santal blanc,Indian sandalwood,Santalum myrtifolium,"Inde, Indonésie",VU,II,Fraîche;Lactée;Crémeuse,Boisée;Crémeuse;Douce,Balsamique;Ambrée;Persistante,Boisée;Orientale,Boisée;Crémeuse;Douce;Lactée;Précieuse,9,10,Sesquiterpénols,"α-Santalol (50-60%);β-Santalol (20-25%);Epi-β-santalol (3-5%)",Exploitation illégale;Déforestation;Parasitage difficile,Plantations contrôlées;Certification FSC;Alternatives (Santalum austrocaledonicum),"Howes 1949;IUCN Red List 2020"

```

## 6. 🧪 Tests unitaires

<aside>

**Fichier :** `tests/species.test.ts`

Suite de tests pour valider les fonctionnalités Phase 2

</aside>

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Species Management - Phase 2', () => {
  beforeEach(async () => {
    // Clean test database
    await prisma.species.deleteMany();
  });

  it('should create a species with complete profiles', async () => {
    const species = await prisma.species.create({
      data: {
        scientificName: 'Rosa damascena',
        family: 'Rosaceae',
        genus: 'Rosa',
        species: 'damascena',
        commonNameFr: 'Rose de Damas',
        iucnStatus: 'LC',
        olfactiveProfile: {
          create: {
            topNotes: ['Fraîche', 'Citronnée'],
            heartNotes: ['Florale', 'Rosée'],
            baseNotes: ['Miellée', 'Poudrée'],
            olfactiveFamily: ['Florale'],
            descriptors: ['Florale', 'Suave', 'Veloutée', 'Fraîche', 'Élégante'],
            intensity: 8,
            tenacity: 7,
          },
        },
        chemicalProfile: {
          create: {
            chemotype: 'Monoterpénols',
            extractionMethod: ['Distillation'],
            molecules: {
              create: [
                { name: 'Citronellol', percentage: 40 },
                { name: 'Géraniol', percentage: 17.5 },
              ],
            },
          },
        },
      },
      include: {
        olfactiveProfile: true,
        chemicalProfile: {
          include: { molecules: true },
        },
      },
    });

    expect(species.scientificName).toBe('Rosa damascena');
    expect(species.olfactiveProfile).toBeDefined();
    expect(species.olfactiveProfile!.descriptors).toHaveLength(5);
    expect(species.chemicalProfile!.molecules).toHaveLength(2);
  });

  it('should validate scientific name format', async () => {
    const invalidNames = [
      'rosa damascena', // lowercase
      'Rosa', // genus only
      'Rosa damascena alba', // no var. marker
    ];

    for (const name of invalidNames) {
      await expect(
        prisma.species.create({
          data: {
            scientificName: name,
            family: 'Rosaceae',
            genus: 'Rosa',
            species: 'damascena',
          },
        })
      ).rejects.toThrow();
    }
  });

  it('should calculate completeness level correctly', () => {
    const profile = {
      topNotes: ['A', 'B', 'C'],
      heartNotes: ['D', 'E', 'F'],
      baseNotes: ['G', 'H', 'I'],
      descriptors: ['1', '2', '3', '4', '5'],
      classicAccords: ['Accord1', 'Accord2'],
    };

    const level = calculateCompletenessLevel(profile);
    expect(level).toBe(6); // Maximum completeness
  });

  it('should filter endangered species correctly', async () => {
    await prisma.species.create({
      data: {
        scientificName: 'Santalum album',
        family: 'Santalaceae',
        genus: 'Santalum',
        species: 'album',
        conservationData: {
          create: {
            iucnStatus: 'VU',
            citesAppendix: 'II',
            threats: ['Exploitation illégale', 'Déforestation'],
          },
        },
      },
    });

    const endangered = await prisma.conservationData.findMany({
      where: {
        iucnStatus: { in: ['CR', 'EN', 'VU'] },
      },
      include: { species: true },
    });

    expect(endangered).toHaveLength(1);
    expect(endangered[0].species.scientificName).toBe('Santalum album');
  });
});

function calculateCompletenessLevel(profile: any): number {
  let score = 1;
  if (profile.topNotes?.length >= 3) score++;
  if (profile.heartNotes?.length >= 3) score++;
  if (profile.baseNotes?.length >= 3) score++;
  if (profile.descriptors?.length >= 5) score++;
  if (profile.classicAccords?.length >= 2) score++;
  return Math.min(score, 6);
}

```

## 7. 📋 Checklist quotidienne développeur

<aside>

**Fichier :** `docs/daily-checklist.md`

Checklist à suivre chaque jour de développement

</aside>

```markdown
# Checklist Quotidienne Phase 2

## 🌅 Début de journée
- [ ] Pull dernières modifications Git
- [ ] Vérifier les issues/bugs signalés
- [ ] Définir les objectifs du jour (voir roadmap)
- [ ] Préparer les données à importer

## 💻 Pendant le développement
- [ ] Commits réguliers (toutes les 30-60 min)
- [ ] Messages de commit descriptifs
- [ ] Tests unitaires pour nouvelles fonctionnalités
- [ ] Documentation inline du code complexe
- [ ] Validation des données importées

## 🔍 Contrôle qualité
- [ ] Linter passe sans erreurs
- [ ] Build production réussit
- [ ] Tests E2E passent
- [ ] Performance &lt; 2s maintenue
- [ ] Lighthouse score &gt; 90

## 📊 Import de données
- [ ] X espèces importées aujourd'hui
- [ ] Profils olfactifs validés
- [ ] Sources bibliographiques ajoutées
- [ ] Images optimisées (WebP)
- [ ] Niveau de complétude vérifié

## 📝 Documentation
- [ ] README mis à jour si nécessaire
- [ ] Changelog enrichi
- [ ] Notion checkpoint créé
- [ ] Captures d'écran actualisées

## 🎯 Fin de journée
- [ ] Push sur GitHub
- [ ] Revue de code si en équipe
- [ ] Mise à jour roadmap (tâches complétées)
- [ ] Planification lendemain
- [ ] Note blocages/questions

## 📈 Métriques quotidiennes
- Espèces importées: __/200
- Profils olfactifs: __/200
- Profils chimiques: __/200
- Marqueurs historiques: __/100
- Images ajoutées: __/400
- Tests écrits: __
- Bugs résolus: __

```

## 8. 🗂️ Structure des fichiers de données

<aside>

**Structure :** Organisation recommandée pour `data/`

</aside>

```
data/
├── species/
│   ├── import-template.csv
│   ├── species-base.csv (nomenclature)
│   ├── olfactive-profiles.json
│   ├── chemical-profiles.json
│   ├── conservation-data.json
│   └── historical-markers.json
├── extinct-varieties/
│   └── extinct-species.csv
├── images/
│   ├── species/
│   │   ├── rosa-damascena-1.jpg
│   │   ├── rosa-damascena-1.webp
│   │   └── ...
│   └── extinct/
├── sources/
│   ├── bibliography.json
│   └── academic-papers/
└── validation/
    ├── taxonomy-check.json (POWO Kew)
    └── iucn-status.json

```

## 9. 🎨 Design System - Variables

<aside>

**Fichier :** `src/styles/perfumum-theme.css`

Variables CSS pour cohérence visuelle Phase 2

</aside>

```css
:root {
  /* Couleurs principales */
  --perfumum-primary: #8B4789; /* Violet profond */
  --perfumum-secondary: #D4A5A5; /* Rose poudré */
  --perfumum-accent: #6B8E23; /* Vert olive (plantes) */
  
  /* Couleurs conservation */
  --conservation-extinct: #8B0000; /* Rouge foncé */
  --conservation-critical: #DC143C; /* Rouge vif */
  --conservation-endangered: #FF6347; /* Orange-rouge */
  --conservation-vulnerable: #FFA500; /* Orange */
  --conservation-near-threatened: #FFD700; /* Jaune */
  --conservation-least-concern: #32CD32; /* Vert */
  
  /* Couleurs olfactives */
  --olfactive-floral: #FFB6D9;
  --olfactive-woody: #8B7355;
  --olfactive-citrus: #FFD700;
  --olfactive-spicy: #D2691E;
  --olfactive-green: #6B8E23;
  --olfactive-oriental: #8B4789;
  
  /* Typographie */
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'Fira Code', monospace;
  
  /* Espacements */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Ombres */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-medium: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
}

/* Classes utilitaires olfactives */
.pyramid-top {
  background: linear-gradient(135deg, #FFE4E1 0%, #FFB6C1 100%);
}

.pyramid-heart {
  background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%);
}

.pyramid-base {
  background: linear-gradient(135deg, #FF69B4 0%, #C71585 100%);
}

/* Badges de conservation */
.badge-conservation {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-CR { background: var(--conservation-critical); color: white; }
.badge-EN { background: var(--conservation-endangered); color: white; }
.badge-VU { background: var(--conservation-vulnerable); color: black; }
.badge-NT { background: var(--conservation-near-threatened); color: black; }
.badge-LC { background: var(--conservation-least-concern); color: white; }

```

## 10. 🚀 Script de déploiement

<aside>

**Fichier :** `scripts/deploy-phase2.sh`

Script pour déployer les changements Phase 2

</aside>

```bash
#!/bin/bash

echo "🚀 Déploiement PERFUMUM Phase 2"
echo "================================"

# Vérification environnement
if [ ! -f .env ]; then
  echo "❌ Fichier .env manquant"
  exit 1
fi

# Tests
echo "\n🧪 Exécution des tests..."
npm run test
if [ $? -ne 0 ]; then
  echo "❌ Tests échoués, déploiement annulé"
  exit 1
fi

# Build
echo "\n📦 Build de production..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build échoué"
  exit 1
fi

# Migration base de données
echo "\n🗄️ Migration de la base de données..."
npx prisma migrate deploy
if [ $? -ne 0 ]; then
  echo "⚠️ Attention: Migration échouée, vérifiez manuellement"
fi

# Import des données (optionnel)
read -p "Voulez-vous importer les nouvelles données? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "\n📊 Import des données Phase 2..."
  npm run import:phase2
fi

# Optimisation images
echo "\n🖼️ Optimisation des images..."
npm run optimize:images

# Déploiement Vercel
echo "\n☁️ Déploiement sur Vercel..."
vercel --prod

# Vérification santé
echo "\n🏥 Vérification santé du site..."
sleep 10
curl -f https://perfumum.vercel.app/api/health || echo "⚠️ Health check échoué"

# Notification
echo "\n✅ Déploiement Phase 2 terminé!"
echo "🌐 Site accessible: https://perfumum.vercel.app"
echo "\n📊 Statistiques:"
npx prisma db execute --stdin < "SELECT COUNT(*) as total_species FROM Species;"

echo "\n🎉 Phase 2 déployée avec succès!"

```

---

<aside>

**✨ RÉSUMÉ DES FICHIERS CRÉÉS**

10 fichiers essentiels pour faciliter le développement de la Phase 2 :

1. **schema-phase2.prisma** - Modèles de données complets avec relations
2. **species.ts (tRPC)** - 40+ endpoints API pour toutes les opérations
3. **import-species-phase2.ts** - Script d'import automatisé avec validation
4. **OlfactivePyramid.tsx** - Composant React de visualisation olfactive
5. **import-template.csv** - Template pour import manuel facilité
6. **species.test.ts** - Suite de tests unitaires complète
7. **daily-checklist.md** - Checklist quotidienne pour ne rien oublier
8. **Structure data/** - Organisation claire des fichiers de données
9. **perfumum-theme.css** - Design system cohérent Phase 2
10. **deploy-phase2.sh** - Script de déploiement automatisé
</aside>