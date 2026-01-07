INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_001',
  'article',
  'Smell of heritage: a framework for the identification, analysis and archival of historic odours',
  2017,
  '[{"lastName":"Bembibre","firstName":"Cecilia"},{"lastName":"Strlič","firstName":"Matija"}]',
  'Heritage Science',
  '10.1186/s40494-016-0114-1',
  'https://www.nature.com/articles/s40494-016-0114-1',
  'heritage_conservation',
  '["olfactory-heritage","framework","archiving","method"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_002',
  'article',
  'From Smelly Buildings to the Scented Past: An Overview of Olfactory Heritage',
  2021,
  '[{"lastName":"Bembibre","firstName":"Cecilia"},{"lastName":"Strlič","firstName":"Matija"}]',
  'Frontiers in Psychology',
  '10.3389/fpsyg.2021.718287',
  'https://www.frontiersin.org/articles/10.3389/fpsyg.2021.718287/full',
  'heritage_conservation',
  '["olfactory-heritage","review","GLAM"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_003',
  'book_chapter',
  'Preserving historic smells: The question of authenticity',
  2021,
  '[{"lastName":"Bembibre","firstName":"Cecilia"},{"lastName":"Strlič","firstName":"Matija"}]',
  'In: Mediality of Smells (edited volume)',
  NULL,
  'https://www.scienceopen.com/book?vid=da163f95-57b8-4fce-9e09-b04b4e1c5fd3',
  'heritage_conservation',
  '["authenticity","ethics","heritage-theory"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_004',
  'book_chapter',
  'Archiving the intangible: preserving smells, historic perfumes and other ways of approaching the scented past',
  2021,
  '[{"lastName":"Bembibre","firstName":"Cecilia"}]',
  'In: IMAGINES – Classical Receptions in the Visual and Performing Arts (Bloomsbury)',
  NULL,
  'https://www.frontiersin.org/articles/10.3389/fpsyg.2021.718287/full',
  'heritage_conservation',
  '["archiving","intangible","historic-perfume"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_005',
  'book',
  'The Anthropology of Smell',
  2023,
  '[{"lastName":"Ramšak","firstName":"Mojca (ed.)"}]',
  'UNESCO / Intangible Cultural Heritage activity publication',
  NULL,
  'https://ich.unesco.org/en/activities/publication-of-the-book-the-anthropology-of-smell-00285',
  'history_ethnobotany',
  '["anthropology","intangible-heritage","olfaction"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_006',
  'book',
  'Smell and the Past: Noses, Archives, Narratives',
  2023,
  '[{"firstName":"(Edited","lastName":"volume)"}]',
  'Open access (OAPEN copy)',
  NULL,
  'https://library.oapen.org/handle/20.500.12657/62912',
  'history_ethnobotany',
  '["history","archives","smell-studies","heritage"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_010',
  'report',
  'The Olfactory Heritage Toolkit (publication + resources)',
  2024,
  '[{"lastName":"Troncy","firstName":"Raphaël"},{"lastName":"Lisena","firstName":"Pasquale"},{"lastName":"Paolin","firstName":"Emma"},{"firstName":"Odeuropa","lastName":"collaborators"}]',
  'Zenodo (Odeuropa project)',
  '10.5281/zenodo.10775277',
  'https://zenodo.org/records/10775277',
  'heritage_conservation',
  '["toolkit","policy","GLAM","documentation"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_011',
  'report',
  'Guidelines on the Use of Smells in GLAMs (Deliverable D6.1)',
  2021,
  '[{"lastName":"Bembibre","firstName":"Cecilia"},{"lastName":"Strlič","firstName":"Matija"},{"firstName":"Odeuropa","lastName":"consortium"}]',
  'Odeuropa project deliverable (PDF)',
  NULL,
  'https://odeuropa.eu/wp-content/uploads/2022/05/D6_1_Guidelines_on_the_Use_of_Smells_in_GLAMs.pdf',
  'heritage_conservation',
  '["guidelines","risk-assessment","museum","archive"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_012',
  'report',
  'Olfactory Storytelling Toolkit: A ''How-To'' Guide for Working with Smells in Museums and Heritage Institutions',
  2023,
  '[{"firstName":"Odeuropa","lastName":"consortium"}]',
  'Zenodo',
  '10.5281/zenodo.10117421',
  'https://zenodo.org/records/10117421',
  'heritage_conservation',
  '["storytelling","museum","toolkit","practice"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_013',
  'website',
  'Heritage Smell Library (project page)',
  2024,
  '[{"firstName":"Odeuropa","lastName":"project"}]',
  'Odeuropa',
  NULL,
  'https://odeuropa.eu/the-heritage-smell-library/',
  'heritage_conservation',
  '["archive","smell-library","heritage-safeguarding"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_014',
  'website',
  'Odeuropa (project overview)',
  2024,
  '[{"firstName":"Odeuropa","lastName":"consortium"}]',
  'Odeuropa',
  NULL,
  'https://odeuropa.eu/',
  'heritage_conservation',
  '["AI","sensory-mining","knowledge-graph","heritage"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_015',
  'website',
  'Odeuropa (EU CORDIS factsheet)',
  2021,
  '[{"firstName":"European","lastName":"Commission"}]',
  'CORDIS',
  NULL,
  'https://cordis.europa.eu/project/id/101004469',
  'heritage_conservation',
  '["project","EU","olfactory-heritage"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_020',
  'article',
  'How can scents enhance the impact of guided museum tours? Towards an impact approach for olfactory museology',
  2022,
  '[{"firstName":"(Authors as per journal","lastName":"record)"}]',
  'Museum Management and Curatorship',
  '10.1080/17458927.2022.2142012',
  'https://www.tandfonline.com/doi/full/10.1080/17458927.2022.2142012',
  'heritage_conservation',
  '["museum","impact","guided-tours","olfactory-museology"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_021',
  'article',
  'Crafting Intentional Scents: Enriching Cultural Heritage with Educational Olfactory Reproductions',
  2024,
  '[{"lastName":"Ehrich","firstName":"Sofia Collette"}]',
  'Amsterdam Museum Journal (PDF)',
  NULL,
  'https://assets.amsterdammuseum.nl/downloads/Crafting-Intentional-Scents_Sofia-Collette-Ehrich-1753812641.pdf',
  'heritage_conservation',
  '["museum","education","olfactory-reproduction"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_022',
  'book_chapter',
  'Intangible Olfactory Heritage in Museum Practice',
  2024,
  '[{"lastName":"Ehrich","firstName":"Sofia Collette"}]',
  'Chapter / olfactory museology (record)',
  NULL,
  'https://www.researchgate.net/publication/383081576_Intangible_Olfactory_Heritage_in_Museum_Practice',
  'heritage_conservation',
  '["museum","ethics","method","olfactory-museology"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_030',
  'website',
  'Osmothèque – The collection',
  2024,
  '[{"firstName":"Osmothèque Conservatoire International des","lastName":"Parfums"}]',
  'Osmothèque',
  NULL,
  'https://www.osmotheque.fr/en/the-collection/',
  'heritage_conservation',
  '["archive","historic-perfumes","reference-library"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_031',
  'article',
  'Inside the largest perfume archive in the world (feature)',
  2024,
  '[{"firstName":"Financial","lastName":"Times"}]',
  'Financial Times',
  NULL,
  'https://www.ft.com/content/826cbed2-e8f4-4667-85d3-013872065483',
  'heritage_conservation',
  '["archive","osmotheque","institution"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_040',
  'article',
  'Archaeometric Identification of a Perfume from Roman Times',
  2023,
  '[{"lastName":"Cosano","firstName":"Daniel"},{"lastName":"Román","firstName":"Juan Diego"},{"lastName":"Lafont","firstName":"Fernando"},{"lastName":"Ruiz","firstName":"José Rafael"}]',
  'Heritage (MDPI)',
  '10.3390/heritage6060236',
  'https://doi.org/10.3390/heritage6060236',
  'history_ethnobotany',
  '["archaeochemistry","perfume","GC-MS","Roman"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_041',
  'article',
  'Ancient Egyptian Mummified Bodies: Cross-Disciplinary Analysis of Their Smell',
  2025,
  '[{"firstName":"(Authors as per JACS","lastName":"paper"},{"firstName":"UCL/University of Ljubljana","lastName":"team)"}]',
  'Journal of the American Chemical Society',
  '10.1021/jacs.4c15769',
  'https://pubs.acs.org/doi/10.1021/jacs.4c15769',
  'history_ethnobotany',
  '["mummies","non-invasive","GC-MS-O","conservation"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_042',
  'dataset',
  'Ancient Egyptian Mummified Bodies: Cross-Disciplinary Analysis of Their Smell (dataset)',
  2025,
  '[{"firstName":"ACS /","lastName":"authors"}]',
  'ACS Figshare',
  NULL,
  'https://acs.figshare.com/articles/dataset/Ancient_Egyptian_Mummified_Bodies_Cross-Disciplinary_Analysis_of_Their_Smell/28382393',
  'analytical_chemistry',
  '["dataset","VOC","heritage-science"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_043',
  'website',
  'Scientifically sniffing ancient Egyptian mummified bodies (PressPac)',
  2025,
  '[{"firstName":"American Chemical","lastName":"Society"}]',
  'ACS Pressroom',
  NULL,
  'https://www.acs.org/pressroom/presspacs/2025/february/scientifically-sniffing-ancient-egyptian-mummified-bodies.html',
  'history_ethnobotany',
  '["press","summary","mummies"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_050',
  'article',
  'Material Degradomics: On the Smell of Old Books',
  2009,
  '[{"lastName":"Strlič","firstName":"Matija"},{"lastName":"Thomas","firstName":"Jacob"},{"lastName":"Trafela","firstName":"Tanja"},{"firstName":"et","lastName":"al."}]',
  'Analytical Chemistry',
  '10.1021/ac9016049',
  'https://doi.org/10.1021/ac9016049',
  'analytical_chemistry',
  '["books","VOC","degradomics","GC-MS"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_051',
  'article',
  'Classifying Degraded Modern Polymeric Museum Artefacts by Their Smell',
  2018,
  '[{"lastName":"Curran","firstName":"Katherine"},{"lastName":"Underhill","firstName":"Mark"},{"lastName":"Grau-Bové","firstName":"Josep"},{"lastName":"Fearn","firstName":"Tom"},{"lastName":"Strlič","firstName":"Matija"}]',
  'Angewandte Chemie International Edition',
  '10.1002/anie.201712278',
  'https://doi.org/10.1002/anie.201712278',
  'heritage_conservation',
  '["polymers","museum","VOC","diagnostics"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_052',
  'article',
  'Polymers and volatiles: Using VOC analysis for the conservation of plastic and rubber objects',
  2014,
  '[{"lastName":"Curran","firstName":"Katherine"},{"lastName":"Strlič","firstName":"Matija"}]',
  'Studies in Conservation',
  '10.1179/2047058413Y.0000000125',
  'https://www.tandfonline.com/doi/full/10.1179/2047058413Y.0000000125',
  'heritage_conservation',
  '["conservation","plastics","rubber","VOC"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_053',
  'article',
  'Volatile Organic Compounds (VOCs) in Heritage Environments and Their Analysis: A Review',
  2024,
  '[{"lastName":"Paolin","firstName":"Emma"},{"firstName":"et","lastName":"al."}]',
  'Applied Sciences (MDPI)',
  '10.3390/app14114620',
  'https://doi.org/10.3390/app14114620',
  'heritage_conservation',
  '["review","indoor-air","GLAM","VOCs"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_054',
  'article',
  'Measurement of volatile organic compounds (VOCs) in libraries and archives in Florence (Italy)',
  2016,
  '[{"lastName":"Cincinelli","firstName":"Alessandra"},{"lastName":"Martellini","firstName":"T."},{"firstName":"et","lastName":"al."}]',
  'Science of the Total Environment',
  NULL,
  'https://www.sciencedirect.com/science/article/pii/S0048969716316552',
  'analytical_chemistry',
  '["libraries","archives","indoor-air","VOCs"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_055',
  'article',
  'Evaluating volatile organic compounds from Chinese traditional handmade paper by SPME-GC/MS',
  2021,
  '[{"lastName":"Ding","firstName":"Li"},{"lastName":"Yang","firstName":"Qin"},{"lastName":"Liu","firstName":"Jianhui"},{"firstName":"et","lastName":"al."}]',
  'Heritage Science',
  '10.1186/s40494-021-00626-w',
  'https://doi.org/10.1186/s40494-021-00626-w',
  'analytical_chemistry',
  '["paper","SPME","GC-MS","markers"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_056',
  'article',
  'Classifying degraded modern polymeric museum artefacts by their smell (PubMed record)',
  2018,
  '[{"lastName":"Curran","firstName":"Katherine"},{"firstName":"et","lastName":"al."}]',
  'PubMed record (Angew Chem Int Ed)',
  '10.1002/anie.201712278',
  'https://pubmed.ncbi.nlm.nih.gov/29405559/',
  'analytical_chemistry',
  '["record","polymer","VOC"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_057',
  'article',
  'Analysis of Volatile Organic Compounds (VOCs) from Two Historical Books Preserved at the Biblioteca Capitolare of Busto Arsizio (Italy)',
  2025,
  '[{"lastName":"Chiodini","firstName":"C."},{"firstName":"et","lastName":"al."}]',
  'Open access via PMC',
  NULL,
  'https://pmc.ncbi.nlm.nih.gov/articles/PMC12156301/',
  'analytical_chemistry',
  '["books","HS-SPME","GC-MS","non-invasive"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_058',
  'website',
  'Book and Paper—Volatile Organic Compound Testing (project page)',
  2021,
  '[{"firstName":"Library of Congress Preservation","lastName":"Directorate"}]',
  'Library of Congress',
  NULL,
  'https://www.loc.gov/preservation/scientists/projects/book_paper.html',
  'analytical_chemistry',
  '["institution","protocols","VOC","paper"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_059',
  'website',
  'Volatile Organic Compounds (VOCs) – The Scent of Our Collections',
  2021,
  '[{"firstName":"Library of Congress Preservation","lastName":"blog"}]',
  'Library of Congress Blog',
  NULL,
  'https://blogs.loc.gov/preservation/2021/07/volatile-organic-compounds-vocs/',
  'analytical_chemistry',
  '["public-explainer","VOC","collections"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_070',
  'conference',
  'Smelling the past: A case study for identification, analysis and archival of historic potpourri as a heritage smell',
  2017,
  '[{"lastName":"Bembibre","firstName":"Cecilia"},{"lastName":"Barratt","firstName":"Siobhan"},{"lastName":"Vera","firstName":"Luciano"},{"lastName":"Strlič","firstName":"Matija"}]',
  'ICOM-CC 18th Triennial Conference Preprints (Copenhagen 2017)',
  NULL,
  'https://www.icom-cc-publications-online.org/1782/Smelling-the-past--A-case-study-for-identification-analysis-and-archival-of-historic-potpourri-as-a-heritage-smell',
  'analytical_chemistry',
  '["potpourri","GC-MS-O","sensory-panel","archiving"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_071',
  'other',
  'Smelling the past (UCL Discovery record)',
  2017,
  '[{"lastName":"Bembibre","firstName":"Cecilia"},{"firstName":"et","lastName":"al."}]',
  'UCL Discovery (repository)',
  NULL,
  'https://discovery.ucl.ac.uk/id/eprint/1576549/',
  'heritage_conservation',
  '["repository","potpourri","heritage-smell"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();

INSERT INTO bibliography_entries (
  entry_key, entry_type, title, year, 
  authors, journal, doi, url, 
  research_domain, tags, 
  is_verified, is_core_reference,
  created_at, updated_at
) VALUES (
  'oh_080',
  'article',
  'The smell of history (feature on chemistry + heritage smells)',
  2022,
  '[{"lastName":"Notman","firstName":"Nina"}]',
  'Chemistry World',
  NULL,
  'https://www.chemistryworld.com/features/the-smell-of-history/4016790.article',
  'heritage_conservation',
  '["overview","chemistry","heritage"]',
  1,
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  year = VALUES(year),
  authors = VALUES(authors),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  research_domain = VALUES(research_domain),
  tags = VALUES(tags),
  updated_at = NOW();