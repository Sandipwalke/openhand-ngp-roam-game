import { useRef, useMemo } from 'react'
import * as THREE from 'three'

export function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(2000, 2000, 100, 100)
    geo.rotateX(-Math.PI / 2)
    
    // Add some terrain variation
    const positions = geo.attributes.position
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const z = positions.getZ(i)
      const height = Math.sin(x * 0.01) * Math.cos(z * 0.01) * 0.5 + Math.random() * 0.1
      positions.setY(i, height)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow>
      <meshStandardMaterial 
        color="#2d5a27" 
        roughness={0.9}
        metalness={0.0}
      />
    </mesh>
  )
}