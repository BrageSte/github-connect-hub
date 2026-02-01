import { Suspense, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Center } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import * as THREE from 'three'
import { Skeleton } from '@/components/ui/skeleton'

export type BlockVariant = 'shortedge' | 'longedge'

interface StlModelProps {
  url: string
}

function StlModel({ url }: StlModelProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null)
  
  // Load STL manually to have more control
  useMemo(() => {
    const loader = new STLLoader()
    loader.load(url, (geo) => {
      // Center the geometry
      geo.center()
      
      // Compute bounding box and scale
      geo.computeBoundingBox()
      const box = geo.boundingBox
      if (box) {
        const size = new THREE.Vector3()
        box.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z)
        if (maxDim > 0) {
          const scale = 2.5 / maxDim
          geo.scale(scale, scale, scale)
        }
      }
      
      setGeometry(geo)
    })
  }, [url])
  
  // Auto-rotate gently
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  if (!geometry) {
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#374151" wireframe />
      </mesh>
    )
  }

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial 
        color="#6b7280"
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  )
}

interface StlViewerProps {
  variant: BlockVariant
}

export default function StlViewer({ variant }: StlViewerProps) {
  const modelUrl = variant === 'shortedge' 
    ? '/models/blokk_shortedge.stl' 
    : '/models/blokk_longedge.stl'

  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-muted/30 to-muted/60 rounded-xl overflow-hidden">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[4, 3, 4]} fov={35} />
        <OrbitControls 
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          autoRotate={false}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.2} 
          castShadow
        />
        <directionalLight position={[-3, 4, -3]} intensity={0.5} />
        
        <StlModel url={modelUrl} key={modelUrl} />
        
        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
          <planeGeometry args={[15, 15]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </Canvas>
      
      {/* Drag hint */}
      <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
        Dra for å rotere
      </div>
    </div>
  )
}
