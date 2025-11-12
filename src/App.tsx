import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import MediaViewer from './components/MediaViewer'
import { MediaItem, mediaItems } from './data/mediaData'

function App() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [focusedIndex, setFocusedIndex] = useState(0)

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
  }

  const handlePrevious = () => {
    const prevIndex = (focusedIndex - 1 + mediaItems.length) % mediaItems.length
    setFocusedIndex(prevIndex)
    setSelectedMedia(mediaItems[prevIndex])
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
          }}
          focusedIndex={focusedIndex}
        />
      </Canvas>

      {/* Media Viewer Modal */}
      <MediaViewer
        media={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  )
}

export default App
