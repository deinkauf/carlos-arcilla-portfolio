import { useEffect } from 'react'
import { MediaItem } from '../data/mediaData'

interface MediaViewerProps {
  media: MediaItem | null
  onClose: () => void
}

export default function MediaViewer({ media, onClose }: MediaViewerProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (media) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [media, onClose])

  if (!media) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '40px'
      }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          fontSize: '24px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          zIndex: 1001
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
        }}
      >
        ×
      </button>

      {/* Media content */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        {media.type === 'video' && media.videoUrl ? (
          <video
            src={media.videoUrl}
            controls
            autoPlay
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(90vh - 80px)',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
            }}
          />
        ) : (
          <img
            src={media.imageUrl.replace('w=600', 'w=1200')}
            alt={media.title}
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(90vh - 80px)',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
            }}
          />
        )}

        {/* Title */}
        <div
          style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '500',
            textAlign: 'center'
          }}
        >
          {media.title}
        </div>
      </div>
    </div>
  )
}
