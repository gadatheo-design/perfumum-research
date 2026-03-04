// @ts-nocheck
import { Link } from "wouter";
import { Book, Quote, Network, Droplets, Flame, Archive } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TriangleConceptuel } from "@/components/TriangleConceptuel";
import { TimelinePhilosophique } from "@/components/TimelinePhilosophique";
import { AtmospheresBohme } from "@/components/AtmospheresBohme";

export default function FondementsPhilosophiques() {
  return (
    <div className="min-h-screen bg-background">
      <Breadcrumbs />
      
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Book className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wider">Fondements Théoriques</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Petrichor, Matière Humide,<br />Atmosphères & Archive Olfactive
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Un cadre philosophique pour comprendre la recherche atmosphérique de PERFUMUM
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Ce chapitre théorique articule les fondements conceptuels de la pratique PERFUMUM. 
              Il mobilise trois corpus philosophiques majeurs pour penser l'odeur non comme un simple 
              stimulus sensoriel, mais comme un <strong>dispositif phénoménologique</strong>, 
              un <strong>générateur d'atmosphères</strong>, et une <strong>archive vivante</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1 : Phénoménologie */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-primary/10">
              <Quote className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">1. Petrichor : Définition Phénoménologique</h2>
              <p className="text-muted-foreground">Maurice Merleau-Ponty — Phénoménologie de la perception</p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p>
              Le petrichor n'est pas une "odeur" au sens classique. C'est une <strong>condition atmosphérique</strong>. 
              Il résulte de l'interaction entre sol sec et eau, de la libération de géosmine, poussières, ions, argiles, 
              d'une mise en mouvement du minéral par l'humidité.
            </p>

            <blockquote className="border-l-4 border-primary pl-6 italic text-lg">
              "La perception est un événement partagé entre le monde et le corps."
              <footer className="text-sm mt-2 not-italic">— Maurice Merleau-Ponty</footer>
            </blockquote>

            <p>
              Le petrichor est une <strong>ambiguïté perceptive</strong> : ni vraiment humide, ni totalement sec, 
              ni minéral, ni vivant, ni présent, ni passé. C'est une <strong>odeur transitionnelle</strong>, 
              un passage entre deux états du monde.
            </p>

            <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-accent" />
                Caractéristiques Phénoménologiques
              </h3>
              <ul className="space-y-2">
                <li>Interaction sol sec ↔ eau</li>
                <li>Libération de géosmine, poussières, ions, argiles</li>
                <li>Mise en mouvement du minéral par l'humidité</li>
                <li>Ambiguïté perceptive : entre deux états du monde</li>
                <li>Événement partagé entre le monde et le corps</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 : Atmosphères */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-green-500/10">
              <Network className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">2. Atmosphères : L'Odeur Comme Espace Généré</h2>
              <p className="text-muted-foreground">Gernot Böhme — The Aesthetics of Atmospheres</p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p>
              Le philosophe Gernot Böhme conçoit l'atmosphère comme :
            </p>

            <blockquote className="border-l-4 border-green-500 pl-6 italic text-lg">
              "La qualité sensible produite par la présence d'un objet ou d'un ensemble d'objets dans un espace."
              <footer className="text-sm mt-2 not-italic">— Gernot Böhme</footer>
            </blockquote>

            <p>
              Le petrichor produit une <strong>atmosphère contextuelle</strong>, qui transforme immédiatement :
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-500/5 p-5 rounded-lg border border-green-500/20">
                <h4 className="font-semibold mb-2">Transformation Spatiale</h4>
                <ul className="text-sm space-y-1">
                  <li>• Perception du paysage</li>
                  <li>• Densité de l'air</li>
                  <li>• Profondeur du sol</li>
                </ul>
              </div>
              <div className="bg-green-500/5 p-5 rounded-lg border border-green-500/20">
                <h4 className="font-semibold mb-2">Transformation Corporelle</h4>
                <ul className="text-sm space-y-1">
                  <li>• Notre propre corporalité</li>
                  <li>• Rapport au monde</li>
                  <li>• Présence sensible</li>
                </ul>
              </div>
            </div>

            <p className="text-lg font-medium text-primary">
              La pluie devient une machine à rendre visible l'invisible.
            </p>

            <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
              <p className="font-semibold mb-2">Dans le travail PERFUMUM :</p>
              <p>→ Le petrichor est un <strong>matériau sculptural atmosphérique</strong>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visualisation D3.js : Atmosphères de Böhme */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/10">
        <div className="max-w-5xl mx-auto">
          <AtmospheresBohme />
        </div>
      </section>

      {/* Section 3 : Archive */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-amber-500/10">
              <Archive className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">3. Le Sol Comme Archive Vivante</h2>
              <p className="text-muted-foreground">Jacques Derrida — Mal d'archive</p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p>
              Dans <em>Mal d'archive</em>, Derrida explique que l'archive est :
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-amber-500/5 p-5 rounded-lg border border-amber-500/20 text-center">
                <p className="font-semibold">Structure de Pouvoir</p>
              </div>
              <div className="bg-amber-500/5 p-5 rounded-lg border border-amber-500/20 text-center">
                <p className="font-semibold">Espace de Conservation</p>
              </div>
              <div className="bg-amber-500/5 p-5 rounded-lg border border-amber-500/20 text-center">
                <p className="font-semibold">Tension Mémoire/Effacement</p>
              </div>
            </div>

            <p>
              Le sol — lorsqu'il est frappé par la pluie — agit comme une <strong>archive qui s'ouvre</strong>.
            </p>

            <div className="bg-amber-500/10 p-6 rounded-lg border border-amber-500/20">
              <h3 className="text-xl font-semibold mb-3">La Pluie Comme Acte d'Archivation</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-background rounded">Révèle</div>
                <div className="p-3 bg-background rounded">Libère</div>
                <div className="p-3 bg-background rounded">Active</div>
                <div className="p-3 bg-background rounded">Réanime</div>
              </div>
            </div>

            <p className="text-lg font-medium text-amber-600 dark:text-amber-400">
              Le petrichor est un acte d'archivation sensorielle.
            </p>

            <blockquote className="border-l-4 border-amber-500 pl-6 italic">
              Dans les accords PERFUMUM, tu accomplis exactement cela : <strong>tu fais parler la matière</strong>.
            </blockquote>
          </div>
        </div>
      </section>

      {/* Section 4 : Matière Humide */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Droplets className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">4. Matière Humide : Une Ontologie de la Transformation</h2>
              <p className="text-muted-foreground">Vers une pensée de l'instabilité</p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p>
              La matière humide est <strong>instable, transitoire, non fixée</strong>. 
              Elle ouvre un champ théorique :
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["Instabilité", "Porosité", "Contamination", "Transition", "Cohabitation vivant/non-vivant", "Changement d'état"].map((concept) => (
                <div key={concept} className="bg-blue-500/5 p-4 rounded-lg border border-blue-500/20 text-center">
                  <p className="font-medium">{concept}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-500/10 p-6 rounded-lg border border-blue-500/20">
              <p className="text-lg font-semibold mb-2">Pratique Artistique</p>
              <p>
                Ce que tu fais artistiquement avec les accords radicaux, c'est créer une{" "}
                <strong>ontologie olfactive du changement</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 : Triangle Conceptuel */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Network className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">5. Hash, Tabac, Petrichor : Un Triangle Conceptuel</h2>
              <p className="text-muted-foreground">Trois pôles en dialogue</p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p>Ce triangle offre trois pôles conceptuels :</p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Pôle 1 : Sol */}
              <div className="bg-amber-500/10 p-6 rounded-lg border-2 border-amber-500/30">
                <h3 className="text-xl font-bold mb-3 text-amber-600 dark:text-amber-400">1. Le Sol</h3>
                <ul className="space-y-2 text-sm">
                  <li>→ Archive</li>
                  <li>→ Mémoire</li>
                  <li>→ Matière première</li>
                  <li>→ Géochimie</li>
                  <li>→ Minéral, argile</li>
                </ul>
              </div>

              {/* Pôle 2 : Végétal Transformé */}
              <div className="bg-green-500/10 p-6 rounded-lg border-2 border-green-500/30">
                <h3 className="text-xl font-bold mb-3 text-green-600 dark:text-green-400">2. Le Végétal Transformé</h3>
                <p className="text-sm mb-2">(tabac / hash)</p>
                <ul className="space-y-2 text-sm">
                  <li>→ Fermentation</li>
                  <li>→ Combustion</li>
                  <li>→ Transformation culturelle</li>
                </ul>
              </div>

              {/* Pôle 3 : Pluie */}
              <div className="bg-blue-500/10 p-6 rounded-lg border-2 border-blue-500/30">
                <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">3. La Pluie</h3>
                <p className="text-sm mb-2">(petrichor)</p>
                <ul className="space-y-2 text-sm">
                  <li>→ Activation</li>
                  <li>→ Révélation</li>
                  <li>→ Mise en mouvement</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-500/10 p-6 rounded-lg border border-purple-500/20">
              <p className="text-lg font-semibold mb-2">Zone d'Intersection</p>
              <p>
                L'œuvre PERFUMUM joue sur la <strong>zone d'intersection</strong> : 
                un espace où le minéral, le végétal et l'eau dialoguent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visualisation SVG : Triangle Conceptuel */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-500/5 via-green-500/5 to-blue-500/5">
        <div className="max-w-5xl mx-auto">
          <TriangleConceptuel />
        </div>
      </section>

      {/* Section 6 : Dispositif Philosophique */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-red-500/10">
              <Flame className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">6. La Pratique PERFUMUM Comme Dispositif Philosophique</h2>
              <p className="text-muted-foreground">Une recherche atmosphérique</p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p className="text-xl font-medium">
              Ton travail n'est pas une parfumerie. C'est une <strong>recherche atmosphérique</strong>.
            </p>

            <div className="bg-gradient-to-br from-red-500/10 via-purple-500/10 to-blue-500/10 p-8 rounded-lg border border-primary/20">
              <h3 className="text-2xl font-bold mb-4">PERFUMUM, c'est :</h3>
              <ul className="space-y-3 text-lg">
                <li>• Une <strong>méthode de penser par odeurs</strong></li>
                <li>• Une <strong>sculpture de l'air</strong></li>
                <li>• Une <strong>écriture phénoménologique</strong></li>
                <li>• Une <strong>archéologie olfactive</strong></li>
                <li>• Un <strong>outil de médiation</strong> entre matière et perception</li>
                <li>• Une <strong>pratique artistique expérimentale</strong></li>
              </ul>
            </div>

            <blockquote className="border-l-4 border-red-500 pl-6 italic text-xl">
              Les séries radicales sont des <strong>textes théoriques en odeur</strong>.
            </blockquote>
          </div>
        </div>
      </section>

      {/* Timeline Philosophique */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-green-500/5 to-amber-500/5">
        <div className="max-w-5xl mx-auto">
          <TimelinePhilosophique />
        </div>
      </section>

      {/* Références Bibliographiques */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Book className="w-8 h-8 text-primary" />
            Références Bibliographiques
          </h2>

          <div className="space-y-6">
            {/* Phénoménologie */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Phénoménologie de la Perception</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>• Merleau-Ponty, Maurice. <em>Phénoménologie de la perception</em>. Gallimard, 1945.</p>
              </div>
            </div>

            {/* Théorie des Atmosphères */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-green-600 dark:text-green-400">Théorie des Atmosphères</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>• Böhme, Gernot. <em>The Aesthetics of Atmospheres</em>. Routledge, 2016.</p>
                <p>• Böhme, Gernot. <em>Atmospheric Architectures: The Aesthetics of Felt Spaces</em>. Bloomsbury, 2017.</p>
              </div>
            </div>

            {/* Archivistique */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-amber-600 dark:text-amber-400">Archivistique et Déconstruction</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>• Derrida, Jacques. <em>Mal d'archive : Une impression freudienne</em>. Galilée, 1995.</p>
              </div>
            </div>

            {/* Études Olfactives */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Études Olfactives</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>• Drobnick, Jim (ed.). <em>The Smell Culture Reader</em>. Berg, 2006.</p>
                <p>• Classen, Constance, David Howes, Anthony Synnott. <em>Aroma: The Cultural History of Smell</em>. Routledge, 1994.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Transversale */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Pour Aller Plus Loin</h2>
          
          {/* Liens principaux */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Link href="/recherche-radicale" className="block p-6 rounded-lg bg-card hover:bg-accent/50 transition-colors border border-border">
              <h3 className="font-semibold mb-2">Recherche Radicale</h3>
              <p className="text-sm text-muted-foreground">Série Pétrichor Radicalis Extremis : 5 accords conceptuels</p>
            </Link>
            <Link href="/methodologie/absorbe" className="block p-6 rounded-lg bg-card hover:bg-accent/50 transition-colors border border-border">
              <h3 className="font-semibold mb-2">Méthode ABSORBE</h3>
              <p className="text-sm text-muted-foreground">Protocoles de captation et d'analyse atmosphérique</p>
            </Link>
            <Link href="/gammes/petrichor" className="block p-6 rounded-lg bg-card hover:bg-accent/50 transition-colors border border-border">
              <h3 className="font-semibold mb-2">Gamme Pétrichor</h3>
              <p className="text-sm text-muted-foreground">7 sous-familles d'accords pétrichor</p>
            </Link>
          </div>

          {/* Molécules Clés */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Molécules Clés du Cadre Philosophique</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-lg bg-gradient-to-br from-amber-500/10 to-green-500/10 border border-amber-500/30">
                <h4 className="font-semibold mb-2 text-amber-600 dark:text-amber-400">Géosmine</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  La molécule de l'<strong>archive terrestre</strong>. Libérée par les actinomycètes du sol, 
                  elle incarne la mémoire minérale et la trace du vivant dans la matière humide.
                </p>
                <Link href="/molecules" className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline">
                  Explorer les molécules →
                </Link>
              </div>
              
              <div className="p-5 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30">
                <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Ozone (O₃)</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  La molécule de l'<strong>atmosphère aérienne</strong>. Présente avant et après la pluie, 
                  elle crée une qualité sensible qui transforme la perception de l'espace.
                </p>
                <Link href="/molecules" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  Explorer les molécules →
                </Link>
              </div>
            </div>
          </div>

          {/* Gammes & Recettes */}
          <div>
            <h3 className="text-xl font-bold mb-4">Applications Olfactives</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/gammes/volcanique" className="block p-5 rounded-lg bg-card hover:bg-accent/50 transition-colors border border-border">
                <h4 className="font-semibold mb-2">Gamme Volcanique</h4>
                <p className="text-sm text-muted-foreground">Matière minérale et transformation par le feu</p>
              </Link>
              <Link href="/recettes" className="block p-5 rounded-lg bg-card hover:bg-accent/50 transition-colors border border-border">
                <h4 className="font-semibold mb-2">Recettes & Formules</h4>
                <p className="text-sm text-muted-foreground">142 accords atmosphériques documentés</p>
              </Link>
              <Link href="/suggestions-synergies" className="block p-5 rounded-lg bg-card hover:bg-accent/50 transition-colors border border-border">
                <h4 className="font-semibold mb-2">Suggestions IA</h4>
                <p className="text-sm text-muted-foreground">Synergies moléculaires calculées</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
