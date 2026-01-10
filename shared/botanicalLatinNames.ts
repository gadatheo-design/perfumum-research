/**
 * PERFUMUM — Dictionnaire des noms latins botaniques et numéros CAS
 * 
 * Ce fichier contient les correspondances entre :
 * - Noms communs des plantes et leurs noms latins (binomiaux)
 * - Noms des molécules et leurs numéros CAS (Chemical Abstracts Service)
 * 
 * Utilisé pour enrichir les requêtes de recherche avec la nomenclature scientifique.
 */

// ============================================================================
// NOMS LATINS DES PLANTES AROMATIQUES
// ============================================================================

/**
 * Correspondances nom commun → nom latin (nomenclature binomiale)
 * Format: 'nom commun': ['nom latin', 'variantes', 'synonymes botaniques']
 */
export const botanicalLatinNames: Record<string, string[]> = {
  // Agrumes / Citrus
  'bergamote': ['Citrus bergamia', 'Citrus aurantium var. bergamia', 'citrus bergamia risso'],
  'citron': ['Citrus limon', 'Citrus × limon', 'citrus limonum'],
  'citron vert': ['Citrus aurantiifolia', 'Citrus × aurantiifolia', 'lime'],
  'lime': ['Citrus aurantiifolia', 'Citrus × aurantiifolia', 'citron vert'],
  'orange': ['Citrus sinensis', 'Citrus × sinensis', 'orange douce'],
  'orange amère': ['Citrus aurantium', 'Citrus × aurantium', 'bigarade', 'bigaradier'],
  'mandarine': ['Citrus reticulata', 'Citrus nobilis', 'tangerine'],
  'pamplemousse': ['Citrus × paradisi', 'Citrus paradisi', 'grapefruit'],
  'yuzu': ['Citrus junos', 'Citrus × junos', 'citrus japonais'],
  'cédrat': ['Citrus medica', 'citron cédrat', 'main de bouddha'],
  'combava': ['Citrus hystrix', 'kaffir lime', 'combawa', 'makrut'],
  'néroli': ['Citrus aurantium var. amara', 'fleur d\'oranger', 'orange blossom'],
  'petit grain': ['Citrus aurantium', 'petitgrain bigarade', 'feuille d\'oranger'],

  // Fleurs
  'rose': ['Rosa damascena', 'Rosa centifolia', 'Rosa gallica', 'rosa × damascena'],
  'jasmin': ['Jasminum grandiflorum', 'Jasminum officinale', 'Jasminum sambac'],
  'ylang-ylang': ['Cananga odorata', 'cananga odorata genuina', 'ilang-ilang'],
  'ylang': ['Cananga odorata', 'ylang-ylang', 'ilang'],
  'tubéreuse': ['Polianthes tuberosa', 'Agave amica', 'tuberose'],
  'muguet': ['Convallaria majalis', 'lily of the valley', 'muguet de mai'],
  'iris': ['Iris pallida', 'Iris germanica', 'Iris florentina', 'orris'],
  'violette': ['Viola odorata', 'violette odorante', 'sweet violet'],
  'gardénia': ['Gardenia jasminoides', 'Gardenia augusta', 'cape jasmine'],
  'magnolia': ['Magnolia grandiflora', 'Magnolia × soulangeana', 'magnolia champaca'],
  'champaca': ['Magnolia champaca', 'Michelia champaca', 'champak'],
  'frangipane': ['Plumeria rubra', 'Plumeria alba', 'frangipani'],
  'frangipanier': ['Plumeria rubra', 'Plumeria alba', 'frangipane'],
  'pivoine': ['Paeonia lactiflora', 'Paeonia officinalis', 'peony'],
  'œillet': ['Dianthus caryophyllus', 'carnation', 'clove pink'],
  'osmanthus': ['Osmanthus fragrans', 'olive parfumée', 'sweet olive'],
  'mimosa': ['Acacia dealbata', 'Acacia decurrens', 'mimosa d\'hiver'],
  'fleur d\'oranger': ['Citrus aurantium', 'néroli', 'orange blossom'],
  'héliotrope': ['Heliotropium arborescens', 'heliotrope', 'cherry pie'],
  'narcisse': ['Narcissus poeticus', 'Narcissus jonquilla', 'daffodil'],
  'jonquille': ['Narcissus jonquilla', 'jonquil', 'narcisse'],
  'lys': ['Lilium candidum', 'Lilium longiflorum', 'lily'],
  'lis': ['Lilium candidum', 'Lilium longiflorum', 'lys'],

  // Bois
  'santal': ['Santalum album', 'Santalum spicatum', 'sandalwood', 'bois de santal'],
  'cèdre': ['Cedrus atlantica', 'Cedrus deodara', 'Cedrus libani', 'cedar'],
  'cèdre de l\'atlas': ['Cedrus atlantica', 'atlas cedar', 'cèdre bleu'],
  'cèdre de virginie': ['Juniperus virginiana', 'virginia cedar', 'red cedar'],
  'vétiver': ['Chrysopogon zizanioides', 'Vetiveria zizanioides', 'khus'],
  'patchouli': ['Pogostemon cablin', 'Pogostemon patchouli', 'patchouly'],
  'oud': ['Aquilaria malaccensis', 'Aquilaria agallocha', 'agarwood', 'bois d\'agar'],
  'agarwood': ['Aquilaria malaccensis', 'Aquilaria agallocha', 'oud', 'bois d\'aigle'],
  'gaïac': ['Guaiacum officinale', 'Bulnesia sarmientoi', 'guaiac wood'],
  'cyprès': ['Cupressus sempervirens', 'cypress', 'cyprès méditerranéen'],
  'genévrier': ['Juniperus communis', 'juniper', 'genièvre'],
  'pin': ['Pinus sylvestris', 'Pinus pinaster', 'pine', 'pin sylvestre'],
  'sapin': ['Abies alba', 'Abies balsamea', 'fir', 'sapin baumier'],
  'bouleau': ['Betula alba', 'Betula pendula', 'birch', 'bouleau blanc'],
  'chêne': ['Quercus robur', 'Quercus petraea', 'oak'],
  'mousse de chêne': ['Evernia prunastri', 'oakmoss', 'mousse d\'arbre'],
  'mousse d\'arbre': ['Evernia furfuracea', 'treemoss', 'mousse de chêne'],
  'bois de rose': ['Aniba rosaeodora', 'rosewood', 'pau rosa'],

  // Résines et baumes
  'encens': ['Boswellia sacra', 'Boswellia carterii', 'frankincense', 'oliban'],
  'oliban': ['Boswellia sacra', 'Boswellia carterii', 'encens', 'frankincense'],
  'myrrhe': ['Commiphora myrrha', 'Commiphora molmol', 'myrrh'],
  'benjoin': ['Styrax benzoin', 'Styrax tonkinensis', 'benzoin', 'benjoin de Siam'],
  'labdanum': ['Cistus ladanifer', 'Cistus creticus', 'ciste', 'rock rose'],
  'ciste': ['Cistus ladanifer', 'Cistus creticus', 'labdanum', 'rockrose'],
  'opoponax': ['Commiphora guidottii', 'Commiphora erythraea', 'sweet myrrh'],
  'élémi': ['Canarium luzonicum', 'elemi', 'résine élémi'],
  'baume de tolu': ['Myroxylon balsamum', 'Myroxylon toluiferum', 'tolu balsam'],
  'baume du pérou': ['Myroxylon pereirae', 'Myroxylon balsamum var. pereirae', 'peru balsam'],
  'styrax': ['Liquidambar orientalis', 'Liquidambar styraciflua', 'storax'],

  // Herbes aromatiques
  'lavande': ['Lavandula angustifolia', 'Lavandula officinalis', 'lavender'],
  'lavandin': ['Lavandula × intermedia', 'Lavandula hybrida', 'hybrid lavender'],
  'romarin': ['Rosmarinus officinalis', 'Salvia rosmarinus', 'rosemary'],
  'thym': ['Thymus vulgaris', 'Thymus zygis', 'thyme'],
  'sauge': ['Salvia officinalis', 'Salvia sclarea', 'sage'],
  'sauge sclarée': ['Salvia sclarea', 'clary sage', 'sauge musquée'],
  'basilic': ['Ocimum basilicum', 'Ocimum sanctum', 'basil'],
  'menthe': ['Mentha × piperita', 'Mentha spicata', 'mint', 'peppermint'],
  'menthe poivrée': ['Mentha × piperita', 'peppermint', 'menthe anglaise'],
  'menthe verte': ['Mentha spicata', 'spearmint', 'menthe douce'],
  'eucalyptus': ['Eucalyptus globulus', 'Eucalyptus radiata', 'eucalyptus'],
  'eucalyptus citronné': ['Eucalyptus citriodora', 'Corymbia citriodora', 'lemon eucalyptus'],
  'tea tree': ['Melaleuca alternifolia', 'arbre à thé', 'tea tree oil'],
  'arbre à thé': ['Melaleuca alternifolia', 'tea tree', 'melaleuca'],
  'origan': ['Origanum vulgare', 'Origanum majorana', 'oregano'],
  'marjolaine': ['Origanum majorana', 'sweet marjoram', 'marjolaine douce'],
  'estragon': ['Artemisia dracunculus', 'tarragon', 'herbe dragon'],
  'camomille': ['Matricaria chamomilla', 'Chamaemelum nobile', 'chamomile'],
  'camomille romaine': ['Chamaemelum nobile', 'Anthemis nobilis', 'roman chamomile'],
  'camomille allemande': ['Matricaria chamomilla', 'Matricaria recutita', 'german chamomile'],
  'géranium': ['Pelargonium graveolens', 'Pelargonium × asperum', 'rose geranium'],
  'géranium rosat': ['Pelargonium graveolens', 'Pelargonium roseum', 'rose geranium'],
  'citronnelle': ['Cymbopogon citratus', 'Cymbopogon flexuosus', 'lemongrass'],
  'lemongrass': ['Cymbopogon citratus', 'Cymbopogon flexuosus', 'citronnelle'],
  'palmarosa': ['Cymbopogon martinii', 'palmarosa oil', 'rosha grass'],
  'verveine': ['Lippia citriodora', 'Aloysia citrodora', 'lemon verbena'],
  'verveine citronnée': ['Lippia citriodora', 'Aloysia citrodora', 'lemon verbena'],

  // Épices
  'cannelle': ['Cinnamomum verum', 'Cinnamomum zeylanicum', 'cinnamon'],
  'cannelle de ceylan': ['Cinnamomum verum', 'Cinnamomum zeylanicum', 'true cinnamon'],
  'cannelle de chine': ['Cinnamomum cassia', 'Cinnamomum aromaticum', 'cassia'],
  'girofle': ['Syzygium aromaticum', 'Eugenia caryophyllata', 'clove'],
  'clou de girofle': ['Syzygium aromaticum', 'Eugenia caryophyllata', 'clove bud'],
  'poivre noir': ['Piper nigrum', 'black pepper', 'poivre'],
  'poivre rose': ['Schinus molle', 'Schinus terebinthifolius', 'pink pepper'],
  'cardamome': ['Elettaria cardamomum', 'cardamom', 'cardamome verte'],
  'gingembre': ['Zingiber officinale', 'ginger', 'gingembre frais'],
  'muscade': ['Myristica fragrans', 'nutmeg', 'noix de muscade'],
  'noix de muscade': ['Myristica fragrans', 'nutmeg', 'muscade'],
  'macis': ['Myristica fragrans', 'mace', 'fleur de muscade'],
  'safran': ['Crocus sativus', 'saffron', 'safran vrai'],
  'cumin': ['Cuminum cyminum', 'cumin', 'cumin des prés'],
  'coriandre': ['Coriandrum sativum', 'coriander', 'cilantro'],
  'anis': ['Pimpinella anisum', 'anise', 'anis vert'],
  'anis étoilé': ['Illicium verum', 'star anise', 'badiane'],
  'badiane': ['Illicium verum', 'star anise', 'anis étoilé'],
  'fenouil': ['Foeniculum vulgare', 'fennel', 'fenouil doux'],
  'curcuma': ['Curcuma longa', 'turmeric', 'safran des indes'],

  // Autres plantes aromatiques
  'vanille': ['Vanilla planifolia', 'Vanilla tahitensis', 'vanilla'],
  'fève tonka': ['Dipteryx odorata', 'tonka bean', 'coumarou'],
  'tonka': ['Dipteryx odorata', 'tonka bean', 'fève tonka'],
  'galbanum': ['Ferula galbaniflua', 'Ferula gummosa', 'galbanum resin'],
  'angélique': ['Angelica archangelica', 'angelica', 'archangélique'],
  'carotte': ['Daucus carota', 'carrot seed', 'carotte sauvage'],
  'céleri': ['Apium graveolens', 'celery seed', 'céleri'],
  'immortelle': ['Helichrysum italicum', 'everlasting', 'hélichryse'],
  'hélichryse': ['Helichrysum italicum', 'immortelle', 'everlasting'],
  'tagète': ['Tagetes minuta', 'Tagetes erecta', 'marigold'],
  'tagetes': ['Tagetes minuta', 'Tagetes erecta', 'tagète'],
  'absinthe': ['Artemisia absinthium', 'wormwood', 'grande absinthe'],
  'armoise': ['Artemisia vulgaris', 'mugwort', 'armoise commune'],
  'hysope': ['Hyssopus officinalis', 'hyssop', 'hysope officinale'],
  'genêt': ['Spartium junceum', 'Cytisus scoparius', 'broom'],
  'cassie': ['Acacia farnesiana', 'sweet acacia', 'cassie flower'],
  'foin': ['hay absolute', 'coumarine', 'foin coupé'],
  'tabac': ['Nicotiana tabacum', 'tobacco', 'tabac blond'],
  'cannabis': ['Cannabis sativa', 'hemp', 'chanvre'],
  'chanvre': ['Cannabis sativa', 'hemp', 'cannabis'],
  'houblon': ['Humulus lupulus', 'hops', 'houblon commun'],
  'café': ['Coffea arabica', 'Coffea canephora', 'coffee'],
  'cacao': ['Theobroma cacao', 'cocoa', 'chocolat'],
  'thé': ['Camellia sinensis', 'tea', 'thé vert'],
  'maté': ['Ilex paraguariensis', 'yerba mate', 'maté vert'],
};

// ============================================================================
// NUMÉROS CAS DES MOLÉCULES OLFACTIVES COURANTES
// ============================================================================

/**
 * Correspondances nom de molécule → numéro CAS et synonymes
 * Format: 'nom molécule': ['CAS number', 'synonymes', 'noms commerciaux']
 */
export const moleculeCASNumbers: Record<string, string[]> = {
  // Terpènes monoterpéniques
  'limonène': ['5989-27-5', 'D-limonene', 'd-limonène', 'dipentène', 'p-mentha-1,8-diène'],
  'd-limonène': ['5989-27-5', 'limonène', 'dipentène', 'caréne'],
  'l-limonène': ['5989-54-8', 'limonène', 'dipentène'],
  'pinène': ['80-56-8', 'alpha-pinene', 'α-pinène', '2,6,6-triméthylbicyclo[3.1.1]hept-2-ène'],
  'alpha-pinène': ['80-56-8', 'α-pinène', 'pinène', '2-pinène'],
  'beta-pinène': ['127-91-3', 'β-pinène', 'nopinène', 'pseudopinène'],
  'myrcène': ['123-35-3', 'β-myrcène', 'beta-myrcene', '7-méthyl-3-méthylène-1,6-octadiène'],
  'linalol': ['78-70-6', 'linalool', '3,7-diméthyl-1,6-octadién-3-ol', 'linalyl alcohol'],
  'linalool': ['78-70-6', 'linalol', 'licareol', 'coriandrol'],
  'géraniol': ['106-24-1', 'geraniol', '3,7-diméthyl-2,6-octadién-1-ol', 'lemonol'],
  'citronellol': ['106-22-9', 'citronellol', '3,7-diméthyl-6-octén-1-ol', 'dihydrogéraniol'],
  'nérol': ['106-25-2', 'nerol', 'cis-géraniol', '3,7-diméthyl-2,6-octadién-1-ol'],
  'terpinéol': ['98-55-5', 'alpha-terpineol', 'α-terpinéol', 'p-menth-1-én-8-ol'],
  'alpha-terpinéol': ['98-55-5', 'terpinéol', 'α-terpinéol', 'terpineol'],
  'terpinène': ['99-86-5', 'alpha-terpinene', 'α-terpinène', 'p-mentha-1,3-diène'],
  'gamma-terpinène': ['99-85-4', 'γ-terpinène', 'terpinène', 'p-mentha-1,4-diène'],
  'ocimène': ['13877-91-3', 'beta-ocimene', 'β-ocimène', '3,7-diméthyl-1,3,6-octatriène'],
  'terpinolène': ['586-62-9', 'terpinolene', 'isoterpinène', 'p-mentha-1,4(8)-diène'],
  'camphène': ['79-92-5', 'camphene', '2,2-diméthyl-3-méthylènebicyclo[2.2.1]heptane'],
  'carène': ['13466-78-9', '3-carene', 'δ-3-carène', 'delta-3-carene'],
  'sabinène': ['3387-41-5', 'sabinene', '4(10)-thuène', 'thujène'],
  'phellandrène': ['99-83-2', 'alpha-phellandrene', 'α-phellandrène', 'p-mentha-1,5-diène'],
  'cymène': ['99-87-6', 'p-cymene', 'p-cymène', '4-isopropyltoluène'],
  'p-cymène': ['99-87-6', 'cymène', 'para-cymène', '1-méthyl-4-isopropylbenzène'],

  // Sesquiterpènes
  'caryophyllène': ['87-44-5', 'beta-caryophyllene', 'β-caryophyllène', 'trans-caryophyllène'],
  'beta-caryophyllène': ['87-44-5', 'caryophyllène', 'β-caryophyllène', 'BCP'],
  'humulène': ['6753-98-6', 'alpha-humulene', 'α-humulène', 'alpha-caryophyllène'],
  'alpha-humulène': ['6753-98-6', 'humulène', 'α-humulène', 'alpha-caryophyllène'],
  'farnesène': ['502-61-4', 'alpha-farnesene', 'α-farnésène', 'trans-β-farnesène'],
  'bisabolol': ['515-69-5', 'alpha-bisabolol', 'α-bisabolol', 'lévomenol'],
  'alpha-bisabolol': ['515-69-5', 'bisabolol', 'α-bisabolol', 'lévomenol'],
  'nerolidol': ['7212-44-4', 'nérolidol', 'trans-nerolidol', 'peruviol'],
  'cédrol': ['77-53-2', 'cedrol', 'cèdre alcool', 'cedran-8-ol'],
  'santalol': ['11031-45-1', 'alpha-santalol', 'α-santalol', 'santal alcool'],
  'alpha-santalol': ['115-71-9', 'santalol', 'α-santalol', 'santal'],
  'patchoulol': ['5986-55-0', 'patchouli alcohol', 'alcool de patchouli'],
  'vétivérol': ['89-88-3', 'vetiverol', 'khusimol', 'vétiver alcool'],
  'guaïol': ['489-86-1', 'guaiol', 'champacol', 'guaiac alcohol'],
  'éléménol': ['639-99-6', 'elemol', 'élémol', 'élémène alcool'],
  'cadinène': ['483-76-1', 'delta-cadinene', 'δ-cadinène', 'cadinene'],
  'copaène': ['3856-25-5', 'alpha-copaene', 'α-copaène', 'copaene'],
  'valencène': ['4630-07-3', 'valencene', 'nootkatène', 'orange sesquiterpène'],
  'zingibérène': ['495-60-3', 'zingiberene', 'gingérène', 'ginger sesquiterpène'],
  'curcumène': ['644-30-4', 'ar-curcumene', 'curcumène aromatique'],
  'sélinène': ['473-13-2', 'alpha-selinene', 'α-sélinène', 'eudesmène'],
  'germacrène': ['23986-74-5', 'germacrene D', 'germacène D', 'germacrène D'],

  // Aldéhydes
  'citral': ['5392-40-5', 'géranial', 'néral', '3,7-diméthyl-2,6-octadiénal'],
  'géranial': ['141-27-5', 'citral a', 'trans-citral', 'citral'],
  'néral': ['106-26-3', 'citral b', 'cis-citral', 'citral'],
  'citronellal': ['106-23-0', 'citronellal', 'rhodinal', '3,7-diméthyl-6-octén-1-al'],
  'aldéhyde cinnamique': ['104-55-2', 'cinnamaldehyde', 'cinnamaldéhyde', '3-phényl-2-propénal'],
  'cinnamaldéhyde': ['104-55-2', 'aldéhyde cinnamique', 'cinnamal', 'cannelle aldéhyde'],
  'benzaldéhyde': ['100-52-7', 'benzaldehyde', 'aldéhyde benzoïque', 'amande amère'],
  'vanilline': ['121-33-5', 'vanillin', '4-hydroxy-3-méthoxybenzaldéhyde', 'vanille aldéhyde'],
  'héliotropine': ['120-57-0', 'piperonal', 'héliotrope aldéhyde', '3,4-méthylènedioxybenzaldéhyde'],
  'piperonal': ['120-57-0', 'héliotropine', 'pipéronal', 'héliotrope'],
  'aldéhyde anisique': ['123-11-5', 'anisaldehyde', 'p-anisaldéhyde', '4-méthoxybenzaldéhyde'],
  'hydroxycitronellal': ['107-75-5', 'hydroxycitronellal', 'laurine', 'muguet aldéhyde'],
  'lilial': ['80-54-6', 'butylphényl méthylpropional', 'BMHCA', 'lysmeral'],
  'aldéhyde C-11': ['112-44-7', 'undécanal', 'hendécanal', 'aldéhyde undécylique'],
  'aldéhyde C-12': ['112-54-9', 'dodécanal', 'lauraldéhyde', 'aldéhyde laurique'],
  'aldéhyde C-10': ['112-31-2', 'décanal', 'capraldéhyde', 'aldéhyde décylique'],

  // Esters
  'acétate de linalyle': ['115-95-7', 'linalyl acetate', 'bergamol', '3,7-diméthyl-1,6-octadién-3-yl acétate'],
  'acétate de géranyle': ['105-87-3', 'geranyl acetate', 'géraniol acétate'],
  'acétate de néryle': ['141-12-8', 'neryl acetate', 'nérol acétate'],
  'acétate de benzyle': ['140-11-4', 'benzyl acetate', 'acétate benzylique', 'jasmin ester'],
  'acétate de citronellyle': ['150-84-5', 'citronellyl acetate', 'citronellol acétate'],
  'acétate d\'isobornyle': ['125-12-2', 'isobornyl acetate', 'bornéol acétate'],
  'salicylate de benzyle': ['118-58-1', 'benzyl salicylate', 'salicylate benzylique'],
  'benzoate de benzyle': ['120-51-4', 'benzyl benzoate', 'benzoate benzylique'],
  'cinnamate de benzyle': ['103-41-3', 'benzyl cinnamate', 'cinnamate benzylique'],
  'méthyl salicylate': ['119-36-8', 'methyl salicylate', 'salicylate de méthyle', 'wintergreen'],
  'éthyl vanilline': ['121-32-4', 'ethyl vanillin', 'vanilline éthylique', 'bourbonal'],

  // Phénols et dérivés
  'eugénol': ['97-53-0', 'eugenol', '4-allyl-2-méthoxyphénol', 'girofle phénol'],
  'isoeugénol': ['97-54-1', 'isoeugenol', '2-méthoxy-4-propénylphénol'],
  'méthyl eugénol': ['93-15-2', 'methyl eugenol', '4-allyl-1,2-diméthoxybenzène'],
  'thymol': ['89-83-8', 'thymol', '2-isopropyl-5-méthylphénol', 'thym phénol'],
  'carvacrol': ['499-75-2', 'carvacrol', '5-isopropyl-2-méthylphénol', 'origan phénol'],
  'anéthole': ['104-46-1', 'anethole', 'trans-anéthole', '1-méthoxy-4-propénylbenzène'],
  'estragole': ['140-67-0', 'estragole', 'méthyl chavicol', '4-allyl-anisole'],
  'safrol': ['94-59-7', 'safrole', '5-allyl-1,3-benzodioxole', 'sassafras'],
  'gaïacol': ['90-05-1', 'guaiacol', '2-méthoxyphénol', 'gaïac phénol'],

  // Cétones
  'carvone': ['99-49-0', 'carvone', 'p-mentha-6,8-dién-2-one', 'menthe cétone'],
  'd-carvone': ['2244-16-8', 'carvone', 'carvi cétone', 'aneth cétone'],
  'l-carvone': ['6485-40-1', 'carvone', 'menthe verte cétone'],
  'menthone': ['89-80-5', 'menthone', 'p-menthan-3-one', 'menthe cétone'],
  'pulégone': ['89-82-7', 'pulegone', 'p-menth-4(8)-én-3-one', 'pennyroyal'],
  'camphre': ['76-22-2', 'camphor', '1,7,7-triméthylbicyclo[2.2.1]heptan-2-one'],
  'fenchone': ['1195-79-5', 'fenchone', 'fenouil cétone', '1,3,3-triméthylbicyclo[2.2.1]heptan-2-one'],
  'thuyone': ['546-80-5', 'thujone', 'α-thuyone', 'absinthone'],
  'ionone': ['8013-90-9', 'ionone', 'irone', 'violette cétone'],
  'alpha-ionone': ['127-41-3', 'α-ionone', 'ionone', 'violette alpha'],
  'beta-ionone': ['14901-07-6', 'β-ionone', 'ionone', 'violette beta'],
  'damascone': ['23726-93-4', 'damascone', 'rose cétone', 'damascenone'],
  'alpha-damascone': ['43052-87-5', 'α-damascone', 'damascone alpha'],
  'beta-damascone': ['23726-91-2', 'β-damascone', 'damascone beta'],
  'damascénone': ['23696-85-7', 'damascenone', 'rose damascène', 'β-damascénone'],
  'jasmone': ['488-10-8', 'jasmone', 'cis-jasmone', 'jasmin cétone'],
  'muscone': ['541-91-3', 'muscone', '3-méthylcyclopentadécanone', 'musc cétone'],

  // Lactones
  'coumarine lactone': ['91-64-5', 'coumarin', '2H-1-benzopyran-2-one', 'tonka lactone'],
  'gamma-décalactone': ['706-14-9', 'γ-decalactone', 'pêche lactone', 'décano-4-lactone'],
  'gamma-undécalactone': ['104-67-6', 'γ-undecalactone', 'aldéhyde C-14', 'pêche aldéhyde'],
  'gamma-nonalactone': ['104-61-0', 'γ-nonalactone', 'noix de coco lactone', 'aldéhyde C-18'],
  'delta-décalactone': ['705-86-2', 'δ-decalactone', 'crémeux lactone'],
  'sclareolide': ['564-20-5', 'sclareolide', 'ambrox précurseur', 'sauge lactone'],

  // Muscs synthétiques
  'galaxolide': ['1222-05-5', 'HHCB', 'hexahydro-hexaméthyl-cyclopentabenzopyrane', 'musc polycyclique'],
  'tonalide': ['21145-77-7', 'AHTN', 'acétyl hexaméthyl tétraline', 'musc polycyclique'],
  'muscenone': ['63314-79-4', 'muscenone', 'musc macrocyclique synthétique'],
  'habanolide': ['34902-57-3', 'habanolide', 'musc macrocyclique', 'oxacyclohexadécénone'],
  'ethylene brassylate': ['105-95-3', 'musk T', 'éthylène brassylate', 'musc macrocyclique'],
  'ambrettolide': ['7779-50-2', 'ambrettolide', 'musc ambrette', 'macrocyclique naturel'],
  'exaltolide': ['106-02-5', 'exaltolide', 'pentadécalactone', 'musc macrocyclique'],
  'muscone naturel': ['541-91-3', 'muscone', '3-méthylcyclopentadécanone', 'musc naturel'],
  'civettone': ['542-46-1', 'civettone', 'civetone', 'musc civette'],

  // Ambrés et boisés synthétiques
  'ambroxan': ['6790-58-5', 'ambrox', 'ambroxyde', 'ambre gris synthétique'],
  'ambrox': ['6790-58-5', 'ambroxan', 'cetalox', 'ambre synthétique'],
  'iso e super': ['54464-57-2', 'Iso E Super', 'isocyclemone E', 'bois synthétique'],
  'cashmeran': ['33704-61-9', 'cashmeran', 'DPMI', 'musc boisé'],
  'sandalore': ['65113-99-7', 'sandalore', 'santal synthétique', 'santalol synthétique'],
  'javanol': ['198404-98-7', 'javanol', 'santal crémeux', 'santalol synthétique'],
  'bacdanol': ['28219-61-6', 'bacdanol', 'santal synthétique', 'santalol type'],
  'polysantol': ['107898-54-4', 'polysantol', 'santal synthétique'],
  'hinoki': ['469-61-4', 'hinokitiol', 'thujaplicine', 'cèdre japonais'],
  'cedramber': ['19870-74-7', 'cedramber', 'cèdre ambré', 'ambre boisé'],
  'vertofix': ['32388-55-9', 'vertofix', 'vétiver synthétique', 'iso longifolanone'],
  'clearwood': ['3407-42-9', 'clearwood', 'patchouli synthétique', 'patchoulol type'],

  // Molécules fraîches et marines
  'calone': ['28940-11-6', 'calone', 'watermelon ketone', 'méthyl benzodioxépinone'],
  'hédione': ['24851-98-7', 'hedione', 'méthyl dihydrojasmonate', 'jasmin synthétique'],
  'paradisone': ['68901-22-4', 'paradisone', 'super hédione', 'jasmin puissant'],
  'dihydromyrcénol': ['18479-58-8', 'dihydromyrcenol', 'DHM', 'frais citronné'],
  'linalyl acetate': ['115-95-7', 'acétate de linalyle', 'bergamol', 'lavande ester'],
  'menthol': ['89-78-1', 'l-menthol', 'menthol', 'menthe fraîche'],
  'eucalyptol': ['470-82-6', '1,8-cinéole', 'cinéole', 'eucalyptus'],
  '1,8-cinéole': ['470-82-6', 'eucalyptol', 'cinéole', 'cajeputol'],

  // Indoliques et animaux
  'indole': ['120-72-9', 'indole', '2,3-benzopyrrole', 'jasmin indole'],
  'skatole': ['83-34-1', 'skatole', '3-méthylindole', 'animal fécal'],
  'civet': ['6659-45-6', 'civettone', 'civet absolute', 'civette'],
  'castoreum': ['8023-83-4', 'castoreum', 'castor', 'castoréum'],

  // Molécules spécifiques
  'bergaptène': ['484-20-8', 'bergapten', '5-méthoxypsoralène', 'bergamote furocourmarine'],
  'coumarine composé': ['91-64-5', 'coumarin', 'benzopyrone', 'tonka'],
  'héliotropine aldéhyde': ['120-57-0', 'piperonal', 'héliotrope', 'vanille florale'],
  'anisaldéhyde': ['123-11-5', 'anisaldehyde', 'p-anisaldéhyde', 'anis aldéhyde'],
  'safranal': ['116-26-7', 'safranal', 'safran aldéhyde', '2,6,6-triméthyl-1,3-cyclohexadiène-1-carboxaldéhyde'],
};

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Récupère le nom latin d'une plante à partir de son nom commun
 */
export function getLatinName(commonName: string): string[] {
  const normalized = commonName.toLowerCase().trim();
  return botanicalLatinNames[normalized] || [];
}

/**
 * Récupère le numéro CAS d'une molécule à partir de son nom
 */
export function getCASNumber(moleculeName: string): string | null {
  const normalized = moleculeName.toLowerCase().trim();
  const entry = moleculeCASNumbers[normalized];
  if (entry && entry.length > 0) {
    // Le premier élément est toujours le numéro CAS
    return entry[0];
  }
  return null;
}

/**
 * Récupère tous les synonymes d'une molécule (incluant CAS)
 */
export function getMoleculeSynonyms(moleculeName: string): string[] {
  const normalized = moleculeName.toLowerCase().trim();
  return moleculeCASNumbers[normalized] || [];
}

/**
 * Récupère tous les synonymes d'une plante (incluant nom latin)
 */
export function getPlantSynonyms(plantName: string): string[] {
  const normalized = plantName.toLowerCase().trim();
  return botanicalLatinNames[normalized] || [];
}

/**
 * Recherche une plante par son nom latin
 */
export function findPlantByLatinName(latinName: string): string | null {
  const normalizedLatin = latinName.toLowerCase().trim();
  
  for (const [commonName, latinNames] of Object.entries(botanicalLatinNames)) {
    if (latinNames.some(ln => ln.toLowerCase().includes(normalizedLatin))) {
      return commonName;
    }
  }
  return null;
}

/**
 * Recherche une molécule par son numéro CAS
 */
export function findMoleculeByCAS(casNumber: string): string | null {
  const normalizedCAS = casNumber.trim();
  
  for (const [moleculeName, synonyms] of Object.entries(moleculeCASNumbers)) {
    if (synonyms[0] === normalizedCAS) {
      return moleculeName;
    }
  }
  return null;
}

/**
 * Combine tous les synonymes botaniques et CAS pour l'expansion de requête
 */
export function expandWithScientificNames(term: string): string[] {
  const expanded = new Set<string>();
  const normalized = term.toLowerCase().trim();
  
  // Ajouter le terme original
  expanded.add(term);
  
  // Chercher dans les noms latins
  const latinSynonyms = getPlantSynonyms(normalized);
  latinSynonyms.forEach(syn => expanded.add(syn));
  
  // Chercher dans les numéros CAS
  const casSynonyms = getMoleculeSynonyms(normalized);
  casSynonyms.forEach(syn => expanded.add(syn));
  
  // Recherche inverse par nom latin
  const commonFromLatin = findPlantByLatinName(normalized);
  if (commonFromLatin) {
    expanded.add(commonFromLatin);
    getPlantSynonyms(commonFromLatin).forEach(syn => expanded.add(syn));
  }
  
  // Recherche inverse par CAS
  const moleculeFromCAS = findMoleculeByCAS(normalized);
  if (moleculeFromCAS) {
    expanded.add(moleculeFromCAS);
    getMoleculeSynonyms(moleculeFromCAS).forEach(syn => expanded.add(syn));
  }
  
  return Array.from(expanded);
}

/**
 * Statistiques du dictionnaire
 */
export function getScientificDictionaryStats(): {
  totalPlants: number;
  totalMolecules: number;
  totalLatinNames: number;
  totalCASNumbers: number;
} {
  let totalLatinNames = 0;
  let totalCASNumbers = 0;
  
  for (const synonyms of Object.values(botanicalLatinNames)) {
    totalLatinNames += synonyms.length;
  }
  
  for (const synonyms of Object.values(moleculeCASNumbers)) {
    totalCASNumbers += synonyms.length;
  }
  
  return {
    totalPlants: Object.keys(botanicalLatinNames).length,
    totalMolecules: Object.keys(moleculeCASNumbers).length,
    totalLatinNames,
    totalCASNumbers,
  };
}
