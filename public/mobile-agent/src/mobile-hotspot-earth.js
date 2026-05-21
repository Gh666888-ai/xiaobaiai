const THREE_LOCAL = '../vendor/three/three.module.js'
const THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'
const THREE_CDN_FALLBACK = 'https://unpkg.com/three@0.160.0/build/three.module.js'

const TEX = {
  earth: '../assets/earth/earth_atmos_2048.jpg',
  normal: '../assets/earth/earth_normal_2048.jpg',
  specular: '../assets/earth/earth_specular_2048.jpg',
  clouds: '../assets/earth/earth_clouds_2048.png',
}

const HOTSPOT_COORDS = [
  { lat: 39.9, lon: 116.4 },
  { lat: 31.2, lon: 121.5 },
  { lat: 22.5, lon: 114.1 },
  { lat: 40.7, lon: -74.0 },
  { lat: 51.5, lon: -0.1 },
  { lat: 48.9, lon: 2.3 },
  { lat: 35.7, lon: 139.7 },
  { lat: -33.9, lon: 151.2 },
  { lat: 55.8, lon: 37.6 },
  { lat: 19.4, lon: -99.1 },
  { lat: -23.5, lon: -46.6 },
  { lat: 28.6, lon: 77.2 },
]

let THREE = null

async function loadThree() {
  if (THREE) return THREE
  try {
    THREE = await import(THREE_LOCAL)
  } catch {
    try {
      THREE = await import(THREE_CDN)
    } catch {
      THREE = await import(THREE_CDN_FALLBACK)
    }
  }
  return THREE
}

function createProceduralEarthTexture(T) {
  const width = 1024
  const height = 512
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const ocean = ctx.createLinearGradient(0, 0, 0, height)
  ocean.addColorStop(0, '#061a2e')
  ocean.addColorStop(0.34, '#0a3154')
  ocean.addColorStop(0.5, '#0e426e')
  ocean.addColorStop(0.74, '#082844')
  ocean.addColorStop(1, '#061a2e')
  ctx.fillStyle = ocean
  ctx.fillRect(0, 0, width, height)

  const point = (x, y) => [x / 360 * width, (90 - y) / 180 * height]
  const poly = (coords, color = '#3a6b25') => {
    ctx.fillStyle = color
    ctx.beginPath()
    coords.forEach(([x, y], index) => {
      const [cx, cy] = point(x, y)
      if (index === 0) ctx.moveTo(cx, cy)
      else ctx.lineTo(cx, cy)
    })
    ctx.closePath()
    ctx.fill()
  }

  poly([[-170, 72], [-60, 72], [-55, 45], [-65, 25], [-85, 15], [-115, 20], [-130, 30], [-140, 55], [-165, 62]])
  poly([[-73, 76], [-20, 83], [-17, 76], [-30, 70], [-55, 68], [-66, 72]], '#d6f0ff')
  poly([[-82, 12], [-60, 12], [-35, 5], [-35, -25], [-55, -55], [-68, -55], [-75, -40], [-80, -10]])
  poly([[0, 72], [30, 72], [35, 60], [30, 45], [15, 38], [0, 38], [-10, 45], [-10, 60]])
  poly([[-18, 38], [52, 38], [52, 10], [45, -10], [35, -35], [20, -55], [10, -35], [0, 0], [-18, 15]])
  poly([[30, 72], [180, 72], [180, 40], [140, 20], [120, 10], [100, 5], [80, 12], [60, 20], [40, 38], [28, 60]])
  poly([[95, 25], [110, 10], [105, 0], [95, 5], [90, 15]])
  poly([[114, -22], [154, -22], [154, -39], [140, -38], [125, -33], [113, -28]])

  ctx.fillStyle = 'rgba(214, 238, 255, 0.62)'
  ctx.fillRect(0, height * 0.89, width, height * 0.11)
  ctx.fillRect(0, 0, width, height * 0.04)

  const texture = new T.CanvasTexture(canvas)
  if (T.SRGBColorSpace) texture.colorSpace = T.SRGBColorSpace
  return texture
}

function latLonToVec3(T, lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new T.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

export class MobileHotspotEarth {
  constructor(canvas) {
    this.canvas = canvas
    this.renderer = null
    this.scene = null
    this.camera = null
    this.earth = null
    this.clouds = null
    this.stars = null
    this.atmo = null
    this.atmo2 = null
    this.hotspots = null
    this.animFrame = null
    this.bound = {}
    this.isDragging = false
    this.prevPointer = { x: 0, y: 0 }
    this.rotX = 0.1
    this.rotY = 0
    this.velX = 0
    this.velY = 0.0008
    this.camDist = 3.25
    this.camDistMin = 2.35
    this.camDistMax = 4.5
    this.appearScale = 0
    this.appearing = true
    this.reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  }

  async init() {
    const T = await loadThree()
    this.scene = new T.Scene()

    const { width, height } = this.measure()
    this.camera = new T.PerspectiveCamera(45, width / height, 0.1, 100)
    this.camera.position.set(0, 0, this.camDist)

    this.renderer = new T.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.setSize(width, height, false)
    if (T.SRGBColorSpace) this.renderer.outputColorSpace = T.SRGBColorSpace
    if (T.ACESFilmicToneMapping) {
      this.renderer.toneMapping = T.ACESFilmicToneMapping
      this.renderer.toneMappingExposure = 1.15
    }

    const sun = new T.DirectionalLight(0xffffff, 2.35)
    sun.position.set(5, 2.2, 4.5)
    this.scene.add(sun)
    this.scene.add(new T.HemisphereLight(0xdcecff, 0x111827, 0.72))
    this.scene.add(new T.AmbientLight(0xffffff, 0.16))

    const loader = new T.TextureLoader()
    const load = (url) => new Promise((resolve) => loader.load(url, resolve, undefined, () => resolve(null)))
    const [earthTex, normalTex, specularTex, cloudTex] = await Promise.all([
      load(TEX.earth),
      load(TEX.normal),
      load(TEX.specular),
      load(TEX.clouds),
    ])

    ;[earthTex, cloudTex].forEach((texture) => {
      if (texture && T.SRGBColorSpace) texture.colorSpace = T.SRGBColorSpace
    })

    const earthGeometry = new T.SphereGeometry(1, 64, 64)
    const earthMaterial = new T.MeshPhongMaterial({
      map: earthTex || createProceduralEarthTexture(T),
      normalMap: normalTex || undefined,
      specularMap: specularTex || undefined,
      specular: new T.Color(0x1d3557),
      shininess: 30,
    })
    this.earth = new T.Mesh(earthGeometry, earthMaterial)
    this.scene.add(this.earth)

    if (cloudTex) {
      const cloudGeometry = new T.SphereGeometry(1.012, 48, 48)
      const cloudMaterial = new T.MeshPhongMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.74,
        depthWrite: false,
        emissive: new T.Color(0x555555),
      })
      this.clouds = new T.Mesh(cloudGeometry, cloudMaterial)
      this.scene.add(this.clouds)
    }

    const atmosphereGeometry = new T.SphereGeometry(1.055, 32, 32)
    const atmosphereMaterial = new T.MeshBasicMaterial({
      color: 0x69b7ff,
      transparent: true,
      opacity: 0.075,
      side: T.BackSide,
      depthWrite: false,
    })
    this.atmo = new T.Mesh(atmosphereGeometry, atmosphereMaterial)
    this.scene.add(this.atmo)

    const atmosphere2Geometry = new T.SphereGeometry(1.035, 32, 32)
    const atmosphere2Material = new T.MeshBasicMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.035,
      side: T.FrontSide,
      depthWrite: false,
    })
    this.atmo2 = new T.Mesh(atmosphere2Geometry, atmosphere2Material)
    this.scene.add(this.atmo2)

    this.buildStars(T)
    this.buildHotspots(T)
    this.prepareAppear()
    this.bindEvents()
    this.animate()
  }

  buildStars(T) {
    const verts = []
    for (let i = 0; i < 2000; i += 1) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 18 + Math.random() * 12
      verts.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      )
    }
    const geometry = new T.BufferGeometry()
    geometry.setAttribute('position', new T.Float32BufferAttribute(verts, 3))
    this.stars = new T.Points(geometry, new T.PointsMaterial({
      color: 0xffffff,
      size: 0.055,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1,
    }))
    this.scene.add(this.stars)
  }

  prepareAppear() {
    this.appearing = true
    this.appearScale = 0
    this.earth?.scale.setScalar(0)
    this.clouds?.scale.setScalar(0)
    this.atmo?.scale.setScalar(0)
    this.atmo2?.scale.setScalar(0)
    if (this.stars) this.stars.material.opacity = 0
  }

  buildHotspots(T) {
    const group = new T.Group()
    HOTSPOT_COORDS.forEach(({ lat, lon }) => {
      const pos = latLonToVec3(T, lat, lon, 1.025)
      const ring = new T.Mesh(
        new T.RingGeometry(0.016, 0.027, 16),
        new T.MeshBasicMaterial({ color: 0xff4d5c, transparent: true, opacity: 0.86, side: T.DoubleSide }),
      )
      ring.position.copy(pos)
      ring.lookAt(pos.clone().multiplyScalar(2))

      const dot = new T.Mesh(
        new T.CircleGeometry(0.009, 12),
        new T.MeshBasicMaterial({ color: 0xffa0a7, side: T.DoubleSide }),
      )
      dot.position.copy(pos)
      dot.lookAt(pos.clone().multiplyScalar(2))
      group.add(ring, dot)
    })
    this.hotspots = group
    this.earth.add(group)
  }

  bindEvents() {
    const onDown = (event) => {
      this.isDragging = true
      const pointer = event.touches ? event.touches[0] : event
      this.prevPointer = { x: pointer.clientX, y: pointer.clientY }
      this.velX = 0
      this.velY = 0
    }
    const onMove = (event) => {
      if (!this.isDragging) return
      event.preventDefault()
      const pointer = event.touches ? event.touches[0] : event
      const dx = pointer.clientX - this.prevPointer.x
      const dy = pointer.clientY - this.prevPointer.y
      this.velY = dx * 0.003
      this.velX = dy * 0.003
      this.rotY += this.velY
      this.rotX += this.velX
      this.rotX = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.rotX))
      this.prevPointer = { x: pointer.clientX, y: pointer.clientY }
    }
    const onUp = () => {
      this.isDragging = false
    }
    const onWheel = (event) => {
      event.preventDefault()
      this.camDist += event.deltaY * 0.002
      this.camDist = Math.max(this.camDistMin, Math.min(this.camDistMax, this.camDist))
    }
    this.canvas.addEventListener('mousedown', onDown)
    this.canvas.addEventListener('mousemove', onMove)
    this.canvas.addEventListener('mouseup', onUp)
    this.canvas.addEventListener('mouseleave', onUp)
    this.canvas.addEventListener('touchstart', onDown, { passive: true })
    this.canvas.addEventListener('touchmove', onMove, { passive: false })
    this.canvas.addEventListener('touchend', onUp)
    this.canvas.addEventListener('wheel', onWheel, { passive: false })
    this.bound = { onDown, onMove, onUp, onWheel }
  }

  animate() {
    this.animFrame = requestAnimationFrame(() => this.animate())
    if (this.appearing) {
      this.appearScale += (1 - this.appearScale) * 0.07
      const scale = this.appearScale
      this.earth?.scale.setScalar(scale)
      this.clouds?.scale.setScalar(scale)
      this.atmo?.scale.setScalar(scale)
      this.atmo2?.scale.setScalar(scale)
      if (this.stars) this.stars.material.opacity = Math.min(1, scale * 1.5)
      if (scale > 0.999) {
        this.appearing = false
        this.earth?.scale.setScalar(1)
        this.clouds?.scale.setScalar(1)
        this.atmo?.scale.setScalar(1)
        this.atmo2?.scale.setScalar(1)
        if (this.stars) this.stars.material.opacity = 1
      }
    }

    if (!this.reducedMotion && !this.isDragging) {
      this.velX *= 0.92
      this.velY *= 0.92
      this.rotX += this.velX
      this.rotY += this.velY + 0.0018
      this.rotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.rotX))
    }

    if (this.earth) {
      this.earth.rotation.x = this.rotX
      this.earth.rotation.y = this.rotY
    }
    if (this.clouds) {
      this.clouds.rotation.x = this.rotX
      this.clouds.rotation.y = this.rotY + performance.now() * 0.000008
    }
    const currentDistance = this.camera.position.length()
    const nextDistance = currentDistance + (this.camDist - currentDistance) * 0.1
    this.camera.position.setLength(nextDistance)

    this.checkResize()
    this.renderer.render(this.scene, this.camera)
  }

  measure() {
    return {
      width: this.canvas.clientWidth || 320,
      height: this.canvas.clientHeight || 320,
    }
  }

  checkResize() {
    const { width, height } = this.measure()
    const pixelRatio = this.renderer.getPixelRatio()
    if (this.canvas.width !== Math.round(width * pixelRatio) || this.canvas.height !== Math.round(height * pixelRatio)) {
      this.renderer.setSize(width, height, false)
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
    }
  }

  dispose() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame)
    const { onDown, onMove, onUp, onWheel } = this.bound
    if (onDown) this.canvas.removeEventListener('mousedown', onDown)
    if (onMove) this.canvas.removeEventListener('mousemove', onMove)
    if (onUp) this.canvas.removeEventListener('mouseup', onUp)
    if (onUp) this.canvas.removeEventListener('mouseleave', onUp)
    if (onDown) this.canvas.removeEventListener('touchstart', onDown)
    if (onMove) this.canvas.removeEventListener('touchmove', onMove)
    if (onUp) this.canvas.removeEventListener('touchend', onUp)
    if (onWheel) this.canvas.removeEventListener('wheel', onWheel)
    this.renderer?.dispose()
    this.renderer = null
  }
}
