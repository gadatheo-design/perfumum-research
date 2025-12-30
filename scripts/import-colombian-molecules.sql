-- Import des molécules colombiennes locales et endémiques
-- Plantes aromatiques endémiques

INSERT INTO molecules (
  name, iupacName, formula, family, olfactiveProfile, emotionalResonance,
  functionalEffect, origin, concentration, botanicalSources, extractionMethod,
  therapeuticProperties, radarIntensity, radarFreshness, radarWarmth,
  radarSweetness, radarSpiciness, radarEarthiness
) VALUES
-- Lippia Origanoides
('Lippia Origanoides (Origan Sauvage)', 'Lippia origanoides essential oil', 'C10H18O (Thymol)', 'Terpènes Phénoliques',
 'Épicé, terreux, herbacé, chaud, poivré', 'Énergisant, tonifiant, rituel',
 'Antiseptique, énergisant, tonifiant', 'Cali, Vallée du Cauca, Colombie', '0.01-0.05%',
 'Feuilles fraîches et séchées de Lippia origanoides', 'Hydrodistillation (100-150ml/kg)',
 'Antiseptique, tonifiant, énergisant, anti-inflammatoire', 85, 45, 85, 20, 90, 80),

-- Turnera Diffusa
('Turnera Diffusa (Damiana)', 'Turnera diffusa essential oil', 'C10H16O (Déhydrofukinone)', 'Terpènes Floraux',
 'Floral tropical, fruité, sucré, herbacé', 'Apaisante, relaxante, sensuelle',
 'Apaisante, relaxante, aphrodisiaque', 'Cali, Vallée du Cauca, Colombie', '0.01-0.05%',
 'Feuilles fraîches et séchées de Turnera diffusa', 'Hydrodistillation (80-120ml/kg)',
 'Apaisante, relaxante, aphrodisiaque, anti-inflammatoire', 75, 60, 40, 80, 25, 35),

-- Calycolpus Moritzianus
('Calycolpus Moritzianus (Guayabita)', 'Calycolpus moritzianus essential oil', 'C10H16 (Limonène)', 'Terpènes Citrus',
 'Citrus frais, herbacé, boisé léger', 'Énergisant, clarifiant, stimulant',
 'Énergisant, clarifiant, tonifiant', 'Armenia, Quindío, Colombie', '0.01-0.05%',
 'Feuilles fraîches et séchées de Calycolpus moritzianus', 'Hydrodistillation (120-150ml/kg)',
 'Énergisant, clarifiant, stimulant, antioxydant', 80, 90, 30, 40, 20, 25),

-- Piper Aduncum
('Piper Aduncum (Poivre Sauvage)', 'Piper aduncum essential oil', 'C10H16O (Pipéritone)', 'Terpènes Poivrés',
 'Poivré herbacé, fruité citrus, épicé chaud', 'Énergisant, stimulant, tonifiant',
 'Énergisant, stimulant, tonifiant', 'Cali, Vallée du Cauca, Colombie', '0.01-0.05%',
 'Feuilles fraîches et séchées de Piper aduncum', 'Hydrodistillation (100-130ml/kg)',
 'Énergisant, stimulant, tonifiant, antioxydant', 85, 65, 70, 30, 85, 40),

-- Steiractinia Aspera
('Steiractinia Aspera (Endémique Rare)', 'Steiractinia aspera essential oil', 'C10H16 (α-Pinène)', 'Terpènes Boisés',
 'Boisé résineux, herbacé frais, citrus léger', 'Énergisant, clarifiant, tonifiant',
 'Énergisant, clarifiant, tonifiant', 'Armenia, Quindío, Colombie', '0.01-0.05%',
 'Feuilles fraîches et séchées de Steiractinia aspera', 'Hydrodistillation (90-110ml/kg)',
 'Énergisant, clarifiant, tonifiant, neuroprotecteur', 75, 70, 50, 25, 30, 60),

-- Café Colombien
('Café Geisha - Grains Verts', 'Coffea arabica var. Geisha green beans', 'C10H16 (Limonène)', 'Terpènes Fruités',
 'Citrus frais, fruité complexe, floral blanc, herbacé', 'Énergisant, stimulant, clarifiant',
 'Énergisant, stimulant, tonifiant', 'Armenia, Quindío, Colombie', '0.01-0.05%',
 'Grains verts de Coffea arabica var. Geisha', 'Expression à froid, hydrodistillation',
 'Énergisant, stimulant, antioxydant, neuroprotecteur', 80, 85, 35, 50, 25, 30),

('Fleur de Café - Absolue', 'Coffea arabica flower absolute', 'C10H18O (Linalool)', 'Terpènes Floraux',
 'Floral blanc pur, jasmin, rose sucré, floral boisé', 'Apaisante, relaxante, sensuelle',
 'Apaisante, relaxante, sédative', 'Armenia, Quindío, Colombie', '0.01-0.05%',
 'Fleurs fraîches de Coffea arabica', 'Enfleurage, extraction au solvant',
 'Apaisante, relaxante, sédative, anxiolytique', 70, 65, 45, 85, 15, 20),

-- Cacao Colombien
('Cacao Colombien - Fèves Fermentées', 'Theobroma cacao fermented beans', 'C6H5CH2CH2OH (2-Phenylethanol)', 'Terpènes Floraux',
 'Chocolat complexe, floral rose, fruité, terreux', 'Réconfortante, apaisante, sensuelle',
 'Réconfortante, apaisante, antidépresseur', 'Cali, Vallée du Cauca, Colombie', '0.01-0.05%',
 'Fèves fermentées de Theobroma cacao', 'Extraction au solvant, enfleurage',
 'Réconfortante, apaisante, antidépresseur, antioxydante', 80, 30, 75, 85, 20, 50),

-- Bois Précieux Colombiens
('Palo Santo Colombien', 'Bulnesia sarmientoi wood oil', 'C10H16 (α-Pinène)', 'Terpènes Boisés',
 'Boisé frais, citrus léger, herbacé, poivre chaud', 'Énergisant, clarifiant, purificateur',
 'Énergisant, clarifiant, purificateur', 'Cauca, Colombie', '0.01-0.05%',
 'Bois de cœur de Bulnesia sarmientoi', 'Hydrodistillation, extraction au solvant',
 'Énergisant, clarifiant, purificateur, antioxydant', 70, 70, 55, 35, 40, 50);
