import { Terrain } from './Terrain'
import { Roads } from './Roads'
import { Buildings } from './Buildings'
import { Trees } from './Trees'
import { StreetFurniture } from './StreetFurniture'

export function CityMap() {
  return (
    <group>
      {/* Sky */}
      <color attach="background" args={['#87CEEB']} />
      
      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#c9d6e3', 100, 800]} />
      
      {/* Ambient light */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light (sun) */}
      <directionalLight
        position={[100, 150, 50]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
      />
      
      {/* Hemisphere light for sky/ground color blending */}
      <hemisphereLight
        args={['#87CEEB', '#3d5a27', 0.5]}
      />
      
      {/* Terrain and roads */}
      <Terrain />
      <Roads />
      
      {/* Environment */}
      <Buildings />
      <Trees />
      <StreetFurniture />
    </group>
  )
}