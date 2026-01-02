import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserPreferences, Recipe, IngredientCategory } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("Missing VITE_GEMINI_API_KEY environment variable");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const modelId = "gemini-2.0-flash";

// Define schema for structured output
const ingredientSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    quantity: { type: Type.STRING },
    unit: { type: Type.STRING },
    category: { 
      type: Type.STRING, 
      enum: Object.values(IngredientCategory) 
    },
  },
  required: ["name", "quantity", "unit", "category"],
};

const macrosSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    calories: { type: Type.INTEGER, description: "Kcal per person" },
    protein: { type: Type.INTEGER, description: "Grams of protein per person" },
    carbs: { type: Type.INTEGER, description: "Grams of carbs per person" },
    fat: { type: Type.INTEGER, description: "Grams of fat per person" },
  },
  required: ["calories", "protein", "carbs", "fat"],
};

const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    totalTimeMinutes: { type: Type.INTEGER },
    ingredients: { 
      type: Type.ARRAY, 
      items: ingredientSchema 
    },
    steps: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    },
    tips: { type: Type.STRING },
    macros: macrosSchema,
  },
  required: ["name", "totalTimeMinutes", "ingredients", "steps", "macros"],
};

const mealPlanSchema: Schema = {
  type: Type.ARRAY,
  items: recipeSchema,
};

export const generateWeeklyPlan = async (prefs: UserPreferences): Promise<Recipe[]> => {
  let goalContext: string = prefs.goal;
  
  if (prefs.goal === 'sport') {
    goalContext = "Sport / Running (Endurance). Focus : Glucides complexes (pâtes, riz, quinoa) pour le glycogène, Protéines de qualité pour la récupération musculaire. Plats digestes pour le soir (pas trop gras).";
  }

  const prompt = `
    Génère un planning de ${prefs.numberOfMeals} dîners pour 2 personnes.
    
    Profil utilisateur :
    - Objectif : ${goalContext}
    - Niveau : ${prefs.cookingLevel}
    - Restrictions : ${prefs.restrictions || "Aucune"}
    - J'ai déjà dans mes placards : ${prefs.pantryItems || "Rien de spécifique"}

    Contraintes strictes :
    1. Temps de préparation : 20-30 min maximum par recette.
    2. Ingrédients faciles à trouver en supermarché standard.
    3. ANTI-GASPILLAGE : Essaie de réutiliser les ingrédients frais (ex: si on achète un bouquet de persil, l'utiliser sur 2-3 recettes dans la semaine).
    4. Repas du soir : pas trop lourds.
    5. Inclus les MACROS (Calories, Protéines, Glucides, Lipides) par personne.
    6. Format JSON strict.

    Retourne exactement ${prefs.numberOfMeals} recettes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: mealPlanSchema,
        systemInstruction: "Tu es un nutritionniste sportif et chef cuisinier expert. Tu conçois des repas optimisés pour la performance (course à pied) et la récupération.",
      },
    });

    const data = JSON.parse(response.text || "[]");
    
    // Add IDs and day numbers
    return data.map((recipe: any, index: number) => ({
      ...recipe,
      id: `recipe-${Date.now()}-${index}`,
      dayNumber: index + 1
    }));
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};

export const regenerateSingleRecipe = async (prefs: UserPreferences, dayNumber: number): Promise<Recipe> => {
  let goalContext: string = prefs.goal;
  if (prefs.goal === 'sport') {
    goalContext = "Sport / Running (Endurance). Focus : Glucides complexes, Protéines, pas trop gras.";
  }

  const prompt = `
    Génère UNE SEULE recette de dîner pour 2 personnes (Jour ${dayNumber}).
    
    Profil: ${goalContext}, Niveau: ${prefs.cookingLevel}, Restrictions: ${prefs.restrictions}.
    Contraintes: 20-30 min, ingrédients simples, léger pour le soir. Inclus les macros.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const data = JSON.parse(response.text || "{}");
    return {
      ...data,
      id: `recipe-regen-${Date.now()}`,
      dayNumber: dayNumber
    };
  } catch (error) {
    console.error("Error regenerating recipe:", error);
    throw error;
  }
};
