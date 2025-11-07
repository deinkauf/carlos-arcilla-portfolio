# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive 3D sphere-based portfolio website for Carlos Arcilla. An immersive experience where media content (photos/videos) is displayed as nodes on a rotating 3D wireframe sphere. The goal is to create a memorable, innovative experience that reflects cutting-edge artistic vision.

**Core Philosophy:** Start simple and iterate - polished simplicity > janky complexity

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **3D Graphics:** Three.js + React Three Fiber (R3F)
- **Animation:** Motion One (primary, 2.6KB) or GSAP (for complex timelines)
- **Utilities:** @react-three/drei, @react-three/postprocessing, r3f-perf
- **State:** Zustand (lightweight, optimized for R3F)
- **Styling:** TailwindCSS
- **Deployment:** Vercel (recommended)

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint
npm run lint
```

## Architecture Overview

### 3D Scene Structure
- **Wireframe Sphere:** Hollow sphere using `THREE.SphereGeometry` + `THREE.WireframeGeometry`
- **Media Nodes:** Positioned using spherical coordinates converted to Cartesian (x, y, z)
- **Interaction:** OrbitControls for rotation, raycaster for hover/click detection
- **Video Integration:** HTML5 video + `THREE.VideoTexture` for media nodes

### Key Interactions
1. **Rotation:** Click-and-drag using OrbitControls with damping
2. **Hover:** 0.5s dwell time triggers scale-up animation via raycaster
3. **Click:** Opens/plays media content

### Performance Targets
- Initial load: < 3 seconds on 3G
- Frame rate: 60fps desktop, 30fps mobile
- Draw calls: < 100
- Visible triangles: < 500k
- Max texture resolution: 2K with compression

## Development Approach

### Start Simple
- Begin with basic wireframe sphere and rotation
- Add media nodes as simple geometries first
- Implement basic interactions before polish
- Iterate incrementally with testing

### Performance First
- Enable frustum culling (automatic in Three.js)
- Use InstancedMesh for repeated objects
- Lazy-load off-screen content
- Compress textures (Basis Universal, power-of-two dimensions)
- Tree-shake Three.js imports
- Dynamic imports for 3D components

### Code Organization
- Keep components declarative using R3F patterns
- Separate 3D scene logic from UI components
- Use Zustand for shared state (camera, selected media, etc.)
- Extract reusable helpers (spherical coordinate conversion, raycaster setup)

## Important Implementation Details

### Sphere Construction
```javascript
const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
const wireframe = new THREE.WireframeGeometry(geometry);
const material = new THREE.LineBasicMaterial({ color: 0x000000 });
const sphere = new THREE.LineSegments(wireframe, material);
```

### Media Node Positioning
Convert spherical coordinates to Cartesian for intentional (not random) layout:
- Calculate evenly distributed positions using spherical geometry
- Convert (radius, theta, phi) → (x, y, z) coordinates

### Raycaster Pattern
- Throttle raycaster checks to 50-100ms intervals
- Convert mouse to normalized device coordinates
- Check intersections with media node geometries only
- Trigger animations on state change

## Reference Resources

See PROJECT_BRIEF.md for:
- Detailed technical specifications
- Reference implementations (adrianhajdin/threejs-portfolio, hamishw.com)
- Learning resources (Three.js Journey, Discover Three.js)
- Development roadmap and phases

## Key Constraints

- Desktop-first, mobile-responsive
- Clean white background with black wireframe
- Sphere occupies 60-80% of screen space
- Smooth, fluid interactions without jank
- Scalable content system for easy media updates
