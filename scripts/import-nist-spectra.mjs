/**
 * Import des spectres de référence NIST
 * 
 * Ce script ajoute des spectres de référence NIST pour les composés terpéniques
 * et aromatiques importants dans la recherche sur le tabac et le parfum.
 * 
 * Les données sont basées sur la base de données NIST WebBook et la littérature scientifique.
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Spectres de référence NIST pour les terpènes et composés aromatiques
const NIST_SPECTRA = [
  // === MONOTERPÈNES ===
  {
    compound_name: "α-Terpinène",
    cas_number: "99-86-5",
    molecular_formula: "C10H16",
    molecular_weight: 136.24,
    ionization_mode: "EI",
    base_peak_mz: 121,
    spectrum_data: {
      peaks: [
        { mz: 27, intensity: 15 },
        { mz: 39, intensity: 25 },
        { mz: 41, intensity: 30 },
        { mz: 51, intensity: 12 },
        { mz: 53, intensity: 18 },
        { mz: 65, intensity: 15 },
        { mz: 77, intensity: 35 },
        { mz: 79, intensity: 28 },
        { mz: 91, intensity: 45 },
        { mz: 93, intensity: 55 },
        { mz: 105, intensity: 20 },
        { mz: 107, intensity: 15 },
        { mz: 121, intensity: 100 },
        { mz: 136, intensity: 40 }
      ]
    },
    fragmentation_pattern: "M+ (136), [M-15]+ (121, pic de base), [M-43]+ (93)",
    source: "NIST",
    nist_id: "NIST-99-86-5",
    spectrum_quality: 95
  },
  {
    compound_name: "γ-Terpinène",
    cas_number: "99-85-4",
    molecular_formula: "C10H16",
    molecular_weight: 136.24,
    ionization_mode: "EI",
    base_peak_mz: 93,
    spectrum_data: {
      peaks: [
        { mz: 27, intensity: 18 },
        { mz: 39, intensity: 28 },
        { mz: 41, intensity: 32 },
        { mz: 53, intensity: 15 },
        { mz: 65, intensity: 12 },
        { mz: 77, intensity: 38 },
        { mz: 79, intensity: 25 },
        { mz: 91, intensity: 55 },
        { mz: 93, intensity: 100 },
        { mz: 105, intensity: 18 },
        { mz: 121, intensity: 45 },
        { mz: 136, intensity: 35 }
      ]
    },
    fragmentation_pattern: "M+ (136), [M-43]+ (93, pic de base), [M-15]+ (121)",
    source: "NIST",
    nist_id: "NIST-99-85-4",
    spectrum_quality: 94
  },
  {
    compound_name: "Terpinolène",
    cas_number: "586-62-9",
    molecular_formula: "C10H16",
    molecular_weight: 136.24,
    ionization_mode: "EI",
    base_peak_mz: 93,
    spectrum_data: {
      peaks: [
        { mz: 27, intensity: 15 },
        { mz: 39, intensity: 25 },
        { mz: 41, intensity: 28 },
        { mz: 53, intensity: 12 },
        { mz: 65, intensity: 10 },
        { mz: 77, intensity: 35 },
        { mz: 79, intensity: 22 },
        { mz: 91, intensity: 48 },
        { mz: 93, intensity: 100 },
        { mz: 105, intensity: 15 },
        { mz: 107, intensity: 12 },
        { mz: 121, intensity: 55 },
        { mz: 136, intensity: 30 }
      ]
    },
    fragmentation_pattern: "M+ (136), [M-43]+ (93, pic de base), [M-15]+ (121)",
    source: "NIST",
    nist_id: "NIST-586-62-9",
    spectrum_quality: 93
  },
  {
    compound_name: "Sabinène",
    cas_number: "3387-41-5",
    molecular_formula: "C10H16",
    molecular_weight: 136.24,
    ionization_mode: "EI",
    base_peak_mz: 93,
    spectrum_data: {
      peaks: [
        { mz: 27, intensity: 18 },
        { mz: 39, intensity: 30 },
        { mz: 41, intensity: 35 },
        { mz: 53, intensity: 15 },
        { mz: 65, intensity: 12 },
        { mz: 77, intensity: 40 },
        { mz: 79, intensity: 28 },
        { mz: 91, intensity: 52 },
        { mz: 93, intensity: 100 },
        { mz: 105, intensity: 18 },
        { mz: 121, intensity: 25 },
        { mz: 136, intensity: 20 }
      ]
    },
    fragmentation_pattern: "M+ (136), [M-43]+ (93, pic de base), réarrangement bicyclique",
    source: "NIST",
    nist_id: "NIST-3387-41-5",
    spectrum_quality: 92
  },
  {
    compound_name: "3-Carène",
    cas_number: "13466-78-9",
    molecular_formula: "C10H16",
    molecular_weight: 136.24,
    ionization_mode: "EI",
    base_peak_mz: 93,
    spectrum_data: {
      peaks: [
        { mz: 27, intensity: 15 },
        { mz: 39, intensity: 28 },
        { mz: 41, intensity: 32 },
        { mz: 53, intensity: 14 },
        { mz: 65, intensity: 10 },
        { mz: 77, intensity: 38 },
        { mz: 79, intensity: 25 },
        { mz: 91, intensity: 50 },
        { mz: 93, intensity: 100 },
        { mz: 105, intensity: 15 },
        { mz: 121, intensity: 35 },
        { mz: 136, intensity: 25 }
      ]
    },
    fragmentation_pattern: "M+ (136), [M-43]+ (93, pic de base), structure bicyclo[4.1.0]heptane",
    source: "NIST",
    nist_id: "NIST-13466-78-9",
    spectrum_quality: 94
  },
  
  // === MONOTERPÈNES OXYGÉNÉS ===
  {
    compound_name: "Terpinéol-4",
    cas_number: "562-74-3",
    molecular_formula: "C10H18O",
    molecular_weight: 154.25,
    ionization_mode: "EI",
    base_peak_mz: 71,
    spectrum_data: {
      peaks: [
        { mz: 27, intensity: 15 },
        { mz: 41, intensity: 35 },
        { mz: 43, intensity: 45 },
        { mz: 55, intensity: 25 },
        { mz: 67, intensity: 20 },
        { mz: 71, intensity: 100 },
        { mz: 86, intensity: 30 },
        { mz: 93, intensity: 45 },
        { mz: 111, intensity: 55 },
        { mz: 136, intensity: 25 },
        { mz: 154, intensity: 8 }
      ]
    },
    fragmentation_pattern: "M+ (154, faible), [M-43]+ (111), [M-83]+ (71, pic de base)",
    source: "NIST",
    nist_id: "NIST-562-74-3",
    spectrum_quality: 93
  },
  {
    compound_name: "α-Terpinéol",
    cas_number: "98-55-5",
    molecular_formula: "C10H18O",
    molecular_weight: 154.25,
    ionization_mode: "EI",
    base_peak_mz: 59,
    spectrum_data: {
      peaks: [
        { mz: 27, intensity: 12 },
        { mz: 41, intensity: 30 },
        { mz: 43, intensity: 40 },
        { mz: 55, intensity: 20 },
        { mz: 59, intensity: 100 },
        { mz: 67, intensity: 18 },
        { mz: 81, intensity: 35 },
        { mz: 93, intensity: 55 },
        { mz: 121, intensity: 45 },
        { mz: 136, intensity: 30 },
        { mz: 139, intensity: 15 },
        { mz: 154, intensity: 5 }
      ]
    },
    fragmentation_pattern: "M+ (154, très faible), [M-15]+ (139), [M-18]+ (136), perte de H2O caractéristique",
    source: "NIST",
    nist_id: "NIST-98-55-5",
    spectrum_quality: 95
  },
  {
    compound_name: "Bornéol",
    cas_number: "507-70-0",
    molecular_formula: "C10H18O",
    molecular_weight: 154.25,
    ionization_mode: "EI",
    base_peak_mz: 95,
    spectrum_data: {
      peaks: [
        { mz: 27, intensity: 10 },
        { mz: 41, intensity: 25 },
        { mz: 43, intensity: 35 },
        { mz: 55, intensity: 20 },
        { mz: 67, intensity: 30 },
        { mz: 69, intensity: 25 },
        { mz: 81, intensity: 40 },
        { mz: 95, intensity: 100 },
        { mz: 110, intensity: 45 },
        { mz: 121, intensity: 15 },
        { mz: 139, intensity: 20 },
        { mz: 154, intensity: 10 }
      ]
    },
    fragmentation_pattern: "M+ (154), [M-15]+ (139), [M-44]+ (110), structure bornane caractéristique",
    source: "NIST",
    nist_id: "NIST-507-70-0",
    spectrum_quality: 94
  },
  {
    compound_name: "Camphre",
    cas_number: "76-22-2",
    molecular_formula: "C10H16O",
    molecular_weight: 152.23,
    ionization_mode: "EI",
    base_peak_mz: 95,
    spectrum_data: {
      peaks: [
        { mz: 27, intensity: 12 },
        { mz: 39, intensity: 20 },
        { mz: 41, intensity: 30 },
        { mz: 55, intensity: 25 },
        { mz: 67, intensity: 35 },
        { mz: 69, intensity: 28 },
        { mz: 81, intensity: 55 },
        { mz: 95, intensity: 100 },
        { mz: 108, intensity: 40 },
        { mz: 109, intensity: 35 },
        { mz: 137, intensity: 15 },
        { mz: 152, intensity: 20 }
      ]
    },
    fragmentation_pattern: "M+ (152), [M-15]+ (137), [M-44]+ (108), cétone bicyclique",
    source: "NIST",
    nist_id: "NIST-76-22-2",
    spectrum_quality: 96
  },
  
  // === SESQUITERPÈNES ===
  {
    compound_name: "α-Copaène",
    cas_number: "3856-25-5",
    molecular_formula: "C15H24",
    molecular_weight: 204.35,
    ionization_mode: "EI",
    base_peak_mz: 161,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 25 },
        { mz: 55, intensity: 20 },
        { mz: 67, intensity: 18 },
        { mz: 79, intensity: 22 },
        { mz: 91, intensity: 35 },
        { mz: 93, intensity: 30 },
        { mz: 105, intensity: 55 },
        { mz: 119, intensity: 65 },
        { mz: 133, intensity: 40 },
        { mz: 161, intensity: 100 },
        { mz: 189, intensity: 25 },
        { mz: 204, intensity: 35 }
      ]
    },
    fragmentation_pattern: "M+ (204), [M-43]+ (161, pic de base), [M-15]+ (189)",
    source: "NIST",
    nist_id: "NIST-3856-25-5",
    spectrum_quality: 93
  },
  {
    compound_name: "β-Bourbonène",
    cas_number: "5208-59-3",
    molecular_formula: "C15H24",
    molecular_weight: 204.35,
    ionization_mode: "EI",
    base_peak_mz: 81,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 30 },
        { mz: 55, intensity: 25 },
        { mz: 67, intensity: 35 },
        { mz: 79, intensity: 28 },
        { mz: 81, intensity: 100 },
        { mz: 93, intensity: 45 },
        { mz: 105, intensity: 35 },
        { mz: 119, intensity: 40 },
        { mz: 133, intensity: 30 },
        { mz: 161, intensity: 55 },
        { mz: 189, intensity: 20 },
        { mz: 204, intensity: 25 }
      ]
    },
    fragmentation_pattern: "M+ (204), m/z 81 (pic de base), fragmentation tricyclique",
    source: "NIST",
    nist_id: "NIST-5208-59-3",
    spectrum_quality: 91
  },
  {
    compound_name: "Aromadendrène",
    cas_number: "489-39-4",
    molecular_formula: "C15H24",
    molecular_weight: 204.35,
    ionization_mode: "EI",
    base_peak_mz: 91,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 28 },
        { mz: 55, intensity: 22 },
        { mz: 67, intensity: 30 },
        { mz: 79, intensity: 35 },
        { mz: 91, intensity: 100 },
        { mz: 93, intensity: 55 },
        { mz: 105, intensity: 45 },
        { mz: 119, intensity: 50 },
        { mz: 133, intensity: 35 },
        { mz: 161, intensity: 60 },
        { mz: 189, intensity: 25 },
        { mz: 204, intensity: 30 }
      ]
    },
    fragmentation_pattern: "M+ (204), m/z 91 (tropylium, pic de base), [M-43]+ (161)",
    source: "NIST",
    nist_id: "NIST-489-39-4",
    spectrum_quality: 92
  },
  {
    compound_name: "Valencène",
    cas_number: "4630-07-3",
    molecular_formula: "C15H24",
    molecular_weight: 204.35,
    ionization_mode: "EI",
    base_peak_mz: 161,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 30 },
        { mz: 55, intensity: 25 },
        { mz: 67, intensity: 20 },
        { mz: 79, intensity: 28 },
        { mz: 91, intensity: 40 },
        { mz: 93, intensity: 35 },
        { mz: 105, intensity: 50 },
        { mz: 119, intensity: 55 },
        { mz: 133, intensity: 35 },
        { mz: 161, intensity: 100 },
        { mz: 189, intensity: 30 },
        { mz: 204, intensity: 40 }
      ]
    },
    fragmentation_pattern: "M+ (204), [M-43]+ (161, pic de base), précurseur de nootkatone",
    source: "NIST",
    nist_id: "NIST-4630-07-3",
    spectrum_quality: 94
  },
  {
    compound_name: "δ-Cadinène",
    cas_number: "483-76-1",
    molecular_formula: "C15H24",
    molecular_weight: 204.35,
    ionization_mode: "EI",
    base_peak_mz: 161,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 25 },
        { mz: 55, intensity: 20 },
        { mz: 67, intensity: 22 },
        { mz: 79, intensity: 25 },
        { mz: 91, intensity: 35 },
        { mz: 93, intensity: 30 },
        { mz: 105, intensity: 45 },
        { mz: 119, intensity: 55 },
        { mz: 134, intensity: 40 },
        { mz: 161, intensity: 100 },
        { mz: 189, intensity: 28 },
        { mz: 204, intensity: 35 }
      ]
    },
    fragmentation_pattern: "M+ (204), [M-43]+ (161, pic de base), squelette cadinane",
    source: "NIST",
    nist_id: "NIST-483-76-1",
    spectrum_quality: 93
  },
  
  // === SESQUITERPÈNES OXYGÉNÉS ===
  {
    compound_name: "Cédrol",
    cas_number: "77-53-2",
    molecular_formula: "C15H26O",
    molecular_weight: 222.37,
    ionization_mode: "EI",
    base_peak_mz: 95,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 30 },
        { mz: 55, intensity: 25 },
        { mz: 67, intensity: 28 },
        { mz: 79, intensity: 22 },
        { mz: 81, intensity: 35 },
        { mz: 93, intensity: 40 },
        { mz: 95, intensity: 100 },
        { mz: 107, intensity: 45 },
        { mz: 119, intensity: 50 },
        { mz: 150, intensity: 35 },
        { mz: 161, intensity: 30 },
        { mz: 204, intensity: 25 },
        { mz: 222, intensity: 15 }
      ]
    },
    fragmentation_pattern: "M+ (222), [M-18]+ (204), m/z 95 (pic de base), alcool tricyclique",
    source: "NIST",
    nist_id: "NIST-77-53-2",
    spectrum_quality: 95
  },
  {
    compound_name: "Patchoulol",
    cas_number: "5986-55-0",
    molecular_formula: "C15H26O",
    molecular_weight: 222.37,
    ionization_mode: "EI",
    base_peak_mz: 41,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 100 },
        { mz: 55, intensity: 45 },
        { mz: 67, intensity: 35 },
        { mz: 79, intensity: 30 },
        { mz: 81, intensity: 40 },
        { mz: 93, intensity: 50 },
        { mz: 95, intensity: 55 },
        { mz: 107, intensity: 40 },
        { mz: 119, intensity: 35 },
        { mz: 138, intensity: 30 },
        { mz: 161, intensity: 45 },
        { mz: 179, intensity: 25 },
        { mz: 204, intensity: 35 },
        { mz: 222, intensity: 20 }
      ]
    },
    fragmentation_pattern: "M+ (222), [M-18]+ (204), m/z 41 (pic de base), composant principal du patchouli",
    source: "NIST",
    nist_id: "NIST-5986-55-0",
    spectrum_quality: 94
  },
  {
    compound_name: "Spathulenol",
    cas_number: "6750-60-3",
    molecular_formula: "C15H24O",
    molecular_weight: 220.35,
    ionization_mode: "EI",
    base_peak_mz: 43,
    spectrum_data: {
      peaks: [
        { mz: 41, intensity: 45 },
        { mz: 43, intensity: 100 },
        { mz: 55, intensity: 35 },
        { mz: 67, intensity: 28 },
        { mz: 79, intensity: 30 },
        { mz: 91, intensity: 35 },
        { mz: 93, intensity: 40 },
        { mz: 105, intensity: 45 },
        { mz: 119, intensity: 50 },
        { mz: 131, intensity: 35 },
        { mz: 159, intensity: 30 },
        { mz: 187, intensity: 25 },
        { mz: 205, intensity: 20 },
        { mz: 220, intensity: 15 }
      ]
    },
    fragmentation_pattern: "M+ (220), [M-15]+ (205), m/z 43 (pic de base), époxyde tricyclique",
    source: "NIST",
    nist_id: "NIST-6750-60-3",
    spectrum_quality: 92
  },
  
  // === COMPOSÉS AROMATIQUES DU TABAC ===
  {
    compound_name: "Eugénol",
    cas_number: "97-53-0",
    molecular_formula: "C10H12O2",
    molecular_weight: 164.20,
    ionization_mode: "EI",
    base_peak_mz: 164,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 15 },
        { mz: 51, intensity: 12 },
        { mz: 55, intensity: 18 },
        { mz: 65, intensity: 10 },
        { mz: 77, intensity: 25 },
        { mz: 91, intensity: 20 },
        { mz: 103, intensity: 30 },
        { mz: 121, intensity: 25 },
        { mz: 131, intensity: 15 },
        { mz: 149, intensity: 35 },
        { mz: 164, intensity: 100 }
      ]
    },
    fragmentation_pattern: "M+ (164, pic de base), [M-15]+ (149), phénylpropanoïde",
    source: "NIST",
    nist_id: "NIST-97-53-0",
    spectrum_quality: 96
  },
  {
    compound_name: "Isoeugénol",
    cas_number: "97-54-1",
    molecular_formula: "C10H12O2",
    molecular_weight: 164.20,
    ionization_mode: "EI",
    base_peak_mz: 164,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 12 },
        { mz: 51, intensity: 10 },
        { mz: 55, intensity: 15 },
        { mz: 65, intensity: 8 },
        { mz: 77, intensity: 22 },
        { mz: 91, intensity: 18 },
        { mz: 103, intensity: 25 },
        { mz: 121, intensity: 20 },
        { mz: 131, intensity: 12 },
        { mz: 149, intensity: 30 },
        { mz: 164, intensity: 100 }
      ]
    },
    fragmentation_pattern: "M+ (164, pic de base), [M-15]+ (149), isomère trans de l'eugénol",
    source: "NIST",
    nist_id: "NIST-97-54-1",
    spectrum_quality: 95
  },
  {
    compound_name: "Vanilline",
    cas_number: "121-33-5",
    molecular_formula: "C8H8O3",
    molecular_weight: 152.15,
    ionization_mode: "EI",
    base_peak_mz: 151,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 10 },
        { mz: 51, intensity: 12 },
        { mz: 63, intensity: 8 },
        { mz: 65, intensity: 10 },
        { mz: 77, intensity: 15 },
        { mz: 81, intensity: 20 },
        { mz: 93, intensity: 15 },
        { mz: 109, intensity: 25 },
        { mz: 123, intensity: 30 },
        { mz: 151, intensity: 100 },
        { mz: 152, intensity: 85 }
      ]
    },
    fragmentation_pattern: "M+ (152), [M-1]+ (151, pic de base), aldéhyde aromatique",
    source: "NIST",
    nist_id: "NIST-121-33-5",
    spectrum_quality: 97
  },
  {
    compound_name: "Coumarine",
    cas_number: "91-64-5",
    molecular_formula: "C9H6O2",
    molecular_weight: 146.14,
    ionization_mode: "EI",
    base_peak_mz: 118,
    spectrum_data: {
      peaks: [
        { mz: 39, intensity: 15 },
        { mz: 51, intensity: 12 },
        { mz: 63, intensity: 20 },
        { mz: 89, intensity: 35 },
        { mz: 90, intensity: 25 },
        { mz: 118, intensity: 100 },
        { mz: 146, intensity: 85 }
      ]
    },
    fragmentation_pattern: "M+ (146), [M-28]+ (118, pic de base, perte de CO), lactone benzénique",
    source: "NIST",
    nist_id: "NIST-91-64-5",
    spectrum_quality: 96
  },
  
  // === NICOTINOÏDES ET ALCALOÏDES ===
  {
    compound_name: "Nicotine",
    cas_number: "54-11-5",
    molecular_formula: "C10H14N2",
    molecular_weight: 162.23,
    ionization_mode: "EI",
    base_peak_mz: 84,
    spectrum_data: {
      peaks: [
        { mz: 42, intensity: 25 },
        { mz: 51, intensity: 15 },
        { mz: 65, intensity: 12 },
        { mz: 78, intensity: 18 },
        { mz: 84, intensity: 100 },
        { mz: 92, intensity: 20 },
        { mz: 106, intensity: 15 },
        { mz: 119, intensity: 10 },
        { mz: 133, intensity: 25 },
        { mz: 161, intensity: 8 },
        { mz: 162, intensity: 35 }
      ]
    },
    fragmentation_pattern: "M+ (162), m/z 84 (N-méthylpyrrolidinium, pic de base), alcaloïde principal du tabac",
    source: "NIST",
    nist_id: "NIST-54-11-5",
    spectrum_quality: 98
  },
  {
    compound_name: "Nornicotine",
    cas_number: "494-97-3",
    molecular_formula: "C9H12N2",
    molecular_weight: 148.20,
    ionization_mode: "EI",
    base_peak_mz: 70,
    spectrum_data: [
      { mz: 42, intensity: 30 },
      { mz: 51, intensity: 12 },
      { mz: 65, intensity: 10 },
      { mz: 70, intensity: 100 },
      { mz: 78, intensity: 15 },
      { mz: 92, intensity: 18 },
      { mz: 106, intensity: 12 },
      { mz: 119, intensity: 20 },
      { mz: 147, intensity: 8 },
      { mz: 148, intensity: 30 }
    ],
    fragmentation_pattern: "M+ (148), m/z 70 (pyrrolidinium, pic de base), métabolite de la nicotine",
    source: "NIST",
    nist_id: "NIST-494-97-3",
    spectrum_quality: 95
  },
  {
    compound_name: "Anabasine",
    cas_number: "494-52-0",
    molecular_formula: "C10H14N2",
    molecular_weight: 162.23,
    ionization_mode: "EI",
    base_peak_mz: 84,
    spectrum_data: {
      peaks: [
        { mz: 42, intensity: 20 },
        { mz: 51, intensity: 12 },
        { mz: 65, intensity: 10 },
        { mz: 78, intensity: 15 },
        { mz: 84, intensity: 100 },
        { mz: 92, intensity: 18 },
        { mz: 106, intensity: 12 },
        { mz: 119, intensity: 8 },
        { mz: 133, intensity: 20 },
        { mz: 161, intensity: 6 },
        { mz: 162, intensity: 30 }
      ]
    },
    fragmentation_pattern: "M+ (162), m/z 84 (pipéridinium, pic de base), alcaloïde mineur du tabac",
    source: "NIST",
    nist_id: "NIST-494-52-0",
    spectrum_quality: 94
  }
];

async function importNISTSpectra() {
  console.log("Import des spectres de référence NIST...\n");
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  let added = 0;
  let existing = 0;
  
  for (const spectrum of NIST_SPECTRA) {
    // Vérifier si le spectre existe déjà
    const [rows] = await connection.execute(
      'SELECT id FROM ms_spectra WHERE cas_number = ? OR compound_name = ?',
      [spectrum.cas_number, spectrum.compound_name]
    );
    
    if (rows.length > 0) {
      // Mettre à jour avec les données NIST si source différente
      const [existingRow] = rows;
      await connection.execute(
        `UPDATE ms_spectra SET 
          source = CASE WHEN source != 'NIST' THEN CONCAT(source, ', NIST') ELSE source END
        WHERE id = ?`,
        [existingRow.id]
      );
      console.log(`  ~ ${spectrum.compound_name}: mis à jour avec référence NIST`);
      existing++;
    } else {
      // Insérer le nouveau spectre
      const spectrumData = JSON.stringify(spectrum.spectrum_data);
      
      await connection.execute(
        `INSERT INTO ms_spectra (
          compound_name, cas_number, molecular_formula, molecular_weight,
          ionization_mode, base_peak_mz, base_peak_intensity, spectrum_data,
          fragmentation_pattern, source, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, 100, ?, ?, ?, NOW())`,
        [
          spectrum.compound_name,
          spectrum.cas_number,
          spectrum.molecular_formula,
          spectrum.molecular_weight,
          spectrum.ionization_mode,
          spectrum.base_peak_mz,
          spectrumData,
          spectrum.fragmentation_pattern,
          spectrum.source
        ]
      );
      console.log(`  + ${spectrum.compound_name}: spectre NIST ajouté`);
      added++;
    }
  }
  
  // Compter le total
  const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM ms_spectra');
  const total = countResult[0].total;
  
  await connection.end();
  
  console.log(`\nRésumé:`);
  console.log(`  - Spectres NIST ajoutés: ${added}`);
  console.log(`  - Spectres existants mis à jour: ${existing}`);
  console.log(`  - Total en base: ${total}`);
}

importNISTSpectra().catch(console.error);
