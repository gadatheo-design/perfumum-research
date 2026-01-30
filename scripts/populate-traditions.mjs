/**
 * Script pour compléter les traditions olfactives avec des civilisations manquantes
 * Ajoute des civilisations historiques avec leurs matériaux symboliques et temporalités
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:root@127.0.0.1:4000/perfumum_research';

// Nouvelles civilisations à ajouter
const newTraditions = [
  {
    name: "Perse Sassanide",
    region: "Iran / Mésopotamie",
    temporality: "antique",
    symbolicMaterials: JSON.stringify(["rose de Damas", "ambre gris", "musc", "safran", "nard", "encens oliban"]),
    longDescription: `L'Empire sassanide (224-651) a développé une culture olfactive raffinée, héritière des traditions perses achéménides. La rose de Damas (Rosa × damascena) était cultivée à grande échelle pour la production d'eau de rose et d'attar. Les parfums persans étaient réputés dans tout le monde antique, exportés via la Route de la Soie. Le musc et l'ambre gris, importés d'Asie centrale et de l'océan Indien, étaient des ingrédients de prestige utilisés dans les cérémonies zoroastriennes et à la cour royale. Le safran de Perse était considéré comme le plus précieux au monde.`
  },
  {
    name: "Empire Ottoman",
    region: "Turquie / Balkans / Moyen-Orient",
    temporality: "medieval",
    symbolicMaterials: JSON.stringify(["rose turque", "oud", "ambre", "musc", "jasmin", "bois de santal", "benjoin"]),
    longDescription: `L'Empire ottoman (1299-1922) a créé une tradition parfumée distinctive mêlant influences arabes, persanes et byzantines. Les hammams ottomans utilisaient des parfums spécifiques pour chaque étape du rituel. L'oud (bois d'agar) était particulièrement prisé, importé d'Asie du Sud-Est. La rose d'Isparta en Anatolie rivalisait avec celle de Damas. Les parfumeurs du Grand Bazar d'Istanbul étaient organisés en guildes et leurs créations étaient exportées dans toute l'Europe. Le café turc était parfumé à la cardamome et au mastic.`
  },
  {
    name: "Royaume d'Ayutthaya",
    region: "Thaïlande / Asie du Sud-Est",
    temporality: "medieval",
    symbolicMaterials: JSON.stringify(["bois de santal", "jasmin sambac", "ylang-ylang", "camphre", "benjoin de Siam", "bois d'agar"]),
    longDescription: `Le royaume d'Ayutthaya (1351-1767) était un centre majeur du commerce des épices et des matières aromatiques en Asie du Sud-Est. Le benjoin de Siam (Styrax tonkinensis) était exporté vers la Chine et l'Europe. Les temples bouddhistes utilisaient des encens élaborés à base de bois de santal et d'agar. La tradition du "nam ob" (eau parfumée) pour les cérémonies royales perdure encore aujourd'hui. Les jardins royaux cultivaient jasmin, champaca et frangipaniers pour les offrandes et la parfumerie.`
  },
  {
    name: "Empire Majapahit",
    region: "Indonésie / Archipel malais",
    temporality: "medieval",
    symbolicMaterials: JSON.stringify(["clou de girofle", "muscade", "macis", "patchouli", "vétiver", "bois d'agar", "benjoin de Sumatra"]),
    longDescription: `L'empire Majapahit (1293-1527) contrôlait les îles aux épices (Moluques) et dominait le commerce des aromates dans l'archipel indonésien. Le clou de girofle (Syzygium aromaticum) et la muscade (Myristica fragrans) étaient des monopoles jalousement gardés. Le patchouli était utilisé pour parfumer les textiles exportés vers la Chine et l'Inde. Les rituels hindou-bouddhistes utilisaient des encens complexes. Le bois d'agar (gaharu) de Kalimantan était considéré comme le plus précieux au monde.`
  },
  {
    name: "Empire Songhaï",
    region: "Afrique de l'Ouest / Sahel",
    temporality: "medieval",
    symbolicMaterials: JSON.stringify(["encens oliban", "myrrhe", "ambre gris", "musc", "beurre de karité parfumé", "gomme arabique"]),
    longDescription: `L'Empire songhaï (1464-1591) contrôlait les routes transsahariennes du commerce de l'encens et des aromates. Tombouctou était un centre intellectuel où les parfums étaient étudiés dans le cadre de la médecine islamique. L'ambre gris, échoué sur les côtes atlantiques, était collecté et exporté vers le Maghreb et le Moyen-Orient. Les femmes songhaï utilisaient des huiles parfumées au karité et des encens pour les cérémonies. La gomme arabique du Sahel était un fixateur précieux pour les parfums.`
  },
  {
    name: "Empire Aztèque",
    region: "Mésoamérique / Mexique central",
    temporality: "medieval",
    symbolicMaterials: JSON.stringify(["copal", "cacao", "vanille", "liquidambar", "tabac", "fleur de magnolia", "fleur de cempasúchil"]),
    longDescription: `L'Empire aztèque (1300-1521) avait développé une culture olfactive sophistiquée liée aux rituels religieux. Le copal (Protium copal) était brûlé en quantités massives dans les temples. La vanille (Vanilla planifolia) parfumait le chocolat cérémoniel. Le liquidambar (Liquidambar styraciflua) produisait un baume précieux. Les nobles portaient des bouquets de fleurs parfumées et des tubes de tabac aromatisé. La fleur de cempasúchil (tagète) était associée aux rituels mortuaires et reste centrale dans le Día de los Muertos.`
  },
  {
    name: "Empire Inca",
    region: "Andes / Amérique du Sud",
    temporality: "medieval",
    symbolicMaterials: JSON.stringify(["coca", "molle", "copal andin", "quinoa rituel", "résine de tola", "muña"]),
    longDescription: `L'Empire inca (1438-1533) utilisait les plantes aromatiques dans un contexte rituel et médicinal. La coca (Erythroxylum coca) était sacrée et son arôme associé aux cérémonies. Le molle (Schinus molle) parfumait la chicha cérémonielle. Les résines andines étaient brûlées lors des offrandes aux apus (esprits des montagnes). La muña (Minthostachys mollis), menthe andine, était utilisée en médecine et parfumerie. Les momies incas étaient embaumées avec des résines et des herbes aromatiques.`
  },
  {
    name: "Polynésie Traditionnelle",
    region: "Pacifique / Océanie",
    temporality: "archaic",
    symbolicMaterials: JSON.stringify(["tiaré", "santal du Pacifique", "ylang-ylang", "frangipane", "noix de coco", "gingembre sauvage"]),
    longDescription: `Les cultures polynésiennes (1000-1800) ont développé une tradition olfactive unique adaptée à leur environnement insulaire. Le tiaré (Gardenia taitensis) est emblématique de Tahiti, utilisé pour le monoï traditionnel. Le santal du Pacifique (Santalum austrocaledonicum) était un bois précieux exporté vers la Chine. L'ylang-ylang des îles parfumait les huiles corporelles. Les navigateurs polynésiens utilisaient leur odorat pour détecter les îles à distance. Les cérémonies religieuses utilisaient des guirlandes de fleurs parfumées.`
  },
  {
    name: "Vikings et Scandinaves",
    region: "Scandinavie / Europe du Nord",
    temporality: "medieval",
    symbolicMaterials: JSON.stringify(["ambre baltique", "pin", "bouleau", "genévrier", "angélique", "miel fermenté"]),
    longDescription: `Les Vikings (793-1066) avaient une relation particulière avec les aromates, à la fois comme marchandises commerciales et éléments rituels. L'ambre baltique, bien que non odorant, était associé au soleil et aux parfums. Les saunas scandinaves utilisaient des branches de bouleau et de genévrier. L'angélique (Angelica archangelica) était une plante sacrée aux propriétés médicinales et aromatiques. Les Vikings commerçaient l'encens et les épices orientales via les routes de la Volga. L'hydromel parfumé aux herbes était une boisson cérémonielle.`
  },
  {
    name: "Celtes Insulaires",
    region: "Îles Britanniques / Irlande",
    temporality: "archaic",
    symbolicMaterials: JSON.stringify(["gui", "chêne", "miel", "bruyère", "menthe sauvage", "reine-des-prés"]),
    longDescription: `Les Celtes insulaires (800 av. J.-C. - 400 ap. J.-C.) avaient une tradition olfactive liée au druidisme et aux cycles naturels. Le gui (Viscum album) était sacré et son odeur associée aux rituels solsticiaux. Le chêne était l'arbre sacré des druides. La reine-des-prés (Filipendula ulmaria) parfumait l'hydromel et les cérémonies. Les tourbières préservaient des offrandes de plantes aromatiques. La bruyère (Calluna vulgaris) parfumait le miel et les boissons fermentées. Les Celtes utilisaient des huiles parfumées pour les soins corporels et les rites funéraires.`
  },
  {
    name: "Royaume de Saba",
    region: "Yémen / Arabie du Sud",
    temporality: "antique",
    symbolicMaterials: JSON.stringify(["encens oliban", "myrrhe", "aloès", "cinnamome", "ladanum", "baume de La Mecque"]),
    longDescription: `Le royaume de Saba (1200 av. J.-C. - 275 ap. J.-C.) contrôlait la Route de l'Encens, l'une des plus anciennes routes commerciales du monde. L'oliban (Boswellia sacra) et la myrrhe (Commiphora myrrha) étaient les piliers de cette économie. Les Sabéens avaient développé des techniques sophistiquées de récolte et de conservation des résines. Les temples de Marib brûlaient des quantités massives d'encens. L'aloès du Yémen (Aloe vera) était exporté vers l'Égypte et la Méditerranée. Cette tradition a profondément influencé les cultures juive, chrétienne et islamique.`
  },
  {
    name: "Phénicie",
    region: "Liban / Méditerranée orientale",
    temporality: "antique",
    symbolicMaterials: JSON.stringify(["cèdre du Liban", "murex (pourpre)", "styrax", "labdanum", "résine de pin", "huile d'olive parfumée"]),
    longDescription: `Les Phéniciens (1500-300 av. J.-C.) étaient les grands commerçants de la Méditerranée antique et ont diffusé les parfums orientaux vers l'Occident. Le cèdre du Liban (Cedrus libani) était leur bois sacré, utilisé dans les temples et l'embaumement. Ils ont inventé la pourpre de Tyr, extraite du murex, dont l'odeur caractéristique était associée au luxe. Le styrax (Liquidambar orientalis) était récolté dans leurs forêts. Ils ont établi des comptoirs commerciaux de Carthage à l'Espagne, diffusant encens, myrrhe et épices.`
  },
  {
    name: "Éthiopie Axoumite",
    region: "Corne de l'Afrique",
    temporality: "antique",
    symbolicMaterials: JSON.stringify(["encens d'Éthiopie", "myrrhe", "café", "kosso", "gesho", "tej (hydromel)"]),
    longDescription: `Le royaume d'Axoum (100-940) était un carrefour commercial entre l'Afrique, l'Arabie et l'Inde. L'encens éthiopien (Boswellia papyrifera) était distinct de l'oliban yéménite. Le café (Coffea arabica), originaire d'Éthiopie, a une dimension olfactive centrale dans la cérémonie du café éthiopien. Le tej, hydromel parfumé au gesho (Rhamnus prinoides), est une boisson cérémonielle millénaire. L'Église orthodoxe éthiopienne a préservé des traditions d'encens uniques. Les marchés d'Axoum échangeaient aromates africains et épices indiennes.`
  },
  {
    name: "Japon Heian",
    region: "Japon",
    temporality: "medieval",
    symbolicMaterials: JSON.stringify(["bois d'agar (jinko)", "bois de santal", "clou de girofle", "camphre", "musc", "encens composé (kō)"]),
    longDescription: `L'époque Heian (794-1185) a vu l'apogée de la culture olfactive japonaise avec le développement du kōdō (voie de l'encens). Les nobles de la cour impériale créaient des mélanges d'encens personnalisés (takimono) qui servaient de signature olfactive. Le Genji Monogatari décrit en détail ces pratiques. Le jinko (bois d'agar) importé d'Asie du Sud-Est était classifié en six catégories selon son origine. Les robes étaient parfumées par fumigation. Cette tradition a évolué vers le kōdō moderne, art de l'appréciation de l'encens comparable à la cérémonie du thé.`
  },
  {
    name: "Inde Moghole",
    region: "Sous-continent indien",
    temporality: "medieval",
    symbolicMaterials: JSON.stringify(["attar de rose", "jasmin", "vétiver", "santal", "musc", "ambre", "kewra (pandanus)"]),
    longDescription: `L'Empire moghol (1526-1857) a porté la parfumerie indienne à son apogée. Les empereurs moghols, notamment Jahangir et Shah Jahan, étaient des connaisseurs passionnés. L'attar (huile essentielle traditionnelle) de rose de Kannauj était le plus prisé. Le vétiver (khus) rafraîchissait les palais en été. Le jasmin sambac parfumait les jardins moghols. Les techniques de distillation ont été perfectionnées. Le Taj Mahal était conçu avec des jardins parfumés. Cette tradition a influencé la parfumerie européenne via les échanges commerciaux.`
  }
];

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('🏛️ Ajout des civilisations manquantes aux traditions olfactives...\n');
  
  let added = 0;
  let skipped = 0;
  
  for (const tradition of newTraditions) {
    // Vérifier si la tradition existe déjà
    const [existing] = await connection.execute(
      'SELECT id FROM traditions_olfactives WHERE name = ?',
      [tradition.name]
    );
    
    if (existing.length > 0) {
      console.log(`  ⏭️ "${tradition.name}" existe déjà`);
      skipped++;
      continue;
    }
    
    try {
      await connection.execute(`
        INSERT INTO traditions_olfactives 
        (name, region, temporality, symbolicMaterials, longDescription, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        tradition.name,
        tradition.region,
        tradition.temporality,
        tradition.symbolicMaterials,
        tradition.longDescription
      ]);
      
      console.log(`  ✅ "${tradition.name}" ajoutée (${tradition.region}, ${tradition.temporality})`);
      added++;
    } catch (err) {
      console.error(`  ❌ Erreur pour "${tradition.name}": ${err.message}`);
    }
  }
  
  // Compter le total
  const [total] = await connection.execute('SELECT COUNT(*) as count FROM traditions_olfactives');
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ');
  console.log('='.repeat(60));
  console.log(`Traditions ajoutées: ${added}`);
  console.log(`Traditions existantes (ignorées): ${skipped}`);
  console.log(`Total traditions dans la base: ${total[0].count}`);
  
  await connection.end();
  console.log('\n✅ Peuplement terminé!');
}

main().catch(console.error);
