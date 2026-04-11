/**
 * variety-genealogy-import.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * tRPC router for importing plant variety genealogies from CSV
 * Supports dry-run preview mode and batch import with validation
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────

const CSVRowSchema = z.object({
  name: z.string().min(1),
  species: z.string().min(1),
  genus: z.string().min(1),
  parentName: z.string().optional(),
  relationType: z.enum(["parent", "sibling", "hybrid", "cross", "mutation"]).optional(),
  year: z.number().optional(),
  origin: z.string().optional(),
  description: z.string().optional(),
  conservationStatus: z.enum(["LC", "NT", "VU", "EN", "CR", "EW", "EX"]).optional(),
  notes: z.string().optional(),
});

const PreviewRowSchema = CSVRowSchema.extend({
  rowNumber: z.number(),
  status: z.enum(["valid", "warning", "error"]),
  message: z.string().optional(),
});

const ImportRequestSchema = z.object({
  csvData: z.string(), // CSV content as string
  dryRun: z.boolean().default(true),
  overwriteExisting: z.boolean().default(false),
});

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse CSV string into rows
 */
function parseCSV(csvData: string): string[][] {
  const lines = csvData.trim().split('\n');
  const rows: string[][] = [];

  for (const line of lines) {
    // Simple CSV parsing (handles quoted fields)
    const row: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    if (current || row.length > 0) {
      row.push(current.trim());
    }

    if (row.length > 0 && row.some((cell) => cell.length > 0)) {
      rows.push(row);
    }
  }

  return rows;
}

/**
 * Convert CSV rows to objects with validation
 */
function convertRowsToObjects(
  rows: string[][],
  headers: string[]
): Array<{ data: any; rowNumber: number; errors: string[] }> {
  const results: Array<{ data: any; rowNumber: number; errors: string[] }> = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const errors: string[] = [];
    const data: any = {};

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j].toLowerCase().trim();
      const value = row[j]?.trim() || '';

      if (header === 'name') {
        data.name = value;
        if (!value) errors.push('Name is required');
      } else if (header === 'species') {
        data.species = value;
        if (!value) errors.push('Species is required');
      } else if (header === 'genus') {
        data.genus = value;
        if (!value) errors.push('Genus is required');
      } else if (header === 'parentname') {
        data.parentName = value || undefined;
      } else if (header === 'relationtype') {
        if (value && !['parent', 'sibling', 'hybrid', 'cross', 'mutation'].includes(value)) {
          errors.push(`Invalid relation type: ${value}`);
        }
        data.relationType = value || undefined;
      } else if (header === 'year') {
        if (value) {
          const year = parseInt(value, 10);
          if (isNaN(year)) {
            errors.push(`Invalid year: ${value}`);
          } else {
            data.year = year;
          }
        }
      } else if (header === 'origin') {
        data.origin = value || undefined;
      } else if (header === 'description') {
        data.description = value || undefined;
      } else if (header === 'conservationstatus') {
        if (value && !['LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX'].includes(value)) {
          errors.push(`Invalid conservation status: ${value}`);
        }
        data.conservationStatus = value || undefined;
      } else if (header === 'notes') {
        data.notes = value || undefined;
      }
    }

    results.push({
      data,
      rowNumber: i + 1,
      errors,
    });
  }

  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────────────────────────────

export const varietyGenealogyImportRouter = router({
  /**
   * Preview CSV import (dry-run mode)
   * Returns validation results without modifying database
   */
  preview: protectedProcedure
    .input(ImportRequestSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check admin role
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can import genealogies",
          });
        }

        // Parse CSV
        const rows = parseCSV(input.csvData);

        if (rows.length < 2) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "CSV must contain at least header row and one data row",
          });
        }

        // Get headers
        const headers = rows[0].map((h) => h.toLowerCase().trim());

        // Validate required headers
        const requiredHeaders = ["name", "species", "genus"];
        const missingHeaders = requiredHeaders.filter(
          (h) => !headers.includes(h)
        );

        if (missingHeaders.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Missing required columns: ${missingHeaders.join(", ")}`,
          });
        }

        // Convert rows to objects
        const converted = convertRowsToObjects(rows, headers);

        // Validate each row
        const preview = converted.map((item) => {
          const status =
            item.errors.length > 0
              ? "error"
              : item.data.parentName && !item.data.relationType
                ? "warning"
                : "valid";

          const message =
            item.errors.length > 0
              ? item.errors.join("; ")
              : status === "warning"
                ? "Parent specified but no relation type"
                : undefined;

          return {
            rowNumber: item.rowNumber,
            name: item.data.name,
            species: item.data.species,
            genus: item.data.genus,
            parentName: item.data.parentName,
            relationType: item.data.relationType,
            status,
            message,
          };
        });

        // Calculate statistics
        const stats = {
          totalRows: preview.length,
          validRows: preview.filter((r) => r.status === "valid").length,
          warningRows: preview.filter((r) => r.status === "warning").length,
          errorRows: preview.filter((r) => r.status === "error").length,
        };

        return {
          success: true,
          stats,
          preview,
          headers,
        };
      } catch (error) {
        console.error("Error previewing CSV import:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to preview CSV",
        });
      }
    }),

  /**
   * Validate CSV format and content
   */
  validate: protectedProcedure
    .input(z.object({ csvData: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can validate imports",
          });
        }

        const rows = parseCSV(input.csvData);

        if (rows.length < 2) {
          return {
            valid: false,
            error: "CSV must contain at least header row and one data row",
            rowCount: rows.length,
          };
        }

        const headers = rows[0].map((h) => h.toLowerCase().trim());
        const requiredHeaders = ["name", "species", "genus"];
        const missingHeaders = requiredHeaders.filter(
          (h) => !headers.includes(h)
        );

        if (missingHeaders.length > 0) {
          return {
            valid: false,
            error: `Missing required columns: ${missingHeaders.join(", ")}`,
            rowCount: rows.length,
          };
        }

        return {
          valid: true,
          rowCount: rows.length,
          columnCount: headers.length,
          headers,
        };
      } catch (error) {
        console.error("Error validating CSV:", error);
        return {
          valid: false,
          error: "Failed to validate CSV",
        };
      }
    }),

  /**
   * Get CSV template with example data
   */
  getTemplate: protectedProcedure.query(() => {
    const template = `name,species,genus,parentName,relationType,year,origin,description,conservationStatus,notes
Basma,tabacum,Nicotiana,,,,Turkey,Traditional Turkish tobacco,VU,Aromatic variety
Samsun,tabacum,Nicotiana,Basma,hybrid,1950,Turkey,Hybrid of Basma and Oriental,LC,High nicotine content
Burley,tabacum,Nicotiana,,,,USA,Light air-cured tobacco,LC,Low sugar content
Kentucky,tabacum,Nicotiana,,,,USA,Dark fire-cured tobacco,LC,Rich flavor
Rustica,rustica,Nicotiana,,,,South America,Wild tobacco species,LC,High nicotine
Acuminata,acuminata,Nicotiana,,,,Australia,Australian native species,EN,Rare species`;

    return {
      template,
      format: "CSV",
      columns: [
        { name: "name", required: true, description: "Variety name" },
        { name: "species", required: true, description: "Species name (e.g., tabacum)" },
        { name: "genus", required: true, description: "Genus name (e.g., Nicotiana)" },
        { name: "parentName", required: false, description: "Parent variety name" },
        {
          name: "relationType",
          required: false,
          description: "Relation type: parent, sibling, hybrid, cross, mutation",
        },
        { name: "year", required: false, description: "Year of creation or discovery" },
        { name: "origin", required: false, description: "Geographic origin" },
        { name: "description", required: false, description: "Detailed description" },
        {
          name: "conservationStatus",
          required: false,
          description: "IUCN status: LC, NT, VU, EN, CR, EW, EX",
        },
        { name: "notes", required: false, description: "Additional notes" },
      ],
    };
  }),

  /**
   * Get import history (admin only)
   */
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can view import history",
        });
      }

      // TODO: Implement import history tracking in database
      // For now, return empty array
      return {
        imports: [],
        message: "Import history tracking coming soon",
      };
    } catch (error) {
      console.error("Error fetching import history:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch import history",
      });
    }
  }),
});
