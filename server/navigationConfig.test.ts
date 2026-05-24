/**
 * navigationConfig.test.ts
 * Valide la cohérence et l'intégrité de la configuration de navigation partagée.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

// Lire le fichier navigationConfig.ts comme texte pour valider sa structure
const configPath = resolve(__dirname, "../client/src/config/navigationConfig.ts");
const configContent = readFileSync(configPath, "utf-8");

describe("navigationConfig.ts — intégrité structurelle", () => {
  it("le fichier existe et est non vide", () => {
    expect(configContent.length).toBeGreaterThan(100);
  });

  it("exporte NAV_GROUPS", () => {
    expect(configContent).toContain("export const NAV_GROUPS");
  });

  it("exporte getGroupSections", () => {
    expect(configContent).toContain("export function getGroupSections");
  });

  it("exporte getAllNavItems", () => {
    expect(configContent).toContain("export function getAllNavItems");
  });

  it("contient les 4 triggers principaux", () => {
    const triggers = ["Atelier", "Atlas", "Bibliothèque", "Projet"];
    for (const trigger of triggers) {
      expect(configContent).toContain(`trigger: "${trigger}"`);
    }
  });

  it("contient les catalogues principaux", () => {
    const essentials = ["/molecules", "/recettes", "/terroirs"];
    for (const href of essentials) {
      expect(configContent).toContain(`"${href}"`);
    }
  });

  it("contient les sections Botanique & Patrimoine", () => {
    expect(configContent).toContain("/phylogenetique");
    expect(configContent).toContain("/genealogy");
    expect(configContent).toContain("/osmotheque");
  });

  it("contient les sections Tabac & Cannabis", () => {
    expect(configContent).toContain("/tabacs-niche");
    expect(configContent).toContain("/chemotypes");
  });

  it("contient les sections Sourcing", () => {
    expect(configContent).toContain("/sourcing-hub");
  });

  it("contient les sections Réseaux & Graphes", () => {
    expect(configContent).toContain("/reseau-liaisons");
    expect(configContent).toContain("/correlations");
    expect(configContent).toContain("/visualisations");
  });

  it("contient ABSORBE X", () => {
    expect(configContent).toContain("/absorbe-x");
  });

  it("contient la Tabacothèque avancée", () => {
    expect(configContent).toContain("/tps-genes");
    expect(configContent).toContain("/gcms-chromatograms");
    expect(configContent).toContain("/ms-spectra");
  });

  it("contient le Tableau de complétude dans Projet", () => {
    expect(configContent).toContain("/admin/completude");
  });

  it("les URLs de méthode ABSORBE sont correctes (pas /methodologie/echelle ni /methodologie/gcms)", () => {
    // Vérifier que les anciennes URLs incorrectes ne sont pas présentes
    expect(configContent).not.toContain('href: "/methodologie/echelle"');
    expect(configContent).not.toContain('href: "/methodologie/gcms"');
    // Vérifier que les bonnes URLs sont présentes
    expect(configContent).toContain("/methodologie/echelle-absorbe");
    expect(configContent).toContain("/methodologie/gc-ms");
  });

  it("l'export bibliographique pointe vers /outils/export-bibliographique", () => {
    expect(configContent).toContain("/outils/export-bibliographique");
    expect(configContent).not.toContain('href: "/export-bibliographique"');
  });

  it("Header.tsx référence navigationConfig", () => {
    const headerPath = resolve(__dirname, "../client/src/components/layout/Header.tsx");
    const headerContent = readFileSync(headerPath, "utf-8");
    expect(headerContent).toContain("navigationConfig");
  });

  it("MobileMenu.tsx importe depuis navigationConfig", () => {
    const mobilePath = resolve(__dirname, "../client/src/components/MobileMenu.tsx");
    const mobileContent = readFileSync(mobilePath, "utf-8");
    expect(mobileContent).toContain("navigationConfig");
    expect(mobileContent).toContain("NAV_GROUPS");
    // Ne doit plus contenir de données hardcodées
    expect(mobileContent).not.toContain("mobileMenuSections: MenuSection[]");
  });
});
