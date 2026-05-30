import { create } from 'zustand'

export interface Vehicle {
  id: string
  name: string
  type: 'sedan' | 'sports' | 'suv' | 'motorcycle' | 'truck' | 'autorickshaw'
  color: string
  maxSpeed: number
  acceleration: number
  handling: number
  unlockLevel: number
  unlocked: boolean
}

export interface PlayerState {
  id: string
  name: string
  position: [number, number, number]
  rotation: [number, number, number]
  speed: number
  vehicleId: string | null
  health: number
  fuel: number
}

export interface GameSettings {
  graphicsQuality: 'low' | 'medium' | 'high'
  showDamage: boolean
  showMinimap: boolean
  musicVolume: number
  sfxVolume: number
  controllerEnabled: boolean
}

export interface GameState {
  // Player
  player: PlayerState
  setPlayerPosition: (position: [number, number, number]) => void
  setPlayerRotation: (rotation: [number, number, number]) => void
  setPlayerSpeed: (speed: number) => void
  takeDamage: (amount: number) => void
  refuel: (amount: number) => void
  
  // Time of day (0-1, where 0.5 is noon)
  timeOfDay: number
  setTimeOfDay: (time: number) => void
  isDayTime: () => boolean
  
  // Vehicles
  vehicles: Vehicle[]
  selectedVehicle: string | null
  setSelectedVehicle: (vehicleId: string | null) => void
  unlockVehicle: (vehicleId: string) => void
  
  // UI State
  isGarageOpen: boolean
  setGarageOpen: (open: boolean) => void
  isPaused: boolean
  setPaused: (paused: boolean) => void
  isSettingsOpen: boolean
  setSettingsOpen: (open: boolean) => void
  
  // Multiplayer
  remotePlayers: Map<string, PlayerState>
  addRemotePlayer: (id: string, player: PlayerState) => void
  removeRemotePlayer: (id: string) => void
  updateRemotePlayer: (id: string, updates: Partial<PlayerState>) => void
  
  // Game State
  gameStarted: boolean
  startGame: () => void
  resetGame: () => void
  
  // Settings
  settings: GameSettings
  updateSettings: (settings: Partial<GameSettings>) => void
  
  // Save/Load
  saveProgress: () => void
  loadProgress: () => void
  
  // Loading
  isLoading: boolean
  setLoading: (loading: boolean) => void
  loadingProgress: number
  setLoadingProgress: (progress: number) => void
}

const defaultVehicles: Vehicle[] = [
  { id: 'sedan-1', name: 'Classic Sedan', type: 'sedan', color: '#3b82f6', maxSpeed: 180, acceleration: 0.8, handling: 0.7, unlockLevel: 0, unlocked: true },
  { id: 'sports-1', name: 'Sports GT', type: 'sports', color: '#ef4444', maxSpeed: 280, acceleration: 1.2, handling: 0.9, unlockLevel: 1, unlocked: false },
  { id: 'suv-1', name: 'Urban SUV', type: 'suv', color: '#22c55e', maxSpeed: 160, acceleration: 0.6, handling: 0.5, unlockLevel: 0, unlocked: true },
  { id: 'bike-1', name: 'Street Bike', type: 'motorcycle', color: '#f97316', maxSpeed: 200, acceleration: 1.0, handling: 1.0, unlockLevel: 0, unlocked: true },
  { id: 'truck-1', name: 'Heavy Truck', type: 'truck', color: '#8b5cf6', maxSpeed: 140, acceleration: 0.4, handling: 0.3, unlockLevel: 2, unlocked: false },
  { id: 'auto-1', name: 'Auto Rickshaw', type: 'autorickshaw', color: '#eab308', maxSpeed: 120, acceleration: 0.7, handling: 0.8, unlockLevel: 0, unlocked: true },
  { id: 'sedan-2', name: 'Premium Sedan', type: 'sedan', color: '#1e40af', maxSpeed: 200, acceleration: 0.9, handling: 0.75, unlockLevel: 1, unlocked: false },
  { id: 'sports-2', name: 'Racing Spider', type: 'sports', color: '#dc2626', maxSpeed: 320, acceleration: 1.4, handling: 1.0, unlockLevel: 3, unlocked: false },
]

const defaultPlayer: PlayerState = {
  id: `player-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Player',
  position: [0, 0.5, 0],
  rotation: [0, 0, 0],
  speed: 0,
  vehicleId: 'sedan-1',
  health: 100,
  fuel: 100,
}

const defaultSettings: GameSettings = {
  graphicsQuality: 'high',
  showDamage: true,
  showMinimap: true,
  musicVolume: 0.7,
  sfxVolume: 0.8,
  controllerEnabled: true,
}

export const useGameStore = create<GameState>((set, get) => ({
  // Player
  player: defaultPlayer,
  setPlayerPosition: (position) => set((state) => ({ 
    player: { ...state.player, position } 
  })),
  setPlayerRotation: (rotation) => set((state) => ({ 
    player: { ...state.player, rotation } 
  })),
  setPlayerSpeed: (speed) => set((state) => ({ 
    player: { ...state.player, speed } 
  })),
  takeDamage: (amount) => set((state) => ({
    player: { ...state.player, health: Math.max(0, state.player.health - amount) }
  })),
  refuel: (amount) => set((state) => ({
    player: { ...state.player, fuel: Math.min(100, state.player.fuel + amount) }
  })),
  
  // Time of day
  timeOfDay: 0.5,
  setTimeOfDay: (time) => set({ timeOfDay: time }),
  isDayTime: () => {
    const time = get().timeOfDay
    return time > 0.25 && time < 0.75
  },
  
  // Vehicles
  vehicles: defaultVehicles,
  selectedVehicle: 'sedan-1',
  setSelectedVehicle: (vehicleId) => set({ selectedVehicle: vehicleId }),
  unlockVehicle: (vehicleId) => set((state) => ({
    vehicles: state.vehicles.map(v => 
      v.id === vehicleId ? { ...v, unlocked: true } : v
    )
  })),
  
  // UI State
  isGarageOpen: false,
  setGarageOpen: (open) => set({ isGarageOpen: open }),
  isPaused: false,
  setPaused: (paused) => set({ isPaused: paused }),
  isSettingsOpen: false,
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  
  // Multiplayer
  remotePlayers: new Map(),
  addRemotePlayer: (id, player) => set((state) => {
    const newMap = new Map(state.remotePlayers)
    newMap.set(id, player)
    return { remotePlayers: newMap }
  }),
  removeRemotePlayer: (id) => set((state) => {
    const newMap = new Map(state.remotePlayers)
    newMap.delete(id)
    return { remotePlayers: newMap }
  }),
  updateRemotePlayer: (id, updates) => set((state) => {
    const newMap = new Map(state.remotePlayers)
    const existing = newMap.get(id)
    if (existing) {
      newMap.set(id, { ...existing, ...updates })
    }
    return { remotePlayers: newMap }
  }),
  
  // Game State
  gameStarted: false,
  startGame: () => set({ gameStarted: true }),
  resetGame: () => set({ 
    player: { ...defaultPlayer, id: `player-${Math.random().toString(36).substr(2, 9)}` },
    gameStarted: false,
    isGarageOpen: false,
    isPaused: false,
    timeOfDay: 0.5
  }),
  
  // Settings
  settings: defaultSettings,
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),
  
  // Save/Load
  saveProgress: () => {
    const state = get()
    const saveData = {
      player: state.player,
      selectedVehicle: state.selectedVehicle,
      unlockedVehicles: state.vehicles.filter(v => v.unlocked).map(v => v.id),
      settings: state.settings,
      timeOfDay: state.timeOfDay
    }
    localStorage.setItem('yavatmal3d_save', JSON.stringify(saveData))
  },
  loadProgress: () => {
    const saved = localStorage.getItem('yavatmal3d_save')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        set((state) => ({
          player: data.player || state.player,
          selectedVehicle: data.selectedVehicle || state.selectedVehicle,
          vehicles: state.vehicles.map(v => ({
            ...v,
            unlocked: data.unlockedVehicles?.includes(v.id) ?? v.unlocked
          })),
          settings: data.settings || state.settings,
          timeOfDay: data.timeOfDay ?? state.timeOfDay
        }))
      } catch (e) {
        console.error('Failed to load save:', e)
      }
    }
  },
  
  // Loading
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  loadingProgress: 0,
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
}))