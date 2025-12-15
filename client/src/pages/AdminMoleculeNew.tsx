import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminMoleculeNew() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    chemicalFormula: "",
    chemicalFamily: "",
    functionalEffect: "",
    olfactiveProfile: "",
    emotionalResonance: "",
    cas: "",
    source: "",
  });

  const createMolecule = trpc.molecules.create.useMutation({
    onSuccess: () => {
      toast.success("Molécule créée avec succès !");
      setLocation("/admin/molecules");
    },
    onError: (error: any) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.chemicalFamily) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    createMolecule.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        <section className="section-spacing">
          <div className="container max-w-3xl">
            <Button
              variant="ghost"
              onClick={() => setLocation("/admin")}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'administration
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Nouvelle Molécule</CardTitle>
                <CardDescription>
                  Ajouter une nouvelle molécule olfactive au catalogue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nom */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nom de la molécule <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Ex: Géosmine"
                      required
                    />
                  </div>

                  {/* Formule chimique */}
                  <div className="space-y-2">
                    <Label htmlFor="chemicalFormula">Formule chimique</Label>
                    <Input
                      id="chemicalFormula"
                      value={formData.chemicalFormula}
                      onChange={(e) => handleChange("chemicalFormula", e.target.value)}
                      placeholder="Ex: C12H22O"
                    />
                  </div>

                  {/* Famille chimique */}
                  <div className="space-y-2">
                    <Label htmlFor="chemicalFamily">
                      Famille chimique <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="chemicalFamily"
                      value={formData.chemicalFamily}
                      onChange={(e) => handleChange("chemicalFamily", e.target.value)}
                      placeholder="Ex: Terpènes, Aldéhydes, Cétones..."
                      required
                    />
                  </div>

                  {/* Effet fonctionnel */}
                  <div className="space-y-2">
                    <Label htmlFor="functionalEffect">Effet fonctionnel</Label>
                    <Input
                      id="functionalEffect"
                      value={formData.functionalEffect}
                      onChange={(e) => handleChange("functionalEffect", e.target.value)}
                      placeholder="Ex: Fixateur, Modificateur, Note de tête..."
                    />
                  </div>

                  {/* Profil olfactif */}
                  <div className="space-y-2">
                    <Label htmlFor="olfactiveProfile">Profil olfactif</Label>
                    <Textarea
                      id="olfactiveProfile"
                      value={formData.olfactiveProfile}
                      onChange={(e) => handleChange("olfactiveProfile", e.target.value)}
                      placeholder="Description détaillée du profil olfactif..."
                      rows={4}
                    />
                  </div>

                  {/* Résonance émotionnelle */}
                  <div className="space-y-2">
                    <Label htmlFor="emotionalResonance">Résonance émotionnelle</Label>
                    <Textarea
                      id="emotionalResonance"
                      value={formData.emotionalResonance}
                      onChange={(e) => handleChange("emotionalResonance", e.target.value)}
                      placeholder="Impact émotionnel et psychologique..."
                      rows={3}
                    />
                  </div>

                  {/* Numéro CAS */}
                  <div className="space-y-2">
                    <Label htmlFor="cas">Numéro CAS</Label>
                    <Input
                      id="cas"
                      value={formData.cas}
                      onChange={(e) => handleChange("cas", e.target.value)}
                      placeholder="Ex: 19700-21-1"
                    />
                  </div>

                  {/* Source */}
                  <div className="space-y-2">
                    <Label htmlFor="source">Source</Label>
                    <Select value={formData.source} onValueChange={(value) => handleChange("source", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="naturelle">Naturelle</SelectItem>
                        <SelectItem value="synthetique">Synthétique</SelectItem>
                        <SelectItem value="biosynthetique">Biosynthétique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={createMolecule.isPending}
                      className="flex-1"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {createMolecule.isPending ? "Création..." : "Créer la molécule"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/admin")}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    <Footer />

    </div>
  );
}
