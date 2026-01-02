import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { ChefHat, Leaf, Clock, TrendingUp, DollarSign, Dumbbell, Minus, Plus } from 'lucide-react';

interface OnboardingProps {
  onComplete: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const GOALS = [
  { id: 'balanced', label: 'Équilibré', icon: Leaf },
  { id: 'quick', label: 'Rapide', icon: Clock },
  { id: 'cheap', label: 'Économique', icon: DollarSign },
  { id: 'sport', label: 'Sport / Running', icon: Dumbbell },
  { id: 'vegetarian', label: 'Végétarien', icon: TrendingUp },
] as const;

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, isLoading }) => {
  const [prefs, setPrefs] = useState<UserPreferences>({
    goal: 'balanced',
    restrictions: '',
    cookingLevel: 'intermediate',
    pantryItems: '',
    numberOfMeals: 7
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(prefs);
  };

  const adjustMeals = (delta: number) => {
    setPrefs(prev => ({
      ...prev,
      numberOfMeals: Math.max(1, Math.min(7, prev.numberOfMeals + delta))
    }));
  };

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col min-h-[80vh] justify-center animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
          <ChefHat size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">SemaineChef</h1>
        <p className="text-slate-600">Planifiez vos dîners parfaits en moins d'une minute.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Goal Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Quel est votre objectif ?</label>
          <div className="grid grid-cols-2 gap-3">
            {GOALS.map((goal) => {
              const Icon = goal.icon;
              const isSelected = prefs.goal === goal.id;
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setPrefs({ ...prefs, goal: goal.id as any })}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all
                    ${isSelected 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500' 
                      : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200'}`}
                >
                  <Icon size={16} />
                  {goal.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Number of Meals */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Combien de repas ?</label>
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-500 text-sm pl-2">Dîners pour la semaine</span>
            <div className="flex items-center gap-4">
              <button 
                type="button" 
                onClick={() => adjustMeals(-1)}
                className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-emerald-100 hover:text-emerald-600 active:scale-95 transition-all border border-slate-100"
              >
                <Minus size={18} />
              </button>
              <span className="font-bold text-xl text-slate-900 w-8 text-center">{prefs.numberOfMeals}</span>
              <button 
                type="button" 
                onClick={() => adjustMeals(1)}
                className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-emerald-100 hover:text-emerald-600 active:scale-95 transition-all border border-slate-100"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Level */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Niveau de cuisine</label>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['beginner', 'intermediate'] as const).map((level) => (
               <button
               key={level}
               type="button"
               onClick={() => setPrefs({ ...prefs, cookingLevel: level })}
               className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize
                 ${prefs.cookingLevel === level 
                   ? 'bg-white text-slate-900 shadow-sm' 
                   : 'text-slate-500 hover:text-slate-700'}`}
             >
               {level === 'beginner' ? 'Débutant' : 'Normal'}
             </button>
            ))}
          </div>
        </div>

        {/* Text Inputs */}
        <Input 
          label="Restrictions (allergies, régimes...)"
          placeholder="ex: Sans gluten, pas de porc..."
          value={prefs.restrictions}
          onChange={(e) => setPrefs({ ...prefs, restrictions: e.target.value })}
        />

        <Input 
          label="J'ai déjà (optionnel)"
          placeholder="ex: Des œufs, beaucoup de riz, du curry..."
          value={prefs.pantryItems}
          onChange={(e) => setPrefs({ ...prefs, pantryItems: e.target.value })}
        />

        <div className="pt-4">
          <Button type="submit" fullWidth isLoading={isLoading}>
            Générer {prefs.numberOfMeals} recettes
          </Button>
        </div>
      </form>
    </div>
  );
};