import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Leaf, FlaskConical, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";

// ─── Données statiques des muscs ─────────────────────────────────────────────

type MuscType = "naturel_animal" | "nitré" | "polycyclique" | "macrocyclique" | "linéaire";

interface Musc {
  id: string;
  nom: string;
  nomScientifique?: string;
  type: MuscType;
  cites: "Annexe I" | "Annexe II" | "Non listé" | "Interdit";
  ifraStatut: "Autorisé" | "Restreint" | "Interdit" | "Non évalué";
  ifraLimite?: string;
  biodegradabilite: "Excellente" | "Bonne" | "Moyenne" | "Faible" | "Très faible";
  odeur: string;
  alternatives?: string[];
  notes: string;
  moleculeId?: number;
  couleur: string;
}

const MUSCS: Musc[] = [
  // ─── Naturels animaux ───────────────────────────────────────────────────────
  {
    id: "ambre-gris",
    nom: "Ambre Gris",
    nomScientifique: "Ambergris",
    type: "naturel_animal",
    cites: "Annexe I",
    ifraStatut: "Autorisé",
    ifraLimite: "Pas de limite (origine naturelle rare)",
    biodegradabilite: "Excellente",
    odeur: "Marin, animal, boisé, légèrement fécal puis doux et ambrée après vieillissement",
    alternatives: ["Ambroxan", "Ambrette Seed", "Ambrox DL"],
    notes: "Concrétion intestinale du cachalot (Physeter macrocephalus). Protégé par la CITES Annexe I. Légal uniquement si trouvé flottant (échoué). Prix : 10–25 €/g.",
    couleur: "amber",
  },
  {
    id: "castoreum",
    nom: "Castoreum",
    nomScientifique: "Castor fiber / Castor canadensis",
    type: "naturel_animal",
    cites: "Annexe II",
    ifraStatut: "Restreint",
    ifraLimite: "0.1% max en catégorie 4 (rinçage)",
    biodegradabilite: "Bonne",
    odeur: "Cuir, animal, fumé, boisé, légèrement vanillé",
    alternatives: ["Castoryl Musk", "Birch Tar", "Guaiacol"],
    notes: "Sécrétion des glandes anales du castor. Castors d'Europe (Castor fiber) protégés CITES II. Castors du Canada légaux dans certains pays. Utilisé depuis l'Antiquité.",
    couleur: "amber",
  },
  {
    id: "hyraceum",
    nom: "Hyraceum",
    nomScientifique: "Procavia capensis",
    type: "naturel_animal",
    cites: "Non listé",
    ifraStatut: "Non évalué",
    biodegradabilite: "Bonne",
    odeur: "Cuir, animal, terreux, légèrement fécal, notes de tabac et de café",
    alternatives: ["Castoreum", "Birch Tar"],
    notes: "Urine fossilisée du daman des rochers (Afrique du Sud). Non protégé CITES. Collecte éthique possible (dépôts anciens). Très rare en parfumerie commerciale.",
    couleur: "amber",
  },
  {
    id: "civettone",
    nom: "Civettone (Civet)",
    nomScientifique: "Civettictis civetta",
    type: "naturel_animal",
    cites: "Annexe III",
    ifraStatut: "Restreint",
    ifraLimite: "0.02% max (catégories sensibles)",
    biodegradabilite: "Bonne",
    odeur: "Animal, fécal à forte concentration, musc doux et enveloppant à faible dose",
    alternatives: ["Civettone synthétique (macrocyclique)", "Exaltolide", "Habanolide"],
    notes: "Sécrétion de la civette africaine. Élevage en captivité controversé (maltraitance). La version synthétique (C17H30O) est identique moléculairement.",
    couleur: "amber",
  },
  {
    id: "muscone",
    nom: "Muscone (Musc naturel)",
    nomScientifique: "Moschus moschiferus",
    type: "naturel_animal",
    cites: "Annexe I",
    ifraStatut: "Autorisé",
    ifraLimite: "Version synthétique sans limite",
    biodegradabilite: "Bonne",
    odeur: "Musc animal pur, chaud, légèrement fécal, très persistant",
    alternatives: ["Muscone synthétique", "Habanolide", "Exaltolide"],
    notes: "Glande du cerf porte-musc (Himalaya). Espèce en danger critique, protégée CITES I. La version naturelle est illégale dans la plupart des pays. Muscone synthétique (C16H30O) légal.",
    couleur: "amber",
  },
  // ─── Muscs nitrés (interdits/restreints) ────────────────────────────────────
  {
    id: "musk-tibetene",
    nom: "Musk Tibetene",
    type: "nitré",
    cites: "Non listé",
    ifraStatut: "Interdit",
    biodegradabilite: "Très faible",
    odeur: "Musc poudré, doux, légèrement fruité",
    alternatives: ["Galaxolide", "Habanolide", "Iso E Super"],
    notes: "Musc nitré interdit par l'IFRA depuis 1995 en raison de sa neurotoxicité et de sa persistance environnementale. Encore détecté dans certaines eaux de surface.",
    couleur: "red",
  },
  {
    id: "musk-ambrette",
    nom: "Musk Ambrette",
    type: "nitré",
    cites: "Non listé",
    ifraStatut: "Interdit",
    biodegradabilite: "Très faible",
    odeur: "Musc poudré, animal, légèrement fruité",
    alternatives: ["Ambrette Seed (naturel)", "Galaxolide"],
    notes: "Musc nitré interdit par l'IFRA depuis 1991. Photosensibilisant avéré. À ne pas confondre avec la graine d'ambrette (Hibiscus abelmoschus), qui est naturelle et autorisée.",
    couleur: "red",
  },
  // ─── Muscs polycycliques ────────────────────────────────────────────────────
  {
    id: "galaxolide",
    nom: "Galaxolide",
    nomScientifique: "HHCB (1,3,4,6,7,8-hexahydro-4,6,6,7,8,8-hexamethylcyclopenta[g]-2-benzopyran)",
    type: "polycyclique",
    cites: "Non listé",
    ifraStatut: "Restreint",
    ifraLimite: "2.2% max (catégorie 4, rinçage)",
    biodegradabilite: "Faible",
    odeur: "Musc propre, poudré, légèrement fruité, très diffusif",
    alternatives: ["Habanolide", "Exaltolide", "Romandolide"],
    notes: "Musc polycyclique le plus utilisé au monde (>1000 tonnes/an). Perturbateur endocrinien suspecté. Persistant dans les eaux (bioaccumulation). Restrictions IFRA progressives.",
    couleur: "orange",
  },
  // ─── Muscs macrocycliques ───────────────────────────────────────────────────
  {
    id: "habanolide",
    nom: "Habanolide",
    nomScientifique: "Exaltolide (cyclopentadecanolide)",
    type: "macrocyclique",
    cites: "Non listé",
    ifraStatut: "Autorisé",
    biodegradabilite: "Excellente",
    odeur: "Musc doux, propre, légèrement lactonique, très naturel",
    alternatives: [],
    notes: "Musc macrocyclique de référence. Biodégradable et sans restriction IFRA. Utilisé dans Narciso Rodriguez For Her, Chloé EDP. Considéré comme l'alternative idéale aux muscs polycycliques.",
    couleur: "green",
  },
  {
    id: "exaltolide",
    nom: "Exaltolide",
    nomScientifique: "Pentadecanolide",
    type: "macrocyclique",
    cites: "Non listé",
    ifraStatut: "Autorisé",
    biodegradabilite: "Excellente",
    odeur: "Musc animal doux, légèrement lactonique, crémeux",
    alternatives: [],
    notes: "L'un des premiers muscs macrocycliques de synthèse. Proche du musc naturel animal. Très apprécié en parfumerie niche pour son naturalité.",
    couleur: "green",
  },
  {
    id: "ethylene-brassylate",
    nom: "Ethylene Brassylate",
    type: "macrocyclique",
    cites: "Non listé",
    ifraStatut: "Autorisé",
    biodegradabilite: "Excellente",
    odeur: "Musc propre, légèrement fruité, doux, très diffusif",
    alternatives: [],
    notes: "Musc macrocyclique dérivé de l'acide brassylique (huile de colza). Biodégradable et d'origine renouvelable. Utilisé dans Angel de Thierry Mugler.",
    couleur: "green",
  },
];

const typeLabels: Record<MuscType, string> = {
  "naturel_animal": "Naturel animal",
  "nitré": "Nitré (interdit)",
  "polycyclique": "Polycyclique",
  "macrocyclique": "Macrocyclique",
  "linéaire": "Linéaire",
};

const typeColors: Record<MuscType, string> = {
  "naturel_animal": "bg-amber-500/15 text-amber-700 border-amber-500/30",
  "nitré": "bg-red-500/15 text-red-700 border-red-500/30",
  "polycyclique": "bg-orange-500/15 text-orange-700 border-orange-500/30",
  "macrocyclique": "bg-green-500/15 text-green-700 border-green-500/30",
  "linéaire": "bg-blue-500/15 text-blue-700 border-blue-500/30",
};

const biodegColors: Record<string, string> = {
  "Excellente": "text-green-600",
  "Bonne": "text-emerald-600",
  "Moyenne": "text-yellow-600",
  "Faible": "text-orange-600",
  "Très faible": "text-red-600",
};

const ifraColors: Record<string, string> = {
  "Autorisé": "text-green-600",
  "Restreint": "text-orange-600",
  "Interdit": "text-red-600",
  "Non évalué": "text-muted-foreground",
};

const citesColors: Record<string, string> = {
  "Annexe I": "bg-red-500/15 text-red-700 border-red-500/30",
  "Annexe II": "bg-orange-500/15 text-orange-700 border-orange-500/30",
  "Annexe III": "bg-yellow-500/15 text-yellow-700 border-yellow-500/30",
  "Non listé": "bg-muted text-muted-foreground",
  "Interdit": "bg-red-500/15 text-red-700 border-red-500/30",
};

// ─── Composant principal ──────────────────────────────────────────────────────

export default function MuscsComparatif() {
  const { data: allLinks } = trpc.molecules.getAllPerfumeLinks.useQuery();

  // Grouper les parfums par molécule pour enrichir les cartes muscs
  const perfumsByMolecule: Record<string, string[]> = {};
  if (allLinks) {
    for (const link of allLinks as any[]) {
      const key = link.molecule_name?.toLowerCase() || "";
      if (!perfumsByMolecule[key]) perfumsByMolecule[key] = [];
      perfumsByMolecule[key].push(link.perfume_name);
    }
  }

  const muscsNaturels = MUSCS.filter(m => m.type === "naturel_animal");
  const muscsNitres = MUSCS.filter(m => m.type === "nitré");
  const muscsPolycycliques = MUSCS.filter(m => m.type === "polycyclique");
  const muscsMacrocycliques = MUSCS.filter(m => m.type === "macrocyclique");

  return (
    <div className="container py-6 space-y-6">
      <Breadcrumbs />

      {/* En-tête */}
      <div className="flex items-start gap-4">
        <Link href="/synergies-heatmap">
          <button className="mt-1 p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Muscs — Guide comparatif</h1>
          <p className="text-muted-foreground mt-1">
            Naturels animaux · Nitrés interdits · Polycycliques · Macrocycliques — Statuts CITES, IFRA et biodégradabilité
          </p>
        </div>
      </div>

      {/* Avertissement général */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-amber-800">Contexte réglementaire</p>
              <p className="text-amber-700/80">
                Les muscs naturels d'origine animale sont soumis à la Convention CITES. Les muscs nitrés sont interdits par l'IFRA depuis les années 1990. 
                Les muscs macrocycliques représentent aujourd'hui l'alternative la plus durable et la moins controversée.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau comparatif global */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tableau comparatif — 11 muscs</CardTitle>
          <CardDescription>Classés par catégorie, avec statuts CITES, IFRA et biodégradabilité</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left pb-3 pr-4 font-medium">Musc</th>
                <th className="text-left pb-3 pr-4 font-medium">Catégorie</th>
                <th className="text-left pb-3 pr-4 font-medium">CITES</th>
                <th className="text-left pb-3 pr-4 font-medium">IFRA</th>
                <th className="text-left pb-3 pr-4 font-medium">Biodégradabilité</th>
                <th className="text-left pb-3 font-medium">Alternatives</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MUSCS.map(m => (
                <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-medium">{m.nom}</div>
                    {m.nomScientifique && (
                      <div className="text-xs text-muted-foreground italic truncate max-w-[180px]">{m.nomScientifique}</div>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant="outline" className={`text-xs ${typeColors[m.type]}`}>
                      {typeLabels[m.type]}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant="outline" className={`text-xs ${citesColors[m.cites]}`}>
                      {m.cites}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`font-medium ${ifraColors[m.ifraStatut]}`}>
                      {m.ifraStatut}
                    </span>
                    {m.ifraLimite && (
                      <div className="text-xs text-muted-foreground mt-0.5">{m.ifraLimite}</div>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`font-medium ${biodegColors[m.biodegradabilite]}`}>
                      {m.biodegradabilite}
                    </span>
                  </td>
                  <td className="py-3">
                    {m.alternatives && m.alternatives.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {m.alternatives.map(alt => (
                          <Badge key={alt} variant="secondary" className="text-xs">{alt}</Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Onglets par catégorie */}
      <Tabs defaultValue="naturels">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="naturels">Naturels animaux ({muscsNaturels.length})</TabsTrigger>
          <TabsTrigger value="nitres">Nitrés interdits ({muscsNitres.length})</TabsTrigger>
          <TabsTrigger value="polycycliques">Polycycliques ({muscsPolycycliques.length})</TabsTrigger>
          <TabsTrigger value="macrocycliques">Macrocycliques ({muscsMacrocycliques.length})</TabsTrigger>
        </TabsList>

        {[
          { key: "naturels", muscs: muscsNaturels, title: "Muscs naturels d'origine animale", desc: "Matières premières rares, protégées par la CITES. Utilisation légale très restreinte." },
          { key: "nitres", muscs: muscsNitres, title: "Muscs nitrés — Interdits par l'IFRA", desc: "Neurotoxiques et persistants dans l'environnement. Interdits depuis les années 1990-2000." },
          { key: "polycycliques", muscs: muscsPolycycliques, title: "Muscs polycycliques", desc: "Très diffusifs mais à faible biodégradabilité. Restrictions IFRA progressives." },
          { key: "macrocycliques", muscs: muscsMacrocycliques, title: "Muscs macrocycliques", desc: "Alternatives durables aux muscs nitrés et polycycliques. Biodégradables et sans restriction IFRA." },
        ].map(({ key, muscs, title, desc }) => (
          <TabsContent key={key} value={key} className="space-y-4 mt-4">
            <div className="text-sm text-muted-foreground">{desc}</div>
            <div className="grid gap-4 md:grid-cols-2">
              {muscs.map(m => {
                const parfums = perfumsByMolecule[m.nom.toLowerCase()] || [];
                return (
                  <Card key={m.id} className={`border-${m.couleur === 'red' ? 'red' : m.couleur === 'green' ? 'green' : m.couleur === 'amber' ? 'amber' : 'orange'}-500/20`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-base">{m.nom}</CardTitle>
                          {m.nomScientifique && (
                            <p className="text-xs text-muted-foreground italic mt-0.5">{m.nomScientifique}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <Badge variant="outline" className={`text-xs ${citesColors[m.cites]}`}>{m.cites}</Badge>
                          <span className={`text-xs font-medium ${ifraColors[m.ifraStatut]}`}>{m.ifraStatut}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Odeur */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Profil olfactif</p>
                        <p className="text-sm">{m.odeur}</p>
                      </div>

                      {/* Biodégradabilité */}
                      <div className="flex items-center gap-2">
                        <Leaf className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Biodégradabilité :</span>
                        <span className={`text-xs font-medium ${biodegColors[m.biodegradabilite]}`}>{m.biodegradabilite}</span>
                      </div>

                      {/* Limite IFRA */}
                      {m.ifraLimite && (
                        <div className="flex items-start gap-2">
                          <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground">{m.ifraLimite}</p>
                        </div>
                      )}

                      {/* Notes */}
                      <p className="text-xs text-muted-foreground leading-relaxed">{m.notes}</p>

                      {/* Alternatives */}
                      {m.alternatives && m.alternatives.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1.5">Alternatives synthétiques</p>
                          <div className="flex flex-wrap gap-1">
                            {m.alternatives.map(alt => (
                              <Badge key={alt} variant="secondary" className="text-xs">{alt}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Parfums emblématiques (depuis la DB) */}
                      {parfums.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1.5">Parfums emblématiques</p>
                          <div className="flex flex-wrap gap-1">
                            {parfums.slice(0, 4).map(p => (
                              <Badge key={p} variant="outline" className="text-xs bg-violet-500/10 text-violet-700 border-violet-500/30">{p}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Légende */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4 pb-4">
          <div className="grid sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-2">CITES — Convention sur le commerce international</p>
              <ul className="space-y-1">
                <li><span className="text-red-600 font-medium">Annexe I</span> — Commerce international interdit</li>
                <li><span className="text-orange-600 font-medium">Annexe II</span> — Commerce réglementé (permis requis)</li>
                <li><span className="text-yellow-600 font-medium">Annexe III</span> — Protection dans certains pays</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">IFRA — International Fragrance Association</p>
              <ul className="space-y-1">
                <li><span className="text-green-600 font-medium">Autorisé</span> — Sans restriction</li>
                <li><span className="text-orange-600 font-medium">Restreint</span> — Limite de concentration par catégorie</li>
                <li><span className="text-red-600 font-medium">Interdit</span> — Banni de toutes les formulations</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">Biodégradabilité</p>
              <ul className="space-y-1">
                <li><span className="text-green-600 font-medium">Excellente</span> — Dégradation rapide (&lt;28 jours)</li>
                <li><span className="text-orange-600 font-medium">Faible</span> — Persistance dans l'environnement</li>
                <li><span className="text-red-600 font-medium">Très faible</span> — Bioaccumulation documentée</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
