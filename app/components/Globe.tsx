'use client'

import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'

interface GlobeProps {
  warmth?: number
  smogOpacity?: number
}

export const Globe = React.memo<GlobeProps>(function Globe({ warmth = 0, smogOpacity = 0 }) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: "high-performance",
          outputColorSpace: THREE.SRGBColorSpace
        }}
        frameloop="always"
      >
        {/* LIGHTS - Increased ambient for brighter colors */}
        <ambientLight intensity={1.5} />
        <DynamicKeyLight warmth={warmth} />
        <directionalLight position={[-2, -1, -2]} intensity={0.4} color="#ffffff" />
        
        {/* LAYERS - All enabled with brighter lighting */}
        <EarthSphere warmth={warmth} smogOpacity={smogOpacity} />
        <CloudLayer />
        <SmogOverlay smogOpacity={smogOpacity} />
        {/* <AtmosphereGlow /> */}
      </Canvas>
    </div>
  )
})
// Dynamic key light that shifts color based on warmth
function DynamicKeyLight({ warmth }: { warmth: number }) {
  // Interpolate from cool white to warm orange-red
  const lightColor = React.useMemo(() => {
    const r = 255
    const g = Math.round(255 - warmth * 80) // 255 -> 175
    const b = Math.round(255 - warmth * 120) // 255 -> 135
    return `rgb(${r}, ${g}, ${b})`
  }, [warmth])
  
  const intensity = 1.2
  
  return <directionalLight position={[3, 2, 2]} intensity={intensity} color={lightColor} />
}


interface EarthSphereProps {
  warmth: number
  smogOpacity: number
}

function EarthSphere({ warmth, smogOpacity }: EarthSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Load Earth texture
  const earthTexture = useLoader(TextureLoader, '/2k_earth_daymap.jpg')
  
  // Configure texture to fix seams and improve quality
  React.useMemo(() => {
    if (earthTexture) {
      earthTexture.wrapS = THREE.RepeatWrapping
      earthTexture.wrapT = THREE.RepeatWrapping
      earthTexture.repeat.set(1, 1)
      earthTexture.anisotropy = 16
      earthTexture.colorSpace = THREE.SRGBColorSpace
    }
    return earthTexture
  }, [earthTexture])
  
  // Auto-rotate
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1 // Slow rotation
    }
  })

  return (
    <mesh ref={meshRef} renderOrder={0}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial 
        map={earthTexture}
        shininess={10}
        specular="#222222"
      />
    </mesh>
  )
}

// Cloud layer - slightly larger sphere with cloud texture
function CloudLayer() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  
  // Try to load cloud texture, but don't break if missing
  React.useEffect(() => {
    const loader = new TextureLoader()
    loader.load(
      '/2k_earth_clouds.jpg',
      (loadedTexture) => {
        // Configure texture to fix seams and improve quality
        loadedTexture.wrapS = THREE.RepeatWrapping
        loadedTexture.wrapT = THREE.RepeatWrapping
        loadedTexture.repeat.set(1, 1)
        loadedTexture.anisotropy = 16
        loadedTexture.colorSpace = THREE.SRGBColorSpace
        setTexture(loadedTexture)
      },
      undefined,
      (error) => {
        // Silently fail if texture not found
        console.warn('Cloud texture not found, skipping cloud layer')
      }
    )
  }, [])
  
  // Rotate slightly faster than Earth
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.12
    }
  })
  
  // Only render if texture loaded
  if (!texture) return null
  
  return (
    <mesh ref={meshRef} scale={1.01} renderOrder={1}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial 
        map={texture}
        transparent={true}
        opacity={0.45}
        depthWrite={false}
      />
    </mesh>
  )
}

// Smog overlay - dark transparent sphere responding to pollution
function SmogOverlay({ smogOpacity }: { smogOpacity: number }) {
  const opacity = smogOpacity * 0.15 // Keep it very subtle
  
  if (opacity === 0) return null
  
  return (
    <mesh scale={1.02} renderOrder={1}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#3d2d1f"
        transparent={true}
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  )
}

// Atmospheric glow - larger sphere with BackSide material
function AtmosphereGlow() {
  return (
    <mesh scale={1.05} renderOrder={2}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#88ccff"
        transparent={true}
        opacity={0.08}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}
