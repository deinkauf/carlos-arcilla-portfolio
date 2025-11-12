import { useRef, useState, useMemo } from 'react'
import { Mesh, Shape, ShapeGeometry, Color } from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { Suspense } from 'react'

interface MediaNodeProps {
  position: [number, number, number]
  imageUrl: string
  isVideo: boolean
  isFocused: boolean
  onMediaClick: () => void
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
function MediaNodeContent({ position, imageUrl, isVideo, isFocused, onMediaClick }: MediaNodeProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Load the image texture
  const texture = useLoader(TextureLoader, imageUrl)

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
        map={texture}
        side={2}
        opacity={hovered ? 1 : 0.95}
        transparent
      />

      {/* Play button overlay for videos */}
      {isVideo && (
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

      {/* Focus indicator border */}
      {isFocused && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[width + 0.08, height + 0.08]} />
          <meshBasicMaterial
            color="#4a9eff"
            transparent
            opacity={0.6}
          />
        </mesh>
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
