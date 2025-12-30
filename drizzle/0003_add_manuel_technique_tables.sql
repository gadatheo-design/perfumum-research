-- Migration: Add Manuel Technique tables
-- Date: 2025-01-02
-- Description: Add chemical_families, tobacco_formulas, experimental_accords, sensory_scales

-- Chemical Families
CREATE TABLE IF NOT EXISTS `chemical_families` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('acides_gras', 'acides_aromatiques', 'esters', 'indoles') NOT NULL,
  `description` TEXT,
  `olfactiveRole` TEXT,
  `volatility` VARCHAR(50),
  `polarity` VARCHAR(50),
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- Tobacco Formulas
CREATE TABLE IF NOT EXISTS `tobacco_formulas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `olfactiveFamily` VARCHAR(255),
  `inspiration` TEXT,
  `composition` TEXT,
  `procedure` TEXT,
  `cureConditions` TEXT,
  `observations` TEXT,
  `suggestedUse` TEXT,
  `effect` TEXT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- Experimental Accords
CREATE TABLE IF NOT EXISTS `experimental_accords` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `number` INT NOT NULL,
  `olfactiveAxis` VARCHAR(255) NOT NULL,
  `intention` VARCHAR(255) NOT NULL,
  `baseTabac` TEXT,
  `resinExtract` TEXT,
  `sensoryModifier` TEXT,
  `conceptualNote` TEXT,
  `isExtreme` INT DEFAULT 0 NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- Sensory Scales
CREATE TABLE IF NOT EXISTS `sensory_scales` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type` ENUM('axis', 'family') NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `scale` VARCHAR(50),
  `order` INT DEFAULT 0,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- Relation tables
CREATE TABLE IF NOT EXISTS `molecule_chemical_families` (
  `moleculeId` INT NOT NULL,
  `chemicalFamilyId` INT NOT NULL,
  FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`),
  FOREIGN KEY (`chemicalFamilyId`) REFERENCES `chemical_families`(`id`)
);

CREATE TABLE IF NOT EXISTS `tobacco_formula_installations` (
  `tobaccoFormulaId` INT NOT NULL,
  `installationId` INT NOT NULL,
  FOREIGN KEY (`tobaccoFormulaId`) REFERENCES `tobacco_formulas`(`id`),
  FOREIGN KEY (`installationId`) REFERENCES `installations`(`id`)
);

CREATE TABLE IF NOT EXISTS `experimental_accord_civilisations` (
  `experimentalAccordId` INT NOT NULL,
  `civilisationId` INT NOT NULL,
  FOREIGN KEY (`experimentalAccordId`) REFERENCES `experimental_accords`(`id`),
  FOREIGN KEY (`civilisationId`) REFERENCES `civilisations`(`id`)
);
