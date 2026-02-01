/**
 * Chemical Families Classification Service
 * 
 * Classifies molecules into chemical families based on:
 * - SMILES patterns
 * - IUPAC name patterns
 * - Common name patterns
 * 
 * Families: Terpenes, Aldehydes, Alcohols, Esters, Ketones, Phenols, 
 *           Ethers, Carboxylic Acids, Lactones, Coumarins, Musks, 
 *           Indoles, Furanones, Nitriles, Pyrazines, Thiazoles, Sulfides
 */

export interface ChemicalFamily {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  smilesPatterns: RegExp[];
  namePatterns: RegExp[];
  iupacPatterns: RegExp[];
}

export const CHEMICAL_FAMILIES: ChemicalFamily[] = [
  {
    id: 'terpene',
    name: 'Terpenes',
    nameFr: 'Terpènes',
    description: 'Hydrocarbons derived from isoprene units (C5H8)n',
    smilesPatterns: [
      /C=C\(C\)C/i,
      /CC\(=C\)C/i,
      /C1=CC=C\(C\)CC1/i,
    ],
    namePatterns: [
      /terpene/i, /terpinene/i, /pinene/i, /limonene/i, /myrcene/i,
      /ocimene/i, /phellandrene/i, /sabinene/i, /carene/i, /cymene/i,
      /caryophyllene/i, /humulene/i, /farnesene/i, /bisabolene/i,
      /cadinene/i, /germacrene/i, /elemene/i, /selinene/i, /guaiene/i,
      /eudesmene/i, /valencene/i, /zingiberene/i, /cedrene/i, /vetivene/i,
      /santalene/i, /bergamotene/i, /copaene/i, /cubebene/i, /muurolene/i,
      /aromadendrene/i, /longifolene/i, /isolongifolene/i, /thujene/i,
      /camphene/i, /fenchene/i, /tricyclene/i, /bornylene/i,
    ],
    iupacPatterns: [
      /cyclohex.*ene/i, /bicyclo.*hept/i, /mentha/i,
    ]
  },
  {
    id: 'aldehyde',
    name: 'Aldehydes',
    nameFr: 'Aldéhydes',
    description: 'Compounds containing a -CHO functional group',
    smilesPatterns: [
      /C=O(?![^(]*\))/i,
      /\[CH\]=O/i,
      /C\(=O\)\[H\]/i,
    ],
    namePatterns: [
      /aldehyde/i, /al$/i, /citral/i, /citronellal/i, /geranial/i,
      /neral/i, /benzaldehyde/i, /cinnamaldehyde/i, /vanillin/i,
      /heliotropin/i, /anisaldehyde/i, /cuminaldehyde/i, /perillaldehyde/i,
      /decanal/i, /undecanal/i, /dodecanal/i, /octanal/i, /nonanal/i,
      /hexanal/i, /heptanal/i, /pentanal/i, /butanal/i, /propanal/i,
      /furfural/i, /hydroxycitronellal/i, /lilial/i, /lyral/i,
    ],
    iupacPatterns: [
      /al$/i, /aldehyde/i,
    ]
  },
  {
    id: 'alcohol',
    name: 'Alcohols',
    nameFr: 'Alcools',
    description: 'Compounds containing a hydroxyl (-OH) group',
    smilesPatterns: [
      /CO(?!C)/i,
      /\[OH\]/i,
      /C\(O\)/i,
    ],
    namePatterns: [
      /ol$/i, /alcohol/i, /linalool/i, /geraniol/i, /nerol/i, /citronellol/i,
      /menthol/i, /borneol/i, /fenchol/i, /terpineol/i, /carveol/i,
      /thujol/i, /myrtenol/i, /verbenol/i, /pinocarveol/i, /cis-3-hexenol/i,
      /phenylethyl alcohol/i, /benzyl alcohol/i, /cinnamyl alcohol/i,
      /farnesol/i, /nerolidol/i, /cedrol/i, /vetiverol/i, /santalol/i,
      /patchoulol/i, /guaiol/i, /eudesmol/i, /bisabolol/i, /carotol/i,
    ],
    iupacPatterns: [
      /ol$/i, /hydroxy/i,
    ]
  },
  {
    id: 'ester',
    name: 'Esters',
    nameFr: 'Esters',
    description: 'Compounds containing a -COO- functional group',
    smilesPatterns: [
      /C\(=O\)O[^H]/i,
      /COC=O/i,
      /OC\(=O\)/i,
    ],
    namePatterns: [
      /acetate/i, /formate/i, /propionate/i, /butyrate/i, /benzoate/i,
      /salicylate/i, /cinnamate/i, /anthranilate/i, /ester/i,
      /linalyl acetate/i, /geranyl acetate/i, /neryl acetate/i,
      /bornyl acetate/i, /isobornyl acetate/i, /terpinyl acetate/i,
      /citronellyl acetate/i, /benzyl acetate/i, /phenylethyl acetate/i,
      /methyl salicylate/i, /ethyl acetate/i, /amyl acetate/i,
      /isoamyl acetate/i, /hexyl acetate/i, /methyl benzoate/i,
      /ethyl benzoate/i, /benzyl benzoate/i, /methyl anthranilate/i,
    ],
    iupacPatterns: [
      /ate$/i, /oate$/i, /yl .*ate/i,
    ]
  },
  {
    id: 'ketone',
    name: 'Ketones',
    nameFr: 'Cétones',
    description: 'Compounds containing a C=O group bonded to two carbons',
    smilesPatterns: [
      /CC\(=O\)C/i,
      /C\(C\)=O/i,
    ],
    namePatterns: [
      /one$/i, /ketone/i, /carvone/i, /menthone/i, /pulegone/i,
      /camphor/i, /fenchone/i, /thujone/i, /verbenone/i, /pinocarvone/i,
      /piperitone/i, /isomenthone/i, /dihydrocarvone/i, /ionone/i,
      /irone/i, /damascone/i, /damascenone/i, /jasmone/i, /muscone/i,
      /civetone/i, /acetophenone/i, /benzophenone/i, /nootkatone/i,
      /vetivone/i, /cyperone/i, /atlantone/i, /turmerone/i,
    ],
    iupacPatterns: [
      /one$/i, /oxo/i,
    ]
  },
  {
    id: 'phenol',
    name: 'Phenols',
    nameFr: 'Phénols',
    description: 'Aromatic compounds with hydroxyl group attached to benzene ring',
    smilesPatterns: [
      /c1ccc\(O\)cc1/i,
      /Oc1ccccc1/i,
    ],
    namePatterns: [
      /phenol/i, /cresol/i, /thymol/i, /carvacrol/i, /eugenol/i,
      /isoeugenol/i, /chavicol/i, /estragole/i, /anethole/i, /safrole/i,
      /myristicin/i, /elemicin/i, /asarone/i, /guaiacol/i, /creosol/i,
      /catechol/i, /hydroquinone/i, /resorcinol/i, /pyrogallol/i,
    ],
    iupacPatterns: [
      /phenol/i, /hydroxybenzene/i,
    ]
  },
  {
    id: 'ether',
    name: 'Ethers',
    nameFr: 'Éthers',
    description: 'Compounds containing a C-O-C linkage',
    smilesPatterns: [
      /COC/i,
      /C1OC1/i,
    ],
    namePatterns: [
      /ether/i, /oxide/i, /epoxide/i, /1,8-cineole/i, /eucalyptol/i,
      /linalool oxide/i, /rose oxide/i, /nerol oxide/i, /anisole/i,
      /estragole/i, /methyl chavicol/i, /anethole/i, /methyleugenol/i,
      /asarone/i, /elemicin/i, /myristicin/i, /safrole/i, /apiole/i,
      /dillapiole/i, /hedione/i, /galaxolide/i, /ambroxide/i,
    ],
    iupacPatterns: [
      /oxy/i, /epoxy/i, /methoxy/i, /ethoxy/i,
    ]
  },
  {
    id: 'acid',
    name: 'Carboxylic Acids',
    nameFr: 'Acides carboxyliques',
    description: 'Compounds containing a -COOH functional group',
    smilesPatterns: [
      /C\(=O\)O[H]?$/i,
      /COOH/i,
      /C\(O\)=O/i,
    ],
    namePatterns: [
      /acid/i, /acide/i, /acetic/i, /formic/i, /propionic/i, /butyric/i,
      /valeric/i, /caproic/i, /caprylic/i, /capric/i, /lauric/i,
      /myristic/i, /palmitic/i, /stearic/i, /oleic/i, /linoleic/i,
      /benzoic/i, /cinnamic/i, /salicylic/i, /geranic/i, /citric/i,
    ],
    iupacPatterns: [
      /oic acid/i, /carboxylic/i,
    ]
  },
  {
    id: 'lactone',
    name: 'Lactones',
    nameFr: 'Lactones',
    description: 'Cyclic esters formed from hydroxy acids',
    smilesPatterns: [
      /C1.*C\(=O\)O1/i,
      /O=C1.*O1/i,
    ],
    namePatterns: [
      /lactone/i, /coumarin/i, /jasmine lactone/i, /gamma-.*lactone/i,
      /delta-.*lactone/i, /massoia lactone/i, /whiskey lactone/i,
      /sotolon/i, /tuberolactone/i, /decalactone/i, /undecalactone/i,
      /dodecalactone/i, /nonalactone/i, /octalactone/i, /butyrolactone/i,
    ],
    iupacPatterns: [
      /lactone/i, /olide/i,
    ]
  },
  {
    id: 'coumarin',
    name: 'Coumarins',
    nameFr: 'Coumarines',
    description: 'Benzopyrone compounds with characteristic sweet hay-like odor',
    smilesPatterns: [
      /c1ccc2oc\(=O\)ccc2c1/i,
    ],
    namePatterns: [
      /coumarin/i, /coumarine/i, /dihydrocoumarin/i, /methylcoumarin/i,
      /ethylcoumarin/i, /herniarin/i, /umbelliferone/i, /scopoletin/i,
      /esculetin/i, /fraxetin/i, /daphnetin/i,
    ],
    iupacPatterns: [
      /coumarin/i, /benzopyran.*one/i,
    ]
  },
  {
    id: 'musk',
    name: 'Musks',
    nameFr: 'Muscs',
    description: 'Large ring compounds with characteristic musky odor',
    smilesPatterns: [
      /C1.*C1/i,
    ],
    namePatterns: [
      /musk/i, /musc/i, /muscone/i, /civetone/i, /ambrettolide/i,
      /exaltolide/i, /globalide/i, /habanolide/i, /galaxolide/i,
      /tonalide/i, /celestolide/i, /phantolide/i, /cashmeran/i,
      /helvetolide/i, /romandolide/i, /ethylene brassylate/i,
    ],
    iupacPatterns: [
      /cyclop?entadec/i, /macrocycl/i,
    ]
  },
  {
    id: 'indole',
    name: 'Indoles',
    nameFr: 'Indoles',
    description: 'Bicyclic compounds with benzene fused to pyrrole',
    smilesPatterns: [
      /c1ccc2\[nH\]ccc2c1/i,
    ],
    namePatterns: [
      /indole/i, /skatole/i, /tryptamine/i, /tryptophan/i, /melatonin/i,
      /serotonin/i, /methylindole/i, /dimethylindole/i,
    ],
    iupacPatterns: [
      /indole/i, /indol/i,
    ]
  },
  {
    id: 'furanone',
    name: 'Furanones',
    nameFr: 'Furanones',
    description: 'Five-membered lactones with oxygen in the ring',
    smilesPatterns: [
      /C1=COC\(=O\)C1/i,
      /O=C1CCCO1/i,
    ],
    namePatterns: [
      /furanone/i, /furaneol/i, /sotolone/i, /sotolon/i, /maple lactone/i,
      /homofuraneol/i, /norfuraneol/i, /mesifurane/i, /furfuryl/i,
    ],
    iupacPatterns: [
      /furanone/i, /furan.*one/i,
    ]
  },
  {
    id: 'nitrile',
    name: 'Nitriles',
    nameFr: 'Nitriles',
    description: 'Compounds containing a -C≡N functional group',
    smilesPatterns: [
      /C#N/i,
    ],
    namePatterns: [
      /nitrile/i, /cyanide/i, /acetonitrile/i, /benzonitrile/i,
      /citronellyl nitrile/i, /geranyl nitrile/i,
    ],
    iupacPatterns: [
      /nitrile/i, /cyano/i,
    ]
  },
  {
    id: 'pyrazine',
    name: 'Pyrazines',
    nameFr: 'Pyrazines',
    description: 'Six-membered aromatic rings with two nitrogen atoms',
    smilesPatterns: [
      /c1cnccn1/i,
      /n1ccncc1/i,
    ],
    namePatterns: [
      /pyrazine/i, /methoxypyrazine/i, /methylpyrazine/i, /ethylpyrazine/i,
      /acetylpyrazine/i, /tetramethylpyrazine/i,
    ],
    iupacPatterns: [
      /pyrazine/i,
    ]
  },
  {
    id: 'thiazole',
    name: 'Thiazoles',
    nameFr: 'Thiazoles',
    description: 'Five-membered rings with sulfur and nitrogen',
    smilesPatterns: [
      /c1ncsc1/i,
      /s1ccnc1/i,
    ],
    namePatterns: [
      /thiazole/i, /benzothiazole/i, /methylthiazole/i, /thiazoline/i,
    ],
    iupacPatterns: [
      /thiazol/i,
    ]
  },
  {
    id: 'sulfide',
    name: 'Sulfides',
    nameFr: 'Sulfures',
    description: 'Compounds containing sulfur-carbon bonds',
    smilesPatterns: [
      /CSC/i,
      /CSS/i,
      /CS/i,
    ],
    namePatterns: [
      /sulfide/i, /sulphide/i, /thiol/i, /mercaptan/i, /disulfide/i,
      /dimethyl sulfide/i, /dimethyl disulfide/i, /allyl sulfide/i,
      /diallyl disulfide/i, /methional/i, /furfuryl mercaptan/i,
    ],
    iupacPatterns: [
      /thio/i, /sulfan/i, /mercapto/i,
    ]
  }
];

/**
 * Classify a molecule into chemical families
 */
export function classifyMolecule(
  name: string,
  smiles?: string | null,
  iupacName?: string | null
): string[] {
  const families: string[] = [];
  
  for (const family of CHEMICAL_FAMILIES) {
    let matched = false;
    
    // Check name patterns
    if (name) {
      for (const pattern of family.namePatterns) {
        if (pattern.test(name)) {
          matched = true;
          break;
        }
      }
    }
    
    // Check SMILES patterns
    if (!matched && smiles) {
      for (const pattern of family.smilesPatterns) {
        if (pattern.test(smiles)) {
          matched = true;
          break;
        }
      }
    }
    
    // Check IUPAC name patterns
    if (!matched && iupacName) {
      for (const pattern of family.iupacPatterns) {
        if (pattern.test(iupacName)) {
          matched = true;
          break;
        }
      }
    }
    
    if (matched) {
      families.push(family.id);
    }
  }
  
  return families;
}

/**
 * Get family by ID
 */
export function getFamilyById(id: string): ChemicalFamily | undefined {
  return CHEMICAL_FAMILIES.find(f => f.id === id);
}

/**
 * Get all families for UI display
 */
export function getAllFamiliesForUI(): { id: string; name: string; nameFr: string }[] {
  return CHEMICAL_FAMILIES.map(f => ({
    id: f.id,
    name: f.name,
    nameFr: f.nameFr
  }));
}
