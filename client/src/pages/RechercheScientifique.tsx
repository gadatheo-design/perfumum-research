import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { 
  Flame, 
  Wind, 
  TestTube, 
  AlertTriangle, 
  Brain, 
  ClipboardList, 
  Building2, 
  Zap 
} from "lucide-react";

interface ResearchModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  isNew?: boolean;
  color: string;
  bgColor: string;
  borderColor: string;
}

const modules: ResearchModule[] = [
  {
    id: "degradation-terpenes",
    title: "Dégradation des Terpènes",
    description: "Étude des voies de dégradation thermique et oxydative des terpènes",
    icon: <Flame className="h-8 w-8" />,
    route: "/recherche-scientifique/degradation-terpenes",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  {
    id: "pyrolyse-combustion",
    title: "Pyrolyse & Combustion",
    description: "Analyse des produits de pyrolyse et de combustion du cannabis",
    icon: <Flame className="h-8 w-8" />,
    route: "/recherche-scientifique/pyrolyse-combustion",
    color: "text-red-600",
    bgColor: "bg-red-500",
    borderColor: "border-red-600"
  },
  {
    id: "courbes-volatilite",
    title: "Courbes de Volatilité",
    description: "Profils de volatilité des terpènes en fonction de la température",
    icon: <Wind className="h-8 w-8" />,
    route: "/recherche-scientifique/courbes-volatilite",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200"
  },
  {
    id: "modeles-analytiques",
    title: "Modèles Analytiques GC-MS",
    description: "Méthodes d'analyse par chromatographie en phase gazeuse couplée à la spectrométrie de masse",
    icon: <TestTube className="h-8 w-8" />,
    route: "/recherche-scientifique/modeles-analytiques",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  {
    id: "toxicologie",
    title: "Toxicologie",
    description: "Données toxicologiques et de sécurité pour les terpènes",
    icon: <AlertTriangle className="h-8 w-8" />,
    route: "/recherche-scientifique/toxicologie",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  },
  {
    id: "neuro-olfaction",
    title: "Neuro-Olfaction",
    description: "Mécanismes neurobiologiques de la perception olfactive",
    icon: <Brain className="h-8 w-8" />,
    route: "/recherche-scientifique/neuro-olfaction",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200"
  },
  {
    id: "sop-protocoles",
    title: "SOP Protocoles",
    description: "Procédures opératoires standardisées pour l'extraction et l'analyse",
    icon: <ClipboardList className="h-8 w-8" />,
    route: "/recherche-scientifique/sop-protocoles",
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200"
  },
  {
    id: "museologie-olfactive",
    title: "Muséologie Olfactive",
    description: "Conservation et présentation des profils aromatiques",
    icon: <Building2 className="h-8 w-8" />,
    route: "/recherche-scientifique/museologie-olfactive",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200"
  },
  {
    id: "synergies-moleculaires",
    title: "Synergies Moléculaires",
    description: "Interactions et effets synergiques entre terpènes",
    icon: <Zap className="h-8 w-8" />,
    route: "/recherche-scientifique/synergies-moleculaires",
    isNew: true,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200"
  }
];

export function RechercheScientifique() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-8 space-y-8">
        <Breadcrumbs />

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <TestTube className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl font-bold tracking-tight">
              RECHERCHE SCIENTIFIQUE
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Modules de recherche avancée pour l'étude approfondie des terpènes, cannabinoïdes et composés aromatiques. 
            Analyses chimiques, protocoles standardisés et données scientifiques pour une recherche olfactive de pointe.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const isRed = module.id === "pyrolyse-combustion";
            
            return (
              <Link key={module.id} href={module.route}>
                <a className={`
                  block p-6 rounded-lg border-3 transition-all duration-300
                  hover:scale-[1.02] hover:shadow-xl
                  ${isRed 
                    ? 'bg-red-500 border-red-600 text-white' 
                    : `${module.bgColor} ${module.borderColor}`
                  }
                `}>
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${isRed ? 'bg-red-600' : 'bg-white border-2 ' + module.borderColor}`}>
                        <div className={isRed ? 'text-white' : module.color}>
                          {module.icon}
                        </div>
                      </div>
                      {module.isNew && (
                        <span className="px-2 py-1 text-xs font-bold bg-violet-600 text-white rounded uppercase">
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className={`text-xl font-bold uppercase tracking-tight ${isRed ? 'text-white' : 'text-foreground'}`}>
                        {module.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${isRed ? 'text-red-50' : 'text-muted-foreground'}`}>
                        {module.description}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className={`flex items-center gap-2 text-sm font-medium ${isRed ? 'text-white' : module.color}`}>
                      <span>ACCÉDER</span>
                      <span>→</span>
                    </div>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-12 p-6 bg-purple-50 border-2 border-purple-200 rounded-lg">
          <div className="flex items-start gap-4">
            <TestTube className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-bold text-purple-900">Approche Scientifique Rigoureuse</h3>
              <p className="text-sm text-purple-800 leading-relaxed">
                Ces modules s'appuient sur des données scientifiques validées, des protocoles standardisés 
                et des méthodes analytiques de pointe. Chaque section est conçue pour soutenir une recherche 
                olfactive professionnelle et reproductible sur le long terme.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
