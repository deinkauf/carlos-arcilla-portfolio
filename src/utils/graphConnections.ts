/**
 * Calculate Euclidean distance between two 3D points
 */
function distance(
  p1: [number, number, number],
  p2: [number, number, number]
): number {
  const dx = p1[0] - p2[0]
  const dy = p1[1] - p2[1]
  const dz = p1[2] - p2[2]
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * Connect each node to its K nearest neighbors
 * Returns array of [fromIndex, toIndex] pairs
 */
export function connectNearestNeighbors(
  positions: Array<[number, number, number]>,
  k: number = 4
): Array<[number, number]> {
  const edges = new Set<string>()

  positions.forEach((pos, i) => {
    // Calculate distances to all other nodes
    const distances = positions
      .map((otherPos, j) => ({
        index: j,
        distance: i === j ? Infinity : distance(pos, otherPos)
      }))
      .sort((a, b) => a.distance - b.distance)

    // Connect to K nearest neighbors
    for (let n = 0; n < k && n < distances.length; n++) {
      const j = distances[n].index
      // Store edge in sorted order to avoid duplicates
      const edgeKey = i < j ? `${i}-${j}` : `${j}-${i}`
      edges.add(edgeKey)
    }
  })

  // Convert set to array of tuples
  return Array.from(edges).map(key => {
    const [a, b] = key.split('-').map(Number)
    return [a, b] as [number, number]
  })
}

/**
 * Create a geodesic sphere (icosphere) topology
 * This creates an icosahedron and projects vertices onto sphere
 */
export function connectGeodesic(
  positions: Array<[number, number, number]>
): Array<[number, number]> {
  // For a proper geodesic sphere, we need specific vertex positions
  // Since we're given arbitrary positions, we'll connect based on
  // icosphere-like topology: each vertex connects to 6-7 neighbors
  // forming triangular faces

  const edges = new Set<string>()
  const targetConnections = 7 // Increased for more globe-like appearance

  positions.forEach((pos, i) => {
    // Find the 7 nearest neighbors to create icosphere-like structure
    const distances = positions
      .map((otherPos, j) => ({
        index: j,
        distance: i === j ? Infinity : distance(pos, otherPos)
      }))
      .sort((a, b) => a.distance - b.distance)

    for (let n = 0; n < targetConnections && n < distances.length; n++) {
      const j = distances[n].index
      const edgeKey = i < j ? `${i}-${j}` : `${j}-${i}`
      edges.add(edgeKey)
    }
  })

  return Array.from(edges).map(key => {
    const [a, b] = key.split('-').map(Number)
    return [a, b] as [number, number]
  })
}

/**
 * Simplified Delaunay-like triangulation
 * Connects nodes to form well-distributed triangles
 */
export function connectDelaunay(
  positions: Array<[number, number, number]>
): Array<[number, number]> {
  const edges = new Set<string>()

  // Simple approach: for each node, connect to 5-6 nearest neighbors
  // ensuring good triangle formation
  positions.forEach((pos, i) => {
    const neighbors = positions
      .map((otherPos, j) => ({
        index: j,
        distance: i === j ? Infinity : distance(pos, otherPos),
        position: otherPos
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 8) // Consider 8 nearest neighbors

    // Connect to first 5-6 neighbors to form triangles
    for (let n = 0; n < 6 && n < neighbors.length; n++) {
      const j = neighbors[n].index
      const edgeKey = i < j ? `${i}-${j}` : `${j}-${i}`
      edges.add(edgeKey)
    }
  })

  return Array.from(edges).map(key => {
    const [a, b] = key.split('-').map(Number)
    return [a, b] as [number, number]
  })
}
