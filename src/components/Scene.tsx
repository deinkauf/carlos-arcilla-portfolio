import { OrbitControls } from '@react-three/drei'
import MediaNode from './MediaNode'
import { generateSpherePositions, generateGridSpherePositions } from '../utils/sphericalPositions'
import { mediaItems, MediaItem } from '../data/mediaData'

const SPHERE_RADIUS = 2
const MEDIA_COUNT = 15

interface SceneProps {
  mode: 'fibonacci' | 'grid'
  onMediaClick: (media: MediaItem) => void
}

export default function Scene({ mode, onMediaClick }: SceneProps) {
  // Generate positions based on distribution type
  const mediaPositions = mode === 'fibonacci'
    ? generateSpherePositions(MEDIA_COUNT, SPHERE_RADIUS)
    : generateGridSpherePositions(MEDIA_COUNT, SPHERE_RADIUS)

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      {/* Render media nodes with image textures */}
      {mediaPositions.map((position, index) => (
        <MediaNode
          key={index}
          id={mediaItems[index].id}
          position={position}
          imageUrl={mediaItems[index].imageUrl}
          isVideo={mediaItems[index].type === 'video'}
          onMediaClick={() => onMediaClick(mediaItems[index])}
        />
      ))}

      <OrbitControls enableDamping dampingFactor={0.05} enableZoom={false} />
    </>
  )
}
