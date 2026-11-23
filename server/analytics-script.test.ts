import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { stripAnalyticsScript } from "./_core/analyticsScript";

const template = fs.readFileSync(path.resolve(process.cwd(), "client/index.html"), "utf8");

describe("script d'analyse (umami) dans index.html", () => {
  it("le gabarit contient bien la balise conditionnée par VITE_ANALYTICS_ENDPOINT", () => {
    // Si ce test échoue, le gabarit a changé : revoir stripAnalyticsScript.
    expect(template).toMatch(/<script[^>]*%VITE_ANALYTICS_ENDPOINT%\/umami/);
  });

  it("retire la balise quand la variable est absente ou vide", () => {
    for (const endpoint of [undefined, "", "   "]) {
      const html = stripAnalyticsScript(template, endpoint);
      expect(html).not.toContain("VITE_ANALYTICS_ENDPOINT");
      expect(html).not.toContain("VITE_ANALYTICS_WEBSITE_ID");
      expect(html).not.toContain("umami");
      // Le reste de la page est intact.
      expect(html).toContain('<script type="module" src="/src/main.tsx"></script>');
      expect(html).toContain("</body>");
      expect(html.length).toBeGreaterThan(template.length - 200);
    }
  });

  it("ne touche à rien quand la variable est définie", () => {
    expect(stripAnalyticsScript(template, "https://stats.exemple.invalid")).toBe(template);
  });
});
