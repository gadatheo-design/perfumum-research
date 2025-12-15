import { Link } from "wouter";
import { 
  Crown, 
  Waves, 
  TreePine, 
  Sparkles,
  Clock,
  Thermometer,
  Beaker,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Profils d'exception
const profilsSignatures = [
  {
    id: "cuir-marin",
    nom: "Cuir Marin",
    sousTitre: "Fraîcheur marine × Cuir souple × Minéral",
    description: "Profil d'exception alliant fraîcheur marine et cuir souple. Ouverture saline et métallique sur fond de cuir tabac et ambre minéral. Une création audacieuse qui marie l'océan et le désert.",
    icone: <Waves className="h-10 w-10" />,
    couleur: "from-cyan-500 to-blue-600",
    bgCouleur: "bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-950 dark:to-blue-900",
    borderCouleur: "border-cyan-300 dark:border-cyan-700",
    notesTete: ["Sel", "Iodé", "Métallique", "Citrus frais"],
    notesCoeur: ["Cuir souple", "Tabac blond", "Épicé"],
    notesFond: ["Ambre gris", "Santal", "Minéral"],
    ingredients: [
      { nom: "Limonène", pourcentage: "15%" },
      { nom: "α-Pinène", pourcentage: "10%" },
      { nom: "Accord Cuivre", pourcentage: "25%" },
      { nom: "β-Caryophyllène", pourcentage: "12%" },
      { nom: "Absolu Tabac Blond", pourcentage: "13%" },
      { nom: "Ambroxan", pourcentage: "15%" },
      { nom: "Santalol", pourcentage: "10%" }
    ],
    pyramide: {
      tete: { pourcentage: 50, role: "Fraîcheur, sel" },
      coeur: { pourcentage: 25, role: "Cuir souple" },
      fond: { pourcentage: 25, role: "Minéral, fixateur" }
    },
    maturation: "21 jours",
    intensite: 8,
    status: "validated"
  },
  {
    id: "foret-cacao",
    nom: "Forêt de Cacao",
    sousTitre: "Terreux vert × Cacao épicé × Mousse humide",
    description: "Profil d'exception évoquant une forêt tropicale après la pluie. Notes terreuses et vertes sur fond de cacao épicé et mousse humide. Une immersion sensorielle dans la jungle.",
    icone: <TreePine className="h-10 w-10" />,
    couleur: "from-emerald-500 to-green-700",
    bgCouleur: "bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900",
    borderCouleur: "border-emerald-300 dark:border-emerald-700",
    notesTete: ["Terre humide", "Vert", "Camphré"],
    notesCoeur: ["Cacao amer", "Gingembre", "Cèdre"],
    notesFond: ["Mousse", "Boisé humide", "Terreux persistant"],
    ingredients: [
      { nom: "Bornéol", pourcentage: "10%" },
      { nom: "Linalol", pourcentage: "20%" },
      { nom: "Absolu Cacao", pourcentage: "20%" },
      { nom: "Zingibérène", pourcentage: "10%" },
      { nom: "Cèdre Atlas", pourcentage: "10%" },
      { nom: "Mousse de Chêne", pourcentage: "15%" },
      { nom: "Humulène", pourcentage: "15%" }
    ],
    pyramide: {
      tete: { pourcentage: 30, role: "Terreux, vert" },
      coeur: { pourcentage: 40, role: "Cacao, épice" },
      fond: { pourcentage: 30, role: "Mousse, humidité" }
    },
    maturation: "14 jours",
    intensite: 9,
    status: "validated"
  },
  {
    id: "fleur-fantome",
    nom: "Fleur Fantôme",
    sousTitre: "Floral éthéré × Aldéhydé × Musqué",
    description: "Profil d'exception éthéré et mystérieux. Floral blanc aldéhydé sur fond de musc transparent. Une présence olfactive insaisissable, comme un souvenir de fleur.",
    icone: <Sparkles className="h-10 w-10" />,
    couleur: "from-violet-400 to-purple-600",
    bgCouleur: "bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-950 dark:to-purple-900",
    borderCouleur: "border-violet-300 dark:border-violet-700",
    notesTete: ["Aldéhydé", "Pétillant", "Savonneux", "Frais"],
    notesCoeur: ["Floral blanc", "Jasmin", "Muguet"],
    notesFond: ["Musc blanc", "Ambré", "Peau", "Éthéré"],
    ingredients: [
      { nom: "Aldéhyde C-11", pourcentage: "0.5%" },
      { nom: "Aldéhyde C-12", pourcentage: "0.3%" },
      { nom: "Linalol", pourcentage: "15%" },
      { nom: "Hédione", pourcentage: "20%" },
      { nom: "Galaxolide", pourcentage: "15%" },
      { nom: "Iso E Super", pourcentage: "20%" },
      { nom: "Ambroxan", pourcentage: "10%" },
      { nom: "Benzyl acetate", pourcentage: "10%" }
    ],
    pyramide: {
      tete: { pourcentage: 20, role: "Aldéhydé pétillant" },
      coeur: { pourcentage: 40, role: "Floral diffusif" },
      fond: { pourcentage: 40, role: "Musc transparent" }
    },
    maturation: "10 jours",
    intensite: 6,
    status: "testing"
  }
];

export default function GammeSignatures() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Accueil</Link>
          <span>/</span>
          <Link href="/gammes" className="hover:text-foreground">Gammes</Link>
          <span>/</span>
          <span className="text-foreground">Signatures</span>
        </nav>

        {/* Header Premium */}
        <div className="relative mb-12 p-8 rounded-2xl bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 dark:from-amber-950 dark:via-yellow-950 dark:to-amber-950 border-2 border-amber-300 dark:border-amber-700 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <div>
                <Badge className="mb-2 bg-amber-500 text-white border-0">COLLECTION PREMIUM</Badge>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-amber-700 to-yellow-600 dark:from-amber-300 dark:to-yellow-400 bg-clip-text text-transparent">
                  GAMME SIGNATURES
                </h1>
              </div>
            </div>
            <p className="text-lg text-amber-800 dark:text-amber-200 max-w-2xl">
              Trois profils d'exception qui repoussent les limites de la formulation olfactive. 
              Des créations audacieuses, des accords inédits, une signature unique.
            </p>
          </div>
        </div>

        {/* Profils */}
        <div className="space-y-8">
          {profilsSignatures.map((profil, index) => (
            <Card key={profil.id} className={`overflow-hidden border-2 ${profil.borderCouleur}`}>
              <div className={`${profil.bgCouleur}`}>
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${profil.couleur} shadow-lg`}>
                        <div className="text-white">{profil.icone}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            #{String(index + 1).padStart(2, '0')}
                          </Badge>
                          <Badge variant={profil.status === 'validated' ? 'default' : 'secondary'}>
                            {profil.status === 'validated' ? 'Validé' : 'En test'}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl">{profil.nom}</CardTitle>
                        <CardDescription className="text-base mt-1">{profil.sousTitre}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-4 w-4 text-muted-foreground" />
                        <span>Intensité: {profil.intensite}/10</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{profil.maturation}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">{profil.description}</p>

                  {/* Pyramide olfactive */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-white/60 dark:bg-black/20">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm uppercase tracking-wide">Notes de Tête</h4>
                        <Badge variant="outline">{profil.pyramide.tete.pourcentage}%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{profil.pyramide.tete.role}</p>
                      <div className="flex flex-wrap gap-1">
                        {profil.notesTete.map((note) => (
                          <Badge key={note} variant="secondary" className="text-xs">{note}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/60 dark:bg-black/20">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm uppercase tracking-wide">Notes de Cœur</h4>
                        <Badge variant="outline">{profil.pyramide.coeur.pourcentage}%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{profil.pyramide.coeur.role}</p>
                      <div className="flex flex-wrap gap-1">
                        {profil.notesCoeur.map((note) => (
                          <Badge key={note} variant="secondary" className="text-xs">{note}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/60 dark:bg-black/20">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm uppercase tracking-wide">Notes de Fond</h4>
                        <Badge variant="outline">{profil.pyramide.fond.pourcentage}%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{profil.pyramide.fond.role}</p>
                      <div className="flex flex-wrap gap-1">
                        {profil.notesFond.map((note) => (
                          <Badge key={note} variant="secondary" className="text-xs">{note}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Ingrédients */}
                  <div>
                    <h4 className="font-semibold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Beaker className="h-4 w-4" />
                      Composition
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profil.ingredients.map((ing) => (
                        <div key={ing.nom} className="px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/30 text-sm">
                          <span className="font-medium">{ing.nom}</span>
                          <span className="text-muted-foreground ml-1">({ing.pourcentage})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Liens connexes */}
        <div className="mt-12 p-6 rounded-xl bg-muted/50 border">
          <h3 className="font-semibold mb-4">Explorer d'autres gammes</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/gammes">
              <a className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Toutes les gammes
                <ArrowRight className="h-4 w-4" />
              </a>
            </Link>
            <Link href="/resines-cbd">
              <a className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors">
                Résines CBD
                <ArrowRight className="h-4 w-4" />
              </a>
            </Link>
            <Link href="/synergies-terpenes-niches">
              <a className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors">
                Synergies Terpènes
                <ArrowRight className="h-4 w-4" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
