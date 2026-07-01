"use client"

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Sparkles, useGLTF, PresentationControls, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing'
import * as THREE from 'three'

function CinematicModels() {
  const groupRef = useRef<THREE.Group>(null)
  
  // Use the downloaded crate as a placeholder for a stack of rice bags/warehouse assets
  const crate = useGLTF('/models/crate.glb')
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle cinematic breathing movement
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central Hero Object */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <primitive 
          object={crate.scene} 
          position={[0, -1, 0]} 
          scale={2.5} 
          rotation={[0, Math.PI / 4, 0]}
        />
      </Float>

      {/* Atmospheric dust particles */}
      <Sparkles count={200} scale={15} size={2} speed={0.2} opacity={0.4} color="#D4AF37" />
    </group>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.2} />
      
      {/* Cinematic Lighting */}
      <spotLight position={[5, 10, 5]} intensity={2} angle={0.5} penumbra={1} color="#FCE68A" castShadow />
      <spotLight position={[-10, 5, -5]} intensity={1} angle={0.8} penumbra={1} color="#ffffff" />
      <pointLight position={[0, -2, 5]} intensity={0.5} color="#D4AF37" />
      
      <PresentationControls 
        global 
        config={{ mass: 2, tension: 500 }} 
        snap={{ mass: 4, tension: 1500 }} 
        rotation={[0, 0, 0]} 
        polar={[-Math.PI / 6, Math.PI / 6]} 
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <CinematicModels />
      </PresentationControls>

      {/* Realistic contact shadows */}
      <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
      
      {/* High Dynamic Range Environment */}
      <Environment preset="warehouse" environmentIntensity={0.3} />

      {/* Post Processing for Cinematic Look */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2} 
          mipmapBlur 
          intensity={1.2} 
        />
        <DepthOfField 
          focusDistance={0} 
          focalLength={0.02} 
          bokehScale={2} 
          height={480} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  )
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 -z-10 bg-black">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
