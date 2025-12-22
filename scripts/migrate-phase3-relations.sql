-- Migration Phase 3: Ajouter les tables de jonction pour les relations
-- Pétrichor/Volcanique ↔ Accords expérimentaux
-- Prototypes ↔ Familles chimiques

-- Table de jonction: Prototypes <-> Chemical Families
CREATE TABLE IF NOT EXISTS prototype_chemical_families (
  prototypeId INT NOT NULL,
  chemicalFamilyId INT NOT NULL,
  FOREIGN KEY (prototypeId) REFERENCES prototypes(id),
  FOREIGN KEY (chemicalFamilyId) REFERENCES chemical_families(id)
);

-- Table de jonction: Pétrichor <-> Experimental Accords
CREATE TABLE IF NOT EXISTS petrichor_experimental_accords (
  petrichorId INT NOT NULL,
  experimentalAccordId INT NOT NULL,
  FOREIGN KEY (petrichorId) REFERENCES petrichor(id),
  FOREIGN KEY (experimentalAccordId) REFERENCES experimental_accords(id)
);

-- Table de jonction: Volcanique <-> Experimental Accords
CREATE TABLE IF NOT EXISTS volcanique_experimental_accords (
  volcaniqueId INT NOT NULL,
  experimentalAccordId INT NOT NULL,
  FOREIGN KEY (volcaniqueId) REFERENCES volcanique(id),
  FOREIGN KEY (experimentalAccordId) REFERENCES experimental_accords(id)
);
