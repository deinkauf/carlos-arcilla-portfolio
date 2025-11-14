import { useRef, useState, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { animate } from 'motion'
import MediaNode from './MediaNode'
import { generateSpherePositions } from '../utils/sphericalPositions'
import { mediaItems, MediaItem } from '../data/mediaData'

const SPHERE_RADIUS = 2
const MEDIA_COUNT = 15
const AUTO_ROTATE_SPEED = 0.5

type ViewMode = 'globe' | 'transitioning' | 'focused'

interface SceneProps {
  onMediaClick: (media: MediaItem) => void
  selectedMedia: MediaItem | null
  viewMode: ViewMode
  onTransitionComplete: () => void
  highQualityUrl: string | null
  isMediaLoaded: boolean
}

export default function Scene({
  onMediaClick,
  selectedMedia,
  viewMode,
  onTransitionComplete,
}: SceneProps) {
  const { camera } = useThree()
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const interactionTimeoutRef = useRef<number | undefined>()

  // Camera animation state
  const initialCameraPosition = useRef(new Vector3(0, 0, 5))
  const targetCameraPosition = useRef(new Vector3())
  const targetLookAt = useRef(new Vector3())
  const [isAnimating, setIsAnimating] = useState(false)

  // Generate positions using Fibonacci spiral distribution
  const mediaPositions = generateSpherePositions(MEDIA_COUNT, SPHERE_RADIUS)

  // Handle camera zoom transition
  useEffect(() => {
    if (viewMode === 'transitioning' && selectedMedia) {
      const mediaIndex = mediaItems.findIndex(item => item.id === selectedMedia.id)
      if (mediaIndex === -1) return

      const nodePosition = mediaPositions[mediaIndex]

      // Calculate camera target position (close to the node)
      const nodeVector = new Vector3(...nodePosition)
      const direction = nodeVector.clone().normalize()
      const cameraDistance = 0.8 // Distance from node
      const targetPosition = direction.multiplyScalar(nodeVector.length() + cameraDistance)

      targetCameraPosition.current.copy(targetPosition)
      targetLookAt.current.copy(nodeVector)

      // Store initial camera position
      initialCameraPosition.current.copy(camera.position)

      // Disable OrbitControls during transition
      if (controlsRef.current) {
        controlsRef.current.enabled = false
      }

      setIsAnimating(true)

      // Animate camera position
      const cameraPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z }
      const targetPos = { x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }

      animate(
        cameraPos,
        targetPos,
        {
          duration: 0.8,
        }
      ).then(() => {
        setIsAnimating(false)
        onTransitionComplete()
      })

      // Update camera position in animation loop
      const updateLoop = () => {
        camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
        camera.lookAt(nodeVector)
      }
      const intervalId = setInterval(updateLoop, 16) // ~60fps
      setTimeout(() => clearInterval(intervalId), 800)
    } else if (viewMode === 'globe') {
      // Zoom back out to initial position
      const cameraPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z }
      const initialPos = {
        x: initialCameraPosition.current.x,
        y: initialCameraPosition.current.y,
        z: initialCameraPosition.current.z
      }

      setIsAnimating(true)

      animate(
        cameraPos,
        initialPos,
        {
          duration: 0.8,
        }
      ).then(() => {
        setIsAnimating(false)
        // Re-enable OrbitControls
        if (controlsRef.current) {
          controlsRef.current.enabled = true
        }
      })

      // Update camera position in animation loop
      const updateLoop = () => {
        camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
        camera.lookAt(0, 0, 0)
      }
      const intervalId = setInterval(updateLoop, 16) // ~60fps
      setTimeout(() => clearInterval(intervalId), 800)
    }
  }, [viewMode, selectedMedia, camera, mediaPositions, onTransitionComplete])

  // Handle user interaction detection
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const handleStart = () => {
      setIsInteracting(true)
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current)
      }
    }

    const handleEnd = () => {
      // Resume auto-rotation after 2 seconds of inactivity
      interactionTimeoutRef.current = setTimeout(() => {
        setIsInteracting(false)
      }, 2000)
    }

    controls.addEventListener('start', handleStart)
    controls.addEventListener('end', handleEnd)

    return () => {
      controls.removeEventListener('start', handleStart)
      controls.removeEventListener('end', handleEnd)
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Ambient base lighting */}
      <ambientLight intensity={0.6} />

      {/* Hemisphere light for natural sky/ground lighting */}
      <hemisphereLight
        args={['#ffffff', '#b8b8b8', 0.5]}
        position={[0, 50, 0]}
      />

      {/* Key light - main directional light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow={false}
      />

      {/* Fill lights for depth */}
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#a8d8ff" />
      <pointLight position={[5, -3, 5]} intensity={0.2} color="#ffd8a8" />

      {/* Render media nodes with image textures */}
      {mediaPositions.map((position, index) => (
        <MediaNode
          key={mediaItems[index].id}
          position={position}
          imageUrl={mediaItems[index].imageUrl}
          isVideo={mediaItems[index].type === 'video'}
          onMediaClick={() => onMediaClick(mediaItems[index])}
        />
      ))}

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        enableZoom={false}
        autoRotate={!isInteracting && viewMode === 'globe'}
        autoRotateSpeed={AUTO_ROTATE_SPEED}
        enablePan={false}
        enabled={viewMode === 'globe' && !isAnimating}
        touches={{
          ONE: 2, // TOUCH.ROTATE
          TWO: 0  // Disable two-finger gestures
        }}
      />
    </>
  )
}
