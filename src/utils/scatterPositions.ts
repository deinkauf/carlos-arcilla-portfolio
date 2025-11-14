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
  // Keep scatter area smaller (1.5x) to ensure nodes stay in camera view
  const boundingSize = sphereRadius * 1.5

  for (let i = 0; i < count; i++) {
    // Generate random position in 3D space within visible bounds
    const x = (Math.random() - 0.5) * boundingSize * 2
    const y = (Math.random() - 0.5) * boundingSize * 2
    // Keep Z closer to camera (less depth variation)
    const z = (Math.random() - 0.5) * boundingSize * 1.5

    positions.push([x, y, z])
  }

  return positions
}
