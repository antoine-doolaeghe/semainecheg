import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { MealPlanView } from './components/MealPlanView';
import { GroceryList } from './components/GroceryList';
import { RecipeModal } from './components/RecipeModal';
import { History } from './components/History';
import { StorageDebugger } from './components/StorageDebugger';
import { Recipe, UserPreferences, ViewState, SavedMealPlan } from './types';
import { generateWeeklyPlan } from './services/geminiService';
import { PersistentStorage } from './services/cookieService';
import { Calendar, ShoppingBag, History as HistoryIcon, Heart } from 'lucide-react';
import { Favorites } from './components/Favorites';

const HISTORY_KEY = 'semainechef_history';
const FAVORITES_KEY = 'semainechef_favorites';
const IS_DEVELOPMENT = import.meta.env.DEV;

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('onboarding');
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [plan, setPlan] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<SavedMealPlan[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  // Load history and favorites from persistent storage on mount
  useEffect(() => {
    try {
      const savedHistory = PersistentStorage.get(HISTORY_KEY);
      if (savedHistory) setHistory(savedHistory);
      
      const savedFavorites = PersistentStorage.get(FAVORITES_KEY);
      if (savedFavorites) setFavorites(savedFavorites);
      
      console.log('✅ Données chargées depuis le stockage persistant');
    } catch (e) {
      console.error('Échec du chargement des données:', e);
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    PersistentStorage.set(HISTORY_KEY, history);
  }, [history]);

  // Save favorites whenever they change
  useEffect(() => {
    PersistentStorage.set(FAVORITES_KEY, favorites);
  }, [favorites]);

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites(prev => {
      const isFav = prev.some(r => r.id === recipe.id || r.name === recipe.name);
      if (isFav) {
        return prev.filter(r => r.id !== recipe.id && r.name !== recipe.name);
      }
      return [recipe, ...prev];
    });
  };

  const replaceWithFavorite = (dayNumber: number, favoriteRecipe: Recipe) => {
    setPlan(prev => prev.map(r => 
      r.dayNumber === dayNumber ? { ...favoriteRecipe, dayNumber } : r
    ));
    setView('planning');
  };

  const savePlanToHistory = (preferences: UserPreferences, recipes: Recipe[]) => {
    const newPlan: SavedMealPlan = {
      id: `plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      preferences,
      recipes,
    };
    setHistory(prev => [newPlan, ...prev]);
  };

  const handleOnboardingComplete = async (preferences: UserPreferences) => {
    setPrefs(preferences);
    setIsGenerating(true);
    try {
      const generatedPlan = await generateWeeklyPlan(preferences);
      setPlan(generatedPlan);
      savePlanToHistory(preferences, generatedPlan);
      setView('planning');
    } catch (error) {
      alert("Une erreur est survenue lors de la génération. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadPlan = (savedPlan: SavedMealPlan) => {
    setPrefs(savedPlan.preferences);
    setPlan(savedPlan.recipes);
    setView('planning');
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('Supprimer ce planning de l\'historique ?')) {
      setHistory(prev => prev.filter(p => p.id !== planId));
    }
  };

  // Bottom Navigation Logic
  const renderBottomNav = () => {
    if (view === 'onboarding') return null;
    
    return (
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 px-6 py-2 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button 
            onClick={() => setView('planning')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${view === 'planning' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Calendar size={24} strokeWidth={view === 'planning' ? 2.5 : 2} />
            <span className="text-[10px] font-medium mt-1">Planning</span>
          </button>
          
          <div className="w-px h-8 bg-slate-100"></div>

          <button 
            onClick={() => setView('groceries')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${view === 'groceries' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ShoppingBag size={24} strokeWidth={view === 'groceries' ? 2.5 : 2} />
            <span className="text-[10px] font-medium mt-1">Courses</span>
          </button>

          <div className="w-px h-8 bg-slate-100"></div>

          <button 
            onClick={() => setView('history')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all relative ${view === 'history' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <HistoryIcon size={24} strokeWidth={view === 'history' ? 2.5 : 2} />
            <span className="text-[10px] font-medium mt-1">Historique</span>
            {history.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {history.length > 9 ? '9+' : history.length}
              </span>
            )}
          </button>

          <div className="w-px h-8 bg-slate-100"></div>

          <button 
            onClick={() => setView('favorites')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all relative ${view === 'favorites' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Heart size={24} strokeWidth={view === 'favorites' ? 2.5 : 2} />
            <span className="text-[10px] font-medium mt-1">Favoris</span>
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {favorites.length > 9 ? '9+' : favorites.length}
              </span>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-emerald-100">
      <main className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] relative shadow-2xl shadow-slate-200/50">
        
        {view === 'onboarding' && (
          <Onboarding onComplete={handleOnboardingComplete} isLoading={isGenerating} />
        )}

        {view === 'planning' && (
          <MealPlanView 
            plan={plan} 
            onSelectRecipe={setSelectedRecipe}
            onToggleFavorite={toggleFavorite}
            favorites={favorites}
          />
        )}

        {view === 'groceries' && (
          <GroceryList plan={plan} />
        )}

        {view === 'history' && (
          <History
            history={history}
            onLoadPlan={handleLoadPlan}
            onDeletePlan={handleDeletePlan}
            onSelectRecipe={setSelectedRecipe}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {view === 'favorites' && (
          <Favorites
            favorites={favorites}
            onSelectRecipe={setSelectedRecipe}
            onToggleFavorite={toggleFavorite}
            onReplaceInPlan={(recipe) => {
              const day = prompt("Sur quel jour (1-7) voulez-vous ajouter cette recette ?", "1");
              if (day) {
                const dayNum = parseInt(day);
                if (dayNum >= 1 && dayNum <= 7) {
                  replaceWithFavorite(dayNum, recipe);
                }
              }
            }}
            isPlanActive={plan.length > 0}
          />
        )}

        {/* Modal handles its own state for simplicity here, controlled by App */}
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)}
          onToggleFavorite={toggleFavorite}
          isFavorite={selectedRecipe ? favorites.some(f => f.id === selectedRecipe.id || f.name === selectedRecipe.name) : false}
        />

        {renderBottomNav()}
        
        {/* Storage Debugger - uniquement en développement */}
        {IS_DEVELOPMENT && <StorageDebugger />}
        
      </main>
    </div>
  );
};

export default App;
