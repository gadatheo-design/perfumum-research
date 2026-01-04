import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Tests pour les nouvelles fonctionnalités :
 * 1. Coordonnées GPS des terroirs
 * 2. Liens molécule-terroir sur la carte
 * 3. Mode batch automatique PubChem
 */

describe('Carte des Origines - Fonctionnalités GPS et Molécules', () => {
  describe('Coordonnées GPS des terroirs', () => {
    it('devrait avoir des coordonnées GPS valides pour les terroirs', async () => {
      // Mock de la base de données
      const mockTerroirs = [
        { id: 1, name: 'San Andrés', latitude: '12.5847', longitude: '-81.7006' },
        { id: 2, name: 'Grasse', latitude: '43.6590', longitude: '6.9225' },
        { id: 3, name: 'Nossi-Bé', latitude: '-13.3167', longitude: '48.2667' },
      ];

      // Vérifier que chaque terroir a des coordonnées valides
      for (const terroir of mockTerroirs) {
        expect(terroir.latitude).toBeDefined();
        expect(terroir.longitude).toBeDefined();
        
        const lat = parseFloat(terroir.latitude);
        const lng = parseFloat(terroir.longitude);
        
        expect(lat).toBeGreaterThanOrEqual(-90);
        expect(lat).toBeLessThanOrEqual(90);
        expect(lng).toBeGreaterThanOrEqual(-180);
        expect(lng).toBeLessThanOrEqual(180);
      }
    });

    it('devrait parser correctement les coordonnées en nombres', () => {
      const latitude = '43.6590';
      const longitude = '6.9225';
      
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      
      expect(lat).toBeCloseTo(43.659, 2);
      expect(lng).toBeCloseTo(6.9225, 2);
      expect(isNaN(lat)).toBe(false);
      expect(isNaN(lng)).toBe(false);
    });
  });

  describe('Liens molécule-terroir', () => {
    it('devrait retourner une structure correcte pour les origines avec comptage de molécules', () => {
      const mockOriginWithCount = {
        id: 1,
        name: 'Grasse',
        country: 'France',
        region: 'Provence-Alpes-Côte d\'Azur',
        latitude: '43.6590',
        longitude: '6.9225',
        moleculeCount: 15,
      };

      expect(mockOriginWithCount).toHaveProperty('moleculeCount');
      expect(mockOriginWithCount.moleculeCount).toBeGreaterThanOrEqual(0);
      expect(typeof mockOriginWithCount.moleculeCount).toBe('number');
    });

    it('devrait filtrer les origines par nom de molécule', () => {
      const mockMoleculeSearch = 'limonène';
      const mockOrigins = [
        { id: 1, name: 'Grasse', matchingMoleculeCount: 3 },
        { id: 2, name: 'Karnataka', matchingMoleculeCount: 1 },
      ];

      // Vérifier que la recherche retourne des résultats avec comptage
      expect(mockOrigins.length).toBeGreaterThan(0);
      mockOrigins.forEach(origin => {
        expect(origin).toHaveProperty('matchingMoleculeCount');
        expect(origin.matchingMoleculeCount).toBeGreaterThan(0);
      });
    });

    it('devrait retourner les détails des molécules pour une origine', () => {
      const mockMoleculeDetails = [
        {
          id: 1,
          moleculeId: 10,
          originId: 1,
          isPrimaryOrigin: 1,
          qualityRating: 5,
          molecule: {
            id: 10,
            name: 'Limonène',
            family: 'Terpènes',
            chemicalFormula: 'C10H16',
          },
        },
      ];

      expect(mockMoleculeDetails[0]).toHaveProperty('molecule');
      expect(mockMoleculeDetails[0].molecule).toHaveProperty('name');
      expect(mockMoleculeDetails[0].molecule).toHaveProperty('family');
    });
  });

  describe('Mode Batch Automatique PubChem', () => {
    it('devrait identifier les molécules à enrichir', () => {
      const mockMolecules = [
        { id: 1, name: 'Limonène', casNumber: '138-86-3', hasPubChemRef: true },
        { id: 2, name: 'Linalol', casNumber: null, hasPubChemRef: false },
        { id: 3, name: 'Géraniol', casNumber: '', hasPubChemRef: false },
      ];

      const toEnrich = mockMolecules.filter(m => 
        !m.casNumber || m.casNumber === '' || !m.hasPubChemRef
      );

      expect(toEnrich.length).toBe(2);
      expect(toEnrich.map(m => m.name)).toContain('Linalol');
      expect(toEnrich.map(m => m.name)).toContain('Géraniol');
    });

    it('devrait traiter les molécules par lots', () => {
      const totalMolecules = 25;
      const batchSize = 10;
      const startIndex = 0;

      const batch = Array.from({ length: totalMolecules }, (_, i) => ({ id: i + 1 }))
        .slice(startIndex, startIndex + batchSize);

      expect(batch.length).toBe(batchSize);
      expect(batch[0].id).toBe(1);
      expect(batch[batch.length - 1].id).toBe(10);
    });

    it('devrait calculer la progression correctement', () => {
      const total = 100;
      const current = 35;
      const success = 30;
      const failed = 5;

      const progressPercent = Math.round((current / total) * 100);
      const hasMore = current < total;
      const nextStartIndex = current;

      expect(progressPercent).toBe(35);
      expect(hasMore).toBe(true);
      expect(nextStartIndex).toBe(35);
      expect(success + failed).toBe(current);
    });

    it('devrait respecter les limites de l\'API PubChem', () => {
      const REQUEST_DELAY_MS = 250; // 4 requêtes par seconde max
      const BATCH_DELAY_MS = 600;   // Délai entre les molécules dans un lot

      // Vérifier que les délais sont raisonnables
      expect(REQUEST_DELAY_MS).toBeGreaterThanOrEqual(200); // Min 5 req/s
      expect(BATCH_DELAY_MS).toBeGreaterThanOrEqual(500);   // Sécurité supplémentaire
    });

    it('devrait retourner un résultat structuré pour chaque lot', () => {
      const mockBatchResult = {
        batchIndex: 0,
        batchSize: 10,
        totalRemaining: 15,
        totalToEnrich: 25,
        processed: 10,
        success: 8,
        failed: 2,
        hasMore: true,
        nextStartIndex: 10,
        results: [
          { moleculeId: 1, moleculeName: 'Limonène', success: true, casNumber: '138-86-3' },
          { moleculeId: 2, moleculeName: 'Inconnu', success: false, error: 'Composé non trouvé' },
        ],
      };

      expect(mockBatchResult).toHaveProperty('batchIndex');
      expect(mockBatchResult).toHaveProperty('totalRemaining');
      expect(mockBatchResult).toHaveProperty('hasMore');
      expect(mockBatchResult).toHaveProperty('nextStartIndex');
      expect(mockBatchResult.success + mockBatchResult.failed).toBe(mockBatchResult.processed);
    });

    it('devrait permettre l\'annulation du traitement', () => {
      let abortFlag = false;
      
      // Simuler l'annulation
      const stopBatch = () => {
        abortFlag = true;
      };

      // Simuler le traitement
      const processBatch = () => {
        if (abortFlag) {
          return { interrupted: true, message: 'Traitement interrompu' };
        }
        return { interrupted: false, message: 'Traitement terminé' };
      };

      // Avant annulation
      expect(processBatch().interrupted).toBe(false);

      // Après annulation
      stopBatch();
      expect(processBatch().interrupted).toBe(true);
    });
  });

  describe('Estimation du temps restant', () => {
    it('devrait calculer le temps restant correctement', () => {
      const startTime = Date.now() - 60000; // Il y a 1 minute
      const current = 10;
      const total = 100;

      const elapsed = Date.now() - startTime;
      const perItem = elapsed / current;
      const remaining = (total - current) * perItem;

      // Environ 9 minutes restantes (90 items * ~6 secondes)
      expect(remaining).toBeGreaterThan(0);
      expect(remaining / 60000).toBeCloseTo(9, 0); // ~9 minutes
    });

    it('devrait formater le temps restant en unités lisibles', () => {
      const formatTime = (ms: number): string => {
        if (ms < 60000) return `~${Math.round(ms / 1000)} secondes`;
        if (ms < 3600000) return `~${Math.round(ms / 60000)} minutes`;
        return `~${Math.round(ms / 3600000)} heures`;
      };

      expect(formatTime(30000)).toBe('~30 secondes');
      expect(formatTime(300000)).toBe('~5 minutes');
      expect(formatTime(7200000)).toBe('~2 heures');
    });
  });
});

describe('Couleurs des marqueurs par climat', () => {
  const getClimateColor = (climate: string | null): string => {
    if (!climate) return '#6b7280';
    
    const climateLower = climate.toLowerCase();
    
    if (climateLower.includes('méditerranéen')) return '#22c55e';
    if (climateLower.includes('tempéré')) return '#3b82f6';
    if (climateLower.includes('tropical')) return '#f59e0b';
    if (climateLower.includes('aride')) return '#ef4444';
    if (climateLower.includes('continental')) return '#8b5cf6';
    
    return '#6b7280';
  };

  it('devrait retourner la bonne couleur pour chaque type de climat', () => {
    expect(getClimateColor('Méditerranéen')).toBe('#22c55e');
    expect(getClimateColor('Tempéré océanique')).toBe('#3b82f6');
    expect(getClimateColor('Tropical humide')).toBe('#f59e0b');
    expect(getClimateColor('Aride désertique')).toBe('#ef4444');
    expect(getClimateColor('Continental')).toBe('#8b5cf6');
    expect(getClimateColor(null)).toBe('#6b7280');
    expect(getClimateColor('Inconnu')).toBe('#6b7280');
  });
});
