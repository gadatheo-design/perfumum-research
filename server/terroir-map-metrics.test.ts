import { describe, expect, it } from "vitest";
import {
  countKoppenAssignments,
  countValidTerroirCoordinates,
  hasValidTerroirCoordinates,
} from "../client/src/lib/terroirMapMetrics";

describe("métriques carte terroirs", () => {
  it("compte les coordonnées GPS valides indépendamment des affectations Köppen", () => {
    expect(hasValidTerroirCoordinates({ latitude: "-0.2280000", longitude: "15.8277000" })).toBe(true);
    expect(hasValidTerroirCoordinates({ latitude: null, longitude: "15.8277000" })).toBe(false);
    expect(hasValidTerroirCoordinates({ latitude: "91", longitude: "15.8277000" })).toBe(false);
    expect(countValidTerroirCoordinates([{ latitude: "0", longitude: "0" }, { latitude: null, longitude: "1" }])).toBe(1);
  });

  it("désigne le total de zones Köppen comme des affectations, jamais comme des marqueurs", () => {
    expect(countKoppenAssignments([{ count: 427 }, { count: "357" }, { count: 1 }])).toBe(785);
  });
});
