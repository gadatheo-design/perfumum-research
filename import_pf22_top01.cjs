#!/usr/bin/env node
/**
 * Import PF-22 Accords CBD+Tabac Layering + TOP-01 Topping Tabac Oriental Sahélien
 * Source : Notion PERFUMUM
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_URL = process.env.DATABASE_URL;
async function getConn() {
  const url = new URL(DB_URL);
  return mysql.createConnection({
    host: url.hostname, port: parseInt(url.port)||3306,
    user: url.username, password: url.password,
    database: url.pathname.slice(1), ssl: {rejectUnauthorized: false}
  });
}

async function main() {
  const conn = await getConn();
  let created = 0, updated = 0, skipped = 0, errors = 0;

  // ===== PF-22 : Données de layering olfactif (research_entry) =====
  console.log('=== PF-22 Accords CBD+Tabac Layering ===');

  const [axes] = await conn.execute('SELECT id FROM research_axes LIMIT 1');
  const axisId = axes[0]?.id || 1;

  const pf22Entry = {
    entry_code: 'PF-22-LAYERING',
    title: 'PF-22 — Principes du Layering Olfactif CBD+Tabac+Terpènes',
    slug: 'pf-22-layering-olfactif-cbd-tabac',
    entry_type: 'analysis',
    content: `# Accords CBD + Tabac + Terpènes avec Layering Olfactif

## Principe du Layering Olfactif
Le layering olfactif construit un accord en 3 couches volatiles (tête → cœur → fond), créant une évolution aromatique dynamique.

**Structure Temporelle :**
- Tête (0-15 min) : Monoterpènes (Pinène, Limonène, Myrcène) → Impact initial, fraîcheur, alerte
- Cœur (15 min - 2h) : Sesquiterpènes (Caryophyllène, Humulène, Nerolidol) → Caractère principal, complexité
- Fond (2h - 24+h) : Absolutes (Tabac, Hay, Labdanum) + Aromachemicals lourds (Coumarin, Vanillin, Ionones) → Persistance, signature, fixation

**Principes Clés :**
1. Volatilité croissante : Monoterpènes → Sesquiterpènes → Absolutes + Aromachemicals lourds
2. Équilibre proportions : Tête 15-25% → Cœur 40-50% → Fond 30-40%
3. Synergies harmoniques : Terpènes + Aromachemicals créent profils > somme parties
4. Maturation essentielle : 4 semaines minimum, optimal 8-12 semaines
5. Dilution stratégique : Aromachemicals puissants (Ethyl maltol, Davana) dilués 10% dans DPG

## Vue d'ensemble des 6 Accords
| Accord | Matières Clés | Profil | Coût/100g | Vente/100g |
|--------|--------------|--------|-----------|------------|
| ACC-01 Oriental Mystique | Yenidje 60% + Hash libanais 25% | Épicé-crémeux-floral-mystique | $47-81 | $188-404 |
| ACC-02 Himalaya Sacré | Bidi 50% + Charas népalais 35% | Menthol-eucalyptus-spirituel | $25-36 | $100-178 |
| ACC-03 Malawi Fermenté ⭐ | Perique 15% + Virginia 40% + Malawi Cob 30% | Fermenté-fruité-prune-winey | $18-26 | $71-130 |
| ACC-04 Kif Authentique | N. rustica 67% + Hash marocain 33% | Terreux-épicé-fumé | $15-25 | $60-125 |
| ACC-05 Dokha Intense ⚠️ | Dokha 65% + Hash afghan 30% | Intense-nicotine-extrême | $20-35 | $80-175 |
| ACC-06 Fleur CBD Délicate | Hindu Kush CBD 50% + Virginia 50% | Floral-doux-débutants | $15-22 | $60-110 |

## Décisions Actionnables
1. Lancer avec Accord 3 "Malawi Fermenté" : meilleur ratio qualité/coût/complexité ($18-26/100g → $71-130/100g)
2. Positionner Accord 1 "Oriental Mystique" comme signature ultra-premium (Yenidje rare, $47-81/100g)
3. Protocole standard : maturation 6-8 semaines minimum (optimal 12 semaines)
4. Sourcer prioritairement : Perique, Yenidje, Malawi Cob, terpènes (Nerolidol, Bisabolol, Cedrol)`,
    status: 'completed'
  };

  try {
    const [existing] = await conn.execute('SELECT id FROM research_entries WHERE entry_code = ? LIMIT 1', [pf22Entry.entry_code]);
    if (existing.length > 0) {
      skipped++;
      console.log(`  ~ Existant: ${pf22Entry.title}`);
    } else {
      await conn.execute(
        `INSERT INTO research_entries (entry_code, title, slug, content, entry_type, axis_id, primary_axis_id, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [pf22Entry.entry_code, pf22Entry.title, pf22Entry.slug, pf22Entry.content, pf22Entry.entry_type, axisId, axisId, pf22Entry.status]
      );
      created++;
      console.log(`  + Créé: ${pf22Entry.title}`);
    }
  } catch(e) {
    errors++;
    console.error(`  ✗ PF-22: ${e.message.substring(0, 120)}`);
  }

  // ===== TOP-01 : Topping Tabac Oriental Sahélien (recette) =====
  console.log('\n=== TOP-01 Topping Tabac Oriental Sahélien ===');

  const top01 = {
    name: 'TOP-01 — Oriental Sahélien (Topping Tabac)',
    category: 'tabac',
    status: 'validated',
    description: 'Topping liquide pour tabac clair. Profil épicé sec, balsamique, notes résineuses légères. Plantes sahéliennes du Burkina Faso.',
    formula: `Base 100g (alcool/PG 50:50) :
- Boswellia dalzielii HE : 2,5g (2,5%)
- Cymbopogon schoenanthus HE : 1,8g (1,8%)
- Daniellia oliveri HE : 1,2g (1,2%)
- Aframomum melegueta extrait CO₂ : 0,8g (0,8%)
- Xylopia aethiopica extrait fruits : 0,4g (0,4%)
- Lippia multiflora ch. thymol HE : 0,3g (0,3%)
- Éthyl maltol : 0,1g (0,1%)
- Alcool 96° : 46,45g (46,45%)
- Propylène glycol USP : 46,45g (46,45%)`,
    notes_tete: 'Boswellia dalzielii (encens-résine), Cymbopogon schoenanthus (citronné-sec)',
    notes_coeur: 'Daniellia oliveri (boisé-balsamique), Aframomum melegueta (épicé-poivré)',
    notes_fond: 'Xylopia aethiopica (épicé-fumé), Lippia multiflora (thymol), Éthyl maltol (sucré)',
    notes: `Applications : Virginia Bright, Burley light, mélanges clairs aromatiques
Dosage : 3-5% poids sec tabac
Rendement : 100g topping → 2-3 kg tabac traité
Conservation : 6 mois flacon verre ambré hermétique

PROTOCOLE 7 ÉTAPES :
1. Préparation base (30min) : Peser alcool 46,45g + PG 46,45g + agitation magnétique 5min + chauffer bain-marie 40°C
2. Dissolution fixateur (10min) : Éthyl maltol 0,1g dans base tiède 40°C + agitation 5min
3. Ajout HE par ordre volatilité décroissante (20min) : Boswellia → Cymbopogon → Daniellia → Aframomum → Xylopia → Lippia
4. Macération (48h) : Flacon verre ambré, obscurité 18-22°C, agitation 30sec toutes 12h
5. Application (variable) : Dosage 4% sur tabac étalé, 3 passes spray, mélange 5min
6. Séchage (24h) : Couche fine, ventilation 20-22°C, retourner toutes 4h
7. Maturation (7-14 jours) : Pot verre hermétique, contrôle olfactif

Traçabilité : Numérotation lot numbers + fiche fabrication complète`
  };

  try {
    const [existing] = await conn.execute('SELECT id FROM recettes WHERE name = ? LIMIT 1', [top01.name]);
    if (existing.length > 0) {
      await conn.execute(
        `UPDATE recettes SET category=?, description=?, formula=?, notes_tete=?, notes_coeur=?, notes_fond=?, notes=?, status=?, updatedAt=NOW() WHERE id=?`,
        [top01.category, top01.description, top01.formula, top01.notes_tete, top01.notes_coeur, top01.notes_fond, top01.notes, top01.status, existing[0].id]
      );
      updated++;
      console.log(`  ↑ Mis à jour: ${top01.name}`);
    } else {
      await conn.execute(
        `INSERT INTO recettes (name, category, description, formula, notes_tete, notes_coeur, notes_fond, notes, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [top01.name, top01.category, top01.description, top01.formula, top01.notes_tete, top01.notes_coeur, top01.notes_fond, top01.notes, top01.status]
      );
      created++;
      console.log(`  + Créé: ${top01.name}`);
    }
  } catch(e) {
    errors++;
    console.error(`  ✗ TOP-01: ${e.message.substring(0, 120)}`);
  }

  // ===== Plantes sahéliennes TOP-01 (nouvelles plantes) =====
  console.log('\n=== Plantes sahéliennes TOP-01 ===');

  const plantesTop01 = [
    { name: 'Boswellia dalzielii', common_name: 'Encensier sahélien', family: 'Burseraceae', origin: 'Afrique de l\'Ouest (Burkina Faso, Mali, Sénégal)', description: 'Arbre produisant une résine oléo-gommeuse utilisée comme encens sahélien. Huile essentielle aux notes résineuses-balsamiques-épicées.' },
    { name: 'Cymbopogon schoenanthus', common_name: 'Jonc odorant / Camel grass', family: 'Poaceae', origin: 'Afrique du Nord, Sahel, Moyen-Orient', description: 'Graminée aromatique sahélienne. HE citronnée-sèche-terreuse, riche en géraniol et citronellol. Utilisée en parfumerie niche africaine.' },
    { name: 'Daniellia oliveri', common_name: 'Copalier d\'Afrique de l\'Ouest', family: 'Fabaceae', origin: 'Afrique de l\'Ouest (Burkina Faso, Côte d\'Ivoire)', description: 'Arbre produisant une résine copal. HE boisée-balsamique-légèrement fumée. Proche du copal mexicain mais avec signature sahélienne.' },
    { name: 'Xylopia aethiopica', common_name: 'Poivre d\'Éthiopie / Grains de Selim', family: 'Annonaceae', origin: 'Afrique tropicale (Éthiopie, Cameroun, Burkina Faso)', description: 'Épice africaine aux fruits aromatiques. Notes épicées-fumées-poivrées-résineuses. Utilisée en cuisine et parfumerie africaine traditionnelle.' },
    { name: 'Lippia multiflora', common_name: 'Thé de Gambie / Tisane de brousse', family: 'Verbenaceae', origin: 'Afrique de l\'Ouest (Burkina Faso, Sénégal, Guinée)', description: 'Arbuste aromatique sahélien. Chémotype thymol : HE très aromatique, notes thymol-épicé-herbacé. Utilisé en médecine traditionnelle et parfumerie.' },
  ];

  for (const plante of plantesTop01) {
    try {
      const [existing] = await conn.execute('SELECT id FROM plants WHERE name = ? LIMIT 1', [plante.name]);
      if (existing.length > 0) { skipped++; continue; }
      
      await conn.execute(
        `INSERT INTO plants (name, latin_name, family, origin, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [plante.name, plante.name, plante.family, plante.origin, plante.description]
      );
      created++;
      console.log(`  + Plante: ${plante.name} (${plante.common_name})`);
    } catch(e) {
      errors++;
      console.error(`  ✗ ${plante.name}: ${e.message.substring(0, 100)}`);
    }
  }

  // ===== Résumé =====
  const [[totalRecettes]] = await conn.execute('SELECT COUNT(*) as n FROM recettes');
  const [[totalRE]] = await conn.execute('SELECT COUNT(*) as n FROM research_entries');
  const [[totalPlants]] = await conn.execute('SELECT COUNT(*) as n FROM plants');
  console.log('\n=== Résumé Final ===');
  console.log(`Créés: ${created} | Mis à jour: ${updated} | Existants: ${skipped} | Erreurs: ${errors}`);
  console.log(`Total recettes: ${totalRecettes.n} | Total research_entries: ${totalRE.n} | Total plantes: ${totalPlants.n}`);
  
  await conn.end();
}

main().catch(console.error);
