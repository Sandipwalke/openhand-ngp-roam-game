import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { CityMap } from './components/world/CityMap'
import { Vehicle } from './components/vehicles/Vehicle'
import { ChaseCamera } from './components/camera/ChaseCamera'
import { HUD } from './components/ui/HUD'
import { Garage } from './components/ui/Garage'
import { RemoteVehicle } from './components/multiplayer/RemoteVehicle'
import { useGameStore } from './stores/gameStore'
import io, { Socket } from 'socket.io-client'

function App() {
  const { 
    vehicles, 
    selectedVehicle, 
    player,
    isGarageOpen, 
    setGarageOpen,
    remotePlayers,
    addRemotePlayer,
    removeRemotePlayer,
    updateRemotePlayer
  } = useGameStore()
  
  const vehicleRef = useRef<{ getPosition: () => [number, number, number]; getRotation: () => [number, number, number] }>(null)
  const socketRef = useRef<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  
  // Get selected vehicle data
  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle)
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'g') {
        setGarageOpen(!isGarageOpen)
      }
      if (e.key === 'Escape' && isGarageOpen) {
        setGarageOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isGarageOpen, setGarageOpen])
  
  // Socket.io connection (optional - will work without server)
  useEffect(() => {
    const serverUrl = (window as any).import?.meta?.env?.VITE_SERVER_URL || 'http://localhost:3001'
    
    try {
      const socket = io(serverUrl, {
        transports: ['websocket'],
        reconnectionAttempts: 3,
        reconnectionDelay: 1000
      })
      
      socket.on('connect', () => {
        setConnected(true)
        console.log('Connected to multiplayer server')
        
        // Send initial position
        socket.emit('playerJoin', {
          id: player.id,
          name: player.name,
          position: player.position,
          rotation: player.rotation,
          speed: player.speed,
          vehicleId: selectedVehicle
        })
      })
      
      socket.on('playerUpdate', (data: { id: string; position: [number, number, number]; rotation: [number, number, number]; speed: number }) => {
        if (data.id !== player.id) {
          updateRemotePlayer(data.id, {
            position: data.position,
            rotation: data.rotation,
            speed: data.speed
          })
        }
      })
      
      socket.on('playerJoined', (data: { id: string; name: string; position: [number, number, number]; rotation: [number, number, number] }) => {
        if (data.id !== player.id) {
          addRemotePlayer(data.id, {
            ...data,
            speed: 0,
            vehicleId: ''
          })
        }
      })
      
      socket.on('playerLeft', (playerId: string) => {
        removeRemotePlayer(playerId)
      })
      
      socket.on('disconnect', () => {
        setConnected(false)
        console.log('Disconnected from server')
      })
      
      socketRef.current = socket
      
      // Send position updates
      const updateInterval = setInterval(() => {
        if (socket.connected && vehicleRef.current) {
          socket.emit('playerMove', {
            id: player.id,
            position: vehicleRef.current.getPosition(),
            rotation: vehicleRef.current.getRotation(),
            speed: player.speed
          })
        }
      }, 100)
      
      return () => {
        clearInterval(updateInterval)
        socket.disconnect()
      }
    } catch (error) {
      console.log('Socket.io not available, running in single player mode')
    }
  }, [])
  
  // Convert vehicle type for remote vehicles
  const getVehicleColor = (vehicleId: string): string => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    return vehicle?.color || '#888888'
  }
  
  return (
    <div className="w-full h-full relative">
      {/* Start Screen */}
      {!useGameStore.getState().gameStarted && (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center z-40">
          <h1 className="text-6xl font-bold text-white mb-4">
            YAVATMAL <span className="text-blue-400">3D</span>
          </h1>
          <p className="text-white/60 text-xl mb-12">Open World Driving Game</p>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={() => useGameStore.getState().startGame()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-xl text-xl font-bold transition-all shadow-lg hover:shadow-xl"
            >
              START GAME
            </button>
            <button
              onClick={() => setGarageOpen(true)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-12 py-3 rounded-xl text-lg font-semibold transition-all"
            >
              SELECT VEHICLE
            </button>
          </div>
          
          <div className="mt-12 text-white/40 text-sm">
            {connected ? (
              <span className="text-green-400">● Connected to server</span>
            ) : (
              <span>○ Single Player Mode</span>
            )}
          </div>
        </div>
      )}
      
      {/* Game Canvas */}
      {useGameStore.getState().gameStarted && (
        <>
          <Canvas
            shadows
            camera={{ position: [0, 10, 20], fov: 60 }}
            style={{ background: '#87CEEB' }}
          >
            <CityMap />
            
            {selectedVehicleData && (
              <Vehicle 
                ref={vehicleRef}
                vehicleType={selectedVehicleData} 
              />
            )}
            
            {/* Remote players */}
            {Array.from(remotePlayers.entries()).map(([id, remotePlayer]) => (
              <RemoteVehicle
                key={id}
                player={remotePlayer}
                color={getVehicleColor(remotePlayer.vehicleId || '')}
              />
            ))}
            
            <ChaseCamera />
          </Canvas>
          
          {/* UI Overlay */}
          <HUD />
          <Garage />
        </>
      )}
    </div>
  )
}

export default App