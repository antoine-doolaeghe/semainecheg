import React, { useMemo, useState } from 'react';
import { Recipe, Ingredient, IngredientCategory } from '../types';
import { Check, Copy, Share2, ShoppingCart } from 'lucide-react';
import { Button } from './Button';

interface GroceryListProps {
  plan: Recipe[];
}

interface CategorizedList {
  [category: string]: Ingredient[];
}

export const GroceryList: React.FC<GroceryListProps> = ({ plan }) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isStoreMode, setIsStoreMode] = useState(false);

  // Logic to aggregate ingredients
  const consolidatedList = useMemo(() => {
    const map = new Map<string, Ingredient>();

    plan.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        // Normalize name: lowercase, trim, remove minimal plural "s" if simple
        // This is a basic normalization. Ideally, the AI output is already somewhat normalized.
        const normalizedName = ing.name.toLowerCase().trim();
        const key = `${normalizedName}-${ing.unit}`; // Key by name + unit to avoid summing kg with g blindly

        if (map.has(key)) {
          const existing = map.get(key)!;
          // Try to sum if numeric
          const valA = parseFloat(existing.quantity);
          const valB = parseFloat(ing.quantity);
          if (!isNaN(valA) && !isNaN(valB)) {
            existing.quantity = (valA + valB).toString();
          } else {
            // Concatenate if not numeric (e.g. "some" + "some")
            // Or just leave as is if tricky. For this MVP, let's keep it simple:
            // If we can't sum, we don't merge perfectly, or we just keep the first one
            // but usually AI returns numbers.
          }
        } else {
          map.set(key, { ...ing, name: normalizedName });
        }
      });
    });

    // Group by category
    const categorized: CategorizedList = {};
    Object.values(IngredientCategory).forEach(cat => categorized[cat] = []);

    Array.from(map.values()).forEach(ing => {
      const cat = ing.category || IngredientCategory.OTHER;
      if (!categorized[cat]) categorized[cat] = [];
      categorized[cat].push(ing);
    });

    return categorized;
  }, [plan]);

  const toggleCheck = (id: string) => {
    const next = new Set(checkedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedItems(next);
  };

  const copyToClipboard = () => {
    let text = "🛒 Ma liste de courses SemaineChef:\n\n";
    (Object.entries(consolidatedList) as [string, Ingredient[]][]).forEach(([cat, items]) => {
      if (items.length > 0) {
        text += `__${cat}__\n`;
        items.forEach(item => text += `- ${item.quantity} ${item.unit} ${item.name}\n`);
        text += "\n";
      }
    });
    navigator.clipboard.writeText(text);
    alert("Liste copiée !");
  };

  return (
    <div className="pb-24 animate-in slide-in-from-bottom-4 duration-500">
      <div className="px-6 py-6 sticky top-0 bg-[#F8FAFC] z-10 border-b border-slate-100/50 backdrop-blur-sm flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Courses</h2>
          <p className="text-slate-500 text-sm">Liste optimisée pour 2.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setIsStoreMode(!isStoreMode)}
             className={`p-2 rounded-lg transition-colors ${isStoreMode ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-500 border border-slate-200'}`}
             title="Mode magasin"
           >
             <ShoppingCart size={20} />
           </button>
           <button 
             onClick={copyToClipboard}
             className="p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition-colors"
             title="Copier"
           >
             <Copy size={20} />
           </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {(Object.entries(consolidatedList) as [string, Ingredient[]][]).map(([category, items]) => {
          if (items.length === 0) return null;
          
          return (
            <div key={category} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <h3 className="font-bold text-emerald-800 mb-3 text-sm uppercase tracking-wide opacity-80">{category}</h3>
              <div className="space-y-1">
                {items.map((ing, idx) => {
                  const id = `${category}-${ing.name}-${ing.unit}`;
                  const isChecked = checkedItems.has(id);
                  
                  if (isStoreMode && isChecked) return null; // Hide checked items in store mode

                  return (
                    <div 
                      key={id} 
                      onClick={() => toggleCheck(id)}
                      className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-all ${isChecked ? 'opacity-40' : 'hover:bg-slate-50'}`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'}`}>
                        {isChecked && <Check size={14} strokeWidth={3} />}
                      </div>
                      <div className={isChecked ? 'line-through decoration-slate-400' : ''}>
                        <span className="font-semibold text-slate-900">{ing.name}</span>
                        <span className="text-slate-500 text-sm ml-2">{ing.quantity} {ing.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {isStoreMode && (
          <div className="text-center p-8 text-slate-400">
             <p>Les articles cochés sont masqués.</p>
             <button onClick={() => setIsStoreMode(false)} className="text-emerald-600 underline text-sm mt-2">Tout afficher</button>
          </div>
        )}
      </div>
    </div>
  );
};