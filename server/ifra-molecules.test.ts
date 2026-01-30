import { describe, it, expect } from "vitest";
import { 
  searchIfraRestrictionsByName, 
  getIfraStats,
  createLeafEconomy,
  updateLeafEconomy,
  getLeafEconomyById,
  deleteLeafEconomy
} from "./db";

describe("IFRA Restrictions - Molécules ajoutées", () => {
  it("devrait trouver les 4 nouvelles molécules avec restrictions IFRA", async () => {
    const moleculeNames = ["Géraniol", "Citronellol", "Méthyl-eugénol", "Bergaptène"];
    
    for (const name of moleculeNames) {
      const restrictions = await searchIfraRestrictionsByName(name);
      expect(restrictions.length, `Aucune restriction trouvée pour ${name}`).toBeGreaterThan(0);
    }
  });

  it("devrait avoir des restrictions correctes pour Géraniol", async () => {
    const restrictions = await searchIfraRestrictionsByName("Géraniol");
    expect(restrictions.length).toBeGreaterThan(0);
    
    const geraniol = restrictions[0];
    // Le retour est { restriction: {...}, molecule: {...} }
    expect(geraniol.restriction.restrictionType).toBe("restricted");
    expect(geraniol.restriction.reasonForRestriction).toContain("Allergène");
  });

  it("devrait avoir des restrictions correctes pour Citronellol", async () => {
    const restrictions = await searchIfraRestrictionsByName("Citronellol");
    expect(restrictions.length).toBeGreaterThan(0);
    
    const citronellol = restrictions[0];
    expect(citronellol.restriction.restrictionType).toBe("restricted");
  });

  it("devrait avoir des restrictions très strictes pour Méthyl-eugénol", async () => {
    const restrictions = await searchIfraRestrictionsByName("Méthyl-eugénol");
    expect(restrictions.length).toBeGreaterThan(0);
    
    const methylEugenol = restrictions[0];
    expect(methylEugenol.restriction.restrictionType).toBe("restricted");
    expect(methylEugenol.restriction.reasonForRestriction).toContain("cancérogène");
    // Limite très basse pour le méthyl-eugénol
    expect(Number(methylEugenol.restriction.category4)).toBeLessThan(0.001);
  });

  it("devrait avoir des restrictions pour Bergaptène avec phototoxicité", async () => {
    const restrictions = await searchIfraRestrictionsByName("Bergaptène");
    expect(restrictions.length).toBeGreaterThan(0);
    
    const bergaptene = restrictions[0];
    expect(bergaptene.restriction.restrictionType).toBe("restricted");
    expect(bergaptene.restriction.reasonForRestriction).toContain("Phototoxicité");
  });

  it("devrait retourner les statistiques IFRA mises à jour", async () => {
    const stats = await getIfraStats();
    expect(stats).toBeDefined();
    // Le champ est 'total' et non 'totalRestrictions'
    expect(stats?.total).toBeGreaterThanOrEqual(4);
  });
});

describe("Leaf Economies - Champ imageUrl", () => {
  it("devrait pouvoir créer un échantillon avec imageUrl", async () => {
    const testSample = {
      sampleId: `TEST-IMG-${Date.now()}`,
      category: "aromatique" as const,
      imageUrl: "https://example.com/test-image.jpg",
    };
    
    const created = await createLeafEconomy(testSample);
    expect(created).toBeDefined();
    expect(created?.id).toBeGreaterThan(0);
    
    // Vérifier que l'imageUrl est bien enregistrée
    expect(created?.imageUrl).toBe(testSample.imageUrl);
    
    // Nettoyer
    if (created?.id) {
      await deleteLeafEconomy(created.id);
    }
  });

  it("devrait pouvoir mettre à jour imageUrl d'un échantillon existant", async () => {
    // Créer un échantillon de test
    const testSample = {
      sampleId: `TEST-IMG-UPDATE-${Date.now()}`,
      category: "aromatique" as const,
    };
    
    const created = await createLeafEconomy(testSample);
    expect(created).toBeDefined();
    expect(created?.id).toBeGreaterThan(0);
    
    const createdId = created!.id;
    
    // Mettre à jour avec une image
    const newImageUrl = "https://example.com/updated-image.jpg";
    await updateLeafEconomy(createdId, { imageUrl: newImageUrl });
    
    // Vérifier la mise à jour
    const updated = await getLeafEconomyById(createdId);
    expect(updated?.imageUrl).toBe(newImageUrl);
    
    // Nettoyer
    await deleteLeafEconomy(createdId);
  });
});
