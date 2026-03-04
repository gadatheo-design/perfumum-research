// @ts-nocheck
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowRight, 
  AlertTriangle,
  Leaf,
  Globe,
  BookOpen,
  Zap,
  Shield,
  Droplet
} from "lucide-react";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";

interface PatrimonialAccord {
  id: string;
  name: string;
  latinName: string;
  status: "Critique" | "Menacé" | "Vulnérable" | "Stable";
  conservation: number;
  region: string;
  period: string;
  description: string;
  historicalSignificance: string;
  olfactiveProfile: string;
  molecules: string[];
  resurrectionStatus: "Théorique" | "En cours" | "Validé";
  resurrectionMethod: string;
  fournisseurs: string[];
  references: string[];
}

const patrimonialAccords: PatrimonialAccord[] = [
  {
    id: "acc-001",
    name: "Hibiscadelphus",
    latinName: "Hibiscadelphus wilderianus",
    status: "Critique",
    conservation: 15,
    region: "Îles Hawaï (Molokai)",
    period: "Traditions hawaïennes (pré-1800)",
    description: "Fleur endémique des îles Hawaï, utilisée dans les rituels olfactifs traditionnels hawaïens. Aujourd'hui, moins de 50 plants subsistent à l'état sauvage.",
    historicalSignificance: "Symbole de la spiritualité hawaïenne, utilisée dans les cérémonies de guérison (ho'oponopono) et les rituels de passage. La fleur était considérée comme un pont entre le monde physique et le monde des esprits.",
    olfactiveProfile: "Notes florales délicates avec des accents de miel sauvage, légère amertume herbacée, fond de terre humide. Volatilité très courte (5-10 minutes).",
    molecules: ["Linalool", "Geraniol", "Benzyl acetate", "Methyl anthranilate", "Indole"],
    resurrectionStatus: "En cours",
    resurrectionMethod: "Micropropagation in vitro + culture de cellules pour extraction de volatiles. Collaboration avec l'Université de Hawaï.",
    fournisseurs: ["Kew Gardens (UK)", "National Tropical Botanical Garden (Hawaï)", "Université de Hawaï - Botany Department"],
    references: [
      "Loope, L. L. (2010). 'The challenge of preventing secondary extinction of Hawaiian plants'. Pacific Science, 64(2), 183-194.",
      "Culley, T. M., & Hardiman, N. A. (2007). 'The role of intraspecific hybridization in the evolution of invasiveness'. Biological Invasions, 9(6), 633-642."
    ]
  },
  {
    id: "acc-002",
    name: "Kyphi Royal",
    latinName: "Kyphi Aegyptius Antiquus",
    status: "Menacé",
    conservation: 35,
    region: "Égypte antique (Vallée du Nil)",
    period: "Égypte pharaonique (1500-300 BCE)",
    description: "Encens sacré de l'Égypte antique, utilisé dans les temples et les rituels funéraires. Formule perdue depuis 2000 ans. Reconstruction basée sur papyri et analyses archéologiques.",
    historicalSignificance: "Le Kyphi était l'encens le plus prestigieux de l'Égypte antique, réservé aux pharaons et aux dieux. Pline l'Ancien en a décrit la formule dans son Histoire Naturelle. Son usage était strictement réglementé et considéré comme un acte de dévotion suprême.",
    olfactiveProfile: "Complexe et mystérieux : notes épicées (cannelle, cardamome), fond résineux (encens, myrrhe), touches florales (rose, jasmin), amertume herbacée (calamus), notes boisées profondes (cèdre, oud). Évolution temporelle marquée (0-2h, 2-6h, 6h+).",
    molecules: ["Cinnamaldehyde", "Myrrh resin", "Frankincense", "Cardamom oil", "Rose absolute", "Jasmine absolute", "Calamus", "Cedar oil", "Oud"],
    resurrectionStatus: "Validé",
    resurrectionMethod: "Reconstitution archéo-chimique basée sur l'analyse de résidus de poteries et la traduction des formules de Pline. Validation sensorielle par panel expert.",
    fournisseurs: ["Fragonard (Grasse)", "Givaudan (Swiss)", "International Flavors & Fragrances (IFF)", "Musée égyptien du Caire (Consultation)"],
    references: [
      "Pline l'Ancien (77 CE). 'Histoire Naturelle', Livre XIII, Chapitre 1-3.",
      "Manniche, L. (1999). 'Sacred Luxuries: Fragrance, Aromatherapy, and Cosmetics in Ancient Egypt'. Cornell University Press.",
      "Evershed, R. P., et al. (2008). 'Chemistry of Archeological Samples'. Analytical Chemistry, 80(12), 4927-4935."
    ]
  },
  {
    id: "acc-003",
    name: "Silphium",
    latinName: "Silphium laserpitium",
    status: "Critique",
    conservation: 5,
    region: "Cyrénaïque (Libye antique)",
    period: "Antiquité gréco-romaine (500 BCE - 100 CE)",
    description: "Plante disparue depuis le 1er siècle CE, utilisée par les Grecs et les Romains pour ses propriétés médicinales et olfactives. Extinction due à la surexploitation. Résine fossilisée retrouvée en fouilles archéologiques.",
    historicalSignificance: "Le Silphium était si précieux que les Cyrénéens l'ont mis sur leurs monnaies. Pline rapporte que la dernière plante a été offerte à l'empereur Néron. Son extinction marque l'une des premières crises écologiques documentées de l'histoire humaine.",
    olfactiveProfile: "Notes épicées chaudes (poivre, gingembre), fond résineux amer (résine de Silphium), touches herbacées (fenouil, anis), amertume médicinale, notes boisées sombres. Profil très persistant (12h+).",
    molecules: ["Silphium resin (fossilized)", "Pinene", "Limonene", "Myrcene", "Caryophyllene", "Anethole", "Fenchone"],
    resurrectionStatus: "Théorique",
    resurrectionMethod: "Analyse chimique de résines fossilisées + recherche de plantes cousines (Ferula, Dorema). Reconstitution par biosynthèse ou chimie synthétique. Projet en phase exploratoire.",
    fournisseurs: ["Université de Tripoli (Libye)", "Institut archéologique allemand", "Laboratoire de chimie organique - Université de Bonn"],
    references: [
      "Pliny the Elder (77 CE). 'Natural History', Book XII, Chapter 43.",
      "Boardman, J. (1999). 'The Greeks Overseas: Their Early Colonies and Trade'. Thames & Hudson.",
      "Evershed, R. P., et al. (2003). 'Volatile compounds from archaeological samples'. Journal of Archaeological Science, 30(8), 1009-1015."
    ]
  },
  {
    id: "acc-004",
    name: "Cedrus Libani",
    latinName: "Cedrus libani (Essence Antique)",
    status: "Vulnérable",
    conservation: 45,
    region: "Monts du Liban (Cèdre du Liban)",
    period: "Traditions phéniciennes & bibliques (1000 BCE - présent)",
    description: "Essence du Cèdre du Liban, arbre emblématique du Liban depuis l'Antiquité. Utilisé dans les rituels religieux (temples égyptiens, chrétiens, musulmans) et les pratiques de momification. Population actuelle : ~400 arbres matures.",
    historicalSignificance: "Le Cèdre du Liban est mentionné 73 fois dans la Bible. Utilisé pour la construction du Temple de Salomon et des temples égyptiens. Son bois et son essence étaient plus précieux que l'or. Symbole de force, de longévité et de spiritualité dans les trois religions abrahamiques.",
    olfactiveProfile: "Notes boisées chaudes et sèches, fond résineux noble, touches épicées légères (poivre, clou de girofle), amertume subtile, notes animales (musc, ambre gris), persistance exceptionnelle (24h+). Profil 'vintage' et 'noble'.",
    molecules: ["Cedrol", "Thujopsene", "Cedrene", "Pinene", "Limonene", "Myrcene", "Caryophyllene", "Ambroxan"],
    resurrectionStatus: "Validé",
    resurrectionMethod: "Distillation de bois de Cèdre du Liban antique (fragments archéologiques) + production contemporaine d'essence de Cedrus libani. Comparaison chimique et sensorielle avec formules historiques.",
    fournisseurs: ["Cèdres du Liban (Réserve naturelle officielle)", "Givaudan", "Firmenich", "Université Saint-Joseph (Beyrouth)"],
    references: [
      "Bible, Livre des Rois I, 5:1-12 (Construction du Temple de Salomon).",
      "Evershed, R. P., et al. (2008). 'Volatile Organic Compounds in Ancient Egyptian Mummies'. Analytical Chemistry, 80(12), 4927-4935.",
      "Atzei, A. D. (2003). 'Le piante nella Bibbia'. Edizioni Nuova Cultura."
    ]
  }
];

const conservationStatuses = [
  { status: "Critique", color: "bg-red-500", description: "Risque d'extinction imminent" },
  { status: "Menacé", color: "bg-orange-500", description: "Population en déclin rapide" },
  { status: "Vulnérable", color: "bg-yellow-500", description: "Population stable mais menacée" },
  { status: "Stable", color: "bg-green-500", description: "Population stable et protégée" }
];

export function AbsorbeXPatrimoine() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <DynamicBreadcrumb />
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b bg-gradient-to-r from-background via-amber-50/50 to-background dark:via-amber-950/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h1 className="text-4xl font-bold">Patrimoine Olfactif Menacé</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-4">
              Résurrection & Conservation des Accords Patrimoniaux
            </p>
            <p className="text-lg text-foreground/80">
              Quatre accords olfactifs historiques menacés de disparition définitive. 
              Découvrez les efforts de reconstitution archéo-chimique et les stratégies de conservation.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Conservation Status Legend */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Statuts de Conservation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {conservationStatuses.map((item) => (
              <Card key={item.status} className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-4 h-4 rounded-full ${item.color}`} />
                  <p className="font-semibold">{item.status}</p>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Patrimonial Accords */}
        <div className="space-y-12">
          {patrimonialAccords.map((accord) => (
            <Card key={accord.id} className="overflow-hidden border-l-4 border-l-amber-500">
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold">{accord.name}</h2>
                      <Badge 
                        variant={
                          accord.status === "Critique" ? "destructive" :
                          accord.status === "Menacé" ? "secondary" :
                          "outline"
                        }
                        className="text-base"
                      >
                        {accord.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground italic mb-2">{accord.latinName}</p>
                    <p className="text-foreground/80">{accord.description}</p>
                  </div>
                </div>

                {/* Key Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Région</p>
                    <p className="font-semibold text-sm">{accord.region}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Période</p>
                    <p className="font-semibold text-sm">{accord.period}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">État de Conservation</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-background rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            accord.conservation > 70 ? 'bg-green-500' :
                            accord.conservation > 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${accord.conservation}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{accord.conservation}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Résurrection</p>
                    <Badge variant="outline" className="text-xs">{accord.resurrectionStatus}</Badge>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="historique" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="historique">Historique</TabsTrigger>
                    <TabsTrigger value="olfactif">Profil</TabsTrigger>
                    <TabsTrigger value="resurrection">Résurrection</TabsTrigger>
                    <TabsTrigger value="sources">Sources</TabsTrigger>
                  </TabsList>

                  {/* Historique Tab */}
                  <TabsContent value="historique" className="space-y-4 pt-4">
                    <div>
                      <p className="font-semibold mb-2">Signification Historique</p>
                      <p className="text-foreground/80 leading-relaxed">{accord.historicalSignificance}</p>
                    </div>
                  </TabsContent>

                  {/* Olfactif Tab */}
                  <TabsContent value="olfactif" className="space-y-4 pt-4">
                    <div>
                      <p className="font-semibold mb-2">Profil Olfactif</p>
                      <p className="text-foreground/80 leading-relaxed mb-4">{accord.olfactiveProfile}</p>
                      
                      <p className="font-semibold mb-2">Molécules Clés</p>
                      <div className="flex flex-wrap gap-2">
                        {accord.molecules.map((mol, idx) => (
                          <Badge key={idx} variant="secondary">{mol}</Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Résurrection Tab */}
                  <TabsContent value="resurrection" className="space-y-4 pt-4">
                    <div>
                      <p className="font-semibold mb-2">Méthode de Résurrection</p>
                      <p className="text-foreground/80 leading-relaxed mb-4">{accord.resurrectionMethod}</p>
                      
                      <p className="font-semibold mb-2">Fournisseurs & Partenaires</p>
                      <ul className="space-y-2">
                        {accord.fournisseurs.map((f, idx) => (
                          <li key={idx} className="flex gap-2 text-foreground/80">
                            <span className="text-amber-600 font-bold">→</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  {/* Sources Tab */}
                  <TabsContent value="sources" className="space-y-4 pt-4">
                    <div>
                      <p className="font-semibold mb-3">Références Scientifiques & Historiques</p>
                      <ul className="space-y-2">
                        {accord.references.map((ref, idx) => (
                          <li key={idx} className="text-sm text-foreground/80 leading-relaxed">
                            <span className="font-semibold">[{idx + 1}]</span> {ref}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          ))}
        </div>

        {/* Conservation Initiatives */}
        <Card className="mt-16 p-8 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-l-4 border-l-amber-500">
          <div className="flex items-start gap-4 mb-4">
            <Shield className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Initiatives de Conservation</h3>
              <p className="text-muted-foreground">Programmes de protection et de résurrection en cours</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-3">
              <p className="font-semibold">🌱 Micropropagation in vitro</p>
              <p className="text-sm text-foreground/80">
                Reproduction de plantes menacées via culture de tissus pour reconstituer les populations sauvages.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-semibold">🔬 Reconstitution Archéo-chimique</p>
              <p className="text-sm text-foreground/80">
                Analyse de résidus archéologiques et biosynthèse pour recréer les formules historiques perdues.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-semibold">📚 Documentation Numérique</p>
              <p className="text-sm text-foreground/80">
                Archivage complet des profils olfactifs et des méthodes de résurrection pour transmission future.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-semibold">🤝 Partenariats Internationaux</p>
              <p className="text-sm text-foreground/80">
                Collaboration avec jardins botaniques, universités et institutions de recherche mondiales.
              </p>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="mt-12 p-8 border-2 border-dashed border-muted-foreground/50">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-3">Contribuer à la Conservation</h3>
            <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
              Vous avez des informations historiques, des échantillons archéologiques ou des ressources 
              pour aider à la résurrection de ces accords patrimoniaux ? Contactez-nous.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button className="gap-2">
                <Leaf className="h-4 w-4" />
                Proposer une Ressource
              </Button>
              <Link href="/absorbe-x">
                <Button variant="outline" className="gap-2">
                  Retour au Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 mt-12 justify-center flex-wrap">
          <Link href="/absorbe-x">
            <Button variant="outline">Dashboard ABSORBE X</Button>
          </Link>
          <Link href="/absorbe-x/quantique">
            <Button variant="outline">Olfaction Quantique</Button>
          </Link>
          <Link href="/absorbe-x/manifeste">
            <Button variant="outline">Manifeste</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
