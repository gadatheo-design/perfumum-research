/**
 * NOSE Phase 5 — Service SPARQL
 * ================================
 * Permet des requêtes croisées entre PERFUMUM et :
 * - Wikidata SPARQL endpoint (https://query.wikidata.org/sparql)
 * - Europeana API (via Wikidata depictions / Europeana linked data)
 *
 * Requêtes disponibles :
 * 1. Œuvres d'art Europeana contenant une molécule PERFUMUM
 * 2. Plantes PERFUMUM dans des collections muséales
 * 3. Molécules PERFUMUM citées dans des publications scientifiques (Wikidata)
 * 4. Requête SPARQL libre (mode expert)
 */

const WIKIDATA_SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";
const EUROPEANA_API_BASE = "https://api.europeana.eu/record/v2";

// Timeout pour les requêtes SPARQL (30s)
const SPARQL_TIMEOUT_MS = 30_000;

// Headers requis par Wikidata
const SPARQL_HEADERS = {
  Accept: "application/sparql-results+json",
  "User-Agent": "PERFUMUM-Research/1.0 (https://perfumum.research; contact@perfumum.research)",
};

export interface SparqlBinding {
  [key: string]: {
    type: "uri" | "literal" | "bnode";
    value: string;
    datatype?: string;
    "xml:lang"?: string;
  };
}

export interface SparqlResults {
  head: { vars: string[] };
  results: { bindings: SparqlBinding[] };
}

export interface ArtworkResult {
  qid: string;
  label: string;
  image?: string;
  creator?: string;
  date?: string;
  collection?: string;
  europeanaUrl?: string;
  wikidataUrl: string;
  moleculeName: string;
  moleculeQid: string;
}

export interface ScientificPaperResult {
  qid: string;
  title: string;
  doi?: string;
  date?: string;
  journal?: string;
  authors?: string;
  wikidataUrl: string;
  moleculeName: string;
  moleculeQid: string;
}

export interface PlantCollectionResult {
  qid: string;
  label: string;
  collection?: string;
  country?: string;
  image?: string;
  wikidataUrl: string;
  plantName: string;
  plantQid: string;
}

/**
 * Exécute une requête SPARQL sur Wikidata
 */
export async function executeSparqlQuery(sparql: string): Promise<SparqlResults> {
  const url = new URL(WIKIDATA_SPARQL_ENDPOINT);
  url.searchParams.set("query", sparql);
  url.searchParams.set("format", "json");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SPARQL_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      headers: SPARQL_HEADERS,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`SPARQL HTTP ${response.status}: ${await response.text()}`);
    }

    return await response.json() as SparqlResults;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Requête 1 : Œuvres d'art Europeana/musées contenant une molécule PERFUMUM
 * Cherche les œuvres d'art qui dépeignent ou sont liées à la molécule via Wikidata
 */
export async function findArtworksForMolecule(
  wikidataQid: string,
  moleculeName: string,
  limit = 20
): Promise<ArtworkResult[]> {
  const sparql = `
SELECT DISTINCT ?artwork ?artworkLabel ?image ?creatorLabel ?date ?collectionLabel ?europeana WHERE {
  # Œuvres liées à la molécule (via dépiction, sujet, ou ingrédient)
  {
    ?artwork wdt:P180 wd:${wikidataQid} .  # depicts
  } UNION {
    ?artwork wdt:P921 wd:${wikidataQid} .  # main subject
  } UNION {
    ?artwork wdt:P186 wd:${wikidataQid} .  # made from material
  }
  
  # Filtrer sur les œuvres d'art / objets culturels
  ?artwork wdt:P31/wdt:P279* wd:Q838948 .  # instance of artwork
  
  OPTIONAL { ?artwork wdt:P18 ?image . }
  OPTIONAL { ?artwork wdt:P170 ?creator . }
  OPTIONAL { ?artwork wdt:P571 ?date . }
  OPTIONAL { ?artwork wdt:P195 ?collection . }
  OPTIONAL { ?artwork wdt:P727 ?europeana . }  # Europeana ID
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT ${limit}
  `.trim();

  try {
    const results = await executeSparqlQuery(sparql);
    return results.results.bindings.map((b) => ({
      qid: b.artwork?.value.split("/").pop() || "",
      label: b.artworkLabel?.value || "Sans titre",
      image: b.image?.value,
      creator: b.creatorLabel?.value,
      date: b.date?.value?.substring(0, 10),
      collection: b.collectionLabel?.value,
      europeanaUrl: b.europeana?.value
        ? `https://www.europeana.eu/item/${b.europeana.value}`
        : undefined,
      wikidataUrl: b.artwork?.value || "",
      moleculeName,
      moleculeQid: wikidataQid,
    }));
  } catch (e) {
    console.error(`[SPARQL] findArtworksForMolecule error for ${wikidataQid}:`, e);
    return [];
  }
}

/**
 * Requête 2 : Publications scientifiques citant une molécule PERFUMUM
 */
export async function findPapersForMolecule(
  wikidataQid: string,
  moleculeName: string,
  limit = 20
): Promise<ScientificPaperResult[]> {
  const sparql = `
SELECT DISTINCT ?paper ?paperLabel ?doi ?date ?journalLabel ?authorLabel WHERE {
  {
    ?paper wdt:P921 wd:${wikidataQid} .  # main subject
  } UNION {
    ?paper wdt:P527 wd:${wikidataQid} .  # has part
  }
  
  # Filtrer sur les articles scientifiques
  ?paper wdt:P31 wd:Q13442814 .  # scholarly article
  
  OPTIONAL { ?paper wdt:P356 ?doi . }
  OPTIONAL { ?paper wdt:P577 ?date . }
  OPTIONAL { ?paper wdt:P1433 ?journal . }
  OPTIONAL { ?paper wdt:P50 ?author . }
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
ORDER BY DESC(?date)
LIMIT ${limit}
  `.trim();

  try {
    const results = await executeSparqlQuery(sparql);
    return results.results.bindings.map((b) => ({
      qid: b.paper?.value.split("/").pop() || "",
      title: b.paperLabel?.value || "Sans titre",
      doi: b.doi?.value,
      date: b.date?.value?.substring(0, 10),
      journal: b.journalLabel?.value,
      authors: b.authorLabel?.value,
      wikidataUrl: b.paper?.value || "",
      moleculeName,
      moleculeQid: wikidataQid,
    }));
  } catch (e) {
    console.error(`[SPARQL] findPapersForMolecule error for ${wikidataQid}:`, e);
    return [];
  }
}

/**
 * Requête 3 : Collections muséales contenant une plante PERFUMUM
 */
export async function findCollectionsForPlant(
  wikidataQid: string,
  plantName: string,
  limit = 20
): Promise<PlantCollectionResult[]> {
  const sparql = `
SELECT DISTINCT ?item ?itemLabel ?collectionLabel ?countryLabel ?image WHERE {
  {
    ?item wdt:P180 wd:${wikidataQid} .  # depicts
  } UNION {
    ?item wdt:P921 wd:${wikidataQid} .  # main subject
  } UNION {
    ?item wdt:P527 wd:${wikidataQid} .  # has part (herbier)
  }
  
  OPTIONAL { ?item wdt:P195 ?collection . }
  OPTIONAL { ?item wdt:P17 ?country . }
  OPTIONAL { ?item wdt:P18 ?image . }
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT ${limit}
  `.trim();

  try {
    const results = await executeSparqlQuery(sparql);
    return results.results.bindings.map((b) => ({
      qid: b.item?.value.split("/").pop() || "",
      label: b.itemLabel?.value || "Sans titre",
      collection: b.collectionLabel?.value,
      country: b.countryLabel?.value,
      image: b.image?.value,
      wikidataUrl: b.item?.value || "",
      plantName,
      plantQid: wikidataQid,
    }));
  } catch (e) {
    console.error(`[SPARQL] findCollectionsForPlant error for ${wikidataQid}:`, e);
    return [];
  }
}

/**
 * Requête 4 : Molécules PERFUMUM présentes dans des œuvres d'art (batch)
 * Prend une liste de QIDs et retourne les œuvres associées
 */
export async function findArtworksForMoleculesBatch(
  qids: string[],
  limit = 50
): Promise<ArtworkResult[]> {
  if (!qids.length) return [];
  
  const valuesClause = qids.map((q) => `wd:${q}`).join(" ");
  
  const sparql = `
SELECT DISTINCT ?molecule ?moleculeLabel ?artwork ?artworkLabel ?image ?creatorLabel ?date ?collectionLabel ?europeana WHERE {
  VALUES ?molecule { ${valuesClause} }
  
  {
    ?artwork wdt:P180 ?molecule .
  } UNION {
    ?artwork wdt:P921 ?molecule .
  }
  
  OPTIONAL { ?artwork wdt:P18 ?image . }
  OPTIONAL { ?artwork wdt:P170 ?creator . }
  OPTIONAL { ?artwork wdt:P571 ?date . }
  OPTIONAL { ?artwork wdt:P195 ?collection . }
  OPTIONAL { ?artwork wdt:P727 ?europeana . }
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT ${limit}
  `.trim();

  try {
    const results = await executeSparqlQuery(sparql);
    return results.results.bindings.map((b) => ({
      qid: b.artwork?.value.split("/").pop() || "",
      label: b.artworkLabel?.value || "Sans titre",
      image: b.image?.value,
      creator: b.creatorLabel?.value,
      date: b.date?.value?.substring(0, 10),
      collection: b.collectionLabel?.value,
      europeanaUrl: b.europeana?.value
        ? `https://www.europeana.eu/item/${b.europeana.value}`
        : undefined,
      wikidataUrl: b.artwork?.value || "",
      moleculeName: b.moleculeLabel?.value || "",
      moleculeQid: b.molecule?.value.split("/").pop() || "",
    }));
  } catch (e) {
    console.error(`[SPARQL] findArtworksForMoleculesBatch error:`, e);
    return [];
  }
}

/**
 * Requête 5 : Requête SPARQL libre (mode expert)
 * Valide et exécute une requête SPARQL arbitraire
 */
export async function executeFreeSparqlQuery(
  sparql: string
): Promise<{ vars: string[]; bindings: SparqlBinding[]; error?: string }> {
  // Validation basique de sécurité (pas d'UPDATE, DELETE, INSERT)
  const normalized = sparql.toUpperCase().trim();
  if (
    normalized.startsWith("INSERT") ||
    normalized.startsWith("DELETE") ||
    normalized.startsWith("UPDATE") ||
    normalized.startsWith("DROP") ||
    normalized.startsWith("CREATE")
  ) {
    return {
      vars: [],
      bindings: [],
      error: "Seules les requêtes SELECT et ASK sont autorisées",
    };
  }

  try {
    const results = await executeSparqlQuery(sparql);
    return {
      vars: results.head.vars,
      bindings: results.results.bindings,
    };
  } catch (e) {
    return {
      vars: [],
      bindings: [],
      error: e instanceof Error ? e.message : "Erreur SPARQL inconnue",
    };
  }
}

/**
 * Requête 6 : Statistiques NOSE — combien de molécules PERFUMUM ont des œuvres d'art
 */
export async function getNoseStats(qids: string[]): Promise<{
  totalWithArtworks: number;
  totalWithPapers: number;
  sampleArtworks: ArtworkResult[];
}> {
  if (!qids.length) return { totalWithArtworks: 0, totalWithPapers: 0, sampleArtworks: [] };
  
  // Limiter à 50 QIDs pour éviter les timeouts SPARQL
  const sample = qids.slice(0, 50);
  const valuesClause = sample.map((q) => `wd:${q}`).join(" ");
  
  const sparqlArtworks = `
SELECT (COUNT(DISTINCT ?molecule) AS ?count) WHERE {
  VALUES ?molecule { ${valuesClause} }
  { ?artwork wdt:P180 ?molecule . } UNION { ?artwork wdt:P921 ?molecule . }
}
  `.trim();

  const sparqlPapers = `
SELECT (COUNT(DISTINCT ?molecule) AS ?count) WHERE {
  VALUES ?molecule { ${valuesClause} }
  ?paper wdt:P921 ?molecule .
  ?paper wdt:P31 wd:Q13442814 .
}
  `.trim();

  try {
    const [artRes, papRes] = await Promise.all([
      executeSparqlQuery(sparqlArtworks),
      executeSparqlQuery(sparqlPapers),
    ]);

    const totalWithArtworks = parseInt(
      artRes.results.bindings[0]?.count?.value || "0"
    );
    const totalWithPapers = parseInt(
      papRes.results.bindings[0]?.count?.value || "0"
    );

    // Quelques exemples d'œuvres
    const sampleArtworks = await findArtworksForMoleculesBatch(sample.slice(0, 10), 6);

    return { totalWithArtworks, totalWithPapers, sampleArtworks };
  } catch (e) {
    console.error("[SPARQL] getNoseStats error:", e);
    return { totalWithArtworks: 0, totalWithPapers: 0, sampleArtworks: [] };
  }
}
