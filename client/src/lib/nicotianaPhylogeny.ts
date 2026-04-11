/**
 * Phylogénie du genre Nicotiana basée sur Santilli et al. (2022)
 * Article: "Nicotiana rupicola sp. nov. and Nicotiana knightiana (sect. Paniculatae, Solanaceae)"
 * Source: PhytoKeys 188: 83–103 (2022)
 * DOI: 10.3897/phytokeys.188.73370
 */

export interface PhylogeneticNode {
  id: string;
  name: string;
  latinName?: string;
  section?: string;
  bootstrapValue?: number;
  posteriorProbability?: number;
  children?: PhylogeneticNode[];
  isExtinct?: boolean;
  conservationStatus?: 'CR' | 'EN' | 'VU' | 'NT' | 'LC' | 'DD';
  notes?: string;
  sourceArticle?: string;
}

// Structure complète de l'arbre phylogénétique du genre Nicotiana
export const nicotianaPhylogeny: PhylogeneticNode = {
  id: 'nicotiana-root',
  name: 'Nicotiana L.',
  latinName: 'Nicotiana',
  section: 'Genus',
  notes: '75 recognized species (Clarkson et al. 2017)',
  sourceArticle: 'Santilli et al. (2022)',
  children: [
    {
      id: 'tomentosae',
      name: 'Section Tomentosae',
      section: 'Tomentosae',
      bootstrapValue: 88,
      posteriorProbability: 1.0,
      children: [
        { id: 'n-tomentosifor', name: 'Nicotiana tomentosifor mis', latinName: 'N. tomentosifor mis' },
        { id: 'n-tomentos', name: 'Nicotiana tomentos', latinName: 'N. tomentos' },
        { id: 'n-kawakami', name: 'Nicotiana kawakami', latinName: 'N. kawakami' },
        { id: 'n-olopha', name: 'Nicotiana olopha', latinName: 'N. olopha' },
      ]
    },
    {
      id: 'undulatae-paniculatae-clade',
      name: 'Undulatae + Paniculatae + Rest',
      bootstrapValue: 87,
      posteriorProbability: 1.0,
      children: [
        {
          id: 'undulatae',
          name: 'Section Undulatae',
          section: 'Undulatae',
          bootstrapValue: 95,
          posteriorProbability: 1.0,
          children: [
            { id: 'n-undulata', name: 'Nicotiana undulata', latinName: 'N. undulata' },
            { id: 'n-thyrsiflo', name: 'Nicotiana thyrsiflo', latinName: 'N. thyrsiflo' },
            { id: 'n-glaucina', name: 'Nicotiana glaucina', latinName: 'N. glaucina' },
            { id: 'n-acaulis', name: 'Nicotiana acaulis', latinName: 'N. acaulis' },
          ]
        },
        {
          id: 'paniculatae-rest-clade',
          name: 'Paniculatae + Rest',
          bootstrapValue: 87,
          posteriorProbability: 1.0,
          children: [
            {
              id: 'paniculatae',
              name: 'Section Paniculatae',
              section: 'Paniculatae',
              bootstrapValue: 87,
              posteriorProbability: 1.0,
              notes: 'Includes N. rupicola (new species), N. knightiana, N. cordifolia, N. solanifolia, N. rustica, N. paniculata',
              children: [
                {
                  id: 'paniculatae-clade1',
                  name: 'Paniculatae Clade 1',
                  bootstrapValue: 100,
                  posteriorProbability: 1.0,
                  children: [
                    {
                      id: 'rupicola-cordifolia-solanifolia',
                      name: 'N. rupicola + N. cordifolia + N. solanifolia',
                      bootstrapValue: 100,
                      posteriorProbability: 1.0,
                      children: [
                        {
                          id: 'rupicola-cordifolia',
                          name: 'N. rupicola (sister to N. cordifolia)',
                          bootstrapValue: 89,
                          posteriorProbability: 0.99,
                          children: [
                            { 
                              id: 'n-rupicola', 
                              name: 'Nicotiana rupicola sp. nov.', 
                              latinName: 'N. rupicola',
                              conservationStatus: 'CR',
                              notes: 'New endemic species to Coquimbo, Chile. Critically endangered due to restricted distribution and mining/urbanization threats.'
                            },
                            { 
                              id: 'n-cordifolia', 
                              name: 'Nicotiana cordifolia', 
                              latinName: 'N. cordifolia',
                              notes: 'Endemic to Juan Fernandez Archipelago'
                            },
                          ]
                        },
                        { 
                          id: 'n-solanifolia', 
                          name: 'Nicotiana solanifolia', 
                          latinName: 'N. solanifolia',
                          notes: 'Grows between Tarapacá and Coquimbo regions. Traditionally used in Atacama coastal communities.'
                        },
                      ]
                    },
                    {
                      id: 'knightiana-paniculata-rustica',
                      name: 'N. knightiana + N. paniculata + N. rustica',
                      bootstrapValue: 100,
                      posteriorProbability: 1.0,
                      children: [
                        {
                          id: 'knightiana-paniculata',
                          name: 'N. knightiana (sister to N. paniculata)',
                          bootstrapValue: 63,
                          posteriorProbability: 0.98,
                          children: [
                            { 
                              id: 'n-knightiana', 
                              name: 'Nicotiana knightiana', 
                              latinName: 'N. knightiana',
                              notes: 'First record for Chile flora. Known from coastal southern Peru. New record in Atacama and Coquimbo regions.'
                            },
                            { 
                              id: 'n-paniculata', 
                              name: 'Nicotiana paniculata', 
                              latinName: 'N. paniculata'
                            },
                          ]
                        },
                        { 
                          id: 'n-rustica', 
                          name: 'Nicotiana rustica', 
                          latinName: 'N. rustica',
                          notes: 'Important crop species'
                        },
                      ]
                    },
                  ]
                },
              ]
            },
            {
              id: 'rest-of-genus',
              name: 'Rest of Nicotiana',
              bootstrapValue: 87,
              posteriorProbability: 1.0,
              children: [
                {
                  id: 'trigonophyllae',
                  name: 'Section Trigonophyllae',
                  section: 'Trigonophyllae',
                  bootstrapValue: 100,
                  posteriorProbability: 1.0,
                  children: [
                    { id: 'n-palmeri', name: 'Nicotiana palmeri', latinName: 'N. palmeri' },
                    { id: 'n-trigonophylla', name: 'Nicotiana trigonophylla', latinName: 'N. trigonophylla' },
                    { id: 'n-quadrivalvis', name: 'Nicotiana quadrivalvis var. bigelovii', latinName: 'N. quadrivalvis var. bigelovii' },
                    { id: 'n-clevelandii', name: 'Nicotiana clevelandii', latinName: 'N. clevelandii' },
                  ]
                },
                {
                  id: 'petunioides',
                  name: 'Section Petunioides',
                  section: 'Petunioides',
                  bootstrapValue: 100,
                  posteriorProbability: 1.0,
                  children: [
                    { id: 'n-petunioides', name: 'Nicotiana petunioides', latinName: 'N. petunioides' },
                  ]
                },
                {
                  id: 'alatae',
                  name: 'Section Alatae',
                  section: 'Alatae',
                  bootstrapValue: 96,
                  posteriorProbability: 1.0,
                  children: [
                    { id: 'n-langsdorffii', name: 'Nicotiana langsdorffii', latinName: 'N. langsdorffii' },
                    { id: 'n-alata', name: 'Nicotiana alata', latinName: 'N. alata' },
                    { id: 'n-longiflora', name: 'Nicotiana longiflora', latinName: 'N. longiflora' },
                    { id: 'n-plumbaginifolia', name: 'Nicotiana plumbaginifolia', latinName: 'N. plumbaginifolia' },
                    { id: 'n-tabacum', name: 'Nicotiana tabacum', latinName: 'N. tabacum', notes: 'Important crop species' },
                  ]
                },
                {
                  id: 'repandae',
                  name: 'Section Repandae',
                  section: 'Repandae',
                  bootstrapValue: 100,
                  posteriorProbability: 1.0,
                  children: [
                    { id: 'n-repanda', name: 'Nicotiana repanda', latinName: 'N. repanda' },
                  ]
                },
                {
                  id: 'noctiflorae',
                  name: 'Section Noctiflorae',
                  section: 'Noctiflorae',
                  bootstrapValue: 100,
                  posteriorProbability: 1.0,
                  children: [
                    { id: 'n-noctiflora', name: 'Nicotiana noctiflora', latinName: 'N. noctiflora' },
                    { id: 'n-glauca', name: 'Nicotiana glauca', latinName: 'N. glauca' },
                  ]
                },
                {
                  id: 'suaveolentes',
                  name: 'Section Suaveolentes',
                  section: 'Suaveolentes',
                  bootstrapValue: 60,
                  posteriorProbability: 0.94,
                  children: [
                    { id: 'n-maritima', name: 'Nicotiana maritima', latinName: 'N. maritima' },
                    { id: 'n-exigua', name: 'Nicotiana exigua', latinName: 'N. exigua' },
                    { id: 'n-suaveolens', name: 'Nicotiana suaveolens', latinName: 'N. suaveolens' },
                    { id: 'n-amplexicaulis', name: 'Nicotiana amplexicaulis', latinName: 'N. amplexicaulis' },
                    { id: 'n-velutina', name: 'Nicotiana velutina', latinName: 'N. velutina' },
                    { id: 'n-rotundifolia', name: 'Nicotiana rotundifolia', latinName: 'N. rotundifolia' },
                    { id: 'n-rosulata', name: 'Nicotiana rosulata', latinName: 'N. rosulata' },
                    { id: 'n-cavicola', name: 'Nicotiana cavicola', latinName: 'N. cavicola' },
                    { id: 'n-megalosiphon', name: 'Nicotiana megalosiphon', latinName: 'N. megalosiphon' },
                    { id: 'n-gossei', name: 'Nicotiana gossei', latinName: 'N. gossei' },
                    { id: 'n-goodspeedii', name: 'Nicotiana goodspeedii', latinName: 'N. goodspeedii' },
                    { id: 'n-occidentalis', name: 'Nicotiana occidentalis', latinName: 'N. occidentalis' },
                    { id: 'n-debneyi', name: 'Nicotiana debneyi', latinName: 'N. debneyi' },
                    { id: 'n-africana', name: 'Nicotiana africana', latinName: 'N. africana' },
                  ]
                },
              ]
            },
          ]
        },
      ]
    },
  ]
};

// Métadonnées de l'article source
export const sourceMetadata = {
  title: 'Nicotiana rupicola sp. nov. and Nicotiana knightiana (sect. Paniculatae, Solanaceae), a new endemic and a new record for the flora of Chile',
  authors: 'Ludovica Santilli, Fernanda Pérez, Claire De Schrevel, Philippe Dandois, Héctor Mondaca, Nicolás Lavandero',
  year: 2022,
  journal: 'PhytoKeys',
  volume: 188,
  pages: '83–103',
  doi: '10.3897/phytokeys.188.73370',
  url: 'https://phytokeys.pensoft.net',
  phylogeneticMethods: {
    dnaRegions: ['trnF-trnL', 'trnS-trnG', 'ndhF', 'matK'],
    analyses: ['Maximum-likelihood (ML)', 'Bayesian inference (BI)'],
    software: ['RAxML-AVX3', 'MrBayes x64 v3.2.7'],
    totalSequences: 4427,
    inGroupAccessions: 60,
    outGroupAccessions: 2,
  },
  keyFindings: [
    'N. rupicola is a new endemic species to Coquimbo, Chile',
    'N. knightiana is recorded for the first time for Chile',
    'Both species belong to section Paniculatae',
    'N. rupicola is sister to N. cordifolia (endemic to Juan Fernandez)',
    'N. rupicola is critically endangered (CR) due to restricted distribution and urbanization/mining threats',
  ]
};

// ── Helper : aplatir l'arbre en liste de feuilles (espèces) ──────────────────
export function flattenToSpecies(node: PhylogeneticNode): PhylogeneticNode[] {
  if (!node.children || node.children.length === 0) {
    return [node];
  }
  return node.children.flatMap(flattenToSpecies);
}

export const nicotianaSpeciesList: PhylogeneticNode[] = flattenToSpecies(nicotianaPhylogeny);
