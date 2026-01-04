import React from 'react';
import { Recipe } from '../types';
import { Clock, Heart, Trash2, Plus, ChefHat } from 'lucide-react';

interface FavoritesProps {
  favorites: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
  onReplaceInPlan: (recipe: Recipe) => void;
  isPlanActive: boolean;
}

export const Favorites: React.FC<FavoritesProps> = ({ 
  favorites, 
  onSelectRecipe, 
  onToggleFavorite,
  onReplaceInPlan,
  isPlanActive
}) => {
  if (favorites.length === 0) {
    return (
      <div className="pb-24 animate-in slide-in-from-bottom-4 duration-500">
        <div className="px-6 py-6 sticky top-0 bg-[#F8FAFC] z-10 border-b border-slate-100/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-slate-900">Coups de Coeur</h2>
          <p className="text-slate-500">Vos recettes préférées</p>
        </div>
        
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <Heart size={32} className="text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucun favori</h3>
          <p className="text-slate-500 text-sm max-w-xs">
            Cliquez sur le coeur d'une recette pour l'enregistrer ici et la retrouver plus tard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-in slide-in-from-bottom-4 duration-500">
      <div className="px-6 py-6 sticky top-0 bg-[#F8FAFC] z-10 border-b border-slate-100/50 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-slate-900">Coups de Coeur</h2>
        <p className="text-slate-500">{favorites.length} recette{favorites.length > 1 ? 's' : ''} enregistrée{favorites.length > 1 ? 's' : ''}</p>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {favorites.map((recipe) => (
          <div 
            key={recipe.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4"
          >
            <div 
              onClick={() => onSelectRecipe(recipe)}
              className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
            >
              <ChefHat size={24} className="text-emerald-600" />
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div onClick={() => onSelectRecipe(recipe)} className="cursor-pointer">
                <h3 className="font-semibold text-slate-900 leading-tight truncate">
                  {recipe.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <Clock size={12} /> {recipe.totalTimeMinutes} min
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                {isPlanActive && (
                  <button
                    onClick={() => onReplaceInPlan(recipe)}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus size={14} /> Ajouter au planning
                  </button>
                )}
                <button
                  onClick={() => onToggleFavorite(recipe)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer des favoris"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

