/**
 * Script d'import des données Olfaction & Mémoire
 * Enrichit les tables olfaction_memory, memory_olfaction_concepts et olfaction_memory_sources
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// ============================================================================
// CONCEPTS CLÉS - Structures cérébrales, phénomènes, mécanismes
// ============================================================================

const CONCEPTS = [
  // Structures cérébrales
  {
    name: "Bulbe olfactif",
    slug: "bulbe-olfactif",
    type: "brain_structure",
    definition: "Première structure cérébrale à recevoir et traiter les informations olfactives. Situé sous le lobe frontal, il reçoit directement les signaux des neurones récepteurs olfactifs de la muqueuse nasale.",
    description: "Le bulbe olfactif est unique parmi les structures sensorielles car il envoie des projections directes vers le système limbique (hippocampe, amygdale) sans passer par le thalamus, contrairement à tous les autres sens. Cette connexion directe explique pourquoi les odeurs peuvent déclencher des réponses émotionnelles et mnésiques si rapides et intenses.",
    scientificBasis: "Contient environ 50 000 glomérules qui traitent les signaux de 350-400 types de récepteurs olfactifs différents. Les mitral cells transmettent ensuite l'information au cortex piriforme et à l'amygdale.",
    historicalContext: "Découvert par Thomas Willis au XVIIe siècle, son rôle dans la mémoire n'a été compris qu'au XXe siècle avec les travaux de Gordon Shepherd.",
    keyResearchers: JSON.stringify(["Gordon Shepherd", "Linda Buck", "Richard Axel", "Thomas Willis"]),
    seminalPapers: JSON.stringify([
      { title: "Odorant receptors and the organization of the olfactory system", authors: "Buck & Axel", year: 1991, journal: "Cell" },
      { title: "The Neurobiology of Olfaction", authors: "Gordon Shepherd", year: 2010, journal: "CRC Press" }
    ])
  },
  {
    name: "Hippocampe",
    slug: "hippocampe",
    type: "brain_structure",
    definition: "Structure cérébrale essentielle pour la formation et la consolidation des souvenirs, particulièrement les souvenirs épisodiques et spatiaux.",
    description: "L'hippocampe reçoit des projections directes du cortex entorhinal, lui-même connecté au cortex piriforme (olfactif). Cette voie privilégiée permet aux odeurs d'accéder rapidement aux circuits de la mémoire déclarative. Les études d'imagerie montrent une activation hippocampique plus forte lors du rappel de souvenirs déclenchés par des odeurs que par d'autres stimuli sensoriels.",
    scientificBasis: "L'hippocampe contient des 'place cells' et des 'time cells' qui encodent le contexte spatio-temporel des souvenirs. Les odeurs activent préférentiellement l'hippocampe antérieur, associé aux souvenirs autobiographiques.",
    historicalContext: "Le rôle de l'hippocampe dans la mémoire a été découvert grâce au patient H.M. (Henry Molaison) en 1957, dont l'ablation bilatérale a causé une amnésie antérograde sévère.",
    keyResearchers: JSON.stringify(["Brenda Milner", "John O'Keefe", "May-Britt Moser", "Edvard Moser"]),
    seminalPapers: JSON.stringify([
      { title: "Loss of recent memory after bilateral hippocampal lesions", authors: "Scoville & Milner", year: 1957, journal: "Journal of Neurology" },
      { title: "The hippocampus as a cognitive map", authors: "O'Keefe & Nadel", year: 1978, journal: "Oxford University Press" }
    ])
  },
  {
    name: "Amygdale",
    slug: "amygdale",
    type: "brain_structure",
    definition: "Noyau cérébral en forme d'amande situé dans le lobe temporal, centre du traitement des émotions, particulièrement la peur, l'anxiété et le plaisir.",
    description: "L'amygdale est directement connectée au bulbe olfactif et au cortex piriforme, ce qui explique pourquoi les odeurs déclenchent des réponses émotionnelles si rapides et intenses. Elle joue un rôle crucial dans l'association entre odeurs et émotions, et dans la consolidation des souvenirs émotionnels.",
    scientificBasis: "L'amygdale basolatérale reçoit des inputs olfactifs directs et module la consolidation des souvenirs dans l'hippocampe via des projections glutamatergiques. Les études de neuroimagerie montrent une co-activation amygdale-hippocampe lors du rappel de souvenirs olfactifs émotionnels.",
    historicalContext: "Son rôle dans les émotions a été établi par les travaux de Heinrich Klüver et Paul Bucy (1937) sur le syndrome de Klüver-Bucy.",
    keyResearchers: JSON.stringify(["Joseph LeDoux", "Antonio Damasio", "Rachel Herz", "Heinrich Klüver"]),
    seminalPapers: JSON.stringify([
      { title: "The Emotional Brain", authors: "Joseph LeDoux", year: 1996, journal: "Simon & Schuster" },
      { title: "The Scent of Desire", authors: "Rachel Herz", year: 2007, journal: "William Morrow" }
    ])
  },
  {
    name: "Cortex piriforme",
    slug: "cortex-piriforme",
    type: "brain_structure",
    definition: "Cortex olfactif primaire situé dans le lobe temporal, responsable de l'identification et de la catégorisation des odeurs.",
    description: "Le cortex piriforme est la première région corticale à recevoir l'information olfactive du bulbe olfactif. Il joue un rôle clé dans l'apprentissage olfactif et la formation d'associations odeur-contexte. Ses projections vers l'hippocampe et l'amygdale permettent l'intégration des odeurs dans les souvenirs épisodiques.",
    scientificBasis: "Structure à trois couches (paléocortex) phylogénétiquement ancienne. Contient des circuits récurrents qui permettent l'apprentissage associatif et la complétion de patterns olfactifs partiels.",
    historicalContext: "Identifié au XIXe siècle, son rôle dans la mémoire olfactive n'a été pleinement compris qu'avec les techniques de neuroimagerie modernes.",
    keyResearchers: JSON.stringify(["Jay Gottfried", "Donald Wilson", "Noam Sobel"]),
    seminalPapers: JSON.stringify([
      { title: "Central processing of odor objects", authors: "Wilson & Sullivan", year: 2011, journal: "Neuron" }
    ])
  },
  {
    name: "Cortex orbitofrontal",
    slug: "cortex-orbitofrontal",
    type: "brain_structure",
    definition: "Région du cortex préfrontal impliquée dans la prise de décision, l'évaluation hédonique et l'intégration multimodale des informations sensorielles.",
    description: "Le cortex orbitofrontal reçoit des projections du cortex piriforme et de l'amygdale, et joue un rôle crucial dans l'évaluation de la valeur hédonique des odeurs (agréable/désagréable). Il intègre les informations olfactives avec le contexte et les attentes pour guider le comportement.",
    scientificBasis: "Les études de neuroimagerie montrent que l'activité du cortex orbitofrontal corrèle avec les jugements de plaisir olfactif et les préférences alimentaires. Des lésions de cette région altèrent la capacité à évaluer les odeurs.",
    historicalContext: "Le cas de Phineas Gage (1848) a révélé l'importance du cortex préfrontal dans la régulation émotionnelle et la prise de décision.",
    keyResearchers: JSON.stringify(["Edmund Rolls", "Dana Small", "Morten Kringelbach"]),
    seminalPapers: JSON.stringify([
      { title: "The orbitofrontal cortex and reward", authors: "Rolls", year: 2000, journal: "Cerebral Cortex" }
    ])
  },

  // Phénomènes
  {
    name: "Effet Proust",
    slug: "effet-proust",
    type: "phenomenon",
    definition: "Phénomène par lequel une odeur déclenche involontairement un souvenir autobiographique vivace et émotionnellement chargé, souvent accompagné d'un sentiment de 'voyage dans le temps'.",
    description: "Nommé d'après Marcel Proust et l'épisode célèbre de la madeleine trempée dans le thé dans 'À la recherche du temps perdu' (1913). Ce phénomène illustre la capacité unique des odeurs à évoquer des souvenirs épisodiques anciens avec une intensité émotionnelle et une précision contextuelle remarquables.",
    scientificBasis: "Les études de neuroimagerie (Herz, 2004; Willander & Larsson, 2006) montrent que les souvenirs déclenchés par des odeurs sont plus anciens (en moyenne de l'enfance), plus émotionnels et plus vivaces que ceux déclenchés par d'autres stimuli. Cela s'explique par la connexion directe bulbe olfactif → amygdale → hippocampe.",
    historicalContext: "Bien que le phénomène soit connu depuis l'Antiquité, c'est Proust qui l'a décrit avec le plus de précision littéraire. Les neurosciences modernes ont validé et expliqué ce phénomène depuis les années 1990.",
    keyResearchers: JSON.stringify(["Rachel Herz", "Johan Willander", "Maria Larsson", "Trygg Engen"]),
    seminalPapers: JSON.stringify([
      { title: "Odor-evoked autobiographical memories", authors: "Willander & Larsson", year: 2006, journal: "Chemical Senses" },
      { title: "The Scent of Desire", authors: "Rachel Herz", year: 2007, journal: "William Morrow" }
    ])
  },
  {
    name: "Mémoire olfactive involontaire",
    slug: "memoire-olfactive-involontaire",
    type: "phenomenon",
    definition: "Rappel spontané et non intentionnel d'un souvenir déclenché par une odeur rencontrée de manière fortuite.",
    description: "Contrairement au rappel volontaire (essayer de se souvenir d'une odeur), la mémoire olfactive involontaire survient sans effort conscient lorsqu'une odeur est rencontrée. Ces souvenirs sont généralement plus émotionnels et plus anciens que les souvenirs volontaires.",
    scientificBasis: "Les études montrent que les souvenirs olfactifs involontaires activent plus fortement l'amygdale et l'hippocampe antérieur que les souvenirs volontaires, suggérant un accès privilégié aux circuits émotionnels et autobiographiques.",
    historicalContext: "Décrit par Proust, étudié scientifiquement depuis les travaux de Trygg Engen dans les années 1980.",
    keyResearchers: JSON.stringify(["Trygg Engen", "Rachel Herz", "Simon Chu"]),
    seminalPapers: JSON.stringify([
      { title: "Odor memory: Review and analysis", authors: "Engen", year: 1987, journal: "Psychological Bulletin" }
    ])
  },
  {
    name: "Bump de réminiscence olfactive",
    slug: "bump-reminiscence-olfactive",
    type: "phenomenon",
    definition: "Concentration des souvenirs olfactifs dans la période de l'enfance et de l'adolescence (0-10 ans), contrairement aux autres modalités sensorielles (10-30 ans).",
    description: "Les souvenirs déclenchés par des odeurs proviennent majoritairement de la première décennie de vie, alors que les souvenirs visuels ou verbaux proviennent plutôt de l'adolescence et du début de l'âge adulte. Ce 'bump' précoce suggère une période critique pour l'apprentissage olfactif.",
    scientificBasis: "Willander & Larsson (2006) ont montré que l'âge moyen des souvenirs olfactifs est de 6,5 ans, contre 15-20 ans pour les souvenirs visuels. Cela pourrait s'expliquer par la maturation précoce du système olfactif et l'importance des odeurs dans l'attachement maternel.",
    historicalContext: "Découvert dans les années 2000 par les chercheurs suédois Johan Willander et Maria Larsson.",
    keyResearchers: JSON.stringify(["Johan Willander", "Maria Larsson"]),
    seminalPapers: JSON.stringify([
      { title: "Olfaction and emotion: The case of autobiographical memory", authors: "Willander & Larsson", year: 2007, journal: "Memory & Cognition" }
    ])
  },

  // Types de mémoire
  {
    name: "Mémoire épisodique",
    slug: "memoire-episodique",
    type: "memory_type",
    definition: "Type de mémoire à long terme impliquant le rappel d'événements spécifiques vécus personnellement, avec leur contexte spatio-temporel.",
    description: "La mémoire épisodique permet de 'voyager mentalement dans le temps' pour revivre des expériences passées. Les odeurs sont particulièrement efficaces pour déclencher des souvenirs épisodiques car elles activent directement l'hippocampe et l'amygdale, structures clés de ce type de mémoire.",
    scientificBasis: "Concept introduit par Endel Tulving en 1972. Les souvenirs épisodiques sont encodés avec un 'tag' contextuel (où, quand, avec qui) qui peut être réactivé par des indices sensoriels, notamment olfactifs.",
    historicalContext: "Tulving a distingué la mémoire épisodique de la mémoire sémantique en 1972, révolutionnant notre compréhension de la mémoire humaine.",
    keyResearchers: JSON.stringify(["Endel Tulving", "Daniel Schacter", "Morris Moscovitch"]),
    seminalPapers: JSON.stringify([
      { title: "Episodic and semantic memory", authors: "Tulving", year: 1972, journal: "Organization of Memory" },
      { title: "Memory, consciousness, and the brain", authors: "Tulving", year: 2000, journal: "Psychology Press" }
    ])
  },
  {
    name: "Mémoire sémantique olfactive",
    slug: "memoire-semantique-olfactive",
    type: "memory_type",
    definition: "Connaissance générale des odeurs indépendante du contexte d'apprentissage : identification, catégorisation, associations verbales.",
    description: "La mémoire sémantique olfactive permet d'identifier une odeur ('c'est de la lavande'), de la catégoriser ('c'est floral') et de l'associer à des concepts ('relaxation'). Elle est distincte de la mémoire épisodique olfactive qui concerne les souvenirs personnels liés aux odeurs.",
    scientificBasis: "Dépend du cortex piriforme pour l'identification et du cortex orbitofrontal pour la catégorisation. Les études montrent une dissociation entre la capacité à identifier une odeur et la capacité à se souvenir du contexte d'apprentissage.",
    historicalContext: "La distinction entre mémoire sémantique et épisodique olfactive a été établie dans les années 1990.",
    keyResearchers: JSON.stringify(["Trygg Engen", "Howard Eichenbaum"]),
    seminalPapers: JSON.stringify([
      { title: "Odor memory", authors: "Engen", year: 1991, journal: "Praeger" }
    ])
  },
  {
    name: "Mémoire procédurale olfactive",
    slug: "memoire-procedurale-olfactive",
    type: "memory_type",
    definition: "Apprentissage implicite des associations odeur-comportement, comme l'aversion alimentaire conditionnée.",
    description: "La mémoire procédurale olfactive permet d'apprendre des associations odeur-réponse sans conscience explicite. L'exemple classique est l'aversion alimentaire conditionnée : une seule expérience de maladie après avoir mangé un aliment peut créer une aversion durable pour son odeur.",
    scientificBasis: "L'aversion alimentaire conditionnée implique l'amygdale et le cortex insulaire. Elle peut se former en une seule exposition et persister toute la vie, illustrant la puissance de l'apprentissage olfactif.",
    historicalContext: "Étudiée par John Garcia dans les années 1960, l'aversion alimentaire conditionnée a remis en question les lois classiques du conditionnement.",
    keyResearchers: JSON.stringify(["John Garcia", "Robert Koelling"]),
    seminalPapers: JSON.stringify([
      { title: "Relation of cue to consequence in avoidance learning", authors: "Garcia & Koelling", year: 1966, journal: "Psychonomic Science" }
    ])
  },

  // Mécanismes
  {
    name: "Encodage olfactif",
    slug: "encodage-olfactif",
    type: "mechanism",
    definition: "Processus par lequel une odeur est transformée en une trace mnésique dans le cerveau.",
    description: "L'encodage olfactif commence dans la muqueuse nasale où les molécules odorantes activent des récepteurs spécifiques. Le pattern d'activation est transmis au bulbe olfactif, puis au cortex piriforme où il est comparé aux traces existantes. Si l'odeur est nouvelle ou significative, elle est encodée avec son contexte émotionnel (amygdale) et spatio-temporel (hippocampe).",
    scientificBasis: "L'encodage olfactif est particulièrement efficace lorsque l'odeur est associée à une émotion forte ou à un contexte significatif. Les études montrent que l'attention et l'état émotionnel modulent l'encodage via des projections top-down du cortex préfrontal.",
    historicalContext: "Les mécanismes d'encodage olfactif ont été élucidés grâce aux travaux de Linda Buck et Richard Axel (Prix Nobel 2004) sur les récepteurs olfactifs.",
    keyResearchers: JSON.stringify(["Linda Buck", "Richard Axel", "Noam Sobel"]),
    seminalPapers: JSON.stringify([
      { title: "A novel multigene family may encode odorant receptors", authors: "Buck & Axel", year: 1991, journal: "Cell" }
    ])
  },
  {
    name: "Consolidation olfactive",
    slug: "consolidation-olfactive",
    type: "mechanism",
    definition: "Processus de stabilisation et de renforcement des traces mnésiques olfactives dans la mémoire à long terme.",
    description: "La consolidation olfactive implique le transfert progressif des souvenirs de l'hippocampe vers le néocortex. Le sommeil joue un rôle crucial : les études montrent que la réactivation des odeurs pendant le sommeil lent profond renforce la consolidation des souvenirs associés.",
    scientificBasis: "Les travaux de Jan Born et Björn Rasch ont montré que la présentation d'odeurs pendant le sommeil peut renforcer les souvenirs encodés en présence de ces odeurs. Ce phénomène implique la réactivation hippocampique pendant les ondes lentes du sommeil.",
    historicalContext: "Le rôle du sommeil dans la consolidation mnésique a été établi au XXe siècle, mais son application aux souvenirs olfactifs est plus récente (années 2000).",
    keyResearchers: JSON.stringify(["Jan Born", "Björn Rasch", "Susanne Diekelmann"]),
    seminalPapers: JSON.stringify([
      { title: "Odor cues during slow-wave sleep prompt declarative memory consolidation", authors: "Rasch et al.", year: 2007, journal: "Science" }
    ])
  },
  {
    name: "Rappel olfactif",
    slug: "rappel-olfactif",
    type: "mechanism",
    definition: "Processus de récupération d'un souvenir à partir d'un indice olfactif.",
    description: "Le rappel olfactif peut être déclenché par une odeur (rappel indicé) ou par un effort volontaire (rappel libre). Le rappel indicé par une odeur est généralement plus efficace et plus émotionnel car il active directement les circuits limbiques sans médiation cognitive.",
    scientificBasis: "Les études de neuroimagerie montrent que le rappel olfactif active l'hippocampe, l'amygdale et le cortex piriforme de manière coordonnée. La spécificité de l'indice olfactif (correspondance exacte avec l'odeur d'encodage) améliore le rappel.",
    historicalContext: "Le principe de spécificité de l'encodage (Tulving & Thomson, 1973) s'applique particulièrement bien aux indices olfactifs.",
    keyResearchers: JSON.stringify(["Endel Tulving", "Rachel Herz"]),
    seminalPapers: JSON.stringify([
      { title: "Encoding specificity and retrieval processes in episodic memory", authors: "Tulving & Thomson", year: 1973, journal: "Psychological Review" }
    ])
  },

  // Troubles
  {
    name: "Anosmie",
    slug: "anosmie",
    type: "disorder",
    definition: "Perte totale de l'odorat, pouvant être congénitale, traumatique, virale ou neurodégénérative.",
    description: "L'anosmie affecte profondément la qualité de vie et la mémoire olfactive. Les patients anosmiques perdent non seulement la capacité de sentir, mais aussi l'accès aux souvenirs olfactifs et aux émotions associées. L'anosmie peut être un signe précoce de maladies neurodégénératives comme Parkinson ou Alzheimer.",
    scientificBasis: "L'anosmie post-virale (comme après COVID-19) implique des dommages aux neurones olfactifs de la muqueuse nasale. L'anosmie traumatique résulte souvent de lésions du bulbe olfactif ou du cortex piriforme.",
    historicalContext: "L'anosmie a gagné en visibilité avec la pandémie de COVID-19, qui a causé une perte d'odorat chez 50-80% des patients infectés.",
    keyResearchers: JSON.stringify(["Thomas Hummel", "Richard Doty", "Valentina Parma"]),
    seminalPapers: JSON.stringify([
      { title: "Olfactory dysfunction in COVID-19", authors: "Parma et al.", year: 2020, journal: "Chemical Senses" }
    ])
  },
  {
    name: "Hyperosmie",
    slug: "hyperosmie",
    type: "disorder",
    definition: "Sensibilité olfactive anormalement élevée, souvent associée à des migraines, la grossesse ou certains troubles neurologiques.",
    description: "L'hyperosmie peut rendre les odeurs quotidiennes insupportables et déclencher des souvenirs intrusifs. Elle est fréquente pendant la grossesse (protection évolutive du fœtus) et peut accompagner les migraines, l'épilepsie ou certains troubles anxieux.",
    scientificBasis: "L'hyperosmie implique une hyperexcitabilité des circuits olfactifs, possiblement due à une réduction de l'inhibition GABAergique dans le bulbe olfactif ou le cortex piriforme.",
    historicalContext: "Décrite dans la littérature médicale depuis le XIXe siècle, l'hyperosmie reste mal comprise et sous-diagnostiquée.",
    keyResearchers: JSON.stringify(["Richard Doty", "Thomas Hummel"]),
    seminalPapers: JSON.stringify([
      { title: "Handbook of Olfaction and Gustation", authors: "Doty", year: 2015, journal: "Wiley" }
    ])
  },
  {
    name: "Parosmie",
    slug: "parosmie",
    type: "disorder",
    definition: "Distorsion de la perception olfactive où les odeurs sont perçues différemment de leur nature réelle, souvent de manière désagréable.",
    description: "La parosmie survient souvent après une anosmie (post-virale ou traumatique) pendant la phase de récupération. Les odeurs familières peuvent être perçues comme brûlées, chimiques ou putrides, affectant profondément l'alimentation et la qualité de vie.",
    scientificBasis: "La parosmie résulte d'une régénération aberrante des neurones olfactifs, créant des connexions incorrectes entre récepteurs et glomérules du bulbe olfactif.",
    historicalContext: "La parosmie post-COVID a touché des millions de personnes, stimulant la recherche sur la régénération olfactive.",
    keyResearchers: JSON.stringify(["Carl Philpott", "Chrissi Kelly", "AbScent"]),
    seminalPapers: JSON.stringify([
      { title: "Parosmia and phantosmia", authors: "Philpott & Boak", year: 2021, journal: "BMJ" }
    ])
  },

  // Thérapies
  {
    name: "OSTMR",
    slug: "ostmr",
    type: "therapy",
    definition: "Olfactory Stimulation Therapy for Memory Rehabilitation - Thérapie utilisant des stimulations olfactives ciblées pour la rééducation de la mémoire.",
    description: "L'OSTMR utilise des compositions olfactives spécifiquement conçues pour stimuler les circuits de la mémoire et aider les patients souffrant de troubles mnésiques. Développée en collaboration entre neuropsychiatres et parfumeurs, cette approche exploite la connexion privilégiée entre olfaction et mémoire.",
    scientificBasis: "Les études pilotes montrent une amélioration des performances mnésiques chez les patients atteints de démence légère après des séances régulières de stimulation olfactive. Le mécanisme implique la réactivation des circuits hippocampiques via les voies olfactives.",
    historicalContext: "Développée dans les années 2010, l'OSTMR s'inscrit dans le mouvement plus large de la neuroréhabilitation sensorielle.",
    keyResearchers: JSON.stringify(["Patty Canac", "Hirac Gurden"]),
    seminalPapers: JSON.stringify([
      { title: "Olfactory stimulation for memory rehabilitation", authors: "Canac & Gurden", year: 2018, journal: "Frontiers in Neuroscience" }
    ])
  },
  {
    name: "Aromathérapie cognitive",
    slug: "aromatherapie-cognitive",
    type: "therapy",
    definition: "Utilisation d'huiles essentielles et de compositions olfactives pour améliorer les fonctions cognitives, notamment l'attention, la concentration et la mémoire.",
    description: "L'aromathérapie cognitive utilise des odeurs spécifiques pour moduler l'état cognitif. Le romarin est associé à une amélioration de la mémoire prospective, la menthe poivrée à l'attention, et la lavande à la relaxation propice à la consolidation mnésique.",
    scientificBasis: "Les études contrôlées montrent des effets modestes mais significatifs de certaines odeurs sur les performances cognitives. Les mécanismes incluent la modulation de l'éveil (via le locus coeruleus) et des effets pharmacologiques directs de certains composés volatils (1,8-cinéole du romarin).",
    historicalContext: "L'aromathérapie moderne a été fondée par René-Maurice Gattefossé dans les années 1930, mais son application cognitive est plus récente.",
    keyResearchers: JSON.stringify(["Mark Moss", "Lorraine Oliver", "Jemma McCready"]),
    seminalPapers: JSON.stringify([
      { title: "Aromas of rosemary and lavender essential oils differentially affect cognition", authors: "Moss et al.", year: 2003, journal: "International Journal of Neuroscience" }
    ])
  },
  {
    name: "Entraînement olfactif",
    slug: "entrainement-olfactif",
    type: "therapy",
    definition: "Protocole de rééducation olfactive consistant à sentir régulièrement un ensemble d'odeurs pour stimuler la régénération des neurones olfactifs.",
    description: "L'entraînement olfactif est le traitement de référence pour l'anosmie post-virale. Il consiste à sentir 4 odeurs (rose, eucalyptus, citron, clou de girofle) deux fois par jour pendant au moins 4 mois. Ce protocole stimule la neuroplasticité du système olfactif.",
    scientificBasis: "Les études de Thomas Hummel montrent que l'entraînement olfactif améliore la fonction olfactive chez 30-60% des patients anosmiques. Le mécanisme implique la neurogenèse dans l'épithélium olfactif et la plasticité synaptique dans le bulbe olfactif.",
    historicalContext: "Développé par Thomas Hummel à Dresde dans les années 2000, l'entraînement olfactif est devenu le standard de soins pour l'anosmie.",
    keyResearchers: JSON.stringify(["Thomas Hummel", "Antje Welge-Lüssen"]),
    seminalPapers: JSON.stringify([
      { title: "Effects of olfactory training in patients with olfactory loss", authors: "Hummel et al.", year: 2009, journal: "Laryngoscope" }
    ])
  },

  // Rituels historiques
  {
    name: "Encensement rituel",
    slug: "encensement-rituel",
    type: "ritual",
    definition: "Pratique d'utilisation de l'encens dans les cérémonies religieuses pour créer un état de conscience modifié et ancrer des souvenirs collectifs.",
    description: "L'encensement est présent dans toutes les grandes traditions religieuses : l'oliban dans le judaïsme et le christianisme, le bakhoor dans l'islam, le dhoop dans l'hindouisme. La fumée parfumée crée une atmosphère sacrée qui facilite la prière et ancre les souvenirs des cérémonies dans la mémoire collective.",
    scientificBasis: "L'encens contient des composés psychoactifs (incensole acetate) qui activent les récepteurs TRPV3 et ont des effets anxiolytiques et antidépresseurs. L'association répétée odeur-contexte sacré crée un conditionnement classique puissant.",
    historicalContext: "L'encensement est attesté depuis l'Âge du Bronze au Proche-Orient. La Route de l'Encens reliait l'Arabie du Sud à la Méditerranée, témoignant de l'importance économique et spirituelle de cette pratique.",
    keyResearchers: JSON.stringify(["Arieh Moussaieff", "Kjeld Nielsen"]),
    seminalPapers: JSON.stringify([
      { title: "Incensole acetate, an incense component, elicits psychoactivity", authors: "Moussaieff et al.", year: 2008, journal: "FASEB Journal" }
    ])
  },
  {
    name: "Fumigation purificatrice",
    slug: "fumigation-purificatrice",
    type: "ritual",
    definition: "Pratique de purification par la fumée de plantes aromatiques, présente dans de nombreuses cultures pour chasser les mauvais esprits et purifier les espaces.",
    description: "La fumigation est universelle : sauge blanche chez les Amérindiens, encens chez les Égyptiens, benjoin en Asie du Sud-Est. Au-delà de la dimension spirituelle, ces pratiques ont des effets antimicrobiens réels et créent des marqueurs olfactifs de transition (naissance, mort, guérison).",
    scientificBasis: "De nombreuses plantes utilisées en fumigation (sauge, encens, myrrhe) ont des propriétés antimicrobiennes et anti-inflammatoires documentées. La fumigation peut réduire les bactéries aéroportées de 94% selon certaines études.",
    historicalContext: "La fumigation est attestée dans les textes médicaux égyptiens (Papyrus Ebers, 1550 av. J.-C.) et dans les pratiques chamaniques amérindiennes depuis des millénaires.",
    keyResearchers: JSON.stringify(["Chandra Shekhar Nautiyal"]),
    seminalPapers: JSON.stringify([
      { title: "Medicinal smoke reduces airborne bacteria", authors: "Nautiyal et al.", year: 2007, journal: "Journal of Ethnopharmacology" }
    ])
  },
  {
    name: "Onction funéraire",
    slug: "onction-funeraire",
    type: "ritual",
    definition: "Pratique d'application d'huiles et de parfums sur les corps des défunts, présente dans de nombreuses cultures pour honorer les morts et faciliter leur passage.",
    description: "L'onction funéraire utilise des substances aromatiques précieuses (myrrhe, nard, encens) pour préparer le corps du défunt. Cette pratique crée un ancrage olfactif puissant pour les vivants, associant l'odeur au souvenir du défunt et au rituel de deuil.",
    scientificBasis: "Les résines utilisées (myrrhe, encens) ont des propriétés antimicrobiennes qui ralentissent la décomposition. L'association odeur-deuil crée un conditionnement émotionnel qui peut être réactivé par des odeurs similaires.",
    historicalContext: "Attestée dans l'Égypte ancienne (embaumement), le judaïsme (onction de Jésus par Marie de Béthanie), et de nombreuses autres cultures. Les parfums funéraires étaient parmi les plus précieux de l'Antiquité.",
    keyResearchers: JSON.stringify(["Salima Ikram", "Renate Germer"]),
    seminalPapers: JSON.stringify([
      { title: "Death and Burial in Ancient Egypt", authors: "Ikram", year: 2003, journal: "Longman" }
    ])
  },
  {
    name: "Parfums de séduction",
    slug: "parfums-seduction",
    type: "ritual",
    definition: "Utilisation de parfums pour attirer et séduire, pratique universelle exploitant le lien entre olfaction, mémoire et émotion.",
    description: "Les parfums de séduction exploitent la connexion directe entre olfaction et système limbique pour créer des associations émotionnelles positives. Le musc, l'ambre et le jasmin sont utilisés depuis l'Antiquité pour leurs propriétés aphrodisiaques supposées.",
    scientificBasis: "Certaines molécules (androsténone, androsténol) sont des phéromones potentielles chez l'humain. Les études montrent que les odeurs influencent l'attractivité perçue et peuvent moduler les niveaux de testostérone et de cortisol.",
    historicalContext: "Cléopâtre utilisait des parfums pour séduire César et Marc Antoine. Les harems ottomans avaient des parfumeuses attitrées. Le parfum reste un élément central de la séduction dans toutes les cultures.",
    keyResearchers: JSON.stringify(["Rachel Herz", "Johan Lundström"]),
    seminalPapers: JSON.stringify([
      { title: "The Scent of Desire", authors: "Herz", year: 2007, journal: "William Morrow" }
    ])
  }
];

// ============================================================================
// ARTICLES DE RECHERCHE
// ============================================================================

const ARTICLES = [
  // Articles neurologiques
  {
    title: "Le système limbique et la mémoire olfactive",
    slug: "systeme-limbique-memoire-olfactive",
    category: "neurological",
    summary: "Exploration des connexions anatomiques uniques entre le système olfactif et les structures limbiques responsables de la mémoire et des émotions.",
    content: `# Le système limbique et la mémoire olfactive

## Introduction

Le système olfactif possède une architecture neuronale unique parmi les systèmes sensoriels. Contrairement à la vision, l'audition ou le toucher, qui passent par le thalamus avant d'atteindre le cortex, les informations olfactives accèdent directement au système limbique, centre des émotions et de la mémoire.

## Anatomie des connexions olfactives

### Du nez au cerveau

1. **Épithélium olfactif** : Les molécules odorantes se lient aux récepteurs olfactifs (environ 400 types chez l'humain) situés dans la muqueuse nasale.

2. **Bulbe olfactif** : Les axones des neurones récepteurs convergent vers les glomérules du bulbe olfactif, où s'effectue un premier traitement de l'information.

3. **Cortex piriforme** : Le cortex olfactif primaire reçoit les projections du bulbe olfactif et effectue l'identification des odeurs.

4. **Système limbique** : Le cortex piriforme projette directement vers :
   - L'**amygdale** : traitement émotionnel
   - L'**hippocampe** (via le cortex entorhinal) : formation des souvenirs
   - Le **cortex orbitofrontal** : évaluation hédonique

### La voie directe : clé de la mémoire olfactive

Cette connexion directe, sans relais thalamique, explique plusieurs caractéristiques uniques de la mémoire olfactive :

- **Rapidité** : Les réponses émotionnelles aux odeurs sont quasi-instantanées
- **Intensité** : Les souvenirs olfactifs sont plus émotionnellement chargés
- **Ancienneté** : Les souvenirs olfactifs remontent souvent à l'enfance

## Implications pour la recherche PERFUMUM

La compréhension de ces circuits permet de concevoir des compositions olfactives qui :

1. Ciblent spécifiquement les circuits de la mémoire émotionnelle
2. Exploitent la plasticité du système olfactif pour créer de nouvelles associations
3. Utilisent les odeurs comme ancres mnésiques dans les rituels et installations

## Références

- Buck, L., & Axel, R. (1991). A novel multigene family may encode odorant receptors. Cell, 65(1), 175-187.
- Shepherd, G. M. (2010). The Neurobiology of Olfaction. CRC Press.
- Herz, R. S. (2007). The Scent of Desire. William Morrow.`,
    tags: JSON.stringify(["neurologie", "système limbique", "anatomie", "mémoire"]),
    relatedMolecules: JSON.stringify(["linalol", "limonène", "géraniol"]),
    relatedPlants: JSON.stringify(["lavande", "rose", "jasmin"]),
    status: "published",
    featured: true
  },
  {
    title: "L'effet Proust : neurosciences d'un phénomène littéraire",
    slug: "effet-proust-neurosciences",
    category: "neurological",
    summary: "Comment les neurosciences modernes ont validé et expliqué le phénomène décrit par Marcel Proust dans 'À la recherche du temps perdu'.",
    content: `# L'effet Proust : neurosciences d'un phénomène littéraire

## La madeleine de Proust

> "Et tout d'un coup le souvenir m'est apparu. Ce goût, c'était celui du petit morceau de madeleine que le dimanche matin à Combray [...] ma tante Léonie m'offrait après l'avoir trempé dans son infusion de thé ou de tilleul."

Marcel Proust, dans ce passage célèbre de "Du côté de chez Swann" (1913), décrit avec une précision remarquable un phénomène que les neurosciences allaient confirmer un siècle plus tard : la capacité unique des odeurs à déclencher des souvenirs autobiographiques vivaces et émotionnellement chargés.

## Validation scientifique

### Les études de Rachel Herz

La psychologue Rachel Herz (Brown University) a mené des études systématiques comparant les souvenirs déclenchés par différentes modalités sensorielles :

| Modalité | Âge moyen du souvenir | Intensité émotionnelle | Vivacité |
|----------|----------------------|------------------------|----------|
| Olfactive | 6-10 ans | Très élevée | Très élevée |
| Visuelle | 15-25 ans | Modérée | Élevée |
| Auditive | 15-25 ans | Modérée | Modérée |
| Verbale | Variable | Faible | Faible |

### Le "bump" de réminiscence olfactive

Willander et Larsson (2006) ont découvert que les souvenirs olfactifs proviennent majoritairement de la première décennie de vie, contrairement aux autres modalités sensorielles. Ce "bump" précoce suggère une période critique pour l'apprentissage olfactif.

## Mécanismes neurobiologiques

### Pourquoi les odeurs sont-elles si efficaces ?

1. **Connexion directe** : Le bulbe olfactif projette directement vers l'amygdale et l'hippocampe, sans passer par le thalamus.

2. **Encodage contextuel** : Les odeurs sont encodées avec leur contexte émotionnel et spatio-temporel, créant des traces mnésiques riches.

3. **Stabilité des traces** : Les souvenirs olfactifs sont remarquablement stables dans le temps, résistant à l'oubli mieux que les autres modalités.

### Neuroimagerie de l'effet Proust

Les études d'IRMf montrent que le rappel de souvenirs olfactifs active :
- L'hippocampe antérieur (souvenirs autobiographiques)
- L'amygdale (composante émotionnelle)
- Le cortex piriforme (représentation de l'odeur)
- Le cortex préfrontal médian (sentiment de familiarité)

## Applications pratiques

### Pour la recherche PERFUMUM

L'effet Proust peut être exploité pour :

1. **Créer des ancres mnésiques** : Associer des compositions olfactives à des expériences significatives
2. **Thérapie par réminiscence** : Utiliser des odeurs pour aider les patients atteints de démence à accéder à leurs souvenirs
3. **Design d'expériences** : Concevoir des installations olfactives qui évoquent des souvenirs collectifs

## Conclusion

L'effet Proust n'est pas une métaphore littéraire mais un phénomène neurobiologique réel, ancré dans l'architecture unique du système olfactif. Cette compréhension ouvre des perspectives fascinantes pour l'utilisation des odeurs comme outils de mémoire.`,
    tags: JSON.stringify(["effet Proust", "neurosciences", "mémoire autobiographique", "littérature"]),
    relatedMolecules: JSON.stringify(["vanilline", "coumarine", "héliotropine"]),
    relatedPlants: JSON.stringify(["tilleul", "vanille"]),
    status: "published",
    featured: true
  },
  {
    title: "Olfaction et maladie d'Alzheimer : un biomarqueur précoce",
    slug: "olfaction-alzheimer-biomarqueur",
    category: "scientific_study",
    summary: "La perte de l'odorat comme signe précoce de la maladie d'Alzheimer et les implications pour le diagnostic et la prévention.",
    content: `# Olfaction et maladie d'Alzheimer : un biomarqueur précoce

## Introduction

La perte de l'odorat (hyposmie) est l'un des premiers signes de la maladie d'Alzheimer, apparaissant souvent 10-15 ans avant les symptômes cognitifs. Cette découverte ouvre des perspectives pour le diagnostic précoce et la prévention.

## Mécanismes pathologiques

### Atteinte précoce du système olfactif

La maladie d'Alzheimer affecte le système olfactif très tôt dans son évolution :

1. **Cortex entorhinal** : Première région touchée par les dépôts de protéine tau
2. **Hippocampe** : Atrophie progressive affectant la mémoire olfactive
3. **Bulbe olfactif** : Accumulation de plaques amyloïdes

### Corrélation avec le déclin cognitif

| Stade | Fonction olfactive | Fonction cognitive |
|-------|-------------------|-------------------|
| Préclinique | Hyposmie légère | Normale |
| Prodromal | Hyposmie modérée | MCI (trouble cognitif léger) |
| Démence légère | Hyposmie sévère | Démence débutante |
| Démence modérée | Anosmie | Démence établie |

## Tests olfactifs diagnostiques

### UPSIT (University of Pennsylvania Smell Identification Test)

Test standardisé de 40 odeurs permettant d'évaluer la fonction olfactive. Un score bas chez une personne âgée asymptomatique prédit un risque accru de développer une démence.

### Sniffin' Sticks

Batterie de tests européenne évaluant le seuil de détection, la discrimination et l'identification des odeurs.

## Implications pour la recherche PERFUMUM

### Stimulation olfactive préventive

L'entraînement olfactif régulier pourrait :
- Maintenir la plasticité du système olfactif
- Stimuler la neurogenèse dans le bulbe olfactif
- Renforcer les connexions hippocampiques

### Compositions thérapeutiques

Certaines molécules pourraient avoir des effets neuroprotecteurs :
- **1,8-cinéole** (eucalyptus, romarin) : amélioration cognitive documentée
- **Linalol** (lavande) : effets anxiolytiques et neuroprotecteurs
- **β-caryophyllène** : agoniste CB2, anti-inflammatoire

## Conclusion

L'olfaction offre une fenêtre unique sur la santé cérébrale. La surveillance de la fonction olfactive et la stimulation régulière par des odeurs variées pourraient contribuer à la prévention des maladies neurodégénératives.`,
    tags: JSON.stringify(["Alzheimer", "diagnostic", "biomarqueur", "prévention", "neurodégénérescence"]),
    relatedMolecules: JSON.stringify(["1,8-cinéole", "linalol", "β-caryophyllène"]),
    relatedPlants: JSON.stringify(["romarin", "lavande", "eucalyptus"]),
    status: "published",
    featured: false
  },

  // Articles historiques
  {
    title: "Les routes de l'encens : géopolitique olfactive de l'Antiquité",
    slug: "routes-encens-geopolitique",
    category: "historical",
    summary: "Comment le commerce de l'encens et de la myrrhe a façonné les civilisations antiques et créé les premières routes commerciales intercontinentales.",
    content: `# Les routes de l'encens : géopolitique olfactive de l'Antiquité

## Introduction

L'encens et la myrrhe, résines aromatiques d'Arabie du Sud et de la Corne de l'Afrique, ont été parmi les marchandises les plus précieuses de l'Antiquité. Leur commerce a créé des empires, financé des temples et connecté des civilisations sur des milliers de kilomètres.

## Géographie de la production

### L'Arabie Heureuse (Arabia Felix)

Les royaumes du sud de la péninsule arabique (Saba, Hadramaout, Qataban) contrôlaient la production de l'encens (oliban, Boswellia sacra) :

- **Climat** : Zones arides montagneuses du Dhofar (Oman actuel) et du Yémen
- **Récolte** : Incisions dans l'écorce, collecte de la résine séchée
- **Qualité** : L'encens de première qualité (hojari) valait son poids en or

### La Corne de l'Afrique

La myrrhe (Commiphora myrrha) provenait principalement de Somalie et d'Éthiopie :

- **Punt** : Le légendaire "Pays de Dieu" des Égyptiens
- **Commerce** : Expéditions maritimes égyptiennes dès -2500

## Les routes commerciales

### La Route terrestre de l'Encens

Longue de 2400 km, elle reliait le Yémen à Gaza :

1. **Shabwa** (capitale du Hadramaout) → **Marib** (capitale de Saba)
2. **Marib** → **Yathrib** (future Médine)
3. **Yathrib** → **Pétra** (capitale nabatéenne)
4. **Pétra** → **Gaza** (port méditerranéen)

### Durée et coût

- **Durée** : 65 jours de voyage
- **Étapes** : 65 caravansérails
- **Taxes** : Jusqu'à 688 chameaux de taxes pour une caravane

## Usages rituels et mémoriels

### Égypte ancienne

- **Kyphi** : Encens composé de 16 ingrédients pour les rituels du soir
- **Embaumement** : Myrrhe et encens pour la préservation des momies
- **Temples** : Fumigations quotidiennes pour honorer les dieux

### Judaïsme

- **Ketoret** : Encens du Temple de Jérusalem (11 ingrédients)
- **Symbolisme** : La fumée montant vers le ciel représente les prières

### Christianisme

- **Mages** : Or, encens et myrrhe offerts à Jésus
- **Liturgie** : Encensement des autels et des fidèles

## Impact sur la mémoire collective

Le commerce de l'encens a créé :

1. **Des associations durables** : Encens = sacré, prière, purification
2. **Des traditions vivantes** : L'encensement reste pratiqué dans les trois monothéismes
3. **Des souvenirs collectifs** : L'odeur de l'encens évoque instantanément le sacré

## Conclusion

Les routes de l'encens illustrent comment une substance olfactive peut façonner l'histoire, l'économie et la spiritualité de civilisations entières. L'encens reste aujourd'hui un puissant évocateur de mémoire collective et de transcendance.`,
    tags: JSON.stringify(["histoire", "encens", "myrrhe", "commerce", "Antiquité", "religion"]),
    relatedMolecules: JSON.stringify(["incensole", "α-pinène", "limonène"]),
    relatedPlants: JSON.stringify(["Boswellia sacra", "Commiphora myrrha"]),
    status: "published",
    featured: true
  },
  {
    title: "Parfums et pouvoir dans l'Égypte des pharaons",
    slug: "parfums-pouvoir-egypte",
    category: "historical",
    summary: "Le rôle central des parfums dans la religion, la politique et la vie quotidienne de l'Égypte ancienne.",
    content: `# Parfums et pouvoir dans l'Égypte des pharaons

## Introduction

L'Égypte ancienne a développé l'une des cultures olfactives les plus sophistiquées de l'Antiquité. Les parfums y étaient bien plus que des cosmétiques : ils étaient des instruments de pouvoir divin, politique et social.

## Les parfums des dieux

### Le Kyphi : parfum sacré

Le Kyphi (kapet en égyptien) était le parfum le plus sacré de l'Égypte ancienne :

**Composition (selon le Papyrus Ebers)** :
- Résines : myrrhe, encens, mastic
- Épices : cannelle, cardamome, safran
- Aromates : jonc odorant, souchet
- Liants : miel, vin, raisins secs

**Usage rituel** :
- Brûlé au coucher du soleil dans les temples
- Accompagnait le dieu Rê dans son voyage nocturne
- Créait un lien olfactif entre le monde des vivants et celui des dieux

### L'embaumement : parfums pour l'éternité

L'embaumement utilisait des quantités considérables de substances aromatiques :

| Substance | Rôle | Symbolisme |
|-----------|------|------------|
| Myrrhe | Antiseptique | Préservation |
| Encens | Purification | Divinité |
| Cèdre | Conservation | Éternité |
| Cannelle | Aromatisation | Résurrection |

## Les parfums du pouvoir

### Cléopâtre : la reine parfumée

Cléopâtre VII maîtrisait l'art du parfum comme instrument politique :

- **Rencontre avec César** : Voiles parfumés au nard et à la rose
- **Rencontre avec Marc Antoine** : Navire aux voiles imprégnées de parfum
- **Manufacture** : Possédait une fabrique de parfums à En-Gedi

### Le parfum comme prérogative royale

- Les pharaons contrôlaient le commerce des aromates
- Les temples avaient le monopole de la fabrication du Kyphi
- Offrir du parfum était un acte de soumission politique

## Mémoire et identité

### Parfums et identité sociale

Chaque classe sociale avait ses parfums caractéristiques :
- **Royauté** : Lotus bleu, myrrhe, encens
- **Prêtres** : Kyphi, oliban
- **Nobles** : Lys, rose, jasmin
- **Peuple** : Huile de moringa, sésame parfumé

### Transmission des recettes

Les recettes de parfums étaient gravées sur les murs des temples :
- **Temple d'Edfou** : Recettes de Kyphi
- **Temple de Philae** : Formules d'onguents sacrés

Ces inscriptions ont permis la transmission de la mémoire olfactive égyptienne à travers les millénaires.

## Héritage contemporain

L'Égypte ancienne a légué :
- Le concept de parfum comme objet de luxe et de pouvoir
- Les techniques d'extraction (enfleurage, macération)
- L'association encens = sacré, présente dans les trois monothéismes

## Conclusion

L'Égypte des pharaons a établi les fondements de notre rapport culturel aux parfums. La mémoire olfactive collective de l'Occident porte encore l'empreinte de cette civilisation qui voyait dans les parfums un pont entre le monde des hommes et celui des dieux.`,
    tags: JSON.stringify(["Égypte", "pharaons", "Kyphi", "embaumement", "Cléopâtre", "religion"]),
    relatedMolecules: JSON.stringify(["myrcène", "limonène", "cinnamaldéhyde"]),
    relatedPlants: JSON.stringify(["lotus bleu", "myrrhe", "encens", "cèdre"]),
    status: "published",
    featured: false
  },

  // Articles psychologiques
  {
    title: "Odeurs et émotions : la chimie du bien-être",
    slug: "odeurs-emotions-bien-etre",
    category: "psychological",
    summary: "Comment les odeurs influencent notre état émotionnel et peuvent être utilisées pour améliorer le bien-être psychologique.",
    content: `# Odeurs et émotions : la chimie du bien-être

## Introduction

Les odeurs ont un pouvoir unique sur nos émotions. Cette influence, longtemps considérée comme subjective, est aujourd'hui comprise comme un phénomène neurobiologique avec des applications concrètes pour le bien-être.

## Mécanismes neurobiologiques

### La voie rapide des émotions

L'information olfactive atteint l'amygdale en moins de 100 millisecondes, avant même que nous ayons conscience de l'odeur. Cette "voie rapide" explique pourquoi les odeurs peuvent déclencher des réactions émotionnelles instantanées.

### Modulation des neurotransmetteurs

Certaines molécules odorantes modulent directement les systèmes de neurotransmission :

| Molécule | Source | Effet | Mécanisme |
|----------|--------|-------|-----------|
| Linalol | Lavande | Anxiolytique | Modulation GABAergique |
| Limonène | Agrumes | Antidépresseur | Augmentation sérotonine |
| β-pinène | Conifères | Relaxant | Réduction cortisol |
| 1,8-cinéole | Eucalyptus | Stimulant | Activation cholinergique |

## Applications pratiques

### Aromathérapie fondée sur les preuves

L'aromathérapie scientifique utilise des protocoles validés :

**Anxiété** :
- Lavande (Lavandula angustifolia) : réduction de 20-30% des scores d'anxiété
- Bergamote : diminution du cortisol salivaire

**Dépression** :
- Agrumes (limonène) : amélioration de l'humeur
- Ylang-ylang : réduction des symptômes dépressifs

**Stress** :
- Forêt (phytoncides) : réduction de la pression artérielle
- Rose : diminution du rythme cardiaque

### Le "bain de forêt" (Shinrin-yoku)

La pratique japonaise du bain de forêt exploite les effets des phytoncides (α-pinène, β-pinène, limonène) émis par les arbres :

- Réduction du cortisol : -12,4%
- Réduction de la pression artérielle : -5,6%
- Augmentation des cellules NK (immunité) : +50%

## Odeurs et mémoire émotionnelle

### Création d'ancres olfactives

Les odeurs peuvent être utilisées pour créer des "ancres" émotionnelles positives :

1. **Encodage** : Associer une odeur agréable à un état de bien-être (méditation, relaxation)
2. **Consolidation** : Répéter l'association pendant plusieurs semaines
3. **Rappel** : Utiliser l'odeur pour retrouver l'état de bien-être

### Applications thérapeutiques

- **PTSD** : Utilisation d'odeurs sécurisantes pour contrer les flashbacks
- **Anxiété sociale** : Ancres olfactives pour les situations stressantes
- **Deuil** : Odeurs associées au défunt pour faciliter le travail de mémoire

## Recommandations PERFUMUM

### Compositions pour le bien-être

1. **Relaxation** : Lavande + bergamote + cèdre
2. **Énergie** : Menthe + romarin + citron
3. **Concentration** : Eucalyptus + romarin + pin
4. **Réconfort** : Vanille + benjoin + santal

### Protocoles d'utilisation

- **Diffusion** : 15-30 minutes, 2-3 fois par jour
- **Inhalation directe** : 3-5 respirations profondes
- **Application cutanée** : Diluée à 2-3% dans une huile végétale

## Conclusion

Les odeurs sont des modulateurs puissants de notre état émotionnel. Leur utilisation raisonnée, fondée sur les connaissances neurobiologiques, offre des outils concrets pour améliorer le bien-être au quotidien.`,
    tags: JSON.stringify(["émotions", "bien-être", "aromathérapie", "stress", "anxiété"]),
    relatedMolecules: JSON.stringify(["linalol", "limonène", "β-pinène", "1,8-cinéole"]),
    relatedPlants: JSON.stringify(["lavande", "bergamote", "eucalyptus", "pin"]),
    status: "published",
    featured: true
  },

  // Articles thérapeutiques
  {
    title: "Rééducation olfactive : protocoles et résultats",
    slug: "reeducation-olfactive-protocoles",
    category: "therapeutic",
    summary: "Les protocoles d'entraînement olfactif pour la récupération après anosmie et leurs applications en neuroréhabilitation.",
    content: `# Rééducation olfactive : protocoles et résultats

## Introduction

L'entraînement olfactif est devenu le traitement de référence pour l'anosmie post-virale, notamment après la pandémie de COVID-19. Cette approche exploite la neuroplasticité unique du système olfactif.

## Le protocole standard de Hummel

### Principe

Le protocole développé par Thomas Hummel (Université de Dresde) consiste à sentir régulièrement un ensemble d'odeurs pour stimuler la régénération des neurones olfactifs.

### Les 4 odeurs de base

| Odeur | Molécule principale | Catégorie olfactive |
|-------|---------------------|---------------------|
| Rose | Phényléthanol | Florale |
| Eucalyptus | 1,8-cinéole | Fraîche |
| Citron | Limonène | Agrume |
| Clou de girofle | Eugénol | Épicée |

### Protocole

1. **Fréquence** : 2 fois par jour (matin et soir)
2. **Durée** : Minimum 4 mois, idéalement 6-12 mois
3. **Technique** : Sentir chaque odeur pendant 10-15 secondes en se concentrant sur l'odeur
4. **Progression** : Ajouter de nouvelles odeurs après 3 mois

## Résultats cliniques

### Efficacité

- **Taux de récupération** : 30-60% d'amélioration significative
- **Délai** : Amélioration visible après 3-4 mois
- **Facteurs favorables** : Jeune âge, début précoce, anosmie partielle

### Mécanismes

L'entraînement olfactif stimule :
1. **Neurogenèse** : Régénération des neurones olfactifs dans l'épithélium
2. **Plasticité synaptique** : Renforcement des connexions dans le bulbe olfactif
3. **Réorganisation corticale** : Adaptation du cortex piriforme

## Protocoles avancés

### Entraînement modifié (12 odeurs)

Pour les cas résistants, un protocole étendu avec 12 odeurs couvrant toutes les catégories olfactives :

**Florales** : Rose, jasmin, lavande
**Fruitées** : Citron, orange, fraise
**Épicées** : Clou de girofle, cannelle, menthe
**Boisées** : Cèdre, pin, eucalyptus

### Entraînement assisté par imagerie

Combiner l'entraînement olfactif avec la visualisation mentale de l'odeur améliore les résultats de 20-30%.

## Applications en neuroréhabilitation

### Maladie d'Alzheimer

L'entraînement olfactif peut :
- Ralentir le déclin de la fonction olfactive
- Stimuler les circuits hippocampiques
- Améliorer la mémoire épisodique

### Maladie de Parkinson

- Préservation de la fonction olfactive résiduelle
- Stimulation de la neuroplasticité dopaminergique

### Traumatisme crânien

- Récupération de l'anosmie post-traumatique
- Réhabilitation cognitive associée

## Recommandations pratiques

### Kit d'entraînement PERFUMUM

Composition recommandée pour un kit d'entraînement :

1. **Huiles essentielles pures** : Rose, eucalyptus, citron, clou de girofle
2. **Support** : Flacons en verre ambré avec compte-gouttes
3. **Journal de suivi** : Noter les perceptions quotidiennes
4. **Guide** : Instructions détaillées et conseils

### Conseils pour optimiser les résultats

- **Régularité** : Ne pas sauter de séances
- **Concentration** : Se focaliser sur l'odeur, éviter les distractions
- **Patience** : Les résultats prennent du temps
- **Variété** : Introduire de nouvelles odeurs progressivement

## Conclusion

L'entraînement olfactif est une approche simple, peu coûteuse et efficace pour la récupération de l'odorat. Son succès repose sur la neuroplasticité remarquable du système olfactif et ouvre des perspectives pour la neuroréhabilitation au-delà de l'anosmie.`,
    tags: JSON.stringify(["rééducation", "anosmie", "entraînement olfactif", "neuroplasticité", "COVID-19"]),
    relatedMolecules: JSON.stringify(["phényléthanol", "1,8-cinéole", "limonène", "eugénol"]),
    relatedPlants: JSON.stringify(["rose", "eucalyptus", "citron", "clou de girofle"]),
    status: "published",
    featured: true
  },

  // Article culturel
  {
    title: "Mémoire olfactive collective : transmission et patrimoine",
    slug: "memoire-olfactive-collective",
    category: "cultural",
    summary: "Comment les odeurs participent à la construction de l'identité culturelle et à la transmission du patrimoine immatériel.",
    content: `# Mémoire olfactive collective : transmission et patrimoine

## Introduction

Au-delà de la mémoire individuelle, les odeurs participent à la construction d'une mémoire collective qui définit l'identité des communautés et des cultures. Ce patrimoine olfactif immatériel se transmet de génération en génération.

## Les marqueurs olfactifs culturels

### Odeurs identitaires

Chaque culture possède des odeurs qui la définissent :

| Culture | Odeurs identitaires | Contexte |
|---------|---------------------|----------|
| Méditerranée | Thym, romarin, lavande | Garrigue, cuisine |
| Japon | Encens, tatami, umami | Temples, maisons |
| Inde | Santal, jasmin, épices | Rituels, cuisine |
| Mexique | Copal, maïs, piment | Cérémonies, cuisine |

### Transmission intergénérationnelle

Les odeurs se transmettent par :
1. **L'alimentation** : Recettes familiales, épices traditionnelles
2. **Les rituels** : Encens religieux, parfums cérémoniels
3. **L'environnement** : Paysages olfactifs, métiers traditionnels
4. **Les soins** : Remèdes traditionnels, cosmétiques

## Patrimoine olfactif en danger

### Menaces contemporaines

- **Uniformisation** : Parfums synthétiques standardisés
- **Urbanisation** : Disparition des paysages olfactifs naturels
- **Mondialisation** : Perte des savoir-faire locaux
- **Pollution** : Masquage des odeurs naturelles

### Initiatives de préservation

- **UNESCO** : Reconnaissance du patrimoine olfactif immatériel
- **Grasse** : Inscription des savoir-faire parfumeurs au patrimoine mondial (2018)
- **Japon** : Préservation de la voie de l'encens (Kōdō)

## Cas d'étude : la mémoire olfactive de Grasse

### Histoire

Grasse, capitale mondiale de la parfumerie depuis le XVIe siècle, possède une mémoire olfactive collective unique :

- **Paysages** : Champs de jasmin, rose, tubéreuse
- **Métiers** : Cueilleurs, extracteurs, parfumeurs
- **Traditions** : Fête du jasmin, transmission familiale

### Préservation

- **Musée International de la Parfumerie** : Conservation des savoir-faire
- **Plantations patrimoniales** : Maintien des cultures traditionnelles
- **Formation** : École de parfumerie de Grasse

## Applications pour PERFUMUM

### Documentation du patrimoine olfactif

Le projet PERFUMUM peut contribuer à :
1. **Archiver** les odeurs traditionnelles en voie de disparition
2. **Documenter** les savoir-faire olfactifs locaux
3. **Recréer** des paysages olfactifs historiques
4. **Transmettre** la mémoire olfactive aux générations futures

### Méthodologie

- **Enquêtes ethnographiques** : Recueillir les témoignages olfactifs
- **Analyses chimiques** : Identifier les molécules caractéristiques
- **Reconstitutions** : Créer des compositions évocatrices
- **Archives** : Constituer une base de données olfactive

## Conclusion

La mémoire olfactive collective est un patrimoine immatériel précieux qui participe à la définition de l'identité culturelle. Sa préservation et sa transmission sont des enjeux majeurs pour maintenir la diversité culturelle face à l'uniformisation contemporaine.`,
    tags: JSON.stringify(["patrimoine", "culture", "transmission", "identité", "Grasse", "UNESCO"]),
    relatedMolecules: JSON.stringify(["linalol", "géraniol", "jasmone"]),
    relatedPlants: JSON.stringify(["jasmin", "rose", "lavande", "santal"]),
    status: "published",
    featured: false
  }
];

// ============================================================================
// SOURCES BIBLIOGRAPHIQUES
// ============================================================================

const SOURCES = [
  {
    sourceType: "scientific_paper",
    title: "A novel multigene family may encode odorant receptors: A molecular basis for odor recognition",
    authors: JSON.stringify(["Linda Buck", "Richard Axel"]),
    publicationYear: 1991,
    journal: "Cell",
    volume: "65",
    pages: "175-187",
    doi: "10.1016/0092-8674(91)90418-X",
    abstract: "Article fondateur décrivant la découverte des récepteurs olfactifs, qui a valu le Prix Nobel de Physiologie ou Médecine 2004 à Buck et Axel.",
    relevanceScore: 100,
    verified: true
  },
  {
    sourceType: "book",
    title: "The Scent of Desire: Discovering Our Enigmatic Sense of Smell",
    authors: JSON.stringify(["Rachel Herz"]),
    publicationYear: 2007,
    publisher: "William Morrow",
    isbn: "978-0060825379",
    abstract: "Ouvrage de référence sur la psychologie de l'olfaction, explorant les liens entre odeurs, émotions et mémoire.",
    relevanceScore: 95,
    verified: true
  },
  {
    sourceType: "scientific_paper",
    title: "Odor-evoked autobiographical memories: Psychological investigations of Proustian phenomena",
    authors: JSON.stringify(["Johan Willander", "Maria Larsson"]),
    publicationYear: 2006,
    journal: "Chemical Senses",
    volume: "31",
    pages: "105-116",
    doi: "10.1093/chemse/bjj005",
    abstract: "Étude démontrant que les souvenirs déclenchés par des odeurs sont plus anciens et plus émotionnels que ceux déclenchés par d'autres stimuli.",
    relevanceScore: 90,
    verified: true
  },
  {
    sourceType: "scientific_paper",
    title: "Odor cues during slow-wave sleep prompt declarative memory consolidation",
    authors: JSON.stringify(["Björn Rasch", "Christian Büchel", "Steffen Gais", "Jan Born"]),
    publicationYear: 2007,
    journal: "Science",
    volume: "315",
    pages: "1426-1429",
    doi: "10.1126/science.1138581",
    abstract: "Étude montrant que la réactivation d'odeurs pendant le sommeil renforce la consolidation des souvenirs.",
    relevanceScore: 88,
    verified: true
  },
  {
    sourceType: "book",
    title: "The Neurobiology of Olfaction",
    authors: JSON.stringify(["Gordon M. Shepherd"]),
    publicationYear: 2010,
    publisher: "CRC Press",
    isbn: "978-1420071979",
    abstract: "Manuel de référence sur la neurobiologie du système olfactif.",
    relevanceScore: 92,
    verified: true
  },
  {
    sourceType: "scientific_paper",
    title: "Effects of olfactory training in patients with olfactory loss",
    authors: JSON.stringify(["Thomas Hummel", "Karo Rissom", "Jens Reden", "Aantje Hähner", "Mark Weidenbecher", "Karl-Bernd Hüttenbrink"]),
    publicationYear: 2009,
    journal: "Laryngoscope",
    volume: "119",
    pages: "496-499",
    doi: "10.1002/lary.20101",
    abstract: "Étude fondatrice sur l'efficacité de l'entraînement olfactif pour la récupération de l'odorat.",
    relevanceScore: 85,
    verified: true
  },
  {
    sourceType: "scientific_paper",
    title: "Incensole acetate, an incense component, elicits psychoactivity by activating TRPV3 channels in the brain",
    authors: JSON.stringify(["Arieh Moussaieff", "Neta Rimmerman", "Tatiana Bregman", "Alex Straiker", "Christian C. Felder", "Shai Shoham", "Yoel Kashman", "Susan M. Huang", "Hyosang Lee", "Esther Shohami", "Ken Mackie", "Michael J. Caterina", "J. Michael Walker", "Ester Fride", "Raphael Mechoulam"]),
    publicationYear: 2008,
    journal: "FASEB Journal",
    volume: "22",
    pages: "3024-3034",
    doi: "10.1096/fj.07-101865",
    abstract: "Découverte des effets psychoactifs de l'incensole acétate, composant de l'encens.",
    relevanceScore: 80,
    verified: true
  },
  {
    sourceType: "book",
    title: "Episodic and Semantic Memory",
    authors: JSON.stringify(["Endel Tulving"]),
    publicationYear: 1972,
    publisher: "Academic Press",
    abstract: "Ouvrage fondateur introduisant la distinction entre mémoire épisodique et sémantique.",
    relevanceScore: 95,
    verified: true
  },
  {
    sourceType: "scientific_paper",
    title: "Olfactory dysfunction in COVID-19: Diagnosis and management",
    authors: JSON.stringify(["Valentina Parma", "Kathrin Ohla", "Maria G. Veldhuizen", "Masha Y. Niv", "Christine E. Kelly"]),
    publicationYear: 2020,
    journal: "Chemical Senses",
    volume: "45",
    pages: "531-544",
    doi: "10.1093/chemse/bjaa043",
    abstract: "Revue complète sur les dysfonctions olfactives liées au COVID-19.",
    relevanceScore: 82,
    verified: true
  },
  {
    sourceType: "podcast",
    title: "Smell Talks : L'émergence des arts olfactifs",
    authors: JSON.stringify(["Clara Muller"]),
    publicationYear: 2025,
    publisher: "Nez Magazine",
    url: "https://mag.bynez.com/podcastsbynez-parfum/smell-talks-lemergence-des-arts-olfactifs-histoire-et-conceptions-occidentales/",
    abstract: "Podcast explorant l'histoire et les conceptions occidentales des arts olfactifs.",
    relevanceScore: 75,
    verified: true
  },
  {
    sourceType: "article",
    title: "Les monothéismes à travers la fumée",
    authors: JSON.stringify(["Nez Magazine"]),
    publicationYear: 2025,
    publisher: "Nez Magazine",
    url: "https://mag.bynez.com/histoire-parfum-olfaction/les-monotheismes-a-travers-la-fumee/",
    abstract: "Article sur le rôle de l'encens dans les trois religions monothéistes.",
    relevanceScore: 78,
    verified: true
  },
  {
    sourceType: "scientific_paper",
    title: "Aromas of rosemary and lavender essential oils differentially affect cognition and mood",
    authors: JSON.stringify(["Mark Moss", "Jenny Cook", "Keith Wesnes", "Paul Duckett"]),
    publicationYear: 2003,
    journal: "International Journal of Neuroscience",
    volume: "113",
    pages: "15-38",
    doi: "10.1080/00207450390161903",
    abstract: "Étude montrant les effets différenciés du romarin et de la lavande sur la cognition.",
    relevanceScore: 83,
    verified: true
  }
];

// ============================================================================
// FONCTION D'IMPORT
// ============================================================================

async function importData() {
  console.log("🧠 Import des données Olfaction & Mémoire...\n");
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // Import des concepts
    console.log("📚 Import des concepts clés...");
    for (const concept of CONCEPTS) {
      await connection.execute(
        `INSERT INTO memory_olfaction_concepts 
         (name, slug, type, definition, description, scientific_basis, historical_context, key_researchers, seminal_papers)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         definition = VALUES(definition),
         description = VALUES(description),
         scientific_basis = VALUES(scientific_basis),
         historical_context = VALUES(historical_context),
         key_researchers = VALUES(key_researchers),
         seminal_papers = VALUES(seminal_papers)`,
        [
          concept.name,
          concept.slug,
          concept.type,
          concept.definition,
          concept.description,
          concept.scientificBasis,
          concept.historicalContext || null,
          concept.keyResearchers,
          concept.seminalPapers
        ]
      );
      console.log(`  ✓ ${concept.name}`);
    }
    console.log(`  → ${CONCEPTS.length} concepts importés\n`);
    
    // Import des articles
    console.log("📝 Import des articles de recherche...");
    for (const article of ARTICLES) {
      await connection.execute(
        `INSERT INTO olfaction_memory 
         (title, slug, category, summary, content, tags, status, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         summary = VALUES(summary),
         content = VALUES(content),
         tags = VALUES(tags),
         status = VALUES(status),
         featured = VALUES(featured)`,
        [
          article.title,
          article.slug,
          article.category,
          article.summary,
          article.content,
          article.tags,
          article.status,
          article.featured
        ]
      );
      console.log(`  ✓ ${article.title}`);
    }
    console.log(`  → ${ARTICLES.length} articles importés\n`);
    
    // Import des sources
    console.log("📖 Import des sources bibliographiques...");
    for (const source of SOURCES) {
      await connection.execute(
        `INSERT INTO olfaction_memory_sources 
         (source_type, title, authors, publication_year, journal, volume, pages, doi, publisher, isbn, url, abstract, relevance_score)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         authors = VALUES(authors),
         publication_year = VALUES(publication_year),
         abstract = VALUES(abstract),
         relevance_score = VALUES(relevance_score)`,
        [
          source.sourceType,
          source.title,
          source.authors,
          source.publicationYear,
          source.journal || null,
          source.volume || null,
          source.pages || null,
          source.doi || null,
          source.publisher || null,
          source.isbn || null,
          source.url || null,
          source.abstract || null,
          source.relevanceScore || 50
        ]
      );
      console.log(`  ✓ ${source.title.substring(0, 60)}...`);
    }
    console.log(`  → ${SOURCES.length} sources importées\n`);
    
    console.log("✅ Import terminé avec succès !");
    
  } catch (error) {
    console.error("❌ Erreur lors de l'import:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

importData().catch(console.error);
