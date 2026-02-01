import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Center } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import * as THREE from 'three'
import { Skeleton } from '@/components/ui/skeleton'

export type BlockVariant = 'shortedge' | 'longedge'

interface StlModelProps {
  variant: BlockVariant
}

function StlModel({ variant }: StlModelProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const modelPath = variant === 'shortedge' 
    ? '/models/blokk_shortedge.stl' 
    : '/models/blokk_longedge.stl'
  
  const geometry = useLoader(STLLoader, modelPath)
  
  // Auto-rotate gently
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15
    }
  })

  // Center and scale the geometry
  useEffect(() => {
    if (geometry) {
      geometry.center()
      geometry.computeBoundingBox()
      const box = geometry.boundingBox
      if (box) {
        const size = new THREE.Vector3()
        box.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2 / maxDim
        geometry.scale(scale, scale, scale)
      }
    }
  }, [geometry])

  return (
    <Center>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial 
          color="#4a5568"
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
    </Center>
  )
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#374151" wireframe />
    </mesh>
  )
}

interface StlViewerProps {
  variant: BlockVariant
}

export default function StlViewer({ variant }: StlViewerProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-muted/50 to-muted rounded-xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Skeleton className="w-32 h-32 rounded-full" />
        </div>
      )}
      
      <Canvas 
        shadows
        onCreated={() => setIsLoading(false)}
        className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}
      >
        <PerspectiveCamera makeDefault position={[3, 2, 3]} fov={40} />
        <OrbitControls 
          enablePan={false}
          minDistance={2}
          maxDistance={6}
          autoRotate={false}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-3, 3, -3]} intensity={0.4} />
        <pointLight position={[0, -3, 0]} intensity={0.2} />
        
        <Suspense fallback={<LoadingFallback />}>
          <StlModel variant={variant} />
        </Suspense>
        
        {/* Ground plane for shadow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.15} />
        </mesh>
      </Canvas>
      
      {/* Drag hint */}
      <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
        Dra for å rotere
      </div>
    </div>
  )
}
