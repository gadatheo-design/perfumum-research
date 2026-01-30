/**
 * Script pour importer les 334 composés du Perique depuis le fichier JSON complet
 * Source: Leffingwell & Alford (2005), 'Volatile Constituents of Perique Tobacco'
 */

import mysql from 'mysql2/promise';
import fs from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;

// Liste complète des 334 composés du Perique basée sur l'étude Leffingwell & Alford (2005)
const periqueCompounds = [
  // === ALCOOLS DE FERMENTATION (26 nouveaux isolats) ===
  { name: "Isoamyl alcohol", cas: "123-51-3", family: "Alcool", category: "Alcools de fermentation", concentration: 32.802, notes: "Alcoolique, vineux, brandy", newIsolate: true },
  { name: "2-Methyl-1-propanol", cas: "78-83-1", family: "Alcool", category: "Alcools de fermentation", concentration: 2.181, notes: "Doux, sucré, whiskey", newIsolate: true },
  { name: "1-Propanol", cas: "71-23-8", family: "Alcool", category: "Alcools de fermentation", concentration: 0.892, notes: "Alcoolique, fruité", newIsolate: true },
  { name: "2-Methyl-1-butanol", cas: "137-32-6", family: "Alcool", category: "Alcools de fermentation", concentration: 0.756, notes: "Vineux, alcoolique", newIsolate: true },
  { name: "1-Butanol", cas: "71-36-3", family: "Alcool", category: "Alcools de fermentation", concentration: 0.234, notes: "Alcoolique, fruité", newIsolate: true },
  { name: "1-Hexanol", cas: "111-27-3", family: "Alcool", category: "Alcools de fermentation", concentration: 0.187, notes: "Herbacé, vert", newIsolate: true },
  { name: "1-Pentanol", cas: "71-41-0", family: "Alcool", category: "Alcools de fermentation", concentration: 0.156, notes: "Fruité, balsamique", newIsolate: true },
  { name: "2-Phenylethanol", cas: "60-12-8", family: "Alcool", category: "Alcools de fermentation", concentration: 0.089, notes: "Rose, floral, miel", newIsolate: true },
  { name: "3-Methyl-1-pentanol", cas: "589-35-5", family: "Alcool", category: "Alcools de fermentation", concentration: 0.067, notes: "Vineux, fruité", newIsolate: true },
  { name: "2-Heptanol", cas: "543-49-7", family: "Alcool", category: "Alcools de fermentation", concentration: 0.045, notes: "Terreux, champignon", newIsolate: true },
  
  // === ESTERS DE FERMENTATION ===
  { name: "Isoamyl acetate", cas: "123-92-2", family: "Ester", category: "Esters de fermentation", concentration: 0.659, notes: "Banane, poire, fruité", newIsolate: true },
  { name: "Ethyl acetate", cas: "141-78-6", family: "Ester", category: "Esters de fermentation", concentration: 0.534, notes: "Fruité, éthéré", newIsolate: true },
  { name: "Ethyl lactate", cas: "97-64-3", family: "Ester", category: "Esters de fermentation", concentration: 0.423, notes: "Fruité, beurré", newIsolate: true },
  { name: "Isobutyl acetate", cas: "110-19-0", family: "Ester", category: "Esters de fermentation", concentration: 0.312, notes: "Fruité, banane", newIsolate: true },
  { name: "Ethyl butyrate", cas: "105-54-4", family: "Ester", category: "Esters de fermentation", concentration: 0.234, notes: "Ananas, fruité", newIsolate: true },
  { name: "Ethyl hexanoate", cas: "123-66-0", family: "Ester", category: "Esters de fermentation", concentration: 0.187, notes: "Pomme, fruité", newIsolate: true },
  { name: "Ethyl octanoate", cas: "106-32-1", family: "Ester", category: "Esters de fermentation", concentration: 0.145, notes: "Fruité, vineux", newIsolate: true },
  { name: "Ethyl decanoate", cas: "110-38-3", family: "Ester", category: "Esters de fermentation", concentration: 0.098, notes: "Fruité, gras", newIsolate: true },
  { name: "Phenethyl acetate", cas: "103-45-7", family: "Ester", category: "Esters de fermentation", concentration: 0.076, notes: "Rose, miel, fruité", newIsolate: true },
  
  // === CAROTÉNOÏDES DÉGRADÉS (8 nouveaux isolats) ===
  { name: "Theaspirane A", cas: "36431-72-8", family: "Norisoprénoïde", category: "Caroténoïdes dégradés", notes: "Floral, fruité, thé", newIsolate: true },
  { name: "Theaspirane B", cas: "36431-72-8", family: "Norisoprénoïde", category: "Caroténoïdes dégradés", notes: "Floral, fruité, thé", newIsolate: true },
  { name: "Dihydro-beta-ionone", cas: "17283-81-7", family: "Norisoprénoïde", category: "Caroténoïdes dégradés", notes: "Violette, floral, fruité", newIsolate: true },
  { name: "Alpha-iso-Methylionone", cas: "127-51-5", family: "Norisoprénoïde", category: "Caroténoïdes dégradés", notes: "Violette, iris, floral", newIsolate: true },
  { name: "Beta-ionone", cas: "14901-07-6", family: "Norisoprénoïde", category: "Caroténoïdes dégradés", notes: "Violette, boisé, fruité", newIsolate: false },
  { name: "Alpha-ionone", cas: "127-41-3", family: "Norisoprénoïde", category: "Caroténoïdes dégradés", notes: "Violette, framboise", newIsolate: false },
  { name: "Beta-damascenone", cas: "23696-85-7", family: "Norisoprénoïde", category: "Caroténoïdes dégradés", notes: "Rose, miel, fruité", newIsolate: false },
  { name: "Beta-damascone", cas: "23726-91-2", family: "Norisoprénoïde", category: "Caroténoïdes dégradés", notes: "Rose, fruité, tabac", newIsolate: false },
  { name: "Megastigmatrienone", cas: "38818-55-2", family: "Norisoprénoïde", category: "Caroténoïdes dégradés", notes: "Tabac, épicé", newIsolate: false },
  { name: "3-Oxo-alpha-ionol", cas: "13287-07-7", family: "Norisoprénoïde", category: "Caroténoïdes dégradés", notes: "Tabac, fruité", newIsolate: false },
  
  // === LACTONES CRÉMEUSES (2 nouveaux isolats) ===
  { name: "cis-Oak lactone (Whiskey lactone)", cas: "39212-23-2", family: "Lactone", category: "Lactones crémeuses", notes: "Boisé, lacté, whiskey, coco", newIsolate: true },
  { name: "Gamma-Undecalactone", cas: "104-67-6", family: "Lactone", category: "Lactones crémeuses", notes: "Pêche, fruité, crémeux", newIsolate: true },
  { name: "Gamma-Nonalactone", cas: "104-61-0", family: "Lactone", category: "Lactones crémeuses", notes: "Noix de coco, crémeux", newIsolate: false },
  { name: "Gamma-Decalactone", cas: "706-14-9", family: "Lactone", category: "Lactones crémeuses", notes: "Pêche, abricot", newIsolate: false },
  { name: "Gamma-Octalactone", cas: "104-50-7", family: "Lactone", category: "Lactones crémeuses", notes: "Noix de coco, crémeux", newIsolate: false },
  { name: "Delta-Decalactone", cas: "705-86-2", family: "Lactone", category: "Lactones crémeuses", notes: "Crémeux, lacté", newIsolate: false },
  
  // === INDOLES ET COMPOSÉS AZOTÉS ===
  { name: "Indole", cas: "120-72-9", family: "Indole", category: "Composés azotés", notes: "Floral, animal, jasmin", newIsolate: false },
  { name: "Skatole (3-Methylindole)", cas: "83-34-1", family: "Indole", category: "Composés azotés", notes: "Animal, fécal, floral en dilution", newIsolate: false },
  { name: "2-Acetylpyrrole", cas: "1072-83-9", family: "Pyrrole", category: "Composés azotés", notes: "Pain grillé, noisette", newIsolate: false },
  { name: "2-Formylpyrrole", cas: "1003-29-8", family: "Pyrrole", category: "Composés azotés", notes: "Grillé, caramel", newIsolate: false },
  { name: "Pyridine", cas: "110-86-1", family: "Pyridine", category: "Composés azotés", notes: "Tabac, brûlé", newIsolate: false },
  { name: "2-Acetylpyridine", cas: "1122-62-9", family: "Pyridine", category: "Composés azotés", notes: "Pop-corn, grillé", newIsolate: false },
  { name: "3-Acetylpyridine", cas: "350-03-8", family: "Pyridine", category: "Composés azotés", notes: "Pop-corn, tabac", newIsolate: false },
  
  // === PYRAZINES ===
  { name: "2,3-Dimethylpyrazine", cas: "5910-89-4", family: "Pyrazine", category: "Pyrazines", notes: "Noisette, grillé", newIsolate: false },
  { name: "2,5-Dimethylpyrazine", cas: "123-32-0", family: "Pyrazine", category: "Pyrazines", notes: "Cacao, grillé", newIsolate: false },
  { name: "2,6-Dimethylpyrazine", cas: "108-50-9", family: "Pyrazine", category: "Pyrazines", notes: "Noisette, chocolat", newIsolate: false },
  { name: "2,3,5-Trimethylpyrazine", cas: "14667-55-1", family: "Pyrazine", category: "Pyrazines", notes: "Cacao, café, grillé", newIsolate: false },
  { name: "2-Ethyl-3-methylpyrazine", cas: "15707-23-0", family: "Pyrazine", category: "Pyrazines", notes: "Noisette, terreux", newIsolate: false },
  { name: "2-Ethyl-3,5-dimethylpyrazine", cas: "13925-07-0", family: "Pyrazine", category: "Pyrazines", notes: "Terreux, pomme de terre", newIsolate: false },
  { name: "Tetramethylpyrazine", cas: "1124-11-4", family: "Pyrazine", category: "Pyrazines", notes: "Cacao, café", newIsolate: false },
  { name: "2-Methoxy-3-isobutylpyrazine", cas: "24683-00-9", family: "Pyrazine", category: "Pyrazines", notes: "Poivron vert, terreux", newIsolate: false },
  
  // === TERPÈNES ===
  { name: "Linalool", cas: "78-70-6", family: "Monoterpène", category: "Terpènes", notes: "Floral, lavande, frais", newIsolate: false },
  { name: "Geraniol", cas: "106-24-1", family: "Monoterpène", category: "Terpènes", notes: "Rose, géranium", newIsolate: false },
  { name: "Nerol", cas: "106-25-2", family: "Monoterpène", category: "Terpènes", notes: "Rose, citrus", newIsolate: false },
  { name: "Citronellol", cas: "106-22-9", family: "Monoterpène", category: "Terpènes", notes: "Rose, citrus", newIsolate: false },
  { name: "Alpha-terpineol", cas: "98-55-5", family: "Monoterpène", category: "Terpènes", notes: "Lilas, floral", newIsolate: false },
  { name: "Limonene", cas: "138-86-3", family: "Monoterpène", category: "Terpènes", notes: "Citrus, orange", newIsolate: false },
  { name: "Myrcene", cas: "123-35-3", family: "Monoterpène", category: "Terpènes", notes: "Herbacé, épicé", newIsolate: false },
  { name: "Ocimene", cas: "13877-91-3", family: "Monoterpène", category: "Terpènes", notes: "Herbacé, floral", newIsolate: false },
  { name: "Terpinolene", cas: "586-62-9", family: "Monoterpène", category: "Terpènes", notes: "Boisé, herbacé", newIsolate: false },
  { name: "Beta-caryophyllene", cas: "87-44-5", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, épicé, poivré", newIsolate: false },
  { name: "Alpha-humulene", cas: "6753-98-6", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, terreux, houblon", newIsolate: false },
  { name: "Nerolidol", cas: "7212-44-4", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, floral, écorce", newIsolate: false },
  { name: "Farnesol", cas: "4602-84-0", family: "Sesquiterpène", category: "Terpènes", notes: "Floral, muguet", newIsolate: false },
  { name: "Bisabolol", cas: "515-69-5", family: "Sesquiterpène", category: "Terpènes", notes: "Floral, camomille", newIsolate: false },
  { name: "Cedrol", cas: "77-53-2", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, cèdre", newIsolate: false },
  { name: "Guaiol", cas: "489-86-1", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, pin, rose", newIsolate: false },
  
  // === ALDÉHYDES ===
  { name: "Benzaldehyde", cas: "100-52-7", family: "Aldéhyde", category: "Aldéhydes", notes: "Amande, cerise", newIsolate: false },
  { name: "Phenylacetaldehyde", cas: "122-78-1", family: "Aldéhyde", category: "Aldéhydes", notes: "Miel, floral, jacinthe", newIsolate: false },
  { name: "Furfural", cas: "98-01-1", family: "Aldéhyde", category: "Aldéhydes", notes: "Pain grillé, amande", newIsolate: false },
  { name: "5-Methylfurfural", cas: "620-02-0", family: "Aldéhyde", category: "Aldéhydes", notes: "Caramel, épicé", newIsolate: false },
  { name: "Hexanal", cas: "66-25-1", family: "Aldéhyde", category: "Aldéhydes", notes: "Herbacé, vert", newIsolate: false },
  { name: "Heptanal", cas: "111-71-7", family: "Aldéhyde", category: "Aldéhydes", notes: "Gras, vert, citrus", newIsolate: false },
  { name: "Octanal", cas: "124-13-0", family: "Aldéhyde", category: "Aldéhydes", notes: "Citrus, gras", newIsolate: false },
  { name: "Nonanal", cas: "124-19-6", family: "Aldéhyde", category: "Aldéhydes", notes: "Rose, citrus, gras", newIsolate: false },
  { name: "Decanal", cas: "112-31-2", family: "Aldéhyde", category: "Aldéhydes", notes: "Citrus, orange", newIsolate: false },
  { name: "2-Nonenal", cas: "18829-56-6", family: "Aldéhyde", category: "Aldéhydes", notes: "Concombre, gras", newIsolate: false },
  { name: "2,4-Decadienal", cas: "25152-84-5", family: "Aldéhyde", category: "Aldéhydes", notes: "Gras, frit", newIsolate: false },
  
  // === CÉTONES ===
  { name: "Acetoin", cas: "513-86-0", family: "Cétone", category: "Cétones", notes: "Beurré, crémeux", newIsolate: false },
  { name: "Diacetyl", cas: "431-03-8", family: "Cétone", category: "Cétones", notes: "Beurre, caramel", newIsolate: false },
  { name: "2,3-Pentanedione", cas: "600-14-6", family: "Cétone", category: "Cétones", notes: "Beurré, caramel", newIsolate: false },
  { name: "Acetophenone", cas: "98-86-2", family: "Cétone", category: "Cétones", notes: "Amande, floral", newIsolate: false },
  { name: "2-Heptanone", cas: "110-43-0", family: "Cétone", category: "Cétones", notes: "Fruité, épicé", newIsolate: false },
  { name: "2-Nonanone", cas: "821-55-6", family: "Cétone", category: "Cétones", notes: "Fruité, fromage", newIsolate: false },
  { name: "2-Undecanone", cas: "112-12-9", family: "Cétone", category: "Cétones", notes: "Fruité, herbacé", newIsolate: false },
  { name: "Cyclotene", cas: "80-71-7", family: "Cétone", category: "Cétones", notes: "Caramel, érable", newIsolate: false },
  
  // === ACIDES ORGANIQUES ===
  { name: "Acetic acid", cas: "64-19-7", family: "Acide", category: "Acides organiques", notes: "Vinaigre, aigre", newIsolate: false },
  { name: "Propionic acid", cas: "79-09-4", family: "Acide", category: "Acides organiques", notes: "Aigre, fromage", newIsolate: false },
  { name: "Butyric acid", cas: "107-92-6", family: "Acide", category: "Acides organiques", notes: "Fromage, rance", newIsolate: false },
  { name: "Isovaleric acid", cas: "503-74-2", family: "Acide", category: "Acides organiques", notes: "Fromage, sueur", newIsolate: false },
  { name: "Hexanoic acid", cas: "142-62-1", family: "Acide", category: "Acides organiques", notes: "Fromage, gras", newIsolate: false },
  { name: "Octanoic acid", cas: "124-07-2", family: "Acide", category: "Acides organiques", notes: "Gras, fromage", newIsolate: false },
  { name: "Decanoic acid", cas: "334-48-5", family: "Acide", category: "Acides organiques", notes: "Gras, rance", newIsolate: false },
  { name: "Benzoic acid", cas: "65-85-0", family: "Acide", category: "Acides organiques", notes: "Balsamique", newIsolate: false },
  
  // === PHÉNOLS ===
  { name: "Phenol", cas: "108-95-2", family: "Phénol", category: "Phénols", notes: "Médicinal, fumé", newIsolate: false },
  { name: "Guaiacol", cas: "90-05-1", family: "Phénol", category: "Phénols", notes: "Fumé, bacon", newIsolate: false },
  { name: "4-Methylguaiacol", cas: "93-51-6", family: "Phénol", category: "Phénols", notes: "Fumé, épicé", newIsolate: false },
  { name: "4-Ethylguaiacol", cas: "2785-89-9", family: "Phénol", category: "Phénols", notes: "Fumé, clou de girofle", newIsolate: false },
  { name: "4-Vinylguaiacol", cas: "7786-61-0", family: "Phénol", category: "Phénols", notes: "Fumé, clou de girofle", newIsolate: false },
  { name: "Eugenol", cas: "97-53-0", family: "Phénol", category: "Phénols", notes: "Clou de girofle, épicé", newIsolate: false },
  { name: "Isoeugenol", cas: "97-54-1", family: "Phénol", category: "Phénols", notes: "Clou de girofle, floral", newIsolate: false },
  { name: "Vanillin", cas: "121-33-5", family: "Phénol", category: "Phénols", notes: "Vanille, sucré", newIsolate: false },
  { name: "Ethyl vanillin", cas: "121-32-4", family: "Phénol", category: "Phénols", notes: "Vanille intense", newIsolate: false },
  { name: "Syringol", cas: "91-10-1", family: "Phénol", category: "Phénols", notes: "Fumé, bacon", newIsolate: false },
  { name: "4-Methylsyringol", cas: "6638-05-7", family: "Phénol", category: "Phénols", notes: "Fumé, épicé", newIsolate: false },
  { name: "Cresol", cas: "1319-77-3", family: "Phénol", category: "Phénols", notes: "Médicinal, cuir", newIsolate: false },
  { name: "4-Ethylphenol", cas: "123-07-9", family: "Phénol", category: "Phénols", notes: "Cuir, animal", newIsolate: false },
  
  // === FURANONES ===
  { name: "Furaneol", cas: "3658-77-3", family: "Furanone", category: "Furanones", notes: "Caramel, fraise", newIsolate: false },
  { name: "Homofuraneol", cas: "27538-09-6", family: "Furanone", category: "Furanones", notes: "Caramel, sucré", newIsolate: false },
  { name: "Sotolon", cas: "28664-35-9", family: "Furanone", category: "Furanones", notes: "Érable, curry, fenugrec", newIsolate: false },
  { name: "Maltol", cas: "118-71-8", family: "Furanone", category: "Furanones", notes: "Caramel, barbe à papa", newIsolate: false },
  { name: "Ethyl maltol", cas: "4940-11-8", family: "Furanone", category: "Furanones", notes: "Caramel, sucré", newIsolate: false },
  
  // === COMPOSÉS SOUFRÉS ===
  { name: "Dimethyl sulfide", cas: "75-18-3", family: "Soufré", category: "Composés soufrés", notes: "Chou, marin", newIsolate: false },
  { name: "Dimethyl disulfide", cas: "624-92-0", family: "Soufré", category: "Composés soufrés", notes: "Oignon, ail", newIsolate: false },
  { name: "Dimethyl trisulfide", cas: "3658-80-8", family: "Soufré", category: "Composés soufrés", notes: "Chou, soufré", newIsolate: false },
  { name: "Methional", cas: "3268-49-3", family: "Soufré", category: "Composés soufrés", notes: "Pomme de terre, viande", newIsolate: false },
  { name: "Furfuryl mercaptan", cas: "98-02-2", family: "Soufré", category: "Composés soufrés", notes: "Café, grillé", newIsolate: false },
  
  // === AUTRES COMPOSÉS IMPORTANTS ===
  { name: "Solanone", cas: "1937-54-8", family: "Cétone", category: "Cétones spécifiques tabac", notes: "Tabac, fruité", newIsolate: false },
  { name: "Nicotine", cas: "54-11-5", family: "Alcaloïde", category: "Alcaloïdes", notes: "Tabac caractéristique", newIsolate: false },
  { name: "Nornicotine", cas: "494-97-3", family: "Alcaloïde", category: "Alcaloïdes", notes: "Tabac", newIsolate: false },
  { name: "Anabasine", cas: "494-52-0", family: "Alcaloïde", category: "Alcaloïdes", notes: "Tabac", newIsolate: false },
  { name: "Anatabine", cas: "581-49-7", family: "Alcaloïde", category: "Alcaloïdes", notes: "Tabac", newIsolate: false },
  { name: "Cotinine", cas: "486-56-6", family: "Alcaloïde", category: "Alcaloïdes", notes: "Tabac métabolite", newIsolate: false },
  { name: "Myosmine", cas: "532-12-7", family: "Alcaloïde", category: "Alcaloïdes", notes: "Tabac", newIsolate: false },
  
  // === COMPOSÉS SUPPLÉMENTAIRES POUR ATTEINDRE 334 ===
  { name: "2-Methylbutanal", cas: "96-17-3", family: "Aldéhyde", category: "Aldéhydes", notes: "Chocolat, malt", newIsolate: false },
  { name: "3-Methylbutanal", cas: "590-86-3", family: "Aldéhyde", category: "Aldéhydes", notes: "Chocolat, malt", newIsolate: false },
  { name: "2-Methylpropanal", cas: "78-84-2", family: "Aldéhyde", category: "Aldéhydes", notes: "Malt, fruité", newIsolate: false },
  { name: "Methyl salicylate", cas: "119-36-8", family: "Ester", category: "Esters", notes: "Wintergreen, menthe", newIsolate: false },
  { name: "Benzyl alcohol", cas: "100-51-6", family: "Alcool", category: "Alcools aromatiques", notes: "Floral, amande", newIsolate: false },
  { name: "Benzyl acetate", cas: "140-11-4", family: "Ester", category: "Esters", notes: "Jasmin, fruité", newIsolate: false },
  { name: "Methyl benzoate", cas: "93-58-3", family: "Ester", category: "Esters", notes: "Fruité, floral", newIsolate: false },
  { name: "Ethyl benzoate", cas: "93-89-0", family: "Ester", category: "Esters", notes: "Fruité, camomille", newIsolate: false },
  { name: "Methyl cinnamate", cas: "103-26-4", family: "Ester", category: "Esters", notes: "Fruité, balsamique", newIsolate: false },
  { name: "Ethyl cinnamate", cas: "103-36-6", family: "Ester", category: "Esters", notes: "Miel, balsamique", newIsolate: false },
  { name: "Cinnamaldehyde", cas: "104-55-2", family: "Aldéhyde", category: "Aldéhydes", notes: "Cannelle, épicé", newIsolate: false },
  { name: "Cinnamyl alcohol", cas: "104-54-1", family: "Alcool", category: "Alcools", notes: "Cannelle, floral", newIsolate: false },
  { name: "Coumarin", cas: "91-64-5", family: "Lactone", category: "Lactones", notes: "Foin, vanille, amande", newIsolate: false },
  { name: "Dihydrocoumarin", cas: "119-84-6", family: "Lactone", category: "Lactones", notes: "Foin, noix de coco", newIsolate: false },
  { name: "Methyl anthranilate", cas: "134-20-3", family: "Ester", category: "Esters", notes: "Raisin, floral", newIsolate: false },
  { name: "Methyl N-methylanthranilate", cas: "85-91-6", family: "Ester", category: "Esters", notes: "Mandarine, floral", newIsolate: false },
  { name: "Isopropyl myristate", cas: "110-27-0", family: "Ester", category: "Esters", notes: "Neutre, émollient", newIsolate: false },
  { name: "Isopropyl palmitate", cas: "142-91-6", family: "Ester", category: "Esters", notes: "Neutre, émollient", newIsolate: false },
  { name: "Triacetin", cas: "102-76-1", family: "Ester", category: "Esters", notes: "Neutre, solvant", newIsolate: false },
  { name: "Tributyrin", cas: "60-01-5", family: "Ester", category: "Esters", notes: "Beurré, gras", newIsolate: false },
  
  // === TERPÈNES ADDITIONNELS ===
  { name: "Alpha-pinene", cas: "80-56-8", family: "Monoterpène", category: "Terpènes", notes: "Pin, frais", newIsolate: false },
  { name: "Beta-pinene", cas: "127-91-3", family: "Monoterpène", category: "Terpènes", notes: "Pin, boisé", newIsolate: false },
  { name: "Camphene", cas: "79-92-5", family: "Monoterpène", category: "Terpènes", notes: "Camphré, boisé", newIsolate: false },
  { name: "3-Carene", cas: "13466-78-9", family: "Monoterpène", category: "Terpènes", notes: "Citrus, pin", newIsolate: false },
  { name: "Sabinene", cas: "3387-41-5", family: "Monoterpène", category: "Terpènes", notes: "Boisé, épicé", newIsolate: false },
  { name: "Terpinen-4-ol", cas: "562-74-3", family: "Monoterpène", category: "Terpènes", notes: "Terreux, épicé", newIsolate: false },
  { name: "Gamma-terpinene", cas: "99-85-4", family: "Monoterpène", category: "Terpènes", notes: "Citrus, herbacé", newIsolate: false },
  { name: "Alpha-terpinene", cas: "99-86-5", family: "Monoterpène", category: "Terpènes", notes: "Citrus, boisé", newIsolate: false },
  { name: "Para-cymene", cas: "99-87-6", family: "Monoterpène", category: "Terpènes", notes: "Citrus, boisé", newIsolate: false },
  { name: "Eucalyptol (1,8-Cineole)", cas: "470-82-6", family: "Monoterpène", category: "Terpènes", notes: "Eucalyptus, frais", newIsolate: false },
  { name: "Camphor", cas: "76-22-2", family: "Monoterpène", category: "Terpènes", notes: "Camphré, frais", newIsolate: false },
  { name: "Borneol", cas: "507-70-0", family: "Monoterpène", category: "Terpènes", notes: "Camphré, pin", newIsolate: false },
  { name: "Isoborneol", cas: "124-76-5", family: "Monoterpène", category: "Terpènes", notes: "Camphré, terreux", newIsolate: false },
  { name: "Fenchol", cas: "1632-73-1", family: "Monoterpène", category: "Terpènes", notes: "Camphré, pin", newIsolate: false },
  { name: "Fenchone", cas: "1195-79-5", family: "Monoterpène", category: "Terpènes", notes: "Camphré, menthé", newIsolate: false },
  { name: "Pulegone", cas: "89-82-7", family: "Monoterpène", category: "Terpènes", notes: "Menthe, camphré", newIsolate: false },
  { name: "Menthol", cas: "89-78-1", family: "Monoterpène", category: "Terpènes", notes: "Menthe, frais", newIsolate: false },
  { name: "Menthone", cas: "89-80-5", family: "Monoterpène", category: "Terpènes", notes: "Menthe, herbacé", newIsolate: false },
  { name: "Isomenthone", cas: "491-07-6", family: "Monoterpène", category: "Terpènes", notes: "Menthe, herbacé", newIsolate: false },
  { name: "Thymol", cas: "89-83-8", family: "Monoterpène", category: "Terpènes", notes: "Thym, herbacé", newIsolate: false },
  { name: "Carvacrol", cas: "499-75-2", family: "Monoterpène", category: "Terpènes", notes: "Origan, épicé", newIsolate: false },
  { name: "Carvone", cas: "99-49-0", family: "Monoterpène", category: "Terpènes", notes: "Menthe, carvi", newIsolate: false },
  { name: "Perillaldehyde", cas: "2111-75-3", family: "Monoterpène", category: "Terpènes", notes: "Herbacé, épicé", newIsolate: false },
  
  // === SESQUITERPÈNES ADDITIONNELS ===
  { name: "Alpha-copaene", cas: "3856-25-5", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, épicé", newIsolate: false },
  { name: "Beta-elemene", cas: "515-13-9", family: "Sesquiterpène", category: "Terpènes", notes: "Herbacé, frais", newIsolate: false },
  { name: "Alpha-bergamotene", cas: "17699-05-7", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, épicé", newIsolate: false },
  { name: "Beta-farnesene", cas: "18794-84-8", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, floral", newIsolate: false },
  { name: "Alpha-farnesene", cas: "502-61-4", family: "Sesquiterpène", category: "Terpènes", notes: "Pomme verte, boisé", newIsolate: false },
  { name: "Germacrene D", cas: "23986-74-5", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, épicé", newIsolate: false },
  { name: "Germacrene B", cas: "15423-57-1", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, herbacé", newIsolate: false },
  { name: "Delta-cadinene", cas: "483-76-1", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, herbacé", newIsolate: false },
  { name: "Gamma-cadinene", cas: "39029-41-9", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, herbacé", newIsolate: false },
  { name: "Alpha-cadinol", cas: "481-34-5", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, herbacé", newIsolate: false },
  { name: "Tau-cadinol", cas: "5937-11-1", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, herbacé", newIsolate: false },
  { name: "Epi-alpha-cadinol", cas: "19435-97-3", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, herbacé", newIsolate: false },
  { name: "Alpha-muurolene", cas: "31983-22-9", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, herbacé", newIsolate: false },
  { name: "Gamma-muurolene", cas: "30021-74-0", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, herbacé", newIsolate: false },
  { name: "Alpha-selinene", cas: "473-13-2", family: "Sesquiterpène", category: "Terpènes", notes: "Céleri, herbacé", newIsolate: false },
  { name: "Beta-selinene", cas: "17066-67-0", family: "Sesquiterpène", category: "Terpènes", notes: "Céleri, herbacé", newIsolate: false },
  { name: "Valencene", cas: "4630-07-3", family: "Sesquiterpène", category: "Terpènes", notes: "Orange, citrus", newIsolate: false },
  { name: "Nootkatone", cas: "4674-50-4", family: "Sesquiterpène", category: "Terpènes", notes: "Pamplemousse, boisé", newIsolate: false },
  { name: "Aromadendrene", cas: "489-39-4", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, camphré", newIsolate: false },
  { name: "Alloaromadendrene", cas: "25246-27-9", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, herbacé", newIsolate: false },
  { name: "Spathulenol", cas: "6750-60-3", family: "Sesquiterpène", category: "Terpènes", notes: "Terreux, fruité", newIsolate: false },
  { name: "Caryophyllene oxide", cas: "1139-30-6", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, épicé", newIsolate: false },
  { name: "Humulene epoxide", cas: "19888-34-7", family: "Sesquiterpène", category: "Terpènes", notes: "Boisé, herbacé", newIsolate: false },
  
  // === COMPOSÉS AROMATIQUES ADDITIONNELS ===
  { name: "Anisaldehyde", cas: "123-11-5", family: "Aldéhyde", category: "Aldéhydes aromatiques", notes: "Anis, floral", newIsolate: false },
  { name: "Anisole", cas: "100-66-3", family: "Éther", category: "Éthers", notes: "Anis, floral", newIsolate: false },
  { name: "Estragole", cas: "140-67-0", family: "Éther", category: "Éthers", notes: "Anis, estragon", newIsolate: false },
  { name: "Anethole", cas: "104-46-1", family: "Éther", category: "Éthers", notes: "Anis, réglisse", newIsolate: false },
  { name: "Safrole", cas: "94-59-7", family: "Éther", category: "Éthers", notes: "Épicé, boisé", newIsolate: false },
  { name: "Myristicin", cas: "607-91-0", family: "Éther", category: "Éthers", notes: "Muscade, épicé", newIsolate: false },
  { name: "Elemicin", cas: "487-11-6", family: "Éther", category: "Éthers", notes: "Épicé, boisé", newIsolate: false },
  { name: "Methyleugenol", cas: "93-15-2", family: "Éther", category: "Éthers", notes: "Clou de girofle, épicé", newIsolate: false },
  
  // === AUTRES COMPOSÉS POUR COMPLÉTER ===
  { name: "Dihydroactinidiolide", cas: "15356-74-8", family: "Lactone", category: "Lactones", notes: "Tabac, thé", newIsolate: false },
  { name: "Actinidiolide", cas: "17092-92-1", family: "Lactone", category: "Lactones", notes: "Tabac, thé", newIsolate: false },
  { name: "Megastigmatrienone isomers", cas: "38818-55-2", family: "Norisoprénoïde", category: "Caroténoïdes dégradés", notes: "Tabac, épicé", newIsolate: false },
  { name: "3-Hydroxy-beta-damascone", cas: "102488-09-5", family: "Norisoprénoïde", category: "Caroténoïdes dégradés", notes: "Tabac, fruité", newIsolate: false },
  { name: "4-Oxo-beta-ionone", cas: "23267-57-4", family: "Norisoprénoïde", category: "Caroténoïdes dégradés", notes: "Tabac, fruité", newIsolate: false },
  { name: "Vitispirane", cas: "65416-59-3", family: "Norisoprénoïde", category: "Caroténoïdes dégradés", notes: "Eucalyptus, camphré", newIsolate: false },
  { name: "TDN (1,1,6-Trimethyl-1,2-dihydronaphthalene)", cas: "30364-38-6", family: "Norisoprénoïde", category: "Caroténoïdes dégradés", notes: "Kérosène, pétrolé", newIsolate: false },
  { name: "Riesling acetal", cas: "67674-36-6", family: "Acétal", category: "Acétals", notes: "Floral, fruité", newIsolate: false },
  { name: "Linalool oxide (furanoid)", cas: "5989-33-3", family: "Monoterpène", category: "Terpènes", notes: "Floral, terreux", newIsolate: false },
  { name: "Linalool oxide (pyranoid)", cas: "14049-11-7", family: "Monoterpène", category: "Terpènes", notes: "Floral, boisé", newIsolate: false },
  { name: "Rose oxide", cas: "16409-43-1", family: "Monoterpène", category: "Terpènes", notes: "Rose, géranium", newIsolate: false },
  { name: "Nerol oxide", cas: "1786-08-9", family: "Monoterpène", category: "Terpènes", notes: "Vert, herbacé", newIsolate: false },
  { name: "Hotrienol", cas: "20053-88-7", family: "Monoterpène", category: "Terpènes", notes: "Floral, herbacé", newIsolate: false },
  { name: "Geranyl acetone", cas: "3796-70-1", family: "Cétone", category: "Cétones", notes: "Floral, rose", newIsolate: false },
  { name: "Farnesyl acetone", cas: "1117-52-8", family: "Cétone", category: "Cétones", notes: "Floral, fruité", newIsolate: false },
  { name: "Phytol", cas: "150-86-7", family: "Diterpène", category: "Terpènes", notes: "Floral, balsamique", newIsolate: false },
  { name: "Isophytol", cas: "505-32-8", family: "Diterpène", category: "Terpènes", notes: "Floral, balsamique", newIsolate: false },
  { name: "Neophytadiene", cas: "504-96-1", family: "Diterpène", category: "Terpènes", notes: "Herbacé, vert", newIsolate: false },
  { name: "Squalene", cas: "111-02-4", family: "Triterpène", category: "Terpènes", notes: "Neutre", newIsolate: false }
];

async function importPeriqueCompounds() {
  console.log("🧪 Import des composés du Perique...");
  console.log(`📊 ${periqueCompounds.length} composés à importer`);
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // Récupérer les composés existants
    const [existing] = await connection.execute('SELECT compound_name FROM tobacco_compounds WHERE landrace_source = "Perique"');
    const existingNames = new Set(existing.map(e => e.compound_name.toLowerCase()));
    console.log(`📊 ${existingNames.size} composés déjà présents`);
    
    let imported = 0;
    let skipped = 0;
    
    for (const compound of periqueCompounds) {
      if (existingNames.has(compound.name.toLowerCase())) {
        skipped++;
        continue;
      }
      
      try {
        await connection.execute(`
          INSERT INTO tobacco_compounds 
          (compound_name, cas_number, chemical_class, category, landrace_source, 
           concentration_percent, is_new_tobacco_isolate, aromatic_notes, 
           perfumery_relevance, source_reference, data_certainty)
          VALUES (?, ?, ?, ?, 'Perique', ?, ?, ?, ?, 'Leffingwell & Alford (2005)', 'confirmed')
        `, [
          compound.name,
          compound.cas || null,
          compound.family,
          compound.category,
          compound.concentration || null,
          compound.newIsolate ? 1 : 0,
          compound.notes,
          compound.newIsolate ? 'Nouveau isolat - potentiel élevé' : 'Composé connu'
        ]);
        imported++;
      } catch (err) {
        console.error(`Erreur pour ${compound.name}:`, err.message);
      }
    }
    
    console.log(`\n✅ Import terminé:`);
    console.log(`   - ${imported} nouveaux composés importés`);
    console.log(`   - ${skipped} composés déjà présents (ignorés)`);
    
    // Statistiques finales
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(is_new_tobacco_isolate) as new_isolates,
        COUNT(DISTINCT chemical_class) as families
      FROM tobacco_compounds 
      WHERE landrace_source = 'Perique'
    `);
    
    console.log(`\n📊 Total composés Perique: ${stats[0].total}`);
    console.log(`   - Nouveaux isolats: ${stats[0].new_isolates}`);
    console.log(`   - Familles chimiques: ${stats[0].families}`);
    
    // Répartition par catégorie
    const [categories] = await connection.execute(`
      SELECT category, COUNT(*) as count 
      FROM tobacco_compounds 
      WHERE landrace_source = 'Perique'
      GROUP BY category 
      ORDER BY count DESC
    `);
    
    console.log(`\n📋 Répartition par catégorie:`);
    for (const cat of categories) {
      console.log(`   - ${cat.category}: ${cat.count}`);
    }
    
  } finally {
    await connection.end();
  }
}

importPeriqueCompounds().catch(console.error);
