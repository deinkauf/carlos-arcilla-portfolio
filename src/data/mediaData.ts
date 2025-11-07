// Placeholder scenic/aesthetic images from Unsplash
// Using specific image IDs for consistent, beautiful imagery

export interface MediaItem {
  id: string
  imageUrl: string
  title: string
  type: 'image' | 'video'
  videoUrl?: string
}

export const mediaItems: MediaItem[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', // Mountain landscape
    title: 'Mountain Vista',
    type: 'image'
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600', // Forest nature
    title: 'Forest Path',
    type: 'image'
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600', // Lake sunset
    title: 'Lakeside Sunset',
    type: 'image'
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=600', // Ocean waves
    title: 'Ocean Waves',
    type: 'image'
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600', // Misty mountains
    title: 'Misty Mountains',
    type: 'image'
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600', // Desert landscape
    title: 'Desert Dunes',
    type: 'image'
  },
  {
    id: '7',
    imageUrl: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600', // Coastal cliffs
    title: 'Coastal Cliffs',
    type: 'image'
  },
  {
    id: '8',
    imageUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600', // Northern lights
    title: 'Aurora Sky',
    type: 'image'
  },
  {
    id: '9',
    imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600', // Tropical beach
    title: 'Tropical Paradise',
    type: 'image'
  },
  {
    id: '10',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', // Canyon
    title: 'Canyon View',
    type: 'image'
  },
  {
    id: '11',
    imageUrl: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=600', // Waterfall thumbnail
    title: 'Waterfall Motion',
    type: 'video',
    videoUrl: 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4'
  },
  {
    id: '12',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600', // Snowy peaks
    title: 'Snowy Peaks',
    type: 'image'
  },
  {
    id: '13',
    imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600', // Prairie sunset
    title: 'Prairie Sunset',
    type: 'image'
  },
  {
    id: '14',
    imageUrl: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600', // Mountain lake thumbnail
    title: 'Ocean Sunset',
    type: 'video',
    videoUrl: 'https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4'
  },
  {
    id: '15',
    imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600', // Countryside
    title: 'Countryside',
    type: 'image'
  }
]
