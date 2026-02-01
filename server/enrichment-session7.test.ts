/**
 * Tests pour les fonctionnalités d'enrichissement - Session 7
 * - Service therapeutic
 * - Enrichissement Flavornet étendu
 */

import { describe, it, expect } from "vitest";
import { 
  getTherapeuticData, 
  getTherapeuticStats, 
  searchByProperty, 
  getAllProperties,
  formatTherapeuticProperties 
} from "./therapeutic";
import { 
  getFlavornetData, 
  getFlavornetStats 
} from "./flavornet";

describe("Service Therapeutic", () => {
  it("devrait retourner les statistiques de la base thérapeutique", () => {
    const stats = getTherapeuticStats();
    expect(stats.totalCompounds).toBeGreaterThan(40);
    expect(stats.withProperties).toBeGreaterThan(40);
  });

  it("devrait trouver les données thérapeutiques du linalol", () => {
    const data = getTherapeuticData("Linalol");
    expect(data).toBeDefined();
    expect(data?.properties).toBeDefined();
    expect(data?.properties.length).toBeGreaterThan(0);
  });

  it("devrait trouver les données thérapeutiques par numéro CAS", () => {
    const data = getTherapeuticData("Unknown", "78-70-6"); // CAS du linalol
    expect(data).toBeDefined();
  });

  it("devrait retourner toutes les propriétés thérapeutiques uniques", () => {
    const properties = getAllProperties();
    expect(properties.length).toBeGreaterThan(10);
    // Vérifier que des propriétés courantes sont présentes
    expect(properties.some(p => p.toLowerCase().includes("anti"))).toBe(true);
  });

  it("devrait rechercher par propriété thérapeutique", () => {
    const results = searchByProperty("Antioxydant");
    expect(results.length).toBeGreaterThan(0);
  });

  it("devrait formater les propriétés thérapeutiques correctement", () => {
    const data = getTherapeuticData("Linalol");
    if (data) {
      const formatted = formatTherapeuticProperties(data);
      expect(formatted).toBeDefined();
      expect(formatted.length).toBeGreaterThan(0);
    }
  });
});

describe("Service Flavornet étendu", () => {
  it("devrait avoir plus de 200 composés dans la base", () => {
    const stats = getFlavornetStats();
    expect(stats.totalCompounds).toBeGreaterThan(200);
  });

  it("devrait trouver le limonène par nom", () => {
    const result = getFlavornetData("Limonene");
    expect(result).toBeDefined();
    expect(result?.percepts).toBeDefined();
  });

  it("devrait trouver le linalol par CAS", () => {
    const result = getFlavornetData("Unknown", "78-70-6");
    expect(result).toBeDefined();
  });

  it("devrait avoir des percepts uniques variés", () => {
    const stats = getFlavornetStats();
    expect(stats.withPercepts).toBeGreaterThan(50);
  });
});
