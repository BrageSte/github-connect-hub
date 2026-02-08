import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

interface HeightDiffs {
  lilleToRing: number
  ringToLang: number
  langToPeke: number
}

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
  heightDiffs: HeightDiffs
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

  // Custom geometry: fillet only on top-front edge
  const geometry = useMemo(() => {
    const r = Math.min(h, d) * 0.25
    const segments = 8

    const shape = new THREE.Shape()
    shape.moveTo(-d / 2, 0)
    shape.lineTo(d / 2, 0)
    shape.lineTo(d / 2, h - r)
    shape.quadraticCurveTo(d / 2, h, d / 2 - r, h)
    shape.lineTo(-d / 2, h)
    shape.closePath()

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: w,
      bevelEnabled: false,
      curveSegments: segments,
    })

    geo.rotateY(-Math.PI / 2)

    geo.computeBoundingBox()
    const bb = geo.boundingBox!
    geo.translate(
      -(bb.min.x + bb.max.x) / 2,
      0,
      -(bb.min.z + bb.max.z) / 2
    )

    geo.computeVertexNormals()
    return geo
  }, [w, h, d])

  return (
    <group position={position}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Finger name ABOVE the block */}
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

function HeightDiffIndicator({
  posLeft,
  posRight,
  heightLeft,
  heightRight,
  diff,
  badgeLabel,
}: {
  posLeft: [number, number, number]
  posRight: [number, number, number]
  heightLeft: number
  heightRight: number
  diff: number
  badgeLabel: string
}) {
  const scale = 0.04
  const hL = heightLeft * scale
  const hR = heightRight * scale
  const midX = (posLeft[0] + posRight[0]) / 2
  const yMin = Math.min(hL, hR)
  const yMax = Math.max(hL, hR)
  const lineMidY = (yMin + yMax) / 2

  // Don't render if diff is 0
  if (diff === 0) {
    return (
      <group>
        <Text
          position={[midX, Math.max(hL, hR) + 0.04, 0.01]}
          fontSize={0.09}
          color="#9ca3af"
          anchorX="center"
          anchorY="bottom"
        >
          {`${badgeLabel}: 0mm`}
        </Text>
      </group>
    )
  }

  const lineHeight = yMax - yMin

  return (
    <group>
      {/* Vertical line between the two heights */}
      <mesh position={[midX, lineMidY, 0.01]}>
        <boxGeometry args={[0.015, lineHeight, 0.005]} />
        <meshBasicMaterial color="#9ca3af" />
      </mesh>
      {/* Top cap */}
      <mesh position={[midX, yMax, 0.01]}>
        <boxGeometry args={[0.08, 0.015, 0.005]} />
        <meshBasicMaterial color="#9ca3af" />
      </mesh>
      {/* Bottom cap */}
      <mesh position={[midX, yMin, 0.01]}>
        <boxGeometry args={[0.08, 0.015, 0.005]} />
        <meshBasicMaterial color="#9ca3af" />
      </mesh>
      {/* Label */}
      <Text
        position={[midX, lineMidY, 0.03]}
        fontSize={0.1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {`${badgeLabel}: ${diff > 0 ? '+' : ''}${diff}mm`}
      </Text>
    </group>
  )
}

function DepthIndicator({ position, depth }: { position: [number, number, number]; depth: number }) {
  const scale = 0.04
  const d = depth * scale

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.012, 0.012, d]} />
        <meshBasicMaterial color="#9ca3af" />
      </mesh>
      <mesh position={[0, 0, d / 2]}>
        <boxGeometry args={[0.08, 0.012, 0.012]} />
        <meshBasicMaterial color="#9ca3af" />
      </mesh>
      <mesh position={[0, 0, -d / 2]}>
        <boxGeometry args={[0.08, 0.012, 0.012]} />
        <meshBasicMaterial color="#9ca3af" />
      </mesh>
      <Text
        position={[0.12, 0, 0]}
        fontSize={0.11}
        color="#9ca3af"
        anchorX="left"
        anchorY="middle"
      >
        {`${depth}mm`}
      </Text>
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

function BlockScene({ widths, heights, heightDiffs, depth }: DynamicBlockPreviewProps) {
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

  const rightEdge = useMemo(() => {
    if (fingerPositions.length === 0) return 1
    const lastPos = fingerPositions[fingerPositions.length - 1][0]
    const lastHalfWidth = (widths.pekefinger * 0.04) / 2
    return lastPos + lastHalfWidth + 0.2
  }, [fingerPositions, widths.pekefinger])

  const fingerLabels = ['Lille', 'Ring', 'Lang', 'Peke']

  const diffPairs = [
    { left: 0, right: 1, diff: heightDiffs.lilleToRing, badge: 'A' },
    { left: 1, right: 2, diff: heightDiffs.ringToLang, badge: 'B' },
    { left: 2, right: 3, diff: heightDiffs.langToPeke, badge: 'C' },
  ]

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

      {/* Height difference indicators between adjacent fingers */}
      {diffPairs.map(({ left, right, diff, badge }) => (
        <HeightDiffIndicator
          key={badge}
          posLeft={fingerPositions[left]}
          posRight={fingerPositions[right]}
          heightLeft={heights[FINGER_ORDER[left]]}
          heightRight={heights[FINGER_ORDER[right]]}
          diff={diff}
          badgeLabel={badge}
        />
      ))}

      {/* Depth dimension indicator */}
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

export default function DynamicBlockPreview({ widths, heights, heightDiffs, depth }: DynamicBlockPreviewProps) {
  return (
    <div className="w-full h-56 sm:h-64 bg-surface-light rounded-xl overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <Canvas
        shadows
        camera={{ position: [0, 2, 4], fov: 45 }}
        gl={{ antialias: true }}
        style={{ touchAction: 'pan-y' }}
      >
        <BlockScene widths={widths} heights={heights} heightDiffs={heightDiffs} depth={depth} />
      </Canvas>
    </div>
  )
}
