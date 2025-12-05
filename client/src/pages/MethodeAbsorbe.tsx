import { Header } from "@/components/layout/Header";
import { Link } from "wouter";

export default function MethodeAbsorbe() {
  const sections = [
    {
      title: "Air",
      description: "Captation et analyse de l'atmosphère olfactive d'un lieu. Prélèvement sur tubes Tenax TA, analyse GC-MS pour identifier les molécules volatiles présentes dans l'air ambiant."
    },
    {
      title: "Lieu",
      description: "Documentation du contexte spatial et temporel. Cartographie sensorielle, relevés météorologiques, analyse de la géologie et de la végétation pour comprendre l'identité olfactive d'un territoire."
    },
    {
      title: "Odeur",
      description: "Évaluation sensorielle selon les 8 axes ABSORBE (Animalité, Boisé, Souterrain, Ozoné, Résine, Brûlé, Épicé). Création de profils olfactifs détaillés pour chaque site étudié."
    },
    {
      title: "Fumé",
      description: "Pyrolyse contrôlée des matériaux organiques prélevés. Analyse des composés volatils générés par combustion à différentes températures (120°C, 160°C, 200°C) pour révéler les notes fumées latentes."
    },
    {
      title: "Son",
      description: "Enregistrement de l'environnement sonore du lieu. Création d'une archive audio contextuelle permettant de restituer l'atmosphère globale lors de la captation olfactive."
    },
    {
      title: "Image",
      description: "Documentation visuelle du terrain (photographie, vidéo). Archivage des textures, matériaux, lumières et ambiances visuelles qui accompagnent l'expérience olfactive du lieu."
    },
    {
      title: "Texte",
      description: "Rédaction de notes de terrain, descriptions sensorielles et analyses critiques. Documentation écrite des impressions, hypothèses et découvertes tout au long du processus de recherche."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Méthode ABSORBE
              </h1>
              <p className="text-xl text-muted-foreground">
                Protocole de recherche olfactive développé par PERFUMUM pour la captation, l'analyse et la restitution des atmosphères sensorielles d'un lieu.
              </p>
            </div>
          </div>
        </section>

        {/* 7 Sections */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto space-y-8">
              {sections.map((section, index) => (
                <div
                  key={section.title}
                  className="border border-border rounded-lg p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-sm font-mono text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-12">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Approfondissement */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="border border-primary/30 rounded-lg p-8 bg-primary/5">
                <h3 className="text-xl font-bold mb-3">Approfondissement : Pyrolyse Contrôlée</h3>
                <p className="text-muted-foreground mb-4">
                  L'axe <strong>Fumé</strong> de la méthode ABSORBE repose sur des protocoles de pyrolyse à 3 températures (120°C, 160°C, 200°C). 
                  Découvrez les résultats GC-MS et les profils de dégradation thermique.
                </p>
                <Link href="/methodologie/pyrolyse">
                  <a className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                    Lire le protocole Pyrolyse complet →
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-muted-foreground mb-6">
                Cette méthodologie est appliquée sur l'ensemble des terrains de recherche PERFUMUM.
              </p>
              <Link href="/projets">
                <a className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  Découvrir les projets terrain →
                </a>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
