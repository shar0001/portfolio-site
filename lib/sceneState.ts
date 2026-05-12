export const sceneState = {
  scrollProgress: 0,
  activeRoute: '/' as string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  objectGroupRef: null as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pointLightRef: null as any,
}

export const ROUTE_CONFIGS: Record<string, {
  camera: { x: number; y: number; z: number }
  object: { x: number; y: number; z: number }
  scale: number
  lightColor: { r: number; g: number; b: number }
}> = {
  '/': {
    camera: { x: 0, y: 0, z: 6 },
    object: { x: 2.8, y: 0.2, z: 0 },
    scale: 1,
    lightColor: { r: 0.506, g: 0.549, b: 0.973 }, // #818cf8
  },
  '/movie': {
    camera: { x: -5, y: 0, z: 9 },
    object: { x: -0.5, y: 0.3, z: 0 },
    scale: 1.6,
    lightColor: { r: 0.231, g: 0.510, b: 0.965 }, // #3b82f6
  },
  '/apps': {
    camera: { x: 5, y: 1.5, z: 5 },
    object: { x: 4.0, y: 0.5, z: 0 },
    scale: 0.75,
    lightColor: { r: 0.486, g: 0.227, b: 0.929 }, // #7c3aed
  },
  '/model': {
    camera: { x: 0, y: -0.5, z: 3.8 },
    object: { x: 0.5, y: -0.3, z: 0 },
    scale: 1.3,
    lightColor: { r: 0.957, g: 0.247, b: 0.369 }, // #f43f5e
  },
}
