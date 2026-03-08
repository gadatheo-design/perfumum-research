/**
 * Import PF-15 Modules (Tabac, Indole & Skatole, Cheese Terpenic Line, Esters)
 * + Liaisons recettes ACC-01..ACC-06 ↔ plantes tabac/cannabis
 */
const mysql = require('mysql2/promise');

let conn;

async function runSql(sql, params = []) {
    const [rows] = await conn.execute(sql, params);
    return rows;
}

// ─── MOLÉCULES À CRÉER ──────────────────────────────────────────────────────

const newMolecules = [
    // Module Tabac — pyrolyse
    { name: 'Guaiacol', cas: '90-05-1', chemical_family: 'Phénol', olfactive_signature: 'Fumé, cuir, médicinal', notes: 'Produit de pyrolyse du caryophyllène et de la lignine. Présent dans le tabac fumé, le whisky, le café.' },
    { name: 'Créosol', cas: '93-51-6', chemical_family: 'Phénol méthylé', olfactive_signature: 'Fumé, boisé, épicé', notes: 'Isomère du guaiacol. Produit de combustion du tabac et du bois.' },
    { name: 'Syringol', cas: '91-10-1', chemical_family: 'Phénol diméthylé', olfactive_signature: 'Fumé, doux, vanillé', notes: 'Produit de pyrolyse de la lignine. Présent dans la fumée de bois et de tabac.' },
    { name: 'Isoprène', cas: '78-79-5', chemical_family: 'Monoterpène', olfactive_signature: 'Résineux, caoutchouc', notes: 'Produit de combustion des monoterpènes. Précurseur de nombreux terpènes.' },
    // Module Indole & Skatole
    { name: 'Indole', cas: '120-72-9', chemical_family: 'Hétérocycle azoté', olfactive_signature: 'Floral (jasmin), animal, fécal à haute concentration', notes: 'Présent naturellement dans le jasmin, la fleur d\'oranger, les excréments. Utilisé en parfumerie à très faibles doses (0.01-0.05%).' },
    { name: 'Skatole', cas: '83-34-1', chemical_family: 'Méthylindole', olfactive_signature: 'Animal, fécal, floral à ultra-dilution', notes: '3-méthylindole. Présent dans les excréments, le jasmin, la civet. Utilisé à 0.001-0.005% en parfumerie.' },
    // Module Cheese Terpenic Line
    { name: 'Acide butyrique', cas: '107-92-6', chemical_family: 'Acide carboxylique', olfactive_signature: 'Fromage, rance, sueur', notes: 'Responsable de l\'odeur de fromage fermenté. Présent dans le beurre rance, la sueur.' },
    { name: 'Acide isovalérique', cas: '503-74-2', chemical_family: 'Acide carboxylique', olfactive_signature: 'Fromage, pieds, houblon', notes: 'Présent dans le fromage, le houblon, la sueur. Utilisé en parfumerie pour les accords "cheese" et "cuir".' },
    { name: 'Diacétyle', cas: '431-03-8', chemical_family: 'Dicétone', olfactive_signature: 'Beurre, crème, caramel', notes: 'Produit de fermentation. Présent dans le beurre, la bière, le vin. Utilisé pour les accords lactés.' },
    { name: 'Méthyl mercaptan', cas: '74-93-1', chemical_family: 'Thiol', olfactive_signature: 'Soufré, chou, fromage', notes: 'Méthanethiol. Présent dans le fromage, l\'ail, les crucifères. Très puissant à l\'état pur.' },
    // Module Esters
    { name: 'Éthyl butyrate', cas: '105-54-4', chemical_family: 'Ester', olfactive_signature: 'Fruits tropicaux, ananas, fraise', notes: 'Ester fruité. Présent dans l\'ananas, la fraise, la mangue. Utilisé en parfumerie pour les accords fruités.' },
    { name: 'Isoamyl acétate', cas: '123-92-2', chemical_family: 'Ester', olfactive_signature: 'Banane, poire, bonbon', notes: 'Acétate d\'isoamyle. Présent dans la banane, la poire. Utilisé en parfumerie pour les accords fruités.' },
    { name: 'Méthyl anthranilate', cas: '134-20-3', chemical_family: 'Ester aromatique', olfactive_signature: 'Raisin, fleur d\'oranger, muscat', notes: 'Présent dans le raisin Concord, la fleur d\'oranger, le jasmin. Utilisé en parfumerie pour les accords floraux-fruités.' },
    { name: 'Éthyl décanoate', cas: '110-38-3', chemical_family: 'Ester', olfactive_signature: 'Rhum, pêche, cire', notes: 'Ester à longue chaîne. Présent dans le rhum, les fruits fermentés. Utilisé pour les accords alcoolisés-fruités.' },
    { name: 'Gamma-décalactone', cas: '706-14-9', chemical_family: 'Lactone', olfactive_signature: 'Pêche, abricot, crémeux', notes: 'Lactone fruitée. Présent dans la pêche, l\'abricot. Utilisé en parfumerie pour les accords fruités crémeux.' },
    { name: 'Éthyl phénylacétate', cas: '101-97-3', chemical_family: 'Ester aromatique', olfactive_signature: 'Miel, rose, benjoin', notes: 'Présent dans le miel, la rose, le benjoin. Utilisé pour les accords floraux-balsamiques.' },
];

// ─── RECETTES MODULES PF-15 ─────────────────────────────────────────────────

const moduleRecettes = [
    // Module Indole & Skatole — Gamme 1 Animal/Tabac/Oud
    {
        name: 'Black Oud Skin (Indole-Skatole)',
        category: 'resine_cbd',
        description: 'Accord animal-boisé. Oud noir, cuir chaud, légère note fécale civilisée, fond ambré et dense. Module Indole & Skatole Gamme 1.',
        notes_tete: 'Ciste, castoréum reconstitué',
        notes_coeur: '0.01% Skatole, 0.02% Indole, labdanum, patchouli',
        notes_fond: 'Vanilline, cédrérol, ambré dense',
        formula: JSON.stringify({ indole: '0.02%', skatole: '0.01%', ciste: '5%', labdanum: '10%', patchouli: '8%', vanilline: '3%', cedrerol: '5%' }),
        notes: 'Dilution indoliques 1:1000 dans éthanol. Maturation 15 jours.',
        status: 'experimental'
    },
    {
        name: 'Noir Tabac (Indole-Skatole)',
        category: 'tabac',
        description: 'Tabac fermenté, cuir humide, miel sombre, tonka et résine sèche. Module Indole & Skatole Gamme 1.',
        notes_tete: 'Absolue tabac, foin',
        notes_coeur: '0.02% Indole, 0.005% Skatole, coumarine, styrax',
        notes_fond: 'Isoquinoline, tonka, résine sèche',
        formula: JSON.stringify({ indole: '0.02%', skatole: '0.005%', absolue_tabac: '15%', coumarine: '5%', styrax: '8%', tonka: '5%' }),
        notes: 'Tabac cuiré. Maturation 15 jours.',
        status: 'experimental'
    },
    // Module Indole & Skatole — Gamme 2 Floral
    {
        name: 'White Jasmine Absolute (Indole)',
        category: 'parfum',
        description: 'Jasmin narcotique, propre mais charnel, floral rond. Module Indole & Skatole Gamme 2.',
        notes_tete: 'Benzyl acétate, linalool',
        notes_coeur: '0.02% Indole, traces Skatole, eugénol, méthyl anthranilate',
        notes_fond: 'Benzyl benzoate, santal',
        formula: JSON.stringify({ indole: '0.02%', skatole: 'traces', benzyl_acetate: '20%', linalool: '15%', eugenol: '5%', methyl_anthranilate: '3%' }),
        notes: 'Base florale + indoliques. Maturation 15 jours.',
        status: 'experimental'
    },
    // Module Cheese Terpenic Line
    {
        name: 'Fromage Noble (Cheese Terpenic)',
        category: 'parfum',
        description: 'Accord "cheese" de haute parfumerie. Acide butyrique + isovalérique + diacétyle à doses ultra-diluées. Module Cheese Terpenic Line.',
        notes_tete: 'Acide butyrique 0.1%, acide isovalérique 0.05%',
        notes_coeur: 'Diacétyle 0.2%, méthyl mercaptan traces',
        notes_fond: 'Labdanum, cire d\'abeille, ambre',
        formula: JSON.stringify({ acide_butyrique: '0.1%', acide_isovalerique: '0.05%', diacetyle: '0.2%', methyl_mercaptan: 'traces', labdanum: '10%' }),
        notes: 'Dilutions extrêmes requises. Maturation 21 jours.',
        status: 'experimental'
    },
    // Module Esters
    {
        name: 'Velvet Fruit (Ester Lab)',
        category: 'parfum',
        description: 'Fruits mûrs, fond rond et crémeux. Module Esters — Gamme Ester Lab.',
        notes_tete: '0.6% Éthyl butyrate, 0.3% Isoamyl acétate',
        notes_coeur: '0.2% Méthyl anthranilate, traces β-ionone',
        notes_fond: 'Acétate de benzyle, fond crémeux',
        formula: JSON.stringify({ ethyl_butyrate: '0.6%', isoamyl_acetate: '0.3%', methyl_anthranilate: '0.2%', beta_ionone: 'traces', benzyl_acetate: '5%' }),
        notes: 'Support alcool neutre 95°. Maturation 10-15 jours.',
        status: 'experimental'
    },
    {
        name: 'Rhum & Pêche (Ester Lab)',
        category: 'parfum',
        description: 'Rhum-pêche confite, fond boisé tabac. Module Esters — Gamme Ester Lab.',
        notes_tete: '0.5% Éthyl décanoate, 0.4% Gamma-décalactone',
        notes_coeur: '0.2% Isoamyl butyrate',
        notes_fond: 'Vanilline, alcool cinnamique, fond boisé tabac',
        formula: JSON.stringify({ ethyl_decanoate: '0.5%', gamma_decalactone: '0.4%', isoamyl_butyrate: '0.2%', vanilline: '3%', alcool_cinnamique: '2%' }),
        notes: 'Support alcool neutre 95°. Maturation 10-15 jours.',
        status: 'experimental'
    },
    {
        name: 'Nectar Noir (Ester Lab)',
        category: 'parfum',
        description: 'Benjoin/miel/tabac noir. Module Esters — Gamme Ester Lab.',
        notes_tete: '0.3% Éthyl phénylacétate, 0.2% Méthyl salicylate',
        notes_coeur: '0.2% Isoamyl tiglate',
        notes_fond: 'Ciste, styrax, fond balsamique',
        formula: JSON.stringify({ ethyl_phenylacetate: '0.3%', methyl_salicylate: '0.2%', isoamyl_tiglate: '0.2%', ciste: '5%', styrax: '8%' }),
        notes: 'Accord floral-balsamique. Maturation 10-15 jours.',
        status: 'experimental'
    },
    // Module Tabac — Reconstitutions
    {
        name: 'Tabac Blond Doux (Reconstitution)',
        category: 'tabac',
        description: 'Reconstitution terpénique tabac blond sans nicotine. Module Tabac PF-15.',
        notes_tete: 'β-ionone, farnésène',
        notes_coeur: 'Vanilline, linalol',
        notes_fond: 'Coumarine, fond doux sucré',
        formula: JSON.stringify({ beta_ionone: '5%', farnesene: '8%', vanilline: '10%', linalol: '8%', coumarine: '5%' }),
        notes: 'Reconstitution tabac noble applicable à des bases CBD.',
        status: 'experimental'
    },
    {
        name: 'Cigare Maduro (Reconstitution)',
        category: 'tabac',
        description: 'Reconstitution terpénique cigare maduro sans nicotine. Module Tabac PF-15.',
        notes_tete: 'Caryophyllène, humulène',
        notes_coeur: 'Damascone, guaiacol',
        notes_fond: 'Fond cuiré boisé profond',
        formula: JSON.stringify({ caryophyllene: '15%', humulene: '10%', damascone: '8%', guaiacol: '3%' }),
        notes: 'Reconstitution cigare maduro. Applicable bases CBD.',
        status: 'experimental'
    },
];

// ─── LIAISONS ACC ↔ PLANTES ─────────────────────────────────────────────────

const accLinks = [
    { recette_name: 'Oriental Mystique (ACC-01)', plant_names: ['Yenidje', 'Lebanese Red', 'Hindu Kush'] },
    { recette_name: 'Himalaya Sacré (ACC-02)', plant_names: ['Bidi', 'Hindu Kush', 'Afghan Kush'] },
    { recette_name: 'Malawi Fermenté (ACC-03)', plant_names: ['Perique', 'Virginia', 'Malawi Gold'] },
    { recette_name: 'Kif Authentique (ACC-04)', plant_names: ['Nicotiana rustica', 'Lebanese Red'] },
    { recette_name: 'Dokha Intense (ACC-05)', plant_names: ['Afghan Kush', 'Hindu Kush'] },
    { recette_name: 'Fleur CBD Délicate (ACC-06)', plant_names: ['Virginia', 'Hindu Kush'] },
    // Liaisons modules
    { recette_name: 'Noir Tabac (Indole-Skatole)', plant_names: ['Yenidje', 'Virginia'] },
    { recette_name: 'Cigare Maduro (Reconstitution)', plant_names: ['Nicotiana tabacum', 'Virginia'] },
    { recette_name: 'Tabac Blond Doux (Reconstitution)', plant_names: ['Virginia', 'Samsun'] },
];

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
    conn = await mysql.createConnection(process.env.DATABASE_URL);
    console.log('=== Import PF-15 Modules + Liaisons ACC ===\n');

    // 1) Créer les nouvelles molécules
    console.log('=== Création molécules ===');
    let molCreated = 0, molSkipped = 0;
    for (const mol of newMolecules) {
        const existing = await runSql('SELECT id FROM molecules WHERE name = ? LIMIT 1', [mol.name]);
        if (existing.length > 0) { molSkipped++; continue; }
        await runSql(
            `INSERT INTO molecules (name, chemicalFamily, olfactiveProfile, notes, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [mol.name, mol.chemical_family || null, mol.olfactive_signature || null, mol.notes || null]
        );
        molCreated++;
        console.log(`  ✓ Molécule: ${mol.name}`);
    }
    console.log(`Molécules: ${molCreated} créées, ${molSkipped} déjà en base\n`);

    // 2) Créer les recettes modules
    console.log('=== Création recettes modules ===');
    let recCreated = 0, recSkipped = 0;
    for (const r of moduleRecettes) {
        const existing = await runSql('SELECT id FROM recettes WHERE name = ? LIMIT 1', [r.name]);
        if (existing.length > 0) { recSkipped++; console.log(`  ~ ${r.name} (déjà en base)`); continue; }
        await runSql(
            `INSERT INTO recettes (name, description, category, notes_tete, notes_coeur, notes_fond,
             formula, notes, status, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [r.name, r.description || '', r.category || 'parfum',
             r.notes_tete || '', r.notes_coeur || '', r.notes_fond || '',
             r.formula || '{}', r.notes || '', r.status || 'experimental']
        );
        recCreated++;
        console.log(`  ✓ Recette: ${r.name}`);
    }
    console.log(`Recettes: ${recCreated} créées, ${recSkipped} déjà en base\n`);

    // 3) Liaisons recettes ↔ plantes (via table recette_plants si elle existe, sinon notes)
    // Vérifier si une table de liaison recettes-plantes existe
    const [tables] = await conn.execute("SHOW TABLES LIKE 'recette%'");
    console.log('Tables recette*:', tables.map(t => Object.values(t)[0]).join(', '));

    // Créer les liaisons ACC ↔ plantes en enrichissant les notes des recettes
    console.log('\n=== Enrichissement recettes ACC avec plantes ===');
    let linkCreated = 0;
    for (const link of accLinks) {
        const recettes = await runSql('SELECT id, notes FROM recettes WHERE name = ? LIMIT 1', [link.recette_name]);
        if (recettes.length === 0) { console.log(`  ~ Recette non trouvée: ${link.recette_name}`); continue; }
        const recette = recettes[0];

        // Chercher les plantes
        const plantIds = [];
        const plantNames = [];
        for (const pname of link.plant_names) {
            const plants = await runSql(
                'SELECT id, name FROM plants WHERE name LIKE ? OR latin_name LIKE ? LIMIT 1',
                [`%${pname}%`, `%${pname}%`]
            );
            if (plants.length > 0) {
                plantIds.push(plants[0].id);
                plantNames.push(plants[0].name);
            }
        }

        if (plantIds.length > 0) {
            // Enrichir les notes de la recette avec les liaisons plantes
            const existingNotes = recette.notes || '';
            const plantLink = `Plantes liées: ${plantNames.join(', ')} (IDs: ${plantIds.join(',')})`;
            if (!existingNotes.includes('Plantes liées:')) {
                await runSql(
                    'UPDATE recettes SET notes = CONCAT(IFNULL(notes, ""), ?) WHERE id = ?',
                    ['\n' + plantLink, recette.id]
                );
                linkCreated++;
                console.log(`  ✓ ${link.recette_name} → ${plantNames.join(', ')}`);
            } else {
                console.log(`  ~ ${link.recette_name} (liaisons déjà présentes)`);
            }
        }
    }
    console.log(`Liaisons recettes↔plantes: ${linkCreated} créées\n`);

    // 4) Liaisons molécules modules → plantes tabac/cannabis
    console.log('=== Liaisons molécules modules → plantes ===');
    const molPlantLinks = [
        { mol: 'Guaiacol', plants: ['Virginia', 'Nicotiana tabacum', 'Yenidje', 'Latakia'] },
        { mol: 'Créosol', plants: ['Latakia', 'Kentucky', 'Nicotiana tabacum'] },
        { mol: 'Syringol', plants: ['Latakia', 'Virginia', 'Nicotiana tabacum'] },
        { mol: 'Indole', plants: ['Jasminum sambac', 'Jasminum grandiflorum', 'Nicotiana tabacum'] },
        { mol: 'Skatole', plants: ['Nicotiana tabacum', 'Jasminum grandiflorum'] },
        { mol: 'Acide butyrique', plants: ['Nicotiana tabacum'] },
        { mol: 'Isoamyl acétate', plants: ['Nicotiana tabacum', 'Virginia'] },
        { mol: 'Gamma-décalactone', plants: ['Nicotiana tabacum', 'Virginia'] },
    ];

    let pmCreated = 0, pmSkipped = 0;
    for (const link of molPlantLinks) {
        const mols = await runSql('SELECT id FROM molecules WHERE name = ? LIMIT 1', [link.mol]);
        if (mols.length === 0) { console.log(`  ~ Molécule non trouvée: ${link.mol}`); continue; }
        const molId = mols[0].id;

        for (const pname of link.plants) {
            const plants = await runSql(
                'SELECT id, name FROM plants WHERE name LIKE ? OR latin_name LIKE ? LIMIT 1',
                [`%${pname}%`, `%${pname}%`]
            );
            if (plants.length === 0) { continue; }
            const plantId = plants[0].id;

            const existing = await runSql(
                'SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ? LIMIT 1',
                [plantId, molId]
            );
            if (existing.length > 0) { pmSkipped++; continue; }

            try {
                await runSql(
                    `INSERT INTO plant_molecules (plant_id, molecule_id, role, source, notes, created_at)
                     VALUES (?, ?, 'trace', 'pf15_modules', ?, NOW())`,
                    [plantId, molId, `Module PF-15: ${link.mol}`]
                );
                pmCreated++;
                console.log(`  ✓ ${link.mol} → ${plants[0].name}`);
            } catch (e) {
                if (!e.message.includes('Duplicate')) console.log(`  ✗ ${link.mol} → ${pname}: ${e.message}`);
                else pmSkipped++;
            }
        }
    }
    console.log(`Liaisons mol→plantes: ${pmCreated} créées, ${pmSkipped} déjà en base\n`);

    // 5) Research entries pour les modules
    console.log('=== Research entries modules ===');
    const resEntries = [
        { code: 'PF-15-MOD-TABAC', title: 'Module Tabac — Terpènes, Combustion, Reconstitutions', axis: 'AX9' },
        { code: 'PF-15-MOD-INDOLE', title: 'Module Indole & Skatole — Bases Animal/Floral/Hybrides', axis: 'AX9' },
        { code: 'PF-15-MOD-CHEESE', title: 'Module Cheese Terpenic Line — Acides Gras, Cétones, Soufrés', axis: 'AX9' },
        { code: 'PF-15-MOD-ESTERS', title: 'Module Esters — Tabac, Fruité, Lactonique', axis: 'AX9' },
    ];

    // Trouver l'axe AX9
    const axes = await runSql("SELECT id FROM research_axes WHERE code = 'AX9' OR name LIKE '%Terroir%' LIMIT 1");
    const axisId = axes.length > 0 ? axes[0].id : null;

    let reCreated = 0;
    for (const re of resEntries) {
        const existing = await runSql('SELECT id FROM research_entries WHERE entry_code = ? LIMIT 1', [re.code]);
        if (existing.length > 0) { console.log(`  ~ ${re.code} (déjà en base)`); continue; }
        const slug = re.code.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await runSql(
            `INSERT INTO research_entries (entry_code, title, slug, primary_axis_id, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, 'in_progress', NOW(), NOW())`,
            [re.code, re.title, slug, axisId]
        );
        reCreated++;
        console.log(`  ✓ ${re.code}`);
    }
    console.log(`Research entries: ${reCreated} créées\n`);

    // Résumé final
    const [totals] = await conn.execute(`
        SELECT 
            (SELECT COUNT(*) FROM plants) as plants,
            (SELECT COUNT(*) FROM molecules) as molecules,
            (SELECT COUNT(*) FROM recettes) as recettes,
            (SELECT COUNT(*) FROM plant_molecules) as pm_links,
            (SELECT COUNT(*) FROM research_entries) as research_entries
    `);
    console.log('=== RÉSUMÉ FINAL ===');
    console.log(JSON.stringify(totals[0], null, 2));

    await conn.end();
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
