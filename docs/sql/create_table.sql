CREATE TABLE IF NOT EXISTS `recherche_radicale` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nom` VARCHAR(255) NOT NULL,
  `symbole` VARCHAR(10),
  `serie` VARCHAR(255) NOT NULL,
  `concept` TEXT NOT NULL,
  `note_speciale` TEXT,
  `architecture` TEXT NOT NULL,
  `effet` TEXT NOT NULL,
  `usage_artistique` TEXT NOT NULL,
  `themes_conceptuels` TEXT,
  `avertissement` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);
