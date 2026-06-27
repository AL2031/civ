# Civilization Game

A turn-based civilization strategy game built with React, featuring:

- **10x10 hex-style map** with varied terrain (plains, forest, desert, water, mountains)
- **2 civilizations** (Rome and Egypt) competing for dominance
- **Multiple unit types**: Warriors, Settlers, and Scouts
- **City building** with population growth and production
- **Resource management**: Food, Production, and Gold
- **Turn-based gameplay** with alternating turns between civilizations
- **Interactive UI** with unit movement, city construction, and resource tracking

## How to Play

1. **Select a tile** by clicking on it to view its properties
2. **Select a unit** by clicking on a tile containing a unit
3. **Move units** using the arrow buttons in the UI (when a unit is selected)
4. **Build cities** by selecting a settler and clicking "Build City"
5. **End your turn** by clicking the "End Turn" button
6. **Alternate turns** between Rome (red) and Egypt (gold)

## Terrain Types

- **Plains** (light green): Balanced food and production
- **Forest** (dark green): High production, lower food
- **Desert** (tan): Low food, some gold
- **Water** (blue): Food and gold bonus
- **Mountain** (gray): High production, impassable

## Unit Types

- **Warrior** (⚔️): Combat unit with 2 attack/2 defense
- **Settler** (🚶): Can build new cities
- **Scout** (🐎): Fast exploration unit

## Installation

### Prerequisites
You need Node.js and npm installed on your system.

1. Download Node.js from https://nodejs.org/
2. Install it (this will also install npm)

### Running the Game

1. Open a terminal in the project directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the URL shown (usually http://localhost:3000)

## Deploying to GitHub Pages

### Option 1: Manual Deployment

1. Create a new GitHub repository
2. Initialize git and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Install gh-pages CLI globally (if not already installed):
   ```bash
   npm install -g gh-pages
   ```
5. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```
6. Go to your repository settings on GitHub
7. Navigate to Pages → Build and deployment → Source
8. Select "Deploy from a branch" and choose "gh-pages" branch
9. Your game will be available at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### Option 2: Automatic Deployment with GitHub Actions

1. Create a new GitHub repository
2. Initialize git and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. Create `.github/workflows/deploy.yml` with the following content:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```
4. Push this file to GitHub
5. Go to your repository settings → Pages → Build and deployment
6. Select "GitHub Actions" as the source
7. Your game will automatically deploy on every push to main

## Project Structure

```
civ/
├── src/
│   ├── components/
│   │   ├── GameBoard.jsx    # Map rendering and tile interaction
│   │   └── GameUI.jsx       # Game controls and information panels
│   ├── App.jsx              # Main application component
│   ├── gameLogic.js         # Core game mechanics and state management
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles with Tailwind
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Future Enhancements

Potential features to add:
- Combat system between units
- Technology tree
- More civilizations
- Larger map sizes
- Victory conditions (domination, science, culture)
- Diplomacy between civilizations
- City specialization
- Wonders and great people
- Resource bonuses and luxury resources
