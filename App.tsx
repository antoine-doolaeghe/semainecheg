import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { MealPlanView } from './components/MealPlanView';
import { GroceryList } from './components/GroceryList';
import { RecipeModal } from './components/RecipeModal';
import { History } from './components/History';
import { Recipe, UserPreferences, ViewState, SavedMealPlan } from './types';
import { generateWeeklyPlan, regenerateSingleRecipe } from './services/geminiService';
import { Calendar, ShoppingBag, History as HistoryIcon } from 'lucide-react';

const HISTORY_KEY = 'semainechef_history';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('onboarding');
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [plan, setPlan] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<SavedMealPlan[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  }, [history]);

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

  const handleRegenerateDay = async (dayNumber: number) => {
    if (!prefs) return;
    try {
      const newRecipe = await regenerateSingleRecipe(prefs, dayNumber);
      setPlan(prev => prev.map(r => r.dayNumber === dayNumber ? newRecipe : r));
    } catch (error) {
      alert("Impossible de régénérer ce jour.");
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
            onRegenerateDay={handleRegenerateDay}
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
          />
        )}

        {/* Modal handles its own state for simplicity here, controlled by App */}
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />

        {renderBottomNav()}
        
      </main>
    </div>
  );
};

export default App;
