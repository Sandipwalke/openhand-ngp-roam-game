import { useGameStore, Vehicle } from '../../stores/gameStore'
import { useState, useEffect } from 'react'

export function Garage() {
  const { 
    vehicles, 
    selectedVehicle, 
    setSelectedVehicle, 
    isGarageOpen, 
    setGarageOpen,
    player
  } = useGameStore()
  
  const [previewRotation, setPreviewRotation] = useState(0)
  
  // Auto-rotate preview
  useEffect(() => {
    if (!isGarageOpen) return
    const interval = setInterval(() => {
      setPreviewRotation(prev => prev + 2)
    }, 50)
    return () => clearInterval(interval)
  }, [isGarageOpen])
  
  if (!isGarageOpen) return null
  
  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle)
  
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl w-[90%] max-w-4xl max-h-[90%] overflow-hidden border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white text-2xl font-bold">VEHICLE GARAGE</h2>
            <p className="text-blue-200 text-sm">Select your ride</p>
          </div>
          <button
            onClick={() => setGarageOpen(false)}
            className="text-white/80 hover:text-white text-3xl font-light"
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 flex flex-col lg:flex-row gap-6">
          {/* Vehicle Preview */}
          <div className="flex-1 bg-gray-800 rounded-xl flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-white/60 text-sm mb-4">PREVIEW</div>
            <div 
              className="w-64 h-32 rounded-lg"
              style={{ 
                background: `linear-gradient(${previewRotation}deg, ${selectedVehicleData?.color || '#3b82f6'}, ${selectedVehicleData?.color || '#3b82f6'}88)`,
                boxShadow: `0 0 40px ${selectedVehicleData?.color || '#3b82f6'}44`
              }}
            />
            <div className="mt-4 text-center">
              <div className="text-white text-xl font-semibold">{selectedVehicleData?.name}</div>
              <div className="text-white/60 text-sm capitalize">{selectedVehicleData?.type}</div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 w-full px-4">
              <StatBadge label="MAX SPEED" value={`${selectedVehicleData?.maxSpeed || 0} km/h`} />
              <StatBadge label="ACCEL" value={`${(selectedVehicleData?.acceleration || 0).toFixed(1)}x`} />
              <StatBadge label="HANDLING" value={`${(selectedVehicleData?.handling || 0).toFixed(1)}x`} />
            </div>
          </div>
          
          {/* Vehicle List */}
          <div className="flex-1">
            <div className="text-white/60 text-sm mb-3">AVAILABLE VEHICLES</div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {vehicles.map(vehicle => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isSelected={vehicle.id === selectedVehicle}
                  onSelect={() => setSelectedVehicle(vehicle.id)}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="text-white/60 text-sm">
            Currently using: <span className="text-white font-semibold">{player.vehicleId}</span>
          </div>
          <button
            onClick={() => setGarageOpen(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            CONFIRM & CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-700/50 rounded-lg p-2 text-center">
      <div className="text-white/40 text-[10px]">{label}</div>
      <div className="text-white font-semibold">{value}</div>
    </div>
  )
}

function VehicleCard({ 
  vehicle, 
  isSelected, 
  onSelect 
}: { 
  vehicle: Vehicle
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <div
      onClick={onSelect}
      className={`
        bg-gray-800 rounded-xl p-4 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-blue-500 bg-blue-900/30' : 'hover:bg-gray-700'}
        ${!vehicle.unlocked ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Vehicle icon */}
        <div 
          className="w-16 h-16 rounded-lg"
          style={{ 
            background: vehicle.color,
            boxShadow: isSelected ? `0 0 20px ${vehicle.color}66` : 'none'
          }}
        />
        
        {/* Info */}
        <div className="flex-1">
          <div className="text-white font-semibold">{vehicle.name}</div>
          <div className="text-white/60 text-sm capitalize">{vehicle.type}</div>
        </div>
        
        {/* Status */}
        <div>
          {isSelected ? (
            <span className="text-blue-400 text-xl">✓</span>
          ) : vehicle.unlocked ? (
            <span className="text-green-400 text-sm">UNLOCKED</span>
          ) : (
            <span className="text-yellow-400 text-sm">🔒 LOCKED</span>
          )}
        </div>
      </div>
      
      {/* Stats row */}
      <div className="flex gap-4 mt-3 text-xs">
        <span className="text-white/60">Speed: <span className="text-white">{vehicle.maxSpeed}</span></span>
        <span className="text-white/60">Accel: <span className="text-white">{vehicle.acceleration}</span></span>
        <span className="text-white/60">Handling: <span className="text-white">{vehicle.handling}</span></span>
      </div>
    </div>
  )
}