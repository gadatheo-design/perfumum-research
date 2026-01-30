# PERFUMUM References - Niche Innovations DevPack v3

Ce pack contient **69 nouvelles références** orientées vers les innovations de niche dans le domaine olfactif.

## Contenu du pack

| Fichier | Description |
|---------|-------------|
| `PERFUMUM_References_NicheInnovations_v3.csv` | Données structurées (69 entrées) |
| `PERFUMUM_References_NicheInnovations_v3.bib` | Format BibTeX pour citation |
| `PERFUMUM_References_NicheInnovations_v3_NotionReady.md` | Format Markdown pour Notion |

## Structure des données CSV

Les colonnes du fichier CSV sont :
- `key` : Clé BibTeX unique
- `type` : Type de référence (book, article, etc.)
- `axis_primary` : Axe de recherche principal
- `axes_secondary` : Axes secondaires (séparés par `;`)
- `title` : Titre de la référence
- `authors` : Auteurs
- `year` : Année de publication
- `container_title` : Journal/Revue
- `publisher` : Éditeur
- `doi` : Identifiant DOI
- `isbn` : ISBN (pour les livres)
- `url` : URL de la ressource
- `notes` : Notes et commentaires
- `tags` : Tags/mots-clés

## Nouveaux axes de recherche

Ce pack introduit de nouveaux axes thématiques :
- **A1** : Smell studies & critical theory
- **B1** : Olfactory art & aesthetics
- **C1** : Olfactory heritage
- Et d'autres axes secondaires

## Intégration

Pour intégrer ce pack dans la base de données PERFUMUM, exécuter :

```bash
cd /home/ubuntu/perfumum-research
node scripts/import-references-v3.mjs
```

**Note** : Le script d'import v3 doit être créé en adaptant `scripts/import-references-v2.mjs` pour gérer les nouveaux axes et la structure multi-axes.

## Statut

- [ ] En attente d'intégration
- [ ] Script d'import créé
- [ ] Données importées
- [ ] Validation effectuée
