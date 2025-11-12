import { useRef, useState, useEffect } from 'react'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { OrbitControls } from '@react-three/drei'
import MediaNode from './MediaNode'
import { generateSpherePositions } from '../utils/sphericalPositions'
import { mediaItems, MediaItem } from '../data/mediaData'

const SPHERE_RADIUS = 2
const MEDIA_COUNT = 15
const AUTO_ROTATE_SPEED = 0.5

interface SceneProps {
  onMediaClick: (media: MediaItem) => void
}

export default function Scene({ onMediaClick }: SceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const interactionTimeoutRef = useRef<NodeJS.Timeout>()

  // Generate positions using Fibonacci spiral distribution
  const mediaPositions = generateSpherePositions(MEDIA_COUNT, SPHERE_RADIUS)

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
        autoRotate={!isInteracting}
        autoRotateSpeed={AUTO_ROTATE_SPEED}
        enablePan={false}
        touches={{
          ONE: 2, // TOUCH.ROTATE
          TWO: 0  // Disable two-finger gestures
        }}
      />
    </>
  )
}
