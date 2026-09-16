export type CoordinateLike = {
  latitude?: string | number | null;
  longitude?: string | number | null;
};

/**
 * Compte seulement les terroirs disposant de coordonnées convertibles et dans
 * les bornes terrestres. Les valeurs Köppen des plantes ne sont pas concernées.
 */
export function hasValidTerroirCoordinates(terroir: CoordinateLike): boolean {
  if (terroir.latitude === null || terroir.latitude === undefined) return false;
  if (terroir.longitude === null || terroir.longitude === undefined) return false;
  const latitude = Number(terroir.latitude);
  const longitude = Number(terroir.longitude);
  return Number.isFinite(latitude)
    && Number.isFinite(longitude)
    && latitude >= -90
    && latitude <= 90
    && longitude >= -180
    && longitude <= 180;
}

export function countValidTerroirCoordinates(terroirs: CoordinateLike[] | undefined): number {
  return terroirs?.filter(hasValidTerroirCoordinates).length ?? 0;
}

/** Une même plante peut posséder plusieurs zones ; le total est une affectation, non un nombre de plantes uniques. */
export function countKoppenAssignments(zones: Array<{ count: number | string }> | undefined): number {
  return zones?.reduce((total, zone) => total + Number(zone.count || 0), 0) ?? 0;
}
