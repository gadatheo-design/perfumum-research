-- Add 25 new synergies between tabacs and molecules
-- Based on olfactive profiles and chemical families

-- Burley × Molecules (earthy, nutty, cocoa)
INSERT INTO synergies (name, type, effet, notes, tabacId, tabacName, moleculeId, createdAt) VALUES
('Burley × α-Pinène', 'potentialisation', 'Amplifie notes boisées et résineuses', 'Synergie forte avec profil terreux du Burley', 1, 'Burley', 1, NOW()),
('Burley × Linalool', 'stabilisation', 'Stabilise notes florales douces', 'Adoucit le profil terreux', 1, 'Burley', 5, NOW()),
('Burley × Caryophyllène', 'potentialisation', 'Renforce notes épicées et boisées', 'Synergie naturelle avec tabac brun', 1, 'Burley', 3, NOW());

-- Virginia × Molecules (sweet, hay, citrus)
INSERT INTO synergies (name, type, effet, notes, tabacId, tabacName, moleculeId, createdAt) VALUES
('Virginia × Limonène', 'potentialisation', 'Amplifie notes citriques et fraîches', 'Synergie excellente avec sucrosité naturelle', 2, 'Virginia', 2, NOW()),
('Virginia × Géraniol', 'transformation', 'Transforme profil vers floral-rosé', 'Crée complexité florale', 2, 'Virginia', 6, NOW()),
('Virginia × Myrcène', 'stabilisation', 'Stabilise notes herbacées et foin', 'Maintient caractère naturel', 2, 'Virginia', 4, NOW());

-- Oriental × Molecules (spicy, incense, resinous)
INSERT INTO synergies (name, type, effet, notes, tabacId, tabacName, moleculeId, createdAt) VALUES
('Oriental × Eugénol', 'potentialisation', 'Amplifie notes épicées clou de girofle', 'Synergie puissante avec profil oriental', 3, 'Oriental', 7, NOW()),
('Oriental × β-Caryophyllène', 'potentialisation', 'Renforce notes boisées épicées', 'Synergie naturelle avec tabac oriental', 3, 'Oriental', 3, NOW()),
('Oriental × Cinnamaldéhyde', 'transformation', 'Ajoute dimension cannelle chaude', 'Transforme vers profil plus épicé', 3, 'Oriental', 9, NOW());

-- Latakia × Molecules (smoky, leather, campfire)
INSERT INTO synergies (name, type, effet, notes, tabacId, tabacName, moleculeId, createdAt) VALUES
('Latakia × Guaiacol', 'potentialisation', 'Amplifie notes fumées et cuir', 'Synergie intense avec caractère fumé', 4, 'Latakia', 10, NOW()),
('Latakia × Vétivérol', 'stabilisation', 'Stabilise notes terreuses et fumées', 'Ancre le profil fumé', 4, 'Latakia', 11, NOW()),
('Latakia × Phénol', 'transformation', 'Ajoute dimension médicinale fumée', 'Transforme vers profil plus radical', 4, 'Latakia', 12, NOW());

-- Perique × Molecules (peppery, fruity, fermented)
INSERT INTO synergies (name, type, effet, notes, tabacId, tabacName, moleculeId, createdAt) VALUES
('Perique × Pipérine', 'potentialisation', 'Amplifie notes poivrées piquantes', 'Synergie parfaite avec caractère poivré', 5, 'Perique', 13, NOW()),
('Perique × Acétate de benzyle', 'stabilisation', 'Stabilise notes fruitées fermentées', 'Maintient profil fruité', 5, 'Perique', 14, NOW()),
('Perique × Acide butyrique', 'transformation', 'Renforce dimension fermentée', 'Transforme vers profil plus animal', 5, 'Perique', 15, NOW());

-- Cavendish × Molecules (vanilla, caramel, sweet)
INSERT INTO synergies (name, type, effet, notes, tabacId, tabacName, moleculeId, createdAt) VALUES
('Cavendish × Vanilline', 'potentialisation', 'Amplifie notes vanillées sucrées', 'Synergie naturelle avec caramélisation', 6, 'Cavendish', 16, NOW()),
('Cavendish × Coumarine', 'transformation', 'Ajoute dimension foin coupé sucré', 'Transforme vers profil plus complexe', 6, 'Cavendish', 17, NOW()),
('Cavendish × Maltol', 'potentialisation', 'Renforce notes caramel sucre brûlé', 'Synergie forte avec traitement', 6, 'Cavendish', 18, NOW());

-- Turkish × Molecules (floral, aromatic, complex)
INSERT INTO synergies (name, type, effet, notes, tabacId, tabacName, moleculeId, createdAt) VALUES
('Turkish × Nérol', 'potentialisation', 'Amplifie notes florales roses', 'Synergie excellente avec profil aromatique', 7, 'Turkish', 19, NOW()),
('Turkish × Linalyl acétate', 'stabilisation', 'Stabilise notes lavande florales', 'Maintient complexité aromatique', 7, 'Turkish', 20, NOW()),
('Turkish × α-Terpinéol', 'transformation', 'Ajoute dimension pin floral', 'Transforme vers profil plus résineux', 7, 'Turkish', 21, NOW());

-- Kentucky × Molecules (fire-cured, intense, smoky)
INSERT INTO synergies (name, type, effet, notes, tabacId, tabacName, moleculeId, createdAt) VALUES
('Kentucky × Créosol', 'potentialisation', 'Amplifie notes fumées intenses', 'Synergie puissante avec séchage au feu', 8, 'Kentucky', 22, NOW()),
('Kentucky × Syringol', 'stabilisation', 'Stabilise notes boisées fumées', 'Ancre le profil fire-cured', 8, 'Kentucky', 23, NOW()),
('Kentucky × 4-Méthylguaiacol', 'transformation', 'Ajoute dimension bacon fumé', 'Transforme vers profil plus animal', 8, 'Kentucky', 24, NOW());
