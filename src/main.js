import './style.css';
import * as THREE from 'three';

/* =============================================
   SCENE SETUP
   ============================================= */
const canvas = document.querySelector('#bg');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510);
scene.fog = new THREE.FogExp2(0x050510, 0.012);

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
const ambient = new THREE.AmbientLight(0x1a1a40, 3);
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
  color: 0x08082a,
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

const palette = [
  new THREE.Color(0x00d4ff),
  new THREE.Color(0x7b2fff),
  new THREE.Color(0xff6b6b),
  new THREE.Color(0xffffff),
  new THREE.Color(0x88aaff),
  new THREE.Color(0xffcc44),
];

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

  const c = palette[Math.floor(Math.random() * palette.length)];
  colors[i3]     = c.r;
  colors[i3 + 1] = c.g;
  colors[i3 + 2] = c.b;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

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
  color: 0xffffff,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

/* =============================================
   FLOATING GEOMETRIES (a few abstract accents,
   kept sparse so the tech-stack orbit below reads clearly)
   ============================================= */
const geoTypes = [
  new THREE.IcosahedronGeometry(1.1, 1),
  new THREE.OctahedronGeometry(1.3),
  new THREE.TetrahedronGeometry(1.2),
];

const wireMats = [
  new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.5 }),
  new THREE.MeshBasicMaterial({ color: 0x7b2fff, wireframe: true, transparent: true, opacity: 0.5 }),
  new THREE.MeshBasicMaterial({ color: 0xff6b6b, wireframe: true, transparent: true, opacity: 0.5 }),
];

const floaters = [];

for (let i = 0; i < 8; i++) {
  const geo = geoTypes[Math.floor(Math.random() * geoTypes.length)];
  const mat = wireMats[Math.floor(Math.random() * wireMats.length)];
  const mesh = new THREE.Mesh(geo, mat);

  mesh.position.set(
    (Math.random() - 0.5) * 70,
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50
  );
  mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, 0);

  const s = Math.random() * 1.6 + 0.4;
  mesh.scale.setScalar(s);

  scene.add(mesh);
  floaters.push({ mesh, speed: Math.random() * 0.008 + 0.003, offset: Math.random() * Math.PI * 2 });
}

/* =============================================
   TECH-STACK ORBIT
   A constellation of glowing badges naming the
   real stack (PHP, Laravel, MySQL, WordPress, REST
   APIs, WooCommerce, Git, MVC) orbiting the central
   core, each wired to it by a thin data-flow line
   with a pulse of "traffic" travelling along it —
   a visual nod to backend/API development.
   ============================================= */
function makeBadgeSprite(text, colorHex) {
  const size = 320;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const hex = '#' + colorHex.toString(16).padStart(6, '0');

  const cx = size / 2;
  const cy = size / 2;

  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.5);
  glow.addColorStop(0, hex + '55');
  glow.addColorStop(1, hex + '00');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.33, 0, Math.PI * 2);
  ctx.lineWidth = 5;
  ctx.strokeStyle = hex;
  ctx.stroke();

  const fontSize = text.length <= 4 ? 62 : text.length <= 7 ? 44 : 34;
  ctx.font = `700 ${fontSize}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = hex;
  ctx.shadowBlur = 22;
  ctx.fillText(text, cx, cy + 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Sprite(material);
}

const TECH_BADGES = [
  { text: 'PHP',        color: 0x00d4ff },
  { text: 'Laravel',    color: 0xff6b6b },
  { text: 'MySQL',      color: 0x7b2fff },
  { text: 'WordPress',  color: 0x00d4ff },
  { text: 'REST API',   color: 0xff6b6b },
  { text: 'WooComm.',   color: 0x7b2fff },
  { text: 'MVC',        color: 0x00d4ff },
  { text: 'Git',        color: 0xff6b6b },
];

const techCore = new THREE.Vector3(0, 0, 0);
const orbitNodes = [];
const packetGeo = new THREE.SphereGeometry(0.22, 8, 8);

TECH_BADGES.forEach((badge, i) => {
  const sprite = makeBadgeSprite(badge.text, badge.color);
  const scale = 4.4;
  sprite.scale.set(scale, scale, 1);
  scene.add(sprite);

  const radius = 16 + (i % 3) * 6;
  const angle  = (i / TECH_BADGES.length) * Math.PI * 2;
  const height = ((i % 4) - 1.5) * 6;

  const lineGeo = new THREE.BufferGeometry().setFromPoints([techCore, techCore]);
  const lineMat = new THREE.LineBasicMaterial({
    color: badge.color,
    transparent: true,
    opacity: 0.22,
  });
  const line = new THREE.Line(lineGeo, lineMat);
  scene.add(line);

  const packetMat = new THREE.MeshBasicMaterial({ color: badge.color, transparent: true, opacity: 0.9 });
  const packet = new THREE.Mesh(packetGeo, packetMat);
  scene.add(packet);

  orbitNodes.push({
    sprite,
    line,
    packet,
    radius,
    angle,
    height,
    speed: 0.06 + (i % 3) * 0.015,
    packetOffset: Math.random() * Math.PI * 2,
    packetSpeed: 0.6 + Math.random() * 0.4,
  });
});

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

  /* Tech-stack orbit — badges circling the core, wired in with
     pulsing "data packets" to suggest live API traffic */
  orbitNodes.forEach((node) => {
    const a = node.angle + t * node.speed;
    const x = Math.cos(a) * node.radius;
    const z = Math.sin(a) * node.radius;
    const y = node.height + Math.sin(t * 0.5 + node.packetOffset) * 1.4;

    node.sprite.position.set(x, y, z);
    const pulse = 1 + Math.sin(t * 1.6 + node.packetOffset) * 0.08;
    node.sprite.scale.set(4.4 * pulse, 4.4 * pulse, 1);

    const dx = x - techCore.x, dy = y - techCore.y, dz = z - techCore.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
    const pullBack = 1.8 / dist;
    const endX = x - dx * pullBack;
    const endY = y - dy * pullBack;
    const endZ = z - dz * pullBack;

    const positions = node.line.geometry.attributes.position.array;
    positions[0] = techCore.x; positions[1] = techCore.y; positions[2] = techCore.z;
    positions[3] = endX;       positions[4] = endY;       positions[5] = endZ;
    node.line.geometry.attributes.position.needsUpdate = true;

    const pt = (Math.sin(t * node.packetSpeed + node.packetOffset) + 1) / 2;
    node.packet.position.set(techCore.x + (x - techCore.x) * pt, techCore.y + (y - techCore.y) * pt, techCore.z + (z - techCore.z) * pt);
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
  if (window.scrollY > 60) {
    navbar.style.background = 'rgba(5, 5, 16, 0.92)';
  } else {
    navbar.style.background = 'rgba(5, 5, 16, 0.6)';
  }
});
