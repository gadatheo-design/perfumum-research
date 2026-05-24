import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "../db";
import { or, lt } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";
import { molecules, plants } from "../../drizzle/schema";

export const bibliographyRouter = router({
    // Lister toutes les références avec filtres
    list: publicProcedure
      .input(z.object({
        entryType: z.string().optional(),
        researchDomain: z.string().optional(),
        year: z.number().optional(),
        yearMin: z.number().optional(),
        yearMax: z.number().optional(),
        readStatus: z.string().optional(),
        search: z.string().optional(),
        axisId: z.number().optional(),
        entityType: z.string().optional(), // 'plant' | 'molecule' | 'variety' | 'any'
        hasLinks: z.boolean().optional(), // true = avec liaisons, false = sans liaisons
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getAllBibliographyEntries(input || {});
      }),
    
    // Obtenir une référence par ID
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getBibliographyEntryById(input);
      }),
    
    // Obtenir une référence par clé
    getByKey: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getBibliographyEntryByKey(input);
      }),
    
    // Créer une nouvelle référence
    create: protectedProcedure
      .input(z.object({
        entryKey: z.string(),
        entryType: z.enum(['article', 'book', 'inbook', 'incollection', 'inproceedings', 'conference', 'thesis', 'mastersthesis', 'phdthesis', 'techreport', 'manual', 'unpublished', 'misc', 'online', 'patent', 'standard', 'dataset', 'software']).default('article'),
        title: z.string(),
        authors: z.string().optional(),
        year: z.number().optional(),
        journal: z.string().optional(),
        booktitle: z.string().optional(),
        publisher: z.string().optional(),
        volume: z.string().optional(),
        number: z.string().optional(),
        pages: z.string().optional(),
        edition: z.string().optional(),
        chapter: z.string().optional(),
        doi: z.string().optional(),
        isbn: z.string().optional(),
        issn: z.string().optional(),
        pmid: z.string().optional(),
        arxivId: z.string().optional(),
        url: z.string().optional(),
        abstract: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        language: z.string().optional(),
        researchDomain: z.enum(['chimie_olfactive', 'botanique', 'ethnobotanique', 'histoire_parfumerie', 'neurologie_olfactive', 'extraction', 'formulation', 'reglementation', 'durabilite', 'tabac_cannabis', 'methodologie', 'autre']).optional(),
        relevanceScore: z.number().optional(),
        tags: z.array(z.string()).optional(),
        notes: z.string().optional(),
        annotation: z.string().optional(),
        pdfUrl: z.string().optional(),
        readStatus: z.enum(['unread', 'reading', 'read', 'to_review']).optional(),
        linkedMoleculeIds: z.array(z.number()).optional(),
        linkedPlantIds: z.array(z.number()).optional(),
        linkedRecetteIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createBibliographyEntry({
          ...input,
          addedBy: ctx.user?.id,
        });
      }),
    
    // Mettre à jour une référence
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        entryKey: z.string().optional(),
        entryType: z.enum(['article', 'book', 'inbook', 'incollection', 'inproceedings', 'conference', 'thesis', 'mastersthesis', 'phdthesis', 'techreport', 'manual', 'unpublished', 'misc', 'online', 'patent', 'standard', 'dataset', 'software']).optional(),
        title: z.string().optional(),
        authors: z.string().optional(),
        year: z.number().optional(),
        journal: z.string().optional(),
        booktitle: z.string().optional(),
        publisher: z.string().optional(),
        volume: z.string().optional(),
        number: z.string().optional(),
        pages: z.string().optional(),
        doi: z.string().optional(),
        isbn: z.string().optional(),
        issn: z.string().optional(),
        url: z.string().optional(),
        abstract: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        researchDomain: z.enum(['chimie_olfactive', 'botanique', 'ethnobotanique', 'histoire_parfumerie', 'neurologie_olfactive', 'extraction', 'formulation', 'reglementation', 'durabilite', 'tabac_cannabis', 'methodologie', 'autre']).optional(),
        relevanceScore: z.number().optional(),
        tags: z.array(z.string()).optional(),
        notes: z.string().optional(),
        annotation: z.string().optional(),
        readStatus: z.enum(['unread', 'reading', 'read', 'to_review']).optional(),
        linkedMoleculeIds: z.array(z.number()).optional(),
        linkedPlantIds: z.array(z.number()).optional(),
        linkedRecetteIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateBibliographyEntry(id, data);
      }),
    
    // Supprimer une référence
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteBibliographyEntry(input);
      }),
    
    // Statistiques
    getStats: publicProcedure.query(async () => {
      return db.getBibliographyStats();
    }),
    
    // Import en masse (BibTeX)
    importBibTeX: protectedProcedure
      .input(z.string())
      .mutation(async ({ input, ctx }) => {
        const entries = db.parseBibTeX(input);
        const entriesWithUser = entries
          .filter((e: Record<string,unknown>) => e.entryKey && e.title)
          .map((e: Record<string,unknown>) => ({
            ...e,
            title: (e.title as string) || 'Sans titre',
            entryKey: (e.entryKey as string) || `import_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            addedBy: ctx.user?.id,
          }));
        return db.bulkCreateBibliographyEntries(entriesWithUser as any);
      }),
    
    // Import en masse (CSV)
    importCSV: protectedProcedure
      .input(z.string())
      .mutation(async ({ input, ctx }) => {
        const entries = db.parseCSVBibliography(input);
        const entriesWithUser = entries
          .filter((e: Record<string,unknown>) => e.entryKey && e.title)
          .map((e: Record<string,unknown>) => ({
            ...e,
            title: (e.title as string) || 'Sans titre',
            entryKey: (e.entryKey as string) || `csv_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            addedBy: ctx.user?.id,
          }));
        return db.bulkCreateBibliographyEntries(entriesWithUser as any);
      }),
    
    // Export BibTeX
    exportBibTeX: publicProcedure
      .input(z.array(z.number()).optional())
      .query(async ({ input }) => {
        const result = await db.getAllBibliographyEntries({});
        const entries = result.entries || [];
        const filteredEntries = input && input.length > 0
          ? entries.filter((e: Record<string,unknown>) => input.includes(e.id as number))
          : entries;
        return db.exportToBibTeX(filteredEntries);
      }),
    
    // Export APA
    exportAPA: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const entry = await db.getBibliographyEntryById(input);
        if (!entry) return null;
        return db.exportToAPA(entry);
      }),
    
    // Export Chicago
    exportChicago: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const entry = await db.getBibliographyEntryById(input);
        if (!entry) return null;
        return db.exportToChicago(entry);
      }),
    
    // Lier une référence à un axe
    linkToAxis: protectedProcedure
      .input(z.object({
        bibliographyId: z.number(),
        axisId: z.number(),
        relevance: z.enum(['primaire', 'secondaire', 'contextuelle']).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.linkBibliographyToAxis(input.bibliographyId, input.axisId, input.relevance, input.notes);
      }),
    
    // Délier une référence d'un axe
    unlinkFromAxis: protectedProcedure
      .input(z.object({
        bibliographyId: z.number(),
        axisId: z.number(),
      }))
      .mutation(async ({ input }) => {
        return db.unlinkBibliographyFromAxis(input.bibliographyId, input.axisId);
      }),
    
    // Obtenir les axes liés à une référence
    getLinkedAxes: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getAxesByBibliography(input);
      }),

    // Obtenir les références liées à une molécule
    getByMolecule: publicProcedure
      .input(z.object({ moleculeId: z.number() }))
      .query(async ({ input }) => {
        const dbConn = await db.getDb();
        if (!dbConn) return [];
        const { sql } = await import('drizzle-orm');
        const result = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
          `SELECT be.id, be.entry_key, be.title, be.authors, be.year, be.journal, be.doi, be.url, be.abstract, be.research_domain as researchDomain, be.relevance_score as relevanceScore
           FROM bibliography_entries be
           INNER JOIN bibliography_entity_links bel ON bel.bibliography_id = be.id
           WHERE bel.entity_type = 'molecule' AND bel.entity_id = ${input.moleculeId}
           LIMIT 20`
        ));
        // MySQL2 execute returns [rows, fields]
        return Array.isArray(result) ? result[0] as Record<string, unknown>[] : [];
      }),

    // Obtenir les références liées à une plante
    getByPlant: publicProcedure
      .input(z.object({ plantId: z.number() }))
      .query(async ({ input }) => {
        const dbConn = await db.getDb();
        if (!dbConn) return [];
        const { sql } = await import('drizzle-orm');
        const result = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
          `SELECT be.id, be.entry_key, be.title, be.authors, be.year, be.journal, be.doi, be.url, be.abstract, be.research_domain as researchDomain, be.relevance_score as relevanceScore
           FROM bibliography_entries be
           INNER JOIN bibliography_entity_links bel ON bel.bibliography_id = be.id
           WHERE bel.entity_type = 'plant' AND bel.entity_id = ${input.plantId}
           LIMIT 20`
        ));
        // MySQL2 execute returns [rows, fields]
        return Array.isArray(result) ? result[0] as Record<string, unknown>[] : [];
      }),

    // Liaison automatique par LLM — traite un batch de références non liées
    autoLinkByLLM: protectedProcedure
      .input(z.object({
        batchSize: z.number().min(1).max(20).default(10),
        offset: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import('../_core/llm');
        const dbConn = await db.getDb();
        if (!dbConn) throw new Error('DB non disponible');
        const { sql } = await import('drizzle-orm');

        // 1. Récupérer les références sans liaisons
        const unlinkedResult = await (dbConn as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(
          `SELECT id, title, abstract, research_domain, keywords
           FROM bibliography_entries
           WHERE NOT EXISTS (
             SELECT 1 FROM bibliography_entity_links bel WHERE bel.bibliography_id = bibliography_entries.id
           )
           ORDER BY id
           LIMIT ${input.batchSize} OFFSET ${input.offset}`
        ));
        const unlinked: Record<string,unknown>[] = Array.isArray(unlinkedResult) ? unlinkedResult[0] as Record<string,unknown>[] : [];
        if (unlinked.length === 0) return { processed: 0, linked: 0, message: 'Aucune référence non liée trouvée' };

        // 2. Récupérer les noms de plantes et molécules pour le matching
        const plantsResult = await (dbConn as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(
          'SELECT id, name, latin_name FROM plants ORDER BY name LIMIT 500'
        ));
        const molsResult = await (dbConn as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(
          'SELECT id, name, iupac_name FROM molecules ORDER BY name LIMIT 500'
        ));
        const plants: Record<string,unknown>[] = Array.isArray(plantsResult) ? plantsResult[0] as Record<string,unknown>[] : [];
        const molecules: Record<string,unknown>[] = Array.isArray(molsResult) ? molsResult[0] as Record<string,unknown>[] : [];

        // 3. Appel LLM pour extraire les entités de chaque référence
        let totalLinked = 0;
        const results: Record<string,unknown>[] = [];

        for (const ref of unlinked) {
          try {
            const plantNames = plants.slice(0, 200).map((p: Record<string,unknown>) => String(p.name) + (p.latin_name ? ` (${p.latin_name})` : '')).join(', ');
            const molNames = molecules.slice(0, 200).map((m: Record<string,unknown>) => String(m.name)).join(', ');

            const llmResponse = await invokeLLM({
              messages: [
                {
                  role: 'system',
                  content: `Tu es un expert en botanique et chimie olfactive. Analyse le titre et l'abstract d'une référence bibliographique et identifie les entités (plantes, molécules) mentionnées parmi les listes fournies. Retourne uniquement du JSON valide.`
                },
                {
                  role: 'user',
                  content: `Titre: "${ref.title}"\nAbstract: "${ref.abstract || ''}"\nDomaine: ${ref.research_domain || ''}\n\nPlantes disponibles (extrait): ${plantNames.substring(0, 1000)}\nMolécules disponibles (extrait): ${molNames.substring(0, 1000)}\n\nIdentifie les entités mentionnées. Retourne: {"plants": ["nom exact"], "molecules": ["nom exact"]}`
                }
              ],
              response_format: {
                type: 'json_schema',
                json_schema: {
                  name: 'entity_extraction',
                  strict: true,
                  schema: {
                    type: 'object',
                    properties: {
                      plants: { type: 'array', items: { type: 'string' } },
                      molecules: { type: 'array', items: { type: 'string' } },
                    },
                    required: ['plants', 'molecules'],
                    additionalProperties: false,
                  }
                }
              }
            });

            const content = llmResponse.choices?.[0]?.message?.content;
            if (!content) continue;
            const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

            const extracted = JSON.parse(contentStr);
            let refLinked = 0;

            // Lier les plantes trouvées
            for (const plantName of (extracted.plants || [])) {
              const plant = plants.find((p: Record<string,unknown>) =>
                (p.name as string).toLowerCase() === plantName.toLowerCase() ||
                (p.latin_name && (p.latin_name as string).toLowerCase().includes(plantName.toLowerCase()))
              );
              if (plant) {
                try {
                  await (dbConn as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(
                    `INSERT IGNORE INTO bibliography_entity_links (bibliography_id, entity_type, entity_id, link_type, relevance_score, notes, created_at)
                     VALUES (${ref.id}, 'plant', ${plant.id}, 'primary_source', 75, 'Lié automatiquement par LLM', NOW())`
                  ));
                  refLinked++;
                } catch {}
              }
            }

            // Lier les molécules trouvées
            for (const molName of (extracted.molecules || [])) {
              const mol = molecules.find((m: Record<string,unknown>) =>
                (m.name as string).toLowerCase() === molName.toLowerCase()
              );
              if (mol) {
                try {
                  await (dbConn as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(
                    `INSERT IGNORE INTO bibliography_entity_links (bibliography_id, entity_type, entity_id, link_type, relevance_score, notes, created_at)
                     VALUES (${ref.id}, 'molecule', ${mol.id}, 'chemical', 75, 'Lié automatiquement par LLM', NOW())`
                  ));
                  refLinked++;
                } catch {}
              }
            }

            totalLinked += refLinked;
            results.push({ id: ref.id, title: (ref.title as string).substring(0, 60), plants: extracted.plants, molecules: extracted.molecules, linked: refLinked });
          } catch (err: unknown) {
            results.push({ id: ref.id, title: (ref.title as string | undefined)?.substring(0, 60), error: (err as Error).message });
          }
        }

        return {
          processed: unlinked.length,
          linked: totalLinked,
          results,
        };
      }),

    // ─── Appliquer les données enrichies en base (CrossRef / OpenAlex) ────────
    applyEnrichment: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        authors: z.string().optional(),
        year: z.number().nullable().optional(),
        journal: z.string().nullable().optional(),
        doi: z.string().nullable().optional(),
        url: z.string().nullable().optional(),
        pdfUrl: z.string().nullable().optional(),
        abstract: z.string().nullable().optional(),
        citationsCount: z.number().nullable().optional(),
        publisher: z.string().nullable().optional(),
        volume: z.string().nullable().optional(),
        issue: z.string().nullable().optional(),
        pages: z.string().nullable().optional(),
        source: z.enum(['crossref', 'openalex']).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, source, pdfUrl, citationsCount, ...fields } = input;
        const updateData: Record<string, unknown> = {};
        if (fields.title !== undefined) updateData.title = fields.title;
        if (fields.authors !== undefined) updateData.authors = fields.authors;
        if (fields.year !== undefined) updateData.year = fields.year;
        if (fields.journal !== undefined) updateData.journal = fields.journal;
        if (fields.doi !== undefined) updateData.doi = fields.doi;
        // Préférer le PDF open access si disponible
        if (pdfUrl) updateData.url = pdfUrl;
        else if (fields.url !== undefined) updateData.url = fields.url;
        if (fields.abstract !== undefined) updateData.abstract = fields.abstract;
        if (fields.publisher !== undefined) updateData.publisher = fields.publisher;
        if (fields.volume !== undefined) updateData.volume = fields.volume;
        if (fields.issue !== undefined) updateData.issue = fields.issue;
        if (fields.pages !== undefined) updateData.pages = fields.pages;
        const sourceLabel = source === 'crossref' ? 'CrossRef' : source === 'openalex' ? 'OpenAlex' : 'API externe';
        updateData.notes = `Enrichi via ${sourceLabel} le ${new Date().toLocaleDateString('fr-FR')}`;
        return db.updateBibliographyEntry(id, updateData as Parameters<typeof db.updateBibliographyEntry>[1]);
      }),

    // ─── Enrichissement automatique depuis CrossRef (par DOI) ────────────────
    enrichFromDOI: publicProcedure
      .input(z.object({ doi: z.string() }))
      .query(async ({ input }) => {
        const doi = input.doi.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//, '');
        const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
        const res = await fetch(url, { headers: { 'User-Agent': 'PERFUMUM-Research/1.0 (mailto:research@perfumum.fr)' } });
        if (!res.ok) throw new Error(`CrossRef: ${res.status} pour DOI ${doi}`);
        const json = await res.json() as { message: Record<string, unknown> };
        const m = json.message;
        const authorsArr = (m.author as Array<{ family?: string; given?: string }> | undefined) || [];
        const authors = authorsArr.map(a => [a.family, a.given].filter(Boolean).join(', ')).join(' and ');
        const dateParts = (m['published-print'] || m['published-online'] || m['issued']) as { 'date-parts'?: number[][] } | undefined;
        const year = dateParts?.['date-parts']?.[0]?.[0] ?? null;
        const containerTitles = m['container-title'] as string[] | undefined;
        const journal = containerTitles?.[0] ?? null;
        const oaLink = (m.link as Array<{ URL: string; 'content-type': string }> | undefined)
          ?.find(l => l['content-type'] === 'application/pdf')?.URL ?? null;
        return {
          title: (m.title as string[] | undefined)?.[0] ?? '',
          authors,
          year,
          journal,
          publisher: (m.publisher as string | undefined) ?? null,
          volume: (m.volume as string | undefined) ?? null,
          issue: (m.issue as string | undefined) ?? null,
          pages: (m.page as string | undefined) ?? null,
          doi,
          issn: (m.ISSN as string[] | undefined)?.[0] ?? null,
          abstract: (m.abstract as string | undefined)?.replace(/<[^>]+>/g, '') ?? null,
          url: (m.URL as string | undefined) ?? null,
          pdfUrl: oaLink,
          source: 'crossref' as const,
        };
      }),

    // ─── Enrichissement automatique depuis OpenAlex (par titre ou DOI) ───────
    enrichFromTitle: publicProcedure
      .input(z.object({ title: z.string(), doi: z.string().optional() }))
      .query(async ({ input }) => {
        let apiUrl: string;
        if (input.doi) {
          const doi = input.doi.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//, '');
          apiUrl = `https://api.openalex.org/works/https://doi.org/${encodeURIComponent(doi)}?mailto=research@perfumum.fr`;
        } else {
          const q = encodeURIComponent(input.title.trim());
          apiUrl = `https://api.openalex.org/works?search=${q}&per-page=5&mailto=research@perfumum.fr`;
        }
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`OpenAlex: ${res.status}`);
        const json = await res.json() as Record<string, unknown>;
        const works: Record<string, unknown>[] = json.results
          ? (json.results as Record<string, unknown>[])
          : [json];
        return works.slice(0, 5).map(w => {
          const authorships = (w.authorships as Array<{ author: { display_name: string } }> | undefined) || [];
          const authors = authorships.map(a => a.author.display_name).join(' and ');
          const oa = w.open_access as { oa_url?: string } | undefined;
          const doi = w.doi ? String(w.doi).replace('https://doi.org/', '') : null;
          return {
            title: String(w.display_name || w.title || ''),
            authors,
            year: w.publication_year ? Number(w.publication_year) : null,
            journal: (w.primary_location as { source?: { display_name?: string } } | undefined)?.source?.display_name ?? null,
            doi,
            url: doi ? `https://doi.org/${doi}` : null,
            pdfUrl: oa?.oa_url ?? null,
            citationsCount: w.cited_by_count ? Number(w.cited_by_count) : 0,
            source: 'openalex' as const,
          };
        });
      }),

    // ─── Importer un article PubMed dans PERFUMUM + lien molécule ──────────────
    importFromPubMed: protectedProcedure
      .input(z.object({
        pmid: z.string(),
        title: z.string(),
        firstAuthor: z.string().optional(),
        year: z.number().nullable().optional(),
        journal: z.string().optional(),
        doi: z.string().nullable().optional(),
        url: z.string(),
        moleculeId: z.number().optional(),
        moleculeName: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { pmid, title, firstAuthor, year, journal, doi, url, moleculeId, moleculeName } = input;
        // Vérifier si la référence existe déjà (par DOI ou PMID dans notes)
        const dbConn = await db.getDb();
        if (!dbConn) throw new Error('DB non disponible');
        const { sql } = await import('drizzle-orm');
        const existingResult = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
          doi
            ? `SELECT id FROM bibliography_entries WHERE doi = ${JSON.stringify(doi)} LIMIT 1`
            : `SELECT id FROM bibliography_entries WHERE notes LIKE '%PMID:${pmid}%' LIMIT 1`
        ));
        const existingRows = Array.isArray(existingResult) ? existingResult[0] as Record<string, unknown>[] : [];
        let entryId: number = 0;
        if (existingRows.length > 0) {
          entryId = Number(existingRows[0].id);
        } else {
          // Créer la référence
          const pmidKey = `pubmed_${pmid}`;
          const newEntry = await db.createBibliographyEntry({
            entryKey: pmidKey,
            entryType: 'article',
            title,
            authors: firstAuthor || '',
            year: year ?? null,
            journal: journal || null,
            doi: doi || null,
            url,
            notes: `Importé depuis PubMed. PMID:${pmid}${moleculeName ? `. Molécule: ${moleculeName}` : ''}`,
            tags: ['pubmed', 'auto-import'],
            readStatus: 'unread',
          });
          if (newEntry) entryId = newEntry.id;
        }
        // Créer le lien molécule ↔ publication si moleculeId fourni
        if (moleculeId && entryId) {
          const linkExists = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
            `SELECT id FROM bibliography_entity_links WHERE bibliography_id = ${entryId} AND entity_type = 'molecule' AND entity_id = ${moleculeId} LIMIT 1`
          ));
          const linkRows = Array.isArray(linkExists) ? linkExists[0] as Record<string, unknown>[] : [];
          if (linkRows.length === 0) {
            await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
              `INSERT INTO bibliography_entity_links (bibliography_id, entity_type, entity_id, link_type, relevance_score, notes, created_at) VALUES (${entryId}, 'molecule', ${moleculeId}, 'chemical', 70, 'Importé depuis PubMed', NOW())`
            ));
          }
        }
        return { success: true, entryId, alreadyExisted: existingRows.length > 0 };
      }),

    // ─── Références liées à une recette ─────────────────────────────────────────
    getByRecette: publicProcedure
      .input(z.object({ recetteId: z.number() }))
      .query(async ({ input }) => {
        const dbConn = await db.getDb();
        if (!dbConn) return [];
        const { sql } = await import('drizzle-orm');
        const result = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
          `SELECT be.id, be.entry_key, be.title, be.authors, be.year, be.journal, be.doi, be.url, be.abstract, be.research_domain as researchDomain, be.relevance_score as relevanceScore
           FROM bibliography_entries be
           INNER JOIN bibliography_entity_links bel ON bel.bibliography_id = be.id
           WHERE bel.entity_type = 'recette' AND bel.entity_id = ${input.recetteId}
           LIMIT 20`
        ));
        return Array.isArray(result) ? result[0] as Record<string, unknown>[] : [];
      }),

    // ─── Références liées à un terroir ──────────────────────────────────────────
    getByTerroir: publicProcedure
      .input(z.object({ terroirId: z.number() }))
      .query(async ({ input }) => {
        const dbConn = await db.getDb();
        if (!dbConn) return [];
        const { sql } = await import('drizzle-orm');
        const result = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
          `SELECT be.id, be.entry_key, be.title, be.authors, be.year, be.journal, be.doi, be.url, be.abstract, be.research_domain as researchDomain, be.relevance_score as relevanceScore
           FROM bibliography_entries be
           INNER JOIN bibliography_entity_links bel ON bel.bibliography_id = be.id
           WHERE bel.entity_type = 'terroir' AND bel.entity_id = ${input.terroirId}
           LIMIT 20`
        ));
        return Array.isArray(result) ? result[0] as Record<string, unknown>[] : [];
      }),

    // ─── Références liées à un axe de recherche ──────────────────────────────────
    getByResearchAxis: publicProcedure
      .input(z.object({ axisId: z.number() }))
      .query(async ({ input }) => {
        const dbConn = await db.getDb();
        if (!dbConn) return [];
        const { sql } = await import('drizzle-orm');
        const result = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
          `SELECT be.id, be.entry_key, be.title, be.authors, be.year, be.journal, be.doi, be.url, be.abstract, be.research_domain as researchDomain, be.relevance_score as relevanceScore, bel.relevance as linkRelevance, bel.notes as linkNotes
           FROM bibliography_entries be
           INNER JOIN bibliography_axis_links bel ON bel.bibliography_id = be.id
           WHERE bel.axis_id = ${input.axisId}
           ORDER BY be.relevance_score DESC
           LIMIT 50`
        ));
        return Array.isArray(result) ? result[0] as Record<string, unknown>[] : [];
      }),

    // ─── Lier une référence à une recette ────────────────────────────────────────
    linkToRecette: protectedProcedure
      .input(z.object({
        bibliographyId: z.number(),
        recetteId: z.number(),
        linkType: z.string().optional(),
        relevanceScore: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const dbConn = await db.getDb();
        if (!dbConn) throw new Error('DB non disponible');
        const { sql } = await import('drizzle-orm');
        await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
          `INSERT IGNORE INTO bibliography_entity_links (bibliography_id, entity_type, entity_id, link_type, relevance_score, notes, created_at)
           VALUES (${input.bibliographyId}, 'recette', ${input.recetteId}, ${JSON.stringify(input.linkType || 'formulation')}, ${input.relevanceScore || 70}, ${JSON.stringify(input.notes || '')}, NOW())`
        ));
        return { success: true };
      }),

    // ─── Lier une référence à un terroir ─────────────────────────────────────────
    linkToTerroir: protectedProcedure
      .input(z.object({
        bibliographyId: z.number(),
        terroirId: z.number(),
        linkType: z.string().optional(),
        relevanceScore: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const dbConn = await db.getDb();
        if (!dbConn) throw new Error('DB non disponible');
        const { sql } = await import('drizzle-orm');
        await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
          `INSERT IGNORE INTO bibliography_entity_links (bibliography_id, entity_type, entity_id, link_type, relevance_score, notes, created_at)
           VALUES (${input.bibliographyId}, 'terroir', ${input.terroirId}, ${JSON.stringify(input.linkType || 'geographic')}, ${input.relevanceScore || 70}, ${JSON.stringify(input.notes || '')}, NOW())`
        ));
        return { success: true };
      }),

    // ─── Lier une référence à une plante (entity_link) ───────────────────────────
    linkToPlant: protectedProcedure
      .input(z.object({
        bibliographyId: z.number(),
        plantId: z.number(),
        linkType: z.string().optional(),
        relevanceScore: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const dbConn = await db.getDb();
        if (!dbConn) throw new Error('DB non disponible');
        const { sql } = await import('drizzle-orm');
        await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
          `INSERT IGNORE INTO bibliography_entity_links (bibliography_id, entity_type, entity_id, link_type, relevance_score, notes, created_at)
           VALUES (${input.bibliographyId}, 'plant', ${input.plantId}, ${JSON.stringify(input.linkType || 'primary_source')}, ${input.relevanceScore || 75}, ${JSON.stringify(input.notes || '')}, NOW())`
        ));
        return { success: true };
      }),

    // ─── Lier une référence à une molécule (entity_link) ─────────────────────────
    linkToMolecule: protectedProcedure
      .input(z.object({
        bibliographyId: z.number(),
        moleculeId: z.number(),
        linkType: z.string().optional(),
        relevanceScore: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const dbConn = await db.getDb();
        if (!dbConn) throw new Error('DB non disponible');
        const { sql } = await import('drizzle-orm');
        await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
          `INSERT IGNORE INTO bibliography_entity_links (bibliography_id, entity_type, entity_id, link_type, relevance_score, notes, created_at)
           VALUES (${input.bibliographyId}, 'molecule', ${input.moleculeId}, ${JSON.stringify(input.linkType || 'chemical')}, ${input.relevanceScore || 75}, ${JSON.stringify(input.notes || '')}, NOW())`
        ));
        return { success: true };
      }),

    // ─── Recherche Semantic Scholar (API gratuite) ────────────────────────────────
    searchSemanticScholar: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        const q = encodeURIComponent(input.query.trim());
        const limit = input.limit || 5;
        const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${q}&limit=${limit}&fields=title,authors,year,journal,externalIds,openAccessPdf,citationCount,abstract,url`;
        const res = await fetch(url, { headers: { 'User-Agent': 'PERFUMUM-Research/1.0' }, signal: AbortSignal.timeout(10000) });
        if (!res.ok) throw new Error(`Semantic Scholar: ${res.status}`);
        const json = await res.json() as { data?: Record<string, unknown>[] };
        return (json.data || []).map((p: Record<string, unknown>) => ({
          title: String(p.title || ''),
          authors: ((p.authors as Array<{ name: string }> | undefined) || []).map(a => a.name).join(' and '),
          year: p.year ? Number(p.year) : null,
          journal: (p.journal as { name?: string } | undefined)?.name ?? null,
          doi: (p.externalIds as Record<string, string> | undefined)?.DOI ?? null,
          pmid: (p.externalIds as Record<string, string> | undefined)?.PubMed ?? null,
          pdfUrl: (p.openAccessPdf as { url?: string } | undefined)?.url ?? null,
          citationsCount: p.citationCount ? Number(p.citationCount) : 0,
          abstract: (p.abstract as string | undefined) ?? null,
          url: (p.url as string | undefined) ?? null,
          source: 'semanticscholar' as const,
        }));
      }),

    // ─── Recherche Europe PMC (accès libre) ──────────────────────────────────────
    searchEuropePMC: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        const q = encodeURIComponent(input.query.trim());
        const limit = input.limit || 5;
        const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${q}&resultType=core&pageSize=${limit}&format=json`;
        const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
        if (!res.ok) throw new Error(`Europe PMC: ${res.status}`);
        const json = await res.json() as { resultList?: { result?: Record<string, unknown>[] } };
        return (json.resultList?.result || []).map((p: Record<string, unknown>) => ({
          title: String(p.title || ''),
          authors: String(p.authorString || ''),
          year: p.pubYear ? Number(p.pubYear) : null,
          journal: (p.journalInfo as { journal?: { title?: string } } | undefined)?.journal?.title ?? null,
          doi: (p.doi as string | undefined) ?? null,
          pmid: (p.pmid as string | undefined) ?? null,
          pdfUrl: (p.isOpenAccess === 'Y' && p.fullTextUrlList) ? ((p.fullTextUrlList as { fullTextUrl?: Array<{ url: string; documentStyle: string }> }).fullTextUrl?.find(u => u.documentStyle === 'pdf')?.url ?? null) : null,
          citationsCount: p.citedByCount ? Number(p.citedByCount) : 0,
          abstract: (p.abstractText as string | undefined) ?? null,
          url: p.doi ? `https://doi.org/${p.doi}` : null,
          source: 'europepmc' as const,
        }));
      }),

    // ─── Statistiques des liaisons bibliographiques ───────────────────────────────
    getLinkStats: publicProcedure.query(async () => {
        const dbConn = await db.getDb();
        if (!dbConn) return { total: 0, byType: {} };
        const { sql } = await import('drizzle-orm');
        const result = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
          `SELECT entity_type, COUNT(*) as count FROM bibliography_entity_links GROUP BY entity_type`
        ));
        const rows = Array.isArray(result) ? result[0] as Record<string, unknown>[] : [];
        const byType: Record<string, number> = {};
        let total = 0;
        for (const row of rows) {
          byType[String(row.entity_type)] = Number(row.count);
          total += Number(row.count);
        }
        return { total, byType };
      }),
});
