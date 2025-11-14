/**
 * Generates random scattered positions in 3D space for the initial formation state
 * Positions are distributed within a bounding box around the sphere
 */

export function generateScatterPositions(
  count: number,
  sphereRadius: number
): [number, number, number][] {
  const positions: [number, number, number][] = []

  // Define bounding box relative to sphere radius
  // Scatter area is 3x the sphere radius in each dimension
  const boundingSize = sphereRadius * 3

  for (let i = 0; i < count; i++) {
    // Generate random position in 3D space
    const x = (Math.random() - 0.5) * boundingSize * 2
    const y = (Math.random() - 0.5) * boundingSize * 2
    const z = (Math.random() - 0.5) * boundingSize * 2

    positions.push([x, y, z])
  }

  return positions
}
