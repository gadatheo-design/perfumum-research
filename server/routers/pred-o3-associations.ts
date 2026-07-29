import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";

/**
 * Données Pred-O3 brutes avec associations plante-descripteur-molécule
 * Source: https://odor.rpbs.univ-paris-diderot.fr/
 */
const PRED_O3_ASSOCIATIONS = [
  // Fruity descriptors
  {
    descriptorId: "fruity",
    descriptorName: "Fruity",
    category: "fruity",
    associations: [
      { type: "molecule", name: "Ethyl acetate", iupacName: "ethyl ethanoate", casNumber: "141-78-6" },
      { type: "molecule", name: "Isoamyl acetate", iupacName: "3-methylbutyl ethanoate", casNumber: "123-92-2" },
      { type: "molecule", name: "Ethyl butyrate", iupacName: "ethyl butanoate", casNumber: "105-54-4" },
      { type: "molecule", name: "Hexyl acetate", iupacName: "hexyl ethanoate", casNumber: "142-92-7" },
      { type: "plant", latinName: "Malus domestica", commonName: "Apple" },
      { type: "plant", latinName: "Prunus persica", commonName: "Peach" },
    ],
  },
  // Floral descriptors
  {
    descriptorId: "floral",
    descriptorName: "Floral",
    category: "floral",
    associations: [
      { type: "molecule", name: "Benzyl acetate", iupacName: "phenylmethyl ethanoate", casNumber: "140-11-4" },
      { type: "molecule", name: "Linalool", iupacName: "3,7-dimethylocta-1,6-dien-3-ol", casNumber: "78-70-6" },
      { type: "molecule", name: "Geraniol", iupacName: "(E)-3,7-dimethylocta-2,6-dien-1-ol", casNumber: "106-24-1" },
      { type: "molecule", name: "Rose oxide", iupacName: "2,5-dihydro-2,6-dimethyl-2H-pyran-3(4H)-one", casNumber: "16409-43-1" },
      { type: "plant", latinName: "Rosa damascena", commonName: "Damask Rose" },
      { type: "plant", latinName: "Jasminum sambac", commonName: "Arabian Jasmine" },
      { type: "plant", latinName: "Lavandula angustifolia", commonName: "Lavender" },
    ],
  },
  // Minty descriptors
  {
    descriptorId: "minty",
    descriptorName: "Minty",
    category: "minty",
    associations: [
      { type: "molecule", name: "Menthol", iupacName: "2-isopropyl-5-methylcyclohexanol", casNumber: "89-78-1" },
      { type: "molecule", name: "Menthone", iupacName: "2-isopropyl-5-methylcyclohexanone", casNumber: "14073-97-3" },
      { type: "molecule", name: "Peppermint oil", iupacName: "mixture", casNumber: "84-77-5" },
      { type: "plant", latinName: "Mentha piperita", commonName: "Peppermint" },
      { type: "plant", latinName: "Mentha spicata", commonName: "Spearmint" },
    ],
  },
  // Woody descriptors
  {
    descriptorId: "woody",
    descriptorName: "Woody",
    category: "woody",
    associations: [
      { type: "molecule", name: "Cedrene", iupacName: "1,3,4,5,8,8-hexamethyl-1,4-cyclohexadiene", casNumber: "469-61-4" },
      { type: "molecule", name: "Cedrol", iupacName: "1,3,4,5,8,8-hexamethyl-5,8-dihydro-1H-2-benzopyran-1-ol", casNumber: "77-53-2" },
      { type: "molecule", name: "Santalol", iupacName: "6,10-dimethylundeca-5,9-dien-2-ol", casNumber: "115-06-0" },
      { type: "plant", latinName: "Cedrus atlantica", commonName: "Atlas Cedar" },
      { type: "plant", latinName: "Santalum album", commonName: "Indian Sandalwood" },
    ],
  },
  // Spicy descriptors
  {
    descriptorId: "spicy",
    descriptorName: "Spicy",
    category: "spicy",
    associations: [
      { type: "molecule", name: "Eugenol", iupacName: "4-allyl-2-methoxyphenol", casNumber: "97-53-0" },
      { type: "molecule", name: "Safrole", iupacName: "5-allyl-1,3-benzodioxole", casNumber: "94-59-7" },
      { type: "molecule", name: "Cinnamaldehyde", iupacName: "3-phenylprop-2-enal", casNumber: "104-55-2" },
      { type: "plant", latinName: "Syzygium aromaticum", commonName: "Clove" },
      { type: "plant", latinName: "Cinnamomum verum", commonName: "Cinnamon" },
      { type: "plant", latinName: "Piper nigrum", commonName: "Black Pepper" },
    ],
  },
  // Citrus descriptors
  {
    descriptorId: "citrus",
    descriptorName: "Citrus",
    category: "citrus",
    associations: [
      { type: "molecule", name: "Limonene", iupacName: "1-methyl-4-(prop-1-en-2-yl)cyclohexene", casNumber: "138-86-3" },
      { type: "molecule", name: "Citral", iupacName: "3,7-dimethylocta-2,6-dienal", casNumber: "5392-40-5" },
      { type: "molecule", name: "Linalyl acetate", iupacName: "3,7-dimethylocta-1,6-dien-3-yl ethanoate", casNumber: "115-95-7" },
      { type: "plant", latinName: "Citrus limon", commonName: "Lemon" },
      { type: "plant", latinName: "Citrus aurantium", commonName: "Bitter Orange" },
      { type: "plant", latinName: "Citrus bergamia", commonName: "Bergamot Orange" },
    ],
  },
  // Earthy descriptors
  {
    descriptorId: "earthy",
    descriptorName: "Earthy",
    category: "earthy",
    associations: [
      { type: "molecule", name: "Geosmin", iupacName: "2-methyl-2H-isoindole-4,7-dione", casNumber: "19700-21-1" },
      { type: "molecule", name: "2-methylisoborneol", iupacName: "2-methylisoborneol", casNumber: "2371-42-0" },
      { type: "plant", latinName: "Vetiveria zizanioides", commonName: "Vetiver" },
      { type: "plant", latinName: "Pogostemon cablin", commonName: "Patchouli" },
    ],
  },
  // Sweet descriptors
  {
    descriptorId: "sweet",
    descriptorName: "Sweet",
    category: "sweet",
    associations: [
      { type: "molecule", name: "Vanillin", iupacName: "4-hydroxy-3-methoxybenzaldehyde", casNumber: "121-33-5" },
      { type: "molecule", name: "Ethyl vanillin", iupacName: "3-ethoxy-4-hydroxybenzaldehyde", casNumber: "121-32-4" },
      { type: "molecule", name: "Heliotropin", iupacName: "1,3-benzodioxole-5-carboxaldehyde", casNumber: "120-57-0" },
      { type: "plant", latinName: "Vanilla planifolia", commonName: "Vanilla" },
    ],
  },
];

export const predO3AssociationsRouter = router({
  /**
   * Récupérer toutes les associations Pred-O3
   */
  getAllAssociations: publicProcedure.query(() => {
    return PRED_O3_ASSOCIATIONS;
  }),

  /**
   * Récupérer les associations pour un descripteur spécifique
   */
  getAssociationsByDescriptor: publicProcedure
    .input(z.object({ descriptorId: z.string() }))
    .query(({ input }) => {
      const association = PRED_O3_ASSOCIATIONS.find((a) => a.descriptorId === input.descriptorId);
      return association || null;
    }),

  /**
   * Récupérer les associations par type (plante ou molécule)
   */
  getAssociationsByType: publicProcedure
    .input(z.object({ type: z.enum(["plant", "molecule"]) }))
    .query(({ input }) => {
      const result: Record<string, any[]> = {};

      PRED_O3_ASSOCIATIONS.forEach((descriptor) => {
        const filtered = descriptor.associations.filter((a) => a.type === input.type);
        if (filtered.length > 0) {
          result[descriptor.descriptorId] = filtered;
        }
      });

      return result;
    }),

  /**
   * Récupérer les statistiques des associations
   */
  getAssociationStats: publicProcedure.query(() => {
    const stats = {
      totalDescriptors: PRED_O3_ASSOCIATIONS.length,
      totalAssociations: 0,
      totalPlants: 0,
      totalMolecules: 0,
      descriptorsByCategory: {} as Record<string, number>,
    };

    PRED_O3_ASSOCIATIONS.forEach((descriptor) => {
      stats.totalAssociations += descriptor.associations.length;
      stats.descriptorsByCategory[descriptor.category] =
        (stats.descriptorsByCategory[descriptor.category] || 0) + 1;

      descriptor.associations.forEach((assoc) => {
        if (assoc.type === "plant") stats.totalPlants++;
        if (assoc.type === "molecule") stats.totalMolecules++;
      });
    });

    return stats;
  }),

  /**
   * Rechercher une plante dans les associations Pred-O3
   */
  searchPlantInAssociations: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ input }) => {
      const term = input.query.toLowerCase();
      const results: any[] = [];

      PRED_O3_ASSOCIATIONS.forEach((descriptor) => {
        descriptor.associations.forEach((assoc) => {
          if (
            assoc.type === "plant" &&
            (assoc.latinName?.toLowerCase().includes(term) ||
              assoc.commonName?.toLowerCase().includes(term))
          ) {
            results.push({
              descriptorId: descriptor.descriptorId,
              descriptorName: descriptor.descriptorName,
              plant: assoc,
            });
          }
        });
      });

      return results;
    }),

  /**
   * Rechercher une molécule dans les associations Pred-O3
   */
  searchMoleculeInAssociations: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ input }) => {
      const term = input.query.toLowerCase();
      const results: any[] = [];

      PRED_O3_ASSOCIATIONS.forEach((descriptor) => {
        descriptor.associations.forEach((assoc) => {
          if (
            assoc.type === "molecule" &&
            (assoc.name?.toLowerCase().includes(term) ||
              assoc.iupacName?.toLowerCase().includes(term) ||
              assoc.casNumber?.includes(term))
          ) {
            results.push({
              descriptorId: descriptor.descriptorId,
              descriptorName: descriptor.descriptorName,
              molecule: assoc,
            });
          }
        });
      });

      return results;
    }),
});
