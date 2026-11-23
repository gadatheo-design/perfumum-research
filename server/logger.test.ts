/**
 * Journalisation — le point critique est le masquage des secrets.
 *
 * Un journal est souvent expédié à un collecteur tiers et conservé
 * longtemps : c'est le pire endroit où laisser fuir un mot de passe ou une
 * clé d'API. La route de connexion reçoit précisément un mot de passe en
 * clair, et plusieurs routeurs manipulent des clés externes.
 */
import { describe, expect, it } from "vitest";
import { __loggerInternals } from "./_core/logger";

const { redact, REDACTED } = __loggerInternals;

describe("masquage des valeurs sensibles", () => {
  it("masque les clés sensibles quelle que soit la casse", () => {
    const out = redact({
      password: "correct-horse",
      PASSWORD: "correct-horse",
      Token: "abc123",
      apiKey: "sk-secret",
      API_KEY: "sk-secret",
      authorization: "Bearer xyz",
      cookie: "app_session_id=…",
      jwt: "eyJ…",
      ADMIN_PASSWORD_HASH: "scrypt$…",
    }) as Record<string, unknown>;

    for (const value of Object.values(out)) {
      expect(value).toBe(REDACTED);
    }
  });

  it("masque en profondeur, pas seulement au premier niveau", () => {
    const out = redact({
      requete: { corps: { email: "a@b.c", password: "secret-profond" } },
    }) as any;

    expect(out.requete.corps.password).toBe(REDACTED);
    // …sans masquer ce qui ne l'est pas.
    expect(out.requete.corps.email).toBe("a@b.c");
  });

  it("masque aussi à l'intérieur des tableaux", () => {
    const out = redact({
      utilisateurs: [{ nom: "Ted", token: "t1" }, { nom: "Ana", token: "t2" }],
    }) as any;

    expect(out.utilisateurs[0].token).toBe(REDACTED);
    expect(out.utilisateurs[1].token).toBe(REDACTED);
    expect(out.utilisateurs[0].nom).toBe("Ted");
  });

  it("préserve les champs non sensibles", () => {
    const out = redact({ method: "POST", status: 200, path: "/api/trpc/x" }) as any;
    expect(out).toEqual({ method: "POST", status: 200, path: "/api/trpc/x" });
  });

  it("sérialise les erreurs au lieu de produire un objet vide", () => {
    // JSON.stringify(new Error()) donne "{}" : sans traitement dédié, tous
    // les journaux d'erreur seraient vides — exactement ce dont on a besoin.
    const err = new Error("échec de connexion");
    (err as NodeJS.ErrnoException).code = "ECONNREFUSED";

    const out = redact({ error: err }) as any;
    expect(out.error.message).toBe("échec de connexion");
    expect(out.error.name).toBe("Error");
    expect(out.error.code).toBe("ECONNREFUSED");
    expect(typeof out.error.stack).toBe("string");
    expect(JSON.stringify(out.error)).not.toBe("{}");
  });

  it("ne boucle pas indéfiniment sur une structure profonde", () => {
    let deep: Record<string, unknown> = { fin: "atteinte" };
    for (let i = 0; i < 20; i++) deep = { niveau: deep };
    expect(() => redact(deep)).not.toThrow();
    expect(JSON.stringify(redact(deep))).toContain("trop profond");
  });

  it("tronque les très grands tableaux", () => {
    const out = redact({ items: Array.from({ length: 500 }, (_, i) => i) }) as any;
    expect(out.items.length).toBe(50);
  });

  it("laisse passer null et undefined sans planter", () => {
    expect(redact(null)).toBeNull();
    expect(redact(undefined)).toBeUndefined();
    expect(() => redact({ a: null, b: undefined })).not.toThrow();
  });
});
