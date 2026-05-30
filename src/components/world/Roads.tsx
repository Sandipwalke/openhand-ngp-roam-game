import { useMemo } from 'react'

export function Roads() {
  const roadSegments = useMemo(() => {
    const segments: { position: [number, number, number]; rotation: [number, number, number]; length: number; width: number }[] = []
    
    // Main grid roads
    for (let i = -5; i <= 5; i++) {
      // Horizontal roads
      segments.push({
        position: [i * 80, 0.01, 0],
        rotation: [0, 0, 0],
        length: 80,
        width: 12
      })
      // Vertical roads
      segments.push({
        position: [0, 0.01, i * 80],
        rotation: [0, Math.PI / 2, 0],
        length: 80,
        width: 12
      })
    }
    
    // Additional diagonal roads for more realism
    for (let i = -3; i <= 3; i++) {
      segments.push({
        position: [i * 100, 0.015, i * 100],
        rotation: [0, Math.PI / 4, 0],
        length: 150,
        width: 10
      })
      segments.push({
        position: [-i * 100, 0.015, i * 100],
        rotation: [0, -Math.PI / 4, 0],
        length: 150,
        width: 10
      })
    }
    
    return segments
  }, [])

  return (
    <group>
      {roadSegments.map((segment, index) => (
        <mesh
          key={index}
          position={segment.position}
          rotation={segment.rotation}
        >
          <planeGeometry args={[segment.width, segment.length]} />
          <meshStandardMaterial color="#333333" roughness={0.8} />
        </mesh>
      ))}
      
      {/* Road markings */}
      {roadSegments.map((segment, index) => (
        <mesh
          key={`marking-${index}`}
          position={[segment.position[0], 0.02, segment.position[2]]}
          rotation={[segment.rotation[0], segment.rotation[1], segment.rotation[2]]}
        >
          <planeGeometry args={[0.3, segment.length * 0.9]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}