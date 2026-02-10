import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";
import AppErrorBoundary from "@/components/AppErrorBoundary";

export type BlockVariant = "shortedge" | "longedge";

interface StlModelProps {
  url: string;
}

function StlModel({ url }: StlModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let isActive = true;
    const loader = new STLLoader();

    setLoadError(false);
    if (geometryRef.current) {
      geometryRef.current.dispose();
      geometryRef.current = null;
    }
    setGeometry(null);

    loader.load(
      url,
      (geo) => {
        if (!isActive) {
          geo.dispose();
          return;
        }

        geo.center();
        geo.computeBoundingBox();

        const box = geo.boundingBox;
        if (box) {
          const size = new THREE.Vector3();
          box.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const scale = 2.5 / maxDim;
            geo.scale(scale, scale, scale);
          }
        }

        if (geometryRef.current) {
          geometryRef.current.dispose();
        }
        geometryRef.current = geo;
        setGeometry(geo);
      },
      undefined,
      (error) => {
        if (!isActive) return;
        console.error("[stl-viewer] Failed loading model", { url, error });
        setLoadError(true);
      }
    );

    return () => {
      isActive = false;
      if (geometryRef.current) {
        geometryRef.current.dispose();
        geometryRef.current = null;
      }
    };
  }, [url]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  if (loadError) {
    return (
      <mesh>
        <boxGeometry args={[0.7, 0.35, 1.2]} />
        <meshStandardMaterial color="#ef4444" wireframe />
      </mesh>
    );
  }

  if (!geometry) {
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#374151" wireframe />
      </mesh>
    );
  }

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color="#6b7280" roughness={0.4} metalness={0.1} />
    </mesh>
  );
}

interface StlViewerProps {
  variant: BlockVariant;
}

const CanvasFallback = () => (
  <div className="flex h-full w-full items-center justify-center text-center text-xs text-muted-foreground">
    3D-forhandsvisning er midlertidig utilgjengelig.
  </div>
);

export default function StlViewer({ variant }: StlViewerProps) {
  const modelUrl =
    variant === "shortedge"
      ? "/models/blokk_shortedge.stl"
      : "/models/blokk_longedge.stl";

  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-muted/30 to-muted/60"
      style={{ touchAction: "pan-y" }}
    >
      <AppErrorBoundary boundaryName="stl-viewer-canvas" fallback={<CanvasFallback />}>
        <Canvas shadows style={{ touchAction: "pan-y" }}>
          <PerspectiveCamera makeDefault position={[4, 3, 4]} fov={35} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minDistance={3}
            maxDistance={8}
            autoRotate={false}
          />

          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-3, 4, -3]} intensity={0.5} />

          <StlModel url={modelUrl} key={modelUrl} />

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
            <planeGeometry args={[15, 15]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        </Canvas>
      </AppErrorBoundary>

      <div className="absolute bottom-3 right-3 rounded bg-background/80 px-2 py-1 text-xs text-muted-foreground backdrop-blur-sm">
        Klikk og dra for a rotere
      </div>
    </div>
  );
}
