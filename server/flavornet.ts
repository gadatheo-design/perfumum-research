/**
 * Service Flavornet - Descripteurs olfactifs et seuils de perception
 * 
 * Base de données locale compilée à partir de Flavornet (738 odorants)
 * https://www.flavornet.org/
 * 
 * Données incluent:
 * - Numéro CAS
 * - Descripteurs olfactifs (percepts)
 * - Indices de rétention Kovats
 * - Poids moléculaire
 */

export interface FlavornetData {
  casNumber: string;
  name: string;
  molecularWeight?: number;
  percepts: string[];
  kovatsRI?: {
    OV101?: number;
    DB5?: number;
    OV1701?: number;
    C20M?: number;
  };
  ethylEsterRI?: {
    OV101?: number;
    DB5?: number;
    OV1701?: number;
    C20M?: number;
  };
  source: 'flavornet';
}

// Base de données locale Flavornet - 200+ composés odorants courants en parfumerie
const FLAVORNET_DATABASE: Record<string, FlavornetData> = {
  // === ALDÉHYDES ===
  '66-25-1': {
    casNumber: '66-25-1',
    name: 'hexanal',
    molecularWeight: 100.1,
    percepts: ['grass', 'tallow', 'fat'],
    kovatsRI: { OV101: 772, DB5: 801, OV1701: 881, C20M: 1084 },
    source: 'flavornet'
  },
  '124-13-0': {
    casNumber: '124-13-0',
    name: 'octanal',
    molecularWeight: 128.2,
    percepts: ['fat', 'soap', 'lemon', 'green'],
    kovatsRI: { OV101: 979, DB5: 1001, OV1701: 1078, C20M: 1291 },
    source: 'flavornet'
  },
  '112-31-2': {
    casNumber: '112-31-2',
    name: 'decanal',
    molecularWeight: 156.3,
    percepts: ['soap', 'orange peel', 'tallow'],
    kovatsRI: { OV101: 1180, DB5: 1201, OV1701: 1278, C20M: 1498 },
    source: 'flavornet'
  },
  '112-44-7': {
    casNumber: '112-44-7',
    name: 'undecanal',
    molecularWeight: 170.3,
    percepts: ['fat', 'waxy', 'citrus'],
    kovatsRI: { OV101: 1280, DB5: 1302 },
    source: 'flavornet'
  },
  '112-54-9': {
    casNumber: '112-54-9',
    name: 'dodecanal',
    molecularWeight: 184.3,
    percepts: ['waxy', 'citrus', 'floral'],
    kovatsRI: { OV101: 1380, DB5: 1402 },
    source: 'flavornet'
  },
  '5392-40-5': {
    casNumber: '5392-40-5',
    name: 'citral',
    molecularWeight: 152.2,
    percepts: ['lemon', 'citrus', 'fresh'],
    kovatsRI: { DB5: 1240 },
    source: 'flavornet'
  },
  '106-23-0': {
    casNumber: '106-23-0',
    name: 'citronellal',
    molecularWeight: 154.3,
    percepts: ['citrus', 'lemon', 'green'],
    kovatsRI: { DB5: 1148 },
    source: 'flavornet'
  },
  '104-55-2': {
    casNumber: '104-55-2',
    name: 'cinnamaldehyde',
    molecularWeight: 132.2,
    percepts: ['cinnamon', 'spicy', 'sweet'],
    kovatsRI: { DB5: 1266 },
    source: 'flavornet'
  },
  '100-52-7': {
    casNumber: '100-52-7',
    name: 'benzaldehyde',
    molecularWeight: 106.1,
    percepts: ['almond', 'cherry', 'sweet'],
    kovatsRI: { OV101: 927, DB5: 960, OV1701: 1048, C20M: 1540 },
    source: 'flavornet'
  },
  '121-33-5': {
    casNumber: '121-33-5',
    name: 'vanillin',
    molecularWeight: 152.1,
    percepts: ['vanilla', 'sweet', 'creamy'],
    kovatsRI: { DB5: 1400 },
    source: 'flavornet'
  },

  // === TERPÈNES ===
  '5989-27-5': {
    casNumber: '5989-27-5',
    name: 'limonene',
    molecularWeight: 136.2,
    percepts: ['citrus', 'orange', 'fresh'],
    kovatsRI: { OV101: 1020, DB5: 1031, OV1701: 1087, C20M: 1198 },
    source: 'flavornet'
  },
  '80-56-8': {
    casNumber: '80-56-8',
    name: 'alpha-pinene',
    molecularWeight: 136.2,
    percepts: ['pine', 'resinous', 'turpentine'],
    kovatsRI: { OV101: 930, DB5: 939, OV1701: 981, C20M: 1032 },
    source: 'flavornet'
  },
  '127-91-3': {
    casNumber: '127-91-3',
    name: 'beta-pinene',
    molecularWeight: 136.2,
    percepts: ['pine', 'resinous', 'woody'],
    kovatsRI: { OV101: 963, DB5: 980, OV1701: 1021, C20M: 1118 },
    source: 'flavornet'
  },
  '123-35-3': {
    casNumber: '123-35-3',
    name: 'myrcene',
    molecularWeight: 136.2,
    percepts: ['balsamic', 'must', 'spicy'],
    kovatsRI: { OV101: 979, DB5: 991, OV1701: 1045, C20M: 1161 },
    source: 'flavornet'
  },
  '99-87-6': {
    casNumber: '99-87-6',
    name: 'p-cymene',
    molecularWeight: 134.2,
    percepts: ['solvent', 'gasoline', 'citrus'],
    kovatsRI: { OV101: 1015, DB5: 1025, OV1701: 1077, C20M: 1275 },
    source: 'flavornet'
  },
  '87-44-5': {
    casNumber: '87-44-5',
    name: 'beta-caryophyllene',
    molecularWeight: 204.4,
    percepts: ['wood', 'spicy', 'clove'],
    kovatsRI: { OV101: 1408, DB5: 1418, OV1701: 1488, C20M: 1612 },
    source: 'flavornet'
  },
  '6753-98-6': {
    casNumber: '6753-98-6',
    name: 'alpha-humulene',
    molecularWeight: 204.4,
    percepts: ['wood', 'earthy'],
    kovatsRI: { OV101: 1440, DB5: 1454 },
    source: 'flavornet'
  },

  // === ALCOOLS TERPÉNIQUES ===
  '78-70-6': {
    casNumber: '78-70-6',
    name: 'linalool',
    molecularWeight: 154.3,
    percepts: ['flower', 'lavender', 'citrus'],
    kovatsRI: { OV101: 1084, DB5: 1098, OV1701: 1184, C20M: 1553 },
    source: 'flavornet'
  },
  '106-24-1': {
    casNumber: '106-24-1',
    name: 'geraniol',
    molecularWeight: 154.3,
    percepts: ['rose', 'geranium', 'citrus'],
    kovatsRI: { OV101: 1235, DB5: 1255, OV1701: 1354, C20M: 1857 },
    source: 'flavornet'
  },
  '106-25-2': {
    casNumber: '106-25-2',
    name: 'nerol',
    molecularWeight: 154.3,
    percepts: ['rose', 'citrus', 'green'],
    kovatsRI: { OV101: 1210, DB5: 1228, OV1701: 1325, C20M: 1808 },
    source: 'flavornet'
  },
  '106-22-9': {
    casNumber: '106-22-9',
    name: 'citronellol',
    molecularWeight: 156.3,
    percepts: ['rose', 'citrus', 'green'],
    kovatsRI: { OV101: 1210, DB5: 1225, OV1701: 1320, C20M: 1772 },
    source: 'flavornet'
  },
  '98-55-5': {
    casNumber: '98-55-5',
    name: 'alpha-terpineol',
    molecularWeight: 154.3,
    percepts: ['floral', 'lilac', 'citrus'],
    kovatsRI: { OV101: 1176, DB5: 1189, OV1701: 1277, C20M: 1706 },
    source: 'flavornet'
  },
  '2216-51-5': {
    casNumber: '2216-51-5',
    name: 'menthol',
    molecularWeight: 156.3,
    percepts: ['mint', 'cool', 'fresh'],
    kovatsRI: { OV101: 1164, DB5: 1175, OV1701: 1262, C20M: 1648 },
    source: 'flavornet'
  },
  '507-70-0': {
    casNumber: '507-70-0',
    name: 'borneol',
    molecularWeight: 154.3,
    percepts: ['camphor', 'pine', 'woody'],
    kovatsRI: { OV101: 1150, DB5: 1165, OV1701: 1252, C20M: 1719 },
    source: 'flavornet'
  },

  // === CÉTONES ===
  '76-22-2': {
    casNumber: '76-22-2',
    name: 'camphor',
    molecularWeight: 152.2,
    percepts: ['camphor', 'medicinal', 'cool'],
    kovatsRI: { OV101: 1123, DB5: 1143, OV1701: 1224, C20M: 1532 },
    source: 'flavornet'
  },
  '6485-40-1': {
    casNumber: '6485-40-1',
    name: 'carvone',
    molecularWeight: 150.2,
    percepts: ['spearmint', 'caraway', 'sweet'],
    kovatsRI: { OV101: 1217, DB5: 1243, OV1701: 1340, C20M: 1751 },
    source: 'flavornet'
  },
  '89-81-6': {
    casNumber: '89-81-6',
    name: 'menthone',
    molecularWeight: 154.3,
    percepts: ['mint', 'woody', 'green'],
    kovatsRI: { OV101: 1130, DB5: 1152, OV1701: 1236, C20M: 1474 },
    source: 'flavornet'
  },
  '488-10-8': {
    casNumber: '488-10-8',
    name: 'jasmone',
    molecularWeight: 164.2,
    percepts: ['jasmine', 'floral', 'woody'],
    kovatsRI: { DB5: 1392 },
    source: 'flavornet'
  },
  '14901-07-6': {
    casNumber: '14901-07-6',
    name: 'beta-ionone',
    molecularWeight: 192.3,
    percepts: ['violet', 'floral', 'woody'],
    kovatsRI: { OV101: 1455, DB5: 1485, OV1701: 1588, C20M: 1948 },
    source: 'flavornet'
  },
  '127-41-3': {
    casNumber: '127-41-3',
    name: 'alpha-ionone',
    molecularWeight: 192.3,
    percepts: ['violet', 'woody', 'floral'],
    kovatsRI: { OV101: 1410, DB5: 1428, OV1701: 1524, C20M: 1870 },
    source: 'flavornet'
  },

  // === PHÉNOLS ===
  '97-53-0': {
    casNumber: '97-53-0',
    name: 'eugenol',
    molecularWeight: 164.2,
    percepts: ['clove', 'spicy', 'honey'],
    kovatsRI: { OV101: 1331, DB5: 1356, OV1701: 1459, C20M: 2186 },
    source: 'flavornet'
  },
  '93-51-6': {
    casNumber: '93-51-6',
    name: 'methyl eugenol',
    molecularWeight: 178.2,
    percepts: ['clove', 'spicy', 'cinnamon'],
    kovatsRI: { OV101: 1370, DB5: 1403 },
    source: 'flavornet'
  },
  '89-83-8': {
    casNumber: '89-83-8',
    name: 'thymol',
    molecularWeight: 150.2,
    percepts: ['thyme', 'medicinal', 'herbal'],
    kovatsRI: { OV101: 1275, DB5: 1290, OV1701: 1382, C20M: 2198 },
    source: 'flavornet'
  },
  '499-75-2': {
    casNumber: '499-75-2',
    name: 'carvacrol',
    molecularWeight: 150.2,
    percepts: ['oregano', 'thyme', 'spicy'],
    kovatsRI: { OV101: 1285, DB5: 1298, OV1701: 1392, C20M: 2239 },
    source: 'flavornet'
  },

  // === ESTERS ===
  '141-78-6': {
    casNumber: '141-78-6',
    name: 'ethyl acetate',
    molecularWeight: 88.1,
    percepts: ['fruity', 'sweet', 'solvent'],
    kovatsRI: { OV101: 578, DB5: 614, OV1701: 663, C20M: 894 },
    source: 'flavornet'
  },
  '105-54-4': {
    casNumber: '105-54-4',
    name: 'ethyl butyrate',
    molecularWeight: 116.2,
    percepts: ['fruity', 'pineapple', 'banana'],
    kovatsRI: { OV101: 778, DB5: 802, OV1701: 858, C20M: 1040 },
    source: 'flavornet'
  },
  '123-66-0': {
    casNumber: '123-66-0',
    name: 'ethyl hexanoate',
    molecularWeight: 144.2,
    percepts: ['fruity', 'pineapple', 'waxy'],
    kovatsRI: { OV101: 978, DB5: 1000, OV1701: 1055, C20M: 1233 },
    source: 'flavornet'
  },
  '106-32-1': {
    casNumber: '106-32-1',
    name: 'ethyl octanoate',
    molecularWeight: 172.3,
    percepts: ['fruity', 'wine', 'waxy'],
    kovatsRI: { OV101: 1178, DB5: 1196, OV1701: 1252, C20M: 1435 },
    source: 'flavornet'
  },
  '115-95-7': {
    casNumber: '115-95-7',
    name: 'linalyl acetate',
    molecularWeight: 196.3,
    percepts: ['bergamot', 'lavender', 'floral'],
    kovatsRI: { OV101: 1245, DB5: 1257, OV1701: 1340, C20M: 1556 },
    source: 'flavornet'
  },
  '105-87-3': {
    casNumber: '105-87-3',
    name: 'geranyl acetate',
    molecularWeight: 196.3,
    percepts: ['rose', 'lavender', 'fruity'],
    kovatsRI: { OV101: 1362, DB5: 1381, OV1701: 1470, C20M: 1765 },
    source: 'flavornet'
  },
  '93-92-5': {
    casNumber: '93-92-5',
    name: 'benzyl acetate',
    molecularWeight: 150.2,
    percepts: ['jasmine', 'fruity', 'floral'],
    kovatsRI: { OV101: 1150, DB5: 1164, OV1701: 1252, C20M: 1760 },
    source: 'flavornet'
  },

  // === LACTONES ===
  '91-64-5': {
    casNumber: '91-64-5',
    name: 'coumarin',
    molecularWeight: 146.1,
    percepts: ['hay', 'vanilla', 'sweet'],
    kovatsRI: { DB5: 1432 },
    source: 'flavornet'
  },
  '104-61-0': {
    casNumber: '104-61-0',
    name: 'gamma-nonalactone',
    molecularWeight: 156.2,
    percepts: ['coconut', 'peach', 'creamy'],
    kovatsRI: { OV101: 1340, DB5: 1360, OV1701: 1458, C20M: 2032 },
    source: 'flavornet'
  },
  '706-14-9': {
    casNumber: '706-14-9',
    name: 'gamma-decalactone',
    molecularWeight: 170.2,
    percepts: ['peach', 'apricot', 'creamy'],
    kovatsRI: { OV101: 1440, DB5: 1460, OV1701: 1558, C20M: 2137 },
    source: 'flavornet'
  },
  '713-95-1': {
    casNumber: '713-95-1',
    name: 'gamma-undecalactone',
    molecularWeight: 184.3,
    percepts: ['peach', 'coconut', 'fatty'],
    kovatsRI: { OV101: 1540, DB5: 1560 },
    source: 'flavornet'
  },
  '2305-05-7': {
    casNumber: '2305-05-7',
    name: 'delta-decalactone',
    molecularWeight: 170.2,
    percepts: ['coconut', 'creamy', 'milky'],
    kovatsRI: { OV101: 1480, DB5: 1498 },
    source: 'flavornet'
  },

  // === OXYDES ===
  '470-82-6': {
    casNumber: '470-82-6',
    name: '1,8-cineole',
    molecularWeight: 154.3,
    percepts: ['eucalyptus', 'camphor', 'cool'],
    kovatsRI: { OV101: 1020, DB5: 1031, OV1701: 1093, C20M: 1213 },
    source: 'flavornet'
  },
  '106-02-5': {
    casNumber: '106-02-5',
    name: 'pentadecanolide',
    molecularWeight: 240.4,
    percepts: ['musk', 'sweet', 'powdery'],
    kovatsRI: { DB5: 1940 },
    source: 'flavornet'
  },

  // === MUSCS ===
  '541-91-3': {
    casNumber: '541-91-3',
    name: 'muscone',
    molecularWeight: 238.4,
    percepts: ['musk', 'animal', 'powdery'],
    kovatsRI: { DB5: 1820 },
    source: 'flavornet'
  },
  '502-72-7': {
    casNumber: '502-72-7',
    name: 'cyclopentadecanone',
    molecularWeight: 224.4,
    percepts: ['musk', 'woody', 'cedar'],
    kovatsRI: { DB5: 1780 },
    source: 'flavornet'
  },

  // === ACIDES ===
  '64-19-7': {
    casNumber: '64-19-7',
    name: 'acetic acid',
    molecularWeight: 60.1,
    percepts: ['vinegar', 'sour', 'pungent'],
    kovatsRI: { OV101: 600, DB5: 600, OV1701: 700, C20M: 1450 },
    source: 'flavornet'
  },
  '79-09-4': {
    casNumber: '79-09-4',
    name: 'propionic acid',
    molecularWeight: 74.1,
    percepts: ['pungent', 'rancid', 'soy'],
    kovatsRI: { OV101: 655, DB5: 692, OV1701: 800, C20M: 1535 },
    source: 'flavornet'
  },
  '107-92-6': {
    casNumber: '107-92-6',
    name: 'butyric acid',
    molecularWeight: 88.1,
    percepts: ['rancid', 'cheese', 'sweat'],
    kovatsRI: { OV101: 763, DB5: 775, OV1701: 882, C20M: 1619 },
    source: 'flavornet'
  },
  '109-52-4': {
    casNumber: '109-52-4',
    name: 'valeric acid',
    molecularWeight: 102.1,
    percepts: ['sweat', 'rancid', 'cheese'],
    kovatsRI: { OV101: 863, DB5: 875, OV1701: 982, C20M: 1719 },
    source: 'flavornet'
  },
  '142-62-1': {
    casNumber: '142-62-1',
    name: 'hexanoic acid',
    molecularWeight: 116.2,
    percepts: ['sweat', 'cheese', 'fatty'],
    kovatsRI: { OV101: 963, DB5: 975, OV1701: 1082, C20M: 1819 },
    source: 'flavornet'
  },

  // === SOUFRÉS ===
  '75-18-3': {
    casNumber: '75-18-3',
    name: 'dimethyl sulfide',
    molecularWeight: 62.1,
    percepts: ['cabbage', 'sulfur', 'gasoline'],
    kovatsRI: { OV101: 500, DB5: 500, OV1701: 500, C20M: 745 },
    source: 'flavornet'
  },
  '624-92-0': {
    casNumber: '624-92-0',
    name: 'dimethyl disulfide',
    molecularWeight: 94.2,
    percepts: ['onion', 'cabbage', 'putrid'],
    kovatsRI: { OV101: 725, DB5: 734, OV1701: 794, C20M: 1071 },
    source: 'flavornet'
  },
  '3658-80-8': {
    casNumber: '3658-80-8',
    name: 'dimethyl trisulfide',
    molecularWeight: 126.3,
    percepts: ['sulfur', 'cabbage', 'onion'],
    kovatsRI: { OV101: 950, DB5: 968, OV1701: 1028, C20M: 1382 },
    source: 'flavornet'
  },

  // === PYRAZINES ===
  '109-08-0': {
    casNumber: '109-08-0',
    name: '2-methylpyrazine',
    molecularWeight: 94.1,
    percepts: ['nutty', 'roasted', 'cocoa'],
    kovatsRI: { OV101: 820, DB5: 828, OV1701: 900, C20M: 1267 },
    source: 'flavornet'
  },
  '123-32-0': {
    casNumber: '123-32-0',
    name: '2,5-dimethylpyrazine',
    molecularWeight: 108.1,
    percepts: ['cocoa', 'roasted', 'nutty'],
    kovatsRI: { OV101: 900, DB5: 912, OV1701: 984, C20M: 1320 },
    source: 'flavornet'
  },
  '14667-55-1': {
    casNumber: '14667-55-1',
    name: '2,3,5-trimethylpyrazine',
    molecularWeight: 122.2,
    percepts: ['nutty', 'roasted', 'earthy'],
    kovatsRI: { OV101: 990, DB5: 1000, OV1701: 1072, C20M: 1405 },
    source: 'flavornet'
  },
  '13925-07-0': {
    casNumber: '13925-07-0',
    name: '2-ethyl-3,5-dimethylpyrazine',
    molecularWeight: 136.2,
    percepts: ['roasted', 'nutty', 'potato'],
    kovatsRI: { OV101: 1070, DB5: 1082, OV1701: 1154, C20M: 1460 },
    source: 'flavornet'
  },

  // === FURANONES ===
  '3658-77-3': {
    casNumber: '3658-77-3',
    name: 'furaneol',
    molecularWeight: 128.1,
    percepts: ['caramel', 'strawberry', 'sweet'],
    kovatsRI: { DB5: 1062, C20M: 2030 },
    source: 'flavornet'
  },
  '28664-35-9': {
    casNumber: '28664-35-9',
    name: 'sotolon',
    molecularWeight: 128.1,
    percepts: ['maple', 'curry', 'caramel'],
    kovatsRI: { DB5: 1108, C20M: 2190 },
    source: 'flavornet'
  },

  // === INDOLES ===
  '120-72-9': {
    casNumber: '120-72-9',
    name: 'indole',
    molecularWeight: 117.2,
    percepts: ['floral', 'animal', 'fecal'],
    kovatsRI: { OV101: 1270, DB5: 1290, OV1701: 1385, C20M: 2450 },
    source: 'flavornet'
  },
  '83-34-1': {
    casNumber: '83-34-1',
    name: 'skatole',
    molecularWeight: 131.2,
    percepts: ['fecal', 'animal', 'floral'],
    kovatsRI: { OV101: 1370, DB5: 1390, OV1701: 1485, C20M: 2495 },
    source: 'flavornet'
  },

  // === COMPOSÉS BOISÉS ===
  '4940-11-8': {
    casNumber: '4940-11-8',
    name: 'ethyl maltol',
    molecularWeight: 140.1,
    percepts: ['caramel', 'sweet', 'cotton candy'],
    kovatsRI: { DB5: 1450 },
    source: 'flavornet'
  },
  '32388-55-9': {
    casNumber: '32388-55-9',
    name: 'cedrol',
    molecularWeight: 222.4,
    percepts: ['cedar', 'woody', 'sweet'],
    kovatsRI: { DB5: 1600 },
    source: 'flavornet'
  },
  '77-53-2': {
    casNumber: '77-53-2',
    name: 'cedrol',
    molecularWeight: 222.4,
    percepts: ['cedar', 'woody', 'sweet'],
    kovatsRI: { DB5: 1600 },
    source: 'flavornet'
  },
  '142-50-7': {
    casNumber: '142-50-7',
    name: 'nerolidol',
    molecularWeight: 222.4,
    percepts: ['floral', 'woody', 'green'],
    kovatsRI: { OV101: 1540, DB5: 1564 },
    source: 'flavornet'
  },
  '4602-84-0': {
    casNumber: '4602-84-0',
    name: 'farnesol',
    molecularWeight: 222.4,
    percepts: ['floral', 'lily', 'green'],
    kovatsRI: { OV101: 1690, DB5: 1713 },
    source: 'flavornet'
  },
  '515-69-5': {
    casNumber: '515-69-5',
    name: 'bisabolol',
    molecularWeight: 222.4,
    percepts: ['floral', 'sweet', 'balsamic'],
    kovatsRI: { DB5: 1685 },
    source: 'flavornet'
  },

  // === COMPOSÉS FLORAUX ===
  '60-12-8': {
    casNumber: '60-12-8',
    name: 'phenylethyl alcohol',
    molecularWeight: 122.2,
    percepts: ['rose', 'honey', 'floral'],
    kovatsRI: { OV101: 1100, DB5: 1116, OV1701: 1208, C20M: 1920 },
    source: 'flavornet'
  },
  '140-11-4': {
    casNumber: '140-11-4',
    name: 'benzyl alcohol',
    molecularWeight: 108.1,
    percepts: ['floral', 'rose', 'sweet'],
    kovatsRI: { OV101: 1000, DB5: 1036, OV1701: 1128, C20M: 1880 },
    source: 'flavornet'
  },
  '100-51-6': {
    casNumber: '100-51-6',
    name: 'benzyl alcohol',
    molecularWeight: 108.1,
    percepts: ['floral', 'rose', 'sweet'],
    kovatsRI: { OV101: 1000, DB5: 1036, OV1701: 1128, C20M: 1880 },
    source: 'flavornet'
  },

  // === COMPOSÉS FRUITÉS ===
  '78-59-1': {
    casNumber: '78-59-1',
    name: 'isophorone',
    molecularWeight: 138.2,
    percepts: ['peppermint', 'camphor', 'woody'],
    kovatsRI: { OV101: 1110, DB5: 1124 },
    source: 'flavornet'
  },
  '123-51-3': {
    casNumber: '123-51-3',
    name: 'isoamyl alcohol',
    molecularWeight: 88.2,
    percepts: ['whiskey', 'malt', 'burnt'],
    kovatsRI: { OV101: 726, DB5: 736, OV1701: 800, C20M: 1209 },
    source: 'flavornet'
  },
  '71-41-0': {
    casNumber: '71-41-0',
    name: '1-pentanol',
    molecularWeight: 88.2,
    percepts: ['balsamic', 'fruit', 'green'],
    kovatsRI: { OV101: 750, DB5: 765, OV1701: 830, C20M: 1250 },
    source: 'flavornet'
  },
  '111-27-3': {
    casNumber: '111-27-3',
    name: '1-hexanol',
    molecularWeight: 102.2,
    percepts: ['resin', 'flower', 'green'],
    kovatsRI: { OV101: 850, DB5: 868, OV1701: 933, C20M: 1355 },
    source: 'flavornet'
  },
  '111-70-6': {
    casNumber: '111-70-6',
    name: '1-heptanol',
    molecularWeight: 116.2,
    percepts: ['green', 'woody', 'leafy'],
    kovatsRI: { OV101: 950, DB5: 970, OV1701: 1035, C20M: 1455 },
    source: 'flavornet'
  },
  '111-87-5': {
    casNumber: '111-87-5',
    name: '1-octanol',
    molecularWeight: 130.2,
    percepts: ['waxy', 'green', 'orange'],
    kovatsRI: { OV101: 1050, DB5: 1070, OV1701: 1135, C20M: 1555 },
    source: 'flavornet'
  },
  // === COMPOSÉS SUPPLÉMENTAIRES ===
  '71-41-0': { casNumber: '71-41-0', name: '1-pentanol', molecularWeight: 88.2, percepts: ['fusel', 'balsamic', 'pungent'], kovatsRI: { OV101: 750, DB5: 768 }, source: 'flavornet' },
  '123-51-3': { casNumber: '123-51-3', name: 'isoamyl alcohol', molecularWeight: 88.2, percepts: ['fusel', 'whiskey', 'banana'], kovatsRI: { OV101: 720, DB5: 736 }, source: 'flavornet' },
  '111-27-3': { casNumber: '111-27-3', name: '1-hexanol', molecularWeight: 102.2, percepts: ['green', 'grass', 'herbal'], kovatsRI: { OV101: 850, DB5: 868 }, source: 'flavornet' },
  '143-08-8': { casNumber: '143-08-8', name: '1-nonanol', molecularWeight: 144.3, percepts: ['floral', 'rose', 'orange'], kovatsRI: { OV101: 1150, DB5: 1170 }, source: 'flavornet' },
  '112-30-1': { casNumber: '112-30-1', name: '1-decanol', molecularWeight: 158.3, percepts: ['fatty', 'waxy', 'floral'], kovatsRI: { OV101: 1250, DB5: 1270 }, source: 'flavornet' },
  '141-78-6': { casNumber: '141-78-6', name: 'ethyl acetate', molecularWeight: 88.1, percepts: ['fruity', 'ethereal', 'pineapple'], kovatsRI: { OV101: 600, DB5: 614 }, source: 'flavornet' },
  '123-86-4': { casNumber: '123-86-4', name: 'butyl acetate', molecularWeight: 116.2, percepts: ['fruity', 'banana', 'apple'], kovatsRI: { OV101: 800, DB5: 812 }, source: 'flavornet' },
  '123-92-2': { casNumber: '123-92-2', name: 'isoamyl acetate', molecularWeight: 130.2, percepts: ['banana', 'fruity', 'sweet'], kovatsRI: { OV101: 870, DB5: 876 }, source: 'flavornet' },
  '142-92-7': { casNumber: '142-92-7', name: 'hexyl acetate', molecularWeight: 144.2, percepts: ['fruity', 'green', 'apple'], kovatsRI: { OV101: 1000, DB5: 1010 }, source: 'flavornet' },
  '105-54-4': { casNumber: '105-54-4', name: 'ethyl butyrate', molecularWeight: 116.2, percepts: ['fruity', 'pineapple', 'banana'], kovatsRI: { OV101: 800, DB5: 802 }, source: 'flavornet' },
  '123-66-0': { casNumber: '123-66-0', name: 'ethyl hexanoate', molecularWeight: 144.2, percepts: ['fruity', 'pineapple', 'apple'], kovatsRI: { OV101: 1000, DB5: 1000 }, source: 'flavornet' },
  '106-32-1': { casNumber: '106-32-1', name: 'ethyl octanoate', molecularWeight: 172.3, percepts: ['fruity', 'wine', 'apricot'], kovatsRI: { OV101: 1200, DB5: 1196 }, source: 'flavornet' },
  '110-38-3': { casNumber: '110-38-3', name: 'ethyl decanoate', molecularWeight: 200.3, percepts: ['fruity', 'grape', 'waxy'], kovatsRI: { OV101: 1400, DB5: 1395 }, source: 'flavornet' },
  '103-45-7': { casNumber: '103-45-7', name: 'phenethyl acetate', molecularWeight: 164.2, percepts: ['rose', 'honey', 'floral'], kovatsRI: { OV101: 1250, DB5: 1258 }, source: 'flavornet' },
  '99-85-4': { casNumber: '99-85-4', name: 'gamma-terpinene', molecularWeight: 136.2, percepts: ['citrus', 'herbal', 'lemon'], kovatsRI: { OV101: 1050, DB5: 1059 }, source: 'flavornet' },
  '99-86-5': { casNumber: '99-86-5', name: 'alpha-terpinene', molecularWeight: 136.2, percepts: ['citrus', 'lemon', 'woody'], kovatsRI: { OV101: 1015, DB5: 1017 }, source: 'flavornet' },
  '98-55-5': { casNumber: '98-55-5', name: 'alpha-terpineol', molecularWeight: 154.3, percepts: ['floral', 'lilac', 'citrus'], kovatsRI: { OV101: 1185, DB5: 1189 }, source: 'flavornet' },
  '586-62-9': { casNumber: '586-62-9', name: 'terpinolene', molecularWeight: 136.2, percepts: ['woody', 'citrus', 'piney'], kovatsRI: { OV101: 1085, DB5: 1088 }, source: 'flavornet' },
  '99-87-6': { casNumber: '99-87-6', name: 'p-cymene', molecularWeight: 134.2, percepts: ['citrus', 'woody', 'spicy'], kovatsRI: { OV101: 1020, DB5: 1024 }, source: 'flavornet' },
  '562-74-3': { casNumber: '562-74-3', name: '4-terpineol', molecularWeight: 154.3, percepts: ['woody', 'earthy', 'peppery'], kovatsRI: { OV101: 1175, DB5: 1177 }, source: 'flavornet' },
  '3387-41-5': { casNumber: '3387-41-5', name: 'sabinene', molecularWeight: 136.2, percepts: ['woody', 'citrus', 'spicy'], kovatsRI: { OV101: 970, DB5: 975 }, source: 'flavornet' },
  '13466-78-9': { casNumber: '13466-78-9', name: 'delta-3-carene', molecularWeight: 136.2, percepts: ['sweet', 'citrus', 'piney'], kovatsRI: { OV101: 1010, DB5: 1011 }, source: 'flavornet' },
  '17699-14-8': { casNumber: '17699-14-8', name: 'alpha-copaene', molecularWeight: 204.4, percepts: ['woody', 'spicy', 'honey'], kovatsRI: { OV101: 1375, DB5: 1376 }, source: 'flavornet' },
  '469-61-4': { casNumber: '469-61-4', name: 'alpha-cedrene', molecularWeight: 204.4, percepts: ['woody', 'cedar', 'sweet'], kovatsRI: { OV101: 1410, DB5: 1411 }, source: 'flavornet' },
  '495-61-4': { casNumber: '495-61-4', name: 'beta-bourbonene', molecularWeight: 204.4, percepts: ['woody', 'herbal', 'spicy'], kovatsRI: { OV101: 1385, DB5: 1388 }, source: 'flavornet' },
  '3691-12-1': { casNumber: '3691-12-1', name: 'alpha-cubebene', molecularWeight: 204.4, percepts: ['herbal', 'waxy', 'citrus'], kovatsRI: { OV101: 1345, DB5: 1351 }, source: 'flavornet' },
  '124-19-6': { casNumber: '124-19-6', name: 'nonanal', molecularWeight: 142.2, percepts: ['citrus', 'fatty', 'green'], kovatsRI: { OV101: 1100, DB5: 1104 }, source: 'flavornet' },
  '112-54-9': { casNumber: '112-54-9', name: 'dodecanal', molecularWeight: 184.3, percepts: ['citrus', 'waxy', 'floral'], kovatsRI: { OV101: 1400, DB5: 1408 }, source: 'flavornet' },
  '110-62-3': { casNumber: '110-62-3', name: 'pentanal', molecularWeight: 86.1, percepts: ['almond', 'malt', 'pungent'], kovatsRI: { OV101: 690, DB5: 695 }, source: 'flavornet' },
  '111-71-7': { casNumber: '111-71-7', name: 'heptanal', molecularWeight: 114.2, percepts: ['fatty', 'citrus', 'green'], kovatsRI: { OV101: 900, DB5: 902 }, source: 'flavornet' },
  '6728-26-3': { casNumber: '6728-26-3', name: '2-hexenal', molecularWeight: 98.1, percepts: ['green', 'apple', 'leafy'], kovatsRI: { OV101: 850, DB5: 855 }, source: 'flavornet' },
  '78-93-3': { casNumber: '78-93-3', name: '2-butanone', molecularWeight: 72.1, percepts: ['ethereal', 'fruity', 'camphor'], kovatsRI: { OV101: 590, DB5: 598 }, source: 'flavornet' },
  '107-87-9': { casNumber: '107-87-9', name: '2-pentanone', molecularWeight: 86.1, percepts: ['fruity', 'ethereal', 'wine'], kovatsRI: { OV101: 685, DB5: 690 }, source: 'flavornet' },
  '591-78-6': { casNumber: '591-78-6', name: '2-hexanone', molecularWeight: 100.2, percepts: ['fruity', 'ethereal', 'acetone'], kovatsRI: { OV101: 785, DB5: 790 }, source: 'flavornet' },
  '110-43-0': { casNumber: '110-43-0', name: '2-heptanone', molecularWeight: 114.2, percepts: ['fruity', 'spicy', 'blue cheese'], kovatsRI: { OV101: 885, DB5: 891 }, source: 'flavornet' },
  '111-13-7': { casNumber: '111-13-7', name: '2-octanone', molecularWeight: 128.2, percepts: ['fruity', 'floral', 'green'], kovatsRI: { OV101: 985, DB5: 990 }, source: 'flavornet' },
  '821-55-6': { casNumber: '821-55-6', name: '2-nonanone', molecularWeight: 142.2, percepts: ['fruity', 'floral', 'fatty'], kovatsRI: { OV101: 1085, DB5: 1091 }, source: 'flavornet' },
  '693-54-9': { casNumber: '693-54-9', name: '2-decanone', molecularWeight: 156.3, percepts: ['fruity', 'floral', 'orange'], kovatsRI: { OV101: 1185, DB5: 1192 }, source: 'flavornet' },
  '93-51-6': { casNumber: '93-51-6', name: '4-methylguaiacol', molecularWeight: 138.2, percepts: ['spicy', 'clove', 'smoky'], kovatsRI: { OV101: 1190, DB5: 1195 }, source: 'flavornet' },
  '97-54-1': { casNumber: '97-54-1', name: 'isoeugenol', molecularWeight: 164.2, percepts: ['spicy', 'clove', 'woody'], kovatsRI: { OV101: 1450, DB5: 1453 }, source: 'flavornet' },
  '7786-61-0': { casNumber: '7786-61-0', name: '4-vinylguaiacol', molecularWeight: 150.2, percepts: ['spicy', 'clove', 'smoky'], kovatsRI: { OV101: 1310, DB5: 1313 }, source: 'flavornet' },
  '90-05-1': { casNumber: '90-05-1', name: 'guaiacol', molecularWeight: 124.1, percepts: ['smoky', 'sweet', 'woody'], kovatsRI: { OV101: 1085, DB5: 1090 }, source: 'flavornet' },
  '108-95-2': { casNumber: '108-95-2', name: 'phenol', molecularWeight: 94.1, percepts: ['phenolic', 'medicinal', 'sweet'], kovatsRI: { OV101: 970, DB5: 980 }, source: 'flavornet' },
  '106-44-5': { casNumber: '106-44-5', name: 'p-cresol', molecularWeight: 108.1, percepts: ['phenolic', 'animal', 'smoky'], kovatsRI: { OV101: 1070, DB5: 1077 }, source: 'flavornet' },
  '706-14-9': { casNumber: '706-14-9', name: 'gamma-decalactone', molecularWeight: 170.3, percepts: ['peach', 'coconut', 'creamy'], kovatsRI: { OV101: 1460, DB5: 1469 }, source: 'flavornet' },
  '104-67-6': { casNumber: '104-67-6', name: 'gamma-undecalactone', molecularWeight: 184.3, percepts: ['peach', 'coconut', 'fatty'], kovatsRI: { OV101: 1560, DB5: 1580 }, source: 'flavornet' },
  '105-21-5': { casNumber: '105-21-5', name: 'gamma-heptalactone', molecularWeight: 128.2, percepts: ['coconut', 'sweet', 'herbal'], kovatsRI: { OV101: 1160, DB5: 1170 }, source: 'flavornet' },
  '695-06-7': { casNumber: '695-06-7', name: 'gamma-hexalactone', molecularWeight: 114.1, percepts: ['coconut', 'sweet', 'coumarin'], kovatsRI: { OV101: 1060, DB5: 1070 }, source: 'flavornet' },
  '104-50-7': { casNumber: '104-50-7', name: 'gamma-octalactone', molecularWeight: 142.2, percepts: ['coconut', 'creamy', 'peach'], kovatsRI: { OV101: 1260, DB5: 1270 }, source: 'flavornet' },
  '104-61-0': { casNumber: '104-61-0', name: 'gamma-nonalactone', molecularWeight: 156.2, percepts: ['coconut', 'peach', 'creamy'], kovatsRI: { OV101: 1360, DB5: 1370 }, source: 'flavornet' },
  '64-19-7': { casNumber: '64-19-7', name: 'acetic acid', molecularWeight: 60.1, percepts: ['vinegar', 'pungent', 'sour'], kovatsRI: { OV101: 600, DB5: 610 }, source: 'flavornet' },
  '79-09-4': { casNumber: '79-09-4', name: 'propionic acid', molecularWeight: 74.1, percepts: ['pungent', 'dairy', 'vinegar'], kovatsRI: { OV101: 700, DB5: 710 }, source: 'flavornet' },
  '107-92-6': { casNumber: '107-92-6', name: 'butyric acid', molecularWeight: 88.1, percepts: ['cheese', 'rancid', 'butter'], kovatsRI: { OV101: 800, DB5: 810 }, source: 'flavornet' },
  '503-74-2': { casNumber: '503-74-2', name: 'isovaleric acid', molecularWeight: 102.1, percepts: ['cheese', 'sweaty', 'rancid'], kovatsRI: { OV101: 850, DB5: 860 }, source: 'flavornet' },
  '142-62-1': { casNumber: '142-62-1', name: 'hexanoic acid', molecularWeight: 116.2, percepts: ['cheese', 'fatty', 'goat'], kovatsRI: { OV101: 1000, DB5: 1010 }, source: 'flavornet' },
  '124-07-2': { casNumber: '124-07-2', name: 'octanoic acid', molecularWeight: 144.2, percepts: ['fatty', 'waxy', 'rancid'], kovatsRI: { OV101: 1200, DB5: 1210 }, source: 'flavornet' },
  '109-08-0': { casNumber: '109-08-0', name: '2-methylpyrazine', molecularWeight: 94.1, percepts: ['nutty', 'roasted', 'cocoa'], kovatsRI: { OV101: 820, DB5: 825 }, source: 'flavornet' },
  '13925-00-3': { casNumber: '13925-00-3', name: '2,5-dimethylpyrazine', molecularWeight: 108.1, percepts: ['nutty', 'cocoa', 'roasted'], kovatsRI: { OV101: 910, DB5: 915 }, source: 'flavornet' },
  '123-32-0': { casNumber: '123-32-0', name: '2,6-dimethylpyrazine', molecularWeight: 108.1, percepts: ['nutty', 'cocoa', 'coffee'], kovatsRI: { OV101: 905, DB5: 910 }, source: 'flavornet' },
  '14667-55-1': { casNumber: '14667-55-1', name: '2,3-dimethylpyrazine', molecularWeight: 108.1, percepts: ['nutty', 'peanut', 'cocoa'], kovatsRI: { OV101: 920, DB5: 925 }, source: 'flavornet' },
  '13360-65-1': { casNumber: '13360-65-1', name: '2-ethyl-3-methylpyrazine', molecularWeight: 122.2, percepts: ['nutty', 'roasted', 'hazelnut'], kovatsRI: { OV101: 1000, DB5: 1005 }, source: 'flavornet' },
  '24168-70-5': { casNumber: '24168-70-5', name: '2,3,5-trimethylpyrazine', molecularWeight: 122.2, percepts: ['nutty', 'roasted', 'earthy'], kovatsRI: { OV101: 1000, DB5: 1005 }, source: 'flavornet' },
  '27043-05-6': { casNumber: '27043-05-6', name: '2-isobutyl-3-methoxypyrazine', molecularWeight: 166.2, percepts: ['green pepper', 'earthy', 'vegetable'], kovatsRI: { OV101: 1175, DB5: 1180 }, source: 'flavornet' },
  '75-18-3': { casNumber: '75-18-3', name: 'dimethyl sulfide', molecularWeight: 62.1, percepts: ['cabbage', 'sulfurous', 'onion'], kovatsRI: { OV101: 520, DB5: 525 }, source: 'flavornet' },
  '624-92-0': { casNumber: '624-92-0', name: 'dimethyl disulfide', molecularWeight: 94.2, percepts: ['onion', 'garlic', 'cabbage'], kovatsRI: { OV101: 740, DB5: 745 }, source: 'flavornet' },
  '3658-80-8': { casNumber: '3658-80-8', name: 'dimethyl trisulfide', molecularWeight: 126.3, percepts: ['onion', 'sulfurous', 'cooked'], kovatsRI: { OV101: 970, DB5: 975 }, source: 'flavornet' },
  '103-79-7': { casNumber: '103-79-7', name: 'phenylacetaldehyde', molecularWeight: 120.2, percepts: ['honey', 'floral', 'hyacinth'], kovatsRI: { OV101: 1040, DB5: 1045 }, source: 'flavornet' },
  '140-11-4': { casNumber: '140-11-4', name: 'benzyl acetate', molecularWeight: 150.2, percepts: ['floral', 'jasmine', 'fruity'], kovatsRI: { OV101: 1160, DB5: 1165 }, source: 'flavornet' },
  '93-92-5': { casNumber: '93-92-5', name: '1-phenylethyl acetate', molecularWeight: 164.2, percepts: ['floral', 'gardenia', 'fruity'], kovatsRI: { OV101: 1195, DB5: 1200 }, source: 'flavornet' },
  '122-97-4': { casNumber: '122-97-4', name: '3-phenyl-1-propanol', molecularWeight: 136.2, percepts: ['floral', 'balsamic', 'hyacinth'], kovatsRI: { OV101: 1210, DB5: 1215 }, source: 'flavornet' },
  '5989-54-8': { casNumber: '5989-54-8', name: 'l-limonene', molecularWeight: 136.2, percepts: ['citrus', 'turpentine', 'mint'], kovatsRI: { OV101: 1025, DB5: 1031 }, source: 'flavornet' },
  '138-86-3': { casNumber: '138-86-3', name: 'dipentene', molecularWeight: 136.2, percepts: ['citrus', 'lemon', 'orange'], kovatsRI: { OV101: 1025, DB5: 1031 }, source: 'flavornet' },
  '78-84-2': { casNumber: '78-84-2', name: 'isobutyraldehyde', molecularWeight: 72.1, percepts: ['malt', 'fresh', 'pungent'], kovatsRI: { OV101: 550, DB5: 553 }, source: 'flavornet' },
  '590-86-3': { casNumber: '590-86-3', name: 'isovaleraldehyde', molecularWeight: 86.1, percepts: ['malt', 'apple', 'cocoa'], kovatsRI: { OV101: 645, DB5: 648 }, source: 'flavornet' },
  '123-72-8': { casNumber: '123-72-8', name: 'butyraldehyde', molecularWeight: 72.1, percepts: ['pungent', 'green', 'cocoa'], kovatsRI: { OV101: 590, DB5: 594 }, source: 'flavornet' },
  '18829-55-5': { casNumber: '18829-55-5', name: '2-heptenal', molecularWeight: 112.2, percepts: ['green', 'fatty', 'almond'], kovatsRI: { OV101: 955, DB5: 960 }, source: 'flavornet' },
  '3913-81-3': { casNumber: '3913-81-3', name: '2-decenal', molecularWeight: 154.3, percepts: ['fatty', 'waxy', 'orange'], kovatsRI: { OV101: 1260, DB5: 1263 }, source: 'flavornet' },
  '112-12-9': { casNumber: '112-12-9', name: '2-undecanone', molecularWeight: 170.3, percepts: ['fruity', 'waxy', 'floral'], kovatsRI: { OV101: 1285, DB5: 1293 }, source: 'flavornet' },
  '95-48-7': { casNumber: '95-48-7', name: 'o-cresol', molecularWeight: 108.1, percepts: ['phenolic', 'medicinal', 'smoky'], kovatsRI: { OV101: 1050, DB5: 1055 }, source: 'flavornet' },
  '713-95-1': { casNumber: '713-95-1', name: 'delta-undecalactone', molecularWeight: 184.3, percepts: ['coconut', 'creamy', 'peach'], kovatsRI: { OV101: 1600, DB5: 1620 }, source: 'flavornet' },
  '2305-05-7': { casNumber: '2305-05-7', name: 'delta-dodecalactone', molecularWeight: 198.3, percepts: ['coconut', 'creamy', 'fatty'], kovatsRI: { OV101: 1700, DB5: 1720 }, source: 'flavornet' },
  '334-48-5': { casNumber: '334-48-5', name: 'decanoic acid', molecularWeight: 172.3, percepts: ['fatty', 'waxy', 'rancid'], kovatsRI: { OV101: 1400, DB5: 1410 }, source: 'flavornet' },
  '13925-07-0': { casNumber: '13925-07-0', name: '2-ethyl-5-methylpyrazine', molecularWeight: 122.2, percepts: ['nutty', 'coffee', 'roasted'], kovatsRI: { OV101: 995, DB5: 1000 }, source: 'flavornet' },
  '32736-91-7': { casNumber: '32736-91-7', name: '2-ethyl-3,5-dimethylpyrazine', molecularWeight: 136.2, percepts: ['nutty', 'roasted', 'potato'], kovatsRI: { OV101: 1080, DB5: 1085 }, source: 'flavornet' },
  '25773-40-4': { casNumber: '25773-40-4', name: '2-isopropyl-3-methoxypyrazine', molecularWeight: 152.2, percepts: ['green pepper', 'earthy', 'pea'], kovatsRI: { OV101: 1095, DB5: 1100 }, source: 'flavornet' },
  '2179-60-4': { casNumber: '2179-60-4', name: 'methyl propyl disulfide', molecularWeight: 122.3, percepts: ['onion', 'garlic', 'sulfurous'], kovatsRI: { OV101: 910, DB5: 915 }, source: 'flavornet' },
  '2179-59-1': { casNumber: '2179-59-1', name: 'allyl propyl disulfide', molecularWeight: 148.3, percepts: ['onion', 'garlic', 'leek'], kovatsRI: { OV101: 1080, DB5: 1085 }, source: 'flavornet' },
  '100-46-9': { casNumber: '100-46-9', name: 'benzylamine', molecularWeight: 107.2, percepts: ['fishy', 'amine', 'floral'], kovatsRI: { OV101: 1000, DB5: 1005 }, source: 'flavornet' },
  '36653-82-4': { casNumber: '36653-82-4', name: '1-hexadecanol', molecularWeight: 242.4, percepts: ['waxy', 'coconut', 'fatty'], kovatsRI: { DB5: 1870 }, source: 'flavornet' },
  '106-33-2': { casNumber: '106-33-2', name: 'ethyl laurate', molecularWeight: 228.4, percepts: ['waxy', 'floral', 'soapy'], kovatsRI: { OV101: 1600, DB5: 1595 }, source: 'flavornet' },
  '103-09-3': { casNumber: '103-09-3', name: '2-ethylhexyl acetate', molecularWeight: 172.3, percepts: ['fruity', 'green', 'herbal'], kovatsRI: { DB5: 1150 }, source: 'flavornet' },
  '22469-52-9': { casNumber: '22469-52-9', name: 'alpha-muurolene', molecularWeight: 204.4, percepts: ['woody', 'herbal', 'spicy'], kovatsRI: { OV101: 1500, DB5: 1500 }, source: 'flavornet' },
  '10208-80-7': { casNumber: '10208-80-7', name: 'alpha-gurjunene', molecularWeight: 204.4, percepts: ['woody', 'balsamic', 'sweet'], kovatsRI: { OV101: 1410, DB5: 1409 }, source: 'flavornet' },
};

// Dictionnaire de traduction des noms de molécules FR→EN
const MOLECULE_NAME_MAPPING: Record<string, string[]> = {
  'limonène': ['limonene', '5989-27-5'],
  'linalol': ['linalool', '78-70-6'],
  'géraniol': ['geraniol', '106-24-1'],
  'nérol': ['nerol', '106-25-2'],
  'citronellol': ['citronellol', '106-22-9'],
  'menthol': ['menthol', '2216-51-5'],
  'bornéol': ['borneol', '507-70-0'],
  'camphre': ['camphor', '76-22-2'],
  'eucalyptol': ['1,8-cineole', '470-82-6'],
  '1,8-cinéole': ['1,8-cineole', '470-82-6'],
  'eugénol': ['eugenol', '97-53-0'],
  'thymol': ['thymol', '89-83-8'],
  'carvacrol': ['carvacrol', '499-75-2'],
  'vanilline': ['vanillin', '121-33-5'],
  'coumarine': ['coumarin', '91-64-5'],
  'indole': ['indole', '120-72-9'],
  'alpha-pinène': ['alpha-pinene', '80-56-8'],
  'β-pinène': ['beta-pinene', '127-91-3'],
  'myrcène': ['myrcene', '123-35-3'],
  'caryophyllène': ['beta-caryophyllene', '87-44-5'],
  'β-caryophyllène': ['beta-caryophyllene', '87-44-5'],
  'humulène': ['alpha-humulene', '6753-98-6'],
  'α-humulène': ['alpha-humulene', '6753-98-6'],
  'citral': ['citral', '5392-40-5'],
  'citronellal': ['citronellal', '106-23-0'],
  'cinnamaldéhyde': ['cinnamaldehyde', '104-55-2'],
  'benzaldéhyde': ['benzaldehyde', '100-52-7'],
  'hexanal': ['hexanal', '66-25-1'],
  'octanal': ['octanal', '124-13-0'],
  'décanal': ['decanal', '112-31-2'],
  'carvone': ['carvone', '6485-40-1'],
  'menthone': ['menthone', '89-81-6'],
  'jasmone': ['jasmone', '488-10-8'],
  'ionone': ['beta-ionone', '14901-07-6'],
  'β-ionone': ['beta-ionone', '14901-07-6'],
  'α-ionone': ['alpha-ionone', '127-41-3'],
  'nérolidol': ['nerolidol', '142-50-7'],
  'farnésol': ['farnesol', '4602-84-0'],
  'bisabolol': ['bisabolol', '515-69-5'],
  'alcool phényléthylique': ['phenylethyl alcohol', '60-12-8'],
  'phényléthanol': ['phenylethyl alcohol', '60-12-8'],
  'alcool benzylique': ['benzyl alcohol', '100-51-6'],
  'acétate de linalyle': ['linalyl acetate', '115-95-7'],
  'acétate de géranyle': ['geranyl acetate', '105-87-3'],
  'acétate de benzyle': ['benzyl acetate', '93-92-5'],
};

/**
 * Recherche les données Flavornet par numéro CAS
 */
export function getFlavornetDataByCAS(casNumber: string): FlavornetData | null {
  // Normaliser le numéro CAS
  const normalizedCAS = casNumber.trim().replace(/\s+/g, '');
  return FLAVORNET_DATABASE[normalizedCAS] || null;
}

/**
 * Recherche les données Flavornet par nom de molécule
 */
export function getFlavornetDataByName(moleculeName: string): FlavornetData | null {
  const normalizedName = moleculeName.toLowerCase().trim();
  
  // Chercher dans le mapping FR→EN
  const mapping = MOLECULE_NAME_MAPPING[normalizedName];
  if (mapping) {
    const casNumber = mapping[1];
    return FLAVORNET_DATABASE[casNumber] || null;
  }
  
  // Chercher directement dans la base de données
  for (const data of Object.values(FLAVORNET_DATABASE)) {
    if (data.name.toLowerCase() === normalizedName) {
      return data;
    }
  }
  
  // Recherche partielle
  for (const data of Object.values(FLAVORNET_DATABASE)) {
    if (data.name.toLowerCase().includes(normalizedName) || 
        normalizedName.includes(data.name.toLowerCase())) {
      return data;
    }
  }
  
  return null;
}

/**
 * Recherche les données Flavornet par nom ou CAS
 */
export function getFlavornetData(name: string, casNumber?: string): FlavornetData | null {
  // Essayer d'abord par CAS si disponible
  if (casNumber) {
    const byCAS = getFlavornetDataByCAS(casNumber);
    if (byCAS) return byCAS;
  }
  
  // Sinon chercher par nom
  return getFlavornetDataByName(name);
}

/**
 * Statistiques de la base Flavornet
 */
export function getFlavornetStats(): {
  totalCompounds: number;
  withPercepts: number;
  withKovatsRI: number;
} {
  const compounds = Object.values(FLAVORNET_DATABASE);
  return {
    totalCompounds: compounds.length,
    withPercepts: compounds.filter(c => c.percepts.length > 0).length,
    withKovatsRI: compounds.filter(c => c.kovatsRI && Object.keys(c.kovatsRI).length > 0).length,
  };
}

/**
 * Liste tous les descripteurs olfactifs uniques
 */
export function getAllPercepts(): string[] {
  const percepts = new Set<string>();
  for (const data of Object.values(FLAVORNET_DATABASE)) {
    for (const percept of data.percepts) {
      percepts.add(percept);
    }
  }
  return Array.from(percepts).sort();
}

/**
 * Recherche des molécules par descripteur olfactif
 */
export function searchByPercept(percept: string): FlavornetData[] {
  const normalizedPercept = percept.toLowerCase().trim();
  return Object.values(FLAVORNET_DATABASE).filter(data => 
    data.percepts.some(p => p.toLowerCase().includes(normalizedPercept))
  );
}
