import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Créer la table raw_materials
await connection.query(`
  CREATE TABLE IF NOT EXISTS raw_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_id VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    latin_name VARCHAR(255),
    category ENUM('huile_essentielle', 'absolue', 'concrete', 'resinoid', 'teinture', 'co2_extract', 'hydrolat', 'beurre', 'cire', 'oleoresine', 'infusion', 'maceration', 'distillat', 'autre') NOT NULL,
    plant_id INT,
    plant_part ENUM('fleur', 'feuille', 'tige', 'racine', 'ecorce', 'bois', 'resine', 'graine', 'fruit', 'zeste', 'plante_entiere', 'bourgeon', 'autre'),
    terroir_id INT,
    origin_country VARCHAR(100),
    origin_region VARCHAR(255),
    extraction_method_id INT,
    extraction_yield DECIMAL(5,3),
    extraction_notes TEXT,
    olfactive_family ENUM('floral', 'boise', 'agrume', 'epice', 'herbace', 'balsamique', 'musque', 'animal', 'vert', 'fruité', 'marin', 'terreux', 'fumé', 'gourmand', 'aromatique', 'autre'),
    olfactive_profile TEXT,
    top_notes TEXT,
    heart_notes TEXT,
    base_notes TEXT,
    intensity INT,
    tenacity INT,
    dominant_molecules JSON,
    quality ENUM('conventionnel', 'bio', 'sauvage', 'biodynamique', 'aop', 'igp', 'fair_trade'),
    certifications JSON,
    ifra_category VARCHAR(50),
    max_usage_level DECIMAL(5,2),
    restrictions TEXT,
    allergens JSON,
    price_range ENUM('economique', 'standard', 'premium', 'luxe', 'rare'),
    availability ENUM('disponible', 'saisonnier', 'rare', 'en_rupture', 'discontinue'),
    suppliers JSON,
    usage_notes TEXT,
    blending_tips TEXT,
    synergies JSON,
    image_url VARCHAR(500),
    refs JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plant_id) REFERENCES plants(id),
    FOREIGN KEY (terroir_id) REFERENCES terroirs(id),
    FOREIGN KEY (extraction_method_id) REFERENCES extraction_methods(id)
  )
`);
console.log('Table raw_materials créée');

// Créer la table raw_material_molecules
await connection.query(`
  CREATE TABLE IF NOT EXISTS raw_material_molecules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    raw_material_id INT NOT NULL,
    molecule_id INT NOT NULL,
    percentage DECIMAL(5,2),
    is_signature INT DEFAULT 0,
    variability VARCHAR(50),
    notes TEXT,
    FOREIGN KEY (raw_material_id) REFERENCES raw_materials(id),
    FOREIGN KEY (molecule_id) REFERENCES molecules(id)
  )
`);
console.log('Table raw_material_molecules créée');

// Créer la table molecule_plant_sources
await connection.query(`
  CREATE TABLE IF NOT EXISTS molecule_plant_sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    molecule_id INT NOT NULL,
    plant_id INT NOT NULL,
    plant_part VARCHAR(100),
    percentage_in_plant DECIMAL(5,3),
    percentage_in_oil DECIMAL(5,2),
    variability ENUM('stable', 'variable', 'tres_variable', 'chemotype_dependant'),
    is_main_source INT DEFAULT 0,
    is_primary_source INT DEFAULT 0,
    best_extraction_method VARCHAR(100),
    extraction_yield DECIMAL(5,3),
    refs JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (molecule_id) REFERENCES molecules(id),
    FOREIGN KEY (plant_id) REFERENCES plants(id)
  )
`);
console.log('Table molecule_plant_sources créée');

// Créer la table terroir_specialties
await connection.query(`
  CREATE TABLE IF NOT EXISTS terroir_specialties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    terroir_id INT NOT NULL,
    plant_id INT,
    raw_material_id INT,
    is_signature INT DEFAULT 0,
    importance ENUM('majeure', 'significative', 'mineure', 'emergente'),
    annual_production VARCHAR(100),
    production_trend ENUM('croissante', 'stable', 'decroissante', 'variable'),
    quality_reputation ENUM('exceptionnelle', 'excellente', 'bonne', 'standard'),
    unique_characteristics TEXT,
    historical_context TEXT,
    tradition_since VARCHAR(50),
    economic_importance TEXT,
    main_buyers JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (terroir_id) REFERENCES terroirs(id),
    FOREIGN KEY (plant_id) REFERENCES plants(id),
    FOREIGN KEY (raw_material_id) REFERENCES raw_materials(id)
  )
`);
console.log('Table terroir_specialties créée');

console.log('Toutes les tables ont été créées avec succès!');
await connection.end();
