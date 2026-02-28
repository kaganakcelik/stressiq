import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Html, Line } from '@react-three/drei'
import * as THREE from 'three'



const COLOR_BLUE = '#54a0ff'


const COLOR_RED = '#ff6b6b'


//each of these will range from 0 to 1, with 0 representing the blue color and 1 representing the red color
const TEMPORAL_COLOR_INDEX = 0 //Temporal
const CEREBELLUM_COLOR_INDEX = 0 //Cerebellum
const FRONTAL_COLOR_INDEX = 0 //Fronta
const PARIETAL_COLOR_INDEX = 0 //Parietal
const OCCIPITAL_COLOR_INDEX = 0 //Occipital
const SPINAL_COLOR_INDEX = 0 //spinal



const REGION_LABELS = [
  'Temporal',
  'Cerebellum',
  'Frontal',
  'Parietal',
  'Occipital',
  'Spinal',
]
const REGION_KEYS = [
  'TEMPORAL',
  'CEREBELLUM',
  'FRONTAL',
  'PARIETAL',
  'OCCIPITAL',
  'SPINAL',
] as const

// Per-region opacity (0 = fully transparent, 1 = fully opaque)
const TEMPORAL_OPACITY = 0.7
const CEREBELLUM_OPACITY = 0.7
const FRONTAL_OPACITY = 0.7
const PARIETAL_OPACITY = 0.7
const OCCIPITAL_OPACITY = 0.7
const SPINAL_OPACITY = 0.7

const REGION_OPACITIES = [
  TEMPORAL_OPACITY,
  CEREBELLUM_OPACITY,
  FRONTAL_OPACITY,
  PARIETAL_OPACITY,
  OCCIPITAL_OPACITY,
  SPINAL_OPACITY,
]

// Orbit target: the point the camera looks at (this is what moves when you pan)
const ORBIT_TARGET_X = 15
const ORBIT_TARGET_Y = -1.77
const ORBIT_TARGET_Z = 33.277

// Initial camera position (where you're looking from when the page loads)
// e.g. [0, 0, 8] = in front, [8, 0, 0] = from the right, [0, 8, 0] = from above
const INITIAL_CAMERA_X = -64
const INITIAL_CAMERA_Y = 140
const INITIAL_CAMERA_Z = 475

type BrainModelProps = {
  url?: string
  colorIndices: number[]
  onSelectRegion?: (region: typeof REGION_KEYS[number]) => void
}

function BrainModel({
  url = '/BrainSegmented.glb',
  colorIndices,
  onSelectRegion,
}: BrainModelProps) {
  const gltf = useGLTF(url)
  const { coloredScene, centers, labelAnchors } = useMemo(() => {
    let index = 0
    const centersList: THREE.Vector3[] = []

    gltf.scene.updateMatrixWorld(true)

    gltf.scene.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return

      mesh.geometry.computeBoundingBox()
      const center = new THREE.Vector3()
      if (mesh.geometry.boundingBox) {
        mesh.geometry.boundingBox.getCenter(center)
      }
      center.applyMatrix4(mesh.matrixWorld)
      centersList.push(center)

      const alpha = colorIndices[index] ?? 0
      const color = new THREE.Color(COLOR_BLUE).lerp(new THREE.Color(COLOR_RED), alpha)
      const opacity =
        REGION_OPACITIES[index] ?? REGION_OPACITIES[REGION_OPACITIES.length - 1]
      index += 1

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map(
          () =>
            new THREE.MeshStandardMaterial({
              color,
              roughness: 0.4,
              metalness: 0.1,
              transparent: opacity < 1,
              opacity,
            }),
        )
      } else {
        mesh.material = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.4,
          metalness: 0.1,
          transparent: opacity < 1,
          opacity,
        })
      }
    })

    const sceneCenter = new THREE.Vector3()
    for (const center of centersList) {
      sceneCenter.add(center)
    }
    if (centersList.length > 0) {
      sceneCenter.divideScalar(centersList.length)
    }

    const anchors = centersList.map((center, idx) => {
      const direction = center.clone().sub(sceneCenter)
      if (direction.lengthSq() === 0) {
        direction.set(1, 0, 0)
      }
      direction.normalize()

      const verticalNudge = (idx - (centersList.length - 1) / 2) * 6
      return center
        .clone()
        .add(direction.multiplyScalar(42))
        .add(new THREE.Vector3(0, verticalNudge, 0))
    })

    return { coloredScene: gltf.scene, centers: centersList, labelAnchors: anchors }
  }, [
    gltf,
    colorIndices,
  ])

  return (
    <group rotation={[0, 0.3, 0]}>
      <primitive object={coloredScene} />
      {centers.map((pos, idx) => (
        <group key={idx}>
          <Line points={[pos, labelAnchors[idx]]} color="#ffffff" lineWidth={1} />
          <Html position={pos} center pointerEvents="none">
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: 'white',
                borderRadius: '50%',
                boxShadow: '0 0 4px rgba(0,0,0,0.5)',
              }}
            />
          </Html>
          <Html position={labelAnchors[idx]} center pointerEvents="auto">
  <button
    type="button"
    className="brain-label"
    onClick={(e) => {
      e.stopPropagation()
      if (onSelectRegion) {
        onSelectRegion(REGION_KEYS[idx])
      }
    }}
  >
    {REGION_LABELS[idx] ?? `Region ${idx + 1}`}
  </button>
</Html>
        </group>
      ))}
    </group>
  )
}

useGLTF.preload('/BrainSegmented.glb')

function CameraPositionLogger() {
  const { camera } = useThree()
  const frameCount = useRef(0)
  useFrame(() => {
    frameCount.current += 1
    if (frameCount.current % 15 !== 0) return
    void camera.position.x // keep ref for when console.log below is uncommented
    // const { x, y, z } = camera.position
    // console.log(
    //   'INITIAL_CAMERA_X =',
    //   x,
    //   ', INITIAL_CAMERA_Y =',
    //   y,
    //   ', INITIAL_CAMERA_Z =',
    //   z,
    // )
  })
  return null
}

function OrbitTargetLogger() {
  const controls = useThree((s) => s.controls)
  const frameCount = useRef(0)
  useFrame(() => {
    if (!controls || !('target' in controls)) return
    frameCount.current += 1
    if (frameCount.current % 15 !== 0) return
    const { x, y, z } = (controls as { target: THREE.Vector3 }).target
    console.log(
      'ORBIT_TARGET_X =',
      x,
      ', ORBIT_TARGET_Y =',
      y,
      ', ORBIT_TARGET_Z =',
      z,
    )
  })
  return null
}

type BrainViewerProps = {
  onSelectRegion?: (region: typeof REGION_KEYS[number]) => void
}

export function BrainViewer({ onSelectRegion }: BrainViewerProps) {
  const [colorIndices, setColorIndices] = useState<number[]>([
    TEMPORAL_COLOR_INDEX,
    CEREBELLUM_COLOR_INDEX,
    FRONTAL_COLOR_INDEX,
    PARIETAL_COLOR_INDEX,
    OCCIPITAL_COLOR_INDEX,
    SPINAL_COLOR_INDEX,
  ])

  return (
    <div className="brain-viewer" style={{ position: 'relative', width: '100%', height: '100vh' }}>
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
          <BrainModel colorIndices={colorIndices} onSelectRegion={onSelectRegion} />
          <Environment preset="city" />
        </Suspense>
        <CameraPositionLogger />
        <OrbitTargetLogger />
        <OrbitControls
          target={[ORBIT_TARGET_X, ORBIT_TARGET_Y, ORBIT_TARGET_Z]}
          enablePan={false}
          enableZoom
          enableRotate
          makeDefault
          minDistance={500}
          maxDistance={1000}
        />
      </Canvas>
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          backgroundColor: 'rgba(5, 5, 10, 0.8)',
          padding: '15px 20px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        {REGION_LABELS.map((label, idx) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{label}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={colorIndices[idx]}
              onChange={(e) => {
                const newIndices = [...colorIndices]
                newIndices[idx] = parseFloat(e.target.value)
                setColorIndices(newIndices)
              }}
              style={{ cursor: 'pointer', width: '100px' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
