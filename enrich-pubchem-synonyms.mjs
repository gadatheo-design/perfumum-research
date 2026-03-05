/**
 * Enrichissement PubChem — Passe 3 : Synonymes alternatifs et traduction fr→en
 * Cible les 277 molécules brouillon restantes avec des noms français ou composés
 */
import mysql from 'mysql2/promise';

// Dictionnaire de traduction fr→en pour les termes chimiques courants
const FR_TO_EN = {
  'Acide': 'Acid',
  'acide': 'acid',
  'Alcool': 'Alcohol',
  'alcool': 'alcohol',
  'Aldéhyde': 'Aldehyde',
  'aldéhyde': 'aldehyde',
  'Phényl': 'Phenyl',
  'phényl': 'phenyl',
  'Méthyl': 'Methyl',
  'méthyl': 'methyl',
  'Éthyl': 'Ethyl',
  'éthyl': 'ethyl',
  'Propyl': 'Propyl',
  'Butyl': 'Butyl',
  'Hexyl': 'Hexyl',
  'Octyl': 'Octyl',
  'Décyl': 'Decyl',
  'Benzyl': 'Benzyl',
  'Cinnamyl': 'Cinnamyl',
  'Géranyl': 'Geranyl',
  'géranyl': 'geranyl',
  'Néryl': 'Neryl',
  'Linalyl': 'Linalyl',
  'Terpényl': 'Terpenyl',
  'Citronellyl': 'Citronellyl',
  'Farnesyl': 'Farnesyl',
  'Phénylethanol': 'Phenylethanol',
  'phénylethanol': 'phenylethanol',
  'Phénylacétaldéhyde': 'Phenylacetaldehyde',
  'Phénylacétique': 'Phenylacetic',
  'Benzaldéhyde': 'Benzaldehyde',
  'Cinnamaldéhyde': 'Cinnamaldehyde',
  'Vanilline': 'Vanillin',
  'Eugénol': 'Eugenol',
  'eugénol': 'eugenol',
  'Isoeugénol': 'Isoeugenol',
  'Anéthole': 'Anethole',
  'Estragole': 'Estragole',
  'Safrole': 'Safrole',
  'Coumarine': 'Coumarin',
  'Lactone': 'Lactone',
  'Cétone': 'Ketone',
  'cétone': 'ketone',
  'Ester': 'Ester',
  'Terpène': 'Terpene',
  'terpène': 'terpene',
  'Sesquiterpène': 'Sesquiterpene',
  'Diterpène': 'Diterpene',
  'Triterpène': 'Triterpene',
  'Monoterpène': 'Monoterpene',
  'Phénol': 'Phenol',
  'phénol': 'phenol',
  'Naphtalène': 'Naphthalene',
  'Anthracène': 'Anthracene',
  'Pyrène': 'Pyrene',
  'Indole': 'Indole',
  'Pyrazine': 'Pyrazine',
  'Furane': 'Furan',
  'Thiophène': 'Thiophene',
  'Oxyde': 'Oxide',
  'oxyde': 'oxide',
  'Acétate': 'Acetate',
  'acétate': 'acetate',
  'Formate': 'Formate',
  'Propanoate': 'Propanoate',
  'Butyrate': 'Butyrate',
  'Hexanoate': 'Hexanoate',
  'Benzoate': 'Benzoate',
  'Cinnamate': 'Cinnamate',
  'Salicylate': 'Salicylate',
  'betulinique': 'betulinic',
  'chlorogenique': 'chlorogenic',
  'ferulique': 'ferulic',
  'gallique': 'gallic',
  'oleanolique': 'oleanolic',
  'protocatechuique': 'protocatechuic',
  'ursolique': 'ursolic',
  'caféique': 'caffeic',
  'rosmarinique': 'rosmarinic',
  'ellagique': 'ellagic',
  'tannique': 'tannic',
  'oxalique': 'oxalic',
  'succinique': 'succinic',
  'malique': 'malic',
  'citrique': 'citric',
  'tartrique': 'tartaric',
  'fumarique': 'fumaric',
  'malonique': 'malonic',
  'glutarique': 'glutaric',
  'adipique': 'adipic',
  'sébacique': 'sebacic',
  'laurique': 'lauric',
  'myristique': 'myristic',
  'palmitique': 'palmitic',
  'stéarique': 'stearic',
  'oléique': 'oleic',
  'linoléique': 'linoleic',
  'linolénique': 'linolenic',
  'arachidonique': 'arachidonic',
  'docosahexaénoïque': 'docosahexaenoic',
  'eicosapentaénoïque': 'eicosapentaenoic',
};

// Synonymes alternatifs pour les molécules connues
const KNOWN_SYNONYMS = {
  '2-Phénylethanol': ['2-Phenylethanol', 'Phenylethyl alcohol', 'beta-Phenylethanol', 'Phenethyl alcohol'],
  'Acide betulinique': ['Betulinic acid', 'Betulinic acid (3β-Hydroxy-lup-20(29)-en-28-oic acid)'],
  'Acide chlorogenique': ['Chlorogenic acid', '3-Caffeoylquinic acid'],
  'Acide ferulique': ['Ferulic acid', '4-Hydroxy-3-methoxycinnamic acid'],
  'Acide gallique': ['Gallic acid', '3,4,5-Trihydroxybenzoic acid'],
  'Acide oleanolique': ['Oleanolic acid', '3β-Hydroxyolean-12-en-28-oic acid'],
  'Acide protocatechuique': ['Protocatechuic acid', '3,4-Dihydroxybenzoic acid'],
  'Agarol': ['Agarol', 'Agarospirol'],
  'Benzaldéhyde': ['Benzaldehyde', 'Benzoic aldehyde', 'Phenylmethanal'],
  'Cinnamaldéhyde': ['Cinnamaldehyde', 'trans-Cinnamaldehyde', '3-Phenylpropenal'],
  'Coumarine': ['Coumarin', '2H-Chromen-2-one', 'Benzo[b]pyran-2-one'],
  'Eugénol': ['Eugenol', '4-Allyl-2-methoxyphenol', '2-Methoxy-4-(2-propenyl)phenol'],
  'Isoeugénol': ['Isoeugenol', '2-Methoxy-4-propenylphenol'],
  'Anéthole': ['Anethole', 'trans-Anethole', '1-Methoxy-4-propenylbenzene'],
  'Estragole': ['Estragole', 'Methyl chavicol', '4-Allylanisole'],
  'Safrole': ['Safrole', '5-(2-Propenyl)-1,3-benzodioxole'],
  'Vanilline': ['Vanillin', '4-Hydroxy-3-methoxybenzaldehyde'],
  'Damascénone': ['Damascenone', 'beta-Damascenone', 'Rose ketone-4'],
  'β-Damascénone': ['beta-Damascenone', 'Damascenone', 'Rose ketone-4'],
  'Damascone': ['Damascone', 'alpha-Damascone', 'Rose ketone-1'],
  'Ionone': ['Ionone', 'alpha-Ionone', 'beta-Ionone'],
  'α-Ionone': ['alpha-Ionone', 'Irisone', '4-(2,2-Dimethyl-6-methylenecyclohexyl)-3-buten-2-one'],
  'β-Ionone': ['beta-Ionone', '4-(2,6,6-Trimethyl-1-cyclohexen-1-yl)-3-buten-2-one'],
  'Muscone': ['Muscone', '(R)-Muscone', '3-Methylcyclopentadecanone'],
  'Exaltolide': ['Exaltolide', 'Cyclopentadecanolide', 'Pentadecanolide'],
  'Galaxolide': ['Galaxolide', 'HHCB', '1,3,4,6,7,8-Hexahydro-4,6,6,7,8,8-hexamethylcyclopenta[g]-2-benzopyran'],
  'Habanolide': ['Habanolide', 'Exaltolide', 'Cyclopentadecanolide'],
  'Ambroxan': ['Ambroxan', 'Ambroxide', 'Dodecahydro-3a,6,6,9a-tetramethylnaphtho[2,1-b]furan'],
  'Civettone': ['Civettone', '(Z)-Cycloheptadec-9-en-1-one', 'Civetone'],
  'Muscone synthétique': ['Muscone', '3-Methylcyclopentadecanone'],
  'Ethylene Brassylate': ['Ethylene brassylate', '1,4-Dioxacycloheptadecane-5,17-dione'],
  'Romandolide': ['Romandolide'],
  'Iso E Super': ['Iso E Super', '1-(1,2,3,4,5,6,7,8-Octahydro-2,3,8,8-tetramethyl-2-naphthalenyl)ethanone'],
  'Ambrette Seed': ['Ambrette seed oil', 'Ambrettolide', 'Ambrette musk'],
  'Castoryl Musk': ['Castoryl musk'],
  'Birch Tar': ['Birch tar', 'Betula tar'],
  'Guaiacol': ['Guaiacol', '2-Methoxyphenol'],
  'Cembranolide': ['Cembranolide', 'Cembrene C'],
  'Solanone': ['Solanone', '4-(2,6,6-Trimethyl-2-cyclohexen-1-yl)-2-butanone'],
  'Megastigmatrienone': ['Megastigmatrienone', 'Tobacco ketone'],
  'Phytol': ['Phytol', '(E)-3,7,11,15-Tetramethylhexadec-2-en-1-ol'],
  'Neophytadiene': ['Neophytadiene', '2-Phytene'],
  'Solanidine': ['Solanidine'],
  'Nornicotine': ['Nornicotine', '3-(2-Pyrrolidinyl)pyridine'],
  'Anabasine': ['Anabasine', '3-(2-Piperidinyl)pyridine'],
  'Anatabine': ['Anatabine', '3-(3,4-Dihydro-2H-pyrrol-5-yl)pyridine'],
  'Cotinine': ['Cotinine', '1-Methyl-5-(3-pyridinyl)-2-pyrrolidinone'],
  'Myosmine': ['Myosmine', '3-(3,4-Dihydro-2H-pyrrolyl)pyridine'],
  'Harmane': ['Harmane', '1-Methyl-9H-pyrido[3,4-b]indole'],
  'Harmine': ['Harmine', '7-Methoxy-1-methyl-9H-pyrido[3,4-b]indole'],
  'Harmaline': ['Harmaline', '4,9-Dihydro-7-methoxy-1-methyl-3H-pyrido[3,4-b]indole'],
  'Scopoletin': ['Scopoletin', '7-Hydroxy-6-methoxy-2H-chromen-2-one'],
  'Umbelliferone': ['Umbelliferone', '7-Hydroxy-2H-chromen-2-one'],
  'Fraxetin': ['Fraxetin', '7,8-Dihydroxy-6-methoxy-2H-chromen-2-one'],
  'Aesculetin': ['Aesculetin', '6,7-Dihydroxycoumarin'],
  'Quercetin': ['Quercetin', '3,3\',4\',5,7-Pentahydroxyflavone'],
  'Kaempferol': ['Kaempferol', '3,4\',5,7-Tetrahydroxyflavone'],
  'Luteolin': ['Luteolin', '3\',4\',5,7-Tetrahydroxyflavone'],
  'Apigenin': ['Apigenin', '4\',5,7-Trihydroxyflavone'],
  'Naringenin': ['Naringenin', '4\',5,7-Trihydroxyflavanone'],
  'Hesperetin': ['Hesperetin', '3\',5,7-Trihydroxy-4\'-methoxyflavanone'],
  'Rutin': ['Rutin', 'Quercetin-3-rutinoside'],
  'Resveratrol': ['Resveratrol', '3,4\',5-Stilbenetriol'],
  'Catechin': ['Catechin', '(+)-Catechin', '3,3\',4\',5,7-Flavanpentol'],
  'Epicatechin': ['Epicatechin', '(-)-Epicatechin'],
  'Epigallocatechin': ['Epigallocatechin', '(-)-Epigallocatechin'],
  'Thymol': ['Thymol', '5-Methyl-2-(propan-2-yl)phenol'],
  'Carvacrol': ['Carvacrol', '2-Methyl-5-(propan-2-yl)phenol'],
  'Menthol': ['Menthol', '(1R,2S,5R)-2-Isopropyl-5-methylcyclohexanol'],
  'Pulegone': ['Pulegone', '(R)-(+)-Pulegone', '(4R)-p-Menth-8-en-3-one'],
  'Piperitone': ['Piperitone', '3-Methyl-6-(propan-2-yl)cyclohex-2-en-1-one'],
  'Carvone': ['Carvone', '(R)-(-)-Carvone', '(S)-(+)-Carvone'],
  'Fenchone': ['Fenchone', '1,3,3-Trimethylbicyclo[2.2.1]heptan-2-one'],
  'Camphor': ['Camphor', '(1R,4R)-1,7,7-Trimethylbicyclo[2.2.1]heptan-2-one'],
  'Borneol': ['Borneol', '(1R,2S,4R)-1,7,7-Trimethylbicyclo[2.2.1]heptan-2-ol'],
  'Isoborneol': ['Isoborneol', '(1R,2R,4S)-1,7,7-Trimethylbicyclo[2.2.1]heptan-2-ol'],
  'Terpinen-4-ol': ['Terpinen-4-ol', '4-Terpineol', '4-Terpinenol'],
  'alpha-Terpineol': ['alpha-Terpineol', 'p-Menth-1-en-8-ol'],
  'Geraniol': ['Geraniol', '(E)-3,7-Dimethylocta-2,6-dien-1-ol'],
  'Nerol': ['Nerol', '(Z)-3,7-Dimethylocta-2,6-dien-1-ol'],
  'Citronellol': ['Citronellol', '3,7-Dimethyloct-6-en-1-ol'],
  'Linalool': ['Linalool', '3,7-Dimethylocta-1,6-dien-3-ol'],
  'Terpinolene': ['Terpinolene', '4-Methylene-1-(propan-2-yl)cyclohex-1-ene'],
  'Limonene': ['Limonene', '(R)-(+)-Limonene', '(4R)-1-Methyl-4-(prop-1-en-2-yl)cyclohexane'],
  'alpha-Pinene': ['alpha-Pinene', '(1R)-2,6,6-Trimethylbicyclo[3.1.1]hept-2-ene'],
  'beta-Pinene': ['beta-Pinene', '(1R)-6,6-Dimethyl-2-methylenebicyclo[3.1.1]heptane'],
  'Camphene': ['Camphene', '2,2-Dimethyl-3-methylenebicyclo[2.2.1]heptane'],
  'Sabinene': ['Sabinene', '4-Methylene-1-(propan-2-yl)bicyclo[3.1.0]hexane'],
  'Myrcene': ['Myrcene', '7-Methyl-3-methyleneocta-1,6-diene'],
  'Ocimene': ['Ocimene', 'beta-Ocimene', '(E)-3,7-Dimethylocta-1,3,6-triene'],
  'Farnesene': ['Farnesene', 'alpha-Farnesene', 'beta-Farnesene'],
  'Bisabolene': ['Bisabolene', 'alpha-Bisabolene', 'beta-Bisabolene'],
  'Zingiberene': ['Zingiberene', '(S)-Zingiberene'],
  'Curcumene': ['Curcumene', 'ar-Curcumene'],
  'Turmerone': ['Turmerone', 'ar-Turmerone'],
  'Atlantone': ['Atlantone', 'alpha-Atlantone'],
  'Cedrene': ['Cedrene', 'alpha-Cedrene'],
  'Cedrol': ['Cedrol', 'alpha-Cedrol'],
  'Guaiol': ['Guaiol', '(1S,2R,4S)-1,4-Dimethyl-7-(propan-2-ylidene)decahydronaphthalene-2-ol'],
  'Bulnesol': ['Bulnesol', 'Guaiol'],
  'Patchouli alcohol': ['Patchouli alcohol', 'Patchoulol'],
  'Norpatchoulenol': ['Norpatchoulenol'],
  'Pogostol': ['Pogostol'],
  'Vetiverol': ['Vetiverol', 'Vetivol'],
  'Khusimol': ['Khusimol'],
  'Zizaene': ['Zizaene', 'alpha-Zizaene'],
  'Nootkatone': ['Nootkatone', '(4R,4aS,6R)-4,4a-Dimethyl-6-(propan-2-ylidene)-3,4,4a,5,6,7-hexahydronaphthalen-2(1H)-one'],
  'Valencene': ['Valencene', '(+)-Valencene'],
  'Elemol': ['Elemol', 'beta-Elemol'],
  'Elemenone': ['Elemenone'],
  'Germacrone': ['Germacrone'],
  'Germacrene': ['Germacrene', 'Germacrene D'],
  'Humulene': ['Humulene', 'alpha-Humulene', 'alpha-Caryophyllene'],
  'Caryophyllene oxide': ['Caryophyllene oxide', 'beta-Caryophyllene oxide'],
  'Viridiflorol': ['Viridiflorol'],
  'Ledol': ['Ledol'],
  'Palustrol': ['Palustrol'],
  'Globulol': ['Globulol'],
  'Spathulenol': ['Spathulenol'],
  'Eudesmol': ['Eudesmol', 'beta-Eudesmol'],
  'Bisabolol': ['Bisabolol', 'alpha-Bisabolol', '(-)-alpha-Bisabolol'],
  'Farnesol': ['Farnesol', '(E,E)-Farnesol', 'trans,trans-Farnesol'],
  'Nerolidol': ['Nerolidol', '(E)-Nerolidol', 'trans-Nerolidol'],
  'Squalene': ['Squalene', '(6E,10E,14E,18E)-2,6,10,15,19,23-Hexamethyltetracosa-2,6,10,14,18,22-hexaene'],
  'Phytol': ['Phytol', '(E)-3,7,11,15-Tetramethylhexadec-2-en-1-ol'],
  'Geranylgeraniol': ['Geranylgeraniol', '(2E,6E,10E)-3,7,11,15-Tetramethylhexadeca-2,6,10,14-tetraen-1-ol'],
  'Abietol': ['Abietol', 'Abietic alcohol'],
  'Dehydroabietic acid': ['Dehydroabietic acid'],
  'Abietic acid': ['Abietic acid'],
  'Pimaric acid': ['Pimaric acid'],
  'Sandaracopimaric acid': ['Sandaracopimaric acid'],
  'Labdanolic acid': ['Labdanolic acid'],
  'Sclareol': ['Sclareol'],
  'Manool': ['Manool'],
  'Copalic acid': ['Copalic acid'],
  'Cafestol': ['Cafestol'],
  'Kahweol': ['Kahweol'],
  'Carnosol': ['Carnosol'],
  'Carnosic acid': ['Carnosic acid'],
  'Rosmanol': ['Rosmanol'],
  'Ursolic acid': ['Ursolic acid', '3β-Hydroxy-urs-12-en-28-oic acid'],
  'Oleanolic acid': ['Oleanolic acid', '3β-Hydroxy-olean-12-en-28-oic acid'],
  'Betulin': ['Betulin', 'Lup-20(29)-ene-3β,28-diol'],
  'Lupeol': ['Lupeol', 'Lup-20(29)-en-3β-ol'],
  'Friedelin': ['Friedelin'],
  'Epifriedelanol': ['Epifriedelanol'],
  'Taraxerol': ['Taraxerol'],
  'Taraxasterol': ['Taraxasterol'],
  'Amyrin': ['Amyrin', 'alpha-Amyrin', 'beta-Amyrin'],
  'Erythrodiol': ['Erythrodiol'],
  'Uvaol': ['Uvaol'],
  'Maslinic acid': ['Maslinic acid'],
  'Corosolic acid': ['Corosolic acid'],
  'Asiatic acid': ['Asiatic acid'],
  'Madecassic acid': ['Madecassic acid'],
  'Asiaticoside': ['Asiaticoside'],
  'Madecassoside': ['Madecassoside'],
  'Centelloside': ['Centelloside'],
};

function translateFrToEn(name) {
  let translated = name;
  for (const [fr, en] of Object.entries(FR_TO_EN)) {
    translated = translated.replace(new RegExp(fr, 'g'), en);
  }
  // Supprimer les accents
  translated = translated
    .replace(/é/g, 'e').replace(/è/g, 'e').replace(/ê/g, 'e').replace(/ë/g, 'e')
    .replace(/à/g, 'a').replace(/â/g, 'a').replace(/ä/g, 'a')
    .replace(/î/g, 'i').replace(/ï/g, 'i')
    .replace(/ô/g, 'o').replace(/ö/g, 'o')
    .replace(/ù/g, 'u').replace(/û/g, 'u').replace(/ü/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/É/g, 'E').replace(/È/g, 'E').replace(/Ê/g, 'E')
    .replace(/À/g, 'A').replace(/Â/g, 'A')
    .replace(/Î/g, 'I').replace(/Ô/g, 'O').replace(/Ù/g, 'U').replace(/Û/g, 'U')
    .replace(/Ç/g, 'C');
  return translated;
}

async function searchPubChem(name) {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/property/IUPACName,MolecularFormula,MolecularWeight,InChIKey,IsomericSMILES,CanonicalSMILES/JSON`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.PropertyTable?.Properties?.[0]) {
      const p = data.PropertyTable.Properties[0];
      return {
        cid: p.CID,
        formula: p.MolecularFormula,
        weight: p.MolecularWeight,
        smiles: p.IsomericSMILES || p.CanonicalSMILES,
        inchiKey: p.InChIKey,
        iupacName: p.IUPACName,
      };
    }
  } catch {}
  return null;
}

async function searchCAS(cid) {
  try {
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/synonyms/JSON`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const data = await res.json();
    const synonyms = data.InformationList?.Information?.[0]?.Synonym || [];
    const cas = synonyms.find(s => /^\d{2,7}-\d{2}-\d$/.test(s));
    return cas || null;
  } catch {}
  return null;
}

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Récupérer les molécules brouillon
  const [molecules] = await conn.execute(
    "SELECT id, name, family FROM molecules WHERE validation_status = 'brouillon' ORDER BY name"
  );
  
  console.log(`\n🔬 Enrichissement PubChem — Synonymes alternatifs`);
  console.log(`📊 ${molecules.length} molécules brouillon à traiter\n`);
  
  let enriched = 0;
  let notFound = 0;
  let skipped = 0;
  
  for (let i = 0; i < molecules.length; i++) {
    const mol = molecules[i];
    
    // Ignorer les accords olfactifs complexes (pas de CID PubChem possible)
    const isComplex = /^(Absolue|Accord|Aldéhydes|Aldehyde|Fumée|Cuir|Bois|Pierre|Encens|Résine|Extrait|Note|Accord|Musc|Ambre|Tabac|Cannabis|Parfum|Accord|Baume|Gomme|Cire|Huile|Teinture|Infusion|Décoction|Macération|Tincture|Absolute|Concrete|Resinoid|Pomade|Enfleurage)/i.test(mol.name);
    if (isComplex) {
      skipped++;
      continue;
    }
    
    // Construire la liste des noms à essayer
    const namesToTry = [];
    
    // 1. Synonymes connus
    if (KNOWN_SYNONYMS[mol.name]) {
      namesToTry.push(...KNOWN_SYNONYMS[mol.name]);
    }
    
    // 2. Traduction fr→en
    const translated = translateFrToEn(mol.name);
    if (translated !== mol.name) {
      namesToTry.push(translated);
    }
    
    // 3. Nom original
    namesToTry.push(mol.name);
    
    // 4. Variantes sans parenthèses
    const withoutParens = mol.name.replace(/\s*\([^)]+\)/g, '').trim();
    if (withoutParens !== mol.name) {
      namesToTry.push(withoutParens);
      namesToTry.push(translateFrToEn(withoutParens));
    }
    
    // Dédupliquer
    const uniqueNames = [...new Set(namesToTry)];
    
    let result = null;
    let usedName = null;
    
    for (const name of uniqueNames) {
      if (!name || name.length < 3) continue;
      result = await searchPubChem(name);
      if (result) {
        usedName = name;
        break;
      }
      await new Promise(r => setTimeout(r, 150));
    }
    
    if (result) {
      // Chercher le CAS si pas dans les propriétés
      let cas = null;
      if (result.cid) {
        cas = await searchCAS(result.cid);
        await new Promise(r => setTimeout(r, 100));
      }
      
      // Mettre à jour la molécule
      const updates = [];
      const values = [];
      
      if (result.formula) { updates.push('formula = ?'); values.push(result.formula); }
      if (result.smiles) { updates.push('smiles = ?'); values.push(result.smiles); }
      if (cas) { updates.push('cas_number = ?'); values.push(cas); }
      if (result.inchiKey) { updates.push('inchi_key = ?'); values.push(result.inchiKey); }
      if (result.weight) { updates.push('molecularWeight = ?'); values.push(Math.round(result.weight)); }
      if (result.cid) { updates.push('pubchem_cid = ?'); values.push(result.cid); }
      updates.push("validation_status = 'en_revision'");
      
      if (updates.length > 1) {
        values.push(mol.id);
        await conn.execute(`UPDATE molecules SET ${updates.join(', ')} WHERE id = ?`, values);
        enriched++;
        console.log(`✅ [${i+1}/${molecules.length}] ${mol.name} → CID:${result.cid} (via "${usedName}") CAS:${cas || 'N/A'}`);
      }
    } else {
      notFound++;
      if (notFound <= 20) {
        console.log(`❌ [${i+1}/${molecules.length}] ${mol.name} — non trouvé`);
      }
    }
    
    // Pause pour respecter les limites PubChem
    await new Promise(r => setTimeout(r, 200));
  }
  
  await conn.end();
  
  console.log(`\n📊 Résumé final:`);
  console.log(`  ✅ Enrichies : ${enriched}`);
  console.log(`  ❌ Non trouvées : ${notFound}`);
  console.log(`  ⏭️  Ignorées (accords complexes) : ${skipped}`);
  console.log(`  📈 Total traité : ${enriched + notFound + skipped}/${molecules.length}`);
}

main().catch(console.error);
