INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'CAN-2025-NAT-PANGENOME',
    'article',
    'Domesticated cannabinoid synthases amid a wild mosaic cannabis pangenome',
    'Lynch, R.C. and Padgitt-Cobb, L.K. and Garfinkel, A.R. and others',
    2025,
    'Nature',
    '10.1038/s41586-025-09065-0',
    'https://www.nature.com/articles/s41586-025-09065-0',
    'Référence pivot pangenome + mosaïque sauvage/domestiqué; base pour un module ''pangenome explorer''.',
    '["cannabis","pangenome","structural-variation","cannabinoid-synthase","domestication"]',
    'N1',
    '["M1","J1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'CAN-2025-G3-TRIOBIN',
    'article',
    'Trio-binning approach for genome assembly reveals extensive structural variation between two Cannabis cultivars: Punto Rojo and Cherry Pie',
    'Pike, J. and others',
    2025,
    'G3 Genes|Genomes|Genetics',
    '10.1093/g3journal/jkaf286',
    'https://academic.oup.com/g3journal/advance-article/doi/10.1093/g3journal/jkaf286/8407317',
    'Inclut un landrace colombien (Punto Rojo) — utile pour un axe ''variétés fantômes / provenance''.',
    '["cannabis","haplotype-resolved","structural-variation","colombia","punto-rojo"]',
    'N1',
    '["M1","J1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'CAN-2021-NPH-CBDRX',
    'article',
    'A new Cannabis genome assembly associates elevated cannabidiol (CBD) with hemp introgressed into marijuana',
    'Grassa, C.J. and Wenger, J.P. and Dabney, C. and others',
    2021,
    'New Phytologist',
    '10.1111/nph.17243',
    'https://nph.onlinelibrary.wiley.com/doi/abs/10.1111/nph.17243',
    'Cs10/CBDRx = référence majeure; excellent pour un module ''CBD/THC locus & introgression''.',
    '["cannabis","reference-genome","CBDRx","introgression","QTL"]',
    'N1',
    '["M1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'CAN-2015-NPH-DUPDIV',
    'article',
    'Gene duplication and divergence affecting drug content in Cannabis sativa',
    'Weiblen, G.D. and Wenger, J.P. and Craft, K.J. and others',
    2015,
    'New Phytologist',
    '10.1111/nph.13562',
    'https://pubmed.ncbi.nlm.nih.gov/26189495/',
    'Classique sur duplications/ divergence des gènes liés au contenu cannabinoïde.',
    '["cannabis","gene-duplication","cannabinoid-synthase","evolution"]',
    'N1',
    '["M1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'CAN-2020-PLPHYS-TPS',
    'article',
    'Terpene Synthases and Terpene Variation in Cannabis sativa',
    'Booth, J.K. and Yuen, M.M.S. and Jancsik, S. and others',
    2020,
    'Plant Physiology',
    '10.1104/pp.20.00593',
    'https://pubmed.ncbi.nlm.nih.gov/32591428/',
    'Pont direct ''génomique ↔ profil aromatique''; parfait pour l''axe ''olfaction''.',
    '["cannabis","terpene-synthase","TPS","chemotype","aroma"]',
    'M1',
    '["B1","C1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'CAN-2023-NATPLANTS-PARALLEL',
    'article',
    'Parallel evolution of cannabinoid biosynthesis',
    'Berman, P. and de Haro, L.A. and Jozwiak, A. and others',
    2023,
    'Nature Plants',
    '10.1038/s41477-023-01402-3',
    'https://www.nature.com/articles/s41477-023-01402-3',
    'Ouvre la porte à une ''phylogénie olfactive'' comparant voies biosynthétiques entre espèces.',
    '["cannabis","convergent-evolution","cannabinoids","pathway-evolution"]',
    'M2',
    '["M1","N1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'CAN-2021-SCIADV-DOMESTICATION',
    'article',
    'Large-scale whole-genome resequencing unravels the domestication history of Cannabis sativa',
    '(voir article)',
    2021,
    'Science Advances',
    '10.1126/sciadv.abg2286',
    'https://www.science.org/doi/10.1126/sciadv.abg2286',
    'Cadre macro sur domestication + diversité mondiale; utile pour cartes interactives.',
    '["cannabis","domestication","population-genomics","diversity"]',
    'N2',
    '["J2","N1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'CAN-2024-SCIDATA-PINKPEPPER',
    'article',
    'Chromosome-level Haploid Assembly of Cannabis sativa L. cv. Pink Pepper',
    'Ryu, B.-R. and Gim, G.-J. and Shin, Y.-R. and others',
    2024,
    'Scientific Data',
    '10.1038/s41597-024-04288-8',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC11682139/',
    'Assemblage haute qualité; bon ''dataset anchor'' + annotations.',
    '["cannabis","genome-assembly","haploid","CBD-rich","resource"]',
    'N1',
    '["M1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'CAN-2024-COPBIOTRICHOMES',
    'article',
    'Building a biofactory: Constructing glandular trichomes in Cannabis sativa',
    'Hancock, J. and Livingston, S.J. and Samuels, L.',
    2024,
    'Current Opinion in Plant Biology',
    '10.1016/j.pbi.2024.102549',
    'https://www.sciencedirect.com/science/article/pii/S1369526624000402',
    'Angle ''biofactory'' (cellulaire) pour modules VR/3D des trichomes.',
    '["cannabis","trichomes","cell-biology","metabolomics","synthetic-biology"]',
    'M1',
    '["M2","B1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'CAN-2019-SCIREP-ATLAS',
    'article',
    'Generation of a Comprehensive Transcriptome Atlas and Transcriptome Dynamics in Cannabis',
    '(voir article)',
    2019,
    'Scientific Reports',
    '10.1038/s41598-019-53023-6',
    'https://www.nature.com/articles/s41598-019-53023-6',
    'Très utile pour un module ''expression atlas'' côté site.',
    '["cannabis","transcriptome","atlas","trichome"]',
    'M3',
    '["M1","M2"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'CAN-2024-BMCPLBIOL-EPIGEN',
    'article',
    'Characterization of the Cannabis sativa glandular trichome epigenome and transcriptome reveals epigenomic regulation of specialized metabolism',
    '(voir article)',
    2024,
    'BMC Plant Biology',
    '10.1186/s12870-024-05787-x',
    'https://link.springer.com/article/10.1186/s12870-024-05787-x',
    'Axe niche très fort: ''épigénome ↔ rendement des métabolites''.',
    '["cannabis","epigenomics","trichome","specialized-metabolism"]',
    'M3',
    '["M1","M2"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'CAN-2024-BMCGEN-HEMPMARI',
    'article',
    'Population genomics of a natural Cannabis sativa collection from marijuana and hemp shows signature of distinct breeding strategies',
    '(voir article)',
    2025,
    'BMC Genomics',
    '10.1186/s12864-025-11015-y',
    'https://bmcgenomics.biomedcentral.com/articles/10.1186/s12864-025-11015-y',
    'Bon pour un module ''signature de sélection'' + visualisation PCA.',
    '["cannabis","population-genomics","breeding","hemp","marijuana"]',
    'N1',
    '["M1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'CAN-2021-FRONTIERS-GOVPROD',
    'article',
    'Genomic Evidence That Governmentally Produced Cannabis sativa Plants Distinctly Differ from Wild/Local Accessions',
    '(voir article)',
    2021,
    'Frontiers in Plant Science',
    '10.3389/fpls.2021.668315',
    'https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2021.668315/full',
    'Approche ''forensic/provenance'' utile pour ''diplomatie olfactive'' / traçabilité.',
    '["cannabis","provenance","forensics","population-genomics"]',
    'N2',
    '["J2","N1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'CAN-2024-GEN-TAXONOMY',
    'article',
    'Genomics-based taxonomy to clarify cannabis classification',
    '(voir article)',
    2024,
    'Genetics (Canadian Science Publishing)',
    '10.1139/gen-2023-0005',
    'https://cdnsciencepub.com/doi/10.1139/gen-2023-0005',
    'Important pour structurer ton référentiel ''variétés / espèces / sous-espèces'' sur le site.',
    '["cannabis","taxonomy","genomics","classification"]',
    'N3',
    '["N1","N2"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'TOB-2025-NATGEN-GENEBANK',
    'article',
    'The genome and GeneBank genomics of allotetraploid Nicotiana tabacum provide insights into genome evolution and complex trait regulation',
    'Zan, Y. and Chen, S. and Ren, M. and others',
    2025,
    'Nature Genetics',
    '10.1038/s41588-025-02126-0',
    'https://www.nature.com/articles/s41588-025-02126-0',
    'Référence clé: génome + GWAS + carte génotype-phénotype.',
    '["tobacco","nicotiana-tabacum","genebank","GWAS","polyploidy"]',
    'N1',
    '["M2"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'TOB-2024-SCIDATA-ASSEMBLIES',
    'article',
    'Chromosome-level genome assemblies of Nicotiana tabacum, Nicotiana sylvestris, and Nicotiana tomentosiformis',
    'Sierro, N. and Auberson, M. and Dulize, R. and others',
    2024,
    'Scientific Data',
    '10.1038/s41597-024-02965-2',
    'https://www.nature.com/articles/s41597-024-02965-2',
    'Assemblies + progeniteurs = parfait pour modules ''subgenomes'' + synteny.',
    '["tobacco","nicotiana-tabacum","progenitors","genome-assembly","resource"]',
    'N1',
    '["M2"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'TOB-2024-MOLP-DEFENSE',
    'article',
    'High-quality assembled and annotated genomes of Nicotiana tabacum and Nicotiana benthamiana reveal chromosome evolution and changes in defense arsenals',
    'Wang, J. and Zhang, Q. and Tung, J. and others',
    2024,
    'Molecular Plant',
    '10.1016/j.molp.2024.01.008',
    'https://www.cell.com/molecular-plant/fulltext/S1674-2052(24)00008-X',
    'Pour lier génomique ↔ immunité ↔ stress (utile à l''axe ''dérive olfactive'' / climat).',
    '["tobacco","nicotiana","genome-assembly","annotation","defense"]',
    'N1',
    '["M2"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'TOB-2017-PNAS-WILDGENOMES',
    'article',
    'Wild tobacco genomes reveal the evolution of nicotine biosynthesis',
    'Xu, S. and Brockmöller, T. and Navarro-Quezada, A. and others',
    2017,
    'PNAS',
    '10.1073/pnas.1700073114',
    'https://www.pnas.org/doi/10.1073/pnas.1700073114',
    'Fondation pour ''évolution de la voie nicotine'' + comparaison inter-espèces.',
    '["tobacco","wild-nicotiana","evolution","nicotine-biosynthesis","comparative-genomics"]',
    'M2',
    '["M1","N1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'TOB-2024-FRONTIERS-GENOMESEQ',
    'article',
    'Retrospect and prospect of Nicotiana tabacum genome sequencing',
    'Xie, (voir article)',
    2024,
    'Frontiers in Plant Science',
    '10.3389/fpls.2024.1474658',
    'https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2024.1474658/full',
    'Bon ''state of the art'' + roadmap technique (pangenome, T2T).',
    '["tobacco","review","genome-assembly","pangenome","T2T"]',
    'N1',
    '["M1","J1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'TOB-2024-PMC-NICOTINE-REVIEW',
    'article',
    'Genetic regulation and manipulation of nicotine biosynthesis in tobacco: strategies to eliminate addictive alkaloids',
    '(voir article)',
    2024,
    '(voir article / PMC)',
    NULL,
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC10938045/',
    'Revue très utile pour cartographier gènes (PMT/QPT/BBL/ERF/MYC2 etc.).',
    '["tobacco","nicotine-biosynthesis","regulation","jasmonate","genome-editing"]',
    'M2',
    '["M1","N1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'TOB-2013-GENETICS-ALKALOIDS',
    'article',
    'Molecular genetics of alkaloid biosynthesis in Nicotiana tabacum',
    'Dewey, R.E. and Xie, J.',
    2013,
    'Phytochemistry',
    NULL,
    'https://www.sciencedirect.com/science/article/abs/pii/S0031942213002069',
    'Revue ''pathway-centric'' (nicotine, nornicotine, TSNA) — bonne base pédagogie.',
    '["tobacco","alkaloids","pathway","regulation","review"]',
    'M2',
    '["M1","N1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'TOB-2025-SCIDATA-TRANSCRIPTOME',
    'article',
    'A transcriptomic profiling across tissues, developmental stages, and types of Nicotiana tabacum',
    'Tong, Z. and others',
    2025,
    'Scientific Data',
    '10.1038/s41597-025-06409-3',
    'https://www.nature.com/articles/s41597-025-06409-3',
    'Atlas d''expression pour construire un module ''tissue browser'' (trichomes/feuille/racine).',
    '["tobacco","transcriptome","atlas","tissues","development"]',
    'M3',
    '["M1","M2"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'TOB-2021-NPH-SCENTSINGLECELL',
    'article',
    'Single-cell RNA-sequencing of Nicotiana attenuata corolla cells reveals the biosynthetic pathway of a floral scent',
    '(voir article)',
    2022,
    'New Phytologist',
    '10.1111/nph.17992',
    'https://nph.onlinelibrary.wiley.com/doi/10.1111/nph.17992',
    'Pont très PERFUMUM: ''single-cell olfactory biosynthesis'' côté Nicotiana.',
    '["tobacco","single-cell","floral-scent","volatile-biosynthesis","olfaction"]',
    'M1',
    '["B1","C1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'TOB-2025-BIORXIV-ATTENUATA-T2T',
    'article',
    'Chromosome-level genome assemblies of Nicotiana attenuata and related wild tobaccos (preprint)',
    '(voir preprint)',
    2025,
    'bioRxiv',
    '10.1101/2025.11.10.687602',
    'https://www.biorxiv.org/content/10.1101/2025.11.10.687602v1',
    'À suivre (préprint) — potentiellement énorme pour conservation/évolution.',
    '["tobacco","wild-nicotiana","genome-assembly","preprint","T2T"]',
    'N1',
    '["M2"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'DB-NCBI-CANNABIS-CS10',
    'website',
    'NCBI Datasets – Cannabis sativa genome (CBDRx/cs10 reference)',
    'NCBI',
    2025,
    'NCBI Datasets',
    NULL,
    'https://www.ncbi.nlm.nih.gov/datasets/genome/GCF_900626175.1/',
    'Point d''entrée stable pour référencer assemblages + annotations.',
    '["database","cannabis","reference-genome","assembly"]',
    'J3',
    '["N1","M1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'DB-SGN-NICOTIANA-ATTENUATA',
    'website',
    'Sol Genomics Network – Nicotiana attenuata genome portal',
    'Sol Genomics Network',
    2025,
    'SGN',
    NULL,
    'https://solgenomics.net/organism/Nicotiana_attenuata/genome',
    'Bon pour liens sortants (genome release, bioproject, data hub).',
    '["database","tobacco","nicotiana-attenuata","portal","expression"]',
    'M3',
    '["M1","M2"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'DB-NADH-ATTENUATA',
    'website',
    'Nicotiana attenuata Data Hub (NaDH) – genomic / transcriptomic / metabolomic data',
    'Max Planck Institute (NaDH)',
    2025,
    'NaDH',
    NULL,
    'https://nadh.ice.mpg.de/NaDH/others/data',
    'Très utile pour lier génome ↔ métabolome ↔ écologie.',
    '["database","tobacco","multi-omics","metabolomics","expression"]',
    'M3',
    '["M1","M2"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'DB-ENSEMBLPLANTS-ATTENUATA',
    'website',
    'Ensembl Plants – Nicotiana attenuata annotation portal',
    'Ensembl Plants',
    2025,
    'Ensembl Plants',
    NULL,
    'https://plants.ensembl.org/Nicotiana_attenuata/Info/Annotation/',
    'Accès API/biomart pour extraction gènes + orthologues.',
    '["database","tobacco","genome","annotation","comparative-genomics"]',
    'J3',
    '["N1","M1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);

INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    'DB-KEGG-ATTENUATA',
    'website',
    'KEGG GENOME – Nicotiana attenuata',
    'KEGG',
    2025,
    'KEGG',
    NULL,
    'https://www.kegg.jp/kegg-bin/show_organism?org=nau',
    'Pratique pour cartographier la voie nicotine + enzymes associés.',
    '["database","tobacco","pathways","enzymes","mapping"]',
    'M2',
    '["M1","N1"]',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);