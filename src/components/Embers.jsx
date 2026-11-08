import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useInView from '../hooks/useInView'

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  attribute float aScale;
  attribute float aSpeed;
  attribute float aSeed;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float life = fract(aSeed + uTime * aSpeed * 0.06);
    p.y = mix(-4.5, 5.5, life);
    // drift like rising embers caught in a mountain breeze
    p.x += sin(uTime * 0.6 + aSeed * 40.0) * 0.35 * life + life * 0.8;
    p.z += cos(uTime * 0.5 + aSeed * 30.0) * 0.3;
    p.xy += uMouse * (0.25 + p.z * 0.08);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * 70.0 * uPixelRatio / -mv.z;

    float flicker = 0.65 + 0.35 * sin(uTime * (3.0 + aSeed * 6.0) + aSeed * 100.0);
    vAlpha = smoothstep(0.0, 0.12, life) * (1.0 - smoothstep(0.65, 1.0, life)) * flicker;
  }
`

const fragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = 0.05 / d - 0.1;
    float core = smoothstep(0.5, 0.0, d);
    float a = clamp(glow, 0.0, 1.0) * core * vAlpha;
    vec3 col = mix(uColor, vec3(1.0, 0.95, 0.8), core * core * 0.6);
    gl_FragColor = vec4(col, a);
  }
`

function Particles({ count }) {
  const mat = useRef(null)
  const mouse = useRef(new THREE.Vector2())

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const scale = new Float32Array(count)
    const speed = new Float32Array(count)
    const seed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // embers cluster around the centre (the campfire) and fan outward
      const spread = Math.pow(Math.random(), 1.6)
      pos[i * 3] = (Math.random() - 0.5) * 14 * spread
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
      scale[i] = 0.4 + Math.random() * 1.4
      speed[i] = 0.5 + Math.random() * 1.2
      seed[i] = Math.random()
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
    g.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    return g
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uMouse: { value: new THREE.Vector2() },
      uColor: { value: new THREE.Color('#e8b04a') },
    }),
    [],
  )

  useFrame((state, dt) => {
    if (!mat.current) return
    mat.current.uniforms.uTime.value += dt
    mouse.current.lerp(state.pointer, 0.04)
    mat.current.uniforms.uMouse.value.copy(mouse.current)
  })

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function Embers({ count = 380, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  return (
    <div className={`embers ${className}`} ref={ref} aria-hidden>
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        eventPrefix="client"
      >
        <Particles count={count} />
      </Canvas>
    </div>
  )
}
