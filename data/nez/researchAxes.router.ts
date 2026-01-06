// Minimal router pseudo-code (adapt to your stack)
export const researchAxes = {
  list: async (db) => db.research_axis.findMany({ orderBy: { axis_id: "asc" }}),

  bySlug: async (db, slug) => {
    const axis = await db.research_axis.findUnique({ where: { slug } });
    if (!axis) return null;
    const sources = await db.axis_source.findMany({
      where: { axis_id: axis.axis_id },
      include: { source_article: true },
      orderBy: { confidence: "desc" }
    });
    return { axis, sources };
  }
};
