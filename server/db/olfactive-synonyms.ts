/**
 * Extracted from server/db/misc.ts
 * Module: Olfactive Synonyms
 */
import { db } from "../_core/db";
import { eq, and, or, desc, asc, sql, like, inArray, isNull, isNotNull, count, SQL, between, ne, gt, lt, gte, lte, notInArray, exists } from "drizzle-orm";
import * as schema from "../../drizzle/schema";


// ====================================================================
// FONCTIONS UTILITAIRES SYNONYMES OLFACTIFS
// ====================================================================
// ============================================
// FONCTIONS UTILITAIRES SYNONYMES OLFACTIFS
// ============================================

/**
 * Récupère les synonymes d'un terme olfactif
 */
export function getOlfactiveSynonyms(term: string): string[] {
  return getSynonyms(term);
}

/**
 * Étend une requête de recherche avec ses synonymes olfactifs
 */
export function expandOlfactiveSearchQuery(query: string): string[] {
  return expandSearchQuery(query);
}

/**
 * Catégorise un terme selon son domaine olfactif
 */
export function categorizeOlfactiveSearchTerm(term: string): {
  category: 'family' | 'note' | 'technical' | 'sensory' | 'emotional' | 'unknown';
  confidence: number;
} {
  return categorizeOlfactiveTerm(term);
}

/**
 * Récupère les statistiques du dictionnaire de synonymes olfactifs
 */
export function getOlfactiveDictionaryStats(): {
  totalTerms: number;
  byCategory: Record<string, number>;
  totalSynonyms: number;
} {
  return getDictionaryStats();
}



