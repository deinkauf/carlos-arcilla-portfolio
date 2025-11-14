import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import FocusedControls from './components/FocusedControls'
import { MediaItem, mediaItems } from './data/mediaData'
import { useMediaPreloader } from './hooks/useMediaPreloader'

type ViewMode = 'globe' | 'transitioning' | 'focused'

function App() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('globe')
  const [formationProgress, setFormationProgress] = useState(0) // 0 = scattered, 1 = fully formed

  // Preload high-quality media when media is selected
  const preloadState = useMediaPreloader(selectedMedia)

  // Mouse velocity tracking
  const lastMousePos = useRef({ x: 0, y: 0 })
  const lastMouseTime = useRef(Date.now())
  const velocityAccumulator = useRef(0)

  // Mouse distance tracking for globe formation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now()

      // Calculate distance moved
      const dx = e.clientX - lastMousePos.current.x
      const dy = e.clientY - lastMousePos.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Accumulate distance traveled (total pixels moved)
      // Each 1000 pixels moved = 0.1 formation progress (10000 pixels total for full formation)
      velocityAccumulator.current += distance / 10000

      // Clamp accumulator between 0 and 1
      velocityAccumulator.current = Math.min(velocityAccumulator.current, 1)

      // Update formation progress
      setFormationProgress(velocityAccumulator.current)

      // Update tracking refs
      lastMousePos.current = { x: e.clientX, y: e.clientY }
      lastMouseTime.current = currentTime
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Formation decay when mouse is idle
  useEffect(() => {
    const decayInterval = setInterval(() => {
      // Only decay when in globe view (not during transitions or focused view)
      if (viewMode === 'globe') {
        const now = Date.now()
        const timeSinceLastMove = now - lastMouseTime.current

        // Grace period: 5 seconds of no movement before decay starts
        const GRACE_PERIOD = 5000

        if (timeSinceLastMove > GRACE_PERIOD) {
          // Decay formation progress (faster decay)
          velocityAccumulator.current = Math.max(velocityAccumulator.current - 0.01, 0)
          setFormationProgress(velocityAccumulator.current)
        }
      }
    }, 50) // Check every 50ms

    return () => clearInterval(decayInterval)
  }, [viewMode])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with media viewer keyboard controls
      if (selectedMedia) return

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((prev) => (prev + 1) % mediaItems.length)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)
          break
        case 'Enter':
          e.preventDefault()
          setSelectedMedia(mediaItems[focusedIndex])
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedMedia, focusedIndex])

  const [triggerZoomOut, setTriggerZoomOut] = useState(false)

  const handleClose = () => {
    setTriggerZoomOut(true)
    setViewMode('globe')
    setSelectedMedia(null)
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        position: 'relative'
      }}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 75
        }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Scene
          onMediaClick={(media) => {
            setSelectedMedia(media)
            const index = mediaItems.findIndex(item => item.id === media.id)
            if (index !== -1) setFocusedIndex(index)
            setViewMode('transitioning')
          }}
          selectedMedia={selectedMedia}
          viewMode={viewMode}
          onTransitionComplete={() => setViewMode('focused')}
          highQualityUrl={preloadState.highQualityUrl}
          isMediaLoaded={preloadState.isLoaded}
          formationProgress={formationProgress}
          triggerZoomOut={triggerZoomOut}
          onZoomOutComplete={() => setTriggerZoomOut(false)}
          onInteractionChange={(isInteracting) => {
            // Reset mouse idle timer when user interacts with OrbitControls
            if (isInteracting) {
              lastMouseTime.current = Date.now()
            }
          }}
        />
      </Canvas>

      {/* Focused view controls - Only show in focused mode */}
      {viewMode === 'focused' && (
        <FocusedControls
          onClose={handleClose}
        />
      )}
    </div>
  )
}

export default App
