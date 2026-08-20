/**
 * Connexion autonome — garanties de sécurité et pièges d'intégration.
 *
 * Ces tests ne touchent pas la base : ils portent sur le hachage, la
 * comparaison en temps constant et l'aller-retour de signature de session.
 */
import { describe, expect, it, vi } from "vitest";
import { hashPassword, verifyPassword, LOCAL_ADMIN_OPEN_ID } from "./_core/localAuth";

/** Doit rester aligné sur STANDALONE_APP_ID de _core/localAuth.ts. */
const STANDALONE_APP_ID = "perfumum-standalone";

describe("hachage du mot de passe (scrypt)", () => {
  it("valide le bon mot de passe", () => {
    const hash = hashPassword("une phrase de passe correcte");
    expect(verifyPassword("une phrase de passe correcte", hash)).toBe(true);
  });

  it("rejette un mot de passe erroné", () => {
    const hash = hashPassword("une phrase de passe correcte");
    expect(verifyPassword("une phrase de passe incorrecte", hash)).toBe(false);
  });

  it("produit une empreinte différente à chaque appel (sel aléatoire)", () => {
    const a = hashPassword("identique");
    const b = hashPassword("identique");
    expect(a).not.toBe(b);
    // …tout en restant vérifiables toutes les deux.
    expect(verifyPassword("identique", a)).toBe(true);
    expect(verifyPassword("identique", b)).toBe(true);
  });

  it("ne stocke jamais le mot de passe en clair dans l'empreinte", () => {
    const secret = "phrase-de-passe-tres-reconnaissable";
    expect(hashPassword(secret)).not.toContain(secret);
  });

  it("normalise l'Unicode : une même phrase saisie différemment fonctionne", () => {
    // "é" composé (e + accent combinant) contre "é" précomposé.
    const decomposed = "mot de passe café long";
    const precomposed = "mot de passe café long";
    expect(decomposed).not.toBe(precomposed);
    const hash = hashPassword(decomposed);
    expect(verifyPassword(precomposed, hash)).toBe(true);
  });

  it("refuse une empreinte malformée sans lever d'exception", () => {
    for (const bad of [
      "",
      "pas-une-empreinte",
      "scrypt$1$2$3",
      "bcrypt$65536$8$1$c2VsCg==$aGFzaAo=",
      "scrypt$abc$8$1$c2VsCg==$aGFzaAo=",
      "scrypt$65536$8$1$$",
    ]) {
      expect(() => verifyPassword("peu importe", bad)).not.toThrow();
      expect(verifyPassword("peu importe", bad)).toBe(false);
    }
  });

  it("rejette une empreinte tronquée, même avec le bon mot de passe", () => {
    // Scénario réaliste : l'empreinte a été mal recopiée dans .env (retour à
    // la ligne, caractères perdus). Le décodage base64 étant tolérant, une
    // troncature donne un buffer plus court sans erreur — la vérification
    // porterait alors sur moins d'octets et le bon mot de passe continuerait
    // de fonctionner, masquant l'affaiblissement. On veut un refus net.
    // Note : retirer 1 ou 2 caractères n'ôte que le remplissage base64
    // (« == »), qui ne porte aucune donnée — la valeur décodée reste
    // complète et la vérification réussit à juste titre. La perte réelle
    // commence à 3 caractères.
    const hash = hashPassword("mot de passe valide ici");
    for (const cut of [3, 4, 10, 30]) {
      const truncated = hash.slice(0, hash.length - cut);
      expect(verifyPassword("mot de passe valide ici", truncated)).toBe(false);
    }
  });

  it("rejette une empreinte dont le sel a été altéré en longueur", () => {
    const hash = hashPassword("mot de passe valide ici");
    const parts = hash.split("$");
    parts[4] = Buffer.from("sel-trop-court").toString("base64");
    expect(verifyPassword("mot de passe valide ici", parts.join("$"))).toBe(false);
  });
});

describe("jeton de session en mode standalone", () => {
  // ENV est évalué à l'import du module : positionner JWT_SECRET dans le
  // corps d'un test arriverait trop tard. On réinitialise donc le registre
  // de modules avant de réimporter sdk avec l'environnement voulu.
  async function loadSdkWith(env: Record<string, string | undefined>) {
    const saved: Record<string, string | undefined> = {};
    for (const [k, v] of Object.entries(env)) {
      saved[k] = process.env[k];
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    vi.resetModules();
    const { sdk } = await import("./_core/sdk");
    const restore = () => {
      for (const [k, v] of Object.entries(saved)) {
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      }
      vi.resetModules();
    };
    return { sdk, restore };
  }

  const SECRET = "secret-de-test-suffisamment-long-pour-hs256";

  it("survit à l'aller-retour signature → vérification sans VITE_APP_ID", async () => {
    // C'est le piège que ce test verrouille : sdk.verifySession() rejette
    // tout jeton dont appId est vide. Or en standalone VITE_APP_ID n'est pas
    // défini. Sans valeur de repli, la connexion « réussirait » puis chaque
    // requête suivante serait rejetée — panne silencieuse et déroutante.
    const { sdk, restore } = await loadSdkWith({
      VITE_APP_ID: undefined,
      JWT_SECRET: SECRET,
    });
    try {
      const token = await sdk.signSession(
        {
          openId: LOCAL_ADMIN_OPEN_ID,
          appId: STANDALONE_APP_ID,
          name: "Administrateur",
        },
        { expiresInMs: 60_000 }
      );
      const session = await sdk.verifySession(token);
      expect(session).not.toBeNull();
      expect(session?.openId).toBe(LOCAL_ADMIN_OPEN_ID);
      expect(session?.name).toBe("Administrateur");
    } finally {
      restore();
    }
  });

  it("rejette un jeton dont appId est vide — justification de la valeur de repli", async () => {
    const { sdk, restore } = await loadSdkWith({
      VITE_APP_ID: undefined,
      JWT_SECRET: SECRET,
    });
    try {
      const token = await sdk.signSession(
        { openId: LOCAL_ADMIN_OPEN_ID, appId: "", name: "Administrateur" },
        { expiresInMs: 60_000 }
      );
      expect(await sdk.verifySession(token)).toBeNull();
    } finally {
      restore();
    }
  });

  it("rejette un jeton signé avec un autre secret", async () => {
    const a = await loadSdkWith({ VITE_APP_ID: undefined, JWT_SECRET: SECRET });
    const token = await a.sdk.signSession(
      { openId: LOCAL_ADMIN_OPEN_ID, appId: STANDALONE_APP_ID, name: "Admin" },
      { expiresInMs: 60_000 }
    );
    a.restore();

    const b = await loadSdkWith({
      VITE_APP_ID: undefined,
      JWT_SECRET: "un-tout-autre-secret-de-signature-ici",
    });
    try {
      expect(await b.sdk.verifySession(token)).toBeNull();
    } finally {
      b.restore();
    }
  });
});
