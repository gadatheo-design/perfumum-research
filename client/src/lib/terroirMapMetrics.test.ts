import { describe, expect, it } from "vitest";
import { countKoppenAssignments, countValidTerroirCoordinates, hasValidTerroirCoordinates } from "./terroirMapMetrics";

describe("métriques de la carte terroirs", () => {
  it("ne confond pas coordonnées absentes, coordonnées invalides et coordonnées GPS valides", () => {
    expect(hasValidTerroirCoordinates({ latitude: "-0.228", longitude: "15.8277" })).toBe(true);
    expect(hasValidTerroirCoordinates({ latitude: null, longitude: "15.8277" })).toBe(false);
    expect(hasValidTerroirCoordinates({ latitude: "91", longitude: "15.8277" })).toBe(false);
    expect(hasValidTerroirCoordinates({ latitude: "texte", longitude: "15.8277" })).toBe(false);
    expect(countValidTerroirCoordinates([{ latitude: "0", longitude: "0" }, { latitude: null, longitude: "1" }])).toBe(1);
  });

  it("désigne le total Köppen comme des affectations et non des plantes uniques", () => {
    expect(countKoppenAssignments([{ count: 427 }, { count: "357" }, { count: 1 }])).toBe(785);
  });
});
