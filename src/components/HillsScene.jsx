import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Misty hills of Nuwara Eliya drawn as glowing gold contour points, rippling like a sound wave.
const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform float uPixelRatio;
  varying float vH;
  varying float vFade;

  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
    m=m*m;m=m*m;vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);vec3 a0=x-ox;
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.0*dot(m,g);
  }

  void main(){
    vec3 p = position;
    float travel = uTime * 0.35 + uScroll * 6.0;
    vec2 q = vec2(p.x * 0.18, (p.z - travel) * 0.18);
    float h = snoise(q) * 1.6 + snoise(q * 2.3) * 0.5;
    // ridges rise toward the horizon, valley in the middle where the stage sits
    h *= smoothstep(0.0, 6.0, abs(p.x)) * 0.8 + 0.25;
    h += smoothstep(-2.0, -30.0, p.z) * 2.0;
    // sound wave rippling out from the stage
    float d = length(p.xz - vec2(0.0, 4.0));
    h += sin(d * 1.4 - uTime * 2.6) * 0.18 * exp(-d * 0.08);
    p.y = h;
    vH = h;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vFade = smoothstep(-40.0, -8.0, mv.z) * smoothstep(1.0, -3.0, mv.z);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (2.2 + h * 0.6) * uPixelRatio * (8.0 / -mv.z);
  }
`

const fragment = /* glsl */ `
  uniform vec3 uGold;
  uniform vec3 uDeep;
  varying float vH;
  varying float vFade;
  void main(){
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    vec3 col = mix(uDeep, uGold, smoothstep(-0.6, 2.4, vH));
    gl_FragColor = vec4(col, (1.0 - d * 2.0) * vFade * 0.95);
  }
`

function Terrain({ progress }) {
  const mat = useRef(null)
  const group = useRef(null)

  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(60, 50, 220, 180)
    g.rotateX(-Math.PI / 2)
    g.translate(0, 0, -16)
    return g
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uGold: { value: new THREE.Color('#d3ba59') },
      uDeep: { value: new THREE.Color('#5a3a12') },
    }),
    [],
  )

  useFrame((state, dt) => {
    if (!mat.current) return
    const u = mat.current.uniforms
    u.uTime.value += dt
    u.uScroll.value += ((progress.current ?? 0) - u.uScroll.value) * 0.06
    group.current.rotation.y += (state.pointer.x * 0.12 - group.current.rotation.y) * 0.03
    state.camera.position.y += (2.4 + state.pointer.y * 0.6 - state.camera.position.y) * 0.03
    state.camera.lookAt(0, 0.6, -10)
  })

  return (
    <group ref={group}>
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
    </group>
  )
}

export default function HillsScene({ progress, active = true }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 2.4, 6], fov: 60 }}
      gl={{ alpha: true, antialias: true }}
      eventSource={typeof document !== 'undefined' ? document.body : undefined}
      eventPrefix="client"
    >
      <Terrain progress={progress} />
    </Canvas>
  )
}
