// @ts-nocheck
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Link2,
  BookOpen,
  Leaf,
  Beaker,
  Package,
  Zap,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';

type EntityType = 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier' | 'leaf_economy';
type LinkType = 'documents' | 'mentions' | 'analyzes' | 'conserves' | 'reconstructs' | 'sources' | 'validates' | 'contextualizes';

const ENTITY_TYPES: Record<EntityType, { label: string; icon: React.ReactNode }> = {
  molecule: { label: 'Molecule', icon: <Beaker className="w-4 h-4" /> },
  recette: { label: 'Recipe', icon: <Package className="w-4 h-4" /> },
  plant: { label: 'Plant', icon: <Leaf className="w-4 h-4" /> },
  prototype: { label: 'Prototype', icon: <Zap className="w-4 h-4" /> },
  tradition: { label: 'Tradition', icon: <Globe className="w-4 h-4" /> },
  terroir: { label: 'Terroir', icon: <Globe className="w-4 h-4" /> },
  supplier: { label: 'Supplier', icon: <Package className="w-4 h-4" /> },
  leaf_economy: { label: 'Leaf Economy', icon: <Leaf className="w-4 h-4" /> },
};

const LINK_TYPES: Record<LinkType, string> = {
  documents: 'Documents',
  mentions: 'Mentions',
  analyzes: 'Analyzes',
  conserves: 'Conserves',
  reconstructs: 'Reconstructs',
  sources: 'Sources',
  validates: 'Validates',
  contextualizes: 'Contextualizes',
};

export default function ReferenceEntityLinkManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType>('molecule');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    referenceId: '',
    entityId: '',
    linkType: 'documents' as LinkType,
    relevanceScore: 50,
    notes: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch data
  const { data: references } = trpc.v3References.getAll.useQuery();
  const { data: links, isLoading: loadingLinks, refetch: refetchLinks } = trpc.referenceEntityLinks.getStats.useQuery();
  const { data: molecules } = trpc.molecules?.getAll.useQuery();
  const { data: plants } = trpc.plants?.getAll.useQuery();
  
  // Mutations
  const createLinkMutation = trpc.referenceEntityLinks.create.useMutation();
  const updateLinkMutation = trpc.referenceEntityLinks.update.useMutation();
  const deleteLinkMutation = trpc.referenceEntityLinks.delete.useMutation();

  const getEntitiesForType = (type: EntityType) => {
    switch (type) {
      case 'molecule':
        return molecules || [];
      case 'plant':
        return plants || [];
      default:
        return [];
    }
  };

  const handleCreateLink = async () => {
    if (!formData.referenceId || !formData.entityId) {
      setSubmitError('Please select both a reference and an entity');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createLinkMutation.mutateAsync({
        referenceId: parseInt(formData.referenceId),
        entityType: selectedEntityType,
        entityId: parseInt(formData.entityId),
        linkType: formData.linkType,
        relevanceScore: formData.relevanceScore,
        notes: formData.notes || undefined,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setShowCreateDialog(false);
        setFormData({
          referenceId: '',
          entityId: '',
          linkType: 'documents',
          relevanceScore: 50,
          notes: '',
        });
        setSubmitSuccess(false);
        refetchLinks();
      }, 1500);
    } catch (error: any) {
      setSubmitError(error.message || 'Error creating link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLink = async (linkId: number) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      await deleteLinkMutation.mutateAsync(linkId);
      refetchLinks();
    } catch (error: any) {
      setSubmitError(error.message || 'Error deleting link');
    }
  };

  const filteredLinks = links?.filter((link: any) => {
    const matchesSearch = searchQuery === '' ||
      link.reference?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.reference?.authors?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedEntityType === 'molecule' || link.entityType === selectedEntityType;
    
    return matchesSearch && matchesType;
  }) || [];

  return (
    <div className="container py-8">
      <Breadcrumbs />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reference-Entity Link Manager</h1>
        <p className="text-muted-foreground">
          Manage connections between bibliographic references and research entities
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{links?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Links</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Beaker className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {links?.filter((l: any) => l.entityType === 'molecule').length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Molecule Links</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Leaf className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {links?.filter((l: any) => l.entityType === 'plant').length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Plant Links</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Zap className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {links?.filter((l: any) => l.entityType === 'prototype').length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Prototype Links</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by reference title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedEntityType} onValueChange={(val) => setSelectedEntityType(val as EntityType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ENTITY_TYPES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Link
        </Button>
      </div>

      {/* Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
          <CardDescription>
            {filteredLinks.length} link{filteredLinks.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingLinks ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No links found
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLinks.map((link: any) => (
                <div key={link.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {ENTITY_TYPES[link.entityType]?.icon}
                        <h3 className="font-medium text-sm">
                          {link.reference?.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {link.reference?.authors} ({link.reference?.year})
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {ENTITY_TYPES[link.entityType]?.label}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {LINK_TYPES[link.linkType]}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Relevance: {link.relevanceScore}%
                        </Badge>
                      </div>
                      {link.notes && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          "{link.notes}"
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingLink(link);
                          setShowEditDialog(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Link Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Create New Link
            </DialogTitle>
            <DialogDescription>
              Link a bibliographic reference to a research entity
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Entity Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Entity Type</label>
              <Select value={selectedEntityType} onValueChange={(val) => setSelectedEntityType(val as EntityType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ENTITY_TYPES).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reference Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Reference</label>
              <Select value={formData.referenceId} onValueChange={(val) => setFormData({ ...formData, referenceId: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reference..." />
                </SelectTrigger>
                <SelectContent>
                  {references?.map((ref: any) => (
                    <SelectItem key={ref.id} value={ref.id.toString()}>
                      {ref.title} ({ref.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Entity Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Entity</label>
              <Select value={formData.entityId} onValueChange={(val) => setFormData({ ...formData, entityId: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an entity..." />
                </SelectTrigger>
                <SelectContent>
                  {getEntitiesForType(selectedEntityType).map((entity: any) => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Link Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Link Type</label>
              <Select value={formData.linkType} onValueChange={(val) => setFormData({ ...formData, linkType: val as LinkType })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LINK_TYPES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Relevance Score */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Relevance: {formData.relevanceScore}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.relevanceScore}
                onChange={(e) => setFormData({ ...formData, relevanceScore: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
              <Textarea
                placeholder="Add notes about this link..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            {/* Success Message */}
            {submitSuccess && (
              <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-sm text-green-600">Link created successfully!</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateLink}
                disabled={isSubmitting || !formData.referenceId || !formData.entityId}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Create Link
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
