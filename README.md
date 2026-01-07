# GrowthAI - Small Business Growth Assistant

A comprehensive AI-powered platform to help small businesses grow through strategic planning, content creation, and community engagement.

## 🚀 Features

### 📊 Dashboard
- Real-time business metrics and analytics
- Community reach tracking
- Growth index monitoring
- Funds raised overview
- Interactive activity charts
- Success checklist for onboarding

### 📅 Growth Planner
- AI-powered marketing strategy generation
- Budget-based recommendations
- Time-optimized scheduling
- Platform selection based on constraints
- Weekly task breakdown
- Dynamic key actions

### 🎨 Content Studio
- **AI Image Generation** (with Stability AI integration)
- **Smart Fallback System** (uses curated stock photos when API key not configured)
- AI-powered caption generation
- Hashtag recommendations
- Multiple caption variations
- Scheduling suggestions
- Product category detection

### 💰 Community Engine
- Crowdfunding pitch generator
- Talent marketplace
- Freelancer discovery
- Gig listings
- Budget-based matching

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Routing**: React Router DOM
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **Styling**: CSS with glassmorphism effects
- **Animations**: Framer Motion
- **AI Integration**: Stability AI (optional)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd TechTitans_E103-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**
   
   For AI image generation, create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   
   Then add your Stability AI API key:
   ```env
   VITE_STABILITY_API_KEY=your_actual_api_key_here
   ```
   
   **Note**: If you don't configure an API key, the app will automatically use high-quality stock photos from Unsplash as fallback images.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## 🖼️ Image Generation Setup

### Option 1: Use Stock Photos (Default - No Setup Required)
The app works perfectly without any API key! It uses intelligent category detection to select relevant stock photos from Unsplash.

### Option 2: Enable AI Image Generation
1. Sign up for a [Stability AI account](https://platform.stability.ai/)
2. Get your API key from the dashboard
3. Add it to your `.env` file:
   ```env
   VITE_STABILITY_API_KEY=sk-your-actual-key-here
   ```
4. Restart the dev server

**Supported Image Styles:**
- Photographic (default)
- Digital Art
- Fantasy Art
- Analog Film
- Neon Punk
- And more!

## 📁 Project Structure

```
TechTitans_E103-main/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   └── Sidebar.css
│   ├── pages/
│   │   ├── Dashboard.jsx       # Analytics dashboard
│   │   ├── Plan.jsx            # Growth planner
│   │   ├── Create.jsx          # Content creation studio
│   │   ├── Fund.jsx            # Crowdfunding & marketplace
│   │   └── *.css               # Page-specific styles
│   ├── lib/
│   │   ├── db.js               # LocalStorage data layer
│   │   └── stabilityAI.js      # AI image generation & fallback
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── .env.example                # Environment variables template
├── package.json
└── vite.config.js
```

## 🎯 How It Works

### Growth Planner Logic
The planner uses **strict constraint-based optimization**:
- **Budget < ₹5,000**: 100% organic strategy, no paid ads
- **Budget ₹5,000-₹20,000**: 70% organic, 30% paid
- **Budget ₹20,000-₹50,000**: 60% organic, 40% paid
- **Budget > ₹100,000**: 20% organic, 80% paid (aggressive scaling)

Time constraints also affect recommendations:
- **< 3 hours/week**: High-efficiency content (Reels only)
- **3-6 hours/week**: Balanced approach
- **> 10 hours/week**: Full content calendar with live sessions

### Content Studio Intelligence
The Create module automatically:
1. Detects product category from description
2. Selects appropriate image style/category
3. Generates 4 caption variations
4. Suggests relevant hashtags
5. Recommends optimal posting time

**Category Detection Examples:**
- Fashion keywords → Fashion stock photos / Digital art style
- Beauty products → Beauty stock photos / Photographic style
- Tech products → Tech stock photos / Digital art style
- Furniture → Home decor photos / Photographic style

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design Features

- **Dark Mode UI** with glassmorphism effects
- **Gradient Accents** for modern look
- **Smooth Animations** with Framer Motion
- **Responsive Design** for all screen sizes
- **Custom Scrollbars** for better UX
- **Hover Effects** for interactive elements

## 💾 Data Storage

Currently uses **localStorage** for:
- User profile
- Marketing plans
- Campaigns
- Content drafts

This makes the app work offline and requires no backend setup!

## 🚀 Deployment

Build the production version:
```bash
npm run build
```

The `dist` folder can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_STABILITY_API_KEY` | No | Stability AI API key for image generation. If not provided, uses stock photos. |

## 🤝 Contributing

This is a hackathon project for **TechTitans_E103**. Feel free to fork and improve!

## 📄 License

MIT License - feel free to use this for your own projects!

## 🙋 Support

If you encounter any issues:
1. Check that all dependencies are installed (`npm install`)
2. Ensure you're using Node.js 16+ 
3. Clear browser cache and localStorage if needed
4. Check browser console for errors

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Stability AI API Docs](https://platform.stability.ai/docs)
- [Chart.js Documentation](https://www.chartjs.org)

---

**Built with ❤️ for small businesses everywhere**
