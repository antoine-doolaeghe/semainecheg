/**
 * Service de gestion des cookies avec persistance maximale
 * Durée de vie des cookies : 10 ans (maximum recommandé)
 */

const COOKIE_MAX_AGE = 10 * 365 * 24 * 60 * 60; // 10 ans en secondes
const COOKIE_PATH = '/';

interface CookieOptions {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Encode une valeur pour le stockage dans un cookie
 */
function encodeValue(value: any): string {
  return encodeURIComponent(JSON.stringify(value));
}

/**
 * Décode une valeur depuis un cookie
 */
function decodeValue(value: string): any {
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return null;
  }
}

/**
 * Définit un cookie avec persistance maximale
 */
export function setCookie(name: string, value: any, options: CookieOptions = {}): boolean {
  try {
    const encodedValue = encodeValue(value);
    
    // Vérifier la taille (limite de ~4KB par cookie)
    if (encodedValue.length > 4000) {
      console.warn(`Cookie "${name}" dépasse la taille recommandée (${encodedValue.length} caractères)`);
      // Si trop grand, on va le diviser en plusieurs cookies
      return setLargeCookie(name, value, options);
    }
    
    const cookieOptions = {
      maxAge: COOKIE_MAX_AGE,
      path: COOKIE_PATH,
      ...options,
    };
    
    let cookieString = `${name}=${encodedValue}`;
    
    if (cookieOptions.maxAge) {
      cookieString += `; max-age=${cookieOptions.maxAge}`;
      // Ajouter aussi une date d'expiration pour une meilleure compatibilité
      const expires = new Date(Date.now() + cookieOptions.maxAge * 1000);
      cookieString += `; expires=${expires.toUTCString()}`;
    }
    
    if (cookieOptions.path) {
      cookieString += `; path=${cookieOptions.path}`;
    }
    
    if (cookieOptions.domain) {
      cookieString += `; domain=${cookieOptions.domain}`;
    }
    
    if (cookieOptions.secure || window.location.protocol === 'https:') {
      cookieString += '; secure';
    }
    
    cookieString += `; samesite=${cookieOptions.sameSite || 'lax'}`;
    
    document.cookie = cookieString;
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la définition du cookie:', error);
    return false;
  }
}

/**
 * Récupère la valeur d'un cookie
 */
export function getCookie(name: string): any {
  try {
    // Vérifier d'abord si c'est un cookie fragmenté
    const chunkedValue = getLargeCookie(name);
    if (chunkedValue !== null) {
      return chunkedValue;
    }
    
    const cookies = document.cookie.split(';');
    
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
      
      if (cookieName === name) {
        return decodeValue(cookieValue);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la lecture du cookie:', error);
    return null;
  }
}

/**
 * Supprime un cookie
 */
export function deleteCookie(name: string): void {
  try {
    // Supprimer le cookie principal
    document.cookie = `${name}=; max-age=0; path=${COOKIE_PATH}`;
    
    // Supprimer les fragments s'ils existent
    deleteLargeCookie(name);
  } catch (error) {
    console.error('Erreur lors de la suppression du cookie:', error);
  }
}

/**
 * Vérifie si un cookie existe
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

/**
 * Pour les grandes données, on fragmente en plusieurs cookies
 */
function setLargeCookie(name: string, value: any, options: CookieOptions = {}): boolean {
  try {
    const encodedValue = encodeValue(value);
    const chunkSize = 3500; // Laisser de la marge pour le nom et les métadonnées
    const chunks: string[] = [];
    
    for (let i = 0; i < encodedValue.length; i += chunkSize) {
      chunks.push(encodedValue.substring(i, i + chunkSize));
    }
    
    // Sauvegarder le nombre de fragments
    setCookie(`${name}_chunks`, chunks.length, options);
    
    // Sauvegarder chaque fragment
    for (let i = 0; i < chunks.length; i++) {
      const chunkName = `${name}_chunk_${i}`;
      const chunkValue = chunks[i];
      
      let cookieString = `${chunkName}=${chunkValue}`;
      cookieString += `; max-age=${COOKIE_MAX_AGE}`;
      const expires = new Date(Date.now() + COOKIE_MAX_AGE * 1000);
      cookieString += `; expires=${expires.toUTCString()}`;
      cookieString += `; path=${COOKIE_PATH}`;
      
      if (options.secure || window.location.protocol === 'https:') {
        cookieString += '; secure';
      }
      
      cookieString += `; samesite=${options.sameSite || 'lax'}`;
      
      document.cookie = cookieString;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la définition du cookie fragmenté:', error);
    return false;
  }
}

/**
 * Récupère un cookie fragmenté
 */
function getLargeCookie(name: string): any {
  try {
    const chunksCountCookie = getCookieRaw(`${name}_chunks`);
    if (!chunksCountCookie) {
      return null;
    }
    
    const chunksCount = parseInt(chunksCountCookie);
    if (isNaN(chunksCount) || chunksCount <= 0) {
      return null;
    }
    
    let fullValue = '';
    
    for (let i = 0; i < chunksCount; i++) {
      const chunkValue = getCookieRaw(`${name}_chunk_${i}`);
      if (!chunkValue) {
        console.warn(`Fragment manquant : ${name}_chunk_${i}`);
        return null;
      }
      fullValue += chunkValue;
    }
    
    return decodeValue(fullValue);
  } catch (error) {
    console.error('Erreur lors de la lecture du cookie fragmenté:', error);
    return null;
  }
}

/**
 * Supprime un cookie fragmenté
 */
function deleteLargeCookie(name: string): void {
  try {
    const chunksCountCookie = getCookieRaw(`${name}_chunks`);
    if (!chunksCountCookie) {
      return;
    }
    
    const chunksCount = parseInt(chunksCountCookie);
    if (isNaN(chunksCount)) {
      return;
    }
    
    // Supprimer le compteur
    document.cookie = `${name}_chunks=; max-age=0; path=${COOKIE_PATH}`;
    
    // Supprimer tous les fragments
    for (let i = 0; i < chunksCount; i++) {
      document.cookie = `${name}_chunk_${i}=; max-age=0; path=${COOKIE_PATH}`;
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du cookie fragmenté:', error);
  }
}

/**
 * Récupère la valeur brute d'un cookie sans décoder
 */
function getCookieRaw(name: string): string | null {
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
    
    if (cookieName === name) {
      return cookieValue;
    }
  }
  
  return null;
}

/**
 * Classe de gestion du stockage avec fallback localStorage
 */
export class PersistentStorage {
  /**
   * Sauvegarde une donnée avec cookie en priorité et localStorage en fallback
   */
  static set(key: string, value: any): boolean {
    try {
      // Essayer d'abord avec les cookies
      const cookieSuccess = setCookie(key, value);
      
      // Toujours sauvegarder dans localStorage comme backup
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (lsError) {
        console.warn('localStorage plein ou non disponible');
      }
      
      return cookieSuccess;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    }
  }
  
  /**
   * Récupère une donnée depuis les cookies, avec fallback localStorage
   */
  static get(key: string): any {
    try {
      // Essayer d'abord les cookies
      const cookieValue = getCookie(key);
      if (cookieValue !== null) {
        return cookieValue;
      }
      
      // Fallback vers localStorage
      const lsValue = localStorage.getItem(key);
      if (lsValue) {
        const parsedValue = JSON.parse(lsValue);
        // Migrer vers les cookies si possible
        setCookie(key, parsedValue);
        return parsedValue;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      return null;
    }
  }
  
  /**
   * Supprime une donnée des cookies et de localStorage
   */
  static remove(key: string): void {
    try {
      deleteCookie(key);
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }
  
  /**
   * Vérifie si une donnée existe
   */
  static has(key: string): boolean {
    return hasCookie(key) || localStorage.getItem(key) !== null;
  }
}

