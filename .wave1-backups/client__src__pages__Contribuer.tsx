// @ts-nocheck
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Beaker, Database, Mail, CheckCircle2, Heart, Handshake, Shield, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function Contribuer() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: typesRef, isVisible: typesVisible } = useScrollAnimation();
  const { ref: processRef, isVisible: processVisible } = useScrollAnimation();
  const { ref: principesRef, isVisible: principesVisible } = useScrollAnimation();
  const { ref: contactRef, isVisible: contactVisible } = useScrollAnimation();

  const contributionTypes = [
    {
      icon: Beaker,
      title: "Partage de données moléculaires",
      description: "Profils olfactifs, analyses GC-MS, spectres de référence",
      criteria: [
        "Données scientifiques vérifiables",
        "Méthodologie documentée (protocole, équipement)",
        "Autorisation de partage (pas de données confidentielles)",
        "Format standardisé (CSV, JSON, PDF)"
      ],
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: FileText,
      title: "Documentation de terrain",
      description: "Notes de captation, photographies, enregistrements sonores",
      criteria: [
        "Localisation GPS et date précises",
        "Conditions météorologiques documentées",
        "Observations sensorielles détaillées",
        "Autorisation de publication des images"
      ],
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Database,
      title: "Recettes et formulations",
      description: "Accords expérimentaux, synergies moléculaires, protocoles",
      criteria: [
        "Formulation complète (proportions, procédé)",
        "Profil olfactif décrit (notes de tête/cœur/fond)",
        "Tests de stabilité et maturation",
        "Pas de secrets commerciaux"
      ],
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Users,
      title: "Collaboration de recherche",
      description: "Projets conjoints, accès laboratoire, expertise technique",
      criteria: [
        "Alignement avec méthodologie ABSORBE",
        "Engagement sur durée minimale (6-12 mois)",
        "Réciprocité des données et publications",
        "Respect de l'autonomie scientifique"
      ],
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10"
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Prise de contact",
      description: "Envoyez un email décrivant votre contribution potentielle et votre profil (chercheur, parfumeur, laboratoire, artiste)."
    },
    {
      step: 2,
      title: "Évaluation",
      description: "Nous évaluons la pertinence de la contribution par rapport aux axes de recherche PERFUMUM (délai : 7-14 jours)."
    },
    {
      step: 3,
      title: "Discussion",
      description: "Si la contribution est retenue, nous organisons un échange pour définir les modalités (format, licence, attribution)."
    },
    {
      step: 4,
      title: "Intégration",
      description: "Les données sont intégrées dans la base PERFUMUM avec attribution claire et lien vers vos travaux."
    }
  ];

  const principes = [
    {
      icon: Heart,
      title: "Réciprocité",
      description: "Les données partagées sont accessibles à tous les contributeurs. Nous croyons en un modèle de recherche ouverte où chacun bénéficie des apports collectifs.",
      color: "text-rose-500"
    },
    {
      icon: Shield,
      title: "Attribution",
      description: "Toutes les contributions sont créditées avec le nom du contributeur, son affiliation et un lien vers ses travaux. Les publications scientifiques incluent les contributeurs en co-auteurs.",
      color: "text-blue-500"
    },
    {
      icon: Handshake,
      title: "Autonomie",
      description: "Chaque contributeur conserve son autonomie scientifique. Nous ne demandons pas d'exclusivité et encourageons la publication parallèle dans d'autres revues ou projets.",
      color: "text-green-500"
    },
    {
      icon: Clock,
      title: "Durabilité",
      description: "Perfumum est un projet sur 10 ans (2025-2035). Nous privilégions les collaborations à long terme qui s'inscrivent dans cette temporalité de recherche.",
      color: "text-amber-500"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="relative py-16 md:py-20 border-b border-border/50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full mb-6 border border-primary/20">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Recherche Collaborative</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Comment Contribuer
              </h1>
              
              <p className="text-lg text-muted-foreground mb-4">
                Partagez vos données, votre expertise ou proposez une collaboration de recherche
              </p>
              
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Nous recherchons des contributions scientifiquement rigoureuses, alignées avec la méthodologie ABSORBE. 
                Toutes les contributions sont créditées et les données restent accessibles pour la recherche académique.
              </p>
            </div>
          </div>
        </section>

        {/* Types de contributions */}
        <div ref={typesRef} className="py-20 bg-gradient-to-b from-background to-muted/10">
          <div className="container">
            <div className={`max-w-5xl mx-auto transition-all duration-700 delay-100 ${typesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Types de contributions acceptées</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Quatre types de contributions sont possibles, chacune avec ses critères spécifiques.
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {contributionTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <Card 
                      key={index} 
                      className="border-border/50 hover:border-primary/40 hover:shadow-lg transition-all duration-200 group overflow-hidden relative"
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className={`absolute top-0 right-0 w-32 h-32 ${type.bgColor} rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                      <CardHeader className="relative">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl ${type.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                            <Icon className={`h-6 w-6 ${type.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{type.title}</CardTitle>
                            <CardDescription className="text-base">{type.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="relative">
                        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                          Critères requis
                        </h4>
                        <ul className="space-y-2">
                          {type.criteria.map((criterion, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{criterion}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Processus */}
        <div ref={processRef} className="py-20 bg-muted/20">
          <div className="container">
            <div className={`max-w-4xl mx-auto transition-all duration-700 delay-100 ${processVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Processus de contribution</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Un processus simple en 4 étapes pour intégrer vos contributions à PERFUMUM.
                </p>
              </div>
              
              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <div 
                    key={index} 
                    className="flex gap-6 group"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Principes de collaboration */}
        <div ref={principesRef} className="py-20">
          <div className="container">
            <div className={`max-w-4xl mx-auto transition-all duration-700 delay-100 ${principesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Principes de collaboration</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Nos valeurs fondamentales pour une recherche ouverte et éthique.
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {principes.map((principe, index) => {
                  const Icon = principe.icon;
                  return (
                    <Card 
                      key={index} 
                      className="brutal-border hover:shadow-lg transition-all duration-300 group"
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Icon className={`h-5 w-5 ${principe.color}`} />
                          </div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">{principe.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {principe.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div ref={contactRef} className="py-20 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container relative z-10">
            <div className={`max-w-3xl mx-auto text-center transition-all duration-700 delay-100 ${contactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Mail className="h-10 w-10 text-primary" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à contribuer ?</h2>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Envoyez-nous un email décrivant votre contribution potentielle. Nous vous répondrons sous 7-14 jours.
              </p>
              
              <div className="bg-card border border-border rounded-2xl p-8 inline-block shadow-lg">
                <p className="text-sm text-muted-foreground mb-3">Adresse de contact</p>
                <a 
                  href="mailto:research@perfumum.ch" 
                  className="text-2xl md:text-3xl font-semibold text-primary hover:underline decoration-2 underline-offset-4"
                >
                  research@perfumum.ch
                </a>
              </div>

              <div className="mt-8 text-sm text-muted-foreground">
                <p>
                  Vous pouvez également consulter notre page{' '}
                  <a href="/collaborations" className="text-primary hover:underline font-medium">
                    Collaborations
                  </a>{' '}
                  pour voir les partenaires actuels et les types de projets en cours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
