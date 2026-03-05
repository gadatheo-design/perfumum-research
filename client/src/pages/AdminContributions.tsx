// @ts-nocheck
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Image as ImageIcon,
  FlaskConical,
  MapPin,
  FileText,
  Leaf,
  Filter,
  RefreshCw,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ContributionStatusBadge } from "@/components/PlantContributionModal";

const typeIcons: Record<string, React.ReactNode> = {
  image: <ImageIcon className="h-4 w-4" />,
  molecule: <FlaskConical className="h-4 w-4" />,
  terroir: <MapPin className="h-4 w-4" />,
  note: <FileText className="h-4 w-4" />,
};

const typeLabels: Record<string, string> = {
  image: "Image",
  molecule: "Molécule",
  terroir: "Terroir",
  note: "Note",
};

const typeColors: Record<string, string> = {
  image: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  molecule: "bg-violet-500/10 text-violet-700 border-violet-500/30",
  terroir: "bg-green-500/10 text-green-700 border-green-500/30",
  note: "bg-amber-500/10 text-amber-700 border-amber-500/30",
};

export default function AdminContributions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected" | undefined>("pending");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [reviewContribution, setReviewContribution] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [reviewAction, setReviewAction] = useState<"approved" | "rejected">("approved");

  const { data: contributions, isLoading, refetch } = trpc.plantContributions.getAll.useQuery(
    { status: statusFilter },
    { enabled: user?.role === 'admin' }
  );

  const { data: stats } = trpc.plantContributions.getStats.useQuery();

  const approveMutation = trpc.plantContributions.approve.useMutation({
    onSuccess: () => {
      toast({ title: "Contribution approuvée", description: "La contribution a été approuvée et intégrée." });
      setReviewContribution(null);
      setAdminNotes("");
      refetch();
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const rejectMutation = trpc.plantContributions.reject.useMutation({
    onSuccess: () => {
      toast({ title: "Contribution rejetée", description: "La contribution a été rejetée." });
      setReviewContribution(null);
      setAdminNotes("");
      refetch();
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const handleReview = () => {
    if (!reviewContribution) return;
    if (reviewAction === "approved") {
      approveMutation.mutate({ contributionId: reviewContribution.id, adminNotes: adminNotes || undefined });
    } else {
      rejectMutation.mutate({ contributionId: reviewContribution.id, adminNotes: adminNotes || undefined });
    }
  };

  const filteredContributions = contributions?.filter((c: any) =>
    typeFilter === "all" || c.contribution_type === typeFilter
  ) || [];

  if (user?.role !== 'admin') {
    return (
      <div className="container py-16 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Accès réservé aux administrateurs</h2>
        <p className="text-muted-foreground mb-4">Vous devez être administrateur pour accéder à cette page.</p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/data-quality">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
            <Leaf className="h-8 w-8 text-primary" />
            Contributions Plantes
          </h1>
          <p className="text-muted-foreground">
            Validation des contributions utilisateurs pour les fiches plantes
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{stats.total || 0}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="border-amber-500/30">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-amber-600">{stats.pending || 0}</p>
              <p className="text-sm text-muted-foreground">En attente</p>
            </CardContent>
          </Card>
          <Card className="border-green-500/30">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-600">{stats.approved || 0}</p>
              <p className="text-sm text-muted-foreground">Approuvées</p>
            </CardContent>
          </Card>
          <Card className="border-red-500/30">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-red-600">{stats.rejected || 0}</p>
              <p className="text-sm text-muted-foreground">Rejetées</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Statut :</span>
        </div>
        {[
          { value: "pending", label: "En attente", color: "amber" },
          { value: "approved", label: "Approuvées", color: "green" },
          { value: "rejected", label: "Rejetées", color: "red" },
          { value: undefined, label: "Toutes", color: "gray" },
        ].map((opt) => (
          <Button
            key={String(opt.value)}
            variant={statusFilter === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(opt.value as any)}
          >
            {opt.label}
          </Button>
        ))}

        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm font-medium">Type :</span>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="molecule">Molécules</SelectItem>
              <SelectItem value="terroir">Terroirs</SelectItem>
              <SelectItem value="note">Notes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Liste des contributions */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredContributions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Aucune contribution</h3>
            <p className="text-muted-foreground">
              {statusFilter === "pending"
                ? "Aucune contribution en attente de validation."
                : "Aucune contribution dans cette catégorie."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredContributions.map((contribution: any) => (
            <Card key={contribution.id} className={`transition-all hover:shadow-md ${
              contribution.status === 'pending' ? 'border-amber-500/20' :
              contribution.status === 'approved' ? 'border-green-500/20' :
              'border-red-500/20'
            }`}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* En-tête */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline" className={`gap-1 ${typeColors[contribution.contribution_type]}`}>
                        {typeIcons[contribution.contribution_type]}
                        {typeLabels[contribution.contribution_type]}
                      </Badge>
                      <ContributionStatusBadge status={contribution.status} />
                      <span className="text-sm font-medium">
                        <Link href={`/plantes/${contribution.plant_id}`} className="hover:text-primary">
                          {contribution.plant_name || `Plante #${contribution.plant_id}`}
                        </Link>
                      </span>
                      {contribution.plant_latin_name && (
                        <span className="text-sm text-muted-foreground italic">
                          ({contribution.plant_latin_name})
                        </span>
                      )}
                    </div>

                    {/* Contenu selon le type */}
                    <div className="text-sm space-y-1">
                      {contribution.contribution_type === 'image' && (
                        <div className="flex items-start gap-3">
                          {contribution.image_url && (
                            <img
                              src={contribution.image_url}
                              alt="Contribution"
                              className="w-16 h-16 object-cover rounded border flex-shrink-0"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          )}
                          <div>
                            {contribution.image_caption && <p className="font-medium">{contribution.image_caption}</p>}
                            {contribution.image_source && <p className="text-muted-foreground">Source : {contribution.image_source}</p>}
                            {contribution.image_url && (
                              <a href={contribution.image_url} target="_blank" rel="noopener noreferrer"
                                className="text-primary hover:underline text-xs break-all">
                                {contribution.image_url.substring(0, 80)}{contribution.image_url.length > 80 ? '...' : ''}
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {contribution.contribution_type === 'molecule' && (
                        <div>
                          <p className="font-medium">
                            {contribution.molecule_name || `Molécule #${contribution.molecule_id}`}
                            {contribution.molecule_id && (
                              <Link href={`/molecule/${contribution.molecule_id}`} className="ml-2 text-primary hover:underline text-xs">
                                → voir la fiche
                              </Link>
                            )}
                          </p>
                          {contribution.molecule_concentration && (
                            <p className="text-muted-foreground">Concentration : {contribution.molecule_concentration}</p>
                          )}
                          {contribution.molecule_source && (
                            <p className="text-muted-foreground">Source : {contribution.molecule_source}</p>
                          )}
                        </div>
                      )}

                      {contribution.contribution_type === 'terroir' && (
                        <div>
                          <p className="font-medium">
                            {[contribution.terroir, contribution.region, contribution.country].filter(Boolean).join(", ")}
                          </p>
                          {contribution.terroir_notes && (
                            <p className="text-muted-foreground line-clamp-2">{contribution.terroir_notes}</p>
                          )}
                        </div>
                      )}

                      {contribution.contribution_type === 'note' && (
                        <div>
                          {contribution.note_category && (
                            <Badge variant="outline" className="text-xs mb-1">{contribution.note_category}</Badge>
                          )}
                          <p className="line-clamp-3">{contribution.note_content}</p>
                        </div>
                      )}

                      {contribution.description && (
                        <p className="text-muted-foreground text-xs mt-1">
                          <span className="font-medium">Contexte :</span> {contribution.description}
                        </p>
                      )}
                      {contribution.references && (
                        <p className="text-muted-foreground text-xs">
                          <span className="font-medium">Réf. :</span> {contribution.references}
                        </p>
                      )}
                    </div>

                    {/* Métadonnées */}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>Par : <span className="font-medium">{contribution.user_name || contribution.user_id}</span></span>
                      <span>·</span>
                      <span>{new Date(contribution.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}</span>
                      {contribution.reviewed_by && (
                        <>
                          <span>·</span>
                          <span>Révisé par : {contribution.reviewed_by}</span>
                        </>
                      )}
                    </div>

                    {/* Notes admin */}
                    {contribution.admin_notes && (
                      <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                        <span className="font-medium">Note admin :</span> {contribution.admin_notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {contribution.status === 'pending' && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        className="gap-1.5 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setReviewContribution(contribution);
                          setReviewAction("approved");
                          setAdminNotes("");
                        }}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 border-red-500/30 text-red-600 hover:bg-red-500/10"
                        onClick={() => {
                          setReviewContribution(contribution);
                          setReviewAction("rejected");
                          setAdminNotes("");
                        }}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Rejeter
                      </Button>
                      <Link href={`/plantes/${contribution.plant_id}`}>
                        <Button size="sm" variant="ghost" className="gap-1.5 w-full">
                          <Eye className="h-3.5 w-3.5" />
                          Voir la fiche
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de révision */}
      <Dialog open={!!reviewContribution} onOpenChange={(open) => !open && setReviewContribution(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {reviewAction === "approved" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              {reviewAction === "approved" ? "Approuver" : "Rejeter"} la contribution
            </DialogTitle>
            <DialogDescription>
              {reviewAction === "approved"
                ? "La contribution sera intégrée à la fiche plante. Pour les molécules, le lien sera créé automatiquement."
                : "La contribution sera marquée comme rejetée. Vous pouvez laisser une note explicative."}
            </DialogDescription>
          </DialogHeader>

          {reviewContribution && (
            <div className="py-2">
              <div className="p-3 bg-muted/50 rounded text-sm mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className={`gap-1 ${typeColors[reviewContribution.contribution_type]}`}>
                    {typeIcons[reviewContribution.contribution_type]}
                    {typeLabels[reviewContribution.contribution_type]}
                  </Badge>
                  <span className="font-medium">{reviewContribution.plant_name}</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Soumis par {reviewContribution.user_name || reviewContribution.user_id}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Note administrative (optionnelle)</label>
                <Textarea
                  placeholder={reviewAction === "approved"
                    ? "Commentaire sur l'approbation..."
                    : "Raison du rejet, suggestions d'amélioration..."}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewContribution(null)}>
              Annuler
            </Button>
            <Button
              onClick={handleReview}
              disabled={approveMutation.isPending || rejectMutation.isPending}
              className={reviewAction === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {reviewAction === "approved" ? (
                <><CheckCircle className="h-4 w-4 mr-2" />Confirmer l'approbation</>
              ) : (
                <><XCircle className="h-4 w-4 mr-2" />Confirmer le rejet</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
