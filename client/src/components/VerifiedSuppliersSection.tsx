import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Award, 
  Star, 
  CheckCircle2, 
  ExternalLink,
  Search,
  Leaf,
  Factory,
  Users,
  FlaskConical,
  Hammer
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VerifiedSuppliersSectionProps {
  alternativeId?: number;
  showTitle?: boolean;
}

const companyTypeLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  producer: { label: 'Producteur', icon: <Leaf className="h-4 w-4" />, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  cooperative: { label: 'Coopérative', icon: <Users className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  distributor: { label: 'Distributeur', icon: <Building2 className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  laboratory: { label: 'Laboratoire', icon: <FlaskConical className="h-4 w-4" />, color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' },
  biotechnology: { label: 'Biotechnologie', icon: <Factory className="h-4 w-4" />, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
  artisan: { label: 'Artisan', icon: <Hammer className="h-4 w-4" />, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
  other: { label: 'Autre', icon: <Building2 className="h-4 w-4" />, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
};

function RatingStars({ rating, label }: { rating: number | null | undefined; label: string }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground">{label}:</span>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
}

export function VerifiedSuppliersSection({ alternativeId, showTitle = true }: VerifiedSuppliersSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  // Récupérer les fournisseurs selon le contexte
  const { data: allSuppliers, isLoading: loadingAll } = trpc.verifiedSuppliers.list.useQuery(
    undefined,
    { enabled: !alternativeId }
  );

  const { data: suppliersByAlternative, isLoading: loadingByAlt } = trpc.verifiedSuppliers.getByAlternative.useQuery(
    { alternativeId: alternativeId! },
    { enabled: !!alternativeId }
  );

  const { data: stats } = trpc.verifiedSuppliers.getStats.useQuery();

  const isLoading = alternativeId ? loadingByAlt : loadingAll;
  
  // Transformer les données pour avoir un format uniforme
  const suppliers = alternativeId 
    ? (suppliersByAlternative?.map(s => ({ ...s.supplier, linkInfo: s.link })) || [])
    : (allSuppliers || []);

  // Filtrer les fournisseurs
  const filteredSuppliers = suppliers.filter(supplier => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!supplier.name.toLowerCase().includes(query) && 
          !supplier.country.toLowerCase().includes(query) &&
          !(supplier.region?.toLowerCase().includes(query))) {
        return false;
      }
    }
    if (typeFilter && supplier.companyType !== typeFilter) return false;
    if (verifiedOnly && !supplier.verified) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center gap-3">
          <Award className="h-8 w-8 text-emerald-600" />
          <div>
            <h2 className="text-2xl font-bold">Fournisseurs Vérifiés</h2>
            <p className="text-muted-foreground">
              Sources éthiques et durables pour les alternatives aux espèces menacées
            </p>
          </div>
        </div>
      )}

      {/* Statistiques */}
      {stats && !alternativeId && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-4 text-center">
              <Building2 className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.total}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Total fournisseurs</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.verified}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Vérifiés</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4 text-center">
              <Globe className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.byCountry?.length || 0}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Pays</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.byType?.length || 0}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">Types</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un fournisseur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v === 'all' ? undefined : v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type d'entreprise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="producer">Producteur</SelectItem>
                <SelectItem value="cooperative">Coopérative</SelectItem>
                <SelectItem value="distributor">Distributeur</SelectItem>
                <SelectItem value="laboratory">Laboratoire</SelectItem>
                <SelectItem value="biotechnology">Biotechnologie</SelectItem>
                <SelectItem value="artisan">Artisan</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={verifiedOnly ? "default" : "outline"}
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Vérifiés uniquement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des fournisseurs */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement des fournisseurs...</p>
        </div>
      ) : filteredSuppliers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSuppliers.map((supplier: any) => {
            const typeInfo = companyTypeLabels[supplier.companyType] || companyTypeLabels.other;
            const certifications = supplier.certifications ? 
              (typeof supplier.certifications === 'string' ? JSON.parse(supplier.certifications) : supplier.certifications) : [];
            const specialties = supplier.specialties ?
              (typeof supplier.specialties === 'string' ? JSON.parse(supplier.specialties) : supplier.specialties) : [];

            return (
              <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {supplier.name}
                        {supplier.verified && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {supplier.region ? `${supplier.region}, ` : ''}{supplier.country}
                      </CardDescription>
                    </div>
                    <Badge className={typeInfo.color}>
                      <span className="flex items-center gap-1">
                        {typeInfo.icon}
                        {typeInfo.label}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Ratings */}
                  <div className="flex flex-wrap gap-3">
                    <RatingStars rating={supplier.sustainabilityRating} label="Durabilité" />
                    <RatingStars rating={supplier.qualityRating} label="Qualité" />
                    <RatingStars rating={supplier.reliabilityRating} label="Fiabilité" />
                  </div>

                  {/* Certifications */}
                  {certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {certifications.slice(0, 3).map((cert: any, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          {cert.name}
                        </Badge>
                      ))}
                      {certifications.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{certifications.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Spécialités */}
                  {specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {specialties.slice(0, 3).map((spec: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Contact rapide */}
                  <div className="flex gap-2 pt-2 border-t">
                    {supplier.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={supplier.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {supplier.email && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${supplier.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {supplier.phone && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${supplier.phone}`}>
                          <Phone className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="default" size="sm" className="ml-auto" onClick={() => setSelectedSupplier(supplier)}>
                          Détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {supplier.name}
                            {supplier.verified && (
                              <Badge className="bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Vérifié
                              </Badge>
                            )}
                          </DialogTitle>
                          <DialogDescription>
                            <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                            <span className="ml-2">{supplier.region ? `${supplier.region}, ` : ''}{supplier.country}</span>
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 mt-4">
                          {/* Coordonnées */}
                          <div className="grid grid-cols-2 gap-4">
                            {supplier.address && (
                              <div>
                                <p className="text-sm font-medium">Adresse</p>
                                <p className="text-sm text-muted-foreground">{supplier.address}</p>
                              </div>
                            )}
                            {supplier.contactPerson && (
                              <div>
                                <p className="text-sm font-medium">Contact</p>
                                <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
                              </div>
                            )}
                            {supplier.email && (
                              <div>
                                <p className="text-sm font-medium">Email</p>
                                <a href={`mailto:${supplier.email}`} className="text-sm text-blue-600 hover:underline">
                                  {supplier.email}
                                </a>
                              </div>
                            )}
                            {supplier.phone && (
                              <div>
                                <p className="text-sm font-medium">Téléphone</p>
                                <a href={`tel:${supplier.phone}`} className="text-sm text-blue-600 hover:underline">
                                  {supplier.phone}
                                </a>
                              </div>
                            )}
                            {supplier.website && (
                              <div>
                                <p className="text-sm font-medium">Site web</p>
                                <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                  Visiter <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Ratings détaillés */}
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm font-medium mb-3">Évaluations</p>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground mb-1">Durabilité</p>
                                <div className="flex justify-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${star <= (supplier.sustainabilityRating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground mb-1">Qualité</p>
                                <div className="flex justify-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${star <= (supplier.qualityRating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground mb-1">Fiabilité</p>
                                <div className="flex justify-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${star <= (supplier.reliabilityRating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Pratiques durables */}
                          {supplier.sustainablePractices && (
                            <div>
                              <p className="text-sm font-medium mb-2">Pratiques durables</p>
                              <p className="text-sm text-muted-foreground">{supplier.sustainablePractices}</p>
                            </div>
                          )}

                          {/* Certifications complètes */}
                          {certifications.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Certifications</p>
                              <div className="space-y-2">
                                {certifications.map((cert: any, idx: number) => (
                                  <div key={idx} className="flex items-center justify-between bg-muted/30 p-2 rounded">
                                    <div className="flex items-center gap-2">
                                      <Award className="h-4 w-4 text-emerald-600" />
                                      <span className="text-sm font-medium">{cert.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      {cert.issuer && <span>{cert.issuer}</span>}
                                      {cert.validUntil && <span>• Valide jusqu'au {cert.validUntil}</span>}
                                      {cert.certificateUrl && (
                                        <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                                          <ExternalLink className="h-3 w-3" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Informations commerciales */}
                          <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                            {supplier.minimumOrderQuantity && (
                              <div>
                                <p className="text-xs text-muted-foreground">Commande minimum</p>
                                <p className="text-sm font-medium">{supplier.minimumOrderQuantity}</p>
                              </div>
                            )}
                            {supplier.leadTime && (
                              <div>
                                <p className="text-xs text-muted-foreground">Délai de livraison</p>
                                <p className="text-sm font-medium">{supplier.leadTime}</p>
                              </div>
                            )}
                            {supplier.paymentTerms && (
                              <div>
                                <p className="text-xs text-muted-foreground">Conditions de paiement</p>
                                <p className="text-sm font-medium">{supplier.paymentTerms}</p>
                              </div>
                            )}
                          </div>

                          {/* Notes */}
                          {supplier.notes && (
                            <div>
                              <p className="text-sm font-medium mb-2">Notes</p>
                              <p className="text-sm text-muted-foreground">{supplier.notes}</p>
                            </div>
                          )}

                          {/* Vérification */}
                          {supplier.verified && supplier.verifiedBy && (
                            <div className="text-xs text-muted-foreground border-t pt-3">
                              Vérifié par {supplier.verifiedBy}
                              {supplier.verifiedAt && ` le ${new Date(supplier.verifiedAt).toLocaleDateString('fr-FR')}`}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery || typeFilter || verifiedOnly
                ? "Aucun fournisseur ne correspond à vos critères."
                : "Aucun fournisseur enregistré pour le moment."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
