# PERFUMUM — Constat d’accès pour l’investigation d’une installation physique

**Date de vérification :** 15 septembre 2026  
**Méthode :** contrôle local non destructif, puis lecture de l’API publique de consultation.

## Réponses d’accès

| Question | Réponse vérifiée | Conséquence pratique |
|---|---|---|
| Le code source est-il disponible ? | **Oui.** Le projet est accessible dans `/home/ubuntu/perfumum-research` (environ 1,2 Go) avec `package.json`, `drizzle/`, `server/routers/` et `client/src/pages/`. | Il est possible d’identifier les procédures tRPC, les composants et les prototypes sans déduire les routes à partir de la seule interface publique. |
| Un accès réseau sortant est-il disponible ? | **Oui.** L’appel de lecture `dashboard.getStats` de l’API déployée a répondu HTTP **200** le 15 septembre 2026. | Les essais locaux pourront lire des données de consultation depuis l’API, sous réserve de vérifier chaque endpoint réellement utilisé. |
| Une base de données est-elle accessible ? | **Oui.** La configuration d’exécution fournit une connexion de base disponible au serveur. | L’investigation peut comparer le code au schéma réel, mais aucun essai physique ne doit écrire dans les tables de production. |
| Du code peut-il être exécuté ? | **Oui.** Node.js 22.13.0, Python 3.12.3, `curl` et un navigateur Chromium sont disponibles. | Les connecteurs, exports et pages locales pourront être testés dans un environnement isolé avant toute utilisation en atelier. |

## Périmètre et garde-fous

L’investigation a accès au code applicatif, à la lecture du service déployé, au schéma réel et à un environnement d’exécution. Elle ne suppose pas pour autant que toutes les pages, procédures ou données historiques sont fonctionnelles ou fiables : les points d’entrée seront vérifiés un par un et l’état de la réponse sera consigné.

Les essais proposés emploieront uniquement des lectures tRPC, des exports locaux ou des données explicitement marquées comme démonstratives. Aucun matériel de contrôle d’émission, aucune substance et aucune écriture dans les tables scientifiques de production ne font partie de ce périmètre. Toute trace produite lors d’un essai devra être conservée dans un journal séparé, sous le contrôle de l’utilisateur.
