# Audit des pages non importées dans App.tsx
*Réalisé le 2026-03-06 — 328 pages .tsx au total, 302 importées dans App.tsx*

## Résultat : 12 pages identifiées comme "non importées"

Après analyse approfondie, **aucune action d'intégration n'est nécessaire**. Toutes les pages sont soit déjà gérées via des redirects, soit des doublons remplacés par des versions plus récentes.

---

## Détail par page

| Page | Lignes | Statut | Explication |
|------|--------|--------|-------------|
| `Pyrolyse.tsx` | 672 | ✅ Importée | Importée via `./pages/methodologie/Pyrolyse` (sous-dossier) |
| `GammesBioLab.tsx` | 323 | ✅ Gérée | Redirect `/gammes/biolab` → `/gammes-hub?tab=bio-lab` |
| `GammesGlaciaire.tsx` | 320 | ✅ Gérée | Redirect `/gammes/glaciaire` → `/gammes-hub?tab=glaciaire` |
| `GammesMossi.tsx` | 409 | ✅ Gérée | Redirect `/gammes/mossi` → `/gammes-hub?tab=mossi` |
| `GammesPetrichor.tsx` | 342 | ✅ Gérée | Redirect `/gammes/petrichor` → `/gammes-hub?tab=petrichor` |
| `GammesVolcanique.tsx` | 307 | ✅ Gérée | Redirect `/gammes/volcanique` → `/gammes-hub?tab=volcanique` |
| `OutilsFormulation.tsx` | 248 | ✅ Gérée | Redirect `/outils-formulation` → `/outils-hub` |
| `CalculateurCout.tsx` | 1027 | ✅ Gérée | Redirect `/outils/calculateur-cout` → `/outils-hub?tab=calculateurs` |
| `DilutionCalculator.tsx` | 298 | ✅ Gérée | Redirect `/outils/dilution` → `/outils-hub?tab=calculateurs` |
| `ProportionsCalculator.tsx` | 441 | ✅ Gérée | Redirect `/calculateur` → `/outils-hub?tab=calculateurs` |
| `Dashboard.tsx` | 298 | ⚠️ Doublon | Remplacé par `MonDashboard`, `DashboardMinimal`, `DashboardRecherche` |
| `DataQualityDashboard.tsx` | 567 | ⚠️ Doublon | Remplacé par `DataQuality` dans `/admin/data-quality` |
| `AccordDetail.tsx` | 248 | ⚠️ Ancienne version | Utilise données JSON statiques, remplacé par `/recettes-hub?tab=accords` |
| `ComponentShowcase.tsx` | 1437 | 🗂️ Dev only | Page de démonstration des composants UI, usage développement uniquement |
| `Projet.tsx` | 175 | ⚠️ Doublon | Remplacé par `LeProjet` dans `/le-projet` |

---

## Pages candidates à la suppression future

Ces pages peuvent être supprimées lors d'un prochain nettoyage de code, après validation :

- `Dashboard.tsx` — doublon de `MonDashboard`
- `DataQualityDashboard.tsx` — doublon de `DataQuality`
- `AccordDetail.tsx` — ancienne version avec données statiques
- `Projet.tsx` — doublon de `LeProjet`
- `ComponentShowcase.tsx` — usage développement uniquement

**Note :** Ne pas supprimer les pages Gammes* et les calculateurs — ils contiennent du contenu spécifique qui pourrait être réintégré dans les hubs correspondants.

---

## Recommandations

1. **Conserver** les pages Gammes* et calculateurs comme archives de contenu
2. **Supprimer** les 4 doublons purs lors du prochain sprint de nettoyage
3. **Archiver** `ComponentShowcase.tsx` dans un dossier `_dev/` si nécessaire
4. **Vérifier** que `AdvancedSearch.tsx` (479L) n'est pas un doublon de `RechercheAvancee.tsx` (1339L)
