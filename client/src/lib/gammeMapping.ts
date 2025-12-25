import { type GammeType } from "@/components/GammeBadge";

/**
 * Maps recipe categories and olfactive keywords to Perfumeum gammes
 */
export function getGammeFromCategory(category: string | null): GammeType | null {
  if (!category) return null;
  
  const cat = category.toLowerCase();
  
  // Pétrichor: terre, minéral, pluie, géosmine
  if (cat.includes('petrichor') || cat.includes('terre') || cat.includes('mineral') || 
      cat.includes('pluie') || cat.includes('geosmine') || cat.includes('argile')) {
    return 'petrichor';
  }
  
  // Volcanique: fumé, pyrolysé, tabac, cendre, résine brûlée
  if (cat.includes('volcanique') || cat.includes('tabac') || cat.includes('fumé') || 
      cat.includes('pyrolysé') || cat.includes('cendre') || cat.includes('brûlé')) {
    return 'volcanique';
  }
  
  // Civilisations: encens, sacré, rituel, civilisation
  if (cat.includes('civilisation') || cat.includes('encens') || cat.includes('sacré') || 
      cat.includes('rituel') || cat.includes('parfum')) {
    return 'civilisations';
  }
  
  // Glaciaire: frais, ozone, menthe, eucalyptus
  if (cat.includes('glaciaire') || cat.includes('frais') || cat.includes('ozone') || 
      cat.includes('menthe') || cat.includes('eucalyptus')) {
    return 'glaciaire';
  }
  
  // Bio-Lab: résine, extrait, expérimental, CBD
  if (cat.includes('resine') || cat.includes('résine') || cat.includes('extrait') || 
      cat.includes('cbd') || cat.includes('cone') || cat.includes('cône')) {
    return 'biolab';
  }
  
  // Colombie: café, cacao, andes
  if (cat.includes('colombie') || cat.includes('café') || cat.includes('cacao') || 
      cat.includes('andes') || cat.includes('colombian')) {
    return 'colombie';
  }
  
  return null;
}

/**
 * Maps molecule olfactive profiles to Perfumeum gammes
 */
export function getGammeFromOlfactiveProfile(profile: string | null): GammeType | null {
  if (!profile) return null;
  
  const prof = profile.toLowerCase();
  
  // Pétrichor keywords
  const petrichorKeywords = ['terre', 'terreux', 'minéral', 'pluie', 'géosmine', 'pierre', 'argile', 'humus', 'mouillé'];
  if (petrichorKeywords.some(kw => prof.includes(kw))) {
    return 'petrichor';
  }
  
  // Volcanique keywords
  const volcaniqueKeywords = ['fumé', 'pyrolysé', 'cendre', 'brûlé', 'carbonisé', 'résine brûlée', 'tabac', 'cuir'];
  if (volcaniqueKeywords.some(kw => prof.includes(kw))) {
    return 'volcanique';
  }
  
  // Civilisations keywords
  const civilisationsKeywords = ['encens', 'sacré', 'myrrhe', 'oliban', 'bois sacré', 'rituel', 'ambre'];
  if (civilisationsKeywords.some(kw => prof.includes(kw))) {
    return 'civilisations';
  }
  
  // Glaciaire keywords
  const glaciaireKeywords = ['frais', 'ozone', 'métallique', 'altitude', 'menthe', 'eucalyptus', 'camphré'];
  if (glaciaireKeywords.some(kw => prof.includes(kw))) {
    return 'glaciaire';
  }
  
  // Bio-Lab keywords
  const biolabKeywords = ['expérimental', 'synthétique', 'biotechnologie', 'design moléculaire', 'os', 'fossilisé'];
  if (biolabKeywords.some(kw => prof.includes(kw))) {
    return 'biolab';
  }
  
  // Colombie keywords
  const colombieKeywords = ['café', 'cacao', 'andes', 'colombie', 'colombian', 'chocolate', 'coffee'];
  if (colombieKeywords.some(kw => prof.includes(kw))) {
    return 'colombie';
  }
  
  return null;
}

/**
 * Maps prototype codes to gammes based on their conceptual nature
 */
export function getGammeFromPrototype(code: string | null): GammeType | null {
  if (!code) return null;
  
  const protoCode = code.toUpperCase();
  
  // C1 FERMENTUM - Animalité, fermentation → Volcanique/Bio-Lab
  if (protoCode.includes('C1')) {
    return 'volcanique';
  }
  
  // C2 CLARUS VERDE - Vert, frais → Glaciaire/Pétrichor
  if (protoCode.includes('C2')) {
    return 'petrichor';
  }
  
  // C3 LACTA SOLIS - Lait, solaire → Civilisations
  if (protoCode.includes('C3')) {
    return 'civilisations';
  }
  
  // C4 TERRA AMBRA - Terre, ambre → Pétrichor/Civilisations
  if (protoCode.includes('C4')) {
    return 'petrichor';
  }
  
  return null;
}
