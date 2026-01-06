/**
 * PERFUMUM - Import des archives olfactives
 * Jour 7 de la roadmap : Manuscrits, formules anciennes et découvertes archéologiques
 */

import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);

  console.log("📜 Import des archives olfactives - PERFUMUM");
  console.log("=".repeat(60));

  // Structure correcte de la table: title, type, date_created, civilization, description, provenance, authenticity_level, references
  const olfactiveArchives = [
    {
      title: "Papyrus Ebers",
      type: "manuscript",
      civilization: "Égypte",
      date_created: "1550 av. J.-C.",
      description: "Le plus ancien traité médical connu, contenant plus de 700 formules et remèdes. Mentionne l'utilisation de la myrrhe, de l'encens, du lotus et de nombreuses plantes aromatiques dans les préparations médicinales et rituelles.",
      provenance: "Thèbes, Égypte. Découvert en 1862 par Edwin Smith, acquis par Georg Ebers en 1873. Conservé à la Bibliothèque universitaire de Leipzig.",
      authenticity_level: "confirmed",
      references: JSON.stringify([
        { title: "Papyros Ebers: Das hermetische Buch über die Arzneimittel der alten Ägypter", author: "Ebers, Georg", year: 1875, type: "book" },
        { title: "Ancient Egyptian Medicine", author: "Nunn, John F.", year: 1996, type: "book" }
      ]),
    },
    {
      title: "Recette du Kyphi",
      type: "formula",
      civilization: "Égypte",
      date_created: "1500 av. J.-C. - 300 ap. J.-C.",
      description: "Le Kyphi (kapet en égyptien) était le parfum sacré par excellence de l'Égypte ancienne. Brûlé au coucher du soleil dans les temples, il était censé apaiser les dieux et purifier l'air. Plusieurs versions de la recette existent, mentionnant 10 à 16 ingrédients : myrrhe, encens, mastic, genévrier, calamus, cannelle, cardamome, safran, miel, vin, raisins secs.",
      provenance: "Inscriptions des temples d'Edfou et de Philae. Descriptions par Plutarque et Dioscoride.",
      authenticity_level: "confirmed",
      references: JSON.stringify([
        { title: "Isis et Osiris", author: "Plutarque", year: 100, type: "treatise" },
        { title: "De Materia Medica, Livre I", author: "Dioscoride", year: 70, type: "treatise" },
        { title: "Sacred Luxuries: Fragrance, Aromatherapy, and Cosmetics in Ancient Egypt", author: "Manniche, Lise", year: 1999, type: "book" }
      ]),
    },
    {
      title: "Huile de Metopion",
      type: "formula",
      civilization: "Égypte",
      date_created: "1200 av. J.-C.",
      description: "Huile parfumée égyptienne à base d'amande amère et de galbanum, mentionnée par Théophraste et Pline. Utilisée pour les soins du corps et les rituels funéraires. L'une des premières huiles parfumées commercialisées à grande échelle.",
      provenance: "Textes égyptiens et grecs. Résidus trouvés dans des vases canopes.",
      authenticity_level: "probable",
      references: JSON.stringify([
        { title: "De Odoribus (Sur les odeurs)", author: "Théophraste", year: -300, type: "treatise" },
        { title: "Histoire naturelle, Livre XIII", author: "Pline l'Ancien", year: 77, type: "encyclopedia" }
      ]),
    },
    {
      title: "De Materia Medica",
      type: "manuscript",
      civilization: "Grèce",
      date_created: "70 ap. J.-C.",
      description: "Encyclopédie pharmaceutique de Dioscoride décrivant plus de 600 plantes médicinales et aromatiques. Référence majeure pendant 1500 ans, elle détaille les propriétés, les usages et les méthodes de préparation des aromates. Inclut des descriptions détaillées de la myrrhe, de l'encens, du nard et du silphium.",
      provenance: "Écrit par Pedanius Dioscoride, médecin grec de l'armée romaine. Nombreuses copies médiévales, dont le Codex Vindobonensis (512 ap. J.-C.).",
      authenticity_level: "confirmed",
      references: JSON.stringify([
        { title: "De Materia Medica", author: "Dioscoride", year: 70, type: "treatise" },
        { title: "Dioscorides on Pharmacy and Medicine", author: "Riddle, John M.", year: 1985, type: "book" }
      ]),
    },
    {
      title: "De Odoribus (Sur les odeurs)",
      type: "manuscript",
      civilization: "Grèce",
      date_created: "300 av. J.-C.",
      description: "Traité de Théophraste sur les parfums et les odeurs, le plus ancien ouvrage consacré spécifiquement à la parfumerie. Décrit les techniques d'extraction, les mélanges et les propriétés des aromates. Distingue les parfums simples des composés.",
      provenance: "Écrit par Théophraste, successeur d'Aristote au Lycée d'Athènes.",
      authenticity_level: "confirmed",
      references: JSON.stringify([
        { title: "De Odoribus", author: "Théophraste", year: -300, type: "treatise" },
        { title: "Theophrastus: De Causis Plantarum", author: "Einarson, Benedict & Link, George K.K.", year: 1990, type: "book" }
      ]),
    },
    {
      title: "Histoire naturelle - Livres XII-XIII",
      type: "manuscript",
      civilization: "Rome",
      date_created: "77 ap. J.-C.",
      description: "Les livres XII et XIII de l'encyclopédie de Pline l'Ancien sont consacrés aux arbres exotiques et aux parfums. Ils décrivent en détail le commerce de l'encens et de la myrrhe, la Route de l'encens, et les techniques de parfumerie romaine. Source majeure sur le silphium disparu.",
      provenance: "Écrit par Pline l'Ancien, naturaliste romain. Dédié à l'empereur Titus.",
      authenticity_level: "confirmed",
      references: JSON.stringify([
        { title: "Naturalis Historia", author: "Pline l'Ancien", year: 77, type: "encyclopedia" },
        { title: "Dangerous Tastes: The Story of Spices", author: "Dalby, Andrew", year: 2000, type: "book" }
      ]),
    },
    {
      title: "De Re Coquinaria (Apicius)",
      type: "formula",
      civilization: "Rome",
      date_created: "400 ap. J.-C.",
      description: "Recueil de recettes romaines attribué à Apicius, contenant de nombreuses préparations aromatiques. Mentionne l'utilisation du laser (silphium ou son substitut) et de nombreuses épices dans la cuisine romaine de luxe.",
      provenance: "Compilation de recettes romaines, probablement du 4e siècle. Manuscrits médiévaux conservés.",
      authenticity_level: "probable",
      references: JSON.stringify([
        { title: "De Re Coquinaria", author: "Apicius", year: 400, type: "cookbook" },
        { title: "Apicius: A Critical Edition", author: "Grocock, Christopher & Grainger, Sally", year: 2006, type: "book" }
      ]),
    },
    {
      title: "Parfums de la tombe de Toutânkhamon",
      type: "archaeological",
      civilization: "Égypte",
      date_created: "1323 av. J.-C.",
      description: "Vases à parfum et résidus d'onguents découverts dans la tombe de Toutânkhamon par Howard Carter en 1922. Analyses chimiques modernes ont identifié des traces de myrrhe, d'encens et d'huiles végétales. Les parfums étaient destinés à accompagner le pharaon dans l'au-delà.",
      provenance: "Vallée des Rois, Thèbes, Égypte. Découverte en 1922. Objets conservés au Musée égyptien du Caire.",
      authenticity_level: "confirmed",
      references: JSON.stringify([
        { title: "The Tomb of Tutankhamun", author: "Carter, Howard", year: 1923, type: "book" },
        { title: "Organic chemistry of embalming agents in Pharaonic and Graeco-Roman mummies", author: "Buckley, Stephen & Evershed, Richard", year: 2001, type: "article", url: "https://www.nature.com/articles/35065549" }
      ]),
    },
    {
      title: "Unguentarium de Pompéi",
      type: "archaeological",
      civilization: "Rome",
      date_created: "79 ap. J.-C.",
      description: "Boutique de parfumeur (unguentarium) découverte à Pompéi, préservée par l'éruption du Vésuve. Contient des flacons, des amphores et des résidus de parfums. Témoignage unique de l'industrie parfumière romaine.",
      provenance: "Pompéi, Italie. Fouilles archéologiques depuis le 18e siècle.",
      authenticity_level: "confirmed",
      references: JSON.stringify([
        { title: "The Production of Perfumes in Antiquity: The Cases of Delos and Paestum", author: "Brun, Jean-Pierre", year: 2000, type: "article", url: "https://www.jstor.org/stable/505996" },
        { title: "Paintings, Presses and Perfume Production at Pompeii", author: "Mattingly, David", year: 1990, type: "article" }
      ]),
    },
    {
      title: "Résidus d'encens de Qumrân",
      type: "archaeological",
      civilization: "Judée",
      date_created: "100 av. J.-C. - 70 ap. J.-C.",
      description: "Résidus d'encens et de substances aromatiques découverts dans les grottes de Qumrân, associés aux manuscrits de la mer Morte. Témoignent des pratiques rituelles de la communauté essénienne.",
      provenance: "Grottes de Qumrân, près de la mer Morte, Israël. Découvertes à partir de 1947.",
      authenticity_level: "probable",
      references: JSON.stringify([
        { title: "Qumran Cave 4 and the Copper Scroll", author: "Patrich, Joseph", year: 1994, type: "article" }
      ]),
    },
    {
      title: "Charaka Samhita",
      type: "manuscript",
      civilization: "Inde",
      date_created: "200 av. J.-C.",
      description: "Traité fondamental de l'Ayurveda, décrivant l'utilisation des plantes aromatiques dans la médecine traditionnelle indienne. Mentionne le guggul (myrrhe indienne), le santal, le vétiver et de nombreuses épices dans les préparations médicinales.",
      provenance: "Inde ancienne. Attribué au sage Charaka. Transmis oralement puis écrit.",
      authenticity_level: "confirmed",
      references: JSON.stringify([
        { title: "Charaka Samhita: Text with English Translation", author: "Sharma, P.V.", year: 1981, type: "book" }
      ]),
    },
    {
      title: "Sushruta Samhita",
      type: "manuscript",
      civilization: "Inde",
      date_created: "600 av. J.-C.",
      description: "Traité chirurgical indien ancien, contenant des sections sur les plantes aromatiques utilisées en médecine. Décrit l'utilisation des huiles parfumées dans les soins post-opératoires et la cicatrisation.",
      provenance: "Inde ancienne. Attribué au sage Sushruta.",
      authenticity_level: "confirmed",
      references: JSON.stringify([
        { title: "An English Translation of the Sushruta Samhita", author: "Bhishagratna, K.K.", year: 1907, type: "book" }
      ]),
    },
    {
      title: "Kitab al-Tibb (Canon de la médecine)",
      type: "manuscript",
      civilization: "Arabie",
      date_created: "1025 ap. J.-C.",
      description: "Encyclopédie médicale d'Avicenne (Ibn Sina), référence majeure de la médecine médiévale. Décrit en détail les propriétés des aromates et leur utilisation thérapeutique. Inclut des sections sur la distillation et l'extraction des huiles essentielles.",
      provenance: "Écrit par Ibn Sina (Avicenne) en Perse. Traduit en latin au 12e siècle.",
      authenticity_level: "confirmed",
      references: JSON.stringify([
        { title: "Al-Qanun fi al-Tibb (Canon de la médecine)", author: "Ibn Sina (Avicenne)", year: 1025, type: "treatise" },
        { title: "A Treatise on the Canon of Medicine of Avicenna", author: "Gruner, O.C.", year: 1930, type: "book" }
      ]),
    },
    {
      title: "Kitab Kimiya al-'Itr (Livre de la chimie des parfums)",
      type: "formula",
      civilization: "Arabie",
      date_created: "850 ap. J.-C.",
      description: "Traité attribué à Al-Kindi sur la fabrication des parfums et la distillation. Contient plus de 100 recettes de parfums et décrit les techniques de distillation à l'alambic. L'un des premiers traités systématiques de parfumerie.",
      provenance: "Bagdad, époque abbasside. Attribué à Al-Kindi (801-873).",
      authenticity_level: "probable",
      references: JSON.stringify([
        { title: "Kitab Kimiya al-'Itr wa al-Tas'idat", author: "Al-Kindi", year: 850, type: "treatise" },
        { title: "Early Arabic Pharmacology", author: "Levey, Martin", year: 1973, type: "book" }
      ]),
    },
    {
      title: "Codex Vindobonensis (Dioscoride de Vienne)",
      type: "botanical_illustration",
      civilization: "Byzantin",
      date_created: "512 ap. J.-C.",
      description: "Manuscrit enluminé du De Materia Medica de Dioscoride, contenant plus de 400 illustrations botaniques. L'un des plus anciens herbiers illustrés conservés. Les plantes aromatiques sont représentées avec un grand souci du détail.",
      provenance: "Constantinople. Créé pour la princesse Anicia Juliana. Conservé à la Bibliothèque nationale d'Autriche, Vienne.",
      authenticity_level: "confirmed",
      references: JSON.stringify([
        { title: "Der Wiener Dioskurides", author: "Mazal, Otto", year: 1998, type: "book" }
      ]),
    },
    {
      title: "Tacuinum Sanitatis",
      type: "botanical_illustration",
      civilization: "Médiéval",
      date_created: "1380 ap. J.-C.",
      description: "Manuel de santé médiéval illustré, basé sur un traité arabe du 11e siècle. Contient des illustrations de plantes aromatiques et d'épices avec leurs propriétés médicinales et leurs usages culinaires.",
      provenance: "Italie du Nord (Lombardie). Plusieurs versions manuscrites conservées.",
      authenticity_level: "confirmed",
      references: JSON.stringify([
        { title: "Taqwim al-Sihha (original arabe)", author: "Ibn Butlan", year: 1050, type: "treatise" },
        { title: "The Medieval Health Handbook: Tacuinum Sanitatis", author: "Cogliati Arano, Luisa", year: 1976, type: "book" }
      ]),
    },
  ];

  console.log("\n📜 Import des archives olfactives...");
  
  let imported = 0;
  let updated = 0;
  let errors = 0;

  for (const archive of olfactiveArchives) {
    try {
      const [existing] = await connection.execute(
        "SELECT id FROM olfactive_archives WHERE title = ? AND civilization = ? LIMIT 1",
        [archive.title, archive.civilization]
      );
      
      if (existing.length > 0) {
        await connection.execute(
          `UPDATE olfactive_archives SET 
           description = ?, provenance = ?, authenticity_level = ?, \`references\` = ?
           WHERE id = ?`,
          [archive.description, archive.provenance, archive.authenticity_level, archive.references, existing[0].id]
        );
        console.log(`  🔄 ${archive.title} mis à jour`);
        updated++;
        continue;
      }
      
      await connection.execute(
        `INSERT INTO olfactive_archives 
         (title, type, civilization, date_created, description, provenance, authenticity_level, \`references\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [archive.title, archive.type, archive.civilization, archive.date_created,
         archive.description, archive.provenance, archive.authenticity_level, archive.references]
      );
      console.log(`  ✅ ${archive.title} importé`);
      imported++;
    } catch (error) {
      console.error(`  ❌ Erreur pour ${archive.title}:`, error.message);
      errors++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 RÉSUMÉ DE L'IMPORT DES ARCHIVES OLFACTIVES");
  console.log("=".repeat(60));
  console.log(`  Total archives traitées : ${olfactiveArchives.length}`);
  console.log(`  Importées : ${imported}`);
  console.log(`  Mises à jour : ${updated}`);
  console.log(`  Erreurs : ${errors}`);
  console.log("=".repeat(60));

  await connection.end();
  console.log("\n✅ Import terminé avec succès !");
}

main().catch(console.error);
