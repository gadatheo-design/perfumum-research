import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const networkGraphRouter = router({
  // Données complètes pour le graphe de réseau
  getFullNetworkData: publicProcedure.query(async () => {
    const dbInstance = await db.getDb();
    if (!dbInstance) return { nodes: [], links: [] };
    
    const nodes: Array<{
      id: string;
      name: string;
      type: 'plant' | 'terroir' | 'molecule' | 'rawMaterial';
      data?: Record<string,unknown>;
    }> = [];
    
    const links: Array<{
      source: string;
      target: string;
      type: 'plant-terroir' | 'plant-molecule' | 'rawMaterial-terroir' | 'rawMaterial-molecule';
      value?: number;
    }> = [];
    
    // Récupérer les plantes
    const plants = await db.getAllPlants();
    plants.forEach((plant) => {
      nodes.push({
        id: `plant-${plant.id}`,
        name: plant.name,
        type: 'plant',
        data: { latinName: plant.latinName, category: plant.category },
      });
    });
    
    // Récupérer les terroirs
    const terroirs = await db.getAllTerroirs();
    terroirs.forEach((terroir) => {
      nodes.push({
        id: `terroir-${terroir.id}`,
        name: terroir.name,
        type: 'terroir',
        data: { country: terroir.country, region: terroir.region, climateType: terroir.climateType },
      });
    });
    
    // Récupérer les relations plantes-terroirs
    const allPlants = await db.getAllPlants();
    const plantTerroirLinks: Array<{ plantId: number; terroirId: number }> = [];
    
    // Récupérer les terroirs de chaque plante
    for (const plant of allPlants.slice(0, 50)) {
      const plantTerroirs = await db.getPlantTerroirs(plant.id);
      plantTerroirs.forEach((pt: Record<string,unknown>) => {
        plantTerroirLinks.push({ plantId: plant.id, terroirId: pt.terroirId as number });
      });
    }
    
    plantTerroirLinks.forEach((rel: { plantId: number; terroirId: number }) => {
      links.push({
        source: `plant-${rel.plantId}`,
        target: `terroir-${rel.terroirId}`,
        type: 'plant-terroir',
      });
    });
    
    // Récupérer les molécules principales
    const molecules = await db.getAllMolecules();
    molecules.slice(0, 100).forEach(mol => {
      nodes.push({
        id: `molecule-${mol.id}`,
        name: mol.name,
        type: 'molecule',
        data: { family: mol.family, chemicalClass: mol.chemicalClass },
      });
    });
    
    // Récupérer les relations plantes-molécules
    const plantMoleculeLinks: Array<{ plantId: number; moleculeId: number; percentageTypical: number }> = [];
    
    for (const plant of allPlants.slice(0, 50)) {
      const plantMols = await db.getPlantMolecules(plant.id);
      plantMols.forEach((pm: Record<string,unknown>) => {
        const pmMol = pm.molecule as Record<string,unknown> | undefined;
        if (pmMol && molecules.slice(0, 100).some(m => m.id === pmMol.id)) {
          plantMoleculeLinks.push({ 
            plantId: plant.id, 
            moleculeId: pmMol.id as number,
            percentageTypical: Number(pm.percentageTypical) || 1
          });
        }
      });
    }
    
    plantMoleculeLinks.forEach((rel) => {
      links.push({
        source: `plant-${rel.plantId}`,
        target: `molecule-${rel.moleculeId}`,
        type: 'plant-molecule',
        value: rel.percentageTypical,
      });
    });
    
    // Récupérer les matières premières
    const rawMaterials = await db.getAllRawMaterials();
    rawMaterials.forEach((rm) => {
      nodes.push({
        id: `rawMaterial-${rm.id}`,
        name: rm.name,
        type: 'rawMaterial',
        data: { category: rm.category, plantPart: rm.plantPart },
      });
      
      // Lien vers le terroir
      if (rm.terroirId) {
        links.push({
          source: `rawMaterial-${rm.id}`,
          target: `terroir-${rm.terroirId}`,
          type: 'rawMaterial-terroir',
        });
      }
      
      // Lien vers la plante
      if (rm.plantId) {
        links.push({
          source: `rawMaterial-${rm.id}`,
          target: `plant-${rm.plantId}`,
          type: 'plant-molecule',
        });
      }
    });
    
    return { nodes, links };
  }),
  
  // Données filtrées par type
  getFilteredNetworkData: publicProcedure
    .input(z.object({
      showPlants: z.boolean().default(true),
      showTerroirs: z.boolean().default(true),
      showMolecules: z.boolean().default(true),
      showRawMaterials: z.boolean().default(false),
      countryFilter: z.string().optional(),
      categoryFilter: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const dbInstance = await db.getDb();
      if (!dbInstance) return { nodes: [], links: [] };
      
      const nodes: Array<{
        id: string;
        name: string;
        type: 'plant' | 'terroir' | 'molecule' | 'rawMaterial';
        data?: Record<string,unknown>;
      }> = [];
      
      const links: Array<{
        source: string;
        target: string;
        type: string;
        value?: number;
      }> = [];
      
      // Récupérer les plantes si demandé
      if (input.showPlants) {
        const plants = await db.getAllPlants();
        const filteredPlants = input.categoryFilter 
          ? plants.filter((p) => p.category === input.categoryFilter)
          : plants;
        
        filteredPlants.forEach((plant) => {
          nodes.push({
            id: `plant-${plant.id}`,
            name: plant.name,
            type: 'plant',
            data: { latinName: plant.latinName, category: plant.category },
          });
        });
      }
      
      // Récupérer les terroirs si demandé
      if (input.showTerroirs) {
        const terroirs = await db.getAllTerroirs();
        const filteredTerroirs = input.countryFilter
          ? terroirs.filter((t) => t.country === input.countryFilter)
          : terroirs;
        
        filteredTerroirs.forEach((terroir) => {
          nodes.push({
            id: `terroir-${terroir.id}`,
            name: terroir.name,
            type: 'terroir',
            data: { country: terroir.country, region: terroir.region },
          });
        });
      }
      
      // Récupérer les molécules si demandé
      if (input.showMolecules) {
        const molecules = await db.getAllMolecules();
        molecules.slice(0, 50).forEach(mol => {
          nodes.push({
            id: `molecule-${mol.id}`,
            name: mol.name,
            type: 'molecule',
            data: { family: mol.family },
          });
        });
      }
      
      // Récupérer les relations plantes-terroirs
      if (input.showPlants && input.showTerroirs) {
        const plantIds = new Set(nodes.filter(n => n.type === 'plant').map(n => parseInt(n.id.split('-')[1])));
        const terroirIds = new Set(nodes.filter(n => n.type === 'terroir').map(n => parseInt(n.id.split('-')[1])));
        
        // Récupérer les terroirs de chaque plante
        for (const plantId of Array.from(plantIds)) {
          const plantTerroirs = await db.getPlantTerroirs(plantId);
          plantTerroirs.forEach((pt: Record<string,unknown>) => {
            if (terroirIds.has(pt.terroirId as number)) {
              links.push({
                source: `plant-${plantId}`,
                target: `terroir-${pt.terroirId}`,
                type: 'plant-terroir',
              });
            }
          });
        }
      }
      
      // Récupérer les relations plantes-molécules
      if (input.showPlants && input.showMolecules) {
        const plantIds = new Set(nodes.filter(n => n.type === 'plant').map(n => parseInt(n.id.split('-')[1])));
        const moleculeIds = new Set(nodes.filter(n => n.type === 'molecule').map(n => parseInt(n.id.split('-')[1])));
        
        // Récupérer les molécules de chaque plante
        for (const plantId of Array.from(plantIds)) {
          const plantMols = await db.getPlantMolecules(plantId);
          plantMols.forEach((pm: Record<string,unknown>) => {
            const pmMol2 = pm.molecule as Record<string,unknown> | undefined;
            if (pmMol2 && moleculeIds.has(pmMol2.id as number)) {
              links.push({
                source: `plant-${plantId}`,
                target: `molecule-${pmMol2.id}`,
                type: 'plant-molecule',
                value: Number(pm.percentageTypical) || 1,
              });
            }
          });
        }
      }
      
      return { nodes, links };
    }),
});
