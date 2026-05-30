import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../stores/gameStore'

export function Clouds() {
  const groupRef = useRef<THREE.Group>(null)
  const { isDayTime } = useGameStore()
  
  const clouds = useMemo(() => {
    const cloudData: { position: [number, number, number]; scale: number; speed: number }[] = []
    
    for (let i = 0; i < 20; i++) {
      cloudData.push({
        position: [
          (Math.random() - 0.5) * 1000,
          80 + Math.random() * 40,
          (Math.random() - 0.5) * 1000
        ],
        scale: 0.5 + Math.random() * 1.5,
        speed: 0.1 + Math.random() * 0.2
      })
    }
    
    return cloudData
  }, [])
  
  useFrame((_, delta) => {
    if (groupRef.current && isDayTime()) {
      groupRef.current.children.forEach((cloud, index) => {
        cloud.position.x += clouds[index].speed * delta * 10
        // Reset position when out of range
        if (cloud.position.x > 600) {
          cloud.position.x = -600
        }
      })
    }
  })

  if (!isDayTime()) return null

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, index) => (
        <group key={index} position={cloud.position} scale={cloud.scale}>
          <mesh>
            <sphereGeometry args={[8, 8, 6]} />
            <meshStandardMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.8}
              roughness={1}
            />
          </mesh>
          <mesh position={[6, 1, 0]}>
            <sphereGeometry args={[6, 6, 4]} />
            <meshStandardMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.8}
              roughness={1}
            />
          </mesh>
          <mesh position={[-5, 0, 2]}>
            <sphereGeometry args={[5, 5, 4]} />
            <meshStandardMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.7}
              roughness={1}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}