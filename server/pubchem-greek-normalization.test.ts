/**
 * Tests vitest — Normalisation des préfixes grecs PubChem
 * Couvre : normalizeGreekPrefixes, translateMoleculeName (améliorée)
 */
import { describe, it, expect } from 'vitest';
import { normalizeGreekPrefixes, translateMoleculeName } from './pubchem';

describe('normalizeGreekPrefixes', () => {
  it('remplace α- par alpha- en début de nom', () => {
    expect(normalizeGreekPrefixes('α-Pinène')).toBe('alpha-Pinène');
  });

  it('remplace β- par beta- en début de nom', () => {
    expect(normalizeGreekPrefixes('β-Caryophyllène')).toBe('beta-Caryophyllène');
  });

  it('remplace γ- par gamma- en début de nom', () => {
    expect(normalizeGreekPrefixes('γ-Terpinène')).toBe('gamma-Terpinène');
  });

  it('remplace δ- par delta- en début de nom', () => {
    expect(normalizeGreekPrefixes('δ-Décalactone')).toBe('delta-Décalactone');
  });

  it('remplace Δ par delta- en début de nom', () => {
    expect(normalizeGreekPrefixes('Δ9-THC')).toBe('delta-9-THC');
  });

  it('gère les noms avec (Z)-β-', () => {
    expect(normalizeGreekPrefixes('(Z)-β-Santalol')).toBe('(Z)-beta-Santalol');
  });

  it('gère les noms avec (E)-β-', () => {
    expect(normalizeGreekPrefixes('(E)-β-Farnésène')).toBe('(E)-beta-Farnésène');
  });

  it('gère les noms avec epi-β-', () => {
    expect(normalizeGreekPrefixes('epi-β-Santalol')).toBe('epi-beta-Santalol');
  });

  it('gère les noms avec cis-β-', () => {
    expect(normalizeGreekPrefixes('cis-β-Farnésène')).toBe('cis-beta-Farnésène');
  });

  it('ne modifie pas un nom sans préfixe grec', () => {
    expect(normalizeGreekPrefixes('Linalool')).toBe('Linalool');
    expect(normalizeGreekPrefixes('Geraniol')).toBe('Geraniol');
  });

  it('ne modifie pas un nom commençant par une lettre grecque non-préfixe', () => {
    expect(normalizeGreekPrefixes('Eugenol')).toBe('Eugenol');
  });
});

describe('translateMoleculeName — préfixes grecs Unicode', () => {
  it('traduit α-Pinène → alpha-pinene', () => {
    const result = translateMoleculeName('α-Pinène');
    expect(result).toBe('alpha-pinene');
  });

  it('traduit β-Caryophyllène → beta-caryophyllene', () => {
    const result = translateMoleculeName('β-Caryophyllène');
    expect(result).toBe('beta-caryophyllene');
  });

  it('traduit γ-Terpinène → gamma-terpinene', () => {
    const result = translateMoleculeName('γ-Terpinène');
    expect(result).toBe('gamma-terpinene');
  });

  it('traduit δ-Décalactone → delta-decalactone', () => {
    const result = translateMoleculeName('δ-Décalactone');
    expect(result).toBe('delta-decalactone');
  });

  it('traduit β-Ionone → beta-ionone', () => {
    const result = translateMoleculeName('β-Ionone');
    expect(result).toBe('beta-ionone');
  });

  it('traduit β-Damascénone → beta-damascenone', () => {
    const result = translateMoleculeName('β-Damascénone');
    expect(result).toBe('beta-damascenone');
  });

  it('traduit α-Bisabolol → alpha-bisabolol', () => {
    const result = translateMoleculeName('α-Bisabolol');
    expect(result).toBe('alpha-bisabolol');
  });

  it('traduit α-Terpinéol → alpha-terpineol', () => {
    const result = translateMoleculeName('α-Terpinéol');
    expect(result).toBe('alpha-terpineol');
  });
});

describe('translateMoleculeName — noms FR avec accents', () => {
  it('traduit Géosmine → geosmin', () => {
    expect(translateMoleculeName('Géosmine')).toBe('geosmin');
  });

  it('traduit Diacétyle → diacetyl', () => {
    expect(translateMoleculeName('Diacétyle')).toBe('diacetyl');
  });

  it('traduit Crésol → cresol', () => {
    expect(translateMoleculeName('Crésol')).toBe('cresol');
  });

  it('traduit Oxyde de rose → rose oxide', () => {
    expect(translateMoleculeName('Oxyde de rose')).toBe('rose oxide');
  });

  it('traduit Chitosane → chitosan', () => {
    expect(translateMoleculeName('Chitosane')).toBe('chitosan');
  });

  it('traduit Fucoïdane → fucoidan', () => {
    expect(translateMoleculeName('Fucoïdane')).toBe('fucoidan');
  });

  it('traduit Glucoraphanine → glucoraphanin', () => {
    expect(translateMoleculeName('Glucoraphanine')).toBe('glucoraphanin');
  });

  it('traduit Isothiocyanate de benzyle → benzyl isothiocyanate', () => {
    expect(translateMoleculeName('Isothiocyanate de benzyle')).toBe('benzyl isothiocyanate');
  });
});

describe('translateMoleculeName — noms déjà en anglais', () => {
  it('ne modifie pas linalool (déjà EN)', () => {
    const result = translateMoleculeName('linalool');
    expect(result).toBe('linalool');
  });

  it('ne modifie pas geraniol (déjà EN)', () => {
    const result = translateMoleculeName('geraniol');
    expect(result).toBe('geraniol');
  });

  it('ne modifie pas beta-caryophyllene (déjà normalisé)', () => {
    const result = translateMoleculeName('beta-caryophyllene');
    expect(result).toBe('beta-caryophyllene');
  });
});

describe('translateMoleculeName — cas limites', () => {
  it('gère une chaîne vide', () => {
    expect(translateMoleculeName('')).toBe('');
  });

  it('gère undefined gracieusement', () => {
    expect(translateMoleculeName(undefined as unknown as string)).toBeUndefined();
  });

  it('normalise les accents sans traduction directe', () => {
    // Un nom avec accent mais pas dans le dictionnaire → normalisation des accents
    const result = translateMoleculeName('Éthanol');
    expect(result).not.toContain('É');
  });
});
