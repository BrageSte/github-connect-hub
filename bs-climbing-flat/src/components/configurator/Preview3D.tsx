'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import * as THREE from 'three'
import type { Grip } from '@/types'

// Constants for the board visualization
const BOARD_WIDTH = 200 // mm
const BOARD_DEPTH = 40 // mm
const BOARD_HEIGHT = 10 // mm
const SCALE = 0.01 // Convert mm to scene units

interface GripBlockProps {
  grip: Grip
  index: number
  totalGrips: number
  isActive: boolean
}

function GripBlock({ grip, index, totalGrips, isActive }: GripBlockProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Calculate position
  const spacing = BOARD_WIDTH / (totalGrips + 1)
  const xPos = (spacing * (index + 1) - BOARD_WIDTH / 2) * SCALE
  
  // Animate the active grip
  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.02
    }
  })
  
  const width = grip.width * SCALE
  const height = grip.height * SCALE
  const depth = BOARD_DEPTH * SCALE

  return (
    <mesh
      ref={meshRef}
      position={[xPos, (height / 2) + (BOARD_HEIGHT * SCALE), 0]}
    >
      <boxGeometry args={[width, height, depth * 0.8]} />
      <meshStandardMaterial 
        color={isActive ? '#F59E0B' : '#9CA3AF'}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  )
}

function Board() {
  return (
    <mesh position={[0, (BOARD_HEIGHT * SCALE) / 2, 0]}>
      <boxGeometry args={[BOARD_WIDTH * SCALE, BOARD_HEIGHT * SCALE, BOARD_DEPTH * SCALE]} />
      <meshStandardMaterial color="#374151" roughness={0.6} metalness={0.2} />
    </mesh>
  )
}

function Scene({ grips, activeGripId }: { grips: Grip[]; activeGripId: number | null }) {
  const groupRef = useRef<THREE.Group>(null)
  
  // Gentle rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })
  
  return (
    <group ref={groupRef}>
      <Board />
      {grips.map((grip, index) => (
        <GripBlock 
          key={grip.id} 
          grip={grip} 
          index={index}
          totalGrips={grips.length}
          isActive={grip.id === activeGripId}
        />
      ))}
    </group>
  )
}

interface Preview3DProps {
  grips: Grip[]
  activeGripId: number | null
}

export default function Preview3D({ grips, activeGripId }: Preview3DProps) {
  return (
    <div className="relative w-full aspect-[4/3] bg-background rounded-xl border border-border overflow-hidden">
      {/* Canvas */}
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1.5, 3]} fov={35} />
        <OrbitControls 
          enablePan={false}
          minDistance={2}
          maxDistance={5}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0.3, 0]}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.3} />
        
        {/* Scene */}
        <Scene grips={grips} activeGripId={activeGripId} />
        
        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#0B0F14" />
        </mesh>
      </Canvas>
      
      {/* Overlay labels */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-valid rounded-full animate-pulse" />
        <span className="text-xs text-text-muted font-mono">LIVE PREVIEW</span>
      </div>
      
      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 text-xs text-text-muted">
        Dra for å rotere
      </div>
      
      {/* Active grip indicator */}
      {activeGripId && (
        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-surface/80 backdrop-blur-sm rounded-lg border border-border">
          <span className="text-xs text-text-muted">Redigerer: </span>
          <span className="text-xs font-medium text-primary">Grep {activeGripId}</span>
        </div>
      )}
    </div>
  )
}
