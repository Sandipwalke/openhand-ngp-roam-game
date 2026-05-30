import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function Buildings() {
  const groupRef = useRef<THREE.Group>(null)

  const buildings = useMemo(() => {
    const buildingData: { position: [number, number, number]; size: [number, number, number]; color: string }[] = []
    
    // Create buildings along roads
    for (let i = -5; i <= 5; i++) {
      for (let j = -5; j <= 5; j++) {
        // Skip some blocks for variety
        if (Math.random() > 0.7) continue
        
        // Create a cluster of buildings
        const numBuildings = Math.floor(Math.random() * 3) + 1
        
        for (let b = 0; b < numBuildings; b++) {
          const x = i * 80 + (Math.random() - 0.5) * 60
          const z = j * 80 + (Math.random() - 0.5) * 60
          
          // Heights based on position (taller near center)
          const distFromCenter = Math.sqrt(x * x + z * z)
          const baseHeight = distFromCenter < 100 ? 40 : 15
          const height = baseHeight + Math.random() * 30
          
          const width = 10 + Math.random() * 20
          const depth = 10 + Math.random() * 20
          
          // Building colors - earthy tones
          const colors = ['#8b7355', '#a08060', '#c4a882', '#d4c4b0', '#9a8b7a', '#b09080']
          const color = colors[Math.floor(Math.random() * colors.length)]
          
          buildingData.push({
            position: [x, height / 2, z],
            size: [width, height, depth],
            color
          })
        }
      }
    }
    
    return buildingData
  }, [])

  return (
    <group ref={groupRef}>
      {buildings.map((building, index) => (
        <mesh
          key={index}
          position={building.position}
          castShadow
          receiveShadow
        >
          <boxGeometry args={building.size} />
          <meshStandardMaterial 
            color={building.color}
            roughness={0.9}
          />
        </mesh>
      ))}
      
      {/* Windows on buildings */}
      {buildings.map((building, index) => {
        const windows: React.ReactNode[] = []
        const [bx, by, bz] = building.position
        const [bw, bh, bd] = building.size
        
        // Add window rows
        const windowRows = Math.floor(bh / 4)
        const windowCols = Math.floor(bw / 5)
        
        for (let row = 1; row < windowRows; row++) {
          for (let col = 0; col < windowCols; col++) {
            // Front face windows
            windows.push(
              <mesh
                key={`win-front-${index}-${row}-${col}`}
                position={[bx - bw / 2 + col * 5 + 2.5, by - bh / 2 + row * 4, bz + bd / 2 + 0.01]}
              >
                <planeGeometry args={[2, 3]} />
                <meshStandardMaterial 
                  color="#4a6fa5"
                  emissive="#2a4a6a"
                  emissiveIntensity={0.3}
                />
              </mesh>
            )
            
            // Back face windows
            windows.push(
              <mesh
                key={`win-back-${index}-${row}-${col}`}
                position={[bx - bw / 2 + col * 5 + 2.5, by - bh / 2 + row * 4, bz - bd / 2 - 0.01]}
                rotation={[0, Math.PI, 0]}
              >
                <planeGeometry args={[2, 3]} />
                <meshStandardMaterial 
                  color="#4a6fa5"
                  emissive="#2a4a6a"
                  emissiveIntensity={0.3}
                />
              </mesh>
            )
          }
        }
        
        return <group key={`windows-${index}`}>{windows}</group>
      })}
    </group>
  )
}