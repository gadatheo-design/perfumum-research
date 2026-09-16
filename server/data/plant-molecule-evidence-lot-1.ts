export type PlantMoleculeEvidence = {
  plantId: number;
  plantLabel: string;
  expectedLatinName: string;
  moleculeLabel: string;
  moleculeCasNumber: string;
  percentageMin: number;
  percentageMax: number;
  sourceCitation: string;
  sourceUrl: string;
  method: string;
  evidenceLevel: "Confirmé GC-MS";
  sampleContext: string;
  caveat: string;
};

/**
 * Petit lot conservateur, transcrit uniquement depuis Mac Sweeney et al. (2025).
 * Les bornes sont moyenne ± écart-type, calculées à partir du tableau de l’article.
 * Elles décrivent l’échantillon étudié, pas une composition taxonomique universelle.
 */
export const plantMoleculeEvidenceLot1: PlantMoleculeEvidence[] = [
  {
    plantId: 750006, plantLabel: "Lavande des Pyrénées", expectedLatinName: "Lavandula angustifolia subsp. pyrenaica",
    moleculeLabel: "Linalol", moleculeCasNumber: "78-70-6", percentageMin: 20.65, percentageMax: 22.95,
    sourceCitation: "Mac Sweeney et al., 2025, Chemistry & Biodiversity, e202403478", sourceUrl: "https://doi.org/10.1002/cbdv.202403478",
    method: "Hydrodistillation puis GC-MS", evidenceLevel: "Confirmé GC-MS",
    sampleContext: "Huile essentielle de Lavandula angustifolia subsp. pyrenaica étudiée par les auteurs.",
    caveat: "Plage calculée comme moyenne ± écart-type publiée (21,8 ± 1,15 %), propre à cet échantillon et à ce protocole.",
  },
  {
    plantId: 750006, plantLabel: "Lavande des Pyrénées", expectedLatinName: "Lavandula angustifolia subsp. pyrenaica",
    moleculeLabel: "Acétate de linalyle", moleculeCasNumber: "115-95-7", percentageMin: 19.86, percentageMax: 20.34,
    sourceCitation: "Mac Sweeney et al., 2025, Chemistry & Biodiversity, e202403478", sourceUrl: "https://doi.org/10.1002/cbdv.202403478",
    method: "Hydrodistillation puis GC-MS", evidenceLevel: "Confirmé GC-MS",
    sampleContext: "Huile essentielle de Lavandula angustifolia subsp. pyrenaica étudiée par les auteurs.",
    caveat: "Plage calculée comme moyenne ± écart-type publiée (20,1 ± 0,24 %), propre à cet échantillon et à ce protocole.",
  },
  {
    plantId: 750006, plantLabel: "Lavande des Pyrénées", expectedLatinName: "Lavandula angustifolia subsp. pyrenaica",
    moleculeLabel: "Camphre", moleculeCasNumber: "76-22-2", percentageMin: 0.46, percentageMax: 0.54,
    sourceCitation: "Mac Sweeney et al., 2025, Chemistry & Biodiversity, e202403478", sourceUrl: "https://doi.org/10.1002/cbdv.202403478",
    method: "Hydrodistillation puis GC-MS", evidenceLevel: "Confirmé GC-MS",
    sampleContext: "Huile essentielle de Lavandula angustifolia subsp. pyrenaica étudiée par les auteurs.",
    caveat: "Plage calculée comme moyenne ± écart-type publiée (0,5 ± 0,04 %), propre à cet échantillon et à ce protocole.",
  },
  {
    plantId: 750007, plantLabel: "Lavandin Grosso", expectedLatinName: "Lavandula × intermedia",
    moleculeLabel: "Linalol", moleculeCasNumber: "78-70-6", percentageMin: 26.58, percentageMax: 27.42,
    sourceCitation: "Mac Sweeney et al., 2025, Chemistry & Biodiversity, e202403478", sourceUrl: "https://doi.org/10.1002/cbdv.202403478",
    method: "Hydrodistillation puis GC-MS", evidenceLevel: "Confirmé GC-MS",
    sampleContext: "Huile essentielle de Lavandula × intermedia cv. Grosso étudiée par les auteurs.",
    caveat: "Plage calculée comme moyenne ± écart-type publiée (27,0 ± 0,42 %), propre à cet échantillon et à ce protocole.",
  },
  {
    plantId: 750007, plantLabel: "Lavandin Grosso", expectedLatinName: "Lavandula × intermedia",
    moleculeLabel: "Acétate de linalyle", moleculeCasNumber: "115-95-7", percentageMin: 18.89, percentageMax: 19.31,
    sourceCitation: "Mac Sweeney et al., 2025, Chemistry & Biodiversity, e202403478", sourceUrl: "https://doi.org/10.1002/cbdv.202403478",
    method: "Hydrodistillation puis GC-MS", evidenceLevel: "Confirmé GC-MS",
    sampleContext: "Huile essentielle de Lavandula × intermedia cv. Grosso étudiée par les auteurs.",
    caveat: "Plage calculée comme moyenne ± écart-type publiée (19,1 ± 0,21 %), propre à cet échantillon et à ce protocole.",
  },
  {
    plantId: 750007, plantLabel: "Lavandin Grosso", expectedLatinName: "Lavandula × intermedia",
    moleculeLabel: "Camphre", moleculeCasNumber: "76-22-2", percentageMin: 6.35, percentageMax: 6.45,
    sourceCitation: "Mac Sweeney et al., 2025, Chemistry & Biodiversity, e202403478", sourceUrl: "https://doi.org/10.1002/cbdv.202403478",
    method: "Hydrodistillation puis GC-MS", evidenceLevel: "Confirmé GC-MS",
    sampleContext: "Huile essentielle de Lavandula × intermedia cv. Grosso étudiée par les auteurs.",
    caveat: "Plage calculée comme moyenne ± écart-type publiée (6,4 ± 0,05 %), propre à cet échantillon et à ce protocole.",
  },
  {
    plantId: 750007, plantLabel: "Lavandin Grosso", expectedLatinName: "Lavandula × intermedia",
    moleculeLabel: "Bornéol", moleculeCasNumber: "507-70-0", percentageMin: 4.59, percentageMax: 4.81,
    sourceCitation: "Mac Sweeney et al., 2025, Chemistry & Biodiversity, e202403478", sourceUrl: "https://doi.org/10.1002/cbdv.202403478",
    method: "Hydrodistillation puis GC-MS", evidenceLevel: "Confirmé GC-MS",
    sampleContext: "Huile essentielle de Lavandula × intermedia cv. Grosso étudiée par les auteurs.",
    caveat: "Plage calculée comme moyenne ± écart-type publiée (4,7 ± 0,11 %), propre à cet échantillon et à ce protocole.",
  },
];

export const withheldPlantMoleculeEvidenceLot1 = [
  "1,8-cinéole pour les lavandes : deux entrées moléculaires locales partagent le CAS 470-82-6 ; aucun choix automatique n’est autorisé.",
  "Rosa × alba : la publication vérifiée emploie Rosa alba L. ; la correspondance nomenclaturale avec l’hybride de la base exige une confirmation taxonomique.",
  "Rosa damascena var. trigintipetala et Jasminum sambac ‘Maid of Orleans’ : les sources contrôlées ne valident pas la variété ou le cultivar exact.",
  "Cananga odorata var. fruticosa : la source confirme une analyse GC-MS de 49 COV mais les lignes analytiques de chaque molécule cible n’ont pas encore été transcrites et rapprochées.",
];
