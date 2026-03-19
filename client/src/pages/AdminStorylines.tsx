import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { BookOpen, Plus, Edit, Trash2, Eye, Globe, Clock, Layers } from "lucide-react";

const AXIS_LABELS: Record<string, { label: string; color: string }> = {
  tabac_rituel: { label: "Tabac & Rituel", color: "bg-amber-100 text-amber-800" },
  route_encens: { label: "Route de l'Encens", color: "bg-yellow-100 text-yellow-800" },
  parfumerie_historique: { label: "Parfumerie Historique", color: "bg-purple-100 text-purple-800" },
  plantes_menacees: { label: "Plantes Menacées", color: "bg-red-100 text-red-800" },
  terroir_olfactif: { label: "Terroir Olfactif", color: "bg-green-100 text-green-800" },
  chimie_transformation: { label: "Chimie & Transformation", color: "bg-blue-100 text-blue-800" },
  corpus_regional: { label: "Corpus Régional", color: "bg-orange-100 text-orange-800" },
  atlas_mnemosyne: { label: "Atlas Mnémosyne", color: "bg-indigo-100 text-indigo-800" },
  autre: { label: "Autre", color: "bg-gray-100 text-gray-700" },
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: "Actif", color: "bg-green-100 text-green-800" },
  draft: { label: "Brouillon", color: "bg-gray-100 text-gray-700" },
  archived: { label: "Archivé", color: "bg-red-100 text-red-800" },
};

function CreateStorylineDialog({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    narrative_axis: "autre",
    period_label: "",
    period_start_year: "",
    period_end_year: "",
    geographic_scope: "",
    status: "draft" as "draft" | "active" | "archived",
  });

  const createMutation = trpc.storylines.create.useMutation({
    onSuccess: () => {
      toast({ title: "Fil narratif créé" });
      setOpen(false);
      onSuccess();
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const handleSubmit = () => {
    if (!form.title || !form.slug) {
      toast({ title: "Titre et slug requis", variant: "destructive" });
      return;
    }
    createMutation.mutate({
      ...form,
      period_start_year: form.period_start_year ? parseInt(form.period_start_year) : undefined,
      period_end_year: form.period_end_year ? parseInt(form.period_end_year) : undefined,
    });
  };

  const autoSlug = (title: string) =>
    title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Nouveau fil narratif
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un fil narratif</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Titre *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, slug: autoSlug(e.target.value) })}
                placeholder="La Route de l'Encens"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Slug *</label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="route-encens"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Axe narratif</label>
              <Select value={form.narrative_axis} onValueChange={(v) => setForm({ ...form, narrative_axis: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(AXIS_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Sous-titre</label>
              <Input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Du Yémen à Rome — 3000 ans de commerce olfactif"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                placeholder="Contexte narratif, enjeux, sources..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Période</label>
              <Input
                value={form.period_label}
                onChange={(e) => setForm({ ...form, period_label: e.target.value })}
                placeholder="-3000 à +400 ap. J.-C."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Portée géographique</label>
              <Input
                value={form.geographic_scope}
                onChange={(e) => setForm({ ...form, geographic_scope: e.target.value })}
                placeholder="Yémen, Oman, Égypte, Rome"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Année début</label>
              <Input
                type="number"
                value={form.period_start_year}
                onChange={(e) => setForm({ ...form, period_start_year: e.target.value })}
                placeholder="-3000"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Année fin</label>
              <Input
                type="number"
                value={form.period_end_year}
                onChange={(e) => setForm({ ...form, period_end_year: e.target.value })}
                placeholder="400"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Statut</label>
              <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Création..." : "Créer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminStorylines() {
  const utils = trpc.useUtils();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "archived">("all");

  const { data: stats } = trpc.storylines.getStats.useQuery();
  const { data: storylinesData, isLoading } = trpc.storylines.list.useQuery({
    status: statusFilter,
    limit: 50,
    offset: 0,
  });

  const deleteMutation = trpc.storylines.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Fil narratif supprimé" });
      utils.storylines.list.invalidate();
      utils.storylines.getStats.invalidate();
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const storylines = storylinesData?.storylines ?? [];

  return (
    <div className="container py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-7 w-7 text-indigo-600" />
            <h1 className="text-2xl font-bold">Atlas Mnémosyne — Fils Narratifs</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            NOSE Phase 3 — Gestion des storylines (od:L14 Smell Narrative)
          </p>
        </div>
        <CreateStorylineDialog onSuccess={() => {
          utils.storylines.list.invalidate();
          utils.storylines.getStats.invalidate();
        }} />
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-indigo-600">{String(stats.total ?? 0)}</div>
              <div className="text-sm text-muted-foreground">Fils narratifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{String(stats.active ?? 0)}</div>
              <div className="text-sm text-muted-foreground">Actifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-amber-600">{String((stats as any).elements ?? 0)}</div>
              <div className="text-sm text-muted-foreground">Éléments liés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-600">{stats.byAxis?.length ?? 0}</div>
              <div className="text-sm text-muted-foreground">Axes narratifs</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Axes distribution */}
      {stats?.byAxis && stats.byAxis.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Distribution par axe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.byAxis.map((a: any) => {
                const ax = AXIS_LABELS[a.narrative_axis] ?? { label: a.narrative_axis, color: "bg-gray-100 text-gray-700" };
                return (
                  <Badge key={a.narrative_axis} className={`${ax.color} border-0`}>
                    {ax.label} ({a.count})
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtres */}
      <div className="flex gap-2 mb-6">
        {(["all", "active", "draft", "archived"] as const).map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(s)}
          >
            {s === "all" ? "Tous" : STATUS_LABELS[s]?.label ?? s}
          </Button>
        ))}
      </div>

      {/* Liste des storylines */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : storylines.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Aucun fil narratif trouvé.
        </div>
      ) : (
        <div className="space-y-4">
          {storylines.map((s: any) => {
            const ax = AXIS_LABELS[s.narrative_axis] ?? { label: s.narrative_axis, color: "bg-gray-100 text-gray-700" };
            const st = STATUS_LABELS[s.status] ?? { label: s.status, color: "bg-gray-100 text-gray-700" };
            return (
              <Card key={s.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-base">{s.title}</h3>
                        <Badge className={`${ax.color} border-0 text-xs`}>{ax.label}</Badge>
                        <Badge className={`${st.color} border-0 text-xs`}>{st.label}</Badge>
                        {s.element_count > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Layers className="h-3 w-3 mr-1" />{s.element_count} éléments
                          </Badge>
                        )}
                      </div>
                      {s.subtitle && (
                        <p className="text-sm text-muted-foreground italic mb-2">{s.subtitle}</p>
                      )}
                      {s.description && (
                        <p className="text-sm text-foreground/80 line-clamp-2 mb-2">{s.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        {s.period_label && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />{s.period_label}
                          </span>
                        )}
                        {s.geographic_scope && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />{s.geographic_scope}
                          </span>
                        )}
                        <span className="font-mono text-indigo-500">/{s.slug}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/storyline/${s.slug}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Supprimer "${s.title}" ?`)) {
                            deleteMutation.mutate({ id: s.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Lien retour */}
      <div className="mt-8 pt-4 border-t">
        <Link href="/admin">
          <Button variant="ghost" size="sm">← Retour Admin</Button>
        </Link>
      </div>
    </div>
  );
}
