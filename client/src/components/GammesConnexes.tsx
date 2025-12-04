import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Flame, Globe2, Snowflake, FlaskConical } from "lucide-react";
import { Link } from "wouter";

type GammeType = "petrichor" | "volcanique" | "civilisations" | "glaciaire" | "biolab";

interface GammeInfo {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  affinites: string;
  description: string;
}

const gammes: Record<GammeType, GammeInfo> = {
  petrichor: {
    name: "Pétrichor",
    href: "/gammes/petrichor",
    icon: Droplets,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    affinites: "Terre humide, minéralité, pluie, géosmine",
    description: "Explore la minéralité humide avec des notes de terre mouillée, pluie sur pierre et géosmine. Approche structurée de la fraîcheur minérale."
  },
  volcanique: {
    name: "Volcanique",
    href: "/gammes/volcanique",
    icon: Flame,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    affinites: "Transformation thermique, fumée, pyrolyse, cendre",
    description: "Interroge le passage de la matière par le feu : fumée, cendre, pyrolyse. Exploration de la transformation thermique et des notes brûlées."
  },
  civilisations: {
    name: "Civilisations",
    href: "/gammes/civilisations/mossi",
    icon: Globe2,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    affinites: "Encens, sacré, rituel, bois précieux",
    description: "Explore les pratiques olfactives rituelles et sacrées : encens, myrrhe, oliban, bois sacrés. Dimension anthropologique et culturelle."
  },
  glaciaire: {
    name: "Glaciaire",
    href: "/gammes/glaciaire",
    icon: Snowflake,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    affinites: "Notes minérales froides, ozone, fraîcheur structurée",
    description: "Travaille la minéralité froide avec des notes d'altitude, ozone et menthe givrée. Fraîcheur structurée et silence olfactif."
  },
  biolab: {
    name: "Bio-Lab",
    href: "/gammes/biolab",
    icon: FlaskConical,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
    affinites: "Approche expérimentale, protocoles rigoureux, design moléculaire",
    description: "Méthodologie rigoureuse : variations systématiques, documentation précise, approche scientifique. Expérimentation contrôlée et biotechnologie olfactive."
  }
};

interface GammesConnexesProps {
  currentGamme: GammeType;
  relatedGammes: GammeType[];
}

export function GammesConnexes({ currentGamme, relatedGammes }: GammesConnexesProps) {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Gammes Connexes
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Découvrez les autres gammes Perfumeum qui partagent des affinités olfactives avec {gammes[currentGamme].name}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedGammes.map((gammeKey) => {
              const gamme = gammes[gammeKey];
              const Icon = gamme.icon;
              
              return (
                <Link key={gammeKey} href={gamme.href}>
                  <Card className="shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 rounded-lg ${gamme.iconBg} flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 ${gamme.iconColor}`} />
                        </div>
                        <CardTitle className="text-xl">{gamme.name}</CardTitle>
                      </div>
                      <CardDescription>
                        <strong>Affinités :</strong> {gamme.affinites}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {gamme.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
