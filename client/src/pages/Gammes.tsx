import { Link } from "wouter";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Mountain, Crown, ArrowRight, Sparkles, Heart, Gem, Beaker, FileText, FlaskConical } from "lucide-react";
import { VoirAussi, suggestionsGammes } from "@/components/VoirAussi";

export default function Gammes() {
  const gammes = [
    {
      name: "Pétrichor",
      subtitle: "L'odeur de la pluie sur la terre",
      description: "60 variations explorant le phénomène du pétrichor : terre humide, minéral, végétal, cendre, métal. De l'accord Prima (terre vive + pluie chaude) aux variations radicales (radioactif, béton humain, cendres humaines).",
      icon: Droplets,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      gradientFrom: "from-emerald-500/10",
      gradientTo: "to-teal-500/10",
      variations: 60,
      families: ["Hash Prima", "Tabac Fermenté", "Minéral Hash", "Floral Salé", "Animal Fumé", "Métallique Humide"],
      href: "/gammes/petrichor",
    },
    {
      name: "Volcanique",
      subtitle: "Géologie incandescente",
      description: "36 variations autour de la matière volcanique : soufre, cendre, pierre chaude, fumée noire, minéral brûlé. Exploration des transformations thermiques et des odeurs géologiques extrêmes.",
      icon: Mountain,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      borderColor: "border-orange-200 dark:border-orange-800",
      gradientFrom: "from-orange-500/10",
      gradientTo: "to-red-500/10",
      variations: 36,
      families: ["Soufre Pur", "Cendre Chaude", "Pierre Calcinée", "Fumée Noire", "Minéral Brûlé", "Lave Refroidie"],
      href: "/gammes/volcanique",
    },
    {
      name: "Royal Mossi",
      subtitle: "Identité olfactive du Sahel",
      description: "Architecture moléculaire inspirée des traditions Mossi : cuir tanné, fumigations rituelles, peaux tannées, identité Sahel. Recherche anthropologique sur les pratiques olfactives d'Afrique de l'Ouest.",
      icon: Crown,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      borderColor: "border-amber-200 dark:border-amber-800",
      gradientFrom: "from-amber-500/10",
      gradientTo: "to-yellow-500/10",
      variations: 12,
      families: ["Cuir Mossi", "Fumigations", "Peaux Tannées", "Bois Sahel"],
      href: "/gammes/mossi",
    },
    {
      name: "Signatures",
      subtitle: "Profils d'exception",
      description: "Collection premium de 3 profils d'exception qui repoussent les limites de la formulation olfactive : Cuir Marin (océan × cuir × minéral), Forêt de Cacao (jungle tropicale), Fleur Fantôme (floral éthéré).",
      icon: Sparkles,
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-100 dark:bg-violet-900/30",
      borderColor: "border-violet-200 dark:border-violet-800",
      gradientFrom: "from-violet-500/10",
      gradientTo: "to-purple-500/10",
      variations: 3,
      families: ["Cuir Marin", "Forêt de Cacao", "Fleur Fantôme"],
      href: "/gammes/signatures",
    },
    {
      name: "Phéromones",
      subtitle: "Communication chimique humaine",
      description: "Exploration des molécules de communication chimique : Androsténol (truffe, musc), Androsténone (boisé/urineux selon génotype), Androstadiénone (musqué subtil). Doses infinitésimales pour effets subliminaux.",
      icon: Heart,
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-100 dark:bg-rose-900/30",
      borderColor: "border-rose-200 dark:border-rose-800",
      gradientFrom: "from-rose-500/10",
      gradientTo: "to-pink-500/10",
      variations: 4,
      families: ["Pheromona Truffle", "Pheromona Skin", "Pheromona Alpha", "Pheromona Cascade"],
      href: "/gammes/pheromones",
    },
    {
      name: "Raretés",
      subtitle: "Molécules précieuses de la parfumerie",
      description: "Les 10 molécules essentielles qui définissent l'excellence : Oud, Iris, Ambre Gris, Iso E Super, Ambrox, Coumarine, Calone, Galaxolide, Cashmeran, Javanol. 5 accords maîtres pour la haute parfumerie.",
      icon: Gem,
      color: "text-sky-600 dark:text-sky-400",
      bgColor: "bg-sky-100 dark:bg-sky-900/30",
      borderColor: "border-sky-200 dark:border-sky-800",
      gradientFrom: "from-sky-500/10",
      gradientTo: "to-cyan-500/10",
      variations: 10,
      families: ["Trésor d'Orient", "Iris Royal", "Santal Sacré", "Musc Précieux", "Océan Profond"],
      href: "/gammes/raretes",
    },
  ];

  // Calcul des statistiques totales
  const totalVariations = gammes.reduce((sum, g) => sum + g.variations, 0);
  const totalFamilies = gammes.reduce((sum, g) => sum + g.families.length, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent dark:from-violet-900/20" />
          
          <div className="container relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/30 bg-primary/5">
                <FlaskConical className="w-3.5 h-3.5 mr-2" />
                Recherche Olfactive Expérimentale
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                Gammes de Recherche
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Six familles olfactives développées sur plusieurs années, explorant des territoires sensoriels inédits à travers <span className="text-foreground font-semibold">{totalVariations} variations</span> documentées.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-8 mt-12"
            >
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-card border shadow-sm">
                <Beaker className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">{gammes.length} gammes</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-card border shadow-sm">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">{totalVariations} variations</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-card border shadow-sm">
                <FlaskConical className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">{totalFamilies} familles</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 border-y bg-muted/20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Les gammes constituent le <strong className="text-foreground">cœur de la recherche PERFUMUM</strong>. Chaque gamme explore un phénomène olfactif spécifique à travers des dizaines de variations, formant un <strong className="text-foreground">corpus systématique</strong> qui documente les transformations de la matière, les effets thermiques, et les pratiques culturelles.
              </p>
            </div>
          </div>
        </section>

        {/* Gammes Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
              {gammes.map((gamme, index) => {
                const Icon = gamme.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link href={gamme.href}>
                      <Card className={`group h-full border-2 ${gamme.borderColor} hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer overflow-hidden`}>
                        {/* Gradient background on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${gamme.gradientFrom} ${gamme.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        
                        <CardHeader className="relative pb-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-xl ${gamme.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                              <Icon className={`h-7 w-7 ${gamme.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-4">
                                <CardTitle className="text-2xl md:text-3xl group-hover:text-primary transition-colors">
                                  {gamme.name}
                                </CardTitle>
                                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                              </div>
                              <CardDescription className="text-base mt-1">{gamme.subtitle}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="relative space-y-4">
                          <Badge variant="secondary" className={`${gamme.bgColor} ${gamme.color} border-0`}>
                            {gamme.variations} variations
                          </Badge>
                          
                          <p className="text-muted-foreground leading-relaxed line-clamp-3">
                            {gamme.description}
                          </p>
                          
                          <div className="pt-2">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                              Familles principales
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {gamme.families.slice(0, 4).map((family, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs font-normal">
                                  {family}
                                </Badge>
                              ))}
                              {gamme.families.length > 4 && (
                                <Badge variant="outline" className="text-xs font-normal">
                                  +{gamme.families.length - 4}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Méthodologie des Gammes
                </h2>
                <p className="text-muted-foreground text-lg">
                  Une approche rigoureuse combinant art et science
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Variations Systématiques",
                    description: "Chaque gamme est développée selon un protocole de variations systématiques : une formule mère est déclinée en ajoutant, retirant ou modifiant des molécules clés.",
                    icon: Beaker,
                  },
                  {
                    title: "Documentation Rigoureuse",
                    description: "Chaque variation est documentée avec sa formule précise, son profil olfactif, ses caractéristiques techniques et ses usages recommandés.",
                    icon: FileText,
                  },
                  {
                    title: "Recherche-Création",
                    description: "Les gammes interrogent des phénomènes sensoriels, des transformations matérielles ou des pratiques culturelles. Chaque accord est outil d'analyse et œuvre autonome.",
                    icon: FlaskConical,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                          <item.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Voir aussi */}
      <VoirAussi items={suggestionsGammes} />
      
      <Footer />
    </div>
  );
}
