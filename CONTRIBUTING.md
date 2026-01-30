# 🤝 GUIDE DE CONTRIBUTION — PERFUMUM

**Version:** 1.0  
**Date:** 12 janvier 2026  
**Auteur:** Manus AI

---

## 📋 Table des Matières

1. [Bienvenue](#bienvenue)
2. [Avant de commencer](#avant-de-commencer)
3. [Workflow de contribution](#workflow-de-contribution)
4. [Conventions de code](#conventions-de-code)
5. [Écrire des tests](#écrire-des-tests)
6. [Soumettre une PR](#soumettre-une-pr)
7. [Processus de review](#processus-de-review)
8. [FAQ](#faq)

---

## Bienvenue

Merci de vouloir contribuer à **PERFUMUM** ! Ce projet est une initiative de recherche olfactive sur **10 ans (2025-2035)**, et votre contribution est précieuse.

### Types de contributions

- 🐛 **Corriger des bugs** — Signaler et corriger les problèmes
- ✨ **Ajouter des features** — Nouvelles fonctionnalités
- 📚 **Améliorer la documentation** — Docs, README, commentaires
- 🎨 **Améliorer l'UX/UI** — Design et accessibilité
- 🧪 **Ajouter des tests** — Augmenter la couverture de tests
- 📊 **Enrichir les données** — Ajouter des molécules, recettes, etc.

---

## Avant de commencer

### Prérequis

- **Node.js 22+** — Runtime JavaScript
- **pnpm** — Gestionnaire de paquets
- **Git** — Contrôle de version
- **MySQL 8+** — Base de données
- **Compte Manus** — Pour l'authentification OAuth

### Installation locale

```bash
# 1. Cloner le dépôt
git clone https://github.com/perfumum/perfumum-research.git
cd perfumum-research

# 2. Installer les dépendances
pnpm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos credentials

# 4. Initialiser la base de données
pnpm db:push

# 5. Démarrer le serveur de développement
pnpm dev

# 6. Ouvrir dans le navigateur
# http://localhost:3000
```

### Structure du projet

```
perfumum-research/
├── client/           # Frontend React
├── server/           # Backend Express + tRPC
├── drizzle/          # Schéma DB + migrations
├── shared/           # Code partagé
├── ARCHITECTURE.md   # Vue d'ensemble technique
├── DATABASE.md       # Documentation DB
├── todo.md           # Suivi des tâches
└── README.md         # Ce fichier
```

---

## Workflow de contribution

### 1. Créer une issue

Avant de commencer à coder, créez une issue pour discuter de votre idée :

```markdown
# Titre descriptif

## Description
Expliquez le problème ou la feature proposée.

## Contexte
Pourquoi c'est important ? Quel est le cas d'usage ?

## Solution proposée
Comment allez-vous le résoudre ?

## Acceptance criteria
- [ ] Critère 1
- [ ] Critère 2
```

### 2. Créer une branche

```bash
# Créer une branche avec un nom descriptif
git checkout -b feature/nom-descriptif
# ou
git checkout -b fix/nom-du-bug
# ou
git checkout -b docs/nom-de-la-doc
```

### 3. Développer la feature

```bash
# Éditer les fichiers nécessaires
# Voir les sections ci-dessous pour les conventions

# Tester localement
pnpm dev

# Vérifier les erreurs TypeScript
pnpm check

# Formater le code
pnpm format
```

### 4. Écrire des tests

```bash
# Créer des tests pour votre feature
# Voir la section "Écrire des tests" ci-dessous

# Exécuter les tests
pnpm test

# Vérifier la couverture
pnpm test --coverage
```

### 5. Committer les changements

```bash
# Ajouter les fichiers modifiés
git add .

# Committer avec un message descriptif
git commit -m "feat: ajouter la feature X

- Description détaillée du changement
- Pourquoi c'est nécessaire
- Comment ça fonctionne"
```

### 6. Pousser et créer une PR

```bash
# Pousser la branche
git push origin feature/nom-descriptif

# Créer une Pull Request sur GitHub
# Remplir le template de PR
```

---

## Conventions de code

### Nommage

| Type | Convention | Exemple |
|------|-----------|---------|
| **Variables** | camelCase | `moleculeCount`, `isLoading` |
| **Constantes** | UPPER_SNAKE_CASE | `MAX_MOLECULES`, `API_URL` |
| **Fonctions** | camelCase | `getMolecule()`, `createRecipe()` |
| **Classes** | PascalCase | `MoleculeCard`, `RecipeForm` |
| **Fichiers** | kebab-case (composants: PascalCase) | `molecule-detail.ts`, `MoleculeCard.tsx` |
| **Branches** | kebab-case | `feature/add-molecule`, `fix/search-bug` |

### Formatage du code

```bash
# Formater automatiquement
pnpm format

# Vérifier le formatage
pnpm format --check
```

### Commentaires

```typescript
// ❌ Mauvais: Commentaire inutile
const x = 5; // Assigner 5 à x

// ✅ Bon: Commentaire explicatif
const MAX_MOLECULE_SEARCH_RESULTS = 5; // Limiter les résultats pour performance

// ✅ Bon: Documenter les fonctions complexes
/**
 * Calcule la similarité entre deux molécules basée sur leurs profils olfactifs
 * @param mol1 - Première molécule
 * @param mol2 - Deuxième molécule
 * @returns Score de similarité entre 0 et 1
 */
function calculateMoleculeSimilarity(mol1: Molecule, mol2: Molecule): number {
  // Implémentation...
}
```

### TypeScript

```typescript
// ❌ Mauvais: Pas de types
const getMolecule = (id) => {
  // ...
};

// ✅ Bon: Types explicites
const getMolecule = (id: number): Promise<Molecule> => {
  // ...
};

// ✅ Bon: Utiliser les types génériques
interface ApiResponse<T> {
  data: T;
  error?: string;
}

const response: ApiResponse<Molecule[]> = {
  data: molecules,
};
```

### React

```typescript
// ❌ Mauvais: Pas de memoization
export const MoleculeCard = ({ molecule }) => {
  return <div>{molecule.name}</div>;
};

// ✅ Bon: Memoization pour performance
export const MoleculeCard = memo(({ molecule }: { molecule: Molecule }) => {
  return <div>{molecule.name}</div>;
});

// ❌ Mauvais: Logique dans le render
export const MoleculeList = () => {
  return (
    <div>
      {molecules.map((m) => (
        <div key={m.id} onClick={() => console.log(m.id)}>
          {m.name}
        </div>
      ))}
    </div>
  );
};

// ✅ Bon: Logique séparée
export const MoleculeList = () => {
  const handleMoleculeClick = useCallback((id: number) => {
    console.log(id);
  }, []);

  return (
    <div>
      {molecules.map((m) => (
        <MoleculeCard key={m.id} molecule={m} onClick={handleMoleculeClick} />
      ))}
    </div>
  );
};
```

### tRPC

```typescript
// ❌ Mauvais: Pas de validation
export const appRouter = router({
  molecules: {
    create: publicProcedure
      .input((data) => data) // Pas de validation !
      .mutation(async ({ input }) => {
        // ...
      }),
  },
});

// ✅ Bon: Validation avec Zod
export const appRouter = router({
  molecules: {
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          casNumber: z.string().optional(),
          formula: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Entrée validée !
        return db.createMolecule(input);
      }),
  },
});
```

---

## Écrire des tests

### Structure des tests

```typescript
// ✅ Bon: Tests clairs et organisés
describe("molecules", () => {
  describe("create", () => {
    it("should create a molecule with valid input", async () => {
      const result = await db.createMolecule({
        name: "Limonene",
        casNumber: "138-86-3",
      });

      expect(result).toBeDefined();
      expect(result.name).toBe("Limonene");
    });

    it("should throw error with invalid input", async () => {
      await expect(
        db.createMolecule({
          name: "", // Invalide
        })
      ).rejects.toThrow();
    });
  });

  describe("getById", () => {
    it("should return molecule by id", async () => {
      const molecule = await db.getMoleculeById(1);
      expect(molecule).toBeDefined();
      expect(molecule?.id).toBe(1);
    });

    it("should return null for non-existent id", async () => {
      const molecule = await db.getMoleculeById(999999);
      expect(molecule).toBeNull();
    });
  });
});
```

### Exécuter les tests

```bash
# Exécuter tous les tests
pnpm test

# Exécuter un fichier spécifique
pnpm test molecules.test.ts

# Exécuter en mode watch
pnpm test --watch

# Vérifier la couverture
pnpm test --coverage
```

---

## Soumettre une PR

### Template de PR

```markdown
## Description
Décrivez les changements apportés.

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle feature
- [ ] Breaking change
- [ ] Documentation

## Tests
- [ ] Tests unitaires ajoutés
- [ ] Tests passent localement
- [ ] Couverture de tests vérifiée

## Checklist
- [ ] Code formaté (`pnpm format`)
- [ ] Pas d'erreurs TypeScript (`pnpm check`)
- [ ] Documentation mise à jour
- [ ] Responsive testé
- [ ] Performance vérifiée

## Screenshots (si applicable)
Ajouter des captures d'écran pour les changements UI.

## Notes supplémentaires
Toute information additionnelle pertinente.
```

### Conseils pour une bonne PR

- **Petites PRs** — Préférer plusieurs petites PRs à une grosse
- **Description claire** — Expliquer le "pourquoi" pas juste le "quoi"
- **Tests inclus** — Toujours inclure des tests
- **Documentation** — Mettre à jour la doc si nécessaire
- **Commits propres** — Messages de commit descriptifs

---

## Processus de review

### Qu'attendre d'une review

1. **Vérification du code** — Qualité, style, performance
2. **Vérification des tests** — Couverture, cas limites
3. **Vérification de la documentation** — Clarté, complétude
4. **Vérification de la sécurité** — Validation, authentification
5. **Vérification de l'accessibilité** — WCAG, keyboard nav

### Répondre aux commentaires

- ✅ **Accepter les suggestions** — Implémenter les changements
- 💬 **Discuter poliment** — Expliquer votre point de vue
- 🔄 **Pousser les changements** — La PR se met à jour automatiquement

### Après l'approbation

```bash
# Mettre à jour votre branche avec main
git fetch origin
git rebase origin/main

# Pousser les changements
git push origin feature/nom-descriptif

# Merger la PR (le mainteneur le fera)
```

---

## FAQ

### Q: Comment puis-je commencer ?

**R:** Regardez les issues marquées `good first issue` ou `help wanted`. Lisez la documentation et installez le projet localement.

### Q: Dois-je écrire des tests ?

**R:** Oui, c'est obligatoire. Chaque feature doit avoir des tests unitaires. Cela garantit la qualité et prévient les régressions.

### Q: Combien de temps prend une review ?

**R:** Généralement 24-48 heures. Les PRs simples sont plus rapides. Soyez patient !

### Q: Puis-je modifier la base de données ?

**R:** Oui, mais créez une migration avec Drizzle. Ne modifiez pas directement le schéma SQL. Voir `DATABASE.md` pour les détails.

### Q: Comment puis-je tester les changements de performance ?

**R:** Utilisez les DevTools du navigateur (onglet Performance) ou l'extension React Profiler. Vérifiez aussi les requêtes DB avec `pnpm db:debug`.

### Q: Puis-je ajouter une nouvelle dépendance ?

**R:** Oui, mais d'abord discutez-le dans une issue. Vérifiez que la dépendance est bien maintenue et n'ajoute pas trop de poids.

### Q: Comment puis-je contribuer aux données ?

**R:** Utilisez l'interface `/contributor` pour ajouter des molécules, recettes, plantes, etc. Voir `todo.md` pour les priorités.

### Q: Puis-je contribuer en tant que non-développeur ?

**R:** Absolument ! Vous pouvez :
- Signaler des bugs
- Améliorer la documentation
- Enrichir les données
- Tester l'accessibilité
- Suggérer des améliorations UX

---

## 📞 Besoin d'aide ?

- 📖 **Documentation** — Voir `ARCHITECTURE.md` et `DATABASE.md`
- 💬 **Discussions** — Ouvrir une issue pour discuter
- 🐛 **Bugs** — Signaler avec des détails et étapes de reproduction
- 💡 **Suggestions** — Nous adorons les idées !

---

**Merci de contribuer à PERFUMUM !** 🌿✨

*Dernière mise à jour: 12 janvier 2026*
