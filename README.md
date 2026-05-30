# Yavatmal 3D - Open World Driving Game

A multiplayer 3D open-world driving/roaming game featuring a realistic recreation of Yavatmal, Maharashtra city. Drive through the streets, select vehicles from a garage, and explore the city in single-player or multiplayer mode.

## 🚗 Features

### Core Gameplay
- **Open World**: Procedurally generated city with roads, buildings, trees, and street furniture
- **8 Unique Vehicles**: Sedan, Sports Car, SUV, Motorcycle, Truck, Auto Rickshaw, and more
- **Physics-Based Driving**: Realistic acceleration, braking, and handling
- **GTA-Style Camera**: Smooth third-person chase camera that follows your vehicle

### Day/Night Cycle
- Dynamic time progression with sun position changes
- Different sky colors and lighting for dawn, day, dusk, and night
- Animated clouds and traffic lights that glow at night

### Game Systems
- **Health & Fuel**: Manage your vehicle's health and fuel levels
- **Save/Load**: Progress is automatically saved to localStorage
- **Settings Menu**: Customize graphics quality, volume, and display options
- **Loading Screen**: Animated loading screen with progress indicator

### Multiplayer (Optional)
- Socket.io integration for real-time multiplayer
- See other players' vehicles moving around the city
- Works in single-player mode when server is unavailable

### Mobile Support
- Touch controls for mobile devices
- Virtual joystick for steering
- On-screen accelerate and brake buttons

## 🎮 Controls

| Key | Action |
|-----|--------|
| W / ↑ | Accelerate |
| S / ↓ | Brake / Reverse |
| A / ← | Turn Left |
| D / → | Turn Right |
| Space | Handbrake |
| G | Open Garage |
| ESC | Close Menu |
| , | Advance Time (test) |
| . | Go Back in Time (test) |

## 🛠️ Tech Stack

- **React 18** + TypeScript
- **Vite** for fast development and building
- **Three.js** + **React Three Fiber** for 3D graphics
- **Zustand** for state management
- **TailwindCSS** for styling
- **Socket.io** for multiplayer

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/openhands/openhand-ngp-roam-game.git

# Navigate to project directory
cd openhand-ngp-roam-game

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Running the Game

1. Start the development server: `npm run dev`
2. Open your browser to `http://localhost:3000`
3. Click "START GAME" to begin

### Multiplayer Mode

To enable multiplayer:
1. Start the server: `npm run server`
2. Open multiple browser tabs to the game URL
3. Players will be able to see each other

## 📁 Project Structure

```
src/
├── components/
│   ├── camera/          # Camera systems (ChaseCamera)
│   ├── multiplayer/     # Multiplayer components
│   ├── ui/             # UI components (HUD, Garage, Settings)
│   ├── vehicles/        # Vehicle components
│   └── world/          # 3D world components
├── hooks/              # Custom React hooks
├── services/           # Services (audio, database)
├── stores/             # Zustand state stores
└── App.tsx             # Main application
```

## 🎨 Customization

### Adding New Vehicles
Edit `src/stores/gameStore.ts` to add new vehicles to the `defaultVehicles` array.

### Modifying the City
The city is generated procedurally. Modify components in `src/components/world/` to change:
- Terrain appearance
- Road layout
- Building styles
- Tree placement

### Adjusting Physics
Vehicle physics can be modified in `src/components/vehicles/Vehicle.tsx`:
- `acceleration`: How fast the vehicle speeds up
- `maxSpeed`: Top speed in km/h
- `handling`: How responsive steering is

## 📱 Mobile Support

The game automatically detects touch devices and shows:
- Virtual joystick for steering
- Accelerate (▲) and Brake (■) buttons

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Built with [React Three Fiber](https://github.com/react-three/react-three-fiber)
- Inspired by classic GTA-style games
- City of Yavatmal, Maharashtra, India