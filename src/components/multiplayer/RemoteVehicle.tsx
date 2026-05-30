import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { PlayerState } from '../../stores/gameStore'

interface RemoteVehicleProps {
  player: PlayerState
  color: string
}

export function RemoteVehicle({ player, color }: RemoteVehicleProps) {
  const groupRef = useRef<THREE.Group>(null)
  const targetPosition = useRef(new THREE.Vector3(player.position[0], player.position[1], player.position[2]))
  const targetRotation = useRef(player.rotation[1])
  
  useFrame(() => {
    if (!groupRef.current) return
    
    // Smooth interpolation
    targetPosition.current.set(player.position[0], player.position[1], player.position[2])
    targetRotation.current = player.rotation[1]
    
    groupRef.current.position.lerp(targetPosition.current, 0.1)
    
    // Smooth rotation
    const currentRotation = groupRef.current.rotation.y
    const diff = targetRotation.current - currentRotation
    groupRef.current.rotation.y += diff * 0.1
  })

  return (
    <group ref={groupRef} position={player.position} rotation={[0, player.rotation[1], 0]}>
      {/* Simplified vehicle model */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[3, 1, 1.8]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Player name tag */}
      <mesh position={[0, 2, 0]}>
        <planeGeometry args={[1.5, 0.4]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}