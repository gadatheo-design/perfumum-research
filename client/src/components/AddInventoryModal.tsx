// @ts-nocheck
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Package, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddInventoryModalProps {
  rawMaterialId: number;
  rawMaterialName: string;
  onSuccess?: () => void;
}

export function AddInventoryModal({ rawMaterialId, rawMaterialName, onSuccess }: AddInventoryModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const utils = trpc.useUtils();

  // Form state
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<"ml" | "g" | "kg" | "L" | "oz" | "lb">("ml");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("CHF");
  const [supplierName, setSupplierName] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [storageLocation, setStorageLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [qualityNotes, setQualityNotes] = useState("");

  const addEntryMutation = trpc.rawMaterials.addInventoryEntry.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Entrée ajoutée",
        description: `Entrée ${data.entryId} créée avec succès`,
      });
      // Reset form
      setQuantity("");
      setPrice("");
      setSupplierName("");
      setBatchNumber("");
      setExpirationDate("");
      setStorageLocation("");
      setNotes("");
      setQualityNotes("");
      // Refresh data
      utils.rawMaterials.getInventory.invalidate({ rawMaterialId });
      utils.rawMaterials.getInventoryStats.invalidate();
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quantity || !price) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir la quantité et le prix",
        variant: "destructive",
      });
      return;
    }

    addEntryMutation.mutate({
      rawMaterialId,
      purchaseDate,
      quantity: parseFloat(quantity),
      unit,
      price: parseFloat(price),
      currency,
      supplierName: supplierName || undefined,
      batchNumber: batchNumber || undefined,
      expirationDate: expirationDate || undefined,
      storageLocation: storageLocation || undefined,
      notes: notes || undefined,
      qualityNotes: qualityNotes || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une entrée
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Nouvelle entrée d'inventaire
          </DialogTitle>
          <DialogDescription>
            Enregistrer un achat de <strong>{rawMaterialName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date d'achat */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Date d'achat *</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplierName">Fournisseur</Label>
              <Input
                id="supplierName"
                placeholder="Ex: Eden Botanicals"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
              />
            </div>
          </div>

          {/* Quantité et unité */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="quantity">Quantité *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 1.5"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unité</Label>
              <Select value={unit} onValueChange={(v) => setUnit(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="oz">oz</SelectItem>
                  <SelectItem value="lb">lb</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Prix et devise */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="price">Prix total *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 25.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CHF">CHF</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lot et expiration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batchNumber">Numéro de lot</Label>
              <Input
                id="batchNumber"
                placeholder="Ex: LOT-2025-001"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expirationDate">Date d'expiration</Label>
              <Input
                id="expirationDate"
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>
          </div>

          {/* Stockage */}
          <div className="space-y-2">
            <Label htmlFor="storageLocation">Emplacement de stockage</Label>
            <Input
              id="storageLocation"
              placeholder="Ex: Armoire A, étagère 3"
              value={storageLocation}
              onChange={(e) => setStorageLocation(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Notes générales sur cet achat..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualityNotes">Notes de qualité</Label>
            <Textarea
              id="qualityNotes"
              placeholder="Observations sur la qualité du produit..."
              value={qualityNotes}
              onChange={(e) => setQualityNotes(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={addEntryMutation.isPending}>
              {addEntryMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
