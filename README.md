<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SemaineChef 🍳

Planifiez vos repas de la semaine avec l'IA. Une application qui génère des plans de repas personnalisés selon vos objectifs (sportif, équilibré, etc.), votre niveau de cuisine et vos restrictions alimentaires.

## ✨ Nouveauté : Persistance Ultra-Longue

Vos recettes sont maintenant sauvegardées dans des **cookies avec une durée de vie de 10 ans** ! Plus besoin de craindre la perte de vos plannings lors du vidage du cache. 

🔗 [Guide de démarrage rapide](QUICKSTART.md) | [Documentation complète](SUMMARY.md)

## 🚀 Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your Gemini API key:
   ```bash
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy on Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/semainechef&env=VITE_GEMINI_API_KEY&envDescription=Your%20Gemini%20API%20key&envLink=https://aistudio.google.com/app/apikey)

### Manual Deploy

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com) and import your repository

3. Add environment variable:
   - **Name:** `VITE_GEMINI_API_KEY`
   - **Value:** Your Gemini API key

4. Click **Deploy**

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | ✅ | Your Google Gemini API key |

## 🛠 Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI:** Google Gemini API
- **Storage:** Persistent Cookies (10 years) + localStorage fallback

## 📁 Project Structure

```
semainechef/
├── App.tsx              # Main app component
├── index.tsx            # Entry point
├── types.ts             # TypeScript types
├── components/
│   ├── Button.tsx
│   ├── GroceryList.tsx
│   ├── History.tsx
│   ├── Input.tsx
│   ├── MealPlanView.tsx
│   ├── Onboarding.tsx
│   ├── RecipeModal.tsx
│   └── StorageDebugger.tsx  # 🆕 Storage debugger (dev only)
├── services/
│   ├── geminiService.ts     # Gemini API integration
│   ├── cookieService.ts     # 🆕 Persistent cookies service
│   └── COOKIES_README.md    # 🆕 Technical documentation
├── vercel.json          # Vercel configuration
└── vite.config.ts       # Vite configuration
```

## 🍪 Persistent Storage

This app uses a sophisticated cookie-based storage system with:
- **10-year persistence** (maximum allowed)
- **Automatic chunking** for large data
- **localStorage fallback** for redundancy
- **Automatic migration** from old localStorage data
- **Debug interface** in development mode

📖 Read more: [SUMMARY.md](SUMMARY.md) | [QUICKSTART.md](QUICKSTART.md)

## 📝 License

MIT
