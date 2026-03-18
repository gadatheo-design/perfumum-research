/**
 * NOSE Phase 4 — Service d'enrichissement Wikidata
 * Récupère les QIDs Wikidata pour les molécules et plantes aromatiques
 * Compatible avec l'ontologie Odeuropa (NOSE) et Europeana
 */

const WIKIDATA_SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';
const WIKIDATA_API = 'https://www.wikidata.org/w/api.php';

export interface WikidataResult {
  qid: string;
  label: string;
  description?: string;
  casNumber?: string;
  inchiKey?: string;
  pubchemCid?: string;
  chebiId?: string;
  taxonName?: string;
  gbifId?: string;
}

/**
 * Recherche un QID Wikidata par nom de molécule
 * Utilise l'API wbsearchentities pour la recherche textuelle
 */
export async function searchMoleculeQid(name: string): Promise<WikidataResult | null> {
  try {
    // Essayer d'abord avec le nom exact
    const result = await searchWikidata(name, 'molecule');
    if (result) return result;

    // Normaliser les caractères grecs Unicode (\u03b1/\u03b2/\u03b3/\u03b4) en préfixes ASCII
    const withGreekNormalized = name
      .replace(/\u03b1/g, 'alpha')
      .replace(/\u03b2/g, 'beta')
      .replace(/\u03b3/g, 'gamma')
      .replace(/\u03b4/g, 'delta')
      .replace(/\u03b5/g, 'epsilon')
      .replace(/\u03b6/g, 'zeta')
      .replace(/\u03b7/g, 'eta')
      .replace(/\u03b8/g, 'theta')
      .replace(/\u03b9/g, 'iota')
      .replace(/\u03ba/g, 'kappa')
      .replace(/\u03bb/g, 'lambda')
      .replace(/\u03bc/g, 'mu')
      .replace(/\u03bd/g, 'nu')
      .replace(/\u03be/g, 'xi')
      .replace(/\u03c0/g, 'pi')
      .replace(/\u03c1/g, 'rho')
      .replace(/\u03c3/g, 'sigma')
      .replace(/\u03c4/g, 'tau')
      .replace(/\u03c9/g, 'omega');

    if (withGreekNormalized !== name) {
      const result2 = await searchWikidata(withGreekNormalized, 'molecule');
      if (result2) return result2;
    }

    // Essayer sans accents (pour les noms fran\u00e7ais)
    const withoutAccents = withGreekNormalized
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (withoutAccents !== withGreekNormalized) {
      const result3 = await searchWikidata(withoutAccents, 'molecule');
      if (result3) return result3;
    }

    // Essayer en minuscules (certains noms Wikidata sont en minuscules)
    const lowercase = withoutAccents.toLowerCase();
    if (lowercase !== withoutAccents) {
      const result4 = await searchWikidata(lowercase, 'molecule');
      if (result4) return result4;
    }

    return null;
  } catch (err) {
    console.error(`[Wikidata] Error searching molecule "${name}":`, err);
    return null;
  }
}

/**
 * Recherche un QID Wikidata par nom latin de plante
 */
export async function searchPlantQid(latinName: string): Promise<WikidataResult | null> {
  try {
    return await searchWikidata(latinName, 'plant');
  } catch (err) {
    console.error(`[Wikidata] Error searching plant "${latinName}":`, err);
    return null;
  }
}

/**
 * Recherche générique dans Wikidata via l'API wbsearchentities
 */
async function searchWikidata(query: string, type: 'molecule' | 'plant'): Promise<WikidataResult | null> {
  const params = new URLSearchParams({
    action: 'wbsearchentities',
    search: query,
    language: 'en',
    format: 'json',
    limit: '5',
    type: 'item',
    origin: '*',
  });

  const url = `${WIKIDATA_API}?${params}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'PERFUMUM-Research/1.0 (olfactory database; contact@perfumum.org)' },
  });

  if (!res.ok) return null;
  const data = await res.json() as { search?: Array<{ id: string; label: string; description?: string }> };
  
  if (!data.search || data.search.length === 0) return null;

  // Filtrer selon le type pour éviter les faux positifs
  const candidates = data.search.filter(item => {
    const desc = (item.description || '').toLowerCase();
    if (type === 'molecule') {
      return desc.includes('chemical') || desc.includes('compound') || 
             desc.includes('terpene') || desc.includes('terpenoid') ||
             desc.includes('organic') || desc.includes('molecule') ||
             desc.includes('alkaloid') || desc.includes('flavonoid') ||
             desc.includes('sesquiterpene') || desc.includes('monoterpene') ||
             desc.includes('phenol') || desc.includes('ester') ||
             desc.includes('alcohol') || desc.includes('aldehyde') ||
             desc.includes('ketone') || desc.includes('lactone');
    } else {
      return desc.includes('species') || desc.includes('plant') || 
             desc.includes('genus') || desc.includes('family') ||
             desc.includes('taxon') || desc.includes('herb') ||
             desc.includes('shrub') || desc.includes('tree') ||
             desc.includes('flower') || desc.includes('grass');
    }
  });

  const best = candidates[0] || data.search[0];
  if (!best) return null;

  return {
    qid: best.id,
    label: best.label,
    description: best.description,
  };
}

/**
 * Récupère les propriétés détaillées d'un QID Wikidata
 * (CAS number, InChIKey, PubChem CID, ChEBI ID, GBIF ID, etc.)
 */
export async function getWikidataProperties(qid: string): Promise<Partial<WikidataResult>> {
  try {
    const sparql = `
      SELECT ?cas ?inchikey ?pubchem ?chebi ?gbif WHERE {
        OPTIONAL { wd:${qid} wdt:P231 ?cas. }
        OPTIONAL { wd:${qid} wdt:P235 ?inchikey. }
        OPTIONAL { wd:${qid} wdt:P662 ?pubchem. }
        OPTIONAL { wd:${qid} wdt:P683 ?chebi. }
        OPTIONAL { wd:${qid} wdt:P846 ?gbif. }
      }
      LIMIT 1
    `;

    const url = `${WIKIDATA_SPARQL_ENDPOINT}?query=${encodeURIComponent(sparql)}&format=json`;
    const res = await fetch(url, {
      headers: { 
        'User-Agent': 'PERFUMUM-Research/1.0',
        'Accept': 'application/sparql-results+json',
      },
    });

    if (!res.ok) return {};
    const data = await res.json() as { results?: { bindings?: Array<Record<string, { value: string }>> } };
    const bindings = data.results?.bindings?.[0];
    if (!bindings) return {};

    return {
      casNumber: bindings.cas?.value,
      inchiKey: bindings.inchikey?.value,
      pubchemCid: bindings.pubchem?.value,
      chebiId: bindings.chebi?.value ? `CHEBI:${bindings.chebi.value}` : undefined,
      gbifId: bindings.gbif?.value,
    };
  } catch (err) {
    console.error(`[Wikidata] Error fetching properties for ${qid}:`, err);
    return {};
  }
}

/**
 * Batch enrichissement Wikidata pour les molécules
 * Retourne le nombre de molécules enrichies
 */
export async function enrichMoleculesWikidata(
  db: import('mysql2/promise').Connection,
  limit: number = 50,
  delayMs: number = 500
): Promise<{ enriched: number; failed: number; skipped: number }> {
  const [rows] = await db.execute<import('mysql2').RowDataPacket[]>(
    `SELECT id, name, cas_number, inchi_key FROM molecules 
     WHERE wikidata_qid IS NULL 
     AND name IS NOT NULL
     AND name NOT LIKE '%test%'
     AND name NOT LIKE '%fumée%'
     AND name NOT LIKE '%terre%'
     ORDER BY id
     LIMIT ?`,
    [limit]
  );

  let enriched = 0, failed = 0, skipped = 0;

  for (const row of rows) {
    await new Promise(r => setTimeout(r, delayMs));
    
    const result = await searchMoleculeQid(row.name as string);
    if (!result) {
      failed++;
      continue;
    }

    // Vérifier que le QID n'est pas déjà utilisé (éviter les doublons)
    const [existing] = await db.execute<import('mysql2').RowDataPacket[]>(
      'SELECT id FROM molecules WHERE wikidata_qid = ? AND id != ?',
      [result.qid, row.id]
    );

    if ((existing as unknown[]).length > 0) {
      skipped++;
      continue;
    }

    await db.execute(
      'UPDATE molecules SET wikidata_qid = ?, wikidata_enriched_at = NOW() WHERE id = ?',
      [result.qid, row.id]
    );
    enriched++;
  }

  return { enriched, failed, skipped };
}

/**
 * Batch enrichissement Wikidata pour les plantes
 */
export async function enrichPlantsWikidata(
  db: import('mysql2/promise').Connection,
  limit: number = 50,
  delayMs: number = 500
): Promise<{ enriched: number; failed: number; skipped: number }> {
  const [rows] = await db.execute<import('mysql2').RowDataPacket[]>(
    `SELECT id, latin_name FROM plants 
     WHERE wikidata_qid IS NULL 
     AND latin_name IS NOT NULL
     ORDER BY id
     LIMIT ?`,
    [limit]
  );

  let enriched = 0, failed = 0, skipped = 0;

  for (const row of rows) {
    await new Promise(r => setTimeout(r, delayMs));
    
    const result = await searchPlantQid(row.latin_name as string);
    if (!result) {
      failed++;
      continue;
    }

    const [existing] = await db.execute<import('mysql2').RowDataPacket[]>(
      'SELECT id FROM plants WHERE wikidata_qid = ? AND id != ?',
      [result.qid, row.id]
    );

    if ((existing as unknown[]).length > 0) {
      skipped++;
      continue;
    }

    await db.execute(
      'UPDATE plants SET wikidata_qid = ?, wikidata_enriched_at = NOW() WHERE id = ?',
      [result.qid, row.id]
    );
    enriched++;
  }

  return { enriched, failed, skipped };
}

/**
 * Génère un export JSON-LD compatible NOSE/Europeana
 * pour une molécule avec son QID Wikidata
 */
export function generateJsonLd(entity: {
  id: number;
  name: string;
  wikidataQid?: string | null;
  casNumber?: string | null;
  smiles?: string | null;
  inchiKey?: string | null;
  olfactiveProfile?: string | null;
  type: 'molecule' | 'plant';
}): Record<string, unknown> {
  const base: Record<string, unknown> = {
    '@context': {
      'schema': 'https://schema.org/',
      'wd': 'https://www.wikidata.org/entity/',
      'od': 'https://odeuropa.eu/ontology/',
      'skos': 'http://www.w3.org/2004/02/skos/core#',
    },
    '@type': entity.type === 'molecule' ? 'schema:ChemicalSubstance' : 'schema:Taxon',
    '@id': entity.wikidataQid ? `wd:${entity.wikidataQid}` : `https://perfumum.org/${entity.type}/${entity.id}`,
    'schema:name': entity.name,
    'perfumum:id': entity.id,
  };

  if (entity.wikidataQid) {
    base['owl:sameAs'] = `https://www.wikidata.org/entity/${entity.wikidataQid}`;
  }

  if (entity.type === 'molecule') {
    if (entity.casNumber) base['schema:identifier'] = { '@type': 'schema:PropertyValue', 'schema:propertyID': 'CAS', 'schema:value': entity.casNumber };
    if (entity.smiles) base['schema:hasRepresentation'] = entity.smiles;
    if (entity.inchiKey) base['schema:inChIKey'] = entity.inchiKey;
    if (entity.olfactiveProfile) base['od:hasOlfactiveProfile'] = entity.olfactiveProfile;
  }

  return base;
}
