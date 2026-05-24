/**
 * Extracted from server/db/plants.ts
 * Module: Contributions
 */

import { eq, and, or, isNull, isNotNull, not, desc, asc, sql, like, gte, lte, inArray, notInArray, count, type SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  userFavorites,
  milestones,
  prototypes,
  families,
  tabacs,
  molecules,
  accords,
  recettes,
  civilisations,
  petrichor,
  volcanique,
  installations,
  laboratoire,
  glossary,
  absorbeProfiles,
  prototypeChemicalFamilies,
  chemicalFamilies,
  moleculeChemicalFamilies,
  accordCivilisations,
  researchTimeline,
  experimentalAccords,
  moleculesRecettes,
  recettesFormulesReference,
  Prototype,
  Family,
  Tabac,
  Molecule,
  Accord,
  Recette,
  InsertRecette,
  Civilisation,
  Petrichor,
  Volcanique,
  Installation,
  Laboratoire,
  GlossaryTerm,
  ResearchMilestone,
  ExperimentalAccord,
  synergies,
  Synergie,
  terpeneSynergies,
  userNotes,
  TerpeneSynergy,
  sharedCollections,
  moleculeNotes,
  citations,
  analyticsEvents,
  suppliers,
  supplierMaterials,
  Supplier,
  InsertSupplier,
  SupplierMaterial,
  InsertSupplierMaterial,
  rechercheRadicale,
  modificationHistory,
  moleculeSynergies,
  MoleculeSynergie,
  savedFormulas,
  SavedFormula,
  InsertSavedFormula,
  climateStudies,
  ClimateStudy,
  InsertClimateStudy,
  molecularProtocols,
  MolecularProtocol,
  InsertMolecularProtocol,
  fieldArchives,
  FieldArchive,
  InsertFieldArchive,
  extractionTests,
  ExtractionTest,
  InsertExtractionTest,
  situatedSmells,
  SituatedSmell,
  InsertSituatedSmell,
  leafEconomies,
  LeafEconomy,
  InsertLeafEconomy,
  leafEconomyMolecules,
  geographicOrigins,
  GeographicOrigin,
  InsertGeographicOrigin,
  moleculeOrigins,
  MoleculeOrigin,
  InsertMoleculeOrigin,
  ifraRestrictions,
  IfraRestriction,
  InsertIfraRestriction,
  plants,
  Plant,
  InsertPlant,
  geographicZones,
  plantGeographicZones,
  terpProfiles,
  TerpProfile,
  InsertTerpProfile,
  finalRecipes,
  FinalRecipe,
  InsertFinalRecipe,
  terpProfilePlants,
  terpProfileMolecules,
  plantMolecules,
  finalRecipeTerpProfiles,
  // Point 3 étendu
  plantVarieties,
  PlantVariety,
  InsertPlantVariety,
  terroirs,
  Terroir,
  InsertTerroir,
  extractionMethods,
  ExtractionMethod,
  InsertExtractionMethod,
  plantAnalyses,
  PlantAnalysis,
  InsertPlantAnalysis,
  plantSamples,
  PlantSample,
  InsertPlantSample,
  extendedSuppliers,
  ExtendedSupplier,
  InsertExtendedSupplier,
  plantTerroirs,
  PlantTerroir,
  InsertPlantTerroir,
  plantExtractions,
  PlantExtraction,
  InsertPlantExtraction,
  extendedSupplierMaterials,
  ExtendedSupplierMaterial,
  InsertExtendedSupplierMaterial,
  // Nouvelles tables pour les relations molécule-plante-terroir
  rawMaterials,
  RawMaterial,
  InsertRawMaterial,
  rawMaterialMolecules,
  RawMaterialMolecule,
  InsertRawMaterialMolecule,
  moleculePlantSources,
  MoleculePlantSource,
  InsertMoleculePlantSource,
  terroirSpecialties,
  TerroirSpecialty,
  InsertTerroirSpecialty,
  // Chémotypes
  chemotypes,
  Chemotype,
  // Conservation & Archives (Jour 1-2)
  olfactiveArchives,
  OlfactiveArchive,
  InsertOlfactiveArchive,
  civilizationalMarkers,
  CivilizationalMarker,
  InsertCivilizationalMarker,
  varietyGenealogy,
  VarietyGenealogy,
  InsertVarietyGenealogy,
  InsertChemotype,
  // Catégories IFRA
  ifraCategories,
  IfraCategory,
  InsertIfraCategory,
  // Sample Images (Galerie)
  sampleImages,
  SampleImage,
  InsertSampleImage,
  // Sustainable Alternatives
  sustainableAlternatives,
  SustainableAlternative,
  InsertSustainableAlternative,
  // Bibliography & Research Axes
  bibliographyEntries,
  BibliographyEntry,
  InsertBibliographyEntry,
  researchAxes,
  ResearchAxis,
  InsertResearchAxis,
  researchEntries,
  ResearchEntry,
  InsertResearchEntry,
  bibliographyAxisLinks,
  BibliographyAxisLink,
  InsertBibliographyAxisLink,
  // Reference Citations
  referenceCitations,
  ReferenceCitation,
  InsertReferenceCitation,
  // V3 References (Pack Niche Innovations)
  thematicAxes,
  ThematicAxis,
  InsertThematicAxis,
  v3References,
  V3Reference,
  InsertV3Reference,
  referenceTags,
  ReferenceTag,
  InsertReferenceTag,
  v3ReferenceTagLinks,
  V3ReferenceTagLink,
  InsertV3ReferenceTagLink,
  referenceNotes,
  ReferenceNote,
  InsertReferenceNote,
  axisConnections,
  AxisConnection,
  InsertAxisConnection,
  // Reference Entity Links & Olfactory Traditions
  referenceEntityLinks,
  ReferenceEntityLink,
  InsertReferenceEntityLink,
  olfactoryTraditions,
  OlfactoryTradition,
  InsertOlfactoryTradition,
  // Curated Journeys
  curatedJourneys,
  CuratedJourney,
  InsertCuratedJourney,
  journeyItems,
  JourneyItem,
  InsertJourneyItem,
  // Axis Reference Links
  axisReferenceLinks,
  AxisReferenceLink,
  InsertAxisReferenceLink,
  // Recette <-> Molecule (table recette_molecules)
  recetteMolecules,
  RecetteMolecule,
  InsertRecetteMolecule,
  // Recette <-> Raw Materials (liaison directe)
  recetteRawMaterials,
  RecetteRawMaterial,
  InsertRecetteRawMaterial,
  // Ghost Variety Plant Links
  ghostVarietyPlantLinks,
  GhostVarietyPlantLink,
  InsertGhostVarietyPlantLink,
  // Genomic Plant Links
  genomicPlantLinks,
  GenomicPlantLink,
  InsertGenomicPlantLink,
  // Genomic Molecule Links
  genomicMoleculeLinks,
  GenomicMoleculeLink,
  InsertGenomicMoleculeLink,
  // Ghost Varieties
  ghostVarieties,
  GhostVariety,
  InsertGhostVariety,
} from "../../drizzle/schema";
import { getDb } from './core';
import { getRawMaterialsByPlant, getRawMaterialsByTerroir } from './materials';
import { getTerroirSpecialties, getPlantTerroirSpecialties } from './terroirs';
import { getMoleculeById, getMoleculeRawMaterials, getMoleculeOrigins, getMoleculePlantSources, getPlantMoleculeSources } from './molecules';
import { getMoleculeIfraRestrictions } from './ifra';

import { ENV } from '../_core/env';
import { expandSearchQuery, getSynonyms, normalizeSearchTerm, categorizeOlfactiveTerm, getDictionaryStats } from '../../shared/olfactiveSynonyms';

export async function getPlantContributions(plantId: number, status?: string) {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    let query = `SELECT * FROM plant_contributions WHERE plant_id = ?`;
    const params: (string | number | null)[] = [plantId];
    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }
    query += ` ORDER BY created_at DESC`;
    const [rows] = await conn.execute(query, params);
    await conn.end();
    return rows as unknown[];
  } catch (error: unknown) {
    console.error('Error getting plant contributions:', error);
    return [];
  }
}

export async function getAllPendingContributionsForAdmin() {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await conn.execute(`
      SELECT pc.*, p.name as plant_name, p.latin_name as plant_latin_name,
             p.family as plant_family
      FROM plant_contributions pc
      LEFT JOIN plants p ON pc.plant_id = p.id
      WHERE pc.status = 'pending'
      ORDER BY pc.created_at DESC
    `);
    await conn.end();
    return rows as unknown[];
  } catch (error: unknown) {
    console.error('Error getting pending contributions:', error);
    return [];
  }
}

export async function getAllContributionsForAdmin(status?: string) {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    let query = `
      SELECT pc.*, p.name as plant_name, p.latin_name as plant_latin_name
      FROM plant_contributions pc
      LEFT JOIN plants p ON pc.plant_id = p.id
    `;
    const params: (string | number | null)[] = [];
    if (status) {
      query += ` WHERE pc.status = ?`;
      params.push(status);
    }
    query += ` ORDER BY pc.created_at DESC LIMIT 200`;
    const [rows] = await conn.execute(query, params);
    await conn.end();
    return rows as unknown[];
  } catch (error: unknown) {
    console.error('Error getting contributions:', error);
    return [];
  }
}

export async function submitPlantContribution(data: {
  plantId: number;
  userId: string;
  userName?: string;
  contributionType: 'image' | 'molecule' | 'terroir' | 'note' | 'bibliography' | 'gcms_analysis' | 'tradition_olfactive';
  imageUrl?: string;
  imageCaption?: string;
  imageSource?: string;
  moleculeId?: number;
  moleculeName?: string;
  moleculeConcentration?: string;
  moleculeSource?: string;
  terroir?: string;
  region?: string;
  country?: string;
  terroirNotes?: string;
  noteContent?: string;
  noteCategory?: string;
  description?: string;
  references?: string;
  // Bibliographie
  bibTitle?: string;
  bibAuthors?: string;
  bibYear?: number;
  bibJournal?: string;
  bibDoi?: string;
  bibUrl?: string;
  bibType?: string;
  // GC-MS
  gcmsMethod?: string;
  gcmsMolecules?: Record<string,unknown>;
  gcmsConditions?: string;
  // Tradition olfactive
  traditionPeriod?: string;
  traditionCulture?: string;
  traditionUsage?: string;
  traditionSources?: string;
}) {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    const [result] = await conn.execute(`
      INSERT INTO plant_contributions
        (plant_id, user_id, user_name, contribution_type,
         image_url, image_caption, image_source,
         molecule_id, molecule_name, molecule_concentration, molecule_source,
         terroir, region, country, terroir_notes,
         note_content, note_category,
         description, \`references\`,
         bib_title, bib_authors, bib_year, bib_journal, bib_doi, bib_url, bib_type,
         gcms_method, gcms_molecules, gcms_conditions,
         tradition_period, tradition_culture, tradition_usage, tradition_sources,
         status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [
      data.plantId, data.userId, data.userName || null, data.contributionType,
      data.imageUrl || null, data.imageCaption || null, data.imageSource || null,
      data.moleculeId || null, data.moleculeName || null, data.moleculeConcentration || null, data.moleculeSource || null,
      data.terroir || null, data.region || null, data.country || null, data.terroirNotes || null,
      data.noteContent || null, data.noteCategory || null,
      data.description || null, data.references || null,
      data.bibTitle || null, data.bibAuthors || null, data.bibYear || null, data.bibJournal || null,
      data.bibDoi || null, data.bibUrl || null, data.bibType || null,
      data.gcmsMethod || null, data.gcmsMolecules ? JSON.stringify(data.gcmsMolecules) : null, data.gcmsConditions || null,
      data.traditionPeriod || null, data.traditionCulture || null, data.traditionUsage || null, data.traditionSources || null,
    ]);
    await conn.end();
    return { success: true, id: (result as unknown as Record<string,unknown>).insertId as number };
  } catch (error: unknown) {
    console.error('Error submitting plant contribution:', error);
    throw error;
  }
}

export async function reviewPlantContribution(
  contributionId: number,
  action: 'approved' | 'rejected',
  reviewedBy: string,
  adminNotes?: string
) {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);

    // Récupérer la contribution AVANT de la mettre à jour
    const [rows] = await conn.execute(
      `SELECT * FROM plant_contributions WHERE id = ?`,
      [contributionId]
    ) as unknown as Record<string,unknown>[];
    const contribution = rows[0] as Record<string, unknown>;
    if (!contribution) {
      await conn.end();
      throw new Error(`Contribution #${contributionId} not found`);
    }

    // Mettre à jour le statut
    await conn.execute(`
      UPDATE plant_contributions
      SET status = ?, reviewed_by = ?, reviewed_at = NOW(), admin_notes = ?, updated_at = NOW()
      WHERE id = ?
    `, [action, reviewedBy, adminNotes || null, contributionId]);

    const integrationResults: string[] = [];

    // ====================================================
    // INTÉGRATION AUTOMATIQUE LORS DE L'APPROBATION
    // ====================================================
    if (action === 'approved') {

      // --- TYPE IMAGE : mettre à jour image_url de la plante ou créer une entrée galerie ---
      if (contribution.contribution_type === 'image' && contribution.image_url) {
        // Vérifier si la plante a déjà une image principale
        const [plantRows] = await conn.execute(
          `SELECT id, image_url FROM plants WHERE id = ?`,
          [contribution.plant_id]
        ) as unknown as Record<string,unknown>[];
        const plant = plantRows[0] as Record<string, unknown> | undefined;
        if (plant && !plant.image_url) {
          // Pas d'image principale : définir cette image comme image principale
          await conn.execute(
            `UPDATE plants SET image_url = ?, updated_at = NOW() WHERE id = ?`,
            [contribution.image_url, contribution.plant_id]
          );
          integrationResults.push(`Image définie comme image principale de la plante #${contribution.plant_id}`);
        } else {
          // La plante a déjà une image : enregistrer dans les notes botaniques
          const caption = contribution.image_caption ? ` — ${contribution.image_caption}` : '';
          const source = contribution.image_source ? ` (Source: ${contribution.image_source})` : '';
          await conn.execute(
            `UPDATE plants SET notes = CONCAT(COALESCE(notes, ''), ?) WHERE id = ?`,
            [`\n[Image contributée] ${contribution.image_url}${caption}${source}`, contribution.plant_id]
          );
          integrationResults.push(`Image ajoutée aux notes de la plante #${contribution.plant_id}`);
        }
      }

      // --- TYPE MOLECULE : créer le lien plant_molecules ---
      if (contribution.contribution_type === 'molecule') {
        if (contribution.molecule_id) {
          // Molécule existante en base : créer le lien plant_molecules
          const [existing] = await conn.execute(
            `SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?`,
            [contribution.plant_id, contribution.molecule_id]
          ) as unknown as Record<string,unknown>[];
          if ((existing as unknown as Record<string,unknown>[]).length === 0) {
            await conn.execute(`
              INSERT INTO plant_molecules
                (plant_id, molecule_id, source, notes, role, created_at, updated_at)
              VALUES (?, ?, 'contribution_utilisateur', ?, 'secondaire', NOW(), NOW())
            `, [
              contribution.plant_id,
              contribution.molecule_id,
              [contribution.molecule_source, contribution.description].filter(Boolean).join(' — ') || null
            ]);
            integrationResults.push(`Lien plant_molecules créé : plante #${contribution.plant_id} ↔ molécule #${contribution.molecule_id}`);
          } else {
            integrationResults.push(`Lien plant_molecules déjà existant pour molécule #${contribution.molecule_id}`);
          }
        } else if (contribution.molecule_name) {
          // Molécule non trouvée en base : chercher par nom exact
          const [molRows] = await conn.execute(
            `SELECT id FROM molecules WHERE LOWER(name) = LOWER(?) LIMIT 1`,
            [contribution.molecule_name]
          ) as unknown as Record<string,unknown>[];
          const mol = molRows[0] as Record<string, unknown> | undefined;
          if (mol) {
            const [existing] = await conn.execute(
              `SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?`,
              [contribution.plant_id, mol.id]
            ) as unknown as Record<string,unknown>[];
            if ((existing as unknown as Record<string,unknown>[]).length === 0) {
              await conn.execute(`
                INSERT INTO plant_molecules
                  (plant_id, molecule_id, source, notes, role, created_at, updated_at)
                VALUES (?, ?, 'contribution_utilisateur', ?, 'secondaire', NOW(), NOW())
              `, [
                contribution.plant_id,
                mol.id,
                [contribution.molecule_source, contribution.description].filter(Boolean).join(' — ') || null
              ]);
              integrationResults.push(`Lien plant_molecules créé via nom : plante #${contribution.plant_id} ↔ molécule #${mol.id} (${contribution.molecule_name})`);
            }
          } else {
            // Molécule inconnue : enregistrer dans les notes de la plante
            await conn.execute(
              `UPDATE plants SET notes = CONCAT(COALESCE(notes, ''), ?) WHERE id = ?`,
              [`\n[Molécule contributée, non trouvée en base] ${contribution.molecule_name}${contribution.molecule_concentration ? ' (' + contribution.molecule_concentration + ')' : ''}${contribution.molecule_source ? ' — Source: ' + contribution.molecule_source : ''}`, contribution.plant_id]
            );
            integrationResults.push(`Molécule "${contribution.molecule_name}" non trouvée en base — enregistrée dans les notes`);
          }
        }
      }

      // --- TYPE TERROIR : créer le lien plant_terroirs ---
      if (contribution.contribution_type === 'terroir') {
        const terroirName = [contribution.terroir, contribution.region, contribution.country].filter(Boolean).join(', ');
        if (terroirName) {
          // Chercher un terroir correspondant par nom ou région
          const [terroirRows] = await conn.execute(
            `SELECT id FROM terroirs WHERE LOWER(name) LIKE LOWER(?) OR LOWER(region) LIKE LOWER(?) LIMIT 1`,
            [`%${contribution.terroir || contribution.region}%`, `%${contribution.region || contribution.terroir}%`]
          ) as unknown as Record<string,unknown>[];
          const terroir = terroirRows[0] as Record<string, unknown> | undefined;
          if (terroir) {
            // Vérifier si le lien n'existe pas déjà
            const [existingLink] = await conn.execute(
              `SELECT id FROM plant_terroirs WHERE plant_id = ? AND terroir_id = ?`,
              [contribution.plant_id, terroir.id]
            ) as unknown as Record<string,unknown>[];
            if ((existingLink as unknown as Record<string,unknown>[]).length === 0) {
              await conn.execute(`
                INSERT INTO plant_terroirs (plant_id, terroir_id, quality_notes, notes, created_at)
                VALUES (?, ?, ?, 'Lien créé via contribution utilisateur', NOW())
              `, [contribution.plant_id, terroir.id, contribution.terroir_notes || null]);
              integrationResults.push(`Lien plant_terroirs créé : plante #${contribution.plant_id} ↔ terroir #${terroir.id} (${terroirName})`);
            } else {
              integrationResults.push(`Lien plant_terroirs déjà existant pour terroir #${terroir.id}`);
            }
          } else {
            // Terroir non trouvé : enregistrer dans les notes de la plante
            await conn.execute(
              `UPDATE plants SET notes = CONCAT(COALESCE(notes, ''), ?) WHERE id = ?`,
              [`\n[Terroir contribué, non trouvé en base] ${terroirName}${contribution.terroir_notes ? ' — ' + contribution.terroir_notes : ''}`, contribution.plant_id]
            );
            integrationResults.push(`Terroir "${terroirName}" non trouvé en base — enregistré dans les notes`);
          }
        }
      }

      // --- TYPE NOTE : ajouter dans les notes ou propriétés ethnobotaniques de la plante ---
      if (contribution.contribution_type === 'note' && contribution.note_content) {
        const category = contribution.note_category || 'observation';
        const noteText = `\n[Note ${category} — ${new Date().toISOString().split('T')[0]}] ${contribution.note_content}${contribution.references ? ' (Réf: ' + contribution.references + ')' : ''}`;
        if (category === 'ethnobotanique') {
          // Ajouter aux usages ethnobotaniques (champ JSON)
          const [plantRows] = await conn.execute(
            `SELECT ethnobotanical_uses FROM plants WHERE id = ?`,
            [contribution.plant_id]
          ) as unknown as Record<string,unknown>[];
          const plant = plantRows[0] as Record<string, unknown>;
          let uses: Record<string,unknown>[] = [];
          try { uses = JSON.parse((plant?.ethnobotanical_uses as string) || '[]'); } catch { uses = []; }
          uses.push({ source: 'contribution', date: new Date().toISOString().split('T')[0], content: contribution.note_content, references: contribution.references || null });
          await conn.execute(
            `UPDATE plants SET ethnobotanical_uses = ?, updated_at = NOW() WHERE id = ?`,
            [JSON.stringify(uses), contribution.plant_id]
          );
          integrationResults.push(`Note ethnobotanique intégrée dans ethnobotanical_uses de la plante #${contribution.plant_id}`);
        } else {
          // Ajouter dans les notes textuelles
          await conn.execute(
            `UPDATE plants SET notes = CONCAT(COALESCE(notes, ''), ?), updated_at = NOW() WHERE id = ?`,
            [noteText, contribution.plant_id]
          );
          integrationResults.push(`Note (${category}) intégrée dans les notes de la plante #${contribution.plant_id}`);
        }
      }
    }

    await conn.end();
    return { success: true, integrationResults };
  } catch (error: unknown) {
    console.error('Error reviewing plant contribution:', error);
    throw error;
  }
}

export async function getContributionStats() {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await conn.execute(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN contribution_type = 'image' THEN 1 ELSE 0 END) as images,
        SUM(CASE WHEN contribution_type = 'molecule' THEN 1 ELSE 0 END) as molecules,
        SUM(CASE WHEN contribution_type = 'terroir' THEN 1 ELSE 0 END) as terroirs,
        SUM(CASE WHEN contribution_type = 'note' THEN 1 ELSE 0 END) as notes
      FROM plant_contributions
    `);
    await conn.end();
    return (rows as unknown[])[0] || { total: 0, pending: 0, approved: 0, rejected: 0 };
  } catch (error: unknown) {
    console.error('Error getting contribution stats:', error);
    return { total: 0, pending: 0, approved: 0, rejected: 0 };
  }
}


// ============================================================================
// MOLÉCULES EXCLUSIVES AUX ESPÈCES MENACÉES
// ============================================================================

/**
 * Retourne les molécules présentes UNIQUEMENT dans des plantes CR/EN/EX/EW
 * (absentes de toutes les plantes LC/VU/NT/NE)
 */
