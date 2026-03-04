#!/usr/bin/env node

// Données de variations saisonnières et conditions de culture
const seasonalVariations = {
  // TABACS
  'Virginia': {
    description: 'Tabac blond à haut rendement en sucres',
    variations: [
      {
        season: 'Récolte printemps',
        condition: 'Feuilles jeunes, faible teneur en nicotine',
        molecules: {
          'Nicotine': { min: 1.2, max: 1.5 },
          'Sucres': { min: 18, max: 22 },
          'Limonène': { min: 0.3, max: 0.5 }
        }
      },
      {
        season: 'Récolte été',
        condition: 'Feuilles matures, teneur moyenne en nicotine',
        molecules: {
          'Nicotine': { min: 1.8, max: 2.2 },
          'Sucres': { min: 14, max: 18 },
          'Limonène': { min: 0.4, max: 0.6 }
        }
      },
      {
        season: 'Séchage air (6-8 semaines)',
        condition: 'Après séchage naturel, développement des arômes',
        molecules: {
          'Nicotine': { min: 1.5, max: 2.0 },
          'Sucres': { min: 12, max: 16 },
          'Limonène': { min: 0.5, max: 0.8 },
          'Damascenone': { min: 0.1, max: 0.3 }
        }
      }
    ]
  },
  'Burley': {
    description: 'Tabac brun à haut rendement en nicotine',
    variations: [
      {
        season: 'Récolte été',
        condition: 'Feuilles matures, riche en alcaloïdes',
        molecules: {
          'Nicotine': { min: 3.0, max: 3.8 },
          'Protéines': { min: 10, max: 14 },
          'Sucres': { min: 6, max: 10 }
        }
      },
      {
        season: 'Séchage air chaud (4-6 semaines)',
        condition: 'Après séchage, caramélisation des sucres',
        molecules: {
          'Nicotine': { min: 3.2, max: 4.0 },
          'Sucres': { min: 5, max: 8 },
          'Myrcène': { min: 0.15, max: 0.3 },
          'Damascenone': { min: 0.2, max: 0.4 }
        }
      }
    ]
  },
  'Latakia': {
    description: 'Tabac fumé à saveur complexe',
    variations: [
      {
        season: 'Récolte été (Syrie)',
        condition: 'Feuilles de Tabac oriental, avant fumage',
        molecules: {
          'Nicotine': { min: 1.5, max: 2.0 },
          'Myrcène': { min: 0.2, max: 0.4 }
        }
      },
      {
        season: 'Fumage au bois (3-4 mois)',
        condition: 'Après fumage au bois de chêne/pin',
        molecules: {
          'Nicotine': { min: 1.8, max: 2.3 },
          'Caryophyllène oxide': { min: 0.8, max: 1.5 },
          'Linalol oxide': { min: 0.5, max: 1.0 },
          'Damascenone': { min: 0.4, max: 0.8 }
        }
      }
    ]
  },

  // CANNABIS
  'Afghan Kush': {
    description: 'Variété Indica pure, profil terpénique myrcène-dominant',
    variations: [
      {
        season: 'Floraison précoce (8 semaines)',
        condition: 'Récolte avant maturité complète',
        molecules: {
          'Myrcène': { min: 22, max: 28 },
          'Limonène': { min: 6, max: 10 },
          'β-Caryophyllène': { min: 10, max: 14 }
        }
      },
      {
        season: 'Floraison complète (9-10 semaines)',
        condition: 'Récolte à maturité optimale',
        molecules: {
          'Myrcène': { min: 24, max: 30 },
          'Limonène': { min: 7, max: 12 },
          'β-Caryophyllène': { min: 11, max: 16 },
          'Humulène': { min: 4, max: 7 }
        }
      },
      {
        season: 'Séchage et cure (2-4 semaines)',
        condition: 'Après séchage et cure, profil stabilisé',
        molecules: {
          'Myrcène': { min: 20, max: 26 },
          'Limonène': { min: 6, max: 10 },
          'β-Caryophyllène': { min: 10, max: 15 },
          'Humulène': { min: 4, max: 6 }
        }
      }
    ]
  },
  'Thai Stick': {
    description: 'Variété Sativa pure, profil terpénique limonène-dominant',
    variations: [
      {
        season: 'Floraison longue (12-14 semaines)',
        condition: 'Récolte à maturité complète',
        molecules: {
          'Limonène': { min: 20, max: 25 },
          'Myrcène': { min: 12, max: 18 },
          'β-Caryophyllène': { min: 7, max: 10 }
        }
      },
      {
        season: 'Terroir tropical (Thaïlande)',
        condition: 'Climat chaud et humide, altitude 800-1200m',
        molecules: {
          'Limonène': { min: 22, max: 28 },
          'Myrcène': { min: 14, max: 20 },
          'β-Caryophyllène': { min: 8, max: 12 },
          'Pinène': { min: 5, max: 8 }
        }
      }
    ]
  },

  // ROSES
  'Rosa damascena': {
    description: 'Rose de Damas, source majeure d\'huile essentielle',
    variations: [
      {
        season: 'Récolte printemps (avril-mai)',
        condition: 'Fleurs fraîches du matin, teneur maximale en huile',
        molecules: {
          'Citronellol': { min: 32, max: 38 },
          'Géraniol': { min: 16, max: 20 },
          'Nérol': { min: 10, max: 14 }
        }
      },
      {
        season: 'Récolte été (juin-juillet)',
        condition: 'Fleurs matures, profil plus complexe',
        molecules: {
          'Citronellol': { min: 30, max: 36 },
          'Géraniol': { min: 18, max: 22 },
          'Nérol': { min: 12, max: 16 },
          'Linalol': { min: 6, max: 10 }
        }
      },
      {
        season: 'Altitude 1000-1500m (Vallée de Damas)',
        condition: 'Terroir montagneux, climat continental',
        molecules: {
          'Citronellol': { min: 34, max: 40 },
          'Géraniol': { min: 17, max: 21 },
          'Nérol': { min: 11, max: 15 },
          'Myrcène': { min: 4, max: 6 }
        }
      }
    ]
  },

  // AROMATIQUES
  'Lavande aspic': {
    description: 'Lavande à haut rendement en camphre',
    variations: [
      {
        season: 'Récolte juillet (pic de floraison)',
        condition: 'Fleurs en pleine floraison, teneur maximale en linalol',
        molecules: {
          'Linalol': { min: 42, max: 48 },
          'Linalyl acetate': { min: 32, max: 38 },
          'Camphor': { min: 6, max: 10 }
        }
      },
      {
        season: 'Altitude 400-800m (Provence)',
        condition: 'Terroir méditerranéen, sol calcaire',
        molecules: {
          'Linalol': { min: 44, max: 50 },
          'Linalyl acetate': { min: 34, max: 40 },
          'Camphor': { min: 7, max: 12 },
          'Limonène': { min: 1.5, max: 3.0 }
        }
      }
    ]
  },
  'Menthe poivrée': {
    description: 'Menthe à haut rendement en menthol',
    variations: [
      {
        season: 'Récolte juillet (avant floraison)',
        condition: 'Feuilles matures, teneur maximale en menthol',
        molecules: {
          'Menthol': { min: 48, max: 54 },
          'Menthone': { min: 13, max: 18 },
          'Limonène': { min: 4, max: 6 }
        }
      },
      {
        season: 'Séchage à l\'air (3-5 jours)',
        condition: 'Après séchage naturel, concentration des arômes',
        molecules: {
          'Menthol': { min: 50, max: 56 },
          'Menthone': { min: 15, max: 20 },
          'Limonène': { min: 5, max: 7 },
          'Myrcène': { min: 1.5, max: 2.5 }
        }
      }
    ]
  }
};

console.log('=== VARIATIONS SAISONNIÈRES ET CONDITIONS DE CULTURE ===\n');
console.log(`Total de plantes avec variations: ${Object.keys(seasonalVariations).length}\n`);

let totalVariations = 0;
for (const [plantName, data] of Object.entries(seasonalVariations)) {
  console.log(`📍 ${plantName}`);
  console.log(`   Description: ${data.description}`);
  console.log(`   Variations: ${data.variations.length}`);
  
  for (const variation of data.variations) {
    console.log(`   - ${variation.season}`);
    console.log(`     Condition: ${variation.condition}`);
    console.log(`     Molécules: ${Object.keys(variation.molecules).length}`);
    totalVariations++;
  }
  console.log();
}

console.log(`=== RÉSUMÉ ===`);
console.log(`Total de variations: ${totalVariations}`);
console.log(`Molécules documentées: ${new Set(Object.values(seasonalVariations).flatMap(p => p.variations.flatMap(v => Object.keys(v.molecules)))).size}`);

// Sauvegarder les données
import fs from 'fs';
fs.writeFileSync('seasonal-variations.json', JSON.stringify(seasonalVariations, null, 2));
console.log('\n📊 Données sauvegardées dans seasonal-variations.json');
