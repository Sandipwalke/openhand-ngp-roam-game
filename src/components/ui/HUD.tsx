import { useGameStore } from '../../stores/gameStore'
import { useEffect } from 'react'

export function HUD() {
  const { player, isGarageOpen, setGarageOpen, timeOfDay, setTimeOfDay, isSettingsOpen, setSettingsOpen } = useGameStore()
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'g':
          if (!isSettingsOpen) setGarageOpen(!isGarageOpen)
          break
        case 'escape':
          if (isGarageOpen) setGarageOpen(false)
          if (isSettingsOpen) setSettingsOpen(false)
          break
        case ',':
          // Comma key - advance time (for testing)
          setTimeOfDay(Math.min(1, timeOfDay + 0.05))
          break
        case '.':
          // Period key - go back in time
          setTimeOfDay(Math.max(0, timeOfDay - 0.05))
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isGarageOpen, isSettingsOpen, timeOfDay, setGarageOpen, setTimeOfDay, setSettingsOpen])
  
  // Format time of day
  const formatTime = (tod: number): string => {
    const hours = Math.floor(tod * 24)
    const minutes = Math.floor((tod * 24 - hours) * 60)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHour = hours % 12 || 12
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`
  }
  
  // Get time of day description
  const getTimeDescription = (): string => {
    if (timeOfDay < 0.2) return 'Night'
    if (timeOfDay < 0.25) return 'Late Night'
    if (timeOfDay < 0.3) return 'Dawn'
    if (timeOfDay < 0.5) return 'Morning'
    if (timeOfDay < 0.7) return 'Afternoon'
    if (timeOfDay < 0.8) return 'Evening'
    if (timeOfDay < 0.85) return 'Dusk'
    return 'Night'
  }
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar with game title and time */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/60 to-transparent flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-white text-lg font-bold drop-shadow-lg">Yavatmal 3D</h1>
          <span className="text-white/60 text-sm">{player.id.slice(0, 8)}</span>
        </div>
        
        {/* Time indicator */}
        <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full">
          <span className="text-2xl">
            {timeOfDay > 0.25 && timeOfDay < 0.8 ? '☀️' : timeOfDay > 0.2 && timeOfDay < 0.3 ? '🌅' : timeOfDay > 0.75 && timeOfDay < 0.85 ? '🌇' : '🌙'}
          </span>
          <div className="text-right">
            <div className="text-white font-semibold">{formatTime(timeOfDay)}</div>
            <div className="text-white/60 text-xs">{getTimeDescription()}</div>
          </div>
        </div>
      </div>
      
      {/* Health and Fuel bars */}
      <div className="absolute top-20 left-4 space-y-2">
        {/* Health */}
        <div className="bg-black/70 rounded-lg p-2 w-48">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/60">HEALTH</span>
            <span className="text-white font-semibold">{player.health}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${player.health > 50 ? 'bg-green-500' : player.health > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${player.health}%` }}
            />
          </div>
        </div>
        
        {/* Fuel */}
        <div className="bg-black/70 rounded-lg p-2 w-48">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/60">FUEL</span>
            <span className="text-white font-semibold">{Math.round(player.fuel)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${player.fuel > 30 ? 'bg-blue-500' : 'bg-orange-500'}`}
              style={{ width: `${player.fuel}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Speed display */}
      <div className="absolute bottom-8 left-8 pointer-events-auto">
        <div className="bg-black/70 rounded-xl p-4 backdrop-blur-sm border border-white/20">
          <div className="text-white/60 text-xs mb-1">SPEED</div>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold text-white font-mono">{Math.round(player.speed)}</span>
            <span className="text-white/60 text-sm">km/h</span>
          </div>
          {/* Speed bar */}
          <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
              style={{ width: `${Math.min(100, (player.speed / 320) * 100)}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Minimap */}
      {useGameStore.getState().settings.showMinimap && (
        <div className="absolute top-20 right-4 w-44 h-44 pointer-events-auto">
          <div className="bg-black/70 rounded-xl overflow-hidden backdrop-blur-sm border border-white/20">
            <div className="p-2 border-b border-white/10 flex justify-between items-center">
              <span className="text-white/60 text-xs">MINIMAP</span>
              <span className="text-white/40 text-xs">N</span>
            </div>
            <div className="aspect-square relative bg-gray-900 p-2">
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white/5" />
                ))}
              </div>
              {/* Player indicator with direction */}
              <div 
                className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: '50%',
                  top: '50%',
                  boxShadow: '0 0 10px #3b82f6'
                }}
              />
              {/* Direction indicator */}
              <div 
                className="absolute w-0 h-0"
                style={{
                  left: '50%',
                  top: 'calc(50% - 12px)',
                  transform: `translateX(-50%) rotate(${player.rotation[1]}rad)`,
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderBottom: '8px solid #3b82f6'
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Controls hint */}
      <div className="absolute bottom-8 right-4 pointer-events-auto hidden lg:block">
        <div className="bg-black/70 rounded-xl p-3 backdrop-blur-sm border border-white/20">
          <div className="text-white/60 text-xs mb-2">CONTROLS</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-white/80 text-xs">
            <span>W/↑</span><span>Accelerate</span>
            <span>S/↓</span><span>Brake</span>
            <span>A/←</span><span>Turn Left</span>
            <span>D/→</span><span>Turn Right</span>
            <span>Space</span><span>Handbrake</span>
            <span>G</span><span>Garage</span>
            <span>ESC</span><span>Menu</span>
            <span>,/.</span><span>Time +/-</span>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto">
        <button
          onClick={() => setGarageOpen(!isGarageOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
        >
          {isGarageOpen ? 'CLOSE GARAGE' : '🚗 GARAGE [G]'}
        </button>
        <button
          onClick={() => setSettingsOpen(!isSettingsOpen)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
        >
          ⚙️ SETTINGS
        </button>
      </div>
    </div>
  )
}