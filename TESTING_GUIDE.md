# 🧪 Tests Rapides - Cookies Persistants

## Tests dans la Console du Navigateur

Ouvrez la console du navigateur (F12) et exécutez ces commandes :

### 1️⃣ Vérifier l'existence des cookies

```javascript
// Voir tous les cookies
console.log(document.cookie);

// Vérifier le cookie de l'historique
document.cookie.includes('semainechef_history')
// Retourne: true si les recettes sont sauvegardées
```

### 2️⃣ Tester manuellement la sauvegarde

```javascript
// Importer le service (si disponible dans votre build)
// Note: Si TypeScript, vous devrez utiliser l'interface de l'app

// Via l'API native :
document.cookie = "test_manual=hello; max-age=315360000; path=/";
console.log(document.cookie);
```

### 3️⃣ Inspecter les données sauvegardées

```javascript
// Récupérer l'historique depuis localStorage (backup)
const history = JSON.parse(localStorage.getItem('semainechef_history') || '[]');
console.log('📚 Nombre de plannings:', history.length);
console.log('📋 Détails:', history);
```

### 4️⃣ Vérifier la taille des données

```javascript
// Taille de l'historique
const historyData = localStorage.getItem('semainechef_history');
if (historyData) {
  const sizeKB = (historyData.length / 1024).toFixed(2);
  console.log('💾 Taille de l\'historique:', sizeKB, 'KB');
}
```

### 5️⃣ Vérifier la fragmentation

```javascript
// Compter les cookies fragmentés
const cookieChunks = document.cookie.match(/semainechef_history_chunk_\d+/g);
if (cookieChunks) {
  console.log('🧩 Cookies fragmentés:', cookieChunks.length);
} else {
  console.log('✅ Un seul cookie (pas de fragmentation nécessaire)');
}
```

### 6️⃣ Vérifier la date d'expiration

```javascript
// Les cookies HTTP-only ne montrent pas leurs dates d'expiration
// Mais vous pouvez vérifier dans DevTools → Application → Cookies
console.log('👉 Allez dans DevTools > Application > Cookies pour voir les détails');
```

## Tests avec le Débogueur Intégré

En mode développement, utilisez le bouton violet en bas à droite :

1. **Cliquez sur le bouton** avec l'icône 🗄️
2. **Voyez les statistiques** en temps réel
3. **Cliquez "Tester"** pour un test automatique
4. **Cliquez "Actualiser"** pour mettre à jour les infos

## Tests de Persistance Extrême

### Test 1 : Redémarrage du navigateur

```bash
1. Créez un planning de repas
2. Notez un détail unique (ex: nom d'une recette)
3. Fermez COMPLÈTEMENT le navigateur (⌘+Q sur Mac, Alt+F4 sur Windows)
4. Attendez 30 secondes
5. Rouvrez le navigateur
6. Rechargez l'application
7. ✅ Vos recettes doivent être là !
```

### Test 2 : Effacement du cache

```bash
1. Créez un planning de repas
2. Ouvrez DevTools (F12)
3. Application > Storage > Clear site data
4. ⚠️ DÉCOCHEZ "Cookies" (on veut garder les cookies)
5. ✅ Cochez "Local storage", "Session storage", "Cache storage"
6. Cliquez "Clear site data"
7. Rechargez l'application
8. ✅ Vos recettes sont toujours là grâce aux cookies !
```

### Test 3 : Navigation privée

```bash
1. Ouvrez une fenêtre de navigation privée
2. Allez sur votre application
3. Créez un planning
4. Fermez la fenêtre privée
5. Rouvrez une nouvelle fenêtre privée
6. ⚠️ Les données sont perdues (comportement normal en navigation privée)
```

### Test 4 : Après 1 jour

```bash
1. Créez un planning aujourd'hui
2. Ne touchez plus à l'application pendant 24h
3. Revenez demain
4. ✅ Vos recettes sont toujours là !
5. 📅 Elles le resteront pendant 10 ans !
```

## Tests depuis les DevTools

### Chrome/Edge

```
1. F12 > Application > Cookies > https://localhost:5173 (ou votre domaine)
2. Cherchez "semainechef_history"
3. Vérifiez :
   - Value : [données encodées]
   - Expires : [date dans ~10 ans]
   - Size : [taille en bytes]
   - Path : /
   - Secure : ✓ (si HTTPS)
   - SameSite : Lax
```

### Firefox

```
1. F12 > Storage > Cookies > https://localhost:5173
2. Cherchez "semainechef_history"
3. Vérifiez les mêmes propriétés
```

### Safari

```
1. ⌘+⌥+C > Storage > Cookies
2. Cherchez "semainechef_history"
3. Note : Safari peut limiter à 7 jours dans certains contextes (ITP)
```

## Tests de Capacité

### Test avec peu de données (< 4KB)

```javascript
// Créez 1-2 plannings de repas
// Résultat attendu : 1 seul cookie, pas de fragmentation
```

### Test avec données moyennes (4-16 KB)

```javascript
// Créez 5-10 plannings de repas
// Résultat attendu : 2-4 cookies fragmentés
```

### Test avec beaucoup de données (> 20 KB)

```javascript
// Créez 20+ plannings de repas
// Résultat attendu : 5+ cookies fragmentés
// Si > 50 cookies : utilise localStorage comme priorité
```

## Tests de Robustesse

### Test : Cookies désactivés

```bash
1. Désactivez les cookies dans votre navigateur :
   - Chrome : Settings > Privacy > Cookies > Block all cookies
   - Firefox : Preferences > Privacy > Custom > Block cookies
2. Créez un planning
3. ✅ Doit fonctionner avec localStorage en fallback
4. ⚠️ Message dans la console : "Sauvegardé uniquement dans localStorage"
```

### Test : localStorage plein

```javascript
// Remplir localStorage artificiellement
try {
  for (let i = 0; i < 1000; i++) {
    localStorage.setItem('junk_' + i, 'x'.repeat(10000));
  }
} catch (e) {
  console.log('localStorage plein');
}

// Tester la sauvegarde
// Résultat attendu : Utilise uniquement les cookies
```

### Test : Corruption de données

```javascript
// Corrompre un cookie
document.cookie = "semainechef_history=INVALID_JSON; path=/";

// Recharger l'application
// Résultat attendu : Fallback vers localStorage si disponible
```

## Commandes Utiles

### Nettoyer tout

```javascript
// Supprimer tous les cookies et localStorage
localStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.trim().split("=")[0] + "=;expires=" + new Date(0).toUTCString() + ";path=/";
});
console.log('🧹 Tout nettoyé !');
```

### Forcer une migration

```javascript
// Mettre des données uniquement dans localStorage
localStorage.setItem('semainechef_history', JSON.stringify([
  { id: 'test', createdAt: new Date().toISOString(), recipes: [] }
]));

// Recharger la page
// Résultat attendu : Données migrées automatiquement vers cookies
```

### Mesurer la performance

```javascript
// Test de vitesse d'écriture
const data = { test: 'x'.repeat(1000) };
console.time('write');
// PersistentStorage.set('perf_test', data);
console.timeEnd('write');

// Test de vitesse de lecture
console.time('read');
// PersistentStorage.get('perf_test');
console.timeEnd('read');
```

## Résultats Attendus

### ✅ Tests qui DOIVENT réussir

1. Sauvegarde d'un planning → Cookie créé avec expiration ~10 ans
2. Rechargement de la page → Données récupérées
3. Redémarrage du navigateur → Données toujours là
4. Effacement du cache (sans cookies) → Données préservées
5. Fragmentation automatique si > 4KB
6. Fallback localStorage si cookies désactivés

### ⚠️ Comportements normaux

1. Navigation privée → Données non persistantes (normal)
2. Safari avec ITP → Peut limiter à 7 jours sur certains sites tiers
3. Cookies bloqués → Utilise localStorage (moins persistant)
4. > 50 cookies → Utilise localStorage en priorité

### ❌ Si ça ne marche pas

1. Vérifiez que JavaScript est activé
2. Vérifiez que les cookies ne sont pas bloqués
3. Consultez la console pour les erreurs
4. Utilisez le débogueur intégré (bouton violet)
5. Vérifiez dans DevTools > Application > Cookies

## 🎯 Checklist Complète

- [ ] Les cookies sont créés avec `max-age` de 10 ans
- [ ] Les données persistent après redémarrage du navigateur
- [ ] La fragmentation fonctionne pour les grandes données
- [ ] Le fallback localStorage fonctionne si cookies désactivés
- [ ] La migration depuis localStorage vers cookies fonctionne
- [ ] Le débogueur s'affiche en mode développement
- [ ] Aucune erreur dans la console
- [ ] Les données sont cohérentes entre cookies et localStorage

---

Tous les tests passent ? **Félicitations ! 🎉** Vos recettes sont maintenant sauvegardées de la manière la plus persistante possible !

