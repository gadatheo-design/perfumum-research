import { describe, it, expect } from "vitest";

const EUROPEANA_API_KEY = process.env.EUROPEANA_API_KEY;
const BASE_URL = "https://api.europeana.eu/record/v2";

describe("Europeana API Key Validation", () => {
  it("should have EUROPEANA_API_KEY configured", () => {
    expect(EUROPEANA_API_KEY).toBeDefined();
    expect(EUROPEANA_API_KEY).not.toBe("");
    expect(typeof EUROPEANA_API_KEY).toBe("string");
  });

  it("should successfully call Europeana Search API with the configured key", async () => {
    if (!EUROPEANA_API_KEY) {
      console.warn("EUROPEANA_API_KEY not set, skipping live API test");
      return;
    }

    const url = `${BASE_URL}/search.json?wskey=${EUROPEANA_API_KEY}&query=rose&rows=1&profile=minimal`;
    const response = await fetch(url);
    const data = await response.json() as { success?: boolean; error?: string; totalResults?: number };

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.error).toBeUndefined();
    expect(typeof data.totalResults).toBe("number");
    expect(data.totalResults).toBeGreaterThan(0);
  }, 15000);

  it("should successfully call Europeana Entity API suggest", async () => {
    if (!EUROPEANA_API_KEY) {
      console.warn("EUROPEANA_API_KEY not set, skipping live API test");
      return;
    }

    const url = `https://api.europeana.eu/entity/suggest?wskey=${EUROPEANA_API_KEY}&text=rose&type=concept&rows=1`;
    const response = await fetch(url);

    // Entity API returns 200 or 404 depending on results — both are valid responses
    expect([200, 404]).toContain(response.status);
  }, 15000);
});
