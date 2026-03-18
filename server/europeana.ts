/**
 * PERFUMUM — Service Europeana
 * ==============================
 * Intégration de l'API REST Europeana pour interroger les collections
 * muséales européennes (Louvre, Rijksmuseum, British Museum, etc.)
 *
 * API : https://api.europeana.eu/record/v2/search.json
 * Docs : https://pro.europeana.eu/page/search
 *
 * Trois requêtes thématiques PERFUMUM :
 * 1. Rose de Damas — "toutes les œuvres d'art mentionnant la Rose de Damas"
 * 2. Encens — "représentations de l'encens dans les collections européennes"
 * 3. Tabac ottoman — "iconographie du tabac ottoman"
 *
 * Mode dégradé : si EUROPEANA_API_KEY est absent, retourne des données
 * de démonstration pour permettre le développement de l'interface.
 */

const EUROPEANA_API_BASE = "https://api.europeana.eu/record/v2";
const EUROPEANA_SEARCH_URL = `${EUROPEANA_API_BASE}/search.json`;
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
  edmPreviewUrl?: string;
  europeanaUrl: string;
  rights?: string;
  type?: string; // IMAGE, TEXT, VIDEO, SOUND, 3D
  theme?: string; // thème PERFUMUM (rose_damas, encens, tabac_ottoman, libre)
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
  error?: string;
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
  },
  encens: {
    label: "Encens & Oliban",
    query: "frankincense OR olibanum OR encens OR Weihrauch OR Boswellia",
    description:
      "Représentations de l'encens et de l'oliban dans les collections européennes — rituels, commerce, iconographie religieuse.",
    relatedPlants: ["Boswellia sacra", "Boswellia carterii", "Boswellia serrata"],
    relatedMolecules: ["α-Pinène", "Limonène", "Incensole acétate", "Boswellic acid"],
    color: "#d97706",
  },
  tabac_ottoman: {
    label: "Tabac ottoman",
    query: "Ottoman tobacco OR tabac ottoman OR narghilé OR hookah OR chibouk OR tütün",
    description:
      "Iconographie du tabac ottoman — pipes, narguilés, scènes de café, portraits de fumeurs dans les collections européennes.",
    relatedPlants: ["Nicotiana tabacum", "Nicotiana rustica"],
    relatedMolecules: ["Nicotine", "Solanone", "Mégastigmatrienone", "Phytol"],
    color: "#7c3aed",
  },
  houblon: {
    label: "Houblon & Brasserie",
    query: "hops brewing OR houblon bière OR Humulus lupulus OR hop harvest",
    description:
      "Représentations du houblon et de la brasserie dans les collections européennes — récolte, brassage, scènes rurales.",
    relatedPlants: ["Humulus lupulus"],
    relatedMolecules: ["Myrcène", "Humulone", "Lupulone", "Linalol"],
    color: "#16a34a",
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
      thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Rosa_damascena_Redoute.jpg/400px-Rosa_damascena_Redoute.jpg",
      europeanaUrl: "https://www.europeana.eu/item/9200365/BibliographicResource_3000126284840",
      rights: "Public Domain",
      type: "IMAGE",
      theme: "rose_damas",
      relatedPlantName: "Rosa damascena",
      relatedMoleculeName: "Géraniol",
    },
    {
      id: "/2048007/Museu_ProvidedCHO_Museu_Nacional_d_Art_de_Catalunya_15917",
      title: "Vase de roses de Damas",
      creator: "Jan van Huysum",
      date: "1720",
      institution: "Rijksmuseum Amsterdam",
      country: "Pays-Bas",
      thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Jan_van_Huysum_-_Flowers_in_a_Vase_-_WGA11837.jpg/400px-Jan_van_Huysum_-_Flowers_in_a_Vase_-_WGA11837.jpg",
      europeanaUrl: "https://www.europeana.eu/item/90402/RP_P_OB_72_050",
      rights: "Public Domain",
      type: "IMAGE",
      theme: "rose_damas",
      relatedPlantName: "Rosa damascena",
    },
    {
      id: "/demo/rose_damas_3",
      title: "L'Alchimiste distillant l'eau de rose",
      creator: "Anonyme (École flamande)",
      date: "1650",
      institution: "Musée du Louvre",
      country: "France",
      thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Distillation_alchemist.jpg/400px-Distillation_alchemist.jpg",
      europeanaUrl: "https://www.europeana.eu/search?query=rose+damascena",
      rights: "Public Domain",
      type: "IMAGE",
      theme: "rose_damas",
      relatedMoleculeName: "Damascénone",
    },
  ],
  encens: [
    {
      id: "/demo/encens_1",
      title: "L'Adoration des Mages — scène d'encensement",
      creator: "Fra Angelico",
      date: "1440",
      institution: "Museo di San Marco, Florence",
      country: "Italie",
      thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Fra_Angelico_-_Adoration_of_the_Magi_-_WGA00540.jpg/400px-Fra_Angelico_-_Adoration_of_the_Magi_-_WGA00540.jpg",
      europeanaUrl: "https://www.europeana.eu/search?query=frankincense+adoration",
      rights: "Public Domain",
      type: "IMAGE",
      theme: "encens",
      relatedPlantName: "Boswellia sacra",
      relatedMoleculeName: "α-Pinène",
    },
    {
      id: "/demo/encens_2",
      title: "Encensoir liturgique — Art roman",
      creator: "Atelier rhénan",
      date: "1150",
      institution: "Musée de Cluny, Paris",
      country: "France",
      thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Thurible_Cluny.jpg/400px-Thurible_Cluny.jpg",
      europeanaUrl: "https://www.europeana.eu/search?query=encensoir+roman",
      rights: "Public Domain",
      type: "IMAGE",
      theme: "encens",
      relatedMoleculeName: "Incensole acétate",
    },
    {
      id: "/demo/encens_3",
      title: "Route de l'encens — Carte commerciale",
      creator: "Cartographe hollandais",
      date: "1680",
      institution: "Bibliothèque royale de Belgique",
      country: "Belgique",
      thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Incense_route_map.jpg/400px-Incense_route_map.jpg",
      europeanaUrl: "https://www.europeana.eu/search?query=incense+route+map",
      rights: "Public Domain",
      type: "IMAGE",
      theme: "encens",
      relatedPlantName: "Boswellia carterii",
    },
  ],
  tabac_ottoman: [
    {
      id: "/demo/tabac_1",
      title: "Fumeur de narguilé — Scène orientaliste",
      creator: "Eugène Delacroix",
      date: "1832",
      institution: "Musée du Louvre",
      country: "France",
      thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Delacroix_Moroccan.jpg/400px-Delacroix_Moroccan.jpg",
      europeanaUrl: "https://www.europeana.eu/search?query=nargile+ottoman+smoking",
      rights: "Public Domain",
      type: "IMAGE",
      theme: "tabac_ottoman",
      relatedPlantName: "Nicotiana tabacum",
      relatedMoleculeName: "Nicotine",
    },
    {
      id: "/demo/tabac_2",
      title: "Café ottoman — Hommes fumant le chibouk",
      creator: "Jean-Léon Gérôme",
      date: "1870",
      institution: "Hermitage Museum, Saint-Pétersbourg",
      country: "Russie",
      thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Jean-L%C3%A9on_G%C3%A9r%C3%B4me_-_Praying_in_Cairo.jpg/400px-Jean-L%C3%A9on_G%C3%A9r%C3%B4me_-_Praying_in_Cairo.jpg",
      europeanaUrl: "https://www.europeana.eu/search?query=ottoman+coffee+house+smoking",
      rights: "Public Domain",
      type: "IMAGE",
      theme: "tabac_ottoman",
      relatedPlantName: "Nicotiana rustica",
      relatedMoleculeName: "Solanone",
    },
    {
      id: "/demo/tabac_3",
      title: "Pipe à tabac ottomane — Chibouk en ambre",
      creator: "Atelier ottoman",
      date: "1800",
      institution: "Victoria and Albert Museum, Londres",
      country: "Royaume-Uni",
      thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Ottoman_pipe.jpg/400px-Ottoman_pipe.jpg",
      europeanaUrl: "https://www.europeana.eu/search?query=chibouk+ottoman+pipe",
      rights: "Public Domain",
      type: "IMAGE",
      theme: "tabac_ottoman",
      relatedMoleculeName: "Mégastigmatrienone",
    },
  ],
  houblon: [
    {
      id: "/demo/houblon_1",
      title: "Récolte du houblon en Flandre",
      creator: "Pieter Brueghel le Jeune",
      date: "1620",
      institution: "Musées royaux des Beaux-Arts de Belgique",
      country: "Belgique",
      thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Hop_picking_Flemish.jpg/400px-Hop_picking_Flemish.jpg",
      europeanaUrl: "https://www.europeana.eu/search?query=hop+harvest+flemish",
      rights: "Public Domain",
      type: "IMAGE",
      theme: "houblon",
      relatedPlantName: "Humulus lupulus",
      relatedMoleculeName: "Myrcène",
    },
    {
      id: "/demo/houblon_2",
      title: "Brasserie médiévale — Manuscrit enluminé",
      creator: "Scriptorium de Saint-Gall",
      date: "1150",
      institution: "Bibliothèque abbatiale de Saint-Gall",
      country: "Suisse",
      thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Medieval_brewing.jpg/400px-Medieval_brewing.jpg",
      europeanaUrl: "https://www.europeana.eu/search?query=medieval+brewing+manuscript",
      rights: "Public Domain",
      type: "IMAGE",
      theme: "houblon",
      relatedPlantName: "Humulus lupulus",
      relatedMoleculeName: "Humulone",
    },
  ],
};

// ─── Fonctions principales ────────────────────────────────────────────────────

/**
 * Recherche thématique Europeana
 * Si la clé API est disponible, interroge l'API REST.
 * Sinon, retourne des données de démonstration.
 */
export async function searchEuropeanaThematic(
  theme: string,
  limit = 24,
  start = 1
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
    url.searchParams.set("start", String(start));
    url.searchParams.set("profile", "rich");
    url.searchParams.set("media", "true"); // Seulement les items avec média
    url.searchParams.set("thumbnail", "true");
    url.searchParams.set("qf", "TYPE:IMAGE"); // Priorité aux images

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

    const items: EuropeanaItem[] = (data.items || []).map((item: any) => ({
      id: item.id || "",
      title: Array.isArray(item.title) ? item.title[0] : (item.title || "Sans titre"),
      creator: Array.isArray(item.dcCreator) ? item.dcCreator[0] : item.dcCreator,
      date: Array.isArray(item.year) ? item.year[0] : item.year,
      institution: Array.isArray(item.dataProvider) ? item.dataProvider[0] : item.dataProvider,
      country: Array.isArray(item.country) ? item.country[0] : item.country,
      thumbnailUrl: item.edmPreview?.[0] || item.edmIsShownBy?.[0],
      edmPreviewUrl: item.edmIsShownBy?.[0],
      europeanaUrl: `https://www.europeana.eu/item${item.id}`,
      rights: Array.isArray(item.rights) ? item.rights[0] : item.rights,
      type: Array.isArray(item.type) ? item.type[0] : item.type,
      theme,
    }));

    return {
      items,
      total: data.totalResults || 0,
      query: themeConfig.query,
      theme,
      apiAvailable: true,
    };
  } catch (e) {
    console.error(`[Europeana] searchThematic error for ${theme}:`, e);
    // Fallback sur les données de démonstration en cas d'erreur
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
 * Recherche Europeana par mot-clé libre
 */
export async function searchEuropeanaFree(
  query: string,
  limit = 24,
  typeFilter?: string
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
      url.searchParams.set("qf", `TYPE:${typeFilter}`);
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

    const items: EuropeanaItem[] = (data.items || []).map((item: any) => ({
      id: item.id || "",
      title: Array.isArray(item.title) ? item.title[0] : (item.title || "Sans titre"),
      creator: Array.isArray(item.dcCreator) ? item.dcCreator[0] : item.dcCreator,
      date: Array.isArray(item.year) ? item.year[0] : item.year,
      institution: Array.isArray(item.dataProvider) ? item.dataProvider[0] : item.dataProvider,
      country: Array.isArray(item.country) ? item.country[0] : item.country,
      thumbnailUrl: item.edmPreview?.[0] || item.edmIsShownBy?.[0],
      europeanaUrl: `https://www.europeana.eu/item${item.id}`,
      rights: Array.isArray(item.rights) ? item.rights[0] : item.rights,
      type: Array.isArray(item.type) ? item.type[0] : item.type,
      theme: "libre",
    }));

    return {
      items,
      total: data.totalResults || 0,
      query,
      theme: "libre",
      apiAvailable: true,
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
 * Recherche Europeana par QID Wikidata
 * Croise les identifiants Wikidata avec les collections Europeana
 */
export async function searchEuropeanaByWikidataQid(
  qid: string,
  entityName: string,
  limit = 12
): Promise<EuropeanaSearchResult> {
  // Europeana indexe les liens Wikidata via edm:isRelatedTo et owl:sameAs
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
    url.searchParams.set("qf", "TYPE:IMAGE");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url.toString(), {
      headers: { "User-Agent": "PERFUMUM-Research/1.0", Accept: "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Europeana API HTTP ${response.status}`);

    const data = await response.json() as any;

    const items: EuropeanaItem[] = (data.items || []).map((item: any) => ({
      id: item.id || "",
      title: Array.isArray(item.title) ? item.title[0] : (item.title || "Sans titre"),
      creator: Array.isArray(item.dcCreator) ? item.dcCreator[0] : item.dcCreator,
      date: Array.isArray(item.year) ? item.year[0] : item.year,
      institution: Array.isArray(item.dataProvider) ? item.dataProvider[0] : item.dataProvider,
      country: Array.isArray(item.country) ? item.country[0] : item.country,
      thumbnailUrl: item.edmPreview?.[0],
      europeanaUrl: `https://www.europeana.eu/item${item.id}`,
      rights: Array.isArray(item.rights) ? item.rights[0] : item.rights,
      type: Array.isArray(item.type) ? item.type[0] : item.type,
      theme: "qid",
    }));

    return {
      items,
      total: data.totalResults || 0,
      query,
      theme: "qid",
      apiAvailable: true,
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
 * Retourne la configuration des thèmes disponibles
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
