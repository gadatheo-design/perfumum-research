SELECT 
  ms.id,
  m1.name AS molecule1_name,
  m2.name AS molecule2_name,
  ms.effect_type,
  ms.description,
  ms.intensity
FROM molecule_synergies ms
LEFT JOIN molecules m1 ON ms.molecule1_id = m1.id
LEFT JOIN molecules m2 ON ms.molecule2_id = m2.id
LIMIT 15;
