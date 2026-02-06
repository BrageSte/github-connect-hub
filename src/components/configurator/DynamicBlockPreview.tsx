import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, RoundedBox } from '@react-three/drei'
import { useMemo } from 'react'

interface DynamicBlockPreviewProps {
  widths: {
    lillefinger: number
    ringfinger: number
    langfinger: number
    pekefinger: number
  }
  heights: {
    lillefinger: number
    ringfinger: number
    langfinger: number
    pekefinger: number
  }
  depth: number
}

const FINGER_COLORS = {
  lillefinger: '#ef4444',
  ringfinger: '#f97316',
  langfinger: '#eab308',
  pekefinger: '#22c55e'
}

const FINGER_ORDER = ['lillefinger', 'ringfinger', 'langfinger', 'pekefinger'] as const

function FingerBlock({
  width,
  height,
  depth,
  position,
  color,
  label
}: {
  width: number
  height: number
  depth: number
  position: [number, number, number]
  color: string
  label: string
}) {
  const scale = 0.04
  const w = width * scale
  const h = height * scale
  const d = depth * scale
  const filletRadius = Math.min(w, h, d) * 0.15

  return (
    <group position={position}>
      {/* Rounded finger block (fillet on edges) */}
      <RoundedBox
        args={[w, h, d]}
        radius={filletRadius}
        smoothness={4}
        castShadow
        receiveShadow
        position={[0, h / 2, 0]}
      >
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </RoundedBox>

      {/* Height label on front face */}
      <Text
        position={[0, h / 2, d / 2 + 0.1]}
        fontSize={0.14}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {height}mm
      </Text>

      {/* Finger name ABOVE the block (always visible) */}
      <Text
        position={[0, h + 0.12, 0]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="bottom"
      >
        {label}
      </Text>
    </group>
  )
}

function DepthIndicator({ position, depth }: { position: [number, number, number]; depth: number }) {
  const scale = 0.04
  const d = depth * scale

  return (
    <group position={position}>
      {/* Dimension line along Z (depth axis) */}
      <mesh>
        <boxGeometry args={[0.012, 0.012, d]} />
        <meshBasicMaterial color="#9ca3af" />
      </mesh>
      {/* Front end cap */}
      <mesh position={[0, 0, d / 2]}>
        <boxGeometry args={[0.08, 0.012, 0.012]} />
        <meshBasicMaterial color="#9ca3af" />
      </mesh>
      {/* Back end cap */}
      <mesh position={[0, 0, -d / 2]}>
        <boxGeometry args={[0.08, 0.012, 0.012]} />
        <meshBasicMaterial color="#9ca3af" />
      </mesh>
      {/* Depth value label */}
      <Text
        position={[0.12, 0, 0]}
        fontSize={0.11}
        color="#9ca3af"
        anchorX="left"
        anchorY="middle"
      >
        {`${depth}mm`}
      </Text>
      {/* "Dybde" text below */}
      <Text
        position={[0.12, -0.14, 0]}
        fontSize={0.08}
        color="#6b7280"
        anchorX="left"
        anchorY="middle"
      >
        dybde
      </Text>
    </group>
  )
}

function BlockScene({ widths, heights, depth }: DynamicBlockPreviewProps) {
  const fingerPositions = useMemo(() => {
    const scale = 0.04
    const gap = 0.08
    const positions: [number, number, number][] = []

    let currentX = 0
    FINGER_ORDER.forEach((finger, i) => {
      const w = widths[finger] * scale
      if (i === 0) {
        currentX = w / 2
      } else {
        const prevW = widths[FINGER_ORDER[i - 1]] * scale
        currentX += prevW / 2 + gap + w / 2
      }
      positions.push([currentX, 0, 0])
    })

    // Center the group
    const totalWidth = currentX + (widths.pekefinger * scale) / 2
    const offset = totalWidth / 2
    return positions.map(([x, y, z]) => [x - offset, y, z] as [number, number, number])
  }, [widths])

  // Calculate right edge for depth indicator placement
  const rightEdge = useMemo(() => {
    if (fingerPositions.length === 0) return 1
    const lastPos = fingerPositions[fingerPositions.length - 1][0]
    const lastHalfWidth = (widths.pekefinger * 0.04) / 2
    return lastPos + lastHalfWidth + 0.2
  }, [fingerPositions, widths.pekefinger])

  const fingerLabels = ['Lille', 'Ring', 'Lang', 'Peke']

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-3, 5, -5]} intensity={0.3} />

      {/* Base plate */}
      <mesh receiveShadow position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>

      {/* Finger blocks */}
      {FINGER_ORDER.map((finger, i) => (
        <FingerBlock
          key={finger}
          width={widths[finger]}
          height={heights[finger]}
          depth={depth}
          position={fingerPositions[i]}
          color={FINGER_COLORS[finger]}
          label={fingerLabels[i]}
        />
      ))}

      {/* Depth dimension indicator on the right side */}
      <DepthIndicator
        position={[rightEdge, 0.25, 0]}
        depth={depth}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={2}
        maxDistance={6}
        target={[0, 0.5, 0]}
      />
    </>
  )
}

export default function DynamicBlockPreview({ widths, heights, depth }: DynamicBlockPreviewProps) {
  return (
    <div className="w-full h-64 bg-surface-light rounded-xl overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <Canvas
        shadows
        camera={{ position: [0, 2, 4], fov: 45 }}
        gl={{ antialias: true }}
        style={{ touchAction: 'pan-y' }}
      >
        <BlockScene widths={widths} heights={heights} depth={depth} />
      </Canvas>
    </div>
  )
}
