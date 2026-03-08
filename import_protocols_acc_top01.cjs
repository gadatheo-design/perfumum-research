#!/usr/bin/env node
/**
 * Import des protocoles ACC (6 étapes standard) et TOP-01 dans technical_protocols
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
  let created = 0, skipped = 0, errors = 0;

  const protocols = [
    {
      name: 'Protocole Standard de Fabrication PERFUMUM (6 étapes)',
      slug: 'protocole-standard-fabrication-perfumum',
      category: 'autre',
      difficulty_level: 'intermédiaire',
      objective: 'Fabriquer un accord ACC PERFUMUM selon le protocole standard en 6 étapes, de la préparation des matières premières à la maturation finale.',
      summary: 'Protocole standard de fabrication des accords ACC PERFUMUM. 6 étapes : préparation tabac, préparation solution terpènes, application, mélange, séchage, maturation. Durée totale : 6-12 semaines selon accord.',
      duration: '6-12 semaines',
      estimated_cost: '15-81 USD/100g selon accord',
      equipment_required: JSON.stringify([
        'Balance précision 0,01g',
        'Bécher verre 250ml',
        'Agitateur magnétique + barreau',
        'Atomiseur fin (spray)',
        'Flacons verre ambré 100ml',
        'Plateau inox',
        'Pots verre hermétiques',
        'Thermomètre 0-100°C',
        'Gants nitrile + lunettes protection'
      ]),
      steps: JSON.stringify([
        { step: 1, title: 'Préparation des matières premières', duration: '30-60 min', description: 'Peser et préparer les tabacs selon la formule. Humidité cible 12-14%. Étaler sur plateau inox en couche fine 2-3cm.' },
        { step: 2, title: 'Préparation de la solution terpènes', duration: '20-30 min', description: 'Peser alcool 96° et propylène glycol. Dissoudre les aromachemicals (éthyl maltol, coumarine, vanilline) dans base tiède 40°C. Ajouter les terpènes par ordre de volatilité décroissante. Agiter 2-3 min entre chaque ajout.' },
        { step: 3, title: 'Application sur tabac', duration: '15-20 min', description: 'Remplir atomiseur avec la solution terpènes. Pulvériser uniformément sur tabac en 3 passes : 1/3 dose, attendre 2 min, mélanger, répéter 3 fois. Mélanger énergiquement 5 min.' },
        { step: 4, title: 'Mélange et homogénéisation', duration: '10-15 min', description: 'Mélanger tabac + terpènes 5 min. Étaler à nouveau en couche fine. Laisser reposer 15 min. Vérifier homogénéité visuelle et olfactive.' },
        { step: 5, title: 'Séchage', duration: '24-48h', description: 'Séchage ambiant : pièce ventilée 20-22°C. Retourner toutes les 4h (6 fois). Humidité cible 13% (test tactile : souple, pas collant). Si trop sec : réhumidifier légèrement. Si trop humide : prolonger 12h.' },
        { step: 6, title: 'Maturation', duration: '4-12 semaines', description: 'Conditionner dans pot verre hermétique. Maturation selon accord : ACC-06 CBD 4-6 sem, ACC-04 Kif 6 sem, ACC-02 Himalaya 7 sem, ACC-05 Dokha 8 sem, ACC-01 Oriental 10-12 sem, ACC-03 Malawi 12 sem. Contrôle olfactif hebdomadaire.' }
      ]),
      full_content: `# Protocole Standard de Fabrication PERFUMUM

## Principe du Layering Olfactif
Structure temporelle en 3 couches :
- **Tête (0-15 min)** : Monoterpènes (Pinène, Limonène, Myrcène) → Impact initial
- **Cœur (15 min - 2h)** : Sesquiterpènes (Caryophyllène, Nerolidol) → Caractère principal
- **Fond (2h - 24h+)** : Absolutes + Aromachemicals lourds → Persistance, signature

## Proportions standard
- Tête : 15-25% de la formule
- Cœur : 40-50% de la formule
- Fond : 30-40% de la formule

## Durées de maturation par accord
| Accord | Maturation minimale | Optimale |
|--------|--------------------|---------| 
| ACC-06 Fleur CBD | 4 semaines | 6 semaines |
| ACC-04 Kif Authentique | 6 semaines | 8 semaines |
| ACC-02 Himalaya Sacré | 7 semaines | 10 semaines |
| ACC-05 Dokha Intense | 8 semaines | 10 semaines |
| ACC-01 Oriental Mystique | 10 semaines | 12 semaines |
| ACC-03 Malawi Fermenté | 12 semaines | 16 semaines |

## Contrôle qualité
- Contrôle olfactif hebdomadaire pendant maturation
- Fiche de traçabilité batch (date, lot, opérateur, observations)
- Test de combustion à 6 semaines pour validation profil`,
      safety_notes: 'Port de gants nitrile et lunettes obligatoire. Travailler en espace ventilé. Aromachemicals concentrés (éthyl maltol, davana) : manipuler avec précaution, diluer à 10% avant usage. Alcool 96° : inflammable, tenir éloigné des sources de chaleur.',
      quality_control: 'Contrôle olfactif hebdomadaire. Humidité cible 13% au séchage. Fiche de traçabilité batch obligatoire. Test de combustion à 6 semaines.',
      source_file: 'Notion PERFUMUM — Protocoles de Fabrication ACC'
    },
    {
      name: 'TOP-01 — Topping Tabac Oriental Sahélien',
      slug: 'top-01-topping-tabac-oriental-sahelien',
      category: 'autre',
      difficulty_level: 'intermédiaire',
      objective: 'Préparer un topping liquide sahélien pour tabac clair à base de plantes aromatiques du Burkina Faso (Boswellia dalzielii, Cymbopogon schoenanthus, Daniellia oliveri, Aframomum melegueta, Xylopia aethiopica, Lippia multiflora).',
      summary: 'Topping liquide pour tabac clair. Profil épicé sec, balsamique, notes résineuses légères. Base alcool/PG 50:50 avec 6 HE sahéliennes. Dosage 3-5% sur tabac. Rendement 100g → 2-3kg tabac traité.',
      duration: '3 jours (2h préparation + 48h macération + 24h séchage)',
      estimated_cost: '25-40 USD/100g topping',
      equipment_required: JSON.stringify([
        'Balance précision 0,01g',
        'Bécher verre 250ml',
        'Agitateur magnétique + barreau',
        'Thermomètre 0-100°C',
        'Flacon verre ambré 100ml avec compte-gouttes',
        'Atomiseur fin (spray)',
        'Gants nitrile + lunettes protection'
      ]),
      steps: JSON.stringify([
        { step: 1, title: 'Préparation base (30 min)', description: 'Peser alcool 96° : 46,45g dans bécher. Peser propylène glycol : 46,45g dans même bécher. Agitation magnétique 5 min. Chauffer bain-marie 40°C (ne pas dépasser).' },
        { step: 2, title: 'Dissolution fixateur (10 min)', description: 'Peser éthyl maltol : 0,1g. Ajouter dans base tiède 40°C. Agitation 5 min (dissolution complète). Vérifier limpidité (pas de cristaux).' },
        { step: 3, title: 'Ajout HE par ordre de volatilité (20 min)', description: 'Ordre décroissant : Boswellia dalzielii 2,5g → Cymbopogon schoenanthus 1,8g → Daniellia oliveri 1,2g → Aframomum melegueta CO₂ 0,8g → Xylopia aethiopica 0,4g → Lippia multiflora ch.thymol 0,3g. Agiter 2-3 min entre chaque.' },
        { step: 4, title: 'Macération (48h)', description: 'Transférer dans flacon verre ambré 100ml. Fermer hermétiquement. Stocker obscurité 18-22°C. Agiter 30 sec toutes les 12h. Après 48h : mélange prêt.' },
        { step: 5, title: 'Application sur tabac', description: 'Dosage 4% : 1kg tabac × 4% = 40g topping. Pulvériser en 3 passes (1/3 dose chaque). Attendre 2 min entre passes. Mélanger 5 min. Reposer 15 min.' },
        { step: 6, title: 'Séchage (24h)', description: 'Séchage ambiant 20-22°C, couche fine. Retourner toutes 4h (6 fois). Humidité cible 13%. Prolonger 12h si trop humide.' },
        { step: 7, title: 'Maturation & conditionnement (7-14 jours)', description: 'Pot verre hermétique. Maturation 7 jours minimum (idéal 14 jours). Contrôle olfactif à J7 et J14.' }
      ]),
      full_content: `# TOP-01 — Topping Tabac Oriental Sahélien

## Composition (base 100g, alcool/PG 50:50)
| Ingrédient | Quantité | % |
|-----------|---------|---|
| Boswellia dalzielii HE | 2,5g | 2,5% |
| Cymbopogon schoenanthus HE | 1,8g | 1,8% |
| Daniellia oliveri HE | 1,2g | 1,2% |
| Aframomum melegueta CO₂ | 0,8g | 0,8% |
| Xylopia aethiopica extrait | 0,4g | 0,4% |
| Lippia multiflora ch.thymol HE | 0,3g | 0,3% |
| Éthyl maltol | 0,1g | 0,1% |
| Alcool 96° | 46,45g | 46,45% |
| Propylène glycol USP | 46,45g | 46,45% |

## Applications
- **Tabacs cibles** : Virginia Bright, Burley light, mélanges clairs aromatiques
- **Dosage** : 3-5% poids sec tabac
- **Rendement** : 100g topping → 2-3 kg tabac traité
- **Conservation** : 6 mois flacon verre ambré hermétique

## Profil olfactif
- **Tête** : Boswellia (encens-résine), Cymbopogon (citronné-sec)
- **Cœur** : Daniellia (boisé-balsamique), Aframomum (épicé-poivré)
- **Fond** : Xylopia (épicé-fumé), Lippia (thymol), Éthyl maltol (sucré)

## Source
Notion PERFUMUM — TOP-01 Oriental Sahélien. Plantes issues de RES-02 (Ouedraogo et al. 2024).`,
      safety_notes: 'Lippia multiflora chémotype thymol : très puissant, micro-dose uniquement. Port de gants nitrile et lunettes obligatoire. Alcool 96° inflammable.',
      quality_control: 'Contrôle olfactif à J2 (fin macération), J3 (fin séchage), J7 et J14 (maturation). Humidité cible 13%.',
      source_file: 'Notion PERFUMUM — TOP-01 Oriental Sahélien + RES-02 Burkina Faso'
    }
  ];

  console.log('=== Import Protocoles ACC + TOP-01 dans technical_protocols ===\n');

  for (const proto of protocols) {
    try {
      const [existing] = await conn.execute('SELECT id FROM technical_protocols WHERE slug = ? LIMIT 1', [proto.slug]);
      if (existing.length > 0) {
        // Mettre à jour
        await conn.execute(
          `UPDATE technical_protocols SET name=?, category=?, objective=?, summary=?, full_content=?, equipment_required=?, estimated_cost=?, duration=?, difficulty_level=?, safety_notes=?, quality_control=?, steps=?, source_file=?, updated_at=NOW() WHERE slug=?`,
          [proto.name, proto.category, proto.objective, proto.summary, proto.full_content, proto.equipment_required, proto.estimated_cost, proto.duration, proto.difficulty_level, proto.safety_notes, proto.quality_control, proto.steps, proto.source_file, proto.slug]
        );
        skipped++;
        console.log(`  ↑ Mis à jour: ${proto.name}`);
      } else {
        await conn.execute(
          `INSERT INTO technical_protocols (name, slug, category, objective, summary, full_content, equipment_required, estimated_cost, duration, difficulty_level, safety_notes, quality_control, steps, source_file, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [proto.name, proto.slug, proto.category, proto.objective, proto.summary, proto.full_content, proto.equipment_required, proto.estimated_cost, proto.duration, proto.difficulty_level, proto.safety_notes, proto.quality_control, proto.steps, proto.source_file]
        );
        created++;
        console.log(`  + Créé: ${proto.name}`);
      }
    } catch(e) {
      errors++;
      console.error(`  ✗ ${proto.name}: ${e.message.substring(0, 120)}`);
    }
  }

  const [[total]] = await conn.execute('SELECT COUNT(*) as n FROM technical_protocols');
  console.log('\n=== Résumé Final ===');
  console.log(`Créés: ${created} | Mis à jour: ${skipped} | Erreurs: ${errors}`);
  console.log(`Total technical_protocols: ${total.n}`);
  
  await conn.end();
}

main().catch(console.error);
