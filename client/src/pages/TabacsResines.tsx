import { Cigarette, Leaf, FlaskConical, Droplets, Flame, Globe2 } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { GammeBadge } from "../components/GammeBadge";

export default function TabacsResines() {
  const tabacs = [
    {
      name: "Krumovgrad",
      origin: "Bulgarie (région de Krumovgrad)",
      type: "Oriental",
      gamme: "volcanique" as const,
      profile: {
        dominant: "Fumé intense, cuir, miel sombre",
        secondary: "Épices, fruits secs, réglisse",
        intensity: 9,
        volatility: "Moyenne-basse"
      },
      molecules: ["β-damascénone", "Mégastigmatrienone", "Pyrazines", "Phénols"],
      usage: "Accords Volcanique extrêmes, formulations rituelles, installations fumées",
      notes: "Tabac de référence pour profils pyrolysés intenses. Maturation 6-12 mois recommandée."
    },
    {
      name: "Virginia Orange",
      origin: "USA (Virginie, Caroline du Nord)",
      type: "Bright",
      gamme: "civilisations" as const,
      profile: {
        dominant: "Miel, caramel, agrumes",
        secondary: "Foin, vanille, pain grillé",
        intensity: 6,
        volatility: "Moyenne"
      },
      molecules: ["β-ionone", "Maltol", "Furfural", "Acide isovalérique"],
      usage: "Accords Civilisations (Égypte, Grèce), formulations douces, mélanges équilibrés",
      notes: "Polyvalent, excellente base pour synergies lactones et terpènes."
    },
    {
      name: "Virginia Deutscher",
      origin: "Allemagne (Bade-Wurtemberg)",
      type: "Bright",
      gamme: "petrichor" as const,
      profile: {
        dominant: "Terre humide, foin coupé, miel léger",
        secondary: "Herbe fraîche, céréales, notes vertes",
        intensity: 5,
        volatility: "Moyenne-haute"
      },
      molecules: ["Géosmine", "2-méthylisoborneol", "Hexanal", "Linalool"],
      usage: "Accords Pétrichor (F.1 Fantôme, S.1 Souterrain), formulations terreuses",
      notes: "Profil géosmine marqué, idéal pour évocations pluie/terre."
    },
    {
      name: "Virginia Gold",
      origin: "USA (Caroline du Sud)",
      type: "Bright",
      gamme: "civilisations" as const,
      profile: {
        dominant: "Miel doré, fruits jaunes, vanille",
        secondary: "Foin sec, caramel, noisette",
        intensity: 7,
        volatility: "Moyenne"
      },
      molecules: ["β-damascénone", "Maltol", "Vanilline", "Coumarine"],
      usage: "Accords Civilisations (Mésopotamie, Perse), formulations sucrées",
      notes: "Richesse aromatique exceptionnelle, maturation 3-6 mois."
    },
    {
      name: "Virginia Bright",
      origin: "USA (Virginie)",
      type: "Bright",
      gamme: "glaciaire" as const,
      profile: {
        dominant: "Fraîcheur vive, citron, foin vert",
        secondary: "Menthe légère, herbe coupée, miel blanc",
        intensity: 4,
        volatility: "Haute"
      },
      molecules: ["Linalool", "Limonène", "Nérol", "Citral"],
      usage: "Accords Glaciaire (G.1 Ozone, G.2 Altitude), formulations fraîches",
      notes: "Profil terpénique marqué, volatilité élevée (utilisation rapide)."
    },
    {
      name: "Virginia Italia",
      origin: "Italie (Vénétie, Ombrie)",
      type: "Bright",
      gamme: "civilisations" as const,
      profile: {
        dominant: "Fruits confits, miel d'acacia, figue",
        secondary: "Amande, pain d'épices, réglisse douce",
        intensity: 7,
        volatility: "Moyenne-basse"
      },
      molecules: ["β-ionone", "Benzaldéhyde", "Coumarine", "Vanilline"],
      usage: "Accords Civilisations (Rome, Venise), formulations gourmandes",
      notes: "Caractère méditerranéen unique, synergies lactones exceptionnelles."
    },
    {
      name: "Burley",
      origin: "USA (Kentucky, Tennessee)",
      type: "Air-cured",
      gamme: "volcanique" as const,
      profile: {
        dominant: "Cacao, café, noix, cuir",
        secondary: "Terre sèche, bois brûlé, épices sombres",
        intensity: 8,
        volatility: "Basse"
      },
      molecules: ["Pyrazines", "Acides gras", "Indoles", "Phénols"],
      usage: "Accords Volcanique (V.2 Pyrolyse, V.3 Cendre), formulations intenses",
      notes: "Profil pyrazine dominant, excellent pour accords fumés/torréfiés."
    },
    {
      name: "Samsoun",
      origin: "Turquie (région de Samsun, mer Noire)",
      type: "Oriental",
      gamme: "civilisations" as const,
      profile: {
        dominant: "Épices orientales, miel sombre, encens",
        secondary: "Rose, fruits secs, cuir doux",
        intensity: 8,
        volatility: "Moyenne"
      },
      molecules: ["β-damascénone", "Eugénol", "Cinnamaldéhyde", "Indoles"],
      usage: "Accords Civilisations (Byzance, Ottoman), formulations rituelles",
      notes: "Profil oriental complexe, maturation longue (12-24 mois) recommandée."
    }
  ];

  const resines = [
    {
      name: "Résine CBD Premium",
      type: "Extraction CO₂ supercritique",
      gamme: "biolab" as const,
      profile: "Terpènes préservés (myrcène, limonène, β-caryophyllène), profil floral/fruité",
      concentration: "85-95% cannabinoïdes totaux",
      usage: "Formulations Bio-Lab, accords expérimentaux, synergies terpéniques",
      notes: "7 profils premium développés (voir page Résines CBD)"
    },
    {
      name: "Absolue de Tabac",
      type: "Extraction éthanol",
      gamme: "volcanique" as const,
      profile: "Concentré aromatique intense, notes cuir/miel/fumé amplifiées",
      concentration: "Extraction 1:10 (10kg tabac → 1kg absolue)",
      usage: "Formulations concentrées, installations olfactives, accords signature",
      notes: "Disponible pour toutes variétés de tabacs (sur commande)"
    },
    {
      name: "Résinoïde de Tabac",
      type: "Extraction solvant (hexane)",
      gamme: "volcanique" as const,
      profile: "Texture cireuse, profil fumé/résineux, fixateur naturel",
      concentration: "Extraction 1:15 (15kg tabac → 1kg résinoïde)",
      usage: "Fixation accords, formulations longue durée, installations permanentes",
      notes: "Stabilité exceptionnelle (5-10 ans), idéal pour archivage olfactif"
    }
  ];

  const methodologies = [
    {
      icon: Leaf,
      title: "Sélection Terroir",
      description: "Sourcing direct producteurs, traçabilité complète, certification biologique privilégiée"
    },
    {
      icon: FlaskConical,
      title: "Extraction Verte",
      description: "CO₂ supercritique, hydrodistillation, enfleurage (sans solvants pétroliers)"
    },
    {
      icon: Droplets,
      title: "Maturation Contrôlée",
      description: "Vieillissement 3-24 mois selon variété, hygrométrie 65-70%, température 18-22°C"
    },
    {
      icon: Flame,
      title: "Pyrolyse Analytique",
      description: "Caractérisation profils de combustion, optimisation températures, analyse GC-MS"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs />

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Cigarette className="w-10 h-10 text-amber-400" />
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Tabacs & Résines
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl">
            Catalogue des 8 variétés de tabacs et résines utilisées dans le projet PERFUMUM. 
            Chaque matière première est sélectionnée pour son profil moléculaire unique et 
            son potentiel de synergies avec les 5 gammes atmosphériques.
          </p>
        </div>

        {/* Méthodologies */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold uppercase mb-6 text-amber-400">
            Méthodologies de Travail
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {methodologies.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <Icon className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-lg font-bold mb-2 text-white uppercase tracking-wide">
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-400">{method.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabacs */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Cigarette className="w-8 h-8 text-amber-400" />
            <h2 className="text-3xl font-bold uppercase tracking-tight">
              8 Variétés de Tabacs
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tabacs.map((tabac, index) => (
              <div
                key={index}
                className="bg-white/5 border-2 border-white/10 p-6 hover:bg-white/10 hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold uppercase tracking-wide mb-1 text-white">
                      {tabac.name}
                    </h3>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <Globe2 className="w-4 h-4" />
                      {tabac.origin}
                    </p>
                  </div>
                  <GammeBadge gamme={tabac.gamme} size="sm" />
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Type
                    </p>
                    <p className="text-sm font-medium text-amber-400">{tabac.type}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Profil Olfactif
                    </p>
                    <p className="text-sm text-gray-300 mb-1">
                      <span className="font-medium">Dominant:</span> {tabac.profile.dominant}
                    </p>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Secondaire:</span> {tabac.profile.secondary}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                        Intensité
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-400 h-full"
                            style={{ width: `${(tabac.profile.intensity / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono text-gray-400">
                          {tabac.profile.intensity}/10
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                        Volatilité
                      </p>
                      <p className="text-sm font-mono text-gray-400">
                        {tabac.profile.volatility}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Molécules Clés
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tabac.molecules.map((mol, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-white/10 border border-white/20 font-mono"
                        >
                          {mol}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Usage PERFUMUM
                    </p>
                    <p className="text-sm text-gray-300">{tabac.usage}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <p className="text-xs italic text-gray-500">{tabac.notes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Résines */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Droplets className="w-8 h-8 text-pink-400" />
            <h2 className="text-3xl font-bold uppercase tracking-tight">
              Résines & Extraits
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {resines.map((resine, index) => (
              <div
                key={index}
                className="bg-white/5 border-2 border-pink-500/30 p-6 hover:bg-pink-950/20 hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold uppercase tracking-wide text-white">
                    {resine.name}
                  </h3>
                  <GammeBadge gamme={resine.gamme} size="sm" />
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Type d'Extraction
                    </p>
                    <p className="text-sm font-medium text-pink-400">{resine.type}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Profil
                    </p>
                    <p className="text-sm text-gray-300">{resine.profile}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Concentration
                    </p>
                    <p className="text-sm font-mono text-gray-400">{resine.concentration}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Usage
                    </p>
                    <p className="text-sm text-gray-300">{resine.usage}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <p className="text-xs italic text-gray-500">{resine.notes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer stats */}
        <div className="pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-amber-400">8</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Variétés Tabacs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-400">3</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Types Résines</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">5</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Gammes PERFUMUM</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-cyan-400">41</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Synergies Documentées</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
