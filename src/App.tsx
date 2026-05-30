import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { CityMap } from './components/world/CityMap'
import { Vehicle } from './components/vehicles/Vehicle'
import { ChaseCamera } from './components/camera/ChaseCamera'
import { HUD } from './components/ui/HUD'
import { Garage } from './components/ui/Garage'
import { Settings } from './components/ui/Settings'
import { LoadingScreen } from './components/ui/LoadingScreen'
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
    isSettingsOpen,
    remotePlayers,
    addRemotePlayer,
    removeRemotePlayer,
    updateRemotePlayer,
    loadProgress,
    isLoading,
    setLoading,
    loadingProgress,
    setLoadingProgress
  } = useGameStore()
  
  const vehicleRef = useRef<{ getPosition: () => [number, number, number]; getRotation: () => [number, number, number] }>(null)
  const socketRef = useRef<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  
  // Get selected vehicle data
  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle)
  
  // Initial loading simulation
  useEffect(() => {
    setLoading(true)
    setLoadingProgress(0)
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)
    
    // Load saved progress
    loadProgress()
    
    // Complete loading
    setTimeout(() => {
      clearInterval(progressInterval)
      setLoadingProgress(100)
      setTimeout(() => setLoading(false), 500)
    }, 1500)
  }, [])
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'g' && !isSettingsOpen) {
        setGarageOpen(!isGarageOpen)
      }
      if (e.key === 'Escape') {
        if (isGarageOpen) setGarageOpen(false)
        if (isSettingsOpen) useGameStore.getState().setSettingsOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isGarageOpen, isSettingsOpen, setGarageOpen])
  
  // Socket.io connection (optional - will work without server)
  useEffect(() => {
    const serverUrl = 'http://localhost:3001'
    
    try {
      const socket = io(serverUrl, {
        transports: ['websocket'],
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        timeout: 5000
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
            vehicleId: '',
            health: 100,
            fuel: 100
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
      
      socket.on('connect_error', () => {
        console.log('Server not available, single player mode')
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
  
  // Show loading screen
  if (isLoading) {
    return <LoadingScreen progress={loadingProgress} />
  }
  
  return (
    <div className="w-full h-full relative">
      {/* Start Screen */}
      {!useGameStore.getState().gameStarted && (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center z-40">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          </div>
          
          <h1 className="text-7xl font-bold text-white mb-2 relative z-10">
            YAVATMAL <span className="text-blue-400">3D</span>
          </h1>
          <p className="text-white/60 text-2xl mb-4 relative z-10">Open World Game</p>
          <p className="text-white/40 text-sm mb-12 relative z-10">Drive through the streets of Yavatmal</p>
          
          <div className="flex flex-col gap-4 relative z-10">
            <button
              onClick={() => useGameStore.getState().startGame()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-16 py-5 rounded-2xl text-2xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚗 START GAME
            </button>
            <button
              onClick={() => setGarageOpen(true)}
              className="bg-gray-700/80 hover:bg-gray-600 text-white px-12 py-4 rounded-xl text-lg font-semibold transition-all backdrop-blur-sm"
            >
              🎮 SELECT VEHICLE
            </button>
          </div>
          
          {/* Features */}
          <div className="mt-16 grid grid-cols-3 gap-8 text-center relative z-10">
            <div className="text-white/60">
              <div className="text-3xl mb-2">🌍</div>
              <div className="text-sm font-semibold">Open World</div>
            </div>
            <div className="text-white/60">
              <div className="text-3xl mb-2">🚗</div>
              <div className="text-sm font-semibold">8 Vehicles</div>
            </div>
            <div className="text-white/60">
              <div className="text-3xl mb-2">☀️</div>
              <div className="text-sm font-semibold">Day/Night</div>
            </div>
          </div>
          
          <div className="mt-12 text-white/40 text-sm relative z-10">
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
          <Settings />
        </>
      )}
    </div>
  )
}

export default App