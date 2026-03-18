/**
 * PERFUMUM — Service Europeana
 * ==============================
 * Intégration de l'API REST Europeana + IIIF APIs
 *
 * APIs utilisées :
 * - Search API  : https://api.europeana.eu/record/v2/search.json
 * - Record API  : https://api.europeana.eu/record/v2/{RECORD_ID}.json
 * - IIIF Manifest (sans clé) : https://iiif.europeana.eu/presentation/{RECORD_ID}/manifest
 * - Thumbnail API (sans clé) : https://api.europeana.eu/thumbnail/v3/{SIZE}/{RECORD_ID}.jpg
 *
 * Docs :
 * - https://europeana.atlassian.net/wiki/spaces/EF/pages/2385739812 (Search API)
 * - https://europeana.atlassian.net/wiki/spaces/EF/pages/1627914244 (IIIF APIs)
 *
 * Points clés de l'API Europeana (v2) :
 * - wskey       : clé API (paramètre obligatoire)
 * - profile     : minimal | standard | rich (rich = métadonnées complètes)
 * - rows        : max 100 par requête
 * - cursor      : pagination profonde (cursor=* pour démarrer)
 * - thumbnail=true : filtre les items avec miniature disponible
 * - media=true  : filtre les items avec média complet disponible
 * - qf=TYPE:IMAGE : filtre par type (IMAGE, TEXT, VIDEO, SOUND, 3D)
 * - reusability : open | restricted | permission
 *
 * IIIF (sans clé API) :
 * - Manifest v3 : https://iiif.europeana.eu/presentation/{DATASET_ID}/{LOCAL_ID}/manifest
 * - Thumbnail   : https://api.europeana.eu/thumbnail/v3/400/{RECORD_ID}.jpg
 *
 * Mode dégradé : si EUROPEANA_API_KEY est absent, retourne des données
 * de démonstration pour permettre le développement de l'interface.
 */

const EUROPEANA_API_BASE = "https://api.europeana.eu/record/v2";
const EUROPEANA_SEARCH_URL = `${EUROPEANA_API_BASE}/search.json`;
const EUROPEANA_IIIF_BASE = "https://iiif.europeana.eu/presentation";
const EUROPEANA_THUMBNAIL_BASE = "https://api.europeana.eu/thumbnail/v3";
const TIMEOUT_MS = 15_000;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EuropeanaItem {
  id: string;
  title: string;
  creator?: string;
  date?: string;
  institution?: string;
  country?: string;
  thumbnailUrl?: string;
  thumbnailUrlLarge?: string; // 400px via Thumbnail API v3
  edmPreviewUrl?: string;
  iiifManifestUrl?: string;  // IIIF Presentation API v3 (sans clé)
  europeanaUrl: string;
  rights?: string;
  rightsLabel?: string;      // Label lisible : "Public Domain", "CC BY", etc.
  type?: string;             // IMAGE, TEXT, VIDEO, SOUND, 3D
  theme?: string;
  language?: string[];
  subject?: string[];
  // Liens croisés PERFUMUM
  relatedPlantId?: number;
  relatedPlantName?: string;
  relatedMoleculeId?: number;
  relatedMoleculeName?: string;
}

export interface EuropeanaSearchResult {
  items: EuropeanaItem[];
  total: number;
  query: string;
  theme: string;
  apiAvailable: boolean;
  nextCursor?: string;       // Pagination curseur pour deep pagination
  error?: string;
}

export interface EuropeanaRecordDetail extends EuropeanaItem {
  description?: string[];
  format?: string[];
  source?: string[];
  relation?: string[];
  coverage?: string[];
  iiifManifestV2?: string;   // IIIF Presentation API v2.1
  iiifManifestV3?: string;   // IIIF Presentation API v3
  edmIsShownAt?: string;     // URL vers la page de l'institution
  edmIsShownBy?: string;     // URL vers le média haute résolution
}

// ─── Helpers IIIF ─────────────────────────────────────────────────────────────

/**
 * Construit l'URL du IIIF Manifest v3 depuis un record ID Europeana.
 * Format record ID : /DATASET_ID/LOCAL_ID (ex: /9200365/BibliographicResource_3000126284840)
 * URL manifest : https://iiif.europeana.eu/presentation/9200365/BibliographicResource_3000126284840/manifest
 * Aucune clé API requise.
 */
export function buildIiifManifestUrl(recordId: string): string {
  // Enlever le slash initial si présent
  const cleanId = recordId.startsWith("/") ? recordId.slice(1) : recordId;
  return `${EUROPEANA_IIIF_BASE}/${cleanId}/manifest`;
}

/**
 * Construit l'URL de la miniature via Thumbnail API v3.
 * Tailles disponibles : 200, 400
 * Aucune clé API requise.
 */
export function buildThumbnailUrl(recordId: string, size: 200 | 400 = 400): string {
  const cleanId = recordId.startsWith("/") ? recordId.slice(1) : recordId;
  return `${EUROPEANA_THUMBNAIL_BASE}/${size}/${cleanId}.jpg`;
}

/**
 * Extrait un label lisible depuis une URL de droits Europeana.
 */
function parseRightsLabel(rightsUrl?: string): string {
  if (!rightsUrl) return "Droits non spécifiés";
  if (rightsUrl.includes("publicdomain/mark")) return "Domaine public";
  if (rightsUrl.includes("publicdomain/zero")) return "CC0 — Domaine public";
  if (rightsUrl.includes("licenses/by/")) return "CC BY";
  if (rightsUrl.includes("licenses/by-sa/")) return "CC BY-SA";
  if (rightsUrl.includes("licenses/by-nc/")) return "CC BY-NC";
  if (rightsUrl.includes("licenses/by-nc-sa/")) return "CC BY-NC-SA";
  if (rightsUrl.includes("licenses/by-nd/")) return "CC BY-ND";
  if (rightsUrl.includes("licenses/by-nc-nd/")) return "CC BY-NC-ND";
  if (rightsUrl.includes("rightsstatements.org/vocab/InC")) return "Droits réservés";
  if (rightsUrl.includes("rightsstatements.org/vocab/NoC")) return "Pas de restriction connue";
  if (rightsUrl.includes("rightsstatements.org/vocab/CNE")) return "Droits non évalués";
  return "Voir conditions";
}

/**
 * Mappe un item brut de l'API Europeana vers EuropeanaItem.
 */
function mapApiItem(item: any, theme: string): EuropeanaItem {
  const id = item.id || "";
  const rightsRaw = Array.isArray(item.rights) ? item.rights[0] : item.rights;
  return {
    id,
    title: Array.isArray(item.title) ? item.title[0] : (item.title || "Sans titre"),
    creator: Array.isArray(item.dcCreator) ? item.dcCreator[0] : item.dcCreator,
    date: Array.isArray(item.year) ? item.year[0] : item.year,
    institution: Array.isArray(item.dataProvider) ? item.dataProvider[0] : item.dataProvider,
    country: Array.isArray(item.country) ? item.country[0] : item.country,
    // Thumbnail API v3 prioritaire (sans clé, meilleure résolution)
    thumbnailUrl: id ? buildThumbnailUrl(id, 200) : (item.edmPreview?.[0] || undefined),
    thumbnailUrlLarge: id ? buildThumbnailUrl(id, 400) : (item.edmPreview?.[0] || undefined),
    edmPreviewUrl: item.edmIsShownBy?.[0] || item.edmPreview?.[0],
    // IIIF Manifest (sans clé)
    iiifManifestUrl: id ? buildIiifManifestUrl(id) : undefined,
    europeanaUrl: `https://www.europeana.eu/item${id}`,
    rights: rightsRaw,
    rightsLabel: parseRightsLabel(rightsRaw),
    type: Array.isArray(item.type) ? item.type[0] : item.type,
    theme,
    language: Array.isArray(item.language) ? item.language : undefined,
    subject: Array.isArray(item.dcSubject) ? item.dcSubject.slice(0, 5) : undefined,
  };
}

// ─── Requêtes thématiques PERFUMUM ───────────────────────────────────────────

export const THEMATIC_QUERIES: Record<
  string,
  {
    label: string;
    query: string;
    description: string;
    relatedPlants: string[];
    relatedMolecules: string[];
    color: string;
    // Filtres supplémentaires optionnels
    reusability?: string;
    typeFilter?: string;
  }
> = {
  rose_damas: {
    label: "Rose de Damas",
    query: "Damascus rose OR Rosa damascena OR rose de Damas OR Damaszener Rose",
    description:
      "Œuvres d'art et objets culturels mentionnant la Rose de Damas dans les collections muséales européennes.",
    relatedPlants: ["Rosa damascena", "Rosa centifolia"],
    relatedMolecules: ["Géraniol", "Citronellol", "Néryl acétate", "Damascénone"],
    color: "#e11d48",
    reusability: "open",
    typeFilter: "IMAGE",
  },
  encens: {
    label: "Encens & Oliban",
    query: "frankincense OR olibanum OR encens OR Weihrauch OR Boswellia",
    description:
      "Représentations de l'encens et de l'oliban dans les collections européennes — rituels, commerce, iconographie religieuse.",
    relatedPlants: ["Boswellia sacra", "Boswellia carterii", "Boswellia serrata"],
    relatedMolecules: ["α-Pinène", "Limonène", "Incensole acétate", "Boswellic acid"],
    color: "#d97706",
    reusability: "open",
    typeFilter: "IMAGE",
  },
  tabac_ottoman: {
    label: "Tabac ottoman",
    query: "Ottoman tobacco OR tabac ottoman OR narghilé OR hookah OR chibouk OR tütün",
    description:
      "Iconographie du tabac ottoman — pipes, narguilés, scènes de café, portraits de fumeurs dans les collections européennes.",
    relatedPlants: ["Nicotiana tabacum", "Nicotiana rustica"],
    relatedMolecules: ["Nicotine", "Solanone", "Mégastigmatrienone", "Phytol"],
    color: "#7c3aed",
    reusability: "open",
    typeFilter: "IMAGE",
  },
  houblon: {
    label: "Houblon & Brasserie",
    query: "hops brewing OR houblon bière OR Humulus lupulus OR hop harvest",
    description:
      "Représentations du houblon et de la brasserie dans les collections européennes — récolte, brassage, scènes rurales.",
    relatedPlants: ["Humulus lupulus"],
    relatedMolecules: ["Myrcène", "Humulone", "Lupulone", "Linalol"],
    color: "#16a34a",
    reusability: "open",
    typeFilter: "IMAGE",
  },
  nard: {
    label: "Nard & Parfums antiques",
    query: "spikenard OR nard OR Nardostachys OR parfum antique OR ancient perfume",
    description:
      "Représentations du nard et des parfums de l'Antiquité dans les collections européennes — flacons, rituels, commerce.",
    relatedPlants: ["Nardostachys jatamansi", "Valeriana officinalis"],
    relatedMolecules: ["Nardol", "Jatamansone", "Patchoulol", "Valeranone"],
    color: "#0891b2",
    reusability: "open",
    typeFilter: "IMAGE",
  },
  myrrhe: {
    label: "Myrrhe & Résines",
    query: "myrrh OR myrrhe OR Commiphora OR resin incense OR résine encens",
    description:
      "Représentations de la myrrhe et des résines aromatiques dans les collections européennes.",
    relatedPlants: ["Commiphora myrrha", "Commiphora gileadensis"],
    relatedMolecules: ["Furanosesquiterpènes", "Curzerene", "Lindestrene"],
    color: "#b45309",
    reusability: "open",
    typeFilter: "IMAGE",
  },
};

// ─── Données de démonstration (mode sans clé API) ─────────────────────────────

const DEMO_ITEMS: Record<string, EuropeanaItem[]> = {
  rose_damas: [
    {
      id: "/9200365/BibliographicResource_3000126284840",
      title: "Rosa damascena — Planche botanique",
      creator: "Pierre-Joseph Redouté",
      date: "1817",
      institution: "Bibliothèque nationale de France",
      country: "France",
      thumbnailUrl: buildThumbnailUrl("/9200365/BibliographicResource_3000126284840", 200),
      thumbnailUrlLarge: buildThumbnailUrl("/9200365/BibliographicResource_3000126284840", 400),
      iiifManifestUrl: buildIiifManifestUrl("/9200365/BibliographicResource_3000126284840"),
      europeanaUrl: "https://www.europeana.eu/item/9200365/BibliographicResource_3000126284840",
      rights: "http://creativecommons.org/publicdomain/mark/1.0/",
      rightsLabel: "Domaine public",
      type: "IMAGE",
      theme: "rose_damas",
      relatedPlantName: "Rosa damascena",
      relatedMoleculeName: "Géraniol",
    },
    {
      id: "/90402/RP_P_OB_72_050",
      title: "Vase de fleurs avec roses",
      creator: "Jan van Huysum",
      date: "1720",
      institution: "Rijksmuseum Amsterdam",
      country: "Pays-Bas",
      thumbnailUrl: buildThumbnailUrl("/90402/RP_P_OB_72_050", 200),
      thumbnailUrlLarge: buildThumbnailUrl("/90402/RP_P_OB_72_050", 400),
      iiifManifestUrl: buildIiifManifestUrl("/90402/RP_P_OB_72_050"),
      europeanaUrl: "https://www.europeana.eu/item/90402/RP_P_OB_72_050",
      rights: "http://creativecommons.org/publicdomain/mark/1.0/",
      rightsLabel: "Domaine public",
      type: "IMAGE",
      theme: "rose_damas",
      relatedPlantName: "Rosa damascena",
    },
    {
      id: "/2048007/Museu_ProvidedCHO_Museu_Nacional_d_Art_de_Catalunya_15917",
      title: "Jardin de roses — Miniature persane",
      creator: "Anonyme (École persane)",
      date: "1650",
      institution: "Bibliothèque nationale de France",
      country: "France",
      thumbnailUrl: buildThumbnailUrl("/2048007/Museu_ProvidedCHO_Museu_Nacional_d_Art_de_Catalunya_15917", 200),
      thumbnailUrlLarge: buildThumbnailUrl("/2048007/Museu_ProvidedCHO_Museu_Nacional_d_Art_de_Catalunya_15917", 400),
      iiifManifestUrl: buildIiifManifestUrl("/2048007/Museu_ProvidedCHO_Museu_Nacional_d_Art_de_Catalunya_15917"),
      europeanaUrl: "https://www.europeana.eu/item/2048007/Museu_ProvidedCHO_Museu_Nacional_d_Art_de_Catalunya_15917",
      rights: "http://creativecommons.org/publicdomain/mark/1.0/",
      rightsLabel: "Domaine public",
      type: "IMAGE",
      theme: "rose_damas",
      relatedMoleculeName: "Damascénone",
    },
  ],
  encens: [
    {
      id: "/9200579/BibliographicResource_3000135522018",
      title: "L'Adoration des Mages — scène d'encensement",
      creator: "Fra Angelico",
      date: "1440",
      institution: "Museo di San Marco, Florence",
      country: "Italie",
      thumbnailUrl: buildThumbnailUrl("/9200579/BibliographicResource_3000135522018", 200),
      thumbnailUrlLarge: buildThumbnailUrl("/9200579/BibliographicResource_3000135522018", 400),
      iiifManifestUrl: buildIiifManifestUrl("/9200579/BibliographicResource_3000135522018"),
      europeanaUrl: "https://www.europeana.eu/item/9200579/BibliographicResource_3000135522018",
      rights: "http://creativecommons.org/publicdomain/mark/1.0/",
      rightsLabel: "Domaine public",
      type: "IMAGE",
      theme: "encens",
      relatedPlantName: "Boswellia sacra",
      relatedMoleculeName: "α-Pinène",
    },
    {
      id: "/9200365/BibliographicResource_3000126284841",
      title: "Encensoir liturgique — Art roman",
      creator: "Atelier rhénan",
      date: "1150",
      institution: "Musée de Cluny, Paris",
      country: "France",
      thumbnailUrl: buildThumbnailUrl("/9200365/BibliographicResource_3000126284841", 200),
      thumbnailUrlLarge: buildThumbnailUrl("/9200365/BibliographicResource_3000126284841", 400),
      iiifManifestUrl: buildIiifManifestUrl("/9200365/BibliographicResource_3000126284841"),
      europeanaUrl: "https://www.europeana.eu/search?query=encensoir+roman",
      rights: "http://creativecommons.org/publicdomain/mark/1.0/",
      rightsLabel: "Domaine public",
      type: "IMAGE",
      theme: "encens",
      relatedMoleculeName: "Incensole acétate",
    },
    {
      id: "/9200365/BibliographicResource_3000126284842",
      title: "Route de l'encens — Carte commerciale",
      creator: "Cartographe hollandais",
      date: "1680",
      institution: "Bibliothèque royale de Belgique",
      country: "Belgique",
      thumbnailUrl: buildThumbnailUrl("/9200365/BibliographicResource_3000126284842", 200),
      thumbnailUrlLarge: buildThumbnailUrl("/9200365/BibliographicResource_3000126284842", 400),
      iiifManifestUrl: buildIiifManifestUrl("/9200365/BibliographicResource_3000126284842"),
      europeanaUrl: "https://www.europeana.eu/search?query=incense+route+map",
      rights: "http://creativecommons.org/publicdomain/mark/1.0/",
      rightsLabel: "Domaine public",
      type: "IMAGE",
      theme: "encens",
      relatedPlantName: "Boswellia carterii",
    },
  ],
  tabac_ottoman: [
    {
      id: "/9200365/BibliographicResource_3000126284843",
      title: "Fumeur de narguilé — Scène orientaliste",
      creator: "Eugène Delacroix",
      date: "1832",
      institution: "Musée du Louvre",
      country: "France",
      thumbnailUrl: buildThumbnailUrl("/9200365/BibliographicResource_3000126284843", 200),
      thumbnailUrlLarge: buildThumbnailUrl("/9200365/BibliographicResource_3000126284843", 400),
      iiifManifestUrl: buildIiifManifestUrl("/9200365/BibliographicResource_3000126284843"),
      europeanaUrl: "https://www.europeana.eu/search?query=nargile+ottoman+smoking",
      rights: "http://creativecommons.org/publicdomain/mark/1.0/",
      rightsLabel: "Domaine public",
      type: "IMAGE",
      theme: "tabac_ottoman",
      relatedPlantName: "Nicotiana tabacum",
      relatedMoleculeName: "Nicotine",
    },
    {
      id: "/9200365/BibliographicResource_3000126284844",
      title: "Café ottoman — Hommes fumant le chibouk",
      creator: "Jean-Léon Gérôme",
      date: "1870",
      institution: "Hermitage Museum, Saint-Pétersbourg",
      country: "Russie",
      thumbnailUrl: buildThumbnailUrl("/9200365/BibliographicResource_3000126284844", 200),
      thumbnailUrlLarge: buildThumbnailUrl("/9200365/BibliographicResource_3000126284844", 400),
      iiifManifestUrl: buildIiifManifestUrl("/9200365/BibliographicResource_3000126284844"),
      europeanaUrl: "https://www.europeana.eu/search?query=ottoman+coffee+house+smoking",
      rights: "http://creativecommons.org/publicdomain/mark/1.0/",
      rightsLabel: "Domaine public",
      type: "IMAGE",
      theme: "tabac_ottoman",
      relatedPlantName: "Nicotiana rustica",
      relatedMoleculeName: "Solanone",
    },
    {
      id: "/9200365/BibliographicResource_3000126284845",
      title: "Pipe à tabac ottomane — Chibouk en ambre",
      creator: "Atelier ottoman",
      date: "1800",
      institution: "Victoria and Albert Museum, Londres",
      country: "Royaume-Uni",
      thumbnailUrl: buildThumbnailUrl("/9200365/BibliographicResource_3000126284845", 200),
      thumbnailUrlLarge: buildThumbnailUrl("/9200365/BibliographicResource_3000126284845", 400),
      iiifManifestUrl: buildIiifManifestUrl("/9200365/BibliographicResource_3000126284845"),
      europeanaUrl: "https://www.europeana.eu/search?query=chibouk+ottoman+pipe",
      rights: "http://creativecommons.org/publicdomain/mark/1.0/",
      rightsLabel: "Domaine public",
      type: "IMAGE",
      theme: "tabac_ottoman",
      relatedMoleculeName: "Mégastigmatrienone",
    },
  ],
  houblon: [
    {
      id: "/9200365/BibliographicResource_3000126284846",
      title: "Récolte du houblon en Flandre",
      creator: "Pieter Brueghel le Jeune",
      date: "1620",
      institution: "Musées royaux des Beaux-Arts de Belgique",
      country: "Belgique",
      thumbnailUrl: buildThumbnailUrl("/9200365/BibliographicResource_3000126284846", 200),
      thumbnailUrlLarge: buildThumbnailUrl("/9200365/BibliographicResource_3000126284846", 400),
      iiifManifestUrl: buildIiifManifestUrl("/9200365/BibliographicResource_3000126284846"),
      europeanaUrl: "https://www.europeana.eu/search?query=hop+harvest+flemish",
      rights: "http://creativecommons.org/publicdomain/mark/1.0/",
      rightsLabel: "Domaine public",
      type: "IMAGE",
      theme: "houblon",
      relatedPlantName: "Humulus lupulus",
      relatedMoleculeName: "Myrcène",
    },
    {
      id: "/9200365/BibliographicResource_3000126284847",
      title: "Brasserie médiévale — Manuscrit enluminé",
      creator: "Scriptorium de Saint-Gall",
      date: "1150",
      institution: "Bibliothèque abbatiale de Saint-Gall",
      country: "Suisse",
      thumbnailUrl: buildThumbnailUrl("/9200365/BibliographicResource_3000126284847", 200),
      thumbnailUrlLarge: buildThumbnailUrl("/9200365/BibliographicResource_3000126284847", 400),
      iiifManifestUrl: buildIiifManifestUrl("/9200365/BibliographicResource_3000126284847"),
      europeanaUrl: "https://www.europeana.eu/search?query=medieval+brewing+manuscript",
      rights: "http://creativecommons.org/publicdomain/mark/1.0/",
      rightsLabel: "Domaine public",
      type: "IMAGE",
      theme: "houblon",
      relatedPlantName: "Humulus lupulus",
      relatedMoleculeName: "Humulone",
    },
  ],
  nard: [
    {
      id: "/9200365/BibliographicResource_3000126284848",
      title: "Marie-Madeleine et le vase de nard",
      creator: "Anonyme (École flamande)",
      date: "1600",
      institution: "Musée des Beaux-Arts de Gand",
      country: "Belgique",
      thumbnailUrl: buildThumbnailUrl("/9200365/BibliographicResource_3000126284848", 200),
      thumbnailUrlLarge: buildThumbnailUrl("/9200365/BibliographicResource_3000126284848", 400),
      iiifManifestUrl: buildIiifManifestUrl("/9200365/BibliographicResource_3000126284848"),
      europeanaUrl: "https://www.europeana.eu/search?query=mary+magdalene+spikenard",
      rights: "http://creativecommons.org/publicdomain/mark/1.0/",
      rightsLabel: "Domaine public",
      type: "IMAGE",
      theme: "nard",
      relatedPlantName: "Nardostachys jatamansi",
      relatedMoleculeName: "Nardol",
    },
  ],
  myrrhe: [
    {
      id: "/9200365/BibliographicResource_3000126284849",
      title: "Commerce de la myrrhe — Bas-relief égyptien",
      creator: "Anonyme (Égypte ancienne)",
      date: "-1450",
      institution: "British Museum, Londres",
      country: "Royaume-Uni",
      thumbnailUrl: buildThumbnailUrl("/9200365/BibliographicResource_3000126284849", 200),
      thumbnailUrlLarge: buildThumbnailUrl("/9200365/BibliographicResource_3000126284849", 400),
      iiifManifestUrl: buildIiifManifestUrl("/9200365/BibliographicResource_3000126284849"),
      europeanaUrl: "https://www.europeana.eu/search?query=myrrh+egypt+relief",
      rights: "http://creativecommons.org/publicdomain/mark/1.0/",
      rightsLabel: "Domaine public",
      type: "IMAGE",
      theme: "myrrhe",
      relatedPlantName: "Commiphora myrrha",
    },
  ],
};

// ─── Fonctions principales ────────────────────────────────────────────────────

/**
 * Recherche thématique Europeana avec support IIIF et pagination curseur.
 * Si la clé API est disponible, interroge l'API REST.
 * Sinon, retourne des données de démonstration.
 */
export async function searchEuropeanaThematic(
  theme: string,
  limit = 24,
  start = 1,
  cursor?: string
): Promise<EuropeanaSearchResult> {
  const themeConfig = THEMATIC_QUERIES[theme];
  if (!themeConfig) {
    return {
      items: [],
      total: 0,
      query: "",
      theme,
      apiAvailable: false,
      error: `Thème inconnu : ${theme}`,
    };
  }

  const apiKey = process.env.EUROPEANA_API_KEY;

  // Mode démonstration si pas de clé API
  if (!apiKey) {
    const demoItems = DEMO_ITEMS[theme] || [];
    return {
      items: demoItems,
      total: demoItems.length,
      query: themeConfig.query,
      theme,
      apiAvailable: false,
      error: "Mode démonstration — clé API Europeana non configurée. Les données affichées sont des exemples.",
    };
  }

  try {
    const url = new URL(EUROPEANA_SEARCH_URL);
    url.searchParams.set("wskey", apiKey);
    url.searchParams.set("query", themeConfig.query);
    url.searchParams.set("rows", String(Math.min(limit, 100)));
    url.searchParams.set("profile", "rich");
    url.searchParams.set("media", "true");
    url.searchParams.set("thumbnail", "true");

    // Filtre par type si défini
    if (themeConfig.typeFilter) {
      url.searchParams.append("qf", `TYPE:${themeConfig.typeFilter}`);
    }

    // Filtre par réutilisabilité si défini
    if (themeConfig.reusability) {
      url.searchParams.set("reusability", themeConfig.reusability);
    }

    // Pagination : curseur (deep pagination) ou start (basic)
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    } else {
      url.searchParams.set("start", String(start));
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "PERFUMUM-Research/1.0 (https://perfumum.research; contact@perfumum.research)",
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Europeana API HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json() as any;

    const items: EuropeanaItem[] = (data.items || []).map((item: any) =>
      mapApiItem(item, theme)
    );

    return {
      items,
      total: data.totalResults || 0,
      query: themeConfig.query,
      theme,
      apiAvailable: true,
      nextCursor: data.nextCursor,
    };
  } catch (e) {
    console.error(`[Europeana] searchThematic error for ${theme}:`, e);
    const demoItems = DEMO_ITEMS[theme] || [];
    return {
      items: demoItems,
      total: demoItems.length,
      query: themeConfig.query,
      theme,
      apiAvailable: false,
      error: e instanceof Error ? e.message : "Erreur API Europeana",
    };
  }
}

/**
 * Recherche Europeana par mot-clé libre avec support IIIF.
 */
export async function searchEuropeanaFree(
  query: string,
  limit = 24,
  typeFilter?: string,
  reusability?: string,
  cursor?: string
): Promise<EuropeanaSearchResult> {
  const apiKey = process.env.EUROPEANA_API_KEY;

  if (!apiKey) {
    return {
      items: [],
      total: 0,
      query,
      theme: "libre",
      apiAvailable: false,
      error: "Clé API Europeana non configurée. Veuillez ajouter EUROPEANA_API_KEY dans les secrets du projet.",
    };
  }

  try {
    const url = new URL(EUROPEANA_SEARCH_URL);
    url.searchParams.set("wskey", apiKey);
    url.searchParams.set("query", query);
    url.searchParams.set("rows", String(Math.min(limit, 100)));
    url.searchParams.set("profile", "rich");
    url.searchParams.set("thumbnail", "true");

    if (typeFilter) {
      url.searchParams.append("qf", `TYPE:${typeFilter}`);
    }
    if (reusability) {
      url.searchParams.set("reusability", reusability);
    }
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "PERFUMUM-Research/1.0",
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Europeana API HTTP ${response.status}`);
    }

    const data = await response.json() as any;

    const items: EuropeanaItem[] = (data.items || []).map((item: any) =>
      mapApiItem(item, "libre")
    );

    return {
      items,
      total: data.totalResults || 0,
      query,
      theme: "libre",
      apiAvailable: true,
      nextCursor: data.nextCursor,
    };
  } catch (e) {
    console.error(`[Europeana] searchFree error:`, e);
    return {
      items: [],
      total: 0,
      query,
      theme: "libre",
      apiAvailable: false,
      error: e instanceof Error ? e.message : "Erreur API Europeana",
    };
  }
}

/**
 * Recherche Europeana par nom de plante PERFUMUM.
 * Interroge les champs dc:subject, dc:description, dc:title.
 */
export async function searchEuropeanaByPlant(
  plantName: string,
  plantLatinName?: string,
  limit = 12
): Promise<EuropeanaSearchResult> {
  const terms = [plantName];
  if (plantLatinName && plantLatinName !== plantName) {
    terms.push(plantLatinName);
  }
  const query = terms.map(t => `"${t}"`).join(" OR ");
  return searchEuropeanaFree(query, limit, "IMAGE", "open");
}

/**
 * Recherche Europeana par nom de molécule PERFUMUM.
 */
export async function searchEuropeanaByMolecule(
  moleculeName: string,
  casNumber?: string,
  limit = 12
): Promise<EuropeanaSearchResult> {
  const terms = [moleculeName];
  if (casNumber) terms.push(casNumber);
  const query = terms.map(t => `"${t}"`).join(" OR ");
  return searchEuropeanaFree(query, limit, undefined, "open");
}

/**
 * Recherche Europeana par QID Wikidata.
 * Croise les identifiants Wikidata avec les collections Europeana.
 */
export async function searchEuropeanaByWikidataQid(
  qid: string,
  entityName: string,
  limit = 12
): Promise<EuropeanaSearchResult> {
  const query = `proxy_dc_subject:("${entityName}") OR proxy_dc_description:("${entityName}") OR proxy_dc_title:("${entityName}")`;

  const apiKey = process.env.EUROPEANA_API_KEY;

  if (!apiKey) {
    return {
      items: [],
      total: 0,
      query,
      theme: "qid",
      apiAvailable: false,
      error: "Clé API Europeana non configurée.",
    };
  }

  try {
    const url = new URL(EUROPEANA_SEARCH_URL);
    url.searchParams.set("wskey", apiKey);
    url.searchParams.set("query", query);
    url.searchParams.set("rows", String(Math.min(limit, 50)));
    url.searchParams.set("profile", "rich");
    url.searchParams.set("thumbnail", "true");
    url.searchParams.append("qf", "TYPE:IMAGE");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url.toString(), {
      headers: { "User-Agent": "PERFUMUM-Research/1.0", Accept: "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Europeana API HTTP ${response.status}`);

    const data = await response.json() as any;

    const items: EuropeanaItem[] = (data.items || []).map((item: any) =>
      mapApiItem(item, "qid")
    );

    return {
      items,
      total: data.totalResults || 0,
      query,
      theme: "qid",
      apiAvailable: true,
      nextCursor: data.nextCursor,
    };
  } catch (e) {
    console.error(`[Europeana] searchByQid error for ${qid}:`, e);
    return {
      items: [],
      total: 0,
      query,
      theme: "qid",
      apiAvailable: false,
      error: e instanceof Error ? e.message : "Erreur API Europeana",
    };
  }
}

/**
 * Récupère le détail d'un item Europeana via le Record API.
 * Retourne les métadonnées complètes + URLs IIIF.
 */
export async function getEuropeanaRecord(recordId: string): Promise<EuropeanaRecordDetail | null> {
  const apiKey = process.env.EUROPEANA_API_KEY;
  if (!apiKey) return null;

  try {
    const cleanId = recordId.startsWith("/") ? recordId : `/${recordId}`;
    const url = `${EUROPEANA_API_BASE}${cleanId}.json?wskey=${apiKey}&profile=rich`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url, {
      headers: { "User-Agent": "PERFUMUM-Research/1.0", Accept: "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = await response.json() as any;
    const obj = data.object;
    if (!obj) return null;

    const proxy = obj.proxies?.[0] || {};
    const aggregation = obj.aggregations?.[0] || {};

    const rightsRaw = aggregation.edmRights?.def?.[0];

    return {
      id: obj.about || recordId,
      title: proxy.dcTitle?.def?.[0] || proxy.dcTitle?.en?.[0] || "Sans titre",
      creator: proxy.dcCreator?.def?.[0] || proxy.dcCreator?.en?.[0],
      date: proxy.dcDate?.def?.[0] || proxy.dctermsCreated?.def?.[0],
      institution: aggregation.edmDataProvider?.def?.[0],
      country: obj.europeanaAggregation?.edmCountry?.def?.[0],
      thumbnailUrl: buildThumbnailUrl(obj.about, 200),
      thumbnailUrlLarge: buildThumbnailUrl(obj.about, 400),
      edmPreviewUrl: aggregation.edmIsShownBy,
      iiifManifestUrl: buildIiifManifestUrl(obj.about),
      iiifManifestV2: `${EUROPEANA_IIIF_BASE}/${obj.about.slice(1)}/manifest?format=2`,
      iiifManifestV3: buildIiifManifestUrl(obj.about),
      europeanaUrl: `https://www.europeana.eu/item${obj.about}`,
      rights: rightsRaw,
      rightsLabel: parseRightsLabel(rightsRaw),
      type: obj.type,
      theme: "record",
      description: proxy.dcDescription?.def || proxy.dcDescription?.en,
      format: proxy.dcFormat?.def,
      source: proxy.dcSource?.def,
      relation: proxy.dcRelation?.def,
      coverage: proxy.dcCoverage?.def,
      edmIsShownAt: aggregation.edmIsShownAt,
      edmIsShownBy: aggregation.edmIsShownBy,
    };
  } catch (e) {
    console.error(`[Europeana] getRecord error for ${recordId}:`, e);
    return null;
  }
}

/**
 * Retourne la configuration des thèmes disponibles.
 */
export function getThematicConfig() {
  return Object.entries(THEMATIC_QUERIES).map(([key, config]) => ({
    key,
    label: config.label,
    description: config.description,
    relatedPlants: config.relatedPlants,
    relatedMolecules: config.relatedMolecules,
    color: config.color,
  }));
}
