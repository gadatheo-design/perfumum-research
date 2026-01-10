/**
 * PERFUMUM — Dictionnaire de synonymes et termes techniques olfactifs
 * 
 * Ce fichier contient un ensemble complet de synonymes, termes techniques
 * et associations sémantiques du domaine de la parfumerie et de l'olfaction.
 * 
 * Utilisé pour enrichir les requêtes de recherche et améliorer la pertinence
 * des résultats en élargissant le champ lexical des termes recherchés.
 */

// ============================================================================
// FAMILLES OLFACTIVES — Synonymes et termes associés
// ============================================================================

export const familyOlfactiveSynonyms: Record<string, string[]> = {
  // Famille florale
  'floral': ['fleuri', 'florale', 'fleur', 'fleurs', 'flower', 'flowery', 'pétale', 'pétales', 'bouquet'],
  'fleuri': ['floral', 'florale', 'fleur', 'fleurs', 'flower', 'flowery', 'pétale'],
  'rose': ['rosa', 'rosé', 'rosée', 'rosat', 'rosacé', 'rosacée'],
  'jasmin': ['jasminum', 'jasmine', 'jasminé', 'jasminée'],
  'muguet': ['lily of the valley', 'convallaria', 'muguetée'],
  'tubéreuse': ['tuberose', 'polianthes', 'tubéreux'],
  'ylang': ['ylang-ylang', 'cananga', 'ilang'],
  'iris': ['orris', 'irisé', 'irisée', 'rhizome iris'],
  'violette': ['violet', 'viola', 'violetté', 'ionone'],
  'pivoine': ['peony', 'paeonia', 'pivoiné'],
  'magnolia': ['magnoliacé', 'magnoliacée'],
  'gardénia': ['gardenia', 'gardéniacé'],
  'néroli': ['neroli', 'fleur d\'oranger', 'orange blossom', 'bigarade'],
  'œillet': ['carnation', 'dianthus', 'clou de girofle floral'],
  
  // Famille agrume/hespéridée
  'agrume': ['citrus', 'hespéridé', 'hespéridée', 'agrumes', 'citrique', 'citronnée'],
  'hespéridé': ['agrume', 'citrus', 'agrumes', 'hespéridée', 'zeste', 'zesté'],
  'citron': ['lemon', 'limon', 'citronné', 'citronnée', 'citral', 'limonène'],
  'orange': ['orange douce', 'citrus sinensis', 'orangé', 'orangée'],
  'bergamote': ['bergamot', 'bergamotté', 'bergamottée', 'citrus bergamia'],
  'pamplemousse': ['grapefruit', 'pomelo', 'citrus paradisi'],
  'mandarine': ['tangerine', 'mandariné', 'citrus reticulata'],
  'citron vert': ['lime', 'limette', 'citrus aurantifolia', 'vert citron'],
  'yuzu': ['citrus junos', 'agrume japonais'],
  'cédrat': ['citron', 'citrus medica', 'cédratier'],
  'combava': ['kaffir lime', 'citrus hystrix', 'combawa'],
  
  // Famille boisée
  'boisé': ['woody', 'bois', 'ligneux', 'boisée', 'forestier', 'sylvestre'],
  'santal': ['sandalwood', 'santalum', 'santalol', 'bois de santal'],
  'cèdre': ['cedar', 'cedrus', 'cédré', 'cédrène', 'bois de cèdre'],
  'vétiver': ['vetiver', 'vétivert', 'vétivérol', 'khus'],
  'patchouli': ['pogostemon', 'patchoulol', 'patchoulène'],
  'oud': ['agarwood', 'bois d\'agar', 'bois d\'aigle', 'aquilaria', 'oudh'],
  'gaïac': ['guaiac', 'guaiacol', 'bois de gaïac', 'guaiacum'],
  'cyprès': ['cypress', 'cupressus', 'cypriol'],
  'pin': ['pine', 'pinus', 'pinène', 'résineux', 'conifère'],
  'sapin': ['fir', 'abies', 'baumier', 'balsamique'],
  'bouleau': ['birch', 'betula', 'goudron de bouleau'],
  'chêne': ['oak', 'quercus', 'mousse de chêne', 'oakmoss'],
  
  // Famille orientale/ambrée
  'oriental': ['orientale', 'ambré', 'ambrée', 'opulent', 'capiteux'],
  'ambré': ['amber', 'ambre', 'ambrée', 'ambréine', 'labdanum'],
  'vanille': ['vanilla', 'vanilline', 'vanillé', 'vanillée', 'vanilliné'],
  'benjoin': ['benzoin', 'styrax', 'benzoïque'],
  'encens': ['frankincense', 'oliban', 'boswellia', 'incense'],
  'myrrhe': ['myrrh', 'commiphora', 'myrrhé', 'myrrhée'],
  'labdanum': ['ciste', 'cistus', 'ladanum', 'ambre gris végétal'],
  'opoponax': ['sweet myrrh', 'commiphora guidottii', 'bisabol'],
  'tolu': ['baume de tolu', 'myroxylon', 'tolubalsam'],
  'pérou': ['baume du pérou', 'myroxylon pereirae', 'peru balsam'],
  
  // Famille fougère/aromatique
  'fougère': ['fern', 'fougéré', 'fougérée', 'coumarine', 'mousse'],
  'aromatique': ['aromatic', 'herbal', 'herbacé', 'herbacée', 'aromatisé'],
  'lavande': ['lavender', 'lavandula', 'lavandin', 'lavandé', 'lavandée'],
  'romarin': ['rosemary', 'rosmarinus', 'romariné'],
  'thym': ['thyme', 'thymus', 'thymol', 'thymé'],
  'sauge': ['sage', 'salvia', 'sclarée', 'salvinorine'],
  'basilic': ['basil', 'ocimum', 'basiliqué'],
  'menthe': ['mint', 'mentha', 'menthol', 'mentholé', 'menthée'],
  'eucalyptus': ['eucalyptol', 'cinéole', '1,8-cinéole'],
  'camphre': ['camphor', 'camphré', 'camphrée', 'bornéol'],
  
  // Famille musquée/animale
  'musqué': ['musk', 'musc', 'musquée', 'muscone', 'musconé'],
  'musc': ['musk', 'musqué', 'musquée', 'muscone', 'musc blanc'],
  'animal': ['animale', 'animalique', 'cuiré', 'fauve'],
  'cuir': ['leather', 'cuiré', 'cuirée', 'suédé', 'suédée'],
  'castoreum': ['castor', 'castorée'],
  'civette': ['civet', 'civettone', 'civettée'],
  'ambre gris': ['ambergris', 'ambréine', 'ambrox', 'ambroxan'],
  
  // Famille chyprée
  'chypré': ['chypre', 'chyprée', 'mousse de chêne', 'oakmoss', 'labdanum'],
  'mousse': ['moss', 'oakmoss', 'treemoss', 'mousse de chêne', 'mousse d\'arbre'],
  
  // Famille épicée
  'épicé': ['spicy', 'épice', 'épicée', 'spiced', 'chaud'],
  'cannelle': ['cinnamon', 'cinnamomum', 'cinnamaldéhyde', 'cannelé'],
  'girofle': ['clove', 'eugénol', 'syzygium', 'giroflé'],
  'poivre': ['pepper', 'piper', 'poivré', 'poivrée', 'pipérine'],
  'cardamome': ['cardamom', 'elettaria', 'cardamomé'],
  'gingembre': ['ginger', 'zingiber', 'gingérol', 'gingembré'],
  'muscade': ['nutmeg', 'myristica', 'muscadé', 'noix de muscade'],
  'safran': ['saffron', 'crocus', 'safranal', 'safrané'],
  'cumin': ['cuminum', 'cuminaldéhyde', 'cuminé'],
  'anis': ['anise', 'anisé', 'anisée', 'anéthole', 'badiane'],
  
  // Famille fruitée
  'fruité': ['fruity', 'fruit', 'fruitée', 'fruits'],
  'pomme': ['apple', 'malus', 'pommé'],
  'poire': ['pear', 'pyrus', 'poiré'],
  'pêche': ['peach', 'prunus persica', 'pêché', 'lactone'],
  'abricot': ['apricot', 'prunus armeniaca', 'abricoté'],
  'prune': ['plum', 'prunus', 'pruné'],
  'cassis': ['blackcurrant', 'ribes nigrum', 'bourgeon de cassis'],
  'framboise': ['raspberry', 'rubus', 'framboisé', 'frambinone'],
  'fraise': ['strawberry', 'fragaria', 'fraisé'],
  'figue': ['fig', 'ficus', 'figué', 'figuier'],
  'melon': ['melon', 'cucumis', 'meloné'],
  'noix de coco': ['coconut', 'cocos', 'lactone', 'cocotier'],
  
  // Famille verte/fraîche
  'vert': ['green', 'verte', 'verdoyant', 'verdoyante', 'feuille', 'herbe'],
  'frais': ['fresh', 'fraîche', 'fraîcheur', 'aquatique', 'ozonic'],
  'aquatique': ['aquatic', 'marine', 'marin', 'océanique', 'calone'],
  'ozone': ['ozonic', 'ozonique', 'ozonée', 'air frais'],
  'galbanum': ['ferula', 'galbanifère', 'vert métallique'],
  'feuille': ['leaf', 'foliage', 'feuillage', 'feuillu'],
  'herbe': ['grass', 'herbacé', 'herbacée', 'gazon', 'foin'],
  'thé vert': ['green tea', 'camellia sinensis', 'théiné'],
  
  // Famille gourmande
  'gourmand': ['gourmande', 'edible', 'comestible', 'sucré', 'sucrée'],
  'chocolat': ['chocolate', 'cacao', 'cacaoté', 'chocolaté'],
  'café': ['coffee', 'coffea', 'caféiné', 'torréfié'],
  'caramel': ['caramélisé', 'caramélisée', 'toffee', 'dulce de leche'],
  'miel': ['honey', 'miellé', 'miellée', 'mellifère'],
  'amande': ['almond', 'amandé', 'amandée', 'benzaldéhyde', 'prunus dulcis'],
  'praline': ['praliné', 'pralinée', 'noisette grillée'],
  'réglisse': ['licorice', 'liquorice', 'glycyrrhiza', 'réglissé'],
};

// ============================================================================
// NOTES OLFACTIVES — Pyramide et structure
// ============================================================================

export const noteStructureSynonyms: Record<string, string[]> = {
  // Notes de tête
  'note de tête': ['top note', 'head note', 'départ', 'ouverture', 'première impression', 'notes fraîches'],
  'tête': ['top', 'head', 'départ', 'ouverture', 'première note'],
  'départ': ['opening', 'top note', 'note de tête', 'première impression'],
  'ouverture': ['opening', 'départ', 'note de tête', 'attaque'],
  
  // Notes de cœur
  'note de cœur': ['heart note', 'middle note', 'corps', 'bouquet', 'notes centrales'],
  'cœur': ['heart', 'middle', 'corps', 'centre', 'milieu'],
  'corps': ['body', 'heart note', 'note de cœur', 'structure'],
  
  // Notes de fond
  'note de fond': ['base note', 'bottom note', 'fond', 'sillage', 'dry down', 'notes profondes'],
  'fond': ['base', 'bottom', 'dry down', 'sillage', 'rémanence'],
  'sillage': ['trail', 'wake', 'projection', 'diffusion', 'aura'],
  'dry down': ['fond', 'base note', 'évolution finale', 'séchage'],
  
  // Pyramide olfactive
  'pyramide': ['pyramid', 'structure', 'architecture', 'composition', 'construction'],
  'pyramide olfactive': ['olfactory pyramid', 'fragrance pyramid', 'structure olfactive'],
};

// ============================================================================
// TERMES TECHNIQUES — Parfumerie et chimie
// ============================================================================

export const technicalTermsSynonyms: Record<string, string[]> = {
  // Extraction et production
  'distillation': ['distilled', 'distillé', 'distillée', 'alambic', 'hydrodistillation'],
  'expression': ['cold press', 'pressé à froid', 'zeste pressé', 'expression à froid'],
  'extraction': ['extract', 'extrait', 'extraite', 'solvant', 'CO2'],
  'enfleurage': ['pomade', 'pommade', 'absorption', 'corps gras'],
  'absolue': ['absolute', 'absolu', 'concrète', 'résinoïde'],
  'concrète': ['concrete', 'cire florale', 'extraction solvant'],
  'résinoïde': ['resinoid', 'résine', 'gomme-résine'],
  'CO2': ['extraction CO2', 'supercritique', 'CO2 supercritique'],
  'huile essentielle': ['essential oil', 'HE', 'essence', 'volatile'],
  
  // Concentration
  'concentration': ['strength', 'intensité', 'dosage', 'pourcentage'],
  'parfum': ['extrait', 'extract', 'parfum extrait', '20-40%'],
  'eau de parfum': ['EDP', 'EdP', '15-20%'],
  'eau de toilette': ['EDT', 'EdT', '5-15%'],
  'eau de cologne': ['EDC', 'EdC', 'cologne', '2-5%'],
  'eau fraîche': ['splash', 'body mist', '1-3%'],
  
  // Caractéristiques olfactives
  'volatilité': ['volatility', 'évaporation', 'fugacité', 'évanescence'],
  'ténacité': ['tenacity', 'persistance', 'durabilité', 'longévité', 'tenue'],
  'diffusion': ['diffusivity', 'projection', 'rayonnement', 'sillage'],
  'intensité': ['intensity', 'puissance', 'force', 'impact'],
  'radiance': ['rayonnement', 'aura', 'halo', 'présence'],
  
  // Qualités olfactives
  'rond': ['round', 'ronde', 'doux', 'enveloppant', 'velouté'],
  'linéaire': ['linear', 'stable', 'constant', 'uniforme'],
  'facetté': ['faceted', 'multifacette', 'complexe', 'nuancé'],
  'transparent': ['sheer', 'léger', 'aérien', 'diaphane'],
  'opaque': ['dense', 'épais', 'lourd', 'compact'],
  'lumineux': ['bright', 'brillant', 'éclatant', 'radieux'],
  'sombre': ['dark', 'ténébreux', 'profond', 'mystérieux'],
  'chaud': ['warm', 'chaleureux', 'enveloppant', 'réconfortant'],
  'froid': ['cold', 'cool', 'glacé', 'givré', 'mentholé'],
  'sec': ['dry', 'aride', 'poudré', 'minéral'],
  'humide': ['wet', 'aqueux', 'juteux', 'mouillé'],
  'poudré': ['powdery', 'poudreux', 'talqué', 'iris', 'violette'],
  'crémeux': ['creamy', 'lacté', 'onctueux', 'velouté'],
  'métallique': ['metallic', 'minéral', 'acier', 'fer'],
  'terreux': ['earthy', 'terre', 'humus', 'géosmine', 'pétrichor'],
  'fumé': ['smoky', 'enfumé', 'brûlé', 'torréfié', 'pyrogéné'],
  'salé': ['salty', 'salin', 'marin', 'iodé'],
  
  // Classes chimiques
  'aldéhyde': ['aldehyde', 'aldéhydé', 'aldéhydique', 'savonneux'],
  'terpène': ['terpene', 'terpénique', 'monoterpène', 'sesquiterpène'],
  'ester': ['ester', 'estérifié', 'fruité', 'acétate'],
  'alcool': ['alcohol', 'ol', 'hydroxyle'],
  'cétone': ['ketone', 'cétonique', 'one'],
  'lactone': ['lactone', 'lactonique', 'crémeux', 'pêche'],
  'phénol': ['phenol', 'phénolique', 'médicinal'],
  'coumarine': ['coumarin', 'coumarinique', 'foin', 'tonka'],
  'indole': ['indolic', 'indolique', 'jasmin', 'animal'],
  'muscs': ['musk', 'muscone', 'macrocyclique', 'nitromuscs', 'muscs polycycliques'],
  
  // Molécules de synthèse
  'synthétique': ['synthetic', 'artificiel', 'de synthèse', 'chimique'],
  'naturel': ['natural', 'naturelle', 'bio', 'organique'],
  'isolat': ['isolate', 'fraction', 'molécule isolée'],
  'captif': ['captive', 'propriétaire', 'exclusif'],
  
  // Accords classiques
  'accord': ['accord', 'combinaison', 'mélange', 'association', 'mariage'],
  'fougère': ['fern', 'coumarine-lavande-mousse', 'barbershop'],
  'chypre': ['chypre', 'bergamote-mousse-labdanum', 'mousse de chêne'],
  'oriental': ['amber', 'vanille-ambre-épices', 'opulent'],
  'hespéridé': ['citrus', 'agrumes', 'cologne', 'frais'],
  'floral aldéhydé': ['aldehyde floral', 'N°5', 'savonneux floral'],
  
  // Réglementation
  'IFRA': ['International Fragrance Association', 'restriction', 'réglementation'],
  'allergène': ['allergen', 'sensibilisant', 'déclaration'],
  'REACH': ['Registration Evaluation Authorization Chemicals', 'européen'],
  'CAS': ['Chemical Abstracts Service', 'numéro CAS', 'identifiant chimique'],
  'IUPAC': ['nomenclature', 'nom chimique', 'systématique'],
};

// ============================================================================
// DESCRIPTEURS SENSORIELS — Vocabulaire de dégustation olfactive
// ============================================================================

export const sensoryDescriptorsSynonyms: Record<string, string[]> = {
  // Texture
  'velouté': ['velvety', 'soyeux', 'doux', 'moelleux', 'onctueux'],
  'soyeux': ['silky', 'velouté', 'lisse', 'fluide'],
  'granuleux': ['grainy', 'texturé', 'rugueux'],
  'lisse': ['smooth', 'uni', 'régulier', 'homogène'],
  
  // Caractère
  'élégant': ['elegant', 'raffiné', 'sophistiqué', 'distingué'],
  'rustique': ['rustic', 'brut', 'sauvage', 'authentique'],
  'moderne': ['modern', 'contemporain', 'actuel', 'avant-garde'],
  'classique': ['classic', 'traditionnel', 'intemporel', 'vintage'],
  'vintage': ['retro', 'rétro', 'ancien', 'nostalgique'],
  
  // Intensité
  'subtil': ['subtle', 'délicat', 'discret', 'léger', 'ténu'],
  'puissant': ['powerful', 'fort', 'intense', 'marqué', 'prononcé'],
  'discret': ['discreet', 'subtil', 'léger', 'effacé'],
  'envahissant': ['overwhelming', 'dominant', 'omniprésent', 'saturant'],
  
  // Évolution
  'évolutif': ['evolving', 'changeant', 'dynamique', 'mouvant'],
  'stable': ['stable', 'constant', 'linéaire', 'uniforme'],
  'fugace': ['fleeting', 'éphémère', 'volatile', 'passager'],
  'persistant': ['lasting', 'durable', 'tenace', 'rémanent'],
  
  // Impression générale
  'harmonieux': ['harmonious', 'équilibré', 'cohérent', 'unifié'],
  'discordant': ['discordant', 'déséquilibré', 'cacophonique'],
  'complexe': ['complex', 'riche', 'multifacette', 'élaboré'],
  'simple': ['simple', 'épuré', 'minimaliste', 'sobre'],
  'riche': ['rich', 'opulent', 'luxuriant', 'généreux'],
  'pauvre': ['thin', 'maigre', 'fade', 'plat'],
};

// ============================================================================
// ASSOCIATIONS ÉMOTIONNELLES — Évocations et ambiances
// ============================================================================

export const emotionalAssociationsSynonyms: Record<string, string[]> = {
  // Émotions positives
  'joyeux': ['joyful', 'gai', 'heureux', 'enjoué', 'pétillant'],
  'sensuel': ['sensual', 'séducteur', 'charnel', 'voluptueux'],
  'romantique': ['romantic', 'tendre', 'amoureux', 'passionné'],
  'apaisant': ['soothing', 'calmant', 'relaxant', 'serein'],
  'énergisant': ['energizing', 'vivifiant', 'tonifiant', 'stimulant'],
  'réconfortant': ['comforting', 'chaleureux', 'douillet', 'cocooning'],
  
  // Ambiances
  'mystérieux': ['mysterious', 'énigmatique', 'intrigant', 'secret'],
  'exotique': ['exotic', 'tropical', 'lointain', 'dépaysant'],
  'nostalgique': ['nostalgic', 'mélancolique', 'rétro', 'souvenir'],
  'frais': ['fresh', 'vivifiant', 'revigorant', 'tonique'],
  'intime': ['intimate', 'personnel', 'proche', 'confidentiel'],
  'festif': ['festive', 'célébration', 'joyeux', 'fête'],
  
  // Saisons
  'printanier': ['spring', 'printemps', 'renouveau', 'fleuri léger'],
  'estival': ['summer', 'été', 'solaire', 'vacances'],
  'automnal': ['autumn', 'fall', 'automne', 'feuilles mortes'],
  'hivernal': ['winter', 'hiver', 'froid', 'cocooning'],
  
  // Moments
  'matinal': ['morning', 'matin', 'aube', 'réveil'],
  'nocturne': ['night', 'nuit', 'soir', 'crépuscule'],
  'quotidien': ['daily', 'jour', 'bureau', 'casual'],
  'soirée': ['evening', 'soir', 'élégant', 'habillé'],
};

// ============================================================================
// FONCTION D'EXPANSION DES REQUÊTES
// ============================================================================

/**
 * Combine tous les dictionnaires de synonymes
 */
export const allSynonyms: Record<string, string[]> = {
  ...familyOlfactiveSynonyms,
  ...noteStructureSynonyms,
  ...technicalTermsSynonyms,
  ...sensoryDescriptorsSynonyms,
  ...emotionalAssociationsSynonyms,
};

/**
 * Normalise un terme pour la recherche (minuscules, sans accents)
 */
export function normalizeSearchTerm(term: string): string {
  return term
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Trouve tous les synonymes d'un terme donné
 */
export function getSynonyms(term: string): string[] {
  const normalized = normalizeSearchTerm(term);
  const synonyms = new Set<string>();
  
  // Chercher le terme dans les clés
  for (const [key, values] of Object.entries(allSynonyms)) {
    const normalizedKey = normalizeSearchTerm(key);
    
    if (normalizedKey === normalized || normalizedKey.includes(normalized) || normalized.includes(normalizedKey)) {
      synonyms.add(key);
      values.forEach(v => synonyms.add(v));
    }
    
    // Chercher aussi dans les valeurs
    for (const value of values) {
      const normalizedValue = normalizeSearchTerm(value);
      if (normalizedValue === normalized || normalizedValue.includes(normalized) || normalized.includes(normalizedValue)) {
        synonyms.add(key);
        values.forEach(v => synonyms.add(v));
        break;
      }
    }
  }
  
  // Retirer le terme original
  synonyms.delete(term);
  synonyms.delete(normalized);
  
  return Array.from(synonyms);
}

/**
 * Étend une requête de recherche avec ses synonymes
 * Retourne un tableau de termes à rechercher
 */
export function expandSearchQuery(query: string): string[] {
  const terms = query.split(/\s+/).filter(t => t.length > 2);
  const expandedTerms = new Set<string>();
  
  // Ajouter les termes originaux
  terms.forEach(term => expandedTerms.add(term));
  
  // Ajouter les synonymes pour chaque terme
  for (const term of terms) {
    const synonyms = getSynonyms(term);
    synonyms.forEach(syn => expandedTerms.add(syn));
  }
  
  // Chercher aussi la requête complète comme expression
  const fullQuerySynonyms = getSynonyms(query);
  fullQuerySynonyms.forEach(syn => expandedTerms.add(syn));
  
  return Array.from(expandedTerms);
}

/**
 * Génère une clause SQL LIKE pour une recherche enrichie
 * Retourne un tableau de patterns à utiliser avec OR
 */
export function generateEnrichedSearchPatterns(query: string): string[] {
  const expandedTerms = expandSearchQuery(query);
  return expandedTerms.map(term => `%${term}%`);
}

/**
 * Catégorise un terme selon son domaine olfactif
 */
export function categorizeOlfactiveTerm(term: string): {
  category: 'family' | 'note' | 'technical' | 'sensory' | 'emotional' | 'unknown';
  confidence: number;
} {
  const normalized = normalizeSearchTerm(term);
  
  // Vérifier dans chaque dictionnaire
  for (const [key, values] of Object.entries(familyOlfactiveSynonyms)) {
    if (normalizeSearchTerm(key) === normalized || values.some(v => normalizeSearchTerm(v) === normalized)) {
      return { category: 'family', confidence: 1.0 };
    }
  }
  
  for (const [key, values] of Object.entries(noteStructureSynonyms)) {
    if (normalizeSearchTerm(key) === normalized || values.some(v => normalizeSearchTerm(v) === normalized)) {
      return { category: 'note', confidence: 1.0 };
    }
  }
  
  for (const [key, values] of Object.entries(technicalTermsSynonyms)) {
    if (normalizeSearchTerm(key) === normalized || values.some(v => normalizeSearchTerm(v) === normalized)) {
      return { category: 'technical', confidence: 1.0 };
    }
  }
  
  for (const [key, values] of Object.entries(sensoryDescriptorsSynonyms)) {
    if (normalizeSearchTerm(key) === normalized || values.some(v => normalizeSearchTerm(v) === normalized)) {
      return { category: 'sensory', confidence: 1.0 };
    }
  }
  
  for (const [key, values] of Object.entries(emotionalAssociationsSynonyms)) {
    if (normalizeSearchTerm(key) === normalized || values.some(v => normalizeSearchTerm(v) === normalized)) {
      return { category: 'emotional', confidence: 1.0 };
    }
  }
  
  // Recherche partielle avec confiance réduite
  for (const [key, values] of Object.entries(allSynonyms)) {
    const allTerms = [key, ...values];
    for (const t of allTerms) {
      if (normalizeSearchTerm(t).includes(normalized) || normalized.includes(normalizeSearchTerm(t))) {
        // Déterminer la catégorie
        if (key in familyOlfactiveSynonyms) return { category: 'family', confidence: 0.7 };
        if (key in noteStructureSynonyms) return { category: 'note', confidence: 0.7 };
        if (key in technicalTermsSynonyms) return { category: 'technical', confidence: 0.7 };
        if (key in sensoryDescriptorsSynonyms) return { category: 'sensory', confidence: 0.7 };
        if (key in emotionalAssociationsSynonyms) return { category: 'emotional', confidence: 0.7 };
      }
    }
  }
  
  return { category: 'unknown', confidence: 0 };
}

/**
 * Statistiques sur le dictionnaire
 */
export function getDictionaryStats(): {
  totalTerms: number;
  byCategory: Record<string, number>;
  totalSynonyms: number;
} {
  const stats = {
    totalTerms: 0,
    byCategory: {
      family: Object.keys(familyOlfactiveSynonyms).length,
      note: Object.keys(noteStructureSynonyms).length,
      technical: Object.keys(technicalTermsSynonyms).length,
      sensory: Object.keys(sensoryDescriptorsSynonyms).length,
      emotional: Object.keys(emotionalAssociationsSynonyms).length,
    },
    totalSynonyms: 0,
  };
  
  stats.totalTerms = Object.values(stats.byCategory).reduce((a, b) => a + b, 0);
  
  for (const values of Object.values(allSynonyms)) {
    stats.totalSynonyms += values.length;
  }
  
  return stats;
}
