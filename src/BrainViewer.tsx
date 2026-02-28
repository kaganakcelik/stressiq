import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

const TEMPORAL_COLOR = '#ff6b6b' //Temporal
const CEREBELLUM_COLOR = '#feca57' //Cerebellum
const FRONTAL_COLOR = '#1dd1a1' //Fronta
const PARIETAL_COLOR = '#54a0ff' //Parietal
const OCCIPITAL_COLOR = '#5f27cd' //Occipital
const SPINAL_COLOR = '#ff9ff3' //Spinal Cord

const REGION_COLORS = [
  TEMPORAL_COLOR,
  CEREBELLUM_COLOR,
  FRONTAL_COLOR,
  PARIETAL_COLOR,
  OCCIPITAL_COLOR,
  SPINAL_COLOR,
]

// Nudge the model to center it in view (x = left/right, y = up/down, z = forward/back)
const MODEL_OFFSET_X = 0
const MODEL_OFFSET_Y = 0
const MODEL_OFFSET_Z = 0

// Initial camera position (where you're looking from when the page loads)
// e.g. [0, 0, 8] = in front, [8, 0, 0] = from the right, [0, 8, 0] = from above
const INITIAL_CAMERA_X = 0
const INITIAL_CAMERA_Y = 0
const INITIAL_CAMERA_Z = 0

type BrainModelProps = {
  url?: string
}

function BrainModel({ url = '/BrainSegmented.glb' }: BrainModelProps) {
  const gltf = useGLTF(url)
  const coloredScene = useMemo(() => {
    let index = 0

    gltf.scene.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return

      const hex =
        REGION_COLORS[index] ??
        REGION_COLORS[REGION_COLORS.length - 1]
      const color = new THREE.Color(hex)
      index += 1

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map(
          () =>
            new THREE.MeshStandardMaterial({
              color,
              roughness: 0.4,
              metalness: 0.1,
            }),
        )
      } else {
        mesh.material = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.4,
          metalness: 0.1,
        })
      }
    })

    return gltf.scene
  }, [gltf])

  return (
    <group
      position={[MODEL_OFFSET_X, MODEL_OFFSET_Y, MODEL_OFFSET_Z]}
      rotation={[0, 0.3, 0]}
    >
      <primitive object={coloredScene} />
    </group>
  )
}

useGLTF.preload('/BrainSegmented.glb')

export function BrainViewer() {
  return (
    <div className="brain-viewer">
      <Canvas
        camera={{
          position: [INITIAL_CAMERA_X, INITIAL_CAMERA_Y, INITIAL_CAMERA_Z],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
        <color attach="background" args={['#05050a']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, -5]} intensity={0.4} />
        <Suspense fallback={null}>
          <BrainModel />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom
          enableRotate
          makeDefault
          minDistance={500}
          maxDistance={1000}
        />
      </Canvas>
    </div>
  )
}

