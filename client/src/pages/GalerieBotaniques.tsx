import { useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, X, Leaf, Flower2, Sun, Wind } from "lucide-react";

interface BotanicalImage {
  id: number;
  name: string;
  latinName: string;
  commonName: string;
  description: string;
  imagePath: string;
  family: string;
  category?: "terpene" | "tagetes" | "san-andres";
  climaticAxis?: string;
  molecules?: string[];
}

const BOTANICAL_IMAGES: BotanicalImage[] = [
  // Terpènes principaux
  {
    id: 1,
    name: "Myrcène",
    latinName: "Humulus lupulus",
    commonName: "Houblon",
    description: "Plante grimpante vivace de la famille des Cannabaceae, cultivée pour ses cônes aromatiques utilisés dans le brassage de la bière. Riche en myrcène, elle possède des propriétés sédatives et relaxantes.",
    imagePath: "/images/terpenes/myrcene-botanical.png",
    family: "Cannabaceae",
    category: "terpene"
  },
  {
    id: 2,
    name: "Limonène",
    latinName: "Citrus limon",
    commonName: "Citronnier",
    description: "Arbuste fruitier de la famille des Rutaceae, cultivé pour ses fruits acides riches en vitamine C. Le zeste contient de fortes concentrations de limonène, terpène aux propriétés antioxydantes et stimulantes.",
    imagePath: "/images/terpenes/limonene-botanical.png",
    family: "Rutaceae",
    category: "terpene"
  },
  {
    id: 3,
    name: "α-Pinène",
    latinName: "Pinus sylvestris",
    commonName: "Pin sylvestre",
    description: "Conifère de la famille des Pinaceae, caractérisé par son écorce orangée et ses longues aiguilles. La résine et les aiguilles sont riches en pinène, terpène aux propriétés bronchodilatatrices et anti-inflammatoires.",
    imagePath: "/images/terpenes/pinene-botanical.png",
    family: "Pinaceae",
    category: "terpene"
  },
  {
    id: 4,
    name: "β-Pinène",
    latinName: "Petroselinum crispum",
    commonName: "Persil frisé",
    description: "Plante herbacée bisannuelle de la famille des Apiaceae, cultivée comme aromate culinaire. Les feuilles et tiges contiennent du β-pinène, contribuant à son arôme frais et ses propriétés digestives.",
    imagePath: "/images/terpenes/beta-pinene-botanical.png",
    family: "Apiaceae",
    category: "terpene"
  },
  {
    id: 5,
    name: "β-Caryophyllène",
    latinName: "Piper nigrum",
    commonName: "Poivrier noir",
    description: "Liane ligneuse de la famille des Piperaceae, cultivée pour ses baies séchées (poivre). Le β-caryophyllène confère au poivre son piquant caractéristique et possède de puissantes propriétés anti-inflammatoires.",
    imagePath: "/images/terpenes/caryophyllene-botanical.png",
    family: "Piperaceae",
    category: "terpene"
  },
  {
    id: 6,
    name: "Linalool",
    latinName: "Lavandula angustifolia",
    commonName: "Lavande vraie",
    description: "Sous-arbrisseau vivace de la famille des Lamiaceae, cultivé pour ses fleurs aromatiques. Le linalool est le principal composant de l'huile essentielle de lavande, reconnue pour ses propriétés calmantes et anxiolytiques.",
    imagePath: "/images/terpenes/linalool-botanical.png",
    family: "Lamiaceae",
    category: "terpene"
  },
  {
    id: 7,
    name: "Humulène",
    latinName: "Zingiber officinale",
    commonName: "Gingembre",
    description: "Plante herbacée tropicale de la famille des Zingiberaceae, cultivée pour son rhizome aromatique. L'humulène contribue aux notes épicées du gingembre et possède des propriétés anti-inflammatoires et antibactériennes.",
    imagePath: "/images/terpenes/humulene-botanical.png",
    family: "Zingiberaceae",
    category: "terpene"
  }
];

// Images dédiées à Tagetes lucida
const TAGETES_IMAGES: BotanicalImage[] = [
  {
    id: 101,
    name: "Tagetes lucida",
    latinName: "Tagetes lucida",
    commonName: "Estragon mexicain",
    description: "Illustration botanique complète de Tagetes lucida montrant la structure générale de la plante avec ses tiges dressées, ses feuilles opposées lancéolées et ses inflorescences jaune d'or caractéristiques.",
    imagePath: "/images/botanicals/tagetes-lucida-botanical.jpg",
    family: "Asteraceae",
    category: "tagetes",
    climaticAxis: "vent",
    molecules: ["Estragole (86-97%)", "Anéthole", "Méthyl-eugénol", "β-Ocimène"]
  },
  {
    id: 102,
    name: "Tagetes lucida - Plante entière",
    latinName: "Tagetes lucida",
    commonName: "Yerba Anís",
    description: "Vue d'ensemble de Tagetes lucida en floraison, montrant son port buissonnant et sa floraison abondante. Plante vivace originaire du Mexique et d'Amérique centrale, utilisée traditionnellement comme substitut de l'estragon français.",
    imagePath: "/images/botanicals/tagetes-lucida-plant.jpg",
    family: "Asteraceae",
    category: "tagetes",
    climaticAxis: "vent",
    molecules: ["Estragole (86-97%)", "Anéthole", "Méthyl-eugénol", "β-Ocimène"]
  },
  {
    id: 103,
    name: "Tagetes lucida - Fleurs",
    latinName: "Tagetes lucida",
    commonName: "Pericón",
    description: "Gros plan sur les capitules floraux de Tagetes lucida. Les fleurs jaune vif, groupées en corymbes terminaux, sont caractéristiques de cette espèce. Elles dégagent un parfum anisé intense dû à leur forte teneur en estragole.",
    imagePath: "/images/botanicals/tagetes-lucida-flowers.jpg",
    family: "Asteraceae",
    category: "tagetes",
    climaticAxis: "vent",
    molecules: ["Estragole (86-97%)", "Anéthole", "Méthyl-eugénol", "β-Ocimène"]
  },
  {
    id: 104,
    name: "Tagetes lucida - Détail",
    latinName: "Tagetes lucida",
    commonName: "Hierba de las nubes",
    description: "Détail macro des fleurs et du feuillage de Tagetes lucida. Les feuilles sont simples, opposées, lancéolées avec des glandes oléifères visibles qui contiennent l'huile essentielle riche en composés aromatiques.",
    imagePath: "/images/botanicals/tagetes-lucida-detail.jpg",
    family: "Asteraceae",
    category: "tagetes",
    climaticAxis: "vent",
    molecules: ["Estragole (86-97%)", "Anéthole", "Méthyl-eugénol", "β-Ocimène"]
  }
];

export default function GalerieBotaniques() {
  const [selectedImage, setSelectedImage] = useState<BotanicalImage | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  const handleDownload = (image: BotanicalImage) => {
    const link = document.createElement('a');
    link.href = image.imagePath;
    const extension = image.imagePath.split('.').pop() || 'jpg';
    link.download = `${image.latinName.replace(/ /g, '_')}_botanical.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allImages = [...BOTANICAL_IMAGES, ...TAGETES_IMAGES];
  
  const filteredImages = activeTab === "all" 
    ? allImages 
    : activeTab === "tagetes" 
      ? TAGETES_IMAGES 
      : BOTANICAL_IMAGES;

  const getClimaticAxisColor = (axis?: string) => {
    switch (axis) {
      case "vent": return "bg-sky-500/10 text-sky-700 border-sky-300";
      case "bois": return "bg-amber-500/10 text-amber-700 border-amber-300";
      case "disparition": return "bg-violet-500/10 text-violet-700 border-violet-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getClimaticAxisIcon = (axis?: string) => {
    switch (axis) {
      case "vent": return <Wind className="w-3 h-3" />;
      case "bois": return <Leaf className="w-3 h-3" />;
      case "disparition": return <Sun className="w-3 h-3" />;
      default: return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1 container py-6 md:py-8 space-y-6">
        {/* En-tête responsive */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Galerie Botanique</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Collection d'illustrations scientifiques des plantes sources
            </p>
          </div>
          
          <Link href="/resines-cbd">
            <Button variant="outline" size="sm" className="w-full md:w-auto">
              Retour aux Résines CBD
            </Button>
          </Link>
        </div>

        {/* Onglets de filtrage */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="all" className="text-xs md:text-sm">
              Toutes ({allImages.length})
            </TabsTrigger>
            <TabsTrigger value="tagetes" className="text-xs md:text-sm">
              <Flower2 className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Tagetes lucida ({TAGETES_IMAGES.length})
            </TabsTrigger>
            <TabsTrigger value="terpenes" className="text-xs md:text-sm">
              Terpènes ({BOTANICAL_IMAGES.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {/* Section spéciale Tagetes lucida */}
            {activeTab === "tagetes" && (
              <Card className="mb-6 border-amber-200 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Flower2 className="w-5 h-5 text-amber-600" />
                    Tagetes lucida — Estragon mexicain
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>
                    <strong>Tagetes lucida</strong> (syn. <em>Tagetes florida</em>) est une plante vivace de la famille des Asteraceae, 
                    native du Mexique et d'Amérique centrale. Connue sous les noms de <em>Pericón</em>, <em>Yerba Anís</em> ou 
                    <em>Hierba de las nubes</em>, elle est utilisée depuis l'époque précolombienne pour ses propriétés aromatiques et médicinales.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-400">Profil moléculaire</h4>
                      <ul className="text-xs space-y-1">
                        <li className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">86-97%</Badge>
                          Estragole (méthyl-chavicol)
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">trace</Badge>
                          Anéthole, Méthyl-eugénol, β-Ocimène
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-400">Axe climatique</h4>
                      <Badge className={`${getClimaticAxisColor("vent")} flex items-center gap-1 w-fit`}>
                        {getClimaticAxisIcon("vent")}
                        Vent — Coupe aérienne
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        Signature olfactive: anisé, herbacé, légèrement épicé
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Link href="/recettes?search=TL">
                      <Button variant="outline" size="sm">
                        Voir les recettes TL
                      </Button>
                    </Link>
                    <Link href="/plantes/300001">
                      <Button variant="outline" size="sm">
                        Fiche plante complète
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Grid des images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredImages.map((image) => (
                <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div 
                    className="relative aspect-square cursor-pointer bg-muted/20"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.imagePath}
                      alt={`${image.latinName} - ${image.commonName}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      <Badge variant="secondary" className="text-xs">{image.name.split(' - ')[0]}</Badge>
                      {image.climaticAxis && (
                        <Badge className={`${getClimaticAxisColor(image.climaticAxis)} text-xs flex items-center gap-1`}>
                          {getClimaticAxisIcon(image.climaticAxis)}
                          {image.climaticAxis}
                        </Badge>
                      )}
                    </div>
                    {image.category === "tagetes" && (
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-amber-500 text-white text-xs">
                          <Flower2 className="w-3 h-3 mr-1" />
                          Tagetes
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="p-3 md:p-4">
                    <CardTitle className="text-sm md:text-base">
                      <div className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="italic truncate">{image.latinName}</span>
                      </div>
                    </CardTitle>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{image.commonName}</p>
                  </CardHeader>
                  
                  <CardContent className="p-3 md:p-4 pt-0 space-y-2 md:space-y-3">
                    <p className="text-xs md:text-sm line-clamp-2 md:line-clamp-3">{image.description}</p>
                    
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">{image.family}</Badge>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-8 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(image);
                        }}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Télécharger</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Informations supplémentaires */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">À propos de cette collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs md:text-sm text-muted-foreground">
            <p>
              Ces illustrations botaniques ont été créées dans un style scientifique pour illustrer les principales plantes sources des terpènes étudiés dans le cadre du projet PERFUMUM.
            </p>
            <p>
              La collection inclut désormais une section dédiée à <strong>Tagetes lucida</strong>, plante clé du système Absorbe pour l'axe climatique "Vent", 
              avec ses 4 molécules principales (Estragole, Anéthole, Méthyl-eugénol, β-Ocimène).
            </p>
            <p>
              Les images sont disponibles en haute résolution pour un usage dans vos documents de recherche, présentations ou supports pédagogiques.
            </p>
          </CardContent>
        </Card>
      </main>
      
      {/* Lightbox responsive */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedImage && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg md:text-2xl font-bold italic truncate">{selectedImage.latinName}</h2>
                  <p className="text-sm text-muted-foreground">{selectedImage.commonName}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="flex-shrink-0"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="bg-muted/20 rounded-lg p-2 md:p-4">
                <img
                  src={selectedImage.imagePath}
                  alt={`${selectedImage.latinName} - ${selectedImage.commonName}`}
                  className="w-full h-auto max-h-[50vh] md:max-h-[60vh] object-contain"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{selectedImage.name.split(' - ')[0]}</Badge>
                  <Badge variant="outline">{selectedImage.family}</Badge>
                  {selectedImage.climaticAxis && (
                    <Badge className={`${getClimaticAxisColor(selectedImage.climaticAxis)} flex items-center gap-1`}>
                      {getClimaticAxisIcon(selectedImage.climaticAxis)}
                      {selectedImage.climaticAxis}
                    </Badge>
                  )}
                </div>

                {selectedImage.molecules && selectedImage.molecules.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Molécules principales</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedImage.molecules.map((mol, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{mol}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-sm leading-relaxed">{selectedImage.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => handleDownload(selectedImage)} size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger HD
                  </Button>
                  {selectedImage.category === "tagetes" ? (
                    <>
                      <Link href="/plantes/300001">
                        <Button variant="outline" size="sm">
                          Fiche plante
                        </Button>
                      </Link>
                      <Link href="/recettes?search=TL">
                        <Button variant="outline" size="sm">
                          Recettes TL
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link href={`/terpene/${selectedImage.id}`}>
                      <Button variant="outline" size="sm">
                        Voir la fiche {selectedImage.name}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
