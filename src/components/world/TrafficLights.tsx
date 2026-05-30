import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../stores/gameStore'

export function TrafficLights() {
  const { timeOfDay } = useGameStore()
  const isNight = timeOfDay < 0.25 || timeOfDay > 0.8
  
  const trafficLights = useMemo(() => {
    const lights: { position: [number, number, number]; rotation: number }[] = []
    
    // Place traffic lights at major intersections
    for (let i = -4; i <= 4; i++) {
      for (let j = -4; j <= 4; j++) {
        if (Math.random() > 0.5) continue
        
        const x = i * 80
        const z = j * 80
        
        // Add lights at corners of intersections
        lights.push({ position: [x + 6, 0, z + 6], rotation: 0 })
        lights.push({ position: [x - 6, 0, z - 6], rotation: Math.PI })
      }
    }
    
    return lights
  }, [])
  
  return (
    <group>
      {trafficLights.map((light, index) => (
        <TrafficLightPole 
          key={index} 
          position={light.position} 
          rotation={light.rotation}
          isNight={isNight}
        />
      ))}
    </group>
  )
}

function TrafficLightPole({ position, rotation, isNight }: { position: [number, number, number]; rotation: number; isNight: boolean }) {
  const lightRef = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    // Only show lights at night
    if (lightRef.current) {
      lightRef.current.visible = isNight
    }
  })

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Pole */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 8, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.8} />
      </mesh>
      
      {/* Light housing */}
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[0.5, 1.2, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} />
      </mesh>
      
      {/* Red light */}
      <mesh position={[0, 8.4, 0.26]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial 
          ref={lightRef}
          color="#ff0000" 
          emissive="#ff0000"
          emissiveIntensity={isNight ? 1 : 0}
        />
      </mesh>
      
      {/* Yellow light */}
      <mesh position={[0, 8, 0.26]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial 
          color="#ffff00" 
          emissive="#ffff00"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Green light */}
      <mesh position={[0, 7.6, 0.26]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial 
          color="#00ff00" 
          emissive="#00ff00"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Glowing effect when night */}
      {isNight && (
        <pointLight position={[0, 8.4, 0.5]} intensity={0.5} color="#ff0000" distance={15} />
      )}
    </group>
  )
}