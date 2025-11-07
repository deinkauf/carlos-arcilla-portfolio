import { useMemo } from 'react'
import { BufferGeometry, BufferAttribute } from 'three'

interface EdgeLinesProps {
  positions: Array<[number, number, number]>
  edges: Array<[number, number]>
  color?: string
  lineWidth?: number
}

export default function EdgeLines({
  positions,
  edges,
  color = '#000000',
  lineWidth = 1
}: EdgeLinesProps) {
  const geometry = useMemo(() => {
    const geo = new BufferGeometry()
    const vertices: number[] = []

    // Create line segments for each edge
    edges.forEach(([fromIdx, toIdx]) => {
      const from = positions[fromIdx]
      const to = positions[toIdx]

      // Add both vertices of the line segment
      vertices.push(from[0], from[1], from[2])
      vertices.push(to[0], to[1], to[2])
    })

    geo.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(vertices), 3)
    )

    return geo
  }, [positions, edges])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} linewidth={lineWidth} />
    </lineSegments>
  )
}
