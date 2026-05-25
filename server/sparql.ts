/**
 * NOSE Phase 5 — Service SPARQL
 * ================================
 * Permet des requêtes croisées entre PERFUMUM et :
 * - Wikidata SPARQL endpoint (https://query.wikidata.org/sparql)
 * - Europeana API (via Wikidata depictions / Europeana linked data)
 *
 * Requêtes disponibles :
 * 1. Publications scientifiques citant une molécule PERFUMUM (Wikidata)
 * 2. Propriétés chimiques et usages documentés d'une molécule (Wikidata)
 * 3. Plantes PERFUMUM dans des collections muséales / herbiers (Wikidata)
 * 4. Œuvres d'art liées à une plante (Wikidata)
 * 5. Requête SPARQL libre (mode expert)
 */

const WIKIDATA_SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

// Timeout pour les requêtes SPARQL (45s — Wikidata peut être lent)
const SPARQL_TIMEOUT_MS = 45_000;

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

export interface MoleculeWikidataInfo {
  qid: string;
  label: string;
  description?: string;
  iupacName?: string;
  casNumber?: string;
  molecularFormula?: string;
  molecularMass?: string;
  boilingPoint?: string;
  meltingPoint?: string;
  inchi?: string;
  smiles?: string;
  image?: string;
  wikidataUrl: string;
  // Usages documentés
  usedIn?: string[];
  foundIn?: string[];
  // Propriétés olfactives
  odorDescriptors?: string[];
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
 * Requête 1 : Publications scientifiques citant une molécule PERFUMUM
 * Recherche via le QID Wikidata de la molécule — résultats réels disponibles
 */
export async function findPapersForMolecule(
  wikidataQid: string,
  moleculeName: string,
  limit = 20
): Promise<ScientificPaperResult[]> {
  // Requête élargie : sujet principal OU composant chimique OU étudié dans
  const sparql = `
SELECT DISTINCT ?paper ?paperLabel ?doi ?date ?journalLabel ?authorLabel WHERE {
  {
    ?paper wdt:P921 wd:${wikidataQid} .
  } UNION {
    ?paper wdt:P527 wd:${wikidataQid} .
  } UNION {
    ?paper wdt:P2860 wd:${wikidataQid} .
  }
  ?paper wdt:P31 wd:Q13442814 .
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
 * Requête 2 : Propriétés chimiques et usages documentés d'une molécule sur Wikidata
 * Retourne les données structurées disponibles (formule, CAS, SMILES, usages, etc.)
 */
export async function findMoleculeWikidataInfo(
  wikidataQid: string,
  moleculeName: string
): Promise<MoleculeWikidataInfo | null> {
  const sparql = `
SELECT DISTINCT
  ?item ?itemLabel ?itemDescription
  ?iupac ?cas ?formula ?mass ?boiling ?melting ?inchi ?smiles ?image
  ?usedInLabel ?foundInLabel
WHERE {
  BIND(wd:${wikidataQid} AS ?item)
  OPTIONAL { ?item wdt:P2561 ?iupac . }
  OPTIONAL { ?item wdt:P231 ?cas . }
  OPTIONAL { ?item wdt:P274 ?formula . }
  OPTIONAL { ?item wdt:P2067 ?mass . }
  OPTIONAL { ?item wdt:P2102 ?boiling . }
  OPTIONAL { ?item wdt:P2101 ?melting . }
  OPTIONAL { ?item wdt:P234 ?inchi . }
  OPTIONAL { ?item wdt:P233 ?smiles . }
  OPTIONAL { ?item wdt:P18 ?image . }
  OPTIONAL { ?item wdt:P366 ?usedIn . }
  OPTIONAL { ?item wdt:P1582 ?foundIn . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT 20
  `.trim();

  try {
    const results = await executeSparqlQuery(sparql);
    if (!results.results.bindings.length) return null;

    const b = results.results.bindings[0];
    const usedIn = [...new Set(results.results.bindings
      .map(r => r.usedInLabel?.value)
      .filter(Boolean) as string[])];
    const foundIn = [...new Set(results.results.bindings
      .map(r => r.foundInLabel?.value)
      .filter(Boolean) as string[])];

    return {
      qid: wikidataQid,
      label: b.itemLabel?.value || moleculeName,
      description: b.itemDescription?.value,
      iupacName: b.iupac?.value,
      casNumber: b.cas?.value,
      molecularFormula: b.formula?.value,
      molecularMass: b.mass?.value,
      boilingPoint: b.boiling?.value,
      meltingPoint: b.melting?.value,
      inchi: b.inchi?.value,
      smiles: b.smiles?.value,
      image: b.image?.value,
      wikidataUrl: `https://www.wikidata.org/wiki/${wikidataQid}`,
      usedIn,
      foundIn,
    };
  } catch (e) {
    console.error(`[SPARQL] findMoleculeWikidataInfo error for ${wikidataQid}:`, e);
    return null;
  }
}

/**
 * Requête 3 : Œuvres d'art liées à une molécule (via sujet principal ou matériau)
 * Requête plus large que "depicts" — inclut les parfums, compositions, etc.
 */
export async function findArtworksForMolecule(
  wikidataQid: string,
  moleculeName: string,
  limit = 20
): Promise<ArtworkResult[]> {
  // Chercher les parfums/compositions qui contiennent cette molécule
  // OU les œuvres dont c'est le sujet principal
  const sparql = `
SELECT DISTINCT ?artwork ?artworkLabel ?image ?creatorLabel ?date ?collectionLabel ?europeana WHERE {
  {
    ?artwork wdt:P921 wd:${wikidataQid} .
  } UNION {
    ?artwork wdt:P186 wd:${wikidataQid} .
  } UNION {
    ?artwork wdt:P527 wd:${wikidataQid} .
  } UNION {
    ?artwork wdt:P180 wd:${wikidataQid} .
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
      moleculeName,
      moleculeQid: wikidataQid,
    }));
  } catch (e) {
    console.error(`[SPARQL] findArtworksForMolecule error for ${wikidataQid}:`, e);
    return [];
  }
}

/**
 * Requête 4 : Collections muséales / herbiers contenant une plante PERFUMUM
 * Cherche les spécimens d'herbier, illustrations botaniques, et collections
 */
export async function findCollectionsForPlant(
  wikidataQid: string,
  plantName: string,
  limit = 20
): Promise<PlantCollectionResult[]> {
  // Chercher : spécimens d'herbier, illustrations botaniques, taxons dans des collections
  const sparql = `
SELECT DISTINCT ?item ?itemLabel ?collectionLabel ?countryLabel ?image WHERE {
  {
    ?item wdt:P180 wd:${wikidataQid} .
  } UNION {
    ?item wdt:P921 wd:${wikidataQid} .
  } UNION {
    ?item wdt:P527 wd:${wikidataQid} .
  } UNION {
    ?item wdt:P703 wd:${wikidataQid} .
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
 * Requête 5 : Molécules PERFUMUM présentes dans des œuvres d'art (batch)
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
    ?artwork wdt:P921 ?molecule .
  } UNION {
    ?artwork wdt:P186 ?molecule .
  } UNION {
    ?artwork wdt:P180 ?molecule .
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
 * Requête 6 : Requête SPARQL libre (mode expert)
 */
export async function executeFreeSparqlQuery(
  sparql: string
): Promise<{ vars: string[]; bindings: SparqlBinding[]; error?: string }> {
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
 * Requête 7 : Statistiques NOSE — combien de molécules PERFUMUM ont des données Wikidata
 */
export async function getNoseStats(qids: string[]): Promise<{
  totalWithArtworks: number;
  totalWithPapers: number;
  sampleArtworks: ArtworkResult[];
}> {
  if (!qids.length) return { totalWithArtworks: 0, totalWithPapers: 0, sampleArtworks: [] };

  const sample = qids.slice(0, 50);
  const valuesClause = sample.map((q) => `wd:${q}`).join(" ");

  const sparqlArtworks = `
SELECT (COUNT(DISTINCT ?molecule) AS ?count) WHERE {
  VALUES ?molecule { ${valuesClause} }
  { ?artwork wdt:P921 ?molecule . } UNION { ?artwork wdt:P186 ?molecule . } UNION { ?artwork wdt:P180 ?molecule . }
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

    const sampleArtworks = await findArtworksForMoleculesBatch(sample.slice(0, 10), 6);

    return { totalWithArtworks, totalWithPapers, sampleArtworks };
  } catch (e) {
    console.error("[SPARQL] getNoseStats error:", e);
    return { totalWithArtworks: 0, totalWithPapers: 0, sampleArtworks: [] };
  }
}
