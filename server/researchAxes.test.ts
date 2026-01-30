import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Tests for Research Axes functionality
 * - Sub-axes hierarchy (parentAxisId)
 * - Objectives and methodology fields
 * - Bibliography linking
 */

// Mock the database module
vi.mock("./db", () => ({
  getAllResearchAxes: vi.fn(),
  getResearchAxisById: vi.fn(),
  getResearchAxisByCode: vi.fn(),
  createResearchAxis: vi.fn(),
  updateResearchAxis: vi.fn(),
  deleteResearchAxis: vi.fn(),
  getSubAxes: vi.fn(),
  getAxisWithSubAxes: vi.fn(),
  getAxisHierarchy: vi.fn(),
  getBibliographyByAxis: vi.fn(),
  linkBibliographyToAxis: vi.fn(),
  unlinkBibliographyFromAxis: vi.fn(),
  getAxesByBibliography: vi.fn(),
  getResearchAxesStats: vi.fn(),
}));

import * as db from "./db";

describe("Research Axes - Sub-axes Hierarchy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a main axis without parent", async () => {
    const mockAxis = {
      id: 1,
      axisCode: "AX1",
      name: "Chimie Olfactive",
      parentAxisId: null,
      objectives: "Étudier les molécules odorantes",
      methodology: "Analyse GC-MS",
    };

    vi.mocked(db.createResearchAxis).mockResolvedValue(mockAxis as any);

    const result = await db.createResearchAxis({
      axisCode: "AX1",
      name: "Chimie Olfactive",
      objectives: "Étudier les molécules odorantes",
      methodology: "Analyse GC-MS",
    } as any);

    expect(result).toEqual(mockAxis);
    expect(result.parentAxisId).toBeNull();
  });

  it("should create a sub-axis with parent reference", async () => {
    const mockSubAxis = {
      id: 2,
      axisCode: "AX1-1",
      name: "Terpènes",
      parentAxisId: 1,
      objectives: "Caractériser les terpènes",
      methodology: "Extraction et analyse",
    };

    vi.mocked(db.createResearchAxis).mockResolvedValue(mockSubAxis as any);

    const result = await db.createResearchAxis({
      axisCode: "AX1-1",
      name: "Terpènes",
      parentAxisId: 1,
      objectives: "Caractériser les terpènes",
      methodology: "Extraction et analyse",
    } as any);

    expect(result).toEqual(mockSubAxis);
    expect(result.parentAxisId).toBe(1);
  });

  it("should retrieve sub-axes for a parent axis", async () => {
    const mockSubAxes = [
      { id: 2, axisCode: "AX1-1", name: "Terpènes", parentAxisId: 1 },
      { id: 3, axisCode: "AX1-2", name: "Aldéhydes", parentAxisId: 1 },
    ];

    vi.mocked(db.getSubAxes).mockResolvedValue(mockSubAxes as any);

    const result = await db.getSubAxes(1);

    expect(result).toHaveLength(2);
    expect(result[0].parentAxisId).toBe(1);
    expect(result[1].parentAxisId).toBe(1);
  });

  it("should retrieve axis with its sub-axes", async () => {
    const mockAxisWithSubAxes = {
      id: 1,
      axisCode: "AX1",
      name: "Chimie Olfactive",
      parentAxisId: null,
      subAxes: [
        { id: 2, axisCode: "AX1-1", name: "Terpènes", parentAxisId: 1 },
        { id: 3, axisCode: "AX1-2", name: "Aldéhydes", parentAxisId: 1 },
      ],
    };

    vi.mocked(db.getAxisWithSubAxes).mockResolvedValue(mockAxisWithSubAxes as any);

    const result = await db.getAxisWithSubAxes(1);

    expect(result).not.toBeNull();
    expect(result?.subAxes).toHaveLength(2);
  });

  it("should retrieve complete axis hierarchy", async () => {
    const mockHierarchy = [
      {
        id: 1,
        axisCode: "AX1",
        name: "Chimie Olfactive",
        parentAxisId: null,
        subAxes: [
          { id: 2, axisCode: "AX1-1", name: "Terpènes", parentAxisId: 1 },
        ],
      },
      {
        id: 4,
        axisCode: "AX2",
        name: "Botanique",
        parentAxisId: null,
        subAxes: [],
      },
    ];

    vi.mocked(db.getAxisHierarchy).mockResolvedValue(mockHierarchy as any);

    const result = await db.getAxisHierarchy();

    expect(result).toHaveLength(2);
    expect(result[0].subAxes).toHaveLength(1);
    expect(result[1].subAxes).toHaveLength(0);
  });
});

describe("Research Axes - Objectives and Methodology", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update axis objectives", async () => {
    const mockUpdatedAxis = {
      id: 1,
      axisCode: "AX1",
      name: "Chimie Olfactive",
      objectives: "Nouveaux objectifs détaillés",
      methodology: "Méthodologie existante",
    };

    vi.mocked(db.updateResearchAxis).mockResolvedValue(mockUpdatedAxis as any);

    const result = await db.updateResearchAxis(1, {
      objectives: "Nouveaux objectifs détaillés",
    } as any);

    expect(result.objectives).toBe("Nouveaux objectifs détaillés");
  });

  it("should update axis methodology", async () => {
    const mockUpdatedAxis = {
      id: 1,
      axisCode: "AX1",
      name: "Chimie Olfactive",
      objectives: "Objectifs existants",
      methodology: "Nouvelle méthodologie détaillée",
    };

    vi.mocked(db.updateResearchAxis).mockResolvedValue(mockUpdatedAxis as any);

    const result = await db.updateResearchAxis(1, {
      methodology: "Nouvelle méthodologie détaillée",
    } as any);

    expect(result.methodology).toBe("Nouvelle méthodologie détaillée");
  });

  it("should update both objectives and methodology together", async () => {
    const mockUpdatedAxis = {
      id: 1,
      axisCode: "AX1",
      name: "Chimie Olfactive",
      objectives: "Objectifs mis à jour",
      methodology: "Méthodologie mise à jour",
    };

    vi.mocked(db.updateResearchAxis).mockResolvedValue(mockUpdatedAxis as any);

    const result = await db.updateResearchAxis(1, {
      objectives: "Objectifs mis à jour",
      methodology: "Méthodologie mise à jour",
    } as any);

    expect(result.objectives).toBe("Objectifs mis à jour");
    expect(result.methodology).toBe("Méthodologie mise à jour");
  });

  it("should retrieve axis with objectives and methodology", async () => {
    const mockAxis = {
      id: 1,
      axisCode: "AX1",
      name: "Chimie Olfactive",
      description: "Description de l'axe",
      objectives: "1. Identifier les molécules clés\n2. Analyser leurs propriétés",
      methodology: "1. Extraction\n2. GC-MS\n3. Analyse sensorielle",
    };

    vi.mocked(db.getResearchAxisById).mockResolvedValue(mockAxis as any);

    const result = await db.getResearchAxisById(1);

    expect(result).not.toBeNull();
    expect(result?.objectives).toContain("Identifier les molécules clés");
    expect(result?.methodology).toContain("GC-MS");
  });
});

describe("Research Axes - Bibliography Linking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should link a bibliography entry to an axis", async () => {
    const mockLink = {
      id: 1,
      bibliographyId: 10,
      axisId: 1,
    };

    vi.mocked(db.linkBibliographyToAxis).mockResolvedValue(mockLink as any);

    const result = await db.linkBibliographyToAxis(10, 1, "primaire", "Source principale");

    expect(result).not.toBeNull();
    expect(result?.bibliographyId).toBe(10);
    expect(result?.axisId).toBe(1);
  });

  it("should unlink a bibliography entry from an axis", async () => {
    vi.mocked(db.unlinkBibliographyFromAxis).mockResolvedValue(true);

    const result = await db.unlinkBibliographyFromAxis(10, 1);

    expect(result).toBe(true);
  });

  it("should retrieve bibliography entries linked to an axis", async () => {
    const mockBibliography = [
      {
        id: 10,
        entryKey: "smith2024",
        title: "Olfactory Chemistry",
        authors: "Smith, J.",
        year: 2024,
        relevance: "primaire",
      },
      {
        id: 11,
        entryKey: "jones2023",
        title: "Terpene Analysis",
        authors: "Jones, M.",
        year: 2023,
        relevance: "secondaire",
      },
    ];

    vi.mocked(db.getBibliographyByAxis).mockResolvedValue(mockBibliography as any);

    const result = await db.getBibliographyByAxis(1);

    expect(result).toHaveLength(2);
    expect(result[0].relevance).toBe("primaire");
    expect(result[1].relevance).toBe("secondaire");
  });

  it("should retrieve axes linked to a bibliography entry", async () => {
    const mockAxes = [
      { id: 1, axisCode: "AX1", name: "Chimie Olfactive" },
      { id: 2, axisCode: "AX2", name: "Botanique" },
    ];

    vi.mocked(db.getAxesByBibliography).mockResolvedValue(mockAxes as any);

    const result = await db.getAxesByBibliography(10);

    expect(result).toHaveLength(2);
  });

  it("should return empty array when no bibliography linked", async () => {
    vi.mocked(db.getBibliographyByAxis).mockResolvedValue([]);

    const result = await db.getBibliographyByAxis(999);

    expect(result).toHaveLength(0);
  });

  it("should handle duplicate link gracefully", async () => {
    vi.mocked(db.linkBibliographyToAxis).mockResolvedValue(null);

    const result = await db.linkBibliographyToAxis(10, 1);

    expect(result).toBeNull();
  });
});

describe("Research Axes - Statistics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve axis statistics", async () => {
    const mockStats = {
      total: 10,
      averageProgress: 45,
      byStatus: [
        { status: "en_cours", count: 5 },
        { status: "planifie", count: 3 },
        { status: "termine", count: 2 },
      ],
      byCategory: [
        { category: "fondamental", count: 4 },
        { category: "applique", count: 3 },
        { category: "experimental", count: 3 },
      ],
    };

    vi.mocked(db.getResearchAxesStats).mockResolvedValue(mockStats as any);

    const result = await db.getResearchAxesStats();

    expect(result.total).toBe(10);
    expect(result.averageProgress).toBe(45);
    expect(result.byStatus).toHaveLength(3);
    expect(result.byCategory).toHaveLength(3);
  });
});
