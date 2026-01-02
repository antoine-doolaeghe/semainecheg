import React from 'react';
import { SavedMealPlan, Recipe } from '../types';
import { Clock, ChefHat, Trash2, Calendar, ChevronRight } from 'lucide-react';

interface HistoryProps {
  history: SavedMealPlan[];
  onLoadPlan: (plan: SavedMealPlan) => void;
  onDeletePlan: (planId: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const History: React.FC<HistoryProps> = ({ 
  history, 
  onLoadPlan, 
  onDeletePlan,
  onSelectRecipe 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getGoalLabel = (goal: string) => {
    const labels: Record<string, string> = {
      'balanced': 'Équilibré',
      'quick': 'Rapide',
      'cheap': 'Économique',
      'sport': 'Sportif',
      'vegetarian': 'Végétarien'
    };
    return labels[goal] || goal;
  };

  if (history.length === 0) {
    return (
      <div className="pb-24 animate-in slide-in-from-bottom-4 duration-500">
        <div className="px-6 py-6 sticky top-0 bg-[#F8FAFC] z-10 border-b border-slate-100/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-slate-900">Historique</h2>
          <p className="text-slate-500">Vos plannings précédents</p>
        </div>
        
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Calendar size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucun historique</h3>
          <p className="text-slate-500 text-sm max-w-xs">
            Vos plannings de repas générés apparaîtront ici pour que vous puissiez les consulter plus tard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-in slide-in-from-bottom-4 duration-500">
      <div className="px-6 py-6 sticky top-0 bg-[#F8FAFC] z-10 border-b border-slate-100/50 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-slate-900">Historique</h2>
        <p className="text-slate-500">{history.length} planning{history.length > 1 ? 's' : ''} sauvegardé{history.length > 1 ? 's' : ''}</p>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {history.map((savedPlan) => (
          <div 
            key={savedPlan.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={14} className="text-emerald-600" />
                    <span className="text-sm font-medium text-slate-900">
                      {formatDate(savedPlan.createdAt)}
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      {getGoalLabel(savedPlan.preferences.goal)}
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {savedPlan.recipes.length} repas
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onLoadPlan(savedPlan)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Charger ce planning"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <button
                    onClick={() => onDeletePlan(savedPlan.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Recipe previews */}
            <div className="p-3 space-y-2">
              {savedPlan.recipes.slice(0, 3).map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => onSelectRecipe(recipe)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                    <ChefHat size={16} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {recipe.name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={10} /> {recipe.totalTimeMinutes} min
                    </p>
                  </div>
                </button>
              ))}
              
              {savedPlan.recipes.length > 3 && (
                <p className="text-xs text-slate-400 text-center pt-1">
                  +{savedPlan.recipes.length - 3} autres recettes
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

