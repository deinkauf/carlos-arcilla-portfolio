import { useEffect, useState } from 'react'
import { MediaItem } from '../data/mediaData'

interface MediaViewerProps {
  media: MediaItem | null
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
}

export default function MediaViewer({ media, onClose, onNext, onPrevious }: MediaViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  // Reset loading state when media changes
  useEffect(() => {
    if (media) {
      setIsLoading(true)
    }
  }, [media])

  // Handle touch swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && onNext) {
      onNext()
    } else if (isRightSwipe && onPrevious) {
      onPrevious()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!media) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowRight':
          e.preventDefault()
          onNext?.()
          break
        case 'ArrowLeft':
          e.preventDefault()
          onPrevious?.()
          break
      }
    }

    if (media) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [media, onClose, onNext, onPrevious])

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
        padding: '20px'
      }}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
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

      {/* Previous button */}
      {onPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrevious()
          }}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
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
          ‹
        </button>
      )}

      {/* Next button */}
      {onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
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
          ›
        </button>
      )}

      {/* Media content */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          position: 'relative'
        }}
      >
        {/* Loading spinner */}
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '48px',
              height: '48px',
              border: '4px solid rgba(255, 255, 255, 0.2)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
        )}

        {media.type === 'video' && media.videoUrl ? (
          <video
            src={media.videoUrl}
            controls
            autoPlay
            onLoadedData={() => setIsLoading(false)}
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(90vh - 80px)',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.3s'
            }}
          />
        ) : (
          <img
            src={media.imageUrl.replace('w=600', 'w=1200')}
            alt={media.title}
            onLoad={() => setIsLoading(false)}
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(90vh - 80px)',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.3s'
            }}
          />
        )}

        {/* Title */}
        <div
          style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '500',
            textAlign: 'center',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s'
          }}
        >
          {media.title}
        </div>
      </div>
    </div>
  )
}
