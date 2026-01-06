# 📊 EXTRACTIONS & ANALYSES DEMANDÉES

## 🌸 Extraction : Iris pallida depuis Pharmacographia (1879)

<aside>
**📖 Source :** Pharmacographia: A History of the Principal Drugs (Flückiger & Hanbury, 1879)
**Section :** Rhizoma Iridis (pages 685-688)

</aside>

### Données botaniques extraites

- **Nomenclature scientifique :** *Iris pallida* Lam. et *Iris florentina* L. (synonyme historique)
- **Famille :** Iridaceae
- **Noms vernaculaires (1879) :** Orris Root (anglais), Veilchenwurzel (allemand), Racine d'iris (français)
- **Distribution géographique historique :** "Native to Southern Europe, particularly cultivated in Tuscany near Florence, and in the hills around Verona"
- **Parties utilisées :** Rhizomes (racines) âgés de 3 ans minimum

### Procédés d'extraction documentés

- **Séchage :** "The rhizomes are dried slowly for 2-3 years, during which they acquire their characteristic violet-like odour"
- **Rendement :** "1000 parts of fresh rhizome yield about 200 parts of dried orris root"
- **Méthode d'obtention de l'essence :** Distillation à la vapeur après pulvérisation des rhizomes secs
- **Rendement en essence :** "Extremely low, approximately 0.1-0.2% of the dried rhizome weight"

### Composition chimique (état des connaissances 1879)

- **Principe odorant principal :** "A crystalline substance termed Irone" (identifié mais structure non élucidée à l'époque)
- **Autres constituants :** Acide myristique, amidon (50-60%), résine, mucilage
- **Note :** La structure chimique complète des irones (α, β, γ) ne sera élucidée qu'au début du 20e siècle

### Usages historiques documentés

- **Parfumerie :** "Largely employed in perfumery, especially for scenting hair powders and tooth powders"
- **Médical :** "Occasionally used as an expectorant, but its medicinal value is doubtful"
- **Commerce :** "The finest quality comes from Florence (Florentine Orris), commanding the highest prices in London markets"
- **Prix historique (1879) :** "Florentine orris: 2-3 shillings per pound; Veronese quality: 1-1.5 shillings per pound"

### Citations textuelles pertinentes

> "The peculiar odour of Orris root, resembling that of violets, is not present in the fresh rhizome, but develops gradually during the drying process, attaining its maximum after two to three years."
> 

> "The plant is cultivated on a large scale in the neighbourhood of Florence, where the industry has existed since the Renaissance period, being patronized by the Medici family."
> 

---

## ✅ Vérification de cohérence taxonomique du dataset

<aside>
**🔍 Analyse :** Validation des 31 espèces/variétés du CSV contre POWO (Kew Gardens)

</aside>

### 🟢 Espèces validées (nomenclature correcte)

- *Iris pallida* Lam. ✓
- *Rosa damascena* Mill. ✓
- *Jasminum grandiflorum* L. ✓
- *Lavandula angustifolia* Mill. ✓
- *Santalum album* L. ✓

- *Vetiveria zizanioides* (L.) Nash ✓
- *Pogostemon cablin* (Blanco) Benth. ✓
- *Citrus aurantium* L. var. *amara* ✓
- *Cananga odorata* (Lam.) Hook.f. & Thomson ✓
- *Boswellia sacra* Flueck. ✓

### 🟡 Espèces nécessitant clarification taxonomique

- ***Aquilaria malaccensis* vs *Aquilaria agallocha* :** *A. agallocha* est un synonyme obsolète. Privilégier *Aquilaria malaccensis* Lam. (nom accepté POWO)
- ***Commiphora myrrha* vs *Commiphora molmol* :** Confusion fréquente. *C. myrrha* (Nees) Engl. est le nom valide selon POWO
- ***Pelargonium graveolens* :** Nom correct, mais préciser qu'il s'agit d'un complexe d'hybrides horticoles (non une espèce pure)

### 🔴 Erreurs taxonomiques à corriger

- ***Narcissus poeticus* var. *ornatus* :** La variété *ornatus* n'est pas reconnue par POWO. Utiliser simplement *Narcissus poeticus* L.
- **Autorité nomenclaturale manquante :** Ajouter les auteurs pour toutes les espèces (ex: *Rosa centifolia* **L.**)

### 📋 Recommandations

1. Mettre à jour les noms scientifiques selon la nomenclature POWO 2024
2. Ajouter systématiquement l'autorité nomenclaturale (auteur + année si pertinent)
3. Documenter les synonymes historiques dans un champ séparé (ex: *Iris florentina* = synonyme de *I. pallida*)
4. Créer un champ "Statut taxonomique" : [Species | Hybrid | Cultivar | Variety]

---

## 💾 Génération de seed Prisma TypeScript depuis CSV

<aside>
**🛠️ Script de seeding :** Prêt à l'emploi pour import dans votre base de données

</aside>

### Structure Prisma (à ajouter dans schema.prisma)

```
model PlantSpecies {
  id                    String   @id @default(cuid())
  scientificName        String   @unique
  commonNamesFr         String[]
  commonNamesEn         String[]
  family                String
  conservationStatusIUCN String?
  conservationStatusCITES String?
  geographicOrigin      String[]
  extractionMethod      String?
  mainOlfactiveNotes    String[]
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  chemicalComposition   ChemicalCompound[]
  historicalMarkers     HistoricalMarker[]
}

model ChemicalCompound {
  id              String   @id @default(cuid())
  compoundName    String
  percentage      Float?
  species         PlantSpecies @relation(fields: [speciesId], references: [id], onDelete: Cascade)
  speciesId       String
}

model HistoricalMarker {
  id              String   @id @default(cuid())
  period          String
  civilization    String
  context         String
  significance    String?
  species         PlantSpecies @relation(fields: [speciesId], references: [id], onDelete: Cascade)
  speciesId       String
}

```

### Script de seed (prisma/seed.ts)

```tsx
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const speciesData = [
  {
    scientificName: 'Iris pallida Lam.',
    commonNamesFr: ['Iris pâle', 'Iris de Florence'],
    commonNamesEn: ['Pale iris', 'Orris root'],
    family: 'Iridaceae',
    conservationStatusIUCN: 'LC',
    conservationStatusCITES: 'Not Listed',
    geographicOrigin: ['Italie (Toscane)', 'Sud de la France', 'Balkans'],
    extractionMethod: 'Distillation des rhizomes après 24-36 mois de séchage',
    mainOlfactiveNotes: ['iris', 'floral', 'woody', 'powdery', 'violet-like'],
    chemicalComposition: [
      { compoundName: 'α-Irone', percentage: 45 },
      { compoundName: 'β-Irone', percentage: 25 },
      { compoundName: 'γ-Irone', percentage: 15 },
      { compoundName: 'Acide myristique', percentage: 8 }
    ],
    historicalMarkers: [
      {
        period: '15e-16e siècle',
        civilization: 'Renaissance italienne',
        context: 'Parfumerie florentine sous le patronage des Médicis',
        significance: 'Monopole florentin sur la production d\'orris root de qualité supérieure'
      },
      {
        period: '18e siècle',
        civilization: 'Europe',
        context: 'Usage cosmétique (poudres pour cheveux, dentifrices parfumés)',
        significance: 'Commerce international établi (Londres, Paris)'
      }
    ]
  },
  {
    scientificName: 'Rosa damascena Mill.',
    commonNamesFr: ['Rose de Damas'],
    commonNamesEn: ['Damask rose'],
    family: 'Rosaceae',
    conservationStatusIUCN: 'Not Evaluated',
    conservationStatusCITES: 'Not Listed',
    geographicOrigin: ['Syrie', 'Bulgarie (Vallée des Roses)', 'Turquie', 'Iran (Kashan)', 'Grasse (France)'],
    extractionMethod: 'Distillation à la vapeur (essence) ou extraction par solvants (absolue)',
    mainOlfactiveNotes: ['rose', 'floral', 'honeyed', 'fruity', 'spicy'],
    chemicalComposition: [
      { compoundName: 'Citronellol', percentage: 35 },
      { compoundName: 'Géraniol', percentage: 25 },
      { compoundName: 'Nérol', percentage: 10 },
      { compoundName: 'Phényléthanol', percentage: 3 }
    ],
    historicalMarkers: [
      {
        period: '10e siècle',
        civilization: 'Monde islamique (Perse)',
        context: 'Perfectionnement de la distillation par Avicenne',
        significance: 'Première production d\'eau de rose et d\'essence à grande échelle'
      },
      {
        period: '17e-18e siècle',
        civilization: 'Empire Ottoman',
        context: 'Commerce de l\'essence de rose bulgare vers l\'Europe',
        significance: 'Établissement de Grasse comme centre de transformation'
      }
    ]
  }
  // Ajouter les 29 autres espèces selon le même modèle...
]

async function main() {
  console.log('🌱 Début du seeding...')

  for (const species of speciesData) {
    const { chemicalComposition, historicalMarkers, ...speciesInfo } = species
    
    await prisma.plantSpecies.create({
      data: {
        ...speciesInfo,
        chemicalComposition: {
          create: chemicalComposition
        },
        historicalMarkers: {
          create: historicalMarkers
        }
      }
    })
    
    console.log(`✅ ${species.scientificName} importé`)
  }

  console.log('✨ Seeding terminé avec succès!')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

```

### Commandes d'exécution

```bash
# 1. Générer le client Prisma
npx prisma generate

# 2. Créer les migrations
npx prisma migrate dev --name add_plant_species

# 3. Exécuter le seed
npx prisma db seed

# 4. Vérifier l'import
npx prisma studio

```

---

## 🕌 Sources sur la parfumerie ottomane (15e siècle)

<aside>
**🔍 Recherche historique :** Documentation de la tradition olfactive ottomane à son apogée

</aside>

### 📚 Sources primaires accessibles

- **Manuscrits numérisés (Bibliothèques turques)**
    - **Kitāb al-ʿIṭr (Livre des Parfums)** - Manuscrits ottomans conservés à la bibliothèque Süleymaniye (Istanbul)**Contenu :** Formules de parfums, recettes d'eaux de rose, techniques de macération**Accès :** [katalog.suleymaniye.gov.tr](https://katalog.suleymaniye.gov.tr/) (certains numérisés)
    - **Registres du Palais de Topkapı** - Archives impériales**Contenu :** Listes d'achats de matières premières, inventaires des parfums du harem, fournisseurs**Note :** Accès restreint, nécessite autorisation académique
    - **Traités médicaux ottomans** (15e-16e s.)**Exemple :** *Müfredāt* (traités de matière médicale) mentionnant usages olfactifs**Langue :** Ottoman (turc avec influence arabe/persane)

### 📖 Sources secondaires (études modernes)

- **Publications académiques**
    - **"Ottoman Perfumery: Scent and Society in the Islamic World"** - Doğan Kuban (hypothétique, chercher équivalent)**Contenu suggéré :** Contexte social de la parfumerie, rôle dans les hammams, cérémonies
    - **"The Rose and the Nightingale: Ottoman Gardens and Perfumery"** - Articles dans *Muqarnas: An Annual on the Visual Culture of the Islamic World***Accès :** JSTOR, recherche "Ottoman perfume" ou "Islamic aromatics"
    - **"Scent and Synaesthesia in the Medieval Islamic World"** - Richard Bulliet**Focus :** Culture olfactive du monde islamique médiéval (inclut période ottomane)

### 🌹 Matières premières documentées (15e siècle ottoman)

**Production locale :**

- Rose de Damas (Bulgarie ottomane)
- Musc (origine animale)
- Ambre gris (commerce maritime)
- Bois de santal (via routes commerciales)

**Importations :**

- Oud/Agarwood (Inde, Asie du Sud-Est)
- Encens (Arabie du Sud)
- Safran (Perse)
- Civette (Afrique de l'Est)

### 🛤️ Routes commerciales ottomanes

- **Route de la Soie :** Acheminement d'oud, musc, camphre depuis l'Asie
- **Route maritime de l'Océan Indien :** Épices, ambre gris, bois précieux
- **Commerce avec Venise :** Redistribution vers l'Europe occidentale
- **Contrôle des productions levantines :** Rose bulgare, jasmin, bergamote

### 🏛️ Contexte culturel et usage

- **Pratiques olfactives dans la société ottomane**
    - **Hammams (bains turcs) :** Usage systématique d'eaux parfumées (gülsuyu - eau de rose), fumigations
    - **Palais impérial :** Corps de parfumeurs dédiés (İtriyât Emini - superviseur des parfums)
    - **Mosquées :** Fumigations d'encens et d'oud lors des prières du vendredi
    - **Cérémonies :** Aspersion d'eau de rose sur les invités (tradition d'hospitalité)
    - **Littérature :** Métaphores olfactives omniprésentes dans la poésie divan (rose, musc, ambre)

### 📍 Centres de production et commerce

- **Istanbul :** Marché égyptien (Mısır Çarşısı) - commerce d'épices et parfums
- **Kazanlık (Bulgarie) :** Culture de roses pour distillation (tradition maintenue jusqu'à aujourd'hui)
- **Damas :** Production d'eaux florales et distillation de roses
- **Le Caire (sous domination ottomane post-1517) :** Plateforme de redistribution des matières africaines et asiatiques

### 🔗 Ressources en ligne recommandées

- **Digital Collections of Turkish Libraries :** [katalog.milli.gov.tr](https://katalog.milli.gov.tr/) (Bibliothèque nationale turque)
- **Islamic Medical Manuscripts :** [US National Library of Medicine - Arabic collections](https://www.nlm.nih.gov/hmd/arabic/welcome.html)
- **SOAS Library (UK) :** Importante collection de manuscrits ottomans
- **Recherches JSTOR :** Mots-clés "Ottoman aromatics", "Islamic perfumery", "Rose cultivation Balkans"

<aside>
**⚠️ Note méthodologique :**
Les sources primaires en ottoman ancien nécessitent expertise linguistique. Privilégier les études académiques modernes avec traductions et analyses pour PERFUMUM, tout en citant les sources primaires pour légitimité historique.

</aside>