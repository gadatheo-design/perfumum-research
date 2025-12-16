-- PERFUMUM: Import 100 Molecules (4 Groups)
-- Source: arch_2.txt - Complete molecular database
-- Groups: I. Terre/Minéral (20), II. Fumée/Pyrolysats (20), III. Botanique/Résine (20), IV. Lactones/Solaires (20)

-- GROUP I: Terre / Minéral / Argile (20 molecules)
INSERT INTO molecules (name, family, chemicalFormula, olfactiveProfile, functionalEffect, concentration) VALUES
('Géosmine', 'Minéral', 'C12H22O', 'terre humide, racine, pluie sombre', 'humidité', '0.002-0.003%'),
('2-MIB (2-Methylisoborneol)', 'Minéral', 'C11H20O', 'moisissure noble, pierre humide', 'humidité', '0.001%'),
('Sclerene', 'Minéral', 'C15H24', 'cave minérale, champignon sec', 'obscurité', '0.02%'),
('Kaolin accord', 'Minéral', 'Al2Si2O5(OH)4', 'argile blanche, céramique', 'sec', '0.05-0.07%'),
('Clay smoke', 'Pyrolysat', 'Complex', 'terre brûlée, céramique chauffée', 'feu', '0.04-0.07%'),
('Humus absolute', 'Minéral', 'Complex', 'sol forestier, sous-bois', 'humidité', '0.03%'),
('Fer volatil', 'Minéral', 'Fe-complex', 'métal mouillé, poussière ferrique', 'minéral', '0.02%'),
('Aluminium aldehyde', 'Aldéhyde', 'C10H20O', 'froid métallique, aluminium', 'froid', '0.03%'),
('Sulfur base', 'Minéral', 'S-complex', 'volcanique, soufre, pierre chaude', 'volcanique', '0.01%'),
('Myrrhone', 'Résinoïde', 'C15H20O', 'résine minérale, myrrhe', 'résine', '0.03%'),
('Bitume light', 'Minéral', 'Complex', 'matière antique mésopotamienne, asphalte', 'archéologique', '0.02%'),
('Sandstone accord', 'Minéral', 'SiO2-complex', 'pierre chaude, grès', 'soleil', '0.04%'),
('Calcite', 'Minéral', 'CaCO3', 'pierre froide, calcaire', 'froid', '0.03%'),
('Silicate aldehyde', 'Aldéhyde', 'C12H24O2', 'poussière tectonique, minéral', 'minéral', '0.02%'),
('Ambroxan', 'Ambre', 'C16H28O', 'minéral flottant, ambre gris', 'flottant', '0.05%'),
('Ambrettolide', 'Lactone', 'C16H28O2', 'textile + pierre, peau minérale', 'peau', '0.03%'),
('Ozone', 'Aldéhyde', 'O3', 'pluie électrique, orage', 'ionisation', '0.01%'),
('Fossile absolute', 'Lactone-Terre', 'Complex', 'fossile blanc, os ancien', 'archéologique', '0.04%'),
('Ionone β', 'Ionone', 'C13H20O', 'violette, papier, archive', 'archive', '0.02%'),
('Ionone γ', 'Ionone', 'C13H20O', 'poussière sèche, vieux livre', 'sec', '0.01%');

-- GROUP II: Fumée / Pyrolysats / Collagène (20 molecules)
INSERT INTO molecules (name, family, chemicalFormula, olfactiveProfile, functionalEffect, concentration) VALUES
('Guaiacol', 'Phénol', 'C7H8O2', 'fumée bois, tambours brûlés', 'fumée', '0.03%'),
('Créosote light', 'Phénol', 'C8H10O2', 'fumée sèche, bois carbonisé', 'fumée', '0.02%'),
('Phénols oxydés', 'Phénol', 'Complex', 'cendres, feu éteint', 'cendre', '0.02%'),
('Pyrazines', 'Pyrazine', 'C4H4N2', 'grillé, noisette, cacao', 'grillé', '0.03%'),
('Glycine pyrolysée', 'Pyrolysat', 'C2H5NO2', 'os carbonisé, bouillon sec', 'os', '0.03-0.05%'),
('Hydroxyproline pyrolysée', 'Pyrolysat', 'C5H9NO3', 'collagène brûlé, os blanchis', 'collagène', '0.03-0.06%'),
('Ammonium-Maillard', 'Pyrolysat', 'Complex', 'caramel brûlé, os qui chauffe', 'Maillard', '0.03%'),
('IBQ (Isobutyl quinoléine)', 'Quinoléine', 'C13H15N', 'cuir sombre, cuir Mossi', 'cuir', '0.03%'),
('IsoButyrate', 'Ester', 'C4H8O2', 'fromage, ferment', 'fermentation', '0.001%'),
('Hexanoic acid', 'Acide', 'C6H12O2', 'funky, cheesy', 'fermentation', '0.0005%'),
('Octanoic acid', 'Acide', 'C8H16O2', 'cheese tropical', 'fermentation', '0.0005%'),
('Decanoic acid', 'Acide', 'C10H20O2', 'gras lactonique', 'lactone', '0.001%'),
('2-heptanone', 'Cétone', 'C7H14O', 'banane verte, fromage sec', 'fermentation', '0.002%'),
('Skatole', 'Indole', 'C9H9N', 'animalité profonde, terre sacrée', 'animal', '0.0001-0.0005%'),
('Indole', 'Indole', 'C8H7N', 'fleur pourrie, jasmin noir, peau chaude', 'animal-floral', '0.0003-0.0004%'),
('Sandalore pyrolysé', 'Pyrolysat', 'C15H22O', 'bois fumé, santal brûlé', 'fumée', '0.02%'),
('Lignine pyrolysée', 'Pyrolysat', 'Complex', 'vieux parchemin, papier brûlé', 'archive', '0.02%'),
('Marrow accord', 'Pyrolysat', 'Complex', 'moelle osseuse', 'organique', '0.03%'),
('Bone-smoke accord', 'Pyrolysat', 'Complex', 'squelette brûlé, os fumé', 'os+fumée', '0.04%'),
('Dust-burn accord', 'Pyrolysat', 'Complex', 'poussière chaude, air brûlé', 'chaleur', '0.02%');

-- GROUP III: Botanique / Résine / Encens (20 molecules)
INSERT INTO molecules (name, family, chemicalFormula, olfactiveProfile, functionalEffect, concentration) VALUES
('Olibanum', 'Résinoïde', 'C20H32O2', 'encens clair, frankincense', 'sacré', '0.03-0.05%'),
('Myrrhe noire', 'Résinoïde', 'C15H20O', 'résine sombre, amère', 'sacré', '0.03-0.04%'),
('Mastic', 'Résinoïde', 'C10H16', 'résine méditerranéenne, pistachier', 'résine', '0.02%'),
('Labdanum', 'Résinoïde', 'C20H32O2', 'ambre noir, cuir végétal', 'ambre', '0.04%'),
('Elemi', 'Résinoïde', 'C15H24', 'frais-résine, citronné', 'frais', '0.02%'),
('Opoponax', 'Résinoïde', 'C15H24O', 'caramel sombre, myrrhe douce', 'doux', '0.03%'),
('Cedarol', 'Sesquiterpène', 'C15H26O', 'cèdre sec, bois noble', 'sec', '0.03%'),
('Humulène', 'Sesquiterpène', 'C15H24', 'houblon, mousse forestière', 'vert', '0.02%'),
('β-caryophyllène', 'Sesquiterpène', 'C15H24', 'épice chaude, poivre noir', 'épice', '0.03%'),
('Vetiverol', 'Sesquiterpène', 'C15H26O', 'terre humide verte, racine', 'terre', '0.04%'),
('Vetiveryl acetate', 'Ester', 'C17H28O2', 'propre vert, vétiver frais', 'propre', '0.02%'),
('Hinoki oil', 'Terpène', 'C10H16', 'temple japonais, cyprès', 'sacré', '0.02%'),
('Palo Santo lactone', 'Lactone', 'C15H24O2', 'doux sacré, bois saint', 'sacré', '0.03%'),
('Patchoulol', 'Sesquiterpène', 'C15H26O', 'sombre, terre humide', 'terre', '0.04%'),
('Tangerinol', 'Alcool', 'C10H18O', 'agrume sec, mandarine', 'agrume', '0.02%'),
('Limonène', 'Terpène', 'C10H16', 'zeste, citron frais', 'frais', '0.03%'),
('Linalol', 'Alcool', 'C10H18O', 'floral propre, lavande', 'propre', '0.03%'),
('Jasmonal', 'Aldéhyde', 'C11H16O', 'jasmin métallique, fleur verte', 'floral', '0.02%'),
('Nerol', 'Alcool', 'C10H18O', 'fleur, vert clair, rose', 'floral', '0.02%'),
('Ambrette seed', 'Lactone', 'C16H28O2', 'peau minérale, musc végétal', 'peau', '0.03%');

-- GROUP IV: Lactones / Solaires / Monoï (20 molecules)
INSERT INTO molecules (name, family, chemicalFormula, olfactiveProfile, functionalEffect, concentration) VALUES
('C14 lactone (γ-Tetradecalactone)', 'Lactone', 'C14H26O2', 'pêche, peau chaude', 'peau', '0.02%'),
('C18 lactone (γ-Octadecalactone)', 'Lactone', 'C18H34O2', 'coco, beurre végétal', 'lactone', '0.03%'),
('γ-dodecalactone', 'Lactone', 'C12H22O2', 'pêche laiteuse, abricot', 'lactone', '0.02%'),
('δ-dodecalactone', 'Lactone', 'C12H22O2', 'peau solaire douce, coco', 'solaire', '0.02%'),
('Benzyl salicylate', 'Salicylate', 'C14H12O3', 'solaire, floral, monoï', 'solaire', '0.04%'),
('Ethyl salicylate', 'Salicylate', 'C9H10O3', 'monoï, tiare, fleur tropicale', 'solaire', '0.03%'),
('Methyl salicylate', 'Salicylate', 'C8H8O3', 'wintergreen, menthe fraîche', 'frais', '0.02%'),
('Coumarin', 'Lactone', 'C9H6O2', 'foin coupé, doux', 'doux', '0.03%'),
('Vanilline', 'Aldéhyde', 'C8H8O3', 'vanille naturelle', 'doux', '0.02%'),
('Ethyl vanilline', 'Aldéhyde', 'C9H10O3', 'vanille intense, gourmand', 'doux', '0.02%'),
('Heliotropine (Piperonal)', 'Aldéhyde', 'C8H6O3', 'amande, héliotrope', 'doux', '0.02%'),
('Tonka absolute', 'Lactone', 'Complex', 'fève tonka, caramel', 'doux', '0.03%'),
('Benzoin Siam', 'Résinoïde', 'C14H12O2', 'vanille-résine, baumier', 'résine', '0.03%'),
('Styrax', 'Résinoïde', 'C9H8O2', 'ambre-vanille, storax', 'ambre', '0.03%'),
('Oud accord', 'Bois', 'Complex', 'bois précieux, animalité noble', 'bois', '0.04%'),
('Santalol (α+β)', 'Sesquiterpène', 'C15H24O', 'santal crémeux, bois lacté', 'crémeux', '0.04%'),
('Cedrol', 'Sesquiterpène', 'C15H26O', 'cèdre doux, bois sec', 'bois', '0.03%'),
('Iso E Super', 'Sesquiterpène', 'C16H26O', 'bois velouté, ambre synthétique', 'voile', '0.05%'),
('Cashmeran', 'Sesquiterpène', 'C14H22O', 'bois musqué, cachemire', 'musc', '0.04%'),
('Galaxolide', 'Lactone', 'C18H26O', 'musc blanc, propre', 'musc', '0.03%');
