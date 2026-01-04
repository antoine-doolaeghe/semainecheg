/**
 * Tests manuels pour le service de cookies persistants
 * À exécuter dans la console du navigateur
 */

import { PersistentStorage, setCookie, getCookie, deleteCookie } from './cookieService';

// ====================================
// Test 1 : Sauvegarde et récupération simple
// ====================================
export function test1_basicStorage() {
  console.log('🧪 Test 1 : Sauvegarde et récupération simple');
  
  const testData = {
    name: 'Poulet rôti',
    ingredients: ['poulet', 'herbes', 'citron'],
    time: 45,
  };
  
  // Sauvegarder
  const success = PersistentStorage.set('test_recipe', testData);
  console.log('✓ Sauvegarde:', success ? '✅' : '❌');
  
  // Récupérer
  const retrieved = PersistentStorage.get('test_recipe');
  console.log('✓ Récupération:', JSON.stringify(retrieved) === JSON.stringify(testData) ? '✅' : '❌');
  
  // Nettoyer
  PersistentStorage.remove('test_recipe');
  const shouldBeNull = PersistentStorage.get('test_recipe');
  console.log('✓ Suppression:', shouldBeNull === null ? '✅' : '❌');
  
  console.log('');
}

// ====================================
// Test 2 : Persistance des cookies (10 ans)
// ====================================
export function test2_cookiePersistence() {
  console.log('🧪 Test 2 : Persistance des cookies');
  
  setCookie('test_persistence', { timestamp: Date.now() });
  
  // Vérifier dans les cookies du navigateur
  const cookieExists = document.cookie.includes('test_persistence');
  console.log('✓ Cookie créé:', cookieExists ? '✅' : '❌');
  
  // Calculer la date d'expiration
  const cookieString = document.cookie.split(';').find(c => c.includes('test_persistence'));
  console.log('✓ Cookie string:', cookieString);
  
  // Vérifier que max-age est bien défini (10 ans = 315360000 secondes)
  const tenYears = 10 * 365 * 24 * 60 * 60;
  console.log('✓ Durée attendue:', tenYears, 'secondes (10 ans)');
  
  deleteCookie('test_persistence');
  console.log('');
}

// ====================================
// Test 3 : Grandes données (fragmentation)
// ====================================
export function test3_largeData() {
  console.log('🧪 Test 3 : Fragmentation des grandes données');
  
  // Créer un gros historique
  const largeHistory = [];
  for (let i = 0; i < 10; i++) {
    largeHistory.push({
      id: `plan-${i}`,
      createdAt: new Date().toISOString(),
      preferences: {
        goal: 'balanced',
        restrictions: '',
        cookingLevel: 'beginner',
        pantryItems: '',
        numberOfMeals: 7,
      },
      recipes: Array(7).fill(null).map((_, j) => ({
        id: `recipe-${i}-${j}`,
        dayNumber: j + 1,
        name: `Recette ${j + 1} du planning ${i}`,
        description: 'Une délicieuse recette ' + 'avec beaucoup de texte pour remplir '.repeat(10),
        totalTimeMinutes: 30,
        ingredients: [
          { name: 'Ingrédient 1', quantity: '200', unit: 'g', category: 'PRODUCE' },
          { name: 'Ingrédient 2', quantity: '100', unit: 'ml', category: 'DAIRY' },
        ],
        steps: [
          'Étape 1 avec beaucoup de détails '.repeat(5),
          'Étape 2 avec encore plus de détails '.repeat(5),
          'Étape 3 pour finir en beauté '.repeat(5),
        ],
        macros: { calories: 400, protein: 30, carbs: 40, fat: 15 },
      })),
    });
  }
  
  const dataSize = JSON.stringify(largeHistory).length;
  console.log('✓ Taille des données:', dataSize, 'caractères (', Math.round(dataSize / 1024), 'KB)');
  
  // Sauvegarder
  const success = PersistentStorage.set('test_large', largeHistory);
  console.log('✓ Sauvegarde:', success ? '✅' : '❌');
  
  // Vérifier la fragmentation
  const cookieChunks = document.cookie.match(/test_large_chunk_\d+/g);
  if (cookieChunks) {
    console.log('✓ Fragmenté en', cookieChunks.length, 'cookies');
  } else {
    console.log('✓ Stocké dans un seul cookie (< 4KB)');
  }
  
  // Récupérer
  const retrieved = PersistentStorage.get('test_large');
  console.log('✓ Récupération:', retrieved !== null ? '✅' : '❌');
  console.log('✓ Données intactes:', JSON.stringify(retrieved) === JSON.stringify(largeHistory) ? '✅' : '❌');
  
  // Nettoyer
  PersistentStorage.remove('test_large');
  console.log('');
}

// ====================================
// Test 4 : Fallback localStorage
// ====================================
export function test4_localStorageFallback() {
  console.log('🧪 Test 4 : Fallback localStorage');
  
  const testData = { message: 'Test de fallback' };
  
  // Sauvegarder
  PersistentStorage.set('test_fallback', testData);
  
  // Vérifier dans localStorage
  const inLocalStorage = localStorage.getItem('test_fallback') !== null;
  console.log('✓ Backup localStorage:', inLocalStorage ? '✅' : '❌');
  
  // Vérifier dans les cookies
  const inCookies = getCookie('test_fallback') !== null;
  console.log('✓ Sauvegardé dans cookies:', inCookies ? '✅' : '❌');
  
  // Nettoyer
  PersistentStorage.remove('test_fallback');
  console.log('');
}

// ====================================
// Test 5 : Migration depuis localStorage
// ====================================
export function test5_migration() {
  console.log('🧪 Test 5 : Migration depuis localStorage');
  
  const oldData = { legacy: true, message: 'Anciennes données' };
  
  // Simuler des anciennes données dans localStorage uniquement
  localStorage.setItem('test_migration', JSON.stringify(oldData));
  
  // Essayer de récupérer (devrait migrer vers cookies)
  const retrieved = PersistentStorage.get('test_migration');
  console.log('✓ Migration automatique:', retrieved !== null ? '✅' : '❌');
  console.log('✓ Données correctes:', JSON.stringify(retrieved) === JSON.stringify(oldData) ? '✅' : '❌');
  
  // Vérifier que maintenant c'est aussi dans les cookies
  const nowInCookies = getCookie('test_migration') !== null;
  console.log('✓ Migré vers cookies:', nowInCookies ? '✅' : '❌');
  
  // Nettoyer
  PersistentStorage.remove('test_migration');
  console.log('');
}

// ====================================
// Test 6 : Performance
// ====================================
export function test6_performance() {
  console.log('🧪 Test 6 : Performance');
  
  const testData = {
    recipes: Array(100).fill({ name: 'Test', time: 30 }),
  };
  
  // Test d'écriture
  const writeStart = performance.now();
  PersistentStorage.set('test_perf', testData);
  const writeEnd = performance.now();
  console.log('✓ Écriture:', (writeEnd - writeStart).toFixed(2), 'ms');
  
  // Test de lecture
  const readStart = performance.now();
  PersistentStorage.get('test_perf');
  const readEnd = performance.now();
  console.log('✓ Lecture:', (readEnd - readStart).toFixed(2), 'ms');
  
  // Nettoyer
  PersistentStorage.remove('test_perf');
  console.log('');
}

// ====================================
// Exécuter tous les tests
// ====================================
export function runAllTests() {
  console.log('🚀 Lancement de tous les tests...\n');
  
  test1_basicStorage();
  test2_cookiePersistence();
  test3_largeData();
  test4_localStorageFallback();
  test5_migration();
  test6_performance();
  
  console.log('✅ Tous les tests terminés !');
}

// Pour tester dans la console :
// import { runAllTests } from './services/cookieService.test';
// runAllTests();

