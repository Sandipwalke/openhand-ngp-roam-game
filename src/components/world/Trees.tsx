import { useMemo } from 'react'

export function Trees() {
  const trees = useMemo(() => {
    const treeData: { position: [number, number, number]; scale: number }[] = []
    
    // Place trees along roads and in empty spaces
    for (let i = -6; i <= 6; i++) {
      for (let j = -6; j <= 6; j++) {
        // Skip some areas
        if (Math.random() > 0.4) continue
        
        // Don't place trees on roads
        const x = i * 80 + (Math.random() - 0.5) * 40
        const z = j * 80 + (Math.random() - 0.5) * 40
        
        // Check if too close to buildings (simple check)
        if (Math.abs(x % 80) < 15 || Math.abs(z % 80) < 15) continue
        
        treeData.push({
          position: [x, 0, z],
          scale: 0.8 + Math.random() * 0.6
        })
      }
    }
    
    return treeData
  }, [])

  return (
    <group>
      {trees.map((tree, index) => (
        <group key={index} position={tree.position} scale={tree.scale}>
          {/* Tree trunk */}
          <mesh position={[0, 3, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.7, 6, 8]} />
            <meshStandardMaterial color="#5d4037" roughness={0.9} />
          </mesh>
          
          {/* Tree foliage - multiple spheres for fuller look */}
          <mesh position={[0, 8, 0]} castShadow>
            <sphereGeometry args={[4, 8, 6]} />
            <meshStandardMaterial color="#2e7d32" roughness={0.8} />
          </mesh>
          <mesh position={[1.5, 6, 0]} castShadow>
            <sphereGeometry args={[2.5, 8, 6]} />
            <meshStandardMaterial color="#388e3c" roughness={0.8} />
          </mesh>
          <mesh position={[-1, 7, 1]} castShadow>
            <sphereGeometry args={[2, 8, 6]} />
            <meshStandardMaterial color="#43a047" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}