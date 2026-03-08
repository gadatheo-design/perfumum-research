const mysql = require('mysql2/promise');

async function main() {
    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    let recipesCreated = 0;
    let entriesCreated = 0;

    // ===== 1. ARCHIVE CIVILISATIONNELLE (36 compositions #61-#96) =====
    const archiveRecipes = [
        // ANTIQUITÉ MÉDITERRANÉENNE
        { code: 'ARC-061', name: 'CRETA MINOICA', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Palais de Cnossos, fresque, cire d\'abeille, résine. Crète minoenne, 2000-1400 av. J.-C.', olfactiveProfile: JSON.stringify(['cire d\'abeille', 'résine térébenthine', 'miel floral', 'poussière fresque']), molecules: ['Acétate de benzyle', 'α-Pinène', 'Phényléthanol', 'Géosmine'] },
        { code: 'ARC-062', name: 'HITTITE BRONZE', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Forge hittite, bronze chaud, cèdre, encens. Empire hittite, 1600-1200 av. J.-C.', olfactiveProfile: JSON.stringify(['métal chaud', 'cèdre sec', 'encens résineux', 'fumée forge']), molecules: ['Cédrène', 'α-Pinène', 'Guaiacol'] },
        { code: 'ARC-063', name: 'SUMER TEMPLE', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Temple sumérien, argile, encens, poussière sacrée. Sumer, 4500-1900 av. J.-C.', olfactiveProfile: JSON.stringify(['argile sèche', 'encens oliban', 'poussière minérale', 'chaleur désert']), molecules: ['Géosmine', 'α-Pinène', 'Vétiverol'] },
        { code: 'ARC-064', name: 'ELAM SHADOW', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Ombre des ziggourats, résine noire, fumée froide. Élam, 3200-539 av. J.-C.', olfactiveProfile: JSON.stringify(['résine noire', 'fumée froide', 'ombre minérale', 'bitume']), molecules: ['Styrax', 'Guaiacol', 'Vétiverol'] },
        { code: 'ARC-065', name: 'AKKAD DUST', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Poussière akkadienne, tablettes d\'argile, cèdre sec. Empire akkadien, 2334-2154 av. J.-C.', olfactiveProfile: JSON.stringify(['poussière argile', 'cèdre ancien', 'papyrus sec', 'minéral']), molecules: ['Géosmine', 'Cédrène', 'Coumarine', 'Vétiverol'] },
        { code: 'ARC-066', name: 'MYCENAE GOLD', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Masque d\'Agamemnon, or, miel, résine. Mycènes, 1600-1100 av. J.-C.', olfactiveProfile: JSON.stringify(['métal précieux', 'miel ambré', 'résine pin', 'chaleur dorée']), molecules: ['Phényléthanol', 'α-Pinène', 'Vanilline'] },
        { code: 'ARC-067', name: 'PHOENICIAN PURPLE', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Pourpre de Tyr, coquillage fermenté, sel, résine marine. Phénicie, 1500-300 av. J.-C.', olfactiveProfile: JSON.stringify(['coquillage fermenté', 'sel marin', 'résine marine', 'iode']), molecules: ['Indole', 'Calone'] },
        { code: 'ARC-068', name: 'URUK CLAY', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Argile d\'Uruk, tablettes cunéiformes, poussière. Uruk, 4000-3100 av. J.-C.', olfactiveProfile: JSON.stringify(['argile fraîche', 'poussière sèche', 'roseau', 'minéral']), molecules: ['Géosmine', 'Vétiverol'] },
        { code: 'ARC-069', name: 'BABYLON GARDEN', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Jardins suspendus, figue, cèdre, résine. Babylone, 626-539 av. J.-C.', olfactiveProfile: JSON.stringify(['figue verte', 'cèdre humide', 'résine sucrée', 'végétation luxuriante']), molecules: ['Cédrène', 'α-Pinène', 'Linalol'] },
        { code: 'ARC-070', name: 'DELPHES ORACLE', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Oracle de Delphes, laurier, encens, vapeurs. Delphes, 8e s. av. J.-C. - 4e s. ap. J.-C.', olfactiveProfile: JSON.stringify(['laurier aromatique', 'vapeurs souterraines', 'encens oliban', 'pierre chaude']), molecules: ['1,8-Cinéole', 'Vétiverol', 'α-Pinène'] },
        // MOYEN ÂGE & RENAISSANCE
        { code: 'ARC-071', name: 'CORDOUE 950', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Cuir andalou, artisanat médiéval. Califat de Cordoue, 950 ap. J.-C.', olfactiveProfile: JSON.stringify(['cuir tanné', 'rose damascène', 'safran', 'bois santal']), molecules: ['Phényléthanol', 'Safranal', 'Santalol'] },
        // ASIE ANCIENNE
        { code: 'ARC-072', name: 'KYOTO KUMO', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Temples de Kyoto, encens, bois humide, brouillard. Kyoto, période Heian 794-1185.', olfactiveProfile: JSON.stringify(['encens japonais', 'bois humide', 'brouillard', 'cèdre japonais']), molecules: ['α-Pinène', 'Cédrène', 'Guaiacol'] },
        { code: 'ARC-073', name: 'TANG DYNASTY', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Chine des Tang, soie, thé, encens. Chine, 618-907 ap. J.-C.', olfactiveProfile: JSON.stringify(['thé vert', 'soie', 'encens', 'bois précieux']), molecules: ['Linalol', 'α-Pinène', 'Santalol'] },
        { code: 'ARC-074', name: 'KHMER STONE', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Angkor Vat, pierre chaude, jungle, résine. Khmer, 9e-15e siècle.', olfactiveProfile: JSON.stringify(['pierre chaude', 'jungle dense', 'résine tropicale', 'mousse']), molecules: ['Vétiverol', 'Linalol', 'α-Pinène'] },
        // AFRIQUE ANCIENNE
        { code: 'ARC-075', name: 'KUSH GOLD', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Royaume de Koush, or, myrrhe, encens. Nubie, 800 av. J.-C. - 350 ap. J.-C.', olfactiveProfile: JSON.stringify(['myrrhe', 'encens', 'or chaud', 'sable']), molecules: ['α-Pinène', 'Vétiverol'] },
        { code: 'ARC-076', name: 'MALI EMPIRE', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Empire du Mali, or, sel, karité. Afrique de l\'Ouest, 1235-1600.', olfactiveProfile: JSON.stringify(['karité', 'sel', 'or', 'bois africain']), molecules: ['Vétiverol', 'Géosmine'] },
        // AMÉRIQUES PRÉCOLOMBIENS
        { code: 'ARC-077', name: 'TEOTIHUACAN PYRAMID', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Pyramide de Teotihuacan, copal, obsidienne, sang. Mexique, 100-650 ap. J.-C.', olfactiveProfile: JSON.stringify(['copal blanc', 'obsidienne', 'résine rituelle', 'sang séché']), molecules: ['α-Pinène', 'Limonène', 'Géosmine'] },
        { code: 'ARC-078', name: 'MAYA CENOTE', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Cénote maya, eau sacrée, jade, copal. Yucatan, 300-900 ap. J.-C.', olfactiveProfile: JSON.stringify(['eau minérale', 'jade', 'copal', 'végétation tropicale']), molecules: ['Géosmine', 'α-Pinène', 'Linalol'] },
        { code: 'ARC-079', name: 'INCA QHAPAQ', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Empire inca, altitude, coca, or. Andes, 1438-1533.', olfactiveProfile: JSON.stringify(['altitude froide', 'coca', 'or', 'terre andine']), molecules: ['Géosmine', 'Vétiverol', 'Linalol'] },
        // MÉSOPOTAMIE & PROCHE-ORIENT
        { code: 'ARC-080', name: 'ASSYRIA PALACE', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Palais assyrien, cèdre, résine, encens. Assyrie, 900-612 av. J.-C.', olfactiveProfile: JSON.stringify(['cèdre majestueux', 'résine royale', 'encens', 'bois sculpté']), molecules: ['Cédrène', 'α-Pinène'] },
        { code: 'ARC-081', name: 'PERSIA ACHAEMENID', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Persépolis, rose, safran, encens. Perse achéménide, 550-330 av. J.-C.', olfactiveProfile: JSON.stringify(['rose persane', 'safran', 'encens', 'bois précieux']), molecules: ['Phényléthanol', 'Safranal', 'α-Pinène'] },
        { code: 'ARC-082', name: 'EGYPT KYPHI', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Kyphi égyptien, encens sacré, myrrhe, résine. Égypte, 3000-30 av. J.-C.', olfactiveProfile: JSON.stringify(['myrrhe', 'encens oliban', 'résine sacrée', 'miel']), molecules: ['α-Pinène', 'Phényléthanol'] },
        { code: 'ARC-083', name: 'CARTHAGE HARBOR', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Port de Carthage, sel, poisson, résine marine. Carthage, 814-146 av. J.-C.', olfactiveProfile: JSON.stringify(['sel marin', 'poisson séché', 'résine marine', 'bois de cèdre']), molecules: ['Cédrène', 'Guaiacol'] },
        { code: 'ARC-084', name: 'ROME THERMAE', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Thermes romains, huile, vapeur, marbre. Rome, 1er-4e siècle.', olfactiveProfile: JSON.stringify(['huile d\'olive', 'vapeur chaude', 'marbre', 'herbes méditerranéennes']), molecules: ['Linalol', 'α-Pinène', 'Géosmine'] },
        { code: 'ARC-085', name: 'BYZANTIUM GOLD', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Constantinople, encens, or, soie. Byzance, 330-1453.', olfactiveProfile: JSON.stringify(['encens byzantin', 'or', 'soie', 'rose orientale']), molecules: ['α-Pinène', 'Phényléthanol', 'Linalol'] },
        // INDE ANCIENNE
        { code: 'ARC-086', name: 'VEDIC FIRE', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Feu védique, ghee, bois de santal, herbes. Inde, 1500-500 av. J.-C.', olfactiveProfile: JSON.stringify(['ghee brûlé', 'santal', 'herbes sacrées', 'fumée douce']), molecules: ['Santalol', 'Guaiacol', 'Linalol'] },
        { code: 'ARC-087', name: 'MAURYA SPICE', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Empire maurya, épices, encens, santal. Inde, 322-185 av. J.-C.', olfactiveProfile: JSON.stringify(['épices chaudes', 'encens', 'santal', 'curcuma']), molecules: ['Santalol', 'α-Pinène', 'Linalol'] },
        // GRÈCE ANCIENNE
        { code: 'ARC-088', name: 'ATHENS AGORA', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Agora d\'Athènes, vin, thym, marbre. Athènes, 5e-4e siècle av. J.-C.', olfactiveProfile: JSON.stringify(['vin', 'thym', 'marbre', 'mer Égée']), molecules: ['Linalol', 'Géosmine'] },
        { code: 'ARC-089', name: 'SPARTA IRON', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Sparte, fer, sueur, poussière. Sparte, 800-146 av. J.-C.', olfactiveProfile: JSON.stringify(['fer', 'sueur', 'poussière', 'cuir']), molecules: ['Guaiacol', 'Géosmine'] },
        // EUROPE MÉDIÉVALE
        { code: 'ARC-090', name: 'PARIS 1300', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle', description: 'Paris médiéval, épices, fumée, boue. Paris, 1300 ap. J.-C.', olfactiveProfile: JSON.stringify(['épices', 'fumée', 'boue', 'herbes']), molecules: ['Linalol', 'Guaiacol', 'Géosmine'] },
        { code: 'ARC-091', name: 'PERFUMUM-91', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle — Série Expérimentale', description: 'Série expérimentale PERFUMUM #91 — Composition civilisationnelle expérimentale.', olfactiveProfile: JSON.stringify(['expérimental']), molecules: [] },
        { code: 'ARC-092', name: 'PERFUMUM-92', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle — Série Expérimentale', description: 'Série expérimentale PERFUMUM #92 — Composition civilisationnelle expérimentale.', olfactiveProfile: JSON.stringify(['expérimental']), molecules: [] },
        { code: 'ARC-093', name: 'PERFUMUM-93', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle — Série Expérimentale', description: 'Série expérimentale PERFUMUM #93 — Composition civilisationnelle expérimentale.', olfactiveProfile: JSON.stringify(['expérimental']), molecules: [] },
        { code: 'ARC-094', name: 'PERFUMUM-94', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle — Série Expérimentale', description: 'Série expérimentale PERFUMUM #94 — Composition civilisationnelle expérimentale.', olfactiveProfile: JSON.stringify(['expérimental']), molecules: [] },
        { code: 'ARC-095', name: 'PERFUMUM-95', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle — Série Expérimentale', description: 'Série expérimentale PERFUMUM #95 — Composition civilisationnelle expérimentale.', olfactiveProfile: JSON.stringify(['expérimental']), molecules: [] },
        { code: 'ARC-096', name: 'PERFUMUM-96', category: 'accord_experimental', subcategory: 'Archive Civilisationnelle — Série Expérimentale', description: 'Série expérimentale PERFUMUM #96 — Composition civilisationnelle expérimentale.', olfactiveProfile: JSON.stringify(['expérimental']), molecules: [] },
    ];

    // ===== 2. ACCORDS MOSSI (5 formules complètes) =====
    const mossiRecipes = [
        {
            code: 'MOSSI-01', name: 'Mossi Clair', category: 'accord_experimental', subcategory: 'Série Mossi — Burkina Faso',
            description: 'Accord diurne, aérien, évoquant la première lumière du Sahel. Base : oliban blanc, ionones, argile blanche, aldéhydes chauds.',
            olfactiveProfile: JSON.stringify(['poussière claire', 'encens blanc', 'lumière', 'sahel']),
            formulation: JSON.stringify({
                tete: [{ ingredient: 'Citrus sec', pct: 5 }, { ingredient: 'Aldéhydes chauds', pct: 3 }, { ingredient: 'Feuille d\'oranger sèche', pct: 2 }, { ingredient: 'Ozone minéral clair', pct: 1 }],
                coeur: [{ ingredient: 'Oliban clair', pct: 14 }, { ingredient: 'Argile blanche', pct: 10 }, { ingredient: 'Ionone blanche', pct: 8 }, { ingredient: 'Bois tendre', pct: 8 }],
                fond: [{ ingredient: 'Karité clair', pct: 10 }, { ingredient: 'Ambrettolide', pct: 4 }, { ingredient: 'Cèdre beige', pct: 12 }, { ingredient: 'Poussière blanche du Sahel', pct: 14 }]
            }),
            molecules: ['α-Pinène', 'Ionone', 'Cédrène', 'Géosmine']
        },
        {
            code: 'MOSSI-02', name: 'Mossi Sombre', category: 'accord_experimental', subcategory: 'Série Mossi — Burkina Faso',
            description: 'Accord nocturne, rituel, profond. Terre noire + myrrhe + bois.',
            olfactiveProfile: JSON.stringify(['ombre chaude', 'résine sacrée', 'terre humide']),
            formulation: JSON.stringify({
                tete: [{ ingredient: 'Fumée douce', pct: 4 }, { ingredient: 'Aldéhydes sombres', pct: 3 }],
                coeur: [{ ingredient: 'Myrrhe noire', pct: 10 }, { ingredient: 'Oliban brûlé', pct: 8 }, { ingredient: 'Terre noire', pct: 12 }, { ingredient: 'Bois de brousse', pct: 10 }],
                fond: [{ ingredient: 'Karité fumé sombre', pct: 20 }, { ingredient: 'Vetiver Assam', pct: 8 }, { ingredient: 'Styrax', pct: 7 }, { ingredient: 'Ambre profond', pct: 15 }]
            }),
            molecules: ['α-Pinène', 'Vétiverol', 'Guaiacol']
        },
        {
            code: 'MOSSI-03', name: 'Mossi du Feu', category: 'accord_experimental', subcategory: 'Série Mossi — Burkina Faso',
            description: 'Accord métallique, incandescent. Fer chaud + acacia brûlé.',
            olfactiveProfile: JSON.stringify(['incandescent', 'métallique', 'boisé-brûlé']),
            formulation: JSON.stringify({
                tete: [{ ingredient: 'Fer chaud', pct: 4 }, { ingredient: 'Aldéhydes métalliques', pct: 3 }, { ingredient: 'Fumée légère', pct: 3 }],
                coeur: [{ ingredient: 'Acacia brûlé', pct: 15 }, { ingredient: 'Charcoal africain', pct: 10 }, { ingredient: 'Bois sec', pct: 10 }],
                fond: [{ ingredient: 'Terre ferrique', pct: 20 }, { ingredient: 'Myrrhe chaude', pct: 10 }, { ingredient: 'Labdanum', pct: 10 }, { ingredient: 'Vetiver fumé', pct: 12 }]
            }),
            molecules: ['Guaiacol', 'Vétiverol', 'Géosmine']
        },
        {
            code: 'MOSSI-04', name: 'Mossi Verger Sacré', category: 'accord_experimental', subcategory: 'Série Mossi — Burkina Faso',
            description: 'Accord végétal sacré. Neem + karité vert + herbes sèches.',
            olfactiveProfile: JSON.stringify(['ombre fraîche', 'bois sacré', 'herbes sèches']),
            formulation: JSON.stringify({
                tete: [{ ingredient: 'Feuille verte', pct: 6 }, { ingredient: 'Aldéhyde feuille', pct: 3 }, { ingredient: 'Citrus sec', pct: 2 }, { ingredient: 'Ozone clair', pct: 2 }],
                coeur: [{ ingredient: 'Neem', pct: 12 }, { ingredient: 'Karité vert', pct: 8 }, { ingredient: 'Herbes sèches', pct: 10 }, { ingredient: 'Foin chaud', pct: 10 }],
                fond: [{ ingredient: 'Bois tendre', pct: 15 }, { ingredient: 'Ambrettolide', pct: 5 }, { ingredient: 'Cèdre clair', pct: 12 }, { ingredient: 'Résine douce', pct: 13 }]
            }),
            molecules: ['Linalol', 'Cédrène', 'Coumarine']
        },
        {
            code: 'MOSSI-05', name: 'Mossi Solaire', category: 'accord_experimental', subcategory: 'Série Mossi — Burkina Faso',
            description: 'Accord lumineux, chaud, glorieux. Encens doré + millet chaud.',
            olfactiveProfile: JSON.stringify(['solaire', 'noble', 'céréale sacrée']),
            formulation: JSON.stringify({
                tete: [{ ingredient: 'Aldéhydes chauds', pct: 5 }, { ingredient: 'Citron sec', pct: 3 }],
                coeur: [{ ingredient: 'Encens doré', pct: 20 }, { ingredient: 'Millet', pct: 15 }],
                fond: [{ ingredient: 'Labdanum', pct: 15 }, { ingredient: 'Terre claire', pct: 10 }]
            }),
            molecules: ['α-Pinène', 'Géosmine', 'Coumarine']
        },
    ];

    // Insérer les recettes Archive Civilisationnelle
    console.log('=== Import Archive Civilisationnelle (36 compositions) ===');
    for (const r of archiveRecipes) {
        const [ex] = await conn.execute('SELECT id FROM recettes WHERE name = ? LIMIT 1', [r.name]);
        if (ex.length > 0) { console.log(`  ~ ${r.code} déjà en base`); continue; }
        await conn.execute(
            `INSERT INTO recettes (name, category, gamme, description, notes, status, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, 'experimental', NOW(), NOW())`,
            [r.name, 'parfum', r.subcategory, r.description, r.olfactiveProfile]
        );
        recipesCreated++;
        console.log(`  ✓ ${r.code} — ${r.name}`);
    }

    // Insérer les recettes Mossi
    console.log('\n=== Import Accords Mossi (5 formules) ===');
    for (const r of mossiRecipes) {
        const [ex] = await conn.execute('SELECT id FROM recettes WHERE name = ? LIMIT 1', [r.name]);
        if (ex.length > 0) { console.log(`  ~ ${r.code} déjà en base`); continue; }
        await conn.execute(
            `INSERT INTO recettes (name, category, gamme, description, notes, formula, status, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, 'validated', NOW(), NOW())`,
            [r.name, 'parfum', r.subcategory, r.description, r.olfactiveProfile, r.formulation]
        );
        recipesCreated++;
        console.log(`  ✓ ${r.code} — ${r.name}`);
    }

    // ===== 3. RESEARCH ENTRY AX-01 ML Prédiction Olfactive =====
    console.log('\n=== Import Research Entry AX-01 ===');
    const [axEx] = await conn.execute('SELECT id FROM research_entries WHERE entry_code = ? LIMIT 1', ['AX-01']);
    if (axEx.length === 0) {
        const [axes] = await conn.execute('SELECT id FROM research_axes WHERE code LIKE "%AX%" LIMIT 1');
        const axisId = axes.length > 0 ? axes[0].id : null;
        await conn.execute(
            `INSERT INTO research_entries (entry_code, slug, title, summary, content, status, primary_axis_id, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, 'completed', ?, NOW(), NOW())`,
            [
                'AX-01',
                'ax-01-ml-prediction-olfactive',
                'AX-01 — ML Prédiction Olfactive',
                'Identification des approches Machine Learning pour prédire les profils olfactifs de molécules et d\'accords dans PERFUMUM. Graph Neural Networks, Random Forest, datasets Leffingwell/DREAM.',
                JSON.stringify({
                    etat_art: 'GNN dominent avec précision élevée (5000+ molécules). Faisabilité court terme : Random Forest/XGBoost avec 1000+ molécules.',
                    innovations_2025: ['Mol-PECO encodage positionnel 3D', 'Multitask Learning multi-catégories', 'Ordinal Prediction intensité', 'Blend Prediction accords'],
                    datasets: [{ name: 'Leffingwell', size: '~3500 molécules', usage: 'Standard industrie' }, { name: 'Goodscents', size: 'Étendu', usage: 'Base commerciale' }, { name: 'DREAM Olfaction', size: '~5000 molécules', usage: 'Benchmark académique' }],
                    solutions_commerciales: ['Osmo (osmo.ai) — GNN + Principal Odor Map', 'Scentalytics — ML personnalisé + IA générative', 'Fraunhofer IIS — Design matériaux'],
                    decision_requise: 'Valider approche Random Forest court terme + constituer dataset initial PERFUMUM'
                }),
                axisId
            ]
        );
        entriesCreated++;
        console.log('  ✓ AX-01 créée');
    } else {
        console.log('  ~ AX-01 déjà en base');
    }

    // ===== 4. BIBLIOGRAPHIES AX-01 =====
    console.log('\n=== Bibliographies AX-01 ===');
    const ax01Refs = [
        { key: 'google-gnn-2019', type: 'article', title: 'A Principal Odor Map Unifies Diverse Tasks in Human Olfactory Perception', authors: 'Google Research', year: 2019, journal: 'Science', doi: '10.1126/science.ade4401' },
        { key: 'mol-peco-2024', type: 'article', title: 'Mol-PECO: 3D Positional Encoding for Olfactory Prediction', authors: 'Szczęśniak et al.', year: 2024, journal: 'arXiv' },
        { key: 'blend-prediction-2025', type: 'article', title: 'Blend Prediction: GNN for Olfactory Accord Prediction', authors: 'Huber et al.', year: 2025, journal: 'Nature Chemistry' },
    ];
    let refsCreated = 0;
    for (const ref of ax01Refs) {
        const [ex] = await conn.execute('SELECT id FROM v3_references WHERE entry_key = ? LIMIT 1', [ref.key]);
        if (ex.length > 0) { console.log(`  ~ ${ref.key} déjà en base`); continue; }
        await conn.execute(
            `INSERT INTO v3_references (entry_key, entry_type, title, authors, year, journal, doi, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [ref.key, ref.type, ref.title, ref.authors, ref.year, ref.journal, ref.doi || null]
        );
        refsCreated++;
        console.log(`  ✓ ${ref.key}`);
    }

    // Résumé final
    const [totals] = await conn.execute(`SELECT 
        (SELECT COUNT(*) FROM recettes) as recettes,
        (SELECT COUNT(*) FROM research_entries) as entries,
        (SELECT COUNT(*) FROM v3_references) as refs`);
    console.log(`\n=== RÉSUMÉ ===`);
    console.log(`Recettes créées: ${recipesCreated} | Research entries: ${entriesCreated} | Refs: ${refsCreated}`);
    console.log(`TOTAUX: ${JSON.stringify(totals[0])}`);

    await conn.end();
}

main().catch(e => console.error('FATAL:', e.message));
