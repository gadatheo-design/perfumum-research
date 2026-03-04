// @ts-nocheck
import { Link } from "wouter";
import { ChevronRight, Leaf, Cigarette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProgrammesRecherche() {
  const programmes = [
    {
      id: "resines-cbd",
      title: "Résines CBD & Terpenic Design",
      description: "Recherche artisanale sur les résines de cannabis, profils terpéniques extrêmes et dialogues avec tabac, encens et civilisations olfactives",
      icon: Leaf,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      sections: ["4 axes génétiques", "Méthodes Frenchy Cannoli", "Intégration Perfumeum", "Matrices combustibles"],
      badge: "CBD/CBG/CBN",
      badgeColor: "bg-green-500"
    },
    {
      id: "tabacs-niche",
      title: "Tabacs Niche & Matrices Combustibles",
      description: "Sélection de tabacs rares, disparus, rituels ou expérimentaux pour accords combustibles et explorations olfactives",
      icon: Cigarette,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      sections: ["8 catégories", "30+ variétés", "Tabacs sacrés", "Tabacs alchimiques"],
      badge: "Catalogue",
      badgeColor: "bg-amber-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Breadcrumbs */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Programmes-recherche</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="container relative py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Leaf className="h-4 w-4" />
              Programmes de Recherche
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight">
              Programmes de Recherche
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Explorations avancées en design terpénique, résines artisanales et matrices combustibles. 
              Recherche à long terme (2025-2035) croisant cannabis, tabac, encens et civilisations olfactives.
            </p>
          </div>
        </div>
      </div>

      {/* Programmes Grid */}
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {programmes.map((prog) => {
            const Icon = prog.icon;
            return (
              <Link key={prog.id} href={`/programmes-recherche/${prog.id}`}>
                <a>
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg ${prog.bgColor}`}>
                          <Icon className={`h-8 w-8 ${prog.color}`} />
                        </div>
                        <Badge className={prog.badgeColor}>{prog.badge}</Badge>
                      </div>
                      
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                        {prog.title}
                      </CardTitle>
                      
                      <CardDescription className="text-base leading-relaxed">
                        {prog.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                          Contenu
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {prog.sections.map((section, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              {section}
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-4 flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                          Découvrir le programme
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Approche :</strong> Ces programmes s'inscrivent dans une démarche de recherche olfactive, 
                  culture du terroir et hybridation entre cannabis, parfumerie, tabac et encens.
                </p>
                <p>
                  <strong className="text-foreground">Durée :</strong> Recherche à long terme (2025-2035) avec jalons trimestriels documentés dans la Timeline.
                </p>
                <p>
                  <strong className="text-foreground">Avertissement :</strong> Ce travail ne remplace aucun usage médical et ne promet aucun bénéfice santé. 
                  Toute expérimentation doit respecter la législation en vigueur et les consignes de réduction des risques.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
