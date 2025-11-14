import { useRef, useState, useMemo, useEffect } from 'react'
import { Mesh, Shape, ShapeGeometry } from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { Suspense } from 'react'
import * as THREE from 'three'

type ViewMode = 'globe' | 'transitioning' | 'focused'

interface MediaNodeProps {
  position: [number, number, number]
  imageUrl: string
  videoUrl?: string
  isVideo: boolean
  onMediaClick: () => void
  isSelected?: boolean
  viewMode: ViewMode
  highQualityUrl: string | null
  isMediaLoaded: boolean
}

// Loading placeholder component
function LoadingPlaceholder({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      // Keep the plane oriented to face outward from sphere
      meshRef.current.lookAt(
        position[0] * 2,
        position[1] * 2,
        position[2] * 2
      )
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[0.6, 0.6]} />
      <meshStandardMaterial color="#e0e0e0" opacity={0.6} transparent />
    </mesh>
  )
}

// Actual media node with texture
function MediaNodeContent({
  position,
  imageUrl,
  videoUrl,
  isVideo,
  onMediaClick,
  isSelected = false,
  viewMode,
  highQualityUrl,
  isMediaLoaded
}: MediaNodeProps) {
  const meshRef = useRef<Mesh>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [hovered, setHovered] = useState(false)
  const [videoTexture, setVideoTexture] = useState<any>(null)

  // Determine which URL to use for texture
  const textureUrl = (viewMode === 'focused' && isSelected && isMediaLoaded && highQualityUrl && !isVideo)
    ? highQualityUrl
    : imageUrl

  // Load the image texture
  const texture = useLoader(TextureLoader, textureUrl)

  // Handle video texture creation
  useEffect(() => {
    if (isVideo && viewMode === 'focused' && isSelected && videoUrl) {
      const video = document.createElement('video')
      video.src = videoUrl
      video.crossOrigin = 'anonymous'
      video.loop = true
      video.muted = false
      video.playsInline = true

      video.addEventListener('loadeddata', () => {
        const texture = new THREE.VideoTexture(video)
        setVideoTexture(texture)
        video.play()
      })

      videoRef.current = video

      return () => {
        video.pause()
        video.src = ''
        videoRef.current = null
        setVideoTexture(null)
      }
    }
  }, [isVideo, viewMode, isSelected, videoUrl])

  // Calculate opacity based on selection state and view mode
  const getOpacity = () => {
    if (viewMode === 'globe') {
      return hovered ? 1 : 0.95
    }
    // During transition or focused, dim non-selected nodes
    if (isSelected) {
      return 1
    }
    return 0.3 // Dim non-selected nodes
  }

  // Use video texture if available, otherwise use image texture
  const activeTexture = (isVideo && videoTexture) ? videoTexture : texture

  // Smooth scale animation
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.3 : 1
      meshRef.current.scale.lerp(
        { x: targetScale, y: targetScale, z: targetScale } as any,
        0.1
      )

      // Keep the plane oriented to face outward from sphere
      meshRef.current.lookAt(
        position[0] * 2,
        position[1] * 2,
        position[2] * 2
      )
    }
  })

  // Calculate aspect ratio from texture
  const aspectRatio = texture.image ? texture.image.width / texture.image.height : 1
  const baseSize = 0.6 // Increased base size
  const width = aspectRatio >= 1 ? baseSize : baseSize * aspectRatio
  const height = aspectRatio >= 1 ? baseSize / aspectRatio : baseSize

  // Create flat triangle shape for play button
  const triangleGeometry = useMemo(() => {
    const shape = new Shape()
    shape.moveTo(-0.02, 0.04)
    shape.lineTo(-0.02, -0.04)
    shape.lineTo(0.05, 0)
    shape.lineTo(-0.02, 0.04)
    return new ShapeGeometry(shape)
  }, [])

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        onMediaClick()
      }}
    >
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={activeTexture}
        side={2}
        opacity={getOpacity()}
        transparent
      />

      {/* Play button overlay for videos - only show in globe view */}
      {isVideo && viewMode === 'globe' && (
        <group position={[0, 0, 0.01]}>
          <mesh>
            <circleGeometry args={[0.12, 32]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={hovered ? 0.95 : 0.8}
            />
          </mesh>
          {/* Play triangle - flat shape */}
          <mesh position={[0, 0, 0.001]} geometry={triangleGeometry}>
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>
      )}
    </mesh>
  )
}

// Main export with Suspense wrapper
export default function MediaNode(props: MediaNodeProps) {
  return (
    <Suspense fallback={<LoadingPlaceholder position={props.position} />}>
      <MediaNodeContent {...props} />
    </Suspense>
  )
}
