import { useState, useRef, useEffect } from 'react'

interface TouchControlsProps {
  onAccelerate: (active: boolean) => void
  onBrake: (active: boolean) => void
  onLeft: (active: boolean) => void
  onRight: (active: boolean) => void
}

export function MobileControls({ onAccelerate, onBrake, onLeft, onRight }: TouchControlsProps) {
  const [joystick, setJoystick] = useState({ x: 0, y: 0 })
  const joystickRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Detect touch device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  if (!isMobile) return null
  
  const handleJoystickMove = (e: React.TouchEvent) => {
    if (!joystickRef.current) return
    
    const rect = joystickRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    let deltaX = (touch.clientX - centerX) / (rect.width / 2)
    let deltaY = (touch.clientY - centerY) / (rect.height / 2)
    
    // Clamp to circle
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    if (distance > 1) {
      deltaX /= distance
      deltaY /= distance
    }
    
    setJoystick({ x: deltaX, y: deltaY })
    
    // Update controls
    onLeft(deltaX < -0.3)
    onRight(deltaX > 0.3)
    onAccelerate(deltaY < -0.3)
    onBrake(deltaY > 0.3)
  }
  
  const handleJoystickEnd = () => {
    setJoystick({ x: 0, y: 0 })
    onLeft(false)
    onRight(false)
    onAccelerate(false)
    onBrake(false)
  }
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Joystick */}
      <div 
        ref={joystickRef}
        className="absolute bottom-20 left-20 w-32 h-32 bg-black/30 rounded-full border-2 border-white/20 pointer-events-auto touch-none"
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
      >
        {/* Joystick knob */}
        <div 
          className="absolute w-12 h-12 bg-blue-500/80 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${50 + joystick.x * 40}%`,
            top: `${50 + joystick.y * 40}%`
          }}
        />
      </div>
      
      {/* Accelerate button */}
      <div className="absolute bottom-20 right-20 pointer-events-auto">
        <button
          className="w-20 h-20 bg-green-500/50 rounded-full border-2 border-green-400/50 text-white font-bold text-2xl active:bg-green-600"
          onTouchStart={() => onAccelerate(true)}
          onTouchEnd={() => onAccelerate(false)}
        >
          ▲
        </button>
      </div>
      
      {/* Brake button */}
      <div className="absolute bottom-44 right-20 pointer-events-auto">
        <button
          className="w-20 h-20 bg-red-500/50 rounded-full border-2 border-red-400/50 text-white font-bold text-2xl active:bg-red-600"
          onTouchStart={() => onBrake(true)}
          onTouchEnd={() => onBrake(false)}
        >
          ■
        </button>
      </div>
    </div>
  )
}

// Hook for mobile controls
export function useMobileControls() {
  const controlsRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false
  })
  
  return {
    getControls: () => controlsRef.current,
    setControl: (control: 'forward' | 'backward' | 'left' | 'right' | 'brake', value: boolean) => {
      controlsRef.current[control] = value
    }
  }
}