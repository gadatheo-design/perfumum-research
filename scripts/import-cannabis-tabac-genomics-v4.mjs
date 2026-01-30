/**
 * PERFUMUM - Import Cannabis/Tabac Genomics Pack v4
 * 
 * Importe les 29 références génomiques du pack v4 dans la table v3_references
 * avec les axes thématiques appropriés (G1, G2, G3 pour Genomics)
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping des types de références
const typeMapping = {
  'journal-article': 'article',
  'preprint': 'preprint',
  'database': 'website',
  'book': 'book',
  'chapter': 'chapter',
  'thesis': 'thesis',
  'conference_paper': 'conference_paper',
  'report': 'report',
  'website': 'website',
  'web_entry': 'web_entry',
  'news': 'news',
};

// Axes génomiques à créer
const genomicsAxes = [
  {
    code: 'G1',
    name: 'Cannabis Genomics',
    metaAxis: 'meta_c',
    description: 'Références sur la génomique du cannabis: pangénome, assemblages, variation structurelle, domestication, biosynthèse des cannabinoïdes et terpènes.',
    color: '#10B981', // Emerald
  },
  {
    code: 'G2',
    name: 'Tobacco Genomics',
    metaAxis: 'meta_c',
    description: 'Références sur la génomique du tabac (Nicotiana): assemblages, biosynthèse de la nicotine, évolution, transcriptomique, épigénomique.',
    color: '#8B5CF6', // Violet
  },
  {
    code: 'G3',
    name: 'Genomic Databases',
    metaAxis: 'meta_c',
    description: 'Bases de données génomiques et portails de ressources pour le cannabis et le tabac.',
    color: '#3B82F6', // Blue
  },
];

// Données des références
const references = [
  {
    id: 'CAN-2025-NAT-PANGENOME',
    type: 'journal-article',
    title: 'Domesticated cannabinoid synthases amid a wild mosaic cannabis pangenome',
    authors: 'Lynch, R.C. and Padgitt-Cobb, L.K. and Garfinkel, A.R. and others',
    year: 2025,
    venue: 'Nature',
    doi: '10.1038/s41586-025-09065-0',
    url: 'https://www.nature.com/articles/s41586-025-09065-0',
    tags: ['cannabis', 'pangenome', 'structural-variation', 'cannabinoid-synthase', 'domestication'],
    notes: "Référence pivot pangenome + mosaïque sauvage/domestiqué; base pour un module 'pangenome explorer'.",
    axis: 'G1',
  },
  {
    id: 'CAN-2025-G3-TRIOBIN',
    type: 'journal-article',
    title: 'Trio-binning approach for genome assembly reveals extensive structural variation between two Cannabis cultivars: Punto Rojo and Cherry Pie',
    authors: 'Pike, J. and others',
    year: 2025,
    venue: 'G3 Genes|Genomes|Genetics',
    doi: '10.1093/g3journal/jkaf286',
    url: 'https://academic.oup.com/g3journal/advance-article/doi/10.1093/g3journal/jkaf286/8407317',
    tags: ['cannabis', 'haplotype-resolved', 'structural-variation', 'colombia', 'punto-rojo'],
    notes: "Inclut un landrace colombien (Punto Rojo) — utile pour un axe 'variétés fantômes / provenance'.",
    axis: 'G1',
  },
  {
    id: 'CAN-2021-NPH-CBDRX',
    type: 'journal-article',
    title: 'A new Cannabis genome assembly associates elevated cannabidiol (CBD) with hemp introgressed into marijuana',
    authors: 'Grassa, C.J. and Wenger, J.P. and Dabney, C. and others',
    year: 2021,
    venue: 'New Phytologist',
    doi: '10.1111/nph.17243',
    url: 'https://nph.onlinelibrary.wiley.com/doi/abs/10.1111/nph.17243',
    tags: ['cannabis', 'reference-genome', 'CBDRx', 'introgression', 'QTL'],
    notes: "Cs10/CBDRx = référence majeure; excellent pour un module 'CBD/THC locus & introgression'.",
    axis: 'G1',
  },
  {
    id: 'CAN-2015-NPH-DUPDIV',
    type: 'journal-article',
    title: 'Gene duplication and divergence affecting drug content in Cannabis sativa',
    authors: 'Weiblen, G.D. and Wenger, J.P. and Craft, K.J. and others',
    year: 2015,
    venue: 'New Phytologist',
    doi: '10.1111/nph.13562',
    url: 'https://pubmed.ncbi.nlm.nih.gov/26189495/',
    tags: ['cannabis', 'gene-duplication', 'cannabinoid-synthase', 'evolution'],
    notes: 'Classique sur duplications/ divergence des gènes liés au contenu cannabinoïde.',
    axis: 'G1',
  },
  {
    id: 'CAN-2020-PLPHYS-TPS',
    type: 'journal-article',
    title: 'Terpene Synthases and Terpene Variation in Cannabis sativa',
    authors: 'Booth, J.K. and Yuen, M.M.S. and Jancsik, S. and others',
    year: 2020,
    venue: 'Plant Physiology',
    doi: '10.1104/pp.20.00593',
    url: 'https://pubmed.ncbi.nlm.nih.gov/32591428/',
    tags: ['cannabis', 'terpene-synthase', 'TPS', 'chemotype', 'aroma'],
    notes: "Pont direct 'génomique ↔ profil aromatique'; parfait pour l'axe 'olfaction'.",
    axis: 'G1',
  },
  {
    id: 'CAN-2023-NATPLANTS-PARALLEL',
    type: 'journal-article',
    title: 'Parallel evolution of cannabinoid biosynthesis',
    authors: 'Berman, P. and de Haro, L.A. and Jozwiak, A. and others',
    year: 2023,
    venue: 'Nature Plants',
    doi: '10.1038/s41477-023-01402-3',
    url: 'https://www.nature.com/articles/s41477-023-01402-3',
    tags: ['cannabis', 'convergent-evolution', 'cannabinoids', 'pathway-evolution'],
    notes: "Ouvre la porte à une 'phylogénie olfactive' comparant voies biosynthétiques entre espèces.",
    axis: 'G1',
  },
  {
    id: 'CAN-2021-SCIADV-DOMESTICATION',
    type: 'journal-article',
    title: 'Large-scale whole-genome resequencing unravels the domestication history of Cannabis sativa',
    authors: '(voir article)',
    year: 2021,
    venue: 'Science Advances',
    doi: '10.1126/sciadv.abg2286',
    url: 'https://www.science.org/doi/10.1126/sciadv.abg2286',
    tags: ['cannabis', 'domestication', 'population-genomics', 'diversity'],
    notes: 'Cadre macro sur domestication + diversité mondiale; utile pour cartes interactives.',
    axis: 'G1',
  },
  {
    id: 'CAN-2024-SCIDATA-PINKPEPPER',
    type: 'journal-article',
    title: 'Chromosome-level Haploid Assembly of Cannabis sativa L. cv. Pink Pepper',
    authors: 'Ryu, B.-R. and Gim, G.-J. and Shin, Y.-R. and others',
    year: 2024,
    venue: 'Scientific Data',
    doi: '10.1038/s41597-024-04288-8',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11682139/',
    tags: ['cannabis', 'genome-assembly', 'haploid', 'CBD-rich', 'resource'],
    notes: "Assemblage haute qualité; bon 'dataset anchor' + annotations.",
    axis: 'G1',
  },
  {
    id: 'CAN-2024-COPBIOTRICHOMES',
    type: 'journal-article',
    title: 'Building a biofactory: Constructing glandular trichomes in Cannabis sativa',
    authors: 'Hancock, J. and Livingston, S.J. and Samuels, L.',
    year: 2024,
    venue: 'Current Opinion in Plant Biology',
    doi: '10.1016/j.pbi.2024.102549',
    url: 'https://www.sciencedirect.com/science/article/pii/S1369526624000402',
    tags: ['cannabis', 'trichomes', 'cell-biology', 'metabolomics', 'synthetic-biology'],
    notes: "Angle 'biofactory' (cellulaire) pour modules VR/3D des trichomes.",
    axis: 'G1',
  },
  {
    id: 'CAN-2019-SCIREP-ATLAS',
    type: 'journal-article',
    title: 'Generation of a Comprehensive Transcriptome Atlas and Transcriptome Dynamics in Cannabis',
    authors: '(voir article)',
    year: 2019,
    venue: 'Scientific Reports',
    doi: '10.1038/s41598-019-53023-6',
    url: 'https://www.nature.com/articles/s41598-019-53023-6',
    tags: ['cannabis', 'transcriptome', 'atlas', 'trichome'],
    notes: "Très utile pour un module 'expression atlas' côté site.",
    axis: 'G1',
  },
  {
    id: 'CAN-2024-BMCPLBIOL-EPIGEN',
    type: 'journal-article',
    title: 'Characterization of the Cannabis sativa glandular trichome epigenome and transcriptome reveals epigenomic regulation of specialized metabolism',
    authors: '(voir article)',
    year: 2024,
    venue: 'BMC Plant Biology',
    doi: '10.1186/s12870-024-05787-x',
    url: 'https://link.springer.com/article/10.1186/s12870-024-05787-x',
    tags: ['cannabis', 'epigenomics', 'trichome', 'specialized-metabolism'],
    notes: "Axe niche très fort: 'épigénome ↔ rendement des métabolites'.",
    axis: 'G1',
  },
  {
    id: 'CAN-2024-BMCGEN-HEMPMARI',
    type: 'journal-article',
    title: 'Population genomics of a natural Cannabis sativa collection from marijuana and hemp shows signature of distinct breeding strategies',
    authors: '(voir article)',
    year: 2025,
    venue: 'BMC Genomics',
    doi: '10.1186/s12864-025-11015-y',
    url: 'https://bmcgenomics.biomedcentral.com/articles/10.1186/s12864-025-11015-y',
    tags: ['cannabis', 'population-genomics', 'breeding', 'hemp', 'marijuana'],
    notes: "Bon pour un module 'signature de sélection' + visualisation PCA.",
    axis: 'G1',
  },
  {
    id: 'CAN-2021-FRONTIERS-GOVPROD',
    type: 'journal-article',
    title: 'Genomic Evidence That Governmentally Produced Cannabis sativa Plants Distinctly Differ from Wild/Local Accessions',
    authors: '(voir article)',
    year: 2021,
    venue: 'Frontiers in Plant Science',
    doi: '10.3389/fpls.2021.668315',
    url: 'https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2021.668315/full',
    tags: ['cannabis', 'provenance', 'forensics', 'population-genomics'],
    notes: "Approche 'forensic/provenance' utile pour 'diplomatie olfactive' / traçabilité.",
    axis: 'G1',
  },
  {
    id: 'CAN-2024-GEN-TAXONOMY',
    type: 'journal-article',
    title: 'Genomics-based taxonomy to clarify cannabis classification',
    authors: '(voir article)',
    year: 2024,
    venue: 'Genetics (Canadian Science Publishing)',
    doi: '10.1139/gen-2023-0005',
    url: 'https://cdnsciencepub.com/doi/10.1139/gen-2023-0005',
    tags: ['cannabis', 'taxonomy', 'genomics', 'classification'],
    notes: "Important pour structurer ton référentiel 'variétés / espèces / sous-espèces' sur le site.",
    axis: 'G1',
  },
  // Tobacco references
  {
    id: 'TOB-2025-NATGEN-GENEBANK',
    type: 'journal-article',
    title: 'The genome and GeneBank genomics of allotetraploid Nicotiana tabacum provide insights into genome evolution and complex trait regulation',
    authors: 'Zan, Y. and Chen, S. and Ren, M. and others',
    year: 2025,
    venue: 'Nature Genetics',
    doi: '10.1038/s41588-025-02126-0',
    url: 'https://www.nature.com/articles/s41588-025-02126-0',
    tags: ['tobacco', 'nicotiana-tabacum', 'genebank', 'GWAS', 'polyploidy'],
    notes: 'Référence clé: génome + GWAS + carte génotype-phénotype.',
    axis: 'G2',
  },
  {
    id: 'TOB-2024-SCIDATA-ASSEMBLIES',
    type: 'journal-article',
    title: 'Chromosome-level genome assemblies of Nicotiana tabacum, Nicotiana sylvestris, and Nicotiana tomentosiformis',
    authors: 'Sierro, N. and Auberson, M. and Dulize, R. and others',
    year: 2024,
    venue: 'Scientific Data',
    doi: '10.1038/s41597-024-02965-2',
    url: 'https://www.nature.com/articles/s41597-024-02965-2',
    tags: ['tobacco', 'nicotiana-tabacum', 'progenitors', 'genome-assembly', 'resource'],
    notes: "Assemblies + progeniteurs = parfait pour modules 'subgenomes' + synteny.",
    axis: 'G2',
  },
  {
    id: 'TOB-2024-MOLP-DEFENSE',
    type: 'journal-article',
    title: 'High-quality assembled and annotated genomes of Nicotiana tabacum and Nicotiana benthamiana reveal chromosome evolution and changes in defense arsenals',
    authors: 'Wang, J. and Zhang, Q. and Tung, J. and others',
    year: 2024,
    venue: 'Molecular Plant',
    doi: '10.1016/j.molp.2024.01.008',
    url: 'https://www.cell.com/molecular-plant/fulltext/S1674-2052(24)00008-X',
    tags: ['tobacco', 'nicotiana', 'genome-assembly', 'annotation', 'defense'],
    notes: "Pour lier génomique ↔ immunité ↔ stress (utile à l'axe 'dérive olfactive' / climat).",
    axis: 'G2',
  },
  {
    id: 'TOB-2017-PNAS-WILDGENOMES',
    type: 'journal-article',
    title: 'Wild tobacco genomes reveal the evolution of nicotine biosynthesis',
    authors: 'Xu, S. and Brockmöller, T. and Navarro-Quezada, A. and others',
    year: 2017,
    venue: 'PNAS',
    doi: '10.1073/pnas.1700073114',
    url: 'https://www.pnas.org/doi/10.1073/pnas.1700073114',
    tags: ['tobacco', 'wild-nicotiana', 'evolution', 'nicotine-biosynthesis', 'comparative-genomics'],
    notes: "Fondation pour 'évolution de la voie nicotine' + comparaison inter-espèces.",
    axis: 'G2',
  },
  {
    id: 'TOB-2024-FRONTIERS-GENOMESEQ',
    type: 'journal-article',
    title: 'Retrospect and prospect of Nicotiana tabacum genome sequencing',
    authors: 'Xie, (voir article)',
    year: 2024,
    venue: 'Frontiers in Plant Science',
    doi: '10.3389/fpls.2024.1474658',
    url: 'https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2024.1474658/full',
    tags: ['tobacco', 'review', 'genome-assembly', 'pangenome', 'T2T'],
    notes: "Bon 'state of the art' + roadmap technique (pangenome, T2T).",
    axis: 'G2',
  },
  {
    id: 'TOB-2024-PMC-NICOTINE-REVIEW',
    type: 'journal-article',
    title: 'Genetic regulation and manipulation of nicotine biosynthesis in tobacco: strategies to eliminate addictive alkaloids',
    authors: '(voir article)',
    year: 2024,
    venue: '(voir article / PMC)',
    doi: '',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10938045/',
    tags: ['tobacco', 'nicotine-biosynthesis', 'regulation', 'jasmonate', 'genome-editing'],
    notes: 'Revue très utile pour cartographier gènes (PMT/QPT/BBL/ERF/MYC2 etc.).',
    axis: 'G2',
  },
  {
    id: 'TOB-2013-GENETICS-ALKALOIDS',
    type: 'journal-article',
    title: 'Molecular genetics of alkaloid biosynthesis in Nicotiana tabacum',
    authors: 'Dewey, R.E. and Xie, J.',
    year: 2013,
    venue: 'Phytochemistry',
    doi: '',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S0031942213002069',
    tags: ['tobacco', 'alkaloids', 'pathway', 'regulation', 'review'],
    notes: "Revue 'pathway-centric' (nicotine, nornicotine, TSNA) — bonne base pédagogie.",
    axis: 'G2',
  },
  {
    id: 'TOB-2025-SCIDATA-TRANSCRIPTOME',
    type: 'journal-article',
    title: 'A transcriptomic profiling across tissues, developmental stages, and types of Nicotiana tabacum',
    authors: 'Tong, Z. and others',
    year: 2025,
    venue: 'Scientific Data',
    doi: '10.1038/s41597-025-06409-3',
    url: 'https://www.nature.com/articles/s41597-025-06409-3',
    tags: ['tobacco', 'transcriptome', 'atlas', 'tissues', 'development'],
    notes: "Atlas d'expression pour construire un module 'tissue browser' (trichomes/feuille/racine).",
    axis: 'G2',
  },
  {
    id: 'TOB-2021-NPH-SCENTSINGLECELL',
    type: 'journal-article',
    title: 'Single-cell RNA-sequencing of Nicotiana attenuata corolla cells reveals the biosynthetic pathway of a floral scent',
    authors: '(voir article)',
    year: 2022,
    venue: 'New Phytologist',
    doi: '10.1111/nph.17992',
    url: 'https://nph.onlinelibrary.wiley.com/doi/10.1111/nph.17992',
    tags: ['tobacco', 'single-cell', 'floral-scent', 'volatile-biosynthesis', 'olfaction'],
    notes: "Pont très PERFUMUM: 'single-cell olfactory biosynthesis' côté Nicotiana.",
    axis: 'G2',
  },
  {
    id: 'TOB-2025-BIORXIV-ATTENUATA-T2T',
    type: 'preprint',
    title: 'Chromosome-level genome assemblies of Nicotiana attenuata and related wild tobaccos (preprint)',
    authors: '(voir preprint)',
    year: 2025,
    venue: 'bioRxiv',
    doi: '10.1101/2025.11.10.687602',
    url: 'https://www.biorxiv.org/content/10.1101/2025.11.10.687602v1',
    tags: ['tobacco', 'wild-nicotiana', 'genome-assembly', 'preprint', 'T2T'],
    notes: 'À suivre (préprint) — potentiellement énorme pour conservation/évolution.',
    axis: 'G2',
  },
  // Database references
  {
    id: 'DB-NCBI-CANNABIS-CS10',
    type: 'database',
    title: 'NCBI Datasets – Cannabis sativa genome (CBDRx/cs10 reference)',
    authors: 'NCBI',
    year: 2025,
    venue: 'NCBI Datasets',
    doi: '',
    url: 'https://www.ncbi.nlm.nih.gov/datasets/genome/GCF_900626175.1/',
    tags: ['database', 'cannabis', 'reference-genome', 'assembly'],
    notes: "Point d'entrée stable pour référencer assemblages + annotations.",
    axis: 'G3',
  },
  {
    id: 'DB-SGN-NICOTIANA-ATTENUATA',
    type: 'database',
    title: 'Sol Genomics Network – Nicotiana attenuata genome portal',
    authors: 'Sol Genomics Network',
    year: 2025,
    venue: 'SGN',
    doi: '',
    url: 'https://solgenomics.net/organism/Nicotiana_attenuata/genome',
    tags: ['database', 'tobacco', 'nicotiana-attenuata', 'portal', 'expression'],
    notes: 'Bon pour liens sortants (genome release, bioproject, data hub).',
    axis: 'G3',
  },
  {
    id: 'DB-NADH-ATTENUATA',
    type: 'database',
    title: 'Nicotiana attenuata Data Hub (NaDH) – genomic / transcriptomic / metabolomic data',
    authors: 'Max Planck Institute (NaDH)',
    year: 2025,
    venue: 'NaDH',
    doi: '',
    url: 'https://nadh.ice.mpg.de/NaDH/others/data',
    tags: ['database', 'tobacco', 'multi-omics', 'metabolomics', 'expression'],
    notes: 'Très utile pour lier génome ↔ métabolome ↔ écologie.',
    axis: 'G3',
  },
  {
    id: 'DB-ENSEMBLPLANTS-ATTENUATA',
    type: 'database',
    title: 'Ensembl Plants – Nicotiana attenuata annotation portal',
    authors: 'Ensembl Plants',
    year: 2025,
    venue: 'Ensembl Plants',
    doi: '',
    url: 'https://plants.ensembl.org/Nicotiana_attenuata/Info/Annotation/',
    tags: ['database', 'tobacco', 'genome', 'annotation', 'comparative-genomics'],
    notes: 'Accès API/biomart pour extraction gènes + orthologues.',
    axis: 'G3',
  },
  {
    id: 'DB-KEGG-ATTENUATA',
    type: 'database',
    title: 'KEGG GENOME – Nicotiana attenuata',
    authors: 'KEGG',
    year: 2025,
    venue: 'KEGG',
    doi: '',
    url: 'https://www.kegg.jp/kegg-bin/show_organism?org=nau',
    tags: ['database', 'tobacco', 'pathways', 'enzymes', 'mapping'],
    notes: 'Pratique pour cartographier la voie nicotine + enzymes associés.',
    axis: 'G3',
  },
];

async function main() {
  console.log('🧬 PERFUMUM - Import Cannabis/Tabac Genomics Pack v4');
  console.log('====================================================');
  console.log(`📚 ${references.length} références à importer\n`);

  const conn = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // 1. Créer les axes génomiques G1, G2, G3
    console.log('📊 Création des axes génomiques...');
    for (const axis of genomicsAxes) {
      await conn.execute(`
        INSERT INTO thematic_axes (axis_code, name, meta_axis, description, color, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        description = VALUES(description),
        color = VALUES(color),
        updated_at = NOW()
      `, [axis.code, axis.name, axis.metaAxis, axis.description, axis.color]);
    }
    console.log('✅ Axes génomiques G1, G2, G3 créés/mis à jour\n');

    // 2. Importer les références
    let created = 0;
    let updated = 0;
    let errors = 0;
    const byAxis = { G1: 0, G2: 0, G3: 0 };

    for (const ref of references) {
      try {
        const entryType = typeMapping[ref.type] || 'article';
        const tags = JSON.stringify(ref.tags);
        
        // Vérifier si la référence existe déjà
        const [existing] = await conn.execute(
          'SELECT id FROM v3_references WHERE entry_key = ?',
          [ref.id]
        );

        if (existing.length > 0) {
          // Mise à jour
          await conn.execute(`
            UPDATE v3_references SET
              title = ?,
              authors = ?,
              year = ?,
              entry_type = ?,
              container_title = ?,
              doi = ?,
              url = ?,
              tags = ?,
              user_notes = ?,
              axis_primary_code = ?,
              pack_version = 'v4',
              updated_at = NOW()
            WHERE entry_key = ?
          `, [
            ref.title,
            ref.authors,
            ref.year,
            entryType,
            ref.venue,
            ref.doi || null,
            ref.url,
            tags,
            ref.notes,
            ref.axis,
            ref.id
          ]);
          updated++;
          console.log(`🔄 Mise à jour: ${ref.id}`);
        } else {
          // Création
          await conn.execute(`
            INSERT INTO v3_references (
              entry_key, title, authors, year, entry_type, container_title,
              doi, url, tags, user_notes, axis_primary_code,
              read_status, relevance_score, pack_version, imported_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unread', 50, 'v4', NOW(), NOW())
          `, [
            ref.id,
            ref.title,
            ref.authors,
            ref.year,
            entryType,
            ref.venue,
            ref.doi || null,
            ref.url,
            tags,
            ref.notes,
            ref.axis
          ]);
          created++;
          console.log(`✅ Créé: ${ref.id}`);
        }
        
        byAxis[ref.axis]++;
      } catch (error) {
        console.error(`❌ Erreur pour ${ref.id}: ${error.message}`);
        errors++;
      }
    }

    console.log('\n📊 Résultats de l\'import:');
    console.log(`   ✅ Nouvelles références: ${created}`);
    console.log(`   🔄 Références mises à jour: ${updated}`);
    console.log(`   ❌ Erreurs: ${errors}`);
    console.log(`   📚 Total traité: ${references.length}`);
    console.log('\n📈 Répartition par axe:');
    console.log(`   G1 (Cannabis Genomics): ${byAxis.G1}`);
    console.log(`   G2 (Tobacco Genomics): ${byAxis.G2}`);
    console.log(`   G3 (Genomic Databases): ${byAxis.G3}`);

    console.log('\n✅ Import Cannabis/Tabac Genomics v4 terminé avec succès!');
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
  } finally {
    await conn.end();
  }
}

main().catch(console.error);
