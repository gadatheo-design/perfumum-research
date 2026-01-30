import { describe, it, expect } from "vitest";

describe("Google Analytics Configuration", () => {
  it("should have VITE_GA_MEASUREMENT_ID environment variable set", () => {
    const measurementId = process.env.VITE_GA_MEASUREMENT_ID;
    expect(measurementId).toBeDefined();
    expect(measurementId).not.toBe("");
  });

  it("should have valid GA4 Measurement ID format (G-XXXXXXXXXX)", () => {
    const measurementId = process.env.VITE_GA_MEASUREMENT_ID;
    
    // GA4 Measurement IDs start with "G-" followed by alphanumeric characters
    const ga4Pattern = /^G-[A-Z0-9]{8,12}$/i;
    
    expect(measurementId).toBeDefined();
    if (measurementId) {
      expect(measurementId).toMatch(ga4Pattern);
    }
  });

  it("should not be a placeholder value", () => {
    const measurementId = process.env.VITE_GA_MEASUREMENT_ID;
    
    const placeholders = [
      "G-XXXXXXXXXX",
      "G-123456789",
      "YOUR_MEASUREMENT_ID",
      "PLACEHOLDER",
      "TEST",
    ];
    
    expect(measurementId).toBeDefined();
    if (measurementId) {
      expect(placeholders).not.toContain(measurementId.toUpperCase());
    }
  });
});
