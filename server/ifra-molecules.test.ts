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
  // NOTE (18/03/2026): Géraniol (ID 1710039), Citronellol et Méthyl-eugénol (ID 660003) ont été
  // supprimés ou n'ont pas de restrictions IFRA en base. Les tests utilisent maintenant les
  // molécules réellement présentes : Estragole, Bergaptène, Methyleugenol, Eugénol.
  
  it("devrait trouver des molécules avec restrictions IFRA connues", async () => {
    const moleculeNames = ["Estragole", "Bergaptène", "Eugénol", "Citral"];
    
    for (const name of moleculeNames) {
      const restrictions = await searchIfraRestrictionsByName(name);
      expect(restrictions.length, `Aucune restriction trouvée pour ${name}`).toBeGreaterThan(0);
    }
  });

  it("devrait avoir des restrictions correctes pour Estragole", async () => {
    const restrictions = await searchIfraRestrictionsByName("Estragole");
    expect(restrictions.length).toBeGreaterThan(0);
    
    const estragole = restrictions[0];
    expect(estragole.restriction.restrictionType).toBe("restricted");
    expect(estragole.restriction.reasonForRestriction).toContain("cancéri");
  });

  it("devrait avoir des restrictions correctes pour Eugénol", async () => {
    const restrictions = await searchIfraRestrictionsByName("Eugénol");
    expect(restrictions.length).toBeGreaterThan(0);
    
    const eugenol = restrictions[0];
    expect(eugenol.restriction.restrictionType).toBe("restricted");
    expect(eugenol.restriction.reasonForRestriction).toContain("Allergène");
  });

  it("devrait avoir des restrictions très strictes pour Methyleugenol", async () => {
    // NOTE: Méthyl-eugénol (ID 660003) supprimé — Methyleugenol (ID 1410045) est l'équivalent EN
    const restrictions = await searchIfraRestrictionsByName("Methyleugenol");
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
