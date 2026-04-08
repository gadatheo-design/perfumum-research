import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safe JSON.parse — never throws.
 * Returns `fallback` (default: null) if the input is not valid JSON,
 * already an object/array, null, or undefined.
 *
 * Usage:
 *   safeJsonParse(plant.dominantMolecules, [])
 *   safeJsonParse(recipe.terpene_profile, null)
 */
export function safeJsonParse<T = unknown>(value: unknown, fallback: T = null as T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== "string") return value as unknown as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/**
 * Normalise un champ olfactiveProfile qui peut être une string, un array JSON,
 * ou null/undefined. Retourne toujours une string lisible ou null.
 *
 * Usage:
 *   normalizeOlfactiveProfile(molecule.olfactiveProfile)
 *   normalizeOlfactiveProfile(molecule.olfactiveProfile, ', ')  // séparateur personnalisé
 */
export function normalizeOlfactiveProfile(
  value: unknown,
  separator = '. '
): string | null {
  if (!value) return null;
  if (Array.isArray(value)) {
    const str = (value as string[]).filter(Boolean).join(separator);
    return str || null;
  }
  if (typeof value === 'string') return value || null;
  return String(value) || null;
}

/**
 * Safe toFixed — never throws.
 * Converts a value to a fixed-point string with the specified number of decimals.
 * Returns a fallback string if the value is not a number.
 *
 * Usage:
 *   (molecule.percentage).toFixed(1)           // "50.0"
 *   (recipe.cost).toFixed(2)                   // "12.50"
 *   safeToFixed(undefined, 2, '0.00')             // "0.00"
 *   safeToFixed(null, 0, 'N/A')                   // "N/A"
 */
export function safeToFixed(
  value: unknown,
  decimals: number = 2,
  fallback: string = '0.' + '0'.repeat(decimals)
): string {
  if (typeof value === 'number' && !isNaN(value)) {
    return value.toFixed(decimals);
  }
  return fallback;
}
