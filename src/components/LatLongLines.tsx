import { useMemo } from 'react'
import { BufferGeometry, BufferAttribute } from 'three'

interface LatLongLinesProps {
  radius: number
  latitudeCount?: number
  longitudeCount?: number
  color?: string
  opacity?: number
}

export default function LatLongLines({
  radius,
  latitudeCount = 5,
  longitudeCount = 8,
  color = '#cccccc',
  opacity = 0.3
}: LatLongLinesProps) {
  const geometry = useMemo(() => {
    const geo = new BufferGeometry()
    const vertices: number[] = []
    const segments = 64 // Resolution for smooth circles

    // Draw latitude lines (horizontal circles)
    for (let lat = 1; lat < latitudeCount; lat++) {
      const phi = (Math.PI * lat) / latitudeCount
      const circleRadius = radius * Math.sin(phi)
      const y = radius * Math.cos(phi)

      for (let i = 0; i <= segments; i++) {
        const theta = (2 * Math.PI * i) / segments
        const x = circleRadius * Math.cos(theta)
        const z = circleRadius * Math.sin(theta)

        vertices.push(x, y, z)

        if (i < segments) {
          const nextTheta = (2 * Math.PI * (i + 1)) / segments
          const nextX = circleRadius * Math.cos(nextTheta)
          const nextZ = circleRadius * Math.sin(nextTheta)
          vertices.push(nextX, y, nextZ)
        }
      }
    }

    // Draw longitude lines (vertical meridians)
    for (let lon = 0; lon < longitudeCount; lon++) {
      const theta = (2 * Math.PI * lon) / longitudeCount

      for (let i = 0; i <= segments; i++) {
        const phi = (Math.PI * i) / segments
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.cos(phi)
        const z = radius * Math.sin(phi) * Math.sin(theta)

        vertices.push(x, y, z)

        if (i < segments) {
          const nextPhi = (Math.PI * (i + 1)) / segments
          const nextX = radius * Math.sin(nextPhi) * Math.cos(theta)
          const nextY = radius * Math.cos(nextPhi)
          const nextZ = radius * Math.sin(nextPhi) * Math.sin(theta)
          vertices.push(nextX, nextY, nextZ)
        }
      }
    }

    geo.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(vertices), 3)
    )

    return geo
  }, [radius, latitudeCount, longitudeCount])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  )
}
