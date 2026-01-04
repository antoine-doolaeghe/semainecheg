# Service de Cookies Persistants

## 📌 Vue d'ensemble

Le service `cookieService.ts` fournit un système de stockage ultra-persistant pour les recettes de SemaineChef. Les données sont sauvegardées dans des **cookies avec une durée de vie maximale de 10 ans**, avec un fallback automatique vers `localStorage`.

## ✨ Caractéristiques

### 🕐 Persistance Maximale
- **Durée de vie : 10 ans** (315 360 000 secondes)
- Double système de dates d'expiration (`max-age` + `expires`) pour une meilleure compatibilité
- Survit aux redémarrages du navigateur, aux effacements de cache, et aux mises à jour

### 📦 Gestion des Grandes Données
- Fragmentation automatique des données dépassant 4KB
- Division en plusieurs cookies (`_chunk_0`, `_chunk_1`, etc.)
- Reconstruction transparente lors de la lecture

### 🔄 Fallback Intelligent
- Tentative de sauvegarde dans les cookies en priorité
- Backup automatique dans `localStorage` en parallèle
- Si les cookies sont pleins, utilise `localStorage` comme solution de secours
- Migration automatique depuis `localStorage` vers cookies lors de la lecture

### 🔒 Sécurité
- Activation automatique du flag `secure` en HTTPS
- Support du `SameSite` (par défaut: `lax`)
- Encodage/décodage sécurisé des données JSON

## 🚀 Utilisation

### API Simple avec `PersistentStorage`

```typescript
import { PersistentStorage } from './services/cookieService';

// Sauvegarder des données
PersistentStorage.set('mon_cle', { recettes: [...] });

// Récupérer des données
const data = PersistentStorage.get('mon_cle');

// Supprimer des données
PersistentStorage.remove('mon_cle');

// Vérifier l'existence
if (PersistentStorage.has('mon_cle')) {
  // ...
}
```

### API Bas Niveau (Cookies)

```typescript
import { setCookie, getCookie, deleteCookie, hasCookie } from './services/cookieService';

// Définir un cookie
setCookie('user_prefs', { theme: 'dark' });

// Avec options personnalisées
setCookie('user_prefs', { theme: 'dark' }, {
  maxAge: 365 * 24 * 60 * 60, // 1 an
  secure: true,
  sameSite: 'strict'
});

// Lire un cookie
const prefs = getCookie('user_prefs');

// Supprimer un cookie
deleteCookie('user_prefs');

// Vérifier l'existence
if (hasCookie('user_prefs')) {
  // ...
}
```

## 📊 Limites et Considérations

### Taille des Cookies
- **Limite par cookie** : ~4KB (3500 caractères de données après encodage)
- **Fragmentation automatique** : Les données plus grandes sont divisées en plusieurs cookies
- **Limite totale** : Environ 50 cookies par domaine (varie selon les navigateurs)

### Exemple de capacité
```typescript
// Un historique typique de SemaineChef :
// - 1 planning = ~5-10 KB
// - Capacité estimée : 20-30 plannings dans les cookies
// - Si dépassement : fallback vers localStorage (5-10 MB disponibles)
```

## 🔧 Intégration dans l'App

Dans `App.tsx`, le système est déjà intégré :

```typescript
// Chargement au démarrage
useEffect(() => {
  const saved = PersistentStorage.get(HISTORY_KEY);
  if (saved) {
    setHistory(saved);
  }
}, []);

// Sauvegarde automatique à chaque changement
useEffect(() => {
  PersistentStorage.set(HISTORY_KEY, history);
}, [history]);
```

## 🐛 Débogage

Les messages de console vous informent de l'état du stockage :

```
✅ Historique sauvegardé dans les cookies (persistance maximale)
⚠️ Sauvegardé uniquement dans localStorage (cookies pleins)
⚠️ Cookie "semainechef_history" dépasse la taille recommandée (4567 caractères)
```

## 🌐 Compatibilité Navigateurs

| Navigateur | Support Cookies | Support localStorage | Notes |
|-----------|----------------|---------------------|-------|
| Chrome    | ✅ 10 ans      | ✅ 5-10 MB         | Support complet |
| Firefox   | ✅ 10 ans      | ✅ 5-10 MB         | Support complet |
| Safari    | ✅ 7 jours*    | ✅ 5-10 MB         | Limite ITP sur cookies tiers |
| Edge      | ✅ 10 ans      | ✅ 5-10 MB         | Support complet |

*Note Safari : Les cookies first-party persistent 10 ans, mais Safari ITP peut limiter les cookies dans certains contextes.

## 🔄 Migration depuis localStorage

Le système migre automatiquement les anciennes données :

1. Au premier chargement, cherche dans les cookies
2. Si absent, cherche dans `localStorage`
3. Si trouvé dans `localStorage`, copie vers cookies
4. Toutes les nouvelles sauvegardes utilisent les cookies en priorité

## 💡 Bonnes Pratiques

### ✅ À faire
- Utiliser `PersistentStorage` pour l'API simplifiée
- Laisser le système gérer la fragmentation automatiquement
- Conserver le fallback `localStorage` actif

### ❌ À éviter
- Ne pas modifier manuellement les cookies `_chunks` ou `_chunk_X`
- Ne pas stocker de données sensibles (mots de passe, tokens) dans les cookies
- Ne pas sauvegarder des données dépassant plusieurs MB (utiliser une base de données)

## 🚀 Améliorations Futures Possibles

- Compression des données (ex: LZ-String) pour augmenter la capacité
- Chiffrement optionnel pour les données sensibles
- Synchronisation cloud (Firebase, Supabase)
- IndexedDB pour les très grandes quantités de données

## 📝 Licence

Partie du projet SemaineChef - Tous droits réservés

