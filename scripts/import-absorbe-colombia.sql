-- ============================================================================
-- Import des données ABSORBE · COLOMBIA
-- ============================================================================

-- 1. ÉTUDES CLIMATIQUES
-- ============================================================================

INSERT INTO climate_studies (
  name, collection, axis, concept, zone, altitude, climate, key_moment,
  attack_description, heart_description, base_description, observed_supports,
  absorbe_reading, threshold_odor, recommended_tests,
  head_translation, heart_translation, base_translation, ethical_position, status
) VALUES
(
  'Petrichor Andin — Odeur de seuil',
  'COLOMBIA · Humidity Studies',
  'Petrichor',
  'Odeurs situées liées à l''humidité tropicale. Pas d''exotisme. Pas de fétichisation de la matière. Traduction olfactive uniquement.',
  'Andes / Altiplano',
  '2500–3000 m',
  'Pluie courte, air froid, évaporation rapide',
  'Juste après la pluie, avant le soleil',
  'Air froid, ozone doux, humidité métallique',
  'Terre minérale, pierre mouillée, humus discret (jamais sucré)',
  'Sécheresse rapide, poussière propre, silence olfactif',
  '["pierre volcanique", "terre tassée urbaine", "feuilles larges humides", "murs minéraux"]',
  'Le petrichor andin n''est pas une odeur de forêt, mais une odeur de transition : entre pluie et soleil, entre ville et montagne, entre corps chaud et air froid. Odeur de seuil, pas de refuge.',
  'yes',
  '[{"name": "Test A — Terre humide", "method": "Terre + alcool 95%", "duration": "24–48 h", "result": "Filtration légère"}, {"name": "Test B — Pierre mouillée", "method": "Pierre propre + alcool", "duration": "Agitation manuelle", "result": "Résultat très subtil (trace)"}]',
  'Ozone / air froid',
  'Minéral humide',
  'Poussière sèche',
  'Ce petrichor ne doit pas rassurer. Il doit ouvrir.',
  'lab_translation'
),
(
  'Feuilles après pluie — Chlorophylle humide',
  'COLOMBIA · Humidity Studies',
  'Feuilles après pluie',
  'Odeurs situées liées à l''humidité tropicale. Pas d''exotisme. Pas de fétichisation de la matière. Traduction olfactive uniquement.',
  'Andes humides / piémont tropical',
  '800–2000 m',
  'Pluie courte, chaleur douce, évaporation lente',
  '10 à 40 minutes après la pluie, feuilles encore chargées d''eau, air immobile, saturé',
  'Vert vif, sève fraîche, humidité translucide',
  'Feuille froissée, chlorophylle chaude, amertume douce',
  'Peau végétale, humidité persistante, presque lacté, jamais sucré',
  '["feuilles larges tropicales", "herbes écrasées", "haies urbaines après pluie", "bordures de chemins"]',
  'Les feuilles après pluie ne "sentent" pas : elles respirent. Ce n''est pas une note verte abstraite, mais un moment physiologique : la plante relâche, l''eau s''évapore, l''air devient conducteur. Odeur de surface, pas de profondeur. Odeur de présent immédiat.',
  'no',
  '[{"name": "Test A — Feuille fraîche (MCT)", "method": "Feuille intacte, non froissée, immersion partielle MCT", "duration": "24 h max", "result": "Vert doux, rond, très fidèle"}, {"name": "Test B — Feuille froissée (alcool)", "method": "Feuille écrasée entre doigts, alcool 95%", "duration": "12–24 h", "result": "Plus agressif, amer, utile comme contraste"}]',
  'Vapeur humide',
  'Chlorophylle douce',
  'Peau végétale',
  'Traduire la feuille, sans la styliser. Cette odeur n''est pas décorative. Elle est fonctionnelle : elle signale la vie en cours.',
  'lab_translation'
);

-- 2. PROTOCOLES MOLÉCULAIRES
-- ============================================================================

INSERT INTO molecular_protocols (
  name, objective, olfactive_architecture, function,
  head_palette, heart_palette, base_palette,
  head_ratio, heart_ratio, base_ratio,
  formulation_protocol, sensory_tests, typical_failures, status
) VALUES
(
  'Petrichor Andin — Reconstruction olfactive',
  'Reconstituer une odeur de seuil andine : froide, minérale, transitoire. Sans notes vertes luxuriantes, bois chauds, effets "terre mouillée" caricaturaux. Ce protocole vise une évocation atmosphérique, pas une imitation brute.',
  'Air froid → Minéral humide → Poussière sèche',
  'Créer une sensation de passage entre pluie / soleil, entre ville / montagne, entre saturation / retrait.',
  '[{"molecule": "Aldéhydes froids (C10–C11)", "percentage": 6, "function": "Ouverture, verticalité, respiration", "warning": "Aucun effet lessive"}, {"molecule": "Iso E Super", "percentage": 10, "function": "Diffusion aérienne", "warning": ""}, {"molecule": "Dihydromyrcenol", "percentage": 3, "function": "Fraîcheur abstraite", "warning": ""}, {"molecule": "Accord air abstrait", "percentage": 6, "function": "", "warning": ""}]',
  '[{"molecule": "Patchouli fractionné clair", "percentage": 18, "function": "Pierre mouillée, sol compact", "warning": "Très propre, non terreux"}, {"molecule": "Ambroxan", "percentage": 12, "function": "Structure sèche", "warning": "Dosage bas"}, {"molecule": "Géosmine (dilution 1%)", "percentage": 1, "function": "Humidité retenue", "warning": "La géosmine doit être perçue, jamais identifiée"}, {"molecule": "Accord minéral humide", "percentage": 14, "function": "", "warning": ""}]',
  '[{"molecule": "Vétiveryl acétate", "percentage": 12, "function": "Sec, aérien", "warning": ""}, {"molecule": "Bois ambré clair", "percentage": 10, "function": "Assèchement progressif", "warning": "Type Ambercore"}, {"molecule": "Musc minéral dilué", "percentage": 8, "function": "Disparition, calme olfactif", "warning": "Ambrettolide très dilué"}]',
  25, 45, 30,
  '["Construire le cœur minéral seul", "Tester la perception humide à froid", "Ajouter la tête par micro-incréments", "Ajuster le fond pour écourter la tenue", "Reposer 7–14 jours", "Évaluer en air libre, pas sur mouillette seule"]',
  '["Test à température basse (15–18 °C)", "Test après vaporisation + attente 2 min", "Test en espace minéral (cage d escalier, pierre)", "Questions clés : L odeur disparaît-elle élégamment ? Reste-t-elle lisible sans devenir confortable ? Évoque-t-elle un lieu, sans le nommer ?"]',
  'Trop de géosmine → "terre humide" | Trop d''aldéhydes → cosmétique | Trop de bois → refuge olfactif. Le petrichor andin ne rassure pas. Il met en mouvement.',
  'conceptual'
),
(
  'Feuilles après pluie — Reconstruction physiologique',
  'Reconstituer l''odeur des feuilles vivantes après la pluie : humide, verte, respirante. Sans effet "thé vert", fraîcheur mentholée, abstraction cosmétique. Ce protocole vise une odeur de surface active, pas une note verte idéalisée.',
  'Vapeur humide → Chlorophylle douce → Peau végétale',
  'Donner la sensation que l''eau quitte la feuille, la plante respire, l''air devient conducteur. Odeur de présent, pas de mémoire.',
  '[{"molecule": "Aldéhydes verts C6–C8", "percentage": 8, "function": "Humidité translucide, diffusion douce", "warning": "Aucun effet fraîcheur propre"}, {"molecule": "Cis-3-hexenol", "percentage": 6, "function": "Sensation d air chargé", "warning": "Trace contrôlée"}, {"molecule": "Dihydromyrcenol", "percentage": 6, "function": "Soutien d évaporation", "warning": "Micro-dose"}, {"molecule": "Accord vapeur humide", "percentage": 10, "function": "", "warning": ""}]',
  '[{"molecule": "Cis-3-hexenyl acetate", "percentage": 16, "function": "Vert rond, non coupant", "warning": ""}, {"molecule": "Galbanum résinoïde", "percentage": 8, "function": "Feuille froissée, chlorophylle chaude", "warning": "Dose basse, non métallique"}, {"molecule": "Lentisque / mastiha", "percentage": 6, "function": "Sève, amertume douce", "warning": "Trace"}, {"molecule": "Accord chlorophylle", "percentage": 10, "function": "", "warning": "Le cœur doit respirer, pas trancher"}]',
  '[{"molecule": "Musc végétal clair", "percentage": 12, "function": "Persistance organique", "warning": "Habanolide très dilué"}, {"molecule": "Bois verts fractionnés", "percentage": 10, "function": "Humidité retenue", "warning": "Type clearwood fractionné"}, {"molecule": "Ambroxide (structure)", "percentage": 8, "function": "Sensation de feuille contre la peau", "warning": "Très bas, structure pas chaleur"}]',
  30, 40, 30,
  '["Construire le cœur vert seul", "Tester à faible concentration (≤ 5 %)", "Ajouter la tête par micro-incréments", "Ajuster le fond uniquement pour stabiliser", "Repos 7 jours maximum", "Tester sur mouillette et dans l air humide"]',
  '["Test en espace fermé après pluie", "Test à chaleur douce (20–25 °C)", "Test sur peau non parfumée (zone neutre)", "Questions clés : La feuille semble-t-elle vivante ? L odeur évolue-t-elle sans rupture ? Disparaît-elle sans devenir abstraite ?"]',
  'Surdosage cis-3-hexenol → herbe coupée | Trop d''aldéhydes → vert artificiel | Fond trop présent → effet parfumé. Une feuille après pluie ne cherche pas à durer.',
  'conceptual'
);

-- 3. RECETTES COLOMBIA
-- ============================================================================

INSERT INTO recettes (code, name, gamme, famille, support, notes, usage, intensite, description) VALUES
('COL-PET-01', 'Pétrichor Amazonien', 'Colombia', 'Pétrichor sombre', 'résine', '["geosmin faible", "humus", "bois mouillé"]', 'installation lente', 'moyenne', 'Pétrichor sombre de forêt tropicale humide'),
('COL-FER-02', 'Fermentation Tropicale', 'Colombia', 'Fermentum', 'tabac brun', '["cacao fermenté", "café vert", "sucre brun"]', 'performance', 'moyenne+', 'Fermentation tropicale : cacao, café, sucre brun'),
('COL-CAF-03', 'Torréfaction Noire', 'Colombia', 'Pyro', 'encens', '["café torréfié", "fumée sèche", "caramel amer"]', 'espace clos', 'forte', 'Torréfaction noire : café, fumée, caramel amer'),
('COL-AND-04', 'Air Andin', 'Colombia', 'Clair/Minéral', 'tabac blond', '["aldéhydes froids", "herbacé sec", "pierre"]', 'galerie', 'faible', 'Air andin : aldéhydes froids, herbacé sec, pierre'),
('COL-URB-05', 'Béton Mouillé', 'Colombia', 'Urbain', 'tabac blond', '["ozone", "minéral", "métal propre"]', 'white cube', 'faible-moyenne', 'Béton mouillé : ozone, minéral, métal propre'),
('COL-BOI-06', 'Bois Trempé', 'Colombia', 'Bois humide', 'résine', '["cèdre mouillé", "champignon", "lactone"]', 'in situ forêt', 'moyenne', 'Bois trempé : cèdre mouillé, champignon, lactone'),
('COL-VOL-07', 'Terre Volcanique', 'Colombia', 'Minéral', 'encens', '["argile chaude", "cendre claire"]', 'rituel', 'moyenne', 'Terre volcanique : argile chaude, cendre claire'),
('COL-CAC-08', 'Cacao Brut', 'Colombia', 'Gourmand sec', 'tabac brun', '["cacao", "pyrazines", "amertume"]', 'performance sonore', 'moyenne+', 'Cacao brut : cacao, pyrazines, amertume'),
('COL-PLU-09', 'Pluie Équatoriale', 'Colombia', 'Pétrichor clair', 'résine', '["pluie", "feuille verte", "ozone"]', 'extérieur', 'faible', 'Pluie équatoriale : pluie, feuille verte, ozone'),
('COL-ARC-10', 'Archive Humide', 'Colombia', 'Mémoire', 'encens', '["papier humide", "bois ancien"]', 'exposition', 'faible', 'Archive humide : papier humide, bois ancien');

-- ============================================================================
-- FIN
-- ============================================================================
