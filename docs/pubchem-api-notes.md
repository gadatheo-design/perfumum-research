# PubChem PUG REST API - Notes pour enrichissement des données

## URL de base
```
https://pubchem.ncbi.nlm.nih.gov/rest/pug/
```

## Recherche par nom de molécule
```
https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{molecule_name}/property/{properties}/JSON
```

## Propriétés disponibles
| Propriété | Description |
|-----------|-------------|
| MolecularFormula | Formule moléculaire |
| MolecularWeight | Poids moléculaire (g/mol) |
| IUPACName | Nom IUPAC systématique |
| CanonicalSMILES | SMILES canonique |
| InChI | Identifiant chimique international |
| InChIKey | Clé InChI (27 caractères) |
| XLogP | Coefficient de partage octanol-eau |
| ExactMass | Masse exacte |
| MonoisotopicMass | Masse monoisotopique |
| TPSA | Surface polaire topologique |
| Complexity | Complexité moléculaire |
| Charge | Charge totale |

## Exemple de requête pour enrichir une molécule
```
GET https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/limonene/property/IUPACName,MolecularFormula,MolecularWeight/JSON
```

## Récupérer les synonymes (inclut le numéro CAS)
```
GET https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/limonene/synonyms/JSON
```

Le numéro CAS est généralement inclus dans les synonymes au format "XXX-XX-X".

## Limites de l'API
- Maximum 5 requêtes par seconde
- Pas de clé API disponible
- Utiliser des délais entre les requêtes

## Stratégie d'enrichissement
1. Pour chaque molécule sans CAS/IUPAC :
   - Rechercher par nom dans PubChem
   - Récupérer IUPACName et synonymes
   - Extraire le CAS des synonymes (format XXX-XX-X)
   - Déterminer la classe chimique basée sur la structure
