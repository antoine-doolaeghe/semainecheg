import React from 'react';
import { Recipe } from '../types';
import { Clock, ChevronRight, Heart } from 'lucide-react';

interface MealPlanViewProps {
  plan: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
  favorites: Recipe[];
}

export const MealPlanView: React.FC<MealPlanViewProps> = ({ 
  plan, 
  onSelectRecipe,
  onToggleFavorite,
  favorites
}) => {
  const isFavorite = (recipe: Recipe) => 
    favorites.some(f => f.id === recipe.id || f.name === recipe.name);

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
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer relative group overflow-hidden"
          >
            <div className="flex flex-col gap-3" onClick={() => onSelectRecipe(recipe)}>
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
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(recipe);
              }}
              className="absolute right-3 bottom-3 p-2 rounded-full hover:bg-slate-50 transition-colors z-20"
            >
              <Heart 
                size={20} 
                className={isFavorite(recipe) ? "text-rose-500 fill-rose-500" : "text-slate-300"} 
              />
            </button>
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
              <ChevronRight className="text-slate-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};