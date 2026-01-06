/**
 * PERFUMUM - Import des archives olfactives
 * Jour 7 de la roadmap : Manuscrits, formules anciennes et découvertes archéologiques
 * 
 * Sources :
 * - Papyrus Ebers (1550 av. J.-C.)
 * - De Materia Medica (Dioscoride, 70 ap. J.-C.)
 * - Histoire naturelle (Pline l'Ancien, 77 ap. J.-C.)
 * - Découvertes archéologiques (tombes égyptiennes, Pompéi, etc.)
 */

import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);

  console.log("📜 Import des archives olfactives - PERFUMUM");
  console.log("=".repeat(60));

  // ============================================================================
  // ARCHIVES OLFACTIVES
  // ============================================================================
  const olfactiveArchives = [
    // MANUSCRITS ÉGYPTIENS
    {
      title: "Papyrus Ebers",
      type: "manuscript",
      civilization: "Égypte",
      date_created: "1550 av. J.-C.",
      date_start: -1550,
      date_end: -1550,
      description: "Le plus ancien traité médical connu, contenant plus de 700 formules et remèdes. Mentionne l'utilisation de la myrrhe, de l'encens, du lotus et de nombreuses plantes aromatiques dans les préparations médicinales et rituelles. Le papyrus décrit des onguents, des fumigations et des huiles parfumées.",
      provenance: "Thèbes, Égypte. Découvert en 1862 par Edwin Smith, acquis par Georg Ebers en 1873. Conservé à la Bibliothèque universitaire de Leipzig.",
      authenticity_level: "confirmed",
      olfactive_notes: "Myrrhe, encens, lotus bleu, cèdre, genévrier, cannelle, coriandre",
      ingredients_mentioned: JSON.stringify(["Myrrhe (antiu)", "Encens (sntr)", "Lotus bleu (seshen)", "Cèdre (ash)", "Genévrier", "Cannelle", "Coriandre", "Huile de moringa"]),
      references: JSON.stringify([
        { author: "Ebers, Georg", year: 1875, title: "Papyros Ebers: Das hermetische Buch über die Arzneimittel der alten Ägypter" },
        { author: "Nunn, John F.", year: 1996, title: "Ancient Egyptian Medicine", publisher: "British Museum Press" }
      ]),
    },
    {
      title: "Recette du Kyphi",
      type: "formula",
      civilization: "Égypte",
      date_created: "1500 av. J.-C. - 300 ap. J.-C.",
      date_start: -1500,
      date_end: 300,
      description: "Le Kyphi (kapet en égyptien) était le parfum sacré par excellence de l'Égypte ancienne. Brûlé au coucher du soleil dans les temples, il était censé apaiser les dieux et purifier l'air. Plusieurs versions de la recette existent, mentionnant 10 à 16 ingrédients.",
      provenance: "Inscriptions des temples d'Edfou et de Philae. Descriptions par Plutarque et Dioscoride.",
      authenticity_level: "confirmed",
      olfactive_notes: "Balsamique, miellé, résineux, légèrement épicé avec des notes de vin et de raisins secs",
      ingredients_mentioned: JSON.stringify(["Myrrhe", "Encens", "Mastic", "Genévrier", "Calamus", "Cannelle", "Cardamome", "Safran", "Miel", "Vin", "Raisins secs", "Résine de pin", "Asphalte", "Henné", "Souchet"]),
      references: JSON.stringify([
        { author: "Plutarque", year: 100, title: "Isis et Osiris" },
        { author: "Dioscoride", year: 70, title: "De Materia Medica, Livre I" },
        { author: "Manniche, Lise", year: 1999, title: "Sacred Luxuries: Fragrance, Aromatherapy, and Cosmetics in Ancient Egypt" }
      ]),
    },
    {
      title: "Huile de Metopion",
      type: "formula",
      civilization: "Égypte",
      date_created: "1200 av. J.-C.",
      date_start: -1200,
      date_end: -500,
      description: "Huile parfumée égyptienne à base d'amande amère et de galbanum, mentionnée par Théophraste et Pline. Utilisée pour les soins du corps et les rituels funéraires. L'une des premières huiles parfumées commercialisées à grande échelle.",
      provenance: "Textes égyptiens et grecs. Résidus trouvés dans des vases canopes.",
      authenticity_level: "probable",
      olfactive_notes: "Vert, résineux, légèrement amer avec des notes d'amande",
      ingredients_mentioned: JSON.stringify(["Huile d'amande amère", "Galbanum", "Cardamome", "Jonc odorant", "Miel"]),
      references: JSON.stringify([
        { author: "Théophraste", year: -300, title: "De Odoribus (Sur les odeurs)" },
        { author: "Pline l'Ancien", year: 77, title: "Histoire naturelle, Livre XIII" }
      ]),
    },
    // MANUSCRITS GRECS
    {
      title: "De Materia Medica",
      type: "manuscript",
      civilization: "Grèce",
      date_created: "70 ap. J.-C.",
      date_start: 70,
      date_end: 70,
      description: "Encyclopédie pharmaceutique de Dioscoride décrivant plus de 600 plantes médicinales et aromatiques. Référence majeure pendant 1500 ans, elle détaille les propriétés, les usages et les méthodes de préparation des aromates. Inclut des descriptions détaillées de la myrrhe, de l'encens, du nard et du silphium.",
      provenance: "Écrit par Pedanius Dioscoride, médecin grec de l'armée romaine. Nombreuses copies médiévales, dont le Codex Vindobonensis (512 ap. J.-C.).",
      authenticity_level: "confirmed",
      olfactive_notes: "Descriptions olfactives détaillées de centaines de plantes aromatiques",
      ingredients_mentioned: JSON.stringify(["Myrrhe", "Encens", "Nard", "Silphium", "Cinnamome", "Cassia", "Iris", "Rose", "Safran", "Styrax", "Bdellium", "Opoponax", "Galbanum"]),
      references: JSON.stringify([
        { author: "Dioscoride", year: 70, title: "De Materia Medica" },
        { author: "Riddle, John M.", year: 1985, title: "Dioscorides on Pharmacy and Medicine", publisher: "University of Texas Press" }
      ]),
    },
    {
      title: "De Odoribus (Sur les odeurs)",
      type: "manuscript",
      civilization: "Grèce",
      date_created: "300 av. J.-C.",
      date_start: -300,
      date_end: -300,
      description: "Traité de Théophraste sur les parfums et les odeurs, le plus ancien ouvrage consacré spécifiquement à la parfumerie. Décrit les techniques d'extraction, les mélanges et les propriétés des aromates. Distingue les parfums simples des composés.",
      provenance: "Écrit par Théophraste, successeur d'Aristote au Lycée d'Athènes.",
      authenticity_level: "confirmed",
      olfactive_notes: "Classification des odeurs : lourdes, légères, pénétrantes, douces",
      ingredients_mentioned: JSON.stringify(["Rose", "Iris", "Nard", "Myrrhe", "Encens", "Cannelle", "Cardamome", "Safran", "Lotus", "Henné"]),
      references: JSON.stringify([
        { author: "Théophraste", year: -300, title: "De Odoribus" },
        { author: "Einarson, Benedict & Link, George K.K.", year: 1990, title: "Theophrastus: De Causis Plantarum", publisher: "Harvard University Press" }
      ]),
    },
    // MANUSCRITS ROMAINS
    {
      title: "Histoire naturelle - Livres XII-XIII",
      type: "manuscript",
      civilization: "Rome",
      date_created: "77 ap. J.-C.",
      date_start: 77,
      date_end: 77,
      description: "Les livres XII et XIII de l'encyclopédie de Pline l'Ancien sont consacrés aux arbres exotiques et aux parfums. Ils décrivent en détail le commerce de l'encens et de la myrrhe, la Route de l'encens, et les techniques de parfumerie romaine. Source majeure sur le silphium disparu.",
      provenance: "Écrit par Pline l'Ancien, naturaliste romain. Dédié à l'empereur Titus.",
      authenticity_level: "confirmed",
      olfactive_notes: "Descriptions commerciales et olfactives des aromates du monde antique",
      ingredients_mentioned: JSON.stringify(["Encens", "Myrrhe", "Silphium", "Nard", "Cinnamome", "Cassia", "Costus", "Amomum", "Cardamome", "Baume de Judée"]),
      references: JSON.stringify([
        { author: "Pline l'Ancien", year: 77, title: "Naturalis Historia" },
        { author: "Dalby, Andrew", year: 2000, title: "Dangerous Tastes: The Story of Spices", publisher: "British Museum Press" }
      ]),
    },
    {
      title: "De Re Coquinaria (Apicius)",
      type: "formula",
      civilization: "Rome",
      date_created: "400 ap. J.-C.",
      date_start: 400,
      date_end: 400,
      description: "Recueil de recettes romaines attribué à Apicius, contenant de nombreuses préparations aromatiques. Mentionne l'utilisation du laser (silphium ou son substitut) et de nombreuses épices dans la cuisine romaine de luxe.",
      provenance: "Compilation de recettes romaines, probablement du 4e siècle. Manuscrits médiévaux conservés.",
      authenticity_level: "probable",
      olfactive_notes: "Garum, laser, poivre, cumin, coriandre, menthe, rue",
      ingredients_mentioned: JSON.stringify(["Laser (silphium)", "Poivre", "Cumin", "Coriandre", "Menthe", "Rue", "Livèche", "Origan", "Garum"]),
      references: JSON.stringify([
        { author: "Apicius", year: 400, title: "De Re Coquinaria" },
        { author: "Grocock, Christopher & Grainger, Sally", year: 2006, title: "Apicius: A Critical Edition", publisher: "Prospect Books" }
      ]),
    },
    // DÉCOUVERTES ARCHÉOLOGIQUES
    {
      title: "Parfums de la tombe de Toutânkhamon",
      type: "archaeological",
      civilization: "Égypte",
      date_created: "1323 av. J.-C.",
      date_start: -1323,
      date_end: -1323,
      description: "Vases à parfum et résidus d'onguents découverts dans la tombe de Toutânkhamon par Howard Carter en 1922. Analyses chimiques modernes ont identifié des traces de myrrhe, d'encens et d'huiles végétales. Les parfums étaient destinés à accompagner le pharaon dans l'au-delà.",
      provenance: "Vallée des Rois, Thèbes, Égypte. Découverte en 1922. Objets conservés au Musée égyptien du Caire.",
      authenticity_level: "confirmed",
      olfactive_notes: "Myrrhe, encens, huile de moringa, résines diverses",
      ingredients_mentioned: JSON.stringify(["Myrrhe", "Encens", "Huile de moringa", "Huile de ricin", "Résine de pistachier", "Cire d'abeille"]),
      references: JSON.stringify([
        { author: "Carter, Howard", year: 1923, title: "The Tomb of Tutankhamun" },
        { author: "Buckley, Stephen & Evershed, Richard", year: 2001, title: "Organic chemistry of embalming agents in Pharaonic and Graeco-Roman mummies", url: "https://www.nature.com/articles/35065549" }
      ]),
    },
    {
      title: "Unguentarium de Pompéi",
      type: "archaeological",
      civilization: "Rome",
      date_created: "79 ap. J.-C.",
      date_start: 79,
      date_end: 79,
      description: "Boutique de parfumeur (unguentarium) découverte à Pompéi, préservée par l'éruption du Vésuve. Contient des flacons, des amphores et des résidus de parfums. Témoignage unique de l'industrie parfumière romaine.",
      provenance: "Pompéi, Italie. Fouilles archéologiques depuis le 18e siècle.",
      authenticity_level: "confirmed",
      olfactive_notes: "Huile d'olive parfumée, rose, iris, nard",
      ingredients_mentioned: JSON.stringify(["Huile d'olive", "Rose", "Iris", "Nard", "Safran", "Myrrhe"]),
      references: JSON.stringify([
        { author: "Brun, Jean-Pierre", year: 2000, title: "The Production of Perfumes in Antiquity: The Cases of Delos and Paestum", url: "https://www.jstor.org/stable/505996" },
        { author: "Mattingly, David", year: 1990, title: "Paintings, Presses and Perfume Production at Pompeii" }
      ]),
    },
    {
      title: "Résidus d'encens de Qumrân",
      type: "archaeological",
      civilization: "Judée",
      date_created: "100 av. J.-C. - 70 ap. J.-C.",
      date_start: -100,
      date_end: 70,
      description: "Résidus d'encens et de substances aromatiques découverts dans les grottes de Qumrân, associés aux manuscrits de la mer Morte. Témoignent des pratiques rituelles de la communauté essénienne.",
      provenance: "Grottes de Qumrân, près de la mer Morte, Israël. Découvertes à partir de 1947.",
      authenticity_level: "probable",
      olfactive_notes: "Encens, myrrhe, substances balsamiques",
      ingredients_mentioned: JSON.stringify(["Encens", "Myrrhe", "Baume de Judée"]),
      references: JSON.stringify([
        { author: "Patrich, Joseph", year: 1994, title: "Qumran Cave 4 and the Copper Scroll" },
        { author: "Zias, Joseph", year: 1993, title: "Cannabis sativa (Hashish) as an Effective Medication in Antiquity" }
      ]),
    },
    // MANUSCRITS INDIENS
    {
      title: "Charaka Samhita",
      type: "manuscript",
      civilization: "Inde",
      date_created: "200 av. J.-C.",
      date_start: -200,
      date_end: -200,
      description: "Traité fondamental de l'Ayurveda, décrivant l'utilisation des plantes aromatiques dans la médecine traditionnelle indienne. Mentionne le guggul (myrrhe indienne), le santal, le vétiver et de nombreuses épices dans les préparations médicinales.",
      provenance: "Inde ancienne. Attribué au sage Charaka. Transmis oralement puis écrit.",
      authenticity_level: "confirmed",
      olfactive_notes: "Santal, vétiver, guggul, cardamome, curcuma, gingembre",
      ingredients_mentioned: JSON.stringify(["Guggul", "Santal", "Vétiver", "Cardamome", "Curcuma", "Gingembre", "Poivre long", "Clou de girofle", "Camphre"]),
      references: JSON.stringify([
        { author: "Sharma, P.V.", year: 1981, title: "Charaka Samhita: Text with English Translation", publisher: "Chaukhambha Orientalia" }
      ]),
    },
    {
      title: "Sushruta Samhita",
      type: "manuscript",
      civilization: "Inde",
      date_created: "600 av. J.-C.",
      date_start: -600,
      date_end: -600,
      description: "Traité chirurgical indien ancien, contenant des sections sur les plantes aromatiques utilisées en médecine. Décrit l'utilisation des huiles parfumées dans les soins post-opératoires et la cicatrisation.",
      provenance: "Inde ancienne. Attribué au sage Sushruta.",
      authenticity_level: "confirmed",
      olfactive_notes: "Huiles médicinales parfumées, sésame, moutarde, plantes aromatiques",
      ingredients_mentioned: JSON.stringify(["Huile de sésame", "Guggul", "Neem", "Curcuma", "Santal", "Camphre"]),
      references: JSON.stringify([
        { author: "Bhishagratna, K.K.", year: 1907, title: "An English Translation of the Sushruta Samhita" }
      ]),
    },
    // MANUSCRITS ARABES
    {
      title: "Kitab al-Tibb (Canon de la médecine)",
      type: "manuscript",
      civilization: "Arabie",
      date_created: "1025 ap. J.-C.",
      date_start: 1025,
      date_end: 1025,
      description: "Encyclopédie médicale d'Avicenne (Ibn Sina), référence majeure de la médecine médiévale. Décrit en détail les propriétés des aromates et leur utilisation thérapeutique. Inclut des sections sur la distillation et l'extraction des huiles essentielles.",
      provenance: "Écrit par Ibn Sina (Avicenne) en Perse. Traduit en latin au 12e siècle.",
      authenticity_level: "confirmed",
      olfactive_notes: "Rose, musc, ambre, camphre, oud, encens",
      ingredients_mentioned: JSON.stringify(["Rose", "Musc", "Ambre gris", "Camphre", "Oud", "Encens", "Myrrhe", "Safran", "Santal"]),
      references: JSON.stringify([
        { author: "Ibn Sina (Avicenne)", year: 1025, title: "Al-Qanun fi al-Tibb (Canon de la médecine)" },
        { author: "Gruner, O.C.", year: 1930, title: "A Treatise on the Canon of Medicine of Avicenna" }
      ]),
    },
    {
      title: "Kitab Kimiya al-'Itr (Livre de la chimie des parfums)",
      type: "formula",
      civilization: "Arabie",
      date_created: "800 ap. J.-C.",
      date_start: 800,
      date_end: 900,
      description: "Traité attribué à Al-Kindi sur la fabrication des parfums et la distillation. Contient plus de 100 recettes de parfums et décrit les techniques de distillation à l'alambic. L'un des premiers traités systématiques de parfumerie.",
      provenance: "Bagdad, époque abbasside. Attribué à Al-Kindi (801-873).",
      authenticity_level: "probable",
      olfactive_notes: "Musc, ambre, rose, oud, camphre, safran",
      ingredients_mentioned: JSON.stringify(["Musc", "Ambre gris", "Rose", "Oud", "Camphre", "Safran", "Santal", "Encens", "Civette"]),
      references: JSON.stringify([
        { author: "Al-Kindi", year: 850, title: "Kitab Kimiya al-'Itr wa al-Tas'idat" },
        { author: "Levey, Martin", year: 1973, title: "Early Arabic Pharmacology", publisher: "E.J. Brill" }
      ]),
    },
    // ILLUSTRATIONS BOTANIQUES
    {
      title: "Codex Vindobonensis (Dioscoride de Vienne)",
      type: "botanical_illustration",
      civilization: "Byzantin",
      date_created: "512 ap. J.-C.",
      date_start: 512,
      date_end: 512,
      description: "Manuscrit enluminé du De Materia Medica de Dioscoride, contenant plus de 400 illustrations botaniques. L'un des plus anciens herbiers illustrés conservés. Les plantes aromatiques sont représentées avec un grand souci du détail.",
      provenance: "Constantinople. Créé pour la princesse Anicia Juliana. Conservé à la Bibliothèque nationale d'Autriche, Vienne.",
      authenticity_level: "confirmed",
      olfactive_notes: "Illustrations de plantes aromatiques avec descriptions olfactives",
      ingredients_mentioned: JSON.stringify(["Myrrhe", "Encens", "Nard", "Iris", "Rose", "Safran", "Cannelle"]),
      references: JSON.stringify([
        { author: "Mazal, Otto", year: 1998, title: "Der Wiener Dioskurides", publisher: "Akademische Druck" }
      ]),
    },
    {
      title: "Tacuinum Sanitatis",
      type: "botanical_illustration",
      civilization: "Médiéval",
      date_created: "1380 ap. J.-C.",
      date_start: 1380,
      date_end: 1400,
      description: "Manuel de santé médiéval illustré, basé sur un traité arabe du 11e siècle. Contient des illustrations de plantes aromatiques et d'épices avec leurs propriétés médicinales et leurs usages culinaires.",
      provenance: "Italie du Nord (Lombardie). Plusieurs versions manuscrites conservées.",
      authenticity_level: "confirmed",
      olfactive_notes: "Épices, herbes aromatiques, fleurs parfumées",
      ingredients_mentioned: JSON.stringify(["Rose", "Violette", "Musc", "Ambre", "Cannelle", "Gingembre", "Poivre", "Safran", "Camomille"]),
      references: JSON.stringify([
        { author: "Ibn Butlan", year: 1050, title: "Taqwim al-Sihha (original arabe)" },
        { author: "Cogliati Arano, Luisa", year: 1976, title: "The Medieval Health Handbook: Tacuinum Sanitatis" }
      ]),
    },
  ];

  // ============================================================================
  // IMPORT DES ARCHIVES
  // ============================================================================
  console.log("\n📜 Import des archives olfactives...");
  
  let imported = 0;
  let updated = 0;
  let errors = 0;

  for (const archive of olfactiveArchives) {
    try {
      // Vérifier si l'archive existe déjà
      const [existing] = await connection.execute(
        "SELECT id FROM olfactive_archives WHERE title = ? AND civilization = ? LIMIT 1",
        [archive.title, archive.civilization]
      );
      
      if (existing.length > 0) {
        // Mettre à jour l'archive existante
        await connection.execute(
          `UPDATE olfactive_archives SET 
           description = ?, provenance = ?, authenticity_level = ?,
           olfactive_notes = ?, ingredients_mentioned = ?, \`references\` = ?
           WHERE id = ?`,
          [archive.description, archive.provenance, archive.authenticity_level,
           archive.olfactive_notes, archive.ingredients_mentioned, archive.references,
           existing[0].id]
        );
        console.log(`  🔄 ${archive.title} mis à jour`);
        updated++;
        continue;
      }
      
      await connection.execute(
        `INSERT INTO olfactive_archives 
         (title, type, civilization, date_created, date_start, date_end,
          description, provenance, authenticity_level, olfactive_notes,
          ingredients_mentioned, \`references\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [archive.title, archive.type, archive.civilization, archive.date_created,
         archive.date_start, archive.date_end, archive.description, archive.provenance,
         archive.authenticity_level, archive.olfactive_notes, archive.ingredients_mentioned,
         archive.references]
      );
      console.log(`  ✅ ${archive.title} importé`);
      imported++;
    } catch (error) {
      console.error(`  ❌ Erreur pour ${archive.title}:`, error.message);
      errors++;
    }
  }

  // ============================================================================
  // RÉSUMÉ
  // ============================================================================
  console.log("\n" + "=".repeat(60));
  console.log("📊 RÉSUMÉ DE L'IMPORT DES ARCHIVES OLFACTIVES");
  console.log("=".repeat(60));
  console.log(`  Total archives traitées : ${olfactiveArchives.length}`);
  console.log(`  Importées : ${imported}`);
  console.log(`  Mises à jour : ${updated}`);
  console.log(`  Erreurs : ${errors}`);
  console.log("");
  console.log("  📚 Types d'archives :");
  const typeCounts = {};
  olfactiveArchives.forEach(a => {
    typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
  });
  const typeLabels = {
    manuscript: "Manuscrits",
    formula: "Formules",
    archaeological: "Archéologie",
    botanical_illustration: "Illustrations"
  };
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`    ${typeLabels[type] || type}: ${count}`);
  });
  console.log("");
  console.log("  🌍 Civilisations :");
  const civCounts = {};
  olfactiveArchives.forEach(a => {
    civCounts[a.civilization] = (civCounts[a.civilization] || 0) + 1;
  });
  Object.entries(civCounts).sort((a, b) => b[1] - a[1]).forEach(([civ, count]) => {
    console.log(`    ${civ}: ${count}`);
  });
  console.log("=".repeat(60));

  await connection.end();
  console.log("\n✅ Import terminé avec succès !");
}

main().catch(console.error);
