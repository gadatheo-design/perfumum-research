-- Script d'import des sources bibliographiques pour PERFUMUM
-- Date: 07 janvier 2026

-- === interactions-tabac-cannabis-parfum.md ===

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, volume, number, pages, doi, research_domain, abstract, keywords, read_status)
VALUES ('russo2011', 'article', 'Taming THC: potential cannabis synergy and phytocannabinoid-terpenoid entourage effects', 'Russo, E.B.', 2011, 'British Journal of Pharmacology', '163', '7', '1344-1364', '10.1111/j.1476-5381.2011.01238.x', 'tabac_cannabis', 'Étude fondamentale sur l''effet entourage entre cannabinoïdes et terpénoïdes du cannabis.', '["cannabis", "terpènes", "effet entourage", "THC", "CBD", "synergie"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, volume, pages, doi, research_domain, abstract, keywords, read_status)
VALUES ('marchini2014', 'article', 'Multidimensional analysis of cannabis volatile constituents: Identification of 5,5-dimethyl-1-vinylbicyclo[2.1.1]hexane as a volatile marker of hashish', 'Marchini, M. et al.', 2014, 'Journal of Chromatography A', '1370', '200-215', '10.1016/j.chroma.2014.10.037', 'chimie_olfactive', 'Découverte du hashishene comme marqueur volatil unique du hashish marocain.', '["hashishene", "cannabis", "hash", "terpènes", "chromatographie"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, volume, pages, research_domain, abstract, keywords, read_status)
VALUES ('mookherjee1990', 'article', 'Tobacco Constituents: Their Importance in Flavor and Fragrance Chemistry', 'Mookherjee, B.D. & Wilson, R.A.', 1990, 'Perfumer & Flavorist', '15', '27-49', 'formulation', 'Étude exhaustive des constituants aromatiques du tabac et leur importance en parfumerie.', '["tabac", "parfumerie", "arômes", "terpènes", "damascones"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, volume, pages, doi, research_domain, abstract, keywords, read_status)
VALUES ('booth2019', 'article', 'Terpenes in Cannabis sativa – From plant genome to humans', 'Booth, J.K. et al.', 2019, 'Plant Science', '284', '67-72', '10.1016/j.plantsci.2019.03.022', 'botanique', 'Revue complète des terpènes du cannabis, de la génomique végétale aux effets humains.', '["cannabis", "terpènes", "génomique", "biosynthèse"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, doi, research_domain, abstract, keywords, read_status)
VALUES ('raz2023', 'article', 'Selected cannabis terpenes synergize with THC to produce increased CB1 receptor activation', 'Raz, N. et al.', 2023, 'Biochemical Pharmacology', '10.1016/j.bcp.2023.115548', 'tabac_cannabis', 'Démonstration de la synergie entre terpènes du cannabis et THC sur les récepteurs CB1.', '["cannabis", "terpènes", "THC", "CB1", "synergie"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

-- === plantes-aromatiques-recherche.md ===

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, doi, pmid, research_domain, abstract, keywords, read_status)
VALUES ('vicuna2010', 'article', 'Chemical composition of the essential oil of Lippia origanoides from Colombia', 'Vicuña, G.C. et al.', 2010, 'Journal of Ethnopharmacology', '10.1016/j.jep.2009.10.004', '19837152', 'botanique', 'Analyse de la composition chimique de l''huile essentielle de Lippia origanoides de Colombie.', '["Lippia origanoides", "Colombie", "huile essentielle", "thymol", "carvacrol"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, pmid, research_domain, abstract, keywords, read_status)
VALUES ('escobar2010', 'article', 'Chemical composition and antiprotozoal activities of Colombian Lippia spp essential oils', 'Escobar, P. et al.', 2010, 'Memórias do Instituto Oswaldo Cruz', '20428679', 'botanique', 'Composition chimique et activités antiprotozoaires des huiles essentielles de Lippia colombiennes.', '["Lippia", "Colombie", "huile essentielle", "antiprotozoaire"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, doi, research_domain, abstract, keywords, read_status)
VALUES ('oliveira2007', 'article', 'Chemical composition of Lippia origanoides essential oil', 'Oliveira, D.R. et al.', 2007, 'Food Chemistry', '10.1016/j.foodchem.2006.01.017', 'chimie_olfactive', 'Étude de la composition de l''huile essentielle de Lippia origanoides.', '["Lippia origanoides", "huile essentielle", "composition chimique"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, doi, research_domain, abstract, keywords, read_status)
VALUES ('regalado2011', 'article', 'Chemical composition of Tagetes lucida essential oil', 'Regalado, E.L. et al.', 2011, 'Journal of Essential Oil Research', '10.1080/10412905.2011.9700485', 'chimie_olfactive', 'Composition chimique de l''huile essentielle de Tagetes lucida.', '["Tagetes lucida", "huile essentielle", "estragole", "anéthole"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, doi, research_domain, abstract, keywords, read_status)
VALUES ('bicchi1997', 'article', 'Essential oil composition of Tagetes lucida', 'Bicchi, C. et al.', 1997, 'Flavour and Fragrance Journal', '10.1002/(SICI)1099-1026', 'chimie_olfactive', 'Analyse de la composition de l''huile essentielle de Tagetes lucida.', '["Tagetes lucida", "huile essentielle", "composition"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, pmid, research_domain, abstract, keywords, read_status)
VALUES ('caballero2022', 'article', 'Chemical composition and biological activities of Tagetes lucida', 'Caballero-Gallardo, K. et al.', 2022, 'Molecules', '35807352', 'botanique', 'Composition chimique et activités biologiques de Tagetes lucida.', '["Tagetes lucida", "activités biologiques", "composition chimique"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, doi, research_domain, abstract, keywords, read_status)
VALUES ('bassole2003', 'article', 'Essential oil composition of Lippia multiflora from Burkina Faso', 'Bassolé, I.H.N. et al.', 2003, 'Phytochemistry', '10.1016/S0031-9422(02)00477-6', 'botanique', 'Composition de l''huile essentielle de Lippia multiflora du Burkina Faso.', '["Lippia multiflora", "Burkina Faso", "huile essentielle", "thymol"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, doi, research_domain, abstract, keywords, read_status)
VALUES ('bassole2010', 'article', 'Essential oils in combination and their antimicrobial properties', 'Bassolé, I.H.N. et al.', 2010, 'Molecules', '10.3390/molecules15117825', 'chimie_olfactive', 'Propriétés antimicrobiennes des huiles essentielles en combinaison.', '["huiles essentielles", "antimicrobien", "synergie"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, doi, research_domain, abstract, keywords, read_status)
VALUES ('bayala2014', 'article', 'Chemical composition and antimicrobial activity of essential oils from Lippia multiflora', 'Bayala, B. et al.', 2014, 'PLoS ONE', '10.1371/journal.pone.0092122', 'botanique', 'Composition chimique et activité antimicrobienne de Lippia multiflora.', '["Lippia multiflora", "antimicrobien", "huile essentielle"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, research_domain, abstract, keywords, read_status)
VALUES ('bassole2020', 'article', 'Chemical composition of Ocimum canum essential oil from Burkina Faso', 'Bassolé, I.H.N. et al.', 2020, 'Global Journal of Food and Agricultural Sciences', 'botanique', 'Composition de l''huile essentielle d''Ocimum canum du Burkina Faso.', '["Ocimum canum", "Burkina Faso", "huile essentielle", "1,8-cinéole"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, research_domain, abstract, keywords, read_status)
VALUES ('tchoumbougnang2006', 'article', 'Essential oil composition of Ocimum canum from Cameroon', 'Tchoumbougnang, F. et al.', 2006, 'Journal of Essential Oil Research', 'botanique', 'Composition de l''huile essentielle d''Ocimum canum du Cameroun.', '["Ocimum canum", "Cameroun", "huile essentielle"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, doi, research_domain, abstract, keywords, read_status)
VALUES ('dasilva2018', 'article', 'Chemical composition of Ocimum canum essential oil from Brazil', 'da Silva, V.D. et al.', 2018, 'Industrial Crops and Products', '10.1016/j.indcrop.2018.04.025', 'botanique', 'Composition de l''huile essentielle d''Ocimum canum du Brésil.', '["Ocimum canum", "Brésil", "huile essentielle"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

-- === recherche-elargie-sources.md ===

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, doi, url, research_domain, abstract, keywords, read_status)
VALUES ('kumar2018', 'article', 'AromaDb: A Database of Medicinal and Aromatic Plant''s Aroma Molecules With Phytochemistry and Therapeutic Potentials', 'Kumar, Y. et al.', 2018, 'Frontiers in Plant Science', '10.3389/fpls.2018.01081', 'https://aromadb.cimapbioinfo.in/', 'methodologie', 'Base de données de 1523 molécules aromatiques de 233 plantes médicinales.', '["AromaDb", "base de données", "molécules aromatiques", "plantes médicinales"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, doi, research_domain, abstract, keywords, read_status)
VALUES ('sharma2022', 'article', 'OlfactionBase: a repository to explore odors, odorants, olfactory receptors and odorant-receptor interactions', 'Sharma, A. et al.', 2022, 'Nucleic Acids Research', '10.1093/nar/gkab763', 'neurologie_olfactive', 'Base de données sur les mécanismes moléculaires de l''olfaction.', '["OlfactionBase", "récepteurs olfactifs", "odorants", "base de données"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, doi, pmid, research_domain, abstract, keywords, read_status)
VALUES ('dunkel2008', 'article', 'SuperScent—a database of flavors and scents', 'Dunkel, M. et al.', 2008, 'Nucleic Acids Research', '10.1093/nar/gkn695', '18931377', 'methodologie', 'Base de données de composés aromatiques et leurs propriétés olfactives.', '["SuperScent", "base de données", "arômes", "parfums"]', 'lu')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, research_domain, abstract, keywords, read_status)
VALUES ('elmernissi2023', 'article', 'Indigenous knowledge of traditional aromatic plants', 'El-Mernissi, Y. et al.', 2023, 'Journal of Ethnobiology and Ethnomedicine', 'ethnobotanique', 'Documentation des connaissances indigènes sur les plantes aromatiques traditionnelles.', '["ethnobotanique", "plantes aromatiques", "savoirs traditionnels"]', 'a_lire')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, research_domain, abstract, keywords, read_status)
VALUES ('zouraris2025', 'article', 'EthnoHERBS: A multidisciplinary initiative integrating traditional knowledge and chemistry', 'Zouraris, D. et al.', 2025, 'Journal of Ethnopharmacology', 'ethnobotanique', 'Initiative multidisciplinaire intégrant savoirs traditionnels et chimie des plantes aromatiques.', '["EthnoHERBS", "ethnobotanique", "chimie", "savoirs traditionnels"]', 'a_lire')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, research_domain, abstract, keywords, read_status)
VALUES ('chaachouay2023', 'article', 'Ethnobotany, ethnopharmacology and traditional uses of aromatic plants', 'Chaachouay, N. et al.', 2023, 'Journal of Ethnopharmacology', 'ethnobotanique', 'Revue sur l''ethnobotanique et les usages traditionnels des plantes aromatiques.', '["ethnobotanique", "ethnopharmacologie", "usages traditionnels"]', 'a_lire')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

-- === Bases de données en ligne (online) ===

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, url, research_domain, abstract, keywords, read_status)
VALUES ('aromadb_database', 'online', 'AromaDb - Database of Medicinal and Aromatic Plant''s Aroma Molecules', 'CSIR-CIMAP', 2018, 'https://aromadb.cimapbioinfo.in/', 'methodologie', 'Base de données de 1523 molécules aromatiques, 233 plantes, 510 types de fragrances.', '["base de données", "molécules aromatiques", "IUPAC", "structures 3D"]', 'consulte')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, url, research_domain, abstract, keywords, read_status)
VALUES ('m2or_database', 'online', 'M2OR - Molecule to Olfactory Receptor Database', 'ChemSensim', 2023, 'https://m2or.chemsensim.fr/', 'neurologie_olfactive', 'Base de données de 771 molécules, 1402 récepteurs olfactifs, 77611 expériences.', '["récepteurs olfactifs", "molécules", "bioassay", "olfaction"]', 'consulte')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, url, research_domain, abstract, keywords, read_status)
VALUES ('predo3_database', 'online', 'Pred-O3 - Odor Prediction Database', 'Université Paris Diderot', 2020, 'https://odor.rpbs.univ-paris-diderot.fr/', 'neurologie_olfactive', 'Base de données de 5802 composés chimiques avec odeurs connues, 385 récepteurs.', '["prédiction odeurs", "structure moléculaire", "récepteurs olfactifs"]', 'consulte')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, url, research_domain, abstract, keywords, read_status)
VALUES ('rifm_database', 'online', 'RIFM Database - Research Institute for Fragrance Materials', 'RIFM', 2024, 'https://rifm.org/rifm-database/', 'reglementation', 'Base de données de plus de 7000 matériaux avec 80000+ références toxicologiques.', '["toxicologie", "sécurité", "parfumerie", "RIFM"]', 'consulte')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, url, research_domain, abstract, keywords, read_status)
VALUES ('ifra_transparency', 'online', 'IFRA Transparency List', 'IFRA', 2024, 'https://ifrafragrance.org/transparency-list', 'reglementation', 'Liste de transparence des ingrédients utilisés en parfumerie.', '["IFRA", "réglementation", "ingrédients", "parfumerie"]', 'consulte')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, url, research_domain, abstract, keywords, read_status)
VALUES ('goodscents_database', 'online', 'The Good Scents Company Information System', 'The Good Scents Company', 2024, 'https://www.thegoodscentscompany.com/', 'formulation', 'Base de données commerciale pour l''industrie des arômes et parfums.', '["arômes", "parfums", "industrie", "données commerciales"]', 'consulte')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);

INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, url, research_domain, abstract, keywords, read_status)
VALUES ('fragrance_wheel', 'online', 'Fragrance Wheel - Michael Edwards Classification', 'Edwards, Michael', 2020, 'https://www.fragrancesoftheworld.com/', 'formulation', 'Classification des familles olfactives en 4 familles principales et 14 sous-familles.', '["classification", "familles olfactives", "fragrance wheel"]', 'consulte')
ON DUPLICATE KEY UPDATE title=VALUES(title), authors=VALUES(authors), year=VALUES(year);
