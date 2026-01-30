-- Script d'enrichissement des molécules PERFUMUM
-- Données CAS, IUPAC et propriétés chimiques

-- Terpènes
UPDATE molecules SET 
  cas_number = '78-70-6', 
  iupac_name = '3,7-dimethylocta-1,6-dien-3-ol', 
  chemical_class = 'monoterpene',
  molecularWeight = 154,
  boilingPoint = 196
WHERE LOWER(name) = 'linalol' OR LOWER(name) = 'linalool';

UPDATE molecules SET 
  cas_number = '80-56-8', 
  iupac_name = '(1S,5S)-2,6,6-trimethylbicyclo[3.1.1]hept-2-ene', 
  chemical_class = 'monoterpene',
  molecularWeight = 136,
  boilingPoint = 156
WHERE LOWER(name) LIKE '%pinène%' OR LOWER(name) LIKE '%pinene%';

UPDATE molecules SET 
  cas_number = '138-86-3', 
  iupac_name = '1-methyl-4-(1-methylethenyl)cyclohexene', 
  chemical_class = 'monoterpene',
  molecularWeight = 136,
  boilingPoint = 176
WHERE LOWER(name) = 'limonène' OR LOWER(name) = 'limonene';

UPDATE molecules SET 
  cas_number = '123-35-3', 
  iupac_name = '7-methyl-3-methyleneocta-1,6-diene', 
  chemical_class = 'monoterpene',
  molecularWeight = 136,
  boilingPoint = 167
WHERE LOWER(name) = 'myrcène' OR LOWER(name) = 'myrcene';

UPDATE molecules SET 
  cas_number = '87-44-5', 
  iupac_name = '(1R,4E,9S)-4,11,11-trimethyl-8-methylenebicyclo[7.2.0]undec-4-ene', 
  chemical_class = 'sesquiterpene',
  molecularWeight = 204,
  boilingPoint = 262
WHERE LOWER(name) LIKE '%caryophyllène%' OR LOWER(name) LIKE '%caryophyllene%';

UPDATE molecules SET 
  cas_number = '6753-98-6', 
  iupac_name = '(1E,4E,8E)-2,6,6,9-tetramethylcycloundeca-1,4,8-triene', 
  chemical_class = 'sesquiterpene',
  molecularWeight = 204,
  boilingPoint = 166
WHERE LOWER(name) = 'humulène' OR LOWER(name) = 'humulene';

-- Géosmine (molécule du pétrichor)
UPDATE molecules SET 
  cas_number = '19700-21-1', 
  iupac_name = '(4S,4aS,8aR)-4,8a-dimethyl-1,2,3,4,5,6,7,8-octahydronaphthalen-4a-ol', 
  chemical_class = 'alcohol',
  molecularWeight = 182,
  boilingPoint = 270
WHERE LOWER(name) = 'géosmine' OR LOWER(name) = 'geosmin';

-- Ambroxan
UPDATE molecules SET 
  cas_number = '6790-58-5', 
  iupac_name = '(3aR,5aS,9aS,9bR)-3a,6,6,9a-tetramethyldodecahydronaphtho[2.1-b]furan', 
  chemical_class = 'ether',
  molecularWeight = 236,
  boilingPoint = 310
WHERE LOWER(name) = 'ambroxan';

-- Acides
UPDATE molecules SET 
  cas_number = '142-62-1', 
  iupac_name = 'hexanoic acid', 
  chemical_class = 'other',
  molecularWeight = 116,
  boilingPoint = 205
WHERE LOWER(name) LIKE '%hexanoic%' OR LOWER(name) LIKE '%hexanoïque%';

UPDATE molecules SET 
  cas_number = '124-07-2', 
  iupac_name = 'octanoic acid', 
  chemical_class = 'other',
  molecularWeight = 144,
  boilingPoint = 239
WHERE LOWER(name) LIKE '%octanoic%' OR LOWER(name) LIKE '%octanoïque%';

UPDATE molecules SET 
  cas_number = '334-48-5', 
  iupac_name = 'decanoic acid', 
  chemical_class = 'other',
  molecularWeight = 172,
  boilingPoint = 270
WHERE LOWER(name) LIKE '%décanoic%' OR LOWER(name) LIKE '%decanoïque%';

UPDATE molecules SET 
  cas_number = '60-33-3', 
  iupac_name = '(9Z,12Z)-octadeca-9,12-dienoic acid', 
  chemical_class = 'other',
  molecularWeight = 280,
  boilingPoint = 230
WHERE LOWER(name) LIKE '%linoléique%' OR LOWER(name) LIKE '%linoleic%';

UPDATE molecules SET 
  cas_number = '112-80-1', 
  iupac_name = '(9Z)-octadec-9-enoic acid', 
  chemical_class = 'other',
  molecularWeight = 282,
  boilingPoint = 360
WHERE LOWER(name) LIKE '%oléique%' OR LOWER(name) LIKE '%oleic%';

UPDATE molecules SET 
  cas_number = '65-85-0', 
  iupac_name = 'benzoic acid', 
  chemical_class = 'aromatic',
  molecularWeight = 122,
  boilingPoint = 249
WHERE LOWER(name) LIKE '%benzoïque%' OR LOWER(name) LIKE '%benzoic%';

UPDATE molecules SET 
  cas_number = '140-10-3', 
  iupac_name = '(E)-3-phenylprop-2-enoic acid', 
  chemical_class = 'aromatic',
  molecularWeight = 148,
  boilingPoint = 300
WHERE LOWER(name) LIKE '%cinnamique%' OR LOWER(name) LIKE '%cinnamic%';

UPDATE molecules SET 
  cas_number = '331-39-5', 
  iupac_name = '(E)-3-(3,4-dihydroxyphenyl)prop-2-enoic acid', 
  chemical_class = 'phenol',
  molecularWeight = 180,
  boilingPoint = 223
WHERE LOWER(name) LIKE '%caféique%' OR LOWER(name) LIKE '%caffeic%';

-- Phénols
UPDATE molecules SET 
  cas_number = '97-53-0', 
  iupac_name = '4-allyl-2-methoxyphenol', 
  chemical_class = 'phenol',
  molecularWeight = 164,
  boilingPoint = 254
WHERE LOWER(name) = 'eugénol' OR LOWER(name) = 'eugenol';

UPDATE molecules SET 
  cas_number = '89-83-8', 
  iupac_name = '2-isopropyl-5-methylphenol', 
  chemical_class = 'phenol',
  molecularWeight = 150,
  boilingPoint = 233
WHERE LOWER(name) = 'thymol';

UPDATE molecules SET 
  cas_number = '499-75-2', 
  iupac_name = '5-isopropyl-2-methylphenol', 
  chemical_class = 'phenol',
  molecularWeight = 150,
  boilingPoint = 238
WHERE LOWER(name) = 'carvacrol';

-- Alcools
UPDATE molecules SET 
  cas_number = '106-24-1', 
  iupac_name = '(E)-3,7-dimethylocta-2,6-dien-1-ol', 
  chemical_class = 'alcohol',
  molecularWeight = 154,
  boilingPoint = 230
WHERE LOWER(name) = 'géraniol' OR LOWER(name) = 'geraniol';

UPDATE molecules SET 
  cas_number = '106-25-2', 
  iupac_name = '(Z)-3,7-dimethylocta-2,6-dien-1-ol', 
  chemical_class = 'alcohol',
  molecularWeight = 154,
  boilingPoint = 225
WHERE LOWER(name) = 'nérol' OR LOWER(name) = 'nerol';

UPDATE molecules SET 
  cas_number = '106-22-9', 
  iupac_name = '3,7-dimethyloct-6-en-1-ol', 
  chemical_class = 'alcohol',
  molecularWeight = 156,
  boilingPoint = 225
WHERE LOWER(name) = 'citronellol';

UPDATE molecules SET 
  cas_number = '89-78-1', 
  iupac_name = '(1R,2S,5R)-2-isopropyl-5-methylcyclohexanol', 
  chemical_class = 'alcohol',
  molecularWeight = 156,
  boilingPoint = 212
WHERE LOWER(name) = 'menthol';

UPDATE molecules SET 
  cas_number = '470-82-6', 
  iupac_name = '1,3,3-trimethyl-2-oxabicyclo[2.2.2]octane', 
  chemical_class = 'ether',
  molecularWeight = 154,
  boilingPoint = 176
WHERE LOWER(name) = 'eucalyptol' OR LOWER(name) LIKE '%cinéole%';

-- Aldéhydes
UPDATE molecules SET 
  cas_number = '5392-40-5', 
  iupac_name = '3,7-dimethylocta-2,6-dienal', 
  chemical_class = 'aldehyde',
  molecularWeight = 152,
  boilingPoint = 229
WHERE LOWER(name) = 'citral';

UPDATE molecules SET 
  cas_number = '106-23-0', 
  iupac_name = '3,7-dimethyloct-6-enal', 
  chemical_class = 'aldehyde',
  molecularWeight = 154,
  boilingPoint = 207
WHERE LOWER(name) = 'citronellal';

-- Cétones
UPDATE molecules SET 
  cas_number = '99-49-0', 
  iupac_name = '2-methyl-5-(1-methylethenyl)cyclohex-2-en-1-one', 
  chemical_class = 'ketone',
  molecularWeight = 150,
  boilingPoint = 231
WHERE LOWER(name) = 'carvone';

UPDATE molecules SET 
  cas_number = '89-80-5', 
  iupac_name = '(2S,5R)-2-isopropyl-5-methylcyclohexanone', 
  chemical_class = 'ketone',
  molecularWeight = 154,
  boilingPoint = 207
WHERE LOWER(name) = 'menthone';

-- Esters
UPDATE molecules SET 
  cas_number = '115-95-7', 
  iupac_name = '3,7-dimethylocta-1,6-dien-3-yl acetate', 
  chemical_class = 'ester',
  molecularWeight = 196,
  boilingPoint = 220
WHERE LOWER(name) LIKE '%linalyle%' OR LOWER(name) LIKE '%linalyl%';

UPDATE molecules SET 
  cas_number = '105-87-3', 
  iupac_name = '(E)-3,7-dimethylocta-2,6-dien-1-yl acetate', 
  chemical_class = 'ester',
  molecularWeight = 196,
  boilingPoint = 245
WHERE LOWER(name) LIKE '%géranyle%' OR LOWER(name) LIKE '%geranyl%';

-- Molécules spéciales parfumerie
UPDATE molecules SET 
  cas_number = '54464-57-2', 
  iupac_name = '1-(2,3,8,8-tetramethyl-1,2,3,4,5,6,7,8-octahydronaphthalen-2-yl)ethanone', 
  chemical_class = 'ketone',
  molecularWeight = 234,
  boilingPoint = 290
WHERE LOWER(name) = 'iso e super';

UPDATE molecules SET 
  cas_number = '24851-98-7', 
  iupac_name = 'methyl 3-oxo-2-pentylcyclopentaneacetate', 
  chemical_class = 'ester',
  molecularWeight = 226,
  boilingPoint = 280
WHERE LOWER(name) = 'hedione';

UPDATE molecules SET 
  cas_number = '1222-05-5', 
  iupac_name = '1,3,4,6,7,8-hexahydro-4,6,6,7,8,8-hexamethylcyclopenta[g]-2-benzopyran', 
  chemical_class = 'musk',
  molecularWeight = 258,
  boilingPoint = 327
WHERE LOWER(name) = 'galaxolide';

