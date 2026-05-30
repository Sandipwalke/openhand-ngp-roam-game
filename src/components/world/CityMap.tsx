import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../../stores/gameStore'
import { Terrain } from './Terrain'
import { Roads } from './Roads'
import { Buildings } from './Buildings'
import { Trees } from './Trees'
import { StreetFurniture } from './StreetFurniture'
import { Clouds } from './Clouds'
import { TrafficLights } from './TrafficLights'

export function CityMap() {
  const sunRef = useRef<THREE.DirectionalLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const hemisphereRef = useRef<THREE.HemisphereLight>(null)
  const { timeOfDay, isDayTime } = useGameStore()
  
  // Calculate sun position based on time
  const sunPosition = useMemo(() => {
    const angle = (timeOfDay - 0.25) * Math.PI * 2 // From sunrise to sunset
    const height = Math.sin(angle) * 150
    const horizontal = Math.cos(angle) * 100
    return [horizontal, height, 50] as [number, number, number]
  }, [timeOfDay])
  
  // Get sky color based on time
  const getSkyColor = () => {
    if (timeOfDay < 0.2) return '#0a1628' // Night
    if (timeOfDay < 0.25) return '#ff6b6b' // Sunrise red
    if (timeOfDay < 0.3) return '#ffa07a' // Sunrise orange
    if (timeOfDay < 0.7) return '#87CEEB' // Day blue
    if (timeOfDay < 0.8) return '#ff8c42' // Sunset orange
    if (timeOfDay < 0.85) return '#9370db' // Dusk purple
    return '#0a1628' // Night
  }
  
  // Get fog color based on time
  const getFogColor = () => {
    if (timeOfDay < 0.2) return '#0a1628'
    if (timeOfDay < 0.25) return '#ff9999'
    if (timeOfDay < 0.3) return '#ffcc99'
    if (timeOfDay < 0.7) return '#c9d6e3'
    if (timeOfDay < 0.8) return '#ff9966'
    if (timeOfDay < 0.85) return '#9370db'
    return '#0a1628'
  }
  
  // Get sun intensity based on time
  const getSunIntensity = () => {
    if (timeOfDay < 0.2) return 0.1
    if (timeOfDay < 0.25) return 0.3
    if (timeOfDay < 0.3) return 0.7
    if (timeOfDay < 0.7) return 1.2
    if (timeOfDay < 0.8) return 0.8
    if (timeOfDay < 0.85) return 0.3
    return 0.1
  }
  
  // Get ambient intensity
  const getAmbientIntensity = () => {
    if (timeOfDay < 0.2) return 0.1
    if (timeOfDay < 0.25) return 0.2
    if (timeOfDay < 0.7) return 0.4
    if (timeOfDay < 0.8) return 0.3
    if (timeOfDay < 0.85) return 0.15
    return 0.1
  }

  return (
    <group>
      {/* Sky */}
      <color attach="background" args={[getSkyColor()]} />
      
      {/* Fog for atmosphere */}
      <fog attach="fog" args={[getFogColor(), 100, 800]} />
      
      {/* Ambient light */}
      <ambientLight ref={ambientRef} intensity={getAmbientIntensity()} />
      
      {/* Main directional light (sun) */}
      <directionalLight
        ref={sunRef}
        position={sunPosition}
        intensity={getSunIntensity()}
        color={timeOfDay > 0.2 && timeOfDay < 0.85 ? '#fff5e6' : '#ff9966'}
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
        ref={hemisphereRef}
        args={[getSkyColor(), '#2d5a27', 0.5]}
      />
      
      {/* Night lights */}
      {!isDayTime() && (
        <>
          <pointLight position={[0, 20, 0]} intensity={0.2} color="#ffffcc" distance={200} />
          <pointLight position={[80, 20, 0]} intensity={0.2} color="#ffffcc" distance={200} />
          <pointLight position={[-80, 20, 0]} intensity={0.2} color="#ffffcc" distance={200} />
        </>
      )}
      
      {/* Terrain and roads */}
      <Terrain />
      <Roads />
      
      {/* Environment */}
      <Buildings />
      <Trees />
      <StreetFurniture />
      
      {/* Effects */}
      <Clouds />
      <TrafficLights />
    </group>
  )
}