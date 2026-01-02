import React, { useState } from 'react';
import { Recipe } from '../types';
import { Clock, ChevronRight, RefreshCw, Eye } from 'lucide-react';
import { Button } from './Button';

interface MealPlanViewProps {
  plan: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onRegenerateDay: (dayNumber: number) => Promise<void>;
}

export const MealPlanView: React.FC<MealPlanViewProps> = ({ plan, onSelectRecipe, onRegenerateDay }) => {
  const [loadingDay, setLoadingDay] = useState<number | null>(null);

  const handleRegenerate = async (e: React.MouseEvent, dayNumber: number) => {
    e.stopPropagation();
    setLoadingDay(dayNumber);
    try {
      await onRegenerateDay(dayNumber);
    } finally {
      setLoadingDay(null);
    }
  };

  return (
    <div className="pb-24 animate-in slide-in-from-bottom-4 duration-500">
      <div className="px-6 py-6 sticky top-0 bg-[#F8FAFC] z-10 border-b border-slate-100/50 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-slate-900">Votre Semaine</h2>
        <p className="text-slate-500">{plan.length} dîners équilibrés et rapides.</p>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {plan.map((recipe) => (
          <div 
            key={recipe.id}
            onClick={() => onSelectRecipe(recipe)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer relative group overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase mb-1">
                      Jour {recipe.dayNumber}
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full">
                      <Clock size={12} /> {recipe.totalTimeMinutes} min
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 leading-tight line-clamp-2">
                    {recipe.name}
                  </h3>
                  
                  {recipe.macros && (
                    <div className="flex gap-2 mt-2 text-[10px] font-medium text-slate-500">
                      <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">{recipe.macros.protein}g prot.</span>
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded">{recipe.macros.calories} kcal</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-2">
                   <p className="text-xs text-slate-500 line-clamp-1">
                    {recipe.ingredients.length} ingrédients
                   </p>
                   <button 
                    onClick={(e) => handleRegenerate(e, recipe.dayNumber)}
                    disabled={loadingDay === recipe.dayNumber}
                    className="p-2 -m-2 text-slate-300 hover:text-emerald-600 transition-colors"
                    title="Changer cette recette"
                   >
                     {loadingDay === recipe.dayNumber ? (
                       <RefreshCw size={18} className="animate-spin text-emerald-600" />
                     ) : (
                       <RefreshCw size={18} />
                     )}
                   </button>
                </div>
              </div>
            </div>
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
              <ChevronRight className="text-slate-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};