import { useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Download, X, Leaf } from "lucide-react";

interface BotanicalImage {
  id: number;
  name: string;
  latinName: string;
  commonName: string;
  description: string;
  imagePath: string;
  family: string;
}

const BOTANICAL_IMAGES: BotanicalImage[] = [
  {
    id: 1,
    name: "Myrcène",
    latinName: "Humulus lupulus",
    commonName: "Houblon",
    description: "Plante grimpante vivace de la famille des Cannabaceae, cultivée pour ses cônes aromatiques utilisés dans le brassage de la bière. Riche en myrcène, elle possède des propriétés sédatives et relaxantes.",
    imagePath: "/images/terpenes/myrcene-botanical.png",
    family: "Cannabaceae"
  },
  {
    id: 2,
    name: "Limonène",
    latinName: "Citrus limon",
    commonName: "Citronnier",
    description: "Arbuste fruitier de la famille des Rutaceae, cultivé pour ses fruits acides riches en vitamine C. Le zeste contient de fortes concentrations de limonène, terpène aux propriétés antioxydantes et stimulantes.",
    imagePath: "/images/terpenes/limonene-botanical.png",
    family: "Rutaceae"
  },
  {
    id: 3,
    name: "α-Pinène",
    latinName: "Pinus sylvestris",
    commonName: "Pin sylvestre",
    description: "Conifère de la famille des Pinaceae, caractérisé par son écorce orangée et ses longues aiguilles. La résine et les aiguilles sont riches en pinène, terpène aux propriétés bronchodilatatrices et anti-inflammatoires.",
    imagePath: "/images/terpenes/pinene-botanical.png",
    family: "Pinaceae"
  },
  {
    id: 4,
    name: "β-Pinène",
    latinName: "Petroselinum crispum",
    commonName: "Persil frisé",
    description: "Plante herbacée bisannuelle de la famille des Apiaceae, cultivée comme aromate culinaire. Les feuilles et tiges contiennent du β-pinène, contribuant à son arôme frais et ses propriétés digestives.",
    imagePath: "/images/terpenes/beta-pinene-botanical.png",
    family: "Apiaceae"
  },
  {
    id: 5,
    name: "β-Caryophyllène",
    latinName: "Piper nigrum",
    commonName: "Poivrier noir",
    description: "Liane ligneuse de la famille des Piperaceae, cultivée pour ses baies séchées (poivre). Le β-caryophyllène confère au poivre son piquant caractéristique et possède de puissantes propriétés anti-inflammatoires.",
    imagePath: "/images/terpenes/caryophyllene-botanical.png",
    family: "Piperaceae"
  },
  {
    id: 6,
    name: "Linalool",
    latinName: "Lavandula angustifolia",
    commonName: "Lavande vraie",
    description: "Sous-arbrisseau vivace de la famille des Lamiaceae, cultivé pour ses fleurs aromatiques. Le linalool est le principal composant de l'huile essentielle de lavande, reconnue pour ses propriétés calmantes et anxiolytiques.",
    imagePath: "/images/terpenes/linalool-botanical.png",
    family: "Lamiaceae"
  },
  {
    id: 7,
    name: "Humulène",
    latinName: "Zingiber officinale",
    commonName: "Gingembre",
    description: "Plante herbacée tropicale de la famille des Zingiberaceae, cultivée pour son rhizome aromatique. L'humulène contribue aux notes épicées du gingembre et possède des propriétés anti-inflammatoires et antibactériennes.",
    imagePath: "/images/terpenes/humulene-botanical.png",
    family: "Zingiberaceae"
  }
];

export default function GalerieBotaniques() {
  const [selectedImage, setSelectedImage] = useState<BotanicalImage | null>(null);
  
  const handleDownload = (image: BotanicalImage) => {
    const link = document.createElement('a');
    link.href = image.imagePath;
    link.download = `${image.latinName.replace(' ', '_')}_botanical.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Galerie Botanique</h1>
            <p className="text-muted-foreground">
              Collection d'illustrations scientifiques des plantes sources des 7 terpènes principaux
            </p>
          </div>
          
          <Link href="/resines-cbd">
            <Button variant="outline">Retour aux Résines CBD</Button>
          </Link>
        </div>
        
        {/* Grid des images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BOTANICAL_IMAGES.map((image) => (
            <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div 
                className="relative aspect-square cursor-pointer bg-muted/20"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.imagePath}
                  alt={`${image.latinName} - ${image.commonName}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">{image.name}</Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <span className="italic">{image.latinName}</span>
                  </div>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{image.commonName}</p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm line-clamp-3">{image.description}</p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{image.family}</Badge>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDownload(image)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Informations supplémentaires */}
        <Card>
          <CardHeader>
            <CardTitle>À propos de cette collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Ces illustrations botaniques ont été créées dans un style scientifique pour illustrer les principales plantes sources des terpènes étudiés dans le cadre du projet PERFUMUM.
            </p>
            <p>
              Chaque image présente la plante dans son intégralité ou ses parties caractéristiques (fleurs, fruits, feuilles, rhizomes) permettant une identification botanique précise.
            </p>
            <p>
              Les images sont disponibles en haute résolution pour un usage dans vos documents de recherche, présentations ou supports pédagogiques.
            </p>
          </CardContent>
        </Card>
      </main>
      
      {/* Lightbox */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold italic">{selectedImage.latinName}</h2>
                  <p className="text-muted-foreground">{selectedImage.commonName}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="bg-muted/20 rounded-lg p-4">
                <img
                  src={selectedImage.imagePath}
                  alt={`${selectedImage.latinName} - ${selectedImage.commonName}`}
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge>{selectedImage.name}</Badge>
                  <Badge variant="outline">{selectedImage.family}</Badge>
                </div>
                
                <p className="text-sm leading-relaxed">{selectedImage.description}</p>
                
                <div className="flex gap-2">
                  <Button onClick={() => handleDownload(selectedImage)}>
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger en haute résolution
                  </Button>
                  <Link href={`/terpene/${selectedImage.id}`}>
                    <Button variant="outline">
                      Voir la fiche {selectedImage.name}
                    </Button>
                  </Link>
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
