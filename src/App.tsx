import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import MediaViewer from './components/MediaViewer'
import { MediaItem } from './data/mediaData'

type DemoMode = 'fibonacci' | 'grid'

function App() {
  const [mode, setMode] = useState<DemoMode>('fibonacci')
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        position: 'relative'
      }}
    >
      {/* Navigation */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          gap: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '10px 20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <button
          onClick={() => setMode('fibonacci')}
          style={{
            padding: '10px 20px',
            backgroundColor: mode === 'fibonacci' ? '#000' : '#fff',
            color: mode === 'fibonacci' ? '#fff' : '#000',
            border: '1px solid #000',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: mode === 'fibonacci' ? 'bold' : 'normal',
            fontSize: '14px'
          }}
        >
          Fibonacci Distribution
        </button>
        <button
          onClick={() => setMode('grid')}
          style={{
            padding: '10px 20px',
            backgroundColor: mode === 'grid' ? '#000' : '#fff',
            color: mode === 'grid' ? '#fff' : '#000',
            border: '1px solid #000',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: mode === 'grid' ? 'bold' : 'normal',
            fontSize: '14px'
          }}
        >
          Grid Distribution
        </button>
      </div>

      {/* Info text */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '10px 20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          fontSize: '14px',
          textAlign: 'center'
        }}
      >
        <strong>{mode === 'fibonacci' ? 'Fibonacci' : 'Grid'} Distribution</strong>
        <br />
        15 square thumbnails • {mode === 'fibonacci' ? 'Organic spiral pattern' : 'Latitude/longitude rows'} • Drag to rotate
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 75
        }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Scene mode={mode} onMediaClick={setSelectedMedia} />
      </Canvas>

      {/* Media Viewer Modal */}
      <MediaViewer
        media={selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />
    </div>
  )
}

export default App
