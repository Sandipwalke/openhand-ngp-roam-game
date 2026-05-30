import { useMemo } from 'react'

export function StreetFurniture() {
  const items = useMemo(() => {
    const furniture: { position: [number, number, number]; type: 'lamp' | 'bench' | 'pole' }[] = []
    
    // Place street lamps along roads
    for (let i = -5; i <= 5; i++) {
      for (let j = -5; j <= 5; j++) {
        if (Math.random() > 0.3) continue
        
        const baseX = i * 80
        const baseZ = j * 80
        
        // Lamps on corners
        furniture.push({
          position: [baseX + 6, 0, baseZ + 6],
          type: 'lamp'
        })
        furniture.push({
          position: [baseX - 6, 0, baseZ - 6],
          type: 'lamp'
        })
        
        // Occasionally add benches
        if (Math.random() > 0.7) {
          furniture.push({
            position: [baseX + (Math.random() - 0.5) * 20, 0, baseZ + (Math.random() - 0.5) * 20],
            type: 'bench'
          })
        }
        
        // Electric poles
        if (Math.random() > 0.5) {
          furniture.push({
            position: [baseX + (Math.random() > 0.5 ? 10 : -10), 0, baseZ],
            type: 'pole'
          })
        }
      }
    }
    
    return furniture
  }, [])

  return (
    <group>
      {items.map((item, index) => {
        if (item.type === 'lamp') {
          return (
            <group key={index} position={item.position}>
              {/* Lamp post */}
              <mesh position={[0, 4, 0]}>
                <cylinderGeometry args={[0.15, 0.2, 8, 8]} />
                <meshStandardMaterial color="#555555" metalness={0.8} />
              </mesh>
              {/* Lamp head */}
              <mesh position={[0, 8.5, 0]}>
                <boxGeometry args={[1.5, 0.8, 0.8]} />
                <meshStandardMaterial 
                  color="#ffffcc"
                  emissive="#ffffcc"
                  emissiveIntensity={0.5}
                />
              </mesh>
              {/* Light glow */}
              <pointLight position={[0, 8, 0]} intensity={0.5} color="#ffffcc" distance={30} />
            </group>
          )
        }
        
        if (item.type === 'bench') {
          return (
            <group key={index} position={item.position}>
              {/* Bench seat */}
              <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[4, 0.2, 1]} />
                <meshStandardMaterial color="#8b4513" roughness={0.9} />
              </mesh>
              {/* Bench legs */}
              <mesh position={[-1.5, 0.25, 0]}>
                <boxGeometry args={[0.2, 0.5, 1]} />
                <meshStandardMaterial color="#555555" metalness={0.7} />
              </mesh>
              <mesh position={[1.5, 0.25, 0]}>
                <boxGeometry args={[0.2, 0.5, 1]} />
                <meshStandardMaterial color="#555555" metalness={0.7} />
              </mesh>
              {/* Bench back */}
              <mesh position={[0, 0.8, -0.4]} rotation={[-0.2, 0, 0]}>
                <boxGeometry args={[4, 0.8, 0.1]} />
                <meshStandardMaterial color="#8b4513" roughness={0.9} />
              </mesh>
            </group>
          )
        }
        
        if (item.type === 'pole') {
          return (
            <group key={index} position={item.position}>
              {/* Electric pole */}
              <mesh position={[0, 5, 0]}>
                <cylinderGeometry args={[0.15, 0.18, 10, 8]} />
                <meshStandardMaterial color="#3d3d3d" roughness={0.9} />
              </mesh>
              {/* Cross arm */}
              <mesh position={[0, 10, 0]}>
                <boxGeometry args={[2, 0.2, 0.2]} />
                <meshStandardMaterial color="#3d3d3d" metalness={0.5} />
              </mesh>
              {/* Wires (simplified) */}
              <mesh position={[0, 9.5, 0]}>
                <boxGeometry args={[2.5, 0.05, 0.05]} />
                <meshStandardMaterial color="#1a1a1a" />
              </mesh>
            </group>
          )
        }
        
        return null
      })}
    </group>
  )
}