import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Beaker, Database, Mail, CheckCircle2 } from "lucide-react";

export default function Contribuer() {
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
      color: "text-purple-600",
      bgColor: "bg-purple-50"
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
      color: "text-blue-600",
      bgColor: "bg-blue-50"
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
      color: "text-green-600",
      bgColor: "bg-green-50"
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
      color: "text-orange-600",
      bgColor: "bg-orange-50"
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

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Comment Contribuer
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                Perfumum est un projet de recherche collaboratif ouvert aux contributions externes. Partagez vos données, votre expertise ou proposez une collaboration de recherche.
              </p>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground">
                  Nous recherchons des contributions scientifiquement rigoureuses, alignées avec la méthodologie ABSORBE (Air, Lieu, Odeur, Fumé). Toutes les contributions sont créditées et les données restent accessibles pour la recherche académique.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Types de contributions */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Types de contributions acceptées</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {contributionTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg ${type.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`h-6 w-6 ${type.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-xl mb-2">{type.title}</CardTitle>
                            <CardDescription>{type.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                          Critères requis
                        </h4>
                        <ul className="space-y-2">
                          {type.criteria.map((criterion, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{criterion}</span>
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
        </section>

        {/* Processus */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Processus de contribution</h2>
              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Principes de collaboration */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Principes de collaboration</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Réciprocité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Les données partagées sont accessibles à tous les contributeurs. Nous croyons en un modèle de recherche ouverte où chacun bénéficie des apports collectifs.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Attribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Toutes les contributions sont créditées avec le nom du contributeur, son affiliation et un lien vers ses travaux. Les publications scientifiques incluent les contributeurs en co-auteurs.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Autonomie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Chaque contributeur conserve son autonomie scientifique. Nous ne demandons pas d'exclusivité et encourageons la publication parallèle dans d'autres revues ou projets.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Durabilité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Perfumum est un projet sur 10 ans (2025-2035). Nous privilégions les collaborations à long terme qui s'inscrivent dans cette temporalité de recherche.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Mail className="h-16 w-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl font-bold mb-4">Prêt à contribuer ?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Envoyez-nous un email décrivant votre contribution potentielle. Nous vous répondrons sous 7-14 jours.
              </p>
              <div className="bg-background border border-border rounded-lg p-6 inline-block">
                <p className="text-sm text-muted-foreground mb-2">Adresse de contact</p>
                <a 
                  href="mailto:research@perfumum.ch" 
                  className="text-2xl font-semibold text-primary hover:underline"
                >
                  research@perfumum.ch
                </a>
              </div>

              <div className="mt-8 text-sm text-muted-foreground">
                <p>
                  Vous pouvez également consulter notre page <a href="/collaborations" className="text-primary hover:underline">Collaborations</a> pour voir les partenaires actuels et les types de projets en cours.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
