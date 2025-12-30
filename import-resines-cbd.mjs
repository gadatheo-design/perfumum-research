import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema.js";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

const resinesCBD = [
  {
    name: "Mastiha Brut",
    category: "resine_cbd",
    formula: "Tête: Zeste citron vert 0.2%, Laurier séché 0.1% | Cœur: Mastiha fondue 0.8%, Cardamome verte 0.2% | Fond: Santal 0.5%, Benjoin 0.2%",
    protocol: "Ramollir la mastiha séparément au bain-marie, l'émulsionner dans 5 mL d'huile tiède avec les infusions de zestes et d'épices, filtrer, incorporer dans 100 g de hash, malaxer et curer 8 jours.",
    description: "Résine verte, citronnée, balsamique. Notes fraîches et aromatiques sèches.",
    ingredients: "Mastiha, citron vert, laurier, cardamome, santal, benjoin",
    intensity: 20, // 2.0% * 10 pour stockage en int
    texture: "résineuse",
    stability: "high",
    maturationTime: 8,
    notes: "Collection Classique - Résines du Levant. Hash résineux/poivré recommandé. Effet énergique, ambré."
  },
  {
    name: "Vétiver Labdanum",
    category: "resine_cbd",
    formula: "Tête: Orange amère (zeste) 0.3%, Poivre rose 0.1% | Cœur: Labdanum 0.8%, Patchouli 0.2% | Fond: Vétiver 0.5%, Vanille 0.3%",
    protocol: "Infuser les zestes et poivre dans huile MCT 24 h ; fondre labdanum + patchouli ; combiner, filtrer, incorporer lentement. Cure 10 jours.",
    description: "Ambré, cuiré, terreux. Fumé sec avec douceur vanillée.",
    ingredients: "Labdanum, vétiver, patchouli, orange amère, poivre rose, vanille",
    intensity: 22, // 2.2%
    texture: "dense",
    stability: "high",
    maturationTime: 10,
    notes: "Collection Classique - Résines du Levant. Hash brun dense/terreux recommandé. Profond, méditatif."
  },
  {
    name: "Figue & Santal Blanc",
    category: "resine_cbd",
    formula: "Tête: Bergamote (zeste) 0.3%, Feuille de figuier séchée 0.1% | Cœur: Santal blanc 0.6%, Mastiha 0.2% | Fond: Vanille 0.4%, Labdanum 0.3%",
    protocol: "Infuser les feuilles + zeste dans huile neutre ; ajouter la vanille chauffée ; incorporer santal + mastiha ; curing 7 jours.",
    description: "Crémeux, vert lacté, sucré chaud. Accord figuier avec fond ambré doux.",
    ingredients: "Santal blanc, feuille de figuier, bergamote, mastiha, vanille, labdanum",
    intensity: 19, // 1.9%
    texture: "crémeuse",
    stability: "high",
    maturationTime: 7,
    notes: "Collection Classique - Résines du Levant. Hash blond clair/floral recommandé. Doux, élégant, haut de gamme."
  },
  {
    name: "Noir de Myrrhe",
    category: "resine_cbd",
    formula: "Tête: Cardamome noire 0.1%, Citron confit (écorce) 0.2% | Cœur: Myrrhe 0.8%, Benjoin 0.3% | Fond: Labdanum 0.4%, Cèdre atlas 0.2%",
    protocol: "Fondre myrrhe + benjoin + labdanum ensemble (60 °C). Ajouter l'infusion citron/cardamome, filtrer, malaxer dans hash tiède, reposer 9 jours.",
    description: "Résine profonde, balsamique, ambrée. Note fumée épicée avec fond sec boisé.",
    ingredients: "Myrrhe, benjoin, labdanum, cèdre atlas, cardamome noire, citron confit",
    intensity: 20, // 2.0%
    texture: "résineuse",
    stability: "high",
    maturationTime: 9,
    notes: "Collection Classique - Résines du Levant. Hash brun dense/terreux recommandé. Profond, méditatif."
  },
  {
    name: "Cuir d'Ambre",
    category: "resine_cbd",
    formula: "Tête: Mandarine rouge 0.3%, Feuille de tabac 0.2% | Cœur: Labdanum 0.7%, Benjoin 0.5% | Fond: Vanille 0.3%, Tonka râpée 0.2%",
    protocol: "Infuser tabac + mandarine ; fondre labdanum/benjoin/vanille ; mélanger à tiède ; curing 10 jours.",
    description: "Ambré, suave, gourmand. Cuir doux avec agrume chaud et amertume tabac.",
    ingredients: "Labdanum, benjoin, vanille, tonka, mandarine, tabac",
    intensity: 22, // 2.2%
    texture: "suave",
    stability: "high",
    maturationTime: 10,
    notes: "Collection Classique - Résines du Levant. Hash résineux/poivré recommandé. Énergique, ambré."
  },
  {
    name: "Sève Noire / Feuillage Mort",
    category: "resine_cbd",
    formula: "Tête: Feuille de noisetier + sauge (infusion) 0.3%, Cacao brut 0.2% | Cœur: Racine d'angélique 0.4%, Cypriol 0.3% | Fond: Vétiver + Labdanum + trace goudron bouleau 0.8%",
    protocol: "Infuser feuilles + cacao dans huile 24 h. Chauffer légèrement Cypriol + Labdanum ; combiner. Cure lente 14 jours.",
    description: "Terre humide, poudré amer, racinaire. Cuir et sous-bois.",
    ingredients: "Vétiver, labdanum, cypriol, angélique, cacao, noisetier, sauge, goudron bouleau",
    intensity: 20, // 2.0%
    texture: "terreuse",
    stability: "medium",
    maturationTime: 14,
    notes: "Collection Expérimentale - Matériaux Impossibles. Hash brun dense/terreux recommandé. Profond, méditatif."
  },
  {
    name: "Métal Liquide",
    category: "resine_cbd",
    formula: "Tête: Galbanum + pamplemousse 0.4%, Poivre blanc 0.1% | Cœur: Iris + violette (infusion) 0.4% | Fond: Ambrette 0.3%, Clou de girofle (trace) 0.1%",
    protocol: "Macérer violette/iris ; distiller léger. Mélanger galbanum/pamplemousse ; ajouter à hash tiède, 6 jours de maturation.",
    description: "Vert métallique, poudré froid, musc végétal. Étincelle métallique.",
    ingredients: "Galbanum, pamplemousse, iris, violette, ambrette, poivre blanc, girofle",
    intensity: 13, // 1.3%
    texture: "légère",
    stability: "medium",
    maturationTime: 6,
    notes: "Collection Expérimentale - Matériaux Impossibles. Hash expérimental/minéral recommandé. Clair, high-tech, rare."
  },
  {
    name: "Feu Fumé / Soufre Doux",
    category: "resine_cbd",
    formula: "Tête: Mandarine verte 0.3%, Piment doux (trace) 0.05% | Cœur: Encens oliban 0.6%, Miel 0.3% | Fond: Myrrhe + ambre + charbon fin 0.8%",
    protocol: "Faire fondre oliban + myrrhe au bain-marie avec miel. Ajouter infusion mandarine/piment. Malaxer et laisser stabiliser 8 jours.",
    description: "Fumé clair, suave, chaleur douce. Fumée noire avec agrume frais.",
    ingredients: "Encens oliban, myrrhe, ambre, miel, mandarine, piment, charbon",
    intensity: 21, // 2.05%
    texture: "fumée",
    stability: "high",
    maturationTime: 8,
    notes: "Collection Expérimentale - Matériaux Impossibles. Hash résineux/poivré recommandé. Énergique, ambré."
  },
  {
    name: "Orchidée Salée",
    category: "resine_cbd",
    formula: "Tête: Yuzu (zeste) + fleur de sel 0.3%, Menthe bergamote 0.2% | Cœur: Ylang-ylang + Vanille 0.4% | Fond: Santal + mousse de chêne + labdanum clair 0.6%",
    protocol: "Faire infusion yuzu/sel dans huile ; ajouter ylang et santal tièdes ; incorporer à hash blond ; maturation 7 jours.",
    description: "Salé, frais, aromatique. Floral lacté avec fond marin boisé.",
    ingredients: "Yuzu, fleur de sel, menthe bergamote, ylang-ylang, vanille, santal, mousse de chêne, labdanum",
    intensity: 15, // 1.5%
    texture: "légère",
    stability: "medium",
    maturationTime: 7,
    notes: "Collection Expérimentale - Matériaux Impossibles. Hash blond clair/floral recommandé. Doux, élégant, haut de gamme."
  },
  {
    name: "Distillat de Nuit / Morphée",
    category: "resine_cbd",
    formula: "Tête: Cardamome + bergamote 0.3% | Cœur: Jasmin + Damiana + Mélisse (infusion) 0.8% | Fond: Labdanum + Santal + Benjoin + Vanille 1.2%",
    protocol: "Infuser damiana/mélisse/jasmin 24 h ; fondre résines avec vanille ; filtrer ; mélanger à hash tiède ; cure 10 jours à l'abri de la lumière.",
    description: "Hypnotique floral, chaud, narcotique. Éveil doux avec fond balsamique profond.",
    ingredients: "Jasmin, damiana, mélisse, labdanum, santal, benjoin, vanille, cardamome, bergamote",
    intensity: 23, // 2.3%
    texture: "dense",
    stability: "high",
    maturationTime: 10,
    notes: "Collection Expérimentale - Matériaux Impossibles. Hash blond clair/floral recommandé. Doux, élégant, haut de gamme."
  }
];

console.log(`Importing ${resinesCBD.length} résines CBD...`);

for (const recette of resinesCBD) {
  await db.insert(schema.recettes).values(recette);
  console.log(`✓ Imported: ${recette.name}`);
}

console.log("\n✓ All résines CBD imported successfully!");

await connection.end();
