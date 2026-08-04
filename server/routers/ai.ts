import { z } from "zod";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "../db";
import { or, lt } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";
import { molecules, plants } from "../../drizzle/schema";

export const aiRouter = router({
    // Classifier une molécule avec l'IA
    classifyMolecule: adminProcedure
      .input(z.object({
        name: z.string(),
        iupacName: z.string().optional(),
        casNumber: z.string().optional(),
        chemicalFormula: z.string().optional(),
        olfactiveProfile: z.string().optional(),
        botanicalSources: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("../_core/llm");
        
        // Construire le contexte pour l'IA
        const moleculeContext = [
          `Nom: ${input.name}`,
          input.iupacName ? `Nom IUPAC: ${input.iupacName}` : null,
          input.casNumber ? `Numéro CAS: ${input.casNumber}` : null,
          input.chemicalFormula ? `Formule chimique: ${input.chemicalFormula}` : null,
          input.olfactiveProfile ? `Profil olfactif: ${input.olfactiveProfile}` : null,
          input.botanicalSources ? `Sources botaniques: ${input.botanicalSources}` : null,
        ].filter(Boolean).join("\n");

        const systemPrompt = `Tu es un expert en chimie des parfums et en olfaction. Tu dois analyser une molécule aromatique et suggérer sa classification.

Classes chimiques disponibles:
- terpene: Terpènes généraux (hydrocarbures dérivés de l'isoprène)
- monoterpene: Monoterpènes (C10, ex: limonène, pinène)
- sesquiterpene: Sesquiterpènes (C15, ex: caryophyllène)
- diterpene: Diterpènes (C20)
- aldehyde: Aldéhydes (groupe -CHO, ex: citral, vanilline)
- ketone: Cétones (groupe C=O, ex: carvone, ionone)
- alcohol: Alcools (groupe -OH, ex: linalol, géraniol)
- ester: Esters (groupe -COO-, ex: acétate de linalyle)
- ether: Éthers (groupe C-O-C, ex: anéthol)
- phenol: Phénols (groupe -OH sur cycle aromatique, ex: eugénol)
- lactone: Lactones (esters cycliques, ex: coumarine)
- coumarin: Coumarines spécifiquement
- musk: Muscs (macrocycliques ou nitromuscs)
- nitrile: Nitriles (groupe -CN)
- sulfur_compound: Composés soufrés (thiols, sulfures)
- heterocyclic: Hétérocycliques (cycles avec N, O, S)
- aromatic: Composés aromatiques généraux
- aliphatic: Composés aliphatiques
- other: Autre classe

Familles olfactives disponibles:
- floral: Notes florales (rose, jasmin, muguet)
- boise: Notes boisées (cèdre, santal, vétiver)
- agrume: Notes agrumes/hespéridées (citron, orange, bergamote)
- epice: Notes épicées (cannelle, clou de girofle, poivre)
- herbace: Notes herbacées (lavande, romarin, thym)
- balsamique: Notes balsamiques (benjoin, tolu, vanille)
- musque: Notes musquées
- animal: Notes animales (ambre gris, castoreum)
- vert: Notes vertes (feuille, gazon, galbanum)
- fruite: Notes fruitées (pomme, pêche, baies)
- marin: Notes marines/ozôniques
- terreux: Notes terreuses (mousse, terre, champignon)
- fume: Notes fumées/cuirées
- gourmand: Notes gourmandes (caramel, chocolat, café)
- aromatique: Notes aromatiques (herbes de Provence)
- autre: Autre famille

Réponds UNIQUEMENT avec un objet JSON valide, sans texte supplémentaire.`;

        const userPrompt = `Analyse cette molécule et suggère sa classification:

${moleculeContext}

Réponds avec un JSON contenant:
- chemicalClass: la classe chimique la plus appropriée (une seule valeur parmi la liste)
- chemicalClassConfidence: niveau de confiance (0-100)
- chemicalClassReasoning: explication courte de ton choix
- olfactiveFamily: la famille olfactive principale (une seule valeur parmi la liste)
- olfactiveFamilyConfidence: niveau de confiance (0-100)
- olfactiveFamilyReasoning: explication courte de ton choix
- suggestedOlfactiveProfile: description olfactive suggérée si non fournie
- additionalNotes: notes supplémentaires utiles pour le chercheur`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "molecule_classification",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    chemicalClass: {
                      type: "string",
                      enum: ["terpene", "sesquiterpene", "diterpene", "monoterpene", "aldehyde", "ketone", "alcohol", "ester", "ether", "phenol", "lactone", "coumarin", "musk", "nitrile", "sulfur_compound", "heterocyclic", "aromatic", "aliphatic", "other"],
                      description: "Classe chimique principale de la molécule"
                    },
                    chemicalClassConfidence: {
                      type: "number",
                      description: "Niveau de confiance pour la classe chimique (0-100)"
                    },
                    chemicalClassReasoning: {
                      type: "string",
                      description: "Explication du choix de classe chimique"
                    },
                    olfactiveFamily: {
                      type: "string",
                      enum: ["floral", "boise", "agrume", "epice", "herbace", "balsamique", "musque", "animal", "vert", "fruite", "marin", "terreux", "fume", "gourmand", "aromatique", "autre"],
                      description: "Famille olfactive principale"
                    },
                    olfactiveFamilyConfidence: {
                      type: "number",
                      description: "Niveau de confiance pour la famille olfactive (0-100)"
                    },
                    olfactiveFamilyReasoning: {
                      type: "string",
                      description: "Explication du choix de famille olfactive"
                    },
                    suggestedOlfactiveProfile: {
                      type: "string",
                      description: "Description olfactive suggérée"
                    },
                    additionalNotes: {
                      type: "string",
                      description: "Notes supplémentaires pour le chercheur"
                    }
                  },
                  required: ["chemicalClass", "chemicalClassConfidence", "chemicalClassReasoning", "olfactiveFamily", "olfactiveFamilyConfidence", "olfactiveFamilyReasoning", "suggestedOlfactiveProfile", "additionalNotes"],
                  additionalProperties: false
                }
              }
            }
          });

          const content = response.choices[0]?.message?.content;
          if (typeof content === "string") {
            const parsed = JSON.parse(content);
            return {
              success: true,
              classification: parsed,
              inputData: input,
            };
          }
          throw new Error("Réponse IA invalide");
        } catch (error: unknown) {
          console.error("Erreur classification IA:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue",
            inputData: input,
          };
        }
      }),

    // Classifier plusieurs molécules en batch
    classifyMoleculesBatch: protectedProcedure
      .input(z.array(z.object({
        id: z.number(),
        name: z.string(),
        iupacName: z.string().optional(),
        casNumber: z.string().optional(),
        chemicalFormula: z.string().optional(),
        olfactiveProfile: z.string().optional(),
        botanicalSources: z.string().optional(),
      })))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("../_core/llm");
        const results: Array<{
          id: number;
          name: string;
          success: boolean;
          classification?: Record<string,unknown>;
          error?: string;
        }> = [];

        // Traiter par lots de 5 pour éviter les timeouts
        for (let i = 0; i < input.length; i += 5) {
          const batch = input.slice(i, i + 5);
          
          const batchPromises = batch.map(async (molecule) => {
            const moleculeContext = [
              `Nom: ${molecule.name}`,
              molecule.iupacName ? `Nom IUPAC: ${molecule.iupacName}` : null,
              molecule.casNumber ? `Numéro CAS: ${molecule.casNumber}` : null,
              molecule.chemicalFormula ? `Formule chimique: ${molecule.chemicalFormula}` : null,
              molecule.olfactiveProfile ? `Profil olfactif: ${molecule.olfactiveProfile}` : null,
              molecule.botanicalSources ? `Sources botaniques: ${molecule.botanicalSources}` : null,
            ].filter(Boolean).join("\n");

            try {
              const response = await invokeLLM({
                messages: [
                  { role: "system", content: `Tu es un expert en chimie des parfums. Analyse cette molécule et suggère sa classification chimique et olfactive. Réponds UNIQUEMENT en JSON valide.` },
                  { role: "user", content: `Molécule:\n${moleculeContext}\n\nRéponds avec: chemicalClass (terpene|sesquiterpene|diterpene|monoterpene|aldehyde|ketone|alcohol|ester|ether|phenol|lactone|coumarin|musk|nitrile|sulfur_compound|heterocyclic|aromatic|aliphatic|other), olfactiveFamily (floral|boise|agrume|epice|herbace|balsamique|musque|animal|vert|fruite|marin|terreux|fume|gourmand|aromatique|autre), confidence (0-100), reasoning.` },
                ],
                response_format: {
                  type: "json_schema",
                  json_schema: {
                    name: "batch_classification",
                    strict: true,
                    schema: {
                      type: "object",
                      properties: {
                        chemicalClass: { type: "string" },
                        olfactiveFamily: { type: "string" },
                        confidence: { type: "number" },
                        reasoning: { type: "string" }
                      },
                      required: ["chemicalClass", "olfactiveFamily", "confidence", "reasoning"],
                      additionalProperties: false
                    }
                  }
                }
              });

              const content = response.choices[0]?.message?.content;
              if (typeof content === "string") {
                return {
                  id: molecule.id,
                  name: molecule.name,
                  success: true,
                  classification: JSON.parse(content),
                };
              }
              throw new Error("Réponse invalide");
            } catch (error: unknown) {
              return {
                id: molecule.id,
                name: molecule.name,
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
              };
            }
          });

          const batchResults = await Promise.all(batchPromises);
          results.push(...batchResults);
        }

        return {
          total: input.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          results,
        };
      }),

    // Suggérer un profil olfactif basé sur le nom et la structure
    suggestOlfactiveProfile: adminProcedure
      .input(z.object({
        name: z.string(),
        chemicalClass: z.string().optional(),
        chemicalFormula: z.string().optional(),
        botanicalSources: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("../_core/llm");

        const context = [
          `Nom: ${input.name}`,
          input.chemicalClass ? `Classe chimique: ${input.chemicalClass}` : null,
          input.chemicalFormula ? `Formule: ${input.chemicalFormula}` : null,
          input.botanicalSources ? `Sources: ${input.botanicalSources}` : null,
        ].filter(Boolean).join("\n");

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: "Tu es un parfumeur expert. Décris le profil olfactif de cette molécule de manière précise et poétique, en utilisant le vocabulaire professionnel de la parfumerie. Limite ta réponse à 2-3 phrases." },
              { role: "user", content: `Décris le profil olfactif de cette molécule:\n${context}` },
            ],
          });

          const content = response.choices[0]?.message?.content;
          return {
            success: true,
            profile: typeof content === "string" ? content : "",
          };
        } catch (error: unknown) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue",
          };
        }
      }),

    // ============================================================================
    // CLASSIFICATION EN MASSE AVEC DONNÉES DES PLANTES SOURCES
    // ============================================================================

    /**
     * Récupère les molécules sans classe chimique avec leurs plantes sources
     * pour enrichir le contexte de classification IA
     */
    getUnclassifiedMoleculesWithPlants: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(500).default(100),
        offset: z.number().min(0).default(0),
      }))
      .query(async ({ input }) => {
        // Récupérer les molécules sans classe chimique
        const { molecules: unclassifiedMolecules, total } = await db.getOrphanMoleculesList('no_chemical_class', input.limit, input.offset);
        
        // Pour chaque molécule, récupérer les plantes sources liées
        const moleculesWithPlants = await Promise.all(
          unclassifiedMolecules.map(async (molecule) => {
            const plantLinks = await db.getPlantsByMolecule(molecule.id);
            const plantSources = plantLinks.map((link) => ({
              id: link.plant.id,
              name: link.plant.name,
              latinName: link.plant.latinName,
              family: link.plant.family,
              category: link.plant.category,
              percentageTypical: link.percentageTypical,
              role: link.role,
              isSignature: link.isSignature,
            }));
            
            return {
              ...molecule,
              plantSources,
              plantSourcesCount: plantSources.length,
              botanicalContext: plantSources.length > 0 
                ? `Présent dans: ${plantSources.map(p => `${p.name} (${p.latinName || 'N/A'}, famille ${p.family || 'inconnue'}${p.percentageTypical ? `, ${p.percentageTypical}%` : ''})`).join('; ')}`
                : null,
            };
          })
        );

        return {
          molecules: moleculesWithPlants,
          total,
          limit: input.limit,
          offset: input.offset,
        };
      }),

    /**
     * Classification en masse améliorée avec contexte botanique enrichi
     * Utilise les données des plantes sources pour améliorer la précision
     */
    classifyMoleculesBatchEnhanced: protectedProcedure
      .input(z.object({
        moleculeIds: z.array(z.number()).min(1).max(50),
        autoApply: z.boolean().default(false), // Si true, applique automatiquement les classifications
        confidenceThreshold: z.number().min(0).max(100).default(70), // Seuil de confiance pour auto-apply
      }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("../_core/llm");
        
        const results: Array<{
          id: number;
          name: string;
          success: boolean;
          classification?: {
            chemicalClass: string;
            chemicalClassConfidence: number;
            chemicalClassReasoning: string;
            olfactiveFamily: string;
            olfactiveFamilyConfidence: number;
            olfactiveFamilyReasoning: string;
            suggestedOlfactiveProfile?: string;
            botanicalContextUsed: boolean;
          };
          applied?: boolean;
          error?: string;
        }> = [];

        // Récupérer toutes les molécules avec leurs plantes sources
        const moleculesData = await Promise.all(
          input.moleculeIds.map(async (id) => {
            const molecule = await db.getMoleculeById(id);
            if (!molecule) return null;
            
            const plantLinks = await db.getPlantsByMolecule(id);
            return {
              molecule,
              plantSources: plantLinks.map((link) => ({
                name: link.plant.name,
                latinName: link.plant.latinName,
                family: link.plant.family,
                category: link.plant.category,
                percentageTypical: link.percentageTypical,
                role: link.role,
                isSignature: link.isSignature,
              })),
            };
          })
        );

        // Filtrer les molécules valides
        const validMolecules = moleculesData.filter((m): m is NonNullable<typeof m> => m !== null);

        // Traiter par lots de 5 pour éviter les timeouts
        for (let i = 0; i < validMolecules.length; i += 5) {
          const batch = validMolecules.slice(i, i + 5);
          
          const batchPromises = batch.map(async ({ molecule, plantSources }) => {
            // Construire le contexte enrichi avec les données botaniques
            const botanicalContext = plantSources.length > 0
              ? `\n\nSOURCES BOTANIQUES (${plantSources.length} plante(s)):\n` + 
                plantSources.map((p, idx) => 
                  `${idx + 1}. ${p.name} (${p.latinName || 'N/A'})\n` +
                  `   - Famille botanique: ${p.family || 'inconnue'}\n` +
                  `   - Catégorie: ${p.category || 'non spécifiée'}\n` +
                  `   - Concentration typique: ${p.percentageTypical || 'non spécifiée'}%\n` +
                  `   - Rôle: ${p.role || 'non spécifié'}\n` +
                  `   - Molécule signature: ${p.isSignature ? 'Oui' : 'Non'}`
                ).join('\n')
              : '';

            const moleculeContext = [
              `NOM: ${molecule.name}`,
              molecule.iupacName ? `NOM IUPAC: ${molecule.iupacName}` : null,
              molecule.casNumber ? `NUMÉRO CAS: ${molecule.casNumber}` : null,
              molecule.chemicalFormula ? `FORMULE CHIMIQUE: ${molecule.chemicalFormula}` : null,
              molecule.olfactiveProfile ? `PROFIL OLFACTIF EXISTANT: ${molecule.olfactiveProfile}` : null,
              molecule.family ? `FAMILLE OLFACTIVE EXISTANTE: ${molecule.family}` : null,
              botanicalContext,
            ].filter(Boolean).join("\n");

            const systemPrompt = `Tu es un expert en chimie des parfums et en phytochimie. Tu dois analyser une molécule aromatique et déterminer sa classification chimique et olfactive.

IMPORTANT: Utilise les informations sur les SOURCES BOTANIQUES pour affiner ta classification. Les familles botaniques donnent des indices précieux sur la classe chimique probable:
- Lamiaceae (menthe, lavande, thym): souvent monoterpènes, alcools terpéniques
- Rutaceae (agrumes): monoterpènes, aldéhydes, coumarines
- Asteraceae (camomille, armoise): sesquiterpènes, lactones
- Lauraceae (cannelle, laurier): aldéhydes aromatiques, phénols
- Myrtaceae (eucalyptus, girofle): oxydes terpéniques, phénols
- Zingiberaceae (gingembre, curcuma): sesquiterpènes, cétones
- Apiaceae (anis, fenouil): phénylpropanoïdes, éthers
- Pinaceae (pin, sapin): monoterpènes, résines
- Cannabaceae (cannabis, houblon): sesquiterpènes, monoterpènes
- Burseraceae (encens, myrrhe): diterpènes, sesquiterpènes

Classes chimiques disponibles:
- terpene, monoterpene, sesquiterpene, diterpene
- aldehyde, ketone, alcohol, ester, ether
- phenol, lactone, coumarin
- musk, nitrile, sulfur_compound
- heterocyclic, aromatic, aliphatic, other

Familles olfactives disponibles:
- floral, boise, agrume, epice, herbace, balsamique
- musque, animal, vert, fruite, marin, terreux
- fume, gourmand, aromatique, autre`;

            const userPrompt = `Analyse cette molécule et fournis sa classification:\n\n${moleculeContext}\n\nRéponds en JSON avec:
- chemicalClass: la classe chimique principale
- chemicalClassConfidence: niveau de confiance (0-100)
- chemicalClassReasoning: explication du choix (mentionner les indices botaniques utilisés)
- olfactiveFamily: la famille olfactive principale
- olfactiveFamilyConfidence: niveau de confiance (0-100)
- olfactiveFamilyReasoning: explication du choix
- suggestedOlfactiveProfile: description olfactive suggérée (2-3 phrases)`;

            try {
              const response = await invokeLLM({
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: userPrompt },
                ],
                response_format: {
                  type: "json_schema",
                  json_schema: {
                    name: "enhanced_classification",
                    strict: true,
                    schema: {
                      type: "object",
                      properties: {
                        chemicalClass: { 
                          type: "string",
                          enum: ["terpene", "sesquiterpene", "diterpene", "monoterpene", "aldehyde", "ketone", "alcohol", "ester", "ether", "phenol", "lactone", "coumarin", "musk", "nitrile", "sulfur_compound", "heterocyclic", "aromatic", "aliphatic", "other"]
                        },
                        chemicalClassConfidence: { type: "number" },
                        chemicalClassReasoning: { type: "string" },
                        olfactiveFamily: { 
                          type: "string",
                          enum: ["floral", "boise", "agrume", "epice", "herbace", "balsamique", "musque", "animal", "vert", "fruite", "marin", "terreux", "fume", "gourmand", "aromatique", "autre"]
                        },
                        olfactiveFamilyConfidence: { type: "number" },
                        olfactiveFamilyReasoning: { type: "string" },
                        suggestedOlfactiveProfile: { type: "string" }
                      },
                      required: ["chemicalClass", "chemicalClassConfidence", "chemicalClassReasoning", "olfactiveFamily", "olfactiveFamilyConfidence", "olfactiveFamilyReasoning", "suggestedOlfactiveProfile"],
                      additionalProperties: false
                    }
                  }
                }
              });

              const content = response.choices[0]?.message?.content;
              if (typeof content === "string") {
                const classification = JSON.parse(content);
                
                // Auto-apply si demandé et confiance suffisante
                let applied = false;
                if (input.autoApply && 
                    classification.chemicalClassConfidence >= input.confidenceThreshold) {
                  await db.batchClassifyMolecules([{
                    moleculeId: molecule.id,
                    chemicalClass: classification.chemicalClass,
                    family: classification.olfactiveFamily,
                    olfactiveProfile: classification.suggestedOlfactiveProfile || undefined,
                  }]);
                  applied = true;
                }

                return {
                  id: molecule.id,
                  name: molecule.name,
                  success: true,
                  classification: {
                    ...classification,
                    botanicalContextUsed: plantSources.length > 0,
                  },
                  applied,
                };
              }
              throw new Error("Réponse invalide");
            } catch (error: unknown) {
              return {
                id: molecule.id,
                name: molecule.name,
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
              };
            }
          });

          const batchResults = await Promise.all(batchPromises);
          results.push(...batchResults);
        }

        const successful = results.filter(r => r.success);
        const applied = results.filter(r => r.applied);

        return {
          total: input.moleculeIds.length,
          processed: validMolecules.length,
          successful: successful.length,
          failed: results.filter(r => !r.success).length,
          applied: applied.length,
          results,
          summary: {
            withBotanicalContext: results.filter(r => r.classification?.botanicalContextUsed).length,
            highConfidence: successful.filter(r => r.classification && r.classification.chemicalClassConfidence >= 80).length,
            mediumConfidence: successful.filter(r => r.classification && r.classification.chemicalClassConfidence >= 50 && r.classification.chemicalClassConfidence < 80).length,
            lowConfidence: successful.filter(r => r.classification && r.classification.chemicalClassConfidence < 50).length,
          },
        };
      }),

    /**
     * Classification automatique de toutes les molécules sans classe chimique
     * Traite par lots avec progression
     */
    classifyAllUnclassified: protectedProcedure
      .input(z.object({
        batchSize: z.number().min(5).max(50).default(20),
        autoApply: z.boolean().default(false),
        confidenceThreshold: z.number().min(0).max(100).default(75),
        maxMolecules: z.number().min(1).max(500).default(100),
      }))
      .mutation(async ({ input, ctx }) => {
        const { invokeLLM } = await import("../_core/llm");
        
        // Récupérer toutes les molécules sans classe chimique
        const { molecules: unclassifiedMolecules, total } = await db.getOrphanMoleculesList(
          'no_chemical_class', 
          input.maxMolecules, 
          0
        );

        if (unclassifiedMolecules.length === 0) {
          return {
            success: true,
            message: "Aucune molécule à classifier",
            total: 0,
            processed: 0,
            successful: 0,
            failed: 0,
            applied: 0,
            results: [],
          };
        }

        const allResults: Array<{
          id: number;
          name: string;
          success: boolean;
          classification?: Record<string,unknown>;
          applied?: boolean;
          error?: string;
        }> = [];

        // Traiter par lots
        for (let offset = 0; offset < unclassifiedMolecules.length; offset += input.batchSize) {
          const batch = unclassifiedMolecules.slice(offset, offset + input.batchSize);
          
          // Récupérer les plantes sources pour chaque molécule du lot
          const batchWithPlants = await Promise.all(
            batch.map(async (molecule) => {
              const plantLinks = await db.getPlantsByMolecule(molecule.id);
              return {
                molecule,
                plantSources: plantLinks.map((link) => ({
                  name: link.plant.name,
                  latinName: link.plant.latinName,
                  family: link.plant.family,
                  category: link.plant.category,
                  percentageTypical: link.percentageTypical,
                  role: link.role,
                })),
              };
            })
          );

          // Classifier chaque molécule du lot
          const batchPromises = batchWithPlants.map(async (item) => {
            const { molecule, plantSources } = item;
            const botanicalContext = plantSources.length > 0
              ? `\nSources botaniques: ${plantSources.map((p) => `${p.name} (${p.family || 'famille inconnue'})`).join(', ')}`
              : '';

            const context = [
              `Nom: ${molecule.name}`,
              molecule.iupacName ? `IUPAC: ${molecule.iupacName}` : null,
              molecule.casNumber ? `CAS: ${molecule.casNumber}` : null,
              molecule.chemicalFormula ? `Formule: ${molecule.chemicalFormula}` : null,
              molecule.olfactiveProfile ? `Profil: ${molecule.olfactiveProfile}` : null,
              botanicalContext,
            ].filter(Boolean).join("\n");

            try {
              const response = await invokeLLM({
                messages: [
                  { 
                    role: "system", 
                    content: `Tu es un expert en chimie des parfums. Analyse cette molécule et suggère sa classe chimique. Utilise les sources botaniques comme indices (ex: Lamiaceae → monoterpènes, Rutaceae → aldéhydes/coumarines, etc.).` 
                  },
                  { 
                    role: "user", 
                    content: `Molécule:\n${context}\n\nClasse chimique parmi: terpene, monoterpene, sesquiterpene, diterpene, aldehyde, ketone, alcohol, ester, ether, phenol, lactone, coumarin, musk, nitrile, sulfur_compound, heterocyclic, aromatic, aliphatic, other` 
                  },
                ],
                response_format: {
                  type: "json_schema",
                  json_schema: {
                    name: "quick_classification",
                    strict: true,
                    schema: {
                      type: "object",
                      properties: {
                        chemicalClass: { type: "string" },
                        confidence: { type: "number" },
                        reasoning: { type: "string" }
                      },
                      required: ["chemicalClass", "confidence", "reasoning"],
                      additionalProperties: false
                    }
                  }
                }
              });

              const content = response.choices[0]?.message?.content;
              if (typeof content === "string") {
                const classification = JSON.parse(content);
                
                let applied = false;
                if (input.autoApply && classification.confidence >= input.confidenceThreshold) {
                  await db.batchClassifyMolecules([{
                    moleculeId: molecule.id,
                    chemicalClass: classification.chemicalClass,
                  }]);
                  applied = true;
                }

                return {
                  id: molecule.id,
                  name: molecule.name,
                  success: true,
                  classification,
                  applied,
                };
              }
              throw new Error("Réponse invalide");
            } catch (error: unknown) {
              return {
                id: molecule.id,
                name: molecule.name,
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
              };
            }
          });

          const batchResults = await Promise.all(batchPromises);
          allResults.push(...batchResults);
        }

        const successful = allResults.filter(r => r.success);
        const applied = allResults.filter(r => r.applied);

        // Créer une notification si des molécules ont été classifiées
        if (applied.length > 0) {
          await db.createNotification({
            type: 'classification_milestone',
            title: 'Classification IA terminée',
            message: `${applied.length} molécules ont été classifiées automatiquement sur ${allResults.length} traitées.`,
            severity: 'success',
            metadata: {
              count: applied.length,
              moleculeIds: applied.map(r => r.id),
            },
          });
        }

        return {
          success: true,
          message: `Classification terminée: ${successful.length}/${allResults.length} réussies, ${applied.length} appliquées`,
          total: unclassifiedMolecules.length,
          totalInDatabase: total,
          processed: allResults.length,
          successful: successful.length,
          failed: allResults.filter(r => !r.success).length,
          applied: applied.length,
          results: allResults,
        };
      }),

    /**
     * Statistiques sur les molécules non classifiées
     */
    getUnclassifiedStats: publicProcedure.query(async () => {
      const { total: noChemicalClass } = await db.getOrphanMoleculesList('no_chemical_class', 1, 0);
      const { total: noFamily } = await db.getOrphanMoleculesList('no_family', 1, 0);
      const { total: noOlfactiveProfile } = await db.getOrphanMoleculesList('no_olfactive_profile', 1, 0);
      const { total: noCas } = await db.getOrphanMoleculesList('no_cas', 1, 0);
      const { total: noIupac } = await db.getOrphanMoleculesList('no_iupac', 1, 0);
      const { total: noFormula } = await db.getOrphanMoleculesList('no_formula', 1, 0);
      
      const allMolecules = await db.getAllMolecules();
      const totalMolecules = allMolecules.length;

      // Compter les molécules avec plantes sources
      const moleculesWithPlants = new Set<number>();
      for (const mol of allMolecules) {
        const plants = await db.getPlantsByMolecule(mol.id);
        if (plants.length > 0) {
          moleculesWithPlants.add(mol.id);
        }
      }

      return {
        totalMolecules,
        noChemicalClass,
        noFamily,
        noOlfactiveProfile,
        noCas,
        noIupac,
        noFormula,
        withPlantSources: moleculesWithPlants.size,
        classificationRate: Math.round(((totalMolecules - noChemicalClass) / totalMolecules) * 100),
        familyRate: Math.round(((totalMolecules - noFamily) / totalMolecules) * 100),
        plantLinkageRate: Math.round((moleculesWithPlants.size / totalMolecules) * 100),
      };
    }),
});
