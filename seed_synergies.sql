-- Synergies Moléculaires - Données exemple
-- Basées sur les 8 tabacs enrichis et leurs profils olfactifs

-- Synergie 1: Burley + Pyrazines (potentialisation chocolat/fumé)
INSERT INTO synergies (name, tabac_id, molecule_id, famille_id, type, effet, notes)
VALUES (
  'Burley × Pyrazines : Amplification Chocolat Fumé',
  1, -- Burley
  NULL,
  NULL,
  'potentialisation',
  'Les pyrazines naturelles du Burley sont amplifiées par chauffage, créant une synergie puissante entre notes chocolatées et fumées. L''effet est multiplicatif plutôt qu''additif.',
  'Température optimale: 120-140°C. La synergie atteint son maximum à 130°C. Compatible avec accords minéraux et résineux.'
);

-- Synergie 2: Virginia Gold + Lactones (stabilisation miel/caramel)
INSERT INTO synergies (name, tabac_id, molecule_id, famille_id, type, effet, notes)
VALUES (
  'Virginia Gold × Lactones : Stabilisation Miellée',
  6, -- Virginia Gold
  NULL,
  NULL,
  'stabilisation',
  'Les lactones du Virginia Gold prolongent la durée des notes miellées et caramélisées. La synergie crée une rondeur stable qui persiste 30-40% plus longtemps.',
  'Base luxueuse pour compositions solaires. Les lactones (miel, caramel, coco) forment un complexe stable avec les aldéhydes doux.'
);

-- Synergie 3: Samsoun + Sesquiterpènes (transformation résine/encens)
INSERT INTO synergies (name, tabac_id, molecule_id, famille_id, type, effet, notes)
VALUES (
  'Samsoun × Sesquiterpènes : Transformation Balsamique',
  3, -- Samsoun
  NULL,
  NULL,
  'transformation',
  'Les sesquiterpènes du Samsoun se transforment en notes d''encens et de baume sacré. Création de nouvelles facettes mystiques absentes des composants individuels.',
  'Riche en cèdre et santal. Notes métalliques subtiles. Idéal pour compositions rituelles à 110-130°C.'
);

-- Synergie 4: Krumovgrad + Ionones (potentialisation florale)
INSERT INTO synergies (name, tabac_id, molecule_id, famille_id, type, effet, notes)
VALUES (
  'Krumovgrad × Ionones : Potentialisation Florale',
  2, -- Krumovgrad
  NULL,
  NULL,
  'potentialisation',
  'Les ionones (violet, iris) du tabac oriental bulgare sont amplifiées, créant un bouquet floral complexe. Synergie avec les lactones miellées pour une rondeur exceptionnelle.',
  'Profil floral et miellé. Excellente base pour accords floraux et résineux. Température: 90-110°C.'
);

-- Synergie 5: Virginia Bright + Aldéhydes (masquage notes vertes)
INSERT INTO synergies (name, tabac_id, molecule_id, famille_id, type, effet, notes)
VALUES (
  'Virginia Bright × Aldéhydes : Masquage Herbacé',
  4, -- Virginia Bright
  NULL,
  NULL,
  'masquage',
  'Les aldéhydes (foin coupé) masquent les notes vertes trop agressives tout en préservant la fraîcheur. Équilibre entre douceur sucrée et clarté herbacée.',
  'Base lumineuse. Apporte clarté sans amertume. Compatible avec compositions lactées et florales à 80-100°C.'
);

-- Synergie 6: Burley × Virginia Gold (potentialisation gourmande)
INSERT INTO synergies (name, tabac_id, molecule_id, famille_id, type, effet, notes)
VALUES (
  'Burley × Virginia Gold : Synergie Chocolat-Caramel',
  1, -- Burley
  NULL,
  NULL,
  'potentialisation',
  'Association puissante entre les pyrazines chocolatées du Burley et les lactones caramélisées du Virginia Gold. Crée un profil gourmand complexe et équilibré.',
  'Ratio optimal: 60% Burley / 40% Virginia Gold. Température: 110-130°C. Excellente structure pour accords gourmands.'
);

-- Synergie 7: Samsoun × Krumovgrad (transformation orientale)
INSERT INTO synergies (name, tabac_id, molecule_id, famille_id, type, effet, notes)
VALUES (
  'Samsoun × Krumovgrad : Transformation Orientale Complexe',
  3, -- Samsoun
  NULL,
  NULL,
  'transformation',
  'Fusion des profils turcs et bulgares créant une nouvelle signature orientale. Les sesquiterpènes résineux du Samsoun se combinent aux ionones florales du Krumovgrad.',
  'Profil unique: résine-floral-miellé. Notes d''encens fleuri. Idéal pour compositions mystiques et solaires.'
);

-- Synergie 8: Virginia Deutscher + Terpènes (stabilisation verte)
INSERT INTO synergies (name, tabac_id, molecule_id, famille_id, type, effet, notes)
VALUES (
  'Virginia Deutscher × Terpènes : Stabilisation Notes Vertes',
  5, -- Virginia Deutscher
  NULL,
  NULL,
  'stabilisation',
  'Les terpènes (vert, pin) du tabac allemand créent une structure stable et aérée. Prolonge la fraîcheur des notes vertes et résineuses.',
  'Profil sec et boisé. Excellente base pour accords verts et minéraux. Température: 85-105°C.'
);

-- Synergie 9: Virginia Orange + Esters (potentialisation hespéridée)
INSERT INTO synergies (name, tabac_id, molecule_id, famille_id, type, effet, notes)
VALUES (
  'Virginia Orange × Esters : Potentialisation Agrumes',
  8, -- Virginia Orange
  NULL,
  NULL,
  'potentialisation',
  'Les esters (orange, citron) sont amplifiés, créant une explosion d''agrumes lumineux. Synergie avec lactones (miel, pêche) pour une fraîcheur fruitée.',
  'Profil vibrant et fruité. Base pour compositions hespéridées et lactées. Température: 80-100°C.'
);

-- Synergie 10: Burley × Samsoun (transformation fumée-résine)
INSERT INTO synergies (name, tabac_id, molecule_id, famille_id, type, effet, notes)
VALUES (
  'Burley × Samsoun : Transformation Fumée Sacrée',
  1, -- Burley
  NULL,
  NULL,
  'transformation',
  'Association entre profils fumés (Burley) et résineux (Samsoun) créant une signature unique de fumée d''encens. Notes pyrogénées balsamiques.',
  'Ratio: 50/50. Température: 115-135°C. Idéal pour compositions rituelles et fumées. Notes métalliques subtiles.'
);

-- Synergie 11: Virginia Italia + Aldéhydes (stabilisation méditerranéenne)
INSERT INTO synergies (name, tabac_id, molecule_id, famille_id, type, effet, notes)
VALUES (
  'Virginia Italia × Aldéhydes : Stabilisation Solaire',
  7, -- Virginia Italia
  NULL,
  NULL,
  'stabilisation',
  'Les aldéhydes (foin chaud) stabilisent le caractère solaire et lumineux du tabac italien. Prolonge les notes herbacées aromatiques méditerranéennes.',
  'Profil herbacé et floral. Caractère solaire persistant. Compatible avec compositions méditerranéennes à 85-105°C.'
);

-- Synergie 12: Krumovgrad × Virginia Gold (potentialisation lactée)
INSERT INTO synergies (name, tabac_id, molecule_id, famille_id, type, effet, notes)
VALUES (
  'Krumovgrad × Virginia Gold : Potentialisation Miel-Fleur',
  2, -- Krumovgrad
  NULL,
  NULL,
  'potentialisation',
  'Synergie exceptionnelle entre ionones florales (Krumovgrad) et lactones miellées (Virginia Gold). Crée un profil floral-lacté d''une grande richesse.',
  'Ratio optimal: 40% Krumovgrad / 60% Virginia Gold. Température: 90-110°C. Base luxueuse pour accords floraux ambrés.'
);

-- Synergie 13: Virginia Bright × Virginia Orange (transformation hespéridée-lactée)
INSERT INTO synergies (name, tabac_id, molecule_id, famille_id, type, effet, notes)
VALUES (
  'Virginia Bright × Virginia Orange : Transformation Agrumes Doux',
  4, -- Virginia Bright
  NULL,
  NULL,
  'transformation',
  'Fusion des profils doux-sucré (Bright) et lumineux-fruité (Orange). Crée une nouvelle signature d''agrumes lactés absente des composants seuls.',
  'Profil unique: agrumes crémeux. Notes de foin miellé et orange douce. Température: 80-100°C.'
);

-- Synergie 14: Samsoun × Virginia Deutscher (masquage notes métalliques)
INSERT INTO synergies (name, tabac_id, molecule_id, famille_id, type, effet, notes)
VALUES (
  'Samsoun × Virginia Deutscher : Masquage Métallique',
  3, -- Samsoun
  NULL,
  NULL,
  'masquage',
  'Les terpènes verts du Virginia Deutscher masquent les notes métalliques du Samsoun tout en préservant son caractère résineux. Équilibre boisé-résineux.',
  'Ratio: 30% Samsoun / 70% Deutscher. Profil boisé-résineux équilibré. Température: 95-120°C.'
);

-- Synergie 15: Burley × Virginia Italia (stabilisation terreux-floral)
INSERT INTO synergies (name, tabac_id, molecule_id, famille_id, type, effet, notes)
VALUES (
  'Burley × Virginia Italia : Stabilisation Terre-Soleil',
  1, -- Burley
  NULL,
  NULL,
  'stabilisation',
  'Association entre profil terreux-fumé (Burley) et herbacé-floral (Italia). Stabilise les deux facettes créant un équilibre terre-soleil persistant.',
  'Ratio: 70% Burley / 30% Italia. Notes de cacao et foin méditerranéen. Température: 100-125°C.'
);
