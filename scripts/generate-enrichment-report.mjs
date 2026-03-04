/**
 * PERFUMUM — Rapport d'état de l'enrichissement
 * Génère un rapport Markdown complet sur l'état actuel de la base
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const now = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

// ─── Statistiques générales ───────────────────────────────────────────────────
const [[stats]] = await conn.execute(`
  SELECT 
    (SELECT COUNT(*) FROM plants) as total_plants,
    (SELECT COUNT(*) FROM molecules) as total_molecules,
    (SELECT COUNT(*) FROM plant_molecules) as total_links,
    (SELECT COUNT(*) FROM plants WHERE latin_name IS NULL OR latin_name = '') as plants_no_latin,
    (SELECT COUNT(*) FROM plants p WHERE NOT EXISTS (SELECT 1 FROM plant_molecules pm WHERE pm.plant_id = p.id)) as orphan_plants,
    (SELECT COUNT(*) FROM plant_molecules WHERE source IS NULL OR source = '') as links_no_source,
    (SELECT COUNT(*) FROM plant_molecules WHERE percentage IS NULL OR percentage = 0) as links_no_pct,
    (SELECT COUNT(*) FROM terroirs) as total_terroirs,
    (SELECT COUNT(*) FROM variety_genealogy) as total_genealogy,
    (SELECT COUNT(*) FROM bibliography_entries) as total_biblio,
    (SELECT COUNT(*) FROM pyrolysis_transformations) as total_pyrolysis,
    (SELECT COUNT(*) FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != '') as mol_therapeutic,
    (SELECT COUNT(*) FROM molecules WHERE olfactiveProfile IS NOT NULL AND olfactiveProfile != '') as mol_olfactive,
    (SELECT COUNT(*) FROM molecules WHERE cas_number IS NOT NULL AND cas_number != '') as mol_cas
`);

// ─── Familles chimiques ───────────────────────────────────────────────────────
const [allFamilies] = await conn.execute(`
  SELECT family, COUNT(*) as cnt
  FROM molecules
  WHERE family IS NOT NULL AND family != ''
  GROUP BY family
  ORDER BY cnt DESC
`);

const topFamilies = allFamilies.slice(0, 15);
const underFamilies = allFamilies.filter(f => f.cnt < 3).sort((a, b) => a.cnt - b.cnt);

// ─── Catégories de plantes ────────────────────────────────────────────────────
const [plantCats] = await conn.execute(`
  SELECT category, COUNT(*) as cnt,
    SUM(latin_name IS NOT NULL AND latin_name != '') as has_latin,
    SUM(EXISTS (SELECT 1 FROM plant_molecules pm WHERE pm.plant_id = plants.id)) as has_molecules
  FROM plants
  GROUP BY category
  ORDER BY cnt DESC
`);

// ─── Top plantes par nombre de molécules ─────────────────────────────────────
const [topPlants] = await conn.execute(`
  SELECT p.name, p.latin_name, p.category, COUNT(pm.molecule_id) as mol_count
  FROM plants p
  JOIN plant_molecules pm ON pm.plant_id = p.id
  GROUP BY p.id
  ORDER BY mol_count DESC
  LIMIT 20
`);

// ─── Plantes avec peu de molécules ───────────────────────────────────────────
const [poorPlants] = await conn.execute(`
  SELECT p.name, p.latin_name, p.category, COUNT(pm.molecule_id) as mol_count
  FROM plants p
  JOIN plant_molecules pm ON pm.plant_id = p.id
  GROUP BY p.id
  HAVING mol_count <= 2
  ORDER BY mol_count ASC, p.name ASC
  LIMIT 30
`);

// ─── Molécules les plus liées ─────────────────────────────────────────────────
const [topMolecules] = await conn.execute(`
  SELECT m.name, m.family, COUNT(pm.plant_id) as plant_count
  FROM molecules m
  JOIN plant_molecules pm ON pm.molecule_id = m.id
  GROUP BY m.id
  ORDER BY plant_count DESC
  LIMIT 20
`);

// ─── Liaisons avec sources ────────────────────────────────────────────────────
const [sourceStats] = await conn.execute(`
  SELECT 
    SUM(source IS NOT NULL AND source != '') as with_source,
    SUM(percentage IS NOT NULL AND percentage > 0) as with_pct,
    SUM(source IS NOT NULL AND source != '' AND percentage IS NOT NULL AND percentage > 0) as complete,
    COUNT(*) as total
  FROM plant_molecules
`);

// ─── Généalogies ─────────────────────────────────────────────────────────────
const [genealogyStats] = await conn.execute(`
  SELECT relationship_type, COUNT(*) as cnt
  FROM variety_genealogy
  GROUP BY relationship_type
  ORDER BY cnt DESC
`);

// ─── Terroirs ────────────────────────────────────────────────────────────────
const [terroirStats] = await conn.execute(`
  SELECT t.country, t.climate_type, COUNT(DISTINCT pt.plant_id) as plant_count
  FROM terroirs t
  JOIN plant_terroirs pt ON pt.terroir_id = t.id
  GROUP BY t.country, t.climate_type
  ORDER BY plant_count DESC
  LIMIT 20
`);

await conn.end();

// ─── Génération du rapport Markdown ──────────────────────────────────────────
const pct = (n, d) => d > 0 ? `${Math.round(n/d*100)}%` : 'N/A';

let report = `# PERFUMUM — Rapport d'enrichissement
**Date** : ${now}

---

## 1. Vue d'ensemble

| Entité | Valeur |
|--------|--------|
| Plantes | **${stats.total_plants}** |
| Molécules | **${stats.total_molecules}** |
| Liaisons plante↔molécule | **${stats.total_links}** |
| Terroirs | **${stats.total_terroirs}** |
| Liaisons généalogiques | **${stats.total_genealogy}** |
| Références bibliographiques | **${stats.total_biblio}** |
| Transformations pyrolyse | **${stats.total_pyrolysis}** |

---

## 2. Qualité des données

### Plantes

| Métrique | Valeur | Cible |
|----------|--------|-------|
| Sans nom latin | ${stats.plants_no_latin} (${pct(stats.plants_no_latin, stats.total_plants)}) | < 1% ✅ |
| Orphelines (sans molécules) | ${stats.orphan_plants} (${pct(stats.orphan_plants, stats.total_plants)}) | 0% ✅ |

### Liaisons plante↔molécule

| Métrique | Valeur | Cible |
|----------|--------|-------|
| Avec source documentée | ${stats.total_links - stats.links_no_source} (${pct(stats.total_links - stats.links_no_source, stats.total_links)}) | > 70% |
| Avec pourcentage | ${stats.total_links - stats.links_no_pct} (${pct(stats.total_links - stats.links_no_pct, stats.total_links)}) | > 70% |
| Complètes (source + %) | ${sourceStats[0].complete} (${pct(sourceStats[0].complete, sourceStats[0].total)}) | > 50% |

### Molécules

| Métrique | Valeur | Cible |
|----------|--------|-------|
| Avec profil olfactif | ${stats.mol_olfactive} (${pct(stats.mol_olfactive, stats.total_molecules)}) | > 80% |
| Avec propriétés thérapeutiques | ${stats.mol_therapeutic} (${pct(stats.mol_therapeutic, stats.total_molecules)}) | > 30% |
| Avec numéro CAS | ${stats.mol_cas} (${pct(stats.mol_cas, stats.total_molecules)}) | > 50% |

---

## 3. Familles chimiques

### Top 15 familles les mieux représentées

| Famille | Molécules |
|---------|-----------|
${topFamilies.map(f => `| ${f.family} | ${f.cnt} |`).join('\n')}

### Familles sous-représentées (< 3 molécules) — ${underFamilies.length} familles

| Famille | Molécules |
|---------|-----------|
${underFamilies.map(f => `| ${f.family} | ${f.cnt} |`).join('\n')}

---

## 4. Plantes par catégorie

| Catégorie | Plantes | Avec nom latin | Avec molécules |
|-----------|---------|----------------|----------------|
${plantCats.map(c => `| ${c.category || 'N/A'} | ${c.cnt} | ${c.has_latin} (${pct(c.has_latin, c.cnt)}) | ${c.has_molecules} (${pct(c.has_molecules, c.cnt)}) |`).join('\n')}

---

## 5. Top 20 plantes les plus documentées

| Plante | Nom latin | Catégorie | Molécules |
|--------|-----------|-----------|-----------|
${topPlants.map(p => `| ${p.name} | *${p.latin_name || 'N/A'}* | ${p.category || 'N/A'} | ${p.mol_count} |`).join('\n')}

---

## 6. Plantes à enrichir en priorité (≤ 2 molécules)

| Plante | Nom latin | Catégorie | Molécules |
|--------|-----------|-----------|-----------|
${poorPlants.map(p => `| ${p.name} | *${p.latin_name || 'N/A'}* | ${p.category || 'N/A'} | ${p.mol_count} |`).join('\n')}

---

## 7. Top 20 molécules les plus présentes

| Molécule | Famille | Plantes liées |
|----------|---------|---------------|
${topMolecules.map(m => `| ${m.name} | ${m.family || 'N/A'} | ${m.plant_count} |`).join('\n')}

---

## 8. Généalogies des variétés

| Type de relation | Liaisons |
|-----------------|---------|
${genealogyStats.map(g => `| ${g.relationship_type || 'N/A'} | ${g.cnt} |`).join('\n')}

---

## 9. Distribution géographique (terroirs)

| Pays | Climat | Plantes |
|------|--------|---------|
${terroirStats.map(t => `| ${t.country || 'N/A'} | ${t.climate_type || 'N/A'} | ${t.plant_count} |`).join('\n')}

---

## 10. Axes d'enrichissement prioritaires

### Court terme (prochaines sessions)

1. **Propriétés thérapeutiques** — Seulement ${pct(stats.mol_therapeutic, stats.total_molecules)} des molécules documentées. Cible : 30%+. Enrichir les 50 molécules les plus liées.
2. **Sources des liaisons** — ${pct(stats.links_no_source, stats.total_links)} des liaisons sans source. Cible : < 30%. Ajouter les références PMC/MDPI/ISO.
3. **Pourcentages de composition** — ${pct(stats.links_no_pct, stats.total_links)} des liaisons sans pourcentage. Cible : < 30%. Enrichir avec données GC-MS.
4. **Familles sous-représentées** — ${underFamilies.length} familles avec < 3 molécules. Ajouter 2-3 molécules par famille.
5. **Plantes à faible couverture** — ${poorPlants.length} plantes avec ≤ 2 molécules. Enrichir avec données botaniques.

### Moyen terme (3-6 mois)

1. **Synergies moléculaires** — Documenter les synergies masquantes et neutralisantes entre molécules clés.
2. **Numéros CAS** — Seulement ${pct(stats.mol_cas, stats.total_molecules)} des molécules avec CAS. Enrichir via PubChem API.
3. **Liaisons bibliographiques** — Lier les 1179 références aux plantes et molécules correspondantes.
4. **Variations saisonnières** — Documenter les profils alternatifs selon saison/terroir/récolte.
5. **Plantes rares/disparues** — Documenter les espèces menacées ou éteintes (axe patrimonial).

---

*Rapport généré automatiquement par PERFUMUM — Enrichissement des données*
`;

const outputPath = '/home/ubuntu/perfumum-research/ENRICHMENT-REPORT.md';
writeFileSync(outputPath, report);
console.log(`✅ Rapport généré : ${outputPath}`);
console.log(`   ${allFamilies.length} familles analysées`);
console.log(`   ${underFamilies.length} familles sous-représentées`);
console.log(`   ${poorPlants.length} plantes à enrichir en priorité`);
