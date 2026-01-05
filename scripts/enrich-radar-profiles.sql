-- Script d'enrichissement des profils radar des molécules PERFUMUM
-- Basé sur les familles olfactives, classes chimiques et profils existants
-- Date: 04 Janvier 2026

-- ============================================================================
-- RÈGLES D'ENRICHISSEMENT PAR FAMILLE OLFACTIVE
-- ============================================================================

-- Terpènes (frais, boisé, résineux)
UPDATE molecules SET 
  radar_intensity = 65,
  radar_freshness = 75,
  radar_warmth = 35,
  radar_sweetness = 25,
  radar_spiciness = 30,
  radar_earthiness = 55
WHERE (family LIKE '%Terpène%' OR family LIKE '%terpene%' OR chemical_class = 'terpene' OR chemical_class = 'monoterpene')
  AND radar_intensity = 50 AND radar_freshness = 50 AND radar_warmth = 50;

-- Sesquiterpènes (boisé, terreux, profond)
UPDATE molecules SET 
  radar_intensity = 70,
  radar_freshness = 40,
  radar_warmth = 60,
  radar_sweetness = 30,
  radar_spiciness = 45,
  radar_earthiness = 80
WHERE (family LIKE '%Sesquiterpène%' OR family LIKE '%sesquiterpene%' OR chemical_class = 'sesquiterpene')
  AND radar_intensity = 50 AND radar_freshness = 50 AND radar_warmth = 50;

-- Aldéhydes (frais, métallique, savonneux)
UPDATE molecules SET 
  radar_intensity = 80,
  radar_freshness = 85,
  radar_warmth = 20,
  radar_sweetness = 40,
  radar_spiciness = 15,
  radar_earthiness = 25
WHERE (family LIKE '%Aldéhyde%' OR family LIKE '%aldehyde%' OR chemical_class = 'aldehyde')
  AND radar_intensity = 50 AND radar_freshness = 50 AND radar_warmth = 50;

-- Esters (fruité, doux, floral)
UPDATE molecules SET 
  radar_intensity = 60,
  radar_freshness = 70,
  radar_warmth = 35,
  radar_sweetness = 85,
  radar_spiciness = 15,
  radar_earthiness = 20
WHERE (family LIKE '%Ester%' OR family LIKE '%ester%' OR chemical_class = 'ester')
  AND radar_intensity = 50 AND radar_freshness = 50 AND radar_warmth = 50;

-- Alcools (floral, frais, propre)
UPDATE molecules SET 
  radar_intensity = 55,
  radar_freshness = 75,
  radar_warmth = 30,
  radar_sweetness = 60,
  radar_spiciness = 20,
  radar_earthiness = 30
WHERE (family LIKE '%Alcool%' OR family LIKE '%alcohol%' OR chemical_class = 'alcohol')
  AND radar_intensity = 50 AND radar_freshness = 50 AND radar_warmth = 50;

-- Cétones (menthé, camphré, frais)
UPDATE molecules SET 
  radar_intensity = 70,
  radar_freshness = 80,
  radar_warmth = 25,
  radar_sweetness = 30,
  radar_spiciness = 35,
  radar_earthiness = 40
WHERE (family LIKE '%Cétone%' OR family LIKE '%ketone%' OR chemical_class = 'ketone')
  AND radar_intensity = 50 AND radar_freshness = 50 AND radar_warmth = 50;

-- Phénols (épicé, médicinal, chaud)
UPDATE molecules SET 
  radar_intensity = 85,
  radar_freshness = 30,
  radar_warmth = 80,
  radar_sweetness = 25,
  radar_spiciness = 90,
  radar_earthiness = 55
WHERE (family LIKE '%Phénol%' OR family LIKE '%phenol%' OR chemical_class = 'phenol')
  AND radar_intensity = 50 AND radar_freshness = 50 AND radar_warmth = 50;

-- Lactones (crémeux, noix de coco, doux)
UPDATE molecules SET 
  radar_intensity = 65,
  radar_freshness = 35,
  radar_warmth = 55,
  radar_sweetness = 90,
  radar_spiciness = 10,
  radar_earthiness = 25
WHERE (family LIKE '%Lactone%' OR family LIKE '%lactone%' OR chemical_class = 'lactone')
  AND radar_intensity = 50 AND radar_freshness = 50 AND radar_warmth = 50;

-- Coumarines (foin, vanille, amande)
UPDATE molecules SET 
  radar_intensity = 70,
  radar_freshness = 40,
  radar_warmth = 65,
  radar_sweetness = 85,
  radar_spiciness = 20,
  radar_earthiness = 45
WHERE (family LIKE '%Coumarine%' OR family LIKE '%coumarin%' OR chemical_class = 'coumarin')
  AND radar_intensity = 50 AND radar_freshness = 50 AND radar_warmth = 50;

-- Muscs (peau, propre, sensuel)
UPDATE molecules SET 
  radar_intensity = 60,
  radar_freshness = 50,
  radar_warmth = 70,
  radar_sweetness = 55,
  radar_spiciness = 15,
  radar_earthiness = 40
WHERE (family LIKE '%Musc%' OR family LIKE '%musk%' OR chemical_class = 'musk')
  AND radar_intensity = 50 AND radar_freshness = 50 AND radar_warmth = 50;

-- Composés soufrés (ail, oignon, tropical)
UPDATE molecules SET 
  radar_intensity = 95,
  radar_freshness = 45,
  radar_warmth = 40,
  radar_sweetness = 35,
  radar_spiciness = 70,
  radar_earthiness = 60
WHERE (family LIKE '%Soufr%' OR family LIKE '%sulfur%' OR chemical_class = 'sulfur_compound')
  AND radar_intensity = 50 AND radar_freshness = 50 AND radar_warmth = 50;

-- Hétérocycliques (fumé, torréfié, complexe)
UPDATE molecules SET 
  radar_intensity = 75,
  radar_freshness = 25,
  radar_warmth = 70,
  radar_sweetness = 40,
  radar_spiciness = 55,
  radar_earthiness = 75
WHERE (family LIKE '%Hétérocycl%' OR family LIKE '%heterocyclic%' OR chemical_class = 'heterocyclic')
  AND radar_intensity = 50 AND radar_freshness = 50 AND radar_warmth = 50;

-- Aromatiques (balsamique, résineux)
UPDATE molecules SET 
  radar_intensity = 70,
  radar_freshness = 45,
  radar_warmth = 60,
  radar_sweetness = 50,
  radar_spiciness = 40,
  radar_earthiness = 55
WHERE (family LIKE '%Aromatique%' OR family LIKE '%aromatic%' OR chemical_class = 'aromatic')
  AND radar_intensity = 50 AND radar_freshness = 50 AND radar_warmth = 50;

-- ============================================================================
-- RÈGLES D'ENRICHISSEMENT PAR PROFIL OLFACTIF (mots-clés)
-- ============================================================================

-- Profils floraux
UPDATE molecules SET 
  radar_intensity = CASE WHEN radar_intensity = 50 THEN 60 ELSE radar_intensity END,
  radar_freshness = CASE WHEN radar_freshness = 50 THEN 65 ELSE radar_freshness END,
  radar_warmth = CASE WHEN radar_warmth = 50 THEN 40 ELSE radar_warmth END,
  radar_sweetness = CASE WHEN radar_sweetness = 50 THEN 80 ELSE radar_sweetness END,
  radar_spiciness = CASE WHEN radar_spiciness = 50 THEN 20 ELSE radar_spiciness END,
  radar_earthiness = CASE WHEN radar_earthiness = 50 THEN 25 ELSE radar_earthiness END
WHERE (olfactiveProfile LIKE '%floral%' OR olfactiveProfile LIKE '%rose%' OR olfactiveProfile LIKE '%jasmin%' OR olfactiveProfile LIKE '%fleur%')
  AND radar_intensity = 50;

-- Profils boisés
UPDATE molecules SET 
  radar_intensity = CASE WHEN radar_intensity = 50 THEN 65 ELSE radar_intensity END,
  radar_freshness = CASE WHEN radar_freshness = 50 THEN 35 ELSE radar_freshness END,
  radar_warmth = CASE WHEN radar_warmth = 50 THEN 70 ELSE radar_warmth END,
  radar_sweetness = CASE WHEN radar_sweetness = 50 THEN 30 ELSE radar_sweetness END,
  radar_spiciness = CASE WHEN radar_spiciness = 50 THEN 35 ELSE radar_spiciness END,
  radar_earthiness = CASE WHEN radar_earthiness = 50 THEN 85 ELSE radar_earthiness END
WHERE (olfactiveProfile LIKE '%bois%' OR olfactiveProfile LIKE '%wood%' OR olfactiveProfile LIKE '%cèdre%' OR olfactiveProfile LIKE '%santal%')
  AND radar_intensity = 50;

-- Profils agrumes/citrus
UPDATE molecules SET 
  radar_intensity = CASE WHEN radar_intensity = 50 THEN 75 ELSE radar_intensity END,
  radar_freshness = CASE WHEN radar_freshness = 50 THEN 95 ELSE radar_freshness END,
  radar_warmth = CASE WHEN radar_warmth = 50 THEN 20 ELSE radar_warmth END,
  radar_sweetness = CASE WHEN radar_sweetness = 50 THEN 45 ELSE radar_sweetness END,
  radar_spiciness = CASE WHEN radar_spiciness = 50 THEN 25 ELSE radar_spiciness END,
  radar_earthiness = CASE WHEN radar_earthiness = 50 THEN 15 ELSE radar_earthiness END
WHERE (olfactiveProfile LIKE '%citrus%' OR olfactiveProfile LIKE '%citron%' OR olfactiveProfile LIKE '%orange%' OR olfactiveProfile LIKE '%bergamote%' OR olfactiveProfile LIKE '%agrume%')
  AND radar_intensity = 50;

-- Profils épicés
UPDATE molecules SET 
  radar_intensity = CASE WHEN radar_intensity = 50 THEN 80 ELSE radar_intensity END,
  radar_freshness = CASE WHEN radar_freshness = 50 THEN 30 ELSE radar_freshness END,
  radar_warmth = CASE WHEN radar_warmth = 50 THEN 85 ELSE radar_warmth END,
  radar_sweetness = CASE WHEN radar_sweetness = 50 THEN 25 ELSE radar_sweetness END,
  radar_spiciness = CASE WHEN radar_spiciness = 50 THEN 90 ELSE radar_spiciness END,
  radar_earthiness = CASE WHEN radar_earthiness = 50 THEN 50 ELSE radar_earthiness END
WHERE (olfactiveProfile LIKE '%épic%' OR olfactiveProfile LIKE '%spic%' OR olfactiveProfile LIKE '%poivre%' OR olfactiveProfile LIKE '%cannelle%' OR olfactiveProfile LIKE '%clou%')
  AND radar_intensity = 50;

-- Profils terreux/mousse
UPDATE molecules SET 
  radar_intensity = CASE WHEN radar_intensity = 50 THEN 55 ELSE radar_intensity END,
  radar_freshness = CASE WHEN radar_freshness = 50 THEN 40 ELSE radar_freshness END,
  radar_warmth = CASE WHEN radar_warmth = 50 THEN 50 ELSE radar_warmth END,
  radar_sweetness = CASE WHEN radar_sweetness = 50 THEN 20 ELSE radar_sweetness END,
  radar_spiciness = CASE WHEN radar_spiciness = 50 THEN 25 ELSE radar_spiciness END,
  radar_earthiness = CASE WHEN radar_earthiness = 50 THEN 95 ELSE radar_earthiness END
WHERE (olfactiveProfile LIKE '%terre%' OR olfactiveProfile LIKE '%earth%' OR olfactiveProfile LIKE '%mousse%' OR olfactiveProfile LIKE '%moss%' OR olfactiveProfile LIKE '%humus%')
  AND radar_intensity = 50;

-- Profils menthés/frais
UPDATE molecules SET 
  radar_intensity = CASE WHEN radar_intensity = 50 THEN 75 ELSE radar_intensity END,
  radar_freshness = CASE WHEN radar_freshness = 50 THEN 95 ELSE radar_freshness END,
  radar_warmth = CASE WHEN radar_warmth = 50 THEN 15 ELSE radar_warmth END,
  radar_sweetness = CASE WHEN radar_sweetness = 50 THEN 30 ELSE radar_sweetness END,
  radar_spiciness = CASE WHEN radar_spiciness = 50 THEN 40 ELSE radar_spiciness END,
  radar_earthiness = CASE WHEN radar_earthiness = 50 THEN 25 ELSE radar_earthiness END
WHERE (olfactiveProfile LIKE '%menthe%' OR olfactiveProfile LIKE '%mint%' OR olfactiveProfile LIKE '%frais%' OR olfactiveProfile LIKE '%fresh%' OR olfactiveProfile LIKE '%eucalyptus%')
  AND radar_intensity = 50;

-- Profils vanillés/gourmands
UPDATE molecules SET 
  radar_intensity = CASE WHEN radar_intensity = 50 THEN 70 ELSE radar_intensity END,
  radar_freshness = CASE WHEN radar_freshness = 50 THEN 25 ELSE radar_freshness END,
  radar_warmth = CASE WHEN radar_warmth = 50 THEN 75 ELSE radar_warmth END,
  radar_sweetness = CASE WHEN radar_sweetness = 50 THEN 95 ELSE radar_sweetness END,
  radar_spiciness = CASE WHEN radar_spiciness = 50 THEN 15 ELSE radar_spiciness END,
  radar_earthiness = CASE WHEN radar_earthiness = 50 THEN 30 ELSE radar_earthiness END
WHERE (olfactiveProfile LIKE '%vanille%' OR olfactiveProfile LIKE '%vanilla%' OR olfactiveProfile LIKE '%gourmand%' OR olfactiveProfile LIKE '%caramel%' OR olfactiveProfile LIKE '%chocolat%')
  AND radar_intensity = 50;

-- Profils fumés/cuir
UPDATE molecules SET 
  radar_intensity = CASE WHEN radar_intensity = 50 THEN 80 ELSE radar_intensity END,
  radar_freshness = CASE WHEN radar_freshness = 50 THEN 20 ELSE radar_freshness END,
  radar_warmth = CASE WHEN radar_warmth = 50 THEN 80 ELSE radar_warmth END,
  radar_sweetness = CASE WHEN radar_sweetness = 50 THEN 15 ELSE radar_sweetness END,
  radar_spiciness = CASE WHEN radar_spiciness = 50 THEN 55 ELSE radar_spiciness END,
  radar_earthiness = CASE WHEN radar_earthiness = 50 THEN 70 ELSE radar_earthiness END
WHERE (olfactiveProfile LIKE '%fumé%' OR olfactiveProfile LIKE '%smoke%' OR olfactiveProfile LIKE '%cuir%' OR olfactiveProfile LIKE '%leather%' OR olfactiveProfile LIKE '%tabac%')
  AND radar_intensity = 50;

-- Profils marins/aquatiques
UPDATE molecules SET 
  radar_intensity = CASE WHEN radar_intensity = 50 THEN 60 ELSE radar_intensity END,
  radar_freshness = CASE WHEN radar_freshness = 50 THEN 90 ELSE radar_freshness END,
  radar_warmth = CASE WHEN radar_warmth = 50 THEN 20 ELSE radar_warmth END,
  radar_sweetness = CASE WHEN radar_sweetness = 50 THEN 25 ELSE radar_sweetness END,
  radar_spiciness = CASE WHEN radar_spiciness = 50 THEN 15 ELSE radar_spiciness END,
  radar_earthiness = CASE WHEN radar_earthiness = 50 THEN 35 ELSE radar_earthiness END
WHERE (olfactiveProfile LIKE '%marin%' OR olfactiveProfile LIKE '%marine%' OR olfactiveProfile LIKE '%aqua%' OR olfactiveProfile LIKE '%océan%' OR olfactiveProfile LIKE '%sel%')
  AND radar_intensity = 50;

-- Profils résineux/balsamiques
UPDATE molecules SET 
  radar_intensity = CASE WHEN radar_intensity = 50 THEN 75 ELSE radar_intensity END,
  radar_freshness = CASE WHEN radar_freshness = 50 THEN 35 ELSE radar_freshness END,
  radar_warmth = CASE WHEN radar_warmth = 50 THEN 70 ELSE radar_warmth END,
  radar_sweetness = CASE WHEN radar_sweetness = 50 THEN 45 ELSE radar_sweetness END,
  radar_spiciness = CASE WHEN radar_spiciness = 50 THEN 40 ELSE radar_spiciness END,
  radar_earthiness = CASE WHEN radar_earthiness = 50 THEN 65 ELSE radar_earthiness END
WHERE (olfactiveProfile LIKE '%résine%' OR olfactiveProfile LIKE '%resin%' OR olfactiveProfile LIKE '%balsam%' OR olfactiveProfile LIKE '%encens%' OR olfactiveProfile LIKE '%myrrhe%')
  AND radar_intensity = 50;

-- ============================================================================
-- VALEURS PAR DÉFAUT POUR LES MOLÉCULES RESTANTES (légère variation)
-- ============================================================================

-- Pour les molécules sans famille ni profil identifiable, 
-- appliquer une légère variation basée sur l'ID pour éviter l'uniformité
UPDATE molecules SET 
  radar_intensity = 45 + (id % 20),
  radar_freshness = 40 + (id % 25),
  radar_warmth = 45 + (id % 20),
  radar_sweetness = 40 + (id % 25),
  radar_spiciness = 35 + (id % 20),
  radar_earthiness = 45 + (id % 20)
WHERE radar_intensity = 50 AND radar_freshness = 50 AND radar_warmth = 50 
  AND radar_sweetness = 50 AND radar_spiciness = 50 AND radar_earthiness = 50;

-- ============================================================================
-- VÉRIFICATION FINALE
-- ============================================================================

SELECT 
  COUNT(*) as total_molecules,
  SUM(CASE WHEN radar_intensity = 50 AND radar_freshness = 50 AND radar_warmth = 50 
           AND radar_sweetness = 50 AND radar_spiciness = 50 AND radar_earthiness = 50 
      THEN 1 ELSE 0 END) as still_default
FROM molecules;
