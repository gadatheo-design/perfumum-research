# Complétude des molécules — relevé du 16 septembre 2026

Le comptage de lecture seule retourne **7 478 molécules** dans la base courante, et non 7 478 comme indiqué dans la demande. Cette différence d’une unité est un état de base au moment du relevé ; elle ne constitue ni une correction ni une suppression. Les résultats ont été calculés avec `IS NOT NULL`, sans juger la qualité, la traçabilité ou la validité scientifique des champs.

| Champ | Compte non nul | Part de 7 478 |
|---|---:|---:|
| `boilingPoint` | 7 477 | 99,98 % |
| `volatility` | 7 411 | 99,10 % |
| `intensity` | 7 409 | 99,07 % |
| `radar_intensity` | 7 478 | 100,00 % |
| `radar_freshness` | 7 478 | 100,00 % |
| `radar_warmth` | 7 478 | 100,00 % |
| `radar_sweetness` | 7 478 | 100,00 % |
| `radar_spiciness` | 7 478 | 100,00 % |
| `radar_earthiness` | 7 478 | 100,00 % |
| `pubchem_cid` | 7 292 | 97,51 % |
| `ifra_status` | 7 478 | 100,00 % |
| `inchi` contenant `/t` | 2 476 | 33,11 % |

La couche `/t` indique uniquement qu’un segment stéréochimique textuel est présent dans l’InChI ; elle ne suffit pas à certifier une assignation stéréochimique ni à résoudre un conflit CAS. De même, les axes radar et les statuts IFRA doivent être soumis aux procédures de qualité déjà en cours avant un usage scientifique ou réglementaire.

Les artefacts livrables associés sont le [CSV](./2026-09-completude-molecules-2026-09-16.csv), le [SVG](./2026-09-completude-molecules-2026-09-16.svg) et la [requête SQL lecture seule](../../server/scripts/report-data-completeness-installation.sql).
