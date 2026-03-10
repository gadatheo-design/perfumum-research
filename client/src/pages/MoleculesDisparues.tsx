// @ts-nocheck
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  AlertTriangle,
  FlaskConical,
  BookOpen,
  Dna,
  Clock,
  ArrowRight,
  ExternalLink,
  Cigarette,
  Leaf,
  Zap,
  Shield,
  Search,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// Timeline des vagues IFRA
const ifraWaves = [
  {
    year: 1973,
    label: "IFRA 1ère vague",
    color: "bg-amber-500",
    textColor: "text-amber-700",
    borderColor: "border-amber-400",
    molecules: [
      { name: "Nitromuscs aliphatiques", reason: "Neurotoxicité, bioaccumulation", status: "banned" },
      { name: "Mousse de chêne (Evernia prunastri)", reason: "Allergènes HICC, sensibilisation cutanée", status: "restricted" },
      { name: "Mousse d'arbre (Evernia furfuracea)", reason: "Allergènes HICC", status: "restricted" },
    ]
  },
  {
    year: 1998,
    label: "IFRA 2ème vague",
    color: "bg-orange-500",
    textColor: "text-orange-700",
    borderColor: "border-orange-400",
    molecules: [
      { name: "Muscs macrocycliques (Exaltolide)", reason: "Perturbateurs endocriniens", status: "restricted" },
      { name: "Hydroxycitronellal", reason: "Sensibilisation cutanée forte", status: "restricted" },
      { name: "Lyral (HICC)", reason: "Allergène majeur", status: "banned" },
      { name: "Eugenol (hautes doses)", reason: "Sensibilisation cutanée", status: "restricted" },
    ]
  },
  {
    year: 2022,
    label: "IFRA 3ème vague",
    color: "bg-red-500",
    textColor: "text-red-700",
    borderColor: "border-red-400",
    molecules: [
      { name: "Lilial (BMHCA)", reason: "Reprotoxique catégorie 1B", status: "banned" },
      { name: "Galaxolide (HHCB)", reason: "Perturbateur endocrinien, bioaccumulation", status: "restricted" },
      { name: "Tonalide (AHTN)", reason: "Perturbateur endocrinien", status: "restricted" },
      { name: "Methyl eugenol", reason: "Génotoxique", status: "banned" },
      { name: "Safrole", reason: "Hépatotoxique, cancérigène", status: "banned" },
      { name: "Coumarine (hautes doses)", reason: "Hépatotoxicité", status: "restricted" },
    ]
  },
];

// Molécules disparues historiques
const historicalMolecules = [
  {
    name: "Silphiol",
    source: "Silphium laserpitium",
    period: "Antiquité (500 BCE – 100 CE)",
    region: "Cyrénaïque (Libye)",
    status: "extinct",
    profile: "Épicé chaud, résineux amer, herbacé (fenouil, anis)",
    reconstruction: "Théorique — analyse résines fossilisées, plantes cousines (Ferula, Dorema)",
    confidence: "Spéculatif",
    link: "/absorbe-x/odeurs-perdues",
  },
  {
    name: "Kyphi (formule originale)",
    source: "Mélange 16 ingrédients (Égypte ancienne)",
    period: "Égypte ancienne (3000 BCE – 400 CE)",
    region: "Égypte",
    status: "partial",
    profile: "Résine, miel, vin, myrrhe, encens, genévrier, calame aromatique",
    reconstruction: "Partielle — 3 formules connues (Dioscoride, Plutarque, Papyrus Ebers)",
    confidence: "Probable",
    link: "/absorbe-x/odeurs-perdues",
  },
  {
    name: "Ambre gris naturel (grade A)",
    source: "Physeter macrocephalus",
    period: "Moyen Âge – XIXe siècle",
    region: "Océans tropicaux",
    status: "critical",
    profile: "Animal, marin, boisé, doux, légèrement fécal (frais), musc profond",
    reconstruction: "Synthèse Ambroxide/Ambroxan — approximation fidèle mais manque la complexité du vrai ambre",
    confidence: "Partiel",
    link: "/plantes",
  },
  {
    name: "Musc naturel (Moschus moschiferus)",
    source: "Chevrotain porte-musc",
    period: "Antiquité – XXe siècle",
    region: "Himalaya, Sibérie, Chine",
    status: "banned",
    profile: "Animal, chaud, terreux, légèrement fécal, persistance extrême",
    reconstruction: "Muscs macrocycliques (Exaltolide, Habanolide), muscs nitrés (interdits)",
    confidence: "Partiel",
    link: "/molecules",
  },
];

// Cigarettes disparues
const disappearedCigarettes = [
  {
    brand: "Gitanes Maïs",
    country: "France",
    period: "1910–1984",
    profile: "Tabac brun fort, papier maïs, notes herbacées, légèrement sucré",
    molecules: ["Nornicotine", "Anabasine", "Furfural", "Pyridine"],
    note: "Papier maïs remplacé par papier blanc en 1984. Profil radicalement différent.",
  },
  {
    brand: "Gauloises Brunes (formule originale)",
    country: "France",
    period: "1910–2015",
    profile: "Tabac brun caporal, fort, terreux, légèrement ammoniaqué",
    molecules: ["Nicotine", "Nornicotine", "Acide Acétique", "Pyridine", "Furfural"],
    note: "Reformulée plusieurs fois. Arrêt définitif en France en 2015.",
  },
  {
    brand: "Balkan Sobranie",
    country: "UK / Bulgarie",
    period: "1879–1990s",
    profile: "Tabac Latakia fumé, Oriental doux, Virginie léger, complexe",
    molecules: ["Guaiacol", "Syringol", "Eugenol", "Vanilline", "Furfural"],
    note: "Mélange de 3 tabacs rares. Reformulation majeure dans les années 1990.",
  },
  {
    brand: "Old Gold (formule 1930s)",
    country: "USA",
    period: "1926–1970s",
    profile: "Virginie doux, notes caramel, légèrement floral, très doux",
    molecules: ["Vanilline", "Coumarine", "Benzaldéhyde", "Acétaldéhyde"],
    note: "Formule originale des années 1930 perdue lors de la consolidation des marques.",
  },
  {
    brand: "Camel Turkish & Domestic Blend (1913)",
    country: "USA",
    period: "1913–1950s",
    profile: "Oriental turc (Samsun, Izmir), Virginie, notes épicées, fumé léger",
    molecules: ["Solanone", "Megastigmatrienone", "Nornicotine", "Furfural"],
    note: "Blend original avec 20% tabac turc. Proportion réduite progressivement après WWII.",
  },
];

const statusColors = {
  banned: "bg-red-100 text-red-700 border-red-300",
  restricted: "bg-orange-100 text-orange-700 border-orange-300",
  extinct: "bg-gray-100 text-gray-700 border-gray-300",
  partial: "bg-yellow-100 text-yellow-700 border-yellow-300",
  critical: "bg-red-100 text-red-700 border-red-300",
};

const statusLabels = {
  banned: "Interdit",
  restricted: "Restreint",
  extinct: "Éteint",
  partial: "Partiel",
  critical: "Critique",
};

export function MoleculesDisparues() {
  const [activeTab, setActiveTab] = useState("ifra");
  const [searchQuery, setSearchQuery] = useState("");

  // Charger les research_entries liées aux molécules disparues
  const { data: ax05Entry } = trpc.researchEntries.getByCode.useQuery("AX-05-AN01");
  const { data: pf23Entry } = trpc.researchEntries.getByCode.useQuery("PF-23-SR01");
  const { data: tabEntry } = trpc.researchEntries.getByCode.useQuery("TAB-CD01");

  const filteredCigarettes = disappearedCigarettes.filter(c =>
    !searchQuery || c.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.profile.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.molecules.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 max-w-6xl">
        <DynamicBreadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Recherche", href: "/axes-recherche" },
            { label: "Molécules Disparues" },
          ]}
        />

        {/* Header */}
        <div className="mb-8 mt-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Molécules Disparues & Interdites</h1>
              <p className="text-muted-foreground mt-1">
                Arômes perdus, molécules interdites par l'IFRA, et cigarettes disparues — patrimoine olfactif en péril
              </p>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Molécules interdites IFRA", value: "47+", icon: Shield, color: "text-red-600" },
              { label: "Arômes historiques perdus", value: "12+", icon: Clock, color: "text-amber-600" },
              { label: "Marques cigarettes disparues", value: "30+", icon: Cigarette, color: "text-gray-600" },
              { label: "Projets reconstruction", value: "6", icon: Dna, color: "text-emerald-600" },
            ].map((stat) => (
              <Card key={stat.label} className="p-4">
                <div className="flex items-center gap-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="ifra" className="flex items-center gap-1">
              <Shield className="h-4 w-4" /> Timeline IFRA
            </TabsTrigger>
            <TabsTrigger value="historiques" className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> Arômes Historiques
            </TabsTrigger>
            <TabsTrigger value="cigarettes" className="flex items-center gap-1">
              <Cigarette className="h-4 w-4" /> Cigarettes Disparues
            </TabsTrigger>
            <TabsTrigger value="biotechnologie" className="flex items-center gap-1">
              <Dna className="h-4 w-4" /> Résurrection Biotech
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> Sources
            </TabsTrigger>
          </TabsList>

          {/* IFRA Timeline */}
          <TabsContent value="ifra">
            <div className="space-y-6">
              <Card className="p-4 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>IFRA (International Fragrance Association)</strong> — Depuis 1973, l'IFRA publie des standards
                  de sécurité qui ont progressivement interdit ou restreint des dizaines de molécules olfactives.
                  Ces interdictions ont radicalement transformé la parfumerie contemporaine, effaçant des signatures
                  olfactives irremplaçables.
                </p>
              </Card>

              {/* Timeline verticale */}
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-8">
                  {ifraWaves.map((wave) => (
                    <div key={wave.year} className="relative pl-16">
                      {/* Point sur la timeline */}
                      <div className={`absolute left-4 top-1 w-4 h-4 rounded-full ${wave.color} border-2 border-background shadow`} />
                      
                      <Card className={`border-l-4 ${wave.borderColor}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{wave.label}</CardTitle>
                            <Badge variant="outline" className={wave.textColor}>{wave.year}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {wave.molecules.map((mol) => (
                              <div key={mol.name} className="flex items-start justify-between gap-3 p-2 rounded-md bg-muted/50">
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{mol.name}</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">{mol.reason}</div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={mol.status === 'banned'
                                    ? 'bg-red-100 text-red-700 border-red-300 text-xs'
                                    : 'bg-orange-100 text-orange-700 border-orange-300 text-xs'
                                  }
                                >
                                  {mol.status === 'banned' ? 'Interdit' : 'Restreint'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <Link href="/molecules">
                              <Button variant="ghost" size="sm" className="text-xs gap-1">
                                Voir les molécules concernées <ArrowRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lien vers AX-05-AN01 */}
              {ax05Entry && (
                <Card className="mt-6 border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">{ax05Entry.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{ax05Entry.summary}</div>
                        <Link href={`/axes-recherche/${ax05Entry.id}`}>
                          <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-2 gap-1">
                            Lire la note de recherche complète <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Arômes Historiques */}
          <TabsContent value="historiques">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Arômes documentés dans les sources historiques mais dont les formules ou les plantes sources ont
                disparu. Chaque entrée représente un projet de reconstruction potentiel.
              </p>
              {historicalMolecules.map((mol) => (
                <Card key={mol.name} className="overflow-hidden">
                  <div className="flex">
                    <div className={`w-1 flex-shrink-0 ${
                      mol.status === 'extinct' ? 'bg-gray-400' :
                      mol.status === 'critical' ? 'bg-red-500' :
                      mol.status === 'banned' ? 'bg-red-600' : 'bg-amber-400'
                    }`} />
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="font-semibold">{mol.name}</h3>
                          <div className="text-xs text-muted-foreground italic">{mol.source}</div>
                        </div>
                        <Badge variant="outline" className={statusColors[mol.status] || ''}>
                          {statusLabels[mol.status] || mol.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground text-xs">Période :</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{mol.period}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Région :</span>
                          <div className="text-xs mt-0.5">{mol.region}</div>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-muted-foreground text-xs">Profil olfactif :</span>
                          <div className="text-xs mt-0.5 italic">"{mol.profile}"</div>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-muted-foreground text-xs">Reconstruction :</span>
                          <div className="text-xs mt-0.5 flex items-start gap-1">
                            <Dna className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                            {mol.reconstruction}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          Confiance : {mol.confidence}
                        </Badge>
                        <Link href={mol.link}>
                          <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                            Explorer <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Cigarettes Disparues */}
          <TabsContent value="cigarettes">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher par marque, profil ou molécule..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-background"
                  />
                </div>
              </div>

              {/* Lien vers TAB-CD01 */}
              {tabEntry && (
                <Card className="border-dashed mb-4">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>Note de recherche : </span>
                      <Link href={`/axes-recherche/${tabEntry.id}`}>
                        <span className="text-primary hover:underline cursor-pointer">{tabEntry.title}</span>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {filteredCigarettes.map((cig) => (
                <Card key={cig.brand}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Cigarette className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold">{cig.brand}</h3>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{cig.country} · {cig.period}</div>
                      </div>
                    </div>
                    <div className="text-sm italic text-muted-foreground mb-3">"{cig.profile}"</div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {cig.molecules.map((mol) => (
                        <Link key={mol} href={`/molecules?search=${encodeURIComponent(mol)}`}>
                          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-primary/10">
                            <FlaskConical className="h-2.5 w-2.5 mr-1" />
                            {mol}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                      <span className="font-medium">Note :</span> {cig.note}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Résurrection Biotechnologique */}
          <TabsContent value="biotechnologie">
            <div className="space-y-4">
              {pf23Entry && (
                <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Dna className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{pf23Entry.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">{pf23Entry.summary}</div>
                        <Link href={`/axes-recherche/${pf23Entry.id}`}>
                          <Button variant="link" size="sm" className="p-0 h-auto text-sm mt-2 gap-1 text-emerald-700">
                            Lire la note complète <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "ADN Ancien & Paléogénomique",
                    icon: Dna,
                    color: "text-purple-600",
                    bg: "bg-purple-50 dark:bg-purple-950/20",
                    description: "Extraction d'ADN de pollens fossilisés (ambre, sédiments) pour reconstituer les profils métaboliques de plantes disparues. Projet Silphium — Université de Bonn.",
                    status: "Recherche active",
                    link: "https://www.ncbi.nlm.nih.gov/",
                  },
                  {
                    title: "Biologie Synthétique",
                    icon: FlaskConical,
                    color: "text-blue-600",
                    bg: "bg-blue-50 dark:bg-blue-950/20",
                    description: "Ingénierie de voies biosynthétiques dans des organismes hôtes (levures, E. coli) pour produire des molécules rares ou disparues. Ambroxide, Muscone synthétique.",
                    status: "Opérationnel",
                    link: "https://www.addgene.org/",
                  },
                  {
                    title: "Projet ODEUROPA",
                    icon: BookOpen,
                    color: "text-amber-600",
                    bg: "bg-amber-50 dark:bg-amber-950/20",
                    description: "Projet européen (2021-2024) de reconstruction du patrimoine olfactif européen par NLP sur textes historiques + chimie analytique. 12 odeurs historiques reconstituées.",
                    status: "Terminé 2024",
                    link: "https://odeuropa.eu/",
                  },
                  {
                    title: "Chimie Analytique Archéologique",
                    icon: Zap,
                    color: "text-green-600",
                    bg: "bg-green-50 dark:bg-green-950/20",
                    description: "GC-MS sur résidus archéologiques (amphores, vases à parfum, momies). Identification de molécules dans des résines vieilles de 3000 ans. Kyphi, Nardostachys.",
                    status: "Actif",
                    link: "https://www.sciencedirect.com/",
                  },
                ].map((item) => (
                  <Card key={item.title} className={`${item.bg} border-0`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                        <h3 className="font-semibold text-sm">{item.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">{item.status}</Badge>
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                            Source <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Connexion PERFUMUM */}
              <Card className="mt-4 border-dashed">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-emerald-500" />
                    Connexions PERFUMUM
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {[
                      { label: "Plantes CITES", href: "/patrimoine-menace", desc: "Espèces menacées liées aux molécules rares" },
                      { label: "Raretés Aromatiques", href: "/aromatic-rarities", desc: "45 RAR documentées (RAR-301 à RAR-345)" },
                      { label: "Odeurs Perdues", href: "/absorbe-x/odeurs-perdues", desc: "Base ABSORBE X — reconstructions olfactives" },
                    ].map((link) => (
                      <Link key={link.href} href={link.href}>
                        <div className="p-2 rounded border hover:bg-muted/50 cursor-pointer transition-colors">
                          <div className="font-medium">{link.label}</div>
                          <div className="text-muted-foreground">{link.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sources */}
          <TabsContent value="sources">
            <div className="space-y-4">
              {[ax05Entry, pf23Entry, tabEntry].filter(Boolean).map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs font-mono">{entry.entry_code}</Badge>
                          <h3 className="font-medium text-sm">{entry.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{entry.summary}</p>
                        {entry.content && (
                          <div className="prose prose-sm max-w-none dark:prose-invert text-xs border-t pt-3">
                            <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">{entry.content.substring(0, 800) + (entry.content.length > 800 ? '...' : '')}</ReactMarkdown>
                          </div>
                        )}
                        <Link href={`/axes-recherche/${entry.id}`}>
                          <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-2 gap-1">
                            Lire la note complète <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Bibliographies externes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Références bibliographiques clés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs">
                    {[
                      { ref: "IFRA Standards (2022)", url: "https://ifrafragrance.org/standards", type: "Réglementation" },
                      { ref: "Evershed et al. (2003) — Volatile compounds from archaeological samples", url: "https://www.sciencedirect.com/", type: "Chimie analytique" },
                      { ref: "ODEUROPA Project (2021-2024) — European Olfactory Heritage", url: "https://odeuropa.eu/", type: "Patrimoine" },
                      { ref: "Pal & Singh (2026) — Kannauj Attar Industry, IJFMR", url: "https://www.ijfmr.com/", type: "Industrie" },
                    ].map((bib) => (
                      <div key={bib.ref} className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <div>
                          <span className="font-medium">{bib.ref}</span>
                          <Badge variant="secondary" className="ml-2 text-xs">{bib.type}</Badge>
                        </div>
                        <a href={bib.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
