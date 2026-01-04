import React, { useState, useEffect } from 'react';
import { PersistentStorage, getCookie, hasCookie } from '../services/cookieService';
import { Database, Cookie, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * Composant de débogage pour visualiser l'état du stockage persistant
 * À utiliser uniquement en développement
 */
export const StorageDebugger: React.FC = () => {
  const [storageInfo, setStorageInfo] = useState({
    cookiesEnabled: false,
    historyInCookies: false,
    historyInLocalStorage: false,
    cookieSize: 0,
    localStorageSize: 0,
    chunkCount: 0,
  });
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    updateStorageInfo();
    
    // Mettre à jour toutes les 3 secondes
    const interval = setInterval(updateStorageInfo, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateStorageInfo = () => {
    try {
      const cookiesEnabled = navigator.cookieEnabled;
      const historyInCookies = hasCookie('semainechef_history');
      const historyInLocalStorage = localStorage.getItem('semainechef_history') !== null;
      
      // Taille du cookie
      let cookieSize = 0;
      const cookieData = getCookie('semainechef_history');
      if (cookieData) {
        cookieSize = JSON.stringify(cookieData).length;
      }
      
      // Taille localStorage
      let localStorageSize = 0;
      const lsData = localStorage.getItem('semainechef_history');
      if (lsData) {
        localStorageSize = lsData.length;
      }
      
      // Nombre de chunks
      let chunkCount = 0;
      const chunkCountStr = document.cookie
        .split(';')
        .find(c => c.trim().startsWith('semainechef_history_chunks='));
      if (chunkCountStr) {
        chunkCount = parseInt(chunkCountStr.split('=')[1]) || 0;
      }
      
      setStorageInfo({
        cookiesEnabled,
        historyInCookies,
        historyInLocalStorage,
        cookieSize,
        localStorageSize,
        chunkCount,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des infos de stockage:', error);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const clearAllData = () => {
    if (confirm('⚠️ Supprimer TOUTES les données de stockage ?')) {
      PersistentStorage.remove('semainechef_history');
      localStorage.clear();
      updateStorageInfo();
      alert('✅ Toutes les données ont été supprimées');
    }
  };

  const testStorage = () => {
    const testData = {
      test: true,
      timestamp: Date.now(),
      data: 'Test de persistance des cookies',
    };
    
    const success = PersistentStorage.set('test_cookie', testData);
    
    if (success) {
      const retrieved = PersistentStorage.get('test_cookie');
      if (retrieved && retrieved.test) {
        alert('✅ Test réussi ! Les cookies fonctionnent correctement.');
      } else {
        alert('⚠️ Erreur : Les données n\'ont pas pu être récupérées.');
      }
      PersistentStorage.remove('test_cookie');
    } else {
      alert('❌ Erreur : Les cookies n\'ont pas pu être définis.');
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-4 w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-50"
        title="Ouvrir le débogueur de stockage"
      >
        <Database size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database size={18} />
            <h3 className="font-bold text-sm">Débogueur Stockage</h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {/* Cookies Status */}
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Cookie size={16} className="text-purple-600" />
            <span className="font-semibold text-sm">Cookies</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Activés</span>
              {storageInfo.cookiesEnabled ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <AlertCircle size={14} className="text-red-500" />
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Historique</span>
              {storageInfo.historyInCookies ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <AlertCircle size={14} className="text-red-500" />
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Taille</span>
              <span className="font-mono text-slate-900">
                {formatBytes(storageInfo.cookieSize)}
              </span>
            </div>
            {storageInfo.chunkCount > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">Fragments</span>
                <span className="font-mono text-purple-600">
                  {storageInfo.chunkCount}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* localStorage Status */}
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive size={16} className="text-blue-600" />
            <span className="font-semibold text-sm">localStorage</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Historique</span>
              {storageInfo.historyInLocalStorage ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <AlertCircle size={14} className="text-red-500" />
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Taille</span>
              <span className="font-mono text-slate-900">
                {formatBytes(storageInfo.localStorageSize)}
              </span>
            </div>
          </div>
        </div>

        {/* Storage Info */}
        <div className="bg-blue-50 rounded-lg p-3 text-xs text-slate-700">
          <p className="leading-relaxed">
            <strong className="text-blue-900">Persistance : 10 ans</strong><br />
            Les données sont sauvegardées dans des cookies avec une durée de vie maximale, avec fallback vers localStorage.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={testStorage}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 px-3 rounded-lg transition-colors font-medium"
          >
            Tester
          </button>
          <button
            onClick={clearAllData}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded-lg transition-colors font-medium"
          >
            Tout Effacer
          </button>
        </div>
        
        <button
          onClick={updateStorageInfo}
          className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs py-2 px-3 rounded-lg transition-colors font-medium"
        >
          Actualiser
        </button>
      </div>
    </div>
  );
};

