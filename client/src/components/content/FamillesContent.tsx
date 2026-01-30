import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";

/**
 * FamillesContent - The core content of the families page
 * 
 * This component contains all the functionality of the Familles page
 * but without the Header/Footer wrapper, making it embeddable in
 * the consolidated MoleculesHub page.
 */
export function FamillesContent() {
  const families = [
    {
      name: "Bio-Mineralis",
      type: "biomineralis",
      slug: "bio-mineralis",
      description: "Famille explorant l'intersection entre le vivant et le minéral, articulant matières organiques fossilisées et textures pierreuses.",
      accords: ["Os + Pluie", "Cuir Fossilisé", "Os Carbonisé", "Pétrichor Anthropique", "Sève/Chair/Roche", "Nécro-Géo Sacré"],
      variationCount: 6,
      color: "bg-bio-mineralis",
      linkPath: "/gammes/biolab",
    },
    {
      name: "Pétrichor",
      type: "petrichor",
      slug: "petrichor",
      description: "Odeur de la terre mouillée après la pluie. 60 variations explorant différents types de sols, climats et temporalités.",
      accords: ["Pétrichor Clair", "Pétrichor Noir", "Argile Humide", "Bois Humide", "Racine", "Mousse", "Désert", "Marin", "Glaciaire", "Urbain", "Sacré"],
      variationCount: 60,
      color: "bg-petrichor text-white",
      linkPath: "/gammes/petrichor",
    },
    {
      name: "Volcanique",
      type: "volcanique",
      slug: "volcanique",
      description: "Famille minérale évoquant les phénomènes tectoniques et volcaniques. 36 variations de basalte, soufre, vapeur et poussière.",
      accords: ["Basalte Chaud", "Basalte Froid", "Vapeur", "Soufre", "Poussière Tectonique", "Magma Blanc", "Pierre Poreuse"],
      variationCount: 36,
      color: "bg-volcanique text-white",
      linkPath: "/gammes/volcanique",
    },
    {
      name: "Solar-Mineralis",
      type: "solarmineralis",
      slug: "solar-mineralis",
      description: "Famille articulant chaleur solaire et minéralité. Exploration des pierres chauffées, sables brûlants et cristaux lumineux.",
      accords: ["Pierre Solaire", "Sable Chaud", "Cristal Lumineux", "Sel Solaire"],
      variationCount: 12,
      color: "bg-solar-mineralis",
      linkPath: "/recettes?category=Solar-Mineralis",
    },
    {
      name: "Série Perfumeum 12",
      type: "perfumeum12",
      slug: "perfumeum-12",
      description: "Collection de 12 compositions atmosphériques autonomes explorant différentes qualités sensibles et conceptuelles.",
      accords: ["Composition 1", "Composition 2", "Composition 3", "..."],
      variationCount: 12,
      color: "bg-primary text-white",
      linkPath: "/recettes?category=Perfumeum",
    },
    {
      name: "Nécro-Géo Sacré",
      type: "necrogeo",
      slug: "necro-geo-sacre",
      description: "Famille explorant les dimensions funéraires, géologiques et sacrées de l'olfaction. Articulation entre mort, terre et rituel.",
      accords: ["Terre Funéraire", "Résine Sacrée", "Cendre Rituelle", "Myrrhe Noire"],
      variationCount: 8,
      color: "bg-foreground text-background",
      linkPath: "/recettes?category=Nécro-Géo",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground">
          Les familles olfactives PERFUMUM organisent les compositions selon leurs caractéristiques 
          sensorielles et conceptuelles. Chaque famille représente un territoire olfactif distinct 
          avec ses propres accords et variations.
        </p>
      </div>

      {/* Families Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {families.map((family) => (
          <Card key={family.slug} className="group hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className={family.color}>
                  {family.variationCount} variations
                </Badge>
              </div>
              <CardTitle className="text-xl mt-2">{family.name}</CardTitle>
              <CardDescription>{family.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Accords Preview */}
                <div className="flex flex-wrap gap-1">
                  {family.accords.slice(0, 4).map((accord) => (
                    <Badge key={accord} variant="outline" className="text-xs">
                      {accord}
                    </Badge>
                  ))}
                  {family.accords.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{family.accords.length - 4}
                    </Badge>
                  )}
                </div>

                {/* Link */}
                <Link href={family.linkPath}>
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-accent">
                    Explorer
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">
                {families.length}
              </div>
              <div className="text-sm text-muted-foreground">Familles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">
                {families.reduce((acc, f) => acc + f.variationCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Variations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">
                {families.reduce((acc, f) => acc + f.accords.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Accords</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground">Possibilités</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FamillesContent;
