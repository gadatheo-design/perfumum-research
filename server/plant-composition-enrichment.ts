/**
 * Service d'enrichissement des compositions chimiques des plantes
 * Ajoute les liaisons plante-molécule pour les plantes orphelines
 */

import { getDb } from "./db";
import { plantMolecules, molecules, plants } from "../drizzle/schema";
import { sql, notInArray } from "drizzle-orm";

// Base de données des compositions chimiques connues par plante
export const PLANT_COMPOSITIONS: Record<string, Array<{ molecule: string; percentage?: number }>> = {
  // Agrumes
  "Citron": [
    { molecule: "limonène", percentage: 70 },
    { molecule: "γ-terpinène", percentage: 10 },
    { molecule: "β-pinène", percentage: 8 },
    { molecule: "citral", percentage: 3 },
  ],
  "Orange": [
    { molecule: "limonène", percentage: 95 },
    { molecule: "myrcène", percentage: 2 },
    { molecule: "linalol", percentage: 1 },
  ],
  "Bergamote": [
    { molecule: "limonène", percentage: 40 },
    { molecule: "acétate de linalyle", percentage: 30 },
    { molecule: "linalol", percentage: 10 },
  ],
  "Bigaradier": [
    { molecule: "limonène", percentage: 92 },
    { molecule: "myrcène", percentage: 2 },
    { molecule: "linalol", percentage: 1 },
  ],
  "Mandarine": [
    { molecule: "limonène", percentage: 70 },
    { molecule: "γ-terpinène", percentage: 18 },
    { molecule: "myrcène", percentage: 2 },
  ],
  "Pamplemousse": [
    { molecule: "limonène", percentage: 90 },
    { molecule: "myrcène", percentage: 3 },
    { molecule: "nootkatone", percentage: 0.1 },
  ],
  "Lime": [
    { molecule: "limonène", percentage: 50 },
    { molecule: "β-pinène", percentage: 15 },
    { molecule: "γ-terpinène", percentage: 10 },
  ],
  "Yuzu": [
    { molecule: "limonène", percentage: 70 },
    { molecule: "γ-terpinène", percentage: 10 },
    { molecule: "linalol", percentage: 5 },
  ],
  "Cédrat": [
    { molecule: "limonène", percentage: 65 },
    { molecule: "γ-terpinène", percentage: 12 },
    { molecule: "citral", percentage: 5 },
  ],
  // Lavandes et menthes
  "Lavande vraie": [
    { molecule: "linalol", percentage: 35 },
    { molecule: "acétate de linalyle", percentage: 40 },
    { molecule: "lavandulol", percentage: 3 },
  ],
  "Lavandin": [
    { molecule: "linalol", percentage: 30 },
    { molecule: "acétate de linalyle", percentage: 35 },
    { molecule: "camphre", percentage: 8 },
  ],
  "Menthe poivrée": [
    { molecule: "menthol", percentage: 40 },
    { molecule: "menthone", percentage: 25 },
    { molecule: "1,8-cinéole", percentage: 5 },
  ],
  "Menthe verte": [
    { molecule: "carvone", percentage: 60 },
    { molecule: "limonène", percentage: 15 },
    { molecule: "myrcène", percentage: 3 },
  ],
  // Eucalyptus et pins
  "Eucalyptus globulus": [
    { molecule: "1,8-cinéole", percentage: 70 },
    { molecule: "α-pinène", percentage: 10 },
    { molecule: "limonène", percentage: 5 },
  ],
  "Eucalyptus citronné": [
    { molecule: "citronellal", percentage: 70 },
    { molecule: "citronellol", percentage: 8 },
    { molecule: "isopulégol", percentage: 5 },
  ],
  "Pin sylvestre": [
    { molecule: "α-pinène", percentage: 40 },
    { molecule: "β-pinène", percentage: 25 },
    { molecule: "limonène", percentage: 10 },
  ],
  "Sapin": [
    { molecule: "α-pinène", percentage: 25 },
    { molecule: "β-pinène", percentage: 20 },
    { molecule: "limonène", percentage: 15 },
    { molecule: "acétate de bornyle", percentage: 10 },
  ],
  "Cyprès": [
    { molecule: "α-pinène", percentage: 50 },
    { molecule: "δ-3-carène", percentage: 20 },
    { molecule: "cédrol", percentage: 5 },
  ],
  "Genévrier": [
    { molecule: "α-pinène", percentage: 40 },
    { molecule: "myrcène", percentage: 15 },
    { molecule: "sabinene", percentage: 10 },
  ],
  "Cèdre": [
    { molecule: "cédrol", percentage: 25 },
    { molecule: "α-cédrène", percentage: 20 },
    { molecule: "β-cédrène", percentage: 15 },
  ],
  // Épices
  "Cannelle de Ceylan": [
    { molecule: "cinnamaldéhyde", percentage: 75 },
    { molecule: "eugénol", percentage: 8 },
    { molecule: "linalol", percentage: 3 },
  ],
  "Clou de girofle": [
    { molecule: "eugénol", percentage: 85 },
    { molecule: "β-caryophyllène", percentage: 8 },
  ],
  "Gingembre": [
    { molecule: "zingibérène", percentage: 30 },
    { molecule: "β-sesquiphellandrène", percentage: 15 },
    { molecule: "ar-curcumène", percentage: 10 },
  ],
  "Cardamome": [
    { molecule: "1,8-cinéole", percentage: 35 },
    { molecule: "acétate de terpényle", percentage: 30 },
    { molecule: "linalol", percentage: 5 },
  ],
  "Curcuma": [
    { molecule: "ar-turmérone", percentage: 25 },
    { molecule: "turmérone", percentage: 20 },
    { molecule: "curcumène", percentage: 15 },
  ],
  "Poivre noir": [
    { molecule: "β-caryophyllène", percentage: 30 },
    { molecule: "limonène", percentage: 20 },
    { molecule: "α-pinène", percentage: 10 },
  ],
  "Muscade": [
    { molecule: "sabinene", percentage: 20 },
    { molecule: "α-pinène", percentage: 15 },
    { molecule: "myristicine", percentage: 10 },
  ],
  "Coriandre": [
    { molecule: "linalol", percentage: 70 },
    { molecule: "γ-terpinène", percentage: 8 },
    { molecule: "α-pinène", percentage: 5 },
  ],
  "Anis vert": [
    { molecule: "anéthole", percentage: 90 },
    { molecule: "estragole", percentage: 3 },
  ],
  "Anis étoilé": [
    { molecule: "anéthole", percentage: 85 },
    { molecule: "limonène", percentage: 5 },
  ],
  "Fenouil": [
    { molecule: "anéthole", percentage: 70 },
    { molecule: "fenchone", percentage: 15 },
    { molecule: "estragole", percentage: 5 },
  ],
  "Cumin": [
    { molecule: "cuminal", percentage: 40 },
    { molecule: "γ-terpinène", percentage: 15 },
    { molecule: "p-cymène", percentage: 10 },
  ],
  "Ajowan": [
    { molecule: "thymol", percentage: 50 },
    { molecule: "p-cymène", percentage: 25 },
    { molecule: "γ-terpinène", percentage: 15 },
  ],
  // Fleurs
  "Rose de Damas": [
    { molecule: "citronellol", percentage: 35 },
    { molecule: "géraniol", percentage: 20 },
    { molecule: "nérol", percentage: 10 },
  ],
  "Jasmin": [
    { molecule: "acétate de benzyle", percentage: 25 },
    { molecule: "linalol", percentage: 8 },
    { molecule: "jasmone", percentage: 3 },
    { molecule: "indole", percentage: 2 },
  ],
  "Ylang-ylang": [
    { molecule: "linalol", percentage: 15 },
    { molecule: "acétate de géranyle", percentage: 12 },
    { molecule: "β-caryophyllène", percentage: 10 },
  ],
  "Néroli": [
    { molecule: "linalol", percentage: 35 },
    { molecule: "limonène", percentage: 15 },
    { molecule: "β-pinène", percentage: 10 },
    { molecule: "nérol", percentage: 5 },
  ],
  "Tubereuse": [
    { molecule: "benzoate de méthyle", percentage: 15 },
    { molecule: "salicylate de méthyle", percentage: 10 },
    { molecule: "nérol", percentage: 8 },
  ],
  "Fleur d'oranger": [
    { molecule: "linalol", percentage: 35 },
    { molecule: "limonène", percentage: 15 },
    { molecule: "nérol", percentage: 8 },
  ],
  "Mimosa": [
    { molecule: "anéthole", percentage: 20 },
    { molecule: "linalol", percentage: 10 },
    { molecule: "géraniol", percentage: 8 },
  ],
  "Iris": [
    { molecule: "irone", percentage: 5 },
    { molecule: "myristic acid", percentage: 10 },
  ],
  "Violette": [
    { molecule: "ionone", percentage: 3 },
    { molecule: "α-ionone", percentage: 2 },
  ],
  "Géranium": [
    { molecule: "citronellol", percentage: 30 },
    { molecule: "géraniol", percentage: 15 },
    { molecule: "linalol", percentage: 10 },
  ],
  "Chamomille": [
    { molecule: "chamazulène", percentage: 5 },
    { molecule: "bisabolol", percentage: 25 },
    { molecule: "farnésène", percentage: 15 },
  ],
  "Immortelle": [
    { molecule: "acétate de néryle", percentage: 30 },
    { molecule: "italidione", percentage: 10 },
    { molecule: "γ-curcumène", percentage: 8 },
  ],
  // Herbes aromatiques
  "Romarin": [
    { molecule: "1,8-cinéole", percentage: 45 },
    { molecule: "camphre", percentage: 15 },
    { molecule: "α-pinène", percentage: 12 },
  ],
  "Thym": [
    { molecule: "thymol", percentage: 45 },
    { molecule: "p-cymène", percentage: 20 },
    { molecule: "γ-terpinène", percentage: 10 },
  ],
  "Basilic": [
    { molecule: "linalol", percentage: 50 },
    { molecule: "estragole", percentage: 25 },
    { molecule: "eugénol", percentage: 10 },
  ],
  "Sauge sclarée": [
    { molecule: "acétate de linalyle", percentage: 70 },
    { molecule: "linalol", percentage: 15 },
    { molecule: "sclaréol", percentage: 2 },
  ],
  "Sauge officinale": [
    { molecule: "thujone", percentage: 35 },
    { molecule: "camphre", percentage: 20 },
    { molecule: "1,8-cinéole", percentage: 15 },
  ],
  "Origan": [
    { molecule: "carvacrol", percentage: 70 },
    { molecule: "thymol", percentage: 5 },
    { molecule: "p-cymène", percentage: 8 },
  ],
  "Marjolaine": [
    { molecule: "terpinène-4-ol", percentage: 25 },
    { molecule: "γ-terpinène", percentage: 15 },
    { molecule: "sabinene", percentage: 10 },
  ],
  "Estragon": [
    { molecule: "estragole", percentage: 75 },
    { molecule: "limonène", percentage: 5 },
    { molecule: "ocène", percentage: 3 },
  ],
  "Laurier": [
    { molecule: "1,8-cinéole", percentage: 45 },
    { molecule: "linalol", percentage: 10 },
    { molecule: "eugénol", percentage: 5 },
  ],
  "Persil": [
    { molecule: "myristicine", percentage: 25 },
    { molecule: "apiol", percentage: 20 },
    { molecule: "β-phellandrène", percentage: 15 },
  ],
  "Aneth": [
    { molecule: "carvone", percentage: 45 },
    { molecule: "limonène", percentage: 35 },
    { molecule: "α-phellandrène", percentage: 5 },
  ],
  "Céleri": [
    { molecule: "limonène", percentage: 60 },
    { molecule: "sélinène", percentage: 10 },
    { molecule: "phthalides", percentage: 5 },
  ],
  "Armoise": [
    { molecule: "thujone", percentage: 30 },
    { molecule: "camphre", percentage: 15 },
    { molecule: "1,8-cinéole", percentage: 10 },
  ],
  "Absinthe": [
    { molecule: "thujone", percentage: 40 },
    { molecule: "myrcène", percentage: 10 },
    { molecule: "sabinene", percentage: 8 },
  ],
  // Bois et résines
  "Santal": [
    { molecule: "α-santalol", percentage: 45 },
    { molecule: "β-santalol", percentage: 20 },
  ],
  "Vétiver": [
    { molecule: "vétivérol", percentage: 10 },
    { molecule: "khusimol", percentage: 15 },
  ],
  "Patchouli": [
    { molecule: "patchoulol", percentage: 35 },
    { molecule: "α-bulnésène", percentage: 15 },
  ],
  "Encens": [
    { molecule: "α-pinène", percentage: 30 },
    { molecule: "limonène", percentage: 15 },
    { molecule: "incensole", percentage: 5 },
  ],
  "Myrrhe": [
    { molecule: "furanoeudésma-1,3-diène", percentage: 20 },
    { molecule: "curzerène", percentage: 15 },
    { molecule: "lindestrène", percentage: 10 },
  ],
  "Benjoin": [
    { molecule: "acide benzoique", percentage: 20 },
    { molecule: "vanilline", percentage: 5 },
    { molecule: "coniferyl benzoate", percentage: 15 },
  ],
  "Opoponax": [
    { molecule: "β-bisabolene", percentage: 25 },
    { molecule: "α-santalene", percentage: 15 },
  ],
  "Labdanum": [
    { molecule: "α-pinène", percentage: 20 },
    { molecule: "camphène", percentage: 10 },
    { molecule: "labdane", percentage: 15 },
  ],
  "Elemi": [
    { molecule: "limonène", percentage: 50 },
    { molecule: "α-phellandrène", percentage: 20 },
    { molecule: "elémol", percentage: 5 },
  ],
  "Copaiba": [
    { molecule: "β-caryophyllène", percentage: 50 },
    { molecule: "α-humulene", percentage: 10 },
    { molecule: "β-bisabolene", percentage: 8 },
  ],
  "Bois d'agar": [
    { molecule: "agarospirol", percentage: 10 },
    { molecule: "jinkoh-eremol", percentage: 8 },
    { molecule: "kusunol", percentage: 5 },
  ],
  "Bois de rose": [
    { molecule: "linalol", percentage: 85 },
    { molecule: "α-terpinéol", percentage: 5 },
  ],
  "Gaïac": [
    { molecule: "gaïacol", percentage: 20 },
    { molecule: "gaiol", percentage: 35 },
    { molecule: "bulnésol", percentage: 15 },
  ],
  "Amyris": [
    { molecule: "valerianol", percentage: 15 },
    { molecule: "eudesmol", percentage: 20 },
    { molecule: "elémol", percentage: 10 },
  ],
  "Amyris (bois)": [
    { molecule: "valerianol", percentage: 15 },
    { molecule: "eudesmol", percentage: 20 },
    { molecule: "elémol", percentage: 10 },
  ],
  // Cannabis et tabac
  "Cannabis": [
    { molecule: "myrcène", percentage: 25 },
    { molecule: "β-caryophyllène", percentage: 15 },
    { molecule: "limonène", percentage: 10 },
    { molecule: "α-pinène", percentage: 8 },
    { molecule: "linalol", percentage: 5 },
  ],
  "Tabac": [
    { molecule: "nicotine", percentage: 3 },
    { molecule: "solanone", percentage: 0.5 },
  ],
  // Plantes médicinales
  "Tea tree": [
    { molecule: "terpinène-4-ol", percentage: 40 },
    { molecule: "γ-terpinène", percentage: 20 },
    { molecule: "1,8-cinéole", percentage: 5 },
  ],
  "Citronnelle": [
    { molecule: "citronellal", percentage: 35 },
    { molecule: "géraniol", percentage: 25 },
    { molecule: "citronellol", percentage: 10 },
  ],
  "Palmarosa": [
    { molecule: "géraniol", percentage: 80 },
    { molecule: "acétate de géranyle", percentage: 10 },
  ],
  "Lemongrass": [
    { molecule: "citral", percentage: 75 },
    { molecule: "myrcène", percentage: 10 },
    { molecule: "géraniol", percentage: 5 },
  ],
  "Verveine": [
    { molecule: "citral", percentage: 40 },
    { molecule: "limonène", percentage: 15 },
    { molecule: "géraniol", percentage: 8 },
  ],
  "Mélisse": [
    { molecule: "citral", percentage: 40 },
    { molecule: "citronellal", percentage: 15 },
    { molecule: "β-caryophyllène", percentage: 10 },
  ],
  "Hysope": [
    { molecule: "pinocamphone", percentage: 40 },
    { molecule: "isopinocamphone", percentage: 30 },
    { molecule: "β-pinène", percentage: 10 },
  ],
  "Sarriette": [
    { molecule: "carvacrol", percentage: 50 },
    { molecule: "thymol", percentage: 10 },
    { molecule: "p-cymène", percentage: 15 },
  ],
  "Angélique": [
    { molecule: "α-phellandrène", percentage: 15 },
    { molecule: "α-pinène", percentage: 20 },
    { molecule: "limonène", percentage: 10 },
  ],
  "Livèche": [
    { molecule: "phthalides", percentage: 30 },
    { molecule: "β-phellandrène", percentage: 20 },
    { molecule: "limonène", percentage: 15 },
  ],
  "Carvi": [
    { molecule: "carvone", percentage: 55 },
    { molecule: "limonène", percentage: 40 },
  ],
  "Ambrette": [
    { molecule: "ambrettolide", percentage: 10 },
    { molecule: "farnésol", percentage: 15 },
    { molecule: "β-caryophyllène", percentage: 8 },
  ],
  // Autres plantes
  "Houblon": [
    { molecule: "myrcène", percentage: 30 },
    { molecule: "humulene", percentage: 25 },
    { molecule: "β-caryophyllène", percentage: 10 },
  ],
  "Valériane": [
    { molecule: "acide valérénique", percentage: 5 },
    { molecule: "bornyl acétate", percentage: 15 },
    { molecule: "camphène", percentage: 10 },
  ],
  "Ache": [
    { molecule: "limonène", percentage: 60 },
    { molecule: "sélinène", percentage: 10 },
  ],
  "Achillée": [
    { molecule: "chamazulène", percentage: 5 },
    { molecule: "sabinene", percentage: 15 },
    { molecule: "1,8-cinéole", percentage: 10 },
  ],
  "Millepertuis": [
    { molecule: "α-pinène", percentage: 10 },
    { molecule: "β-caryophyllène", percentage: 8 },
  ],
  "Calendula": [
    { molecule: "α-cadinol", percentage: 15 },
    { molecule: "δ-cadinène", percentage: 10 },
  ],
  "Souci": [
    { molecule: "α-cadinol", percentage: 15 },
    { molecule: "δ-cadinène", percentage: 10 },
  ],
  "Tanaisie": [
    { molecule: "thujone", percentage: 50 },
    { molecule: "camphre", percentage: 15 },
  ],
  "Rue": [
    { molecule: "2-undecanone", percentage: 40 },
    { molecule: "2-nonanone", percentage: 20 },
  ],
  // Plantes ethnobotaniques
  "Peyotl": [
    { molecule: "mescaline", percentage: 2 },
  ],
  "Ayahuasca": [
    { molecule: "harmine", percentage: 1 },
    { molecule: "harmaline", percentage: 0.5 },
  ],
  "Banisteriopsis caapi": [
    { molecule: "harmine", percentage: 1 },
    { molecule: "harmaline", percentage: 0.5 },
    { molecule: "tetrahydroharmine", percentage: 0.3 },
  ],
  "Psychotria viridis": [
    { molecule: "DMT", percentage: 0.3 },
  ],
  "Iboga": [
    { molecule: "ibogaine", percentage: 3 },
  ],
  "Kava": [
    { molecule: "kavain", percentage: 5 },
    { molecule: "dihydrokavain", percentage: 3 },
  ],
  "Kratom": [
    { molecule: "mitragynine", percentage: 2 },
    { molecule: "7-hydroxymitragynine", percentage: 0.02 },
  ],
  "Salvia divinorum": [
    { molecule: "salvinorin A", percentage: 0.2 },
  ],
  // Plantes de parfumerie
  "Mousse de chêne": [
    { molecule: "atranol", percentage: 0.5 },
    { molecule: "chloroatranol", percentage: 0.1 },
    { molecule: "evernic acid", percentage: 5 },
  ],
  "Mousse d'arbre": [
    { molecule: "atranol", percentage: 0.5 },
    { molecule: "evernic acid", percentage: 5 },
  ],
  "Foin": [
    { molecule: "coumarine", percentage: 1 },
    { molecule: "hexanal", percentage: 5 },
  ],
  "Tonka": [
    { molecule: "coumarine", percentage: 3 },
    { molecule: "dihydrocoumarine", percentage: 0.5 },
  ],
  "Fève tonka": [
    { molecule: "coumarine", percentage: 3 },
    { molecule: "dihydrocoumarine", percentage: 0.5 },
  ],
  "Vanille": [
    { molecule: "vanilline", percentage: 2 },
    { molecule: "acide vanillique", percentage: 0.5 },
  ],
  "Cacao": [
    { molecule: "théobromine", percentage: 2 },
    { molecule: "caféine", percentage: 0.2 },
    { molecule: "linalol", percentage: 0.1 },
  ],
  "Café": [
    { molecule: "caféine", percentage: 1.5 },
    { molecule: "furfural", percentage: 0.5 },
  ],
  "Thé": [
    { molecule: "caféine", percentage: 3 },
    { molecule: "linalol", percentage: 0.5 },
    { molecule: "géraniol", percentage: 0.3 },
  ],
  "Maté": [
    { molecule: "caféine", percentage: 1 },
    { molecule: "théobromine", percentage: 0.5 },
  ],
  // Cannabis landraces - compositions terpéniques typiques
  "Kerala Gold": [
    { molecule: "myrcène", percentage: 25 },
    { molecule: "β-caryophyllène", percentage: 15 },
    { molecule: "limonène", percentage: 10 },
    { molecule: "linalol", percentage: 5 },
  ],
  "Malana Cream": [
    { molecule: "myrcène", percentage: 30 },
    { molecule: "β-caryophyllène", percentage: 18 },
    { molecule: "α-pinène", percentage: 8 },
    { molecule: "limonène", percentage: 6 },
  ],
  "Idukki Gold": [
    { molecule: "myrcène", percentage: 22 },
    { molecule: "β-caryophyllène", percentage: 12 },
    { molecule: "limonène", percentage: 15 },
  ],
  "Thai Stick": [
    { molecule: "limonène", percentage: 20 },
    { molecule: "myrcène", percentage: 15 },
    { molecule: "terpinène-4-ol", percentage: 5 },
  ],
  "Cambodian": [
    { molecule: "myrcène", percentage: 25 },
    { molecule: "limonène", percentage: 12 },
    { molecule: "β-caryophyllène", percentage: 10 },
  ],
  "Mazar-i-Sharif": [
    { molecule: "myrcène", percentage: 35 },
    { molecule: "β-caryophyllène", percentage: 20 },
    { molecule: "linalol", percentage: 8 },
  ],
  "Kandahar": [
    { molecule: "myrcène", percentage: 30 },
    { molecule: "β-caryophyllène", percentage: 18 },
    { molecule: "α-pinène", percentage: 10 },
  ],
  "Pakistani Kush": [
    { molecule: "myrcène", percentage: 28 },
    { molecule: "β-caryophyllène", percentage: 22 },
    { molecule: "limonène", percentage: 8 },
    { molecule: "linalol", percentage: 6 },
  ],
  "Malawi Gold": [
    { molecule: "limonène", percentage: 25 },
    { molecule: "myrcène", percentage: 15 },
    { molecule: "β-caryophyllène", percentage: 12 },
  ],
  "Swazi Gold": [
    { molecule: "limonène", percentage: 22 },
    { molecule: "myrcène", percentage: 18 },
    { molecule: "terpinène-4-ol", percentage: 5 },
  ],
  "Kilimanjaro": [
    { molecule: "limonène", percentage: 20 },
    { molecule: "myrcène", percentage: 12 },
    { molecule: "α-pinène", percentage: 8 },
  ],
  "Ethiopian Highland": [
    { molecule: "limonène", percentage: 18 },
    { molecule: "myrcène", percentage: 15 },
    { molecule: "β-caryophyllène", percentage: 10 },
  ],
  "Panama Red": [
    { molecule: "limonène", percentage: 22 },
    { molecule: "myrcène", percentage: 12 },
    { molecule: "β-caryophyllène", percentage: 8 },
  ],
  "Lamb's Bread": [
    { molecule: "limonène", percentage: 25 },
    { molecule: "myrcène", percentage: 10 },
    { molecule: "β-caryophyllène", percentage: 12 },
  ],
  "Hawaiian": [
    { molecule: "limonène", percentage: 20 },
    { molecule: "myrcène", percentage: 15 },
    { molecule: "linalol", percentage: 8 },
  ],
  "Maui Wowie": [
    { molecule: "limonène", percentage: 25 },
    { molecule: "myrcène", percentage: 12 },
    { molecule: "α-pinène", percentage: 8 },
  ],
  "Hindu Kush": [
    { molecule: "myrcène", percentage: 35 },
    { molecule: "β-caryophyllène", percentage: 20 },
    { molecule: "linalol", percentage: 10 },
  ],
  "Ketama": [
    { molecule: "myrcène", percentage: 28 },
    { molecule: "β-caryophyllène", percentage: 18 },
    { molecule: "limonène", percentage: 8 },
  ],
  // Tabacs spéciaux
  "Perique": [
    { molecule: "nicotine", percentage: 4 },
    { molecule: "solanone", percentage: 0.8 },
  ],
  "Latakia": [
    { molecule: "nicotine", percentage: 2 },
    { molecule: "guéaïacol", percentage: 1 },
  ],
  "Mapacho": [
    { molecule: "nicotine", percentage: 9 },
    { molecule: "harmine", percentage: 0.5 },
  ],
  "Oriental Katerini": [
    { molecule: "nicotine", percentage: 1.5 },
    { molecule: "solanone", percentage: 0.3 },
  ],
  "Yenidje": [
    { molecule: "nicotine", percentage: 1.2 },
    { molecule: "solanone", percentage: 0.2 },
  ],
  "Nicotiana benthamiana": [
    { molecule: "nicotine", percentage: 0.5 },
  ],
  "Wild tobacco": [
    { molecule: "nicotine", percentage: 2 },
  ],
  "Nicotiana sylvestris": [
    { molecule: "nicotine", percentage: 3 },
  ],
  "Nicotiana tomentosiformis": [
    { molecule: "nicotine", percentage: 2.5 },
  ],
  // Plantes ethnobotaniques
  "Lotus Bleu": [
    { molecule: "aporphine", percentage: 0.5 },
    { molecule: "nuciferine", percentage: 0.3 },
  ],
  "Wild Dagga": [
    { molecule: "leonurine", percentage: 0.5 },
  ],
  "Kanna": [
    { molecule: "linalol", percentage: 5 },
    { molecule: "géraniol", percentage: 3 },
  ],
  "Passiflore": [
    { molecule: "linalol", percentage: 8 },
    { molecule: "limonène", percentage: 5 },
  ],
  "Klip Dagga": [
    { molecule: "leonurine", percentage: 0.8 },
  ],
  "Calamus (Acore)": [
    { molecule: "β-asarone", percentage: 10 },
    { molecule: "α-asarone", percentage: 5 },
  ],
  // Résines et bois précieux
  "Sandalwood australien": [
    { molecule: "α-santalol", percentage: 20 },
    { molecule: "β-santalol", percentage: 10 },
  ],
  "Styrax liquide": [
    { molecule: "vanilline", percentage: 5 },
    { molecule: "acide cinnamique", percentage: 15 },
  ],
  "Costus": [
    { molecule: "α-costol", percentage: 5 },
    { molecule: "β-costol", percentage: 3 },
  ],
  "Silphium": [
    { molecule: "acide férulique", percentage: 2 },
  ],
  "Galbanum": [
    { molecule: "β-pinène", percentage: 50 },
    { molecule: "α-pinène", percentage: 15 },
    { molecule: "myrcène", percentage: 10 },
  ],
  "Élémi": [
    { molecule: "limonène", percentage: 50 },
    { molecule: "α-phellandrène", percentage: 20 },
    { molecule: "elémol", percentage: 5 },
  ],
  "Aquilaria": [
    { molecule: "agarospirol", percentage: 10 },
    { molecule: "jinkoh-eremol", percentage: 8 },
  ],
  "Aniba": [
    { molecule: "linalol", percentage: 85 },
    { molecule: "α-terpinéol", percentage: 5 },
  ],
  // Plantes médicinales et aromatiques
  "Réglisse": [
    { molecule: "glycyrrhizine", percentage: 5 },
    { molecule: "anéthole", percentage: 3 },
  ],
  "Genêt": [
    { molecule: "linalol", percentage: 15 },
    { molecule: "géraniol", percentage: 10 },
  ],
  "Cassie": [
    { molecule: "linalol", percentage: 20 },
    { molecule: "géraniol", percentage: 15 },
    { molecule: "nérol", percentage: 8 },
  ],
  "Niaouli": [
    { molecule: "1,8-cinéole", percentage: 55 },
    { molecule: "viridiflorol", percentage: 10 },
    { molecule: "α-terpinéol", percentage: 8 },
  ],
  "Myrte": [
    { molecule: "1,8-cinéole", percentage: 30 },
    { molecule: "α-pinène", percentage: 20 },
    { molecule: "linalol", percentage: 10 },
  ],
  "Camphrier": [
    { molecule: "camphre", percentage: 50 },
    { molecule: "1,8-cinéole", percentage: 15 },
    { molecule: "linalol", percentage: 10 },
  ],
  // Plantes mexicaines et américaines
  "Hoja Santa": [
    { molecule: "safrol", percentage: 50 },
    { molecule: "myristicine", percentage: 10 },
    { molecule: "eugénol", percentage: 5 },
  ],
  "Cacaloxochitl": [
    { molecule: "linalol", percentage: 15 },
    { molecule: "géraniol", percentage: 10 },
  ],
  "Tepezcohuite": [
    { molecule: "linalol", percentage: 10 },
    { molecule: "géraniol", percentage: 8 },
  ],
  "Ahuehuete": [
    { molecule: "α-pinène", percentage: 30 },
    { molecule: "β-pinène", percentage: 20 },
  ],
  "Hule": [
    { molecule: "limonène", percentage: 5 },
    { molecule: "myrcène", percentage: 3 },
  ],
  "Ruda": [
    { molecule: "limonène", percentage: 20 },
    { molecule: "α-pinène", percentage: 15 },
  ],
  "Poleo": [
    { molecule: "pulégone", percentage: 80 },
    { molecule: "menthone", percentage: 5 },
  ],
  "Epazote": [
    { molecule: "ascaridole", percentage: 60 },
    { molecule: "p-cymène", percentage: 10 },
  ],
  "Ocote": [
    { molecule: "α-pinène", percentage: 40 },
    { molecule: "β-pinène", percentage: 25 },
    { molecule: "limonène", percentage: 10 },
  ],
  "Flor de Manita": [
    { molecule: "linalol", percentage: 10 },
  ],
  "Pipiltzintzintli / Salvia divinorum": [
    { molecule: "linalol", percentage: 5 },
    { molecule: "1,8-cinéole", percentage: 3 },
  ],
  "Sinicuichi": [
    { molecule: "linalol", percentage: 8 },
    { molecule: "limonène", percentage: 5 },
  ],
  "Yoloxóchitl": [
    { molecule: "linalol", percentage: 20 },
    { molecule: "benzyl alcohol", percentage: 10 },
  ],
  "Protium spp. (copal)": [
    { molecule: "α-pinène", percentage: 25 },
    { molecule: "limonène", percentage: 20 },
  ],
  "Aframomum melegueta (grains of paradise)": [
    { molecule: "zingibérène", percentage: 15 },
    { molecule: "β-caryophyllène", percentage: 10 },
  ],
  "Vitellaria paradoxa (karité)": [
    { molecule: "linalol", percentage: 5 },
    { molecule: "géraniol", percentage: 3 },
  ],
  "Parkia biglobosa (néré)": [
    { molecule: "limonène", percentage: 8 },
    { molecule: "myrcène", percentage: 5 },
  ],
  "Pistacia lentiscus (mastic)": [
    { molecule: "α-pinène", percentage: 70 },
    { molecule: "myrcène", percentage: 10 },
  ],
  "Styrax benzoin (benjoin)": [
    { molecule: "acide benzoique", percentage: 20 },
    { molecule: "vanilline", percentage: 5 },
  ],
  "Silphium (plante antique disparue)": [
    { molecule: "acide férulique", percentage: 2 },
    { molecule: "limonène", percentage: 10 },
  ],
  "Ambergris (matière patrimoniale)": [
    { molecule: "muscone", percentage: 5 },
    { molecule: "ambréine", percentage: 25 },
  ],
  "Salvia officinalis (sauge)": [
    { molecule: "thujone", percentage: 35 },
    { molecule: "camphre", percentage: 20 },
    { molecule: "1,8-cinéole", percentage: 15 },
  ],
  "Ferula galbaniflua (galbanum)": [
    { molecule: "β-pinène", percentage: 50 },
    { molecule: "α-pinène", percentage: 15 },
  ],
  // Plantes sud-américaines
  "Palo santo (Gran Chaco) — Bulnesia sarmientoi (CITES)": [
    { molecule: "limonène", percentage: 60 },
    { molecule: "α-terpinéol", percentage: 10 },
  ],
  "Gaïac — Guaiacum sanctum (proxy)": [
    { molecule: "limonène", percentage: 30 },
    { molecule: "α-terpinéol", percentage: 15 },
  ],
  "Gomme arabique — Senegalia senegal (filière fragile)": [
    { molecule: "linalol", percentage: 5 },
    { molecule: "géraniol", percentage: 3 },
  ],
  "Musk deer (musc naturel) — Moschus moschiferus (CITES)": [
    { molecule: "muscone", percentage: 2 },
  ],
  "Ambergris (patrimoine) — Physeter macrocephalus (échouages)": [
    { molecule: "muscone", percentage: 5 },
  ],
  "Musk mallow (Malva moschata) — note patrimoniale": [
    { molecule: "ambrettolide", percentage: 5 },
  ],
  "Mimosa tenuiflora": [
    { molecule: "DMT", percentage: 1 },
    { molecule: "5-MeO-DMT", percentage: 0.3 },
  ],
  "Mimosa ophthalmocentra": [
    { molecule: "DMT", percentage: 0.8 },
  ],
  "Anadenanthera peregrina": [
    { molecule: "linalol", percentage: 10 },
    { molecule: "limonène", percentage: 8 },
  ],
  "Anadenanthera colubrina": [
    { molecule: "linalol", percentage: 12 },
    { molecule: "géraniol", percentage: 5 },
  ],
  "Virola theiodora": [
    { molecule: "myrcène", percentage: 15 },
    { molecule: "β-caryophyllène", percentage: 10 },
  ],
  "Turbina corymbosa": [
    { molecule: "linalol", percentage: 8 },
    { molecule: "limonène", percentage: 5 },
  ],
  "Heimia salicifolia": [
    { molecule: "linalol", percentage: 10 },
    { molecule: "1,8-cinéole", percentage: 5 },
  ],
  "Datura stramonium": [
    { molecule: "limonène", percentage: 15 },
    { molecule: "myrcène", percentage: 10 },
  ],
  "Toloache": [
    { molecule: "scopolamine", percentage: 0.4 },
    { molecule: "atropine", percentage: 0.3 },
  ],
  "Bursera graveolens": [
    { molecule: "limonène", percentage: 60 },
    { molecule: "α-terpinéol", percentage: 10 },
  ],
  "Bursera copallifera": [
    { molecule: "α-pinène", percentage: 30 },
    { molecule: "limonène", percentage: 25 },
  ],
  "Bursera bipinnata": [
    { molecule: "α-pinène", percentage: 35 },
    { molecule: "limonène", percentage: 20 },
  ],
  "Protium heptaphyllum": [
    { molecule: "α-pinène", percentage: 25 },
    { molecule: "limonène", percentage: 20 },
    { molecule: "p-cymène", percentage: 10 },
  ],
  "Myroxylon balsamum": [
    { molecule: "benzoate de benzyle", percentage: 25 },
    { molecule: "cinnamate de benzyle", percentage: 20 },
  ],
  "Tagetes lucida": [
    { molecule: "estragole", percentage: 60 },
    { molecule: "anéthole", percentage: 15 },
  ],
  "Liquidambar styraciflua": [
    { molecule: "vanilline", percentage: 5 },
    { molecule: "acide cinnamique", percentage: 15 },
  ],
  "Silphium sp.": [
    { molecule: "limonène", percentage: 15 },
    { molecule: "α-pinène", percentage: 10 },
  ],
  "Nymphaea ampla": [
    { molecule: "aporphine", percentage: 0.3 },
    { molecule: "nuciferine", percentage: 0.2 },
  ],
  "Attalea speciosa": [
    { molecule: "linalol", percentage: 5 },
    { molecule: "géraniol", percentage: 3 },
  ],
  "Theobroma bicolor": [
    { molecule: "théobromine", percentage: 1 },
  ],
  "Quararibea funebris": [
    { molecule: "linalol", percentage: 15 },
  ],
  "Argemone mexicana": [
    { molecule: "limonène", percentage: 10 },
    { molecule: "α-pinène", percentage: 8 },
  ],
  "Croton lechleri": [
    { molecule: "linalol", percentage: 12 },
    { molecule: "1,8-cinéole", percentage: 8 },
  ],
  "Uncaria tomentosa": [
    { molecule: "linalol", percentage: 8 },
    { molecule: "géraniol", percentage: 5 },
  ],
  "Lippia graveolens": [
    { molecule: "carvacrol", percentage: 50 },
    { molecule: "thymol", percentage: 10 },
  ],
  "Piper auritum": [
    { molecule: "safrol", percentage: 50 },
    { molecule: "myristicine", percentage: 10 },
    { molecule: "eugénol", percentage: 5 },
  ],
  // Autres plantes
  "Yarumo (Cetico)": [
    { molecule: "linalol", percentage: 8 },
    { molecule: "limonène", percentage: 5 },
  ],
  "Ambil": [
    { molecule: "nicotine", percentage: 8 },
  ],
  "Valériane mexicaine": [
    { molecule: "acide valérénique", percentage: 5 },
    { molecule: "bornyl acétate", percentage: 15 },
  ],
  "Origan Mexicain": [
    { molecule: "carvacrol", percentage: 60 },
    { molecule: "thymol", percentage: 8 },
    { molecule: "p-cymène", percentage: 10 },
  ],
  "Sapin baumier": [
    { molecule: "α-pinène", percentage: 25 },
    { molecule: "β-pinène", percentage: 20 },
    { molecule: "limonène", percentage: 15 },
    { molecule: "acétate de bornyle", percentage: 10 },
  ],
  "Laurier noble": [
    { molecule: "1,8-cinéole", percentage: 45 },
    { molecule: "linalol", percentage: 10 },
  ],
  "Opoponax (Myrrhe douce)": [
    { molecule: "β-bisabolene", percentage: 25 },
    { molecule: "α-santalene", percentage: 15 },
  ],
  "Bois de rose (lutherie) — Dalbergia nigra (CITES)": [
    { molecule: "linalol", percentage: 85 },
    { molecule: "α-terpinéol", percentage: 5 },
  ],
};

const PLANT_ALIASES: Record<string, string> = {
  "lavande": "Lavande vraie",
  "menthe": "Menthe poivrée",
  "eucalyptus": "Eucalyptus globulus",
  "pin": "Pin sylvestre",
  "rose": "Rose de Damas",
  "cannelle": "Cannelle de Ceylan",
  "girofle": "Clou de girofle",
  "vetiver": "Vétiver",
  "frankincense": "Encens",
  "boswellia": "Encens",
  "oliban": "Encens",
  "citrus bergamia": "Bergamote",
  "citrus aurantium": "Bigaradier",
  "citrus limon": "Citron",
  "citrus sinensis": "Orange",
  "citrus reticulata": "Mandarine",
  "citrus paradisi": "Pamplemousse",
  "lavandula angustifolia": "Lavande vraie",
  "mentha piperita": "Menthe poivrée",
  "mentha spicata": "Menthe verte",
  "eucalyptus citriodora": "Eucalyptus citronné",
  "pinus sylvestris": "Pin sylvestre",
  "cupressus sempervirens": "Cyprès",
  "juniperus communis": "Genévrier",
  "cedrus atlantica": "Cèdre",
  "cinnamomum verum": "Cannelle de Ceylan",
  "syzygium aromaticum": "Clou de girofle",
  "zingiber officinale": "Gingembre",
  "elettaria cardamomum": "Cardamome",
  "curcuma longa": "Curcuma",
  "piper nigrum": "Poivre noir",
  "myristica fragrans": "Muscade",
  "coriandrum sativum": "Coriandre",
  "pimpinella anisum": "Anis vert",
  "illicium verum": "Anis étoilé",
  "foeniculum vulgare": "Fenouil",
  "cuminum cyminum": "Cumin",
  "trachyspermum ammi": "Ajowan",
  "rosa damascena": "Rose de Damas",
  "jasminum grandiflorum": "Jasmin",
  "cananga odorata": "Ylang-ylang",
  "citrus aurantium var. amara": "Néroli",
  "polianthes tuberosa": "Tubereuse",
  "acacia dealbata": "Mimosa",
  "iris pallida": "Iris",
  "viola odorata": "Violette",
  "pelargonium graveolens": "Géranium",
  "matricaria chamomilla": "Chamomille",
  "helichrysum italicum": "Immortelle",
  "rosmarinus officinalis": "Romarin",
  "thymus vulgaris": "Thym",
  "ocimum basilicum": "Basilic",
  "salvia sclarea": "Sauge sclarée",
  "salvia officinalis": "Sauge officinale",
  "origanum vulgare": "Origan",
  "origanum majorana": "Marjolaine",
  "artemisia dracunculus": "Estragon",
  "laurus nobilis": "Laurier",
  "petroselinum crispum": "Persil",
  "anethum graveolens": "Aneth",
  "apium graveolens": "Céleri",
  "artemisia vulgaris": "Armoise",
  "artemisia absinthium": "Absinthe",
  "santalum album": "Santal",
  "vetiveria zizanioides": "Vétiver",
  "pogostemon cablin": "Patchouli",
  "boswellia sacra": "Encens",
  "commiphora myrrha": "Myrrhe",
  "styrax benzoin": "Benjoin",
  "commiphora guidottii": "Opoponax",
  "cistus ladanifer": "Labdanum",
  "canarium luzonicum": "Elemi",
  "copaifera officinalis": "Copaiba",
  "aquilaria malaccensis": "Bois d'agar",
  "aquilaria crassna": "Bois d'agar",
  "aniba rosaeodora": "Bois de rose",
  "bulnesia sarmientoi": "Gaïac",
  "amyris balsamifera": "Amyris",
  "melaleuca alternifolia": "Tea tree",
  "cymbopogon winterianus": "Citronnelle",
  "cymbopogon martinii": "Palmarosa",
  "cymbopogon citratus": "Lemongrass",
  "aloysia citrodora": "Verveine",
  "melissa officinalis": "Mélisse",
  "hyssopus officinalis": "Hysope",
  "satureja montana": "Sarriette",
  "angelica archangelica": "Angélique",
  "levisticum officinale": "Livèche",
  "carum carvi": "Carvi",
  "abelmoschus moschatus": "Ambrette",
  "humulus lupulus": "Houblon",
  "valeriana officinalis": "Valériane",
  "achillea millefolium": "Achillée",
  "hypericum perforatum": "Millepertuis",
  "calendula officinalis": "Calendula",
  "tanacetum vulgare": "Tanaisie",
  "ruta graveolens": "Rue",
  "lophophora williamsii": "Peyotl",
  "tabernanthe iboga": "Iboga",
  "piper methysticum": "Kava",
  "mitragyna speciosa": "Kratom",
  "evernia prunastri": "Mousse de chêne",
  "dipteryx odorata": "Tonka",
  "vanilla planifolia": "Vanille",
  "theobroma cacao": "Cacao",
  "coffea arabica": "Café",
  "camellia sinensis": "Thé",
  "ilex paraguariensis": "Maté",
};

function normalizePlantName(name: string): string {
  const normalized = name.toLowerCase().trim();
  return PLANT_ALIASES[normalized] || name;
}

export function findPlantComposition(plantName: string): Array<{ molecule: string; percentage?: number }> | null {
  if (PLANT_COMPOSITIONS[plantName]) return PLANT_COMPOSITIONS[plantName];
  const normalized = normalizePlantName(plantName);
  if (PLANT_COMPOSITIONS[normalized]) return PLANT_COMPOSITIONS[normalized];
  const lowerName = plantName.toLowerCase();
  for (const [key, composition] of Object.entries(PLANT_COMPOSITIONS)) {
    if (key.toLowerCase().includes(lowerName) || lowerName.includes(key.toLowerCase())) {
      return composition;
    }
  }
  return null;
}

export async function getPlantsWithoutMolecules(): Promise<Array<{ id: number; name: string; latinName: string | null }>> {
  const db = await getDb();
  if (!db) return [];
  const plantsWithMolecules = await db
    .select({ plantId: plantMolecules.plantId })
    .from(plantMolecules)
    .groupBy(plantMolecules.plantId);
  const plantIdsWithMolecules = plantsWithMolecules.map(p => p.plantId);
  if (plantIdsWithMolecules.length === 0) {
    return await db.select({ id: plants.id, name: plants.name, latinName: plants.latinName }).from(plants);
  }
  return await db
    .select({ id: plants.id, name: plants.name, latinName: plants.latinName })
    .from(plants)
    .where(notInArray(plants.id, plantIdsWithMolecules));
}

export async function previewEnrichment(): Promise<{
  plantsWithoutMolecules: number;
  plantsCanBeEnriched: Array<{ id: number; name: string; moleculesCount: number }>;
  totalLinksToCreate: number;
}> {
  const plantsWithout = await getPlantsWithoutMolecules();
  const db = await getDb();
  if (!db) return { plantsWithoutMolecules: plantsWithout.length, plantsCanBeEnriched: [], totalLinksToCreate: 0 };
  const allMolecules = await db.select({ id: molecules.id, name: molecules.name }).from(molecules);
  const moleculeMap = new Map(allMolecules.map(m => [m.name.toLowerCase(), m.id]));
  const plantsCanBeEnriched: Array<{ id: number; name: string; moleculesCount: number }> = [];
  let totalLinksToCreate = 0;
  for (const plant of plantsWithout) {
    const composition = findPlantComposition(plant.name);
    if (composition) {
      let matchedMolecules = 0;
      for (const comp of composition) {
        if (moleculeMap.has(comp.molecule.toLowerCase())) matchedMolecules++;
      }
      if (matchedMolecules > 0) {
        plantsCanBeEnriched.push({ id: plant.id, name: plant.name, moleculesCount: matchedMolecules });
        totalLinksToCreate += matchedMolecules;
      }
    }
  }
  return { plantsWithoutMolecules: plantsWithout.length, plantsCanBeEnriched, totalLinksToCreate };
}

export async function executeEnrichment(): Promise<{
  plantsEnriched: number;
  linksCreated: number;
  errors: string[];
}> {
  const db = await getDb();
  if (!db) return { plantsEnriched: 0, linksCreated: 0, errors: ['Database not available'] };
  const errors: string[] = [];
  let plantsEnriched = 0;
  let linksCreated = 0;
  const allMolecules = await db.select({ id: molecules.id, name: molecules.name }).from(molecules);
  const moleculeMap = new Map(allMolecules.map(m => [m.name.toLowerCase(), m.id]));
  const plantsWithout = await getPlantsWithoutMolecules();
  for (const plant of plantsWithout) {
    const composition = findPlantComposition(plant.name);
    if (!composition) continue;
    let plantLinksCreated = 0;
    for (const comp of composition) {
      const moleculeId = moleculeMap.get(comp.molecule.toLowerCase());
      if (!moleculeId) continue;
      try {
        const existing = await db
          .select()
          .from(plantMolecules)
          .where(sql`${plantMolecules.plantId} = ${plant.id} AND ${plantMolecules.moleculeId} = ${moleculeId}`)
          .limit(1);
        if (existing.length === 0) {
          await db.insert(plantMolecules).values({
            plantId: plant.id,
            moleculeId: moleculeId,
            percentage: comp.percentage ?? null,
          });
          plantLinksCreated++;
          linksCreated++;
        }
      } catch (error: any) {
        errors.push(`Erreur pour ${plant.name} - ${comp.molecule}: ${(error instanceof Error ? error.message : String(error))}`);
      }
    }
    if (plantLinksCreated > 0) plantsEnriched++;
  }
  return { plantsEnriched, linksCreated, errors };
}

export async function getCompositionStats(): Promise<{
  totalPlants: number;
  plantsWithMolecules: number;
  plantsWithoutMolecules: number;
  coveragePercentage: number;
  documentedPlants: number;
}> {
  const db = await getDb();
  if (!db) return { totalPlants: 0, plantsWithMolecules: 0, plantsWithoutMolecules: 0, coveragePercentage: 0, documentedPlants: 0 };
  const [totalResult] = await db.select({ count: sql<number>`count(*)` }).from(plants);
  const totalPlants = totalResult.count;
  const plantsWithout = await getPlantsWithoutMolecules();
  const plantsWithoutMolecules = plantsWithout.length;
  const plantsWithMolecules = totalPlants - plantsWithoutMolecules;
  return {
    totalPlants,
    plantsWithMolecules,
    plantsWithoutMolecules,
    coveragePercentage: totalPlants > 0 ? Math.round((plantsWithMolecules / totalPlants) * 1000) / 10 : 0,
    documentedPlants: Object.keys(PLANT_COMPOSITIONS).length,
  };
}
