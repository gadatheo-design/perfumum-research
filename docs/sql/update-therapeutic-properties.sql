-- Enrichissement des propriétés thérapeutiques pour les 7 terpènes principaux

-- Myrcène (ID 1)
UPDATE molecules 
SET therapeuticProperties = 'Sédatif, relaxant musculaire, anti-inflammatoire, analgésique. Favorise le sommeil et réduit l''anxiété. Potentialise les effets du CBD.'
WHERE id = 1 AND name LIKE '%Myrc%';

-- Limonène (ID 2)
UPDATE molecules 
SET therapeuticProperties = 'Anxiolytique, antidépresseur, stimulant immunitaire, anti-inflammatoire. Améliore l''humeur et réduit le stress. Propriétés anticancéreuses potentielles.'
WHERE id = 2 AND name LIKE '%Limon%';

-- α-Pinène (ID 3)
UPDATE molecules 
SET therapeuticProperties = 'Bronchodilatateur, anti-inflammatoire, améliore la mémoire et la concentration. Antibactérien et antioxydant. Favorise la vigilance.'
WHERE id = 3 AND name LIKE '%Pinène%' OR name LIKE '%Pinene%';

-- β-Pinène (ID 4)
UPDATE molecules 
SET therapeuticProperties = 'Anti-inflammatoire, expectorant, bronchodilatateur. Améliore la respiration et réduit les inflammations. Propriétés antiseptiques.'
WHERE id = 4 AND name LIKE '%Pinène%' OR name LIKE '%Pinene%';

-- β-Caryophyllène (ID 5)
UPDATE molecules 
SET therapeuticProperties = 'Analgésique puissant, anti-inflammatoire, gastroprotecteur. Se lie aux récepteurs CB2. Réduit la douleur chronique et l''inflammation.'
WHERE id = 5 AND name LIKE '%Caryophyll%';

-- Linalool (ID 6)
UPDATE molecules 
SET therapeuticProperties = 'Anxiolytique, sédatif, analgésique, anti-convulsivant. Réduit l''anxiété et favorise la relaxation. Propriétés neuroprotectrices.'
WHERE id = 6 AND name LIKE '%Linalool%';

-- Humulène (ID 7)
UPDATE molecules 
SET therapeuticProperties = 'Anti-inflammatoire, antibactérien, coupe-faim. Propriétés anticancéreuses potentielles. Réduit les inflammations et les douleurs.'
WHERE id = 7 AND name LIKE '%Humul%';
