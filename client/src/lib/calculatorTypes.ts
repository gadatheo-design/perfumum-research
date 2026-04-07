export interface Ingredient {
  id: string;
  nom: string;
  pourcentage: number;
  prixMin: number;
  prixMax: number;
  categorie: string;
}

export interface SavedFormulation {
  id: string;
  nom: string;
  description: string;
  ingredients: Ingredient[];
  dateCreation: Date;
  dateModification: Date;
  notes: string;
  volume: number;
  concentration: number;
  prixEstime: {
    min: number;
    max: number;
  };
}
