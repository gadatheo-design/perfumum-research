INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Mimosa tenuiflora', 'Mimosa tenuiflora (Willd.) Poir.', 'Fabaceae', 'autre', 'Brésil (Nordeste), Mexique', 'Boisé, résineux, terreux', 'DMT (1-1.7%), 5-HT, 2-méthylcarboline, tanins', 'Boisson rituelle Jurema, cicatrisation, tannage', NULL, 'Source: https://en.wikipedia.org/wiki/Mimosa_tenuiflora. Partie utilisée: Écorce de racine. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Mimosa ophthalmocentra', 'Mimosa ophthalmocentra Mart. ex Benth.', 'Fabaceae', 'autre', 'Brésil (Nordeste - Caatinga)', 'Boisé, terreux', 'DMT (1.6%), NMT, Hordénine', 'Cérémonies mystico-religieuses', NULL, 'Source: https://www.tandfonline.com/doi/pdf/10.1076/phbi.37.1.50.6312. Partie utilisée: Écorce de racine. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Anadenanthera peregrina', 'Anadenanthera peregrina (L.) Speg.', 'Fabaceae', 'autre', 'Amérique du Sud, Caraïbes', 'Terreux, âcre (poudre)', 'DMT, 5-MeO-DMT, Bufoténine', 'Poudre à priser hallucinogène (Yopo, Cohoba)', NULL, 'Source: https://en.wikipedia.org/wiki/Anadenanthera_peregrina. Partie utilisée: Graines. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Anadenanthera colubrina', 'Anadenanthera colubrina (Vell.) Brenan', 'Fabaceae', 'autre', 'Amérique du Sud (Andes, Chaco)', 'Terreux, âcre (poudre)', 'Bufoténine, DMT, 5-MeO-DMT', 'Poudre à priser hallucinogène (Vilca, Cebil)', NULL, 'Source: https://en.wikipedia.org/wiki/Anadenanthera_colubrina. Partie utilisée: Graines. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Virola theiodora', 'Virola theiodora (Spruce ex Benth.) Warb.', 'Myristicaceae', 'autre', 'Amazonie (Brésil, Colombie, Venezuela)', 'Épicé, boisé, muscade', 'DMT, 5-MeO-DMT, MMT', 'Poudre à priser hallucinogène (Epená, Yakee)', 'bois', 'Source: https://opensiuc.lib.siu.edu/cgi/viewcontent.cgi?article=1435&context=ebl. Partie utilisée: Écorce, résine. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Psychotria viridis', 'Psychotria viridis Ruiz & Pav.', 'Rubiaceae', 'autre', 'Amazonie', 'Vert, végétal, herbacé', 'DMT (0.1-0.6%)', 'Ingrédient de l''Ayahuasca (source de DMT)', 'bois', 'Source: https://en.wikipedia.org/wiki/Psychotria_viridis. Partie utilisée: Feuilles. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Banisteriopsis caapi', 'Banisteriopsis caapi (Spruce ex Griseb.) C.V.Morton', 'Malpighiaceae', 'autre', 'Amazonie', 'Boisé, amer (décoction)', 'Harmine, Harmaline, Tétrahydroharmine (β-carbolines IMAO)', 'Base de la boisson Ayahuasca (IMAO)', 'bois', 'Source: https://en.wikipedia.org/wiki/Ayahuasca. Partie utilisée: Liane (écorce). Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Lophophora williamsii', 'Lophophora williamsii (Lem. ex Salm-Dyck) J.M.Coult.', 'Cactaceae', 'autre', 'Mexique, Sud-Ouest des États-Unis', 'Amer, terreux, végétal', 'Mescaline (3-6%), hordénine, tyramine', 'Rituel enthéogène (Huichol, NAC)', NULL, 'Source: https://en.wikipedia.org/wiki/Peyote. Partie utilisée: Cactus entier (boutons séchés). Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Salvia divinorum', 'Salvia divinorum Epling & Játiva', 'Lamiaceae', 'autre', 'Mexique (Oaxaca - Sierra Mazateca)', 'Frais, mentholé, herbacé', 'Salvinorine A (diterpène, agoniste κ-opioïde)', 'Rituel divinatoire Mazatèque', NULL, 'Source: https://en.wikipedia.org/wiki/Salvia_divinorum. Partie utilisée: Feuilles. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Turbina corymbosa', 'Turbina corymbosa (L.) Raf.', 'Convolvulaceae', 'autre', 'Mexique, Amérique centrale', NULL, 'LSA (amide de l''acide lysergique), ergine', 'Rituel divinatoire aztèque (Ololiuqui)', NULL, 'Source: https://en.wikipedia.org/wiki/Turbina_corymbosa. Partie utilisée: Graines. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Heimia salicifolia', 'Heimia salicifolia (Kunth) Link', 'Lythraceae', 'autre', 'Mexique, Amérique centrale', NULL, 'Cryogénine (vertine), lythrine, sinicuichine', 'Boisson rituelle (hallucinations auditives, mémoire)', NULL, 'Source: https://en.wikipedia.org/wiki/Heimia_salicifolia. Partie utilisée: Feuilles. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Datura stramonium', 'Datura stramonium L.', 'Solanaceae', 'autre', 'Mexique, Amérique', 'Désagréable, âcre, narcotique', 'Scopolamine, Atropine, Hyoscyamine (tropanes)', 'Rituel, poison, médecine (très toxique)', NULL, 'Source: https://en.wikipedia.org/wiki/Datura_stramonium. Partie utilisée: Feuilles, graines, fleurs. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Bursera graveolens', 'Bursera graveolens (Kunth) Triana & Planch.', 'Burseraceae', 'bois', 'Amérique du Sud (Pérou, Équateur), Amérique centrale', 'Boisé, citronné, doux, mentholé, balsamique', 'Limonène (60-70%), α-terpinéol, menthofurane', 'Encens purificateur, rituels chamaniques, médecine', NULL, 'Source: https://en.wikipedia.org/wiki/Bursera_graveolens. Partie utilisée: Bois (mort naturellement). Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Bursera copallifera', 'Bursera copallifera (DC.) Bullock', 'Burseraceae', 'resine', 'Mexique', 'Pin, citronné, boisé, frais, résineux', 'α-pinène, β-pinène, limonène, sabinène', 'Encens cérémoniel mésoaméricain, purification', NULL, 'Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC6332072/. Partie utilisée: Résine. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Bursera bipinnata', 'Bursera bipinnata (DC.) Engl.', 'Burseraceae', 'resine', 'Mexique', 'Frais, citronné, léger, propre', 'Monoterpènes, sesquiterpènes', 'Encens cérémoniel (Día de los Muertos)', NULL, 'Source: https://www.shamansmarket.com/blogs/musings/copal-sacred-tree-resin-of-mesoamerica. Partie utilisée: Résine. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Protium heptaphyllum', 'Protium heptaphyllum (Aubl.) Marchand', 'Burseraceae', 'resine', 'Amazonie (Brésil)', 'Frais, boisé, épicé, citronné', 'α-pinène, terpinolène, p-cymène, limonène', 'Encens amazonien, calfeutrage, médecine', 'bois', 'Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC9318482/. Partie utilisée: Résine. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Myroxylon balsamum', 'Myroxylon balsamum (L.) Harms', 'Fabaceae', 'resine', 'Amérique centrale, Amérique du Sud', 'Balsamique, doux, vanillé, cannelle, épicé', 'Benzoate de benzyle, cinnamate de benzyle, vanilline, nérolidol', 'Parfumerie, médecine (cicatrisant), encens', NULL, 'Source: https://en.wikipedia.org/wiki/Myroxylon_balsamum. Partie utilisée: Baume (oléorésine). Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Copaifera officinalis', 'Copaifera officinalis (Jacq.) L.', 'Fabaceae', 'resine', 'Amazonie, Amérique du Sud', 'Boisé, épicé, balsamique, légèrement sucré', 'β-caryophyllène, α-copaène, β-bisabolène', 'Médecine traditionnelle, parfumerie, vernis', 'bois', 'Source: https://en.wikipedia.org/wiki/Copaifera. Partie utilisée: Oléorésine. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Tagetes lucida', 'Tagetes lucida Cav.', 'Asteraceae', 'fleur', 'Mexique, Guatemala', 'Anisé, estragon, doux', 'Estragole, anéthole, méthyleugénol', 'Rituel (poudre à priser avec tabac), culinaire, médicinal', NULL, 'Source: https://en.wikipedia.org/wiki/Tagetes_lucida. Partie utilisée: Feuilles, fleurs. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Vanilla planifolia', 'Vanilla planifolia Jacks. ex Andrews', 'Orchidaceae', 'aromatique', 'Mexique (origine), Madagascar', 'Doux, balsamique, épicé, boisé, crémeux', 'Vanilline (2%), acide vanillique, p-hydroxybenzaldéhyde', 'Arôme alimentaire, parfumerie, médecine aztèque', NULL, 'Source: https://en.wikipedia.org/wiki/Vanilla_planifolia. Partie utilisée: Gousse (fruit fermenté). Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Polianthes tuberosa', 'Polianthes tuberosa L.', 'Amaryllidaceae', 'fleur', 'Mexique (origine)', 'Floral capiteux, narcotique, poudré, crémeux', 'Lactones, salicylate de méthyle, eugénol, géraniol', 'Parfumerie (absolue), ornemental, cérémonies', NULL, 'Source: https://en.wikipedia.org/wiki/Polianthes_tuberosa. Partie utilisée: Fleurs. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Liquidambar styraciflua', 'Liquidambar styraciflua L.', 'Altingiaceae', 'resine', 'Mexique, Amérique centrale, Est des États-Unis', 'Balsamique, doux, ambré, légèrement épicé', 'Acide cinnamique, styrène, vanilline', 'Encens maya (Xochicopal), parfumerie, médecine', NULL, 'Source: https://en.wikipedia.org/wiki/Liquidambar_styraciflua. Partie utilisée: Baume (styrax). Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Silphium sp.', 'Silphium sp.', 'Apiaceae (supposé)', 'autre', 'Cyrénaïque (Libye antique)', 'Fort, âcre, résineux, ail/oignon (supposé)', 'Composés soufrés (supposé), coumarines, résines', 'Contraceptif, aphrodisiaque, parfum, assaisonnement', 'disparition', 'Source: https://en.wikipedia.org/wiki/Silphium. Partie utilisée: Tige, racine, résine (laser). Type: Plante disparue.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Nymphaea ampla', 'Nymphaea ampla (Salisb.) DC.', 'Nymphaeaceae', 'autre', 'Mexique, Amérique centrale, Caraïbes', 'Floral, aquatique, narcotique, doux', 'Aporphine, nuciférine (alcaloïdes)', 'Rituel Maya (psychoactif), iconographie sacrée', 'disparition', 'Source: https://en.wikipedia.org/wiki/Nymphaea_ampla. Partie utilisée: Fleurs, rhizomes. Type: Plante historique.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Orbignya speciosa', 'Attalea speciosa Mart. ex Spreng.', 'Arecaceae', 'autre', 'Brésil (Amazonie, Nordeste)', 'Doux, noix de coco, légèrement sucré', 'Acide laurique, acide myristique', 'Huile cosmétique, alimentation, combustible', 'disparition', 'Source: https://en.wikipedia.org/wiki/Attalea_speciosa. Partie utilisée: Noix (huile). Type: Plante historique.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Theobroma bicolor', 'Theobroma bicolor Bonpl.', 'Malvaceae', 'autre', 'Mexique, Amérique centrale', 'Chocolaté léger, fruité', 'Théobromine (faible), acides gras', 'Boisson cérémonielle maya, cacao secondaire', 'disparition', 'Source: https://en.wikipedia.org/wiki/Theobroma_bicolor. Partie utilisée: Graines. Type: Plante historique.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Quararibea funebris', 'Quararibea funebris (La Llave) Vischer', 'Malvaceae', 'autre', 'Mexique (Oaxaca)', 'Floral intense, épicé, cacao', 'Composés aromatiques non identifiés', 'Aromatisant du cacao aztèque, rituel funéraire', 'disparition', 'Source: https://en.wikipedia.org/wiki/Quararibea_funebris. Partie utilisée: Fleurs. Type: Plante historique.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Cymbopetalum penduliflorum', 'Cymbopetalum penduliflorum (Dunal) Baill.', 'Annonaceae', 'autre', 'Mexique, Guatemala', 'Floral, épicé, poivré', 'Composés aromatiques (non identifiés)', 'Aromatisant du cacao aztèque (Xochinacaztli)', 'disparition', 'Source: https://en.wikipedia.org/wiki/Cymbopetalum_penduliflorum. Partie utilisée: Fleurs (pétales). Type: Plante historique.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Argemone mexicana', 'Argemone mexicana L.', 'Papaveraceae', 'aromatique', 'Mexique, Amérique centrale', 'Amer, âcre', 'Berbérine, protopine, sanguinarine (alcaloïdes isoquinoléiques)', 'Médecine traditionnelle (douleur, inflammation)', NULL, 'Source: https://en.wikipedia.org/wiki/Argemone_mexicana. Partie utilisée: Latex, graines. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Croton lechleri', 'Croton lechleri Müll.Arg.', 'Euphorbiaceae', 'aromatique', 'Amazonie (Pérou, Équateur)', 'Résineux, astringent, légèrement boisé', 'Taspine (alcaloïde), proanthocyanidines, lignanes', 'Cicatrisation, anti-inflammatoire, antiviral', 'bois', 'Source: https://en.wikipedia.org/wiki/Croton_lechleri. Partie utilisée: Latex (résine rouge). Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Uncaria tomentosa', 'Uncaria tomentosa (Willd. ex Schult.) DC.', 'Rubiaceae', 'aromatique', 'Amazonie (Pérou)', 'Boisé, terreux', 'Alcaloïdes oxindoles, glycosides quinoviques', 'Immunostimulant, anti-inflammatoire', 'bois', 'Source: https://en.wikipedia.org/wiki/Uncaria_tomentosa. Partie utilisée: Écorce, racine. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Lippia graveolens', 'Lippia graveolens Kunth', 'Verbenaceae', 'aromatique', 'Mexique, Amérique centrale', 'Épicé, herbacé, origan intense', 'Carvacrol, thymol, p-cymène', 'Culinaire, médecine (antiseptique)', NULL, 'Source: https://en.wikipedia.org/wiki/Lippia_graveolens. Partie utilisée: Feuilles. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Piper auritum', 'Piper auritum Kunth', 'Piperaceae', 'aromatique', 'Mexique, Amérique centrale', 'Anisé, sassafras, épicé, herbacé', 'Safrole, myristicine, eugénol', 'Culinaire (tamales), médecine traditionnelle', NULL, 'Source: https://en.wikipedia.org/wiki/Piper_auritum. Partie utilisée: Feuilles. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, dominant_molecules, traditional_use, climatic_axis, notes, validation_status, created_at, updated_at) 
VALUES ('Chenopodium ambrosioides', 'Dysphania ambrosioides (L.) Mosyakin & Clemants', 'Amaranthaceae', 'aromatique', 'Mexique, Amérique centrale', 'Piquant, camphré, citronné, unique', 'Ascaridole (monoterpène peroxyde), p-cymène, limonène', 'Culinaire (haricots), vermifuge', NULL, 'Source: https://en.wikipedia.org/wiki/Dysphania_ambrosioides. Partie utilisée: Feuilles. Type: Plante.', 'valide', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();