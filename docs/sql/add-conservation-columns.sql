-- Ajout des colonnes de conservation à la table plant_varieties
ALTER TABLE plant_varieties 
ADD COLUMN IF NOT EXISTS conservation_status ENUM('critical', 'endangered', 'vulnerable', 'near_threatened', 'stable', 'data_deficient', 'unknown') DEFAULT 'unknown',
ADD COLUMN IF NOT EXISTS conservation_notes TEXT,
ADD COLUMN IF NOT EXISTS threat_factors JSON,
ADD COLUMN IF NOT EXISTS conservation_efforts TEXT,
ADD COLUMN IF NOT EXISTS last_assessment_date TIMESTAMP;
