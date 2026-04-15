# Guide du Service Worker PERFUMUM

## Vue d'ensemble

Le Service Worker a été réactivé avec une stratégie **Network First** pour éviter les problèmes de cache obsolète tout en offrant des capacités offline.

## Stratégie de cache

### Version 2 (actuelle)

**Principe**: Toujours essayer le réseau en premier, utiliser le cache uniquement en cas d'échec.

#### Requêtes API (`/api/*`)
- ✅ **Network Only** - Pas de cache
- ❌ Si offline → Erreur 503 explicite
- 🎯 Garantit toujours les données fraîches

#### HTML/JS/CSS
- ✅ **Network First** avec cache de secours
- 📦 Cache mis à jour à chaque requête réussie
- ⏱️ Durée de validité: 24 heures
- 🔄 Rafraîchissement automatique en arrière-plan

#### Images et assets statiques
- ✅ **Cache First** avec rafraîchissement en arrière-plan
- 📦 Cache persistant avec timestamp
- ⏱️ Durée de validité: 24 heures
- 🔄 Mise à jour silencieuse depuis le réseau

## Améliorations par rapport à v1

| Aspect | v1 (ancienne) | v2 (nouvelle) |
|--------|---------------|---------------|
| Stratégie principale | Cache First | Network First |
| Risque de cache obsolète | ⚠️ Élevé | ✅ Minimal |
| Fonctionnement offline | ✅ Oui | ✅ Oui |
| Fraîcheur des données | ❌ Problématique | ✅ Garantie |
| Gestion des mises à jour | ⚠️ Manuelle | ✅ Automatique |
| Notification utilisateur | ❌ Non | ✅ Oui (optionnel) |

## Fonctionnalités

### 1. Gestion automatique des mises à jour

Le Service Worker vérifie les mises à jour toutes les 30 minutes et propose à l'utilisateur de rafraîchir la page quand une nouvelle version est disponible.

```javascript
// Dans main.tsx
if (confirm('Une nouvelle version de PERFUMUM est disponible. Voulez-vous actualiser ?')) {
  newWorker.postMessage({ type: 'SKIP_WAITING' });
  window.location.reload();
}
```

### 2. Validation du cache par timestamp

Chaque réponse mise en cache reçoit un timestamp. Le cache est considéré invalide après 24 heures.

```javascript
function isCacheValid(cachedResponse) {
  const cachedDate = cachedResponse.headers.get('sw-cache-date');
  const cacheAge = Date.now() - new Date(cachedDate).getTime();
  return cacheAge < CACHE_DURATION; // 24 heures
}
```

### 3. Page offline personnalisée

Si l'utilisateur est hors ligne et que le cache n'est pas disponible, une page offline élégante est affichée avec un bouton "Réessayer".

### 4. Nettoyage automatique des anciens caches

À chaque activation, tous les anciens caches sont supprimés pour éviter l'accumulation.

## Commandes de débogage

### Vider le cache manuellement

Ouvrir la console du navigateur et exécuter:

```javascript
// Envoyer un message au Service Worker pour vider tous les caches
navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
```

### Désinstaller le Service Worker

```javascript
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});
```

### Vérifier le statut du Service Worker

```javascript
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('Service Worker:', reg);
  console.log('Active:', reg?.active?.state);
  console.log('Waiting:', reg?.waiting?.state);
  console.log('Installing:', reg?.installing?.state);
});
```

## Tests recommandés

### Test 1: Vérifier le Network First

1. Ouvrir DevTools → Network
2. Naviguer sur le site
3. Vérifier que les requêtes HTML/JS/CSS vont bien au réseau (status 200, pas "(from ServiceWorker)")

### Test 2: Vérifier le mode offline

1. Ouvrir DevTools → Application → Service Workers
2. Cocher "Offline"
3. Rafraîchir la page
4. Vérifier que la page offline s'affiche ou que le cache fonctionne

### Test 3: Vérifier les mises à jour

1. Modifier le fichier `sw.js` (changer `CACHE_VERSION`)
2. Attendre 30 secondes (ou forcer avec `registration.update()`)
3. Vérifier qu'une notification apparaît

## Dépannage

### Problème: Le cache ne se met pas à jour

**Solution**: 
1. Ouvrir DevTools → Application → Storage
2. Cliquer sur "Clear site data"
3. Rafraîchir la page avec Ctrl+Shift+R (hard refresh)

### Problème: Le Service Worker ne s'installe pas

**Solution**:
1. Vérifier que le site est servi en HTTPS (ou localhost)
2. Vérifier la console pour les erreurs
3. Vérifier que `/sw.js` est accessible

### Problème: Anciennes versions persistent

**Solution**:
1. Incrémenter `CACHE_VERSION` dans `sw.js`
2. Forcer le rafraîchissement avec Ctrl+Shift+R
3. Vérifier dans DevTools → Application → Cache Storage que les anciens caches sont supprimés

## Monitoring

### Logs à surveiller

```
[PWA] Service Worker v2 registered: /
[SW v2] Installing service worker...
[SW v2] Activating service worker...
[SW v2] Deleting old cache: perfumum-v1
[SW v2] Serving from cache (offline): /molecules
```

### Métriques importantes

- Taux de cache hit/miss
- Temps de réponse réseau vs cache
- Fréquence des mises à jour
- Taux d'erreurs offline

## Prochaines améliorations possibles

1. **Background Sync**: Synchroniser les favoris/notes en arrière-plan
2. **Push Notifications**: Notifier les nouvelles molécules/recettes
3. **Precaching intelligent**: Prédire et précharger les pages probables
4. **Stratégies par type de contenu**: Affiner les stratégies de cache
5. **Analytics offline**: Collecter les métriques même hors ligne

## Références

- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Workbox (Google)](https://developers.google.com/web/tools/workbox)
- [PWA Best Practices](https://web.dev/pwa/)
