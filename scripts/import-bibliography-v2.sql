INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'OMX-001',
  'article',
  'Genomic mechanism of aroma terpenoids biosynthesis in plants',
  '(review)',
  2025,
  'Plant Communications (ScienceDirect)',
  NULL,
  'https://www.sciencedirect.com/science/article/pii/S2090123225010240',
  'Omics / Chemodiversity',
  '["terpenes","terpene synthases","genomics","review"]',
  'Recent review framing TPS gene family evolution + genomics-driven aroma breeding.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'OMX-002',
  'article',
  'Genomic Analysis of Terpene Synthase Family and Functional Characterization of Three Novel Genes in Sweet Orange',
  'Frontiers in Plant Science (article team)',
  2017,
  'Frontiers in Plant Science',
  '10.3389/fpls.2017.01481',
  'https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2017.01481/full',
  'Omics / Chemodiversity',
  '["TPS","citrus","functional genomics"]',
  'Concrete TPS family mapping + functional assays; useful template for ''olfactory genomics'' pages.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'OMX-003',
  'article',
  'Pangenome Identification and Analysis of Terpene Synthase Gene Family in Gossypium',
  'International Journal of Molecular Sciences (article team)',
  2024,
  'International Journal of Molecular Sciences',
  NULL,
  'https://www.mdpi.com/1422-0067/25/17/9677',
  'Omics / Chemodiversity',
  '["pangenome","TPS","chemotypes"]',
  'Shows how gene-based pangenomes expose TPS presence/absence variation (pattern for cannabis/tabac chemotype drift).',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'HBT-001',
  'article',
  'Hundred Fifty Years of Herbarium Collections Provide a Reliable Resource of Volatile Terpenoid Profiles Showing Strong Species Effect in Four Medicinal Species of Salvia Across the Mediterranean',
  'Frontiers in Plant Science (article team)',
  2018,
  'Frontiers in Plant Science',
  '10.3389/fpls.2018.01877',
  'https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2018.01877/full',
  'Herbarium / Time-series metabolomics',
  '["herbarium","volatiles","terpenoids","time-series"]',
  'Flagship evidence that herbarium specimens can retain interpretable volatile/terpenoid signals over ~150 years.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'HER-001',
  'article',
  'Archaeometric Identification of a Perfume from Roman Times',
  'Cosano et al.',
  2023,
  'Heritage (MDPI)',
  '10.3390/heritage6060236',
  'https://www.mdpi.com/2571-9408/6/6/236',
  'Heritage science / Lost perfumes',
  '["archaeochemistry","GC-MS","patchouli","Roman"]',
  'Model ''resurrection'' workflow: residue analysis + comparison to standards to infer composition.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DIG-001',
  'article',
  'Digital smell technologies for the built environment: Evaluating a novel workflow to integrate smell into VR for multisensory environmental assessment',
  'Building and Environment (article team)',
  2025,
  'Building and Environment',
  NULL,
  'https://www.sciencedirect.com/science/article/pii/S0360132325000903',
  'Digital smell / Immersive',
  '["VR","olfaction","built environment","multisensory"]',
  'Practical pipeline for olfactory VR experimentation; relevant for AXE VR + ''chimie de l’espace''.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DIG-002',
  'article',
  'An olfactory display for virtual reality glasses',
  '(authors in PMC)',
  2022,
  'PMC full text',
  NULL,
  'https://pmc.ncbi.nlm.nih.gov/articles/PMC8919918/',
  'Digital smell / Hardware',
  '["wearable olfactory display","VR","software service"]',
  'Wearable olfactory display + developer control service; good constraints/UX reference.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DIG-003',
  'article',
  'Audio-visual-olfactory immersive digital nature exposure for stress reduction',
  'Frontiers in Virtual Reality (article team)',
  2024,
  'Frontiers in Virtual Reality',
  '10.3389/frvir.2024.1252539',
  'https://www.frontiersin.org/journals/virtual-reality/articles/10.3389/frvir.2024.1252539/full',
  'Digital smell / Applied',
  '["olfaction","VR","wellbeing","multisensory"]',
  'Applied multisensory VR with odor; useful for evaluation protocols and study design.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'CIT-001',
  'preprint',
  'Smell Pittsburgh: Engaging Community Citizen Science for Air Quality',
  'Hsu et al.',
  2019,
  'arXiv',
  NULL,
  'https://arxiv.org/abs/1912.11936',
  'Citizen science / Smell mapping',
  '["odor reports","mapping","citizen science","air quality"]',
  'Canonical smell-reporting pipeline (mobile app + map + public data).',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'CIT-002',
  'article',
  'Smell Pittsburgh: Engaging Community Citizen Science for Air Quality',
  'Hsu et al.',
  2020,
  'ACM',
  '10.1145/3369397',
  'https://dl.acm.org/doi/fullHtml/10.1145/3369397',
  'Citizen science / Smell mapping',
  '["HCI","citizen science","odors","notifications"]',
  'Peer-reviewed version; includes design/evaluation details useful for product specs.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'BIO-001',
  'article',
  'Efforts toward Ambergris Biosynthesis',
  'ACS (article team)',
  2023,
  'ACS Chem & Bio Engineering',
  '10.1021/cbe.3c00083',
  'https://pubs.acs.org/doi/10.1021/cbe.3c00083',
  'Biotech / Conservation substitutes',
  '["ambergris","ambrein","ambroxide","biosynthesis"]',
  'Review of biosynthetic routes to ambrein/ambroxide (conservation-friendly substitution).',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'BIO-002',
  'article',
  'Engineering yeast for high-level production of diterpenoid sclareol',
  'Metabolic Engineering Communications (article team)',
  2022,
  'Metabolic Engineering Communications',
  NULL,
  'https://www.sciencedirect.com/science/article/abs/pii/S1096717622001379',
  'Biotech / Sustainable feedstocks',
  '["yeast","sclareol","ambrox","metabolic engineering"]',
  'Industrial-grade example of making fragrance precursors via engineered yeast.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DAT-001',
  'article',
  'Sharing and community curation of mass spectrometry data with GNPS',
  'Wang et al.',
  2017,
  'Nature Biotechnology (PMC full text)',
  NULL,
  'https://pmc.ncbi.nlm.nih.gov/articles/PMC5321674/',
  'Data infra / Metabolomics',
  '["GNPS","molecular networking","MS/MS","community curation"]',
  'Core reference for GNPS as platform and social curation model.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DAT-002',
  'website',
  'GNPS — Global Natural Products Social Molecular Networking (platform)',
  'GNPS/UCSD',
  2025,
  'GNPS website',
  NULL,
  'https://gnps.ucsd.edu/',
  'Data infra / Metabolomics',
  '["platform","workflow","libraries"]',
  'Primary platform entry point for community MS data + molecular networking.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DAT-003',
  'article',
  'MassBank: an open and FAIR mass spectral data resource',
  'Nucleic Acids Research (article team)',
  2025,
  'Nucleic Acids Research',
  '10.1093/nar/gkaf1193',
  'https://academic.oup.com/nar/advance-article/doi/10.1093/nar/gkaf1193/8321203',
  'Data infra / Spectral libraries',
  '["MassBank","FAIR","spectral library"]',
  'Up-to-date description of MassBank as FAIR resource; strong for collaborator onboarding.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DAT-004',
  'website',
  'MassBank EU (spectral library)',
  'MassBank',
  2025,
  'MassBank EU',
  NULL,
  'https://massbank.eu/MassBank/',
  'Data infra / Spectral libraries',
  '["open spectral library","metabolomics"]',
  'Open spectral records; useful for small-molecule identification and linking to external IDs.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DAT-005',
  'website',
  'MassBank of North America (MoNA)',
  'Fiehn Lab / UC Davis',
  2025,
  'MoNA',
  NULL,
  'https://mona.fiehnlab.ucdavis.edu/',
  'Data infra / Spectral libraries',
  '["spectral records","querying"]',
  'Metadata-centric spectral repository; complements MassBank EU.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DAT-006',
  'article',
  'MetaboLights: open data repository for metabolomics',
  'Yurekten et al.',
  2024,
  'Nucleic Acids Research',
  NULL,
  'https://academic.oup.com/nar/article/52/D1/D640/7424432',
  'Data infra / Repositories',
  '["MetaboLights","EMBL-EBI","metabolomics repository"]',
  'Canonical cite for MetaboLights (ELIXIR-aligned metabolomics deposition).',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DAT-007',
  'website',
  'Metabolomics Workbench — National Metabolomics Data Repository (NIH)',
  'Metabolomics Workbench',
  2025,
  'Metabolomics Workbench',
  NULL,
  'https://www.metabolomicsworkbench.org/',
  'Data infra / Repositories',
  '["repository","protocols","standards"]',
  'Major US repository including protocols/tutorials; includes how-to-cite guidance.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DAT-008',
  'article',
  'Metabolomics Workbench: An international repository for metabolomics data and metadata',
  'Sud et al.',
  2016,
  'Nucleic Acids Research',
  '10.1093/nar/gkv1042',
  'https://academic.oup.com/nar/article/44/D1/D463/2502588',
  'Data infra / Repositories',
  '["repository","metabolomics","standards"]',
  'Foundational paper describing Metabolomics Workbench scope and tooling.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'CHEM-001',
  'article',
  'PubChem 2019 update: improved access to chemical data',
  'Kim et al.',
  2019,
  'Nucleic Acids Research',
  '10.1093/nar/gky1033',
  'https://academic.oup.com/nar/article/47/D1/D1102/5146201',
  'Chem info infra',
  '["PubChem","chemical database","API"]',
  'Canonical cite for PubChem database and programmatic access.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'CHEM-002',
  'website',
  'PubChem — Citation Guidelines',
  'NIH/NCBI',
  2025,
  'PubChem',
  NULL,
  'https://pubchem.ncbi.nlm.nih.gov/docs/citation-guidelines',
  'Chem info infra',
  '["citation","database usage"]',
  'Guideline for citing PubChem database and records.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'CHEM-003',
  'article',
  'GenBank',
  'Sayers et al.',
  2022,
  'Nucleic Acids Research',
  NULL,
  'https://academic.oup.com/nar/article/50/D1/D161/6447240',
  'Genomics infra',
  '["GenBank","sequences","NCBI"]',
  'General cite for GenBank as nucleotide sequence repository.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'CHEM-004',
  'website',
  'NIST MS Search Program (demo, documentation, AMDIS)',
  'NIST',
  2025,
  'NIST Mass Spectrometry Data Center',
  NULL,
  'https://chemdata.nist.gov/mass-spc/ms-search/',
  'Chem analytics tooling',
  '["GC-MS identification","libraries","AMDIS"]',
  'Entry point for NIST MS Search + AMDIS (useful for reproducible GC-MS workflows).',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'TAX-001',
  'website',
  'Plants of the World Online (POWO)',
  'Royal Botanic Gardens, Kew',
  2025,
  'Kew Science',
  NULL,
  'https://powo.science.kew.org/',
  'Taxonomy & distribution',
  '["taxonomy","plant names","distribution","Kew"]',
  'Botanical backbone for plant entities (IDs + taxonomy + distribution).',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'TAX-002',
  'website',
  'GBIF — Global Biodiversity Information Facility',
  'GBIF',
  2025,
  'GBIF portal',
  NULL,
  'https://www.gbif.org/',
  'Taxonomy & distribution',
  '["occurrence data","biodiversity","APIs"]',
  'Occurrence backbone for mapping plant distributions and ecological context.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'TAX-003',
  'website',
  'GBIF API Reference (OpenAPI documentation)',
  'GBIF',
  2025,
  'GBIF Technical Documentation',
  NULL,
  'https://techdocs.gbif.org/en/openapi/',
  'Taxonomy & distribution',
  '["API","occurrence downloads"]',
  'Spec for programmatic harvesting of occurrence data; key for dev integration.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'TXT-001',
  'software',
  'GROBID — Extract and structure scholarly documents (PDF → TEI)',
  'kermitt2 et al.',
  2025,
  'GitHub',
  NULL,
  'https://github.com/kermitt2/grobid',
  'Ethnobotany computation / Text mining',
  '["PDF parsing","TEI","references","extraction"]',
  'Core building block for your corpus pipeline (papers/books → structured references/entities).',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'TXT-002',
  'website',
  'OpenAlex — The open catalog to the global research system',
  'OpenAlex',
  2025,
  'OpenAlex',
  NULL,
  'https://openalex.org/',
  'Ethnobotany computation / Scholarly graph',
  '["scholarly metadata","API","discovery"]',
  'Open scholarly graph for automated bibliographic expansion + enrichment.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'TXT-003',
  'website',
  'OpenAlex technical documentation (API + snapshots)',
  'OpenAlex',
  2025,
  'OpenAlex Docs',
  NULL,
  'https://docs.openalex.org/',
  'Ethnobotany computation / Scholarly graph',
  '["API","harvesting","snapshots"]',
  'Developer entry point for harvesting metadata and linking works/authors/topics.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'OLF-001',
  'article',
  'Pyrfume: A window to the world''s olfactory data',
  'Scientific Data (article team)',
  2024,
  'Scientific Data',
  NULL,
  'https://www.nature.com/articles/s41597-024-04051-z',
  'Olfaction datasets',
  '["Pyrfume","odor datasets","standards"]',
  'Unified framework for stimulus-linked olfaction datasets across species/modalities.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'OLF-002',
  'website',
  'Pyrfume-Data design scheme',
  'Pyrfume',
  2025,
  'pyrfume.org',
  NULL,
  'https://pyrfume.org/pyrfume/design-scheme.html',
  'Olfaction datasets',
  '["schema","dataset design","interoperability"]',
  'Directly relevant for your own dataset conventions and import schemas.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'OLF-003',
  'book',
  'Atlas of Odor Character Profiles',
  'Andrew Dravnieks',
  1992,
  'ASTM Special Technical Publication',
  NULL,
  'https://books.google.com/books/about/Atlas_of_Odor_Character_Profiles.html?id=4kRLAQAAIAAJ',
  'Olfaction datasets',
  '["odor descriptors","sensory profiling","classic"]',
  'Legacy descriptor atlas; used as benchmark in ML-olfaction work.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'OLF-004',
  'article',
  'Predicting natural language descriptions of mono-molecular odorants',
  'Nature Communications (PMC full text)',
  2018,
  'Nature Communications',
  NULL,
  'https://pmc.ncbi.nlm.nih.gov/articles/PMC6255800/',
  'Olfaction datasets / ML',
  '["odor descriptors","prediction","Dravnieks"]',
  'Bridges molecular structure to descriptor space; good for ''odor lexicon'' and model ideas.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'OLF-005',
  'dataset',
  'Leffingwell odor dataset (expert-labeled odor descriptors)',
  'Zenodo (listed via NIAID Data Discovery Portal)',
  2020,
  'NIAID Data Discovery Portal',
  NULL,
  'https://data.niaid.nih.gov/resources?id=zenodo_4085097',
  'Olfaction datasets',
  '["odor descriptors","dataset","Leffingwell"]',
  'Large descriptor dataset for linking molecules ↔ language.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DAT-009',
  'website',
  'GNPS Documentation (developer docs)',
  'GNPS/UCSD',
  2025,
  'GNPS Documentation',
  NULL,
  'https://ccms-ucsd.github.io/GNPSDocumentation/',
  'Data infra / Metabolomics',
  '["docs","workflows","APIs"]',
  'Developer-focused documentation for GNPS ecosystem and workflows.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DAT-010',
  'website',
  'GNPS Public Spectral Libraries (index)',
  'GNPS/UCSD',
  2025,
  'GNPS Libraries',
  NULL,
  'https://gnps.ucsd.edu/ProteoSAFe/libraries.jsp',
  'Data infra / Metabolomics',
  '["reference libraries","spectral matching"]',
  'Browsable public reference libraries powering GNPS annotations.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DAT-011',
  'website',
  'GNPS — FAIRsharing registry record',
  'FAIRsharing',
  2021,
  'FAIRsharing',
  NULL,
  'https://fairsharing.org/3896',
  'Data infra / Metabolomics',
  '["FAIR","registry","dataset standards"]',
  'Useful for grants/partners: points to GNPS as FAIR-aligned infrastructure.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DAT-012',
  'website',
  'MetaboLights — About (EMBL‑EBI)',
  'EMBL‑EBI',
  2025,
  'MetaboLights',
  NULL,
  'https://www.ebi.ac.uk/metabolights/about',
  'Data infra / Repositories',
  '["repository","scope","journal recommendations"]',
  'Plain-language positioning of MetaboLights; good collaborator onboarding page.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DAT-013',
  'article',
  'MetaboLights: open data repository for metabolomics',
  'Yurekten O. et al.',
  2024,
  'Nucleic Acids Research (PubMed record)',
  NULL,
  'https://pubmed.ncbi.nlm.nih.gov/37971328/',
  'Data infra / Repositories',
  '["MetaboLights","PubMed record"]',
  'PubMed entry for quick metadata export and linking.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'DAT-014',
  'website',
  'Metabolomics Workbench — How to Cite (project ID + DOI)',
  'Metabolomics Workbench',
  2025,
  'Metabolomics Workbench',
  NULL,
  'https://www.metabolomicsworkbench.org/about/howtocite.php',
  'Data infra / Repositories',
  '["citation","datasets","DOIs"]',
  'Operational guidance for citing deposited datasets; good for research integrity pages.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'TAX-004',
  'website',
  'GBIF — Citation Guidelines',
  'GBIF',
  2025,
  'GBIF',
  NULL,
  'https://www.gbif.org/citation-guidelines',
  'Taxonomy & distribution',
  '["citation","data reuse","provenance"]',
  'How to cite GBIF infrastructure and datasets; key for dev/data pages.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'TAX-005',
  'website',
  'Kew — Data & digital resources (overview)',
  'Royal Botanic Gardens, Kew',
  2025,
  'Kew Science',
  NULL,
  'https://www.kew.org/science/collections-and-resources/data-and-digital',
  'Taxonomy & distribution',
  '["resources","POWO","taxonomic backbones"]',
  'Overview of Kew digital resources; useful for ‘sources’ page and partner mapping.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'CHEM-005',
  'website',
  'PubMed (NCBI) — portal',
  'NLM/NCBI',
  2025,
  'PubMed',
  NULL,
  'https://pubmed.ncbi.nlm.nih.gov/',
  'Scholarly discovery infra',
  '["search","biomedical","life sciences"]',
  'Canonical index for biomedical/life sciences; complements OpenAlex for coverage.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'CHEM-006',
  'article',
  'GenBank 2025 update',
  'Nucleic Acids Research',
  2025,
  'Nucleic Acids Research',
  NULL,
  'https://academic.oup.com/nar/article/53/D1/D56/7903376',
  'Genomics infra',
  '["GenBank updates","citation practices"]',
  'Recent GenBank update; includes best-practice guidance on citing accession.version.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'CHEM-007',
  'website',
  'Tandem Mass Spectral Library (NIST)',
  'NIST',
  2012,
  'NIST',
  NULL,
  'https://www.nist.gov/programs-projects/tandem-mass-spectral-library',
  'Chem analytics tooling',
  '["libraries","identification","MS/MS"]',
  'NIST description of why libraries matter + context for building/using MS reference spectra.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'BIO-003',
  'report',
  'Sustainable (–)-Ambrox Production: Chemistry Meets Biocatalysis',
  '(CHIMIA PDF)',
  2024,
  'CHIMIA',
  NULL,
  'https://www.chimia.ch/chimia/article/download/2024_468/2024_468/23673',
  'Biotech / Conservation substitutes',
  '["Ambrox","biocatalysis","supply chains"]',
  'Accessible overview of Ambrox production routes (chemistry + biocatalysis) for non-specialists.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'CIT-003',
  'website',
  'Smell Pittsburgh — Data Analysis page',
  'Smell PGH',
  2025,
  'smellpgh.org',
  NULL,
  'https://smellpgh.org/analysis',
  'Citizen science / Smell mapping',
  '["open data","analysis","mapping"]',
  'Entry point for downloading/understanding smell reports and analysis outputs.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'OLF-006',
  'preprint',
  'Pyrfume: A Window to the World''s Olfactory Data (bioRxiv preprint)',
  'bioRxiv',
  2022,
  'bioRxiv',
  '10.1101/2022.09.08.507170',
  'https://www.biorxiv.org/content/10.1101/2022.09.08.507170v1.full-text',
  'Olfaction datasets',
  '["preprint","Pyrfume"]',
  'Preprint version; sometimes easier to parse and cite for methods and figures.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);

INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  'HER-002',
  'news',
  'An old perfume bottle reveals what some ancient Romans smelled like',
  'Science News',
  2023,
  'Science News',
  NULL,
  'https://www.sciencenews.org/article/ancient-roman-perfume-smell-patchouli',
  'Heritage science / Lost perfumes',
  '["science communication","patchouli","Roman perfume"]',
  'Good readable secondary source for collaborators; links back to primary Heritage paper.',
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);