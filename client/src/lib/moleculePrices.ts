// Base de données des prix des molécules (prix moyen en $/kg)
export const moleculesPrix: Record<string, { prixMin: number; prixMax: number; categorie: string; description?: string }> = {
  // Naturels rares
  "Oud (Aquilaria)": { prixMin: 30000, prixMax: 100000, categorie: "naturel-luxe", description: "Bois d'agar, notes cuirées et fumées" },
  "Absolue d'Iris": { prixMin: 40000, prixMax: 100000, categorie: "naturel-luxe", description: "Racine d'iris, notes poudrées et violettes" },
  "Ambre Gris": { prixMin: 20000, prixMax: 50000, categorie: "naturel-luxe", description: "Concrétion marine, notes ambrées et marines" },
  "Absolue de Rose": { prixMin: 6000, prixMax: 12000, categorie: "naturel-premium", description: "Rosa damascena, notes florales et miellées" },
  "Absolue de Jasmin": { prixMin: 5000, prixMax: 10000, categorie: "naturel-premium", description: "Jasminum grandiflorum, notes florales et animales" },
  "Tubéreuse Absolue": { prixMin: 8000, prixMax: 18000, categorie: "naturel-premium", description: "Polianthes tuberosa, notes crémeuses et narcotiques" },
  "Santal Mysore": { prixMin: 2500, prixMax: 5000, categorie: "naturel-premium", description: "Santalum album, notes boisées et crémeuses" },
  "Muscone": { prixMin: 8000, prixMax: 15000, categorie: "naturel-luxe", description: "Musc naturel, notes animales et poudrées" },
  "Civettone": { prixMin: 5000, prixMax: 12000, categorie: "naturel-luxe", description: "Civette, notes animales et fécales" },
  "Safranal": { prixMin: 3000, prixMax: 8000, categorie: "naturel-premium", description: "Crocus sativus, notes épicées et cuirées" },
  
  // Épices et résines
  "Encens Oliban": { prixMin: 300, prixMax: 800, categorie: "naturel-standard", description: "Boswellia, notes résineuses et citronnées" },
  "Myrrhe": { prixMin: 200, prixMax: 600, categorie: "naturel-standard", description: "Commiphora, notes résineuses et balsamiques" },
  "Cardamome": { prixMin: 80, prixMax: 200, categorie: "naturel-standard", description: "Elettaria cardamomum, notes épicées et fraîches" },
  "Bergamote Calabre": { prixMin: 100, prixMax: 250, categorie: "naturel-standard", description: "Citrus bergamia, notes hespéridées et fraîches" },
  "Yuzu": { prixMin: 400, prixMax: 900, categorie: "naturel-premium", description: "Citrus junos, notes agrumes et zestées" },
  
  // Bois
  "Cèdre Atlas": { prixMin: 30, prixMax: 80, categorie: "naturel-budget", description: "Cedrus atlantica, notes boisées et sèches" },
  "Gaïac": { prixMin: 200, prixMax: 500, categorie: "naturel-standard", description: "Bulnesia sarmientoi, notes boisées et fumées" },
  "Vétiver": { prixMin: 150, prixMax: 400, categorie: "naturel-standard", description: "Vetiveria zizanioides, notes terreuses et boisées" },
  "Patchouli": { prixMin: 80, prixMax: 200, categorie: "naturel-standard", description: "Pogostemon cablin, notes terreuses et camphrées" },
  
  // Synthétiques courants
  "Iso E Super": { prixMin: 50, prixMax: 150, categorie: "synthetique-budget", description: "Note boisée, ambrée, veloutée" },
  "Ambroxan": { prixMin: 150, prixMax: 400, categorie: "synthetique-standard", description: "Note ambrée, musquée, boisée" },
  "Hedione": { prixMin: 60, prixMax: 150, categorie: "synthetique-budget", description: "Note jasminée, fraîche, transparente" },
  "Galaxolide": { prixMin: 50, prixMax: 120, categorie: "synthetique-budget", description: "Note musquée, propre, poudrée" },
  "Cashmeran": { prixMin: 80, prixMax: 200, categorie: "synthetique-budget", description: "Note musquée, épicée, boisée" },
  "Coumarine": { prixMin: 30, prixMax: 80, categorie: "synthetique-budget", description: "Note foin, amande, vanillée" },
  "Calone 1951": { prixMin: 100, prixMax: 300, categorie: "synthetique-standard", description: "Note marine, ozonic, melon" },
  "Ethylene Brassylate": { prixMin: 80, prixMax: 200, categorie: "synthetique-budget", description: "Note musquée, florale, poudrée" },
  
  // Captives premium
  "Javanol": { prixMin: 500, prixMax: 1500, categorie: "synthetique-premium", description: "Note santalée, crémeuse (Givaudan)" },
  "Norlimbanol": { prixMin: 300, prixMax: 700, categorie: "synthetique-premium", description: "Note boisée, vétiver (Firmenich)" },
  "Clearwood": { prixMin: 400, prixMax: 900, categorie: "synthetique-premium", description: "Note boisée, patchouli (Firmenich)" },
  "Paradisone": { prixMin: 350, prixMax: 800, categorie: "synthetique-premium", description: "Note jasminée, fruitée (Firmenich)" },
  "Ambrox Super": { prixMin: 200, prixMax: 500, categorie: "synthetique-standard", description: "Note ambrée, boisée, musquée" },
  
  // Bases et solvants
  "Alcool éthylique (parfumerie)": { prixMin: 3, prixMax: 8, categorie: "base", description: "Solvant principal pour parfums" },
  "DPG (Dipropylene Glycol)": { prixMin: 5, prixMax: 15, categorie: "base", description: "Solvant et fixateur" },
  "IPM (Isopropyl Myristate)": { prixMin: 10, prixMax: 25, categorie: "base", description: "Émollient et solvant" },
};

// Liste des molécules pour le sélecteur
export const moleculesListe = Object.keys(moleculesPrix).sort();
