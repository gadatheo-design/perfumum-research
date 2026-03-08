const mysql = require('mysql2/promise');

async function main() {
    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    
    const accLinks = [
        { recette: 'Oriental Mystique (ACC-01)', plants: ['Yenidje', 'Lebanese Red', 'Hindu Kush'], proportions: ['60g', '20g', '20g'] },
        { recette: 'Himalaya Sacré (ACC-02)', plants: ['Bidi', 'Hindu Kush', 'Afghan Kush'], proportions: ['50g', '30g', '20g'] },
        { recette: 'Malawi Fermenté (ACC-03)', plants: ['Perique', 'Virginia', 'Malawi Gold'], proportions: ['15g', '40g', '30g'] },
        { recette: 'Kif Authentique (ACC-04)', plants: ['Nicotiana rustica', 'Lebanese Red'], proportions: ['67g', '33g'] },
        { recette: 'Dokha Intense (ACC-05)', plants: ['Afghan Kush', 'Hindu Kush'], proportions: ['65g', '35g'] },
        { recette: 'Fleur CBD Délicate (ACC-06)', plants: ['Virginia', 'Hindu Kush'], proportions: ['50g', '50g'] },
    ];
    
    let created = 0, skipped = 0;
    
    for (const link of accLinks) {
        const [recettes] = await conn.execute('SELECT id FROM recettes WHERE name = ? LIMIT 1', [link.recette]);
        if (recettes.length === 0) { console.log('~ Recette non trouvée:', link.recette); continue; }
        const recetteId = recettes[0].id;
        
        for (let i = 0; i < link.plants.length; i++) {
            const pname = link.plants[i];
            const proportion = link.proportions[i];
            
            const [plants] = await conn.execute(
                'SELECT id, name FROM plants WHERE name LIKE ? OR latin_name LIKE ? LIMIT 1',
                ['%' + pname + '%', '%' + pname + '%']
            );
            if (plants.length === 0) { console.log('~ Plante non trouvée:', pname); continue; }
            const plantId = plants[0].id;
            
            const [existing] = await conn.execute(
                'SELECT id FROM recette_tabac_associations WHERE recette_id = ? AND tabac_id = ? LIMIT 1',
                [recetteId, plantId]
            );
            if (existing.length > 0) { skipped++; continue; }
            
            await conn.execute(
                `INSERT INTO recette_tabac_associations (recette_id, tabac_id, proportion, compatibility, recommended, created_at, updated_at)
                 VALUES (?, ?, ?, 85, 1, NOW(), NOW())`,
                [recetteId, plantId, proportion]
            );
            created++;
            console.log('  ✓', link.recette, '→', plants[0].name, '(' + proportion + ')');
        }
    }
    
    console.log('\nLiaisons recette_tabac_associations:', created, 'créées,', skipped, 'déjà en base');
    
    const [totals] = await conn.execute(`SELECT 
        (SELECT COUNT(*) FROM recette_tabac_associations) as rta_links,
        (SELECT COUNT(*) FROM recettes) as recettes,
        (SELECT COUNT(*) FROM plants) as plants,
        (SELECT COUNT(*) FROM molecules) as molecules,
        (SELECT COUNT(*) FROM plant_molecules) as pm_links,
        (SELECT COUNT(*) FROM research_entries) as research_entries`);
    console.log('\n=== RÉSUMÉ FINAL ===');
    console.log(JSON.stringify(totals[0], null, 2));
    
    await conn.end();
}

main().catch(e => console.error('FATAL:', e.message));
