# Dépendances Manus / Forge — état initial

| Composant | Statut | Preuve / remplacement nécessaire |
|---|---|---|
| Authentification OAuth Manus | dépendant | Remplacer par OIDC/OAuth standard ou mode local. |
| Stockage Forge | dépendant | Exporter les objets puis adopter un stockage S3 compatible/direct. |
| Uploads | dépendant | Adapter les routes à un client de stockage choisi. |
| LLM, Data API, génération d’images, transcription, notifications | dépendant | Créer des adaptateurs ou les désactiver proprement. |
| Cartes Google via proxy Forge | dépendant | Fournir une clé/proxy propre ou migrer vers une solution libre. |
| WebSocket applicatif | portable avec adaptation | Code versionné ; contrat de session à valider hors OAuth Manus. |
| Runtime Vite Manus | dépendant | Retirer ou conditionner le plugin de runtime et le correctif HMR. |
| Code React/Express/tRPC/Drizzle | portable | Exige Node, pnpm, base MySQL/TiDB et configuration indépendante. |
| Base TiDB | exportable sous condition | Le micro-corpus est exporté ici ; l’export intégral reste hors périmètre. |
