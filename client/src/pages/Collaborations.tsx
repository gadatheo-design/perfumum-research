import { Users, Microscope, Palette, FlaskConical, Building2, Globe2 } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";

export default function Collaborations() {
  const collaborationTypes = [
    {
      icon: Microscope,
      title: "Recherche Scientifique",
      color: "text-purple-400",
      bgColor: "bg-purple-950/30",
      borderColor: "border-purple-500/30",
      partners: [
        {
          type: "Laboratoire universitaire",
          domain: "Chimie analytique & spectrométrie de masse",
          contribution: "Analyses GC-MS des profils moléculaires, identification composés volatils",
          duration: "2024-2027"
        },
        {
          type: "Institut de recherche",
          domain: "Biotechnologie végétale & extraction verte",
          contribution: "Développement protocoles CO₂ supercritique, optimisation rendements",
          duration: "2025-2028"
        },
        {
          type: "Groupe de recherche",
          domain: "Neurosciences olfactives & perception sensorielle",
          contribution: "Études psychophysiques, cartographie récepteurs olfactifs",
          duration: "2026-2029"
        }
      ]
    },
    {
      icon: Palette,
      title: "Création Artistique",
      color: "text-pink-400",
      bgColor: "bg-pink-950/30",
      borderColor: "border-pink-500/30",
      partners: [
        {
          type: "Collectif artistique",
          domain: "Installation olfactive & art atmosphérique",
          contribution: "Co-création installations immersives, scénographie sensorielle",
          duration: "2024-2026"
        },
        {
          type: "Artiste indépendant",
          domain: "Performance & rituel contemporain",
          contribution: "Développement protocoles de diffusion in situ, dramaturgie olfactive",
          duration: "2025-2027"
        },
        {
          type: "Studio de design",
          domain: "Design sensoriel & architecture d'intérieur",
          contribution: "Intégration accords ABSORBE dans espaces commerciaux et culturels",
          duration: "2025-2030"
        }
      ]
    },
    {
      icon: FlaskConical,
      title: "Industrie & Production",
      color: "text-cyan-400",
      bgColor: "bg-cyan-950/30",
      borderColor: "border-cyan-500/30",
      partners: [
        {
          type: "Producteur agricole",
          domain: "Tabacs rares & cultivation biologique",
          contribution: "Approvisionnement variétés niche (Krumovgrad, Samsoun), traçabilité terroir",
          duration: "2024-2035"
        },
        {
          type: "Extracteur spécialisé",
          domain: "Résines naturelles & absolus botaniques",
          contribution: "Extraction sur-mesure matières premières rares, contrôle qualité",
          duration: "2025-2030"
        },
        {
          type: "Laboratoire CBD",
          domain: "Génétique cannabinoïde & terpènes",
          contribution: "Développement profils terpéniques premium, analyses chromatographiques",
          duration: "2024-2028"
        }
      ]
    },
    {
      icon: Building2,
      title: "Institutions Culturelles",
      color: "text-amber-400",
      bgColor: "bg-amber-950/30",
      borderColor: "border-amber-500/30",
      partners: [
        {
          type: "Musée d'art contemporain",
          domain: "Exposition & médiation culturelle",
          contribution: "Accueil installations ABSORBE, programmation événements olfactifs",
          duration: "2025-2026"
        },
        {
          type: "Centre culturel",
          domain: "Résidence artistique & recherche-création",
          contribution: "Mise à disposition espace laboratoire, soutien production",
          duration: "2024-2025"
        },
        {
          type: "Fondation",
          domain: "Patrimoine immatériel & mémoire olfactive",
          contribution: "Documentation pratiques traditionnelles, archivage accords civilisations",
          duration: "2026-2035"
        }
      ]
    },
    {
      icon: Globe2,
      title: "Réseaux Internationaux",
      color: "text-green-400",
      bgColor: "bg-green-950/30",
      borderColor: "border-green-500/30",
      partners: [
        {
          type: "Réseau de recherche européen",
          domain: "Chimie verte & économie circulaire",
          contribution: "Partage méthodologies extraction durable, publications scientifiques",
          duration: "2025-2030"
        },
        {
          type: "Plateforme collaborative",
          domain: "Open science & données olfactives",
          contribution: "Mise en commun bases de données moléculaires, protocoles open-source",
          duration: "2024-2035"
        },
        {
          type: "Association professionnelle",
          domain: "Parfumerie naturelle & formulation artisanale",
          contribution: "Échanges techniques, formations continues, veille réglementaire",
          duration: "2024-2035"
        }
      ]
    }
  ];

  const principles = [
    {
      title: "Réciprocité",
      description: "Échanges équilibrés de savoirs, ressources et compétences entre partenaires"
    },
    {
      title: "Transparence",
      description: "Communication ouverte sur objectifs, méthodes et résultats de recherche"
    },
    {
      title: "Autonomie",
      description: "Préservation de l'indépendance créative et scientifique de chaque partie"
    },
    {
      title: "Durabilité",
      description: "Engagement long-terme (2-10 ans) pour approfondir les collaborations"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs />

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Collaborations
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl">
            PERFUMUM s'inscrit dans un réseau de partenaires scientifiques, artistiques et industriels. 
            Les collaborations sont anonymisées pour préserver la confidentialité des échanges tout en 
            documentant la diversité des expertises mobilisées.
          </p>
        </div>

        {/* Principes de collaboration */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold uppercase mb-6 text-purple-400">
            Principes de Collaboration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {principles.map((principle, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
              >
                <h3 className="text-lg font-bold mb-2 text-white uppercase tracking-wide">
                  {principle.title}
                </h3>
                <p className="text-sm text-gray-400">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Types de collaborations */}
        <div className="space-y-12">
          {collaborationTypes.map((type, typeIndex) => {
            const Icon = type.icon;
            return (
              <div key={typeIndex}>
                <div className="flex items-center gap-3 mb-6">
                  <Icon className={`w-8 h-8 ${type.color}`} />
                  <h2 className="text-3xl font-bold uppercase tracking-tight">
                    {type.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {type.partners.map((partner, partnerIndex) => (
                    <div
                      key={partnerIndex}
                      className={`${type.bgColor} border-2 ${type.borderColor} p-6 hover:scale-[1.02] transition-all duration-300`}
                    >
                      <div className="mb-4">
                        <h3 className="text-xl font-bold uppercase tracking-wide mb-2 text-white">
                          {partner.type}
                        </h3>
                        <p className={`text-sm font-medium ${type.color}`}>
                          {partner.domain}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                            Contribution
                          </p>
                          <p className="text-sm text-gray-300">
                            {partner.contribution}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                            Durée
                          </p>
                          <p className="text-sm font-mono text-gray-400">
                            {partner.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer stats */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-purple-400">15</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Partenaires actifs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-400">5</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Domaines</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-cyan-400">8</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Pays</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-400">2024-2035</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Horizon</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">12</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Publications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
