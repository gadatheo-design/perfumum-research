/**
 * Routeur tRPC pour l'import/export bidirectionnel avec modèles de fichiers
 */

import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { importMolecules, importRecettes, importAccords, importFamilles, importPlantes, importTerroirs, type ImportResult } from "../import-utils";

// ─── MODÈLES DE FICHIERS ───────────────────────────────────────────────────

const TEMPLATES = [
  {
    entity: "molecules",
    label: "Molécules",
    csvHeaders: [
      "id",
      "name",
      "iupac_name",
      "cas_number",
      "molecular_formula",
      "molecular_weight",
      "smiles",
      "inchi",
      "odor_description",
      "olfactive_family",
      "odor_strength",
      "flavornet_percepts",
      "flavornet_kovats_ri",
      "therapeutic_properties",
      "notes",
    ],
    exampleData: [
      {
        id: 1,
        name: "Limonène",
        iupac_name: "1-methyl-4-prop-1-en-2-ylcyclohexene",
        cas_number: "138-86-3",
        molecular_formula: "C10H16",
        molecular_weight: 136.23,
        smiles: "CC1=CCC(CC1)C(=C)C",
        inchi: "InChI=1S/C10H16/c1-7(2)10-5-3-9(4-6-10)8(1)2/h3,5H,2,4,6H2,1,8H3",
        odor_description: "Agrume frais, citronné, sucré",
        olfactive_family: "Terpène",
        odor_strength: 8,
        flavornet_percepts: '["citrus", "fresh", "sweet"]',
        flavornet_kovats_ri: 1029,
        therapeutic_properties: '["antiseptique", "antioxydant"]',
        notes: "Composé principal des agrumes",
      },
    ],
  },
  {
    entity: "recettes",
    label: "Recettes",
    csvHeaders: [
      "id",
      "name",
      "description",
      "category",
      "base_notes",
      "heart_notes",
      "top_notes",
      "total_volume",
      "concentration",
      "creation_date",
      "notes",
    ],
    exampleData: [
      {
        id: 1,
        name: "Accord Floral Classique",
        description: "Un accord floral traditionnel",
        category: "Eau de Parfum",
        base_notes: "[101, 102, 103]",
        heart_notes: "[201, 202]",
        top_notes: "[301, 302]",
        total_volume: 100,
        concentration: 20,
        creation_date: "2024-01-15",
        notes: "Formulation classique",
      },
    ],
  },
  {
    entity: "accords",
    label: "Accords",
    csvHeaders: ["id", "name", "description", "molecules", "olfactive_profile", "harmony_score", "stability", "notes"],
    exampleData: [
      {
        id: 1,
        name: "Accord Rose-Géranium",
        description: "Accord floral classique",
        molecules: "[2, 5, 8]",
        olfactive_profile: "Floral, sucré",
        harmony_score: 9,
        stability: "stable",
        notes: "Accord très harmonieux",
      },
    ],
  },
  {
    entity: "familles",
    label: "Familles Olfactives",
    csvHeaders: ["id", "name", "name_fr", "description", "characteristics", "typical_molecules", "color_code"],
    exampleData: [
      {
        id: "terpenes",
        name: "Terpenes",
        name_fr: "Terpènes",
        description: "Composés volatils naturels",
        characteristics: '["frais", "naturel", "volatil"]',
        typical_molecules: "[1, 3, 4]",
        color_code: "#10B981",
      },
    ],
  },
  {
    entity: "matieres",
    label: "Matières Premières",
    csvHeaders: [
      "id",
      "name",
      "molecule_id",
      "quantity",
      "unit",
      "supplier",
      "purchase_date",
      "expiry_date",
      "cost",
      "storage_location",
      "notes",
    ],
    exampleData: [
      {
        id: 1,
        name: "Limonène - Flacon 100ml",
        molecule_id: 1,
        quantity: 100,
        unit: "ml",
        supplier: "Supplier A",
        purchase_date: "2024-01-10",
        expiry_date: "2026-01-10",
        cost: 45.5,
        storage_location: "Armoire A - Étagère 2",
        notes: "Stockage à température ambiante",
      },
    ],
  },
  {
    entity: "plants",
    label: "Plantes",
    csvHeaders: ["id", "name", "latin_name", "family", "origin", "description", "uses", "molecules", "terroirs"],
    exampleData: [
      {
        id: 1,
        name: "Rose de Damas",
        latin_name: "Rosa damascena",
        family: "Rosaceae",
        origin: "Moyen-Orient",
        description: "Rose très aromatique",
        uses: '["Parfumerie", "Cosmétique"]',
        molecules: "[2, 5, 8, 12]",
        terroirs: "[1, 2]",
      },
    ],
  },
  {
    entity: "terroirs",
    label: "Terroirs",
    csvHeaders: ["id", "name", "country", "region", "climate", "altitude", "soil_type", "description", "plants"],
    exampleData: [
      {
        id: 1,
        name: "Vallée de Damask",
        country: "Syrie",
        region: "Damas",
        climate: "Méditerranéen",
        altitude: "700-800m",
        soil_type: "Calcaire",
        description: "Région historique de production",
        plants: "[1, 3, 5]",
      },
    ],
  },
  {
    entity: "regions",
    label: "Régions Géographiques",
    csvHeaders: ["id", "name", "country", "continent", "latitude", "longitude", "climate_zone", "biodiversity_index", "description"],
    exampleData: [
      {
        id: 1,
        name: "Amazonie",
        country: "Brésil",
        continent: "Amérique du Sud",
        latitude: -3.5,
        longitude: -62.2,
        climate_zone: "Tropical",
        biodiversity_index: 10,
        description: "Forêt tropicale humide",
      },
    ],
  },
];

function generateCSVTemplate(template: (typeof TEMPLATES)[0]): string {
  const headers = template.csvHeaders.join(",");
  const rows = template.exampleData.map((row) =>
    template.csvHeaders
      .map((header) => {
        const value = (row as any)[header];
        if (value === null || value === undefined) return "";
        if (typeof value === "string" && (value.includes(",") || value.includes("\n"))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return String(value);
      })
      .join(",")
  );
  return [headers, ...rows].join("\n");
}

function generateJSONTemplate(template: (typeof TEMPLATES)[0]): string {
  return JSON.stringify(
    {
      entity: template.entity,
      headers: template.csvHeaders,
      examples: template.exampleData,
    },
    null,
    2
  );
}

// ─── PARSERS ──────────────────────────────────────────────────────────────────

function parseCSV(content: string): Record<string, any>[] {
  const lines = content.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const data: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, any> = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    data.push(row);
  }

  return data;
}

function parseJSON(content: string): Record<string, any>[] {
  const parsed = JSON.parse(content);
  return Array.isArray(parsed) ? parsed : parsed.data || [];
}

export const importExportRouter = router({
  // Lister tous les modèles
  listTemplates: publicProcedure.query(() => {
    return TEMPLATES.map((t) => ({
      entity: t.entity,
      label: t.label,
      csvHeaders: t.csvHeaders,
      exampleCount: t.exampleData.length,
    }));
  }),

  // Télécharger modèle CSV
  downloadTemplateCSV: publicProcedure
    .input(z.object({ entity: z.string() }))
    .query(({ input }) => {
      const template = TEMPLATES.find((t) => t.entity === input.entity);
      if (!template) {
        throw new Error(`Modèle non trouvé : ${input.entity}`);
      }

      const csv = generateCSVTemplate(template);
      return {
        filename: `template_${template.entity}.csv`,
        content: csv,
        mimeType: "text/csv;charset=utf-8;",
      };
    }),

  // Télécharger modèle JSON
  downloadTemplateJSON: publicProcedure
    .input(z.object({ entity: z.string() }))
    .query(({ input }) => {
      const template = TEMPLATES.find((t) => t.entity === input.entity);
      if (!template) {
        throw new Error(`Modèle non trouvé : ${input.entity}`);
      }

      const json = generateJSONTemplate(template);
      return {
        filename: `template_${template.entity}.json`,
        content: json,
        mimeType: "application/json",
      };
    }),

  // Valider fichier d'import
  validateImportFile: publicProcedure
    .input(
      z.object({
        entity: z.string(),
        content: z.string(),
        format: z.enum(["csv", "json"]).optional(),
      })
    )
    .query(({ input }) => {
      const template = TEMPLATES.find((t) => t.entity === input.entity);
      if (!template) {
        throw new Error(`Modèle non trouvé : ${input.entity}`);
      }

      try {
        let data: Record<string, any>[] = [];

        if (input.format === "json" || input.content.trim().startsWith("{")) {
          data = parseJSON(input.content);
        } else {
          data = parseCSV(input.content);
        }

        const errors: any[] = [];
        const warnings: any[] = [];

        // Valider les colonnes
        if (data.length > 0) {
          const firstRow = data[0];
          const missingHeaders = template.csvHeaders.filter((h) => !(h in firstRow));

          if (missingHeaders.length > 0) {
            warnings.push({
              message: `Colonnes manquantes : ${missingHeaders.join(", ")}`,
              severity: "warning",
            });
          }
        }

        return {
          isValid: errors.length === 0,
          errors,
          warnings,
          rowCount: data.length,
          preview: data.slice(0, 10),
        };
      } catch (error) {
        return {
          isValid: false,
          errors: [
            {
              message: `Erreur de parsing : ${error instanceof Error ? error.message : String(error)}`,
              severity: "error",
            },
          ],
          warnings: [],
          rowCount: 0,
          preview: [],
        };
      }
    }),

  // Aperçu données
  previewImportData: publicProcedure
    .input(
      z.object({
        entity: z.string(),
        content: z.string(),
        format: z.enum(["csv", "json"]).optional(),
      })
    )
    .query(({ input }) => {
      try {
        let data: Record<string, any>[] = [];

        if (input.format === "json" || input.content.trim().startsWith("{")) {
          data = parseJSON(input.content);
        } else {
          data = parseCSV(input.content);
        }

        return {
          isValid: true,
          rowCount: data.length,
          errors: [],
          warnings: [],
          preview: data.slice(0, 10),
          report: `Aperçu de ${Math.min(10, data.length)} lignes sur ${data.length}`,
        };
      } catch (error) {
        return {
          isValid: false,
          rowCount: 0,
          errors: [{ message: String(error), severity: "error" }],
          warnings: [],
          preview: [],
          report: "Erreur lors de la génération de l'aperçu",
        };
      }
    }),

  // Import réel (protégé)
  importData: protectedProcedure
    .input(
      z.object({
        entity: z.string(),
        content: z.string(),
        format: z.enum(["csv", "json"]).optional(),
        mode: z.enum(["create", "merge", "replace"]).default("create"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Vérifier que l'utilisateur est admin
      if (ctx.user?.role !== "admin") {
        throw new Error("Seuls les administrateurs peuvent importer des données");
      }

      try {
        let data: Record<string, any>[] = [];

        // Parser le fichier
        if (input.format === "json" || input.content.trim().startsWith("{")) {
          data = parseJSON(input.content);
        } else {
          data = parseCSV(input.content);
        }

        // Importer selon l'entité
        let result: ImportResult;

        switch (input.entity) {
          case "molecules":
            result = await importMolecules(data, input.mode);
            break;
          case "recettes":
            result = await importRecettes(data, input.mode);
            break;
          case "accords":
            result = await importAccords(data, input.mode);
            break;
          case "familles":
            result = await importFamilles(data, input.mode);
            break;
          case "plants":
            result = await importPlantes(data, input.mode);
            break;
          case "terroirs":
            result = await importTerroirs(data, input.mode);
            break;
          default:
            throw new Error(`Entité non supportée : ${input.entity}`);
        }

        return result;
      } catch (error) {
        throw new Error(`Erreur lors de l'import : ${error instanceof Error ? error.message : String(error)}`);
      }
    }),

  // Statistiques
  getStats: publicProcedure.query(() => {
    return {
      totalTemplates: TEMPLATES.length,
      templates: TEMPLATES.map((t) => ({
        entity: t.entity,
        label: t.label,
        exampleCount: t.exampleData.length,
      })),
      supportedFormats: ["csv", "json"],
      importModes: ["create", "merge", "replace"],
    };
  }),
});
