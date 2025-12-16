#!/usr/bin/env node
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log("🜂 Import des tabacs alchimiques...\n");

const tobaccoFormulasData = [
  {
    code: "🜂",
    name: "PHILOSOPHALE",
    olfactiveFamily: "Ambrée cuirée, balsamique et méditative",
    inspiration: "Une bibliothèque chaude, du cuir patiné et de la fumée de benjoin.",
    composition: JSON.stringify([
      { element: "Tabac Kentucky air-cured", matiere: "Base sombre, corsée", ratio: "60 g" },
      { element: "Tabac oriental Izmir", matiere: "Élasticité et floralité", ratio: "30 g" },
      { element: "Thé noir Lapsang Souchong", matiere: "Équilibre fumé", ratio: "5 g" },
      { element: "Bois de cèdre râpé fin", matiere: "Séchage et tenue", ratio: "2 g" },
      { element: "Extraction hybride", matiere: "labdanum, vétiver, benjoin, tonka - MCT 2%", ratio: "3 g (≈ 2 mL)" }
    ]),
    procedure: "Extraction éthanolique 48 h à 25 °C → évaporation lente → dissolution dans huile MCT (40 °C). Pulvérisation uniforme sur tabac pré-humidifié (RH 65 %). Mélange doux en cuve inox ou bol céramique. Cure 15 jours en boîte de cèdre à 60 % HR.",
    cureConditions: JSON.stringify({
      temperature: "18–22 °C",
      humidity: "60% ±2",
      aeration: "Douce tous les 2 jours",
      duration: "15 jours"
    }),
    observations: "Fumée dense, cuirée, légèrement sucrée en finale. Rétro-olfaction ambrée persistante.",
    suggestedUse: "Hash CBD brun ou 'Cuir d'Ambre'",
    effect: "Introspection, lenteur, présence"
  },
  {
    code: "🜃",
    name: "MASTIHA VERDE",
    olfactiveFamily: "Résine verte, mentholée, boisée",
    inspiration: "Les collines méditerranéennes et le vent chargé de pin et de citron.",
    composition: JSON.stringify([
      { element: "Tabac Virginia Bright", matiere: "Base claire", ratio: "60 g" },
      { element: "Feuilles de mûrier séchées", matiere: "Souplesse et douceur", ratio: "20 g" },
      { element: "Menthe verte et verveine séchées", matiere: "Éclat frais", ratio: "10 g" },
      { element: "Santal blanc poudre", matiere: "Fixation", ratio: "2 g" },
      { element: "Extraction hybride", matiere: "mastiha, pin, citron, cardamome - MCT 1.5%", ratio: "8 g (≈ 3 mL)" }
    ]),
    procedure: "Extraction éthanolique à froid 24 h (10 °C). Évaporation sous ventilation naturelle. Dissolution dans huile MCT (35 °C). Pulvériser sur tabac légèrement humide (RH 60 %). Cure 10 jours sous cloche de verre.",
    cureConditions: JSON.stringify({
      temperature: "20 °C",
      humidity: "60–65%",
      mixing: "Quotidien les 3 premiers jours",
      duration: "10 jours"
    }),
    observations: "Fumée claire, balsamique, à pointe citronnée. Impression d'air pur.",
    suggestedUse: "Hash CBD clair, type Mastiha Brut ou Orchidée Salée",
    effect: "Vivifiant, purifiant, méditerranéen"
  },
  {
    code: "🜄",
    name: "LIQUIDE NOIR",
    olfactiveFamily: "Résineuse, métallique, encens noir",
    inspiration: "Encre, parchemin brûlé, terre chaude après la pluie.",
    composition: JSON.stringify([
      { element: "Tabac Latakia syrien", matiere: "Base fumée", ratio: "60 g" },
      { element: "Feuille de vigne séchée", matiere: "Note vineuse", ratio: "20 g" },
      { element: "Cacao brut poudre", matiere: "Terre et densité", ratio: "5 g" },
      { element: "Résine oliban + myrrhe + cypriol", matiere: "Extrait hybride MCT 2%", ratio: "10 g" },
      { element: "Propolis brute (trace)", matiere: "Fixation", ratio: "1 g" }
    ]),
    procedure: "Extraction éthanolique complète (48 h) puis évaporation ≤ 40 °C. Solubilisation du résidu dans huile MCT (45 °C). Incorporation par brassage lent. Cure 21 jours en bocal hermétique, ouverture 5 min/jour.",
    cureConditions: JSON.stringify({
      temperature: "20 °C constant",
      humidity: "58–62%",
      mixing: "Manuel (gants nitrile)",
      duration: "21 jours"
    }),
    observations: "Odeur d'encre végétale, note métallique vive puis finale balsamique et chocolatée.",
    suggestedUse: "Hash CBD noir ou Sève Noire",
    effect: "Contemplation, mystère, matière en fusion"
  },
  {
    code: "🪻",
    name: "FLORÉAL",
    olfactiveFamily: "Floral poudré, lactonique, vanillé",
    inspiration: "Figue, iris et peau tiède — sensualité calme.",
    composition: JSON.stringify([
      { element: "Tabac Burley clair", matiere: "Base", ratio: "70 g" },
      { element: "Feuilles de figuier séchées", matiere: "Accord lactonique", ratio: "10 g" },
      { element: "Pétales de rose séchés", matiere: "Poudré floral", ratio: "5 g" },
      { element: "Gousse de vanille", matiere: "Suavité", ratio: "1 g" },
      { element: "Extrait hybride", matiere: "iris, tonka, bergamote, ambrette - MCT 2%", ratio: "4 g (≈ 2 mL)" },
      { element: "Figue séchée macérée", matiere: "Accent gourmand", ratio: "10 g" }
    ]),
    procedure: "Extraction éthanolique 24 h → évaporation → dissolution dans MCT (40 °C). Pulvérisation sur tabac humidifié à 62 %. Cure 10 jours, pot en verre ambré.",
    cureConditions: JSON.stringify({
      temperature: "19–21 °C",
      humidity: "60–65%",
      mixing: "Initial manuel doux",
      duration: "10 jours"
    }),
    observations: "Fumée fine, poudrée, légèrement sucrée. Parfum persistant sur les doigts.",
    suggestedUse: "Hash CBD clair (Figue & Santal ou Distillat de Nuit)",
    effect: "Apaisement, sensualité, mémoire douce"
  },
  {
    code: "🜔",
    name: "TABERNACLE",
    olfactiveFamily: "Ambrée sacrée, encens et miel",
    inspiration: "Temple, résine, or brûlé.",
    composition: JSON.stringify([
      { element: "Tabac Oriental turc", matiere: "Base neutre", ratio: "70 g" },
      { element: "Myrrhe en poudre fine", matiere: "Accent sacré", ratio: "5 g" },
      { element: "Feuille de basilic séchée", matiere: "Élancement", ratio: "3 g" },
      { element: "Extrait hybride", matiere: "oliban, labdanum, benjoin, vanille, safran - MCT 3%", ratio: "7 g" },
      { element: "Gomme arabique dissoute + miel", matiere: "Liant naturel", ratio: "15 g" }
    ]),
    procedure: "Extraction à chaud (40 °C) 24 h → filtration. Évaporation, dissolution dans huile MCT (3 %). Application au pinceau sur tabac sec. Séchage 48 h puis cure 14 jours en pot poreux (terre cuite).",
    cureConditions: JSON.stringify({
      temperature: "20 °C stable",
      humidity: "55–60%",
      container: "Pot non verni pour micro-oxygénation",
      duration: "14 jours"
    }),
    observations: "Fumée dorée, résineuse, douce. Rappelle l'encens copte.",
    suggestedUse: "Hash CBD sombre (Noir de Myrrhe ou Sève Noire)",
    effect: "Méditation, recueillement, chaleur sacrée"
  }
];

console.log("Importation des 5 fiches techniques de tabacs alchimiques...");
for (const tobacco of tobaccoFormulasData) {
  await connection.execute(
    `INSERT INTO tobacco_formulas (\`code\`, \`name\`, \`olfactiveFamily\`, \`inspiration\`, \`composition\`, \`procedure\`, \`cureConditions\`, \`observations\`, \`suggestedUse\`, \`effect\`) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [tobacco.code, tobacco.name, tobacco.olfactiveFamily, tobacco.inspiration, tobacco.composition, tobacco.procedure, tobacco.cureConditions, tobacco.observations, tobacco.suggestedUse, tobacco.effect]
  );
  console.log(`  ✓ ${tobacco.code} ${tobacco.name}`);
}

console.log("\n✅ Import terminé avec succès !");
console.log(`   - 5 tabacs alchimiques`);

await connection.end();
