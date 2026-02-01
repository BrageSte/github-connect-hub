import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Line } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

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

// Component for block with fillet
function FilletBlock({
  width,
  height,
  depth,
  position,
  color,
  label,
  showDepthLabel
}: {
  width: number
  height: number
  depth: number
  position: [number, number, number]
  color: string
  label: string
  showDepthLabel?: boolean
}) {
  const scale = 0.04
  const w = width * scale
  const h = height * scale
  const d = depth * scale
  const filletSize = 8 * scale // 8mm fillet

  // Create custom geometry with fillet (chamfer on front top edge)
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()

    // Create side profile with fillet
    // Start from bottom front
    shape.moveTo(0, 0)
    // Go to top front (before fillet)
    shape.lineTo(0, h - filletSize)
    // Fillet diagonal from front to back
    shape.lineTo(filletSize, h)
    // Go to back top
    shape.lineTo(d, h)
    // Go to back bottom
    shape.lineTo(d, 0)
    // Close shape
    shape.lineTo(0, 0)

    const extrudeSettings = {
      steps: 1,
      depth: w,
      bevelEnabled: false,
    }

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    // Rotate and center the geometry
    geo.rotateY(Math.PI / 2)
    geo.translate(-w / 2, 0, -d / 2)

    return geo
  }, [w, h, d, filletSize])

  return (
    <group position={position}>
      <mesh castShadow receiveShadow geometry={geometry}>
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Height label on front */}
      <Text
        position={[0, (h - filletSize) / 2, d / 2 + 0.1]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {height}mm
      </Text>

      {/* Finger name below */}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.12}
        color="#9ca3af"
        anchorX="center"
        anchorY="top"
      >
        {label}
      </Text>

      {/* 20mm edge marker on the side - shows the flat part after fillet */}
      <Line
        points={[
          [-w / 2 - 0.05, h - filletSize, d / 2],
          [-w / 2 - 0.05, 0, d / 2]
        ]}
        color="#60a5fa"
        lineWidth={2}
      />
      <Text
        position={[-w / 2 - 0.15, (h - filletSize) / 2, d / 2]}
        fontSize={0.1}
        color="#60a5fa"
        anchorX="right"
        anchorY="middle"
        rotation={[0, 0, 0]}
      >
        {(height - 8).toFixed(0)}mm
      </Text>

      {/* Fillet indicator line (8mm diagonal) */}
      <Line
        points={[
          [-w / 2 - 0.05, h - filletSize, d / 2],
          [-w / 2 - 0.05, h, d / 2 - filletSize]
        ]}
        color="#a855f7"
        lineWidth={2}
        dashed
        dashSize={0.03}
        gapSize={0.02}
      />

      {/* Show depth label on the middle block */}
      {showDepthLabel && (
        <>
          {/* Depth measurement line along the side */}
          <Line
            points={[
              [w / 2 + 0.05, 0.02, d / 2],
              [w / 2 + 0.05, 0.02, -d / 2]
            ]}
            color="#10b981"
            lineWidth={2}
          />
          {/* Depth label */}
          <Text
            position={[w / 2 + 0.2, 0.02, 0]}
            fontSize={0.14}
            color="#10b981"
            anchorX="left"
            anchorY="middle"
            rotation={[0, 0, 0]}
          >
            {depth}mm
          </Text>
          {/* End markers */}
          <Line
            points={[
              [w / 2 + 0.02, 0.02, d / 2],
              [w / 2 + 0.08, 0.02, d / 2]
            ]}
            color="#10b981"
            lineWidth={2}
          />
          <Line
            points={[
              [w / 2 + 0.02, 0.02, -d / 2],
              [w / 2 + 0.08, 0.02, -d / 2]
            ]}
            color="#10b981"
            lineWidth={2}
          />
        </>
      )}
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

    const totalWidth = currentX + (widths.pekefinger * scale) / 2
    const offset = totalWidth / 2
    return positions.map(([x, y, z]) => [x - offset, y, z] as [number, number, number])
  }, [widths])

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

      {/* Finger blocks with fillet */}
      {FINGER_ORDER.map((finger, i) => (
        <FilletBlock
          key={finger}
          width={widths[finger]}
          height={heights[finger]}
          depth={depth}
          position={fingerPositions[i]}
          color={FINGER_COLORS[finger]}
          label={fingerLabels[i]}
          showDepthLabel={i === 2} // Show depth on langfinger (middle-ish)
        />
      ))}

      {/* Legend */}
      <group position={[0, -0.3, 1.2]}>
        <Text
          position={[-0.8, 0, 0]}
          fontSize={0.1}
          color="#a855f7"
          anchorX="left"
        >
          ── 8mm filet
        </Text>
        <Text
          position={[0.3, 0, 0]}
          fontSize={0.1}
          color="#60a5fa"
          anchorX="left"
        >
          │ kant etter filet
        </Text>
      </group>

      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={6}
        target={[0, 0.5, 0]}
      />
    </>
  )
}

export default function DynamicBlockPreview({ widths, heights, depth }: DynamicBlockPreviewProps) {
  return (
    <div className="w-full h-64 bg-surface-light rounded-xl overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 2, 4], fov: 45 }}
        gl={{ antialias: true }}
      >
        <BlockScene widths={widths} heights={heights} depth={depth} />
      </Canvas>
    </div>
  )
}
