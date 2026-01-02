import React from 'react';
import { Recipe } from '../types';
import { X, Clock, Users, ChefHat } from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 rounded-full text-slate-900 hover:bg-white transition-colors shadow-lg"
          >
            <X size={20} />
          </button>
          <div className="pt-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{recipe.name}</h2>
            <div className="flex gap-4 text-white/90 text-sm font-medium">
              <span className="flex items-center gap-1.5"><Clock size={16}/> {recipe.totalTimeMinutes} min</span>
              <span className="flex items-center gap-1.5"><Users size={16}/> 2 pers.</span>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Macros Section */}
          {recipe.macros && (
            <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Kcal</div>
                <div className="font-bold text-slate-900 text-lg">{recipe.macros.calories}</div>
              </div>
              <div className="text-center border-l border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Prot.</div>
                <div className="font-bold text-emerald-700 text-lg">{recipe.macros.protein}<span className="text-xs font-normal">g</span></div>
              </div>
              <div className="text-center border-l border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Gluc.</div>
                <div className="font-bold text-slate-900 text-lg">{recipe.macros.carbs}<span className="text-xs font-normal">g</span></div>
              </div>
              <div className="text-center border-l border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Lip.</div>
                <div className="font-bold text-slate-900 text-lg">{recipe.macros.fat}<span className="text-xs font-normal">g</span></div>
              </div>
            </div>
          )}

          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
              Ingrédients
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipe.ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-700 font-medium capitalize">{ing.name}</span>
                  <span className="text-emerald-700 font-bold text-sm bg-emerald-50 px-2 py-1 rounded-lg">
                    {ing.quantity} {ing.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
              Préparation
            </h3>
            <div className="space-y-6">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-slate-600 leading-relaxed pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          {recipe.tips && (
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
              <ChefHat className="text-amber-500 shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-amber-800 text-sm mb-1">Le conseil du chef</h4>
                <p className="text-sm text-amber-700 leading-relaxed">{recipe.tips}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};