import { useState, useEffect, useCallback } from 'react'
import { MediaItem } from '../data/mediaData'

interface PreloadState {
  isLoading: boolean
  isLoaded: boolean
  error: Error | null
  highQualityUrl: string | null
}

export function useMediaPreloader(media: MediaItem | null) {
  const [preloadState, setPreloadState] = useState<PreloadState>({
    isLoading: false,
    isLoaded: false,
    error: null,
    highQualityUrl: null,
  })

  const preloadImage = useCallback((url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(url)
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
      img.src = url
    })
  }, [])

  const preloadVideo = useCallback((url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'auto'

      const handleCanPlay = () => {
        cleanup()
        resolve(url)
      }

      const handleError = () => {
        cleanup()
        reject(new Error(`Failed to load video: ${url}`))
      }

      const cleanup = () => {
        video.removeEventListener('canplaythrough', handleCanPlay)
        video.removeEventListener('error', handleError)
      }

      video.addEventListener('canplaythrough', handleCanPlay)
      video.addEventListener('error', handleError)
      video.src = url
      video.load()
    })
  }, [])

  useEffect(() => {
    if (!media) {
      setPreloadState({
        isLoading: false,
        isLoaded: false,
        error: null,
        highQualityUrl: null,
      })
      return
    }

    const loadMedia = async () => {
      setPreloadState({
        isLoading: true,
        isLoaded: false,
        error: null,
        highQualityUrl: null,
      })

      try {
        let highQualityUrl: string

        if (media.type === 'image') {
          // Replace preview resolution (w=600) with high quality (w=1200)
          highQualityUrl = media.imageUrl.replace('w=600', 'w=1200')
          await preloadImage(highQualityUrl)
        } else {
          // For videos, use the video URL directly
          highQualityUrl = media.videoUrl || media.imageUrl
          await preloadVideo(highQualityUrl)
        }

        setPreloadState({
          isLoading: false,
          isLoaded: true,
          error: null,
          highQualityUrl,
        })
      } catch (error) {
        setPreloadState({
          isLoading: false,
          isLoaded: false,
          error: error as Error,
          highQualityUrl: null,
        })
      }
    }

    loadMedia()
  }, [media, preloadImage, preloadVideo])

  return preloadState
}
