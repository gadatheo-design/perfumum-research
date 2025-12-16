-- Migration: Adjust molecules table schema for flexibility
-- Add new columns to molecules table

ALTER TABLE `molecules`
ADD COLUMN IF NOT EXISTS `family` text,
ADD COLUMN IF NOT EXISTS `chemicalFormula` varchar(100),
ADD COLUMN IF NOT EXISTS `emotionalResonance` text,
ADD COLUMN IF NOT EXISTS `sourceOrigin` text,
ADD COLUMN IF NOT EXISTS `concentration` varchar(100),
ADD COLUMN IF NOT EXISTS `notes` text;

-- Modify functionalEffect to be text instead of enum
ALTER TABLE `molecules`
MODIFY COLUMN `functionalEffect` text;

-- Modify chemicalFamily to be text instead of enum (if exists)
ALTER TABLE `molecules`
MODIFY COLUMN `chemicalFamily` text;
