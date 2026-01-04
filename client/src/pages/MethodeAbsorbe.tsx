import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Download, Wind, MapPin, Sparkles, Flame, 
  Volume2, Camera, FileText, ArrowRight, Layers,
  FlaskConical, Microscope
} from "lucide-react";
import { exportMethodologyPDF } from "@/lib/pdfExport";

export default function MethodeAbsorbe() {
  const handleExportPDF = () => {
    exportMethodologyPDF("absorbe");
  };

  const sections = [
    {
      title: "Air",
      icon: Wind,
      color: "from-sky-500 to-blue-600",
      bgColor: "bg-sky-100 dark:bg-sky-900/30",
      textColor: "text-sky-600 dark:text-sky-400",
      description: "Captation et analyse de l'atmosphère olfactive d'un lieu. Prélèvement sur tubes Tenax TA, analyse GC-MS pour identifier les molécules volatiles présentes dans l'air ambiant."
    },
    {
      title: "Lieu",
      icon: MapPin,
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      textColor: "text-emerald-600 dark:text-emerald-400",
      description: "Documentation du contexte spatial et temporel. Cartographie sensorielle, relevés météorologiques, analyse de la géologie et de la végétation pour comprendre l'identité olfactive d'un territoire."
    },
    {
      title: "Odeur",
      icon: Sparkles,
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      textColor: "text-purple-600 dark:text-purple-400",
      description: "Évaluation sensorielle selon les 8 axes ABSORBE (Animalité, Boisé, Souterrain, Ozoné, Résine, Brûlé, Épicé). Création de profils olfactifs détaillés pour chaque site étudié."
    },
    {
      title: "Fumé",
      icon: Flame,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      textColor: "text-orange-600 dark:text-orange-400",
      description: "Pyrolyse contrôlée des matériaux organiques prélevés. Analyse des composés volatils générés par combustion à différentes températures (120°C, 160°C, 200°C) pour révéler les notes fumées latentes."
    },
    {
      title: "Son",
      icon: Volume2,
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
      textColor: "text-pink-600 dark:text-pink-400",
      description: "Enregistrement de l'environnement sonore du lieu. Création d'une archive audio contextuelle permettant de restituer l'atmosphère globale lors de la captation olfactive."
    },
    {
      title: "Image",
      icon: Camera,
      color: "from-amber-500 to-yellow-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      textColor: "text-amber-600 dark:text-amber-400",
      description: "Documentation visuelle du terrain (photographie, vidéo). Archivage des textures, matériaux, lumières et ambiances visuelles qui accompagnent l'expérience olfactive du lieu."
    },
    {
      title: "Texte",
      icon: FileText,
      color: "from-indigo-500 to-blue-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      textColor: "text-indigo-600 dark:text-indigo-400",
      description: "Rédaction de notes de terrain, descriptions sensorielles et analyses critiques. Documentation écrite des impressions, hypothèses et découvertes tout au long du processus de recherche."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-amber-50/30 dark:to-amber-950/10">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white py-16"
        >
          <div className="container">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-4">
                <Layers className="w-12 h-12" />
                <h1 className="text-5xl md:text-6xl font-bold">Méthode ABSORBE</h1>
              </div>
              <p className="text-xl text-amber-100 mb-6">
                Protocole de recherche olfactive développé par PERFUMUM pour la captation, 
                l'analyse et la restitution des atmosphères sensorielles d'un lieu.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">7</div>
                  <div className="text-amber-200 text-sm">Dimensions</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">8</div>
                  <div className="text-amber-200 text-sm">Axes olfactifs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-amber-200 text-sm">Températures</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">∞</div>
                  <div className="text-amber-200 text-sm">Terrains</div>
                </div>
              </div>

              <button
                onClick={handleExportPDF}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-700 rounded-lg hover:bg-amber-50 transition-colors font-semibold"
              >
                <Download className="w-5 h-5" />
                Exporter en PDF
              </button>
            </div>
          </div>
        </motion.section>

        {/* Introduction */}
        <section className="py-12">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-2 border-amber-500/20">
                <CardContent className="pt-6">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    <strong className="text-foreground">ABSORBE</strong> est une méthodologie de recherche-création qui articule sept dimensions complémentaires 
                    (Air, Lieu, Odeur, Fumé, Son, Image, Texte) pour documenter et analyser l'identité olfactive d'un territoire.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Cette approche transdisciplinaire combine chimie analytique, géographie sensorielle et pratiques artistiques 
                    pour produire des accords olfactifs fidèles aux atmosphères captées. PERFUMUM applique cette méthodologie 
                    sur l'ensemble de ses terrains de recherche (forêts, musées, friches industrielles) pour créer une archive 
                    olfactive documentée et reproductible.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* 7 Sections */}
        <section className="py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto space-y-6">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-amber-500/30 overflow-hidden">
                      <div className={`h-1 bg-gradient-to-r ${section.color}`} />
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-6">
                          <div className={`w-14 h-14 rounded-xl ${section.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-7 h-7 ${section.textColor}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge variant="outline" className="text-xs font-mono">
                                {String(index + 1).padStart(2, '0')}
                              </Badge>
                              <h2 className="text-2xl font-bold">{section.title}</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {section.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Approfondissement */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="py-12"
        >
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FlaskConical className="w-6 h-6 text-amber-600" />
                Protocoles techniques
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <Flame className="w-5 h-5 text-orange-600" />
                      </div>
                      <CardTitle>Pyrolyse Contrôlée</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Protocoles de pyrolyse à 3 températures (120°C, 160°C, 200°C) et profils de dégradation thermique.
                    </p>
                    <Link href="/methodologie/pyrolyse">
                      <span className="inline-flex items-center gap-2 text-orange-600 hover:underline font-semibold text-sm cursor-pointer">
                        Lire le protocole <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Microscope className="w-5 h-5 text-blue-600" />
                      </div>
                      <CardTitle>Chromatographie GC-MS</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Analyse chromatographique, standards internes, et interprétation des chromatogrammes.
                    </p>
                    <Link href="/methodologie/gc-ms">
                      <span className="inline-flex items-center gap-2 text-blue-600 hover:underline font-semibold text-sm cursor-pointer">
                        Lire le protocole <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Navigation vers pages connexes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="py-12 bg-muted/20"
        >
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                Pages connexes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/projets">
                  <div className="block p-4 bg-background rounded-lg border hover:border-amber-500/50 transition-colors cursor-pointer">
                    <div className="font-medium flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-amber-600" />
                      Projets terrain
                    </div>
                    <div className="text-sm text-muted-foreground">Découvrir les terrains de recherche</div>
                  </div>
                </Link>
                <Link href="/archives-terrain">
                  <div className="block p-4 bg-background rounded-lg border hover:border-amber-500/50 transition-colors cursor-pointer">
                    <div className="font-medium flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-amber-600" />
                      Archives de terrain
                    </div>
                    <div className="text-sm text-muted-foreground">Explorer les captations documentées</div>
                  </div>
                </Link>
                <Link href="/timeline">
                  <div className="block p-4 bg-background rounded-lg border hover:border-amber-500/50 transition-colors cursor-pointer">
                    <div className="font-medium flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-amber-600" />
                      Calendrier
                    </div>
                    <div className="text-sm text-muted-foreground">Planification de la recherche</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  );
}
