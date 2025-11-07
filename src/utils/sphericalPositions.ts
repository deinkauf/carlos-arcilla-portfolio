/**
 * Convert spherical coordinates to Cartesian coordinates
 * @param radius - Distance from origin
 * @param theta - Azimuthal angle (0 to 2π)
 * @param phi - Polar angle (0 to π)
 * @returns [x, y, z] coordinates
 */
export function sphericalToCartesian(
  radius: number,
  theta: number,
  phi: number
): [number, number, number] {
  const x = radius * Math.sin(phi) * Math.cos(theta)
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  return [x, y, z]
}

/**
 * Generate evenly distributed positions on a sphere surface using Fibonacci spiral
 * @param count - Number of points to generate
 * @param radius - Sphere radius
 * @returns Array of [x, y, z] positions
 */
export function generateSpherePositions(
  count: number,
  radius: number
): Array<[number, number, number]> {
  const positions: Array<[number, number, number]> = []
  const goldenRatio = (1 + Math.sqrt(5)) / 2
  const angleIncrement = 2 * Math.PI * goldenRatio

  for (let i = 0; i < count; i++) {
    const t = i / count
    const phi = Math.acos(1 - 2 * t)
    const theta = angleIncrement * i

    positions.push(sphericalToCartesian(radius, theta, phi))
  }

  return positions
}

/**
 * Generate positions arranged in a grid pattern (latitude/longitude)
 * @param count - Approximate number of points to generate
 * @param radius - Sphere radius
 * @returns Array of [x, y, z] positions
 */
export function generateGridSpherePositions(
  count: number,
  radius: number
): Array<[number, number, number]> {
  const positions: Array<[number, number, number]> = []

  // Calculate rows and columns to approximate count
  const rows = Math.ceil(Math.sqrt(count * 0.5))
  const cols = Math.ceil(count / rows)

  for (let i = 0; i < rows; i++) {
    // Distribute evenly across latitude (phi from 0 to π)
    const phi = (Math.PI * (i + 1)) / (rows + 1)

    // Calculate how many points on this latitude ring
    const pointsInRing = Math.max(3, Math.round(cols * Math.sin(phi)))

    for (let j = 0; j < pointsInRing; j++) {
      // Distribute evenly around longitude (theta from 0 to 2π)
      const theta = (2 * Math.PI * j) / pointsInRing

      positions.push(sphericalToCartesian(radius, theta, phi))

      // Stop if we've reached desired count
      if (positions.length >= count) {
        return positions
      }
    }
  }

  return positions
}
