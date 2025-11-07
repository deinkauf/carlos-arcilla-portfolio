# 3D Sphere Portfolio Website - Project Brief

**Client:** Carlos Arcilla
**Project Type:** Interactive 3D Portfolio Website  
**Last Updated:** November 7, 2025

---

## Executive Summary

Build an immersive, interactive 3D sphere-based portfolio website that showcases media content (photos and videos) as an explorable graph-like structure. The sphere acts as a hollow, wireframe globe where each node represents a piece of media that users can interact with through intuitive mouse controls.

**Core Vision:** Create an experience that feels like technology advancement itself - memorable, innovative, and reflective of cutting-edge artistic vision.

---

## Project Concept

### Primary Feature: Interactive 3D Media Sphere

**Visual Structure:**
- Clean white background serving as canvas
- 3D hollow sphere dominating the viewport (60-80% of screen space)
- Wireframe construction using vertices and gridlines
- Graph-like topology where nodes hold media assets
- Media elements (photos/videos) distributed across exterior surface
- Organized layout (not necessarily symmetrical, but intentional)

**Interaction Model (Desktop):**

1. **Navigation:**
   - Click-and-drag functionality
   - Free rotation along X and Y axes
   - Sphere remains centered while rotating based on mouse input
   - Smooth, fluid, responsive controls

2. **Media Interaction:**
   - **Hover State:** 
     - 0.5 second dwell time activates focus
     - Selected node scales up (keyframe animation)
     - Visual emphasis on target media
   - **Click Action:** 
     - Opens/plays selected media
     - Videos playable within the experience
     - Smooth transitions

### Design Philosophy

**Experience Goals:**
- Create "wow factor" first impression
- Feel like an interactive experience, not just a website
- Push boundaries beyond typical portfolio sites
- Reflect artistic focus on technology and innovation
- Communicate brand values passively through the interface

**Technical Approach:**
- Performance optimization for smooth 3D rendering
- Desktop-first, mobile-responsive design
- Clean, modern aesthetic
- Scalable architecture for content updates

---

## Recommended Tech Stack

### Core Technologies

**3D Graphics:**
- **Three.js r181** - Industry-standard 3D library (182KB gzipped, 109k GitHub stars)
- **React Three Fiber (R3F)** - Declarative React renderer for Three.js (300k+ installations)

**Frontend Framework:**
- **React 18** - Component-based architecture with concurrent features
- **Vite** - Build tool (73.3% adoption, instant HMR, minimal config)
- **TypeScript** - Type safety and better developer experience

**Animation:**
- **Primary: Motion One** - Ultra-lightweight (2.6KB), hardware-accelerated
- **Alternative: GSAP** - Industry standard for complex timelines (23.5KB)

**Utilities:**
- **@react-three/drei** - 100+ helper components (OrbitControls, useGLTF, Float, etc.)
- **@react-three/postprocessing** - Visual effects
- **r3f-perf** - Real-time performance monitoring
- **Zustand** - Lightweight state management optimized for R3F

**Styling:**
- **TailwindCSS** - Utility-first CSS framework

**Video Integration:**
- HTML5 Video + THREE.VideoTexture
- Native raycaster for click detection

**Deployment:**
- **Vercel** (recommended) - Optimized for React/Next.js, excellent edge network
- **Alternative: Netlify** - Great for pure static sites
- **CloudFlare CDN** - For 3D assets delivery

### Why This Stack?

1. **Three.js** dominates 3D web graphics:
   - 8.6x lighter than Babylon.js (182KB vs 1.57MB)
   - Massive community (4.4x more GitHub stars)
   - Native support for sphere geometries and wireframes
   - Extensive documentation and tutorials

2. **React Three Fiber** provides:
   - Declarative JSX syntax for 3D scenes
   - Zero abstraction loss from Three.js
   - Component reusability
   - React ecosystem benefits
   - Better performance than vanilla Three.js at scale

3. **Motion One** offers:
   - Smallest bundle size for animations
   - Hardware acceleration
   - 2.5x faster than GSAP for certain operations
   - Perfect for smooth sphere rotation and hover effects

---

## Technical Implementation Details

### Sphere Construction

```javascript
// Wireframe hollow sphere using Three.js
const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
const wireframe = new THREE.WireframeGeometry(geometry);
const material = new THREE.LineBasicMaterial({ color: 0x000000 });
const sphere = new THREE.LineSegments(wireframe, material);
```

### Media Node Positioning

**Approach:** Convert spherical coordinates to Cartesian for node placement
- Calculate evenly distributed positions using spherical geometry
- Or use custom layout algorithm for artistic arrangement
- Convert (radius, theta, phi) → (x, y, z) coordinates

### Interaction Pattern

1. **Rotation:**
   - Use `OrbitControls` from drei with damping enabled
   - Constrain to X/Y rotation, disable zoom if desired
   - Smooth momentum-based rotation

2. **Hover Detection:**
   - Implement raycaster with throttling (50-100ms intervals)
   - Convert mouse coordinates to normalized device coordinates
   - Check intersections with media node geometries
   - Trigger scale animation on hover

3. **Video Playback:**
   - Create hidden HTML5 video elements
   - Apply as VideoTexture to node materials
   - Use raycaster click detection to toggle play/pause
   - Update texture only when video is playing

### Performance Optimization

**Critical Targets:**
- Initial load: < 3 seconds on 3G
- Frame rate: 60fps desktop, 30fps mobile
- Draw calls: < 100
- Visible triangles: < 500k
- Max texture resolution: 2K with compression

**Techniques:**
1. **Level of Detail (LOD):**
   - High-detail models within 50 units
   - Medium-detail at 50-200 units
   - Low-detail beyond 200 units

2. **Texture Optimization:**
   - Use Basis Universal for compression
   - Power-of-two dimensions (512, 1024, 2048)
   - Enable mipmaps
   - Reduce mobile texture resolution by 50%

3. **Bundle Optimization:**
   - Tree-shake Three.js imports
   - Dynamic imports for 3D components
   - Route-based code splitting
   - Lazy-load off-screen content

4. **Rendering:**
   - Enable frustum culling (automatic)
   - Batch geometries with shared materials
   - Use InstancedMesh for repeated objects
   - Implement object pooling for raycasting

---

## Development Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install Three.js and React Three Fiber
- [ ] Create basic scene with camera and renderer
- [ ] Implement wireframe sphere with adjustable parameters
- [ ] Add OrbitControls for rotation
- [ ] Configure responsive canvas sizing

### Phase 2: Media Node System (Week 2)
- [ ] Calculate spherical positions for media nodes
- [ ] Convert coordinates and place placeholder geometries
- [ ] Implement raycaster for click detection
- [ ] Add hover effects with scale animations
- [ ] Create 2D UI overlay for selected media
- [ ] Test interaction patterns

### Phase 3: Video & Animation (Week 3)
- [ ] Integrate HTML5 video with VideoTexture
- [ ] Implement click-to-play functionality
- [ ] Add smooth state transition animations
- [ ] Create loading states with progress indicators
- [ ] Optimize video resolution and compression
- [ ] Test mobile touch interactions

### Phase 4: Optimization & Polish (Week 4)
- [ ] Implement LOD system for media nodes
- [ ] Add texture compression
- [ ] Lazy load off-screen content
- [ ] Optimize bundle size via code splitting
- [ ] Configure CDN and caching headers
- [ ] Deploy to Vercel/Netlify
- [ ] Performance testing on target devices
- [ ] Accessibility audit and keyboard navigation

---

## Reference Resources

### Starter Templates

1. **adrianhajdin/threejs-portfolio** (GitHub)
   - Production-quality R3F implementation
   - Includes 3D globe with location pinpointing
   - Video textures on 3D models
   - Fully responsive
   - MIT license

2. **vasturiano/react-globe.gl**
   - Purpose-built globe visualization (32k downloads/week)
   - Points, arcs, polygons support
   - Custom materials and atmospheres

3. **AndrewSkea/react-3d-cms-website**
   - React globe with Contentful CMS integration
   - Content-managed sphere portfolio pattern

### Production Examples

- **hamishw.com** (HamishMW/portfolio)
  - DisplacementSphere with custom shaders
  - Remix framework
  - Framer Motion animations
  - Professional design patterns

### Learning Resources

- Three.js Documentation: https://threejs.org/docs/
- React Three Fiber Docs: https://docs.pmnd.rs/react-three-fiber/
- Discover Three.js: https://discoverthreejs.com/
- Three.js Journey (course): https://threejs-journey.com/

---

## Alternative Tech Stacks

### For Vue Developers
- **Vue 3 + TresJS** (@tresjs/core, @tresjs/cientos)
- Nuxt for SSR capabilities
- Similar declarative syntax
- Pinia for state management

### For Svelte Developers
- **Svelte + Threlte** (@threlte/core, @threlte/extras)
- Smallest bundle sizes
- "Best API and devX" according to Theatre.js creator
- Physics, animation studio, VR/AR support included

### For Maximum Control
- **Vanilla Three.js + GSAP**
- Direct WebGL access
- Framework independence
- Manual scene graph management
- Best for specialized use cases

---

## Project Deliverables

1. **Fully interactive 3D sphere portfolio**
   - Smooth rotation and navigation
   - Hover effects on media nodes
   - Click-to-play video functionality

2. **Responsive design**
   - Desktop-optimized experience
   - Mobile-friendly fallbacks
   - Touch interaction support

3. **Performance-optimized**
   - Fast initial load
   - Consistent 60fps on desktop
   - Optimized assets and code

4. **Scalable content system**
   - Easy to add/remove media nodes
   - Configurable sphere parameters
   - Maintainable codebase

5. **Production deployment**
   - Hosted on Vercel/Netlify
   - CDN-delivered assets
   - SEO optimization

---

## Success Criteria

**User Experience:**
- ✓ Creates memorable first impression
- ✓ Intuitive navigation without instructions
- ✓ Smooth, fluid interactions
- ✓ Professional, polished appearance

**Technical Performance:**
- ✓ < 3 second initial load
- ✓ 60fps on modern desktop browsers
- ✓ 30fps minimum on mobile devices
- ✓ Accessible via keyboard navigation

**Brand Alignment:**
- ✓ Reflects innovation and technology focus
- ✓ Stands out from typical portfolios
- ✓ Showcases technical capabilities
- ✓ Professional portfolio piece

---

## Next Steps

1. **Review and approve** project brief and tech stack
2. **Set up development environment** with recommended tools
3. **Start with Phase 1** foundation work
4. **Iterate on design** as implementation progresses
5. **Gather reference materials** and inspiration
6. **Define content strategy** for media nodes
7. **Establish communication rhythm** for feedback loops

---

## Notes

- VERY IMPORTANT: Start simple and iterate - polished simplicity > janky complexity
- Test on real devices early to catch WebGL quirks
- Leverage existing templates and patterns
- Prioritize mobile optimization from day one
- Keep performance monitoring active throughout development
- Document any deviations from the plan

---

**Project Vision:** "An immersive technological experience that reflects my artistic push toward innovation - not just a website, but a statement."
