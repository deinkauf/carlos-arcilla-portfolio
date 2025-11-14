import { useRef, useState, useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import MediaNode from './MediaNode'
import { generateSpherePositions } from '../utils/sphericalPositions'
import { generateScatterPositions } from '../utils/scatterPositions'
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
  formationProgress: number
  onInteractionChange?: (isInteracting: boolean) => void
}

export default function Scene({
  onMediaClick,
  selectedMedia,
  viewMode,
  onTransitionComplete,
  highQualityUrl,
  isMediaLoaded,
  formationProgress,
  onInteractionChange,
}: SceneProps) {
  const { camera } = useThree()
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const interactionTimeoutRef = useRef<number | undefined>()

  // Camera animation state
  const initialCameraPosition = useRef(new Vector3(0, 0, 5))
  const targetCameraPosition = useRef(new Vector3())
  const targetLookAt = useRef(new Vector3())
  const previousViewMode = useRef<ViewMode>(viewMode)

  // Generate positions using Fibonacci spiral distribution (memoize to prevent re-renders)
  const mediaPositions = useMemo(() => generateSpherePositions(MEDIA_COUNT, SPHERE_RADIUS), [])

  // Generate scatter positions once and keep them constant
  // No regeneration - nodes always return to the same scatter positions
  const scatterPositions = useMemo(() =>
    generateScatterPositions(MEDIA_COUNT, SPHERE_RADIUS),
    []
  )

  // Ensure OrbitControls are enabled in globe mode
  useEffect(() => {
    if (controlsRef.current && viewMode === 'globe') {
      controlsRef.current.enabled = true
      controlsRef.current.update()
    }
  }, [viewMode])

  // Handle camera zoom transition
  useEffect(() => {
    let animationCancelled = false
    let rafId: number | undefined

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

      // Animate camera position
      const startTime = Date.now()
      const startPos = camera.position.clone()
      const duration = 800 // ms

      const updateCamera = () => {
        if (animationCancelled) return

        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function (ease-in-out)
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2

        camera.position.lerpVectors(startPos, targetPosition, eased)
        camera.lookAt(nodeVector)

        if (progress < 1 && !animationCancelled) {
          rafId = requestAnimationFrame(updateCamera)
        } else {
          onTransitionComplete()
        }
      }

      rafId = requestAnimationFrame(updateCamera)
    } else if (viewMode === 'globe' && selectedMedia === null && previousViewMode.current === 'focused') {
      // Only zoom back out when returning from focused view, not during normal scatter/form
      const initialPos = initialCameraPosition.current

      // Disable OrbitControls during transition
      if (controlsRef.current) {
        controlsRef.current.enabled = false
      }

      const startTime = Date.now()
      const startPos = camera.position.clone()
      const duration = 800 // ms

      const updateCamera = () => {
        if (animationCancelled) return

        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function (ease-in-out)
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2

        camera.position.lerpVectors(startPos, initialPos, eased)
        camera.lookAt(0, 0, 0)

        if (progress < 1 && !animationCancelled) {
          rafId = requestAnimationFrame(updateCamera)
        } else {
          // Re-enable OrbitControls and reset it
          if (controlsRef.current) {
            controlsRef.current.enabled = true
            controlsRef.current.target.set(0, 0, 0)
            controlsRef.current.update()
          }
        }
      }

      rafId = requestAnimationFrame(updateCamera)
    }

    // Track previous view mode
    previousViewMode.current = viewMode

    // Cleanup function to cancel animations
    return () => {
      animationCancelled = true
      if (rafId !== undefined) {
        cancelAnimationFrame(rafId)
      }
      // Re-enable controls on cleanup
      if (controlsRef.current && viewMode === 'globe') {
        controlsRef.current.enabled = true
      }
    }
  }, [viewMode, selectedMedia, camera, onTransitionComplete])

  // Handle user interaction detection
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const handleStart = () => {
      setIsInteracting(true)
      if (onInteractionChange) onInteractionChange(true)
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current)
      }
    }

    const handleEnd = () => {
      // Resume auto-rotation after 2 seconds of inactivity
      interactionTimeoutRef.current = setTimeout(() => {
        setIsInteracting(false)
        if (onInteractionChange) onInteractionChange(false)
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
  }, [onInteractionChange])

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
      {mediaPositions.map((position, index) => {
        const isSelected = selectedMedia?.id === mediaItems[index].id
        const mediaItem = mediaItems[index]
        return (
          <MediaNode
            key={mediaItem.id}
            position={position}
            scatterPosition={scatterPositions[index]}
            formationProgress={formationProgress}
            imageUrl={mediaItem.imageUrl}
            videoUrl={mediaItem.videoUrl}
            isVideo={mediaItem.type === 'video'}
            onMediaClick={() => onMediaClick(mediaItem)}
            isSelected={isSelected}
            viewMode={viewMode}
            highQualityUrl={isSelected ? highQualityUrl : null}
            isMediaLoaded={isSelected ? isMediaLoaded : false}
          />
        )
      })}

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        enableZoom={false}
        autoRotate={!isInteracting && viewMode === 'globe'}
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
