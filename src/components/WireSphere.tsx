import { useRef } from 'react'
import { Mesh } from 'three'

interface WireSphereProps {
  radius?: number
  widthSegments?: number
  heightSegments?: number
}

export default function WireSphere({
  radius = 2,
  widthSegments = 32,
  heightSegments = 32
}: WireSphereProps) {
  const meshRef = useRef<Mesh>(null)

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, widthSegments, heightSegments]} />
      <meshBasicMaterial color="#000000" wireframe />
    </mesh>
  )
}
