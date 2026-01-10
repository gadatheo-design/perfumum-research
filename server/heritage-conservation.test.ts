import { describe, it, expect, beforeAll, afterAll } from "vitest";
import mysql from "mysql2/promise";

describe("Heritage & Conservation (H2/H3)", () => {
  let conn: mysql.Connection;

  beforeAll(async () => {
    conn = await mysql.createConnection(process.env.DATABASE_URL!);
  });

  afterAll(async () => {
    await conn.end();
  });

  describe("Axes thématiques H2/H3", () => {
    it("devrait avoir l'axe H2 (Durabilité & Biodiversité)", async () => {
      const [rows] = await conn.execute(
        "SELECT * FROM thematic_axes WHERE axis_code = 'H2'"
      );
      expect((rows as any[]).length).toBe(1);
      expect((rows as any[])[0].name).toContain("Durabilité");
    });

    it("devrait avoir l'axe H3 (Reconstruction de Parfums Antiques)", async () => {
      const [rows] = await conn.execute(
        "SELECT * FROM thematic_axes WHERE axis_code = 'H3'"
      );
      expect((rows as any[]).length).toBe(1);
      expect((rows as any[])[0].name).toContain("Reconstruction");
    });
  });

  describe("Liaisons H2 (Durabilité)", () => {
    it("devrait avoir des références liées à H2", async () => {
      const [rows] = await conn.execute(`
        SELECT COUNT(*) as count 
        FROM bibliography_axis_links bal
        JOIN thematic_axes ta ON bal.axis_id = ta.id
        WHERE ta.axis_code = 'H2'
      `);
      expect((rows as any[])[0].count).toBeGreaterThan(0);
    });

    it("devrait inclure des références sur la conservation", async () => {
      const [rows] = await conn.execute(`
        SELECT be.title
        FROM bibliography_entries be
        JOIN bibliography_axis_links bal ON be.id = bal.bibliography_id
        JOIN thematic_axes ta ON bal.axis_id = ta.id
        WHERE ta.axis_code = 'H2'
        AND (be.title LIKE '%conserv%' OR be.title LIKE '%extinct%' OR be.title LIKE '%biodiv%')
        LIMIT 5
      `);
      expect((rows as any[]).length).toBeGreaterThan(0);
    });
  });

  describe("Liaisons H3 (Traditions antiques)", () => {
    it("devrait avoir des références liées à H3", async () => {
      const [rows] = await conn.execute(`
        SELECT COUNT(*) as count 
        FROM bibliography_axis_links bal
        JOIN thematic_axes ta ON bal.axis_id = ta.id
        WHERE ta.axis_code = 'H3'
      `);
      expect((rows as any[])[0].count).toBeGreaterThan(0);
    });

    it("devrait inclure des références sur les parfums antiques", async () => {
      const [rows] = await conn.execute(`
        SELECT be.title
        FROM bibliography_entries be
        JOIN bibliography_axis_links bal ON be.id = bal.bibliography_id
        JOIN thematic_axes ta ON bal.axis_id = ta.id
        WHERE ta.axis_code = 'H3'
        AND (be.title LIKE '%ancient%' OR be.title LIKE '%antique%' OR be.title LIKE '%historical%')
        LIMIT 5
      `);
      expect((rows as any[]).length).toBeGreaterThan(0);
    });

    it("devrait inclure des références ethnobotaniques", async () => {
      const [rows] = await conn.execute(`
        SELECT be.title
        FROM bibliography_entries be
        JOIN bibliography_axis_links bal ON be.id = bal.bibliography_id
        JOIN thematic_axes ta ON bal.axis_id = ta.id
        WHERE ta.axis_code = 'H3'
        AND (be.title LIKE '%ethnobotany%' OR be.title LIKE '%tradition%' OR be.title LIKE '%indigenous%')
        LIMIT 5
      `);
      expect((rows as any[]).length).toBeGreaterThan(0);
    });
  });

  describe("Table bibliography_entity_links", () => {
    it("devrait exister et avoir la bonne structure", async () => {
      const [rows] = await conn.execute("DESCRIBE bibliography_entity_links");
      const columns = (rows as any[]).map((r) => r.Field);
      
      expect(columns).toContain("id");
      expect(columns).toContain("bibliography_id");
      expect(columns).toContain("entity_type");
      expect(columns).toContain("entity_id");
      expect(columns).toContain("link_type");
      expect(columns).toContain("relevance_score");
    });

    it("devrait supporter les types d'entités attendus", async () => {
      const [rows] = await conn.execute("DESCRIBE bibliography_entity_links");
      const entityTypeRow = (rows as any[]).find((r) => r.Field === "entity_type");
      
      expect(entityTypeRow.Type).toContain("molecule");
      expect(entityTypeRow.Type).toContain("plant");
      expect(entityTypeRow.Type).toContain("terroir");
    });

    it("devrait supporter les types de liens attendus", async () => {
      const [rows] = await conn.execute("DESCRIBE bibliography_entity_links");
      const linkTypeRow = (rows as any[]).find((r) => r.Field === "link_type");
      
      expect(linkTypeRow.Type).toContain("primary_source");
      expect(linkTypeRow.Type).toContain("supporting");
      expect(linkTypeRow.Type).toContain("conservation");
    });
  });

  describe("Leaf Economies", () => {
    it("devrait avoir des entrées dans leaf_economies", async () => {
      const [rows] = await conn.execute("SELECT COUNT(*) as count FROM leaf_economies");
      expect((rows as any[])[0].count).toBeGreaterThan(0);
    });

    it("devrait avoir des espèces documentées", async () => {
      const [rows] = await conn.execute(
        "SELECT DISTINCT species FROM leaf_economies WHERE species IS NOT NULL LIMIT 10"
      );
      expect((rows as any[]).length).toBeGreaterThan(0);
    });
  });

  describe("Statistiques globales", () => {
    it("devrait avoir un nombre significatif de liaisons H2", async () => {
      const [rows] = await conn.execute(`
        SELECT COUNT(*) as count 
        FROM bibliography_axis_links bal
        JOIN thematic_axes ta ON bal.axis_id = ta.id
        WHERE ta.axis_code = 'H2'
      `);
      // Au moins 20 liaisons H2
      expect((rows as any[])[0].count).toBeGreaterThanOrEqual(20);
    });

    it("devrait avoir un nombre significatif de liaisons H3", async () => {
      const [rows] = await conn.execute(`
        SELECT COUNT(*) as count 
        FROM bibliography_axis_links bal
        JOIN thematic_axes ta ON bal.axis_id = ta.id
        WHERE ta.axis_code = 'H3'
      `);
      // Au moins 30 liaisons H3
      expect((rows as any[])[0].count).toBeGreaterThanOrEqual(30);
    });
  });
});
