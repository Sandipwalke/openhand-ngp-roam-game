import { create } from 'zustand'

export interface Vehicle {
  id: string
  name: string
  type: 'sedan' | 'sports' | 'suv' | 'motorcycle' | 'truck' | 'autorickshaw'
  color: string
  maxSpeed: number
  acceleration: number
  handling: number
  unlocked: boolean
}

export interface PlayerState {
  id: string
  name: string
  position: [number, number, number]
  rotation: [number, number, number]
  speed: number
  vehicleId: string | null
}

export interface GameState {
  // Player
  player: PlayerState
  setPlayerPosition: (position: [number, number, number]) => void
  setPlayerRotation: (rotation: [number, number, number]) => void
  setPlayerSpeed: (speed: number) => void
  
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
  
  // Multiplayer
  remotePlayers: Map<string, PlayerState>
  addRemotePlayer: (id: string, player: PlayerState) => void
  removeRemotePlayer: (id: string) => void
  updateRemotePlayer: (id: string, updates: Partial<PlayerState>) => void
  
  // Game State
  gameStarted: boolean
  startGame: () => void
  resetGame: () => void
}

const defaultVehicles: Vehicle[] = [
  { id: 'sedan-1', name: 'Classic Sedan', type: 'sedan', color: '#3b82f6', maxSpeed: 180, acceleration: 0.8, handling: 0.7, unlocked: true },
  { id: 'sports-1', name: 'Sports GT', type: 'sports', color: '#ef4444', maxSpeed: 280, acceleration: 1.2, handling: 0.9, unlocked: false },
  { id: 'suv-1', name: 'Urban SUV', type: 'suv', color: '#22c55e', maxSpeed: 160, acceleration: 0.6, handling: 0.5, unlocked: true },
  { id: 'bike-1', name: 'Street Bike', type: 'motorcycle', color: '#f97316', maxSpeed: 200, acceleration: 1.0, handling: 1.0, unlocked: true },
  { id: 'truck-1', name: 'Heavy Truck', type: 'truck', color: '#8b5cf6', maxSpeed: 140, acceleration: 0.4, handling: 0.3, unlocked: false },
  { id: 'auto-1', name: 'Auto Rickshaw', type: 'autorickshaw', color: '#eab308', maxSpeed: 120, acceleration: 0.7, handling: 0.8, unlocked: true },
]

const defaultPlayer: PlayerState = {
  id: `player-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Player',
  position: [0, 0.5, 0],
  rotation: [0, 0, 0],
  speed: 0,
  vehicleId: 'sedan-1',
}

export const useGameStore = create<GameState>((set) => ({
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
    isPaused: false
  }),
}))