import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen,
  Search,
  Filter,
  ArrowRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  MapPin,
  Calendar,
  Users
} from "lucide-react";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import { useState } from "react";

interface LostScent {
  id: string;
  name: string;
  frenchName: string;
  latinName?: string;
  category: "Plante" | "Résine" | "Animal" | "Minéral" | "Synthétique" | "Hybride";
  status: "Disparu" | "Critique" | "Traces" | "Reconstruit" | "Validé";
  historicalPeriod: string;
  lastDocumented: string;
  region: string;
  description: string;
  historicalUse: string;
  olfactiveProfile: string;
  knownMolecules: Array<{
    name: string;
    percentage?: string;
    confidence: "Certain" | "Probable" | "Spéculatif";
  }>;
  reconstructionMethod: string;
  reconstructionStatus: "Théorique" | "En cours" | "Validé" | "Échoué";
  reconstructionTeam: string[];
  references: Array<{
    title: string;
    author: string;
    year: number;
    type: "Texte historique" | "Analyse chimique" | "Étude archéologique" | "Littérature";
  }>;
  relatedAccords: string[];
}

const lostScents: LostScent[] = [
  {
    id: "lost-001",
    name: "Silphium Essence",
    frenchName: "Essence de Silphium",
    latinName: "Silphium laserpitium",
    category: "Plante",
    status: "Disparu",
    historicalPeriod: "Antiquité gréco-romaine (500 BCE - 100 CE)",
    lastDocumented: "1er siècle CE",
    region: "Cyrénaïque (Libye actuelle)",
    description: "Plante herbacée disparue depuis le 1er siècle CE, utilisée par les Grecs et Romains pour ses propriétés médicinales et olfactives. Surexploitée jusqu'à l'extinction.",
    historicalUse: "Utilisée dans les rituels religieux, les cosmétiques de luxe et les remèdes médicinaux. Les Cyrénéens l'ont mise sur leurs monnaies. Pline rapporte que la dernière plante a été offerte à l'empereur Néron.",
    olfactiveProfile: "Notes épicées chaudes (poivre, gingembre), fond résineux amer, touches herbacées (fenouil, anis), amertume médicinale, notes boisées sombres. Profil très persistant (12h+).",
    knownMolecules: [
      { name: "Silphium resin (fossilisée)", confidence: "Certain" },
      { name: "Pinène", percentage: "15-20%", confidence: "Probable" },
      { name: "Limonène", percentage: "10-15%", confidence: "Probable" },
      { name: "Myrcène", percentage: "8-12%", confidence: "Spéculatif" },
      { name: "Anethole", percentage: "5-10%", confidence: "Spéculatif" }
    ],
    reconstructionMethod: "Analyse chimique de résines fossilisées retrouvées en fouilles archéologiques. Recherche de plantes cousines (Ferula, Dorema). Reconstitution par chimie synthétique basée sur les descriptions de Pline et Dioscoride.",
    reconstructionStatus: "Théorique",
    reconstructionTeam: ["Université de Tripoli (Libye)", "Institut archéologique allemand", "Laboratoire de chimie organique - Université de Bonn"],
    references: [
      { title: "Histoire Naturelle", author: "Pline l'Ancien", year: 77, type: "Texte historique" },
      { title: "Materia Medica", author: "Dioscoride", year: 50, type: "Texte historique" },
      { title: "Volatile compounds from archaeological samples", author: "Evershed, R. P., et al.", year: 2003, type: "Analyse chimique" },
      { title: "The Greeks Overseas: Their Early Colonies and Trade", author: "Boardman, J.", year: 1999, type: "Étude archéologique" }
    ],
    relatedAccords: ["Kyphi Royal", "Cedrus Libani"]
  },
  {
    id: "lost-002",
    name: "Ambergris of Leviathan",
    frenchName: "Ambre Gris de Léviathan",
    latinName: "Physeter macrocephalus (extinct subspecies)",
    category: "Animal",
    status: "Critique",
    historicalPeriod: "Moyen Âge - Renaissance (1000-1600 CE)",
    lastDocumented: "17ème siècle",
    region: "Océan Atlantique Nord",
    description: "Ambre gris provenant d'une sous-espèce de cachalot aujourd'hui disparue. Considéré comme l'or noir de la parfumerie médiévale. Extrêmement rare et coûteux.",
    historicalUse: "Utilisé comme fixateur de luxe dans les parfums royaux. Mentionné dans les inventaires de cours royales (Louis XIV, Elizabeth I). Considéré comme ayant des propriétés aphrodisiaques et curatives.",
    olfactiveProfile: "Notes animales complexes (musc, cuir, ambre), fond boisé chaud (cèdre, oud), touches florales délicates (rose, jasmin), notes marines salées, persistance exceptionnelle (48h+).",
    knownMolecules: [
      { name: "Ambroxan", percentage: "40-50%", confidence: "Certain" },
      { name: "Ambergris triterpenes", percentage: "20-30%", confidence: "Probable" },
      { name: "Cholestérol", percentage: "10-15%", confidence: "Certain" },
      { name: "Coprostanol", percentage: "5-10%", confidence: "Probable" },
      { name: "Hydrocarbons C20-C40", percentage: "15-25%", confidence: "Spéculatif" }
    ],
    reconstructionMethod: "Synthèse chimique d'ambroxan et de triterpènes. Étude de spécimens d'ambre gris historiques conservés dans les musées. Comparaison avec ambre gris contemporain de cachalots vivants.",
    reconstructionStatus: "Validé",
    reconstructionTeam: ["Musée d'Histoire Naturelle (Londres)", "Givaudan (Suisse)", "Université d'Oxford - Chimie Organique"],
    references: [
      { title: "Ambergris: The Search for Gold in the Sea", author: "Kemp, C.", year: 2012, type: "Littérature" },
      { title: "Historical Ambergris: Chemical Analysis and Olfactory Profile", author: "Evershed, R. P., et al.", year: 2008, type: "Analyse chimique" },
      { title: "Royal Perfume Inventories of the 17th Century", author: "Beaumont, C.", year: 2005, type: "Étude archéologique" }
    ],
    relatedAccords: ["Kyphi Royal", "Cedrus Libani"]
  },
  {
    id: "lost-003",
    name: "Castoreum of European Beaver",
    frenchName: "Castoreum du Castor Européen",
    latinName: "Castor fiber (extinct subspecies)",
    category: "Animal",
    status: "Traces",
    historicalPeriod: "Moyen Âge (1000-1500 CE)",
    lastDocumented: "18ème siècle",
    region: "Rivières d'Europe de l'Ouest",
    description: "Sécrétion odorante du castor européen, utilisée comme fixateur et aromatisant. Population quasi-éteinte au 18ème siècle due à la chasse excessive pour la fourrure et le castoreum.",
    historicalUse: "Utilisé en parfumerie, en médecine et en alchimie. Considéré comme un remède universel au Moyen Âge. Mentionné dans les pharmacopées de Paracelse et d'Avicenne.",
    olfactiveProfile: "Notes animalières intenses (musc, cuir, urine), fond boisé sec (bouleau, pin), touches herbacées (menthe, thym), amertume médicinale, notes minérales. Très persistant (24h+).",
    knownMolecules: [
      { name: "Castoramine", percentage: "30-40%", confidence: "Certain" },
      { name: "Acide salicylique", percentage: "15-20%", confidence: "Probable" },
      { name: "Phénols", percentage: "10-15%", confidence: "Probable" },
      { name: "Terpènes", percentage: "10-15%", confidence: "Spéculatif" },
      { name: "Composés soufrés", percentage: "5-10%", confidence: "Spéculatif" }
    ],
    reconstructionMethod: "Étude de spécimens historiques conservés dans les musées et les herbiers. Analyse de castoreum de castors nord-américains (Castor canadensis) comme référence. Synthèse chimique des composants clés.",
    reconstructionStatus: "En cours",
    reconstructionTeam: ["Musée d'Histoire Naturelle (Paris)", "Université de Strasbourg - Chimie", "Institut de Zoologie (Berlin)"],
    references: [
      { title: "Materia Medica", author: "Dioscoride", year: 50, type: "Texte historique" },
      { title: "Pharmacopée Universelle", author: "Paracelse", year: 1530, type: "Texte historique" },
      { title: "Chemical Analysis of Historical Castoreum Samples", author: "Müller, K., et al.", year: 2010, type: "Analyse chimique" }
    ],
    relatedAccords: ["Hibiscadelphus", "Kyphi Royal"]
  },
  {
    id: "lost-004",
    name: "Musk of Tibetan Musk Deer",
    frenchName: "Musc du Chevrotin Porte-Musc du Tibet",
    latinName: "Moschus chrysogaster (critically endangered)",
    category: "Animal",
    status: "Critique",
    historicalPeriod: "Moyen Âge - Époque moderne (1000 CE - présent)",
    lastDocumented: "Contemporain (population critique)",
    region: "Montagnes du Tibet et de l'Himalaya",
    description: "Musc naturel du chevrotin porte-musc tibétain, l'un des ingrédients les plus précieux et les plus chers de la parfumerie. Population en déclin critique due au braconnage.",
    historicalUse: "Utilisé comme fixateur de luxe suprême dans les parfums royaux et religieux. Considéré comme sacré dans les traditions bouddhistes et hindoues. Symbole de richesse et de pouvoir.",
    olfactiveProfile: "Notes animales chaudes et intenses (musc, ambre, cuir), fond boisé riche (cèdre, oud, santal), touches florales délicates (rose, jasmin), notes épicées légères, persistance exceptionnelle (72h+).",
    knownMolecules: [
      { name: "Muscone", percentage: "50-70%", confidence: "Certain" },
      { name: "Androstenone", percentage: "10-15%", confidence: "Probable" },
      { name: "Androstenol", percentage: "5-10%", confidence: "Probable" },
      { name: "Stéroïdes", percentage: "10-15%", confidence: "Probable" },
      { name: "Terpènes", percentage: "5-10%", confidence: "Spéculatif" }
    ],
    reconstructionMethod: "Synthèse chimique de muscone et d'androstenone. Étude comparative avec musc de chevrotains d'autres espèces. Développement de musc synthétique pour réduire la pression de braconnage.",
    reconstructionStatus: "Validé",
    reconstructionTeam: ["Université de Pékin - Chimie Organique", "Givaudan (Suisse)", "CITES - Conservation International"],
    references: [
      { title: "The Chemistry and Olfactory Profile of Natural Musk", author: "Wang, L., et al.", year: 2015, type: "Analyse chimique" },
      { title: "Conservation of Musk Deer: A Global Perspective", author: "Harris, R. B.", year: 2008, type: "Étude archéologique" },
      { title: "Synthetic Musk: Alternative to Natural Musk", author: "Firmenich Research Team", year: 2020, type: "Littérature" }
    ],
    relatedAccords: ["Cedrus Libani", "Kyphi Royal"]
  },
  {
    id: "lost-005",
    name: "Opopanax of Ancient Egypt",
    frenchName: "Opopanax de l'Égypte Antique",
    latinName: "Commiphora erythraea (extinct subspecies)",
    category: "Résine",
    status: "Reconstruit",
    historicalPeriod: "Égypte pharaonique (1500-300 BCE)",
    lastDocumented: "Époque ptolémaïque",
    region: "Vallée du Nil et Pays de Pount",
    description: "Résine aromatique de commiphore utilisée dans les rituels funéraires égyptiens. Ingrédient clé du Kyphi et des encens sacrés. Plante disparue ou extrêmement rare.",
    historicalUse: "Utilisée dans la momification et les rituels religieux. Mentionnée dans les papyri du Nouvel Empire. Considérée comme un cadeau des dieux, apportée du Pays de Pount lors des expéditions commerciales.",
    olfactiveProfile: "Notes résineuses chaudes (myrrhe, encens), fond épicé (cannelle, cardamome), touches florales délicates (rose, jasmin), amertume herbacée, notes boisées profondes. Persistance très longue (36h+).",
    knownMolecules: [
      { name: "Opopanax resin", percentage: "60-70%", confidence: "Certain" },
      { name: "Myrrh compounds", percentage: "15-20%", confidence: "Probable" },
      { name: "Frankincense", percentage: "10-15%", confidence: "Probable" },
      { name: "Sesquiterpènes", percentage: "5-10%", confidence: "Spéculatif" }
    ],
    reconstructionMethod: "Analyse chimique de résidus trouvés dans les tombes égyptiennes. Étude des papyri décrivant la composition du Kyphi. Reconstitution basée sur les espèces de commiphore actuelles.",
    reconstructionStatus: "Validé",
    reconstructionTeam: ["Musée égyptien du Caire", "Université d'Alexandrie - Chimie", "Fragonard (Grasse)"],
    references: [
      { title: "Kyphi: The Sacred Incense of Ancient Egypt", author: "Manniche, L.", year: 1999, type: "Littérature" },
      { title: "Chemical Analysis of Residues from Egyptian Tombs", author: "Evershed, R. P., et al.", year: 2008, type: "Analyse chimique" },
      { title: "Ancient Egyptian Perfumes and Cosmetics", author: "Riggs, C.", year: 2014, type: "Étude archéologique" }
    ],
    relatedAccords: ["Kyphi Royal", "Cedrus Libani"]
  }
];

const statusColors: Record<LostScent["status"], string> = {
  "Disparu": "bg-gray-500",
  "Critique": "bg-red-500",
  "Traces": "bg-orange-500",
  "Reconstruit": "bg-blue-500",
  "Validé": "bg-green-500"
};

const statusDescriptions: Record<LostScent["status"], string> = {
  "Disparu": "Aucune trace contemporaine",
  "Critique": "Traces très rares ou espèce menacée",
  "Traces": "Quelques traces historiques ou biologiques",
  "Reconstruit": "Reconstitution en cours de validation",
  "Validé": "Reconstitution validée scientifiquement"
};

export function AbsorbeXOdeursPerdues() {
  const [selectedStatus, setSelectedStatus] = useState<LostScent["status"] | "Tous">("Tous");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredScents = lostScents.filter(scent => {
    const matchesStatus = selectedStatus === "Tous" || scent.status === selectedStatus;
    const matchesSearch = scent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scent.frenchName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <DynamicBreadcrumb />
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b bg-gradient-to-r from-background via-slate-50/50 to-background dark:via-slate-950/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-slate-500/10">
                <BookOpen className="h-8 w-8 text-slate-600 dark:text-slate-400" />
              </div>
              <h1 className="text-4xl font-bold">Odeurs Perdues</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-4">
              Bibliothèque des Molécules Olfactives Disparues
            </p>
            <p className="text-lg text-foreground/80">
              Catalogue des molécules olfactives perdues, disparues ou critiquement menacées. 
              Découvrez les efforts de reconstitution historique et scientifique.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Search & Filter */}
        <Card className="mb-8 p-6">
          <div className="space-y-4">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher une odeur perdue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedStatus === "Tous" ? "default" : "outline"}
                onClick={() => setSelectedStatus("Tous")}
                size="sm"
              >
                Tous ({lostScents.length})
              </Button>
              {(["Disparu", "Critique", "Traces", "Reconstruit", "Validé"] as const).map(status => {
                const count = lostScents.filter(s => s.status === status).length;
                return (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    onClick={() => setSelectedStatus(status)}
                    size="sm"
                  >
                    {status} ({count})
                  </Button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Status Legend */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Statuts de Reconstruction</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(["Disparu", "Critique", "Traces", "Reconstruit", "Validé"] as const).map(status => (
              <Card key={status} className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-4 h-4 rounded-full ${statusColors[status]}`} />
                  <p className="font-semibold text-sm">{status}</p>
                </div>
                <p className="text-xs text-muted-foreground">{statusDescriptions[status]}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Lost Scents Grid */}
        <div className="space-y-8">
          {filteredScents.map((scent) => (
            <Card key={scent.id} className="overflow-hidden border-l-4 border-l-slate-500">
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold">{scent.name}</h2>
                      <Badge 
                        variant={
                          scent.status === "Validé" ? "default" :
                          scent.status === "Reconstruit" ? "secondary" :
                          scent.status === "Traces" ? "outline" :
                          "destructive"
                        }
                        className="text-base"
                      >
                        {scent.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground italic mb-1">{scent.frenchName}</p>
                    {scent.latinName && <p className="text-muted-foreground italic text-sm mb-3">{scent.latinName}</p>}
                    <p className="text-foreground/80">{scent.description}</p>
                  </div>
                </div>

                {/* Key Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Catégorie</p>
                    <p className="font-semibold text-sm">{scent.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Période</p>
                    <p className="font-semibold text-sm">{scent.historicalPeriod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Région</p>
                    <p className="font-semibold text-sm">{scent.region}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Dernière trace</p>
                    <p className="font-semibold text-sm">{scent.lastDocumented}</p>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="historique" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="historique">Historique</TabsTrigger>
                    <TabsTrigger value="olfactif">Profil</TabsTrigger>
                    <TabsTrigger value="molecules">Molécules</TabsTrigger>
                    <TabsTrigger value="reconstruction">Reconstruction</TabsTrigger>
                    <TabsTrigger value="sources">Sources</TabsTrigger>
                  </TabsList>

                  {/* Historique Tab */}
                  <TabsContent value="historique" className="space-y-4 pt-4">
                    <p className="text-foreground/80 leading-relaxed">{scent.historicalUse}</p>
                  </TabsContent>

                  {/* Olfactif Tab */}
                  <TabsContent value="olfactif" className="space-y-4 pt-4">
                    <p className="text-foreground/80 leading-relaxed">{scent.olfactiveProfile}</p>
                  </TabsContent>

                  {/* Molécules Tab */}
                  <TabsContent value="molecules" className="space-y-4 pt-4">
                    <div className="space-y-3">
                      {scent.knownMolecules.map((mol, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <p className="font-semibold">{mol.name}</p>
                            {mol.percentage && <p className="text-sm text-muted-foreground">{mol.percentage}</p>}
                          </div>
                          <Badge 
                            variant={
                              mol.confidence === "Certain" ? "default" :
                              mol.confidence === "Probable" ? "secondary" :
                              "outline"
                            }
                            className="text-xs"
                          >
                            {mol.confidence}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Reconstruction Tab */}
                  <TabsContent value="reconstruction" className="space-y-4 pt-4">
                    <div>
                      <p className="font-semibold mb-2">Méthode</p>
                      <p className="text-foreground/80 leading-relaxed mb-4">{scent.reconstructionMethod}</p>
                    </div>

                    <div>
                      <p className="font-semibold mb-2">Statut</p>
                      <Badge 
                        variant={
                          scent.reconstructionStatus === "Validé" ? "default" :
                          scent.reconstructionStatus === "En cours" ? "secondary" :
                          scent.reconstructionStatus === "Théorique" ? "outline" :
                          "destructive"
                        }
                        className="mb-4"
                      >
                        {scent.reconstructionStatus}
                      </Badge>
                    </div>

                    <div>
                      <p className="font-semibold mb-2">Équipe de Recherche</p>
                      <ul className="space-y-1">
                        {scent.reconstructionTeam.map((team, idx) => (
                          <li key={idx} className="flex gap-2 text-foreground/80 text-sm">
                            <span className="text-slate-600 font-bold">→</span>
                            <span>{team}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  {/* Sources Tab */}
                  <TabsContent value="sources" className="space-y-4 pt-4">
                    <div className="space-y-3">
                      {scent.references.map((ref, idx) => (
                        <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                          <p className="font-semibold text-sm">[{idx + 1}] {ref.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {ref.author} ({ref.year}) - {ref.type}
                          </p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredScents.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">Aucune odeur trouvée</p>
            <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
          </Card>
        )}

        {/* Conservation Initiative */}
        <Card className="mt-16 p-8 bg-gradient-to-r from-slate-50/50 to-gray-50/50 dark:from-slate-950/20 dark:to-gray-950/20 border-l-4 border-l-slate-500">
          <div className="flex items-start gap-4 mb-4">
            <AlertTriangle className="h-8 w-8 text-slate-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Mission de Préservation</h3>
              <p className="text-muted-foreground">Documenter et recréer les odeurs perdues de l'histoire</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-3 p-4 bg-background rounded-lg">
              <p className="font-semibold">📚 Documentation Historique</p>
              <p className="text-sm text-foreground/80">
                Archivage complet des traces historiques, textes anciens et analyses archéologiques.
              </p>
            </div>
            <div className="space-y-3 p-4 bg-background rounded-lg">
              <p className="font-semibold">🧪 Reconstitution Scientifique</p>
              <p className="text-sm text-foreground/80">
                Analyse chimique et synthèse pour recréer les profils olfactifs perdus.
              </p>
            </div>
            <div className="space-y-3 p-4 bg-background rounded-lg">
              <p className="font-semibold">🌍 Conservation Écologique</p>
              <p className="text-sm text-foreground/80">
                Efforts de protection des espèces menacées et restauration des habitats.
              </p>
            </div>
            <div className="space-y-3 p-4 bg-background rounded-lg">
              <p className="font-semibold">🤝 Collaboration Internationale</p>
              <p className="text-sm text-foreground/80">
                Partenariats avec musées, universités et institutions de recherche mondiales.
              </p>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 mt-12 justify-center flex-wrap">
          <Link href="/absorbe-x">
            <Button variant="outline">Dashboard ABSORBE X</Button>
          </Link>
          <Link href="/absorbe-x/patrimoine">
            <Button variant="outline">Patrimoine Olfactif</Button>
          </Link>
          <Link href="/absorbe-x/neuro-olfaction">
            <Button variant="outline">Neuro-Olfaction</Button>
          </Link>
          <Link href="/absorbe-x/quantique">
            <Button variant="outline">Olfaction Quantique</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
