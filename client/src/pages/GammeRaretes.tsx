// @ts-nocheck
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GammeBadge } from "@/components/GammeBadge";
import { VoirAussi } from "@/components/VoirAussi";
import { trpc } from "@/lib/trpc";
import { Crown, Gem, Sparkles, Droplets, Waves, TreePine, Heart, Star, ExternalLink, FlaskConical, DollarSign, MapPin } from "lucide-react";
import { MoleculeListLinks } from "@/components/MoleculeLink";

export default function GammeRaretes() {
  // Récupérer les molécules de la gamme Raretés
  const { data: molecules } = trpc.molecules.list.useQuery();
  
  const raretesMolecules = molecules?.filter(m => 
    ["Oud (Agarwood)", "Absolue d'Iris (Orris Butter)", "Ambre Gris (Ambergris)", 
     "Iso E Super", "Ambrox Super", "Coumarine", "Calone 1951", 
     "Galaxolide", "Cashmeran", "Javanol"].includes(m.name)
  ) || [];

  // 5 Accords Maîtres
  const accordsMaitres = [
    {
      id: "tresor-orient",
      name: "Trésor d'Orient",
      icon: Crown,
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      description: "Un voyage olfactif vers les palais d'Arabie et les souks mystérieux",
      molecules: ["Oud (Agarwood)", "Ambre Gris (Ambergris)", "Ambrox Super"],
      notes: {
        tete: "Rose de Damas, Safran",
        coeur: "Oud, Encens Oman",
        fond: "Ambre Gris, Musc, Santal"
      },
      proportions: {
        "Oud": "3-5%",
        "Ambre Gris": "1-2%",
        "Ambrox Super": "5-10%",
        "Rose": "2-4%",
        "Safran": "0.5-1%"
      },
      caractere: "Opulent, sacré, envoûtant",
      usage: "Parfums de niche orientaux, rituels, méditation"
    },
    {
      id: "iris-royal",
      name: "Iris Royal",
      icon: Gem,
      color: "bg-violet-500/20 text-violet-400 border-violet-500/30",
      description: "L'élégance absolue de la haute parfumerie française",
      molecules: ["Absolue d'Iris (Orris Butter)", "Coumarine", "Cashmeran"],
      notes: {
        tete: "Bergamote, Violette",
        coeur: "Iris, Héliotrope",
        fond: "Cashmeran, Coumarine, Musc blanc"
      },
      proportions: {
        "Iris Absolue": "0.5-2%",
        "Coumarine": "2-4%",
        "Cashmeran": "3-6%",
        "Violette": "1-2%",
        "Musc blanc": "5-8%"
      },
      caractere: "Poudré, raffiné, intemporel",
      usage: "Parfums classiques, haute couture, élégance discrète"
    },
    {
      id: "santal-sacre",
      name: "Santal Sacré",
      icon: TreePine,
      color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      description: "La sérénité des temples et la douceur du bois précieux",
      molecules: ["Javanol", "Iso E Super", "Cashmeran"],
      notes: {
        tete: "Cardamome, Bergamote",
        coeur: "Javanol, Bois de rose",
        fond: "Iso E Super, Cashmeran, Vanille"
      },
      proportions: {
        "Javanol": "8-15%",
        "Iso E Super": "10-20%",
        "Cashmeran": "3-5%",
        "Cardamome": "1-2%",
        "Vanille": "2-4%"
      },
      caractere: "Crémeux, méditatif, enveloppant",
      usage: "Parfums boisés modernes, bien-être, yoga"
    },
    {
      id: "musc-precieux",
      name: "Musc Précieux",
      icon: Heart,
      color: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      description: "La sensualité pure et l'effet seconde peau",
      molecules: ["Galaxolide", "Iso E Super", "Ambrox Super"],
      notes: {
        tete: "Poire, Aldéhydes",
        coeur: "Fleur de peau, Jasmin",
        fond: "Galaxolide, Iso E Super, Ambrox"
      },
      proportions: {
        "Galaxolide": "8-12%",
        "Iso E Super": "15-25%",
        "Ambrox Super": "3-5%",
        "Jasmin": "2-4%",
        "Aldéhydes": "0.5-1%"
      },
      caractere: "Sensuel, addictif, effet peau",
      usage: "Parfums intimes, séduction, quotidien luxueux"
    },
    {
      id: "ocean-profond",
      name: "Océan Profond",
      icon: Waves,
      color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      description: "L'immensité marine et la fraîcheur des abysses",
      molecules: ["Calone 1951", "Ambre Gris (Ambergris)", "Iso E Super"],
      notes: {
        tete: "Calone, Citron de Sicile",
        coeur: "Algues, Sel marin",
        fond: "Ambre Gris, Bois flotté, Iso E Super"
      },
      proportions: {
        "Calone": "0.1-0.3%",
        "Ambre Gris": "0.5-1%",
        "Iso E Super": "10-15%",
        "Citron": "3-5%",
        "Sel marin": "0.5-1%"
      },
      caractere: "Marin, minéral, hypnotique",
      usage: "Parfums aquatiques, été, évasion"
    }
  ];

  // Catégories de molécules
  const categories = [
    {
      name: "Trésors Naturels",
      icon: Sparkles,
      molecules: ["Oud (Agarwood)", "Absolue d'Iris (Orris Butter)", "Ambre Gris (Ambergris)"],
      description: "Matières précieuses millénaires, extraites de sources naturelles rares"
    },
    {
      name: "Synthèse Historique",
      icon: FlaskConical,
      molecules: ["Coumarine", "Calone 1951", "Galaxolide"],
      description: "Molécules pionnières qui ont révolutionné la parfumerie moderne"
    },
    {
      name: "Captives Modernes",
      icon: Star,
      molecules: ["Iso E Super", "Ambrox Super", "Cashmeran", "Javanol"],
      description: "Innovations des grandes maisons, alternatives durables aux naturels"
    }
  ];

  return (
    <div className="min-h-screen bg-background theme-biolab">
      <div className="container py-8 max-w-6xl">
        <Breadcrumbs />
        
        {/* Hero Section */}
        <div className="relative mb-12 p-8 rounded-lg border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-violet-500/5 to-pink-500/10">
          <div className="absolute top-4 right-4">
            <GammeBadge gamme="biolab" size="lg" />
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-amber-500/20">
              <Crown className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold uppercase tracking-tight">Gamme Raretés</h1>
              <p className="text-muted-foreground">Les molécules les plus précieuses de la parfumerie</p>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-3xl">
            Cette gamme rassemble les 10 molécules essentielles qui définissent l'excellence en parfumerie : 
            des trésors naturels millénaires aux innovations synthétiques révolutionnaires. 
            Chaque molécule représente un jalon dans l'histoire de l'art olfactif.
          </p>
          
          <div className="flex gap-6 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">{raretesMolecules.length}</div>
              <div className="text-sm text-muted-foreground">Molécules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-400">5</div>
              <div className="text-sm text-muted-foreground">Accords Maîtres</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">3</div>
              <div className="text-sm text-muted-foreground">Catégories</div>
            </div>
          </div>
        </div>

        {/* Catégories de Molécules */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
            <Gem className="w-6 h-6 text-amber-400" />
            Les 10 Molécules Essentielles
          </h2>
          
          <div className="grid gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const catMolecules = raretesMolecules.filter(m => cat.molecules.includes(m.name));
              
              return (
                <div key={cat.name} className="p-6 rounded-lg border bg-card/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-amber-400" />
                    <h3 className="text-xl font-semibold">{cat.name}</h3>
                    <span className="text-sm text-muted-foreground">({catMolecules.length} molécules)</span>
                  </div>
                  <p className="text-muted-foreground mb-4">{cat.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {catMolecules.map((mol) => (
                      <Link key={mol.id} href={`/molecule/${mol.id}`}>
                        <div className="p-4 rounded-lg border bg-background/50 hover:bg-accent/50 transition-all cursor-pointer card-hover">
                          <div className="font-semibold text-foreground">{mol.name}</div>
                          <div className="text-sm text-muted-foreground font-mono">{mol.chemicalFormula}</div>
                          <div className="text-xs text-muted-foreground mt-2 line-clamp-2">{mol.olfactiveProfile}</div>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">{mol.family}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5 Accords Maîtres */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-violet-400" />
            Les 5 Accords Maîtres
          </h2>
          
          <div className="grid gap-6">
            {accordsMaitres.map((accord) => {
              const Icon = accord.icon;
              
              return (
                <div key={accord.id} className={`p-6 rounded-lg border-2 ${accord.color}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${accord.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{accord.name}</h3>
                        <p className="text-sm text-muted-foreground">{accord.description}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-background/50">{accord.caractere}</span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Pyramide Olfactive */}
                    <div>
                      <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide">Pyramide Olfactive</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-muted-foreground shrink-0">Tête</span>
                          <span className="text-right"><MoleculeListLinks text={accord.notes.tete} variant="inline" /></span>
                        </div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-muted-foreground shrink-0">Cœur</span>
                          <span className="text-right"><MoleculeListLinks text={accord.notes.coeur} variant="inline" /></span>
                        </div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-muted-foreground shrink-0">Fond</span>
                          <span className="text-right"><MoleculeListLinks text={accord.notes.fond} variant="inline" /></span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Proportions */}
                    <div>
                      <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide">Proportions Suggérées</h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(accord.proportions).map(([mol, prop]) => (
                          <div key={mol} className="flex justify-between">
                            <span className="text-muted-foreground">{mol}</span>
                            <span className="font-mono">{prop}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Molécules Clés */}
                    <div>
                      <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide">Molécules Clés</h4>
                      <div className="flex flex-wrap gap-2">
                        {accord.molecules.map((mol) => {
                          const molecule = raretesMolecules.find(m => m.name === mol);
                          return molecule ? (
                            <Link key={mol} href={`/molecule/${molecule.id}`}>
                              <span className="text-xs px-2 py-1 rounded bg-background/50 hover:bg-accent cursor-pointer transition-colors">
                                {mol}
                              </span>
                            </Link>
                          ) : (
                            <span key={mol} className="text-xs px-2 py-1 rounded bg-background/50">
                              {mol}
                            </span>
                          );
                        })}
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        <strong>Usage :</strong> {accord.usage}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section Prix et Approvisionnement */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-400" />
            Prix et Approvisionnement
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Molécule</th>
                  <th className="text-left p-3 font-semibold">Prix Estimé</th>
                  <th className="text-left p-3 font-semibold">Fournisseurs</th>
                  <th className="text-left p-3 font-semibold">Origine</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Oud (Agarwood)</td>
                  <td className="p-3 text-amber-400">$30,000-50,000/kg</td>
                  <td className="p-3">Hermitage Oils, Ensar Oud, Agar Aura</td>
                  <td className="p-3 text-muted-foreground">Asie du Sud-Est</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Absolue d'Iris</td>
                  <td className="p-3 text-amber-400">$40,000-100,000/kg</td>
                  <td className="p-3">Robertet, Firmenich, Givaudan</td>
                  <td className="p-3 text-muted-foreground">Italie, Maroc</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Ambre Gris</td>
                  <td className="p-3 text-amber-400">$20,000-50,000/kg</td>
                  <td className="p-3">Ambergris NZ, Hermitage Oils</td>
                  <td className="p-3 text-muted-foreground">Océans (trouvé)</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Iso E Super</td>
                  <td className="p-3 text-green-400">$50-150/kg</td>
                  <td className="p-3">IFF, Vigon, Pell Wall</td>
                  <td className="p-3 text-muted-foreground">Synthèse</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Ambrox Super</td>
                  <td className="p-3 text-green-400">$200-500/kg</td>
                  <td className="p-3">Firmenich, Sigma-Aldrich</td>
                  <td className="p-3 text-muted-foreground">Synthèse</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Coumarine</td>
                  <td className="p-3 text-green-400">$30-80/kg</td>
                  <td className="p-3">Sigma-Aldrich, TCI, Vigon</td>
                  <td className="p-3 text-muted-foreground">Synthèse</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Calone 1951</td>
                  <td className="p-3 text-green-400">$100-300/kg</td>
                  <td className="p-3">Pell Wall, Perfumer's Apprentice</td>
                  <td className="p-3 text-muted-foreground">Synthèse</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Galaxolide</td>
                  <td className="p-3 text-green-400">$50-120/kg</td>
                  <td className="p-3">IFF, Vigon, Pell Wall</td>
                  <td className="p-3 text-muted-foreground">Synthèse</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Cashmeran</td>
                  <td className="p-3 text-green-400">$80-200/kg</td>
                  <td className="p-3">IFF, Sigma-Aldrich, Pell Wall</td>
                  <td className="p-3 text-muted-foreground">Synthèse</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Javanol</td>
                  <td className="p-3 text-yellow-400">$500-1,500/kg</td>
                  <td className="p-3">Givaudan (captive), Pell Wall</td>
                  <td className="p-3 text-muted-foreground">Synthèse</td>
                </tr>
                {/* === PHASE 2 : MUSCS PRÉCIEUX === */}
                <tr className="border-b bg-muted/30">
                  <td colSpan={4} className="p-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Muscs Précieux</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Muscone</td>
                  <td className="p-3 text-amber-400">$8,000-15,000/kg</td>
                  <td className="p-3">Firmenich, Givaudan, Symrise</td>
                  <td className="p-3 text-muted-foreground">Cerf porte-musc / Synthèse</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Civettone</td>
                  <td className="p-3 text-amber-400">$5,000-12,000/kg</td>
                  <td className="p-3">Robertet, Hermitage Oils</td>
                  <td className="p-3 text-muted-foreground">Civette / Synthèse éthique</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Ethylene Brassylate</td>
                  <td className="p-3 text-green-400">$80-200/kg</td>
                  <td className="p-3">Firmenich, Pell Wall, Vigon</td>
                  <td className="p-3 text-muted-foreground">Synthèse</td>
                </tr>
                {/* === PHASE 2 : BOIS PRÉCIEUX === */}
                <tr className="border-b bg-muted/30">
                  <td colSpan={4} className="p-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bois Précieux</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Santal Mysore (α-Santalol)</td>
                  <td className="p-3 text-amber-400">$2,500-5,000/kg</td>
                  <td className="p-3">Robertet, Albert Vieille, Hermitage</td>
                  <td className="p-3 text-muted-foreground">Inde (CITES)</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Cèdre Atlas (Cedrene)</td>
                  <td className="p-3 text-green-400">$30-80/kg</td>
                  <td className="p-3">Robertet, Pell Wall, Vigon</td>
                  <td className="p-3 text-muted-foreground">Maroc, Algérie</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Gaïac (Guaiol)</td>
                  <td className="p-3 text-yellow-400">$200-500/kg</td>
                  <td className="p-3">Robertet, Firmenich</td>
                  <td className="p-3 text-muted-foreground">Argentine, Paraguay</td>
                </tr>
                {/* === PHASE 2 : FLORAUX PRÉCIEUX === */}
                <tr className="border-b bg-muted/30">
                  <td colSpan={4} className="p-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Floraux Précieux</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Absolue de Rose</td>
                  <td className="p-3 text-amber-400">$6,000-12,000/kg</td>
                  <td className="p-3">Robertet, Firmenich, Biolandes</td>
                  <td className="p-3 text-muted-foreground">Bulgarie, Turquie, Maroc</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Absolue de Jasmin</td>
                  <td className="p-3 text-amber-400">$5,000-10,000/kg</td>
                  <td className="p-3">Robertet, Firmenich, Albert Vieille</td>
                  <td className="p-3 text-muted-foreground">Grasse, Égypte, Inde</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Tubéreuse Absolue</td>
                  <td className="p-3 text-amber-400">$8,000-18,000/kg</td>
                  <td className="p-3">Robertet, Firmenich</td>
                  <td className="p-3 text-muted-foreground">Inde, Égypte</td>
                </tr>
                {/* === PHASE 2 : ÉPICES & RÉSINES === */}
                <tr className="border-b bg-muted/30">
                  <td colSpan={4} className="p-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Épices & Résines</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Safranal</td>
                  <td className="p-3 text-amber-400">$3,000-8,000/kg</td>
                  <td className="p-3">Robertet, Firmenich, Sigma-Aldrich</td>
                  <td className="p-3 text-muted-foreground">Iran, Cachemire, Espagne</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Cardamome</td>
                  <td className="p-3 text-green-400">$80-200/kg</td>
                  <td className="p-3">Robertet, Pell Wall, Vigon</td>
                  <td className="p-3 text-muted-foreground">Guatemala, Inde</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Encens Oliban</td>
                  <td className="p-3 text-yellow-400">$300-800/kg</td>
                  <td className="p-3">Hermitage Oils, Ensar Oud, Robertet</td>
                  <td className="p-3 text-muted-foreground">Oman, Yémen, Somalie</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Myrrhe</td>
                  <td className="p-3 text-yellow-400">$200-600/kg</td>
                  <td className="p-3">Hermitage Oils, Robertet</td>
                  <td className="p-3 text-muted-foreground">Somalie, Éthiopie, Yémen</td>
                </tr>
                {/* === PHASE 2 : AGRUMES RARES === */}
                <tr className="border-b bg-muted/30">
                  <td colSpan={4} className="p-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Agrumes Rares</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Bergamote Calabre</td>
                  <td className="p-3 text-green-400">$100-250/kg</td>
                  <td className="p-3">Robertet, Capua 1880, Simone Gatto</td>
                  <td className="p-3 text-muted-foreground">Calabre, Italie</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Yuzu</td>
                  <td className="p-3 text-yellow-400">$400-900/kg</td>
                  <td className="p-3">Takasago, Robertet, Pell Wall</td>
                  <td className="p-3 text-muted-foreground">Japon, Corée</td>
                </tr>
                {/* === PHASE 2 : MOLÉCULES SIGNATURE === */}
                <tr className="border-b bg-muted/30">
                  <td colSpan={4} className="p-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Molécules Signature</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Hedione</td>
                  <td className="p-3 text-green-400">$60-150/kg</td>
                  <td className="p-3">Firmenich, Pell Wall, Vigon</td>
                  <td className="p-3 text-muted-foreground">Synthèse</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Ambroxan (Cetalox)</td>
                  <td className="p-3 text-green-400">$150-400/kg</td>
                  <td className="p-3">Firmenich, Pell Wall, Vigon</td>
                  <td className="p-3 text-muted-foreground">Synthèse</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Norlimbanol</td>
                  <td className="p-3 text-yellow-400">$300-700/kg</td>
                  <td className="p-3">Firmenich (captive)</td>
                  <td className="p-3 text-muted-foreground">Synthèse</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Clearwood</td>
                  <td className="p-3 text-yellow-400">$400-900/kg</td>
                  <td className="p-3">Firmenich (captive)</td>
                  <td className="p-3 text-muted-foreground">Synthèse</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">Paradisone</td>
                  <td className="p-3 text-yellow-400">$350-800/kg</td>
                  <td className="p-3">Firmenich (captive)</td>
                  <td className="p-3 text-muted-foreground">Synthèse</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 rounded-lg border bg-card/50">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Fournisseurs Recommandés
            </h4>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <strong>Naturels Rares</strong>
                <ul className="text-muted-foreground mt-1 space-y-1">
                  <li>• Hermitage Oils (UK)</li>
                  <li>• Ensar Oud (USA)</li>
                  <li>• Robertet (France)</li>
                  <li>• Albert Vieille (France)</li>
                  <li>• Biolandes (France)</li>
                </ul>
              </div>
              <div>
                <strong>Synthétiques Premium</strong>
                <ul className="text-muted-foreground mt-1 space-y-1">
                  <li>• Pell Wall Perfumes (UK)</li>
                  <li>• Vigon International (USA)</li>
                  <li>• Perfumer's Apprentice (USA)</li>
                  <li>• Creating Perfume (USA)</li>
                </ul>
              </div>
              <div>
                <strong>Grandes Maisons</strong>
                <ul className="text-muted-foreground mt-1 space-y-1">
                  <li>• Firmenich (Suisse)</li>
                  <li>• Givaudan (Suisse)</li>
                  <li>• Symrise (Allemagne)</li>
                  <li>• IFF (USA)</li>
                  <li>• Takasago (Japon)</li>
                </ul>
              </div>
              <div>
                <strong>Laboratoire & Agrumes</strong>
                <ul className="text-muted-foreground mt-1 space-y-1">
                  <li>• Sigma-Aldrich (Global)</li>
                  <li>• TCI Chemicals (Japon)</li>
                  <li>• Capua 1880 (Italie)</li>
                  <li>• Simone Gatto (Italie)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Voir Aussi */}
        <VoirAussi 
          items={[
            { href: "/molecules", title: "Toutes les Molécules", description: "206 molécules dans la base" },
            { href: "/gammes/pheromones", title: "Gamme Phéromones", description: "Molécules de communication" },
            { href: "/gammes/signatures", title: "Gamme Signatures", description: "Profils d'exception" },
            { href: "/fournisseurs", title: "Fournisseurs", description: "Sources d'approvisionnement" }
          ]}
        />
      </div>
    </div>
  );
}
