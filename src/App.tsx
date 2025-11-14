import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import MediaViewer from './components/MediaViewer'
import { MediaItem, mediaItems } from './data/mediaData'
import { useMediaPreloader } from './hooks/useMediaPreloader'

type ViewMode = 'globe' | 'transitioning' | 'focused'

function App() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('globe')

  // Preload high-quality media when media is selected
  const preloadState = useMediaPreloader(selectedMedia)

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

  const handleNext = () => {
    const nextIndex = (focusedIndex + 1) % mediaItems.length
    setFocusedIndex(nextIndex)
    setSelectedMedia(mediaItems[nextIndex])
    setViewMode('transitioning')
  }

  const handlePrevious = () => {
    const prevIndex = (focusedIndex - 1 + mediaItems.length) % mediaItems.length
    setFocusedIndex(prevIndex)
    setSelectedMedia(mediaItems[prevIndex])
    setViewMode('transitioning')
  }

  const handleClose = () => {
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
        />
      </Canvas>

      {/* Media Viewer Modal */}
      <MediaViewer
        media={selectedMedia}
        onClose={handleClose}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  )
}

export default App
