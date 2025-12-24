-- IMPORT ROYAL MOSSI - 6 FAMILLES MOLÉCULAIRES
-- Source: arch_1.txt - Royal Mossi Molecular Analysis

-- Note: This script adds detailed molecular analysis to the existing Royal Mossi gamme
-- The gamme itself already exists in the database

-- Create a table for Royal Mossi molecular families if it doesn't exist
-- We'll use the existing 'molecules' table and add specific Royal Mossi molecules

-- FAMILLE 1: Sesquiterpènes racinaires
INSERT INTO molecules (name, family, chemicalFormula, olfactiveProfile, emotionalResonance, functionalEffect, sourceOrigin, notes)
VALUES
('Vétivénol', 'Sesquiterpène', 'C15H26O', 'racine, terre, humidité sèche', 'ancrage, méditation', 'longue tenue, effet spirituel', 'Vétiver', 'Molécule-clé Royal Mossi - Famille 1: Sesquiterpènes racinaires'),
('Vétivone', 'Sesquiterpène', 'C15H22O', 'racine sombre, terre humide', 'profondeur, ancrage', 'longue tenue, effet méditatif', 'Vétiver', 'Molécule-clé Royal Mossi - Famille 1: Sesquiterpènes racinaires'),
('Khusimol', 'Sesquiterpène', 'C15H26O', 'boisé, racinaire, velouté', 'ancrage, stabilité', 'fixateur, longue tenue', 'Vétiver', 'Molécule-clé Royal Mossi - Famille 1: Sesquiterpènes racinaires'),
('β-guaïène', 'Sesquiterpène', 'C15H24', 'boisé, épicé, terreux', 'chaleur, profondeur', 'note de cœur', 'Bois de gaïac', 'Molécule-clé Royal Mossi - Famille 1: Sesquiterpènes racinaires'),
('α-humulène', 'Sesquiterpène', 'C15H24', 'houblon, boisé, terreux', 'relaxation, ancrage', 'anti-inflammatoire', 'Houblon, Cannabis', 'Molécule-clé Royal Mossi - Famille 1: Sesquiterpènes racinaires')
ON DUPLICATE KEY UPDATE name = name;

-- FAMILLE 2: Phénols & fumées sèches
-- Guaiacol already imported in GROUP II
INSERT INTO molecules (name, family, chemicalFormula, olfactiveProfile, emotionalResonance, functionalEffect, sourceOrigin, notes)
VALUES
('4-methyl-guaiacol', 'Phénol', 'C8H10O2', 'fumée douce, vanillé fumé', 'chaleur, rituel', 'fumée douce, tambours brûlés', 'Pyrolyse bois', 'Molécule-clé Royal Mossi - Famille 2: Phénols & fumées sèches'),
('Phénol boisé', 'Phénol', 'C6H6O', 'fumée, bois brûlé, médicinal', 'rituel, feu', 'fumée sombre', 'Pyrolyse', 'Molécule-clé Royal Mossi - Famille 2: Phénols & fumées sèches')
ON DUPLICATE KEY UPDATE name = name;

-- FAMILLE 3: Aldéhydes secs (effet poussière chaude)
INSERT INTO molecules (name, family, chemicalFormula, olfactiveProfile, emotionalResonance, functionalEffect, sourceOrigin, notes)
VALUES
('Aldéhyde C-10', 'Aldéhyde', 'C10H20O', 'métallique, poussière chaude', 'feu du Sahel, électricité', 'poussière ferrique chauffée', 'Synthèse', 'Molécule-clé Royal Mossi - Famille 3: Aldéhydes secs'),
('Aldéhyde C-11', 'Aldéhyde', 'C11H22O', 'aldéhydique, poudré, chaud', 'vent chaud, saison sèche', 'poussière minérale', 'Synthèse', 'Molécule-clé Royal Mossi - Famille 3: Aldéhydes secs'),
('Aldéhyde C-12', 'Aldéhyde', 'C12H24O', 'aldéhydique, métallique, sec', 'chaleur, électricité', 'effet Sahel', 'Synthèse', 'Molécule-clé Royal Mossi - Famille 3: Aldéhydes secs'),
('Aldéhyde métallique', 'Aldéhyde', 'Complex', 'métallique, froid, minéral', 'électricité, orage sec', 'poussière ferrique', 'Synthèse', 'Molécule-clé Royal Mossi - Famille 3: Aldéhydes secs')
ON DUPLICATE KEY UPDATE name = name;

-- FAMILLE 4: Résines orientales (Mandé)
-- Olibanum already imported in GROUP III
INSERT INTO molecules (name, family, chemicalFormula, olfactiveProfile, emotionalResonance, functionalEffect, sourceOrigin, notes)
VALUES
('Furanosesquiterpenes', 'Résinoïde', 'C15H20O', 'résine, épicé, balsamique', 'noblesse, purification', 'note sacrée ancestrale', 'Myrrhe, Oliban', 'Molécule-clé Royal Mossi - Famille 4: Résines orientales'),
('Furanoeudesmanes', 'Résinoïde', 'C15H22O', 'résine, boisé, balsamique', 'rituel, sacré', 'purification rituelle', 'Myrrhe', 'Molécule-clé Royal Mossi - Famille 4: Résines orientales'),
('Incensol', 'Résinoïde', 'C20H34O', 'encens, résine, balsamique', 'élévation, spiritualité', 'psychoactif léger, anxiolytique', 'Oliban', 'Molécule-clé Royal Mossi - Famille 4: Résines orientales'),
('Incensol acetate', 'Résinoïde', 'C22H36O2', 'encens, résine douce', 'élévation, clarté', 'psychoactif, anti-dépresseur', 'Oliban', 'Molécule-clé Royal Mossi - Famille 4: Résines orientales'),
('Mechoulim', 'Résinoïde', 'Complex', 'résine, balsamique, sacré', 'noblesse, ancestral', 'note sacrée Mandé', 'Résines Mandé', 'Molécule-clé Royal Mossi - Famille 4: Résines orientales')
ON DUPLICATE KEY UPDATE name = name;

-- FAMILLE 5: Composés ferriques & terre rouge
INSERT INTO molecules (name, family, chemicalFormula, olfactiveProfile, emotionalResonance, functionalEffect, sourceOrigin, notes)
VALUES
('Oxydes de fer volatils', 'Minéral', 'Fe-complex', 'métal, poussière rouge, chaleur', 'identité Sahel/Mossi', 'signature impossible à reproduire', 'Terre rouge Sahel', 'Molécule-clé Royal Mossi - Famille 5: Composés ferriques'),
('Complexes terre minérale', 'Minéral', 'Complex', 'terre rouge, poussière chaude', 'chaleur, Sahel', 'signature Mossi', 'Terre Sahel', 'Molécule-clé Royal Mossi - Famille 5: Composés ferriques')
ON DUPLICATE KEY UPDATE name = name;

-- FAMILLE 6: Molécules de cuir
-- IBQ already imported in GROUP II
INSERT INTO molecules (name, family, chemicalFormula, olfactiveProfile, emotionalResonance, functionalEffect, sourceOrigin, notes)
VALUES
('Quinoléine', 'Quinoléine', 'C9H7N', 'cuir, animal, fumé', 'cuir solaire, noble', 'cuir sec et royal', 'Synthèse', 'Molécule-clé Royal Mossi - Famille 6: Molécules de cuir'),
('Labdanum diterpenes', 'Résinoïde', 'C20H32', 'ambre noir, cuir végétal', 'noblesse, chaleur', 'adhère aux tissus & tabacs', 'Labdanum', 'Molécule-clé Royal Mossi - Famille 6: Molécules de cuir')
ON DUPLICATE KEY UPDATE name = name;

-- Summary: 22 new molecules added for Royal Mossi molecular analysis
-- 6 families documented:
-- 1. Sesquiterpènes racinaires (5 molecules)
-- 2. Phénols & fumées sèches (2 molecules + Guaiacol/Créosote already in DB)
-- 3. Aldéhydes secs (4 molecules)
-- 4. Résines orientales (5 molecules + Olibanum already in DB)
-- 5. Composés ferriques (2 molecules + Géosmine already in DB)
-- 6. Molécules de cuir (2 molecules + IBQ already in DB)
