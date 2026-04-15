-- Ajout des champs de statut de conservation et réglementation CITES à la table plants

ALTER TABLE plants
ADD COLUMN conservation_status ENUM(
  'extinct',
  'extinct_in_wild',
  'critically_endangered',
  'endangered',
  'vulnerable',
  'near_threatened',
  'least_concern',
  'data_deficient',
  'not_evaluated'
) DEFAULT 'not_evaluated' AFTER notes;

ALTER TABLE plants
ADD COLUMN cites_appendix ENUM(
  'none',
  'appendix_i',
  'appendix_ii',
  'appendix_iii'
) DEFAULT 'none' AFTER conservation_status;

ALTER TABLE plants
ADD COLUMN conservation_notes TEXT AFTER cites_appendix;

ALTER TABLE plants
ADD COLUMN threat_factors JSON AFTER conservation_notes;

ALTER TABLE plants
ADD COLUMN sustainable_alternatives TEXT AFTER threat_factors;

ALTER TABLE plants
ADD COLUMN last_assessment_year INT AFTER sustainable_alternatives;

ALTER TABLE plants
ADD COLUMN historical_status VARCHAR(255) AFTER last_assessment_year;

