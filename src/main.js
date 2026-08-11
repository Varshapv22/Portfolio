import './style.css';
import * as THREE from 'three';
import { getTheme, initThemeToggle } from './theme.js';

/* =============================================
   THEME PALETTES
   ============================================= */
const SCENE_THEME = {
  dark:  { bg: 0x050510, ambient: 0x1a1a40, ambientIntensity: 3, knot: 0x08082a, star: 0xffffff, starOpacity: 0.6, particleFill: 0xffffff },
  light: { bg: 0xeef1f8, ambient: 0xffffff, ambientIntensity: 2.2, knot: 0xc7ced8, star: 0x27314f, starOpacity: 0.35, particleFill: 0x334155 },
};

/* =============================================
   SCENE SETUP
   ============================================= */
const canvas = document.querySelector('#bg');

const scene = new THREE.Scene();
scene.background = new THREE.Color(SCENE_THEME[getTheme()].bg);
scene.fog = new THREE.FogExp2(SCENE_THEME[getTheme()].bg, 0.012);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 32);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

/* =============================================
   LIGHTING
   ============================================= */
const ambient = new THREE.AmbientLight(SCENE_THEME[getTheme()].ambient, SCENE_THEME[getTheme()].ambientIntensity);
scene.add(ambient);

const light1 = new THREE.PointLight(0x00d4ff, 80, 120);
light1.position.set(25, 25, 25);
scene.add(light1);

const light2 = new THREE.PointLight(0x7b2fff, 80, 120);
light2.position.set(-25, -20, 20);
scene.add(light2);

const light3 = new THREE.PointLight(0xff6b6b, 40, 80);
light3.position.set(0, -30, -20);
scene.add(light3);

/* =============================================
   CENTRAL TORUS KNOT
   ============================================= */
const knotGeo = new THREE.TorusKnotGeometry(7, 2.2, 220, 32, 2, 3);

const knotMat = new THREE.MeshPhongMaterial({
  color: SCENE_THEME[getTheme()].knot,
  emissive: 0x00d4ff,
  emissiveIntensity: 0.18,
  shininess: 120,
  transparent: true,
  opacity: 0.85,
});
const knotMesh = new THREE.Mesh(knotGeo, knotMat);
scene.add(knotMesh);

const wireMat = new THREE.MeshBasicMaterial({
  color: 0x00d4ff,
  wireframe: true,
  transparent: true,
  opacity: 0.12,
});
const wireMesh = new THREE.Mesh(knotGeo, wireMat);
scene.add(wireMesh);

/* =============================================
   GALAXY PARTICLE SYSTEM
   ============================================= */
const PARTICLE_COUNT = 9000;
const particleGeo = new THREE.BufferGeometry();
const positions  = new Float32Array(PARTICLE_COUNT * 3);
const colors     = new Float32Array(PARTICLE_COUNT * 3);
const paletteIdx = new Uint8Array(PARTICLE_COUNT);

const PALETTE_BASE = [0x00d4ff, 0x7b2fff, 0xff6b6b, null, 0x88aaff, 0xffcc44];
const paletteFor = (theme) =>
  PALETTE_BASE.map((hex) => new THREE.Color(hex === null ? SCENE_THEME[theme].particleFill : hex));

const ARMS = 3;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const i3 = i * 3;
  const radius    = Math.random() * 90 + 8;
  const spin      = radius * 0.55;
  const branch    = (i % ARMS) * ((Math.PI * 2) / ARMS);
  const scatter   = Math.pow(Math.random(), 3);
  const sign      = Math.random() < 0.5 ? 1 : -1;

  positions[i3]     = Math.cos(branch + spin) * radius + scatter * sign * 6;
  positions[i3 + 1] = scatter * sign * 5;
  positions[i3 + 2] = Math.sin(branch + spin) * radius + scatter * sign * 6;

  paletteIdx[i] = Math.floor(Math.random() * PALETTE_BASE.length);
}

function applyGalaxyPalette(theme) {
  const palette = paletteFor(theme);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const c = palette[paletteIdx[i]];
    colors[i3]     = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }
  particleGeo.attributes.color.needsUpdate = true;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
applyGalaxyPalette(getTheme());

const particleMat = new THREE.PointsMaterial({
  size: 0.28,
  sizeAttenuation: true,
  vertexColors: true,
  transparent: true,
  opacity: 0.85,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const galaxy = new THREE.Points(particleGeo, particleMat);
scene.add(galaxy);

/* =============================================
   STAR FIELD (background depth)
   ============================================= */
const starGeo = new THREE.BufferGeometry();
const starPositions = new Float32Array(6000 * 3);

for (let i = 0; i < 6000 * 3; i++) {
  starPositions[i] = (Math.random() - 0.5) * 500;
}

starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

const starMat = new THREE.PointsMaterial({
  size: 0.18,
  color: SCENE_THEME[getTheme()].star,
  transparent: true,
  opacity: SCENE_THEME[getTheme()].starOpacity,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

/* =============================================
   FLOATING GEOMETRIES
   ============================================= */
const geoTypes = [
  new THREE.IcosahedronGeometry(1.1, 1),
  new THREE.OctahedronGeometry(1.3),
  new THREE.TetrahedronGeometry(1.2),
  new THREE.DodecahedronGeometry(0.9),
];

const wireMats = [
  new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.65 }),
  new THREE.MeshBasicMaterial({ color: 0x7b2fff, wireframe: true, transparent: true, opacity: 0.65 }),
  new THREE.MeshBasicMaterial({ color: 0xff6b6b, wireframe: true, transparent: true, opacity: 0.65 }),
  new THREE.MeshBasicMaterial({ color: 0x88aaff, wireframe: true, transparent: true, opacity: 0.65 }),
];

const floaters = [];

for (let i = 0; i < 18; i++) {
  const geo = geoTypes[Math.floor(Math.random() * geoTypes.length)];
  const mat = wireMats[Math.floor(Math.random() * wireMats.length)];
  const mesh = new THREE.Mesh(geo, mat);

  mesh.position.set(
    (Math.random() - 0.5) * 70,
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50
  );
  mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, 0);

  const s = Math.random() * 2 + 0.4;
  mesh.scale.setScalar(s);

  scene.add(mesh);
  floaters.push({ mesh, speed: Math.random() * 0.008 + 0.003, offset: Math.random() * Math.PI * 2 });
}

/* =============================================
   MOUSE TRACKING
   ============================================= */
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
  mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
});

/* =============================================
   SCROLL PARALLAX
   ============================================= */
let scrollY = 0;
window.addEventListener('scroll', () => { scrollY = window.scrollY; });

/* =============================================
   RESIZE HANDLER
   ============================================= */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/* =============================================
   ANIMATION LOOP
   ============================================= */
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  /* Central object */
  knotMesh.rotation.x = t * 0.18;
  knotMesh.rotation.y = t * 0.14;
  wireMesh.rotation.x = t * 0.18;
  wireMesh.rotation.y = t * 0.14;

  /* Breathing scale */
  const breathe = 1 + Math.sin(t * 0.6) * 0.04;
  knotMesh.scale.setScalar(breathe);
  wireMesh.scale.setScalar(breathe);

  /* Galaxy slow spin */
  galaxy.rotation.y = t * 0.04;
  galaxy.rotation.x = Math.sin(t * 0.05) * 0.06;

  /* Floating objects */
  floaters.forEach(({ mesh, speed, offset }) => {
    mesh.rotation.x += speed;
    mesh.rotation.y += speed * 1.4;
    mesh.position.y += Math.sin(t + offset) * 0.008;
  });

  /* Orbiting lights */
  light1.position.x = Math.sin(t * 0.35) * 35;
  light1.position.z = Math.cos(t * 0.35) * 35;
  light2.position.x = Math.sin(t * 0.35 + Math.PI) * 35;
  light2.position.z = Math.cos(t * 0.35 + Math.PI) * 35;
  light3.position.y = Math.sin(t * 0.2) * 30;

  /* Mouse parallax — smooth lerp */
  const targetX = mouseX * 4;
  const targetY = mouseY * 4;
  camera.position.x += (targetX - camera.position.x) * 0.04;
  camera.position.y += (targetY - camera.position.y) * 0.04;

  /* Scroll parallax */
  camera.position.z = 32 - scrollY * 0.04;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();

/* =============================================
   INTERSECTION OBSERVER (scroll reveal)
   ============================================= */
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

/* =============================================
   ANIMATED COUNTERS
   ============================================= */
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-number').forEach((el) => counterObserver.observe(el));

/* =============================================
   MOBILE MENU TOGGLE
   ============================================= */
const menuToggle  = document.getElementById('menuToggle');
const mobileMenu  = document.getElementById('mobileMenu');

menuToggle?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach((link) => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* =============================================
   NAVBAR SCROLL STYLE
   ============================================= */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* =============================================
   THEME TOGGLE
   ============================================= */
initThemeToggle();

function applySceneTheme(theme) {
  const cfg = SCENE_THEME[theme];
  scene.background.set(cfg.bg);
  scene.fog.color.set(cfg.bg);
  ambient.color.set(cfg.ambient);
  ambient.intensity = cfg.ambientIntensity;
  knotMat.color.set(cfg.knot);
  starMat.color.set(cfg.star);
  starMat.opacity = cfg.starOpacity;
  applyGalaxyPalette(theme);
}

window.addEventListener('themechange', (e) => applySceneTheme(e.detail.theme));
