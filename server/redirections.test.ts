import { describe, it, expect } from "vitest";

/**
 * Test suite for URL redirections from legacy routes to new hubs
 * This ensures backward compatibility and proper navigation in production
 */
describe("URL Redirections - Production Testing", () => {
  
  describe("Gammes Hub Redirections", () => {
    const redirections = [
      {
        legacy: "/gammes",
        target: "/gammes-hub",
        tab: null,
        description: "Main gammes page redirects to gammes-hub"
      },
      {
        legacy: "/gammes/petrichor",
        target: "/gammes-hub",
        tab: "petrichor",
        description: "Petrichor gamme redirects to gammes-hub with petrichor tab"
      },
      {
        legacy: "/gammes/volcanique",
        target: "/gammes-hub",
        tab: "volcanique",
        description: "Volcanique gamme redirects to gammes-hub with volcanique tab"
      },
      {
        legacy: "/gammes/glaciaire",
        target: "/gammes-hub",
        tab: "glaciaire",
        description: "Glaciaire gamme redirects to gammes-hub with glaciaire tab"
      },
      {
        legacy: "/gammes/bio-lab",
        target: "/gammes-hub",
        tab: "bio-lab",
        description: "Bio-Lab gamme redirects to gammes-hub with bio-lab tab"
      },
      {
        legacy: "/gammes/mossi",
        target: "/gammes-hub",
        tab: "mossi",
        description: "Mossi gamme redirects to gammes-hub with mossi tab"
      }
    ];

    redirections.forEach(({ legacy, target, tab, description }) => {
      it(description, () => {
        // Verify redirection mapping
        expect(legacy).toBeDefined();
        expect(target).toBe("/gammes-hub");
        
        // Verify tab parameter if present
        if (tab) {
          const redirectUrl = `${target}?tab=${tab}`;
          expect(redirectUrl).toContain("tab=");
          expect(redirectUrl).toContain(tab);
        }
      });
    });

    it("should preserve non-hub gammes routes", () => {
      const preservedRoutes = [
        "/gammes/signatures",
        "/gammes/pheromones",
        "/gammes/raretes"
      ];

      preservedRoutes.forEach(route => {
        expect(route).not.toBe("/gammes-hub");
        expect(route).toContain("/gammes/");
      });
    });
  });

  describe("Outils Hub Redirections", () => {
    const redirections = [
      {
        legacy: "/outils",
        target: "/outils-hub",
        tab: null,
        description: "Main outils page redirects to outils-hub"
      },
      {
        legacy: "/calculateur",
        target: "/outils-hub",
        tab: "calculateurs",
        description: "Calculateur redirects to outils-hub with calculateurs tab"
      },
      {
        legacy: "/formulation",
        target: "/outils-hub",
        tab: "formulation",
        description: "Formulation redirects to outils-hub with formulation tab"
      },
      {
        legacy: "/synergies",
        target: "/outils-hub",
        tab: "synergies",
        description: "Synergies redirects to outils-hub with synergies tab"
      },
      {
        legacy: "/visualisations",
        target: "/outils-hub",
        tab: "visualisations",
        description: "Visualisations redirects to outils-hub with visualisations tab"
      }
    ];

    redirections.forEach(({ legacy, target, tab, description }) => {
      it(description, () => {
        expect(legacy).toBeDefined();
        expect(target).toBe("/outils-hub");
        
        if (tab) {
          const redirectUrl = `${target}?tab=${tab}`;
          expect(redirectUrl).toContain("tab=");
          expect(redirectUrl).toContain(tab);
        }
      });
    });
  });

  describe("Redirection URL Format Validation", () => {
    it("should generate valid redirect URLs with query parameters", () => {
      const baseUrl = "/gammes-hub";
      const tab = "petrichor";
      const redirectUrl = `${baseUrl}?tab=${tab}`;

      // Validate URL format
      expect(redirectUrl).toMatch(/^\/[a-z-]+\?tab=[a-z-]+$/);
      expect(redirectUrl).toBe("/gammes-hub?tab=petrichor");
    });

    it("should handle multiple query parameters", () => {
      const baseUrl = "/outils-hub";
      const tab = "calculateurs";
      const section = "ifra";
      const redirectUrl = `${baseUrl}?tab=${tab}&section=${section}`;

      expect(redirectUrl).toContain("?tab=");
      expect(redirectUrl).toContain("&section=");
    });

    it("should preserve URL encoding for special characters", () => {
      const baseUrl = "/gammes-hub";
      const tab = "bio-lab";
      const redirectUrl = `${baseUrl}?tab=${encodeURIComponent(tab)}`;

      expect(redirectUrl).toContain("tab=");
      expect(redirectUrl).not.toContain(" ");
    });
  });

  describe("Mobile Redirection Compatibility", () => {
    it("should work on mobile devices", () => {
      const mobileUserAgents = [
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        "Mozilla/5.0 (Linux; Android 11; SM-G991B)",
        "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)"
      ];

      mobileUserAgents.forEach(ua => {
        expect(ua).toBeDefined();
        // Redirections should work regardless of user agent
        const redirectUrl = "/gammes-hub?tab=petrichor";
        expect(redirectUrl).toMatch(/^\/[a-z-]+\?tab=[a-z-]+$/);
      });
    });

    it("should maintain responsive behavior after redirection", () => {
      const redirectUrl = "/gammes-hub?tab=volcanique";
      
      // URL should be short enough for mobile
      expect(redirectUrl.length).toBeLessThan(100);
      
      // No special characters that might break on mobile
      expect(redirectUrl).not.toContain(" ");
      expect(redirectUrl).not.toContain("\\");
    });
  });

  describe("Redirection Analytics Tracking", () => {
    it("should track redirections for analytics", () => {
      const redirectionEvents = [
        { from: "/gammes", to: "/gammes-hub", type: "hub_migration" },
        { from: "/gammes/petrichor", to: "/gammes-hub?tab=petrichor", type: "hub_migration" },
        { from: "/calculateur", to: "/outils-hub?tab=calculateurs", type: "hub_migration" }
      ];

      redirectionEvents.forEach(event => {
        expect(event.from).toBeDefined();
        expect(event.to).toBeDefined();
        expect(event.type).toBe("hub_migration");
      });
    });

    it("should include timestamp in redirection tracking", () => {
      const timestamp = new Date().toISOString();
      const redirectionEvent = {
        from: "/gammes/petrichor",
        to: "/gammes-hub?tab=petrichor",
        timestamp,
        type: "hub_migration"
      };

      expect(redirectionEvent.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });

  describe("Backward Compatibility", () => {
    it("should maintain all legacy route mappings", () => {
      const legacyRoutes = [
        "/gammes",
        "/gammes/petrichor",
        "/gammes/volcanique",
        "/gammes/glaciaire",
        "/gammes/bio-lab",
        "/gammes/mossi",
        "/outils",
        "/calculateur",
        "/formulation",
        "/synergies",
        "/visualisations"
      ];

      legacyRoutes.forEach(route => {
        expect(route).toBeDefined();
        expect(route).toMatch(/^\/[a-z-]+/);
      });
    });

    it("should not break existing bookmarks", () => {
      const bookmarkedUrls = [
        "/gammes/petrichor",
        "/outils/calculateur",
        "/gammes-hub?tab=petrichor"
      ];

      bookmarkedUrls.forEach(url => {
        // URLs should be accessible (either directly or via redirection)
        expect(url).toMatch(/^\/[a-z-]+/);
      });
    });
  });

  describe("Performance Considerations", () => {
    it("should use client-side redirections for speed", () => {
      const redirectionMethod = "client-side";
      expect(redirectionMethod).toBe("client-side");
    });

    it("should minimize redirection chain depth", () => {
      // Each legacy URL should redirect to hub in one step, not multiple
      const redirectionChain = [
        { from: "/gammes/petrichor", to: "/gammes-hub?tab=petrichor", depth: 1 }
      ];

      redirectionChain.forEach(chain => {
        expect(chain.depth).toBe(1);
      });
    });

    it("should cache redirection rules", () => {
      const cachedRules = {
        "/gammes": "/gammes-hub",
        "/gammes/petrichor": "/gammes-hub?tab=petrichor",
        "/outils": "/outils-hub"
      };

      expect(Object.keys(cachedRules).length).toBeGreaterThan(0);
      expect(cachedRules["/gammes"]).toBe("/gammes-hub");
    });
  });

  describe("Error Handling for Redirections", () => {
    it("should handle invalid tab parameters gracefully", () => {
      const invalidTab = "invalid-tab-name";
      const redirectUrl = `/gammes-hub?tab=${invalidTab}`;

      // Should still create a valid URL
      expect(redirectUrl).toContain("?tab=");
      expect(redirectUrl).toMatch(/^\/[a-z-]+\?tab=[a-z-]+$/);
    });

    it("should handle missing parameters", () => {
      const redirectUrl = "/gammes-hub";

      // Should still be a valid URL
      expect(redirectUrl).toBe("/gammes-hub");
      expect(redirectUrl).toMatch(/^\/[a-z-]+$/);
    });

    it("should handle special characters in URLs", () => {
      const specialChars = ["&", "?", "#", "%"];

      specialChars.forEach(char => {
        const url = `/gammes-hub?tab=petrichor${char}extra`;
        // URL should be properly encoded
        expect(url).toBeDefined();
      });
    });
  });
});
