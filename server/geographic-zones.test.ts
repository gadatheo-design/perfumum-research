import { describe, it, expect } from 'vitest';
import * as db from './db';

describe('Geographic Zones', () => {
  it('should list all geographic zones', async () => {
    const zones = await db.listGeographicZones({});
    expect(zones).toBeDefined();
    expect(Array.isArray(zones)).toBe(true);
    expect(zones.length).toBeGreaterThan(0);
    
    // Vérifier la structure d'une zone
    if (zones.length > 0) {
      const zone = zones[0];
      expect(zone).toHaveProperty('id');
      expect(zone).toHaveProperty('name');
      expect(zone).toHaveProperty('region');
      expect(zone).toHaveProperty('zoneType');
      expect(zone).toHaveProperty('coordinates');
      expect(zone).toHaveProperty('overlayColor');
      expect(zone).toHaveProperty('overlayOpacity');
    }
  });

  it('should filter zones by type', async () => {
    const threatenedZones = await db.listGeographicZones({ zoneType: 'threatened_concentration' });
    expect(threatenedZones).toBeDefined();
    expect(Array.isArray(threatenedZones)).toBe(true);
    
    // Toutes les zones retournées doivent être du type demandé
    threatenedZones.forEach(zone => {
      expect(zone.zoneType).toBe('threatened_concentration');
    });
  });

  it('should filter zones by threat level', async () => {
    const criticalZones = await db.listGeographicZones({ threatLevel: 'critical' });
    expect(criticalZones).toBeDefined();
    expect(Array.isArray(criticalZones)).toBe(true);
    
    // Toutes les zones retournées doivent avoir le niveau de menace demandé
    criticalZones.forEach(zone => {
      expect(zone.threatLevel).toBe('critical');
    });
  });

  it('should have valid coordinates for each zone', async () => {
    const zones = await db.listGeographicZones({});
    
    zones.forEach(zone => {
      // Les coordonnées doivent être un tableau
      expect(Array.isArray(zone.coordinates)).toBe(true);
      
      // Chaque zone doit avoir au moins 3 points (pour former un polygone)
      expect(zone.coordinates.length).toBeGreaterThanOrEqual(3);
      
      // Chaque point doit avoir lat et lng
      zone.coordinates.forEach((coord: any) => {
        expect(coord).toHaveProperty('lat');
        expect(coord).toHaveProperty('lng');
        expect(typeof coord.lat).toBe('number');
        expect(typeof coord.lng).toBe('number');
      });
    });
  });

  it('should have valid overlay properties', async () => {
    const zones = await db.listGeographicZones({});
    
    zones.forEach(zone => {
      // Couleur overlay doit être définie
      expect(zone.overlayColor).toBeDefined();
      expect(typeof zone.overlayColor).toBe('string');
      expect(zone.overlayColor).toMatch(/^#[0-9A-F]{6}$/i);
      
      // Opacité overlay doit être définie
      expect(zone.overlayOpacity).toBeDefined();
      expect(typeof zone.overlayOpacity).toBe('string');
      const opacity = parseFloat(zone.overlayOpacity);
      expect(opacity).toBeGreaterThanOrEqual(0);
      expect(opacity).toBeLessThanOrEqual(1);
    });
  });
});

describe('Plants with GPS coordinates', () => {
  it('should list threatened plants with GPS coordinates', async () => {
    const plants = await db.listThreatenedPlants({});
    expect(plants).toBeDefined();
    expect(Array.isArray(plants)).toBe(true);
    
    // Compter combien de plantes ont des coordonnées GPS
    const plantsWithGPS = plants.filter(plant => 
      plant.latitude !== null && plant.longitude !== null
    );
    
    // Au moins quelques plantes devraient avoir des coordonnées GPS
    expect(plantsWithGPS.length).toBeGreaterThan(0);
    
    // Vérifier que les coordonnées sont valides
    plantsWithGPS.forEach(plant => {
      const lat = parseFloat(plant.latitude!);
      const lng = parseFloat(plant.longitude!);
      
      // Latitude doit être entre -90 et 90
      expect(lat).toBeGreaterThanOrEqual(-90);
      expect(lat).toBeLessThanOrEqual(90);
      
      // Longitude doit être entre -180 et 180
      expect(lng).toBeGreaterThanOrEqual(-180);
      expect(lng).toBeLessThanOrEqual(180);
    });
  });

  it('should have GPS coordinates for critical endangered species', async () => {
    const criticalPlants = await db.listThreatenedPlants({ iucn: 'CR' });
    expect(criticalPlants).toBeDefined();
    
    // Vérifier que certaines espèces critiques ont des coordonnées GPS
    const criticalWithGPS = criticalPlants.filter(plant => 
      plant.latitude !== null && plant.longitude !== null
    );
    
    expect(criticalWithGPS.length).toBeGreaterThan(0);
  });
});
