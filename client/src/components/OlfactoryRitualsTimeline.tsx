import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  History, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Flame,
  Crown,
  Church,
  Sparkles,
  Heart,
  BookOpen
} from "lucide-react";

// Données des rituels olfactifs historiques
const OLFACTORY_RITUALS = [
  {
    id: "egypt-kyphi",
    period: "3000 av. J.-C.",
    year: -3000,
    title: "Le Kyphi égyptien",
    civilization: "Égypte ancienne",
    location: "Vallée du Nil",
    icon: Crown,
    color: "#f59e0b", // amber
    description: "Parfum sacré composé de 16 ingrédients, brûlé au coucher du soleil dans les temples pour accompagner le dieu Rê dans son voyage nocturne.",
    ingredients: ["Myrrhe", "Encens", "Mastic", "Cannelle", "Cardamome", "Safran", "Miel", "Vin"],
    memoryRole: "Création d'un espace-temps sacré, ancrage de la mémoire collective religieuse",
    modernRelevance: "Base de nombreux parfums orientaux contemporains",
    sources: ["Papyrus Ebers", "Temple d'Edfou"]
  },
  {
    id: "mesopotamia-incense",
    period: "2500 av. J.-C.",
    year: -2500,
    title: "Encensement mésopotamien",
    civilization: "Mésopotamie",
    location: "Babylone, Ur",
    icon: Flame,
    color: "#ef4444", // red
    description: "Les prêtres babyloniens brûlaient de l'encens pour communiquer avec les dieux et interpréter les présages dans la fumée.",
    ingredients: ["Encens", "Cèdre", "Cyprès", "Myrrhe"],
    memoryRole: "Divination et communication divine, mémoire des présages",
    modernRelevance: "Origine de l'encensement dans les religions abrahamiques",
    sources: ["Tablettes cunéiformes", "Code d'Hammurabi"]
  },
  {
    id: "india-agarbatti",
    period: "1500 av. J.-C.",
    year: -1500,
    title: "Agarbatti védique",
    civilization: "Inde védique",
    location: "Sous-continent indien",
    icon: Sparkles,
    color: "#8b5cf6", // violet
    description: "L'encens (dhoop) était utilisé dans les rituels védiques pour purifier l'espace et faciliter la méditation et la connexion spirituelle.",
    ingredients: ["Santal", "Jasmin", "Vétiver", "Patchouli", "Camphre"],
    memoryRole: "États méditatifs, transmission des mantras, mémoire spirituelle",
    modernRelevance: "Aromathérapie moderne, méditation guidée par les odeurs",
    sources: ["Rigveda", "Atharvaveda"]
  },
  {
    id: "greece-thymiama",
    period: "800 av. J.-C.",
    year: -800,
    title: "Thymiama grec",
    civilization: "Grèce antique",
    location: "Delphes, Athènes",
    icon: Church,
    color: "#06b6d4", // cyan
    description: "Offrandes parfumées aux dieux olympiens. La Pythie de Delphes inhalait des vapeurs pour entrer en transe prophétique.",
    ingredients: ["Laurier", "Encens", "Myrrhe", "Styrax"],
    memoryRole: "États de conscience modifiés, prophétie, mémoire oraculaire",
    modernRelevance: "Concept de parfum comme pont vers le divin",
    sources: ["Homère", "Hérodote", "Plutarque"]
  },
  {
    id: "rome-unguentum",
    period: "100 av. J.-C.",
    year: -100,
    title: "Unguentum romain",
    civilization: "Rome antique",
    location: "Rome, Pompéi",
    icon: Crown,
    color: "#ec4899", // pink
    description: "Les Romains utilisaient des onguents parfumés pour les bains, les banquets et les funérailles, créant des marqueurs olfactifs sociaux.",
    ingredients: ["Rose", "Nard", "Safran", "Cinnamome", "Baume"],
    memoryRole: "Marqueurs de statut social, mémoire des défunts, identité collective",
    modernRelevance: "Parfumerie de luxe, rituels funéraires parfumés",
    sources: ["Pline l'Ancien", "Fresques de Pompéi"]
  },
  {
    id: "judaism-ketoret",
    period: "950 av. J.-C.",
    year: -950,
    title: "Ketoret du Temple",
    civilization: "Judaïsme",
    location: "Jérusalem",
    icon: Church,
    color: "#10b981", // emerald
    description: "Encens sacré du Temple de Jérusalem composé de 11 ingrédients, brûlé quotidiennement sur l'autel d'or.",
    ingredients: ["Stacté", "Onyx", "Galbanum", "Encens pur", "Myrrhe", "Cassia", "Nard", "Safran", "Costus", "Écorce aromatique", "Cannelle"],
    memoryRole: "Prière montant vers Dieu, mémoire de l'Alliance, unité du peuple",
    modernRelevance: "Symbolisme de l'encens dans le judaïsme et le christianisme",
    sources: ["Exode 30:34-38", "Talmud"]
  },
  {
    id: "christianity-incense",
    period: "300 apr. J.-C.",
    year: 300,
    title: "Encensement chrétien",
    civilization: "Christianisme",
    location: "Byzance, Rome",
    icon: Church,
    color: "#6366f1", // indigo
    description: "L'encens symbolise les prières montant vers Dieu. Utilisé dans la liturgie pour sanctifier l'espace et les fidèles.",
    ingredients: ["Oliban", "Myrrhe", "Benjoin", "Storax"],
    memoryRole: "Sacralisation de l'espace, mémoire liturgique, communion des saints",
    modernRelevance: "Liturgie catholique et orthodoxe, parfums d'église",
    sources: ["Apocalypse 8:3-4", "Pères de l'Église"]
  },
  {
    id: "islam-bakhoor",
    period: "700 apr. J.-C.",
    year: 700,
    title: "Bakhoor islamique",
    civilization: "Islam",
    location: "Arabie, Perse",
    icon: Flame,
    color: "#14b8a6", // teal
    description: "Copeaux de bois parfumés brûlés pour accueillir les invités, parfumer les vêtements et créer une atmosphère de piété.",
    ingredients: ["Oud", "Ambre", "Musc", "Rose", "Safran"],
    memoryRole: "Hospitalité, préparation à la prière, mémoire du Paradis",
    modernRelevance: "Parfumerie du Golfe, oud dans la parfumerie de luxe",
    sources: ["Hadiths", "Poésie arabe classique"]
  },
  {
    id: "japan-kodo",
    period: "600 apr. J.-C.",
    year: 600,
    title: "Kōdō japonais",
    civilization: "Japon",
    location: "Kyoto, Nara",
    icon: Sparkles,
    color: "#f97316", // orange
    description: "La 'Voie de l'Encens' - art raffiné d'apprécier les parfums du bois d'agar, élevé au rang de pratique spirituelle.",
    ingredients: ["Jinko (agar)", "Byakudan (santal)", "Clou de girofle", "Cannelle"],
    memoryRole: "Méditation, appréciation esthétique, mémoire sensorielle cultivée",
    modernRelevance: "Mindfulness olfactive, appréciation consciente des parfums",
    sources: ["Genji Monogatari", "Écoles Shino et Oie"]
  },
  {
    id: "medieval-pomander",
    period: "1300 apr. J.-C.",
    year: 1300,
    title: "Pomander médiéval",
    civilization: "Europe médiévale",
    location: "France, Italie, Angleterre",
    icon: Heart,
    color: "#a855f7", // purple
    description: "Boules parfumées portées pour se protéger des miasmes et de la peste, créant une bulle olfactive personnelle.",
    ingredients: ["Ambre gris", "Musc", "Civette", "Clou de girofle", "Orange"],
    memoryRole: "Protection contre la maladie, marqueur de statut, mémoire de la mortalité",
    modernRelevance: "Parfums personnels, concept de sillage",
    sources: ["Traités médicaux médiévaux", "Inventaires royaux"]
  },
  {
    id: "grasse-perfumery",
    period: "1700 apr. J.-C.",
    year: 1700,
    title: "Parfumerie de Grasse",
    civilization: "France moderne",
    location: "Grasse, Provence",
    icon: Crown,
    color: "#84cc16", // lime
    description: "Naissance de la parfumerie moderne avec le développement des techniques d'extraction et la culture des fleurs à parfum.",
    ingredients: ["Rose", "Jasmin", "Tubéreuse", "Lavande", "Fleur d'oranger"],
    memoryRole: "Identité olfactive personnelle, mémoire de Proust, patrimoine immatériel",
    modernRelevance: "Industrie mondiale de la parfumerie, savoir-faire UNESCO",
    sources: ["Archives de Grasse", "Traités de parfumerie"]
  },
  {
    id: "modern-aromatherapy",
    period: "1930 apr. J.-C.",
    year: 1930,
    title: "Aromathérapie moderne",
    civilization: "Occident contemporain",
    location: "France, monde",
    icon: Heart,
    color: "#22c55e", // green
    description: "René-Maurice Gattefossé fonde l'aromathérapie scientifique après avoir découvert les propriétés cicatrisantes de la lavande.",
    ingredients: ["Lavande", "Tea tree", "Eucalyptus", "Menthe poivrée", "Romarin"],
    memoryRole: "Bien-être psychologique, ancrage émotionnel, thérapie par les odeurs",
    modernRelevance: "Aromathérapie clinique, neuromarketing olfactif",
    sources: ["Gattefossé (1937)", "Recherches contemporaines"]
  }
];

interface OlfactoryRitualsTimelineProps {
  onRitualClick?: (ritualId: string) => void;
  highlightedRitual?: string;
}

export default function OlfactoryRitualsTimeline({ 
  onRitualClick,
  highlightedRitual 
}: OlfactoryRitualsTimelineProps) {
  const [selectedRitual, setSelectedRitual] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeRitual = selectedRitual 
    ? OLFACTORY_RITUALS.find(r => r.id === selectedRitual) 
    : null;

  const handleRitualClick = (ritualId: string) => {
    setSelectedRitual(selectedRitual === ritualId ? null : ritualId);
    onRitualClick?.(ritualId);
  };

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Titre */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <History className="h-5 w-5 text-amber-500" />
            Chronologie des rituels olfactifs
          </h3>
          <p className="text-sm text-muted-foreground">
            5000 ans d'utilisation des parfums dans les rituels de mémoire
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => scrollTimeline('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => scrollTimeline('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Timeline horizontale */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {/* Ligne de temps */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/20 via-purple-500/40 to-emerald-500/20 transform -translate-y-1/2 z-0" />
            
            {/* Conteneur scrollable */}
            <ScrollArea className="w-full" ref={scrollRef}>
              <div className="flex gap-4 p-6 min-w-max">
                {OLFACTORY_RITUALS.map((ritual, index) => {
                  const isSelected = selectedRitual === ritual.id;
                  const isHighlighted = highlightedRitual === ritual.id;
                  const Icon = ritual.icon;

                  return (
                    <div
                      key={ritual.id}
                      className="flex flex-col items-center relative"
                      style={{ minWidth: "140px" }}
                    >
                      {/* Marqueur sur la ligne */}
                      <div 
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center cursor-pointer
                          transition-all duration-300 z-10 border-2
                          ${isSelected || isHighlighted 
                            ? 'scale-110 shadow-lg' 
                            : 'hover:scale-105'
                          }
                        `}
                        style={{ 
                          backgroundColor: ritual.color + "20",
                          borderColor: isSelected || isHighlighted ? ritual.color : ritual.color + "40"
                        }}
                        onClick={() => handleRitualClick(ritual.id)}
                      >
                        <Icon 
                          className="h-5 w-5" 
                          style={{ color: ritual.color }}
                        />
                      </div>

                      {/* Période */}
                      <div className="mt-3 text-center">
                        <p 
                          className="text-xs font-semibold"
                          style={{ color: ritual.color }}
                        >
                          {ritual.period}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-[120px] line-clamp-2">
                          {ritual.title}
                        </p>
                        <Badge 
                          variant="outline" 
                          className="mt-2 text-[10px]"
                        >
                          {ritual.civilization}
                        </Badge>
                      </div>

                      {/* Connecteur vers le bas pour le rituel sélectionné */}
                      {isSelected && (
                        <div 
                          className="absolute top-full left-1/2 w-0.5 h-4 -translate-x-1/2"
                          style={{ backgroundColor: ritual.color }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Détails du rituel sélectionné */}
      {activeRitual ? (
        <Card style={{ borderColor: activeRitual.color + "40" }}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: activeRitual.color + "20" }}
                >
                  <activeRitual.icon 
                    className="h-6 w-6" 
                    style={{ color: activeRitual.color }}
                  />
                </div>
                <div>
                  <CardTitle>{activeRitual.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3" />
                    {activeRitual.location} • {activeRitual.period}
                  </CardDescription>
                </div>
              </div>
              <Badge style={{ backgroundColor: activeRitual.color + "20", color: activeRitual.color }}>
                {activeRitual.civilization}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {activeRitual.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ingrédients */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  Ingrédients principaux
                </h4>
                <div className="flex flex-wrap gap-1">
                  {activeRitual.ingredients.map((ingredient, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Rôle mémoriel */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Rôle dans la mémoire collective
                </h4>
                <p className="text-sm text-muted-foreground">
                  {activeRitual.memoryRole}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              {/* Pertinence moderne */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500" />
                  Pertinence aujourd'hui
                </h4>
                <p className="text-sm text-muted-foreground">
                  {activeRitual.modernRelevance}
                </p>
              </div>

              {/* Sources */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  Sources historiques
                </h4>
                <div className="flex flex-wrap gap-1">
                  {activeRitual.sources.map((source, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-amber-500/5 to-purple-500/5">
          <CardContent className="p-6 text-center">
            <History className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h4 className="font-semibold text-muted-foreground mb-2">
              Explorez l'histoire des rituels olfactifs
            </h4>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Cliquez sur un point de la chronologie pour découvrir comment les civilisations 
              ont utilisé les parfums pour créer des ancrages mémoriels collectifs.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Synthèse */}
      <Card className="bg-gradient-to-r from-purple-500/5 to-amber-500/5 border-purple-500/20">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-500" />
            Constantes à travers les civilisations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Badge className="bg-amber-500/20 text-amber-600">
                Sacralisation
              </Badge>
              <p className="text-sm text-muted-foreground">
                Les parfums créent un espace-temps sacré, séparé du quotidien.
              </p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-purple-500/20 text-purple-600">
                Transmission
              </Badge>
              <p className="text-sm text-muted-foreground">
                Les odeurs rituelles transmettent la mémoire collective entre générations.
              </p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-emerald-500/20 text-emerald-600">
                Transformation
              </Badge>
              <p className="text-sm text-muted-foreground">
                Les parfums facilitent les états de conscience modifiés et les transitions.
              </p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-rose-500/20 text-rose-600">
                Communion
              </Badge>
              <p className="text-sm text-muted-foreground">
                L'odeur partagée crée un lien entre les participants et avec le divin.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
