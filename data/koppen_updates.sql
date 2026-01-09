-- Mise à jour des zones climatiques Köppen pour les 27 plantes
-- Données basées sur les connaissances botaniques établies

-- Anis étoilé (Illicium verum) - Sud Chine, Vietnam
UPDATE plants SET 
  koppen_zone = 'Cfa',
  koppen_description = 'Climat subtropical humide',
  origin = COALESCE(origin, 'Sud de la Chine, Nord du Vietnam'),
  habitat = COALESCE(habitat, 'Forêts subtropicales humides de montagne'),
  temperature_min = 5,
  temperature_max = 30,
  precipitation_min = 1000,
  precipitation_max = 2000,
  altitude_min = 200,
  altitude_max = 1600
WHERE id = 420012;

-- Bigaradier (Citrus aurantium) - Méditerranée
UPDATE plants SET 
  koppen_zone = 'Csa',
  koppen_description = 'Climat méditerranéen à été chaud',
  origin = COALESCE(origin, 'Asie du Sud-Est, naturalisé Méditerranée'),
  habitat = COALESCE(habitat, 'Zones côtières méditerranéennes, vergers'),
  temperature_min = 5,
  temperature_max = 35,
  precipitation_min = 400,
  precipitation_max = 800,
  altitude_min = 0,
  altitude_max = 800
WHERE id = 420001;

-- Camomille allemande (Matricaria chamomilla) - Europe tempérée
UPDATE plants SET 
  koppen_zone = 'Cfb',
  koppen_description = 'Climat océanique tempéré',
  origin = COALESCE(origin, 'Europe, Asie occidentale'),
  habitat = COALESCE(habitat, 'Prairies, champs cultivés, friches'),
  temperature_min = -10,
  temperature_max = 25,
  precipitation_min = 500,
  precipitation_max = 1000,
  altitude_min = 0,
  altitude_max = 1500
WHERE id = 420010;

-- Camomille romaine (Chamaemelum nobile) - Europe atlantique
UPDATE plants SET 
  koppen_zone = 'Cfb',
  koppen_description = 'Climat océanique tempéré',
  origin = COALESCE(origin, 'Europe occidentale, Atlantique'),
  habitat = COALESCE(habitat, 'Pelouses, prairies sèches'),
  temperature_min = -5,
  temperature_max = 25,
  precipitation_min = 600,
  precipitation_max = 1200,
  altitude_min = 0,
  altitude_max = 1000
WHERE id = 420009;

-- Cannabis (Cannabis sativa L.) - Asie centrale
UPDATE plants SET 
  koppen_zone = 'BSk',
  koppen_description = 'Climat semi-aride froid (steppe)',
  origin = COALESCE(origin, 'Asie centrale (Hindu Kush, Himalaya)'),
  habitat = COALESCE(habitat, 'Steppes, vallées montagneuses, sols bien drainés'),
  temperature_min = -10,
  temperature_max = 35,
  precipitation_min = 300,
  precipitation_max = 800,
  altitude_min = 500,
  altitude_max = 3000
WHERE id = 330001;

-- Cardamome (Elettaria cardamomum) - Inde du Sud
UPDATE plants SET 
  koppen_zone = 'Am',
  koppen_description = 'Climat tropical de mousson',
  origin = COALESCE(origin, 'Ghâts occidentaux, Inde du Sud'),
  habitat = COALESCE(habitat, 'Sous-bois des forêts tropicales humides'),
  temperature_min = 15,
  temperature_max = 35,
  precipitation_min = 1500,
  precipitation_max = 4000,
  altitude_min = 600,
  altitude_max = 1500
WHERE id = 390005;

-- Coca amazonienne (Erythroxylum coca var. ipadu) - Amazonie
UPDATE plants SET 
  koppen_zone = 'Af',
  koppen_description = 'Climat équatorial humide',
  origin = COALESCE(origin, 'Bassin amazonien (Colombie, Pérou, Brésil)'),
  habitat = COALESCE(habitat, 'Forêt tropicale humide, chagras traditionnelles'),
  temperature_min = 20,
  temperature_max = 35,
  precipitation_min = 2000,
  precipitation_max = 4000,
  altitude_min = 100,
  altitude_max = 500
WHERE id = 360001;

-- Coriandre (Coriandrum sativum) - Méditerranée orientale
UPDATE plants SET 
  koppen_zone = 'Csa',
  koppen_description = 'Climat méditerranéen à été chaud',
  origin = COALESCE(origin, 'Méditerranée orientale, Proche-Orient'),
  habitat = COALESCE(habitat, 'Terres cultivées, friches, sols calcaires'),
  temperature_min = 0,
  temperature_max = 35,
  precipitation_min = 300,
  precipitation_max = 700,
  altitude_min = 0,
  altitude_max = 1200
WHERE id = 420006;

-- Cumin (Cuminum cyminum) - Moyen-Orient
UPDATE plants SET 
  koppen_zone = 'BWh',
  koppen_description = 'Climat désertique chaud',
  origin = COALESCE(origin, 'Égypte, Moyen-Orient, Iran'),
  habitat = COALESCE(habitat, 'Zones arides irriguées, oasis'),
  temperature_min = 5,
  temperature_max = 40,
  precipitation_min = 100,
  precipitation_max = 400,
  altitude_min = 0,
  altitude_max = 1500
WHERE id = 420013;

-- Cyprès méditerranéen (Cupressus sempervirens)
UPDATE plants SET 
  koppen_zone = 'Csa',
  koppen_description = 'Climat méditerranéen à été chaud',
  origin = COALESCE(origin, 'Méditerranée orientale (Grèce, Turquie, Chypre)'),
  habitat = COALESCE(habitat, 'Collines calcaires, maquis méditerranéen'),
  temperature_min = -5,
  temperature_max = 35,
  precipitation_min = 400,
  precipitation_max = 800,
  altitude_min = 0,
  altitude_max = 1500
WHERE id = 420003;

-- Genévrier commun (Juniperus communis) - Hémisphère nord
UPDATE plants SET 
  koppen_zone = 'Dfb',
  koppen_description = 'Climat continental humide à été tempéré',
  origin = COALESCE(origin, 'Hémisphère nord circumpolaire'),
  habitat = COALESCE(habitat, 'Landes, forêts claires, sols calcaires'),
  temperature_min = -30,
  temperature_max = 25,
  precipitation_min = 400,
  precipitation_max = 1200,
  altitude_min = 0,
  altitude_max = 3500
WHERE id = 420004;

-- Gingembre (Zingiber officinale) - Asie du Sud-Est
UPDATE plants SET 
  koppen_zone = 'Am',
  koppen_description = 'Climat tropical de mousson',
  origin = COALESCE(origin, 'Asie du Sud-Est (Inde, Malaisie)'),
  habitat = COALESCE(habitat, 'Forêts tropicales humides, sols riches'),
  temperature_min = 18,
  temperature_max = 35,
  precipitation_min = 1500,
  precipitation_max = 3000,
  altitude_min = 0,
  altitude_max = 1500
WHERE id = 390001;

-- Immortelle (Helichrysum italicum) - Méditerranée
UPDATE plants SET 
  koppen_zone = 'Csa',
  koppen_description = 'Climat méditerranéen à été chaud',
  origin = COALESCE(origin, 'Bassin méditerranéen (Corse, Sardaigne, Balkans)'),
  habitat = COALESCE(habitat, 'Maquis, garrigues, sols secs et rocailleux'),
  temperature_min = 0,
  temperature_max = 35,
  precipitation_min = 300,
  precipitation_max = 700,
  altitude_min = 0,
  altitude_max = 800
WHERE id = 420011;

-- Muscade (Myristica fragrans) - Îles Banda, Indonésie
UPDATE plants SET 
  koppen_zone = 'Af',
  koppen_description = 'Climat équatorial humide',
  origin = COALESCE(origin, 'Îles Banda, Moluques, Indonésie'),
  habitat = COALESCE(habitat, 'Forêts tropicales humides insulaires'),
  temperature_min = 22,
  temperature_max = 32,
  precipitation_min = 2000,
  precipitation_max = 3500,
  altitude_min = 0,
  altitude_max = 700
WHERE id = 420008;

-- Nicotiana benthamiana - Australie
UPDATE plants SET 
  koppen_zone = 'BSh',
  koppen_description = 'Climat semi-aride chaud',
  origin = COALESCE(origin, 'Nord de l''Australie'),
  habitat = COALESCE(habitat, 'Zones semi-arides, sols sablonneux'),
  temperature_min = 10,
  temperature_max = 40,
  precipitation_min = 200,
  precipitation_max = 600,
  altitude_min = 0,
  altitude_max = 500
WHERE id = 330003;

-- Nicotiana sylvestris - Argentine
UPDATE plants SET 
  koppen_zone = 'Cwb',
  koppen_description = 'Climat subtropical d''altitude à hiver sec',
  origin = COALESCE(origin, 'Nord-ouest de l''Argentine (Andes)'),
  habitat = COALESCE(habitat, 'Forêts de montagne, yungas'),
  temperature_min = 5,
  temperature_max = 25,
  precipitation_min = 800,
  precipitation_max = 1500,
  altitude_min = 1000,
  altitude_max = 2500
WHERE id = 330005;

-- Nicotiana tomentosiformis - Amérique du Sud
UPDATE plants SET 
  koppen_zone = 'Aw',
  koppen_description = 'Climat tropical à saison sèche',
  origin = COALESCE(origin, 'Bolivie, nord de l''Argentine'),
  habitat = COALESCE(habitat, 'Forêts sèches, vallées andines'),
  temperature_min = 10,
  temperature_max = 30,
  precipitation_min = 500,
  precipitation_max = 1200,
  altitude_min = 500,
  altitude_max = 2000
WHERE id = 330006;

-- Orange amère variété (Citrus aurantium var. amara)
UPDATE plants SET 
  koppen_zone = 'Csa',
  koppen_description = 'Climat méditerranéen à été chaud',
  origin = COALESCE(origin, 'Asie du Sud-Est, cultivé Méditerranée'),
  habitat = COALESCE(habitat, 'Vergers méditerranéens, zones côtières'),
  temperature_min = 5,
  temperature_max = 35,
  precipitation_min = 400,
  precipitation_max = 800,
  altitude_min = 0,
  altitude_max = 600
WHERE id = 420002;

-- Palmarosa (Cymbopogon martinii) - Inde
UPDATE plants SET 
  koppen_zone = 'Aw',
  koppen_description = 'Climat tropical à saison sèche',
  origin = COALESCE(origin, 'Inde (Deccan, Maharashtra)'),
  habitat = COALESCE(habitat, 'Prairies tropicales, sols bien drainés'),
  temperature_min = 15,
  temperature_max = 40,
  precipitation_min = 600,
  precipitation_max = 1500,
  altitude_min = 0,
  altitude_max = 1000
WHERE id = 420005;

-- Pin sylvestre (Pinus sylvestris) - Eurasie boréale
UPDATE plants SET 
  koppen_zone = 'Dfb',
  koppen_description = 'Climat continental humide à été tempéré',
  origin = COALESCE(origin, 'Eurasie (Écosse à Sibérie)'),
  habitat = COALESCE(habitat, 'Forêts boréales, sols sablonneux acides'),
  temperature_min = -40,
  temperature_max = 25,
  precipitation_min = 400,
  precipitation_max = 800,
  altitude_min = 0,
  altitude_max = 2600
WHERE id = 390003;

-- Poivre noir (Piper nigrum) - Inde du Sud
UPDATE plants SET 
  koppen_zone = 'Am',
  koppen_description = 'Climat tropical de mousson',
  origin = COALESCE(origin, 'Côte de Malabar, Inde du Sud'),
  habitat = COALESCE(habitat, 'Forêts tropicales humides, liane grimpante'),
  temperature_min = 20,
  temperature_max = 35,
  precipitation_min = 2000,
  precipitation_max = 3500,
  altitude_min = 0,
  altitude_max = 1200
WHERE id = 420007;

-- Sauge sclarée (Salvia sclarea) - Méditerranée
UPDATE plants SET 
  koppen_zone = 'Csa',
  koppen_description = 'Climat méditerranéen à été chaud',
  origin = COALESCE(origin, 'Bassin méditerranéen, Asie occidentale'),
  habitat = COALESCE(habitat, 'Coteaux calcaires, prairies sèches'),
  temperature_min = -10,
  temperature_max = 35,
  precipitation_min = 400,
  precipitation_max = 800,
  altitude_min = 0,
  altitude_max = 1500
WHERE id = 390002;

-- Tabac cultivé (Nicotiana tabacum L.) - Amérique tropicale
UPDATE plants SET 
  koppen_zone = 'Aw',
  koppen_description = 'Climat tropical à saison sèche',
  origin = COALESCE(origin, 'Amérique du Sud tropicale (Andes)'),
  habitat = COALESCE(habitat, 'Terres cultivées, sols fertiles bien drainés'),
  temperature_min = 15,
  temperature_max = 35,
  precipitation_min = 800,
  precipitation_max = 1500,
  altitude_min = 0,
  altitude_max = 2000
WHERE id = 330002;

-- Tea tree (Melaleuca alternifolia) - Australie
UPDATE plants SET 
  koppen_zone = 'Cfa',
  koppen_description = 'Climat subtropical humide',
  origin = COALESCE(origin, 'Nouvelle-Galles du Sud, Australie'),
  habitat = COALESCE(habitat, 'Zones marécageuses, sols humides'),
  temperature_min = 5,
  temperature_max = 35,
  precipitation_min = 1000,
  precipitation_max = 1800,
  altitude_min = 0,
  altitude_max = 300
WHERE id = 390004;

-- Thym (Thymus vulgaris) - Méditerranée
UPDATE plants SET 
  koppen_zone = 'Csa',
  koppen_description = 'Climat méditerranéen à été chaud',
  origin = COALESCE(origin, 'Bassin méditerranéen occidental'),
  habitat = COALESCE(habitat, 'Garrigues, sols calcaires secs'),
  temperature_min = -5,
  temperature_max = 35,
  precipitation_min = 300,
  precipitation_max = 700,
  altitude_min = 0,
  altitude_max = 1500
WHERE id = 420014;

-- Wild tobacco (Nicotiana attenuata) - Amérique du Nord
UPDATE plants SET 
  koppen_zone = 'BSk',
  koppen_description = 'Climat semi-aride froid',
  origin = COALESCE(origin, 'Sud-ouest des États-Unis, nord du Mexique'),
  habitat = COALESCE(habitat, 'Déserts, zones perturbées après incendies'),
  temperature_min = -10,
  temperature_max = 40,
  precipitation_min = 150,
  precipitation_max = 400,
  altitude_min = 500,
  altitude_max = 2500
WHERE id = 330004;

-- Ambil (préparation de Nicotiana tabacum) - Amazonie colombienne
UPDATE plants SET 
  koppen_zone = 'Af',
  koppen_description = 'Climat équatorial humide',
  origin = COALESCE(origin, 'Amazonie colombienne (Putumayo, Vaupés)'),
  habitat = COALESCE(habitat, 'Forêt tropicale amazonienne, chagras'),
  temperature_min = 22,
  temperature_max = 32,
  precipitation_min = 2500,
  precipitation_max = 4000,
  altitude_min = 100,
  altitude_max = 400
WHERE id = 360003;
