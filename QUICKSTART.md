# 🚀 Démarrage Rapide - Cookies Persistants

## Installation (déjà fait ✅)

Le système est **déjà intégré** dans votre application. Aucune action requise !

## Lancer l'Application

```bash
npm run dev
```

L'application démarre sur http://localhost:5173

## Test en 3 Étapes

### 1️⃣ Créer un Planning (30 secondes)

1. Ouvrez l'application
2. Complétez l'onboarding :
   - Choisissez un objectif (ex: "Équilibré")
   - Ajoutez vos restrictions (optionnel)
   - Validez
3. Un planning de 7 jours est généré
4. ✅ **Automatiquement sauvegardé dans les cookies !**

### 2️⃣ Vérifier le Débogueur (10 secondes)

1. Cherchez le **bouton violet** 🗄️ en bas à droite
2. Cliquez dessus
3. Vous verrez :
   ```
   📊 Cookies
   ✓ Activés
   ✓ Historique : 12.4 KB
   ✓ Fragments : 4
   
   📊 localStorage
   ✓ Historique : 12.4 KB
   ```

### 3️⃣ Test de Persistance (1 minute)

1. Notez le nom d'une recette
2. **Fermez complètement le navigateur** (⌘+Q ou Alt+F4)
3. Attendez 10 secondes
4. Rouvrez le navigateur
5. Rechargez l'application
6. Allez dans l'onglet "Historique" (en bas)
7. ✅ **Votre planning est toujours là !**

## Console du Navigateur

Ouvrez la console (F12) et vous verrez :

```
✅ Historique chargé depuis le stockage persistant
✅ Historique sauvegardé dans les cookies (persistance maximale)
```

## Vérification Manuelle

Dans la console du navigateur :

```javascript
// Voir les cookies
document.cookie

// Devrait afficher quelque chose comme :
// "semainechef_history=eyJpZCI6InBsYW4t..."
```

## Tests Avancés

### Test de Fragmentation

1. Créez **10-15 plannings** de repas
2. Ouvrez le débogueur
3. Vous devriez voir : `Fragments : 5` (ou plus)
4. ✅ La fragmentation automatique fonctionne !

### Test avec DevTools

1. F12 → Application → Cookies → localhost:5173
2. Cherchez `semainechef_history`
3. Vérifiez :
   - **Expires** : Date dans ~10 ans
   - **Size** : Taille du cookie
   - **Path** : /

### Test d'Effacement du Cache

1. F12 → Application → Storage
2. Cliquez "Clear site data"
3. ⚠️ **DÉCOCHEZ "Cookies"**
4. ✅ Cochez "Local storage", "Cache"
5. Cliquez "Clear site data"
6. Rechargez la page
7. ✅ Vos données sont toujours là grâce aux cookies !

## Commandes Console Utiles

```javascript
// Taille de l'historique
const history = JSON.parse(localStorage.getItem('semainechef_history') || '[]');
console.log('Nombre de plannings:', history.length);

// Taille en Ko
const size = (JSON.stringify(history).length / 1024).toFixed(2);
console.log('Taille:', size, 'KB');

// Compter les fragments
const chunks = document.cookie.match(/semainechef_history_chunk_\d+/g);
console.log('Fragments:', chunks ? chunks.length : 0);
```

## Nettoyer les Données

### Via le Débogueur
1. Cliquez sur le bouton violet 🗄️
2. Cliquez "Tout Effacer"
3. Confirmez

### Via la Console
```javascript
// Tout supprimer
localStorage.clear();
document.cookie = "semainechef_history=; max-age=0; path=/";
location.reload();
```

## Problèmes Courants

### ❌ "Le débogueur n'apparaît pas"
→ Normal en production. Lancez avec `npm run dev`

### ❌ "Les cookies ne se créent pas"
→ Vérifiez que les cookies sont activés dans votre navigateur
→ Vérifiez la console pour les messages d'erreur

### ❌ "Les données sont perdues après redémarrage"
→ Vérifiez que vous n'êtes pas en navigation privée
→ Vérifiez que les cookies ne sont pas bloqués
→ Safari : ITP peut limiter sur certains sites tiers

## Documentation Complète

- **`SUMMARY.md`** - Vue d'ensemble complète
- **`MIGRATION_GUIDE.md`** - Guide détaillé
- **`TESTING_GUIDE.md`** - 20+ scénarios de test
- **`services/COOKIES_README.md`** - Documentation technique

## Support

Si ça ne fonctionne pas :

1. ✅ Cookies activés dans le navigateur ?
2. ✅ Mode développement (`npm run dev`) ?
3. ✅ Messages d'erreur dans la console ?
4. ✅ Débogueur accessible ?

Si tout est OK, vos recettes sont sauvegardées pour **10 ans** ! 🎉

---

**C'est tout ! Profitez de votre système de persistance ultra-robuste ! 🚀**

