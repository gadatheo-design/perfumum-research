/**
 * GalerieOlfactive.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Porte d'entrée n°4 — Navigation par l'iconographie olfactive (Europeana)
 *
 * Paradigme Odeuropa : entrer par l'image pour découvrir la molécule.
 * Chaque image patrimoniale est un portail vers un fil narratif, une plante
 * ou une molécule. La navigation inverse le flux habituel : l'œil précède le nez.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useCallback } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  ExternalLink,
  BookOpen,
  Leaf,
  FlaskConical,
  MapPin,
  ArrowRight,
  Image as ImageIcon,
  Filter,
} from "lucide-react";

// ── Familles olfactives avec leurs requêtes Europeana ─────────────────────────

interface OlfactoryFamily {
  id: string;
  label: string;
  labelFr: string;
  color: string;
  bgColor: string;
  borderColor: string;
  query: string;
  description: string;
  icon: React.ReactNode;
}

const OLFACTORY_FAMILIES: OlfactoryFamily[] = [
  {
    id: "all",
    label: "Toutes",
    labelFr: "Toutes les familles",
    color: "text-foreground",
    bgColor: "bg-muted",
    borderColor: "border-border",
    query: "perfume incense aromatic smell olfactory",
    description: "L'ensemble des collections olfactives européennes",
    icon: <ImageIcon className="w-4 h-4" />,
  },
  {
    id: "resineux",
    label: "Résineux",
    labelFr: "Résineux & Balsamiques",
    color: "text-amber-700 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    query: "incense frankincense myrrh resin benzoin amber",
    description: "Encens, résines, baumes — les odeurs de la prière et du commerce",
    icon: <span className="text-base">🌿</span>,
  },
  {
    id: "boise",
    label: "Boisé",
    labelFr: "Boisé & Terreux",
    color: "text-stone-700 dark:text-stone-400",
    bgColor: "bg-stone-50 dark:bg-stone-950/30",
    borderColor: "border-stone-200 dark:border-stone-800",
    query: "wood cedar sandalwood vetiver forest oak",
    description: "Cèdre, santal, vétiver — les forêts et les racines",
    icon: <span className="text-base">🪵</span>,
  },
  {
    id: "floral",
    label: "Floral",
    labelFr: "Floral & Herbacé",
    color: "text-rose-700 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    borderColor: "border-rose-200 dark:border-rose-800",
    query: "rose lavender flower garden botanical herb",
    description: "Roses, lavandes, jardins — la botanique olfactive européenne",
    icon: <span className="text-base">🌹</span>,
  },
  {
    id: "animal",
    label: "Animal",
    labelFr: "Animal & Musqué",
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    query: "musk civet ambergris animal skin leather",
    description: "Musc, civette, ambre gris — les odeurs du corps et du prestige",
    icon: <span className="text-base">🦌</span>,
  },
  {
    id: "fume",
    label: "Fumé",
    labelFr: "Fumé & Pyrolytique",
    color: "text-slate-700 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-950/30",
    borderColor: "border-slate-200 dark:border-slate-800",
    query: "tobacco smoke fire combustion ritual ceremony",
    description: "Tabac, fumée, combustion rituelle — la chimie du feu",
    icon: <span className="text-base">🔥</span>,
  },
  {
    id: "epice",
    label: "Épicé",
    labelFr: "Épicé & Aromatique",
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    query: "spice clove cinnamon pepper nutmeg trade",
    description: "Épices, clou de girofle, cannelle — les routes du commerce",
    icon: <span className="text-base">🌶️</span>,
  },
];

// ── Composant carte image ─────────────────────────────────────────────────────

interface ImageCardProps {
  item: {
    id?: string;
    title?: string | string[];
    edmPreview?: string[];
    dataProvider?: string[];
    country?: string[];
    year?: string[];
    rights?: string[];
    guid?: string;
    link?: string;
    edmIsShownAt?: string[];
    dcDescription?: string[];
    dcCreator?: string[];
  };
  family: OlfactoryFamily;
}

function ImageCard({ item, family }: ImageCardProps) {
  const [imgError, setImgError] = useState(false);
  const title = Array.isArray(item.title) ? item.title[0] : item.title ?? "Sans titre";
  const preview = item.edmPreview?.[0];
  const provider = item.dataProvider?.[0] ?? "";
  const country = item.country?.[0] ?? "";
  const year = item.year?.[0] ?? "";
  const europeanaUrl = item.guid ?? item.link ?? "";

  if (!preview || imgError) return null;

  return (
    <Card className={`group overflow-hidden border ${family.borderColor} hover:shadow-md transition-all duration-200 cursor-pointer`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={preview}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        {/* Overlay avec famille olfactive */}
        <div className="absolute top-2 left-2">
          <Badge className={`text-xs ${family.bgColor} ${family.color} border ${family.borderColor}`}>
            {family.icon} <span className="ml-1">{family.label}</span>
          </Badge>
        </div>
        {/* Lien Europeana */}
        {europeanaUrl && (
          <a
            href={europeanaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 p-1 rounded bg-black/50 hover:bg-black/70 text-white transition-colors"
            title="Voir sur Europeana"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      <CardContent className="p-3 space-y-2">
        <p className="text-sm font-medium line-clamp-2 leading-tight">{title}</p>
        <div className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
          {provider && <span className="truncate max-w-[60%]">{provider}</span>}
          <div className="flex items-center gap-1 shrink-0">
            {country && <span>{country}</span>}
            {year && <span>· {year}</span>}
          </div>
        </div>
        {/* Liens de navigation narrative */}
        <div className="flex flex-wrap gap-1 pt-1 border-t border-border/50">
          <Link href="/storylines">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <BookOpen className="w-3 h-3" />
              Fils narratifs
            </span>
          </Link>
          <span className="text-muted-foreground/30">·</span>
          <Link href="/plantes">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Leaf className="w-3 h-3" />
              Plantes
            </span>
          </Link>
          <span className="text-muted-foreground/30">·</span>
          <Link href="/molecules">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <FlaskConical className="w-3 h-3" />
              Molécules
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────

export default function GalerieOlfactive() {
  const [selectedFamily, setSelectedFamily] = useState<OlfactoryFamily>(OLFACTORY_FAMILIES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const activeQuery = searchQuery || selectedFamily.query;

  const { data, isLoading, isFetching } = trpc.europeana.freeSearch.useQuery(
    {
      query: activeQuery,
      limit: 24,
      typeFilter: "IMAGE" as const,
    },
    {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    }
  );

  const handleSearch = useCallback(() => {
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setSelectedFamily(OLFACTORY_FAMILIES[0]);
    }
  }, [searchInput]);

  const handleFamilySelect = useCallback((family: OlfactoryFamily) => {
    setSelectedFamily(family);
    setSearchQuery("");
    setSearchInput("");
  }, []);

  const items = (data as any)?.items ?? [];
  const totalResults = (data as any)?.totalResults ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative border-b border-border bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-stone-400 blur-3xl" />
        </div>
        <div className="relative container py-12 md:py-16">
          <div className="flex items-center gap-2 text-amber-300/70 text-sm mb-4">
            <Link href="/">
              <span className="hover:text-amber-300 transition-colors cursor-pointer">PERFUMUM</span>
            </Link>
            <ArrowRight className="w-3 h-3" />
            <span>Galerie Olfactive</span>
          </div>
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🖼️</span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Galerie Olfactive
              </h1>
            </div>
            <p className="text-stone-300 text-lg leading-relaxed mb-2">
              Entrer par l'image pour découvrir la molécule.
            </p>
            <p className="text-stone-400 text-sm leading-relaxed">
              Collections patrimoniales européennes (Europeana) organisées par famille olfactive.
              Chaque œuvre est un portail vers un fil narratif, une plante ou une molécule.
              La navigation inverse le flux habituel : <em>l'œil précède le nez.</em>
            </p>
            {/* Citation Odeuropa */}
            <blockquote className="mt-4 pl-4 border-l-2 border-amber-500/50 text-stone-400 text-sm italic">
              "Examining your collections through your nose rather than your eyes can reveal unexpected connections."
              <span className="block mt-1 text-stone-500 not-italic">— Odeuropa, The Olfactory Storytelling Toolkit, 2023</span>
            </blockquote>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Barre de recherche */}
        <div className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Rechercher dans les collections Europeana…"
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} variant="default">
            Rechercher
          </Button>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSearchInput("");
                setSelectedFamily(OLFACTORY_FAMILIES[0]);
              }}
            >
              Réinitialiser
            </Button>
          )}
        </div>

        {/* Filtres par famille olfactive */}
        {!searchQuery && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>Naviguer par famille olfactive</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {OLFACTORY_FAMILIES.map((family) => (
                <button
                  key={family.id}
                  onClick={() => handleFamilySelect(family)}
                  className={`
                    inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium
                    transition-all duration-150 cursor-pointer
                    ${selectedFamily.id === family.id
                      ? `${family.bgColor} ${family.color} ${family.borderColor} shadow-sm`
                      : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                    }
                  `}
                >
                  {family.icon}
                  <span>{family.labelFr}</span>
                </button>
              ))}
            </div>
            {/* Description de la famille sélectionnée */}
            {selectedFamily.id !== "all" && (
              <p className={`text-sm ${selectedFamily.color} italic`}>
                {selectedFamily.description}
              </p>
            )}
          </div>
        )}

        {/* En-tête des résultats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">
              {searchQuery
                ? `Résultats pour "${searchQuery}"`
                : selectedFamily.labelFr}
            </h2>
            {!isLoading && totalResults > 0 && (
              <Badge variant="secondary" className="text-xs">
                {totalResults.toLocaleString("fr-FR")} œuvres
              </Badge>
            )}
          </div>
          <a
            href="https://www.europeana.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Source : Europeana</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Grille d'images */}
        {isLoading || isFetching ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">Aucune image trouvée</p>
            <p className="text-sm">Essayez une autre famille olfactive ou modifiez votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {items.map((item: any, idx: number) => (
              <ImageCard key={item.id ?? idx} item={item} family={selectedFamily} />
            ))}
          </div>
        )}

        {/* Section navigation narrative — 5 portes d'entrée */}
        <div className="border-t border-border pt-8">
          <h3 className="text-base font-semibold mb-4 text-muted-foreground uppercase tracking-wider text-xs">
            Les 5 portes d'entrée PERFUMUM
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { href: "/plantes", icon: <Leaf className="w-5 h-5" />, label: "Plantes", desc: "La source matérielle", color: "text-green-600 dark:text-green-400" },
              { href: "/molecules", icon: <FlaskConical className="w-5 h-5" />, label: "Molécules", desc: "Le stimulus chimique", color: "text-blue-600 dark:text-blue-400" },
              { href: "/storylines", icon: <BookOpen className="w-5 h-5" />, label: "Fils narratifs", desc: "L'expérience culturelle", color: "text-purple-600 dark:text-purple-400" },
              { href: "/galerie-olfactive", icon: <ImageIcon className="w-5 h-5" />, label: "Galerie", desc: "L'iconographie", color: "text-amber-600 dark:text-amber-400" },
              { href: "/atlas", icon: <MapPin className="w-5 h-5" />, label: "Atlas", desc: "Le smellscape", color: "text-rose-600 dark:text-rose-400" },
            ].map((door) => (
              <Link key={door.href} href={door.href}>
                <Card className={`p-4 hover:shadow-sm transition-all cursor-pointer border-border/50 hover:border-border group ${door.href === "/galerie-olfactive" ? "ring-1 ring-amber-500/30 bg-amber-50/5" : ""}`}>
                  <div className={`${door.color} mb-2 group-hover:scale-110 transition-transform`}>
                    {door.icon}
                  </div>
                  <p className="text-sm font-semibold">{door.label}</p>
                  <p className="text-xs text-muted-foreground">{door.desc}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
