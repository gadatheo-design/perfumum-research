-- Table pour les zones géographiques (overlays sur la carte)
-- Permet de regrouper les espèces menacées par région et de visualiser les zones à forte concentration

CREATE TABLE IF NOT EXISTS geographic_zones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL, -- Nom de la zone (ex: "Somalie - Zone critique Boswellia")
  region VARCHAR(255) NOT NULL, -- Région (ex: "Afrique de l'Est", "Amérique du Sud")
  zone_type ENUM('threatened_concentration', 'sustainable_alternatives', 'biodiversity_hotspot', 'conservation_area') NOT NULL,
  -- Type de zone:
  -- threatened_concentration: Zone à forte concentration d'espèces menacées
  -- sustainable_alternatives: Zone avec alternatives durables disponibles
  -- biodiversity_hotspot: Point chaud de biodiversité
  -- conservation_area: Zone de conservation active
  
  -- Géométrie de la zone (polygone)
  coordinates JSON NOT NULL, -- Array de {lat, lng} définissant le polygone
  -- Exemple: [{"lat": 10.5, "lng": 45.2}, {"lat": 11.0, "lng": 45.5}, ...]
  
  -- Informations sur la zone
  description TEXT, -- Description de la zone
  threat_level ENUM('critical', 'high', 'medium', 'low', 'stable') DEFAULT 'medium',
  species_count INT DEFAULT 0, -- Nombre d'espèces dans cette zone
  conservation_priority ENUM('urgent', 'high', 'medium', 'low') DEFAULT 'medium',
  
  -- Couleur de l'overlay sur la carte
  overlay_color VARCHAR(7) DEFAULT '#FF0000', -- Couleur hex (ex: #FF0000 pour rouge)
  overlay_opacity DECIMAL(3, 2) DEFAULT 0.35, -- Opacité (0.00 à 1.00)
  
  -- Alternatives durables dans cette zone
  sustainable_alternatives TEXT, -- Alternatives disponibles
  conservation_efforts TEXT, -- Efforts de conservation en cours
  
  -- Métadonnées
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- Table de liaison: Plantes <-> Zones géographiques (many-to-many)
CREATE TABLE IF NOT EXISTS plant_geographic_zones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plant_id INT NOT NULL,
  zone_id INT NOT NULL,
  is_primary_zone BOOLEAN DEFAULT FALSE, -- Zone principale pour cette plante
  population_status ENUM('abundant', 'common', 'rare', 'critically_rare', 'extinct') DEFAULT 'common',
  notes TEXT,
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
  FOREIGN KEY (zone_id) REFERENCES geographic_zones(id) ON DELETE CASCADE,
  UNIQUE KEY unique_plant_zone (plant_id, zone_id)
);

-- Index pour les performances
CREATE INDEX idx_zone_type ON geographic_zones(zone_type);
CREATE INDEX idx_threat_level ON geographic_zones(threat_level);
CREATE INDEX idx_plant_zone ON plant_geographic_zones(plant_id, zone_id);
