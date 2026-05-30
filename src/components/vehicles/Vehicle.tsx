import { useRef, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGameStore, Vehicle as VehicleType } from '../../stores/gameStore'

interface VehicleProps {
  vehicleType: VehicleType
}

export interface VehicleRef {
  getPosition: () => [number, number, number]
  getRotation: () => [number, number, number]
}

export const Vehicle = forwardRef<VehicleRef, VehicleProps>(({ vehicleType }, ref) => {
  const groupRef = useRef<THREE.Group>(null)
  const rotationRef = useRef(0)
  const speedRef = useRef(0)
  
  const { 
    player, 
    setPlayerPosition, 
    setPlayerRotation, 
    setPlayerSpeed 
  } = useGameStore()
  
  const keysPressed = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false
  })
  
  useImperativeHandle(ref, () => ({
    getPosition: () => groupRef.current 
      ? [groupRef.current.position.x, groupRef.current.position.y, groupRef.current.position.z]
      : [0, 0, 0],
    getRotation: () => {
      const rot = groupRef.current?.rotation.y || 0
      return [0, rot, 0]
    }
  }))
  
  // Keyboard controls
  useFrame((_, delta) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          keysPressed.current.forward = true
          break
        case 's':
        case 'arrowdown':
          keysPressed.current.backward = true
          break
        case 'a':
        case 'arrowleft':
          keysPressed.current.left = true
          break
        case 'd':
        case 'arrowright':
          keysPressed.current.right = true
          break
        case ' ':
          keysPressed.current.brake = true
          break
      }
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          keysPressed.current.forward = false
          break
        case 's':
        case 'arrowdown':
          keysPressed.current.backward = false
          break
        case 'a':
        case 'arrowleft':
          keysPressed.current.left = false
          break
        case 'd':
        case 'arrowright':
          keysPressed.current.right = false
          break
        case ' ':
          keysPressed.current.brake = false
          break
      }
    }
    
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    const { forward, backward, left, right, brake } = keysPressed.current
    
    // Physics simulation
    const acceleration = vehicleType.acceleration
    const maxSpeed = vehicleType.maxSpeed / 3.6 // Convert to m/s
    const handling = vehicleType.handling
    
    // Acceleration
    if (forward) {
      speedRef.current = Math.min(speedRef.current + acceleration * delta * 50, maxSpeed)
    }
    if (backward) {
      speedRef.current = Math.max(speedRef.current - acceleration * delta * 30, -maxSpeed * 0.3)
    }
    
    // Braking
    if (brake) {
      speedRef.current *= 0.95
    }
    
    // Friction
    speedRef.current *= 0.99
    
    // Steering
    if (speedRef.current !== 0) {
      const turnRate = handling * 0.05 * (speedRef.current > 0 ? 1 : -1)
      if (left) {
        rotationRef.current += turnRate
      }
      if (right) {
        rotationRef.current -= turnRate
      }
    }
    
    // Update position
    if (groupRef.current) {
      const moveSpeed = speedRef.current * delta
      groupRef.current.rotation.y = rotationRef.current
      
      const direction = new THREE.Vector3(
        Math.sin(rotationRef.current),
        0,
        Math.cos(rotationRef.current)
      )
      
      groupRef.current.position.x += direction.x * moveSpeed
      groupRef.current.position.z += direction.z * moveSpeed
      
      // Keep on ground
      groupRef.current.position.y = 0.5
      
      // Update store
      setPlayerPosition([groupRef.current.position.x, groupRef.current.position.y, groupRef.current.position.z])
      setPlayerRotation([0, rotationRef.current, 0])
      setPlayerSpeed(Math.abs(speedRef.current * 3.6)) // Convert back to km/h
    }
  })

  // Render vehicle based on type
  const renderVehicleGeometry = () => {
    switch (vehicleType.type) {
      case 'sedan':
        return <Sedan color={vehicleType.color} />
      case 'sports':
        return <SportsCar color={vehicleType.color} />
      case 'suv':
        return <SUV color={vehicleType.color} />
      case 'motorcycle':
        return <Motorcycle color={vehicleType.color} />
      case 'truck':
        return <Truck color={vehicleType.color} />
      case 'autorickshaw':
        return <AutoRickshaw color={vehicleType.color} />
      default:
        return <Sedan color={vehicleType.color} />
    }
  }

  return (
    <group ref={groupRef} position={player.position}>
      {renderVehicleGeometry()}
      {/* Headlights */}
      <spotLight position={[1.5, 0.3, 0.5]} intensity={2} color="#ffffff" distance={50} angle={0.5} />
      <spotLight position={[1.5, 0.3, -0.5]} intensity={2} color="#ffffff" distance={50} angle={0.5} />
    </group>
  )
})

// Individual vehicle models
function Sedan({ color }: { color: string }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[4, 0.8, 2]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0.2, 0.9, 0]} castShadow>
        <boxGeometry args={[2.2, 0.7, 1.8]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Windows */}
      <mesh position={[0.2, 0.95, 0.91]}>
        <planeGeometry args={[2, 0.5]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.2, 0.95, -0.91]}>
        <planeGeometry args={[2, 0.5]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Wheels */}
      <Wheel position={[1.3, 0, 1]} />
      <Wheel position={[1.3, 0, -1]} />
      <Wheel position={[-1.3, 0, 1]} />
      <Wheel position={[-1.3, 0, -1]} />
    </group>
  )
}

function SportsCar({ color }: { color: string }) {
  return (
    <group>
      {/* Low body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[4.5, 0.5, 2]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Hood */}
      <mesh position={[1.5, 0.35, 0]} castShadow>
        <boxGeometry args={[1.5, 0.3, 1.8]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Cabin */}
      <mesh position={[-0.3, 0.6, 0]} castShadow>
        <boxGeometry args={[1.5, 0.5, 1.6]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Wheels */}
      <Wheel position={[1.5, 0, 1.1]} />
      <Wheel position={[1.5, 0, -1.1]} />
      <Wheel position={[-1.5, 0, 1.1]} />
      <Wheel position={[-1.5, 0, -1.1]} />
    </group>
  )
}

function SUV({ color }: { color: string }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[4, 1, 2.2]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[2.5, 0.9, 2]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Windows */}
      <mesh position={[0, 1.25, 1.01]}>
        <planeGeometry args={[2.3, 0.7]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 1.25, -1.01]}>
        <planeGeometry args={[2.3, 0.7]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Wheels (larger) */}
      <Wheel position={[1.2, 0, 1.2]} scale={1.3} />
      <Wheel position={[1.2, 0, -1.2]} scale={1.3} />
      <Wheel position={[-1.2, 0, 1.2]} scale={1.3} />
      <Wheel position={[-1.2, 0, -1.2]} scale={1.3} />
    </group>
  )
}

function Motorcycle({ color }: { color: string }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 0.4, 0.6]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Seat */}
      <mesh position={[-0.3, 0.7, 0]} castShadow>
        <boxGeometry args={[0.8, 0.3, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      {/* Handlebars */}
      <mesh position={[0.6, 0.7, 0]} castShadow>
        <boxGeometry args={[0.1, 0.1, 1.2]} />
        <meshStandardMaterial color="#333333" metalness={0.8} />
      </mesh>
      {/* Wheels */}
      <Wheel position={[0.8, 0, 0]} />
      <Wheel position={[-0.8, 0, 0]} />
    </group>
  )
}

function Truck({ color }: { color: string }) {
  return (
    <group>
      {/* Cargo area */}
      <mesh position={[-1, 0.8, 0]} castShadow>
        <boxGeometry args={[3, 1.5, 2.2]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Cab */}
      <mesh position={[1.5, 0.7, 0]} castShadow>
        <boxGeometry args={[1.5, 1.2, 2]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Windows */}
      <mesh position={[1.5, 0.85, 1.01]}>
        <planeGeometry args={[1.2, 0.6]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Wheels (more) */}
      <Wheel position={[0.5, 0, 1.2]} />
      <Wheel position={[0.5, 0, -1.2]} />
      <Wheel position={[-0.5, 0, 1.2]} />
      <Wheel position={[-0.5, 0, -1.2]} />
      <Wheel position={[-2, 0, 1.2]} />
      <Wheel position={[-2, 0, -1.2]} />
    </group>
  )
}

function AutoRickshaw({ color }: { color: string }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2.5, 0.7, 1.5]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Top cover */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[2, 0.6, 1.4]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Open sides */}
      {/* Wheels */}
      <Wheel position={[0.9, 0, 0.9]} />
      <Wheel position={[0.9, 0, -0.9]} />
      <Wheel position={[-0.9, 0, 0.9]} />
      <Wheel position={[-0.9, 0, -0.9]} />
    </group>
  )
}

function Wheel({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4 * scale, 0.4 * scale, 0.3, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3 * scale, 0.3 * scale, 0.32, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  )
}

Vehicle.displayName = 'Vehicle'