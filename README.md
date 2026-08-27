# 🐦 Angry Birds Game

A browser-based **Angry Birds** clone built with **Vanilla JavaScript** and the **HTML5 Canvas API** — featuring physics simulation, multiple bird types with special abilities, destructible block structures, and a full level progression system.

---

## ✨ Features

- 🎯 **Slingshot Mechanic** — Click and drag to aim and launch birds with realistic physics
- 🐦 **4 Bird Types** with unique abilities:
  - 🔴 **Red Bird** — Standard bird
  - 💛 **Yellow Bird** — Tap mid-air for a speed boost
  - 🔵 **Blue Bird** — Splits into 3 on tap
  - ⚫ **Black Bird** — Explodes on tap
  - ⚪ **White Bird** — Drops an egg bomb on tap
- 🐷 **Pigs & Destructible Blocks** — Wood, stone, and ice blocks with HP and damage levels
- 🌟 **Star Rating System** — 1–3 stars per level based on score
- 🔒 **Level Progression** — Unlock levels by completing the previous one (saved to localStorage)
- 📱 **Touch Support** — Works on mobile and desktop
- 📷 **Smooth Camera** — Follows the bird mid-flight
- 💥 **Particles & Animations** — Explosion effects, score popups, and debris

---

## 🗂️ Project Structure

```
angry-birds-game/
├── index.html          # Game shell with HUD screens
├── style.css           # All game UI styles
├── src/
│   ├── main.js         # Game loop, input, collision orchestration
│   ├── physics.js      # Vec2 math, gravity, collision detection & resolution
│   ├── entities.js     # Bird, pig, block, particle factory functions
│   ├── levels.js       # Level definitions and builder
│   └── renderer.js     # All canvas drawing functions
└── package.json
```

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| Vanilla JavaScript (ES Modules) | Game logic |
| HTML5 Canvas API | Rendering |
| Vite | Dev server & bundler |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v16+

### Installation & Run

```bash
git clone https://github.com/ojasvcode/angry-birds-game.git
cd angry-birds-game
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🎮 How to Play

1. Click **Play** to select a level
2. **Click and drag** the bird on the slingshot to aim
3. **Release** to launch
4. While the bird is in the air, **click/tap** to activate its special ability
5. Destroy all pigs to complete the level
6. Earn up to ⭐⭐⭐ stars based on your score

---

## 📐 Physics System

- Custom **2D rigid body physics** (no external library)
- Impulse-based **collision resolution**
- **AABB + Circle** collision detection
- Bodies have mass, velocity, restitution, and friction
- Sleep states to optimize performance

---

## 📄 License

This project is for educational purposes only and is not affiliated with Rovio Entertainment.

---

<div align="center">Made with ❤️ by <a href="https://github.com/ojasvcode">ojasvcode</a></div>
