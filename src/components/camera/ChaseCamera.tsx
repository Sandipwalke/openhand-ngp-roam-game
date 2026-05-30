import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../stores/gameStore'

export function ChaseCamera() {
  const { camera } = useThree()
  const { player } = useGameStore()
  
  const targetPosition = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  
  useFrame(() => {
    const [px, py, pz] = player.position
    const [, ry] = player.rotation
    
    // Calculate camera position behind the vehicle
    const distance = 12 + (player.speed / 200) * 5 // Further when faster
    const height = 5 + (player.speed / 200) * 2
    
    const cameraOffset = new THREE.Vector3(
      Math.sin(ry) * -distance,
      height,
      Math.cos(ry) * -distance
    )
    
    targetPosition.current.set(px, py, pz).add(cameraOffset)
    
    // Look at point slightly ahead of vehicle
    const lookAtOffset = new THREE.Vector3(
      Math.sin(ry) * 5,
      1,
      Math.cos(ry) * 5
    )
    targetLookAt.current.set(px, py, pz).add(lookAtOffset)
    
    // Smooth camera movement
    camera.position.lerp(targetPosition.current, 0.05)
    
    // Smooth look at
    const currentLookAt = new THREE.Vector3()
    camera.getWorldDirection(currentLookAt)
    currentLookAt.multiplyScalar(10).add(camera.position)
    currentLookAt.lerp(targetLookAt.current, 0.08)
    camera.lookAt(targetLookAt.current)
  })
  
  return null
}