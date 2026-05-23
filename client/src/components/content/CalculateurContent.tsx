import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calculator, Scale, DollarSign, Droplets, ArrowRight } from "lucide-react";

export default function CalculateurContent() {
  const calculators = [
    {
      icon: Droplets,
      title: "Calculateur de Dilution",
      description: "Calcul des dilutions et concentrations pour la formulation de parfums. Convertissez entre différentes concentrations (EDT, EDP, Parfum) et calculez les quantités nécessaires.",
      href: "/outils/dilution",
      features: ["Conversion de concentrations", "Calcul de volumes", "Ratios alcool/huile"],
      color: "text-blue-600 dark:text-blue-400",
      bgGradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      icon: Scale,
      title: "Calculateur IFRA",
      description: "Vérification de la conformité aux normes IFRA (International Fragrance Association) pour vos formulations. Calcul automatique des limites par catégorie de produit.",
      href: "/ifra",
      features: ["11 catégories IFRA", "Limites automatiques", "Alertes de dépassement"],
      color: "text-red-600 dark:text-red-400",
      bgGradient: "from-red-500/10 to-orange-500/10"
    },
    {
      icon: DollarSign,
      title: "Calculateur de Coût",
      description: "Estimation du coût de production pour vos formules. Intègre les prix des matières premières, les coûts de main d'œuvre et les marges.",
      href: "/outils/calculateur-cout",
      features: ["Prix matières premières", "Coûts de production", "Calcul de marge"],
      color: "text-green-600 dark:text-green-400",
      bgGradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      icon: Calculator,
      title: "Calculateur de Formule",
      description: "Outil de calcul pour équilibrer vos formules olfactives. Ajustez les pourcentages et vérifiez l'équilibre des notes de tête, cœur et fond.",
      href: "/calculateur",
      features: ["Équilibre pyramidal", "Ajustement %", "Validation formule"],
      color: "text-purple-600 dark:text-purple-400",
      bgGradient: "from-purple-500/10 to-violet-500/10"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Les calculateurs PERFUMUM vous aident à formuler avec précision : 
          dilutions, conformité IFRA, coûts de production et équilibre des formules.
        </p>
      </div>

      {/* Calculators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {calculators.map((calc) => {
          const Icon = calc.icon;
          return (
            <Card 
              key={calc.title} 
              className={`bg-gradient-to-br ${calc.bgGradient} border-border/50 hover:shadow-lg transition-all duration-300`}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-background/50">
                    <Icon className={`h-8 w-8 ${calc.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{calc.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {calc.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {calc.features.map((feature) => (
                    <span 
                      key={feature} 
                      className="px-2 py-1 text-xs rounded-full bg-background/50 text-foreground/80"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <Link href={calc.href}>
                  <Button className="w-full group">
                    Ouvrir le calculateur
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Conseils d'utilisation</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm prose-invert max-w-none">
          <ul className="space-y-2 text-muted-foreground">
            <li>Vérifiez toujours la conformité IFRA avant de finaliser une formule commerciale</li>
            <li>Les calculs de dilution sont basés sur des ratios standard (alcool éthylique 96%)</li>
            <li>Les coûts de production sont indicatifs et dépendent de vos fournisseurs</li>
            <li>L'équilibre pyramidal recommandé est 30% tête, 50% cœur, 20% fond</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
