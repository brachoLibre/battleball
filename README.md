# Football Field Battle

## Game Overview
A fast-paced 2D football game where you control a player on the blue team, competing against AI-controlled red team players. Pass the ball to teammates, tackle opponents, and score goals in this exciting field battle!

## How to Play
- **Arrow Keys**: Move your character
- **Space Bar**: Pass ball to closest teammate (when you have it) or kick/tackle (when you don't)
- **Shift+F**: Toggle fullscreen mode

## Game Features
- **Smart Passing**: Automatic passing to the closest teammate
- **AI Opponents**: Intelligent red team players with strategic positioning
- **Physics System**: Realistic ball movement and player collisions
- **Obstacles**: Trees and rocks on the field that affect gameplay
- **Team-based Gameplay**: 5 vs 5 players with tactical positioning

## Technical Architecture
- **Canvas-based rendering** at 1200x700 resolution
- **Component-based architecture** with separate systems for physics, rendering, AI, and input
- **Global namespace pattern** for easy deployment
- **Collision detection** for player-to-player, player-to-obstacle, and player-to-ball interactions

## File Structure
```
src/
├── core/           # Foundation systems
│   ├── input.js    # Keyboard input handling
│   └── loop.js     # Game loop management
├── engine/         # Reusable game systems
│   ├── physics.js  # Movement and collision physics
│   └── renderer.js # Canvas rendering system
├── game/           # Game-specific logic
│   ├── main.js     # Game controller and initialization
│   ├── player.js   # Player character class
│   ├── ball.js     # Ball physics and behavior
│   ├── obstacles.js # Field obstacles
│   └── ai.js       # AI player behavior
└── utils/          # Helper utilities
    └── math.js     # Vector2D and math functions
```

## Getting Started
1. Clone this repository
2. Open `index.html` in a modern web browser
3. No additional installation required - runs entirely in the browser!

## Development
- Built with vanilla JavaScript and HTML5 Canvas
- Uses MakkoEngine for sprite animations (if available)
- Follows global namespace pattern for production builds
- Modular architecture for easy extension

## Publishing
This game can be published on:
- GitHub Pages (free)
- Netlify Drop (free)
- itch.io (free game hosting)
- Any static web hosting service

Simply upload the entire folder and open `index.html` to play!