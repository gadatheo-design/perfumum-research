import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const visualizationsRouter = router({
  // Données pour le graphique masse moléculaire vs point d'ébullition
  getMolecularWeightVsBoilingPoint: publicProcedure.query(async () => {
    const molecules = await db.getAllMolecules();
    
    return molecules
      .filter(m => m.molecularWeight && m.boilingPoint)
      .map(m => ({
        id: m.id,
        name: m.name,
        molecularWeight: m.molecularWeight,
        boilingPoint: m.boilingPoint,
        chemicalClass: m.chemicalClass || 'other',
        family: m.family || 'Inconnue',
      }));
  }),
  
  // Données pour le graphique classe chimique vs famille olfactive
  getChemicalClassVsOlfactiveFamily: publicProcedure.query(async () => {
    const molecules = await db.getAllMolecules();
    
    // Créer une matrice de corrélation
    const matrix: Record<string, Record<string, number>> = {};
    
    for (const m of molecules) {
      const chemClass = m.chemicalClass || 'other';
      const family = m.family || 'Inconnue';
      
      if (!matrix[chemClass]) {
        matrix[chemClass] = {};
      }
      matrix[chemClass][family] = (matrix[chemClass][family] || 0) + 1;
    }
    
    // Convertir en format pour heatmap
    const data: Array<{ chemicalClass: string; family: string; count: number }> = [];
    
    for (const [chemClass, families] of Object.entries(matrix)) {
      for (const [family, count] of Object.entries(families)) {
        data.push({ chemicalClass: chemClass, family, count });
      }
    }
    
    return {
      data,
      chemicalClasses: Object.keys(matrix),
      families: Array.from(new Set(molecules.map(m => m.family || 'Inconnue'))),
    };
  }),
  
  // Distribution des propriétés moléculaires
  getMolecularPropertyDistribution: publicProcedure
    .input(z.object({
      property: z.enum(['molecularWeight', 'boilingPoint', 'logP', 'complexity', 'intensity']),
    }))
    .query(async ({ input }) => {
      const molecules = await db.getAllMolecules();
      
      const values = molecules
        .map(m => m[input.property] as number | null)
        .filter((v): v is number => v !== null && v !== undefined);
      
      if (values.length === 0) {
        return { bins: [], min: 0, max: 0, mean: 0, median: 0 };
      }
      
      const min = Math.min(...values);
      const max = Math.max(...values);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const sorted = [...values].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      
      // Créer des bins pour l'histogramme
      const binCount = 20;
      const binSize = (max - min) / binCount;
      const bins: Array<{ min: number; max: number; count: number }> = [];
      
      for (let i = 0; i < binCount; i++) {
        const binMin = min + i * binSize;
        const binMax = min + (i + 1) * binSize;
        const count = values.filter(v => v >= binMin && v < binMax).length;
        bins.push({ min: binMin, max: binMax, count });
      }
      
      return { bins, min, max, mean, median };
    }),
  
  // Corrélation entre deux propriétés
  getPropertyCorrelation: publicProcedure
    .input(z.object({
      propertyX: z.enum(['molecularWeight', 'boilingPoint', 'logP', 'complexity', 'intensity', 'volatility']),
      propertyY: z.enum(['molecularWeight', 'boilingPoint', 'logP', 'complexity', 'intensity', 'volatility']),
    }))
    .query(async ({ input }) => {
      const molecules = await db.getAllMolecules();
      
      const points = molecules
        .filter(m => m[input.propertyX] !== null && m[input.propertyY] !== null)
        .map(m => ({
          id: m.id,
          name: m.name,
          x: m[input.propertyX] as number,
          y: m[input.propertyY] as number,
          chemicalClass: m.chemicalClass || 'other',
        }));
      
      // Calculer le coefficient de corrélation de Pearson
      if (points.length < 2) {
        return { points, correlation: 0, rSquared: 0 };
      }
      
      const n = points.length;
      const sumX = points.reduce((a, p) => a + p.x, 0);
      const sumY = points.reduce((a, p) => a + p.y, 0);
      const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
      const sumX2 = points.reduce((a, p) => a + p.x * p.x, 0);
      const sumY2 = points.reduce((a, p) => a + p.y * p.y, 0);
      
      const numerator = n * sumXY - sumX * sumY;
      const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
      
      const correlation = denominator === 0 ? 0 : numerator / denominator;
      const rSquared = correlation * correlation;
      
      return { points, correlation: Math.round(correlation * 1000) / 1000, rSquared: Math.round(rSquared * 1000) / 1000 };
    }),
  
  // Statistiques par classe chimique
  getStatsByChemicalClass: publicProcedure.query(async () => {
    const molecules = await db.getAllMolecules();
    
    const statsByClass: Record<string, {
      count: number;
      avgMolecularWeight: number;
      avgBoilingPoint: number;
      avgLogP: number;
      families: string[];
    }> = {};
    
    for (const m of molecules) {
      const chemClass = m.chemicalClass || 'other';
      
      if (!statsByClass[chemClass]) {
        statsByClass[chemClass] = {
          count: 0,
          avgMolecularWeight: 0,
          avgBoilingPoint: 0,
          avgLogP: 0,
          families: [],
        };
      }
      
      statsByClass[chemClass].count++;
      if (m.molecularWeight) statsByClass[chemClass].avgMolecularWeight += m.molecularWeight;
      if (m.boilingPoint) statsByClass[chemClass].avgBoilingPoint += m.boilingPoint;
      if (m.logP) statsByClass[chemClass].avgLogP += m.logP;
      if (m.family && !statsByClass[chemClass].families.includes(m.family)) {
        statsByClass[chemClass].families.push(m.family);
      }
    }
    
    // Calculer les moyennes
    for (const chemClass of Object.keys(statsByClass)) {
      const stats = statsByClass[chemClass];
      const count = stats.count;
      stats.avgMolecularWeight = Math.round(stats.avgMolecularWeight / count);
      stats.avgBoilingPoint = Math.round(stats.avgBoilingPoint / count);
      stats.avgLogP = Math.round(stats.avgLogP / count);
    }
    
    return statsByClass;
  }),
});
