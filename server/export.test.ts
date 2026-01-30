import { describe, it, expect } from "vitest";
import { objectsToCSV, csvToObjects, parseValue } from "./csv-utils";

describe("CSV Export/Import Utilities", () => {
  describe("objectsToCSV", () => {
    it("should convert an array of objects to CSV format", () => {
      const data = [
        { id: 1, name: "Limonène", formula: "C10H16" },
        { id: 2, name: "Linalol", formula: "C10H18O" },
      ];
      
      const csv = objectsToCSV(data);
      const lines = csv.split('\n');
      
      expect(lines[0]).toBe("id,name,formula");
      expect(lines[1]).toBe("1,Limonène,C10H16");
      expect(lines[2]).toBe("2,Linalol,C10H18O");
    });

    it("should handle empty arrays", () => {
      const data: any[] = [];
      const csv = objectsToCSV(data);
      expect(csv).toBe("");
    });

    it("should escape fields containing commas", () => {
      const data = [
        { id: 1, description: "Molécule fraîche, citronnée" },
      ];
      
      const csv = objectsToCSV(data);
      expect(csv).toContain('"Molécule fraîche, citronnée"');
    });

    it("should escape fields containing quotes", () => {
      const data = [
        { id: 1, note: 'Appelée "molécule miracle"' },
      ];
      
      const csv = objectsToCSV(data);
      expect(csv).toContain('""molécule miracle""');
    });

    it("should handle null and undefined values", () => {
      const data = [
        { id: 1, name: "Test", optional: null, missing: undefined },
      ];
      
      const csv = objectsToCSV(data);
      const lines = csv.split('\n');
      expect(lines[1]).toBe("1,Test,,");
    });

    it("should handle Date objects", () => {
      const date = new Date("2025-01-15T10:30:00Z");
      const data = [
        { id: 1, createdAt: date },
      ];
      
      const csv = objectsToCSV(data);
      expect(csv).toContain(date.toISOString());
    });
  });

  describe("csvToObjects", () => {
    it("should parse CSV string to array of objects", () => {
      const csv = `id,name,formula
1,Limonène,C10H16
2,Linalol,C10H18O`;
      
      const parseRow = (row: Record<string, string>) => ({
        id: parseInt(row.id),
        name: row.name,
        formula: row.formula,
      });
      
      const objects = csvToObjects(csv, parseRow);
      
      expect(objects).toHaveLength(2);
      expect(objects[0]).toEqual({ id: 1, name: "Limonène", formula: "C10H16" });
      expect(objects[1]).toEqual({ id: 2, name: "Linalol", formula: "C10H18O" });
    });

    it("should handle quoted fields with commas", () => {
      const csv = `id,description
1,"Molécule fraîche, citronnée"`;
      
      const parseRow = (row: Record<string, string>) => ({
        id: parseInt(row.id),
        description: row.description,
      });
      
      const objects = csvToObjects(csv, parseRow);
      
      expect(objects[0].description).toBe("Molécule fraîche, citronnée");
    });

    it("should handle escaped quotes", () => {
      const csv = `id,note
1,"Appelée ""molécule miracle"""`;
      
      const parseRow = (row: Record<string, string>) => ({
        id: parseInt(row.id),
        note: row.note,
      });
      
      const objects = csvToObjects(csv, parseRow);
      
      expect(objects[0].note).toBe('Appelée "molécule miracle"');
    });

    it("should skip malformed rows", () => {
      const csv = `id,name,formula
1,Limonène,C10H16
2,Linalol
3,Pinène,C10H16`;
      
      const parseRow = (row: Record<string, string>) => ({
        id: parseInt(row.id),
        name: row.name,
        formula: row.formula,
      });
      
      const objects = csvToObjects(csv, parseRow);
      
      // Should skip row 2 (missing formula column)
      expect(objects).toHaveLength(2);
      expect(objects[0].name).toBe("Limonène");
      expect(objects[1].name).toBe("Pinène");
    });

    it("should handle empty CSV", () => {
      const csv = "";
      
      const parseRow = (row: Record<string, string>) => row;
      const objects = csvToObjects(csv, parseRow);
      
      expect(objects).toHaveLength(0);
    });
  });

  describe("parseValue", () => {
    it("should parse string values", () => {
      expect(parseValue("test", "string")).toBe("test");
      expect(parseValue("", "string")).toBeNull();
    });

    it("should parse number values", () => {
      expect(parseValue("123", "number")).toBe(123);
      expect(parseValue("123.45", "number")).toBe(123.45);
      expect(parseValue("invalid", "number")).toBeNull();
      expect(parseValue("", "number")).toBeNull();
    });

    it("should parse boolean values", () => {
      expect(parseValue("true", "boolean")).toBe(true);
      expect(parseValue("false", "boolean")).toBe(false);
      expect(parseValue("1", "boolean")).toBe(true);
      expect(parseValue("0", "boolean")).toBe(false);
    });

    it("should parse date values", () => {
      const dateStr = "2025-01-15T10:30:00Z";
      const parsed = parseValue(dateStr, "date");
      expect(parsed).toBeInstanceOf(Date);
      expect((parsed as Date).toISOString()).toBe("2025-01-15T10:30:00.000Z");
      
      expect(parseValue("invalid", "date")).toBeNull();
      expect(parseValue("", "date")).toBeNull();
    });

    it("should parse JSON values", () => {
      const jsonStr = '{"key":"value"}';
      expect(parseValue(jsonStr, "json")).toEqual({ key: "value" });
      
      expect(parseValue("invalid json", "json")).toBeNull();
      expect(parseValue("", "json")).toBeNull();
    });
  });
});
