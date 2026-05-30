import { useGameStore } from '../../stores/gameStore'

export function HUD() {
  const { player, isGarageOpen, setGarageOpen } = useGameStore()
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar with game title */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/60 to-transparent flex items-center px-4">
        <h1 className="text-white text-lg font-bold drop-shadow-lg">Yavatmal 3D</h1>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-white/80 text-sm">{player.id.slice(0, 8)}</span>
        </div>
      </div>
      
      {/* Speed display */}
      <div className="absolute bottom-8 left-8 pointer-events-auto">
        <div className="bg-black/70 rounded-xl p-4 backdrop-blur-sm border border-white/20">
          <div className="text-white/60 text-xs mb-1">SPEED</div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">{Math.round(player.speed)}</span>
            <span className="text-white/60 text-sm">km/h</span>
          </div>
        </div>
      </div>
      
      {/* Minimap */}
      <div className="absolute top-20 right-4 w-48 h-48 pointer-events-auto">
        <div className="bg-black/70 rounded-xl overflow-hidden backdrop-blur-sm border border-white/20">
          <div className="p-2 border-b border-white/10">
            <span className="text-white/60 text-xs">MINIMAP</span>
          </div>
          <div className="aspect-square relative bg-gray-900">
            {/* Player indicator */}
            <div 
              className="absolute w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: '50%',
                top: '50%'
              }}
            />
            {/* North indicator */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white/40 text-xs">N</div>
          </div>
        </div>
      </div>
      
      {/* Controls hint */}
      <div className="absolute bottom-8 right-4 pointer-events-auto">
        <div className="bg-black/70 rounded-xl p-3 backdrop-blur-sm border border-white/20">
          <div className="text-white/60 text-xs mb-2">CONTROLS</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-white/80 text-xs">
            <span>W/↑</span><span>Accelerate</span>
            <span>S/↓</span><span>Brake</span>
            <span>A/←</span><span>Turn Left</span>
            <span>D/→</span><span>Turn Right</span>
            <span>Space</span><span>Handbrake</span>
            <span>G</span><span>Garage</span>
          </div>
        </div>
      </div>
      
      {/* Garage button */}
      <button
        onClick={() => setGarageOpen(!isGarageOpen)}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all pointer-events-auto"
      >
        {isGarageOpen ? 'CLOSE GARAGE' : 'OPEN GARAGE [G]'}
      </button>
    </div>
  )
}