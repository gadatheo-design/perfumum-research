-- Script SQL pour mettre à jour les formules chimiques manquantes
-- Exécuté via webdev_execute_sql

-- Monoterpènes (C10H16)
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆' WHERE name LIKE '%Limonène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆' WHERE name LIKE '%Limonene%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆' WHERE name LIKE '%Pinène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆' WHERE name LIKE '%Pinene%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆' WHERE name LIKE '%Myrcène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆' WHERE name LIKE '%Myrcene%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆' WHERE name LIKE '%Terpinolène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆' WHERE name LIKE '%Ocimène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆' WHERE name LIKE '%Camphène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆' WHERE name LIKE '%Carène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆' WHERE name LIKE '%Sabinène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆' WHERE name LIKE '%Terpinène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆' WHERE name LIKE '%Phellandrène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');

-- Monoterpènes oxygénés
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₈O' WHERE name LIKE '%Linalol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₈O' WHERE name LIKE '%Linalool%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₈O' WHERE name LIKE '%Géraniol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₈O' WHERE name LIKE '%Geraniol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₈O' WHERE name LIKE '%Nérol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₂₀O' WHERE name LIKE '%Citronellol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₈O' WHERE name LIKE '%Terpinéol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₈O' WHERE name LIKE '%Terpineol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₂₀O' WHERE name LIKE '%Menthol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₈O' WHERE name LIKE '%Eucalyptol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₈O' WHERE name LIKE '%Cinéole%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₈O' WHERE name LIKE '%Cineole%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₈O' WHERE name LIKE '%Bornéol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₈O' WHERE name LIKE '%Borneol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆O' WHERE name LIKE '%Camphre%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆O' WHERE name LIKE '%Camphor%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₈O' WHERE name LIKE '%Fenchol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆O' WHERE name LIKE '%Fenchone%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₈O' WHERE name LIKE '%Isopulégol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆O' WHERE name LIKE '%Thujone%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆O' WHERE name LIKE '%Pulegone%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₄O' WHERE name LIKE '%Carvone%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆O' WHERE name LIKE '%Citral%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₈O' WHERE name LIKE '%Citronellal%' AND (chemicalFormula IS NULL OR chemicalFormula = '');

-- Sesquiterpènes (C15H24)
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄' WHERE name LIKE '%Caryophyllène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄' WHERE name LIKE '%Caryophyllene%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄' WHERE name LIKE '%Humulène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄' WHERE name LIKE '%Humulene%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₆O' WHERE name LIKE '%Bisabolol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄' WHERE name LIKE '%Bisabolène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄' WHERE name LIKE '%Farnesène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₆O' WHERE name LIKE '%Farnesol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₆O' WHERE name LIKE '%Nérolidol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₆O' WHERE name LIKE '%Nerolidol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₆O' WHERE name LIKE '%Guaiol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄' WHERE name LIKE '%Valencène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄' WHERE name LIKE '%Sélinène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄' WHERE name LIKE '%Cadinène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄' WHERE name LIKE '%Cédrène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₆O' WHERE name LIKE '%Cédrol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₆O' WHERE name LIKE '%Cedrol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₆O' WHERE name LIKE '%Patchoulol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄O' WHERE name LIKE '%Santalol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄' WHERE name LIKE '%Zingibérène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄' WHERE name LIKE '%Germacrène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₆O' WHERE name LIKE '%Eudesmol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄' WHERE name LIKE '%Elemène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄' WHERE name LIKE '%Copaène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄' WHERE name LIKE '%Bergamotène%' AND (chemicalFormula IS NULL OR chemicalFormula = '');

-- Aldéhydes
UPDATE molecules SET chemicalFormula = 'C₇H₆O' WHERE name LIKE '%Benzaldéhyde%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₇H₆O' WHERE name LIKE '%Benzaldehyde%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₉H₈O' WHERE name LIKE '%Cinnamaldéhyde%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₈H₈O₃' WHERE name LIKE '%Vanilline%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₈H₆O₃' WHERE name LIKE '%Héliotropine%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₈H₆O₃' WHERE name LIKE '%Pipéronal%' AND (chemicalFormula IS NULL OR chemicalFormula = '');

-- Cétones
UPDATE molecules SET chemicalFormula = 'C₁₃H₂₀O' WHERE name LIKE '%Ionone%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₃H₂₀O' WHERE name LIKE '%Damascone%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₃H₁₈O' WHERE name LIKE '%Damascénone%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₄H₂₂O' WHERE name LIKE '%Irone%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₁H₁₆O' WHERE name LIKE '%Jasmone%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₆H₃₀O' WHERE name LIKE '%Muscone%' AND (chemicalFormula IS NULL OR chemicalFormula = '');

-- Phénols
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₂O₂' WHERE name LIKE '%Eugénol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₂O₂' WHERE name LIKE '%Eugenol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₄O' WHERE name LIKE '%Thymol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₄O' WHERE name LIKE '%Carvacrol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₂O' WHERE name LIKE '%Anéthol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₂O' WHERE name LIKE '%Anethole%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₂O' WHERE name LIKE '%Estragole%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₀O₂' WHERE name LIKE '%Safrol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');

-- Lactones et coumarines
UPDATE molecules SET chemicalFormula = 'C₉H₆O₂' WHERE name LIKE '%Coumarine%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₉H₆O₂' WHERE name LIKE '%Coumarin%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₆H₂₈O' WHERE name LIKE '%Ambroxide%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₆H₂₈O' WHERE name LIKE '%Ambrox%' AND (chemicalFormula IS NULL OR chemicalFormula = '');

-- Muscs synthétiques
UPDATE molecules SET chemicalFormula = 'C₁₈H₂₆O' WHERE name LIKE '%Galaxolide%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₄H₂₂O' WHERE name LIKE '%Cashmeran%' AND (chemicalFormula IS NULL OR chemicalFormula = '');

-- Molécules spéciales
UPDATE molecules SET chemicalFormula = 'C₁₂H₂₂O' WHERE name LIKE '%Géosmine%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₂H₂₂O' WHERE name LIKE '%Geosmin%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₈H₇N' WHERE name LIKE '%Indole%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₉H₉N' WHERE name LIKE '%Skatole%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₆H₂₆O' WHERE name LIKE '%Iso E Super%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₃H₂₂O₃' WHERE name LIKE '%Hedione%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₆H₂₈O' WHERE name LIKE '%Ambroxan%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₆H₂₈O' WHERE name LIKE '%Cetalox%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₁H₁₂O₃' WHERE name LIKE '%Calone%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₁H₁₄O₃' WHERE name LIKE '%Helional%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₂₀O₂' WHERE name LIKE '%Hydroxycitronellal%' AND (chemicalFormula IS NULL OR chemicalFormula = '');

-- Esters
UPDATE molecules SET chemicalFormula = 'C₁₂H₂₀O₂' WHERE name LIKE '%Acétate de linalyle%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₂H₂₀O₂' WHERE name LIKE '%Linalyl acetate%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₂H₂₀O₂' WHERE name LIKE '%Acétate de géranyle%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₉H₁₀O₂' WHERE name LIKE '%Acétate de benzyle%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₄H₁₂O₂' WHERE name LIKE '%Benzoate de benzyle%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₄H₁₂O₃' WHERE name LIKE '%Salicylate de benzyle%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₈H₈O₃' WHERE name LIKE '%Salicylate de méthyle%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₈H₉NO₂' WHERE name LIKE '%Anthranilate de méthyle%' AND (chemicalFormula IS NULL OR chemicalFormula = '');

-- Vétiver et dérivés
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₆O' WHERE name LIKE '%Vétiver%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₆O' WHERE name LIKE '%Vetiver%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₅H₂₄O' WHERE name LIKE '%Khusimol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');

-- Autres alcools terpéniques
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₈O' WHERE name LIKE '%Isobornéol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₄O' WHERE name LIKE '%Verbénone%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆O' WHERE name LIKE '%Myrténol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₁₆O' WHERE name LIKE '%Carvéol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₁₀H₂₀O' WHERE name LIKE '%Dihydromyrcénol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');

-- Diterpènes
UPDATE molecules SET chemicalFormula = 'C₂₀H₄₀O' WHERE name LIKE '%Phytol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₂₀H₃₆O₂' WHERE name LIKE '%Sclaréol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
UPDATE molecules SET chemicalFormula = 'C₂₀H₃₆O₂' WHERE name LIKE '%Sclareol%' AND (chemicalFormula IS NULL OR chemicalFormula = '');
