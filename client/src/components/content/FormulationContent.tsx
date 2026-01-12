import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FlaskConical, FileText, Beaker, History, ArrowRight } from "lucide-react";

export default function FormulationContent() {
  const tools = [
    {
      icon: FlaskConical,
      title: "Éditeur de Formulation",
      description: "Créez et modifiez vos formules olfactives avec un éditeur visuel complet. Ajoutez des molécules, ajustez les pourcentages et visualisez la pyramide olfactive en temps réel.",
      href: "/outils/editeur-formulation",
      features: ["Éditeur visuel", "Pyramide olfactive", "Sauvegarde automatique", "Export PDF"],
      color: "text-green-600 dark:text-green-400",
      bgGradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      icon: FileText,
      title: "Générateur de Formules",
      description: "Génération automatique de formules basées sur des critères olfactifs. Définissez le profil souhaité et laissez l'algorithme proposer des combinaisons.",
      href: "/outils/generateur-formules",
      features: ["Génération IA", "Critères personnalisés", "Suggestions multiples"],
      color: "text-indigo-600 dark:text-indigo-400",
      bgGradient: "from-indigo-500/10 to-purple-500/10"
    },
    {
      icon: Beaker,
      title: "Enrichissement PubChem",
      description: "Enrichir automatiquement les molécules avec les données scientifiques depuis PubChem : numéro CAS, nom IUPAC, masse moléculaire, structure.",
      href: "/outils/enrichissement-pubchem",
      features: ["Données PubChem", "CAS automatique", "Structure moléculaire"],
      color: "text-emerald-600 dark:text-emerald-400",
      bgGradient: "from-emerald-500/10 to-teal-500/10"
    },
    {
      icon: History,
      title: "Historique des Formules",
      description: "Consultez l'historique de vos formulations sauvegardées. Comparez les versions, restaurez d'anciennes formules et suivez l'évolution de vos créations.",
      href: "/historique-formules",
      features: ["Versioning", "Comparaison", "Restauration"],
      color: "text-amber-600 dark:text-amber-400",
      bgGradient: "from-amber-500/10 to-yellow-500/10"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Les outils de formulation PERFUMUM vous accompagnent dans la création 
          de vos compositions olfactives, de l'idée initiale à la formule finale.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card 
              key={tool.title} 
              className={`bg-gradient-to-br ${tool.bgGradient} border-border/50 hover:shadow-lg transition-all duration-300`}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-background/50">
                    <Icon className={`h-8 w-8 ${tool.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {tool.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {tool.features.map((feature) => (
                    <span 
                      key={feature} 
                      className="px-2 py-1 text-xs rounded-full bg-background/50 text-foreground/80"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <Link href={tool.href}>
                  <Button className="w-full group">
                    Ouvrir l'outil
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Workflow */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Workflow de formulation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-2xl font-bold text-primary mb-2">1</div>
              <div className="text-sm font-medium">Définir le concept</div>
              <div className="text-xs text-muted-foreground mt-1">Profil olfactif souhaité</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-2xl font-bold text-primary mb-2">2</div>
              <div className="text-sm font-medium">Sélectionner les molécules</div>
              <div className="text-xs text-muted-foreground mt-1">Base de données PERFUMUM</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-2xl font-bold text-primary mb-2">3</div>
              <div className="text-sm font-medium">Équilibrer la formule</div>
              <div className="text-xs text-muted-foreground mt-1">Pyramide olfactive</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-2xl font-bold text-primary mb-2">4</div>
              <div className="text-sm font-medium">Valider IFRA</div>
              <div className="text-xs text-muted-foreground mt-1">Conformité réglementaire</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
